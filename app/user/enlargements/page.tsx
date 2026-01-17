"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Navbar } from '@/app/components/navbar';

const slides = [
  {
    title: "Premium Photo Enlargements",
    subtitle: "Gallery-quality prints in multiple sizes",
    image:
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Museum-Grade Quality",
    subtitle: "Professional printing on premium paper",
    image:
      "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Perfect for Any Space",
    subtitle: "Transform your memories into wall art",
    image:
      "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=1600&q=80",
  },
];

const enlargements = [
  {
    size: '8x10"',
    dimensions: "20.3 x 25.4 cm",
    description: "Perfect for desk frames",
    price: "LKR 850",
    paperOptions: ["Glossy", "Matte", "Lustre"],
    turnaround: "2-3 days",
    popular: false,
  },
  {
    size: '11x14"',
    dimensions: "27.9 x 35.6 cm",
    description: "Ideal for small walls",
    price: "LKR 1,450",
    paperOptions: ["Glossy", "Matte", "Lustre", "Canvas"],
    turnaround: "2-3 days",
    popular: true,
  },
  {
    size: '16x20"',
    dimensions: "40.6 x 50.8 cm",
    description: "Statement piece size",
    price: "LKR 2,850",
    paperOptions: ["Glossy", "Matte", "Lustre", "Canvas"],
    turnaround: "3-4 days",
    popular: true,
  },
  {
    size: '20x24"',
    dimensions: "50.8 x 61 cm",
    description: "Gallery wall centerpiece",
    price: "LKR 4,200",
    paperOptions: ["Glossy", "Matte", "Lustre", "Canvas", "Metal"],
    turnaround: "4-5 days",
    popular: false,
  },
  {
    size: '24x36"',
    dimensions: "61 x 91.4 cm",
    description: "Large format impact",
    price: "LKR 6,500",
    paperOptions: ["Glossy", "Matte", "Lustre", "Canvas", "Metal"],
    turnaround: "5-6 days",
    popular: true,
  },
  {
    size: '30x40"',
    dimensions: "76.2 x 101.6 cm",
    description: "Premium showcase size",
    price: "LKR 9,800",
    paperOptions: ["Matte", "Lustre", "Canvas", "Metal", "Acrylic"],
    turnaround: "6-7 days",
    popular: false,
  },
];

export default function EnlargementsPage() {
  const [current, setCurrent] = useState(0);
  const total = slides.length;

  const goNext = () => setCurrent((c) => (c + 1) % total);
  const goPrev = () => setCurrent((c) => (c - 1 + total) % total);

  useEffect(() => {
    const id = setInterval(goNext, 4500);
    return () => clearInterval(id);
  }, []);

  const activeSlide = useMemo(() => slides[current], [current]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPath="/enlargements" />

      {/* Hero slideshow */}
      <section className="relative overflow-hidden">
        <div
          className="h-[320px] sm:h-[420px] md:h-[520px] w-full bg-cover bg-center transition-all duration-700"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.45), rgba(0,0,0,0.65)), url(${activeSlide.image})`,
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center text-white">
            <p className="text-sm uppercase tracking-[0.25em] text-amber-200 mb-3">
              Premium Prints
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide mb-4">
              {activeSlide.title}
            </h1>
            <p className="text-lg sm:text-xl max-w-2xl text-gray-100 mb-6">
              {activeSlide.subtitle}
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={goPrev}
                className="h-10 w-10 rounded-full border border-white/50 text-white/80 hover:text-white hover:border-white transition flex items-center justify-center"
                aria-label="Previous slide"
              >
                ‹
              </button>
              <button
                onClick={goNext}
                className="h-10 w-10 rounded-full border border-white/50 text-white/80 hover:text-white hover:border-white transition flex items-center justify-center"
                aria-label="Next slide"
              >
                ›
              </button>
              <div className="flex items-center gap-2 ml-2">
                {slides.map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-2.5 w-2.5 rounded-full transition ${
                      idx === current ? "bg-amber-400 scale-110" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enlargements grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-amber-700 mb-2">
              Available Sizes
            </p>
            <h2 className="text-3xl font-light tracking-wide text-gray-900">
              Photo Enlargements
            </h2>
          </div>
          <button className="text-sm text-amber-700 border border-amber-200 px-4 py-2 rounded-full hover:border-amber-500 hover:text-amber-800 transition">
            Size guide
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {enlargements.map((item) => (
            <article
              key={item.size}
              className="bg-white border border-gray-200 hover:border-amber-500 shadow-sm hover:shadow-md transition group relative"
            >
              {item.popular && (
                <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                  Popular
                </div>
              )}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-2xl font-light text-gray-900 mb-1">
                    {item.size}
                  </h3>
                  <p className="text-sm text-gray-600">{item.dimensions}</p>
                  <p className="text-sm text-gray-700 mt-2">
                    {item.description}
                  </p>
                </div>

                <div className="mb-4 pb-4 border-b border-gray-100">
                  <p className="text-2xl font-semibold text-amber-700">
                    {item.price}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Starting price</p>
                </div>

                <div className="mb-4">
                  <p className="text-xs uppercase tracking-wide text-gray-600 mb-2">
                    Available on
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {item.paperOptions.map((option) => (
                      <span
                        key={option}
                        className="text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100"
                      >
                        {option}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm mb-4">
                  <div className="flex items-center gap-1 text-gray-600">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{item.turnaround}</span>
                  </div>
                </div>

                <button className="w-full px-4 py-3 rounded-full bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700 transition group-hover:bg-amber-700">
                  Order Now
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* Quality showcase */}
      <section className="bg-white border-t border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-amber-700 mb-2">
              Premium Quality
            </p>
            <h3 className="text-3xl font-light text-gray-900 mb-4">
              Why choose our enlargements?
            </h3>
            <p className="text-base text-gray-700 mb-6">
              We use state-of-the-art printing technology and premium materials
              to ensure your photos look stunning at any size.
            </p>
            <div className="flex flex-wrap gap-3 mb-6">
              <button className="px-5 py-3 rounded-full bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700 transition">
                Upload photos
              </button>
              <button className="px-5 py-3 rounded-full border border-amber-200 text-amber-800 text-sm hover:border-amber-500 transition">
                View samples
              </button>
            </div>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">✓</span>
                <span>
                  <strong>Professional printing:</strong> High-resolution output
                  up to 2400 DPI
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">✓</span>
                <span>
                  <strong>Premium materials:</strong> Archival-quality paper and
                  inks
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">✓</span>
                <span>
                  <strong>Color accuracy:</strong> Calibrated for true-to-life
                  colors
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">✓</span>
                <span>
                  <strong>Fast turnaround:</strong> Most orders ready in 2-7
                  days
                </span>
              </li>
            </ul>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-amber-100 bg-amber-50">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-100/60 to-white" />
            <div className="relative p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-white border border-amber-100 flex items-center justify-center text-amber-700 font-semibold text-lg">
                  📸
                </div>
                <div>
                  <p className="text-sm text-gray-600">Professional grade</p>
                  <p className="text-lg font-medium text-gray-900">
                    Museum-quality prints
                  </p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-700">
                <div className="bg-white border border-amber-100 rounded-xl p-4">
                  <p className="text-xs uppercase tracking-wide text-amber-700 mb-1">
                    Paper types
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    5+ options
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Glossy, Matte, Canvas & more
                  </p>
                </div>
                <div className="bg-white border border-amber-100 rounded-xl p-4">
                  <p className="text-xs uppercase tracking-wide text-amber-700 mb-1">
                    Warranty
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    100% guarantee
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Quality satisfaction
                  </p>
                </div>
              </div>
              <div className="bg-white border border-amber-100 rounded-xl p-4">
                <p className="text-xs uppercase tracking-wide text-amber-700 mb-1">
                  Free service
                </p>
                <p className="text-sm text-gray-700">
                  Color correction and minor retouching included with every
                  order.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Paper types info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-700 mb-2">
            Materials
          </p>
          <h3 className="text-3xl font-light tracking-wide text-gray-900">
            Paper & Material Options
          </h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:border-amber-500 transition">
            <h4 className="text-lg font-medium text-gray-900 mb-2">Glossy</h4>
            <p className="text-sm text-gray-600 mb-3">
              Vibrant colors with a high-shine finish. Perfect for photos with
              bold colors.
            </p>
            <span className="text-xs px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
              Most popular
            </span>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:border-amber-500 transition">
            <h4 className="text-lg font-medium text-gray-900 mb-2">Matte</h4>
            <p className="text-sm text-gray-600 mb-3">
              Non-reflective finish ideal for framing and professional displays.
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:border-amber-500 transition">
            <h4 className="text-lg font-medium text-gray-900 mb-2">Lustre</h4>
            <p className="text-sm text-gray-600 mb-3">
              Subtle sheen that balances vibrance and glare-free viewing.
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:border-amber-500 transition">
            <h4 className="text-lg font-medium text-gray-900 mb-2">Canvas</h4>
            <p className="text-sm text-gray-600 mb-3">
              Gallery-wrapped canvas for a classic, artistic presentation.
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:border-amber-500 transition">
            <h4 className="text-lg font-medium text-gray-900 mb-2">Metal</h4>
            <p className="text-sm text-gray-600 mb-3">
              Modern aluminum prints with stunning depth and luminosity.
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 hover:border-amber-500 transition">
            <h4 className="text-lg font-medium text-gray-900 mb-2">Acrylic</h4>
            <p className="text-sm text-gray-600 mb-3">
              Premium acrylic glass for a contemporary, high-end look.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
