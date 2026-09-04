import React, { useState, useRef, useEffect } from 'react';
import { ScreenId } from '../types';
import { CALENDAR_MONTHS } from '../data/mockData';
import confetti from 'canvas-confetti';
import { playSpatialChimeSound, formatAudioTime } from '../utils/audioUtils';

interface WebARScannerScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const WebARScannerScreen: React.FC<WebARScannerScreenProps> = ({ onNavigate }) => {
  const [selectedMonthIdx, setSelectedMonthIdx] = useState<number>(4); // Month 5 (Đà Lạt) by default
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isPlayingVideo, setIsPlayingVideo] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showLetterModal, setShowLetterModal] = useState<boolean>(false);
  const [showFlash, setShowFlash] = useState<boolean>(false);
  const [trackingConfidence, setTrackingConfidence] = useState<number>(99.8);
  const [arMode, setArMode] = useState<'video' | '3d-spatial' | 'wireframe'>('video');

  // Voice note in letter modal state
  const [letterAudioPlaying, setLetterAudioPlaying] = useState<boolean>(false);
  const [letterAudioTime, setLetterAudioTime] = useState<number>(0);
  const stopChimeRef = useRef<(() => void) | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const currentMonth = CALENDAR_MONTHS[selectedMonthIdx];

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    if (!next) {
      playSpatialChimeSound();
    }
  };

  const togglePlayLetterAudio = () => {
    if (letterAudioPlaying) {
      if (stopChimeRef.current) {
        stopChimeRef.current();
        stopChimeRef.current = null;
      }
      setLetterAudioPlaying(false);
    } else {
      setLetterAudioPlaying(true);
      stopChimeRef.current = playSpatialChimeSound(() => {
        setLetterAudioPlaying(false);
        setLetterAudioTime(0);
      });
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (letterAudioPlaying) {
      timer = setInterval(() => {
        setLetterAudioTime((prev) => (prev >= 6 ? 0 : prev + 1));
      }, 1000);
    } else {
      setLetterAudioTime(0);
    }
    return () => clearInterval(timer);
  }, [letterAudioPlaying]);

  useEffect(() => {
    return () => {
      if (stopChimeRef.current) {
        stopChimeRef.current();
      }
    };
  }, []);

  // Camera initialization attempt
  const startCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setIsCameraActive(true);
        setCameraError(null);
      } else {
        setIsCameraActive(false);
      }
    } catch (err) {
      console.warn('Camera permission or availability note:', err);
      // Fallback to simulated high-fidelity optical chamber
      setIsCameraActive(false);
      setCameraError('Chế độ giả lập quang học Atelier (Camera không khả dụng hoặc chưa cấp quyền).');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  // Fluctuate tracking confidence slightly to give alive AR feeling
  useEffect(() => {
    const interval = setInterval(() => {
      setTrackingConfidence(+(99.4 + Math.random() * 0.5).toFixed(1));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleSnapshot = () => {
    setShowFlash(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#bbcac1', '#f3ead9', '#d6cebe']
    });
    setTimeout(() => {
      setShowFlash(false);
    }, 200);
  };

  return (
    <div className="w-full min-h-screen bg-black text-on-surface pt-20 pb-12 flex flex-col relative overflow-hidden select-none">
      {/* Flash overlay for snapshot */}
      {showFlash && (
        <div className="fixed inset-0 z-50 bg-white opacity-90 transition-opacity duration-150 pointer-events-none"></div>
      )}

      {/* Top Bar Header */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-3 flex items-center justify-between gap-4 z-20 bg-surface-container/60 backdrop-blur-md rounded-b-xl border-b border-white/10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('home')}
            className="p-2 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface transition-colors flex items-center gap-1 text-xs"
            title="Quay lại Trang Chủ"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span className="hidden sm:inline">Quay Lại</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg text-primary">{currentMonth.title} / 2025</span>
              <span className="font-mono text-xs text-secondary hidden sm:inline">• {currentMonth.theme}</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-on-surface-variant font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>WEBAR 60FPS TRACKING • {trackingConfidence}%</span>
            </div>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          {/* Audio toggle */}
          <button
            onClick={handleToggleMute}
            className={`px-3 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 transition-colors ${
              !isMuted 
                ? 'bg-secondary-container text-secondary border border-secondary/40' 
                : 'bg-surface-container-high text-on-surface-variant'
            }`}
            title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
          >
            <span className="material-symbols-outlined text-sm">
              {isMuted ? 'volume_off' : 'volume_up'}
            </span>
            <span className="hidden md:inline">{isMuted ? 'Tắt Âm' : 'FLAC Spatial ON'}</span>
          </button>

          {/* Letter Button */}
          <button
            onClick={() => setShowLetterModal(true)}
            className="px-3.5 py-1.5 bg-primary-container text-on-primary-container hover:bg-primary font-medium rounded text-xs transition-colors flex items-center gap-1.5 shadow"
          >
            <span className="material-symbols-outlined text-sm">mail</span>
            <span>Thư Ẩn Giấu</span>
          </button>

          {/* Camera switch / simulate */}
          <button
            onClick={() => {
              if (isCameraActive) {
                stopCamera();
              } else {
                startCamera();
              }
            }}
            className="p-2 rounded bg-surface-container-high hover:bg-surface-bright text-on-surface transition-colors"
            title={isCameraActive ? 'Chuyển sang buồng quang học Atelier' : 'Mở Camera Thiết Bị'}
          >
            <span className="material-symbols-outlined text-base">
              {isCameraActive ? 'videocam_off' : 'videocam'}
            </span>
          </button>
        </div>
      </div>

      {/* Main Optical AR Chamber Viewport */}
      <div className="relative flex-1 w-full max-w-[1280px] mx-auto my-4 rounded-2xl overflow-hidden border border-white/15 bg-[#090a0c] shadow-2xl flex items-center justify-center min-h-[580px]">
        {/* Real camera background if active */}
        {isCameraActive ? (
          <video
            ref={videoRef}
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          /* Simulated elegant studio environment */
          <div className="absolute inset-0 bg-radial from-surface-container-high/30 to-black/90">
            {/* Subtle desk texture / ambient light */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
          </div>
        )}

        {/* Optical Scanning Grid & Laser overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Laser scanning beam */}
          <div className="absolute left-4 right-4 h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent shadow-[0_0_12px_#bbcac1] animate-laser"></div>

          {/* Viewfinder Reticle Corners */}
          <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-secondary/70"></div>
          <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-secondary/70"></div>
          <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-secondary/70"></div>
          <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-secondary/70"></div>

          {/* Technical Diagnostics */}
          <div className="absolute top-6 left-12 font-mono text-[10px] text-secondary/80 space-y-0.5">
            <div>OPTICAL CHAMBER V4.8</div>
            <div>FPS: 60.0 • DELAY: 14MS</div>
            <div>CALIBRATION: ISO 12647-2</div>
          </div>

          <div className="absolute top-6 right-12 font-mono text-[10px] text-secondary/80 text-right space-y-0.5">
            <div>FOV: 78.4° HORIZONTAL</div>
            <div>POSE: MATRIX [4x4] FIXED</div>
            <div>E2EE ENCRYPTED FEED</div>
          </div>
        </div>

        {/* The Physical Calendar in AR Tracking Plane */}
        <div className="relative z-10 w-[300px] sm:w-[420px] md:w-[480px] bg-surface-container-lowest rounded-xl p-4 sm:p-6 border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-md">
          {/* Top of physical card */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
            <span className="font-serif text-primary tracking-wider uppercase font-medium">LUMICAL ARCHIVAL</span>
            <span className="font-mono text-secondary text-[11px]">{currentMonth.title}</span>
          </div>

          {/* The Awakened AR Memory Media */}
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden my-3 border border-secondary/40 bg-black group">
            <img
              src={currentMonth.image}
              alt={currentMonth.title}
              className={`w-full h-full object-cover transition-all duration-700 ${
                isPlayingVideo ? 'scale-105 brightness-105' : 'grayscale-[20%]'
              }`}
            />

            {/* Video playing simulated overlay */}
            {isPlayingVideo && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 flex flex-col justify-between p-3.5">
                <div className="flex justify-between items-center">
                  <span className="px-2 py-0.5 rounded bg-secondary-container/90 text-secondary text-[10px] font-mono">
                    4K PRORES STREAMING
                  </span>
                  <span className="text-[10px] font-mono text-white/80">{currentMonth.arVideoDuration}</span>
                </div>

                <div className="space-y-2">
                  <div className="font-serif text-sm sm:text-base text-primary font-medium drop-shadow-md">
                    {currentMonth.arVideoTitle}
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
                    <div className="bg-secondary h-full w-2/3 animate-pulse"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Play/Pause Button Overlay */}
            <button
              onClick={() => setIsPlayingVideo(!isPlayingVideo)}
              className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-black/60 hover:bg-black/80 border border-white/30 text-white flex items-center justify-center transition-transform hover:scale-110"
            >
              <span className="material-symbols-outlined text-2xl">
                {isPlayingVideo ? 'pause' : 'play_arrow'}
              </span>
            </button>
          </div>

          {/* Interactive Letter floating badge */}
          <div 
            onClick={() => setShowLetterModal(true)}
            className="bg-surface-container-high/90 hover:bg-surface-bright p-3 rounded-lg border border-secondary/30 flex items-center justify-between cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-secondary text-lg">mark_email_unread</span>
              <div>
                <span className="text-[11px] font-mono text-secondary block">LỜI CHÚC ĐÍNH KÈM</span>
                <span className="text-xs text-primary font-serif">Từ: {currentMonth.letterAuthor}</span>
              </div>
            </div>
            <span className="text-xs text-secondary font-mono">MỞ THƯ →</span>
          </div>
        </div>

        {/* Camera fallback notice if simulated */}
        {cameraError && (
          <div className="absolute bottom-4 left-4 right-4 max-w-md mx-auto bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-center text-[11px] font-mono text-on-surface-variant">
            {cameraError}
          </div>
        )}
      </div>

      {/* Month Carousel Selector */}
      <div className="w-full max-w-[1280px] mx-auto px-4 z-20">
        <div className="flex items-center gap-2 overflow-x-auto py-2 no-scrollbar">
          {CALENDAR_MONTHS.map((m, idx) => (
            <button
              key={m.monthNumber}
              onClick={() => setSelectedMonthIdx(idx)}
              className={`shrink-0 px-3.5 py-2 rounded-lg border font-mono text-xs transition-all ${
                selectedMonthIdx === idx
                  ? 'bg-primary-container text-on-primary-container border-primary font-bold shadow-lg scale-105'
                  : 'bg-surface-container hover:bg-surface-container-high border-white/10 text-on-surface-variant'
              }`}
            >
              <span className="block text-[10px] text-secondary">{m.title}</span>
              <span className="truncate max-w-[90px] block">{m.theme}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom AR Control Dock */}
      <div className="w-full max-w-[600px] mx-auto px-4 pt-4 flex items-center justify-around z-20">
        <button
          onClick={() => setArMode(arMode === 'video' ? '3d-spatial' : 'video')}
          className="flex flex-col items-center gap-1 text-[11px] font-mono text-on-surface-variant hover:text-primary transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-surface-container border border-white/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-lg">view_in_ar</span>
          </div>
          <span>{arMode === 'video' ? 'Chế độ 4K' : 'Không gian 3D'}</span>
        </button>

        {/* Shutter Snapshot Button */}
        <button
          onClick={handleSnapshot}
          className="relative group p-1"
          title="Chụp khoảnh khắc AR"
        >
          <div className="w-16 h-16 rounded-full border-2 border-secondary flex items-center justify-center p-1 group-hover:scale-105 transition-transform bg-black/40">
            <div className="w-full h-full rounded-full bg-primary group-hover:bg-white transition-colors flex items-center justify-center text-black">
              <span className="material-symbols-outlined text-2xl">photo_camera</span>
            </div>
          </div>
          <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-mono text-secondary whitespace-nowrap">
            CHỤP AR
          </span>
        </button>

        <button
          onClick={() => onNavigate('collaborative-portal')}
          className="flex flex-col items-center gap-1 text-[11px] font-mono text-on-surface-variant hover:text-primary transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-surface-container border border-white/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-lg">edit_note</span>
          </div>
          <span>Gửi Lời Chúc Mới</span>
        </button>
      </div>

      {/* Hidden Letter Modal */}
      {showLetterModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1a1b1e] border border-[#d6cebe]/30 max-w-lg w-full p-6 sm:p-8 rounded-2xl shadow-2xl text-on-surface relative space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">mark_email_read</span>
                <span className="font-serif text-lg text-primary">Thư Tay Kỷ Niệm • {currentMonth.title}</span>
              </div>
              <button
                onClick={() => setShowLetterModal(false)}
                className="p-1 text-on-surface-variant hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Author info */}
            <div className="flex items-center justify-between text-xs font-mono text-secondary">
              <span>Người gửi: {currentMonth.letterAuthor}</span>
              <span>Được giải mã bởi WebAR</span>
            </div>

            {/* Letter Body in Serif */}
            <div className="bg-[#121316] p-6 rounded-xl border border-white/5 space-y-4 font-serif text-base leading-relaxed text-[#e5e1d8] italic">
              <p>“{currentMonth.letterSnippet}”</p>
              <div className="text-right text-xs not-italic font-sans text-secondary">
                — {currentMonth.letterAuthor}
              </div>
            </div>

            {/* Audio Voice Note Player with synthesizer simulation */}
            <div className="bg-surface-container-high p-4 rounded-xl border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-base">mic</span>
                  <span className="font-mono text-primary text-[11px]">Tin Nhắn Giọng Nói Gốc (FLAC 24-bit Spatial)</span>
                  {letterAudioPlaying && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  )}
                </div>
                <span className="font-mono text-secondary text-[11px]">
                  {formatAudioTime(letterAudioTime)} / 00:06
                </span>
              </div>

              {/* Player control & Animated Audio Waveform */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={togglePlayLetterAudio}
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                    letterAudioPlaying
                      ? 'bg-secondary text-on-secondary shadow-[0_0_12px_rgba(187,202,193,0.6)] scale-105'
                      : 'bg-primary text-on-primary hover:scale-105'
                  }`}
                  title={letterAudioPlaying ? 'Tạm dừng' : 'Bấm để nghe lời nhắn âm thanh'}
                >
                  <span className="material-symbols-outlined text-xl">
                    {letterAudioPlaying ? 'pause' : 'play_arrow'}
                  </span>
                </button>

                <div className="flex-1 flex items-center gap-1 h-8 py-1">
                  {[40, 60, 90, 30, 75, 100, 85, 45, 60, 70, 95, 50, 65, 80, 40, 90, 100, 70, 30, 60, 85, 40, 55, 75].map((h, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-full transition-all duration-200 ${
                        letterAudioPlaying ? 'bg-secondary animate-pulse' : 'bg-secondary/40'
                      }`}
                      style={{
                        height: letterAudioPlaying
                          ? `${Math.min(100, Math.max(15, (h + Math.sin(letterAudioTime * 3 + i) * 30)))}%`
                          : `${Math.max(15, h * 0.4)}%`,
                        animationDelay: `${i * 60}ms`
                      }}
                    ></div>
                  ))}
                </div>
              </div>

              <div className="text-[10px] font-mono text-on-surface-variant flex items-center justify-between">
                <span>{letterAudioPlaying ? 'Đang phát âm thanh qua Web Audio Engine' : 'Nhấn nút Play để nghe giọng nói người gửi'}</span>
                <span className="text-secondary">E2EE Decrypted</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowLetterModal(false)}
                className="px-5 py-2 bg-primary text-on-primary font-label-md text-xs uppercase tracking-wider rounded font-medium hover:bg-white transition-colors"
              >
                Đóng Thư Kỷ Niệm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
