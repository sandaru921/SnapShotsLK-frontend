'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/app/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard, Clock, ShieldCheck, Users, Calendar,
  XCircle, ChevronRight, RefreshCw, ExternalLink,
  CheckCircle, FileText, Briefcase, MapPin, Phone,
  AlertTriangle, UserMinus, RotateCcw, Search, Filter,
  LogOut, Menu, X, Camera, Video, Building2, BookOpen,
  Maximize2, Star, TrendingUp, Activity
} from 'lucide-react';

const API = 'http://localhost:5090';

// ── Types ───────────────────────────────────────────────────────────
type Section = 'overview' | 'approvals' | 'professionals' | 'users' | 'bookings' | 'rejected';

interface Stat { label: string; value: number; icon: any; color: string; border: string; }

const SERVICE_META: Record<string, { label: string; color: string; icon: any }> = {
  photographer:        { label: 'Photographer',   color: 'bg-blue-100 text-blue-700',    icon: Camera },
  videographer:        { label: 'Videographer',   color: 'bg-purple-100 text-purple-700', icon: Video },
  studio:              { label: 'Photo Studio',   color: 'bg-emerald-100 text-emerald-700', icon: Building2 },
  album_printer:       { label: 'Album Printer',  color: 'bg-orange-100 text-orange-700', icon: BookOpen },
  enlargement_printer: { label: 'Enlargements',   color: 'bg-rose-100 text-rose-700',    icon: Maximize2 },
};

const svcLabel = (s?: string) => SERVICE_META[s ?? '']?.label ?? (s ?? '—');
const svcColor = (s?: string) => SERVICE_META[s ?? '']?.color ?? 'bg-gray-100 text-gray-700';

const BOOKING_COLORS: Record<string, string> = {
  pending:   'bg-yellow-50 text-yellow-700 border-yellow-200',
  confirmed: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-500 border-red-200',
};

// ── NavItem ─────────────────────────────────────────────────────────
function NavItem({ id, label, icon: Icon, active, badge, onClick }:
  { id: Section; label: string; icon: any; active: boolean; badge?: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
        active
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
          : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span className="flex-1 text-left">{label}</span>
      {badge != null && badge > 0 && (
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-red-500 text-white'}`}>
          {badge}
        </span>
      )}
    </button>
  );
}

// ── Spinner ─────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div className="flex items-center justify-center py-16 text-slate-400 gap-2 text-sm">
      <RefreshCw className="w-4 h-4 animate-spin" /> Loading…
    </div>
  );
}

// ── Empty ────────────────────────────────────────────────────────────
function Empty({ msg }: { msg: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2 text-sm">
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-2">
        <CheckCircle className="w-6 h-6 text-slate-300" />
      </div>
      {msg}
    </div>
  );
}

// ── SearchBar ────────────────────────────────────────────────────────
function SearchBar({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 w-64 bg-white"
      />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
export default function SuperAdminDashboard() {
  const { user, token, logout } = useAuth();
  const [section, setSection] = useState<Section>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [stats, setStats]           = useState<any>(null);
  const [pending, setPending]       = useState<any[]>([]);
  const [professionals, setPros]    = useState<any[]>([]);
  const [clients, setClients]       = useState<any[]>([]);
  const [bookings, setBookings]     = useState<any[]>([]);
  const [rejected, setRejected]     = useState<any[]>([]);

  const [loading, setLoading]       = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [toast, setToast]           = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Filters
  const [svcFilter, setSvcFilter]   = useState('all');
  const [searchPros, setSearchPros] = useState('');
  const [searchClients, setSearchClients] = useState('');
  const [searchPending, setSearchPending] = useState('');
  const [bookingStatus, setBookingStatus] = useState('all');

  // Reject modal
  const [rejectModal, setRejectModal] = useState<{ open: boolean; userId: number | null; name: string }>({
    open: false, userId: null, name: '',
  });
  const [rejectionReason, setRejectionReason] = useState('');

  const headers = useCallback(() => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${(token ?? '').replace(/"/g, '')}`,
  }), [token]);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const h = headers();
      const [statsR, pendingR, allR, clientsR, bookingsR, rejectedR] = await Promise.all([
        fetch(`${API}/api/admin/stats`,      { headers: h }),
        fetch(`${API}/api/admin/pending`,    { headers: h }),
        fetch(`${API}/api/admin/all`,        { headers: h }),
        fetch(`${API}/api/admin/clients`,    { headers: h }),
        fetch(`${API}/api/admin/bookings`,   { headers: h }),
        fetch(`${API}/api/admin/rejected`,   { headers: h }),
      ]);
      if (statsR.ok)     setStats(await statsR.json());
      if (pendingR.ok)   setPending(await pendingR.json());
      if (allR.ok)       setPros(await allR.json());
      if (clientsR.ok)   setClients(await clientsR.json());
      if (bookingsR.ok)  setBookings(await bookingsR.json());
      if (rejectedR.ok)  setRejected(await rejectedR.json());
    } catch { showToast('Failed to load data.', 'error'); }
    finally { setLoading(false); }
  }, [headers]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleApprove = async (userId: number) => {
    setActionLoading(userId);
    try {
      const res = await fetch(`${API}/api/admin/approve`, {
        method: 'POST', headers: headers(),
        body: JSON.stringify({ userId, action: 'approve' }),
      });
      const d = await res.json();
      if (res.ok) { showToast(d.message, 'success'); fetchAll(); }
      else showToast(d.message, 'error');
    } finally { setActionLoading(null); }
  };

  const handleReject = async () => {
    if (!rejectModal.userId || !rejectionReason.trim()) return;
    setActionLoading(rejectModal.userId);
    const uid = rejectModal.userId;
    setRejectModal({ open: false, userId: null, name: '' });
    try {
      const res = await fetch(`${API}/api/admin/approve`, {
        method: 'POST', headers: headers(),
        body: JSON.stringify({ userId: uid, action: 'reject', rejectionReason }),
      });
      const d = await res.json();
      showToast(d.message, res.ok ? 'success' : 'error');
      if (res.ok) fetchAll();
    } finally { setActionLoading(null); }
  };

  const handleSuspend = async (userId: number, name: string) => {
    if (!window.confirm(`Suspend ${name}? They will lose professional access.`)) return;
    setActionLoading(userId);
    try {
      const res = await fetch(`${API}/api/admin/${userId}`, {
        method: 'DELETE', headers: headers(),
      });
      const d = await res.json();
      showToast(d.message, res.ok ? 'success' : 'error');
      if (res.ok) fetchAll();
    } finally { setActionLoading(null); }
  };

  const handleReReview = async (userId: number, name: string) => {
    setActionLoading(userId);
    try {
      const res = await fetch(`${API}/api/admin/re-review/${userId}`, {
        method: 'POST', headers: headers(),
      });
      const d = await res.json();
      showToast(d.message, res.ok ? 'success' : 'error');
      if (res.ok) fetchAll();
    } finally { setActionLoading(null); }
  };

  // Derived filtered lists
  const filteredPros = professionals.filter(p =>
    (svcFilter === 'all' || p.serviceType === svcFilter) &&
    (!searchPros || `${p.name} ${p.businessName} ${p.email}`.toLowerCase().includes(searchPros.toLowerCase()))
  );

  const filteredClients = clients.filter(c =>
    !searchClients || `${c.name} ${c.email}`.toLowerCase().includes(searchClients.toLowerCase())
  );

  const filteredPending = pending.filter(p =>
    !searchPending || `${p.name} ${p.email} ${p.businessName}`.toLowerCase().includes(searchPending.toLowerCase())
  );

  const filteredBookings = bookings.filter(b =>
    bookingStatus === 'all' || b.status === bookingStatus
  );

  // ── Sidebar ──────────────────────────────────────────────────────
  const navItems: { id: Section; label: string; icon: any; badge?: number }[] = [
    { id: 'overview',      label: 'Overview',        icon: LayoutDashboard },
    { id: 'approvals',     label: 'Approvals',       icon: Clock,        badge: pending.length },
    { id: 'professionals', label: 'Professionals',   icon: ShieldCheck },
    { id: 'users',         label: 'Clients',         icon: Users },
    { id: 'bookings',      label: 'All Bookings',    icon: Calendar },
    { id: 'rejected',      label: 'Rejected',        icon: XCircle,      badge: rejected.length },
  ];

  const Sidebar = () => (
    <aside className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-slate-100">
        <Link href="/" className="text-lg font-light tracking-wider">
          SNAPSHOTS<span className="font-bold text-indigo-600">LK</span>
        </Link>
        <p className="text-xs text-slate-400 mt-0.5 font-medium uppercase tracking-widest">SuperAdmin</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(n => (
          <NavItem key={n.id} {...n} active={section === n.id} onClick={() => { setSection(n.id); setSidebarOpen(false); }} />
        ))}
      </nav>

      {/* User footer */}
      <div className="px-4 py-4 border-t border-slate-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
            {user?.name?.charAt(0) ?? 'S'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">{user?.name ?? 'SuperAdmin'}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-2 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition font-medium">
          <LogOut className="w-3.5 h-3.5" /> Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <ProtectedRoute allowedRoles={['superadmin']}>
      <div className="min-h-screen bg-slate-50 flex">

        {/* ── Desktop Sidebar ── */}
        <div className="hidden lg:flex w-60 bg-white border-r border-slate-100 flex-col fixed h-full z-30 shadow-sm">
          <Sidebar />
        </div>

        {/* ── Mobile Sidebar Overlay ── */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40">
            <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-60 bg-white shadow-2xl flex flex-col">
              <Sidebar />
            </div>
          </div>
        )}

        {/* ── Main Content ── */}
        <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">

          {/* Top bar */}
          <header className="sticky top-0 z-20 bg-white border-b border-slate-100 px-4 sm:px-6 py-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-600">
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-slate-900 capitalize">
                  {navItems.find(n => n.id === section)?.label ?? 'Dashboard'}
                </h1>
                <p className="text-xs text-slate-400 hidden sm:block">SnapshotsLK Platform Administration</p>
              </div>
            </div>
            <button onClick={fetchAll} disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition disabled:opacity-50">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </header>

          <main className="flex-1 px-4 sm:px-6 py-6 max-w-7xl w-full mx-auto">

            {/* ════════ OVERVIEW ════════ */}
            {section === 'overview' && (
              <div className="space-y-6">
                {/* Stat cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Clients',       value: stats?.totalClients ?? '—',       icon: Users,         color: 'text-blue-500',   border: 'border-blue-400',   bg: 'bg-blue-50' },
                    { label: 'Professionals',        value: stats?.totalProfessionals ?? '—', icon: ShieldCheck,   color: 'text-indigo-500', border: 'border-indigo-400', bg: 'bg-indigo-50' },
                    { label: 'Pending Approvals',    value: stats?.totalPending ?? '—',       icon: Clock,         color: 'text-amber-500',  border: 'border-amber-400',  bg: 'bg-amber-50' },
                    { label: 'Total Bookings',       value: stats?.totalBookings ?? '—',      icon: Calendar,      color: 'text-emerald-500',border: 'border-emerald-400',bg: 'bg-emerald-50' },
                  ].map((m, i) => {
                    const Icon = m.icon;
                    return (
                      <div key={i} className={`bg-white p-5 rounded-2xl border-l-4 shadow-sm ${m.border}`}>
                        <div className={`w-9 h-9 rounded-xl ${m.bg} flex items-center justify-center mb-3`}>
                          <Icon className={`w-5 h-5 ${m.color}`} />
                        </div>
                        <p className="text-3xl font-bold text-slate-900">{m.value}</p>
                        <p className="text-sm text-slate-500 mt-0.5">{m.label}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Booking sub-stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Pending Bookings',   value: stats?.pendingBookings ?? '—',   color: 'text-yellow-600' },
                    { label: 'Confirmed Bookings',  value: stats?.confirmedBookings ?? '—', color: 'text-green-600' },
                    { label: 'Rejected Profiles',   value: stats?.totalRejected ?? '—',     color: 'text-red-500' },
                  ].map((m, i) => (
                    <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
                      <p className={`text-4xl font-bold ${m.color}`}>{m.value}</p>
                      <p className="text-sm text-slate-500 font-medium leading-tight">{m.label}</p>
                    </div>
                  ))}
                </div>

                {/* Quick actions */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <p className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wider">Quick Actions</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { label: 'Review Approvals',  sec: 'approvals' as Section,     icon: Clock,       color: 'bg-amber-50 text-amber-700 hover:bg-amber-100' },
                      { label: 'View Professionals',sec: 'professionals' as Section,  icon: ShieldCheck, color: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100' },
                      { label: 'All Bookings',      sec: 'bookings' as Section,      icon: Calendar,    color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' },
                      { label: 'Manage Clients',    sec: 'users' as Section,         icon: Users,       color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
                      { label: 'Rejected Apps',     sec: 'rejected' as Section,      icon: XCircle,     color: 'bg-red-50 text-red-600 hover:bg-red-100' },
                    ].map(q => {
                      const Icon = q.icon;
                      return (
                        <button key={q.sec} onClick={() => setSection(q.sec)}
                          className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold transition ${q.color}`}>
                          <Icon className="w-4 h-4" /> {q.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Recent pending */}
                {pending.length > 0 && (
                  <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm font-semibold text-slate-800">Pending Applications</p>
                      <button onClick={() => setSection('approvals')} className="text-xs text-indigo-600 hover:underline">View all →</button>
                    </div>
                    <div className="space-y-2">
                      {pending.slice(0, 3).map(p => (
                        <div key={p.userId} className="flex items-center justify-between py-2 px-3 rounded-xl bg-amber-50">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">{p.name?.charAt(0) ?? '?'}</div>
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{p.name}</p>
                              <p className="text-xs text-slate-500">{svcLabel(p.serviceType)}</p>
                            </div>
                          </div>
                          <button onClick={() => setSection('approvals')}
                            className="text-xs px-3 py-1.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition font-medium">Review</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ════════ APPROVALS ════════ */}
            {section === 'approvals' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                  <SearchBar value={searchPending} onChange={setSearchPending} placeholder="Search by name, email…" />
                  <p className="text-sm text-slate-500">{filteredPending.length} application{filteredPending.length !== 1 ? 's' : ''}</p>
                </div>

                {loading ? <Spinner /> : filteredPending.length === 0 ? (
                  <Empty msg="No pending applications — all caught up!" />
                ) : filteredPending.map(admin => (
                  <div key={admin.userId} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
                    {/* Header row */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-indigo-100 text-indigo-700 font-bold text-lg flex items-center justify-center shrink-0">
                          {admin.name?.charAt(0) ?? '?'}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{admin.name}</p>
                          <p className="text-xs text-slate-500">{admin.email}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${svcColor(admin.serviceType)}`}>
                        {svcLabel(admin.serviceType)}
                      </span>
                    </div>

                    {/* Info grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5 text-slate-400" />{admin.businessName || '—'}</div>
                      <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" />{admin.location || '—'}</div>
                      <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" />{admin.phone || '—'}</div>
                    </div>

                    {/* Documents */}
                    <div className="bg-slate-50 rounded-xl p-3 mb-4 text-xs space-y-2">
                      <p className="font-semibold text-slate-700 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Documents</p>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">NIC: <span className="text-slate-700 font-medium">{admin.nicNumber}</span></span>
                        <a href={admin.nicDocumentUrl} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium">
                          View NIC <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      {admin.businessCertUrl && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Business Cert</span>
                          <a href={admin.businessCertUrl} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium">
                            View <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                      {admin.portfolioUrl && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Portfolio</span>
                          <a href={admin.portfolioUrl} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium">
                            View <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3">
                      <button onClick={() => handleApprove(admin.userId)} disabled={actionLoading === admin.userId}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition disabled:opacity-50">
                        <CheckCircle className="w-4 h-4" />
                        {actionLoading === admin.userId ? 'Processing…' : 'Approve'}
                      </button>
                      <button onClick={() => { setRejectionReason(''); setRejectModal({ open: true, userId: admin.userId, name: admin.name }); }}
                        disabled={actionLoading === admin.userId}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-sm font-semibold transition disabled:opacity-50">
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ════════ PROFESSIONALS ════════ */}
            {section === 'professionals' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                  <SearchBar value={searchPros} onChange={setSearchPros} placeholder="Search professionals…" />
                  <select value={svcFilter} onChange={e => setSvcFilter(e.target.value)}
                    className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300">
                    <option value="all">All types</option>
                    {Object.entries(SERVICE_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                  <p className="text-sm text-slate-500">{filteredPros.length} professional{filteredPros.length !== 1 ? 's' : ''}</p>
                </div>

                {loading ? <Spinner /> : filteredPros.length === 0 ? <Empty msg="No professionals found." /> : (
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="hidden sm:grid grid-cols-[2fr_1.5fr_1.5fr_1fr_auto] gap-4 px-5 py-3 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <span>Name</span><span>Business</span><span>Location</span><span>Type</span><span></span>
                    </div>
                    {filteredPros.map((p, i) => (
                      <div key={p.userId} className={`grid grid-cols-1 sm:grid-cols-[2fr_1.5fr_1.5fr_1fr_auto] gap-4 px-5 py-4 items-center ${i !== 0 ? 'border-t border-slate-50' : ''} hover:bg-slate-50 transition group`}>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm flex items-center justify-center shrink-0">
                            {p.name?.charAt(0) ?? '?'}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 text-sm">{p.businessName || p.name}</p>
                            <p className="text-xs text-slate-400">{p.email}</p>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600">{p.businessName || '—'}</p>
                        <p className="text-sm text-slate-600">{p.location || '—'}</p>
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${svcColor(p.serviceType)}`}>
                          {svcLabel(p.serviceType)}
                        </span>
                        <div className="flex items-center gap-2">
                          <Link href={`/user/photographers/${p.userId}`} target="_blank"
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition" title="View Profile">
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button onClick={() => handleSuspend(p.userId, p.name)} disabled={actionLoading === p.userId}
                            className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-50" title="Suspend">
                            {actionLoading === p.userId ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UserMinus className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ════════ CLIENTS ════════ */}
            {section === 'users' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                  <SearchBar value={searchClients} onChange={setSearchClients} placeholder="Search clients…" />
                  <p className="text-sm text-slate-500">{filteredClients.length} client{filteredClients.length !== 1 ? 's' : ''}</p>
                </div>

                {loading ? <Spinner /> : filteredClients.length === 0 ? <Empty msg="No clients registered yet." /> : (
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="hidden sm:grid grid-cols-[2fr_2fr_1.5fr_1fr] gap-4 px-5 py-3 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <span>Name</span><span>Email</span><span>Location</span><span>Phone</span>
                    </div>
                    {filteredClients.map((c, i) => (
                      <div key={c.userId} className={`grid grid-cols-1 sm:grid-cols-[2fr_2fr_1.5fr_1fr] gap-4 px-5 py-4 items-center ${i !== 0 ? 'border-t border-slate-50' : ''} hover:bg-slate-50 transition`}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center shrink-0">
                            {c.name?.charAt(0) ?? c.email?.charAt(0) ?? '?'}
                          </div>
                          <p className="font-semibold text-slate-900 text-sm">{c.name || '(no name)'}</p>
                        </div>
                        <p className="text-sm text-slate-500">{c.email}</p>
                        <p className="text-sm text-slate-500">{c.location || '—'}</p>
                        <p className="text-sm text-slate-500">{c.phone || '—'}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ════════ BOOKINGS ════════ */}
            {section === 'bookings' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                  <div className="flex gap-2">
                    {['all', 'pending', 'confirmed', 'cancelled'].map(s => (
                      <button key={s} onClick={() => setBookingStatus(s)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                          bookingStatus === s ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-300'
                        }`}>
                        {s === 'all' ? `All (${bookings.length})` : `${s} (${bookings.filter(b => b.status === s).length})`}
                      </button>
                    ))}
                  </div>
                </div>

                {loading ? <Spinner /> : filteredBookings.length === 0 ? <Empty msg="No bookings found." /> : (
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="hidden sm:grid grid-cols-[1.5fr_1.5fr_1fr_1fr_auto] gap-4 px-5 py-3 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <span>Client</span><span>Professional</span><span>Date</span><span>Package</span><span>Status</span>
                    </div>
                    {filteredBookings.map((b, i) => (
                      <div key={b.bookingId} className={`grid grid-cols-1 sm:grid-cols-[1.5fr_1.5fr_1fr_1fr_auto] gap-4 px-5 py-4 items-center ${i !== 0 ? 'border-t border-slate-50' : ''} hover:bg-slate-50 transition`}>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">{b.client?.name}</p>
                          <p className="text-xs text-slate-400">{b.client?.email}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">{b.professional?.name}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${svcColor(b.professional?.serviceType)}`}>
                            {svcLabel(b.professional?.serviceType)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm text-slate-700 font-medium">{b.bookingDate}</p>
                          <p className="text-xs text-slate-400">{b.timeSlot}</p>
                        </div>
                        <p className="text-sm text-slate-600">{b.packageName || '—'}</p>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${BOOKING_COLORS[b.status] ?? BOOKING_COLORS.pending}`}>
                          {b.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ════════ REJECTED ════════ */}
            {section === 'rejected' && (
              <div className="space-y-4">
                {loading ? <Spinner /> : rejected.length === 0 ? <Empty msg="No rejected applications." /> :
                  rejected.map(r => (
                    <div key={r.userId} className="bg-white border border-red-100 rounded-2xl p-5 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 font-bold text-lg flex items-center justify-center shrink-0">
                            {r.name?.charAt(0) ?? '?'}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{r.name}</p>
                            <p className="text-xs text-slate-500">{r.email}</p>
                          </div>
                        </div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${svcColor(r.serviceType)}`}>
                          {svcLabel(r.serviceType)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3 text-xs text-slate-600">
                        <div className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5 text-slate-400" />{r.businessName || '—'}</div>
                        <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" />{r.location || '—'}</div>
                        <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" />{r.phone || '—'}</div>
                      </div>

                      {r.rejectionReason && (
                        <div className="bg-red-50 rounded-xl p-3 mb-3 text-xs">
                          <p className="font-semibold text-red-700 mb-1 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> Rejection Reason</p>
                          <p className="text-red-600">{r.rejectionReason}</p>
                        </div>
                      )}

                      <button onClick={() => handleReReview(r.userId, r.name)} disabled={actionLoading === r.userId}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition disabled:opacity-50">
                        {actionLoading === r.userId ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                        Move to Pending Review
                      </button>
                    </div>
                  ))
                }
              </div>
            )}

          </main>
        </div>

        {/* ── Toast ── */}
        {toast && (
          <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold transition-all ${
            toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
          }`}>
            {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            {toast.msg}
          </div>
        )}

        {/* ── Reject Modal ── */}
        {rejectModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center"><XCircle className="w-5 h-5 text-red-500" /></div>
                <div>
                  <h3 className="font-semibold text-slate-900">Reject Application</h3>
                  <p className="text-xs text-slate-500">{rejectModal.name}</p>
                </div>
              </div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Reason for rejection <span className="text-red-500">*</span></label>
              <textarea value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} rows={3}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:border-red-400 focus:ring-2 focus:ring-red-100 outline-none resize-none"
                placeholder="e.g. NIC document link is broken…" />
              <div className="flex gap-3 mt-5">
                <button onClick={() => setRejectModal({ open: false, userId: null, name: '' })}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition">
                  Cancel
                </button>
                <button onClick={handleReject} disabled={!rejectionReason.trim()}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition disabled:opacity-40">
                  Confirm Reject
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </ProtectedRoute>
  );
}
