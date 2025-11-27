'use client';

import React from 'react';
import { Navbar } from '../components/navbar';

export default function VideographersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPath="/videographers" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-light tracking-wide uppercase text-gray-900 mb-8">Videographers</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Add videographer cards here */}
          <div className="bg-white p-6 border border-gray-200 hover:border-amber-700 transition-colors">
            <h3 className="text-xl font-medium mb-2">Videographer Name</h3>
            <p className="text-gray-600">Cinematic video production specialist</p>
          </div>
        </div>
      </main>
    </div>
  );
}