import React from 'react';
import { ScreenId } from '../types';
import { BRAND_LOGO_URL } from '../data/mockData';

interface AboutUsScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const AboutUsScreen: React.FC<AboutUsScreenProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#121316] text-[#e3e2e6] pt-28 pb-20 px-4 sm:px-6 lg:px-10">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-mono uppercase tracking-widest">
            <span>✦ VỀ CHÚNG TÔI • LUMICAL ATELIER ✦</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-primary tracking-wide">
            Nghệ Thuật In Ấn Bảo Tàng & Ký Ức Sống Động
          </h1>
          <p className="font-sans text-sm sm:text-base text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            LumiCal kết tinh giữa thủ công truyền thống và công nghệ Phygital WebAR tiên phong, lưu giữ những khoảnh khắc quý giá nhất của cuộc đời trên nền giấy mỹ thuật tiêu chuẩn bảo tàng trăm năm.
          </p>
        </div>

        {/* Brand Story Hero Image / Card */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-surface-container p-8 sm:p-12 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
            <div className="space-y-6">
              <span className="font-mono text-xs text-secondary tracking-widest uppercase">
                CÂU CHUYỆN KHỞI NGUỒN
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-primary leading-snug">
                Khi Ký Ức Không Chỉ Nằm Trên Màn Hình
              </h2>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Trong kỷ nguyên số hóa, những bức ảnh gia đình, những thước phim kỷ niệm thường trôi đi vô tình trong các kho lưu trữ trực tuyến. LumiCal Atelier ra đời với sứ mệnh mang ký ức trở lại không gian thực tại — hiện hữu qua từng thớ giấy mỹ thuật Cotton 100%, chạm đến xúc giác và sống dậy bằng âm thanh, giọng nói qua WebAR chỉ với một cái quét camera không cần cài ứng dụng.
              </p>
              <div className="pt-2 flex items-center gap-4">
                <button
                  onClick={() => onNavigate('design-studio')}
                  className="px-6 py-3 rounded-xl bg-primary-container text-on-primary-container hover:bg-primary font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-lg flex items-center gap-2"
                >
                  <span>Khởi Tạo Lịch Của Bạn</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
                <button
                  onClick={() => onNavigate('webar-scanner')}
                  className="px-6 py-3 rounded-xl bg-surface-container-high hover:bg-surface-bright text-primary font-mono text-xs uppercase tracking-wider transition-all border border-white/10 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">view_in_ar</span>
                  <span>Trải Nghiệm WebAR</span>
                </button>
              </div>
            </div>

            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/60 flex items-center justify-center p-6">
              <img
                src={BRAND_LOGO_URL}
                alt="LumiCal Monogram"
                className="w-32 h-32 object-contain opacity-90 drop-shadow-[0_10px_20px_rgba(212,175,55,0.3)] animate-pulse"
              />
              <div className="absolute bottom-4 inset-x-4 text-center">
                <span className="font-mono text-[10px] text-secondary tracking-widest uppercase">
                  PARIS • TOKYO • SAIGON ATELIER
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Core Craftsmanship Standards */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <span className="font-mono text-xs text-secondary tracking-widest uppercase">
              TIÊU CHUẨN KỸ THUẬT KHẮT KHE
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-primary">
              Quy Chuẩn Chế Tác Độc Bản
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface-container p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-2xl">description</span>
              </div>
              <h4 className="font-serif text-lg text-primary">100% Giấy Mỹ Thuật Museum Grade</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Sử dụng dòng giấy Hahnemühle Cotton 310gsm (Đức) và Fedrigoni Materica (Ý) không chứa axit, tuổi thọ bảo tàng trên 100 năm, giữ màu sắc chuẩn xác tuyệt đối theo tiêu chuẩn FOGRA39.
              </p>
            </div>

            <div className="bg-surface-container p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-2xl">deck</span>
              </div>
              <h4 className="font-serif text-lg text-primary">Đế Gỗ Tự Nhiên & Khung Tiêu Chuẩn</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Đế gỗ thông mộc xẻ rãnh hoặc đế gỗ sồi tự nhiên thân thiện, cực kỳ dễ tìm và bền đẹp. Cam kết in 100% trên giấy mỹ thuật, không in trực tiếp lên gỗ, bảo vệ trọn vẹn nét đẹp mộc mạc.
              </p>
            </div>

            <div className="bg-surface-container p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-2xl">view_in_ar</span>
              </div>
              <h4 className="font-serif text-lg text-primary">Công Nghệ WebAR 60FPS</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Mỗi tháng lịch tích hợp một đoạn video kỷ niệm và giọng nói riêng tư. Quét trực tiếp bằng camera điện thoại trên nền tảng web, không cần cài đặt bất kỳ ứng dụng phức tạp nào.
              </p>
            </div>
          </div>
        </div>

        {/* Atelier Locations & Contact */}
        <div className="bg-surface-container-lowest p-8 rounded-3xl border border-white/10 space-y-6 text-center">
          <span className="font-mono text-xs text-secondary tracking-widest uppercase">
            HỆ THỐNG XƯỞNG CHẾ TÁC & TRƯNG BÀY
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div className="p-4 rounded-xl bg-surface-container border border-white/5 space-y-2">
              <div className="font-serif text-primary font-medium text-sm">Saigon Atelier</div>
              <div className="text-xs text-on-surface-variant font-mono">Thảo Điền, TP. Thủ Đức, TP. Hồ Chí Minh</div>
            </div>
            <div className="p-4 rounded-xl bg-surface-container border border-white/5 space-y-2">
              <div className="font-serif text-primary font-medium text-sm">Tokyo Studio</div>
              <div className="text-xs text-on-surface-variant font-mono">Minato-ku, Tokyo, Japan</div>
            </div>
            <div className="p-4 rounded-xl bg-surface-container border border-white/5 space-y-2">
              <div className="font-serif text-primary font-medium text-sm">Paris Maison</div>
              <div className="text-xs text-on-surface-variant font-mono">Rue Saint-Honoré, 75001 Paris, France</div>
            </div>
          </div>
          <div className="pt-4 flex justify-center">
            <button
              onClick={() => onNavigate('checkout')}
              className="px-8 py-3.5 rounded-xl bg-secondary text-on-secondary font-bold font-mono text-xs uppercase tracking-wider hover:bg-secondary/90 transition-all shadow-xl"
            >
              Đặt Chế Tác Bộ Lịch Atelier Ngay
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
