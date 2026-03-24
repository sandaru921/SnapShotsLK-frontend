'use client';

import React from 'react';

interface StatCardProps {
  number: string;
  label: string;
  delay: string;
}

export const StatCard: React.FC<StatCardProps> = ({ number, label, delay }) => (
  <div 
    className={`p-6 sm:p-8 md:p-10 bg-white/60 backdrop-blur-xl border border-gray-100 rounded-3xl hover:shadow-2xl hover:-translate-y-2 hover:scale-105 hover:border-amber-100 transition-all duration-500 animate-fade-in-up ${delay}`}
  >
    <div className="text-3xl sm:text-4xl md:text-5xl font-extralight text-amber-700 mb-2">{number}</div>
    <div className="text-xs sm:text-sm font-light text-gray-600">{label}</div>
  </div>
);