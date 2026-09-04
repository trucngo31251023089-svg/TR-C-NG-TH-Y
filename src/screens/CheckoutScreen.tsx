import React, { useState, useEffect } from 'react';
import { ScreenId } from '../types';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import {
  DEFAULT_BANK_ACCOUNT,
  BankAccountConfig,
  VIETNAM_BANKS,
  generateVietQrUrl
} from '../data/bankList';
import { BankVerificationModal } from '../components/BankVerificationModal';

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

  // Bank account and order parameters
  const [bankAccount, setBankAccount] = useState<BankAccountConfig>(DEFAULT_BANK_ACCOUNT);
  const [showBankConfigModal, setShowBankConfigModal] = useState<boolean>(false);
  const [showVerificationModal, setShowVerificationModal] = useState<boolean>(false);
  const [verifiedAuditProof, setVerifiedAuditProof] = useState<any>(null);

  // Temporary state for editing bank account
  const [tempBankBin, setTempBankBin] = useState<string>(DEFAULT_BANK_ACCOUNT.bin);
  const [tempAccountNo, setTempAccountNo] = useState<string>(DEFAULT_BANK_ACCOUNT.accountNumber);
  const [tempAccountName, setTempAccountName] = useState<string>(DEFAULT_BANK_ACCOUNT.accountName);

  const orderTotal = 1850000;
  const orderCode = 'LUMI8829';

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

  // Callback when strict audit passes
  const handleAuditSuccess = (auditResult: any) => {
    setVerifiedAuditProof(auditResult);
    setIsPaidSuccess(true);
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#bbcac1', '#f3ead9', '#d6cebe', '#10b981']
    });
  };

  // Handler for credit card simulator
  const handleCardPayment = () => {
    setIsVerifyingWebhook(true);
    setTimeout(() => {
      setIsVerifyingWebhook(false);
      handleAuditSuccess({
        isValid: true,
        transactionRef: 'CARD-3DSECURE-8829',
        detectedAccount: 'VISA-4111-XXXX-1111',
        detectedAmount: orderTotal,
        detectedContent: orderCode,
        message: 'Thanh toán thẻ quốc tế thành công qua cổng 3D-Secure'
      });
    }, 1200);
  };

  // Save custom receiving bank account
  const handleSaveBankAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const foundBank = VIETNAM_BANKS.find((b) => b.bin === tempBankBin) || VIETNAM_BANKS[0];
    setBankAccount({
      bankId: foundBank.id,
      bankName: foundBank.shortName,
      bin: foundBank.bin,
      accountNumber: tempAccountNo.trim(),
      accountName: tempAccountName.trim().toUpperCase()
    });
    setShowBankConfigModal(false);
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
                    YÊU CẦU ÉP KIM / DẬP NỔI TÊN RIÊNG CÁ NHÂN HÓA LÊN BÌA GIẤY (TÙY CHỌN)
                  </label>
                  <input
                    type="text"
                    value={laserNote}
                    onChange={(e) => setLaserNote(e.target.value)}
                    placeholder="Ví dụ: Kính tặng Bác Hai - Kỷ Niệm 2025"
                    className="w-full px-4 py-2.5 rounded-lg bg-surface-container-lowest border border-white/10 text-on-surface focus:outline-none focus:border-secondary font-sans text-sm"
                  />
                  <span className="text-[10px] text-secondary mt-1 block">
                    Ép nhũ vàng kim sâu 0.3mm trên giấy mỹ thuật cao cấp.
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
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-secondary font-semibold">
                          CỔNG THANH TOÁN TỰ ĐỘNG VIETQR PRO (NAPAS 247)
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono">
                          Xác thực tài khoản thật
                        </span>
                      </div>
                      <div className="text-xs text-on-surface-variant mt-0.5">
                        Chuyển đúng tài khoản thụ hưởng và đúng cú pháp để hệ thống xác nhận tự động
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setTempBankBin(bankAccount.bin);
                          setTempAccountNo(bankAccount.accountNumber);
                          setTempAccountName(bankAccount.accountName);
                          setShowBankConfigModal(true);
                        }}
                        className="px-2.5 py-1.5 rounded bg-surface-container-high hover:bg-surface-bright border border-white/10 text-secondary text-xs font-mono flex items-center gap-1 transition-colors"
                        title="Đổi sang tài khoản ngân hàng thật của bạn"
                      >
                        <span className="material-symbols-outlined text-sm">settings</span>
                        <span>Đổi STK Nhận</span>
                      </button>

                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-950/80 border border-amber-500/30 text-amber-200 font-mono text-xs">
                        <span className="material-symbols-outlined text-sm">schedule</span>
                        <span>Giữ đơn: {formatTimer(timeLeft)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    {/* Live Scannable VietQR Box */}
                    <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-xl border border-neutral-200 text-neutral-900">
                      <div className="flex items-center justify-between w-full pb-2 border-b border-gray-200">
                        <span className="text-[11px] font-bold font-sans text-red-600 tracking-wider flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                          VietQR | NAPAS 247
                        </span>
                        <span className="text-[10px] font-mono text-gray-500 font-medium">
                          {bankAccount.bankName}
                        </span>
                      </div>

                      {/* Scannable Real VietQR Image */}
                      <div className="my-2 p-1.5 bg-white rounded-lg flex items-center justify-center relative group">
                        <img
                          src={generateVietQrUrl(
                            bankAccount.bin,
                            bankAccount.accountNumber,
                            orderTotal,
                            orderCode,
                            bankAccount.accountName
                          )}
                          alt={`Mã VietQR thanh toán ${bankAccount.accountNumber}`}
                          className="w-48 h-48 sm:w-52 sm:h-52 object-contain rounded transition-transform group-hover:scale-[1.02]"
                          onError={(e) => {
                            // Fallback if network issue
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>

                      <div className="text-center pt-2 border-t border-gray-200 w-full space-y-0.5">
                        <div className="text-[11px] font-mono text-emerald-700 font-bold">
                          1.850.000 ₫ • {orderCode}
                        </div>
                        <div className="text-[9px] text-gray-500 font-sans">
                          Mở app Vietcombank, Techcombank, MB, Momo... để quét
                        </div>
                      </div>
                    </div>

                    {/* Bank Transfer Details with Copy Buttons */}
                    <div className="md:col-span-7 space-y-3 font-mono text-xs">
                      <div className="p-2.5 rounded-lg bg-surface-container flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-on-surface-variant block">NGÂN HÀNG THỤ HƯỞNG</span>
                          <span className="text-primary font-semibold">{bankAccount.bankName}</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-surface-container-high text-secondary">
                          BIN: {bankAccount.bin}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-surface-container flex items-center justify-between border border-white/5">
                        <div>
                          <span className="text-[10px] text-on-surface-variant block">SỐ TÀI KHOẢN THỤ HƯỞNG</span>
                          <span className="text-primary font-bold text-sm tracking-wider">
                            {bankAccount.accountNumber}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(bankAccount.accountNumber.replace(/\s+/g, ''), 'stk')}
                          className="px-2.5 py-1 bg-surface-container-high hover:bg-surface-bright text-secondary text-[11px] rounded transition-colors"
                        >
                          {copiedItem === 'stk' ? '✓ Đã chép' : 'Sao chép'}
                        </button>
                      </div>

                      <div className="p-2.5 rounded-lg bg-surface-container flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-on-surface-variant block">TÊN CHỦ TÀI KHOẢN</span>
                          <span className="text-primary font-semibold">{bankAccount.accountName}</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-lg bg-surface-container flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-on-surface-variant block">SỐ TIỀN CHÍNH XÁC</span>
                          <span className="text-titanium font-bold text-sm">1.850.000 ₫</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy('1850000', 'tien')}
                          className="px-2.5 py-1 bg-surface-container-high hover:bg-surface-bright text-secondary text-[11px] rounded transition-colors"
                        >
                          {copiedItem === 'tien' ? '✓ Đã chép' : 'Sao chép'}
                        </button>
                      </div>

                      <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/30 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-amber-200 block">NỘI DUNG CHUYỂN KHOẢN (BẮT BUỘC)</span>
                          <span className="text-amber-300 font-bold text-sm">{orderCode}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(orderCode, 'noidung')}
                          className="px-2.5 py-1 bg-amber-900/60 hover:bg-amber-800 text-amber-100 text-[11px] rounded transition-colors font-bold"
                        >
                          {copiedItem === 'noidung' ? '✓ Đã chép' : 'Sao chép'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Strict Audit Notice & Verification Action Check */}
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <div className="p-3 rounded-lg bg-surface-container-high/60 border border-white/10 flex items-start gap-2.5 text-xs">
                      <span className="material-symbols-outlined text-secondary text-base shrink-0 mt-0.5">shield</span>
                      <div className="space-y-1">
                        <span className="text-primary font-semibold block font-mono text-[11px]">
                          QUY TẮC ĐỐI SOÁT NGHIÊM NGẶT:
                        </span>
                        <p className="text-on-surface-variant text-[11px] leading-relaxed">
                          Chỉ khi tiền chuyển <strong className="text-secondary">đúng số tài khoản {bankAccount.accountNumber}</strong>, <strong className="text-secondary">đủ 1.850.000 ₫</strong> và <strong className="text-secondary">đúng nội dung {orderCode}</strong> thì hệ thống mới xác nhận. Chuyển nhầm tài khoản hoặc thiếu tiền sẽ bị từ chối ngay.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
                      <div className="flex items-center gap-2 text-xs font-mono text-on-surface-variant">
                        <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
                        <span>Lắng nghe giao dịch chuyển khoản...</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowVerificationModal(true)}
                        disabled={isPaidSuccess}
                        className="w-full sm:w-auto px-6 py-3.5 bg-primary-container text-on-primary-container hover:bg-primary font-mono text-xs uppercase tracking-wider rounded-xl font-bold transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {isPaidSuccess ? (
                          <>
                            <span className="material-symbols-outlined text-base text-emerald-400">check_circle</span>
                            <span>ĐÃ ĐỐI SOÁT & XÁC NHẬN THÀNH CÔNG</span>
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-base text-secondary">verified_user</span>
                            <span>KIỂM TRA & ĐỐI SOÁT CHUYỂN KHOẢN</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Quick Simulation Shortcuts for User Testing */}
                    {!isPaidSuccess && (
                      <div className="pt-2 border-t border-white/5 flex flex-wrap items-center gap-2 text-[11px] font-mono text-on-surface-variant">
                        <span className="text-secondary font-semibold">⚡ Thử nghiệm đối soát nhanh:</span>
                        <button
                          type="button"
                          onClick={() => setShowVerificationModal(true)}
                          className="px-2 py-0.5 rounded bg-surface-container hover:bg-surface-bright text-on-surface transition-colors"
                        >
                          Mở Trình Đối Soát & Thử Kịch Bản Sai/Đúng STK →
                        </button>
                      </div>
                    )}
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
                    onClick={handleCardPayment}
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
                    Chuyên viên giám tuyển riêng của LumiCal Atelier sẽ liên hệ trong vòng 15 phút để xác nhận lịch hẹn tại tư gia hoặc văn phòng của quý khách kèm theo tập mẫu các dòng giấy mỹ thuật cao cấp thực tế.
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
                <div className="p-6 bg-emerald-950/90 border border-emerald-500/50 rounded-2xl space-y-4 shadow-2xl">
                  <div className="flex items-center gap-3 text-emerald-300 font-serif text-lg pb-3 border-b border-emerald-500/30">
                    <span className="material-symbols-outlined text-3xl text-emerald-400">verified</span>
                    <div>
                      <div className="font-bold">ĐÃ ĐỐI SOÁT & XÁC NHẬN GIAO DỊCH THÀNH CÔNG!</div>
                      <div className="text-xs font-mono text-emerald-200/80 font-normal">
                        Mã Chuẩn Chi NAPAS: #{verifiedAuditProof?.transactionRef || 'NAPAS-8829-OK'}
                      </div>
                    </div>
                  </div>

                  {/* Verification Audit Breakdown */}
                  <div className="bg-black/30 p-3.5 rounded-xl space-y-2 text-xs font-mono text-emerald-100 border border-emerald-500/20">
                    <div className="flex justify-between">
                      <span className="text-emerald-300/70">Tài khoản nhận tiền:</span>
                      <span className="font-bold text-white">
                        {bankAccount.accountNumber} ({bankAccount.bankName})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-300/70">Số tiền ghi có:</span>
                      <span className="font-bold text-white">1.850.000 ₫</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-300/70">Nội dung chuyển khoản:</span>
                      <span className="font-bold text-amber-300">{orderCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-300/70">Trạng thái đối soát:</span>
                      <span className="font-bold text-emerald-400 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        ĐÃ KHỚP LỆNH CHÍNH XÁC
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-emerald-100/90 leading-relaxed font-sans">
                    Cảm ơn quý khách {recipientName}. Tiền đã về đúng tài khoản chính thức của xưởng. Lệnh in ấn tiêu chuẩn bảo tàng FOGRA39 đã tự động truyền xuống Xưởng Thủ Đức.
                  </p>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      onClick={() => onNavigate('admin-and-print')}
                      className="px-4 py-2.5 bg-emerald-800 text-emerald-100 rounded-lg text-xs font-mono uppercase tracking-wider hover:bg-emerald-700 transition-colors flex items-center gap-1.5"
                    >
                      <span>Theo Dõi Tiến Trình Tại Xưởng</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                    <button
                      onClick={() => onNavigate('webar-scanner')}
                      className="px-4 py-2.5 bg-emerald-400 text-black font-bold rounded-lg text-xs font-mono uppercase tracking-wider hover:bg-white transition-colors flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-sm">view_in_ar</span>
                      <span>Quét Thử WebAR</span>
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
                  <div className="text-[11px] text-secondary font-mono">100% In Trên Giấy Cotton Hahnemühle • Kèm Đế Gỗ Tự Nhiên Dễ Tìm (Hoặc Khung Để Bàn)</div>
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
                  <span className="text-secondary">✦</span> Khắc laser tên riêng lên đế gỗ tự nhiên hoặc viền khung
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

      {/* Strict Bank Transfer Verification Modal */}
      <BankVerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        expectedAccount={bankAccount}
        expectedAmount={orderTotal}
        expectedContent={orderCode}
        onVerifySuccess={handleAuditSuccess}
      />

      {/* Custom Receiving Bank Account Setting Modal */}
      {showBankConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-surface-container rounded-2xl border border-white/15 p-6 shadow-2xl space-y-5 font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="space-y-0.5">
                <h3 className="font-serif text-lg text-primary font-semibold">
                  Cài Đặt Tài Khoản Nhận Tiền Thật
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Nhập số tài khoản ngân hàng của bạn để VietQR chuyển tiền vào tài khoản này
                </p>
              </div>
              <button
                onClick={() => setShowBankConfigModal(false)}
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveBankAccount} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-on-surface-variant mb-1 uppercase font-semibold">
                  NGÂN HÀNG THỤ HƯỞNG
                </label>
                <select
                  value={tempBankBin}
                  onChange={(e) => setTempBankBin(e.target.value)}
                  className="w-full px-3 py-2.5 rounded bg-surface-container-lowest border border-white/10 text-on-surface text-xs focus:outline-none focus:border-secondary"
                >
                  {VIETNAM_BANKS.map((b) => (
                    <option key={b.bin} value={b.bin} className="bg-neutral-900 text-white">
                      {b.shortName} - {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-on-surface-variant mb-1 uppercase font-semibold">
                  SỐ TÀI KHOẢN CỦA BẠN
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: 190388298888 hoặc 0988..."
                  value={tempAccountNo}
                  onChange={(e) => setTempAccountNo(e.target.value)}
                  className="w-full px-3 py-2.5 rounded bg-surface-container-lowest border border-white/10 text-primary font-mono text-sm tracking-wider focus:outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label className="block text-on-surface-variant mb-1 uppercase font-semibold">
                  TÊN CHỦ TÀI KHOẢN (KHÔNG DẤU)
                </label>
                <input
                  type="text"
                  required
                  placeholder="NGUYEN VAN A"
                  value={tempAccountName}
                  onChange={(e) => setTempAccountName(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2.5 rounded bg-surface-container-lowest border border-white/10 text-primary font-mono text-sm uppercase focus:outline-none focus:border-secondary"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowBankConfigModal(false)}
                  className="px-4 py-2 rounded bg-surface-container-high hover:bg-surface-bright text-on-surface-variant text-xs transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-secondary text-on-secondary font-bold text-xs uppercase tracking-wider hover:bg-secondary/90 transition-colors shadow-lg"
                >
                  Lưu & Cập Nhật VietQR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
