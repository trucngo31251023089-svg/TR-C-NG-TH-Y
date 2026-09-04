import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { USER_AVATAR_URL } from '../data/mockData';

interface AuthContextType {
  user: UserProfile | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (data: {
    name: string;
    email: string;
    phone?: string;
    password: string;
    accountType?: string;
  }) => Promise<{ success: boolean; message: string }>;
  loginAsDemo: () => void;
  logout: () => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
}

const DEFAULT_DEMO_USER: UserProfile = {
  id: 'USR-8829-VIP',
  name: 'Nguyễn Hoàng Bảo Long',
  email: 'baolong.hoang@lumical.vn',
  phone: '+84 918 288 388',
  avatar: USER_AVATAR_URL,
  membershipLevel: 'Atelier Membership Elite • Khách Hàng Danh Dự',
  tierColor: '#d4af37',
  joinedDate: 'Tháng 10/2023',
  ordersCount: 3,
  vaultKeyVerified: true
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const savedUser = localStorage.getItem('lumical_auth_user');
      if (savedUser) {
        return JSON.parse(savedUser);
      }
      // Default to demo user if not explicitly logged out
      const hasLoggedOut = localStorage.getItem('lumical_logged_out');
      if (!hasLoggedOut) {
        return DEFAULT_DEMO_USER;
      }
      return null;
    } catch (e) {
      return DEFAULT_DEMO_USER;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('lumical_auth_user', JSON.stringify(user));
      localStorage.removeItem('lumical_logged_out');
    } else {
      localStorage.removeItem('lumical_auth_user');
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    // Simulate brief network authentication
    await new Promise((res) => setTimeout(res, 600));

    if (!email.trim() || !password.trim()) {
      return { success: false, message: 'Vui lòng nhập đầy đủ Email và Mật khẩu.' };
    }

    // Check custom registered users from localStorage
    try {
      const registeredAccounts = JSON.parse(localStorage.getItem('lumical_registered_accounts') || '[]');
      const found = registeredAccounts.find(
        (acc: any) => acc.email.toLowerCase() === email.toLowerCase() && acc.password === password
      );

      if (found) {
        const loggedUser: UserProfile = {
          id: found.id || `USR-${Date.now()}`,
          name: found.name,
          email: found.email,
          phone: found.phone || '+84 900 000 000',
          avatar: found.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          membershipLevel: found.accountType === 'corporate' ? 'Atelier Corporate Patron' : 'Atelier Collector Member',
          tierColor: '#bbcac1',
          joinedDate: 'Vừa tham gia',
          ordersCount: 0,
          vaultKeyVerified: true
        };
        setUser(loggedUser);
        return { success: true, message: `Chào mừng trở lại, ${loggedUser.name}!` };
      }
    } catch (e) {
      // Fallback
    }

    // Check demo credentials
    if (email.toLowerCase() === 'baolong.hoang@lumical.vn' || email.toLowerCase() === 'admin@lumical.vn' || password === '123456') {
      setUser(DEFAULT_DEMO_USER);
      return { success: true, message: 'Đăng nhập thành công với tài khoản Atelier Elite!' };
    }

    // If generic valid email format and password >= 4 chars, allow login as standard collector
    if (email.includes('@') && password.length >= 4) {
      const genericUser: UserProfile = {
        id: `USR-${Date.now().toString().slice(-4)}`,
        name: email.split('@')[0].toUpperCase(),
        email: email,
        phone: '+84 988 123 456',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        membershipLevel: 'Atelier Collector Member',
        tierColor: '#bbcac1',
        joinedDate: 'Hôm nay',
        ordersCount: 0,
        vaultKeyVerified: true
      };
      setUser(genericUser);
      return { success: true, message: `Đăng nhập thành công với ${email}!` };
    }

    return { success: false, message: 'Thông tin tài khoản hoặc mật khẩu không chính xác.' };
  };

  const register = async (data: {
    name: string;
    email: string;
    phone?: string;
    password: string;
    accountType?: string;
  }): Promise<{ success: boolean; message: string }> => {
    await new Promise((res) => setTimeout(res, 700));

    if (!data.name.trim()) {
      return { success: false, message: 'Vui lòng nhập họ và tên chủ nhân ấn phẩm.' };
    }
    if (!data.email.trim() || !data.email.includes('@')) {
      return { success: false, message: 'Địa chỉ email không đúng định dạng.' };
    }
    if (!data.password || data.password.length < 6) {
      return { success: false, message: 'Mật khẩu bảo mật phải có ít nhất 6 ký tự.' };
    }

    // Save to local registry
    try {
      const existing = JSON.parse(localStorage.getItem('lumical_registered_accounts') || '[]');
      const already = existing.some((acc: any) => acc.email.toLowerCase() === data.email.toLowerCase());
      if (already) {
        return { success: false, message: 'Email này đã được đăng ký trên Atelier Vault.' };
      }

      const newAccount = {
        id: `USR-${Date.now()}`,
        name: data.name,
        email: data.email,
        phone: data.phone || '+84 900 000 000',
        password: data.password,
        accountType: data.accountType || 'personal',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
      };

      existing.push(newAccount);
      localStorage.setItem('lumical_registered_accounts', JSON.stringify(existing));

      const newUser: UserProfile = {
        id: newAccount.id,
        name: newAccount.name,
        email: newAccount.email,
        phone: newAccount.phone,
        avatar: newAccount.avatar,
        membershipLevel: data.accountType === 'corporate' ? 'Atelier Corporate Member' : 'Atelier Member • Khách Hàng Thân Thiết',
        tierColor: '#8a9a86',
        joinedDate: 'Vừa gia nhập',
        ordersCount: 0,
        vaultKeyVerified: true
      };

      setUser(newUser);
      return { success: true, message: `Chào mừng ${newUser.name} gia nhập Atelier!` };
    } catch (e) {
      return { success: false, message: 'Không thể khởi tạo tài khoản lúc này.' };
    }
  };

  const loginAsDemo = () => {
    setUser(DEFAULT_DEMO_USER);
  };

  const logout = () => {
    setUser(null);
    localStorage.setItem('lumical_logged_out', 'true');
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...updated } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        register,
        loginAsDemo,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
