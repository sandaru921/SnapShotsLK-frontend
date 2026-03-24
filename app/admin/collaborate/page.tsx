'use client';

import React from 'react';
import { ProtectedRoute } from '@/app/components/ProtectedRoute';
import AdminLayout from '@/app/components/AdminLayout';
import { MessageSquare, Users } from 'lucide-react';

export default function CollaboratePage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminLayout>
        <div className="p-8 flex h-[calc(100vh-64px)] overflow-hidden flex-col">
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Collaborate & Messages</h1>
                    <p className="text-gray-500 mt-1">Chat directly with clients about their concepts.</p>
                </div>
            </div>

            <div className="flex-1 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex">
                <div className="w-80 border-r border-gray-100 flex flex-col hidden md:flex">
                    <div className="p-4 border-b border-gray-100"><h3 className="font-semibold text-gray-900">Active Chats</h3></div>
                    <div className="flex-1 p-8 text-center bg-gray-50 flex items-center justify-center flex-col">
                        <Users className="w-12 h-12 text-gray-300 mb-3" />
                        <p className="text-gray-400 text-sm">No conversations</p>
                    </div>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-gray-50/50">
                    <MessageSquare className="w-16 h-16 text-amber-200 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Select a Conversation</h2>
                    <p className="text-gray-500 max-w-sm">When clients message you regarding inquiries, their real-time messages will appear here.</p>
                </div>
            </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
