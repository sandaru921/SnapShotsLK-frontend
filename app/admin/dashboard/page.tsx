'use client';

import React from 'react';
import { ProtectedRoute } from '@/app/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, Users, Image as ImageIcon, Settings, Bell } from 'lucide-react';

export default function AdminDashboardPage() {
  const { user } = useAuth();

  const stats = [
    { label: 'Total Users', value: '1,245', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Total Content', value: '458', icon: ImageIcon, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Active Sessions', value: '23', icon: LayoutDashboard, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Pending Approvals', value: '12', icon: Bell, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="max-w-7xl mx-auto mb-8 md:mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extralight text-gray-900 tracking-tight">
                Admin Dashboard
              </h1>
              <p className="text-sm sm:text-base text-gray-500 font-light">
                Welcome back, <span className="font-medium text-amber-700">{user?.name || 'Admin'}</span>. Here's what's happening today.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex-1 md:flex-none justify-center inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid - Mobile First */}
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

        {/* Content Area - Example Tables/Cards */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Main Content Pane */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <h2 className="text-xl font-medium text-gray-900 mb-6">Recent Activity</h2>
            <div className="space-y-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex flex-col sm:flex-row sm:items-center gap-4 py-4 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                    <span className="text-amber-700 font-medium text-sm">US</span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-gray-900">New registration detected</p>
                    <p className="text-xs text-gray-500">User account created from IP 192.168.1.1</p>
                  </div>
                  <div className="text-xs text-gray-400 sm:text-right">
                    2 hours ago
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions / Side Pane */}
          <div className="bg-amber-700 text-white rounded-3xl shadow-lg p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <h2 className="text-xl font-medium">Quick Actions</h2>
              <p className="text-amber-100/80 text-sm font-light leading-relaxed">
                Need to manage content or review user requests? Jump straight into the action panels below.
              </p>
            </div>
            
            <div className="mt-8 space-y-3">
              <button className="w-full bg-white/10 hover:bg-white/20 backdrop-blur text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors">
                Approve Requests
              </button>
              <button className="w-full bg-white/10 hover:bg-white/20 backdrop-blur text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors">
                Manage Media Guidelines
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </ProtectedRoute>
  );
}
