import React, { useState, useEffect } from 'react';
import { ScreenId } from '../types';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

interface CheckoutScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({ onNavigate }) => {
  const { user, isLoggedIn } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<'vietqr' | 'card' | 'concierge'>('vietqr');
  const [recipientName, setRecipientName] = useState<string>(user?.name || 'Nguyễn Hoàng Bảo Long');
  const [phone, setPhone] = useState<string>(user?.phone || '0918 288 388');
  const [address, setAddress] = useState<string>('Biệt thự Lan Anh, Số 2 Đường 45, P. Thảo Điền, TP. Thủ Đức, TP.HCM');
  const [laserNote, setLaserNote] = useState<string>('Kính tặng Cha - Tri Ân 25 Năm Đồng Hành');

  useEffect(() => {
    if (user) {
      if (user.name) setRecipientName(user.name);
      if (user.phone) setPhone(user.phone);
    }
  }, [user]);
  
  // VietQR countdown timer
  const [timeLeft, setTimeLeft] = useState<number>(888); // 14 mins 48 secs
  const [isVerifyingWebhook, setIsVerifyingWebhook] = useState<boolean>(false);
  const [isPaidSuccess, setIsPaidSuccess] = useState<boolean>(false);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    setTimeout(() => {
      setCopiedItem(null);
    }, 2000);
  };

  const handleVerifyPayment = () => {
    setIsVerifyingWebhook(true);
    setTimeout(() => {
      setIsVerifyingWebhook(false);
      setIsPaidSuccess(true);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#bbcac1', '#f3ead9', '#d6cebe']
      });
    }, 1600);
  };

  return (
    <div className="w-full min-h-screen pt-24 pb-20 font-sans">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 space-y-8">
        {/* Header Title */}
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-surface-container-high border border-outline-variant/30">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <span className="font-label-sm text-[11px] tracking-[0.24em] text-secondary uppercase font-mono">
              ATELIER CHECKOUT CONCIERGE / SECURE DISPATCH
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl text-primary font-normal">
            Xác Nhận Đơn Hàng & Thanh Toán
          </h1>

          <p className="font-body-md text-sm text-on-surface-variant">
            Hoàn tất thông tin đặt làm Niên Lịch Phygital 2025 (#LUMI-8829-VN).
          </p>
        </div>

        {/* 2-Column Checkout Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (7 cols): Recipient & Payment Methods */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Recipient Info */}
            <div className="bg-surface-container rounded-2xl p-6 sm:p-8 border border-white/10 space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                <span className="w-6 h-6 rounded-full bg-primary-container text-on-primary-container text-xs font-mono font-bold flex items-center justify-center">
                  1
                </span>
                <h2 className="font-serif text-xl text-primary">Thông Tin Người Nhận & Địa Chỉ Giao Hàng</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <label className="block text-on-surface-variant mb-1.5 uppercase">HỌ VÀ TÊN NGƯỜI NHẬN *</label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-surface-container-lowest border border-white/10 text-on-surface focus:outline-none focus:border-secondary font-sans text-sm"
                  />
                </div>

                <div>
                  <label className="block text-on-surface-variant mb-1.5 uppercase">SỐ ĐIỆN THOẠI LIÊN HỆ *</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-surface-container-lowest border border-white/10 text-on-surface focus:outline-none focus:border-secondary font-sans text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-on-surface-variant mb-1.5 uppercase">ĐỊA CHỈ GIAO TẬN TAY (HỘP NIÊM PHONG SÁP) *</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-surface-container-lowest border border-white/10 text-on-surface focus:outline-none focus:border-secondary font-sans text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-on-surface-variant mb-1.5 uppercase">
                    YÊU CẦU KHẮC LASER CHỮ KÝ LÊN KHỐI ĐẾ GỖ WALNUT (TÙY CHỌN)
                  </label>
                  <input
                    type="text"
                    value={laserNote}
                    onChange={(e) => setLaserNote(e.target.value)}
                    placeholder="Ví dụ: Kính tặng Bác Hai - Kỷ Niệm 2025"
                    className="w-full px-4 py-2.5 rounded-lg bg-surface-container-lowest border border-white/10 text-on-surface focus:outline-none focus:border-secondary font-sans text-sm"
                  />
                  <span className="text-[10px] text-secondary mt-1 block">
                    Khắc laser vĩnh cửu độ sâu 0.4mm phủ bột vàng kim.
                  </span>
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="bg-surface-container rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                <span className="w-6 h-6 rounded-full bg-primary-container text-on-primary-container text-xs font-mono font-bold flex items-center justify-center">
                  2
                </span>
                <h2 className="font-serif text-xl text-primary">Phương Thức Thanh Toán An Toàn</h2>
              </div>

              {/* Payment Tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('vietqr')}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    paymentMethod === 'vietqr'
                      ? 'bg-secondary-container/30 border-secondary ring-1 ring-secondary'
                      : 'bg-surface-container-lowest border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs text-primary font-bold">VIETQR PRO</span>
                    <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded font-mono">
                      Khuyên Dùng
                    </span>
                  </div>
                  <span className="text-[11px] text-on-surface-variant block">
                    Quét mã QR Chuyển khoản tức thì 24/7
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-secondary-container/30 border-secondary ring-1 ring-secondary'
                      : 'bg-surface-container-lowest border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="font-mono text-xs text-primary font-bold mb-1">THẺ QUỐC TẾ</div>
                  <span className="text-[11px] text-on-surface-variant block">
                    Visa, MasterCard, JCB, Amex (3D-Secure)
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('concierge')}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    paymentMethod === 'concierge'
                      ? 'bg-secondary-container/30 border-secondary ring-1 ring-secondary'
                      : 'bg-surface-container-lowest border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="font-mono text-xs text-primary font-bold mb-1">VIP CONCIERGE</div>
                  <span className="text-[11px] text-on-surface-variant block">
                    Chuyên viên mang máy POS đến tận nơi
                  </span>
                </button>
              </div>

              {/* VietQR View Details */}
              {paymentMethod === 'vietqr' && (
                <div className="bg-surface-container-lowest p-6 rounded-xl border border-white/10 space-y-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-white/10">
                    <div>
                      <div className="font-mono text-xs text-secondary font-semibold">CỔNG THANH TOÁN TỰ ĐỘNG VIETQR PRO</div>
                      <div className="text-xs text-on-surface-variant">Hệ thống kích hoạt lệnh in ngay khi nhận tiền</div>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-amber-950/80 border border-amber-500/30 text-amber-200 font-mono text-xs">
                      <span className="material-symbols-outlined text-sm">schedule</span>
                      <span>Thời gian giữ đơn: {formatTimer(timeLeft)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    {/* Real-looking SVG VietQR Box */}
                    <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-lg">
                      <div className="text-center pb-2 border-b border-gray-200 w-full">
                        <span className="text-xs font-bold font-sans text-red-600 tracking-wider">VietQR | NAPAS 247</span>
                      </div>

                      {/* QR Matrix SVG */}
                      <div className="my-3 p-2 bg-white flex items-center justify-center">
                        <svg className="w-44 h-44" viewBox="0 0 200 200" fill="none">
                          {/* Corner Markers */}
                          <rect x="10" y="10" width="45" height="45" fill="black" />
                          <rect x="18" y="18" width="29" height="29" fill="white" />
                          <rect x="25" y="25" width="15" height="15" fill="black" />

                          <rect x="145" y="10" width="45" height="45" fill="black" />
                          <rect x="153" y="18" width="29" height="29" fill="white" />
                          <rect x="160" y="25" width="15" height="15" fill="black" />

                          <rect x="10" y="145" width="45" height="45" fill="black" />
                          <rect x="18" y="153" width="29" height="29" fill="white" />
                          <rect x="25" y="160" width="15" height="15" fill="black" />

                          {/* Data dots matrix */}
                          <g fill="black">
                            <rect x="65" y="15" width="10" height="10" />
                            <rect x="85" y="15" width="10" height="10" />
                            <rect x="110" y="15" width="10" height="10" />
                            <rect x="65" y="35" width="10" height="10" />
                            <rect x="95" y="35" width="10" height="10" />
                            <rect x="120" y="35" width="10" height="10" />

                            <rect x="15" y="65" width="10" height="10" />
                            <rect x="35" y="65" width="10" height="10" />
                            <rect x="65" y="65" width="10" height="10" />
                            <rect x="85" y="65" width="10" height="10" />
                            <rect x="105" y="65" width="10" height="10" />
                            <rect x="135" y="65" width="10" height="10" />
                            <rect x="155" y="65" width="10" height="10" />
                            <rect x="175" y="65" width="10" height="10" />

                            <rect x="65" y="85" width="10" height="10" />
                            <rect x="95" y="85" width="10" height="10" />
                            <rect x="115" y="85" width="10" height="10" />
                            <rect x="145" y="85" width="10" height="10" />

                            <rect x="15" y="105" width="10" height="10" />
                            <rect x="35" y="105" width="10" height="10" />
                            <rect x="75" y="105" width="10" height="10" />
                            <rect x="105" y="105" width="10" height="10" />
                            <rect x="135" y="105" width="10" height="10" />
                            <rect x="165" y="105" width="10" height="10" />

                            <rect x="65" y="125" width="10" height="10" />
                            <rect x="95" y="125" width="10" height="10" />
                            <rect x="125" y="125" width="10" height="10" />

                            <rect x="65" y="155" width="10" height="10" />
                            <rect x="85" y="155" width="10" height="10" />
                            <rect x="115" y="155" width="10" height="10" />
                            <rect x="145" y="155" width="10" height="10" />
                            <rect x="175" y="155" width="10" height="10" />

                            <rect x="65" y="175" width="10" height="10" />
                            <rect x="95" y="175" width="10" height="10" />
                            <rect x="135" y="175" width="10" height="10" />
                            <rect x="165" y="175" width="10" height="10" />
                          </g>

                          {/* Center logo badge */}
                          <rect x="85" y="85" width="30" height="30" rx="4" fill="#121316" />
                          <text x="100" y="105" fill="#f3ead9" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">LUMI</text>
                        </svg>
                      </div>

                      <div className="text-center pt-1 border-t border-gray-200 w-full">
                        <span className="text-[11px] font-mono text-gray-700 font-semibold">1.850.000 VND</span>
                      </div>
                    </div>

                    {/* Bank Transfer Details with Copy Buttons */}
                    <div className="md:col-span-7 space-y-3 font-mono text-xs">
                      <div className="p-2.5 rounded bg-surface-container flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-on-surface-variant block">NGÂN HÀNG THỤ HƯỞNG</span>
                          <span className="text-primary font-semibold">Techcombank (Hội sở chính)</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded bg-surface-container flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-on-surface-variant block">SỐ TÀI KHOẢN</span>
                          <span className="text-primary font-bold text-sm tracking-wider">1903 8829 8888</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy('190388298888', 'stk')}
                          className="px-2 py-1 bg-surface-container-high hover:bg-surface-bright text-secondary text-[11px] rounded transition-colors"
                        >
                          {copiedItem === 'stk' ? 'Đã chép' : 'Sao chép'}
                        </button>
                      </div>

                      <div className="p-2.5 rounded bg-surface-container flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-on-surface-variant block">CHỦ TÀI KHOẢN</span>
                          <span className="text-primary font-semibold">CTCP XUONG CHE TAC LUMICAL</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded bg-surface-container flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-on-surface-variant block">SỐ TIỀN CHÍNH XÁC</span>
                          <span className="text-titanium font-bold text-sm">1.850.000 ₫</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy('1850000', 'tien')}
                          className="px-2 py-1 bg-surface-container-high hover:bg-surface-bright text-secondary text-[11px] rounded transition-colors"
                        >
                          {copiedItem === 'tien' ? 'Đã chép' : 'Sao chép'}
                        </button>
                      </div>

                      <div className="p-2.5 rounded bg-amber-950/40 border border-amber-500/30 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-amber-200 block">NỘI DUNG CHUYỂN KHOẢN (BẮT BUỘC)</span>
                          <span className="text-amber-300 font-bold text-sm">LUMI8829</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy('LUMI8829', 'noidung')}
                          className="px-2 py-1 bg-amber-900/60 hover:bg-amber-800 text-amber-100 text-[11px] rounded transition-colors"
                        >
                          {copiedItem === 'noidung' ? 'Đã chép' : 'Sao chép'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Webhook Status / Action Check */}
                  <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs font-mono text-on-surface-variant">
                      <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
                      <span>Đang lắng nghe tín hiệu chuyển khoản từ ngân hàng...</span>
                    </div>

                    <button
                      type="button"
                      onClick={handleVerifyPayment}
                      disabled={isVerifyingWebhook || isPaidSuccess}
                      className="w-full sm:w-auto px-6 py-3 bg-primary-container text-on-primary-container hover:bg-primary font-mono text-xs uppercase tracking-wider rounded font-bold transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      {isVerifyingWebhook ? (
                        <>
                          <span className="material-symbols-outlined text-base animate-spin">refresh</span>
                          <span>ĐANG KIỂM TRA GIAO DỊCH...</span>
                        </>
                      ) : isPaidSuccess ? (
                        <>
                          <span className="material-symbols-outlined text-base text-emerald-400">check_circle</span>
                          <span>ĐÃ XÁC THỰC THÀNH CÔNG!</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-base">verified</span>
                          <span>TÔI ĐÃ CHUYỂN KHOẢN XONG</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Card Payment Simulator */}
              {paymentMethod === 'card' && (
                <div className="bg-surface-container-lowest p-6 rounded-xl border border-white/10 space-y-4 font-mono text-xs">
                  <div>
                    <label className="block text-on-surface-variant mb-1 uppercase">SỐ THẺ QUỐC TẾ</label>
                    <input
                      type="text"
                      placeholder="4123 •••• •••• 8829"
                      className="w-full px-4 py-2.5 rounded bg-surface-container border border-white/10 text-on-surface text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-on-surface-variant mb-1 uppercase">NGÀY HẾT HẠN</label>
                      <input
                        type="text"
                        placeholder="MM / YY"
                        className="w-full px-4 py-2.5 rounded bg-surface-container border border-white/10 text-on-surface text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-on-surface-variant mb-1 uppercase">MÃ BẢO MẬT CVV</label>
                      <input
                        type="password"
                        placeholder="•••"
                        maxLength={4}
                        className="w-full px-4 py-2.5 rounded bg-surface-container border border-white/10 text-on-surface text-sm"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleVerifyPayment}
                    className="w-full py-3 bg-primary-container text-on-primary-container font-mono text-xs uppercase tracking-wider rounded font-bold"
                  >
                    XÁC THỰC THANH TOÁN 1.850.000 ₫ (3D-SECURE)
                  </button>
                </div>
              )}

              {/* Concierge Simulator */}
              {paymentMethod === 'concierge' && (
                <div className="bg-surface-container-lowest p-6 rounded-xl border border-white/10 space-y-4 text-xs">
                  <p className="text-on-surface-variant leading-relaxed">
                    Chuyên viên giám tuyển riêng của LumiCal Atelier sẽ liên hệ trong vòng 15 phút để xác nhận lịch hẹn tại tư gia hoặc văn phòng của quý khách kèm theo mẫu giấy và khối đế gỗ thực tế.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsPaidSuccess(true);
                      confetti({ particleCount: 60 });
                    }}
                    className="w-full py-3 bg-secondary-container text-on-secondary-container font-mono text-xs uppercase tracking-wider rounded font-bold"
                  >
                    XÁC NHẬN YÊU CẦU CONCIERGE TẬN NƠI
                  </button>
                </div>
              )}

              {/* Payment Success Confirmation Box */}
              {isPaidSuccess && (
                <div className="p-6 bg-emerald-950/90 border border-emerald-500/50 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-emerald-300 font-serif text-lg">
                    <span className="material-symbols-outlined text-2xl text-emerald-400">check_circle</span>
                    <span>Đơn Hàng #LUMI-8829-VN Đã Được Xác Nhận!</span>
                  </div>
                  <p className="text-xs text-emerald-100/90 leading-relaxed font-sans">
                    Cảm ơn bạn {recipientName}. Yêu cầu in ấn chất lượng cao đã tự động truyền xuống Xưởng Thủ Đức. Bạn có thể theo dõi tiến độ in ấn trực tiếp hoặc quét thử WebAR ngay bây giờ.
                  </p>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => onNavigate('admin-and-print')}
                      className="px-4 py-2 bg-emerald-800 text-emerald-100 rounded text-xs font-mono uppercase tracking-wider hover:bg-emerald-700 transition-colors"
                    >
                      Theo Dõi Tiến Trình Tại Xưởng →
                    </button>
                    <button
                      onClick={() => onNavigate('webar-scanner')}
                      className="px-4 py-2 bg-emerald-500 text-black font-bold rounded text-xs font-mono uppercase tracking-wider hover:bg-white transition-colors"
                    >
                      Quét Thử AR →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column (5 cols, sticky summary): Master Order Preview */}
          <div className="lg:col-span-5 sticky top-28 space-y-6">
            <div className="bg-surface-container rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="font-serif text-lg text-primary">Chi Tiết Bộ Lịch Đặt Hàng</span>
                <span className="font-mono text-xs text-secondary font-bold">#LUMI-8829-VN</span>
              </div>

              {/* Product Card */}
              <div className="flex gap-4 items-start">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7JpK0QF3C4XYFe9sn7qwDkCU4z6N3GOQNIgPdEAKlJTBfoN2IpXgsp0LkqJTxGj_EH_GQv-OXcIKmqDbSVZ7k1hoB4J5PMx0dD5BdnNvZ-WSh8qU6-9Gz32LYLD8O5P3av4WRXwInV9NYk_d9NuQwVPJsQdLqnfjqL81P5TxgGLheiQKfLDTQVRmt7Du8k_NuX7gBqb5sBzVnynPhuL4OEGbRLhGQ3b_aErb7eRx0A8DKSKyZqoJZ"
                  alt="LumiCal Desk Calendar"
                  className="w-20 h-20 rounded-xl object-cover border border-white/10 shrink-0"
                />
                <div className="space-y-1">
                  <h3 className="font-serif text-base text-primary">Lịch Thẻ Để Bàn Atelier Desk Edition</h3>
                  <div className="text-xs text-on-surface-variant font-mono">16 x 24 cm • 12 Thẻ Tháng</div>
                  <div className="text-[11px] text-secondary font-mono">Đế gỗ Walnut Bắc Mỹ phay CNC</div>
                </div>
              </div>

              {/* Included Bespoke Perks */}
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-white/5 space-y-2 text-xs font-sans text-on-surface-variant">
                <div className="text-[11px] font-mono text-secondary uppercase font-semibold">
                  ƯU ĐÃI ĐI KÈM THEO ĐƠN HÀNG:
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-secondary">✦</span> 12 Video 4K HDR & Âm thanh vòm Spatial
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-secondary">✦</span> Cổng thu thập lời chúc bí mật (38/50 đã nạp)
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-secondary">✦</span> Khắc laser chữ ký cá nhân hóa lên đế gỗ
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-secondary">✦</span> Hộp quà bọc lụa & con dấu sáp thủ công
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2.5 font-mono text-xs pt-3 border-t border-white/10">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Giá niêm yết chế tác:</span>
                  <span className="text-primary">1.850.000 ₫</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Lưu trữ WebAR & Vault E2EE:</span>
                  <span className="text-secondary">MIỄN PHÍ TRỌN ĐỜI</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Vận chuyển hỏa tốc chuyên biệt:</span>
                  <span className="text-secondary">MIỄN PHÍ</span>
                </div>

                <div className="pt-3 border-t border-white/10 flex justify-between items-center text-sm">
                  <span className="font-mono text-primary font-bold">TỔNG THANH TOÁN:</span>
                  <span className="font-serif text-2xl text-titanium font-semibold">
                    1.850.000 ₫
                  </span>
                </div>
              </div>

              {/* Security & Museum Quality Badges */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-on-surface-variant">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-secondary text-sm">verified_user</span>
                  Bảo hành màu 50 năm
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-secondary text-sm">lock</span>
                  E2EE 256-Bit Vault
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
