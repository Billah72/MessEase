import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Role } from '../types';
import { StorageService } from '../services/storage';

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  isAuthenticated: boolean;
  isManager: boolean;
  isMember: boolean;
  loginManagerWithGoogle: () => boolean;
  registerManagerWithGoogle: (name: string, email: string, messName: string) => boolean;
  loginMemberWithCredentials: (email: string, password: string) => { success: boolean; error?: string };
  switchDemoUser: (userId: string) => void;
  logout: () => void;
  changePassword: (newPassword: string) => void;
  updateCurrentUserProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => StorageService.getUsers());
  const [currentUserId, setCurrentUserId] = useState<string | null>(() => StorageService.getActiveUserId());

  const currentUser = users.find(u => u.id === currentUserId) || null;

  useEffect(() => {
    StorageService.saveUsers(users);
  }, [users]);

  useEffect(() => {
    StorageService.saveActiveUserId(currentUserId);
  }, [currentUserId]);

  const loginManagerWithGoogle = () => {
    const manager = users.find(u => u.role === 'MANAGER');
    if (manager) {
      setCurrentUserId(manager.id);
      return true;
    }
    return false;
  };

  const registerManagerWithGoogle = (name: string, email: string, messName: string) => {
    const newManager: User = {
      id: `manager-${Date.now()}`,
      name,
      email,
      phone: '+880 1711-000000',
      role: 'MANAGER',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      roomNo: 'Room 401 (Manager)',
      joinDate: new Date().toISOString().split('T')[0],
      status: 'ACTIVE',
      isGoogleUser: true
    };

    const currentSettings = StorageService.getSettings();
    StorageService.saveSettings({
      ...currentSettings,
      messName: messName || currentSettings.messName
    });

    setUsers(prev => [newManager, ...prev.filter(u => u.role !== 'MANAGER')]);
    setCurrentUserId(newManager.id);
    return true;
  };

  const loginMemberWithCredentials = (email: string, password: string): { success: boolean; error?: string } => {
    const trimmedEmail = email.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === trimmedEmail && u.role === 'MEMBER');

    if (!user) {
      return { success: false, error: 'No member account found with this email. Please contact the Mess Manager.' };
    }

    if (user.status === 'INACTIVE') {
      return { success: false, error: 'Your member account is currently inactive. Contact Manager to reactivate.' };
    }

    // Default password for demo is 'member123' if not set
    const userPass = user.password || 'member123';
    if (userPass !== password.trim()) {
      return { success: false, error: 'Incorrect password. Default demo password is member123.' };
    }

    setCurrentUserId(user.id);
    return { success: true };
  };

  const switchDemoUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUserId(user.id);
    }
  };

  const logout = () => {
    setCurrentUserId(null);
  };

  const changePassword = (newPassword: string) => {
    if (!currentUser) return;
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, password: newPassword } : u));
  };

  const updateCurrentUserProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, ...data } : u));
  };

  const isManager = currentUser?.role === 'MANAGER';
  const isMember = currentUser?.role === 'MEMBER';
  const isAuthenticated = !!currentUser;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        isAuthenticated,
        isManager,
        isMember,
        loginManagerWithGoogle,
        registerManagerWithGoogle,
        loginMemberWithCredentials,
        switchDemoUser,
        logout,
        changePassword,
        updateCurrentUserProfile
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
