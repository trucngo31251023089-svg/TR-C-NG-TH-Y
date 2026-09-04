import React, { useState } from 'react';
import { ScreenId } from '../types';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

interface AtelierAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: ScreenId) => void;
}

export const AtelierAccountModal: React.FC<AtelierAccountModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const { user, isLoggedIn, login, register, loginAsDemo, logout, updateProfile } = useAuth();

  // Auth form states
  const [authView, setAuthView] = useState<'login' | 'register' | 'forgot'>('login');
  const [loginEmail, setLoginEmail] = useState<string>('baolong.hoang@lumical.vn');
  const [loginPassword, setLoginPassword] = useState<string>('123456');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Register form states
  const [regName, setRegName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regConfirmPassword, setRegConfirmPassword] = useState<string>('');
  const [regAccountType, setRegAccountType] = useState<'personal' | 'family' | 'corporate'>('personal');
  const [agreeTerms, setAgreeTerms] = useState<boolean>(true);

  // Profile edit state
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>('');
  const [editPhone, setEditPhone] = useState<string>('');

  // Status/feedback
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    const result = await login(loginEmail, loginPassword);
    setLoading(false);

    if (result.success) {
      setSuccessMessage(result.message);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    } else {
      setErrorMessage(result.message);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không khớp.');
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('Vui lòng đồng ý với cam kết bảo mật & quyền sở hữu tác phẩm.');
      return;
    }

    setLoading(true);
    const result = await register({
      name: regName,
      email: regEmail,
      phone: regPhone,
      password: regPassword,
      accountType: regAccountType
    });
    setLoading(false);

    if (result.success) {
      setSuccessMessage(result.message);
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    } else {
      setErrorMessage(result.message);
    }
  };

  const handleDemoLogin = () => {
    loginAsDemo();
    setSuccessMessage('Đã đăng nhập nhanh với tài khoản VIP Elite: Nguyễn Hoàng Bảo Long!');
    confetti({ particleCount: 40, spread: 50 });
  };

  const handleSaveProfile = () => {
    if (user && editName.trim()) {
      updateProfile({
        name: editName,
        phone: editPhone
      });
      setIsEditingProfile(false);
      setSuccessMessage('Đã cập nhật hồ sơ khách hàng thành công!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-surface-container border border-white/15 max-w-xl w-full p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6 text-on-surface relative max-h-[90vh] overflow-y-auto animate-fade-in">
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-on-surface-variant hover:text-primary transition-colors p-1 rounded-full hover:bg-white/10"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        {/* ========================================================================= */}
        {/* CASE 1: USER IS LOGGED IN -> SHOW PROFILE & ORDER MANAGEMENT             */}
        {/* ========================================================================= */}
        {isLoggedIn && user ? (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 pb-4 border-b border-white/10 pr-8">
              <div className="relative shrink-0">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-secondary/50"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-black"></span>
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-xl text-primary font-medium">{user.name}</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-secondary/20 text-secondary border border-secondary/30">
                    {user.id}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-secondary">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  <span className="font-mono text-[11px]">{user.membershipLevel}</span>
                </div>
                <div className="text-[11px] text-on-surface-variant font-mono">
                  {user.email} • {user.phone}
                </div>
              </div>
            </div>

            {/* Success toast if any */}
            {successMessage && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-emerald-200 text-xs font-mono flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-emerald-400">check_circle</span>
                <span>{successMessage}</span>
              </div>
            )}

            {/* Profile Edit Toggle Form */}
            {isEditingProfile ? (
              <div className="bg-surface-container-low p-4 rounded-2xl border border-white/10 space-y-3">
                <h4 className="font-mono text-xs text-secondary uppercase font-semibold">
                  Cập Nhật Thông Tin Khách Hàng
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-mono text-on-surface-variant uppercase mb-1">
                      HỌ VÀ TÊN
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-surface-container-lowest border border-white/10 text-on-surface"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-on-surface-variant uppercase mb-1">
                      SỐ ĐIỆN THOẠI
                    </label>
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-surface-container-lowest border border-white/10 text-on-surface"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setIsEditingProfile(false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono bg-surface-container-high hover:bg-surface-bright text-on-surface-variant"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="px-4 py-1.5 rounded-lg text-xs font-mono bg-secondary text-on-secondary font-bold"
                  >
                    Lưu Thay Đổi
                  </button>
                </div>
              </div>
            ) : null}

            {/* Active Order Card */}
            <div className="bg-surface-container-low p-5 rounded-2xl border border-white/10 space-y-3.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-secondary uppercase tracking-widest font-mono text-[10px] font-semibold">
                  ĐƠN HÀNG ĐANG CHẾ TÁC TẠI XƯỞNG
                </span>
                <span className="px-2 py-0.5 rounded bg-secondary-container text-secondary text-[10px] font-mono font-medium">
                  KHÂU 3/5: ÉP NHŨ & BỒI GIẤY MỸ THUẬT
                </span>
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <div className="font-mono text-sm text-primary font-semibold">#LUMI-8829-VN</div>
                  <div className="text-xs text-on-surface-variant">Lịch Thẻ Để Bàn • 100% Giấy Cotton Hahnemühle 310gsm</div>
                  <div className="text-[11px] text-outline font-mono mt-0.5">12 Video 4K HDR • 38 Lời Chúc WebAR</div>
                </div>
                <span className="font-serif text-lg text-titanium font-medium">1.250.000 ₫</span>
              </div>

              {/* Step indicator */}
              <div className="pt-2">
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-secondary h-full rounded-full w-[60%]"></div>
                </div>
                <div className="flex justify-between text-[9px] font-mono text-on-surface-variant mt-1.5">
                  <span>Tiếp nhận</span>
                  <span>Bình trang</span>
                  <span className="text-secondary font-bold">Ép nhũ vàng</span>
                  <span>Phay CNC</span>
                  <span>Giao bảo đảm</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-white/5">
                <button
                  onClick={() => {
                    onClose();
                    onNavigate('admin-and-print');
                  }}
                  className="px-3.5 py-2 bg-surface-container-high hover:bg-surface-bright text-primary text-[11px] font-mono rounded-lg uppercase tracking-wider transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">precision_manufacturing</span>
                  <span>Theo Dõi Tại Xưởng</span>
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onNavigate('webar-scanner');
                  }}
                  className="px-3.5 py-2 bg-primary-container text-on-primary-container hover:bg-primary text-[11px] font-mono rounded-lg uppercase tracking-wider transition-colors flex items-center gap-1.5 font-bold"
                >
                  <span className="material-symbols-outlined text-sm">view_in_ar</span>
                  <span>Quét Thử WebAR</span>
                </button>
              </div>
            </div>

            {/* Quick Navigation Cards */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <button
                onClick={() => {
                  onClose();
                  onNavigate('design-studio');
                }}
                className="p-4 bg-surface-container-low hover:bg-surface-container-high rounded-2xl border border-white/5 text-left transition-all flex flex-col justify-between group"
              >
                <span className="material-symbols-outlined text-secondary text-xl mb-2 group-hover:scale-110 transition-transform">
                  palette
                </span>
                <span className="font-medium text-primary block text-sm">Studio Tự Thiết Kế</span>
                <span className="text-[10px] text-on-surface-variant">Tùy biến ảnh 12 tháng & mẫu AI</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onNavigate('collaborative-portal');
                }}
                className="p-4 bg-surface-container-low hover:bg-surface-container-high rounded-2xl border border-white/5 text-left transition-all flex flex-col justify-between group"
              >
                <span className="material-symbols-outlined text-secondary text-xl mb-2 group-hover:scale-110 transition-transform">
                  group_add
                </span>
                <span className="font-medium text-primary block text-sm">Cổng Lời Chúc Bí Mật</span>
                <span className="text-[10px] text-on-surface-variant">38/50 lời chúc đã đồng bộ</span>
              </button>
            </div>

            {/* Account Management & Logout Actions */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => {
                  setEditName(user.name);
                  setEditPhone(user.phone || '');
                  setIsEditingProfile(!isEditingProfile);
                }}
                className="text-xs font-mono text-on-surface-variant hover:text-primary flex items-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">manage_accounts</span>
                <span>{isEditingProfile ? 'Đóng chỉnh sửa' : 'Chỉnh sửa hồ sơ'}</span>
              </button>

              <button
                onClick={() => {
                  logout();
                  setAuthView('login');
                  setSuccessMessage('Bạn đã đăng xuất an toàn.');
                }}
                className="px-3.5 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 text-xs font-mono flex items-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">logout</span>
                <span>Đăng Xuất</span>
              </button>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* CASE 2: GUEST / NOT LOGGED IN -> SHOW LOGIN / REGISTER TABS              */
          /* ========================================================================= */
          <div className="space-y-6">
            {/* Atelier Brand Emblem */}
            <div className="text-center space-y-2 pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-surface-container-high border border-outline-variant/30">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                <span className="font-label-sm text-[10px] tracking-[0.24em] text-secondary uppercase font-mono">
                  ATELIER CLIENT VAULT
                </span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-primary font-normal">
                {authView === 'login' ? 'Đăng Nhập Atelier' : 'Đăng Ký Thành Viên'}
              </h3>
              <p className="font-body-sm text-xs text-on-surface-variant max-w-sm mx-auto">
                Truy cập kho lưu trữ phygital, kích hoạt chứng chỉ số và đồng bộ hóa lời chúc WebAR bảo mật.
              </p>
            </div>

            {/* Login / Register Switcher Tabs */}
            <div className="grid grid-cols-2 p-1.5 bg-surface-container-low rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => {
                  setAuthView('login');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                  authView === 'login'
                    ? 'bg-secondary text-on-secondary font-bold shadow'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                <span className="material-symbols-outlined text-sm">login</span>
                <span>Đăng Nhập</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthView('register');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                  authView === 'register'
                    ? 'bg-secondary text-on-secondary font-bold shadow'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                <span className="material-symbols-outlined text-sm">person_add</span>
                <span>Đăng Ký Mới</span>
              </button>
            </div>

            {/* Feedback Messages */}
            {errorMessage && (
              <div className="p-3 bg-red-950/80 border border-red-500/40 rounded-xl text-red-200 text-xs font-mono flex items-center gap-2 animate-fade-in">
                <span className="material-symbols-outlined text-sm text-red-400">error</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-emerald-200 text-xs font-mono flex items-center gap-2 animate-fade-in">
                <span className="material-symbols-outlined text-sm text-emerald-400">check_circle</span>
                <span>{successMessage}</span>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* SUB-VIEW 1: LOGIN FORM                                        */}
            {/* ------------------------------------------------------------- */}
            {authView === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-mono text-on-surface-variant uppercase">
                    EMAIL / TÀI KHOẢN ATELIER *
                  </label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container-lowest border border-white/10 text-on-surface text-sm focus:outline-none focus:border-secondary font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-mono text-on-surface-variant uppercase">
                      MẬT KHẨU BẢO MẬT *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[11px] font-mono text-secondary hover:underline"
                    >
                      {showPassword ? 'Ẩn' : 'Hiện mật khẩu'}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 rounded-xl bg-surface-container-lowest border border-white/10 text-on-surface text-sm focus:outline-none focus:border-secondary font-sans"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-mono">
                  <label className="flex items-center gap-2 cursor-pointer text-on-surface-variant">
                    <input type="checkbox" defaultChecked className="rounded accent-secondary" />
                    <span>Ghi nhớ phiên đăng nhập</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setSuccessMessage('Mã xác thực OTP đã được gửi đến số điện thoại và email bảo mật của bạn.');
                    }}
                    className="text-secondary hover:underline"
                  >
                    Quên mật khẩu?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-primary-container text-on-primary-container hover:bg-primary font-mono text-xs uppercase tracking-wider font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                  ) : (
                    <span className="material-symbols-outlined text-sm">lock_open</span>
                  )}
                  <span>{loading ? 'ĐANG XÁC THỰC E2EE...' : 'ĐĂNG NHẬP VÀO ATELIER'}</span>
                </button>

                {/* 1-Click Fast VIP Demo Login */}
                <div className="pt-2">
                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-white/10"></div>
                    <span className="flex-shrink mx-3 text-[10px] font-mono text-on-surface-variant uppercase">
                      TRẢI NGHIỆM NHANH
                    </span>
                    <div className="flex-grow border-t border-white/10"></div>
                  </div>

                  <button
                    type="button"
                    onClick={handleDemoLogin}
                    className="w-full py-2.5 bg-surface-container-high hover:bg-surface-bright border border-secondary/40 text-primary font-mono text-xs rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-secondary text-sm">verified_user</span>
                    <span>1-Chạm: Đăng Nhập Tài Khoản VIP Elite (Bảo Long)</span>
                  </button>
                </div>
              </form>
            )}

            {/* ------------------------------------------------------------- */}
            {/* SUB-VIEW 2: REGISTER FORM                                     */}
            {/* ------------------------------------------------------------- */}
            {authView === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="block text-xs font-mono text-on-surface-variant uppercase">
                    HỌ VÀ TÊN NGƯỜI DÙNG *
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Ví dụ: Hoàng Bảo Long"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest border border-white/10 text-on-surface text-sm focus:outline-none focus:border-secondary font-sans"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-mono text-on-surface-variant uppercase">
                      EMAIL XÁC THỰC *
                    </label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="baolong@example.com"
                      className="w-full px-3.5 py-2 rounded-xl bg-surface-container-lowest border border-white/10 text-on-surface text-xs focus:outline-none focus:border-secondary font-sans"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-mono text-on-surface-variant uppercase">
                      SỐ ĐIỆN THOẠI
                    </label>
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+84 9xx xxx xxx"
                      className="w-full px-3.5 py-2 rounded-xl bg-surface-container-lowest border border-white/10 text-on-surface text-xs focus:outline-none focus:border-secondary font-sans"
                    />
                  </div>
                </div>

                {/* Account Type */}
                <div className="space-y-1">
                  <label className="block text-xs font-mono text-on-surface-variant uppercase">
                    MỤC ĐÍCH SỬ DỤNG
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                    {[
                      { id: 'personal', label: 'Cá Nhân' },
                      { id: 'family', label: 'Gia Đình' },
                      { id: 'corporate', label: 'Doanh Nghiệp' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setRegAccountType(item.id as any)}
                        className={`py-2 rounded-lg border transition-all ${
                          regAccountType === item.id
                            ? 'bg-secondary text-on-secondary font-bold border-secondary'
                            : 'bg-surface-container-lowest border-white/10 text-on-surface-variant'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-mono text-on-surface-variant uppercase">
                      MẬT KHẨU (≥ 6 KÝ TỰ) *
                    </label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2 rounded-xl bg-surface-container-lowest border border-white/10 text-on-surface text-xs focus:outline-none focus:border-secondary font-sans"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-mono text-on-surface-variant uppercase">
                      XÁC NHẬN MẬT KHẨU *
                    </label>
                    <input
                      type="password"
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2 rounded-xl bg-surface-container-lowest border border-white/10 text-on-surface text-xs focus:outline-none focus:border-secondary font-sans"
                    />
                  </div>
                </div>

                <label className="flex items-start gap-2 cursor-pointer text-[11px] text-on-surface-variant font-mono pt-1">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded accent-secondary"
                  />
                  <span>
                    Tôi đồng ý với chính sách bảo mật thông tin và bảo vệ video, kỷ niệm gia đình trên LumiCal.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-primary-container text-on-primary-container hover:bg-primary font-mono text-xs uppercase tracking-wider font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                  ) : (
                    <span className="material-symbols-outlined text-sm">badge</span>
                  )}
                  <span>{loading ? 'ĐANG KHỞI TẠO TÀI KHOẢN...' : 'HOÀN TẤT ĐĂNG KÝ THÀNH VIÊN'}</span>
                </button>
              </form>
            )}

            {/* Security Guarantee Note */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-on-surface-variant font-mono">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-secondary">lock</span>
                <span>Bảo Mật Video & Hình Ảnh Riêng Tư</span>
              </span>
              <span className="text-secondary">Chất Lượng In FOGRA39 Chuẩn Màu</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
