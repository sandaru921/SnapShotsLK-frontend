'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Navbar } from '@/app/components/navbar';

const slides = [
  {
    title: 'Stories in Motion',
    subtitle: 'Handpicked videographers across Sri Lanka',
    image: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80',
  },
  {
    title: 'Weddings, Events & More',
    subtitle: 'Cinematic films for every occasion',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
  },
  {
    title: 'Brand & Social Content',
    subtitle: 'Elevate your brand with compelling videos',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80',
  },
];

const videographers = [
  {
    name: 'Tharindu Perera',
    bio: 'Wedding films & same-day edits',
    rating: 4.9,
    reviews: 118,
    price: 'From LKR 35,000',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
    tags: ['Weddings', 'Same-day edit', 'Highlights'],
  },
  {
    name: 'Shenal Fernando',
    bio: 'Event & corporate coverage',
    rating: 4.8,
    reviews: 92,
    price: 'From LKR 30,000',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80',
    tags: ['Corporate', 'Events', 'Documentary'],
  },
  {
    name: 'Anika Jayawardena',
    bio: 'Lifestyle & social content',
    rating: 4.8,
    reviews: 104,
    price: 'From LKR 28,000',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    tags: ['Lifestyle', 'Social', 'Brand'],
  },
  {
    name: 'Malith Silva',
    bio: 'Adventure & travel films',
    rating: 4.7,
    reviews: 81,
    price: 'From LKR 32,000',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    tags: ['Travel', 'Outdoor', 'Documentary'],
  },
  {
    name: 'Dinithi Wickramasinghe',
    bio: 'Product and promo videos',
    rating: 4.7,
    reviews: 74,
    price: 'From LKR 26,000',
    avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=400&q=80',
    tags: ['Product', 'Brand', 'Ads'],
  },
  {
    name: 'Ruwan Samarasekara',
    bio: 'Cinematic storytelling',
    rating: 4.9,
    reviews: 129,
    price: 'From LKR 38,000',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
    tags: ['Weddings', 'Documentary', 'Highlights'],
  },
];

export default function VideographersPage() {
  const [current, setCurrent] = useState(0);
  const total = slides.length;

  const goNext = () => setCurrent((c) => (c + 1) % total);
  const goPrev = () => setCurrent((c) => (c - 1 + total) % total);

  useEffect(() => {
    const id = setInterval(goNext, 4500);
    return () => clearInterval(id);
  }, []);

  const activeSlide = useMemo(() => slides[current], [current]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPath="/videographers" />

      {/* Hero slideshow */}
      <section className="relative overflow-hidden">
        <div
          className="h-[320px] sm:h-[420px] md:h-[520px] w-full bg-cover bg-center transition-all duration-700"
          style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.45), rgba(0,0,0,0.65)), url(${activeSlide.image})` }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center text-white">
            <p className="text-sm uppercase tracking-[0.25em] text-amber-200 mb-3">Featured</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide mb-4">
              {activeSlide.title}
            </h1>
            <p className="text-lg sm:text-xl max-w-2xl text-gray-100 mb-6">{activeSlide.subtitle}</p>
            <div className="flex items-center gap-3">
              <button
                onClick={goPrev}
                className="h-10 w-10 rounded-full border border-white/50 text-white/80 hover:text-white hover:border-white transition flex items-center justify-center"
                aria-label="Previous slide"
              >
                ‹
              </button>
              <button
                onClick={goNext}
                className="h-10 w-10 rounded-full border border-white/50 text-white/80 hover:text-white hover:border-white transition flex items-center justify-center"
                aria-label="Next slide"
              >
                ›
              </button>
              <div className="flex items-center gap-2 ml-2">
                {slides.map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-2.5 w-2.5 rounded-full transition ${
                      idx === current ? 'bg-amber-400 scale-110' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Videographers grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-amber-700 mb-2">Discover</p>
            <h2 className="text-3xl font-light tracking-wide text-gray-900">Videographers</h2>
          </div>
          <button className="text-sm text-amber-700 border border-amber-200 px-4 py-2 rounded-full hover:border-amber-500 hover:text-amber-800 transition">
            Browse all
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {videographers.map((p) => (
            <article
              key={p.name}
              className="bg-white border border-gray-200 hover:border-amber-500 shadow-sm hover:shadow-md transition group"
            >
              <div className="flex items-center gap-4 p-5">
                <img
                  src={p.avatar}
                  alt={p.name}
                  className="h-16 w-16 rounded-full object-cover border border-gray-200 group-hover:border-amber-400 transition"
                />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{p.name}</h3>
                  <p className="text-sm text-gray-600">{p.bio}</p>
                  <div className="mt-2 flex items-center gap-2 text-sm text-amber-700 font-medium">
                    <span>★ {p.rating.toFixed(1)}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">{p.reviews} reviews</span>
                  </div>
                </div>
              </div>
              <div className="px-5 pb-5">
                <div className="flex items-center justify-between text-sm text-gray-700 mb-3">
                  <span className="font-semibold text-amber-700">{p.price}</span>
                  <button className="text-amber-700 hover:text-amber-800 text-sm">View profile →</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {p.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* Join showcase */}
      <section className="bg-white border-t border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-amber-700 mb-2">Showcase</p>
            <h3 className="text-3xl font-light text-gray-900 mb-4">Are you a videographer?</h3>
            <p className="text-base text-gray-700 mb-6">
              Create your profile, set your starting rates, and get discovered by clients looking for the perfect match.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="px-5 py-3 rounded-full bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700 transition">
                Add your profile
              </button>
              <button className="px-5 py-3 rounded-full border border-amber-200 text-amber-800 text-sm hover:border-amber-500 transition">
                How it works
              </button>
            </div>
            <ul className="mt-6 space-y-2 text-sm text-gray-700">
              <li>• Verified reviews and ratings</li>
              <li>• Custom packages and availability</li>
              <li>• Secure bookings and payments</li>
            </ul>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-amber-100 bg-amber-50">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-100/60 to-white" />
            <div className="relative p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-white border border-amber-100 flex items-center justify-center text-amber-700 font-semibold">
                  +1
                </div>
                <div>
                  <p className="text-sm text-gray-600">New profile slot</p>
                  <p className="text-lg font-medium text-gray-900">Submit your reel</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-700">
                <div className="bg-white border border-amber-100 rounded-xl p-4">
                  <p className="text-xs uppercase tracking-wide text-amber-700 mb-1">Starting rate</p>
                  <p className="text-lg font-semibold text-gray-900">Set your base package</p>
                </div>
                <div className="bg-white border border-amber-100 rounded-xl p-4">
                  <p className="text-xs uppercase tracking-wide text-amber-700 mb-1">Availability</p>
                  <p className="text-lg font-semibold text-gray-900">Manage dates easily</p>
                </div>
              </div>
              <div className="bg-white border border-amber-100 rounded-xl p-4">
                <p className="text-xs uppercase tracking-wide text-amber-700 mb-1">Visibility</p>
                <p className="text-sm text-gray-700">
                  Get featured in searches for weddings, events, brand films, travel, and more.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}