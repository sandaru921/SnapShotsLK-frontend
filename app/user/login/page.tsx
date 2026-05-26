'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, Clock, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { setUserData } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pendingStatus, setPendingStatus] = useState<'pending_admin' | 'rejected_admin' | null>(null);
  const [statusMessage, setStatusMessage] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setPendingStatus(null);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5090/api/Auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      // Handle pending / rejected admin (403)
      if (response.status === 403) {
        setPendingStatus(data.status);
        setStatusMessage(data.message);
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || data || 'Login failed');
      }

      // The new login endpoint returns { token, user: { id, name, email, role, ... } }
      const { token, user } = data;

      // Save to context + localStorage
      setUserData(
        {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone ?? '',
          location: user.location ?? '',
        },
        token
      );

      // Role-based redirect
      const role = user.role?.toLowerCase();
      if (role === 'superadmin') {
        router.push('/superadmin/dashboard');
      } else if (role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        // 'Client' or 'user'
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  // ── Pending / Rejected status screen ──────────────────────────
  if (pendingStatus === 'pending_admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-xl border border-amber-100 p-10">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
                <Clock className="w-8 h-8 text-amber-600" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Approval Pending</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">{statusMessage}</p>
            <Link href="/" className="inline-block px-6 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-sm font-medium transition">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (pendingStatus === 'rejected_admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-xl border border-red-100 p-10">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Application Rejected</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">{statusMessage}</p>
            <div className="flex gap-3 justify-center">
              <Link href="/" className="inline-block px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                Back to Home
              </Link>
              <Link href="/admin/register" className="inline-block px-6 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-sm font-medium transition">
                Re-apply
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Normal login form ──────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
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
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
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
                  id="login-email"
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
                  id="login-password"
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
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-amber-700 hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center space-y-3">
            <p className="text-xs text-gray-500">
              Don&apos;t have an account?{' '}
              <Link href="/user/register" className="text-amber-700 hover:text-amber-800 font-medium">
                Register as User
              </Link>
            </p>
            <p className="text-xs text-gray-500">
              Are you a professional?{' '}
              <Link href="/admin/register" className="text-amber-700 hover:text-amber-800 font-medium">
                Apply as Admin
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}