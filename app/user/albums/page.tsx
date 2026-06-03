'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/app/components/navbar';
import { MapPin, Star, BookOpen } from 'lucide-react';

const API = 'http://localhost:5090';

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



export default function AlbumsPage() {
  const [current, setCurrent] = useState(0);
  const [providers, setProviders] = useState<any[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(true);
  const [search, setSearch] = useState('');
  const total = slides.length;

  const goNext = () => setCurrent((c) => (c + 1) % total);
  const goPrev = () => setCurrent((c) => (c - 1 + total) % total);

  useEffect(() => {
    const id = setInterval(goNext, 4500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    fetch(`${API}/api/Profile/public/category/album_printer`)
      .then(r => r.json())
      .then(data => setProviders(data.map((d: any) => ({
        id: d.id,
        name: d.businessName || d.name,
        location: d.location || 'Sri Lanka',
        bio: d.profile?.bio || 'Professional Album Printing Service',
        rating: d.profile?.rating || 5.0,
        reviewCount: d.profile?.reviewCount || 0,
        cover: d.profile?.avatarUrl || d.profile?.coverImageUrl || 'https://images.unsplash.com/photo-1511288593014-8acb33db1c83?auto=format&fit=crop&w=900&q=80',
        tags: d.profile?.specialties?.length ? d.profile.specialties : ['Photo Albums'],
        experience: d.profile?.experience,
      }))))
      .catch(() => setProviders([]))
      .finally(() => setLoadingProviders(false));
  }, []);

  const activeSlide = useMemo(() => slides[current], [current]);
  const filtered = providers.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase())
  );

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
            <h2 className="text-3xl font-light tracking-wide text-gray-900">Album Printing Services</h2>
          </div>
          <input type="text" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)}
            className="pl-4 pr-4 py-2 border border-amber-200 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400 w-40" />
        </div>

        {loadingProviders ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="relative w-10 h-10"><div className="absolute inset-0 rounded-full border-4 border-amber-100"/><div className="absolute inset-0 rounded-full border-4 border-amber-600 border-t-transparent animate-spin"/></div>
            <p className="text-sm text-gray-400">Loading album services…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <BookOpen className="w-14 h-14 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No album services found</h3>
            <p className="text-gray-500 text-sm mb-4">{search ? `No results for "${search}"` : 'No approved album printing services yet.'}</p>
            <Link href="/admin/register" className="inline-block text-sm px-5 py-2 bg-amber-700 text-white rounded-xl hover:bg-amber-800 transition">Register your album service →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {filtered.map((p) => (
              <Link key={p.id} href={`/user/photographers/${p.id}`}
                className="bg-white border border-gray-200 hover:border-amber-500 shadow-sm hover:shadow-md transition group rounded-xl overflow-hidden block">
                <div className="h-44 w-full bg-gray-100 overflow-hidden">
                  <img src={p.cover} alt={p.name} className="h-full w-full object-cover group-hover:scale-[1.04] transition" />
                </div>
                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">{p.name}</h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{p.location}</p>
                    </div>
                    {p.rating > 0 && <span className="text-sm font-bold text-amber-700 flex items-center gap-0.5"><Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />{p.rating.toFixed(1)}</span>}
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">{p.bio}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.slice(0,3).map((t: string) => <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">{t}</span>)}
                  </div>
                  <span className="text-xs font-medium text-amber-700 group-hover:underline">View Profile →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
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