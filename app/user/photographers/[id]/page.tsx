"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/app/components/navbar";
import { BookingCalendar } from "@/app/components/booking-calendar";
import { MapPin, Star, Clock, ChevronLeft, CheckCircle2, X, ExternalLink, Instagram, Globe } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function PhotographerProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const { user, isAuthenticated } = useAuth();

  const [photographer, setPhotographer] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string } | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [bookingNote, setBookingNote] = useState('');
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'success'>('idle');

  React.useEffect(() => {
    fetch(`http://localhost:5090/api/Profile/public/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(data => setPhotographer({
        ...data,
        tags: data.specialty?.length ? data.specialty : ['Photographer'],
        price: data.packages?.length ? data.packages[0].price : 'Contact for pricing',
        verified: true,
        bookedSlots: []
      }))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleSlotSelect = (date: string, time: string) => {
    setSelectedSlot({ date, time });
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      window.location.href = '/user/login';
      return;
    }
    setShowBookingModal(true);
  };

  const handleConfirmBooking = () => {
    // TODO: wire to POST /api/booking
    setBookingStatus('success');
  };

  // ─── Loading ─────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar currentPath="/user/photographers" />
        <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center gap-4">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border-4 border-amber-100" />
            <div className="absolute inset-0 rounded-full border-4 border-amber-700 border-t-transparent animate-spin" />
          </div>
          <p className="text-sm text-gray-500">Loading profile…</p>
        </div>
      </div>
    );
  }

  // ─── Not found ───────────────────────────────────────────────────
  if (!photographer) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar currentPath="/user/photographers" />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="text-6xl mb-4">📷</div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Photographer not found</h1>
          <p className="text-gray-500 mb-6">This profile may have been removed or the link is incorrect.</p>
          <Link href="/user/photographers" className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-medium transition">
            <ChevronLeft className="w-4 h-4" /> Back to Photographers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPath="/user/photographers" />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-2">
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-amber-700 transition">Home</Link>
          <span>/</span>
          <Link href="/user/photographers" className="hover:text-amber-700 transition">Photographers</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate">{photographer.name}</span>
        </nav>
      </div>

      {/* ── Profile Hero ─────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Cover image */}
          {photographer.profile?.coverImageUrl && (
            <div className="h-40 sm:h-52 w-full overflow-hidden">
              <img src={photographer.profile.coverImageUrl} alt="Cover" className="w-full h-full object-cover" />
            </div>
          )}

          <div className="p-6 sm:p-8 md:flex md:gap-8">
            {/* Avatar */}
            <div className={`flex-shrink-0 mb-5 md:mb-0 ${photographer.profile?.coverImageUrl ? '-mt-16' : ''}`}>
              <img
                src={photographer.profile?.avatarUrl || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=200&q=80'}
                alt={photographer.name}
                className="h-28 w-28 sm:h-36 sm:w-36 rounded-2xl object-cover border-4 border-white shadow-lg mx-auto md:mx-0"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{photographer.name}</h1>
                {photographer.verified && (
                  <span className="flex items-center gap-1 bg-amber-100 text-amber-700 text-xs px-2.5 py-1 rounded-full font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </span>
                )}
              </div>
              <p className="text-gray-500 mb-3">{photographer.profile?.bio || 'Professional Photographer'}</p>

              <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-sm mb-4">
                {photographer.profile?.rating > 0 && (
                  <span className="flex items-center gap-1 text-amber-600 font-medium">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    {photographer.profile.rating.toFixed(1)}
                    <span className="text-gray-400 font-normal">({photographer.profile?.reviewCount || 0} reviews)</span>
                  </span>
                )}
                {photographer.location && (
                  <span className="flex items-center gap-1 text-gray-500">
                    <MapPin className="w-4 h-4" />{photographer.location}
                  </span>
                )}
                {photographer.profile?.experience && (
                  <span className="flex items-center gap-1 text-gray-500">
                    <Clock className="w-4 h-4" />{photographer.profile.experience}
                  </span>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-5">
                {photographer.tags?.map((tag: string) => (
                  <span key={tag} className="text-xs px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100 font-medium">{tag}</span>
                ))}
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5 text-center md:text-left">Starting from</p>
                  <p className="text-xl font-bold text-amber-700">{photographer.price}</p>
                </div>
                <button
                  onClick={handleBookNow}
                  className="px-7 py-3 rounded-xl bg-amber-700 text-white font-semibold hover:bg-amber-800 active:scale-95 transition-all shadow-md hover:shadow-lg"
                >
                  Book Now
                </button>
                {!isAuthenticated && (
                  <p className="text-xs text-gray-400">Sign in to book</p>
                )}
              </div>

              {/* Social links */}
              <div className="flex justify-center md:justify-start gap-3 mt-4">
                {photographer.profile?.instagramUrl && (
                  <a href={photographer.profile.instagramUrl} target="_blank" rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-pink-50 text-pink-600 hover:bg-pink-100 transition" title="Instagram">
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {photographer.profile?.websiteUrl && (
                  <a href={photographer.profile.websiteUrl} target="_blank" rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition" title="Website">
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Packages ─────────────────────────────────────────────── */}
      {photographer.packages?.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Service Packages</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {photographer.packages.map((pkg: any, i: number) => (
              <button
                key={i}
                onClick={() => { setSelectedPackage(pkg); setShowBookingModal(true); }}
                className={`text-left p-5 rounded-2xl border-2 transition-all hover:shadow-md active:scale-[0.98] ${selectedPackage?.name === pkg.name ? 'border-amber-600 bg-amber-50' : 'border-gray-200 bg-white hover:border-amber-300'}`}
              >
                {pkg.isPopular && (
                  <span className="inline-block mb-2 text-xs px-2.5 py-0.5 bg-amber-600 text-white rounded-full font-semibold">Most Popular</span>
                )}
                <p className="text-lg font-bold text-gray-900 mb-1">{pkg.name}</p>
                <p className="text-amber-700 font-semibold text-xl mb-2">{pkg.price}</p>
                <p className="text-xs text-gray-500 mb-3">{pkg.duration}</p>
                <ul className="space-y-1">
                  {pkg.features?.slice(0, 4).map((f: string, fi: number) => (
                    <li key={fi} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />{f}
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ── About + Calendar ─────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
          <div className="space-y-4">
            {photographer.profile?.about && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3">About</h2>
                <p className="text-gray-600 leading-relaxed text-sm">{photographer.profile.about}</p>
              </div>
            )}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Contact</h2>
              <ul className="space-y-3 text-sm text-gray-600">
                {photographer.email && <li className="flex items-center gap-2"><span className="text-gray-400">✉️</span>{photographer.email}</li>}
                {photographer.profile?.responseTime && <li className="flex items-center gap-2"><Clock className="w-4 h-4 text-gray-400" />Responds in {photographer.profile.responseTime}</li>}
                {photographer.profile?.availability && <li className="flex items-center gap-2"><span className="text-gray-400">📅</span>{photographer.profile.availability}</li>}
              </ul>
            </div>
          </div>

          {/* Calendar */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Pick a Date & Time</h2>
              {selectedSlot && (
                <span className="text-xs bg-amber-50 text-amber-700 px-3 py-1 rounded-full font-medium">
                  {selectedSlot.date} at {selectedSlot.time}
                </span>
              )}
            </div>
            <BookingCalendar bookedSlots={photographer.bookedSlots || []} onSlotSelect={handleSlotSelect} />
            {selectedSlot && (
              <button
                onClick={handleBookNow}
                className="mt-4 w-full py-3 bg-amber-700 hover:bg-amber-800 text-white font-semibold rounded-xl transition shadow-md"
              >
                Book {selectedSlot.date} at {selectedSlot.time}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Portfolio ─────────────────────────────────────────────── */}
      {photographer.profile?.portfolioUrls?.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Portfolio</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {photographer.profile.portfolioUrls.map((image: string, index: number) => (
              <div key={index} className="relative group rounded-xl overflow-hidden aspect-square bg-gray-100">
                <img src={image} alt={`Portfolio ${index + 1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <ExternalLink className="w-6 h-6 text-white" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Booking Modal ─────────────────────────────────────────── */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
            {bookingStatus === 'success' ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Sent! 🎉</h3>
                <p className="text-gray-500 text-sm mb-6">Your request has been sent to <strong>{photographer.name}</strong>. They will confirm shortly.</p>
                <button
                  onClick={() => { setShowBookingModal(false); setBookingStatus('idle'); }}
                  className="w-full py-3 bg-amber-700 hover:bg-amber-800 text-white font-semibold rounded-xl transition"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900">Confirm Booking</h3>
                  <button onClick={() => setShowBookingModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 transition">
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="px-6 py-5 space-y-4">
                  {/* Summary */}
                  <div className="bg-amber-50 rounded-xl p-4 text-sm space-y-2">
                    <div className="flex justify-between"><span className="text-gray-500">Photographer</span><span className="font-semibold text-gray-900">{photographer.name}</span></div>
                    {selectedPackage && <div className="flex justify-between"><span className="text-gray-500">Package</span><span className="font-semibold text-gray-900">{selectedPackage.name}</span></div>}
                    {selectedPackage && <div className="flex justify-between"><span className="text-gray-500">Price</span><span className="font-semibold text-amber-700">{selectedPackage.price}</span></div>}
                    {selectedSlot && <div className="flex justify-between"><span className="text-gray-500">Date & Time</span><span className="font-semibold text-gray-900">{selectedSlot.date} at {selectedSlot.time}</span></div>}
                  </div>

                  {/* Package picker (if not already selected) */}
                  {!selectedPackage && photographer.packages?.length > 0 && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Select a Package</label>
                      <div className="space-y-2">
                        {photographer.packages.map((pkg: any, i: number) => (
                          <button key={i} onClick={() => setSelectedPackage(pkg)}
                            className="w-full text-left flex items-center justify-between px-4 py-3 border border-gray-200 rounded-xl hover:border-amber-400 transition text-sm">
                            <span className="font-medium">{pkg.name}</span>
                            <span className="text-amber-700 font-semibold">{pkg.price}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Notes (optional)</label>
                    <textarea
                      rows={3}
                      value={bookingNote}
                      onChange={e => setBookingNote(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-200 outline-none resize-none"
                      placeholder="Tell them about your event, date preferences, or anything else…"
                    />
                  </div>
                </div>

                <div className="px-6 pb-5 flex gap-3">
                  <button onClick={() => setShowBookingModal(false)}
                    className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium text-sm transition">
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmBooking}
                    disabled={!selectedSlot && !selectedPackage}
                    className="flex-1 py-3 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-semibold text-sm transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send Booking Request
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}