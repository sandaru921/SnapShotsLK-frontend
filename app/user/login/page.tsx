'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
// 1. AuthContext එක import කරගන්න
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  // 2. setUserData function එක Context එකෙන් එළියට ගන්න
  const { setUserData } = useAuth(); 
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Backend එකට request යවනවා
      const response = await fetch('http://localhost:5090/api/Auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      let token = await response.text();
      // Clean up ASP.NET Core JSON string serialization quotes
      token = token.replace(/^"|"$/g, '');

      if (!response.ok) {
        throw new Error(token || 'Login failed');
      }

      // --- මෙතන තමයි වෙනස! ---
      
      // Add JWT token decoding to extract the actual role
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const decodedToken = JSON.parse(jsonPayload);
      const userRole = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 'user';
      const userName = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || 'User';

      const tempUser = {
        id: '1', 
        name: userName, 
        email: formData.email, 
        role: userRole, 
        phone: '',
        location: ''
      };

      // 3. කෙලින්ම LocalStorage දාන්නේ නැතුව, Context එක හරහා දානවා.
      // එතකොට මුළු App එකම දැනගන්නවා "ආ.. මෙයා ලොග් වුනා" කියලා.
      setUserData(tempUser, token);

      alert("Login Successful!");
      
      // Redirect based on role
      switch (userRole) {
        case 'admin':
          router.push('/admin/dashboard');
          break;
        case 'superadmin':
          router.push('/superadmin/dashboard');
          break;
        case 'user':
        default:
          router.push('/'); 
          break;
      }

    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      {/* ... Form Design (මේ ටිකේ කිසිම වෙනසක් නෑ, පරණ එකමයි) ... */}
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block group">
            <h1 className="text-4xl font-light tracking-wider text-gray-900 group-hover:opacity-80 transition-opacity">
              SNAPSHOTS<span className="font-semibold text-amber-700">LK</span>
            </h1>
          </Link>
          <p className="text-gray-600 mt-3">Welcome back! Please sign in.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded animate-pulse">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-amber-600 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-amber-600 transition-colors" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-amber-700 hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          
          <div className="text-center mt-8 space-x-6 text-xs text-gray-500">
             <Link href="/user/register" className="hover:text-amber-700 underline">Don't have an account?</Link>
          </div>
        </div>
      </div>
    </div>
  );
}