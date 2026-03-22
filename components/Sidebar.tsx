'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sword, History, Settings, LogOut, X } from 'lucide-react';
import { useState } from 'react';
import { LogoutConfirmModal } from './LogoutConfirmModal';
import Image from 'next/image';
import logo from '../public/assets/Ghana-Customs.jpg';

interface SidebarProps {
  activePage: 'weapons' | 'history' | 'settings';
  onPageChange: (page: 'weapons' | 'history' | 'settings') => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ activePage, onPageChange, isOpen = true, onClose }: SidebarProps) {
  const { logout } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const handleNavClick = (page: 'weapons' | 'history' | 'settings') => {
    onPageChange(page);
    if (onClose) onClose();
  };

  const navItems = [
    { id: 'weapons', label: 'Weapons', icon: Sword },
    { id: 'history', label: 'History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const sidebarContent = (
    <>
      
      {/* Brand Logo Section */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex border-3 border-gray-300 items-center justify-center overflow-hidden">
            <Image
              src={logo}
              alt="Logo"
              width={100}
              height={100}
              className="object-contain"
              />
          </div>
          <div>
            {/* <h1 className="text-xl font-bold text-gray-900">Arsenal</h1> */}
            <p className="text-xs text-gray-500 font-bold">Weapons</p>
            <p className="text-xs text-gray-500 font-bold">Management</p>
            <p className="text-xs text-gray-500 font-bold">System</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => handleNavClick(id as 'weapons' | 'history' | 'settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
              activePage === id
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="destructive"
          className="w-full flex items-center gap-2"
          onClick={() => setIsLogoutModalOpen(true)}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay and Drawer */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black opacity-80 z-30 md:hidden animate-in fade-in duration-300"
            onClick={onClose}
          />
          <aside className="fixed right-0 top-0 h-screen w-64 bg-white border-l border-gray-200 flex flex-col z-40 md:hidden shadow-lg animate-in slide-in-from-right duration-300">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="font-bold text-gray-900">Menu</h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            {sidebarContent}
          </aside>
        </>
      )}

      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}
