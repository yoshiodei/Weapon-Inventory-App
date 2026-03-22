'use client';

import { User } from 'firebase/auth';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  userData: User | null;
  login: (success: boolean, user: User) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    const storedEmail = localStorage.getItem('userEmail');
    if (storedAuth === 'true' && userData?.email === storedEmail && storedEmail !== '' ) {
      setIsAuthenticated(true);
      setEmail(storedEmail || 'admin@admin.com');
    }
    setIsLoading(false);
  }, []);

  const login = async (success: boolean, user: User): Promise<boolean> => {
    if (success) {
      setIsAuthenticated(true);
      setUserData(user);
      console.log('stored email', user?.email);
      
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', user?.email || '');
      return true;
    }

    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setEmail('');
    setUserData(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, userData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
