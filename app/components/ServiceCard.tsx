'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface ServiceCardProps {
  title: string;
  description: string;
  href: string;
  images: string[]; // Array of image URLs
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, href, images }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-advance slideshow
  useEffect(() => {
    if (!isHovered) {
      const timer = setInterval(() => {
        setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }, 3000); // Change image every 3 seconds

      return () => clearInterval(timer);
    }
  }, [currentImage, images.length, isHovered]);

  const nextImage = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const prevImage = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToImage = useCallback((index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage(index);
  }, []);

  return (
    <Link
      href={href}
      className="group block bg-white/60 backdrop-blur-xl border border-gray-100 hover:border-amber-200 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Slideshow */}
      <div className="relative h-64 overflow-hidden">
        {/* Images */}
        {images.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImage ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img
              src={img}
              alt={`${title} ${index + 1}`}
              className={`w-full h-full object-cover transition-transform duration-1000 ${
                index === currentImage ? 'scale-100' : 'scale-110'
              }`}
              loading="lazy"
            />
          </div>
        ))}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent z-20"></div>

        {/* Navigation Arrows - Show on Hover */}
        <div className="absolute inset-0 z-30 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={prevImage}
            aria-label="Previous image"
            className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full transition-all duration-300"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>

          <button
            onClick={nextImage}
            aria-label="Next image"
            className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full transition-all duration-300"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => goToImage(index, e)}
              aria-label={`Go to image ${index + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentImage 
                  ? 'bg-white w-6' 
                  : 'bg-white/50 hover:bg-white/80 w-1.5'
              }`}
            />
          ))}
        </div>

        {/* Title Overlay on Image */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-6">
          <h3 className="text-2xl font-light text-white drop-shadow-lg">
            {title}
          </h3>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-8 space-y-4">
        {/* Description */}
        <p className="text-gray-600 leading-relaxed font-light text-sm">
          {description}
        </p>

        {/* CTA */}
        <div className="flex items-center text-amber-700 font-medium text-sm pt-2 group-hover:translate-x-2 transition-transform duration-300">
          Explore
          <ArrowRight className="w-4 h-4 ml-2" />
        </div>
      </div>
    </Link>
  );
};