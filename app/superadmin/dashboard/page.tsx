'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ProtectedRoute } from '@/app/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import {
  ShieldAlert, Activity, Users, Lock, ChevronRight,
  Clock, CheckCircle, XCircle, ExternalLink, RefreshCw,
  FileText, Briefcase, MapPin, Phone, AlertTriangle, UserMinus
} from 'lucide-react';

interface PendingAdmin {
  userId: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  serviceType: string;
  businessName: string;
  nicNumber: string;
  nicDocumentUrl: string;
  businessCertUrl?: string;
  portfolioUrl?: string;
}

interface ActiveAdmin {
  userId: number;
  name: string;
  email: string;
  serviceType: string;
  businessName: string;
  location: string;
}

export default function SuperadminDashboardPage() {
  const { user, token } = useAuth();

  const [pendingAdmins, setPendingAdmins] = useState<PendingAdmin[]>([]);
  const [activeAdmins, setActiveAdmins] = useState<ActiveAdmin[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Reject modal state
  const [rejectModal, setRejectModal] = useState<{ open: boolean; userId: number | null; name: string }>({
    open: false, userId: null, name: ''
  });
  const [rejectionReason, setRejectionReason] = useState('');

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchData = useCallback(async () => {
    setLoadingData(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [pendingRes, allRes] = await Promise.all([
        fetch('http://localhost:5090/api/Admin/pending', { headers }),
        fetch('http://localhost:5090/api/Admin/all', { headers }),
      ]);
      if (pendingRes.ok) setPendingAdmins(await pendingRes.json());
      if (allRes.ok) setActiveAdmins(await allRes.json());
    } catch {
      showToast('Failed to load data.', 'error');
    } finally {
      setLoadingData(false);
    }
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleApprove = async (userId: number) => {
    setActionLoading(userId);
    try {
      const res = await fetch('http://localhost:5090/api/Admin/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId, action: 'approve' }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message, 'success');
        fetchData();
      } else {
        showToast(data.message || 'Failed to approve.', 'error');
      }
    } finally {
      setActionLoading(null);
    }
  };

  const openRejectModal = (userId: number, name: string) => {
    setRejectionReason('');
    setRejectModal({ open: true, userId, name });
  };

  const handleReject = async () => {
    if (!rejectModal.userId || !rejectionReason.trim()) return;
    setActionLoading(rejectModal.userId);
    setRejectModal({ open: false, userId: null, name: '' });
    try {
      const res = await fetch('http://localhost:5090/api/Admin/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId: rejectModal.userId, action: 'reject', rejectionReason }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message, 'success');
        fetchData();
      } else {
        showToast(data.message || 'Failed to reject.', 'error');
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleSuspend = async (userId: number, name: string) => {
    if (!window.confirm(`Are you sure you want to suspend ${name}? They will be demoted to a regular client and lose professional access.`)) return;
    
    setActionLoading(userId);
    try {
      const res = await fetch(`http://localhost:5090/api/Admin/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message || 'Account suspended successfully', 'success');
        fetchData();
      } else {
        showToast(data.message || 'Failed to suspend account.', 'error');
      }
    } catch {
      showToast('Network error while suspending account.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const serviceLabel = (s: string) =>
    ({ photographer: 'Photographer', videographer: 'Videographer', studio: 'Photo Studio', album_printer: 'Album Printer', enlargement_printer: 'Enlargements' }[s] ?? s);

  const serviceColor = (s: string) =>
    ({ photographer: 'bg-blue-100 text-blue-700', videographer: 'bg-purple-100 text-purple-700', studio: 'bg-emerald-100 text-emerald-700', album_printer: 'bg-orange-100 text-orange-700', enlargement_printer: 'bg-rose-100 text-rose-700' }[s] ?? 'bg-gray-100 text-gray-700');

  return (
    <ProtectedRoute allowedRoles={['superadmin']}>
      <div className="min-h-screen bg-slate-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">

        {/* Toast */}
        {toast && (
          <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg text-sm font-medium transition-all ${
            toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
          }`}>
            {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            {toast.message}
          </div>
        )}

        {/* Reject Modal */}
        {rejectModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Reject Application</h3>
                  <p className="text-xs text-gray-500">{rejectModal.name}</p>
                </div>
              </div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason for rejection <span className="text-red-500">*</span></label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:border-red-400 focus:ring-2 focus:ring-red-100 outline-none resize-none"
                placeholder="e.g. NIC document link is broken, please resubmit..."
              />
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => setRejectModal({ open: false, userId: null, name: '' })}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={!rejectionReason.trim()}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition disabled:opacity-40"
                >
                  Confirm Reject
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold tracking-wider uppercase">
                System God Mode
              </div>
              <h1 className="text-3xl sm:text-4xl font-extralight text-slate-900 tracking-tight">
                Superadmin Overview
              </h1>
              <p className="text-sm text-slate-500 font-light">
                Accessed by <span className="font-medium text-indigo-600">{user?.name || 'Superadmin'}</span>. Oversee all platform operations.
              </p>
            </div>
            <button
              onClick={fetchData}
              disabled={loadingData}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { label: 'System Health', value: '99.9%', sub: 'All services operational', icon: Activity, color: 'text-emerald-500', border: 'border-emerald-400' },
              { label: 'Pending Approvals', value: String(pendingAdmins.length), sub: 'Awaiting review', icon: Clock, color: 'text-amber-500', border: 'border-amber-400' },
              { label: 'Active Admins', value: String(activeAdmins.length), sub: 'Professionals on platform', icon: ShieldAlert, color: 'text-indigo-500', border: 'border-indigo-400' },
              { label: 'Security Alerts', value: '0', sub: 'Last 24 hours', icon: Lock, color: 'text-slate-500', border: 'border-slate-400' },
            ].map((m, i) => {
              const Icon = m.icon;
              return (
                <div key={i} className={`bg-white p-6 rounded-2xl border-l-4 shadow-sm hover:shadow-md transition-shadow ${m.border}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2.5 rounded-lg bg-slate-50">
                      <Icon className={`w-5 h-5 ${m.color}`} />
                    </div>
                  </div>
                  <p className="text-3xl font-semibold text-slate-900 mb-1">{m.value}</p>
                  <p className="text-sm font-medium text-slate-700">{m.label}</p>
                  <p className="text-xs text-slate-400 mt-1">{m.sub}</p>
                </div>
              );
            })}
          </div>

          {/* ── Pending Approvals ──────────────────────────────────── */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-medium text-slate-900">Pending Approvals</h2>
                {pendingAdmins.length > 0 && (
                  <span className="px-2.5 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                    {pendingAdmins.length}
                  </span>
                )}
              </div>
            </div>

            {loadingData ? (
              <div className="flex items-center justify-center py-12 text-slate-400 text-sm gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" /> Loading...
              </div>
            ) : pendingAdmins.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">No pending applications. All caught up!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingAdmins.map((admin) => (
                  <div key={admin.userId} className="border border-slate-100 rounded-2xl p-5 hover:border-slate-200 transition-colors">
                    {/* Top row */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg shrink-0">
                          {admin.name?.charAt(0) ?? '?'}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{admin.name}</p>
                          <p className="text-xs text-slate-500">{admin.email}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${serviceColor(admin.serviceType)}`}>
                        {serviceLabel(admin.serviceType)}
                      </span>
                    </div>

                    {/* Info grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                        {admin.businessName || '—'}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {admin.location || '—'}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {admin.phone || '—'}
                      </div>
                    </div>

                    {/* NIC */}
                    <div className="bg-slate-50 rounded-xl p-3 mb-4 text-xs space-y-2">
                      <p className="font-medium text-slate-700 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" /> Submitted Documents
                      </p>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">NIC: <span className="text-slate-700 font-medium">{admin.nicNumber}</span></span>
                          <a href={admin.nicDocumentUrl} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium">
                            View NIC <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        {admin.businessCertUrl && (
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Business Certificate</span>
                            <a href={admin.businessCertUrl} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium">
                              View Cert <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                        {admin.portfolioUrl && (
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Portfolio</span>
                            <a href={admin.portfolioUrl} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium">
                              View Portfolio <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApprove(admin.userId)}
                        disabled={actionLoading === admin.userId}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition disabled:opacity-50"
                      >
                        <CheckCircle className="w-4 h-4" />
                        {actionLoading === admin.userId ? 'Processing...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => openRejectModal(admin.userId, admin.name)}
                        disabled={actionLoading === admin.userId}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-sm font-medium transition disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Active Admins ───────────────────────────────────────── */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium text-slate-900">Active Admins</h2>
              <span className="text-sm text-slate-400">{activeAdmins.length} total</span>
            </div>

            {loadingData ? (
              <div className="flex items-center justify-center py-8 text-slate-400 text-sm gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" /> Loading...
              </div>
            ) : activeAdmins.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">No active admins yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {activeAdmins.map((admin) => (
                  <div key={admin.userId} className="group flex items-center justify-between py-3 px-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium">
                          {admin.name?.charAt(0) ?? '?'}
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{admin.name}</p>
                        <p className="text-xs text-slate-500">{admin.email} · {admin.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${serviceColor(admin.serviceType)}`}>
                        {serviceLabel(admin.serviceType)}
                      </span>
                      <button 
                        onClick={() => handleSuspend(admin.userId, admin.name)}
                        disabled={actionLoading === admin.userId}
                        className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors group-hover:opacity-100 opacity-0 md:opacity-100 disabled:opacity-50"
                        title="Suspend Account"
                      >
                        {actionLoading === admin.userId ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UserMinus className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
