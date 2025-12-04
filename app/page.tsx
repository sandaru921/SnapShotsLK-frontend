'use client';

import React from 'react';
import { Navbar } from './components/navbar';
import { HeroSection } from './components/HeroSection';
import { ServicesSection } from './components/ServicesSection';
import { StatsSection } from './components/StatsSection';
import { CTASection } from './components/CTASection';
import { Footer } from './components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }

        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
        .delay-800 { animation-delay: 0.8s; }
        .delay-1000 { animation-delay: 1s; }

        /* Reduce component spacing */
        section {
          padding-top: 5rem !important;
          padding-bottom: 5rem !important;
        }

        @media (min-width: 1024px) {
          section {
            padding-top: 6rem !important;
            padding-bottom: 6rem !important;
          }
        }
      `}</style>

      <Navbar currentPath="/" />
      
      <main className="space-y-0">
        <HeroSection />
        <ServicesSection />
        <StatsSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}