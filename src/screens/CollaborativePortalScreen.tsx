import React, { useState, useRef, useEffect } from 'react';
import { ScreenId, MemoryPost } from '../types';
import { CALENDAR_MONTHS, MEMORY_POSTS } from '../data/mockData';
import confetti from 'canvas-confetti';

interface CollaborativePortalScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const CollaborativePortalScreen: React.FC<CollaborativePortalScreenProps> = ({ onNavigate }) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(5); // Month 5 by default
  const [activeMediaTab, setActiveMediaTab] = useState<'audio' | 'video' | 'handwriting'>('audio');
  
  // Audio recording state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);

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
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

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
      const newPost: MemoryPost = {
        id: `post-${Date.now()}`,
        author: authorName,
        role: authorRole || 'Thành viên gia đình & Bằng hữu',
        month: selectedMonth,
        monthTitle: `THÁNG ${selectedMonth.toString().padStart(2, '0')}`,
        avatar: 'https://lh3.googleusercontent.com/aida/AEtjO1XIaJ7YWEYvnDtL6BfZAydnHZ_7LAw2yP6rdwJh3fLwG8hFmtYV80rOZa2LPN42TwX4ioBeRvp3ok9xMZ92-yMXgKlf-d_c1atQl6lXTvAe4hXtJTBYY3CYzdzoz8LpS_vPby8BhvLexRQFfXjgu-IBk0wDPqN1oHdqFhPouW1cMnWg2il1YT5OYcA2_o9fSulcn7Sc3ujRuZ6qOsmtqnDyKIqEa1njqW5O23ar7X4hzKiUGVOTgf4F8fw',
        quote: `“${messageText}”`,
        mediaType: activeMediaTab === 'handwriting' ? 'text' : activeMediaTab,
        mediaMeta: activeMediaTab === 'audio' ? '01:45 Audio FLAC' : activeMediaTab === 'video' ? 'Video 4K HDR' : 'Bút Tích Mực Kỹ Thuật Số',
        timestamp: 'Vừa xong',
        e2eeVerified: true
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
              <div className="bg-surface-container-lowest p-6 rounded-xl border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-primary text-base">Phòng Thu Âm Thanh Không Gian (FLAC)</h3>
                    <p className="text-xs text-on-surface-variant">
                      Ghi lại giọng nói chân thật của bạn. Bản ghi sẽ được đồng bộ vào AR của tháng {selectedMonth}.
                    </p>
                  </div>
                  <div className="font-mono text-xs text-secondary">
                    {isRecording ? `00:${recordingSeconds.toString().padStart(2, '0')} Đang Thu...` : 'Sẵn Sàng'}
                  </div>
                </div>

                {/* Animated Waveform Visualization */}
                <div className="h-16 bg-black/40 rounded-lg p-3 flex items-center justify-center gap-1 overflow-hidden border border-white/5">
                  {[30, 45, 70, 90, 40, 85, 95, 60, 40, 80, 100, 75, 45, 90, 80, 50, 70, 85, 30, 60, 90, 40, 75, 55, 35].map((val, idx) => (
                    <div
                      key={idx}
                      className={`w-1.5 rounded-full transition-all duration-200 ${
                        isRecording ? 'bg-secondary animate-pulse' : 'bg-outline-variant'
                      }`}
                      style={{ height: isRecording ? `${Math.min(100, val + (idx % 3) * 15)}%` : '20%' }}
                    ></div>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  {!isRecording ? (
                    <button
                      type="button"
                      onClick={() => {
                        setIsRecording(true);
                        setAudioBlobUrl('recorded-sample.flac');
                      }}
                      className="px-5 py-2.5 bg-secondary-container hover:bg-secondary text-on-secondary-container hover:text-on-secondary rounded-lg font-mono text-xs uppercase tracking-wider transition-colors flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-base">mic</span>
                      <span>Bắt Đầu Thu Âm</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsRecording(false)}
                      className="px-5 py-2.5 bg-rose-900/80 hover:bg-rose-800 text-rose-100 rounded-lg font-mono text-xs uppercase tracking-wider transition-colors flex items-center gap-2 animate-pulse"
                    >
                      <span className="material-symbols-outlined text-base">stop</span>
                      <span>Dừng & Lưu Bản Thu</span>
                    </button>
                  )}

                  {audioBlobUrl && !isRecording && (
                    <span className="text-xs text-secondary font-mono flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      Bản thu 01:45 đã sẵn sàng
                    </span>
                  )}
                </div>
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
