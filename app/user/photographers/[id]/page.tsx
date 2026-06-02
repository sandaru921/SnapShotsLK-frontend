"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/app/components/navbar";
import { BookingCalendar } from "@/app/components/booking-calendar";
import { useAuth } from "@/contexts/AuthContext";
import {
  MapPin, Star, Clock, ChevronLeft, CheckCircle2, X,
  Instagram, Globe, Facebook, AlertCircle
} from "lucide-react";

const API = "http://localhost:5090";

export default function PhotographerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { user, token, isAuthenticated } = useAuth();

  const [photographer, setPhotographer] = useState<any>(null);
  const [bookedSlots, setBookedSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Booking modal state
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string } | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [bookingNote, setBookingNote] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Load photographer profile
  useEffect(() => {
    fetch(`${API}/api/Profile/public/${id}`)
      .then(r => { if (!r.ok) throw new Error("Not found"); return r.json(); })
      .then(data => setPhotographer({
        ...data,
        tags: data.specialty?.length ? data.specialty : ["Photographer"],
        packages: data.packages ?? [],
      }))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  // Load real booked/blocked slots
  useEffect(() => {
    fetch(`${API}/api/booking/slots/${id}`)
      .then(r => r.json())
      .then(setBookedSlots)
      .catch(() => setBookedSlots([]));
  }, [id]);

  const handleSlotSelect = (date: string, time: string) => {
    setSelectedSlot({ date, time });
  };

  const handleBookNow = (pkg?: any) => {
    if (!isAuthenticated) { router.push("/user/login"); return; }
    if (pkg) setSelectedPackage(pkg);
    setShowModal(true);
    setBookingStatus("idle");
    setErrorMsg("");
  };

  const handleConfirm = async () => {
    if (!selectedSlot) { setErrorMsg("Please select a date and time first."); return; }
    setSubmitting(true);
    setErrorMsg("");
    try {
      const cleanToken = (token ?? "").replace(/"/g, "");
      const res = await fetch(`${API}/api/booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${cleanToken}` },
        body: JSON.stringify({
          professionalId: parseInt(id),
          bookingDate: selectedSlot.date,
          timeSlot: selectedSlot.time,
          packageName: selectedPackage?.name ?? null,
          packagePrice: selectedPackage?.price ?? null,
          notes: bookingNote || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Booking failed");
      setBookingStatus("success");
      // Refresh slots
      fetch(`${API}/api/booking/slots/${id}`).then(r => r.json()).then(setBookedSlots);
    } catch (e: any) {
      setErrorMsg(e.message);
      setBookingStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Loading ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar currentPath="/user/photographers" />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-4 border-amber-100" />
            <div className="absolute inset-0 rounded-full border-4 border-amber-700 border-t-transparent animate-spin" />
          </div>
          <p className="text-sm text-gray-400">Loading profile…</p>
        </div>
      </div>
    );
  }

  if (!photographer) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar currentPath="/user/photographers" />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="text-6xl mb-4">📷</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile not found</h1>
          <Link href="/user/photographers" className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-medium transition">
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
        <nav className="flex items-center gap-1.5 text-sm text-gray-400">
          <Link href="/" className="hover:text-amber-700 transition">Home</Link>
          <span>/</span>
          <Link href="/user/photographers" className="hover:text-amber-700 transition">Photographers</Link>
          <span>/</span>
          <span className="text-gray-700 font-medium truncate">{photographer.name}</span>
        </nav>
      </div>

      {/* ── Profile Hero ───────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {photographer.coverImage && photographer.coverImage !== "/images/placeholder-cover.jpg" && (
            <div className="h-44 sm:h-56 w-full overflow-hidden">
              <img src={photographer.coverImage} alt="Cover" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="p-6 sm:p-8 md:flex md:gap-8">
            <div className={`flex-shrink-0 mb-5 md:mb-0 ${photographer.coverImage ? "-mt-16" : ""}`}>
              <img
                src={photographer.avatar}
                alt={photographer.name}
                className="h-28 w-28 sm:h-36 sm:w-36 rounded-2xl object-cover border-4 border-white shadow-xl mx-auto md:mx-0"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{photographer.name}</h1>
                <span className="flex items-center gap-1 bg-green-50 text-green-700 text-xs px-2.5 py-1 rounded-full font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </span>
              </div>
              <p className="text-gray-500 mb-3 text-sm">{photographer.bio}</p>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-sm mb-4">
                {photographer.rating > 0 && (
                  <span className="flex items-center gap-1 text-amber-600 font-medium">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    {photographer.rating.toFixed(1)}
                    <span className="text-gray-400 font-normal">({photographer.reviewCount} reviews)</span>
                  </span>
                )}
                {photographer.location && <span className="flex items-center gap-1 text-gray-500"><MapPin className="w-4 h-4" />{photographer.location}</span>}
                {photographer.experience && <span className="flex items-center gap-1 text-gray-500"><Clock className="w-4 h-4" />{photographer.experience} yrs exp</span>}
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-5">
                {photographer.tags?.map((tag: string) => (
                  <span key={tag} className="text-xs px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100 font-medium">{tag}</span>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
                {photographer.packages?.length > 0 ? (
                  <button onClick={() => handleBookNow()} className="px-7 py-3 rounded-xl bg-amber-700 text-white font-semibold hover:bg-amber-800 active:scale-95 transition-all shadow-md">
                    Book Now
                  </button>
                ) : (
                  <button onClick={() => handleBookNow()} className="px-7 py-3 rounded-xl bg-amber-700 text-white font-semibold hover:bg-amber-800 active:scale-95 transition-all shadow-md">
                    Request Booking
                  </button>
                )}
                {!isAuthenticated && <p className="text-xs text-gray-400">Sign in required to book</p>}
              </div>
              <div className="flex justify-center md:justify-start gap-3 mt-4">
                {photographer.socialMedia?.instagram && (
                  <a href={photographer.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-pink-50 text-pink-600 hover:bg-pink-100 transition"><Instagram className="w-4 h-4" /></a>
                )}
                {photographer.socialMedia?.facebook && (
                  <a href={photographer.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"><Facebook className="w-4 h-4" /></a>
                )}
                {photographer.socialMedia?.website && (
                  <a href={photographer.socialMedia.website} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition"><Globe className="w-4 h-4" /></a>
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
            {photographer.packages.filter((p: any) => p.name).map((pkg: any, i: number) => (
              <button
                key={i}
                onClick={() => handleBookNow(pkg)}
                className={`text-left p-5 rounded-2xl border-2 transition-all hover:shadow-lg active:scale-[0.98] group ${selectedPackage?.name === pkg.name ? "border-amber-600 bg-amber-50 shadow-md" : "border-gray-200 bg-white hover:border-amber-300"}`}
              >
                {pkg.isPopular && <span className="inline-block mb-2 text-xs px-2.5 py-0.5 bg-amber-600 text-white rounded-full font-semibold">⭐ Most Popular</span>}
                <p className="text-base font-bold text-gray-900 mb-0.5">{pkg.name}</p>
                <p className="text-amber-700 font-bold text-xl mb-1">{pkg.price ? `LKR ${pkg.price}` : "Contact"}</p>
                <p className="text-xs text-gray-500 mb-3">{pkg.duration}</p>
                <ul className="space-y-1 mb-4">
                  {pkg.features?.slice(0, 4).map((f: string, fi: number) => (
                    <li key={fi} className="flex items-start gap-1.5 text-xs text-gray-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />{f}
                    </li>
                  ))}
                </ul>
                <span className="text-xs font-semibold text-amber-700 group-hover:underline">Book this package →</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ── About + Calendar ─────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {photographer.about && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3">About</h2>
                <p className="text-gray-600 leading-relaxed text-sm">{photographer.about}</p>
              </div>
            )}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Contact & Info</h2>
              <ul className="space-y-2.5 text-sm">
                {photographer.contact?.email && <li className="flex items-center gap-2 text-gray-600"><span className="text-gray-400 w-5">✉️</span>{photographer.contact.email}</li>}
                {photographer.contact?.phone && <li className="flex items-center gap-2 text-gray-600"><span className="text-gray-400 w-5">📞</span>{photographer.contact.phone}</li>}
                {photographer.responseTime && <li className="flex items-center gap-2 text-gray-600"><Clock className="w-4 h-4 text-gray-400" />Responds in {photographer.responseTime}</li>}
                {photographer.availability && <li className="flex items-center gap-2 text-gray-600"><span className="text-gray-400 w-5">📅</span>{photographer.availability}</li>}
                {photographer.languages?.length > 0 && <li className="flex items-center gap-2 text-gray-600"><span className="text-gray-400 w-5">🌐</span>{photographer.languages.join(", ")}</li>}
              </ul>
            </div>
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Availability Calendar</h2>
              {selectedSlot && (
                <span className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-medium">
                  ✅ {selectedSlot.date} · {selectedSlot.time}
                </span>
              )}
            </div>
            <BookingCalendar bookedSlots={bookedSlots} onSlotSelect={handleSlotSelect} />
            {selectedSlot && (
              <button
                onClick={() => handleBookNow()}
                className="mt-3 w-full py-3 bg-amber-700 hover:bg-amber-800 text-white font-semibold rounded-xl transition shadow-md"
              >
                Book {selectedSlot.date} at {selectedSlot.time}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Portfolio ─────────────────────────────────────────────── */}
      {photographer.portfolio?.filter((u: string) => u).length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Portfolio</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {photographer.portfolio.filter((img: string) => img).map((img: string, i: number) => (
              <div key={i} className="relative group rounded-xl overflow-hidden aspect-square bg-gray-100">
                <img src={img} alt={`Portfolio ${i + 1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Booking Modal ─────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
            {bookingStatus === "success" ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Request Sent! 🎉</h3>
                <p className="text-gray-500 text-sm mb-1">Your request has been sent to <strong>{photographer.name}</strong>.</p>
                <p className="text-gray-400 text-xs mb-6">They'll confirm or suggest an alternative time shortly.</p>
                <div className="flex gap-3">
                  <button onClick={() => { setShowModal(false); setBookingStatus("idle"); }} className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium text-sm transition">Close</button>
                  <Link href="/user/bookings" className="flex-1 py-3 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-semibold text-sm transition text-center">View My Bookings</Link>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <h3 className="text-base font-bold text-gray-900">Confirm Your Booking</h3>
                  <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 transition"><X className="w-5 h-5 text-gray-400" /></button>
                </div>

                <div className="px-5 py-4 space-y-4">
                  {/* Summary card */}
                  <div className="bg-amber-50 rounded-xl p-4 space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">With</span><span className="font-semibold text-gray-900">{photographer.name}</span></div>
                    {selectedPackage && <>
                      <div className="flex justify-between"><span className="text-gray-500">Package</span><span className="font-semibold text-gray-900">{selectedPackage.name}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Price</span><span className="font-bold text-amber-700">LKR {selectedPackage.price}</span></div>
                    </>}
                    {selectedSlot ? (
                      <div className="flex justify-between"><span className="text-gray-500">Date & Time</span><span className="font-semibold text-gray-900">{selectedSlot.date} · {selectedSlot.time}</span></div>
                    ) : (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 text-yellow-700 text-xs flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" /> No time slot selected — please pick one from the calendar first.
                      </div>
                    )}
                  </div>

                  {/* Package selector if none chosen */}
                  {!selectedPackage && photographer.packages?.filter((p: any) => p.name).length > 0 && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Choose a Package (optional)</label>
                      <div className="space-y-2">
                        {photographer.packages.filter((p: any) => p.name).map((pkg: any, i: number) => (
                          <button key={i} onClick={() => setSelectedPackage(pkg)}
                            className="w-full text-left flex items-center justify-between px-4 py-2.5 border border-gray-200 rounded-xl hover:border-amber-400 transition text-sm">
                            <span className="font-medium">{pkg.name}</span>
                            <span className="text-amber-700 font-bold">LKR {pkg.price}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Notes for the photographer</label>
                    <textarea rows={3} value={bookingNote} onChange={e => setBookingNote(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-200 outline-none resize-none"
                      placeholder="Tell them about your event, venue, any special requests…" />
                  </div>

                  {bookingStatus === "error" && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2 text-sm text-red-700">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />{errorMsg}
                    </div>
                  )}
                </div>

                <div className="px-5 pb-5 flex gap-3">
                  <button onClick={() => setShowModal(false)} className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium text-sm transition">Cancel</button>
                  <button
                    onClick={handleConfirm}
                    disabled={submitting || !selectedSlot}
                    className="flex-1 py-3 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-semibold text-sm transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending…
                      </span>
                    ) : "Send Booking Request"}
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