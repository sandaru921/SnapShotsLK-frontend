'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, Camera, Video, Building, Image, FileText, Link2, Clock } from 'lucide-react';

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
    serviceType: 'photographer',
    businessName: '',
    // Proof documents
    nicNumber: '',
    nicDocumentUrl: '',
    businessCertUrl: '',
    portfolioUrl: '',
    agreeTerms: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (!formData.agreeTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5090/api/Auth/register-professional', {
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Show pending approval screen (no login)
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const serviceTypes = [
    { value: 'photographer', label: 'Photographer', icon: Camera },
    { value: 'videographer', label: 'Videographer', icon: Video },
    { value: 'studio', label: 'Photo Studio', icon: Building },
    { value: 'printing', label: 'Printing Service', icon: Image },
  ];

  // ── Success / Pending screen ───────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full">
          <div className="bg-white rounded-3xl shadow-2xl border border-amber-100 p-10 text-center">
            {/* Animated clock icon */}
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

            <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
            <p className="text-amber-700 font-medium text-sm mb-4">Status: Pending SuperAdmin Approval</p>

            <div className="bg-amber-50 rounded-2xl p-5 mb-6 text-left space-y-2">
              <p className="text-sm text-gray-700 font-medium">What happens next?</p>
              <ul className="text-sm text-gray-600 space-y-2 mt-2">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
                  Our team will review your submitted proof documents.
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
                  Once verified, your account will be approved and you can log in.
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
                  If rejected, you&apos;ll see the reason when you try to log in.
                </li>
              </ul>
            </div>

            <p className="text-xs text-gray-400 mb-6">
              Registered as: <span className="font-medium text-gray-600">{formData.email}</span>
            </p>

            <Link
              href="/"
              className="inline-block w-full py-3 bg-amber-700 hover:bg-amber-800 text-white font-medium rounded-xl transition text-sm"
            >
              Back to Home
            </Link>
            <p className="text-xs text-gray-400 mt-4">
              Already approved?{' '}
              <Link href="/user/login" className="text-amber-700 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Registration form ──────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-light tracking-wider">
              SNAPSHOTS<span className="font-semibold text-amber-700">LK</span>
            </h1>
          </Link>
          <p className="text-gray-600 mt-2">Apply as a Professional</p>
          <p className="text-xs text-amber-700 mt-1 font-medium">
            Requires SuperAdmin approval before login
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ── Service Type ── */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
              <div className="grid grid-cols-2 gap-2">
                {serviceTypes.map((service) => {
                  const Icon = service.icon;
                  return (
                    <button
                      key={service.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, serviceType: service.value })}
                      className={`p-3 border-2 rounded-lg text-xs font-medium transition flex flex-col items-center gap-2 ${
                        formData.serviceType === service.value
                          ? 'border-amber-700 bg-amber-50 text-amber-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {service.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Business Name ── */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-amber-700 focus:ring-2 focus:ring-amber-100 outline-none transition"
                  placeholder="Your Studio / Business Name"
                />
              </div>
            </div>

            {/* ── Full Name ── */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-amber-700 focus:ring-2 focus:ring-amber-100 outline-none transition"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* ── Email ── */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-amber-700 focus:ring-2 focus:ring-amber-100 outline-none transition"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* ── Phone + Location ── */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-amber-700 focus:ring-2 focus:ring-amber-100 outline-none transition"
                    placeholder="+94 77 123 4567"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-amber-700 focus:ring-2 focus:ring-amber-100 outline-none transition"
                    placeholder="Colombo"
                  />
                </div>
              </div>
            </div>

            {/* ── Password ── */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:border-amber-700 focus:ring-2 focus:ring-amber-100 outline-none transition"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-amber-700 focus:ring-2 focus:ring-amber-100 outline-none transition"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {/* ── Proof Documents ── */}
            <div className="pt-2">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-amber-700" />
                <h3 className="text-sm font-semibold text-gray-800">Verification Documents</h3>
                <span className="text-xs text-gray-400">(Share as public links)</span>
              </div>

              <div className="space-y-4 bg-amber-50 rounded-xl p-4 border border-amber-100">
                {/* NIC Number */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    NIC Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nicNumber}
                    onChange={(e) => setFormData({ ...formData, nicNumber: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:border-amber-700 focus:ring-2 focus:ring-amber-100 outline-none transition text-sm"
                    placeholder="e.g. 200012345678"
                  />
                </div>

                {/* NIC Document URL */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    NIC Document Link <span className="text-red-500">*</span>
                    <span className="text-gray-400 font-normal ml-1">(Google Drive / Dropbox public link)</span>
                  </label>
                  <div className="relative">
                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="url"
                      required
                      value={formData.nicDocumentUrl}
                      onChange={(e) => setFormData({ ...formData, nicDocumentUrl: e.target.value })}
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:border-amber-700 focus:ring-2 focus:ring-amber-100 outline-none transition text-sm"
                      placeholder="https://drive.google.com/..."
                    />
                  </div>
                </div>

                {/* Business Certificate URL */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Business Certificate Link
                    <span className="text-gray-400 font-normal ml-1">(optional)</span>
                  </label>
                  <div className="relative">
                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="url"
                      value={formData.businessCertUrl}
                      onChange={(e) => setFormData({ ...formData, businessCertUrl: e.target.value })}
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:border-amber-700 focus:ring-2 focus:ring-amber-100 outline-none transition text-sm"
                      placeholder="https://drive.google.com/..."
                    />
                  </div>
                </div>

                {/* Portfolio URL */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Portfolio Link
                    <span className="text-gray-400 font-normal ml-1">(optional but recommended)</span>
                  </label>
                  <div className="relative">
                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="url"
                      value={formData.portfolioUrl}
                      onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:border-amber-700 focus:ring-2 focus:ring-amber-100 outline-none transition text-sm"
                      placeholder="https://yourportfolio.com or Instagram"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Terms ── */}
            <div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                  className="w-4 h-4 text-amber-700 border-gray-300 rounded focus:ring-amber-500 mt-0.5"
                />
                <span className="text-sm text-gray-600">
                  I agree to the{' '}
                  <Link href="/terms" className="text-amber-700 hover:text-amber-800">Terms & Conditions</Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-amber-700 hover:text-amber-800">Privacy Policy</Link>.
                  I confirm all submitted documents are genuine.
                </span>
              </label>
            </div>

            {/* ── Submit ── */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-amber-700 hover:bg-amber-800 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting Application...' : 'Submit Application for Approval'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center space-y-2">
            <p className="text-xs text-gray-600">
              Not a professional?{' '}
              <Link href="/user/register" className="text-amber-700 hover:text-amber-800 font-medium">
                Register as user
              </Link>
            </p>
            <p className="text-xs text-gray-600">
              Already have an account?{' '}
              <Link href="/user/login" className="text-amber-700 hover:text-amber-800 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}