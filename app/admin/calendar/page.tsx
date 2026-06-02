'use client';

import React, { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/app/components/ProtectedRoute';
import AdminLayout from '@/app/components/AdminLayout';
import { BookingCalendar } from '@/app/components/booking-calendar';
import { useAuth } from '@/contexts/AuthContext';
import { Lock, Unlock, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

const API = 'http://localhost:5090';

export default function CalendarPage() {
  const { user, token } = useAuth();
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [blockingSlot, setBlockingSlot] = useState<string | null>(null);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadSlots = () => {
    if (!user?.id) return;
    setLoading(true);
    fetch(`${API}/api/booking/slots/${user.id}`)
      .then(r => r.json())
      .then(setSlots)
      .catch(() => setSlots([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadSlots(); }, [user]);

  const handleBlockSlot = async (date: string, time: string) => {
    const key = `${date}-${time}`;
    setBlockingSlot(key);
    try {
      const cleanToken = (token ?? '').replace(/"/g, '');
      const res = await fetch(`${API}/api/booking/block`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cleanToken}` },
        body: JSON.stringify({ bookingDate: date, timeSlot: time, reason: 'Unavailable' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed');
      showToast(data.unblocked ? `✅ Slot ${date} ${time} is now available` : `🔒 Slot ${date} ${time} blocked`, 'success');
      loadSlots();
    } catch (e: any) {
      showToast(e.message, 'error');
    } finally {
      setBlockingSlot(null);
    }
  };

  // Count stats
  const blockedCount = slots.filter(s => s.type === 'blocked').length;
  const confirmedCount = slots.filter(s => s.status === 'confirmed').length;
  const pendingCount = slots.filter(s => s.status === 'pending' && s.type === 'booking').length;

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminLayout>
        <div className="p-6 sm:p-8 max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Availability Calendar</h1>
              <p className="text-gray-500 text-sm mt-1">Click any time slot to block or unblock it. Clients cannot book blocked slots.</p>
            </div>
            <button onClick={loadSlots} className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
              <p className="text-xs text-gray-500 mt-0.5">Pending Requests</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{confirmedCount}</p>
              <p className="text-xs text-gray-500 mt-0.5">Confirmed Bookings</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <p className="text-2xl font-bold text-red-500">{blockedCount}</p>
              <p className="text-xs text-gray-500 mt-0.5">Blocked Slots</p>
            </div>
          </div>

          {/* How-to hint */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3 mb-6 text-sm text-blue-800">
            <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">How to manage availability</p>
              <ul className="list-disc list-inside space-y-0.5 text-blue-700 text-xs">
                <li>Click a date on the calendar to see its time slots</li>
                <li>Click a time slot to <strong>block</strong> it (shown in red) — clients cannot book it</li>
                <li>Click a blocked slot again to <strong>unblock</strong> it</li>
                <li>Confirmed bookings (shown in gray) cannot be manually blocked</li>
              </ul>
            </div>
          </div>

          {/* Calendar */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-4 border-amber-100" />
                <div className="absolute inset-0 rounded-full border-4 border-amber-600 border-t-transparent animate-spin" />
              </div>
            </div>
          ) : (
            <BookingCalendar
              bookedSlots={slots}
              adminMode={true}
              onBlockSlot={handleBlockSlot}
            />
          )}

          {/* Legend */}
          <div className="mt-5 bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Slot Status Legend</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-lg bg-amber-50 border border-amber-200 flex-shrink-0" />Available</div>
              <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-lg bg-yellow-50 border border-yellow-300 flex-shrink-0" />Pending (client request)</div>
              <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-lg bg-gray-200 flex-shrink-0" />Confirmed booking</div>
              <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-lg bg-red-50 border border-red-200 flex-shrink-0" />Blocked by you</div>
            </div>
          </div>
        </div>

        {/* Toast notification */}
        {toast && (
          <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl text-sm font-medium animate-in fade-in slide-in-from-bottom-3 duration-200 ${toast.type === 'success' ? 'bg-gray-900 text-white' : 'bg-red-600 text-white'}`}>
            {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {toast.msg}
          </div>
        )}
      </AdminLayout>
    </ProtectedRoute>
  );
}
