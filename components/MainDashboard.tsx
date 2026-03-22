'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar } from './Sidebar';
import { HistoryPage } from './HistoryPage';
import { SettingsPage } from './SettingsPage';
import { WeaponsPage } from './WeaponsPage';
import { Menu } from 'lucide-react';

export function MainDashboard() {
  const [activePage, setActivePage] = useState<'weapons' | 'history' | 'settings'>('weapons');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const auth = useAuth();
  const { userData } = auth;
   const userEmail = userData?.email ?? 'admin@admin.com';

  const getInitials = (emailAddr?: string) => {
    if (!emailAddr) return 'AD';
    const name = emailAddr.split('@')[0];
    return name.substring(0, 2).toUpperCase();
  };

  const renderPage = () => {
    switch (activePage) {
      case 'weapons':
        return <WeaponsPage />;
      case 'history':
        return <HistoryPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <WeaponsPage />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        activePage={activePage} 
        onPageChange={setActivePage}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />
      <main className="flex-1 overflow-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 shadow-sm z-10">
          <div className="flex justify-between items-center px-4 md:px-8 py-4 gap-4">
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-900" />
            </button>
            <div className="flex items-center gap-3 ml-auto">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">{getInitials(userEmail)}</span>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{userEmail}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="p-8">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
