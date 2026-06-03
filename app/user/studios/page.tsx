"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Navbar } from '@/app/components/navbar';
import { MapPin, Star, Building2 } from 'lucide-react';

const API = 'http://localhost:5090';
const slides = [
  {
    title: "Professional Photography Studios",
    subtitle: "State-of-the-art facilities for every shoot",
    image:
      "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Fully Equipped Spaces",
    subtitle: "Lighting, backdrops, and props included",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Book by the Hour",
    subtitle: "Flexible scheduling for all your needs",
    image:
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1600&q=80",
  },
];



export default function StudiosPage() {
  const [current, setCurrent] = useState(0);
  const [studios, setStudios] = useState<any[]>([]);
  const [loadingStudios, setLoadingStudios] = useState(true);
  const [search, setSearch] = useState('');
  const total = slides.length;

  const goNext = () => setCurrent((c) => (c + 1) % total);
  const goPrev = () => setCurrent((c) => (c - 1 + total) % total);

  useEffect(() => {
    const id = setInterval(goNext, 4500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    fetch(`${API}/api/Profile/public/category/studio`)
      .then(r => r.json())
      .then(data => setStudios(data.map((d: any) => ({
        id: d.id,
        name: d.businessName || d.name,
        location: d.location || 'Sri Lanka',
        description: d.profile?.bio || 'Professional Photography Studio',
        rating: d.profile?.rating || 5.0,
        reviews: d.profile?.reviewCount || 0,
        price: 'Contact for pricing',
        image: d.profile?.avatarUrl || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
        features: d.profile?.specialties || ['Photography Studio'],
        experience: d.profile?.experience,
      }))))
      .catch(() => setStudios([]))
      .finally(() => setLoadingStudios(false));
  }, []);

  const activeSlide = useMemo(() => slides[current], [current]);
  const filteredStudios = studios.filter(s =>
    !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPath="/studios" />

      {/* Hero slideshow */}
      <section className="relative overflow-hidden">
        <div
          className="h-[320px] sm:h-[420px] md:h-[520px] w-full bg-cover bg-center transition-all duration-700"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.45), rgba(0,0,0,0.65)), url(${activeSlide.image})`,
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center text-white">
            <p className="text-sm uppercase tracking-[0.25em] text-amber-200 mb-3">
              Rent Studios
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide mb-4">
              {activeSlide.title}
            </h1>
            <p className="text-lg sm:text-xl max-w-2xl text-gray-100 mb-6">
              {activeSlide.subtitle}
            </p>
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
                      idx === current ? "bg-amber-400 scale-110" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Studios grid */}
      <main
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        id="studios-grid"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-amber-700 mb-2">Discover</p>
            <h2 className="text-3xl font-light tracking-wide text-gray-900">Photography Studios</h2>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or city…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-4 pr-4 py-2 border border-amber-200 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400 w-48"
            />
          </div>
        </div>

        {loadingStudios ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="relative w-10 h-10"><div className="absolute inset-0 rounded-full border-4 border-amber-100"/><div className="absolute inset-0 rounded-full border-4 border-amber-600 border-t-transparent animate-spin"/></div>
            <p className="text-sm text-gray-400">Loading studios…</p>
          </div>
        ) : filteredStudios.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <Building2 className="w-14 h-14 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No studios found</h3>
            <p className="text-gray-500 text-sm mb-4">
              {search ? `No results for "${search}"` : 'No approved studios registered yet.'}
            </p>
            <Link href="/admin/register" className="inline-block text-sm px-5 py-2 bg-amber-700 text-white rounded-xl hover:bg-amber-800 transition">Register your studio →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredStudios.map((studio) => (
              <Link key={studio.id} href={`/user/photographers/${studio.id}`}
                className="bg-white border border-gray-200 hover:border-amber-500 shadow-sm hover:shadow-md transition group overflow-hidden rounded-xl block">
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img src={studio.image} alt={studio.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-0.5">{studio.name}</h3>
                  <p className="text-sm text-amber-700 flex items-center gap-1 mb-1"><MapPin className="w-3.5 h-3.5" />{studio.location}</p>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{studio.description}</p>
                  {studio.rating > 0 && (
                    <div className="flex items-center gap-2 text-sm text-amber-700 font-medium mb-3">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      {studio.rating.toFixed(1)}
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600">{studio.reviews} reviews</span>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {studio.features.slice(0, 3).map((f: string) => (
                      <span key={f} className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">{f}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="font-semibold text-amber-700 text-sm">{studio.price}</span>
                    <span className="text-amber-700 text-sm font-medium group-hover:underline">View Studio →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Features section */}
      <section className="bg-white border-t border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-amber-700 mb-2">
              Studio Rentals
            </p>
            <h3 className="text-3xl font-light text-gray-900 mb-4">
              Everything you need for the perfect shoot
            </h3>
            <p className="text-base text-gray-700 mb-6">
              Our partner studios provide professional-grade equipment, flexible
              booking, and expert support for photographers of all levels.
            </p>
            <div className="flex flex-wrap gap-3 mb-6">
              <button className="px-5 py-3 rounded-full bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700 transition">
                Book a studio
              </button>
              <button className="px-5 py-3 rounded-full border border-amber-200 text-amber-800 text-sm hover:border-amber-500 transition">
                Virtual tours
              </button>
            </div>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">✓</span>
                <span>
                  <strong>Professional equipment:</strong> Lighting, backdrops,
                  and props included
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">✓</span>
                <span>
                  <strong>Flexible hours:</strong> Book by the hour or full day
                  packages
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">✓</span>
                <span>
                  <strong>Prime locations:</strong> Studios across major cities
                  in Sri Lanka
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">✓</span>
                <span>
                  <strong>Technical support:</strong> On-site assistance
                  available
                </span>
              </li>
            </ul>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-amber-100 bg-amber-50">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-100/60 to-white" />
            <div className="relative p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-white border border-amber-100 flex items-center justify-center text-amber-700 font-semibold text-lg">
                  📸
                </div>
                <div>
                  <p className="text-sm text-gray-600">Professional spaces</p>
                  <p className="text-lg font-medium text-gray-900">
                    Ready to shoot
                  </p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-700">
                <div className="bg-white border border-amber-100 rounded-xl p-4">
                  <p className="text-xs uppercase tracking-wide text-amber-700 mb-1">
                    Equipment
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    Fully stocked
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Lights, cameras, backdrops
                  </p>
                </div>
                <div className="bg-white border border-amber-100 rounded-xl p-4">
                  <p className="text-xs uppercase tracking-wide text-amber-700 mb-1">
                    Booking
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    Instant confirm
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Real-time availability
                  </p>
                </div>
              </div>
              <div className="bg-white border border-amber-100 rounded-xl p-4">
                <p className="text-xs uppercase tracking-wide text-amber-700 mb-1">
                  Amenities
                </p>
                <p className="text-sm text-gray-700">
                  Changing rooms, makeup areas, client lounges, and parking
                  facilities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
