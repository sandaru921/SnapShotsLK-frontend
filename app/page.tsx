'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Camera, Video, BookOpenText, Frame, ArrowRight, SlidersHorizontal, LucideIcon } from 'lucide-react';
import { Navbar } from './components/navbar';
import Link from 'next/link';

// === TypeScript Interfaces and Types ===

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  href: string;
}

// === UI Components ===

// Logo Component
const Logo: React.FC = () => (
  <div className="flex items-center text-2xl font-light tracking-widest text-gray-900">
    SNAPSHOTS<span className="font-semibold text-amber-700">LK</span>
  </div>
);

// Service Card Component - Luxury Style
const ServiceCard: React.FC<ServiceCardProps> = ({ icon: Icon, title, description, color, href }) => (
  <Link
    href={href}
    className="group relative h-80 p-8 overflow-hidden shadow-lg transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl border border-gray-300 bg-white"
  >
    {/* Subtle Background Effect */}
    <div 
      className="absolute -inset-1 opacity-0 transition-opacity duration-500 group-hover:opacity-10"
      style={{ background: color }}
    />

    {/* Content */}
    <div className="relative flex flex-col items-start h-full text-left">
      <div 
        className="p-5 mb-6 transition-all duration-500 group-hover:scale-105"
        style={{ backgroundColor: `${color}20`, border: `1px solid ${color}40` }}
      >
        <Icon className="w-8 h-8" style={{ color: color }} />
      </div>

      <h3 className="text-2xl font-light tracking-wide uppercase text-gray-900 mb-3 transition-colors duration-300">
        {title}
      </h3>
      <p className="text-gray-600 text-sm mb-6 grow leading-relaxed">
        {description}
      </p>

      {/* Elegant CTA */}
      <div className="flex items-center text-amber-700 font-medium uppercase text-sm tracking-wide group-hover:text-amber-800 transition-all duration-300">
        Explore
        <ArrowRight className="w-4 h-4 ml-2 transform translate-x-0 group-hover:translate-x-2 transition-transform duration-300" />
      </div>
    </div>
  </Link>
);

// Image Carousel Component
const ImageCarousel: React.FC = () => {
  const images: string[] = useMemo(() => [
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1200&h=600&fit=crop'
  ], []);
  const [current, setCurrent] = useState<number>(0);

  const prevSlide = (): void => {
    setCurrent(current === 0 ? images.length - 1 : current - 1);
  };

  const nextSlide = (): void => {
    setCurrent(current === images.length - 1 ? 0 : current + 1);
  };

  useEffect(() => {
    const autoSlide = (): void => {
      setCurrent((prevCurrent) => (prevCurrent === images.length - 1 ? 0 : prevCurrent + 1));
    };
    
    const timer = setInterval(autoSlide, 5000); 
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="relative w-full h-[65vh] overflow-hidden shadow-2xl">
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={`Gallery image ${index + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100' : 'opacity-0'
          }`}
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1200&h=600&fit=crop';
          }}
        />
      ))}

      {/* Elegant Overlay */}
      <div className="absolute inset-0 The class `bg-gradient-to-b` can be written as `bg-linear-to-b` from-black/30 via-transparent to-black/50"></div>

      {/* Navigation Arrows */}
      <button
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); prevSlide(); }}
        className="absolute top-1/2 left-6 transform -translate-y-1/2 p-3 bg-white/10 hover:bg-white/30 backdrop-blur-sm text-white transition-all z-20 focus:outline-none border border-white/30"
        aria-label="Previous image"
      >
        &#10094;
      </button>
      <button
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); nextSlide(); }}
        className="absolute top-1/2 right-6 transform -translate-y-1/2 p-3 bg-white/10 hover:bg-white/30 backdrop-blur-sm text-white transition-all z-20 focus:outline-none border border-white/30"
        aria-label="Next image"
      >
        &#10095;
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); setCurrent(index); }}
            className={`h-1 transition-all duration-300 ${
              index === current ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80 w-1'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

// === Layouts ===

// Hero Section - Luxury Style
const HeroSection: React.FC = () => (
  <div className="relative pb-20 text-center overflow-hidden">
    
    {/* Slideshow Integration */}
    <div className="w-full">
      <ImageCarousel />
    </div>

    {/* Text Overlay Card - Luxury Design */}
    <div className="relative -mt-32 z-10 p-12 max-w-5xl mx-auto bg-white/98 backdrop-blur-sm shadow-2xl border border-gray-200 animate-fade-in-up delay-600">
      <p className="text-sm font-medium tracking-widest uppercase text-amber-700 mb-3 animate-fade-in-up delay-700">
        Capturing Moments, Creating Memories
      </p>
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-wide text-gray-900 mb-4 leading-tight animate-fade-in-up delay-800">
        EXCEPTIONAL
        <span className="block font-semibold text-amber-700 mt-2">
          PHOTOGRAPHY SERVICES
        </span>
      </h1>
      <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
        Connect with Sri Lanka's finest photographers, videographers, and creative studios. 
        From weddings to corporate events, we bring your vision to life with elegance and precision.
      </p>
      
      <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
        {/* Primary CTA */}
        <Link 
          href="/photographers"
          className="group relative inline-flex items-center justify-center px-10 py-4 text-base font-medium uppercase tracking-wider bg-amber-700 hover:bg-amber-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          Book a Session
          <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
        
        {/* Secondary CTA */}
        <Link 
          href="/studios"
          className="group relative inline-flex items-center justify-center px-10 py-4 text-base font-medium uppercase tracking-wider text-gray-700 bg-white border-2 border-gray-300 hover:border-amber-700 hover:text-amber-700 transition-all duration-300 transform hover:scale-105"
        >
          Explore Studios
          <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </div>
    </div>
  </div>
);

// Services Section - Luxury Style
const ServicesSection: React.FC = () => {
  const services = [
    {
      icon: Camera,
      title: 'Photographers',
      description: 'Professional photographers for weddings, portraits, events, and commercial projects. Certified experts with years of experience.',
      color: '#92400e',
      href: '/photographers'
    },
    {
      icon: Video,
      title: 'Videographers',
      description: 'Cinematic videography services for weddings, corporate events, documentaries, and creative projects with 4K quality.',
      color: '#78350f',
      href: '/videographers'
    },
    {
      icon: BookOpenText,
      title: 'Albums',
      description: 'Custom-designed photo albums with premium materials. Print your memories in stunning quality with elegant layouts.',
      color: '#451a03',
      href: '/albums'
    },
    {
      icon: Frame,
      title: 'Enlargements',
      description: 'Professional photo enlargement and framing services. Transform your favorite moments into museum-quality wall art.',
      color: '#1c0a00',
      href: '/enlargements'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="text-center mb-20">
        <h2 className="text-4xl font-light tracking-wide uppercase text-gray-900 mb-4">
          Our <span className="font-semibold text-amber-700">Services</span>
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Comprehensive photography and videography solutions tailored to your needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {services.map((service, index) => (
          <div key={service.title} className={`animate-fade-in-up delay-${200 + index * 100}`}>
            <ServiceCard
              icon={service.icon}
              title={service.title}
              description={service.description}
              color={service.color}
              href={service.href}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// Stats Section - New Addition
const StatsSection: React.FC = () => (
  <div className="bg-amber-50 py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div>
          <div className="text-4xl font-light text-amber-700 mb-2">500+</div>
          <div className="text-sm uppercase tracking-wide text-gray-600">Professionals</div>
        </div>
        <div>
          <div className="text-4xl font-light text-amber-700 mb-2">10,000+</div>
          <div className="text-sm uppercase tracking-wide text-gray-600">Projects Done</div>
        </div>
        <div>
          <div className="text-4xl font-light text-amber-700 mb-2">50+</div>
          <div className="text-sm uppercase tracking-wide text-gray-600">Studios</div>
        </div>
        <div>
          <div className="text-4xl font-light text-amber-700 mb-2">4.9/5</div>
          <div className="text-sm uppercase tracking-wide text-gray-600">Average Rating</div>
        </div>
      </div>
    </div>
  </div>
);

// Footer Component - Luxury Style
const Footer: React.FC = () => (
  <footer className="bg-gray-900 text-gray-300 mt-32">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Brand */}
        <div className="md:col-span-2">
          <div className="text-2xl font-light tracking-widest text-white mb-4">
            SNAPSHOTS<span className="font-semibold text-amber-500">LK</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            Sri Lanka's premier platform for professional photography and videography services. 
            Connecting clients with certified professionals since 2020.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-medium uppercase tracking-wide text-sm mb-4">Services</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/photographers" className="hover:text-amber-500 transition-colors">Photographers</Link></li>
            <li><Link href="/videographers" className="hover:text-amber-500 transition-colors">Videographers</Link></li>
            <li><Link href="/albums" className="hover:text-amber-500 transition-colors">Albums</Link></li>
            <li><Link href="/enlargements" className="hover:text-amber-500 transition-colors">Enlargements</Link></li>
            <li><Link href="/studios" className="hover:text-amber-500 transition-colors">Studios</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-white font-medium uppercase tracking-wide text-sm mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-amber-500 transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-amber-500 transition-colors">Contact</a></li>
            <li><a href="#" className="hover:text-amber-500 transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-amber-500 transition-colors">Blog</a></li>
          </ul>
        </div>
      </div>

      <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm">
        <p className="text-gray-500 mb-4 md:mb-0">
          &copy; {new Date().getFullYear()} SnapShotsLK. All rights reserved.
        </p>
        <div className="flex space-x-6">
          <a href="#" className="text-gray-500 hover:text-amber-500 transition-colors">Privacy Policy</a>
          <a href="#" className="text-gray-500 hover:text-amber-500 transition-colors">Terms of Service</a>
          <a href="#" className="text-gray-500 hover:text-amber-500 transition-colors">Cookie Policy</a>
        </div>
      </div>
    </div>
  </footer>
);

// === Main Application Component ===

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { 
          animation: fadeInUp 0.8s ease-out forwards; 
          opacity: 0; 
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
        .delay-700 { animation-delay: 0.7s; }
        .delay-800 { animation-delay: 0.8s; }
      `}</style>
      
      <Navbar currentPath="/" />
      
      <main>
        <HeroSection />
        <ServicesSection />
        <StatsSection />
      </main>

      <Footer />
    </div>
  );
}