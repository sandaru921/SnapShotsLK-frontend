'use client';

import React from 'react';
import { Navbar } from '../components/navbar';

export default function EnlargementsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPath="/enlargements" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-light tracking-wide uppercase text-gray-900 mb-8">Enlargements</h1>
        <p className="text-gray-600 mb-8">Professional photo enlargement and framing services</p>
      </main>
    </div>
  );
}