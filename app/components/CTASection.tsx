'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const CTASection: React.FC = () => (
  <section className="py-32 bg-linear-to-br from-amber-50 via-white to-amber-50">
    <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center space-y-12">
      
      <div className="space-y-6">
        <h2 className="text-5xl sm:text-6xl font-extralight text-gray-900">
          Ready to Begin?
        </h2>
        <p className="text-xl text-gray-500 font-light max-w-2xl mx-auto">
          Join thousands who trust SnapShotsLK for their photography needs
        </p>
      </div>

      <Link 
        href="/user/photographers"
        className="inline-flex items-center justify-center px-12 py-6 bg-amber-700 hover:bg-amber-800 text-white font-medium rounded-full shadow-2xl hover:shadow-amber-500/50 transition-all duration-300 transform hover:scale-105"
      >
        Start Your Journey
        <ArrowRight className="w-5 h-5 ml-2" />
      </Link>
    </div>
  </section>
);