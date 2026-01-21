// filepath: /Users/sandarurohana/Documents/projects/3rd year project/SnapShotsLK-frontend/components/ProfileView.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Star, MapPin, Calendar, Clock, CheckCircle, MessageCircle, 
  Heart, Share2, Camera, Award, Users, Briefcase, Mail, Phone,
  Instagram, Facebook, Globe, ChevronLeft, ChevronRight, X
} from 'lucide-react';

interface Package {
  name: string;
  price: string;
  duration: string;
  features: string[];
  popular?: boolean;
}

interface Review {
  name: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  images?: string[];
}

interface ProfileData {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  location: string;
  experience: string;
  specialty: string[];
  about: string;
  packages: Package[];
  portfolio: string[];
  reviews: Review[];
  achievements: string[];
  responseTime: string;
  languages: string[];
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    website?: string;
  };
  contact: {
    email: string;
    phone: string;
  };
  availability: string;
}

interface ProfileViewProps {
  data: ProfileData;
  type: 'photographer' | 'videographer';
}

export const ProfileView: React.FC<ProfileViewProps> = ({ data, type }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'reviews' | 'packages'>('portfolio');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Image */}
      <div className="relative h-64 md:h-80 bg-gray-900">
        <img 
          src={data.coverImage} 
          alt={data.name}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Back Button */}
        <Link
          href={`/user/${type}s`}
          className="absolute top-4 left-4 p-2 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-lg transition"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </Link>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button className="p-2 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-lg transition">
            <Share2 className="w-5 h-5 text-white" />
          </button>
          <button className="p-2 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-lg transition">
            <Heart className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Profile Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <img
                src={data.avatar}
                alt={data.name}
                className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-lg"
              />
            </div>

            {/* Info */}
            <div className="flex-grow">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-light text-gray-900 mb-2">{data.name}</h1>
                  <p className="text-gray-600 mb-3">{data.bio}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-amber-700" />
                      <span>{data.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4 text-amber-700" />
                      <span>{data.experience} experience</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-amber-700" />
                      <span>Responds in {data.responseTime}</span>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-3">
                  <button className="px-6 py-3 bg-amber-700 hover:bg-amber-800 text-white rounded-lg font-medium transition shadow-md hover:shadow-lg flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Contact
                  </button>
                  <button className="px-6 py-3 border-2 border-amber-700 text-amber-700 hover:bg-amber-50 rounded-lg font-medium transition">
                    Book Now
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <span className="text-lg font-semibold text-gray-900">{data.rating}</span>
                  <span className="text-gray-600">({data.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900">{data.portfolio.length} Photos</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-900">Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('portfolio')}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition ${
                    activeTab === 'portfolio'
                      ? 'text-amber-700 border-b-2 border-amber-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Portfolio
                </button>
                <button
                  onClick={() => setActiveTab('packages')}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition ${
                    activeTab === 'packages'
                      ? 'text-amber-700 border-b-2 border-amber-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Packages
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`flex-1 px-6 py-4 text-sm font-medium transition ${
                    activeTab === 'reviews'
                      ? 'text-amber-700 border-b-2 border-amber-700'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Reviews
                </button>
              </div>

              <div className="p-6">
                {/* Portfolio Tab */}
                {activeTab === 'portfolio' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {data.portfolio.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(img)}
                        className="aspect-square rounded-lg overflow-hidden hover:opacity-90 transition group"
                      >
                        <img
                          src={img}
                          alt={`Portfolio ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Packages Tab */}
                {activeTab === 'packages' && (
                  <div className="space-y-4">
                    {data.packages.map((pkg, idx) => (
                      <div
                        key={idx}
                        className={`border rounded-xl p-6 transition ${
                          pkg.popular
                            ? 'border-amber-700 bg-amber-50/50 shadow-md'
                            : 'border-gray-200 hover:border-amber-300'
                        }`}
                      >
                        {pkg.popular && (
                          <span className="inline-block px-3 py-1 bg-amber-700 text-white text-xs font-semibold rounded-full mb-3">
                            Most Popular
                          </span>
                        )}
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-1">
                              {pkg.name}
                            </h3>
                            <p className="text-gray-600 text-sm flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {pkg.duration}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-amber-700">{pkg.price}</p>
                          </div>
                        </div>
                        <ul className="space-y-2 mb-4">
                          {pkg.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <button
                          onClick={() => setSelectedPackage(pkg.name)}
                          className="w-full px-4 py-3 bg-amber-700 hover:bg-amber-800 text-white rounded-lg font-medium transition"
                        >
                          Select Package
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    {data.reviews.map((review, idx) => (
                      <div key={idx} className="border-b border-gray-200 pb-6 last:border-0">
                        <div className="flex items-start gap-4">
                          <img
                            src={review.avatar}
                            alt={review.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-grow">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h4 className="font-medium text-gray-900">{review.name}</h4>
                                <p className="text-sm text-gray-600">{review.date}</p>
                              </div>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? 'text-amber-500 fill-amber-500'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed">
                              {review.comment}
                            </p>
                            {review.images && review.images.length > 0 && (
                              <div className="flex gap-2 mt-3">
                                {review.images.map((img, i) => (
                                  <img
                                    key={i}
                                    src={img}
                                    alt={`Review ${i + 1}`}
                                    className="w-20 h-20 rounded-lg object-cover cursor-pointer hover:opacity-80 transition"
                                    onClick={() => setSelectedImage(img)}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
              <p className="text-gray-700 leading-relaxed mb-6">{data.about}</p>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-700" />
                    Specialty
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {data.specialty.map((spec, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-amber-50 text-amber-700 text-sm rounded-full border border-amber-200"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-700" />
                    Languages
                  </h3>
                  <p className="text-gray-700 text-sm">{data.languages.join(', ')}</p>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-700" />
                Achievements
              </h2>
              <ul className="space-y-3">
                {data.achievements.map((achievement, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              
              <div className="space-y-4 mb-6">
                <a
                  href={`mailto:${data.contact.email}`}
                  className="flex items-center gap-3 text-gray-700 hover:text-amber-700 transition"
                >
                  <Mail className="w-5 h-5" />
                  <span className="text-sm">{data.contact.email}</span>
                </a>
                <a
                  href={`tel:${data.contact.phone}`}
                  className="flex items-center gap-3 text-gray-700 hover:text-amber-700 transition"
                >
                  <Phone className="w-5 h-5" />
                  <span className="text-sm">{data.contact.phone}</span>
                </a>
                <div className="flex items-center gap-3 text-gray-700">
                  <Calendar className="w-5 h-5" />
                  <span className="text-sm">{data.availability}</span>
                </div>
              </div>

              {/* Social Media */}
              {data.socialMedia && (
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Follow</h4>
                  <div className="flex gap-3">
                    {data.socialMedia.instagram && (
                      <a
                        href={data.socialMedia.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 border border-gray-200 rounded-lg hover:border-amber-700 hover:text-amber-700 transition"
                      >
                        <Instagram className="w-5 h-5" />
                      </a>
                    )}
                    {data.socialMedia.facebook && (
                      <a
                        href={data.socialMedia.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 border border-gray-200 rounded-lg hover:border-amber-700 hover:text-amber-700 transition"
                      >
                        <Facebook className="w-5 h-5" />
                      </a>
                    )}
                    {data.socialMedia.website && (
                      <a
                        href={data.socialMedia.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 border border-gray-200 rounded-lg hover:border-amber-700 hover:text-amber-700 transition"
                      >
                        <Globe className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              )}

              <button className="w-full mt-6 px-4 py-3 bg-amber-700 hover:bg-amber-800 text-white rounded-lg font-medium transition shadow-md hover:shadow-lg">
                Send Message
              </button>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Why Choose Me</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Fast response time</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Professional equipment</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Flexible packages</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>High customer satisfaction</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-lg transition"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <img
            src={selectedImage}
            alt="Preview"
            className="max-w-full max-h-full rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};