'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '../../components/navbar';
import { Footer } from '../../components/Footer';
import { 
  User, MapPin, Calendar, Heart, Settings, 
  LogOut, Star, Clock, ChevronRight, Camera 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// --- Mock Data (පෙන්වන්න දත්ත) ---
const bookings = [
  { id: 1, photographer: 'Studio Kandy', type: 'Wedding', date: '2026-02-15', status: 'Upcoming', price: 'LKR 85,000' },
  { id: 2, photographer: 'Amila Photography', type: 'Birthday', date: '2025-12-10', status: 'Completed', price: 'LKR 25,000' },
];

const favorites = [
  { id: 1, name: 'Lens Magic', category: 'Wedding', rating: 4.8, image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&q=80' },
  { id: 2, name: 'Urban Clicks', category: 'Fashion', rating: 4.5, image: 'https://images.unsplash.com/photo-1554048612-387768052bf7?w=400&q=80' },
  { id: 3, name: 'Nature Lens', category: 'Wildlife', rating: 5.0, image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&q=80' },
];

export default function ModernProfile() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');

  // --- Components ---

  // 1. Status Badge (තත්ත්වය පෙන්වන කොටස)
  const StatusBadge = ({ status }: { status: string }) => {
    const styles = status === 'Upcoming' 
      ? 'bg-amber-100 text-amber-900 border-amber-200' 
      : 'bg-green-100 text-green-900 border-green-200';
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]"> {/* Creamy Background */}
      <Navbar currentPath="/user/profile" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* --- LEFT SIDEBAR (Profile Summary) --- */}
          <aside className="w-full lg:w-80 shrink-0">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200 sticky top-24">
              
              {/* Avatar & Info */}
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <div className="w-full h-full rounded-full bg-amber-200 flex items-center justify-center text-amber-900 border-4 border-white shadow-md">
                    <span className="text-3xl font-bold">{user?.name?.charAt(0) || "U"}</span>
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-stone-900 rounded-full text-amber-400 hover:scale-110 transition shadow-lg">
                    <Camera size={14} />
                  </button>
                </div>
                
                <h2 className="text-xl font-bold text-stone-900">{user?.name || "User Name"}</h2>
                <p className="text-sm text-stone-500 font-medium mb-1">{user?.email}</p>
                <div className="flex items-center justify-center gap-1 text-sm text-amber-700 font-semibold bg-amber-50 py-1 px-3 rounded-full mx-auto w-fit mt-2">
                  <MapPin size={14} />
                  {user?.location || "Sri Lanka"}
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="mt-8 space-y-2">
                {[
                  { id: 'bookings', label: 'My Bookings', icon: Calendar },
                  { id: 'favorites', label: 'Saved Photographers', icon: Heart },
                  { id: 'settings', label: 'Settings', icon: Settings },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                      activeTab === item.id
                        ? 'bg-amber-400 text-stone-900 shadow-md transform scale-105'
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </button>
                ))}
              </nav>

              {/* Logout Button */}
              <button 
                onClick={logout}
                className="w-full mt-8 flex items-center justify-center gap-2 px-4 py-3 border-2 border-red-100 text-red-600 font-bold rounded-xl hover:bg-red-50 transition-colors"
              >
                <LogOut size={18} />
                Log Out
              </button>
            </div>
          </aside>


          {/* --- RIGHT CONTENT AREA --- */}
          <div className="flex-1">
            
            {/* Header Text */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-stone-900">
                {activeTab === 'bookings' && 'My Bookings'}
                {activeTab === 'favorites' && 'Saved Photographers'}
                {activeTab === 'settings' && 'Account Settings'}
              </h1>
              <p className="text-stone-500 mt-1 font-medium">
                {activeTab === 'bookings' && 'Manage your upcoming and past photography sessions.'}
                {activeTab === 'favorites' && 'Your shortlisted professionals for future events.'}
                {activeTab === 'settings' && 'Update your personal information and preferences.'}
              </p>
            </div>

            {/* TAB CONTENT: BOOKINGS */}
            {activeTab === 'bookings' && (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm hover:shadow-md hover:border-amber-300 transition-all group">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      
                      {/* Booking Info */}
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700 shrink-0">
                          <Calendar size={24} />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-stone-900 group-hover:text-amber-700 transition-colors">
                            {booking.photographer}
                          </h3>
                          <p className="text-stone-500 text-sm font-medium">{booking.type} Photography</p>
                          
                          <div className="flex items-center gap-4 mt-2 text-sm text-stone-600 font-medium">
                            <span className="flex items-center gap-1">
                              <Clock size={14} /> {booking.date}
                            </span>
                            <span className="text-stone-900 font-bold">{booking.price}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action */}
                      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                        <StatusBadge status={booking.status} />
                        <button className="p-2 rounded-full bg-stone-100 text-stone-900 hover:bg-amber-400 transition-colors">
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Empty State */}
                {bookings.length === 0 && (
                   <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-stone-300">
                      <p className="text-stone-500 font-medium">No bookings found.</p>
                   </div>
                )}
              </div>
            )}


            {/* TAB CONTENT: FAVORITES */}
            {activeTab === 'favorites' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {favorites.map((fav) => (
                  <div key={fav.id} className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-lg transition-all group">
                    <div className="relative h-40 bg-stone-200">
                      <img src={fav.image} alt={fav.name} className="w-full h-full object-cover" />
                      <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur rounded-full text-red-500 hover:scale-110 transition shadow-sm">
                        <Heart size={18} fill="currentColor" />
                      </button>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-stone-900 text-lg">{fav.name}</h3>
                          <p className="text-sm text-amber-700 font-bold uppercase tracking-wider mt-0.5">{fav.category}</p>
                        </div>
                        <div className="flex items-center gap-1 bg-stone-100 px-2 py-1 rounded-lg">
                          <Star size={14} className="text-amber-500" fill="currentColor" />
                          <span className="text-sm font-bold text-stone-900">{fav.rating}</span>
                        </div>
                      </div>
                      <button className="w-full mt-4 py-2.5 bg-stone-900 text-amber-400 font-bold rounded-xl hover:bg-stone-800 transition-colors">
                        View Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}


            {/* TAB CONTENT: SETTINGS */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
                 <form className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                       <div>
                          <label className="block text-sm font-bold text-stone-700 mb-2">Full Name</label>
                          <input type="text" defaultValue={user?.name} className="w-full p-3 bg-stone-50 border-2 border-stone-100 rounded-xl focus:border-amber-400 focus:bg-white outline-none font-medium text-stone-900 transition-colors" />
                       </div>
                       <div>
                          <label className="block text-sm font-bold text-stone-700 mb-2">Email</label>
                          <input type="email" defaultValue={user?.email} disabled className="w-full p-3 bg-stone-100 border-2 border-stone-100 rounded-xl text-stone-500 font-medium cursor-not-allowed" />
                       </div>
                       <div>
                          <label className="block text-sm font-bold text-stone-700 mb-2">Phone</label>
                          <input type="tel" placeholder="+94 77 ..." className="w-full p-3 bg-stone-50 border-2 border-stone-100 rounded-xl focus:border-amber-400 focus:bg-white outline-none font-medium text-stone-900 transition-colors" />
                       </div>
                       <div>
                          <label className="block text-sm font-bold text-stone-700 mb-2">Location</label>
                          <input type="text" placeholder="Colombo" className="w-full p-3 bg-stone-50 border-2 border-stone-100 rounded-xl focus:border-amber-400 focus:bg-white outline-none font-medium text-stone-900 transition-colors" />
                       </div>
                    </div>
                    
                    <div className="pt-4 border-t border-stone-100">
                       <button type="button" className="px-6 py-3 bg-amber-400 text-stone-900 font-bold rounded-xl hover:bg-amber-500 hover:shadow-lg hover:shadow-amber-200 transition-all">
                          Save Changes
                       </button>
                    </div>
                 </form>
              </div>
            )}

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}