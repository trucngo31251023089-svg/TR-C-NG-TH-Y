import React, { useState, useEffect, useRef } from 'react';
import { ScreenId, CalendarMonth, DesignTemplate } from '../types';
import { CALENDAR_MONTHS } from '../data/mockData';
import { DESIGN_TEMPLATES, CURATED_PHOTO_LIBRARY, AI_SUGGESTION_PROMPTS } from '../data/templateData';
import confetti from 'canvas-confetti';

interface DesignStudioScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const DesignStudioScreen: React.FC<DesignStudioScreenProps> = ({ onNavigate }) => {
  // Main Studio Navigation Tabs
  const [activeTab, setActiveTab] = useState<'templates' | 'diy-months' | 'craft-specs'>('templates');

  // Months State (allows fully custom DIY editing per month)
  const [months, setMonths] = useState<CalendarMonth[]>(() => {
    const saved = localStorage.getItem('lumical_custom_months');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return CALENDAR_MONTHS;
      }
    }
    return CALENDAR_MONTHS;
  });

  const [previewMonthIdx, setPreviewMonthIdx] = useState<number>(4); // Month 5 default
  const [selectedEdition, setSelectedEdition] = useState<'desk' | 'wall' | 'bespoke'>('desk');
  const [selectedWood, setSelectedWood] = useState<'walnut' | 'oak' | 'ebony'>('walnut');
  const [selectedPaper, setSelectedPaper] = useState<'cotton' | 'materica' | 'lustre'>('cotton');
  const [layoutStyle, setLayoutStyle] = useState<'museum-border' | 'minimal-fullbleed' | 'polar-split' | 'gallery-square'>('museum-border');
  const [colorFilter, setColorFilter] = useState<'none' | 'sepia' | 'noir' | 'sunset' | 'botanical'>('none');
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans' | 'mono'>('serif');
  const [engravingText, setEngravingText] = useState<string>('Kính tặng Cha Mẹ - Kỷ Niệm 2025');
  const [showArPreview, setShowArPreview] = useState<boolean>(false);
  const [appliedTemplateId, setAppliedTemplateId] = useState<string | null>('heritage-ancestral');

  // AI Stylist State
  const [aiCustomPrompt, setAiCustomPrompt] = useState<string>('');
  const [activeAiAdvice, setActiveAiAdvice] = useState<{
    label: string;
    advice: string;
    matchedTemplate: DesignTemplate;
  } | null>(null);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState<boolean>(false);

  // Photo modal state for curated gallery
  const [isPhotoGalleryOpen, setIsPhotoGalleryOpen] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentMonth = months[previewMonthIdx] || months[0];

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('lumical_custom_months', JSON.stringify(months));
  }, [months]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Update a single attribute of current active month
  const updateCurrentMonth = (field: keyof CalendarMonth, value: any) => {
    setMonths((prev) => {
      const next = [...prev];
      next[previewMonthIdx] = {
        ...next[previewMonthIdx],
        [field]: value
      };
      return next;
    });
  };

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        updateCurrentMonth('image', dataUrl);
        updateCurrentMonth('customUploaded', true);
        showToast(`Đã tải ảnh lên thành công cho ${currentMonth.title}!`);
      }
    };
    reader.readAsDataURL(file);
  };

  // Apply a whole Design Template
  const handleApplyTemplate = (template: DesignTemplate) => {
    setAppliedTemplateId(template.id);
    setSelectedWood(template.woodBase);
    setLayoutStyle(template.layoutStyle);
    setColorFilter(template.colorFilter);
    setFontFamily(template.fontFamily);

    // Apply template custom months data if present
    setMonths((prev) => {
      return prev.map((m) => {
        const match = template.monthsData?.find((tm) => tm.monthNumber === m.monthNumber);
        if (match) {
          return {
            ...m,
            ...match,
            filterStyle: template.colorFilter
          };
        }
        return {
          ...m,
          filterStyle: template.colorFilter
        };
      });
    });

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: [template.accentColor, '#f3ead9', '#ffffff']
    });

    showToast(`Đã áp dụng mẫu thiết kế: "${template.name}"!`);
  };

  // Trigger AI Smart Stylist
  const handleTriggerAiPrompt = (promptItem: typeof AI_SUGGESTION_PROMPTS[0]) => {
    setIsAiAnalyzing(true);
    setTimeout(() => {
      setIsAiAnalyzing(false);
      const matched = DESIGN_TEMPLATES.find((t) => t.id === promptItem.templateId) || DESIGN_TEMPLATES[0];
      setActiveAiAdvice({
        label: promptItem.label,
        advice: promptItem.aiAdvice,
        matchedTemplate: matched
      });
    }, 600);
  };

  // Custom AI search
  const handleCustomAiSearch = () => {
    if (!aiCustomPrompt.trim()) return;
    setIsAiAnalyzing(true);
    setTimeout(() => {
      setIsAiAnalyzing(false);
      const query = aiCustomPrompt.toLowerCase();
      let matched = DESIGN_TEMPLATES[0];
      let advice = 'Hệ thống gợi ý phong cách trang trọng cổ điển với viền chỉ vàng và chất liệu giấy mỹ thuật Cotton Hahnemühle 310gsm cao cấp.';

      if (query.includes('cưới') || query.includes('yêu') || query.includes('vợ') || query.includes('chồng') || query.includes('người yêu')) {
        matched = DESIGN_TEMPLATES.find((t) => t.id === 'mon-amour') || DESIGN_TEMPLATES[3];
        advice = 'Dành riêng cho câu chuyện tình yêu: Màu hoàng hôn champagne ấm áp, bố cục khung viền bảo tàng sang trọng và chất giấy mỹ thuật Fedrigoni Ý thanh lịch.';
      } else if (query.includes('công ty') || query.includes('đối tác') || query.includes('sếp') || query.includes('doanh nghiệp') || query.includes('vip')) {
        matched = DESIGN_TEMPLATES.find((t) => t.id === 'executive-c-suite') || DESIGN_TEMPLATES[4];
        advice = 'Đẳng cấp ngoại giao và tầm vóc thương hiệu: Giấy mỹ thuật Cotton dập kim mạ vàng biểu trưng doanh nghiệp, bố cục chia đôi với clip WebAR thông điệp lãnh đạo.';
      } else if (query.includes('thiền') || query.includes('tối giản') || query.includes('trà') || query.includes('an nhiên') || query.includes('xanh')) {
        matched = DESIGN_TEMPLATES.find((t) => t.id === 'botanical-zen') || DESIGN_TEMPLATES[1];
        advice = 'Tinh thần Wabi-Sabi tĩnh tại: Tông xanh thảo mộc mát dịu, bố cục chia đôi tinh tế và chất liệu giấy mỹ thuật xốp mịn.';
      } else if (query.includes('công nghệ') || query.includes('game') || query.includes('3d') || query.includes('ar') || query.includes('tương lai')) {
        matched = DESIGN_TEMPLATES.find((t) => t.id === 'cyber-phygital') || DESIGN_TEMPLATES[5];
        advice = 'Công nghệ WebAR đột phá: Tối ưu 842 điểm neo quang học trên chuẩn máy in Heidelberg giúp quét AR 60FPS mượt mà tức thì.';
      } else {
        matched = DESIGN_TEMPLATES.find((t) => t.id === 'heritage-ancestral') || DESIGN_TEMPLATES[0];
        advice = 'Phong cách Bách Niên Gia Tộc: Sắc nâu ấm sáp ong và viền chỉ vàng tế vi, tôn vinh cội nguồn và lòng hiếu kính đấng sinh thành.';
      }

      setActiveAiAdvice({
        label: aiCustomPrompt,
        advice,
        matchedTemplate: matched
      });
    }, 700);
  };

  // Reset to Atelier default
  const handleResetDefaults = () => {
    localStorage.removeItem('lumical_custom_months');
    setMonths(CALENDAR_MONTHS);
    setSelectedWood('walnut');
    setLayoutStyle('museum-border');
    setColorFilter('none');
    setFontFamily('serif');
    setEngravingText('Kính tặng Cha Mẹ - Kỷ Niệm 2025');
    showToast('Đã khôi phục thiết kế nguyên bản của Atelier.');
  };

  // Stand & Frame Options (Đế gỗ tự nhiên dễ tìm hoặc Khung để bàn tiêu chuẩn)
  const standOptions = [
    {
      id: 'walnut',
      name: 'Đế Gỗ Thông Mộc Tự Nhiên',
      tag: 'Gỗ mộc dễ tìm',
      desc: 'Khối gỗ thông mộc xẻ rãnh tiêu chuẩn, rất dễ tìm tại mọi xưởng mộc, ấm áp, khắc laser tên riêng.',
      colorClass: 'bg-[#9a6735]',
      gradientClass: 'bg-gradient-to-r from-[#7a4e23] via-[#9a6735] to-[#6d431c]',
      slotClass: 'bg-[#3b200c]'
    },
    {
      id: 'oak',
      name: 'Đế Gỗ Sồi Tiện Rãnh Cắm',
      tag: 'Phổ biến & Bền đẹp',
      desc: 'Gỗ sồi phổ thông vân sáng, bền đẹp, xẻ rãnh nghiêng 15° kẹp vừa vặn 12 tờ lịch giấy.',
      colorClass: 'bg-[#c2a688]',
      gradientClass: 'bg-gradient-to-r from-[#9e8367] via-[#c2a688] to-[#886d52]',
      slotClass: 'bg-[#4a3927]'
    },
    {
      id: 'ebony',
      name: 'Khung Để Bàn Tiêu Chuẩn',
      tag: 'Khung tiện dụng dễ mua',
      desc: 'Khung ảnh để bàn tiêu chuẩn (13x18cm hoặc 15x20cm, mua đâu cũng có), lồng thay tờ lịch giấy mỗi tháng.',
      colorClass: 'bg-[#2b2b2b]',
      gradientClass: 'bg-gradient-to-r from-[#18191c] via-[#2f3136] to-[#18191c]',
      slotClass: 'bg-[#111113]'
    }
  ];

  // 100% In Trên Giấy Mỹ Thuật (Cam kết không in trực tiếp lên gỗ)
  const paperOptions = [
    {
      id: 'cotton',
      name: 'Giấy Mỹ Thuật Cotton Hahnemühle 310gsm (Đức)',
      tag: 'Chuẩn Bảo Tàng FOGRA39',
      desc: '100% sợi bông cotton tự nhiên, hạt mịn xốp sang trọng, chuẩn in bảo tàng archival 100 năm.',
      colorClass: 'bg-[#ede7df]'
    },
    {
      id: 'materica',
      name: 'Giấy Mỹ Thuật Fedrigoni Materica 360gsm (Ý)',
      tag: 'Gân Hữu Cơ Tự Nhiên',
      desc: 'Chất giấy mộc mạc hữu cơ, bề mặt gân xốp tự nhiên tạo chiều sâu mỹ cảm thanh tịnh.',
      colorClass: 'bg-[#f4efe6]'
    },
    {
      id: 'lustre',
      name: 'Giấy Ảnh Mỹ Thuật Satin Lustre 300gsm (Nhật Bản)',
      tag: 'Chống Lóa & Ánh Ngọc Trai',
      desc: 'Bán bóng ánh ngọc trai, tương phản quang học cao, triệt tiêu lóa sáng và chống bám vân tay.',
      colorClass: 'bg-[#fdfbf7]'
    }
  ];

  const woodOptions = standOptions;

  // Helper CSS for image filters
  const getFilterClass = () => {
    switch (colorFilter) {
      case 'sepia':
        return 'sepia-[0.4] contrast-105 brightness-95';
      case 'noir':
        return 'grayscale contrast-125';
      case 'sunset':
        return 'hue-rotate-[-10deg] saturate-125 contrast-105';
      case 'botanical':
        return 'hue-rotate-[15deg] saturate-90 brightness-105';
      default:
        return '';
    }
  };

  const getFontClass = () => {
    switch (fontFamily) {
      case 'sans':
        return 'font-sans';
      case 'mono':
        return 'font-mono';
      default:
        return 'font-serif';
    }
  };

  return (
    <div className="w-full min-h-screen pt-24 pb-20 font-sans">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 space-y-8">
        {/* Title Header & Mode Switcher Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-white/10">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-surface-container-high border border-outline-variant/30">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
              <span className="font-label-sm text-[11px] tracking-[0.24em] text-secondary uppercase font-mono">
                BESPOKE STUDIO / PHYGITAL ATELIER
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl text-primary font-normal">
              Studio Tự Thiết Kế & Gợi Ý Mẫu Độc Bản
            </h1>

            <p className="font-body-md text-sm text-on-surface-variant">
              Tự do tải ảnh, tùy biến lời tựa 12 tháng, kết hợp gợi ý thông minh từ Stylist AI và bộ sưu tập 6 phong cách giám tuyển sẵn sàng in ấn.
            </p>
          </div>

          {/* 3 Main Studio Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 bg-surface-container rounded-2xl border border-white/10 shrink-0">
            <button
              onClick={() => setActiveTab('templates')}
              className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                activeTab === 'templates'
                  ? 'bg-secondary text-on-secondary font-bold shadow-md'
                  : 'text-on-surface-variant hover:text-primary hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-sm">auto_awesome</span>
              <span>Gợi Ý Mẫu & AI</span>
            </button>

            <button
              onClick={() => setActiveTab('diy-months')}
              className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                activeTab === 'diy-months'
                  ? 'bg-secondary text-on-secondary font-bold shadow-md'
                  : 'text-on-surface-variant hover:text-primary hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-sm">edit_note</span>
              <span>Tự Thiết Kế 12 Tháng</span>
            </button>

            <button
              onClick={() => setActiveTab('craft-specs')}
              className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                activeTab === 'craft-specs'
                  ? 'bg-secondary text-on-secondary font-bold shadow-md'
                  : 'text-on-surface-variant hover:text-primary hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-sm">description</span>
              <span>Chất Liệu Giấy & Ép Kim</span>
            </button>
          </div>
        </div>

        {/* 2-Column Workstation: Left is Interactive Live 3D Simulator, Right is Active Control Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (7 cols): Live 3D Desk Simulator */}
          <div className="lg:col-span-7 bg-surface-container rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 sticky top-24">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-lg">view_in_ar</span>
                <span className="font-serif text-lg text-primary">Mô Phỏng Thực Tế Ấn Bản</span>
                <span className="text-xs text-secondary font-mono px-2 py-0.5 rounded bg-surface-container-high border border-white/10">
                  {currentMonth.title}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowArPreview(!showArPreview)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
                    showArPreview
                      ? 'bg-secondary text-on-secondary font-bold shadow-[0_0_12px_rgba(187,202,193,0.4)]'
                      : 'bg-surface-container-high text-on-surface-variant hover:text-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {showArPreview ? 'videocam' : 'visibility'}
                  </span>
                  <span>{showArPreview ? 'Đang Chiếu AR 4K' : 'Bật Thử AR'}</span>
                </button>

                <button
                  onClick={handleResetDefaults}
                  title="Đặt lại thiết kế mặc định"
                  className="p-1.5 text-on-surface-variant hover:text-primary bg-surface-container-high rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined text-base">restart_alt</span>
                </button>
              </div>
            </div>

            {/* 3D Simulated Desk Calendar Card Standing on Wood Base or Desk Frame */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black/70 border border-white/10 flex items-center justify-center p-6 shadow-2xl">
              {/* Material Guarantee Badge */}
              <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2 z-20">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="font-mono text-[10px] text-white/90 uppercase tracking-wider">
                  100% IN TRÊN GIẤY MỸ THUẬT • {selectedWood === 'ebony' ? 'KHUNG ĐỂ BÀN TIÊU CHUẨN' : selectedWood === 'oak' ? 'ĐẾ GỖ SỒI TIỆN RÃNH' : 'ĐẾ GỖ THÔNG MỘC DỄ TÌM'}
                </span>
              </div>

              {/* Subtle Atelier ambient spotlight behind */}
              <div className="absolute top-0 w-72 h-44 bg-secondary/10 blur-3xl rounded-full pointer-events-none"></div>

              {/* Đế gỗ tự nhiên dễ tìm hoặc Khung để bàn tiêu chuẩn */}
              {selectedWood !== 'ebony' ? (
                <div
                  className={`absolute bottom-5 w-[86%] sm:w-[80%] h-12 rounded-lg shadow-[0_20px_35px_rgba(0,0,0,0.85)] transition-all duration-500 flex flex-col items-center justify-between border z-0 p-1.5 ${
                    selectedWood === 'walnut'
                      ? 'bg-gradient-to-b from-[#9a6735] via-[#7d4e22] to-[#543212] border-[#ba8753]/40'
                      : 'bg-gradient-to-b from-[#d1b597] via-[#a88a69] to-[#785f43] border-[#ecd3ba]/40'
                  }`}
                >
                  {/* Carved Milled Slot for Paper Calendar Leaf */}
                  <div className="w-[90%] h-1.5 rounded-full bg-black/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)] border-b border-white/10"></div>
                  
                  {/* Laser Engraved Message on Natural Wood Face */}
                  <span className={`font-serif text-[10px] sm:text-[11px] italic tracking-wider px-3 truncate max-w-[92%] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] ${
                    selectedWood === 'walnut' ? 'text-[#f5e3cc]/90' : 'text-[#2a1d12]/90 font-medium'
                  }`}>
                    {engravingText || (selectedWood === 'walnut' ? 'LUMICAL 2025 • ĐẾ GỖ THÔNG MỘC DỄ TÌM' : 'LUMICAL 2025 • ĐẾ GỖ SỒI TIỆN RÃNH')}
                  </span>
                </div>
              ) : (
                /* Khung để bàn tiêu chuẩn - chân đỡ để bàn phía sau */
                <div className="absolute bottom-5 w-[76%] h-6 bg-gradient-to-b from-neutral-800 to-neutral-950 rounded-lg shadow-[0_15px_30px_rgba(0,0,0,0.8)] border border-white/10 flex items-center justify-center z-0">
                  <span className="font-mono text-[9px] text-neutral-400 uppercase tracking-widest">
                    KHUNG ĐỂ BÀN TIÊU CHUẨN • DỄ THAY THẺ GIẤY HÀNG THÁNG
                  </span>
                </div>
              )}

              {/* The Physical Calendar Card Placed into Base Slot or Framed */}
              <div
                className={`relative z-10 w-[290px] sm:w-[350px] bg-[#1a1b1f] rounded-xl p-4 shadow-[0_20px_40px_rgba(0,0,0,0.9)] border transition-all duration-300 -translate-y-4 ${
                  selectedWood === 'ebony'
                    ? 'ring-4 ring-neutral-700/80 border-2 border-neutral-500 shadow-[0_25px_50px_rgba(0,0,0,0.95)]'
                    : layoutStyle === 'museum-border'
                    ? 'border-[#d4af37]/40 ring-1 ring-[#d4af37]/20'
                    : layoutStyle === 'gallery-square'
                    ? 'border-white/30'
                    : 'border-white/15'
                }`}
              >
                {/* Museum Corner Crop Marks for Museum Border Layout */}
                {layoutStyle === 'museum-border' && (
                  <>
                    <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-[#d4af37]/60 pointer-events-none"></div>
                    <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-[#d4af37]/60 pointer-events-none"></div>
                    <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-[#d4af37]/60 pointer-events-none"></div>
                    <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-[#d4af37]/60 pointer-events-none"></div>
                  </>
                )}

                {/* Card Top Header */}
                <div className={`flex justify-between items-center pb-2 border-b border-white/10 text-xs ${getFontClass()}`}>
                  <span className="text-primary tracking-wider uppercase font-semibold">LUMICAL 2025</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-secondary font-mono text-[11px]">{currentMonth.title}</span>
                    {currentMonth.customUploaded && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Ảnh do bạn tự tải lên"></span>
                    )}
                  </div>
                </div>

                {/* Main Artwork Container according to layout style */}
                <div className="relative my-2.5 rounded overflow-hidden bg-black border border-white/10 group">
                  <div
                    className={`relative overflow-hidden transition-all duration-300 ${
                      layoutStyle === 'gallery-square'
                        ? 'aspect-square'
                        : layoutStyle === 'polar-split'
                        ? 'aspect-[16/9]'
                        : 'aspect-[4/3]'
                    }`}
                  >
                    <img
                      src={currentMonth.image}
                      alt={currentMonth.title}
                      className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${getFilterClass()}`}
                    />

                    {/* AR Optical Anchor Crosshair in corner */}
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/75 px-1.5 py-0.5 rounded text-[9px] font-mono text-secondary pointer-events-none">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span>{currentMonth.arAccuracy}% AR Lock</span>
                    </div>

                    {/* If AR Simulation Preview is turned ON */}
                    {showArPreview && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 flex flex-col justify-between p-3 border-2 border-secondary animate-pulse">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono text-secondary bg-black/80 px-2 py-0.5 rounded border border-secondary/40">
                            WEBAR 4K RECOGNIZED
                          </span>
                          <span className="font-mono text-[9px] text-emerald-300 bg-emerald-950/80 px-1.5 py-0.5 rounded">
                            60 FPS
                          </span>
                        </div>

                        <div className="space-y-1 text-left">
                          <div className="text-white font-serif text-xs font-medium leading-snug">
                            {currentMonth.arVideoTitle}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-mono text-secondary">
                            <span className="material-symbols-outlined text-xs">play_circle</span>
                            <span>Thời lượng: {currentMonth.arVideoDuration}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Quote or Theme Snippet below artwork */}
                <div className={`space-y-1 pt-1 text-left ${getFontClass()}`}>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-primary font-medium">{currentMonth.theme}</span>
                    <span className="text-[10px] text-on-surface-variant font-mono uppercase">
                      {fontFamily} • {colorFilter}
                    </span>
                  </div>

                  {currentMonth.quote && (
                    <p className="text-[10px] text-on-surface-variant italic line-clamp-1">
                      "{currentMonth.quote}"
                    </p>
                  )}

                  {/* Polar Split date strip simulation */}
                  {layoutStyle === 'polar-split' && (
                    <div className="pt-2 border-t border-white/10 grid grid-cols-7 gap-1 text-[8px] font-mono text-center text-on-surface-variant">
                      <span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span className="text-secondary">CN</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 12-Month Quick Switcher Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-on-surface-variant uppercase">
                  CHỌN THÁNG ĐỂ XEM & CHỈNH SỬA:
                </span>
                <span className="text-[11px] text-secondary font-mono">
                  {months.filter((m) => m.customUploaded).length}/12 tháng đã tùy chỉnh ảnh
                </span>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {months.map((m, idx) => (
                  <button
                    key={m.monthNumber}
                    onClick={() => setPreviewMonthIdx(idx)}
                    className={`px-3 py-2 rounded-xl text-xs font-mono shrink-0 transition-all flex items-center gap-1.5 ${
                      previewMonthIdx === idx
                        ? 'bg-primary-container text-on-primary-container font-bold scale-105 shadow-md border border-white/20'
                        : 'bg-surface-container-high text-on-surface-variant hover:text-primary border border-transparent'
                    }`}
                  >
                    <span>{m.title}</span>
                    {m.customUploaded && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Toast Notification */}
            {toastMessage && (
              <div className="p-3 bg-emerald-950/90 border border-emerald-500/40 rounded-xl text-emerald-200 text-xs font-mono flex items-center gap-2 animate-fade-in">
                <span className="material-symbols-outlined text-sm text-emerald-400">check_circle</span>
                <span>{toastMessage}</span>
              </div>
            )}
          </div>

          {/* Right Column (5 cols): Contextual Controls depending on Active Tab */}
          <div className="lg:col-span-5 space-y-6">
            {/* ============================================================== */}
            {/* TAB 1: TEMPLATES & AI STYLIST GỢI Ý MẪU                        */}
            {/* ============================================================== */}
            {activeTab === 'templates' && (
              <div className="space-y-6">
                {/* AI Smart Stylist Assistant Box */}
                <div className="bg-surface-container rounded-3xl p-6 sm:p-7 border border-secondary/30 space-y-5 relative overflow-hidden">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
                    <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center text-secondary">
                      <span className="material-symbols-outlined text-lg">psychology</span>
                    </div>
                    <div>
                      <h3 className="font-serif text-lg text-primary">Trợ Lý AI Gợi Ý Mẫu Thiết Kế</h3>
                      <p className="text-[11px] text-on-surface-variant font-mono">
                        Chọn kịch bản hoặc nhập ý tưởng để nhận gợi ý phối cảnh trọn vẹn
                      </p>
                    </div>
                  </div>

                  {/* Quick Pill Prompts */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-secondary uppercase block">
                      GỢI Ý NHANH THEO DỊP ĐẶC BIỆT:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {AI_SUGGESTION_PROMPTS.map((prompt) => (
                        <button
                          key={prompt.label}
                          type="button"
                          onClick={() => handleTriggerAiPrompt(prompt)}
                          className="px-2.5 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-bright text-[11px] font-mono text-on-surface hover:text-secondary border border-white/10 transition-colors text-left"
                        >
                          {prompt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Free-form Prompt Input */}
                  <div className="space-y-2">
                    <div className="relative">
                      <input
                        type="text"
                        value={aiCustomPrompt}
                        onChange={(e) => setAiCustomPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCustomAiSearch()}
                        placeholder="Hoặc nhập: Ví dụ 'Kỷ niệm 1 năm yêu nhau lãng mạn'..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-white/10 text-on-surface text-xs focus:outline-none focus:border-secondary font-sans pr-10"
                      />
                      <button
                        type="button"
                        onClick={handleCustomAiSearch}
                        className="absolute right-2 top-2 p-1 text-secondary hover:text-primary transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">send</span>
                      </button>
                    </div>
                  </div>

                  {/* AI Analysis Result Card */}
                  {isAiAnalyzing ? (
                    <div className="p-4 rounded-xl bg-surface-container-lowest border border-white/10 flex items-center justify-center gap-2 text-xs font-mono text-secondary">
                      <span className="material-symbols-outlined text-base animate-spin">refresh</span>
                      <span>Stylist AI đang giám tuyển bố cục phù hợp...</span>
                    </div>
                  ) : activeAiAdvice ? (
                    <div className="p-4 rounded-xl bg-surface-container-lowest border border-secondary/40 space-y-3 animate-fade-in">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-secondary font-bold uppercase">
                          KHUYÊN DÙNG: {activeAiAdvice.matchedTemplate.name}
                        </span>
                        <span className="text-[10px] text-on-surface-variant font-mono">
                          Phù hợp 99.8%
                        </span>
                      </div>

                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        {activeAiAdvice.advice}
                      </p>

                      <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                        <div className="flex gap-2 text-[10px] font-mono text-on-surface-variant">
                          <span>Chất liệu: 100% Giấy mỹ thuật</span>
                          <span>•</span>
                          <span>Bố cục: {activeAiAdvice.matchedTemplate.layoutStyle}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleApplyTemplate(activeAiAdvice.matchedTemplate)}
                          className="px-3 py-1.5 bg-primary-container text-on-primary-container hover:bg-primary font-mono text-xs uppercase tracking-wider rounded-lg font-bold transition-all shadow"
                        >
                          Áp Dụng Mẫu Này
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Curated Templates Grid (6 Presets) */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg text-primary">Bộ Sưu Tập Mẫu Giám Tuyển (6 Phong Cách)</h3>
                    <span className="text-xs text-on-surface-variant font-mono">Click để áp dụng</span>
                  </div>

                  <div className="space-y-3.5">
                    {DESIGN_TEMPLATES.map((tmpl) => {
                      const isApplied = appliedTemplateId === tmpl.id;
                      return (
                        <div
                          key={tmpl.id}
                          className={`p-4 rounded-2xl border transition-all ${
                            isApplied
                              ? 'bg-secondary-container/30 border-secondary ring-1 ring-secondary'
                              : 'bg-surface-container hover:bg-surface-container-high border-white/10 hover:border-white/30'
                          }`}
                        >
                          <div className="flex gap-3.5 items-start">
                            <img
                              src={tmpl.coverImage}
                              alt={tmpl.name}
                              className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0"
                            />
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-serif text-sm text-primary font-medium">{tmpl.name}</h4>
                                {isApplied && (
                                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                                    Đang Chọn
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-on-surface-variant line-clamp-2">
                                {tmpl.tagline}
                              </p>

                              {/* Tags */}
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {tmpl.previewTags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-1.5 py-0.5 rounded bg-surface-container-lowest text-[9px] font-mono text-secondary"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-xs">
                            <span className="text-[10px] text-on-surface-variant font-mono truncate max-w-[200px]">
                              Phù hợp: {tmpl.idealFor}
                            </span>

                            <button
                              type="button"
                              onClick={() => handleApplyTemplate(tmpl)}
                              className={`px-3 py-1 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors ${
                                isApplied
                                  ? 'bg-secondary text-on-secondary font-bold'
                                  : 'bg-surface-container-lowest hover:bg-white/10 text-primary border border-white/10'
                              }`}
                            >
                              {isApplied ? 'Đang Dùng' : 'Áp Dụng'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB 2: DIY PER-MONTH CUSTOMIZER                                */}
            {/* ============================================================== */}
            {activeTab === 'diy-months' && (
              <div className="bg-surface-container rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div>
                    <h3 className="font-serif text-xl text-primary">
                      Tự Thiết Kế: {currentMonth.title}
                    </h3>
                    <p className="text-xs text-on-surface-variant font-mono">
                      Tải ảnh của bạn, biên tập lời nhắn và video WebAR cho tháng này
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-secondary-container/40 text-secondary text-xs font-mono font-bold">
                    Trang {previewMonthIdx + 1}/12
                  </span>
                </div>

                {/* Photo Upload Section */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-mono text-on-surface-variant uppercase">
                    1. ẢNH NGHỆ THUẬT CỦA THÁNG *
                  </label>

                  {/* Hidden file input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />

                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-3 bg-surface-container-high hover:bg-surface-bright rounded-xl border border-dashed border-white/20 hover:border-secondary text-left transition-colors flex items-center gap-2.5"
                    >
                      <span className="material-symbols-outlined text-secondary text-xl">upload_file</span>
                      <div>
                        <div className="text-xs font-mono text-primary font-semibold">Tải Ảnh Từ Máy</div>
                        <div className="text-[10px] text-on-surface-variant">JPG, PNG, WebP độ nét cao</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsPhotoGalleryOpen(true)}
                      className="p-3 bg-surface-container-high hover:bg-surface-bright rounded-xl border border-white/10 hover:border-secondary text-left transition-colors flex items-center gap-2.5"
                    >
                      <span className="material-symbols-outlined text-secondary text-xl">photo_library</span>
                      <div>
                        <div className="text-xs font-mono text-primary font-semibold">Kho Ảnh Atelier</div>
                        <div className="text-[10px] text-on-surface-variant">Ảnh tuyển chọn bản quyền</div>
                      </div>
                    </button>
                  </div>

                  {/* Image URL fallback */}
                  <div className="pt-1">
                    <input
                      type="text"
                      value={currentMonth.image}
                      onChange={(e) => updateCurrentMonth('image', e.target.value)}
                      placeholder="Hoặc dán URL ảnh trực tiếp..."
                      className="w-full px-3 py-2 rounded-lg bg-surface-container-lowest border border-white/10 text-on-surface text-xs focus:outline-none focus:border-secondary font-mono"
                    />
                  </div>
                </div>

                {/* Text Customization: Title & Theme */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-on-surface-variant uppercase mb-1">
                      TIÊU ĐỀ THÁNG
                    </label>
                    <input
                      type="text"
                      value={currentMonth.title}
                      onChange={(e) => updateCurrentMonth('title', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-surface-container-lowest border border-white/10 text-on-surface text-xs focus:outline-none focus:border-secondary font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-on-surface-variant uppercase mb-1">
                      CHỦ ĐỀ KHOẢNH KHẮC
                    </label>
                    <input
                      type="text"
                      value={currentMonth.theme}
                      onChange={(e) => updateCurrentMonth('theme', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-surface-container-lowest border border-white/10 text-on-surface text-xs focus:outline-none focus:border-secondary font-sans"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-mono text-on-surface-variant uppercase mb-1">
                      LỜI TỰA / CÂU CHÂM NGÔN IN LÊN MẶT LỊCH
                    </label>
                    <input
                      type="text"
                      value={currentMonth.quote || ''}
                      onChange={(e) => updateCurrentMonth('quote', e.target.value)}
                      placeholder="Ví dụ: Nụ cười con cháu là đóa hoa xuân rực rỡ nhất trong nhà..."
                      className="w-full px-3 py-2 rounded-lg bg-surface-container-lowest border border-white/10 text-on-surface text-xs focus:outline-none focus:border-secondary font-sans"
                    />
                  </div>
                </div>

                {/* WebAR Video Metadata */}
                <div className="space-y-3 pt-3 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-base">view_in_ar</span>
                    <label className="text-xs font-mono text-primary font-semibold uppercase">
                      2. GẮN THƯỚC PHIM WEBAR 4K VÀO MẶT LỊCH
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                    <div className="sm:col-span-2">
                      <span className="text-[10px] text-on-surface-variant uppercase block mb-1">TÊN VIDEO 4K</span>
                      <input
                        type="text"
                        value={currentMonth.arVideoTitle}
                        onChange={(e) => updateCurrentMonth('arVideoTitle', e.target.value)}
                        className="w-full px-3 py-2 rounded bg-surface-container-lowest border border-white/10 text-on-surface"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-on-surface-variant uppercase block mb-1">THỜI LƯỢNG</span>
                      <input
                        type="text"
                        value={currentMonth.arVideoDuration}
                        onChange={(e) => updateCurrentMonth('arVideoDuration', e.target.value)}
                        className="w-full px-3 py-2 rounded bg-surface-container-lowest border border-white/10 text-on-surface"
                      />
                    </div>
                  </div>
                </div>

                {/* Layout & Aesthetic Options */}
                <div className="space-y-3 pt-3 border-t border-white/10">
                  <label className="block text-xs font-mono text-on-surface-variant uppercase">
                    3. BỐ CỤC & HIỆU ỨNG NGHỆ THUẬT
                  </label>

                  {/* Layout Selector */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono">
                    {[
                      { id: 'museum-border', label: 'Viền Bảo Tàng' },
                      { id: 'minimal-fullbleed', label: 'Tràn Viền' },
                      { id: 'polar-split', label: 'Chia Đôi' },
                      { id: 'gallery-square', label: 'Khung Vuông' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setLayoutStyle(item.id as any)}
                        className={`py-2 px-1 rounded-lg border transition-all ${
                          layoutStyle === item.id
                            ? 'bg-secondary text-on-secondary font-bold border-secondary'
                            : 'bg-surface-container-lowest border-white/10 text-on-surface-variant hover:text-primary'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  {/* Color Filter Selector */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] text-on-surface-variant font-mono uppercase block">BỘ LỌC MÀU ẢNH:</span>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 text-center text-[11px] font-mono">
                      {[
                        { id: 'none', label: 'Chuẩn Bản Sắc' },
                        { id: 'sepia', label: 'Ấm Vintage' },
                        { id: 'noir', label: 'Đen Trắng' },
                        { id: 'sunset', label: 'Hoàng Hôn' },
                        { id: 'botanical', label: 'Thảo Mộc' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setColorFilter(item.id as any)}
                          className={`py-1.5 rounded border transition-colors ${
                            colorFilter === item.id
                              ? 'bg-secondary/30 text-secondary font-bold border-secondary'
                              : 'bg-surface-container-lowest text-on-surface-variant border-white/10 hover:text-primary'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font Family Selector */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] text-on-surface-variant font-mono uppercase block">PHÔNG CHỮ MẶT LỊCH:</span>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                      {[
                        { id: 'serif', label: 'Serif Quý Tộc' },
                        { id: 'sans', label: 'Sans Hiện Đại' },
                        { id: 'mono', label: 'Monospace Chuẩn' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setFontFamily(item.id as any)}
                          className={`py-2 rounded-lg border transition-colors ${
                            fontFamily === item.id
                              ? 'bg-secondary/30 text-secondary font-bold border-secondary'
                              : 'bg-surface-container-lowest text-on-surface-variant border-white/10 hover:text-primary'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      if (previewMonthIdx > 0) setPreviewMonthIdx(previewMonthIdx - 1);
                    }}
                    disabled={previewMonthIdx === 0}
                    className="px-3 py-2 bg-surface-container-high hover:bg-surface-bright disabled:opacity-30 rounded-lg text-xs font-mono text-primary flex items-center gap-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                    <span>Tháng Trước</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      showToast(`Đã lưu hoàn tất thiết kế cho ${currentMonth.title}!`);
                    }}
                    className="px-4 py-2 bg-primary-container text-on-primary-container hover:bg-primary rounded-lg text-xs font-mono font-bold uppercase transition-colors"
                  >
                    Lưu Tháng Này
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (previewMonthIdx < 11) setPreviewMonthIdx(previewMonthIdx + 1);
                    }}
                    disabled={previewMonthIdx === 11}
                    className="px-3 py-2 bg-surface-container-high hover:bg-surface-bright disabled:opacity-30 rounded-lg text-xs font-mono text-primary flex items-center gap-1 transition-colors"
                  >
                    <span>Tháng Tiếp</span>
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* TAB 3: CRAFT SPECS: STAND / FRAME & 100% FINE-ART PAPER       */}
            {/* ============================================================== */}
            {activeTab === 'craft-specs' && (
              <div className="bg-surface-container rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
                <div className="pb-3 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-serif text-xl text-primary">
                      Đế Gỗ Dễ Tìm, Khung & Giấy Mỹ Thuật In Ấn
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-0.5 font-sans">
                      In 100% trên giấy mỹ thuật cao cấp • Sử dụng đế gỗ tự nhiên phổ thông hoặc khung để bàn tiện dụng
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-300 px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/30 shrink-0 self-start sm:self-auto flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    100% In Trên Giấy (Không In Lên Gỗ)
                  </span>
                </div>

                {/* Clear Material & Craftsmanship Commitment Box */}
                <div className="p-4 rounded-xl bg-surface-container-lowest border border-white/10 flex items-start gap-3 text-xs leading-relaxed">
                  <span className="material-symbols-outlined text-secondary text-lg shrink-0 mt-0.5">verified</span>
                  <div className="space-y-1">
                    <div className="font-mono text-secondary font-semibold uppercase tracking-wider text-[11px]">
                      Cam Kết Chất Liệu & Tiện Dụng:
                    </div>
                    <div className="text-on-surface-variant font-sans">
                      Toàn bộ 12 tháng lịch và bìa được <strong className="text-white">in 100% trên giấy mỹ thuật cao cấp nhập khẩu</strong> (Cotton Hahnemühle 310gsm Đức, Fedrigoni Ý). Khối đế gỗ tự nhiên hoặc khung để bàn tiêu chuẩn là các vật liệu cực kỳ dễ tìm, bền đẹp và thân thiện, chỉ đóng vai trò làm giá đỡ hoặc khung bảo vệ thẻ lịch giấy, <strong className="text-white">hoàn toàn không in trực tiếp lên gỗ</strong>.
                    </div>
                  </div>
                </div>

                {/* 1. Stand & Frame Selection */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-mono text-on-surface-variant uppercase">
                      1. VẬT LIỆU CHÂN ĐẾ GỖ HOẶC KHUNG ĐỂ BÀN (DỄ TÌM, TIỆN DỤNG)
                    </label>
                    <span className="text-[10px] text-secondary font-mono">Dễ gia công & dễ thay thế</span>
                  </div>
                  <div className="space-y-2.5">
                    {standOptions.map((stand) => (
                      <div
                        key={stand.id}
                        onClick={() => setSelectedWood(stand.id as any)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          selectedWood === stand.id
                            ? 'bg-secondary-container/30 border-secondary ring-1 ring-secondary'
                            : 'bg-surface-container-lowest border-white/10 hover:border-white/30'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg ${stand.colorClass} border border-white/20 shrink-0 shadow-sm flex items-center justify-center text-white/70`}>
                            <span className="material-symbols-outlined text-sm">
                              {stand.id === 'ebony' ? 'crop_portrait' : 'deck'}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-serif text-sm text-primary font-medium">{stand.name}</span>
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-secondary border border-white/10">
                                {stand.tag}
                              </span>
                            </div>
                            <div className="text-[11px] text-on-surface-variant line-clamp-1 mt-0.5">{stand.desc}</div>
                          </div>
                        </div>
                        {selectedWood === stand.id && (
                          <span className="material-symbols-outlined text-secondary text-xl">check_circle</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Fine-Art Paper Selection (100% on paper) */}
                <div className="space-y-3 pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-mono text-on-surface-variant uppercase">
                      2. CHẤT LIỆU GIẤY IN MỸ THUẬT (100% IN TRÊN GIẤY - KHÔNG DÙNG GỖ)
                    </label>
                    <span className="text-[10px] text-emerald-400 font-mono">Chuẩn Bảo Tàng FOGRA39</span>
                  </div>
                  <div className="space-y-2.5">
                    {paperOptions.map((paper) => (
                      <div
                        key={paper.id}
                        onClick={() => setSelectedPaper(paper.id as any)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          selectedPaper === paper.id
                            ? 'bg-secondary-container/30 border-secondary ring-1 ring-secondary'
                            : 'bg-surface-container-lowest border-white/10 hover:border-white/30'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg ${paper.colorClass} border border-white/20 shrink-0 shadow-sm flex items-center justify-center text-neutral-800`}>
                            <span className="material-symbols-outlined text-sm">description</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-serif text-sm text-primary font-medium">{paper.name}</span>
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-secondary border border-white/10">
                                {paper.tag}
                              </span>
                            </div>
                            <div className="text-[11px] text-on-surface-variant line-clamp-1 mt-0.5">{paper.desc}</div>
                          </div>
                        </div>
                        {selectedPaper === paper.id && (
                          <span className="material-symbols-outlined text-secondary text-xl">check_circle</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Laser Engraving on Wood Base or Frame Tag */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-mono text-on-surface-variant uppercase">
                      3. NỘI DUNG KHẮC LASER TÊN RIÊNG LÊN ĐẾ GỖ / VIỀN KHUNG
                    </label>
                    <span className="text-[10px] text-secondary font-mono">
                      {selectedWood === 'ebony' ? 'Khắc nhãn kim loại gắn khung' : 'Khắc laser chìm 0.5mm mặt trước đế gỗ'}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={engravingText}
                    onChange={(e) => setEngravingText(e.target.value)}
                    placeholder="Ví dụ: Kính tặng Cha Mẹ - Kỷ Niệm 2025"
                    className="w-full px-4 py-2.5 rounded-lg bg-surface-container-lowest border border-white/10 text-on-surface focus:outline-none focus:border-secondary font-sans text-sm"
                  />
                </div>
              </div>
            )}

            {/* Bottom Checkout & Production Action Card */}
            <div className="p-5 bg-surface-container rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-on-surface-variant">TỔNG ẤN BẢN CHẾ TÁC:</span>
                <span className="text-titanium font-serif text-lg font-bold">1.850.000 ₫</span>
              </div>

              <button
                onClick={() => onNavigate('checkout')}
                className="w-full py-3.5 bg-primary-container text-on-primary-container hover:bg-primary font-label-md text-xs uppercase tracking-wider font-bold rounded-xl shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <span>TIẾN HÀNH ĐẶT IN ẤN & THANH TOÁN</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>

              <div className="flex items-center justify-between gap-2 pt-1 text-[11px] font-mono text-on-surface-variant">
                <button
                  onClick={() => onNavigate('about-us')}
                  className="hover:text-primary transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-xs">verified</span>
                  <span>Quy Chuẩn In Ấn Bảo Tàng</span>
                </button>

                <button
                  onClick={() => onNavigate('collaborative-portal')}
                  className="hover:text-primary transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-xs">group_add</span>
                  <span>Mời Người Thân Gửi Lời Chúc</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal: Curated Photo Gallery Picker */}
        {isPhotoGalleryOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-surface-container border border-white/15 rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-fade-in">
              <div className="p-5 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg text-primary">Kho Ảnh Nghệ Thuật Giám Tuyển Atelier</h3>
                  <p className="text-xs text-on-surface-variant font-mono">Chọn ảnh chất lượng cao chuẩn FOGRA39 cho {currentMonth.title}</p>
                </div>
                <button
                  onClick={() => setIsPhotoGalleryOpen(false)}
                  className="p-1 rounded-lg text-on-surface-variant hover:text-primary hover:bg-white/10"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6 flex-1">
                {CURATED_PHOTO_LIBRARY.map((cat) => (
                  <div key={cat.category} className="space-y-3">
                    <h4 className="font-mono text-xs text-secondary uppercase font-semibold">
                      {cat.category}
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {cat.photos.map((item) => (
                        <div
                          key={item.title}
                          onClick={() => {
                            updateCurrentMonth('image', item.url);
                            setIsPhotoGalleryOpen(false);
                            showToast(`Đã chọn ảnh "${item.title}" cho ${currentMonth.title}!`);
                          }}
                          className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer border border-white/10 hover:border-secondary transition-all"
                        >
                          <img src={item.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 p-2 flex items-end">
                            <span className="text-[11px] font-mono text-white leading-tight line-clamp-1">
                              {item.title}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => setIsPhotoGalleryOpen(false)}
                  className="px-4 py-2 bg-surface-container-high hover:bg-surface-bright text-xs font-mono rounded-lg"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
