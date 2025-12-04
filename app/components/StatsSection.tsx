'use client';

import React from 'react';
import { StatCard } from './StatCard';

export const StatsSection: React.FC = () => {
  const stats = [
    { number: '500+', label: 'Professionals', delay: 'delay-200' },
    { number: '10,000+', label: 'Projects Completed', delay: 'delay-300' },
    { number: '50+', label: 'Partner Studios', delay: 'delay-400' },
    { number: '4.9/5', label: 'Client Rating', delay: 'delay-500' }
  ];

  return (
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="text-center mb-24 space-y-4">
          <h2 className="text-5xl sm:text-6xl font-extralight text-gray-900">
            Trusted Excellence
          </h2>
          <p className="text-xl text-gray-500 font-light">
            Numbers that speak for themselves
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </div>

      {/* Bottom Spacer */}
      <div className="h-20"></div>
    </section>
  );
};