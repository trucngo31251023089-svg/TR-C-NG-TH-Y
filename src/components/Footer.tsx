import React from 'react';
import { ScreenId } from '../types';

interface FooterProps {
  onNavigate?: (screen: ScreenId) => void;
  onOpenVault?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenVault }) => {
  return (
    <footer className="w-full bg-surface-container-lowest border-t border-outline-variant/20 pt-16 pb-12 mt-20">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-outline-variant/15">
          {/* Brand Philosophy */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-serif text-2xl text-primary uppercase font-normal tracking-wide">LUMICAL</span>
              <span className="font-label-sm text-[10px] tracking-widest text-outline uppercase font-mono">/ ARCHIVAL EDITIONS</span>
            </div>
            <p className="font-body-md text-sm text-on-surface-variant max-w-xl leading-relaxed">
              Xưởng chế tác lịch nghệ thuật vật lý tích hợp không gian thực tế tăng cường AR. Kết hợp quy chuẩn in mỹ thuật Haute Horlogerie, bảo quản sợi tơ cotton không axit cùng công nghệ đồng bộ đám mây lượng tử hóa.
            </p>
            <div className="flex items-center gap-4 pt-1">
              <span className="font-label-sm text-xs tracking-widest text-secondary uppercase font-medium">
                PARIS • GENEVA • TOKYO • SAIGON
              </span>
            </div>
          </div>

          {/* Standards */}
          <div className="md:col-span-3 space-y-3">
            <span className="font-label-sm text-xs tracking-widest text-primary uppercase block font-semibold">
              QUY CHUẨN CHẾ TÁC
            </span>
            <ul className="space-y-2 font-body-sm text-xs text-on-surface-variant">
              <li 
                onClick={() => onNavigate && onNavigate('admin-and-print')}
                className="hover:text-primary transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span className="text-secondary text-[10px]">✦</span> Giấy Mỹ Thuật Cotton Museum Grade
              </li>
              <li 
                onClick={() => onNavigate && onNavigate('admin-and-print')}
                className="hover:text-primary transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span className="text-secondary text-[10px]">✦</span> Mực Khoáng Pigment Siêu Bền Vững
              </li>
              <li 
                onClick={() => onNavigate && onNavigate('design-studio')}
                className="hover:text-primary transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span className="text-secondary text-[10px]">✦</span> Giấy Mỹ Thuật Châu Âu & Ép Kim Thủ Công
              </li>
              <li 
                onClick={() => onNavigate && onNavigate('webar-scanner')}
                className="hover:text-primary transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span className="text-secondary text-[10px]">✦</span> WebAR Micro-Engine 60FPS
              </li>
            </ul>
          </div>

          {/* Private Concierge */}
          <div className="md:col-span-3 space-y-3">
            <span className="font-label-sm text-xs tracking-widest text-primary uppercase block font-semibold">
              PRIVATE CONCIERGE
            </span>
            <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
              Dịch vụ tư vấn độc bản dành riêng cho các thành viên Atelier.
            </p>
            <div className="pt-1">
              <a 
                href="mailto:desk@lumical-atelier.com" 
                className="font-label-md text-xs text-secondary tracking-wider block hover:underline"
              >
                desk@lumical-atelier.com
              </a>
              <span className="font-caption text-[11px] text-outline block mt-1">
                Hotline VIP: +84 (0) 28 8899 LUMI
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-on-surface-variant font-caption text-[11px]">
          <div>
            © 2025 LUMICAL PHYGITAL ATELIER. TOÀN BỘ QUYỀN ĐƯỢC BẢO LƯU TRÊN TOÀN CẦU.
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={onOpenVault} 
              className="hover:text-primary transition-colors tracking-wider uppercase"
            >
              CHÍNH SÁCH BẢO MẬT E2EE
            </button>
            <button 
              onClick={() => onNavigate && onNavigate('checkout')} 
              className="hover:text-primary transition-colors tracking-wider uppercase"
            >
              ĐIỀU KHOẢN PHIÊN BẢN GIỚI HẠN
            </button>
            <button 
              onClick={() => onNavigate && onNavigate('webar-scanner')} 
              className="hover:text-primary transition-colors tracking-wider uppercase"
            >
              TIÊU CHUẨN GIẢI THUẬT AR
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
