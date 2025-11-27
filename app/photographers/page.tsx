'use client';

import React from 'react';
import { Navbar } from '../components/navbar';

export default function PhotographersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPath="/photographers" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-light tracking-wide uppercase text-gray-900 mb-8">Photographers</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Add photographer cards here */}
          <div className="bg-white p-6 border border-gray-200 hover:border-amber-700 transition-colors">
            <h3 className="text-xl font-medium mb-2">Photographer Name</h3>
            <p className="text-gray-600">Professional photographer with 10+ years experience</p>
          </div>
        </div>
      </main>
    </div>
  );
}