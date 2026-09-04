import React, { useState } from 'react';
import { ScreenId, CalendarMonth } from '../types';
import { CALENDAR_MONTHS, CURRENT_ORDER } from '../data/mockData';

interface AdminPrintScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const AdminPrintScreen: React.FC<AdminPrintScreenProps> = ({ onNavigate }) => {
  const [selectedInspectMonth, setSelectedInspectMonth] = useState<CalendarMonth | null>(CALENDAR_MONTHS[4]);
  const [activeTab, setActiveTab] = useState<'imposition' | 'qc' | 'logs'>('imposition');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const handleExportPdf = () => {
    setIsExporting(true);
    setExportNotice(null);
    setTimeout(() => {
      setIsExporting(false);
      setExportNotice('File PDF/X-4 (2400 DPI FOGRA39 CMYK) đã được tạo và gửi đến máy in Heidelberg Speedmaster.');
    }, 1200);
  };

  return (
    <div className="w-full min-h-screen pt-24 pb-20 font-sans">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 space-y-8">
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-secondary tracking-widest uppercase">
                POSTCRAFT CORE V4.8.2 / WORKSHOP IMPOSITION & DISPATCH
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                LIVE PRODUCTION
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-primary font-normal">
              Bình Trang & Kiểm Định Quang Học Xưởng In
            </h1>
            <p className="text-xs text-on-surface-variant font-mono">
              Xưởng in Mỹ thuật Atelier Thủ Đức • Server Node 01 • Máy in Heidelberg Speedmaster XL 106
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => onNavigate('webar-scanner')}
              className="px-4 py-2 bg-surface-container-high hover:bg-surface-bright text-primary text-xs font-mono rounded border border-white/10 flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">view_in_ar</span>
              Kiểm Thử AR
            </button>
            <button
              onClick={() => onNavigate('checkout')}
              className="px-4 py-2 bg-primary-container text-on-primary-container hover:bg-primary text-xs font-mono uppercase tracking-wider rounded font-medium transition-colors"
            >
              Xem Phiếu Thu Tiền
            </button>
          </div>
        </div>

        {/* 5 Monolithic KPI Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-surface-container p-4 rounded-xl border border-white/10 space-y-1">
            <span className="font-mono text-[10px] text-on-surface-variant uppercase block">QUY CÁCH BÌNH TRANG</span>
            <div className="font-serif text-2xl text-primary font-semibold">12 / 12 TRANG</div>
            <span className="text-[11px] text-secondary font-mono">Khổ 4-Up SRA3 (320x450mm)</span>
          </div>

          <div className="bg-surface-container p-4 rounded-xl border border-white/10 space-y-1">
            <span className="font-mono text-[10px] text-on-surface-variant uppercase block">ĐỘ SAI LỆCH MÀU CMYK</span>
            <div className="font-serif text-2xl text-secondary font-semibold">ΔE &lt; 0.84</div>
            <span className="text-[11px] text-on-surface-variant font-mono">Chuẩn Bảo Tàng FOGRA39</span>
          </div>

          <div className="bg-surface-container p-4 rounded-xl border border-white/10 space-y-1">
            <span className="font-mono text-[10px] text-on-surface-variant uppercase block">ĐỘ CHÍNH XÁC QUANG HỌC AR</span>
            <div className="font-serif text-2xl text-primary font-semibold">99.7% KHỚP</div>
            <span className="text-[11px] text-secondary font-mono">842 Điểm Neo Feature Points</span>
          </div>

          <div className="bg-surface-container p-4 rounded-xl border border-white/10 space-y-1">
            <span className="font-mono text-[10px] text-on-surface-variant uppercase block">CHẤT LIỆU IN ẤN</span>
            <div className="font-serif text-2xl text-primary font-semibold">100% GIẤY COTTON</div>
            <span className="text-[11px] text-on-surface-variant font-mono">Hahnemühle 310gsm • Chân Đế Giấy Bồi</span>
          </div>

          <div className="bg-surface-container p-4 rounded-xl border border-white/10 space-y-1 col-span-2 sm:col-span-1">
            <span className="font-mono text-[10px] text-on-surface-variant uppercase block">BẢO MẬT & CHỮ KÝ SỐ</span>
            <div className="font-serif text-2xl text-emerald-400 font-semibold">E2EE ĐÃ KÝ</div>
            <span className="text-[11px] text-on-surface-variant font-mono">SHA-256 Verified On-Chain</span>
          </div>
        </div>

        {/* Main 2-Column Workstation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 cols): Imposition Sheet Gallery */}
          <div className="lg:col-span-8 bg-surface-container rounded-2xl p-6 border border-white/10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div>
                <h2 className="font-serif text-xl text-primary">
                  Lược Đồ Bình Trang In Ấn (12 Tháng Hoàn Hảo)
                </h2>
                <p className="text-xs text-on-surface-variant font-mono">
                  Bấm vào từng trang để mở kính lúp kiểm định quang học và bảng phân tích tách màu
                </p>
              </div>

              <div className="flex gap-2 font-mono text-xs">
                <button
                  onClick={() => setActiveTab('imposition')}
                  className={`px-3 py-1 rounded transition-colors ${
                    activeTab === 'imposition' ? 'bg-primary-container text-on-primary-container font-semibold' : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  Khổ Bình Trang
                </button>
                <button
                  onClick={() => setActiveTab('qc')}
                  className={`px-3 py-1 rounded transition-colors ${
                    activeTab === 'qc' ? 'bg-primary-container text-on-primary-container font-semibold' : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  Kính Lúp QC
                </button>
              </div>
            </div>

            {/* Imposition Sheet Grid (12 months) */}
            {activeTab === 'imposition' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {CALENDAR_MONTHS.map((m) => {
                  const isSelected = selectedInspectMonth?.monthNumber === m.monthNumber;
                  return (
                    <div
                      key={m.monthNumber}
                      onClick={() => setSelectedInspectMonth(m)}
                      className={`relative rounded-xl p-2.5 bg-surface-container-lowest border cursor-pointer transition-all hover:scale-[1.02] group ${
                        isSelected
                          ? 'border-secondary ring-2 ring-secondary/50 shadow-lg'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      {/* Crop Mark Corner Simulation */}
                      <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t border-l border-white/40"></div>
                      <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t border-r border-white/40"></div>
                      <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b border-l border-white/40"></div>
                      <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b border-r border-white/40"></div>

                      {/* Image Thumbnail */}
                      <div className="aspect-[4/3] rounded overflow-hidden bg-black/60 relative">
                        <img src={m.image} alt={m.title} className="w-full h-full object-cover" />

                        {/* Optical Tracking Anchor crosshair */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-80 group-hover:opacity-100">
                          <div className="w-4 h-4 rounded-full border border-secondary flex items-center justify-center">
                            <div className="w-1 h-1 bg-secondary rounded-full"></div>
                          </div>
                        </div>

                        <div className="absolute bottom-1 left-1 bg-black/75 px-1.5 py-0.5 rounded text-[9px] font-mono text-secondary">
                          {m.arAccuracy}% AR Lock
                        </div>
                      </div>

                      {/* Info strip */}
                      <div className="mt-2 flex items-center justify-between text-[11px] font-mono">
                        <span className="text-primary font-semibold">{m.title}</span>
                        <span className="text-on-surface-variant truncate max-w-[70px] text-[10px]">{m.theme}</span>
                      </div>

                      {/* CMYK color swatch strip at bottom */}
                      <div className="mt-1.5 flex gap-1 h-1">
                        <div className="flex-1 bg-cyan-400"></div>
                        <div className="flex-1 bg-fuchsia-500"></div>
                        <div className="flex-1 bg-yellow-400"></div>
                        <div className="flex-1 bg-black"></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* QC Magnifier View */}
            {activeTab === 'qc' && selectedInspectMonth && (
              <div className="space-y-6">
                <div className="bg-surface-container-lowest p-6 rounded-xl border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-secondary/40 bg-black">
                    <img
                      src={selectedInspectMonth.image}
                      alt={selectedInspectMonth.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Feature nodes overlay dots */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="w-2 h-2 rounded-full bg-secondary absolute top-1/4 left-1/3 shadow-[0_0_8px_#bbcac1]"></div>
                      <div className="w-2 h-2 rounded-full bg-secondary absolute top-1/2 left-1/2 shadow-[0_0_8px_#bbcac1]"></div>
                      <div className="w-2 h-2 rounded-full bg-secondary absolute bottom-1/3 right-1/4 shadow-[0_0_8px_#bbcac1]"></div>
                      <div className="w-2 h-2 rounded-full bg-secondary absolute top-1/3 right-1/3 shadow-[0_0_8px_#bbcac1]"></div>
                    </div>
                    <div className="absolute top-2 left-2 bg-black/80 px-2 py-1 rounded text-[10px] font-mono text-secondary">
                      842 FEATURE NODES TRACKED
                    </div>
                  </div>

                  <div className="space-y-4 font-mono text-xs">
                    <div className="text-primary font-serif text-lg font-normal">
                      Kiểm Định: {selectedInspectMonth.title} • {selectedInspectMonth.theme}
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-on-surface-variant">
                        <span>Độ sắc nét véc-tơ:</span>
                        <span className="text-primary">2400 DPI Không Răng Cưa</span>
                      </div>
                      <div className="flex justify-between text-on-surface-variant">
                        <span>Mực phủ bề mặt:</span>
                        <span className="text-primary">27µ Mờ Chống Lóa Bopp</span>
                      </div>
                      <div className="flex justify-between text-on-surface-variant">
                        <span>Tỷ lệ khớp WebAR:</span>
                        <span className="text-secondary font-bold">{selectedInspectMonth.arAccuracy}% (Vượt Chuẩn)</span>
                      </div>
                      <div className="flex justify-between text-on-surface-variant">
                        <span>Độ bù trừ cấn bế (Bleed):</span>
                        <span className="text-primary">2.0 mm Tiêu Chuẩn Quốc Tế</span>
                      </div>
                    </div>

                    {/* CMYK percentages */}
                    <div className="p-3 bg-surface-container rounded border border-white/5 space-y-1.5">
                      <div className="text-[10px] text-secondary">PHÂN BỐ MÀU IN CMYK</div>
                      <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                        <div className="bg-cyan-950 text-cyan-200 py-1 rounded border border-cyan-500/20">C: 18%</div>
                        <div className="bg-fuchsia-950 text-fuchsia-200 py-1 rounded border border-fuchsia-500/20">M: 42%</div>
                        <div className="bg-amber-950 text-amber-200 py-1 rounded border border-amber-500/20">Y: 65%</div>
                        <div className="bg-zinc-900 text-zinc-200 py-1 rounded border border-zinc-500/20">K: 08%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Export action message */}
            {exportNotice && (
              <div className="p-3.5 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-emerald-200 text-xs font-mono flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-emerald-400">check_circle</span>
                <span>{exportNotice}</span>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
              <span className="font-mono text-[11px] text-on-surface-variant">
                ICC Profile: ISOcoated_v2_300_eci.icc • 16-Bit Engine
              </span>

              <div className="flex gap-3">
                <button
                  onClick={handleExportPdf}
                  disabled={isExporting}
                  className="px-5 py-2.5 bg-primary-container text-on-primary-container hover:bg-primary font-mono text-xs uppercase tracking-wider rounded font-medium transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">
                    {isExporting ? 'sync' : 'print'}
                  </span>
                  <span>{isExporting ? 'ĐANG XUẤT LỆNH...' : 'XUẤT LỆNH IN PDF/X-4'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Job Ticket Master & Terminal */}
          <div className="lg:col-span-4 space-y-6">
            {/* Job Ticket Card */}
            <div className="bg-surface-container rounded-2xl p-6 border border-white/10 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-lg">receipt_long</span>
                  <span className="font-mono text-sm text-primary font-bold">{CURRENT_ORDER.id}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 text-[10px] font-mono border border-amber-500/30">
                  {CURRENT_ORDER.status}
                </span>
              </div>

              {/* Specs List */}
              <div className="space-y-3 font-sans text-xs">
                <div>
                  <span className="text-[10px] font-mono text-on-surface-variant uppercase block">CHỦ NHÂN ẤN BẢN</span>
                  <div className="text-primary font-medium text-sm">{CURRENT_ORDER.customerName}</div>
                  <div className="text-[11px] text-secondary font-mono">{CURRENT_ORDER.membershipLevel}</div>
                </div>

                <div className="pt-2 border-t border-white/5 space-y-2 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Phiên bản:</span>
                    <span className="text-primary font-medium">{CURRENT_ORDER.editionName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Kích thước:</span>
                    <span className="text-primary">{CURRENT_ORDER.dimensions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Giấy mỹ thuật:</span>
                    <span className="text-primary">{CURRENT_ORDER.paperStock}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Đường xén (Bleed):</span>
                    <span className="text-primary">{CURRENT_ORDER.bleed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Cán màng:</span>
                    <span className="text-primary">{CURRENT_ORDER.coating}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Sai lệch màu:</span>
                    <span className="text-secondary">{CURRENT_ORDER.cmykDeltaE}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Thời điểm đặt:</span>
                    <span className="text-primary">{CURRENT_ORDER.timestamp}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                  <span className="font-mono text-xs text-on-surface-variant">TỔNG GIÁ TRỊ:</span>
                  <span className="font-serif text-xl text-titanium font-semibold">
                    {CURRENT_ORDER.price.toLocaleString('vi-VN')} ₫
                  </span>
                </div>
              </div>
            </div>

            {/* Live Workshop Terminal Logs */}
            <div className="bg-black/80 rounded-2xl p-5 border border-white/10 space-y-3 font-mono text-[11px]">
              <div className="flex items-center justify-between text-secondary pb-2 border-b border-white/10">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>WORKSHOP LOG TERMINAL</span>
                </div>
                <span className="text-[10px] text-on-surface-variant">PORT 3000 LIVE</span>
              </div>

              <div className="space-y-1.5 text-on-surface-variant">
                <div className="text-emerald-400">[14:28:02] RIP Engine: Rendering vector separation 2400 DPI... OK</div>
                <div>[14:28:15] AR Optical Anchor: Generated 842 keypoints for Month 05... 99.8% Lock</div>
                <div>[14:28:30] Laser Engraver: Configured toolpath for walnut base... READY</div>
                <div className="text-secondary">[14:28:44] VietQR Webhook: 1.850.000đ confirmed via Techcombank... VERIFIED</div>
                <div>[14:29:01] Paper Feeder: SRA3 Eramo 300gsm loaded into Heidelberg XL 106... READY</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
