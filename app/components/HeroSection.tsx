'use client';

import React from 'react';
import { Star, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { ImageCarousel } from './ImageCarousel';

export const HeroSection: React.FC = () => (
  <section className="relative min-h-screen bg-white overflow-hidden">
    
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 lg:pt-32 lg:pb-24">
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        
        {/* Left Side - Content */}
        <div className="space-y-12 order-2 lg:order-1">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-50 rounded-full animate-fade-in-up delay-200">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-900">
              Sri Lanka's Premier Photography Platform
            </span>
          </div>

          {/* Main Heading */}
          <div className="space-y-4 md:space-y-6 animate-fade-in-up delay-400">
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-extralight leading-tight tracking-tight">
              <span className="text-gray-900">Capture</span>
              <br />
              <span className="font-light text-gray-900">Your</span>
              <br />
              <span className="font-semibold text-amber-700">Moments</span>
            </h1>
          </div>

          {/* Description */}
          <p className="text-lg sm:text-xl text-gray-500 leading-relaxed max-w-lg font-light animate-fade-in-up delay-600">
            Connect with exceptional photographers and videographers. 
            Professional artistry for your most precious moments.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-in-up delay-800">
            <Link
              href="/photographers"
              className="group inline-flex items-center justify-center px-10 py-5 bg-amber-700 hover:bg-amber-800 text-white font-medium rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
            >
              Book Now
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/studios"
              className="group inline-flex items-center justify-center px-10 py-5 bg-white hover:bg-gray-50 text-gray-900 font-medium rounded-full transition-all duration-300 border-2 border-gray-200 hover:border-amber-700"
            >
              Explore
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-8 animate-fade-in-up delay-1000">
            <div>
              <div className="text-2xl sm:text-4xl font-light text-gray-900 mb-1">500+</div>
              <div className="text-sm text-gray-500 font-light">Professionals</div>
            </div>
            <div>
              <div className="text-2xl sm:text-4xl font-light text-gray-900 mb-1">10K+</div>
              <div className="text-sm text-gray-500 font-light">Projects</div>
            </div>
            <div>
              <div className="flex items-center gap-1 mb-1">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 fill-amber-500" />
                <div className="text-2xl sm:text-4xl font-light text-gray-900">4.9</div>
              </div>
              <div className="text-sm text-gray-500 font-light">Rating</div>
            </div>
          </div>
        </div>

        {/* Right Side - Carousel */}
        <div className="relative order-1 lg:order-2 animate-fade-in-up delay-400">
          <div className="relative">
            {/* Glass Card */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white/40 backdrop-blur-sm border border-white/60 p-2 sm:p-3">
              <div className="h-[350px] sm:h-[450px] lg:h-[650px] rounded-2xl overflow-hidden">
                <ImageCarousel />
              </div>
            </div>

            {/* Decorative Glass Elements */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-amber-100/50 backdrop-blur-3xl rounded-full"></div>
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-amber-50/50 backdrop-blur-3xl rounded-full"></div>
          </div>
        </div>

      </div>
    </div>
  </section>
);