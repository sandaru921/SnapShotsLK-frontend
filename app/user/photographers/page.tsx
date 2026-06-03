"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { Navbar } from "@/app/components/navbar";
import { LocationPicker } from "@/app/components/LocationPicker";
import { WeatherWidget } from "@/app/components/WeatherWidget";
import { haversineKm, formatDistance } from "@/app/lib/geo";
import { MapPin, Star, Navigation, SlidersHorizontal, X, ChevronDown } from "lucide-react";

const API = "http://localhost:5090";

const slides = [
  { title: "Capture Your Moments",    subtitle: "Handpicked photographers across Sri Lanka", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1600&q=80" },
  { title: "Weddings, Events & More", subtitle: "Book the right pro for every occasion",      image: "https://images.unsplash.com/photo-1520854221050-0f4caff449fb?auto=format&fit=crop&w=1600&q=80" },
  { title: "Timeless Portraits",      subtitle: "Premium portrait sessions near you",          image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1600&q=80" },
];

type SortMode = "nearest" | "rating" | "default";

interface UserLocation { lat: number; lng: number; city: string; displayName: string; }

export default function PhotographersPage() {
  const [current, setCurrent] = useState(0);
  const [allPhotographers, setAllPhotographers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>("default");
  const [showWeather, setShowWeather] = useState(false);
  const total = slides.length;

  // Hero slideshow
  useEffect(() => {
    const id = setInterval(() => setCurrent(c => (c + 1) % total), 4500);
    return () => clearInterval(id);
  }, [total]);

  // Fetch photographers from API
  useEffect(() => {
    fetch(`${API}/api/Profile/public/category/photographer`)
      .then(r => r.json())
      .then(data => {
        setAllPhotographers(data.map((d: any) => ({
          id: d.id,
          name: d.businessName || d.name,
          bio: d.profile?.bio || "Professional Photographer",
          rating: d.profile?.rating || 5.0,
          reviews: d.profile?.reviewCount || 0,
          avatar: d.profile?.avatarUrl || "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80",
          tags: d.profile?.specialties?.length ? d.profile.specialties : ["Photographer"],
          location: d.location || "Sri Lanka",
          experience: d.profile?.experience || "",
          latitude: d.latitude,
          longitude: d.longitude,
        })));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // When location changes → auto-switch to nearest sort
  const handleLocationChange = useCallback((loc: UserLocation | null) => {
    setUserLocation(loc);
    if (loc) setSortMode("nearest");
    else setSortMode("default");
    if (loc) setShowWeather(true);
  }, []);

  // Sorted/filtered list
  const photographers = useMemo(() => {
    let list = [...allPhotographers];
    if (sortMode === "nearest" && userLocation) {
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
    } else if (sortMode === "rating") {
      list = list.sort((a, b) => b.rating - a.rating);
    }
    return list;
  }, [allPhotographers, sortMode, userLocation]);

  const activeSlide = slides[current];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPath="/user/photographers" />

      {/* ── Hero Slideshow ── */}
      <section className="relative overflow-hidden">
        <div
          className="h-[320px] sm:h-[420px] md:h-[520px] w-full bg-cover bg-center transition-all duration-700"
          style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(${activeSlide.image})` }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center text-white">
            <p className="text-sm uppercase tracking-[0.25em] text-amber-200 mb-3">Featured</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide mb-4">{activeSlide.title}</h1>
            <p className="text-lg sm:text-xl max-w-2xl text-gray-100 mb-6">{activeSlide.subtitle}</p>

            {/* Location picker embedded in hero */}
            <div className="max-w-md">
              <p className="text-xs text-white/70 mb-2 font-medium uppercase tracking-wider">📍 Find near you</p>
              <LocationPicker
                value={userLocation}
                onChange={handleLocationChange}
                placeholder="Enter your city or use GPS…"
                className="shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* Slide dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all ${i === current ? 'w-6 bg-amber-400' : 'w-1.5 bg-white/50'}`} />
          ))}
        </div>
      </section>

      {/* ── Weather Panel ── */}
      {showWeather && userLocation && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="relative">
            <button
              onClick={() => setShowWeather(false)}
              className="absolute top-3 right-3 z-10 p-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg transition backdrop-blur-sm"
            >
              <X className="w-4 h-4" />
            </button>
            <WeatherWidget lat={userLocation.lat} lng={userLocation.lng} locationName={userLocation.city} />
          </div>
        </div>
      )}

      {/* ── Filter + Sort Bar ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-amber-700 mb-1">Discover</p>
            <h2 className="text-3xl font-light tracking-wide text-gray-900">
              Photographers
              <span className="text-lg text-gray-400 font-normal ml-3">({photographers.length})</span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Sort selector */}
            <div className="relative">
              <select
                value={sortMode}
                onChange={e => setSortMode(e.target.value as SortMode)}
                className="appearance-none pl-9 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-300 font-medium cursor-pointer"
              >
                <option value="default">Default order</option>
                <option value="rating">Highest rated</option>
                <option value="nearest" disabled={!userLocation}>
                  {userLocation ? `Nearest to ${userLocation.city}` : "Nearest (set location first)"}
                </option>
              </select>
              <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>

            {/* Toggle weather */}
            {userLocation && !showWeather && (
              <button
                onClick={() => setShowWeather(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-500 text-white rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition"
              >
                🌤️ Weather in {userLocation.city}
              </button>
            )}

            {/* Location picker (smaller, in toolbar) */}
            <div className="w-52 hidden sm:block">
              <LocationPicker
                value={userLocation}
                onChange={handleLocationChange}
                placeholder="Change location…"
              />
            </div>
          </div>
        </div>

        {/* Location banner */}
        {userLocation && sortMode === "nearest" && (
          <div className="flex items-center gap-2 mb-5 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
            <Navigation className="w-4 h-4 text-amber-500" />
            Showing photographers nearest to <strong>{userLocation.city}</strong>. Photographers without a set location appear last.
          </div>
        )}

        {/* ── Photographers Grid ── */}
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
        ) : photographers.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📷</div>
            <p className="text-gray-500 font-medium">No photographers found.</p>
            <Link href="/admin/register" className="mt-4 inline-block px-5 py-2.5 bg-amber-600 text-white rounded-xl text-sm font-semibold hover:bg-amber-700 transition">
              Register as a photographer
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {photographers.map((p) => (
              <Link
                key={p.id}
                href={`/user/photographers/${p.id}${userLocation ? `?clat=${userLocation.lat}&clng=${userLocation.lng}` : ''}`}
                className="block bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm cursor-pointer transition-all duration-300 hover:border-amber-400 hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] group"
              >
                <div className="flex items-center gap-4 p-5">
                  <div className="relative shrink-0">
                    <img
                      src={p.avatar}
                      alt={p.name}
                      className="h-16 w-16 rounded-full object-cover border-2 border-gray-200 transition-all duration-300 group-hover:border-amber-400 group-hover:scale-105"
                    />
                    {/* Distance badge */}
                    {p.distanceKm != null && (
                      <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                        {p.distanceKm < 1 ? `<1km` : `${Math.round(p.distanceKm)}km`}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <h3 className="text-base font-semibold text-gray-900 group-hover:text-amber-800 transition truncate">{p.name}</h3>
                      <span className="text-amber-500 text-xs shrink-0">✓</span>
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
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span className="truncate max-w-[140px]">{p.location}</span>
                    </div>
                    {p.distanceKm != null && (
                      <span className="text-xs text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-full">
                        {formatDistance(p.distanceKm)}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.tags.slice(0, 3).map((tag: string) => (
                      <span key={tag} className="text-xs px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100 group-hover:bg-amber-100 transition">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{p.experience ? `${p.experience} yrs exp` : 'Contact for pricing'}</span>
                    <span className="text-amber-700 font-semibold group-hover:translate-x-0.5 transition-transform">View profile →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* ── Join CTA ── */}
      <section className="bg-white border-t border-amber-100 mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-xl mx-auto">
            <p className="text-xs uppercase tracking-[0.3em] text-amber-700 mb-2">Join Us</p>
            <h3 className="text-3xl font-light text-gray-900 mb-4">Are you a photographer?</h3>
            <p className="text-gray-600 mb-6">Create your profile, set your packages, and get discovered by clients across Sri Lanka.</p>
            <Link href="/admin/register" className="inline-block px-6 py-3 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition shadow-md">
              Add your profile
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}