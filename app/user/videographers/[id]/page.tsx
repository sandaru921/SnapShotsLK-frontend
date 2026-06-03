"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/app/components/navbar";
import { BookingCalendar } from "@/app/components/booking-calendar";
import { ChatWidget } from "@/app/components/ChatWidget";

export default function VideographerProfilePage() {
  const params = useParams();
  const id = params.id as string;

  const [videographer, setVideographer] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch(`http://localhost:5090/api/Profile/public/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(data => setVideographer({
        ...data,
        tags: data.specialty?.length ? data.specialty : ['Videographer'],
        price: data.packages?.length ? data.packages[0].price : 'Contact for pricing',
        verified: true,
        bookedSlots: []
      }))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleSlotSelect = (date: string, time: string) => {
    console.log(`Selected slot: ${date} at ${time}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading Profile...</p>
      </div>
    );
  }

  if (!videographer) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar currentPath="/user/videographers" />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Videographer not found</h1>
          <Link href="/user/videographers" className="text-amber-700 hover:text-amber-800">
            ← Back to videographers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPath="/user/videographers" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link href="/user/videographers" className="inline-flex items-center text-amber-700 hover:text-amber-800 transition-colors">
          ← Back to videographers
        </Link>
      </div>

      {/* Profile Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 md:flex md:gap-8">
            <div className="flex-shrink-0 mb-6 md:mb-0">
              <img
                src={videographer.avatar}
                alt={videographer.name}
                className="h-32 w-32 sm:h-40 sm:w-40 rounded-full object-cover border-4 border-amber-100 mx-auto md:mx-0"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">{videographer.name}</h1>
                {videographer.verified && (
                  <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full">✓ Verified</span>
                )}
              </div>
              <p className="text-gray-600 mb-3">{videographer.bio}</p>
              <div className="flex items-center justify-center md:justify-start gap-4 text-sm mb-4 flex-wrap">
                <span className="text-amber-600 font-medium">★ {videographer.rating} ({videographer.reviewCount} reviews)</span>
                <span className="text-gray-500">📍 {videographer.location}</span>
                <span className="text-gray-500">{videographer.experience}</span>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
                {videographer.tags?.map((tag: string) => (
                  <span key={tag} className="text-xs px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">{tag}</span>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <span className="text-xl font-semibold text-amber-700">{videographer.price}</span>
                <button className="px-6 py-3 rounded-full bg-amber-600 text-white font-semibold hover:bg-amber-700 transition">Book Now</button>
                <button className="px-6 py-3 rounded-full border border-amber-200 text-amber-800 hover:border-amber-500 transition">Send Message</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About, Contact & Calendar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>
              <p className="text-gray-700 leading-relaxed">{videographer.about}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Info</h2>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3"><span className="text-gray-500">📞</span><span className="text-gray-700">{videographer.contact?.phone}</span></li>
                <li className="flex items-center gap-3"><span className="text-gray-500">✉️</span><span className="text-gray-700">{videographer.contact?.email}</span></li>
                <li className="flex items-center gap-3"><span className="text-gray-500">⏱️</span><span className="text-gray-700">Response: {videographer.responseTime}</span></li>
              </ul>
            </div>
          </div>
          <div>
            <BookingCalendar bookedSlots={videographer.bookedSlots || []} onSlotSelect={handleSlotSelect} />
          </div>
        </div>
      </section>

      {/* Portfolio */}
      {videographer.portfolio && videographer.portfolio.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Portfolio</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {videographer.portfolio.map((image: string, index: number) => (
                <img key={index} src={image} alt={`Portfolio ${index + 1}`} className="w-full h-48 sm:h-56 object-cover rounded-lg hover:opacity-90 transition cursor-pointer" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Real-time Chat Widget */}
      {videographer && (
        <ChatWidget 
          receiverId={Number(videographer.id)} 
          receiverName={videographer.name} 
          receiverAvatar={videographer.avatar} 
        />
      )}
    </div>
  );
}
