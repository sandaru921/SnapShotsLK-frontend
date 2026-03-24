'use client';

import React from 'react';
import { ProtectedRoute } from '@/app/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldAlert, Server, Activity, Users, Lock, ChevronRight } from 'lucide-react';

export default function SuperadminDashboardPage() {
  const { user } = useAuth();

  const coreMetrics = [
    { label: 'System Health', value: '99.9%', subtitle: 'All services operational', icon: Activity, color: 'text-emerald-500', border: 'border-emerald-100' },
    { label: 'Total Admins', value: '14', subtitle: '4 online now', icon: ShieldAlert, color: 'text-indigo-500', border: 'border-indigo-100' },
    { label: 'Server Load', value: '42%', subtitle: 'Database at 28%', icon: Server, color: 'text-rose-500', border: 'border-rose-100' },
    { label: 'Security Alerts', value: '0', subtitle: 'Last 24 hours', icon: Lock, color: 'text-slate-500', border: 'border-slate-100' },
  ];

  return (
    <ProtectedRoute allowedRoles={['superadmin']}>
      <div className="min-h-screen bg-slate-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="max-w-7xl mx-auto mb-8 md:mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold tracking-wider uppercase mb-2">
                System God Mode
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extralight text-slate-900 tracking-tight">
                Superadmin Overview
              </h1>
              <p className="text-sm sm:text-base text-slate-500 font-light max-w-xl">
                System control panel accessed by <span className="font-medium text-indigo-600">{user?.name || 'Superadmin'}</span>. Oversee all platform operations.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex-1 md:flex-none justify-center inline-flex items-center px-6 py-2.5 bg-slate-900 text-white rounded-lg shadow-sm text-sm font-medium hover:bg-slate-800 transition-colors">
                System Logs
              </button>
            </div>
          </div>
        </div>

        {/* Metrics Grid - Mobile First */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 md:mb-12">
          {coreMetrics.map((metric, i) => {
            const Icon = metric.icon;
            return (
              <div key={i} className={`bg-white p-6 rounded-2xl border-l-4 shadow-sm hover:shadow-md transition-shadow ${metric.border}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2.5 rounded-lg bg-slate-50`}>
                    <Icon className={`w-5 h-5 ${metric.color}`} />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-semibold text-slate-900 mb-1">{metric.value}</p>
                  <p className="text-sm font-medium text-slate-700">{metric.label}</p>
                  <p className="text-xs text-slate-500 mt-1">{metric.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Management Area */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Admin Management */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium text-slate-900">Admin Management</h2>
              <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View All</button>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Sarah Connor', role: 'Support Admin', status: 'Online' },
                { name: 'John Doe', role: 'Content Moderator', status: 'Offline' },
                { name: 'Jane Smith', role: 'Financial Admin', status: 'Online' },
              ].map((admin, idx) => (
                <div key={idx} className="group flex items-center justify-between py-3 px-4 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium">
                        {admin.name.charAt(0)}
                      </div>
                      {admin.status === 'Online' && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{admin.name}</p>
                      <p className="text-xs text-slate-500">{admin.role}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-2.5 rounded-lg border border-dashed border-slate-300 text-slate-600 font-medium text-sm hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2">
              <Users className="w-4 h-4" />
              Invite New Admin
            </button>
          </div>

          {/* System Configuration */}
          <div className="bg-slate-900 text-white rounded-3xl shadow-lg p-6 sm:p-8">
            <h2 className="text-xl font-medium mb-2">Global Configurations</h2>
            <p className="text-slate-400 text-sm font-light leading-relaxed mb-8">
              Modify global system behaviors, platform-wide alerts, and critical infrastructure settings here. Proceed with caution.
            </p>
            
            <div className="space-y-4">
              {[
                { title: 'Platform Maintenance Mode', desc: 'Temporarily lock all non-admin access', active: false },
                { title: 'Enforce Global 2FA', desc: 'Require two-factor for all admin accounts', active: true },
                { title: 'Verbose Error Logging', desc: 'Log stack traces to monitoring service', active: true },
              ].map((config, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                  <div>
                    <p className="text-sm font-medium text-slate-200">{config.title}</p>
                    <p className="text-xs text-slate-400 mt-1">{config.desc}</p>
                  </div>
                  <button className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${config.active ? 'bg-indigo-500' : 'bg-slate-600'}`}>
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${config.active ? 'translate-x-5' : 'translate-x-0'}`}></span>
                  </button>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </ProtectedRoute>
  );
}
