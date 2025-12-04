'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const ImageCarousel: React.FC = () => {
  const images = [
    { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=600&fit=crop', alt: 'Professional wedding photography' },
    { url: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1200&h=600&fit=crop', alt: 'Portrait photography session' },
    { url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&h=600&fit=crop', alt: 'Event photography' },
    { url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&h=600&fit=crop', alt: 'Studio photography setup' },
    { url: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1200&h=600&fit=crop', alt: 'Professional photographer at work' }
  ];

  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrent(index);
    setIsAutoPlaying(false);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setTimeout(() => {
      nextSlide();
    }, 5000);
    return () => clearTimeout(timer);
  }, [current, isAutoPlaying, nextSlide]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-3xl">
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <img
            src={img.url}
            alt={img.alt}
            className={`w-full h-full object-cover transition-transform duration-1000 ${
              index === current ? 'scale-100' : 'scale-110'
            }`}
            loading={index === 0 ? 'eager' : 'lazy'}
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-linear-to-br from-black/20 via-transparent to-black/30 z-20"></div>

      <button
        onClick={prevSlide}
        aria-label="Previous image"
        className="absolute top-1/2 left-6 -translate-y-1/2 z-30 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50"
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next image"
        className="absolute top-1/2 right-6 -translate-y-1/2 z-30 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50"
      >
        <ChevronRight className="w-5 h-5 text-white" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full">
        <div className="flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === current 
                  ? 'bg-white w-8' 
                  : 'bg-white/50 hover:bg-white/80 w-1.5'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};