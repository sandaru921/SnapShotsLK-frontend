"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/app/components/navbar";

const slides = [
  {
    title: "Capture Your Moments",
    subtitle: "Handpicked photographers across Sri Lanka",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Weddings, Events & More",
    subtitle: "Book the right pro for every occasion",
    image:
      "https://images.unsplash.com/photo-1520854221050-0f4caff449fb?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Timeless Portraits",
    subtitle: "Premium portrait sessions near you",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1600&q=80",
  },
];

export default function PhotographersPage() {
  const [current, setCurrent] = useState(0);
  const [admin, setAdmin] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const total = slides.length;

  useEffect(() => {
    fetch('http://localhost:5090/api/Profile/public/category/photographer')
      .then(res => res.json())
      .then(data => {
        // Map backend schema to the expected frontend schema
        const mappedData = data.map((d: any) => ({
          id: d.id,
          name: d.name,
          bio: d.profile?.bio || 'Professional Photographer',
          rating: d.profile?.rating || 5.0,
          reviews: d.profile?.reviewCount || 0,
          price: 'Contact for pricing',
          avatar: d.profile?.avatarUrl || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80',
          tags: ['Photographer'],
          location: d.location || 'Sri Lanka',
          experience: d.profile?.experience || 'Experienced',
          verified: true
        }));
        setAdmin(mappedData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const goNext = () => setCurrent((c) => (c + 1) % total);
  const goPrev = () => setCurrent((c) => (c - 1 + total) % total);

  useEffect(() => {
    const id = setInterval(goNext, 4500);
    return () => clearInterval(id);
  }, []);

  const activeSlide = useMemo(() => slides[current], [current]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPath="/user/photographers" />

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
              Featured
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
              <div className="flex items-center gap-2 ml-2"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Photographers grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-amber-700 mb-2">
              Discover
            </p>
            <h2 className="text-3xl font-light tracking-wide text-gray-900">
              Photographers
            </h2>
          </div>
          <button className="text-sm text-amber-700 border border-amber-200 px-4 py-2 rounded-full hover:border-amber-500 hover:text-amber-800 transition">
            Browse all
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {admin.map((p) => (
            <Link
              key={p.id}
              href={`/user/photographers/${p.id}`}
              className="block bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm cursor-pointer transition-all duration-300 hover:border-amber-500 hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] group"
            >
              <div className="flex items-center gap-4 p-5">
                <img
                  src={p.avatar}
                  alt={p.name}
                  className="h-16 w-16 rounded-full object-cover border-2 border-gray-200 transition-all duration-300 group-hover:border-amber-400 group-hover:scale-105"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900 transition-colors group-hover:text-amber-800">
                      {p.name}
                    </h3>
                    {p.verified && (
                      <span className="text-amber-600 text-sm">✓</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{p.bio}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-amber-600 text-sm font-medium">
                      ★ {p.rating}
                    </span>
                    <span className="text-gray-400 text-sm">•</span>
                    <span className="text-gray-500 text-sm">
                      {p.reviews} reviews
                    </span>
                  </div>
                </div>
              </div>
              <div className="px-5 pb-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-amber-700 font-semibold transition-colors group-hover:text-amber-800">
                    {p.price}
                  </span>
                  <span className="text-gray-500 text-sm flex items-center gap-1">
                    📍 {p.location}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {p.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100 transition-colors group-hover:bg-amber-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{p.experience}</span>
                  <span className="text-amber-700 font-medium transition-all group-hover:text-amber-800 group-hover:translate-x-1">
                    View profile →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Join showcase */}
      <section className="bg-white border-t border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-amber-700 mb-2">
              Showcase
            </p>
            <h3 className="text-3xl font-light text-gray-900 mb-4">
              Are you a photographer?
            </h3>
            <p className="text-base text-gray-700 mb-6">
              Create your profile, set your starting rates, and get discovered
              by clients looking for the perfect match.
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
              <div className="flex items-center gap-3"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}