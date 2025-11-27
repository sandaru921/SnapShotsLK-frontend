'use client';

import React from 'react';
import { Navbar } from '../components/navbar';

export default function StudiosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPath="/studios" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-light tracking-wide uppercase text-gray-900 mb-8">Studios</h1>
        <p className="text-gray-600 mb-8">Browse professional photography studios</p>
      </main>
    </div>
  );
}