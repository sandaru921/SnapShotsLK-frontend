'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Eye, EyeOff, Mail, Lock, User, Phone, MapPin,
  Camera, Video, Building2, Image, FileText, Link2, Clock, BookOpen, Maximize2
} from 'lucide-react';

const SERVICE_TYPES = [
  {
    value: 'photographer',
    label: 'Photographer',
    icon: Camera,
    color: 'from-amber-50 to-orange-50 border-amber-300 text-amber-700',
    hint: 'Wedding, portrait, event & commercial photographers',
    profileType: 'Photographer profile',
  },
  {
    value: 'videographer',
    label: 'Videographer',
    icon: Video,
    color: 'from-blue-50 to-sky-50 border-blue-300 text-blue-700',
    hint: 'Wedding films, corporate videos, music videos & reels',
    profileType: 'Videographer profile',
  },
  {
    value: 'studio',
    label: 'Photo Studio',
    icon: Building2,
    color: 'from-purple-50 to-violet-50 border-purple-300 text-purple-700',
    hint: 'Rental studio spaces with lighting & equipment',
    profileType: 'Studio profile',
  },
  {
    value: 'album_printer',
    label: 'Album Printing',
    icon: BookOpen,
    color: 'from-green-50 to-emerald-50 border-green-300 text-green-700',
    hint: 'Photo books, wedding albums & custom print products',
    profileType: 'Album service profile',
  },
  {
    value: 'enlargement_printer',
    label: 'Enlargements',
    icon: Maximize2,
    color: 'from-rose-50 to-pink-50 border-rose-300 text-rose-700',
    hint: 'Large format prints, canvas, metal & wall art',
    profileType: 'Printing service profile',
  },
];

export default function RegisterProfessionalPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    password: '',
    confirmPassword: '',
    serviceType: '',
    businessName: '',
    nicNumber: '',
    nicDocumentUrl: '',
    businessCertUrl: '',
    portfolioUrl: '',
    agreeTerms: false,
  });

  const selectedService = SERVICE_TYPES.find(s => s.value === formData.serviceType);

  const set = (field: string, value: any) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.serviceType) { setError('Please select your service type.'); return; }
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match.'); return; }
    if (formData.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (!formData.agreeTerms) { setError('Please agree to the terms and conditions.'); return; }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5090/api/Auth/register-professional', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          password: formData.password,
          role: 'pending_admin',
          serviceType: formData.serviceType,
          businessName: formData.businessName,
          nicNumber: formData.nicNumber,
          nicDocumentUrl: formData.nicDocumentUrl,
          businessCertUrl: formData.businessCertUrl || null,
          portfolioUrl: formData.portfolioUrl || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Success screen ───────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full">
          <div className="bg-white rounded-3xl shadow-2xl border border-amber-100 p-10 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center animate-pulse">
                  <Clock className="w-10 h-10 text-amber-600" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Application Submitted! 🎉</h2>
            <p className="text-amber-700 font-medium text-sm mb-1">
              Registered as: <strong>{selectedService?.label}</strong>
            </p>
            <p className="text-gray-500 text-xs mb-6">Status: Awaiting SuperAdmin review</p>

            <div className="bg-amber-50 rounded-2xl p-5 mb-6 text-left space-y-3">
              <p className="text-sm font-semibold text-gray-800">What happens next?</p>
              {[
                'Our team reviews your submitted NIC and business documents.',
                'Once verified, your account will be activated and you can log in.',
                `You can then set up your ${selectedService?.profileType ?? 'profile'} and start receiving bookings.`,
                'If rejected, you\'ll see the reason when you try to sign in.',
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                  <p className="text-sm text-gray-600">{step}</p>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-400 mb-5">Account email: <span className="font-medium text-gray-600">{formData.email}</span></p>
            <Link href="/" className="block w-full py-3 bg-amber-700 hover:bg-amber-800 text-white font-semibold rounded-xl transition text-sm text-center">
              Back to Home
            </Link>
            <p className="text-xs text-gray-400 mt-4">
              Already approved?{' '}
              <Link href="/user/login" className="text-amber-700 hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-light tracking-wider">
          SNAPSHOTS<span className="font-bold text-amber-700">LK</span>
        </Link>
        <span className="text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full font-medium border border-amber-200">
          🔒 All registrations require SuperAdmin approval
        </span>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join as a Professional</h1>
          <p className="text-gray-500">Choose your category and create your professional listing on SnapshotsLK.</p>
        </div>

        {/* ── Step 1: Service Type Selector ── */}
        <div className="mb-8">
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-700 text-white text-xs flex items-center justify-center font-bold">1</span>
            What kind of service do you offer?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {SERVICE_TYPES.map(service => {
              const Icon = service.icon;
              const isSelected = formData.serviceType === service.value;
              return (
                <button
                  key={service.value}
                  type="button"
                  onClick={() => set('serviceType', service.value)}
                  className={`p-4 border-2 rounded-2xl text-left transition-all group ${
                    isSelected
                      ? `bg-gradient-to-br ${service.color} shadow-md scale-[1.02]`
                      : 'border-gray-200 bg-white hover:border-amber-300 hover:shadow-sm'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-all ${
                    isSelected ? 'bg-white shadow-sm' : 'bg-gray-100 group-hover:bg-amber-50'
                  }`}>
                    <Icon className={`w-5 h-5 ${isSelected ? service.color.split(' ').find(c => c.startsWith('text-')) : 'text-gray-500'}`} />
                  </div>
                  <p className={`text-sm font-bold mb-0.5 ${isSelected ? service.color.split(' ').find(c => c.startsWith('text-')) : 'text-gray-800'}`}>
                    {service.label}
                  </p>
                  <p className="text-xs text-gray-500 leading-snug">{service.hint}</p>
                  {isSelected && (
                    <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-green-600">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      Selected
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          {selectedService && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-2 text-sm text-blue-800">
              <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              A <strong>{selectedService.profileType}</strong> will be created under your account after approval.
            </div>
          )}
        </div>

        {/* ── Step 2: Business Details ── */}
        <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 ${!formData.serviceType ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-700 text-white text-xs flex items-center justify-center font-bold">2</span>
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Business & Contact Details</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
              </div>
            )}

            {/* Business Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Business / Studio Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" required value={formData.businessName} onChange={e => set('businessName', e.target.value)}
                  placeholder={selectedService?.value === 'photographer' ? 'e.g. Silva Photography' : selectedService?.value === 'studio' ? 'e.g. Luminous Studios' : 'e.g. CeylonPrints'}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl focus:border-amber-600 focus:ring-2 focus:ring-amber-100 outline-none text-sm transition" />
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Full Name <span className="text-red-500">*</span></label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" required value={formData.name} onChange={e => set('name', e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl focus:border-amber-600 focus:ring-2 focus:ring-amber-100 outline-none text-sm transition" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address <span className="text-red-500">*</span></label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" required value={formData.email} onChange={e => set('email', e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl focus:border-amber-600 focus:ring-2 focus:ring-amber-100 outline-none text-sm transition" />
              </div>
            </div>

            {/* Phone + Location */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="tel" required value={formData.phone} onChange={e => set('phone', e.target.value)}
                    placeholder="+94 77 123 4567"
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl focus:border-amber-600 focus:ring-2 focus:ring-amber-100 outline-none text-sm transition" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">City / District <span className="text-red-500">*</span></label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" required value={formData.location} onChange={e => set('location', e.target.value)}
                    placeholder="Colombo"
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl focus:border-amber-600 focus:ring-2 focus:ring-amber-100 outline-none text-sm transition" />
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type={showPassword ? 'text' : 'password'} required minLength={8}
                    value={formData.password} onChange={e => set('password', e.target.value)} placeholder="Min. 8 chars"
                    className="w-full pl-9 pr-9 py-2.5 border border-gray-300 rounded-xl focus:border-amber-600 focus:ring-2 focus:ring-amber-100 outline-none text-sm transition" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type={showPassword ? 'text' : 'password'} required
                    value={formData.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} placeholder="Repeat password"
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl focus:border-amber-600 focus:ring-2 focus:ring-amber-100 outline-none text-sm transition" />
                </div>
              </div>
            </div>

            {/* Verification Documents */}
            <div className="pt-1">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-amber-700" />
                <h3 className="text-sm font-bold text-gray-800">Verification Documents</h3>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Share as public links (Google Drive / Dropbox)</span>
              </div>
              <div className="space-y-3 bg-amber-50 rounded-2xl p-4 border border-amber-100">
                {/* NIC Number */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">NIC Number <span className="text-red-500">*</span></label>
                  <input type="text" required value={formData.nicNumber} onChange={e => set('nicNumber', e.target.value)}
                    placeholder="e.g. 200012345678"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:border-amber-600 focus:ring-1 focus:ring-amber-100 outline-none text-sm transition" />
                </div>
                {/* NIC Document */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    NIC Document Link <span className="text-red-500">*</span>
                    <span className="text-gray-400 font-normal ml-1">(public link to scanned copy)</span>
                  </label>
                  <div className="relative">
                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input type="url" required value={formData.nicDocumentUrl} onChange={e => set('nicDocumentUrl', e.target.value)}
                      placeholder="https://drive.google.com/..."
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-xl focus:border-amber-600 focus:ring-1 focus:ring-amber-100 outline-none text-sm transition" />
                  </div>
                </div>
                {/* Business Cert */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Business Registration Certificate
                    <span className="text-gray-400 font-normal ml-1">(optional)</span>
                  </label>
                  <div className="relative">
                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input type="url" value={formData.businessCertUrl} onChange={e => set('businessCertUrl', e.target.value)}
                      placeholder="https://drive.google.com/..."
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-xl focus:border-amber-600 focus:ring-1 focus:ring-amber-100 outline-none text-sm transition" />
                  </div>
                </div>
                {/* Portfolio */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Portfolio / Sample Work Link
                    <span className="text-gray-400 font-normal ml-1">(optional but recommended)</span>
                  </label>
                  <div className="relative">
                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input type="url" value={formData.portfolioUrl} onChange={e => set('portfolioUrl', e.target.value)}
                      placeholder="https://yoursite.com or Instagram profile"
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-xl focus:border-amber-600 focus:ring-1 focus:ring-amber-100 outline-none text-sm transition" />
                  </div>
                </div>
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input type="checkbox" checked={formData.agreeTerms} onChange={e => set('agreeTerms', e.target.checked)}
                className="w-4 h-4 text-amber-700 border-gray-300 rounded focus:ring-amber-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-600">
                I agree to the{' '}
                <Link href="/terms" className="text-amber-700 hover:underline">Terms & Conditions</Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-amber-700 hover:underline">Privacy Policy</Link>.
                I confirm all submitted documents are genuine.
              </span>
            </label>

            <button type="submit" disabled={loading || !formData.serviceType}
              className="w-full py-3.5 bg-amber-700 hover:bg-amber-800 text-white font-semibold rounded-xl transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting Application…
                </span>
              ) : 'Submit Application for SuperAdmin Approval'}
            </button>

            <div className="pt-2 border-t border-gray-100 text-center space-y-1">
              <p className="text-xs text-gray-500">
                Not a professional?{' '}
                <Link href="/user/register" className="text-amber-700 hover:underline font-medium">Register as a client</Link>
              </p>
              <p className="text-xs text-gray-500">
                Already have an account?{' '}
                <Link href="/user/login" className="text-amber-700 hover:underline font-medium">Sign in</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}