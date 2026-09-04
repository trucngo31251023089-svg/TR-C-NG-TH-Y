import React, { useState } from 'react';
import { ScreenId } from '../types';
import { BRAND_LOGO_URL } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  onOpenVault: () => void;
  onOpenAccount: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  onOpenVault,
  onOpenAccount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isLoggedIn } = useAuth();

  const navItems: { id: ScreenId; label: string }[] = [
    { id: 'home', label: 'TRANG CHỦ' },
    { id: 'about-us', label: 'VỀ CHÚNG TÔI' },
    { id: 'design-studio', label: 'STUDIO THIẾT KẾ' },
    { id: 'webar-scanner', label: 'QUÉT LỊCH WEBAR' },
    { id: 'collaborative-portal', label: 'THU THẬP LỜI CHÚC' },
    { id: 'checkout', label: 'ĐẶT IN & THANH TOÁN' }
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#121316]/90 backdrop-blur-xl border-b border-white/[0.07]">
      <div className="h-20 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-4">
        {/* Brand Logo & Atelier Monogram */}
        <div 
          onClick={() => onNavigate('home')} 
          className="flex items-center gap-3.5 shrink-0 cursor-pointer group"
        >
          <img 
            src={BRAND_LOGO_URL} 
            alt="LumiCal Phygital Atelier Logo" 
            className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span className="font-serif text-lg tracking-wide text-primary uppercase font-medium">LUMICAL</span>
            <span className="font-label-sm text-[10px] tracking-[0.24em] text-on-surface-variant uppercase font-sans">PHYGITAL ATELIER</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden 2xl:flex items-center gap-7">
          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`font-label-md text-[11px] tracking-[0.16em] uppercase transition-all py-1.5 border-b-2 ${
                  isActive 
                    ? 'text-primary border-primary font-medium' 
                    : 'text-on-surface-variant border-transparent hover:text-primary'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Medium desktop nav (compact) */}
        <nav className="hidden lg:flex 2xl:hidden items-center gap-4 text-[10px]">
          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`tracking-widest uppercase transition-all py-1 border-b ${
                  isActive 
                    ? 'text-primary border-primary font-medium' 
                    : 'text-on-surface-variant border-transparent hover:text-primary'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          {/* E2EE Vault button */}
          <button
            onClick={onOpenVault}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 text-secondary transition-all"
            title="Mã hóa lưu trữ E2EE 256-Bit"
          >
            <span className="material-symbols-outlined text-[15px]">lock</span>
            <span className="font-label-sm text-[10px] tracking-wider uppercase font-mono">E2EE 256-BIT VAULT</span>
          </button>

          {/* Account / Login Button */}
          {isLoggedIn && user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAccount}
                className="hidden sm:flex flex-col text-right group"
              >
                <span className="font-serif text-xs text-primary font-medium group-hover:text-secondary transition-colors truncate max-w-[120px]">
                  {user.name}
                </span>
                <span className="font-mono text-[9px] text-secondary tracking-wider uppercase">
                  VIP ELITE
                </span>
              </button>

              {/* Profile Picture */}
              <button
                onClick={onOpenAccount}
                className="relative rounded-full ring-1 ring-secondary/50 overflow-hidden group focus:outline-none"
                title="Quản lý tài khoản Atelier & Đơn hàng"
              >
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-8 h-8 rounded-full object-cover group-hover:scale-105 transition-transform" 
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-400 rounded-full ring-1 ring-background"></span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAccount}
              className="px-3.5 py-1.5 bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary transition-all duration-200 rounded-xl font-mono text-[11px] uppercase tracking-wider font-bold shadow-sm flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">login</span>
              <span>ĐĂNG NHẬP / ĐĂNG KÝ</span>
            </button>
          )}

          {/* Mobile hamburger menu button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-on-surface-variant hover:text-primary rounded"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface-container border-b border-white/10 px-6 py-4 space-y-3">
          <div className="grid grid-cols-1 gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left py-2 px-3 rounded text-xs uppercase tracking-wider transition-colors ${
                  currentScreen === item.id 
                    ? 'bg-primary-container text-on-primary-container font-semibold' 
                    : 'text-on-surface hover:bg-surface-container-high'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="pt-3 border-t border-white/5 flex items-center justify-between">
            <button
              onClick={() => {
                onOpenVault();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1 text-[11px] text-secondary font-mono"
            >
              <span className="material-symbols-outlined text-sm">lock</span>
              <span>E2EE Vault</span>
            </button>
            <span className="text-[10px] text-on-surface-variant font-mono">Phiên bản v4.8.2</span>
          </div>
        </div>
      )}
    </header>
  );
};
