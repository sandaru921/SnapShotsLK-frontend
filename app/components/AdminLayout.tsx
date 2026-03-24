'use client';

import React from 'react';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 w-full max-w-[100vw] lg:max-w-[calc(100vw-256px)] min-h-screen overflow-x-hidden relative">
        {children}
      </main>
    </div>
  );
}
