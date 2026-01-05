'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Navbar } from '../components/navbar';

const slides = [
  {
    title: 'Your Day, Beautifully Curated',
    subtitle: 'Relive every moment with handcrafted photo albums',
    image: 'https://images.unsplash.com/photo-1511288593014-8acb33db1c83?auto=format&fit=crop&w=1600&q=80',
  },
  {
    title: 'Albums for Every Story',
    subtitle: 'Weddings, travel, family and milestone memories',
    image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1600&q=80',
  },
  {
    title: 'Premium Prints & Layouts',
    subtitle: 'Museum-grade paper and custom spreads',
    image: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80',
  },
];

const albums = [
  {
    title: 'Amaya & Nuwan — Galle Wedding',
    by: 'Ishara Perera',
    rating: 4.9,
    photos: 186,
    price: 'From LKR 18,000',
    cover: 'https://images.unsplash.com/photo-1520854221050-0f4caff449fb?auto=format&fit=crop&w=900&q=80',
    tags: ['Wedding', 'Coastal', 'Classic'],
  },
  {
    title: 'Ella Trails — Travel Story',
    by: 'Ravindu Silva',
    rating: 4.8,
    photos: 134,
    price: 'From LKR 12,500',
    cover: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    tags: ['Travel', 'Adventure', 'Documentary'],
  },
  {
    title: 'Homecoming — Colombo',
    by: 'Nadine Fernando',
    rating: 4.8,
    photos: 162,
    price: 'From LKR 15,000',
    cover: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
    tags: ['Homecoming', 'Family', 'Editorial'],
  },
  {
    title: 'Brand Story — Ceylon Tea',
    by: 'Amaya Wickramasinghe',
    rating: 4.7,
    photos: 98,
    price: 'From LKR 14,500',
    cover: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80',
    tags: ['Brand', 'Product', 'Lifestyle'],
  },
  {
    title: 'Little Moments — Newborn',
    by: 'Dilani Weerasinghe',
    rating: 4.9,
    photos: 120,
    price: 'From LKR 13,000',
    cover: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    tags: ['Newborn', 'Family', 'Lifestyle'],
  },
  {
    title: 'Corporate Gala — Shangri-La',
    by: 'Kasun Jayasuriya',
    rating: 4.7,
    photos: 156,
    price: 'From LKR 16,500',
    cover: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80',
    tags: ['Events', 'Corporate', 'Highlights'],
  },
];

export default function AlbumsPage() {
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
      <Navbar currentPath="/albums" />

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

      {/* Albums grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-amber-700 mb-2">Discover</p>
            <h2 className="text-3xl font-light tracking-wide text-gray-900">Albums</h2>
          </div>
          <button className="text-sm text-amber-700 border border-amber-200 px-4 py-2 rounded-full hover:border-amber-500 hover:text-amber-800 transition">
            Browse all
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {albums.map((a) => (
            <article
              key={a.title}
              className="bg-white border border-gray-200 hover:border-amber-500 shadow-sm hover:shadow-md transition group rounded-lg overflow-hidden"
            >
              <div className="h-44 w-full bg-gray-100 overflow-hidden">
                <img
                  src={a.cover}
                  alt={a.title}
                  className="h-full w-full object-cover group-hover:scale-[1.02] transition"
                />
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 line-clamp-2">{a.title}</h3>
                    <p className="text-sm text-gray-600">By {a.by}</p>
                  </div>
                  <span className="text-sm font-semibold text-amber-700 whitespace-nowrap">{a.price}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <span className="text-amber-700 font-medium">★ {a.rating.toFixed(1)}</span>
                  <span className="text-gray-400">•</span>
                  <span>{a.photos} photos</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {a.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button className="text-sm text-amber-700 hover:text-amber-800">View album →</button>
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
            <h3 className="text-3xl font-light text-gray-900 mb-4">Want to feature your album?</h3>
            <p className="text-base text-gray-700 mb-6">
              Publish curated spreads, add pricing, and let clients explore your best stories in one place.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="px-5 py-3 rounded-full bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700 transition">
                Add your album
              </button>
              <button className="px-5 py-3 rounded-full border border-amber-200 text-amber-800 text-sm hover:border-amber-500 transition">
                How it works
              </button>
            </div>
            <ul className="mt-6 space-y-2 text-sm text-gray-700">
              <li>• High-res spreads and secure hosting</li>
              <li>• Pricing, packages, and availability</li>
              <li>• Featured placement across categories</li>
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
                  <p className="text-sm text-gray-600">New album slot</p>
                  <p className="text-lg font-medium text-gray-900">Upload your spreads</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-700">
                <div className="bg-white border border-amber-100 rounded-xl p-4">
                  <p className="text-xs uppercase tracking-wide text-amber-700 mb-1">Paper & finish</p>
                  <p className="text-lg font-semibold text-gray-900">Choose premium options</p>
                </div>
                <div className="bg-white border border-amber-100 rounded-xl p-4">
                  <p className="text-xs uppercase tracking-wide text-amber-700 mb-1">Delivery</p>
                  <p className="text-lg font-semibold text-gray-900">Set timelines & pickup</p>
                </div>
              </div>
              <div className="bg-white border border-amber-100 rounded-xl p-4">
                <p className="text-xs uppercase tracking-wide text-amber-700 mb-1">Visibility</p>
                <p className="text-sm text-gray-700">
                  Get discovered in wedding, travel, family, and brand album searches.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}