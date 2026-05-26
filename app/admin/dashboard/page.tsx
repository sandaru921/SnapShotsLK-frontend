'use client';

import React from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/app/components/ProtectedRoute';
import AdminLayout from '@/app/components/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import {
  ShoppingBag, Image as ImageIcon, CalendarDays, User,
  MessageSquare, Star, TrendingUp, Camera
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user } = useAuth();

  const stats = [
    { label: 'Total Orders', value: '—', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Portfolio Items', value: '—', icon: ImageIcon, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Upcoming Bookings', value: '—', icon: CalendarDays, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Avg. Rating', value: '—', icon: Star, color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  const quickActions = [
    { label: 'Edit My Profile', href: '/admin/profile', icon: User, desc: 'Update bio, packages & portfolio' },
    { label: 'View Orders', href: '/admin/orders', icon: ShoppingBag, desc: 'Manage your client orders' },
    { label: 'Open Calendar', href: '/admin/calendar', icon: CalendarDays, desc: 'Set your availability' },
    { label: 'Collaborate', href: '/admin/collaborate', icon: MessageSquare, desc: 'Team up with other professionals' },
  ];

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminLayout>
        <div className="min-h-screen bg-transparent pt-12 pb-12 px-4 sm:px-6 lg:px-8 w-full">

          {/* Header */}
          <div className="max-w-7xl mx-auto mb-8 md:mb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold tracking-wider uppercase">
                  <Camera className="w-3.5 h-3.5" />
                  Professional Panel
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extralight text-gray-900 tracking-tight">
                  My Dashboard
                </h1>
                <p className="text-sm sm:text-base text-gray-500 font-light">
                  Welcome back, <span className="font-medium text-amber-700">{user?.name || 'Admin'}</span>. Manage your professional presence below.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/admin/profile"
                  className="inline-flex items-center px-4 py-2 bg-amber-700 text-white rounded-lg shadow-sm text-sm font-medium hover:bg-amber-800 transition-colors"
                >
                  <User className="w-4 h-4 mr-2" />
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 md:mb-12">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                      <p className="text-2xl sm:text-3xl font-semibold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-xl ${stat.bg}`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-5 h-5 text-amber-700" />
                <h2 className="text-xl font-medium text-gray-900">Recent Activity</h2>
              </div>
              <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400">
                <ShoppingBag className="w-10 h-10 mb-3 text-gray-200" />
                <p className="text-sm font-medium text-gray-500">No recent activity yet</p>
                <p className="text-xs text-gray-400 mt-1">Orders and bookings will appear here once clients engage with your profile.</p>
                <Link
                  href="/admin/profile"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm text-amber-700 hover:text-amber-800 font-medium"
                >
                  Set up your profile →
                </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-amber-700 text-white rounded-3xl shadow-lg p-6 sm:p-8 flex flex-col">
              <div className="space-y-2 mb-6">
                <h2 className="text-xl font-medium">Quick Actions</h2>
                <p className="text-amber-100/80 text-sm font-light leading-relaxed">
                  Jump to the most important parts of your professional account.
                </p>
              </div>

              <div className="space-y-3 flex-1">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={action.href}
                      href={action.href}
                      className="flex items-center gap-3 w-full bg-white/10 hover:bg-white/20 backdrop-blur px-4 py-3 rounded-xl text-sm font-medium transition-colors group"
                    >
                      <Icon className="w-4 h-4 shrink-0 text-amber-200 group-hover:text-white transition-colors" />
                      <div className="text-left">
                        <p className="font-medium">{action.label}</p>
                        <p className="text-xs text-amber-200/70">{action.desc}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
