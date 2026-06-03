'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import Link from 'next/link';
import { Navbar } from '@/app/components/navbar';
import { LocationPicker } from '@/app/components/LocationPicker';
import { WeatherWidget } from '@/app/components/WeatherWidget';
import { haversineKm, formatDistance } from '@/app/lib/geo';
import { MapPin, Star, Navigation, SlidersHorizontal, X, ChevronDown } from 'lucide-react';

const API = 'http://localhost:5090';

const slides = [
  { title: 'Stories in Motion',        subtitle: 'Handpicked videographers across Sri Lanka',  image: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80' },
  { title: 'Weddings, Events & More',  subtitle: 'Cinematic films for every occasion',         image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80' },
  { title: 'Brand & Social Content',   subtitle: 'Elevate your brand with compelling videos',  image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80' },
];

type SortMode = 'nearest' | 'rating' | 'default';
interface UserLocation { lat: number; lng: number; city: string; displayName: string; }

export default function VideographersPage() {
  const [current, setCurrent] = useState(0);
  const [allVideographers, setAllVideographers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>('default');
  const [showWeather, setShowWeather] = useState(false);
  const total = slides.length;

  useEffect(() => {
    const id = setInterval(() => setCurrent(c => (c + 1) % total), 4500);
    return () => clearInterval(id);
  }, [total]);

  useEffect(() => {
    fetch(`${API}/api/Profile/public/category/videographer`)
      .then(r => r.json())
      .then(data => {
        setAllVideographers(data.map((d: any) => ({
          id: d.id,
          name: d.businessName || d.name,
          bio: d.profile?.bio || 'Professional Videographer',
          rating: d.profile?.rating || 5.0,
          reviews: d.profile?.reviewCount || 0,
          avatar: d.profile?.avatarUrl || 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=400&q=80',
          tags: d.profile?.specialties?.length ? d.profile.specialties : ['Videographer'],
          location: d.location || 'Sri Lanka',
          experience: d.profile?.experience || '',
          latitude: d.latitude,
          longitude: d.longitude,
        })));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleLocationChange = useCallback((loc: UserLocation | null) => {
    setUserLocation(loc);
    if (loc) { setSortMode('nearest'); setShowWeather(true); }
    else setSortMode('default');
  }, []);

  const videographers = useMemo(() => {
    let list = [...allVideographers];
    if (sortMode === 'nearest' && userLocation) {
      list = list.map(p => ({
        ...p,
        distanceKm: p.latitude && p.longitude
          ? haversineKm(userLocation.lat, userLocation.lng, p.latitude, p.longitude)
          : null,
      })).sort((a, b) => {
        if (a.distanceKm == null && b.distanceKm == null) return 0;
        if (a.distanceKm == null) return 1;
        if (b.distanceKm == null) return -1;
        return a.distanceKm - b.distanceKm;
      });
    } else if (sortMode === 'rating') {
      list = list.sort((a, b) => b.rating - a.rating);
    }
    return list;
  }, [allVideographers, sortMode, userLocation]);

  const activeSlide = slides[current];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPath="/user/videographers" />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="h-[320px] sm:h-[420px] md:h-[520px] w-full bg-cover bg-center transition-all duration-700"
          style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(${activeSlide.image})` }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center text-white">
            <p className="text-sm uppercase tracking-[0.25em] text-purple-200 mb-3">Featured</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide mb-4">{activeSlide.title}</h1>
            <p className="text-lg sm:text-xl max-w-2xl text-gray-100 mb-6">{activeSlide.subtitle}</p>
            <div className="max-w-md">
              <p className="text-xs text-white/70 mb-2 font-medium uppercase tracking-wider">📍 Find near you</p>
              <LocationPicker value={userLocation} onChange={handleLocationChange} placeholder="Enter your city or use GPS…" className="shadow-2xl" />
            </div>
          </div>
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all ${i === current ? 'w-6 bg-purple-400' : 'w-1.5 bg-white/50'}`} />
          ))}
        </div>
      </section>

      {/* Weather Panel */}
      {showWeather && userLocation && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="relative">
            <button onClick={() => setShowWeather(false)}
              className="absolute top-3 right-3 z-10 p-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg transition backdrop-blur-sm">
              <X className="w-4 h-4" />
            </button>
            <WeatherWidget lat={userLocation.lat} lng={userLocation.lng} locationName={userLocation.city} />
          </div>
        </div>
      )}

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-purple-700 mb-1">Discover</p>
            <h2 className="text-3xl font-light tracking-wide text-gray-900">
              Videographers
              <span className="text-lg text-gray-400 font-normal ml-3">({videographers.length})</span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <select value={sortMode} onChange={e => setSortMode(e.target.value as SortMode)}
                className="appearance-none pl-9 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300 font-medium cursor-pointer">
                <option value="default">Default order</option>
                <option value="rating">Highest rated</option>
                <option value="nearest" disabled={!userLocation}>
                  {userLocation ? `Nearest to ${userLocation.city}` : 'Nearest (set location first)'}
                </option>
              </select>
              <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>

            {userLocation && !showWeather && (
              <button onClick={() => setShowWeather(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-500 text-white rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition">
                🌤️ Weather in {userLocation.city}
              </button>
            )}

            <div className="w-52 hidden sm:block">
              <LocationPicker value={userLocation} onChange={handleLocationChange} placeholder="Change location…" />
            </div>
          </div>
        </div>

        {userLocation && sortMode === 'nearest' && (
          <div className="flex items-center gap-2 mb-5 text-sm text-purple-700 bg-purple-50 border border-purple-200 rounded-xl px-4 py-2.5">
            <Navigation className="w-4 h-4 text-purple-400" />
            Showing videographers nearest to <strong>{userLocation.city}</strong>.
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-5 animate-pulse">
                <div className="flex gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gray-200" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-8 bg-gray-100 rounded-lg" />
              </div>
            ))}
          </div>
        ) : videographers.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🎬</div>
            <p className="text-gray-500 font-medium">No videographers found.</p>
            <Link href="/admin/register" className="mt-4 inline-block px-5 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 transition">
              Register as a videographer
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videographers.map((p) => (
              <Link key={p.id}
                href={`/user/photographers/${p.id}${userLocation ? `?clat=${userLocation.lat}&clng=${userLocation.lng}` : ''}`}
                className="block bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm cursor-pointer transition-all duration-300 hover:border-purple-400 hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] group">
                <div className="flex items-center gap-4 p-5">
                  <div className="relative shrink-0">
                    <img src={p.avatar} alt={p.name}
                      className="h-16 w-16 rounded-full object-cover border-2 border-gray-200 transition-all duration-300 group-hover:border-purple-400 group-hover:scale-105" />
                    {p.distanceKm != null && (
                      <div className="absolute -bottom-1 -right-1 bg-purple-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                        {p.distanceKm < 1 ? `<1km` : `${Math.round(p.distanceKm)}km`}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <h3 className="text-base font-semibold text-gray-900 group-hover:text-purple-800 transition truncate">{p.name}</h3>
                      <span className="text-purple-500 text-xs shrink-0">✓</span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{p.bio}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-amber-600 text-sm font-semibold">{p.rating.toFixed(1)}</span>
                      <span className="text-gray-400 text-xs">({p.reviews})</span>
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                      <MapPin className="w-3.5 h-3.5 text-purple-400" />
                      <span className="truncate max-w-[140px]">{p.location}</span>
                    </div>
                    {p.distanceKm != null && (
                      <span className="text-xs text-purple-600 font-semibold bg-purple-50 px-2 py-0.5 rounded-full">
                        {formatDistance(p.distanceKm)}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.tags.slice(0, 3).map((tag: string) => (
                      <span key={tag} className="text-xs px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100 group-hover:bg-purple-100 transition">{tag}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{p.experience ? `${p.experience} yrs exp` : 'Contact for pricing'}</span>
                    <span className="text-purple-700 font-semibold group-hover:translate-x-0.5 transition-transform">View profile →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <section className="bg-white border-t border-purple-100 mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center max-w-xl mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] text-purple-700 mb-2">Join Us</p>
          <h3 className="text-3xl font-light text-gray-900 mb-4">Are you a videographer?</h3>
          <p className="text-gray-600 mb-6">Join Sri Lanka's premier creative platform and connect with clients who need your skills.</p>
          <Link href="/admin/register" className="inline-block px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition shadow-md">
            Add your profile
          </Link>
        </div>
      </section>
    </div>
  );
}