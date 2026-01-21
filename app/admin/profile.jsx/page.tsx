'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Star, MapPin, Check, Phone, Mail, Globe, Heart, Share2, MessageCircle } from 'lucide-react';
import { Navbar } from '@/app/components/navbar';
import { Footer } from '@/app/components/Footer';

// Sample data - replace with API call
const admin = [
  {
    id: "1",
    name: "Ishara Perera",
    bio: "Wedding & lifestyle photographer",
    rating: 4.9,
    reviews: 132,
    price: "From LKR 25,000",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
    tags: ["Weddings", "Couples", "Events"],
    location: "Colombo",
    experience: "8+ years",
    responseTime: "Within 2 hours",
    verified: true,
    phone: "+94 71 234 5678",
    email: "ishara@example.com",
    website: "https://isharaperera.com",
    about: "Specialized in capturing beautiful moments at weddings and lifestyle events across Sri Lanka. I believe in candid photography that tells your unique story.",
    portfolio: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1502184612684-c7d213ca657b?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=600&q=80",
    ],
  },
  {
    id: "2",
    name: "Nadine Fernando",
    bio: "Portraits and editorial stories",
    rating: 4.8,
    reviews: 98,
    price: "From LKR 18,500",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    tags: ["Portraits", "Fashion", "Brand"],
    location: "Kandy",
    experience: "6+ years",
    responseTime: "Within 4 hours",
    verified: true,
    phone: "+94 77 123 4567",
    email: "nadine@example.com",
    website: "https://nadinefernando.com",
    about: "Creative portrait photographer focusing on capturing the essence of my subjects. I specialize in personal branding and editorial work.",
    portfolio: [
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
    ],
  },
];

export default function AdminProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [isMessageOpen, setIsMessageOpen] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState(0);

  const professional = admin.find(p => p.id === id);

  if (!professional) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-light text-gray-900 mb-2">Professional not found</h1>
          <p className="text-gray-600">The profile you're looking for doesn't exist.</p>
          <Link href="/user/photographers" className="text-amber-700 hover:text-amber-800 mt-4 inline-block">
            ← Back to photographers
          </Link>
        </div>
      </div>
    );
  }

  const portfolio = professional.portfolio || [];

  const services = [
    {
      name: 'Standard Session',
      description: '4 hours of shooting + 100 edited photos',
      price: professional.price,
    },
    {
      name: 'Premium Session',
      description: '8 hours of shooting + 200 edited photos + album',
      price: 'From LKR 45,000',
    },
    {
      name: 'Custom Package',
      description: 'Tailored to your needs',
      price: 'Contact for quote',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPath="/user/photographers" />

      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <Link href="/user/photographers" className="text-sm text-amber-700 hover:text-amber-800 mb-6 inline-flex items-center gap-1">
            ← Back to photographers
          </Link>

          <div className="grid md:grid-cols-[300px_1fr] gap-8">
            {/* Left: Avatar & Info */}
            <div className="flex flex-col items-center md:items-start">
              {/* Avatar */}
              <img
                src={professional.avatar}
                alt={professional.name}
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl object-cover border-4 border-amber-100 shadow-lg mb-4"
              />

              {/* Name & Bio */}
              <div className="text-center md:text-left">
                <div className="flex items-center gap-2 justify-center md:justify-start mb-1">
                  <h1 className="text-2xl sm:text-3xl font-light text-gray-900">{professional.name}</h1>
                  {professional.verified && (
                    <div className="w-5 h-5 bg-amber-600 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <p className="text-amber-700 font-medium text-sm mb-3">{professional.bio}</p>
                {professional.location && (
                  <p className="text-gray-600 text-sm flex items-center gap-1 justify-center md:justify-start mb-3">
                    <MapPin className="w-4 h-4" /> {professional.location}
                  </p>
                )}

                {/* Rating */}
                <div className="flex items-center gap-2 justify-center md:justify-start mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(professional.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-700">
                    <span className="font-semibold">{professional.rating.toFixed(1)}</span> ({professional.reviews} reviews)
                  </span>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                  {professional.experience && (
                    <div className="bg-amber-50 border border-amber-100 rounded-lg p-2">
                      <p className="text-gray-600">Experience</p>
                      <p className="font-semibold text-gray-900">{professional.experience}</p>
                    </div>
                  )}
                  {professional.responseTime && (
                    <div className="bg-amber-50 border border-amber-100 rounded-lg p-2">
                      <p className="text-gray-600">Response</p>
                      <p className="font-semibold text-gray-900">{professional.responseTime}</p>
                    </div>
                  )}
                </div>

                {/* Contact Info */}
                <div className="space-y-2 text-sm mb-4">
                  {professional.phone && (
                    <a href={`tel:${professional.phone}`} className="flex items-center gap-2 text-gray-700 hover:text-amber-700 transition">
                      <Phone className="w-4 h-4" /> {professional.phone}
                    </a>
                  )}
                  {professional.email && (
                    <a href={`mailto:${professional.email}`} className="flex items-center gap-2 text-gray-700 hover:text-amber-700 transition">
                      <Mail className="w-4 h-4" /> {professional.email}
                    </a>
                  )}
                  {professional.website && (
                    <a href={professional.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-700 hover:text-amber-700 transition">
                      <Globe className="w-4 h-4" /> Website
                    </a>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="w-full space-y-3 mt-4">
                <button
                  onClick={() => setIsMessageOpen(true)}
                  className="w-full px-4 py-3 bg-amber-700 hover:bg-amber-800 text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Send Message
                </button>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`w-full px-4 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                    isFavorite
                      ? 'bg-red-50 border-2 border-red-300 text-red-700 hover:bg-red-100'
                      : 'bg-gray-100 border-2 border-gray-300 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  {isFavorite ? 'Saved' : 'Save'}
                </button>
                <button className="w-full px-4 py-3 border-2 border-gray-300 text-gray-700 hover:border-amber-700 hover:text-amber-700 rounded-lg font-medium transition flex items-center justify-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
              </div>

              {/* Tags */}
              <div className="w-full mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs uppercase tracking-wide text-gray-600 mb-3">Specialties</p>
                <div className="flex flex-wrap gap-2">
                  {professional.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-full text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Content */}
            <div className="space-y-8">
              {/* About */}
              {professional.about && (
                <div>
                  <h2 className="text-xl font-light text-gray-900 mb-4">About</h2>
                  <p className="text-gray-700 leading-relaxed">{professional.about}</p>
                </div>
              )}

              {/* Services */}
              <div>
                <h2 className="text-xl font-light text-gray-900 mb-4">Services & Pricing</h2>
                <div className="grid gap-4">
                  {services.map((service, idx) => (
                    <div key={idx} className="border border-gray-200 hover:border-amber-500 rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{service.name}</h3>
                        <span className="text-amber-700 font-semibold text-sm">{service.price}</span>
                      </div>
                      <p className="text-gray-600 text-sm">{service.description}</p>
                      <button className="mt-3 text-amber-700 hover:text-amber-800 text-sm font-medium">
                        Learn more →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio */}
      {portfolio.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-light text-gray-900 mb-6">Portfolio</h2>

          {/* Main Image */}
          <div className="mb-6 rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 h-96 sm:h-[500px]">
            <img
              src={portfolio[selectedImage]}
              alt={`Portfolio ${selectedImage + 1}`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {portfolio.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition ${
                  selectedImage === idx ? 'border-amber-700' : 'border-gray-200 hover:border-amber-300'
                }`}
              >
                <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Reviews Section */}
      <section className="bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-light text-gray-900 mb-6">Customer Reviews</h2>

          <div className="space-y-4">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4 sm:p-6">
                <div className="flex items-start gap-4 mb-3">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${idx}`}
                    alt="Reviewer"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900">Client Name</h3>
                      <span className="text-xs text-gray-500">2 weeks ago</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                      <span className="text-sm text-gray-700 ml-2">5.0</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 text-sm">"Amazing experience! Professional, creative, and delivered exactly what we wanted. Highly recommended!"</p>
              </div>
            ))}
          </div>

          <button className="mt-6 text-amber-700 hover:text-amber-800 font-medium text-sm">
            View all {professional.reviews} reviews →
          </button>
        </div>
      </section>

      {/* Message Modal */}
      {isMessageOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-light text-gray-900">Send Message</h3>
              <button onClick={() => setIsMessageOpen(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  placeholder="Tell them about your project..."
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:border-amber-700 focus:outline-none resize-none h-32"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsMessageOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-sm transition font-medium">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}