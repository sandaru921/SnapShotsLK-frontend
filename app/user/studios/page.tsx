"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Navbar } from '@/app/components/navbar';
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

const studios = [
  {
    name: "Luminous Studio Colombo",
    location: "Colombo 03",
    district: "Colombo",
    description: "Premium studio with natural light",
    rating: 4.9,
    reviews: 142,
    price: "From LKR 5,000/hr",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
    features: ["Natural Light", "Cyclorama", "Props"],
    size: "1,200 sq ft",
    popular: true,
  },
  {
    name: "Flash Point Studios",
    location: "Nugegoda",
    district: "Colombo",
    description: "Multi-purpose photography studio",
    rating: 4.8,
    reviews: 98,
    price: "From LKR 4,500/hr",
    image:
      "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?auto=format&fit=crop&w=800&q=80",
    features: ["Strobe Lights", "Green Screen", "Editing Suite"],
    size: "900 sq ft",
    popular: true,
  },
  {
    name: "Aperture Creative Space",
    location: "Kandy",
    district: "Kandy",
    description: "Boutique studio in the hills",
    rating: 4.7,
    reviews: 76,
    price: "From LKR 3,800/hr",
    image:
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=800&q=80",
    features: ["Mountain View", "Outdoor Area", "Vintage Props"],
    size: "800 sq ft",
    popular: false,
  },
  {
    name: "Shutter Lane Studio",
    location: "Galle",
    district: "Galle",
    description: "Coastal photography paradise",
    rating: 4.9,
    reviews: 134,
    price: "From LKR 4,200/hr",
    image:
      "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=800&q=80",
    features: ["Beach Access", "Sunset Views", "Outdoor Setup"],
    size: "1,000 sq ft",
    popular: true,
  },
  {
    name: "Pixel Perfect Studios",
    location: "Mount Lavinia",
    district: "Colombo",
    description: "Modern studio with beach vibes",
    rating: 4.6,
    reviews: 89,
    price: "From LKR 3,500/hr",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
    features: ["LED Lighting", "Makeup Room", "Parking"],
    size: "750 sq ft",
    popular: false,
  },
  {
    name: "Frame Works Studio",
    location: "Negombo",
    district: "Gampaha",
    description: "Spacious studio near the airport",
    rating: 4.8,
    reviews: 112,
    price: "From LKR 4,800/hr",
    image:
      "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?auto=format&fit=crop&w=800&q=80",
    features: ["Large Space", "Equipment Rental", "Changing Rooms"],
    size: "1,500 sq ft",
    popular: false,
  },
];

export default function StudiosPage() {
  const [current, setCurrent] = useState(0);
  const [showLocationFinder, setShowLocationFinder] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [isLocating, setIsLocating] = useState(false);
  const total = slides.length;

  const goNext = () => setCurrent((c) => (c + 1) % total);
  const goPrev = () => setCurrent((c) => (c - 1 + total) % total);

  useEffect(() => {
    const id = setInterval(goNext, 4500);
    return () => clearInterval(id);
  }, []);

  const activeSlide = useMemo(() => slides[current], [current]);

  const districts = [
    "All",
    ...Array.from(new Set(studios.map((s) => s.district))),
  ];

  const filteredStudios =
    selectedDistrict === "All"
      ? studios
      : studios.filter((s) => s.district === selectedDistrict);

  const findNearbyStudios = () => {
    setIsLocating(true);
    // Simulate geolocation
    setTimeout(() => {
      setIsLocating(false);
      setSelectedDistrict("Colombo"); // Default to Colombo for demo
      setShowLocationFinder(false);
      // Scroll to results
      document
        .getElementById("studios-grid")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 1500);
  };

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
            <p className="text-xs uppercase tracking-[0.3em] text-amber-700 mb-2">
              Discover
            </p>
            <h2 className="text-3xl font-light tracking-wide text-gray-900">
              Photography Studios
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="text-sm text-gray-700 border border-amber-200 px-4 py-2 rounded-full hover:border-amber-500 transition focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <button className="text-sm text-amber-700 border border-amber-200 px-4 py-2 rounded-full hover:border-amber-500 hover:text-amber-800 transition">
              View map
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredStudios.map((studio) => (
            <article
              key={studio.name}
              className="bg-white border border-gray-200 hover:border-amber-500 shadow-sm hover:shadow-md transition group overflow-hidden relative"
            >
              {studio.popular && (
                <div className="absolute top-4 left-4 bg-amber-500 text-white text-xs px-3 py-1 rounded-full font-semibold z-10">
                  Popular
                </div>
              )}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={studio.image}
                  alt={studio.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700">
                  {studio.size}
                </div>
              </div>
              <div className="p-5">
                <div className="mb-3">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    {studio.name}
                  </h3>
                  <p className="text-sm text-amber-700 flex items-center gap-1">
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {studio.location}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {studio.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-amber-700 font-medium mb-3">
                  <span>★ {studio.rating.toFixed(1)}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">
                    {studio.reviews} reviews
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {studio.features.map((feature) => (
                      <span
                        key={feature}
                        className="text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="font-semibold text-amber-700">
                    {studio.price}
                  </span>
                  <button className="text-amber-700 hover:text-amber-800 text-sm font-medium">
                    Book now →
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredStudios.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No studios found in this district.</p>
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

      {/* Floating location button */}
      <button
        onClick={() => setShowLocationFinder(true)}
        className="fixed bottom-6 right-6 h-14 px-6 bg-amber-600 text-white rounded-full shadow-lg hover:bg-amber-700 hover:shadow-xl transition flex items-center gap-2 font-semibold z-40 group"
        aria-label="Find nearby studios"
      >
        <svg
          className="h-5 w-5 group-hover:scale-110 transition"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
            clipRule="evenodd"
          />
        </svg>
        <span>Find Nearby</span>
      </button>

      {/* Location finder modal */}
      {showLocationFinder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-[scale-in_0.2s_ease-out]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-medium text-gray-900">
                Find Studios Near You
              </h3>
              <button
                onClick={() => setShowLocationFinder(false)}
                className="h-8 w-8 rounded-full hover:bg-gray-100 transition flex items-center justify-center text-gray-500"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              We'll use your location to show studios closest to you.
            </p>
            <div className="space-y-3">
              <button
                onClick={findNearbyStudios}
                disabled={isLocating}
                className="w-full px-5 py-3 rounded-full bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLocating ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Locating...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Use My Location</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setShowLocationFinder(false)}
                className="w-full px-5 py-3 rounded-full border border-gray-200 text-gray-700 text-sm hover:border-amber-500 hover:text-amber-700 transition"
              >
                Browse all districts
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">
              Your location data is used only to show nearby studios and is not
              stored.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
