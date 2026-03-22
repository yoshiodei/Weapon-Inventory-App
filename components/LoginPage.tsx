'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { validateLogin } from '@/lib/Validator/loginValidator';
import { loginUser } from '@/lib/auth/login';
import { showToast } from '@/contexts/ShowToast';
import Image from 'next/image';
import logo from '../public/assets/Ghana-Customs.jpg';

export function LoginPage() {
   const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

     
    const validation = validateLogin(email, password);

    if (!validation.valid) {
      setError(validation.message || 'Invalid input');
      showToast(error, 'error');
      setIsLoading(false);
      return;
    }

    const loginResult = await loginUser(email, password);

    if (!loginResult.success || !loginResult.user) {
      setError(loginResult.message || 'Invalid email or password');
      showToast(error, 'error');
      setIsLoading(false);
      return;
    }

    console.log('user data', loginResult.user);

    await login(loginResult.success, loginResult.user);
    showToast('Login successful!', 'success');
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md shadow-2xl border-blue-200">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-center">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex border-3 border-gray-300 items-center justify-center overflow-hidden">
            <Image
              src={logo}
              alt="Logo"
              width={100}
              height={100}
              className="object-contain"
              />
          </div>
          </div>  
          <CardTitle className="text-2xl text-center text-gray-900">Weapons Management</CardTitle>
          <CardDescription className="text-center text-gray-600">Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-900">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="admin@admin.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-900">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
              />
            </div>
            {error && <div className="text-sm text-red-600 text-center font-medium">{error}</div>}
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          {/* <div className="mt-4 text-xs text-center text-gray-600">
            <p className="font-medium mb-1">Demo credentials:</p>
            <p className="font-mono text-gray-700">admin@admin.com</p>
            <p className="font-mono text-gray-700">1234567890</p>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
