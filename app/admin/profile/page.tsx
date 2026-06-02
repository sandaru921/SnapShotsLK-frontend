'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Camera, Image as ImageIcon, Link2, Plus, Trash2, Save, User, Settings, Package as PackageIcon, Instagram, Facebook, Globe, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ProtectedRoute } from '@/app/components/ProtectedRoute';
import AdminLayout from '@/app/components/AdminLayout';

// Interfaces matching the DTOs and Data
interface PackageDto {
  name: string;
  price: string;
  duration: string;
  isPopular: boolean;
  features: string[];
}

interface ProfileUpdateDto {
  bio: string;
  avatarUrl: string;
  coverImageUrl: string;
  experience: string;
  about: string;
  responseTime: string;
  availability: string;
  instagramUrl: string;
  facebookUrl: string;
  websiteUrl: string;
  specialties: string[];
  portfolioUrls: string[];
  languages: string[];
  achievements: string[];
  packages: PackageDto[];
}

export default function AdminProfilePage() {
  const { user, token } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'basic' | 'portfolio' | 'packages'>('basic');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  const [formData, setFormData] = useState<ProfileUpdateDto>({
    bio: '',
    avatarUrl: '',
    coverImageUrl: '',
    experience: '',
    about: '',
    responseTime: '',
    availability: '',
    instagramUrl: '',
    facebookUrl: '',
    websiteUrl: '',
    specialties: [],
    portfolioUrls: [],
    languages: [],
    achievements: [],
    packages: [],
  });

  // Load Profile Data on Mount
  useEffect(() => {
    if (!token) {
       // Stop the loading spinner if token is missing (ProtectedRoute will boot them anyway)
       setLoading(false);
       return;
    }

    const fetchProfile = async () => {
      try {
        const cleanToken = (token ?? '').trim().replace(/"/g, '');
        const response = await fetch('http://localhost:5090/api/Profile/me', {
          headers: { 'Authorization': `Bearer ${cleanToken}` }
        });
        if (response.ok) {
          const data = await response.json();
          if (data.exists && data.profile) {
             // Map backend response properties to frontend state camelCase
            setFormData({
              bio: data.profile.bio || '',
              avatarUrl: data.profile.avatarUrl || '',
              coverImageUrl: data.profile.coverImageUrl || '',
              experience: data.profile.experience || '',
              about: data.profile.about || '',
              responseTime: data.profile.responseTime || '',
              availability: data.profile.availability || '',
              instagramUrl: data.profile.instagramUrl || '',
              facebookUrl: data.profile.facebookUrl || '',
              websiteUrl: data.profile.websiteUrl || '',
              specialties: data.profile.specialties || [],
              portfolioUrls: data.profile.portfolioUrls || [],
              languages: data.profile.languages || [],
              achievements: data.profile.achievements || [],
              packages: data.profile.packages || [],
            });
          }
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const cleanToken = (token ?? '').trim().replace(/"/g, '');
      const response = await fetch('http://localhost:5090/api/Profile/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cleanToken}`
        },
        body: JSON.stringify(formData)
      });
      
      const responseText = await response.text();
      let data: any = {};
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        data = { message: responseText || `HTTP Error ${response.status}` };
      }

      if (!response.ok) throw new Error(data.message || `Failed to save profile. Status: ${response.status}`);
      
      setMessage({ type: 'success', text: 'Profile globally updated successfully!' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'An error occurred' });
    } finally {
      setSaving(false);
    }
  };

  const addArrayItem = (field: 'specialties' | 'languages' | 'achievements' | 'portfolioUrls') => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const updateArrayItem = (field: 'specialties' | 'languages' | 'achievements' | 'portfolioUrls', index: number, value: string) => {
    setFormData(prev => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const removeArrayItem = (field: 'specialties' | 'languages' | 'achievements' | 'portfolioUrls', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const addPackage = () => {
    setFormData(prev => ({
      ...prev,
      packages: [...prev.packages, { name: '', price: '', duration: '', isPopular: false, features: [] }]
    }));
  };

  const updatePackage = (pkgIndex: number, field: keyof PackageDto, value: any) => {
    setFormData(prev => {
      const newPackages = [...prev.packages];
      newPackages[pkgIndex] = { ...newPackages[pkgIndex], [field]: value };
      return { ...prev, packages: newPackages };
    });
  };

  const removePackage = (pkgIndex: number) => {
    setFormData(prev => ({
      ...prev,
      packages: prev.packages.filter((_, i) => i !== pkgIndex)
    }));
  };

  const addPackageFeature = (pkgIndex: number) => {
    setFormData(prev => {
      const newPackages = [...prev.packages];
      newPackages[pkgIndex].features.push('');
      return { ...prev, packages: newPackages };
    });
  };

  const updatePackageFeature = (pkgIndex: number, featureIndex: number, value: string) => {
    setFormData(prev => {
      const newPackages = [...prev.packages];
      newPackages[pkgIndex].features[featureIndex] = value;
      return { ...prev, packages: newPackages };
    });
  };

  const removePackageFeature = (pkgIndex: number, featureIndex: number) => {
    setFormData(prev => {
      const newPackages = [...prev.packages];
      newPackages[pkgIndex].features = newPackages[pkgIndex].features.filter((_, i) => i !== featureIndex);
      return { ...prev, packages: newPackages };
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-700 animate-spin" />
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminLayout>
      <div className="min-h-screen bg-transparent pb-12 w-full">
        {/* Header Ribbon */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm w-full">
          <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 text-amber-800 rounded-lg">
                <Settings className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Creator Studio</h1>
            </div>
            
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 bg-gray-900 hover:bg-black text-white rounded-lg font-medium transition disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Publish Changes'}
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          {message && (
             <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${message.type === 'error' ? 'bg-red-50 text-red-800 border-red-200 border' : 'bg-green-50 text-green-800 border-green-200 border'}`}>
               {message.type === 'error' ? <AlertCircle className="w-5 h-5 mt-0.5" /> : <CheckCircle2 className="w-5 h-5 mt-0.5" />}
               <p className="font-medium">{message.text}</p>
             </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="w-full lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
                <nav className="flex flex-col">
                  <button
                    onClick={() => setActiveTab('basic')}
                    className={`flex items-center gap-3 px-6 py-4 text-sm font-medium transition border-l-4 ${activeTab === 'basic' ? 'border-amber-700 bg-amber-50 text-amber-900' : 'border-transparent text-gray-600 hover:bg-gray-50'}`}
                  >
                    <User className="w-5 h-5" /> Provider Details
                  </button>
                  <button
                    onClick={() => setActiveTab('portfolio')}
                    className={`flex items-center gap-3 px-6 py-4 text-sm font-medium transition border-l-4 ${activeTab === 'portfolio' ? 'border-amber-700 bg-amber-50 text-amber-900' : 'border-transparent text-gray-600 hover:bg-gray-50 border-t border-gray-100'}`}
                  >
                    <ImageIcon className="w-5 h-5" /> Portfolio Showcase
                  </button>
                  <button
                    onClick={() => setActiveTab('packages')}
                    className={`flex items-center gap-3 px-6 py-4 text-sm font-medium transition border-l-4 ${activeTab === 'packages' ? 'border-amber-700 bg-amber-50 text-amber-900' : 'border-transparent text-gray-600 hover:bg-gray-50 border-t border-gray-100'}`}
                  >
                    <PackageIcon className="w-5 h-5" /> Pricing Packages
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Editor Surface */}
            <div className="flex-grow">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
                
                {/* BASIC INFO TAB */}
                {activeTab === 'basic' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-1">Public Presentation</h2>
                      <p className="text-sm text-gray-500 mb-6">This is how you appear internally and on your main page banner.</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-1 md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image URL</label>
                          <input type="text" value={formData.coverImageUrl} onChange={e => setFormData({...formData, coverImageUrl: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-100 focus:border-amber-700" placeholder="https://example.com/cover.jpg" />
                          {formData.coverImageUrl && <div className="mt-3 h-32 rounded-lg bg-gray-100 overflow-hidden"><img src={formData.coverImageUrl} className="w-full h-full object-cover" alt="Cover Preview" /></div>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Avatar URL</label>
                          <input type="text" value={formData.avatarUrl} onChange={e => setFormData({...formData, avatarUrl: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-100 focus:border-amber-700" placeholder="https://example.com/me.jpg" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Short Tagline (Bio)</label>
                          <input type="text" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-100 focus:border-amber-700" placeholder="Award winning wedding photographer..." />
                        </div>

                        <div className="col-span-1 md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Full About Biography</label>
                          <textarea rows={4} value={formData.about} onChange={e => setFormData({...formData, about: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-100 focus:border-amber-700" placeholder="Tell your story to clients..."></textarea>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                          <input type="text" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-100 focus:border-amber-700" placeholder="e.g. 5 Years" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                          <input type="text" value={formData.availability} onChange={e => setFormData({...formData, availability: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-100 focus:border-amber-700" placeholder="e.g. Booking for 2026" />
                        </div>
                      </div>
                    </div>

                    <hr className="border-gray-200" />

                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-1">Social Links</h2>
                      <p className="text-sm text-gray-500 mb-6">Drive traffic to your other platforms.</p>
                      
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center flex-shrink-0 text-pink-600"><Instagram className="w-5 h-5"/></div>
                          <input type="text" value={formData.instagramUrl} onChange={e => setFormData({...formData, instagramUrl: e.target.value})} className="flex-grow px-4 py-2 border border-gray-300 rounded-lg" placeholder="Instagram Profile URL" />
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600"><Facebook className="w-5 h-5"/></div>
                          <input type="text" value={formData.facebookUrl} onChange={e => setFormData({...formData, facebookUrl: e.target.value})} className="flex-grow px-4 py-2 border border-gray-300 rounded-lg" placeholder="Facebook Page URL" />
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-600"><Globe className="w-5 h-5"/></div>
                          <input type="text" value={formData.websiteUrl} onChange={e => setFormData({...formData, websiteUrl: e.target.value})} className="flex-grow px-4 py-2 border border-gray-300 rounded-lg" placeholder="Personal Website URL" />
                        </div>
                      </div>
                    </div>

                    <hr className="border-gray-200" />

                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-1">Properties & Tags</h2>
                        <p className="text-sm text-gray-500 mb-6">Help clients filter and find you better.</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Specialties */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-medium text-gray-700">Specialties</label>
                                    <button onClick={() => addArrayItem('specialties')} className="text-xs text-amber-700 hover:bg-amber-50 px-2 py-1 rounded">Add +</button>
                                </div>
                                <div className="space-y-2">
                                    {formData.specialties.map((spec, i) => (
                                        <div key={i} className="flex gap-2">
                                            <input type="text" value={spec} onChange={e => updateArrayItem('specialties', i, e.target.value)} className="flex-grow px-3 py-1.5 text-sm border border-gray-300 rounded-md" placeholder="e.g. Drone Videography"/>
                                            <button onClick={() => removeArrayItem('specialties', i)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-md"><Trash2 className="w-4 h-4"/></button>
                                        </div>
                                    ))}
                                    {formData.specialties.length === 0 && <p className="text-xs text-gray-400 italic">No specialties added.</p>}
                                </div>
                            </div>
                            
                            {/* Languages */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-medium text-gray-700">Languages Spoken</label>
                                    <button onClick={() => addArrayItem('languages')} className="text-xs text-amber-700 hover:bg-amber-50 px-2 py-1 rounded">Add +</button>
                                </div>
                                <div className="space-y-2">
                                    {formData.languages.map((lang, i) => (
                                        <div key={i} className="flex gap-2">
                                            <input type="text" value={lang} onChange={e => updateArrayItem('languages', i, e.target.value)} className="flex-grow px-3 py-1.5 text-sm border border-gray-300 rounded-md" placeholder="e.g. English, Sinhala"/>
                                            <button onClick={() => removeArrayItem('languages', i)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-md"><Trash2 className="w-4 h-4"/></button>
                                        </div>
                                    ))}
                                    {formData.languages.length === 0 && <p className="text-xs text-gray-400 italic">No languages added.</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                  </div>
                )}


                {/* PORTFOLIO TAB */}
                {activeTab === 'portfolio' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900 mb-1">Visual Portfolio</h2>
                          <p className="text-sm text-gray-500">Link high-quality images showcasing your best work.</p>
                        </div>
                        <button onClick={() => addArrayItem('portfolioUrls')} className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg font-medium transition">
                          <Plus className="w-4 h-4" /> Add Image Hub
                        </button>
                      </div>

                      {formData.portfolioUrls.length === 0 ? (
                         <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <h3 className="text-gray-900 font-medium mb-1">Your Portfolio is Empty</h3>
                            <p className="text-gray-500 text-sm">Add image URLs to show up in the gallery.</p>
                         </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {formData.portfolioUrls.map((url, i) => (
                            <div key={i} className="group relative border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                              {url ? (
                                <img src={url} alt={`Portfolio ${i}`} className="w-full aspect-square object-cover" />
                              ) : (
                                <div className="w-full aspect-square flex items-center justify-center bg-gray-100 text-gray-400">
                                  <Link2 className="w-8 h-8" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-4">
                                <input 
                                  type="text" 
                                  value={url} 
                                  onChange={e => updateArrayItem('portfolioUrls', i, e.target.value)} 
                                  className="w-full px-3 py-2 text-sm bg-white border-0 rounded mb-2 focus:ring-2 focus:ring-amber-500" 
                                  placeholder="Paste Image URL..."
                                />
                                <button onClick={() => removeArrayItem('portfolioUrls', i)} className="w-full py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition flex items-center justify-center gap-1">
                                  <Trash2 className="w-4 h-4"/> Remove
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}


                {/* PACKAGES TAB */}
                {activeTab === 'packages' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                     <div className="flex items-center justify-between mb-4">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900 mb-1">Service Packages</h2>
                          <p className="text-sm text-gray-500">Define the exact pricing tiers clients can book.</p>
                        </div>
                        <button onClick={addPackage} className="flex items-center gap-2 px-4 py-2 bg-amber-700 text-white hover:bg-amber-800 rounded-lg font-medium transition shadow-md">
                          <Plus className="w-4 h-4" /> New Package
                        </button>
                      </div>

                      {formData.packages.length === 0 ? (
                         <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                            <PackageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <h3 className="text-gray-900 font-medium mb-1">No Packages Active</h3>
                            <p className="text-gray-500 text-sm">Create your first tier package for clients to book.</p>
                         </div>
                      ) : (
                        <div className="space-y-6">
                            {formData.packages.map((pkg, pIdx) => (
                                <div key={pIdx} className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm hover:border-amber-200 transition relative group">
                                    <button onClick={() => removePackage(pIdx)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition opacity-0 group-hover:opacity-100">
                                        <Trash2 className="w-5 h-5"/>
                                    </button>

                                    <div className="grid md:grid-cols-3 gap-6 mb-6">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Package Name</label>
                                            <input type="text" value={pkg.name} onChange={e => updatePackage(pIdx, 'name', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 font-medium" placeholder="e.g. Golden Wedding Core"/>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Price</label>
                                            <input type="text" value={pkg.price} onChange={e => updatePackage(pIdx, 'price', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-amber-700 font-medium" placeholder="LKR 150,000"/>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Delivery / Duration</label>
                                            <input type="text" value={pkg.duration} onChange={e => updatePackage(pIdx, 'duration', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" placeholder="Full Day Shoot"/>
                                        </div>
                                    </div>

                                    <div className="mb-4 flex items-center gap-2">
                                        <input type="checkbox" checked={pkg.isPopular} onChange={e => updatePackage(pIdx, 'isPopular', e.target.checked)} className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"/>
                                        <label className="text-sm text-gray-700 font-medium">Highlight as "Most Popular"</label>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm font-semibold text-gray-700">Deliverable Features</span>
                                            <button onClick={() => addPackageFeature(pIdx)} className="text-xs text-amber-700 bg-amber-100 hover:bg-amber-200 px-2 py-1 rounded transition">Add Feature +</button>
                                        </div>
                                        <div className="space-y-2">
                                            {pkg.features.map((feature, fIdx) => (
                                                <div key={fIdx} className="flex gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                                                    <input type="text" value={feature} onChange={e => updatePackageFeature(pIdx, fIdx, e.target.value)} className="flex-grow px-2 py-1 text-sm border border-transparent hover:border-gray-300 outline-none focus:bg-white focus:border-amber-500 transition rounded" placeholder="e.g. 100 High Res Edited Photos"/>
                                                    <button onClick={() => removePackageFeature(pIdx, fIdx)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4"/></button>
                                                </div>
                                            ))}
                                            {pkg.features.length === 0 && <p className="text-xs text-gray-400">Add features that clients will receive in this package list.</p>}
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>
                      )}
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
      </AdminLayout>
    </ProtectedRoute>
  );
}
