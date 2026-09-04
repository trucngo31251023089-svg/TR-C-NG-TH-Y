import React from 'react';

interface E2EEVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const E2EEVaultModal: React.FC<E2EEVaultModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-surface-container border border-white/15 max-w-lg w-full p-6 sm:p-8 rounded-xl shadow-2xl space-y-5 text-on-surface relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-secondary-container text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">shield</span>
            </div>
            <div>
              <h3 className="font-serif text-lg text-primary">E2EE 256-Bit Vault Protocol</h3>
              <span className="font-mono text-[10px] text-secondary tracking-widest uppercase">
                Zero-Knowledge Proof Verified
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-primary transition-colors p-1"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 text-xs font-sans">
          <p className="text-on-surface-variant leading-relaxed">
            Mọi hình ảnh, thước phim 4K và tin nhắn giọng nói trên cuốn lịch phygital của bạn đều được mã hóa cục bộ tại thiết bị bằng thuật toán AES-256-GCM trước khi lưu trữ phi tập trung trên mạng lưới IPFS Thụy Sĩ.
          </p>

          {/* Key details */}
          <div className="bg-surface-container-lowest p-4 rounded border border-white/5 space-y-2.5 font-mono text-[11px]">
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant">Khóa mã hóa cá nhân:</span>
              <span className="text-titanium">0x8829...4F9B (E2EE Vault)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant">Mạng phân tán:</span>
              <span className="text-secondary">IPFS Swarm Node 4.1.2</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant">Chuẩn nén không suy hao:</span>
              <span className="text-primary">FLAC 24-Bit / ProRes 422</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant">Quyền giải mã AR:</span>
              <span className="text-secondary">Chỉ ống kính nhận diện vật lý</span>
            </div>
          </div>

          <div className="p-3 bg-secondary-container/30 border border-secondary/20 rounded flex items-center gap-2.5 text-secondary text-[11px]">
            <span className="material-symbols-outlined text-base shrink-0">verified_user</span>
            <span>Chỉ người cầm ấn bản lịch vật lý trong tay mới có thể giải mã và xem được nội dung.</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-primary text-on-primary hover:bg-white text-xs uppercase tracking-wider font-semibold rounded transition-colors"
          >
            Đã Hiểu & Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
