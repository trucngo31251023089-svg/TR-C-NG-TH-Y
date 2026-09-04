import React, { useState } from 'react';
import { ScreenId } from '../types';
import { DESIGN_TEMPLATES } from '../data/templateData';

interface HomeScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  const [activePhygitalView, setActivePhygitalView] = useState<'both' | 'print' | 'ar'>('both');

  const editions = [
    {
      id: 'desk',
      name: 'ATELIER DESK EDITION',
      sub: 'Lịch Thẻ Để Bàn Mỹ Thuật',
      price: '1.250.000 ₫',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7JpK0QF3C4XYFe9sn7qwDkCU4z6N3GOQNIgPdEAKlJTBfoN2IpXgsp0LkqJTxGj_EH_GQv-OXcIKmqDbSVZ7k1hoB4J5PMx0dD5BdnNvZ-WSh8qU6-9Gz32LYLD8O5P3av4WRXwInV9NYk_d9NuQwVPJsQdLqnfjqL81P5TxgGLheiQKfLDTQVRmt7Du8k_NuX7gBqb5sBzVnynPhuL4OEGbRLhGQ3b_aErb7eRx0A8DKSKyZqoJZ',
      features: [
        'Kích thước: 16 x 24 cm tiêu chuẩn',
        '100% In trên giấy mỹ thuật Cotton Archival 300gsm (12 thẻ tháng)',
        'Đế gỗ tự nhiên tiện rãnh dễ tìm (hoặc khung để bàn tiêu chuẩn)',
        'Khắc laser tên riêng lên đế gỗ hoặc khung theo yêu cầu',
        'WebAR 60FPS không cần cài app'
      ],
      popular: true
    },
    {
      id: 'wall',
      name: 'HERITAGE WALL EDITION',
      sub: 'Lịch Tranh Treo Tường Khổ Lớn',
      price: '2.850.000 ₫',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8lHOeNQ9g87caPr6QZTkT2SKgbWRDZNNVtBSpwfsIXqiDoHb8gjcanCOey_I0hqjQMjunj_G2HlOTTOFVxHHfzgpA9t1xyuGbou7u9otdC7o65j7LFdeapZ3GJKGhzmy24azAWUPOdu8pfUL59N8mSDRMBwEFCVFJrNSQiL70uUMOEtjAaRM38GDaegpZrX_loXkmnXg3m5fe3lAHX2ttaIeOPquUjcEDVZfYAIcMaBs5olokP2UE',
      features: [
        'Kích thước: 40 x 60 cm Gallery Size',
        'Nẹp gáy giấy mỹ thuật ép nhiệt dập nổi',
        'Cotton Rag 350gsm phủ bảo vệ nano',
        'AR Video 4K HDR & Âm thanh vòm Spatial',
        'Bảo hành màu sắc bảo tàng 50 năm'
      ],
      popular: false
    },
    {
      id: 'bespoke',
      name: 'BESPOKE CORPORATE & VAULT',
      sub: 'Đặt Riêng Cho Doanh Nghiệp & Gia Đình',
      price: 'Theo Thiết Kế',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDX1DInEw6PbI9IKThiRviLLvupeSPfpVEjGkxFE53c3VjjYjIrhDsNWLb1BO_g6m8XO2XZzv1rFwGm7W0MTpVpSac5pEGZT0c7Nw0BkllSZtEX9uZjiSC7gDRenmVpbigmD-SG9SSdBYpENQ4_7YS2qatOrNyXWOqCwjw-3EQD1P0xIP4qCZvkyze2hmT4sBvBBCU6vay5gpukhuIVVklap6kH4IvenBIKH-LJH-tm8wvkxtO5t5s',
      features: [
        'Tùy chỉnh chất liệu: Giấy Hahnemühle Đức, Fedrigoni Ý, Rives Pháp',
        'Dập chìm / Ép kim tên riêng cá nhân hóa',
        'Hộp giấy mỹ thuật ép nhũ thủ công cao cấp',
        'Mã hóa bảo mật cấp độ phòng trưng bày',
        'Chuyên viên giám tuyển riêng phục vụ'
      ],
      popular: false
    }
  ];

  return (
    <div className="w-full min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-6 space-y-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-surface-container-high border border-outline-variant/30">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              <span className="font-label-sm text-[11px] tracking-[0.24em] text-secondary uppercase font-mono">
                PHYGITAL CHRONICLES / EDITION 2025
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-primary leading-[1.08] tracking-tight font-normal">
              Biến Từng Khoảnh Khắc <br />
              Thành <span className="italic font-normal text-secondary">Kỷ Niệm Sống Động.</span>
            </h1>

            <p className="font-body-lg text-base sm:text-lg text-on-surface-variant max-w-xl leading-relaxed">
              Sự kết hợp giữa in ấn chất lượng cao và công nghệ thực tế tăng cường WebAR. Chỉ cần dùng điện thoại quét lịch để xem lại những thước phim video kỷ niệm ấm áp — hoàn toàn không cần cài đặt ứng dụng.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('design-studio')}
                className="px-7 py-3.5 bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary font-label-md text-xs tracking-widest uppercase font-semibold rounded shadow-lg transition-all flex items-center gap-2 group"
              >
                <span>TỰ THIẾT KẾ LỊCH NGAY</span>
                <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>

              <button
                onClick={() => onNavigate('webar-scanner')}
                className="px-6 py-3.5 bg-surface-container-high hover:bg-surface-bright border border-outline-variant/40 text-primary font-label-md text-xs tracking-widest uppercase rounded transition-all flex items-center gap-2 group"
              >
                <span className="material-symbols-outlined text-secondary text-base group-hover:scale-110 transition-transform">
                  view_in_ar
                </span>
                <span>QUÉT WEBAR DEMO</span>
              </button>
            </div>

            {/* Trust Specs Strip */}
            <div className="pt-6 border-t border-outline-variant/20 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <div className="font-mono text-xs text-secondary font-semibold">100% COTTON</div>
                <div className="text-[11px] text-on-surface-variant">Chuẩn giấy bảo tàng Ý</div>
              </div>
              <div>
                <div className="font-mono text-xs text-secondary font-semibold">WEBAR 60FPS</div>
                <div className="text-[11px] text-on-surface-variant">Không cần cài ứng dụng</div>
              </div>
              <div>
                <div className="font-mono text-xs text-secondary font-semibold">100% GIẤY MỸ THUẬT</div>
                <div className="text-[11px] text-on-surface-variant">Cotton Archival Châu Âu</div>
              </div>
              <div>
                <div className="font-mono text-xs text-secondary font-semibold">E2EE 256-BIT</div>
                <div className="text-[11px] text-on-surface-variant">Bảo mật kỷ niệm gia đình</div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Master Imagery */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-surface-container-lowest aspect-[4/3] group">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2FmoSFOBzht0yH4MZMlYlytC-8OdF9l_uw7KFa3u_5IfPOSJQuSjdninGVtykFnLXkj__okqqiZjs7ZExoHRb_uQ7zKDsfuj5YSrWn6BU4-qOFFl2Q970Z6TtFqWQqoAYrXVVhGoO08lV2WvztzGqqaRCGvrv91HHyabpG3xQRPsxpt0i2PO70zpjjkaNIov_CSLKM1-dSHecC9_zimaVmZ7mNhJbvoQVvok42ub_o839IYpeqBN2"
                alt="LumiCal Bespoke Fine Art Paper Calendar"
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
              />

              {/* Optical Scanning Simulation Accent */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>

              {/* Laser Scan line subtle indicator */}
              <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-[1px] bg-secondary/50 shadow-[0_0_8px_#bbcac1] pointer-events-none"></div>

              {/* Floating Overlays */}
              <div className="absolute top-4 left-4 bg-surface-container-lowest/80 backdrop-blur-md px-3 py-1.5 rounded border border-white/10 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                <span className="font-mono text-[10px] text-secondary tracking-widest uppercase">
                  OPTICAL RECOGNITION READY
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 bg-surface-container/90 backdrop-blur-md p-4 rounded-xl border border-white/10 flex items-center justify-between">
                <div>
                  <span className="font-mono text-[10px] text-secondary tracking-wider block">THÁNG 05 • ĐÀ LẠT 2024</span>
                  <span className="font-serif text-sm text-primary">Kỷ niệm 10 năm - Thung lũng ngàn hoa</span>
                </div>
                <button
                  onClick={() => onNavigate('webar-scanner')}
                  className="px-3 py-1.5 bg-secondary-container hover:bg-secondary text-on-secondary-container hover:text-on-secondary text-xs rounded transition-colors flex items-center gap-1.5 font-medium"
                >
                  <span className="material-symbols-outlined text-sm">play_circle</span>
                  <span>Đánh Thức AR</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Phygital Contrast Interactive Demo Section */}
      <section className="w-full bg-surface-container-low border-y border-outline-variant/20 py-20">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="font-label-sm text-xs tracking-widest text-secondary uppercase font-mono">
              TRIẾT LÝ HAI MẶT CỦA THỰC THỂ
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-primary font-normal">
              Đối Nghịch & Hòa Hợp: Từ Vật Lý Đến Không Gian
            </h2>
            <p className="font-body-md text-sm text-on-surface-variant">
              Khám phá sự chuyển hóa diệu kỳ khi một tác phẩm in ấn tĩnh lặng bỗng chốc trở thành rạp chiếu ký ức chuyển động 4K.
            </p>

            {/* View switcher */}
            <div className="inline-flex p-1 rounded-lg bg-surface-container border border-white/10 pt-1">
              <button
                onClick={() => setActivePhygitalView('both')}
                className={`px-4 py-1.5 text-xs rounded uppercase tracking-wider font-mono transition-colors ${
                  activePhygitalView === 'both' ? 'bg-primary-container text-on-primary-container font-semibold' : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                Song Hành Cùng Lúc
              </button>
              <button
                onClick={() => setActivePhygitalView('print')}
                className={`px-4 py-1.5 text-xs rounded uppercase tracking-wider font-mono transition-colors ${
                  activePhygitalView === 'print' ? 'bg-primary-container text-on-primary-container font-semibold' : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                Chỉ Vật Lý In Ấn
              </button>
              <button
                onClick={() => setActivePhygitalView('ar')}
                className={`px-4 py-1.5 text-xs rounded uppercase tracking-wider font-mono transition-colors ${
                  activePhygitalView === 'ar' ? 'bg-primary-container text-on-primary-container font-semibold' : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                Chỉ Không Gian WebAR
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Physical Print Card */}
            {(activePhygitalView === 'both' || activePhygitalView === 'print') && (
              <div className="bg-surface-container rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-secondary tracking-widest uppercase">
                      THỂ VẬT LÝ • STATIC PRINT
                    </span>
                    <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant text-[10px] font-mono">
                      FOGRA39 CERTIFIED
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl text-primary">Ấn Phẩm Mỹ Thuật Thuần Khiết</h3>
                  <p className="font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    Giấy mỹ thuật Eramo 300gsm từ Ý, không chứa axit, giữ màu nguyên bản qua hàng thế kỷ. Bề mặt nhám mờ quang học triệt tiêu ánh sáng chói, tôn vinh độ sâu của từng mảng bóng đổ.
                  </p>
                </div>

                <div className="relative rounded-xl overflow-hidden aspect-[4/3] border border-white/10 bg-black/40">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZOxgyGfYerczQIHtCgFougznVHp2IWOrCQj-Og2N7nnBhbN-UsxjjlIKp6jiPS2sRXWZgbVUFqc-c2xjjd-3-4m9usgZq20-Q3r0wzt6vK-8jB3AOIUBthx2uRezXQZyxL8TbuhRGkQdc1GkqlzhSgGTYVfarXH0WifbSCSdhE1gV_7PuNdaXFTr_EWxEe4rkvVA7XNx6L9aCinvkDxoAxtY1mSiCvj0IuPIVfWnr3_Ho4WytM6aE"
                    alt="Physical Fine Art Print"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm px-3 py-1 rounded text-[11px] font-mono text-titanium">
                    Độ phân giải in: 2400 DPI Ultra-HD
                  </div>
                </div>

                <ul className="space-y-2 text-xs font-sans text-on-surface-variant">
                  <li className="flex items-center gap-2">
                    <span className="text-secondary">✦</span> Mực khoáng Pigment kháng tia cực tím
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-secondary">✦</span> Cắt viền Laser Micro-Precision sai số dưới 0.1mm
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-secondary">✦</span> Chạm khắc tên & lời chúc ý nghĩa theo yêu cầu
                  </li>
                </ul>
              </div>
            )}

            {/* Augmented AR Card */}
            {(activePhygitalView === 'both' || activePhygitalView === 'ar') && (
              <div className="bg-surface-container rounded-2xl p-6 sm:p-8 border border-secondary/30 space-y-6 flex flex-col justify-between relative overflow-hidden shadow-2xl">
                <div className="absolute -right-20 -top-20 w-60 h-60 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-secondary tracking-widest uppercase">
                      THỂ KHÔNG GIAN • WEBAR AWAKEN
                    </span>
                    <span className="px-2 py-0.5 rounded bg-secondary-container text-secondary text-[10px] font-mono animate-pulse">
                      60 FPS ZERO-APP
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl text-primary">Thực Tại Tăng Cường Thức Tỉnh</h3>
                  <p className="font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    Chỉ cần hướng camera điện thoại vào trang lịch, bức ảnh tĩnh lập tức tan biến vào đoạn video 4K sống động với âm thanh vòm không gian và phong thư chúc mừng ẩn giấu.
                  </p>
                </div>

                <div className="relative rounded-xl overflow-hidden aspect-[4/3] border border-secondary/40 bg-black">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2dOO4hMG98-j35ZHbdhglaeNCMZ4KGumJcoPb8RItz_moNFhZzE6CeY_5_Su973XHQGOB-yaeSn_nAuFUR0wJGyB5JwduvXjP2l6oOMopXRdJCQlog0frkVZA3CSXlABM6mDtjSxWamGmir4ILDPKX6NhQfDA9Bvp1DsS9B4jQ0Ud_Vo-teG-1Lo_XpLZ-505NLGYG3gHBWJ2M7B7PaeqiGJgEmFExdIjUJXPyuhwGpKrc-aSvZSB"
                    alt="WebAR Awakening Space"
                    className="w-full h-full object-cover"
                  />
                  {/* AR UI reticle overlay */}
                  <div className="absolute inset-4 border border-secondary/60 rounded pointer-events-none flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border border-secondary/80 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-secondary"></div>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 bg-secondary-container/90 backdrop-blur-sm px-2.5 py-1 rounded text-[10px] font-mono text-secondary">
                    Spatial Audio FLAC ON
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="font-mono text-xs text-on-surface-variant">Tương thích iOS Safari & Android Chrome</span>
                  <button
                    onClick={() => onNavigate('webar-scanner')}
                    className="px-4 py-2 bg-primary text-on-primary font-label-md text-xs uppercase tracking-wider rounded font-medium hover:bg-white transition-colors"
                  >
                    Bật Camera Ngay
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Suggested Curated Templates & AI Stylist Section */}
      <section className="w-full bg-[#121316] py-20 border-b border-outline-variant/20">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="font-label-sm text-xs tracking-widest text-secondary uppercase font-mono">
                BỘ SƯU TẬP MẪU THIẾT KẾ GIÁM TUYỂN
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-primary font-normal">
                Tự Thiết Kế Hoặc Chọn Mẫu Độc Bản
              </h2>
              <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                Khám phá 6 phong cách định hình sẵn từ Atelier hoặc sử dụng Trợ lý Stylist AI để tự tay chế tác bộ lịch cá nhân với ảnh, lời tựa và video WebAR 4K của chính bạn.
              </p>
            </div>

            <button
              onClick={() => onNavigate('design-studio')}
              className="px-6 py-3 bg-primary-container text-on-primary-container hover:bg-primary font-mono text-xs uppercase tracking-wider rounded-xl font-bold transition-all shadow-lg flex items-center gap-2 shrink-0 self-start md:self-auto"
            >
              <span className="material-symbols-outlined text-base">auto_awesome</span>
              <span>Mở Studio Tự Thiết Kế & AI</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DESIGN_TEMPLATES.map((tmpl) => (
              <div
                key={tmpl.id}
                onClick={() => onNavigate('design-studio')}
                className="bg-surface-container rounded-2xl p-5 border border-white/10 hover:border-secondary/50 transition-all cursor-pointer group flex flex-col justify-between space-y-4 shadow-lg hover:-translate-y-1"
              >
                <div className="space-y-3">
                  <div className="aspect-[16/10] rounded-xl overflow-hidden bg-black relative border border-white/5">
                    <img
                      src={tmpl.coverImage}
                      alt={tmpl.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[10px] font-mono text-secondary border border-white/10">
                      100% Giấy Mỹ Thuật
                    </div>
                  </div>

                  <div>
                    <h3 className="font-serif text-lg text-primary group-hover:text-secondary transition-colors">
                      {tmpl.name}
                    </h3>
                    <p className="text-xs text-on-surface-variant line-clamp-2 mt-1">
                      {tmpl.tagline}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {tmpl.previewTags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded bg-surface-container-high text-[10px] font-mono text-on-surface-variant"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                  <span className="text-secondary text-[11px] truncate max-w-[180px]">
                    {tmpl.idealFor}
                  </span>
                  <span className="text-primary group-hover:translate-x-1 transition-transform flex items-center gap-1 font-semibold">
                    <span>Chọn Mẫu Này</span>
                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Editions Collection */}
      <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-20 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <span className="font-label-sm text-xs tracking-widest text-secondary uppercase font-mono">
              BỘ SƯU TẬP NIÊN LỊCH 2025
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-primary font-normal">
              Các Phiên Bản Chế Tác
            </h2>
            <p className="font-body-md text-sm text-on-surface-variant max-w-xl">
              Mỗi bộ lịch là một tác phẩm độc bản được đánh số thứ tự trong kho lưu trữ của Atelier.
            </p>
          </div>

          <button
            onClick={() => onNavigate('design-studio')}
            className="px-5 py-2.5 bg-surface-container-high hover:bg-surface-bright text-primary border border-white/10 rounded text-xs uppercase tracking-wider transition-colors self-start md:self-auto"
          >
            Tùy Chỉnh Theo Ý Thích
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {editions.map((edition) => (
            <div
              key={edition.id}
              className={`bg-surface-container rounded-2xl p-6 border transition-all hover:border-primary/50 flex flex-col justify-between ${
                edition.popular ? 'border-primary/40 ring-1 ring-primary/30' : 'border-white/10'
              }`}
            >
              <div className="space-y-4">
                {edition.popular && (
                  <span className="inline-block px-2.5 py-0.5 rounded bg-primary-container text-on-primary-container font-mono text-[10px] tracking-wider uppercase font-semibold">
                    ĐƯỢC ƯU CHUỘNG NHẤT
                  </span>
                )}

                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-black/40 border border-white/5">
                  <img
                    src={edition.image}
                    alt={edition.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div>
                  <h3 className="font-serif text-xl text-primary">{edition.name}</h3>
                  <div className="font-body-sm text-xs text-on-surface-variant">{edition.sub}</div>
                  <div className="font-mono text-lg text-secondary font-semibold mt-2">{edition.price}</div>
                </div>

                <ul className="space-y-2 text-xs font-sans text-on-surface-variant pt-2 border-t border-white/5">
                  {edition.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-secondary shrink-0 text-xs">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => onNavigate('checkout')}
                  className={`w-full py-3 rounded text-xs font-label-md tracking-wider uppercase font-semibold transition-colors ${
                    edition.popular 
                      ? 'bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary' 
                      : 'bg-surface-container-high hover:bg-surface-bright text-primary border border-white/10'
                  }`}
                >
                  ĐẶT CHẾ TÁC PHIÊN BẢN NÀY
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4-Step Process Section */}
      <section className="w-full bg-surface-container-low border-y border-outline-variant/20 py-20">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="font-label-sm text-xs tracking-widest text-secondary uppercase font-mono">
              HÀNH TRÌNH CHẾ TÁC
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-primary font-normal">
              Quy Trình 4 Bước Tạo Tác Phẩm
            </h2>
            <p className="font-body-md text-sm text-on-surface-variant">
              Từ ý tưởng ban đầu đến tác phẩm nghệ thuật hiện diện trên bàn làm việc của bạn.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div 
              onClick={() => onNavigate('design-studio')}
              className="bg-surface-container p-6 rounded-xl border border-white/5 space-y-3 cursor-pointer hover:border-secondary/40 transition-colors"
            >
              <span className="font-mono text-2xl text-secondary">01</span>
              <h4 className="font-serif text-lg text-primary">Giám Tuyển 12 Khoảnh Khắc</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Lựa chọn 12 bức ảnh đại diện cho từng tháng trong năm cùng thước phim 4K đi kèm.
              </p>
            </div>

            <div 
              onClick={() => onNavigate('collaborative-portal')}
              className="bg-surface-container p-6 rounded-xl border border-white/5 space-y-3 cursor-pointer hover:border-secondary/40 transition-colors"
            >
              <span className="font-mono text-2xl text-secondary">02</span>
              <h4 className="font-serif text-lg text-primary">Thu Thập Lời Chúc Bí Mật</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Gửi liên kết riêng tư để bạn bè, người thân ghi âm giọng nói và gửi lời chúc vào từng tháng.
              </p>
            </div>

            <div 
              onClick={() => onNavigate('about-us')}
              className="bg-surface-container p-6 rounded-xl border border-white/5 space-y-3 cursor-pointer hover:border-secondary/40 transition-colors"
            >
              <span className="font-mono text-2xl text-secondary">03</span>
              <h4 className="font-serif text-lg text-primary">In Mỹ Thuật & Bồi Giấy Thủ Công</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Xưởng thủ công tiến hành in phủ bảo tàng FOGRA39, bồi ép giấy mỹ thuật 3 lớp và dập kim tên riêng cá nhân hóa.
              </p>
            </div>

            <div 
              onClick={() => onNavigate('webar-scanner')}
              className="bg-surface-container p-6 rounded-xl border border-white/5 space-y-3 cursor-pointer hover:border-secondary/40 transition-colors"
            >
              <span className="font-mono text-2xl text-secondary">04</span>
              <h4 className="font-serif text-lg text-primary">Đánh Thức WebAR Bất Kỳ Lúc Nào</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Mở camera điện thoại hướng vào trang lịch để sống lại kỷ niệm với độ phân giải siêu nét.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Connoisseurs Testimonials */}
      <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-20 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="font-label-sm text-xs tracking-widest text-secondary uppercase font-mono">
            TIẾNG NÓI TỪ GIỚI MỘ ĐIỆU
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-primary font-normal">
            Trải Nghiệm Đỉnh Cao
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-surface-container p-7 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTOGQ3RLqqvtCrfAWyD3g6_MNOKZQyvHuXVy4rlM7a8fD7dxf24kRL19ZqP7Jg4cUm8kAC8WKK4aMfsI8YpAKzug6ZQTg-OcUQVimdJThZoh_37SsHE6rFw1zjkE4I8wq8PqeOUHq_CF5PdF_tJp-zpuKMaSj8oituBvHhMGSPt_pmSeEpD8SppRenJl0blzNdPm8lP0dt7A15JsD5svAHMqWQ3fF99V96oerBojeVgzh0rkrLlhtP"
                alt="KTS Lê Trọng Nghĩa"
                className="w-12 h-12 rounded-full object-cover ring-1 ring-white/20"
              />
              <div>
                <h5 className="font-serif text-base text-primary">KTS. Lê Trọng Nghĩa</h5>
                <span className="text-[11px] text-on-surface-variant">Giám Đốc Thiết Kế • Atelier Connoisseur</span>
              </div>
            </div>
            <p className="font-body-md text-xs sm:text-sm text-on-surface-variant italic leading-relaxed">
              “Cuốn lịch trên bàn làm việc của tôi không đơn thuần là công cụ đếm ngày, mà là một bảo tàng thu nhỏ. Cảm giác vuốt ve chất giấy sần cotton rồi quét camera để nghe lại tiếng cười của con gái là một trải nghiệm xúc động.”
            </p>
          </div>

          <div className="bg-surface-container p-7 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDzfQQrX1fCpbmFRZgz2gUv2vExBJjfFDLI35qYYWTACip6XcvvrCutRR2JQ3726FoB2NgWeo4BUcA_YJEn3cycrZGP7lQcHR_npOnlXE8kXi4BehIRhG06_5c8wBMGb1b90LPPv-xSA5pfMTMlA8SfaKGMUa6v09s3oh8QWzdrQl4sQ_rMa7hMYq6MY8c1-msmk_jb-n06B-d3zz2lrZqBl_FwhGYrMXBhiCSwIHQKY98Qt4V6HYa"
                alt="Đặng Thu Hà"
                className="w-12 h-12 rounded-full object-cover ring-1 ring-white/20"
              />
              <div>
                <h5 className="font-serif text-base text-primary">Đặng Thu Hà</h5>
                <span className="text-[11px] text-on-surface-variant">Nhà Sưu Tầm Nghệ Thuật • Elite Member</span>
              </div>
            </div>
            <p className="font-body-md text-xs sm:text-sm text-on-surface-variant italic leading-relaxed">
              “Món quà tuyệt mỹ nhất tôi dành tặng cha mẹ nhân dịp mừng thọ. Khả năng kết nối tất cả con cháu ở 4 châu lục gửi lời chúc vào từng tháng thật kỳ diệu và tinh tế đến từng chi tiết.”
            </p>
          </div>

          <div className="bg-surface-container p-7 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDu-5mt3vItH9cH5I5R2lUdVmlm1Jw_p5IZ7j1XO4kQd_QS41dgdhCiqL8H5fFCe8TSZkqcxyas61ZEtSRdk5wIHvqdwHg_yGYzjEzfP0jR2mHsv2EVFhbabuz7Tlbprs-W4tEDHQghRA1iBYNYn24ARKjkG7SP-sg6e4hAPOy6I8CwMvMj1BOdnkmNtkDLj_ZzzZ8f_vnPWNQLjUsqKJbC2I-sCAhiCD3PdI9jInKYNhMagaXVTR_U"
                alt="Michael Phạm"
                className="w-12 h-12 rounded-full object-cover ring-1 ring-white/20"
              />
              <div>
                <h5 className="font-serif text-base text-primary">Michael Phạm</h5>
                <span className="text-[11px] text-on-surface-variant">Nhiếp Ảnh Gia Quốc Tế</span>
              </div>
            </div>
            <p className="font-body-md text-xs sm:text-sm text-on-surface-variant italic leading-relaxed">
              “Màu in đạt chuẩn FOGRA39 với Delta E &lt; 0.84 là tiêu chuẩn tôi chỉ thấy ở các triển lãm mỹ thuật châu Âu. Chất giấy mỹ thuật Cotton 310gsm sờ xốp mịn tự nhiên, cầm lên tay mang lại cảm giác đầm chắc và vô cùng sang trọng.”
            </p>
          </div>
        </div>
      </section>

      {/* Bottom Final CTA */}
      <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="bg-gradient-to-r from-surface-container to-surface-container-high rounded-3xl p-8 sm:p-14 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <h2 className="font-serif text-3xl sm:text-4xl text-primary">
              Bắt Đầu Hành Trình Chế Tác Ngay Hôm Nay
            </h2>
            <p className="text-sm text-on-surface-variant">
              Tạo nên cuốn niên lịch độc bản ghi dấu ấn một năm trọn vẹn của bạn và gia đình.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 shrink-0">
            <button
              onClick={() => onNavigate('design-studio')}
              className="px-7 py-3.5 bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary text-xs uppercase font-label-md tracking-wider font-semibold rounded transition-colors"
            >
              THIẾT KẾ TRỰC TUYẾN
            </button>
            <button
              onClick={() => onNavigate('collaborative-portal')}
              className="px-6 py-3.5 bg-surface-container-highest hover:bg-surface-bright text-primary text-xs uppercase font-label-md tracking-wider rounded transition-colors border border-white/10"
            >
              MỜI THÀNH VIÊN GỬI LỜI CHÚC
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
