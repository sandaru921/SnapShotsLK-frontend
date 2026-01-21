"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/app/components/navbar";
import { BookingCalendar } from "@/app/components/booking-calendar";

// Same data as photographers page (in real app, fetch from API)
const photographers = [
  {
    id: "1",
    name: "Ishara Perera",
    bio: "Wedding & lifestyle photographer",
    rating: 4.9,
    reviews: 132,
    price: "From LKR 25,000",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
    tags: ["Weddings", "Couples", "Events"],
    location: "Colombo",
    experience: "8+ years",
    responseTime: "Within 2 hours",
    verified: true,
    phone: "+94 71 234 5678",
    email: "ishara@example.com",
    website: "https://isharaperera.com",
    about:
      "Specialized in capturing beautiful moments at weddings and lifestyle events across Sri Lanka. I believe in candid photography that tells your unique story.",
    portfolio: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1502184612684-c7d213ca657b?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=600&q=80",
    ],
    bookedSlots: [
      { date: "2026-01-25", time: "10:00" },
      { date: "2026-01-25", time: "11:00" },
      { date: "2026-01-25", time: "14:00" },
      { date: "2026-01-28", time: "09:00" },
      { date: "2026-01-28", time: "10:00" },
      { date: "2026-01-28", time: "11:00" },
      { date: "2026-01-28", time: "12:00" },
      { date: "2026-01-28", time: "13:00" },
      { date: "2026-01-28", time: "14:00" },
      { date: "2026-01-28", time: "15:00" },
      { date: "2026-01-28", time: "16:00" },
      { date: "2026-01-28", time: "17:00" },
      { date: "2026-02-01", time: "09:00" },
      { date: "2026-02-01", time: "10:00" },
      { date: "2026-02-05", time: "15:00" },
      { date: "2026-02-05", time: "16:00" },
    ],
  },
  {
    id: "2",
    name: "Nadine Fernando",
    bio: "Portraits and editorial stories",
    rating: 4.8,
    reviews: 98,
    price: "From LKR 18,500",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    tags: ["Portraits", "Fashion", "Brand"],
    location: "Kandy",
    experience: "6+ years",
    responseTime: "Within 4 hours",
    verified: true,
    phone: "+94 77 123 4567",
    email: "nadine@example.com",
    website: "https://nadinefernando.com",
    about:
      "Creative portrait photographer focusing on capturing the essence of my subjects. I specialize in personal branding and editorial work.",
    portfolio: [
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
    ],
    bookedSlots: [
      { date: "2026-01-23", time: "09:00" },
      { date: "2026-01-23", time: "10:00" },
      { date: "2026-01-30", time: "14:00" },
    ],
  },
  {
    id: "3",
    name: "Kasun Jayasuriya",
    bio: "Candid event coverage",
    rating: 4.7,
    reviews: 154,
    price: "From LKR 22,000",
    avatar:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80",
    tags: ["Events", "Corporate", "Documentary"],
    location: "Galle",
    experience: "10+ years",
    responseTime: "Within 1 hour",
    verified: true,
    phone: "+94 76 987 6543",
    email: "kasun@example.com",
    website: "https://kasunjayasuriya.com",
    about:
      "Expert in capturing the energy and emotions of events. From corporate gatherings to celebrations, I document your moments authentically.",
    portfolio: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1502184612684-c7d213ca657b?auto=format&fit=crop&w=600&q=80",
    ],
    bookedSlots: [],
  },
  {
    id: "4",
    name: "Dilani Weerasinghe",
    bio: "Family and newborn sessions",
    rating: 4.9,
    reviews: 121,
    price: "From LKR 15,000",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
    tags: ["Family", "Newborn", "Lifestyle"],
    location: "Negombo",
    experience: "5+ years",
    responseTime: "Within 3 hours",
    verified: true,
    phone: "+94 77 456 7890",
    email: "dilani@example.com",
    website: "https://dilaniweerasinghe.com",
    about:
      "Specializing in tender moments with families and newborns. I create a comfortable, relaxed environment for beautiful, natural photographs.",
    portfolio: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1502184612684-c7d213ca657b?auto=format&fit=crop&w=600&q=80",
    ],
    bookedSlots: [
      { date: "2026-01-24", time: "09:00" },
      { date: "2026-01-24", time: "10:00" },
      { date: "2026-01-24", time: "11:00" },
    ],
  },
  {
    id: "5",
    name: "Ravindu Silva",
    bio: "Adventure & travel storyteller",
    rating: 4.8,
    reviews: 87,
    price: "From LKR 19,000",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    tags: ["Travel", "Outdoor", "Brand"],
    location: "Colombo",
    experience: "7+ years",
    responseTime: "Within 2 hours",
    verified: true,
    phone: "+94 75 123 4567",
    email: "ravindu@example.com",
    website: "https://ravindusilva.com",
    about:
      "Adventure photographer capturing the beauty of travel and outdoor experiences. I tell stories through landscapes and dynamic imagery.",
    portfolio: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1502184612684-c7d213ca657b?auto=format&fit=crop&w=600&q=80",
    ],
    bookedSlots: [],
  },
  {
    id: "6",
    name: "Amaya Wickramasinghe",
    bio: "Creative brand visuals",
    rating: 4.7,
    reviews: 76,
    price: "From LKR 20,000",
    avatar:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=400&q=80",
    tags: ["Product", "Brand", "Editorial"],
    location: "Colombo",
    experience: "6+ years",
    responseTime: "Within 4 hours",
    verified: true,
    phone: "+94 70 789 0123",
    email: "amaya@example.com",
    website: "https://amayawickramasinghe.com",
    about:
      "Product and brand photographer helping businesses showcase their products beautifully. Creative solutions for visual storytelling.",
    portfolio: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1502184612684-c7d213ca657b?auto=format&fit=crop&w=600&q=80",
    ],
    bookedSlots: [
      { date: "2026-01-27", time: "13:00" },
      { date: "2026-01-27", time: "14:00" },
    ],
  },
];

export default function PhotographerProfilePage() {
  const params = useParams();
  const id = params.id as string;

  // Find the photographer by ID
  const photographer = photographers.find((p) => p.id === id);

  // Handle slot selection
  const handleSlotSelect = (date: string, time: string) => {
    console.log(`Selected slot: ${date} at ${time}`);
    // In real app, you would handle booking here
  };

  // Show error if not found
  if (!photographer) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar currentPath="/user/photographers" />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Photographer not found
          </h1>
          <Link
            href="/user/photographers"
            className="text-amber-700 hover:text-amber-800"
          >
            ← Back to photographers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPath="/user/photographers" />

      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link
          href="/user/photographers"
          className="inline-flex items-center text-amber-700 hover:text-amber-800 transition-colors"
        >
          ← Back to photographers
        </Link>
      </div>

      {/* Profile Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 md:flex md:gap-8">
            {/* Avatar */}
            <div className="flex-shrink-0 mb-6 md:mb-0">
              <img
                src={photographer.avatar}
                alt={photographer.name}
                className="h-32 w-32 sm:h-40 sm:w-40 rounded-full object-cover border-4 border-amber-100 mx-auto md:mx-0"
              />
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                  {photographer.name}
                </h1>
                {photographer.verified && (
                  <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full">
                    ✓ Verified
                  </span>
                )}
              </div>
              <p className="text-gray-600 mb-3">{photographer.bio}</p>

              {/* Rating & Location */}
              <div className="flex items-center justify-center md:justify-start gap-4 text-sm mb-4 flex-wrap">
                <span className="text-amber-600 font-medium">
                  ★ {photographer.rating} ({photographer.reviews} reviews)
                </span>
                <span className="text-gray-500">📍 {photographer.location}</span>
                <span className="text-gray-500">{photographer.experience}</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
                {photographer.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Price & Contact */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <span className="text-xl font-semibold text-amber-700">
                  {photographer.price}
                </span>
                <button className="px-6 py-3 rounded-full bg-amber-600 text-white font-semibold hover:bg-amber-700 transition">
                  Book Now
                </button>
                <button className="px-6 py-3 rounded-full border border-amber-200 text-amber-800 hover:border-amber-500 transition">
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About, Contact & Calendar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
          {/* Left Column - About & Contact */}
          <div className="space-y-6">
            {/* About */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>
              <p className="text-gray-700 leading-relaxed">
                {photographer.about}
              </p>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Contact Info
              </h2>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <span className="text-gray-500">📞</span>
                  <span className="text-gray-700">{photographer.phone}</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-gray-500">✉️</span>
                  <span className="text-gray-700">{photographer.email}</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-gray-500">🌐</span>
                  <a
                    href={photographer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-700 hover:text-amber-800"
                  >
                    {photographer.website}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-gray-500">⏱️</span>
                  <span className="text-gray-700">
                    Response: {photographer.responseTime}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Calendar */}
          <div>
            <BookingCalendar
              bookedSlots={photographer.bookedSlots || []}
              onSlotSelect={handleSlotSelect}
            />
          </div>
        </div>
      </section>

      {/* Portfolio */}
      {photographer.portfolio && photographer.portfolio.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Portfolio
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {photographer.portfolio.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Portfolio ${index + 1}`}
                  className="w-full h-48 sm:h-56 object-cover rounded-lg hover:opacity-90 transition cursor-pointer"
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}