'use client';

import React, { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/app/components/ProtectedRoute';
import AdminLayout from '@/app/components/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle2, XCircle, Clock, AlertCircle, Search, RefreshCw, ChevronDown } from 'lucide-react';

const API = 'http://localhost:5090';

type Status = 'all' | 'pending' | 'confirmed' | 'cancelled';

const STATUS_BADGE: Record<string, string> = {
  pending:   'bg-yellow-50 text-yellow-700 border border-yellow-200',
  confirmed: 'bg-green-50 text-green-700 border border-green-200',
  cancelled: 'bg-red-50 text-red-500 border border-red-200',
};

export default function OrdersPage() {
  const { token } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Status>('all');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [actionId, setActionId] = useState<number | null>(null);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = () => {
    setLoading(true);
    const cleanToken = (token ?? '').replace(/"/g, '');
    fetch(`${API}/api/booking/incoming`, {
      headers: { Authorization: `Bearer ${cleanToken}` },
    })
      .then(r => r.json())
      .then(data => setBookings(Array.isArray(data) ? data : []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [token]);

  const updateStatus = async (id: number, status: 'confirmed' | 'cancelled') => {
    setActionId(id);
    const cleanToken = (token ?? '').replace(/"/g, '');
    try {
      const res = await fetch(`${API}/api/booking/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cleanToken}` },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed');
      showToast(status === 'confirmed' ? '✅ Booking confirmed!' : '❌ Booking declined.', 'success');
      setBookings(prev => prev.map(b => b.bookingId === id ? { ...b, status } : b));
    } catch (e: any) {
      showToast(e.message, 'error');
    } finally {
      setActionId(null);
    }
  };

  const filtered = bookings
    .filter(b => filter === 'all' || b.status === filter)
    .filter(b => !search || b.client?.name?.toLowerCase().includes(search.toLowerCase()) || b.packageName?.toLowerCase().includes(search.toLowerCase()));

  const counts = {
    all: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminLayout>
        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Booking Requests</h1>
              <p className="text-gray-500 text-sm mt-1">Review and respond to client booking requests.</p>
            </div>
            <button onClick={load} className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {(['all', 'pending', 'confirmed', 'cancelled'] as Status[]).map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`p-4 rounded-xl border text-left transition-all ${filter === s ? 'border-amber-500 bg-amber-50 shadow-sm' : 'border-gray-200 bg-white hover:border-amber-300'}`}>
                <p className={`text-2xl font-bold ${s === 'pending' ? 'text-yellow-600' : s === 'confirmed' ? 'text-green-600' : s === 'cancelled' ? 'text-red-500' : 'text-gray-900'}`}>
                  {counts[s]}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 capitalize">{s === 'all' ? 'Total' : s}</p>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative mb-5">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by client name or package…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-200 outline-none"
            />
          </div>

          {/* List */}
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 rounded-full border-4 border-amber-100" />
                <div className="absolute inset-0 rounded-full border-4 border-amber-600 border-t-transparent animate-spin" />
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
              <div className="text-5xl mb-4">📭</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {filter === 'all' ? 'No booking requests yet' : `No ${filter} bookings`}
              </h3>
              <p className="text-gray-500 text-sm">
                {filter === 'all' ? 'When clients book your services, requests will appear here.' : `No bookings with status "${filter}" found.`}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(b => (
                <div key={b.bookingId}
                  className={`bg-white rounded-2xl border transition-all ${b.status === 'pending' ? 'border-yellow-200 shadow-sm' : 'border-gray-200'}`}>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      {/* Client info */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {b.client?.name?.[0]?.toUpperCase() ?? '?'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{b.client?.name ?? 'Unknown'}</p>
                          <p className="text-xs text-gray-500">{b.client?.email}</p>
                          {b.client?.phone && <p className="text-xs text-gray-500">📞 {b.client.phone}</p>}
                        </div>
                      </div>
                      {/* Status badge */}
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize flex-shrink-0 ${STATUS_BADGE[b.status] || 'bg-gray-100 text-gray-500'}`}>
                        {b.status}
                      </span>
                    </div>

                    {/* Booking details */}
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-400 mb-0.5">Date</p>
                        <p className="font-semibold text-gray-900">{b.bookingDate}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-400 mb-0.5">Time</p>
                        <p className="font-semibold text-gray-900">{b.timeSlot}</p>
                      </div>
                      {b.packageName && (
                        <div className="bg-amber-50 rounded-xl p-3">
                          <p className="text-xs text-gray-400 mb-0.5">Package</p>
                          <p className="font-semibold text-amber-800">{b.packageName}</p>
                          {b.packagePrice && <p className="text-xs text-amber-600">LKR {b.packagePrice}</p>}
                        </div>
                      )}
                    </div>

                    {b.notes && (
                      <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-800">
                        <span className="font-semibold">Note from client: </span>{b.notes}
                      </div>
                    )}

                    <div className="mt-3 text-xs text-gray-400">
                      Received: {new Date(b.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>

                    {/* Actions */}
                    {b.status === 'pending' && (
                      <div className="mt-4 flex gap-3">
                        <button
                          onClick={() => updateStatus(b.bookingId, 'confirmed')}
                          disabled={actionId === b.bookingId}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold transition disabled:opacity-50"
                        >
                          {actionId === b.bookingId ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                          Confirm
                        </button>
                        <button
                          onClick={() => updateStatus(b.bookingId, 'cancelled')}
                          disabled={actionId === b.bookingId}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 border-2 border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-sm font-semibold transition disabled:opacity-50"
                        >
                          <XCircle className="w-4 h-4" />
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Toast */}
        {toast && (
          <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl text-sm font-medium animate-in fade-in slide-in-from-bottom-3 duration-200 ${toast.type === 'success' ? 'bg-gray-900 text-white' : 'bg-red-600 text-white'}`}>
            {toast.msg}
          </div>
        )}
      </AdminLayout>
    </ProtectedRoute>
  );
}
