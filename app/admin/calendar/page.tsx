'use client';

import React from 'react';
import { ProtectedRoute } from '@/app/components/ProtectedRoute';
import AdminLayout from '@/app/components/AdminLayout';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CalendarPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminLayout>
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Schedule & Calendar</h1>
                    <p className="text-gray-500 mt-1">Manage your availability for clients.</p>
                </div>
                <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                    <button className="text-gray-500 hover:text-gray-900"><ChevronLeft className="w-5 h-5"/></button>
                    <span className="font-semibold text-gray-900 min-w-[120px] text-center">October 2026</span>
                    <button className="text-gray-500 hover:text-gray-900"><ChevronRight className="w-5 h-5"/></button>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-12 text-center">
                <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Calendar Integration Pending</h2>
                <p className="text-gray-500">Sync with Google Calendar or Apple Calendar to prevent double booking clients automatically!</p>
            </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
