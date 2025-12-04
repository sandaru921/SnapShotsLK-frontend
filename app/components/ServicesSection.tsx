'use client';

import React from 'react';
import { ServiceCard } from './ServiceCard';

export const ServicesSection: React.FC = () => {
  const services = [
    {
      title: 'Photographers',
      description: 'Professional photographers for weddings, portraits, and events. Certified experts capturing your perfect moments with artistic excellence and creative vision.',
      href: '/photographers',
      images: [
        'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop&q=80', // Elegant wedding photography
        'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=600&fit=crop&q=80', // Professional portrait setup
        'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&h=600&fit=crop&q=80', // Luxury camera equipment
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=600&fit=crop&q=80'  // Event photography
      ]
    },
    {
      title: 'Videographers',
      description: 'Cinematic videography for weddings and corporate events. Stunning 4K quality with professional editing, color grading, and compelling storytelling.',
      href: '/videographers',
      images: [
        'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=600&fit=crop&q=80', // Professional video production
        'https://images.unsplash.com/photo-1579165466741-7f35e4755660?w=800&h=600&fit=crop&q=80', // Cinematic filming
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&q=80', // Video editing suite
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop&q=80'  // Cinema camera
      ]
    },
    {
      title: 'Photo Albums',
      description: 'Custom-designed albums with premium materials. Your memories printed in exceptional quality with elegant layouts and archival-grade paper.',
      href: '/albums',
      images: [
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=600&fit=crop&q=80', // Luxury photo album
        'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=800&h=600&fit=crop&q=80', // Wedding album pages
        'https://images.unsplash.com/photo-1509201893637-2e19f2ffd88a?w=800&h=600&fit=crop&q=80', // Premium leather album
        'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&h=600&fit=crop&q=80'  // Photo book collection
      ]
    },
    {
      title: 'Enlargements',
      description: 'Professional enlargement and framing services. Transform your photos into museum-quality wall art with archival printing and custom framing.',
      href: '/enlargements',
      images: [
        'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&h=600&fit=crop&q=80', // Gallery wall art
        'https://images.unsplash.com/photo-1560343776-97e7d202ff0e?w=800&h=600&fit=crop&q=80', // Luxury frame display
        'https://images.unsplash.com/photo-1582561833986-c83a8e813189?w=800&h=600&fit=crop&q=80', // Custom framing
        'https://images.unsplash.com/photo-1533073526757-2c8ca1df9f1c?w=800&h=600&fit=crop&q=80'  // Art gallery
      ]
    }
  ];

  return (
    <section className="py-32 bg-linear-to-b from-white via-amber-50/20 to-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="text-center mb-24 space-y-4">
          <h2 className="text-5xl sm:text-6xl font-extralight text-gray-900">
            Our Services
          </h2>
          <p className="text-xl text-gray-500 font-light max-w-2xl mx-auto">
            Comprehensive luxury photography solutions tailored to your vision
          </p>
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <div key={service.title} className={`animate-fade-in-up delay-${200 + index * 100}`}>
              <ServiceCard {...service} />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Spacer */}
      <div className="h-20"></div>
    </section>
  );
};