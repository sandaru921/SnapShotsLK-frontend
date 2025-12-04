'use client';

import React from 'react';

interface StatCardProps {
  number: string;
  label: string;
  delay: string;
}

export const StatCard: React.FC<StatCardProps> = ({ number, label, delay }) => (
  <div 
    className={`p-10 bg-white/60 backdrop-blur-xl border border-gray-100 rounded-3xl hover:shadow-xl hover:-translate-y-2 transition-all duration-500 animate-fade-in-up ${delay}`}
  >
    <div className="text-5xl font-extralight text-amber-700 mb-2">{number}</div>
    <div className="text-sm font-light text-gray-600">{label}</div>
  </div>
);