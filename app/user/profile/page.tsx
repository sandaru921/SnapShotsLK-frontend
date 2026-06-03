'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '../../components/navbar';
import { Footer } from '../../components/Footer';
import {
  User, MapPin, Calendar, Heart, Settings,
  LogOut, Star, Clock, ChevronRight, Camera,
  CheckCircle2, XCircle, Phone, Save, RefreshCw,
  Video, AlertCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const API = 'http://localhost:5090';

const STATUS_CONFIG: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
  pending:   { label: 'Pending',   cls: 'bg-amber-100 text-amber-900 border-amber-200',  icon: <Clock size={12} /> },
  confirmed: { label: 'Confirmed', cls: 'bg-green-100 text-green-900 border-green-200',  icon: <CheckCircle2 size={12} /> },
  cancelled: { label: 'Cancelled', cls: 'bg-red-100 text-red-600 border-red-200',        icon: <XCircle size={12} /> },
};

export default function UserProfilePage() {
  const { user, token, logout, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');

  // ── Real bookings from API
  const [bookings, setBookings] = useState<any[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [cancelId, setCancelId] = useState<number | null>(null);

  // ── Real user profile
  const [profileData, setProfileData] = useState<{ name: string; phone: string; location: string }>({
    name: user?.name || '',
    phone: '',
    location: user?.location || '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState('');

  // ── Toast
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const cleanToken = () => (token ?? '').replace(/"/g, '');

  // ── Fetch bookings
  const loadBookings = () => {
    if (!token) return;
    setBookingsLoading(true);
    fetch(`${API}/api/booking/my`, {
      headers: { Authorization: `Bearer ${cleanToken()}` },
    })
      .then(r => r.json())
      .then(data => setBookings(Array.isArray(data) ? data : []))
      .catch(() => setBookings([]))
      .finally(() => setBookingsLoading(false));
  };

  // ── Fetch user profile details (phone, location)
  const loadProfile = () => {
    if (!token) return;
    fetch(`${API}/api/user/me`, {
      headers: { Authorization: `Bearer ${cleanToken()}` },
    })
      .then(r => r.json())
      .then(data => setProfileData({
        name: data.name || user?.name || '',
        phone: data.phone || '',
        location: data.location || '',
      }))
      .catch(() => {});
  };

  useEffect(() => {
    if (token) {
      loadBookings();
      loadProfile();
    }
  }, [token]);

  // ── Cancel a booking
  const cancelBooking = async (id: number) => {
    setCancelId(id);
    try {
      const res = await fetch(`${API}/api/booking/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${cleanToken()}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setBookings(prev => prev.map(b => b.bookingId === id ? { ...b, status: 'cancelled' } : b));
      showToast('Booking cancelled.');
    } catch (e: any) {
      showToast(e.message || 'Failed to cancel.', 'error');
    } finally {
      setCancelId(null);
    }
  };

  // ── Save profile changes
  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError('');
    setProfileSaved(false);
    try {
      const res = await fetch(`${API}/api/user/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cleanToken()}`,
        },
        body: JSON.stringify({
          name: profileData.name,
          phone: profileData.phone,
          location: profileData.location,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Save failed');
      setProfileSaved(true);
      showToast('Profile updated!');
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (e: any) {
      setProfileError(e.message || 'Failed to save.');
      showToast(e.message || 'Failed to save.', 'error');
    } finally {
      setProfileLoading(false);
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${cfg.cls}`}>
        {cfg.icon} {cfg.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Navbar currentPath="/user/profile" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── LEFT SIDEBAR ─────────────────────────────────────── */}
          <aside className="w-full lg:w-80 shrink-0">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200 sticky top-24">

              {/* Avatar & Info */}
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <div className="w-full h-full rounded-full bg-amber-200 flex items-center justify-center text-amber-900 border-4 border-white shadow-md">
                    <span className="text-3xl font-bold">{profileData.name?.charAt(0) || user?.name?.charAt(0) || 'U'}</span>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-stone-900">{profileData.name || user?.name || 'User'}</h2>
                <p className="text-sm text-stone-500 font-medium mb-1">{user?.email}</p>

                {profileData.location && (
                  <div className="flex items-center justify-center gap-1 text-sm text-amber-700 font-semibold bg-amber-50 py-1 px-3 rounded-full mx-auto w-fit mt-2">
                    <MapPin size={14} />
                    {profileData.location}
                  </div>
                )}

                {profileData.phone && (
                  <div className="flex items-center justify-center gap-1 text-sm text-stone-500 mt-1">
                    <Phone size={13} />
                    {profileData.phone}
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mt-6 mb-6">
                <div className="bg-amber-50 rounded-2xl p-3 text-center">
                  <p className="text-2xl font-bold text-amber-700">{bookings.length}</p>
                  <p className="text-xs text-stone-500 font-medium">Bookings</p>
                </div>
                <div className="bg-stone-50 rounded-2xl p-3 text-center">
                  <p className="text-2xl font-bold text-stone-700">{bookings.filter(b => b.status === 'confirmed').length}</p>
                  <p className="text-xs text-stone-500 font-medium">Confirmed</p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {[
                  { id: 'bookings', label: 'My Bookings', icon: Calendar },
                  { id: 'settings', label: 'Account Settings', icon: Settings },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                      activeTab === item.id
                        ? 'bg-amber-400 text-stone-900 shadow-md scale-105'
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <item.icon size={18} />
                    {item.label}
                    {item.id === 'bookings' && bookings.filter(b => b.status === 'pending').length > 0 && (
                      <span className="ml-auto bg-amber-700 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {bookings.filter(b => b.status === 'pending').length}
                      </span>
                    )}
                  </button>
                ))}
              </nav>

              {/* Logout */}
              <button
                onClick={logout}
                className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 border-2 border-red-100 text-red-600 font-bold rounded-xl hover:bg-red-50 transition-colors"
              >
                <LogOut size={18} />
                Log Out
              </button>
            </div>
          </aside>

          {/* ── RIGHT CONTENT ────────────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* ── TAB: BOOKINGS ── */}
            {activeTab === 'bookings' && (
              <div>
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-stone-900">My Bookings</h1>
                  <p className="text-stone-500 mt-1 font-medium">Track all your photography and videography sessions.</p>
                </div>

                {/* Stats row */}
                {bookings.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {['pending', 'confirmed', 'cancelled'].map(s => {
                      const count = bookings.filter(b => b.status === s).length;
                      const colors: Record<string, string> = { pending: 'text-amber-600', confirmed: 'text-green-600', cancelled: 'text-red-500' };
                      return (
                        <div key={s} className="bg-white rounded-xl border border-stone-200 p-3 text-center shadow-sm">
                          <p className={`text-xl font-bold ${colors[s]}`}>{count}</p>
                          <p className="text-xs text-stone-500 capitalize">{s}</p>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Booking list */}
                {bookingsLoading ? (
                  <div className="flex flex-col items-center justify-center h-48 gap-3">
                    <div className="relative w-10 h-10">
                      <div className="absolute inset-0 rounded-full border-4 border-amber-100" />
                      <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
                    </div>
                    <p className="text-sm text-stone-400">Loading your bookings…</p>
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-dashed border-stone-300 p-12 text-center">
                    <Calendar className="w-12 h-12 text-stone-200 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-stone-900 mb-2">No bookings yet</h3>
                    <p className="text-stone-500 text-sm mb-6">Book a photographer or videographer to get started.</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Link href="/user/photographers"
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-900 rounded-xl font-bold text-sm transition">
                        <Camera size={16} /> Find Photographers
                      </Link>
                      <Link href="/user/videographers"
                        className="flex items-center justify-center gap-2 px-5 py-2.5 border-2 border-stone-200 text-stone-600 hover:border-amber-400 hover:text-amber-700 rounded-xl font-bold text-sm transition">
                        <Video size={16} /> Find Videographers
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map(b => {
                      const cfg = STATUS_CONFIG[b.status] ?? STATUS_CONFIG.pending;
                      return (
                        <div key={b.bookingId}
                          className={`bg-white rounded-2xl border overflow-hidden shadow-sm transition-all hover:shadow-md ${
                            b.status === 'pending' ? 'border-amber-200' :
                            b.status === 'confirmed' ? 'border-green-200' : 'border-stone-200'
                          }`}>
                          {/* Status bar */}
                          <div className={`h-1 w-full ${
                            b.status === 'confirmed' ? 'bg-green-400' :
                            b.status === 'cancelled' ? 'bg-red-300' : 'bg-amber-400'
                          }`} />

                          <div className="p-5">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700 shrink-0">
                                  {b.professional?.serviceType === 'videographer' ? <Video size={20} /> : <Camera size={20} />}
                                </div>
                                <div>
                                  <p className="font-bold text-stone-900 text-base">{b.professional?.name}</p>
                                  <p className="text-xs text-stone-500 capitalize">{b.professional?.serviceType}</p>
                                </div>
                              </div>
                              <StatusBadge status={b.status} />
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                              <div className="bg-stone-50 rounded-xl p-3">
                                <p className="text-xs text-stone-400 mb-0.5">Date</p>
                                <p className="font-semibold text-stone-900">{b.bookingDate}</p>
                              </div>
                              <div className="bg-stone-50 rounded-xl p-3">
                                <p className="text-xs text-stone-400 mb-0.5">Time</p>
                                <p className="font-semibold text-stone-900">{b.timeSlot}</p>
                              </div>
                              {b.packageName && (
                                <div className="col-span-2 bg-amber-50 rounded-xl p-3">
                                  <p className="text-xs text-stone-400 mb-0.5">Package</p>
                                  <p className="font-semibold text-amber-800">
                                    {b.packageName}
                                    {b.packagePrice && <span className="ml-2 text-amber-600 text-sm">LKR {b.packagePrice}</span>}
                                  </p>
                                </div>
                              )}
                            </div>

                            {b.notes && (
                              <p className="text-xs text-stone-500 bg-stone-50 rounded-lg p-2.5 mb-3 italic">"{b.notes}"</p>
                            )}

                            {b.status === 'pending' && (
                              <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 rounded-lg p-2.5 mb-3">
                                <Clock size={13} /> Waiting for the professional to confirm your request.
                              </div>
                            )}
                            {b.status === 'confirmed' && (
                              <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 rounded-lg p-2.5 mb-3">
                                <CheckCircle2 size={13} /> Booking confirmed! Contact the professional for details.
                              </div>
                            )}

                            <div className="flex items-center justify-between">
                              <p className="text-xs text-stone-400">
                                Requested {new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </p>
                              {b.status === 'pending' && (
                                <button
                                  onClick={() => cancelBooking(b.bookingId)}
                                  disabled={cancelId === b.bookingId}
                                  className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 disabled:opacity-50 font-medium"
                                >
                                  {cancelId === b.bookingId
                                    ? <span className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                                    : <XCircle size={13} />}
                                  Cancel
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── TAB: SETTINGS ── */}
            {activeTab === 'settings' && (
              <div>
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-stone-900">Account Settings</h1>
                  <p className="text-stone-500 mt-1 font-medium">Update your personal information.</p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
                  <form onSubmit={saveProfile} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-bold text-stone-700 mb-2">Full Name</label>
                        <div className="relative">
                          <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                          <input
                            type="text"
                            value={profileData.name}
                            onChange={e => setProfileData(p => ({ ...p, name: e.target.value }))}
                            className="w-full pl-9 pr-4 p-3 bg-stone-50 border-2 border-stone-100 rounded-xl focus:border-amber-400 focus:bg-white outline-none font-medium text-stone-900 transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-stone-700 mb-2">Email <span className="text-stone-400 font-normal">(cannot change)</span></label>
                        <input
                          type="email"
                          value={user?.email || ''}
                          disabled
                          className="w-full p-3 bg-stone-100 border-2 border-stone-100 rounded-xl text-stone-500 font-medium cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-stone-700 mb-2">Phone</label>
                        <div className="relative">
                          <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                          <input
                            type="tel"
                            value={profileData.phone}
                            onChange={e => setProfileData(p => ({ ...p, phone: e.target.value }))}
                            placeholder="+94 77 123 4567"
                            className="w-full pl-9 pr-4 p-3 bg-stone-50 border-2 border-stone-100 rounded-xl focus:border-amber-400 focus:bg-white outline-none font-medium text-stone-900 transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-stone-700 mb-2">City / Location</label>
                        <div className="relative">
                          <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                          <input
                            type="text"
                            value={profileData.location}
                            onChange={e => setProfileData(p => ({ ...p, location: e.target.value }))}
                            placeholder="Colombo"
                            className="w-full pl-9 pr-4 p-3 bg-stone-50 border-2 border-stone-100 rounded-xl focus:border-amber-400 focus:bg-white outline-none font-medium text-stone-900 transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    {profileError && (
                      <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl p-3">
                        <AlertCircle size={15} /> {profileError}
                      </div>
                    )}

                    <div className="pt-4 border-t border-stone-100 flex items-center gap-4">
                      <button
                        type="submit"
                        disabled={profileLoading}
                        className="flex items-center gap-2 px-6 py-3 bg-amber-400 text-stone-900 font-bold rounded-xl hover:bg-amber-500 hover:shadow-lg hover:shadow-amber-200 transition-all disabled:opacity-60"
                      >
                        {profileLoading
                          ? <><RefreshCw size={16} className="animate-spin" /> Saving…</>
                          : profileSaved
                          ? <><CheckCircle2 size={16} /> Saved!</>
                          : <><Save size={16} /> Save Changes</>}
                      </button>

                      <p className="text-xs text-stone-400">
                        Changes are saved immediately to your account.
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl shadow-xl text-sm font-medium ${
          toast.type === 'success' ? 'bg-stone-900 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {toast.msg}
        </div>
      )}

      <Footer />
    </div>
  );
}