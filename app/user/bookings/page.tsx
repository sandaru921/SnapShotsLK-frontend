'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/app/components/navbar';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { CheckCircle2, XCircle, Clock, ChevronLeft, AlertCircle, Camera, Video } from 'lucide-react';

const API = 'http://localhost:5090';

const STATUS_CONFIG: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
  pending:   { label: 'Pending',   cls: 'bg-yellow-50 text-yellow-700 border border-yellow-200',  icon: <Clock className="w-3.5 h-3.5" /> },
  confirmed: { label: 'Confirmed', cls: 'bg-green-50 text-green-700 border border-green-200',    icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  cancelled: { label: 'Cancelled', cls: 'bg-red-50 text-red-500 border border-red-200',         icon: <XCircle className="w-3.5 h-3.5" /> },
};

export default function MyBookingsPage() {
  const { token, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelId, setCancelId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/user/login');
  }, [authLoading, isAuthenticated]);

  const load = () => {
    const cleanToken = (token ?? '').replace(/"/g, '');
    fetch(`${API}/api/booking/my`, {
      headers: { Authorization: `Bearer ${cleanToken}` },
    })
      .then(r => r.json())
      .then(data => setBookings(Array.isArray(data) ? data : []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (token) load(); }, [token]);

  const cancelBooking = async (id: number) => {
    setCancelId(id);
    const cleanToken = (token ?? '').replace(/"/g, '');
    try {
      const res = await fetch(`${API}/api/booking/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${cleanToken}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setBookings(prev => prev.map(b => b.bookingId === id ? { ...b, status: 'cancelled' } : b));
      setToast('Booking cancelled.');
    } catch (e: any) {
      setToast(e.message);
    } finally {
      setCancelId(null);
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPath="/user/bookings" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/" className="p-2 rounded-xl border border-gray-200 hover:bg-white transition text-gray-500 hover:text-amber-700">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-sm text-gray-500">Track all your booking requests and their status</p>
          </div>
        </div>

        {/* Stats */}
        {bookings.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {['pending', 'confirmed', 'cancelled'].map(s => {
              const count = bookings.filter(b => b.status === s).length;
              const cfg = STATUS_CONFIG[s];
              return (
                <div key={s} className="bg-white rounded-xl border border-gray-200 p-3 text-center">
                  <p className={`text-xl font-bold ${s === 'pending' ? 'text-yellow-600' : s === 'confirmed' ? 'text-green-600' : 'text-red-500'}`}>{count}</p>
                  <p className="text-xs text-gray-500">{cfg.label}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-48 gap-4">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-full border-4 border-amber-100" />
              <div className="absolute inset-0 rounded-full border-4 border-amber-600 border-t-transparent animate-spin" />
            </div>
            <p className="text-sm text-gray-400">Loading your bookings…</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-500 text-sm mb-6">When you book a photographer or videographer, your requests will appear here.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/user/photographers" className="flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-medium text-sm transition">
                <Camera className="w-4 h-4" /> Find Photographers
              </Link>
              <Link href="/user/videographers" className="flex items-center justify-center gap-2 px-5 py-2.5 border border-amber-200 text-amber-800 hover:border-amber-400 rounded-xl font-medium text-sm transition">
                <Video className="w-4 h-4" /> Find Videographers
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(b => {
              const cfg = STATUS_CONFIG[b.status] ?? STATUS_CONFIG.pending;
              return (
                <div key={b.bookingId}
                  className={`bg-white rounded-2xl border overflow-hidden transition-all ${b.status === 'pending' ? 'border-yellow-200 shadow-sm' : 'border-gray-200'}`}>
                  {/* Status bar */}
                  <div className={`h-1 w-full ${b.status === 'confirmed' ? 'bg-green-500' : b.status === 'cancelled' ? 'bg-red-400' : 'bg-yellow-400'}`} />

                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="font-bold text-gray-900 text-base">{b.professional?.name}</p>
                        <p className="text-xs text-gray-500 capitalize mt-0.5">{b.professional?.serviceType}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${cfg.cls}`}>
                        {cfg.icon}{cfg.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-400 mb-0.5">Date</p>
                        <p className="font-semibold text-gray-900">{b.bookingDate}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-400 mb-0.5">Time</p>
                        <p className="font-semibold text-gray-900">{b.timeSlot}</p>
                      </div>
                      {b.packageName && (
                        <div className="col-span-2 bg-amber-50 rounded-xl p-3">
                          <p className="text-xs text-gray-400 mb-0.5">Package</p>
                          <p className="font-semibold text-amber-800">{b.packageName}
                            {b.packagePrice && <span className="ml-2 text-amber-600 text-sm">LKR {b.packagePrice}</span>}
                          </p>
                        </div>
                      )}
                    </div>

                    {b.notes && (
                      <p className="text-xs text-gray-500 bg-gray-50 rounded-lg p-2.5 mb-3 italic">"{b.notes}"</p>
                    )}

                    {/* Status message */}
                    {b.status === 'pending' && (
                      <div className="flex items-center gap-2 text-xs text-yellow-700 bg-yellow-50 rounded-lg p-2.5 mb-3">
                        <Clock className="w-3.5 h-3.5" />
                        Waiting for the professional to confirm your request.
                      </div>
                    )}
                    {b.status === 'confirmed' && (
                      <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 rounded-lg p-2.5 mb-3">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Your booking is confirmed! Reach out to the professional for details.
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-400">
                        Requested {new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      {b.status === 'pending' && (
                        <button
                          onClick={() => cancelBooking(b.bookingId)}
                          disabled={cancelId === b.bookingId}
                          className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 disabled:opacity-50"
                        >
                          {cancelId === b.bookingId ? <span className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                          Cancel Request
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

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-medium animate-in fade-in slide-in-from-bottom-3 duration-200">
          {toast}
        </div>
      )}
    </div>
  );
}
