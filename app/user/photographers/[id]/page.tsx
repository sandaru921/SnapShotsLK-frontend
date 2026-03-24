"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/app/components/navbar";
import { BookingCalendar } from "@/app/components/booking-calendar";

// Same data as photographers page (in real app, fetch from API)
export default function PhotographerProfilePage() {
  const params = useParams();
  const id = params.id as string;

  const [photographer, setPhotographer] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch(`http://localhost:5090/api/Profile/public/${id}`)
      .then(res => {
         if(!res.ok) throw new Error("Not found");
         return res.json();
      })
      .then(data => setPhotographer({
         ...data,
         tags: data.specialty?.length ? data.specialty : ['Photographer'],
         price: data.packages?.length ? data.packages[0].price : 'Contact for pricing',
         verified: true,
         bookedSlots: [] // Can be hooked to a booking API later
      }))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  // Handle slot selection
  const handleSlotSelect = (date: string, time: string) => {
    console.log(`Selected slot: ${date} at ${time}`);
    // In real app, you would handle booking here
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
         <p>Loading Profile...</p>
      </div>
    );
  }

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