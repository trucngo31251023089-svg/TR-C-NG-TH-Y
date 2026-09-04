import React, { useState, useRef, useEffect } from 'react';
import { ScreenId, MemoryPost } from '../types';
import { CALENDAR_MONTHS, MEMORY_POSTS } from '../data/mockData';
import confetti from 'canvas-confetti';
import { 
  formatAudioTime, 
  createSyntheticAudioBlob, 
  playSpatialChimeSound, 
  playSpeakerTestSound,
  playAudioBlobToSpeaker,
  AudioPlayerController,
  ensureAudioContext,
  getAudioContext 
} from '../utils/audioUtils';

interface CollaborativePortalScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const CollaborativePortalScreen: React.FC<CollaborativePortalScreenProps> = ({ onNavigate }) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(5); // Month 5 by default
  const [activeMediaTab, setActiveMediaTab] = useState<'audio' | 'video' | 'handwriting'>('audio');
  
  // Real Audio recording state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordedDuration, setRecordedDuration] = useState<number>(0);
  const [micError, setMicError] = useState<string | null>(null);
  const [audioWaveLevels, setAudioWaveLevels] = useState<number[]>(new Array(25).fill(20));

  // Audio preview playback state
  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(false);
  const [previewTime, setPreviewTime] = useState<number>(0);
  const [previewDuration, setPreviewDuration] = useState<number>(0);
  const [speakerVolume, setSpeakerVolume] = useState<number>(1.25); // 125% boost for clear voice
  const [isTestingSpeaker, setIsTestingSpeaker] = useState<boolean>(false);
  const [micInputLevel, setMicInputLevel] = useState<number>(0);

  // Audio playback state for posts feed
  const [activePlayingPostId, setActivePlayingPostId] = useState<string | null>(null);

  // Audio refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const stopChimeRef = useRef<(() => void) | null>(null);
  const speakerControllerRef = useRef<AudioPlayerController | null>(null);
  const postSpeakerControllerRef = useRef<AudioPlayerController | null>(null);

  // Video state
  const [uploadedVideoName, setUploadedVideoName] = useState<string | null>(null);

  // Text / Message state
  const [authorName, setAuthorName] = useState<string>('');
  const [authorRole, setAuthorRole] = useState<string>('');
  const [messageText, setMessageText] = useState<string>('');
  
  // Drawing Canvas for handwriting / signature
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  // Submissions list
  const [posts, setPosts] = useState<MemoryPost[]>(MEMORY_POSTS);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  // Timer for voice recording
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (audioBlobUrl) {
        URL.revokeObjectURL(audioBlobUrl);
      }
      if (stopChimeRef.current) {
        stopChimeRef.current();
      }
      if (speakerControllerRef.current) {
        speakerControllerRef.current.stop();
      }
      if (postSpeakerControllerRef.current) {
        postSpeakerControllerRef.current.stop();
      }
    };
  }, []);

  // Dedicated test speaker button to verify sound is working on device
  const handleTestSpeaker = async () => {
    if (isTestingSpeaker) {
      if (stopChimeRef.current) {
        stopChimeRef.current();
        stopChimeRef.current = null;
      }
      setIsTestingSpeaker(false);
      return;
    }

    // Stop any existing preview playback first
    if (speakerControllerRef.current) {
      speakerControllerRef.current.stop();
      speakerControllerRef.current = null;
      setIsPlayingPreview(false);
    }

    setIsTestingSpeaker(true);
    const stopFn = await playSpeakerTestSound(() => {
      setIsTestingSpeaker(false);
      stopChimeRef.current = null;
    });
    stopChimeRef.current = stopFn;
  };

  // Start real recording via browser microphone
  const startRecording = async () => {
    setMicError(null);
    if (audioBlobUrl) {
      URL.revokeObjectURL(audioBlobUrl);
      setAudioBlobUrl(null);
      setAudioBlob(null);
    }
    if (speakerControllerRef.current) {
      speakerControllerRef.current.stop();
      speakerControllerRef.current = null;
    }
    setIsPlayingPreview(false);
    audioChunksRef.current = [];
    setMicInputLevel(0);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Trình duyệt chưa hỗ trợ truy cập Microphone.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      audioStreamRef.current = stream;

      // Web Audio API for responsive live waveform and real-time VU level
      try {
        const audioCtx = await ensureAudioContext();
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);
        analyserRef.current = analyser;

        const updateWaveform = () => {
          if (!analyserRef.current) return;
          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(dataArray);

          let sum = 0;
          const bars: number[] = [];
          const step = Math.max(1, Math.floor(dataArray.length / 25));
          for (let i = 0; i < 25; i++) {
            const rawVal = dataArray[i * step] || 0;
            sum += rawVal;
            const norm = Math.min(100, Math.max(15, Math.round((rawVal / 255) * 100)));
            bars.push(norm);
          }

          // Calculate average mic level for VU meter
          const avgLevel = Math.round((sum / (dataArray.length || 1) / 255) * 100);
          setMicInputLevel(avgLevel);
          setAudioWaveLevels(bars);
          animFrameRef.current = requestAnimationFrame(updateWaveform);
        };
        updateWaveform();
      } catch (err) {
        console.warn('Analyser setup fallback:', err);
      }

      // Check supported MIME type
      let mimeType = 'audio/webm;codecs=opus';
      if (typeof MediaRecorder !== 'undefined') {
        if (!MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          if (MediaRecorder.isTypeSupported('audio/webm')) {
            mimeType = 'audio/webm';
          } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
            mimeType = 'audio/mp4';
          } else {
            mimeType = '';
          }
        }
      }

      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        // Safe track closure only after recorder finishes outputting chunks
        if (audioStreamRef.current) {
          audioStreamRef.current.getTracks().forEach((track) => track.stop());
          audioStreamRef.current = null;
        }

        const finalType = recorder.mimeType || 'audio/webm';
        const blob = new Blob(audioChunksRef.current, { type: finalType });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioBlobUrl(url);
        setIsRecording(false);
      };

      recorder.start(200);
      setIsRecording(true);
      setRecordingSeconds(0);
    } catch (err: any) {
      console.warn('Microphone recording error:', err);
      let msg = 'Không thể kết nối Microphone trên thiết bị.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        msg = 'Quyền truy cập Microphone đã bị chặn hoặc chưa được cấp. Bạn có thể cho phép lại trên trình duyệt, hoặc bấm "Dùng Bản Thu Mẫu" để trải nghiệm ngay.';
      } else if (err.name === 'NotFoundError') {
        msg = 'Không tìm thấy microphone trên thiết bị. Bạn có thể bấm "Dùng Bản Thu Mẫu" để tiếp tục.';
      }
      setMicError(msg);
      setIsRecording(false);
    }
  };

  // Stop recording safely
  const stopRecording = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.requestData();
      } catch (e) {}
      mediaRecorderRef.current.stop();
    } else {
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((track) => track.stop());
        audioStreamRef.current = null;
      }
    }
    setRecordedDuration(recordingSeconds || 1);
    setIsRecording(false);
  };

  // Generate synthetic sample audio so user can always hear audio even without mic
  const handleUseDemoAudio = () => {
    if (audioBlobUrl) {
      URL.revokeObjectURL(audioBlobUrl);
    }
    if (speakerControllerRef.current) {
      speakerControllerRef.current.stop();
      speakerControllerRef.current = null;
    }
    const blob = createSyntheticAudioBlob(4);
    const url = URL.createObjectURL(blob);
    setAudioBlob(blob);
    setAudioBlobUrl(url);
    setRecordedDuration(4);
    setRecordingSeconds(4);
    setMicError(null);
  };

  // Adjust volume multiplier
  const handleVolumeChange = (newVol: number) => {
    setSpeakerVolume(newVol);
    if (speakerControllerRef.current) {
      speakerControllerRef.current.setVolume(newVol);
    }
  };

  // Toggle preview play/pause directly to device speakers
  const togglePlayPreview = async () => {
    if (isPlayingPreview) {
      if (speakerControllerRef.current) {
        speakerControllerRef.current.stop();
        speakerControllerRef.current = null;
      }
      setIsPlayingPreview(false);
      return;
    }

    if (!audioBlob && !audioBlobUrl) return;

    let targetBlob = audioBlob;
    if (!targetBlob && audioBlobUrl) {
      try {
        const res = await fetch(audioBlobUrl);
        targetBlob = await res.blob();
        setAudioBlob(targetBlob);
      } catch (e) {
        targetBlob = createSyntheticAudioBlob(4);
      }
    }

    if (!targetBlob) return;

    setIsPlayingPreview(true);
    try {
      speakerControllerRef.current = await playAudioBlobToSpeaker(
        targetBlob,
        speakerVolume,
        (curr, dur) => {
          setPreviewTime(curr);
          if (dur && !isNaN(dur) && dur > 0) {
            setPreviewDuration(dur);
          }
        },
        () => {
          setIsPlayingPreview(false);
          setPreviewTime(0);
          speakerControllerRef.current = null;
        }
      );
    } catch (err) {
      console.warn('Playback error:', err);
      setIsPlayingPreview(false);
    }
  };

  const handleResetRecording = () => {
    if (speakerControllerRef.current) {
      speakerControllerRef.current.stop();
      speakerControllerRef.current = null;
    }
    if (audioBlobUrl) {
      URL.revokeObjectURL(audioBlobUrl);
    }
    setAudioBlobUrl(null);
    setAudioBlob(null);
    setIsPlayingPreview(false);
    setPreviewTime(0);
    setRecordedDuration(0);
    setRecordingSeconds(0);
    setMicError(null);
    setMicInputLevel(0);
  };

  // Toggle playing post audio in wishes feed
  const handleTogglePlayPost = async (post: MemoryPost) => {
    if (activePlayingPostId === post.id) {
      if (postSpeakerControllerRef.current) {
        postSpeakerControllerRef.current.stop();
        postSpeakerControllerRef.current = null;
      }
      if (stopChimeRef.current) {
        stopChimeRef.current();
        stopChimeRef.current = null;
      }
      setActivePlayingPostId(null);
      return;
    }

    if (postSpeakerControllerRef.current) {
      postSpeakerControllerRef.current.stop();
      postSpeakerControllerRef.current = null;
    }
    if (stopChimeRef.current) {
      stopChimeRef.current();
      stopChimeRef.current = null;
    }

    setActivePlayingPostId(post.id);

    if (post.audioUrl) {
      try {
        const res = await fetch(post.audioUrl);
        const blob = await res.blob();
        postSpeakerControllerRef.current = await playAudioBlobToSpeaker(
          blob,
          speakerVolume,
          undefined,
          () => {
            setActivePlayingPostId(null);
            postSpeakerControllerRef.current = null;
          }
        );
      } catch (e) {
        stopChimeRef.current = playSpatialChimeSound(() => {
          setActivePlayingPostId(null);
        });
      }
    } else {
      stopChimeRef.current = playSpatialChimeSound(() => {
        setActivePlayingPostId(null);
      });
    }
  };

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = '#d6cebe';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // AI Scribe assistant suggestions
  const applyAiSuggestion = (suggestion: string) => {
    setMessageText(suggestion);
  };

  const handleSubmitWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !messageText.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const durSecs = recordedDuration || recordingSeconds || 4;
      const formattedDur = formatAudioTime(durSecs);

      const newPost: MemoryPost = {
        id: `post-${Date.now()}`,
        author: authorName,
        role: authorRole || 'Thành viên gia đình & Bằng hữu',
        month: selectedMonth,
        monthTitle: `THÁNG ${selectedMonth.toString().padStart(2, '0')}`,
        avatar: 'https://lh3.googleusercontent.com/aida/AEtjO1XIaJ7YWEYvnDtL6BfZAydnHZ_7LAw2yP6rdwJh3fLwG8hFmtYV80rOZa2LPN42TwX4ioBeRvp3ok9xMZ92-yMXgKlf-d_c1atQl6lXTvAe4hXtJTBYY3CYzdzoz8LpS_vPby8BhvLexRQFfXjgu-IBk0wDPqN1oHdqFhPouW1cMnWg2il1YT5OYcA2_o9fSulcn7Sc3ujRuZ6qOsmtqnDyKIqEa1njqW5O23ar7X4hzKiUGVOTgf4F8fw',
        quote: `“${messageText}”`,
        mediaType: activeMediaTab === 'handwriting' ? 'text' : activeMediaTab,
        mediaMeta: activeMediaTab === 'audio' ? `${formattedDur} Audio FLAC` : activeMediaTab === 'video' ? 'Video 4K HDR' : 'Bút Tích Mực Kỹ Thuật Số',
        timestamp: 'Vừa xong',
        e2eeVerified: true,
        audioUrl: activeMediaTab === 'audio' ? audioBlobUrl || undefined : undefined,
        audioDuration: activeMediaTab === 'audio' ? formattedDur : undefined
      };

      setPosts([newPost, ...posts]);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setMessageText('');
      setAuthorName('');
      setAuthorRole('');
      setUploadedVideoName(null);
      clearCanvas();

      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#bbcac1', '#f3ead9', '#d6cebe']
      });

      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 900);
  };

  return (
    <div className="w-full min-h-screen pt-24 pb-20">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 space-y-12">
        {/* Header Hero */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-surface-container-high border border-outline-variant/30">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <span className="font-label-sm text-[11px] tracking-[0.24em] text-secondary uppercase font-mono">
              COLLECTIVE WISHING PORTAL • ATELIER ARCHIVE
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl text-primary font-normal leading-tight">
            Hộp Ký Ức Đồng Sáng Tạo
          </h1>

          <p className="font-body-lg text-sm sm:text-base text-on-surface-variant leading-relaxed">
            Đóng góp lời chúc, đoạn ghi âm giọng nói ấm áp và thước phim 4K được mã hóa bí mật dành tặng Chủ Nhân Niên Lịch 2025. Mọi nội dung sẽ được gói gọn vào ấn phẩm vật lý và giải mã qua WebAR.
          </p>
        </div>

        {/* Collective Stats Progress Bar */}
        <div className="bg-surface-container rounded-2xl p-6 border border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-secondary">TIẾN ĐỘ THU THẬP</span>
              <span className="text-primary font-semibold">38 / 50 LỜI CHÚC (76%)</span>
            </div>
            <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
              <div className="bg-secondary h-full w-[76%]"></div>
            </div>
            <span className="text-[11px] text-on-surface-variant">Còn 12 vị trí kỷ niệm đang chờ gửi</span>
          </div>

          <div className="space-y-1 border-l-0 md:border-l border-white/10 md:pl-6">
            <span className="text-[11px] font-mono text-secondary uppercase">PHỦ KÍN NIÊN LỊCH</span>
            <div className="font-serif text-lg text-primary">12/12 Tháng Đã Có Kỷ Niệm</div>
            <span className="text-[11px] text-on-surface-variant">Trọn vẹn 365 ngày yêu thương</span>
          </div>

          <div className="space-y-1 border-l-0 md:border-l border-white/10 md:pl-6">
            <span className="text-[11px] font-mono text-secondary uppercase">BẢO MẬT KỶ NIỆM</span>
            <div className="font-serif text-lg text-primary flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary text-base">verified</span>
              <span>E2EE Zero-Knowledge</span>
            </div>
            <span className="text-[11px] text-on-surface-variant">Chỉ người nhận mới giải mã được</span>
          </div>
        </div>

        {/* Step 1: Month Selector */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary-container text-on-primary-container text-xs font-mono font-bold flex items-center justify-center">
                1
              </span>
              <h2 className="font-serif text-xl text-primary">Chọn Tháng Bạn Muốn Gửi Gắm Kỷ Niệm</h2>
            </div>
            <span className="text-xs font-mono text-secondary">Tháng {selectedMonth} đang được chọn</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {CALENDAR_MONTHS.map((m) => (
              <button
                key={m.monthNumber}
                type="button"
                onClick={() => setSelectedMonth(m.monthNumber)}
                className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden ${
                  selectedMonth === m.monthNumber
                    ? 'bg-primary-container/20 border-secondary ring-1 ring-secondary'
                    : 'bg-surface-container hover:bg-surface-container-high border-white/10'
                }`}
              >
                <div className="aspect-[4/3] rounded-lg overflow-hidden mb-2 bg-black/40">
                  <img src={m.image} alt={m.title} className="w-full h-full object-cover" />
                </div>
                <div className="font-serif text-sm text-primary font-medium">{m.title}</div>
                <div className="text-[10px] text-on-surface-variant truncate font-sans">{m.theme}</div>
                {selectedMonth === m.monthNumber && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-secondary"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Multimodal Contribution Studio */}
        <div className="bg-surface-container rounded-2xl p-6 sm:p-8 border border-white/10 space-y-8">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary-container text-on-primary-container text-xs font-mono font-bold flex items-center justify-center">
              2
            </span>
            <h2 className="font-serif text-xl text-primary">Hộp Nhập Liệu Đa Phương Thức (Multimodal Studio)</h2>
          </div>

          {/* Media Format Selector Tabs */}
          <div className="flex border-b border-white/10 gap-2">
            <button
              type="button"
              onClick={() => setActiveMediaTab('audio')}
              className={`pb-3 px-4 text-xs uppercase font-mono tracking-wider transition-colors border-b-2 flex items-center gap-1.5 ${
                activeMediaTab === 'audio'
                  ? 'border-secondary text-primary font-semibold'
                  : 'border-transparent text-on-surface-variant hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-sm">mic</span>
              <span>Ghi Âm Giọng Nói (FLAC)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMediaTab('video')}
              className={`pb-3 px-4 text-xs uppercase font-mono tracking-wider transition-colors border-b-2 flex items-center gap-1.5 ${
                activeMediaTab === 'video'
                  ? 'border-secondary text-primary font-semibold'
                  : 'border-transparent text-on-surface-variant hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-sm">movie</span>
              <span>Thước Phim 4K HDR</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMediaTab('handwriting')}
              className={`pb-3 px-4 text-xs uppercase font-mono tracking-wider transition-colors border-b-2 flex items-center gap-1.5 ${
                activeMediaTab === 'handwriting'
                  ? 'border-secondary text-primary font-semibold'
                  : 'border-transparent text-on-surface-variant hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-sm">draw</span>
              <span>Bút Tích & Chữ Ký Tay</span>
            </button>
          </div>

          <form onSubmit={handleSubmitWish} className="space-y-6">
            {/* Author details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-on-surface-variant mb-1.5 uppercase">
                  TÊN CỦA BẠN *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Hoàng Mai Anh, Bác Hai..."
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-surface-container-lowest border border-white/10 text-on-surface focus:outline-none focus:border-secondary text-sm font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-on-surface-variant mb-1.5 uppercase">
                  VAI TRÒ / MỐI QUAN HỆ
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Con gái út, Bạn tri kỷ 30 năm..."
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-surface-container-lowest border border-white/10 text-on-surface focus:outline-none focus:border-secondary text-sm font-sans"
                />
              </div>
            </div>

            {/* Tab 1: Audio Studio */}
            {activeMediaTab === 'audio' && (
              <div className="bg-surface-container-lowest p-6 rounded-xl border border-white/10 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-serif text-primary text-base flex items-center gap-2">
                      <span>Phòng Thu Âm Thanh Không Gian (FLAC / Web Audio)</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-secondary-container/50 text-secondary">
                        E2EE Bảo Mật
                      </span>
                    </h3>
                    <p className="text-xs text-on-surface-variant">
                      Ghi lại giọng nói chân thật của bạn. Bản thu sẽ được phát trực tiếp qua loa ngoài hoặc tai nghe với bộ khuếch đại âm lượng tích hợp.
                    </p>
                  </div>
                  <div className="font-mono text-xs text-secondary flex items-center gap-1.5 self-start sm:self-auto">
                    {isRecording ? (
                      <span className="flex items-center gap-1.5 text-rose-400 font-bold animate-pulse">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                        {formatAudioTime(recordingSeconds)} Đang Ghi Âm...
                      </span>
                    ) : audioBlobUrl ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        Đã Ghi Âm Xong ({formatAudioTime(previewDuration || recordedDuration || recordingSeconds)})
                      </span>
                    ) : (
                      <span className="text-on-surface-variant">Sẵn Sàng Ghi Âm</span>
                    )}
                  </div>
                </div>

                {/* Speaker Diagnostic & Test Bar */}
                <div className="bg-secondary-container/20 border border-secondary/30 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className={`material-symbols-outlined text-xl ${isTestingSpeaker ? 'text-secondary animate-bounce' : 'text-primary'}`}>
                      {isTestingSpeaker ? 'volume_up' : 'speaker'}
                    </span>
                    <div>
                      <div className="text-xs font-mono text-primary font-bold flex items-center gap-1.5">
                        <span>Kiểm Tra Âm Lượng Loa Thiết Bị</span>
                        {isTestingSpeaker && (
                          <span className="px-1.5 py-0.2 rounded bg-secondary text-on-secondary text-[9px]">Đang Phát</span>
                        )}
                      </div>
                      <div className="text-[11px] text-on-surface-variant">
                        Bấm nút bên cạnh để phát tiếng chuông thử nghiệm qua loa máy tính/điện thoại ngay tức thì.
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleTestSpeaker}
                    className={`px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 ${
                      isTestingSpeaker 
                        ? 'bg-secondary text-on-secondary shadow-[0_0_14px_rgba(187,202,193,0.8)] scale-105 animate-pulse font-bold' 
                        : 'bg-surface-container-high hover:bg-surface-bright text-primary border border-white/10 hover:border-secondary/50'
                    }`}
                    title="Phát tiếng chuông thử loa"
                  >
                    <span className="material-symbols-outlined text-base">
                      {isTestingSpeaker ? 'graphic_eq' : 'play_circle'}
                    </span>
                    <span>{isTestingSpeaker ? 'Đang Thử Loa...' : '🔊 Thử Loa Ngay (Test Sound)'}</span>
                  </button>
                </div>

                {/* Microphone Permission Warning if any */}
                {micError && (
                  <div className="p-3.5 bg-amber-950/70 border border-amber-500/40 rounded-xl text-amber-200 text-xs space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-amber-400 text-base shrink-0 mt-0.5">info</span>
                      <div className="space-y-1">
                        <p className="font-medium leading-relaxed">{micError}</p>
                        <p className="text-[11px] text-amber-300/80">
                          Mẹo: Nhấn nút bên dưới để tạo ngay bản thu âm thử nghiệm chất lượng phòng thu Atelier và nghe lại âm thanh qua loa ngay lập tức.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-1 pl-6">
                      <button
                        type="button"
                        onClick={handleUseDemoAudio}
                        className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-100 rounded text-xs font-mono border border-amber-500/40 transition-colors flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-sm">music_note</span>
                        Dùng Bản Thu Mẫu Atelier (WAV)
                      </button>
                      <button
                        type="button"
                        onClick={startRecording}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-mono transition-colors"
                      >
                        Thử Lại Microphone
                      </button>
                    </div>
                  </div>
                )}

                {/* Live VU Meter during recording */}
                {isRecording && (
                  <div className="p-3 bg-surface-container-high rounded-xl border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-rose-400 text-base animate-pulse">mic</span>
                      <span className="font-mono text-primary text-[11px]">Tín Hiệu Giọng Nói:</span>
                      <div className="w-28 sm:w-44 bg-black/60 h-2.5 rounded-full overflow-hidden border border-white/10 p-0.5">
                        <div 
                          className={`h-full rounded-full transition-all duration-75 ${
                            micInputLevel > 15 
                              ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' 
                              : micInputLevel > 3 
                              ? 'bg-amber-400' 
                              : 'bg-rose-500'
                          }`} 
                          style={{ width: `${Math.min(100, Math.max(5, micInputLevel * 3))}%` }}
                        />
                      </div>
                      <span className="font-mono text-secondary text-[11px] w-8">{micInputLevel}%</span>
                    </div>

                    <div className="text-[11px] font-mono">
                      {micInputLevel < 3 ? (
                        <span className="text-amber-300 flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">warning</span>
                          Âm thanh rất nhỏ! Hãy nói to hoặc đưa micro gần hơn
                        </span>
                      ) : (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">check</span>
                          Microphone bắt tiếng tốt
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Waveform Visualization (Responsive to Voice / Playback) */}
                <div className="h-20 bg-black/50 rounded-xl p-3 flex items-center justify-center gap-1.5 overflow-hidden border border-white/5 relative">
                  {audioWaveLevels.map((val, idx) => {
                    const barHeight = isRecording 
                      ? `${val}%` 
                      : isPlayingPreview 
                      ? `${Math.min(100, 20 + Math.sin((idx + previewTime * 8) * 0.8) * 60 + 20)}%`
                      : audioBlobUrl 
                      ? `${25 + (idx % 4) * 15}%`
                      : '20%';

                    return (
                      <div
                        key={idx}
                        className={`w-1.5 rounded-full transition-all duration-150 ${
                          isRecording 
                            ? 'bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.6)]' 
                            : isPlayingPreview 
                            ? 'bg-secondary shadow-[0_0_8px_rgba(187,202,193,0.5)]'
                            : audioBlobUrl 
                            ? 'bg-secondary/60' 
                            : 'bg-outline-variant/30'
                        }`}
                        style={{ height: barHeight }}
                      ></div>
                    );
                  })}

                  {/* Status overlay label inside waveform */}
                  <div className="absolute top-2 left-3 text-[10px] font-mono text-white/40 uppercase tracking-wider pointer-events-none">
                    {isRecording ? 'LIVE MIC SPECTRUM ANALYZER' : isPlayingPreview ? 'PLAYING DIRECTLY TO HARDWARE SPEAKER' : audioBlobUrl ? 'AUDIO TRACK READY' : 'IDLE OPTICAL SENSOR'}
                  </div>
                </div>

                {/* State 1: Before Recording or Ready */}
                {!isRecording && !audioBlobUrl && (
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={startRecording}
                      className="px-6 py-3 bg-secondary-container hover:bg-secondary text-on-secondary-container hover:text-on-secondary rounded-xl font-mono text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95"
                    >
                      <span className="material-symbols-outlined text-lg">mic</span>
                      <span>Bắt Đầu Thu Âm Giọng Nói</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleUseDemoAudio}
                      className="px-4 py-2.5 bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-primary rounded-xl font-mono text-xs uppercase tracking-wider border border-white/10 transition-colors flex items-center gap-1.5"
                      title="Nạp một mẫu âm thanh chất lượng phòng thu đã chuẩn bị sẵn để nghe thử qua loa"
                    >
                      <span className="material-symbols-outlined text-base text-secondary">graphic_eq</span>
                      <span>Thử Bản Thu Mẫu (WAV)</span>
                    </button>
                  </div>
                )}

                {/* State 2: While Recording */}
                {isRecording && (
                  <div className="flex items-center justify-center gap-4 pt-2">
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="px-6 py-3.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-2 shadow-xl shadow-rose-900/30 animate-pulse hover:scale-105 active:scale-95"
                    >
                      <span className="material-symbols-outlined text-xl">stop_circle</span>
                      <span>Dừng & Lưu Nghe Lại Qua Loa</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        stopRecording();
                        handleResetRecording();
                      }}
                      className="px-4 py-3 bg-surface-container-high hover:bg-surface-bright text-rose-300 rounded-xl font-mono text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-base">close</span>
                      <span>Hủy</span>
                    </button>
                  </div>
                )}

                {/* State 3: Finished Recording - AUDIO PLAYER & PREVIEW DECK */}
                {audioBlobUrl && !isRecording && (
                  <div className="bg-surface-container/60 rounded-xl p-4 border border-secondary/30 space-y-3.5 animate-fade-in">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-secondary font-bold flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-base">volume_up</span>
                        <span>Bản Thu Đã Sẵn Sàng (Bấm Nút Play Để Phát Qua Loa)</span>
                      </span>
                      <span className="font-mono text-xs text-primary font-semibold">
                        {formatAudioTime(previewTime)} / {formatAudioTime(previewDuration || recordedDuration)}
                      </span>
                    </div>

                    {/* Play / Pause & Scrubber */}
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={togglePlayPreview}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shrink-0 ${
                          isPlayingPreview
                            ? 'bg-secondary text-on-secondary shadow-[0_0_18px_rgba(187,202,193,0.8)] scale-105'
                            : 'bg-primary-container text-on-primary-container hover:bg-primary hover:scale-105 shadow-md'
                        }`}
                        title={isPlayingPreview ? 'Tạm dừng phát loa' : 'Bấm để phát âm thanh qua loa thiết bị'}
                      >
                        <span className="material-symbols-outlined text-2xl">
                          {isPlayingPreview ? 'pause' : 'play_arrow'}
                        </span>
                      </button>

                      {/* Scrubber Range Slider */}
                      <div className="flex-1 flex flex-col justify-center">
                        <input
                          type="range"
                          min={0}
                          max={previewDuration || recordedDuration || 10}
                          step={0.05}
                          value={previewTime}
                          onChange={(e) => {
                            const t = parseFloat(e.target.value);
                            setPreviewTime(t);
                          }}
                          className="w-full accent-[#bbcac1] h-2 bg-surface-container-highest rounded-lg cursor-pointer appearance-none"
                        />
                        <div className="flex justify-between text-[10px] font-mono text-on-surface-variant mt-1">
                          <span>{formatAudioTime(previewTime)}</span>
                          <span>Đang xuất âm thanh: Loa ngoài / Tai nghe (Web Audio PCM)</span>
                          <span>{formatAudioTime(previewDuration || recordedDuration)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Volume Multiplier / Booster Controls */}
                    <div className="p-2.5 bg-black/40 rounded-lg border border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary text-sm">volume_up</span>
                        <span className="font-mono text-on-surface-variant text-[11px]">Khuếch đại âm lượng loa:</span>
                        <span className="font-mono text-primary font-bold text-[11px]">{Math.round(speakerVolume * 100)}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min={0.5}
                          max={2.0}
                          step={0.1}
                          value={speakerVolume}
                          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                          className="w-24 sm:w-32 accent-[#bbcac1] h-1.5 bg-white/20 rounded-lg cursor-pointer"
                        />
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => handleVolumeChange(1.0)}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                              speakerVolume === 1.0 ? 'bg-secondary text-on-secondary font-bold' : 'bg-surface-container text-on-surface-variant'
                            }`}
                          >
                            100%
                          </button>
                          <button
                            type="button"
                            onClick={() => handleVolumeChange(1.5)}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                              speakerVolume === 1.5 ? 'bg-secondary text-on-secondary font-bold' : 'bg-surface-container text-on-surface-variant'
                            }`}
                            title="Tăng 50% âm lượng nếu micro thu tiếng nhỏ"
                          >
                            150% Boost
                          </button>
                          <button
                            type="button"
                            onClick={() => handleVolumeChange(2.0)}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                              speakerVolume === 2.0 ? 'bg-secondary text-on-secondary font-bold' : 'bg-surface-container text-on-surface-variant'
                            }`}
                            title="Khuếch đại cực đại 200%"
                          >
                            200% Max
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Secondary Actions: Re-record, Delete, or Download */}
                    <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={togglePlayPreview}
                          className="px-3.5 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-bright text-primary font-mono text-xs transition-colors flex items-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-sm">
                            {isPlayingPreview ? 'pause' : 'volume_up'}
                          </span>
                          <span>{isPlayingPreview ? 'Tạm Dừng' : 'Phát Lại Qua Loa'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleResetRecording}
                          className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface-variant hover:text-primary font-mono text-xs transition-colors flex items-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-sm">replay</span>
                          <span>Thu Lại</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleResetRecording}
                          className="p-1.5 text-rose-300 hover:text-rose-100 transition-colors"
                          title="Xóa bản thu"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>

                      {/* Direct Audio Download Link */}
                      <a
                        href={audioBlobUrl}
                        download={`lumical-wish-month-${selectedMonth}.wav`}
                        className="text-[11px] font-mono text-secondary hover:underline flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-xs">download</span>
                        <span>Tải file âm thanh (WAV/WebM)</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Video 4K Upload */}
            {activeMediaTab === 'video' && (
              <div className="bg-surface-container-lowest p-6 rounded-xl border border-white/5 space-y-4">
                <div>
                  <h3 className="font-serif text-primary text-base">Thước Phim 4K Tích Hợp WebAR</h3>
                  <p className="text-xs text-on-surface-variant">
                    Tải lên video định dạng MP4/MOV. Hệ thống sẽ tối ưu hóa tự động chuẩn 60FPS AR.
                  </p>
                </div>

                <label className="border-2 border-dashed border-white/15 hover:border-secondary/60 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-surface-container/20">
                  <span className="material-symbols-outlined text-3xl text-secondary mb-2">cloud_upload</span>
                  <span className="font-mono text-xs text-primary uppercase tracking-wider">
                    {uploadedVideoName ? uploadedVideoName : 'KÉO THẢ HOẶC CHỌN VIDEO 4K'}
                  </span>
                  <span className="text-[11px] text-on-surface-variant mt-1">
                    Hỗ trợ ProRes, MP4, H.265 (Tối đa 500MB)
                  </span>
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setUploadedVideoName(e.target.files[0].name);
                      }
                    }}
                  />
                </label>

                {uploadedVideoName && (
                  <div className="p-3 bg-secondary-container/40 rounded-lg border border-secondary/30 flex items-center justify-between text-xs text-secondary font-mono">
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      <span>Đã nạp video: {uploadedVideoName}</span>
                    </span>
                    <span>Chuẩn 4K HDR Sẵn Sàng</span>
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Handwriting / Signature Canvas */}
            {activeMediaTab === 'handwriting' && (
              <div className="bg-surface-container-lowest p-6 rounded-xl border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-primary text-base">Bút Tích & Chữ Ký Tay Điện Tử</h3>
                    <p className="text-xs text-on-surface-variant">
                      Ký tên hoặc viết vài dòng thư tay bằng ngón tay hoặc chuột để khắc chìm vào trang lịch.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={clearCanvas}
                    className="text-xs font-mono text-rose-300 hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-xs">delete</span>
                    Xóa Bảng Vẽ
                  </button>
                </div>

                <div className="bg-[#18191c] rounded-lg border border-white/10 p-2 touch-none">
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={160}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full h-40 cursor-crosshair rounded bg-black/30"
                  ></canvas>
                </div>
                <div className="text-[11px] font-mono text-on-surface-variant text-center">
                  Bút tích sẽ được số hóa thành véc-tơ và khắc laser vàng kim lên phôi lịch.
                </div>
              </div>
            )}

            {/* Text Message Content */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-mono text-on-surface-variant uppercase">
                  LỜI CHÚC TRÂN TRỌNG (THƯ TAY ẨN TRONG WEBAR) *
                </label>
                <div className="flex gap-2">
                  <span className="text-[10px] text-secondary font-mono self-center">GỢI Ý ATELIER SCRIBE:</span>
                  <button
                    type="button"
                    onClick={() => applyAiSuggestion('Kính chúc Anh Cả tuổi mới tâm cảnh an nhiên, thân tâm thường lạc, vạn sự hanh thông và luôn là ngọn hải đăng vững chãi cho đại gia đình.')}
                    className="text-[10px] bg-surface-container-high hover:bg-surface-bright px-2 py-0.5 rounded text-primary border border-white/10"
                  >
                    Tri Ân & Mừng Tuổi
                  </button>
                  <button
                    type="button"
                    onClick={() => applyAiSuggestion('Chúc mừng kỷ niệm 25 năm thành lập công ty. Chúc tập thể luôn đoàn kết, phát triển bền vững và gặt hái thêm nhiều thành công mới.')}
                    className="text-[10px] bg-surface-container-high hover:bg-surface-bright px-2 py-0.5 rounded text-primary border border-white/10"
                  >
                    Cột Mốc Doanh Nghiệp
                  </button>
                </div>
              </div>

              <textarea
                required
                rows={4}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Viết những tâm tư, kỷ niệm đáng nhớ hoặc lời chúc chân thành nhất của bạn..."
                className="w-full px-4 py-3 rounded-xl bg-surface-container-lowest border border-white/10 text-on-surface focus:outline-none focus:border-secondary text-sm font-sans leading-relaxed"
              ></textarea>
            </div>

            {/* Submit Action */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs text-on-surface-variant font-mono">
                <span className="material-symbols-outlined text-secondary text-base">lock</span>
                <span>Mã hóa E2EE tự động trước khi lưu trữ vào Vault tháng {selectedMonth}</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary font-label-md text-xs tracking-wider uppercase font-semibold rounded-lg shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined text-base animate-spin">refresh</span>
                    <span>ĐANG MÃ HÓA & LƯU KỶ NIỆM...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">send</span>
                    <span>GỬI LỜI CHÚC VÀO THÁNG {selectedMonth}</span>
                  </>
                )}
              </button>
            </div>

            {/* Success notification */}
            {submitSuccess && (
              <div className="p-4 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-emerald-200 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-400">check_circle</span>
                  <span>Lời chúc của bạn đã được mã hóa an toàn và tích hợp thành công vào Niên Lịch 2025!</span>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('webar-scanner')}
                  className="underline font-mono text-[11px]"
                >
                  Quét thử ngay →
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Section: Existing Curated Wishes Feed */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl text-primary">Các Lời Chúc Đã Thu Thập ({posts.length})</h2>
              <p className="text-xs text-on-surface-variant">Lưu trữ an toàn trên mạng lưới IPFS của Atelier</p>
            </div>
            <span className="font-mono text-xs text-secondary">E2EE Verified</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-surface-container rounded-2xl p-6 border border-white/10 flex flex-col justify-between space-y-4 hover:border-secondary/40 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded bg-surface-container-high text-secondary text-[10px] font-mono">
                      {post.monthTitle}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-secondary-container/40 text-secondary text-[10px] font-mono flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">verified</span>
                      {post.mediaMeta}
                    </span>
                  </div>

                  <p className="font-serif text-sm text-on-surface italic leading-relaxed">
                    {post.quote}
                  </p>

                  {/* Interactive Audio Player if post has audio */}
                  {(post.mediaType === 'audio' || post.audioUrl) && (
                    <div className="p-3 bg-surface-container-lowest rounded-xl border border-secondary/20 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => handleTogglePlayPost(post)}
                          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                            activePlayingPostId === post.id
                              ? 'bg-secondary text-on-secondary shadow-[0_0_12px_rgba(187,202,193,0.6)] scale-105'
                              : 'bg-surface-container-high hover:bg-surface-bright text-primary border border-white/10'
                          }`}
                          title={activePlayingPostId === post.id ? 'Tạm dừng phát' : 'Nghe bản thu âm'}
                        >
                          <span className="material-symbols-outlined text-lg">
                            {activePlayingPostId === post.id ? 'pause' : 'play_arrow'}
                          </span>
                        </button>

                        <div>
                          <div className="text-[11px] font-mono text-primary flex items-center gap-1.5">
                            <span>{activePlayingPostId === post.id ? 'Đang phát...' : 'Bản thu âm'}</span>
                            {activePlayingPostId === post.id && (
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            )}
                          </div>
                          <div className="text-[10px] font-mono text-secondary">
                            {post.audioDuration || post.mediaMeta || '01:45 FLAC'}
                          </div>
                        </div>
                      </div>

                      {/* Equalizer animation when playing */}
                      <div className="flex items-center gap-1 h-5">
                        {[1, 2, 3, 4, 5].map((barIdx) => (
                          <span
                            key={barIdx}
                            className={`w-1 rounded-full transition-all duration-150 ${
                              activePlayingPostId === post.id
                                ? 'bg-secondary animate-pulse'
                                : 'bg-outline-variant/30'
                            }`}
                            style={{
                              height: activePlayingPostId === post.id ? `${25 + (barIdx * 19) % 75}%` : '20%',
                              animationDelay: `${barIdx * 100}ms`
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={post.avatar}
                      alt={post.author}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-white/15"
                    />
                    <div>
                      <div className="font-serif text-xs text-primary font-medium">{post.author}</div>
                      <div className="text-[10px] text-on-surface-variant">{post.role}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-outline">{post.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
