'use client';

import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => (
  <footer className="bg-white border-t border-gray-100">
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
        
        {/* Brand */}
        <div className="md:col-span-2 space-y-6">
          <div className="text-2xl font-extralight text-gray-900">
            SNAPSHOTS<span className="font-medium text-amber-700">LK</span>
          </div>
          <p className="text-gray-500 font-light leading-relaxed max-w-md">
            Premier platform for professional photography and videography services across Sri Lanka.
          </p>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-6">Services</h3>
          <ul className="space-y-3 text-sm font-light">
            <li><Link href="/photographers" className="text-gray-600 hover:text-amber-700 transition-colors">Photographers</Link></li>
            <li><Link href="/videographers" className="text-gray-600 hover:text-amber-700 transition-colors">Videographers</Link></li>
            <li><Link href="/albums" className="text-gray-600 hover:text-amber-700 transition-colors">Albums</Link></li>
            <li><Link href="/enlargements" className="text-gray-600 hover:text-amber-700 transition-colors">Enlargements</Link></li>
            <li><Link href="/studios" className="text-gray-600 hover:text-amber-700 transition-colors">Studios</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-6">Company</h3>
          <ul className="space-y-3 text-sm font-light">
            <li><a href="#" className="text-gray-600 hover:text-amber-700 transition-colors">About</a></li>
            <li><a href="#" className="text-gray-600 hover:text-amber-700 transition-colors">Contact</a></li>
            <li><a href="#" className="text-gray-600 hover:text-amber-700 transition-colors">Careers</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-gray-500 font-light">
          &copy; {new Date().getFullYear()} SnapShotsLK. All rights reserved.
        </p>
        <div className="flex gap-8 text-sm font-light">
          <a href="#" className="text-gray-500 hover:text-amber-700 transition-colors">Privacy</a>
          <a href="#" className="text-gray-500 hover:text-amber-700 transition-colors">Terms</a>
          <a href="#" className="text-gray-500 hover:text-amber-700 transition-colors">Cookies</a>
        </div>
      </div>
    </div>
  </footer>
);