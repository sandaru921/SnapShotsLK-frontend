'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Navigation, Search, Loader2, X } from 'lucide-react';
import { geocodeSriLanka, reverseGeocode } from '@/app/lib/geo';

interface LocationResult {
  lat: number;
  lng: number;
  city: string;
  displayName: string;
}

interface Props {
  value?: LocationResult | null;
  onChange: (loc: LocationResult | null) => void;
  placeholder?: string;
  className?: string;
}

// Pre-loaded major Sri Lankan cities for instant suggestions
const SL_CITIES: LocationResult[] = [
  { lat: 6.9271,  lng: 79.8612, city: 'Colombo',      displayName: 'Colombo, Sri Lanka' },
  { lat: 7.2906,  lng: 80.6337, city: 'Kandy',        displayName: 'Kandy, Sri Lanka' },
  { lat: 6.0328,  lng: 80.2168, city: 'Galle',        displayName: 'Galle, Sri Lanka' },
  { lat: 8.3114,  lng: 80.4037, city: 'Anuradhapura', displayName: 'Anuradhapura, Sri Lanka' },
  { lat: 7.9403,  lng: 81.0188, city: 'Polonnaruwa',  displayName: 'Polonnaruwa, Sri Lanka' },
  { lat: 6.8237,  lng: 80.0416, city: 'Nugegoda',     displayName: 'Nugegoda, Western Province, Sri Lanka' },
  { lat: 6.8218,  lng: 80.0368, city: 'Sri Jayawardenepura', displayName: 'Sri Jayawardenepura Kotte, Sri Lanka' },
  { lat: 7.8731,  lng: 80.6519, city: 'Matale',       displayName: 'Matale, Sri Lanka' },
  { lat: 6.7235,  lng: 80.0484, city: 'Panadura',     displayName: 'Panadura, Western Province, Sri Lanka' },
  { lat: 9.6615,  lng: 80.0255, city: 'Jaffna',       displayName: 'Jaffna, Northern Province, Sri Lanka' },
  { lat: 7.8667,  lng: 80.6500, city: 'Kurunegala',   displayName: 'Kurunegala, North Western Province, Sri Lanka' },
  { lat: 6.3538,  lng: 80.5560, city: 'Matara',       displayName: 'Matara, Southern Province, Sri Lanka' },
  { lat: 7.4861,  lng: 80.3639, city: 'Kegalle',      displayName: 'Kegalle, Sabaragamuwa Province, Sri Lanka' },
  { lat: 6.7745,  lng: 81.0755, city: 'Badulla',      displayName: 'Badulla, Uva Province, Sri Lanka' },
  { lat: 6.9497,  lng: 80.7891, city: 'Nuwara Eliya', displayName: 'Nuwara Eliya, Central Province, Sri Lanka' },
  { lat: 7.7102,  lng: 81.6924, city: 'Trincomalee',  displayName: 'Trincomalee, Eastern Province, Sri Lanka' },
  { lat: 7.2989,  lng: 81.6921, city: 'Batticaloa',   displayName: 'Batticaloa, Eastern Province, Sri Lanka' },
  { lat: 6.5950,  lng: 80.7406, city: 'Hambantota',   displayName: 'Hambantota, Southern Province, Sri Lanka' },
  { lat: 7.4675,  lng: 80.0070, city: 'Negombo',      displayName: 'Negombo, Western Province, Sri Lanka' },
  { lat: 6.5833,  lng: 80.0667, city: 'Kalutara',     displayName: 'Kalutara, Western Province, Sri Lanka' },
];

export function LocationPicker({ value, onChange, placeholder = 'Search city or location…', className = '' }: Props) {
  const [query, setQuery] = useState(value?.city ?? '');
  const [suggestions, setSuggestions] = useState<LocationResult[]>([]);
  const [open, setOpen] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync external value changes
  useEffect(() => {
    setQuery(value?.city ?? '');
  }, [value?.city]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleInput = (val: string) => {
    setQuery(val);
    if (!val.trim()) {
      setSuggestions(SL_CITIES.slice(0, 6));
      setOpen(true);
      return;
    }
    // Instant filter from preset cities
    const local = SL_CITIES.filter(c =>
      c.city.toLowerCase().includes(val.toLowerCase()) ||
      c.displayName.toLowerCase().includes(val.toLowerCase())
    );
    setSuggestions(local);
    setOpen(true);

    // Debounce Nominatim for more results
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (val.length < 2) return;
      setSearching(true);
      try {
        const results = await geocodeSriLanka(val);
        const combined = [
          ...local,
          ...results.filter(r => !local.some(l => Math.abs(l.lat - r.lat) < 0.01)),
        ].slice(0, 8);
        setSuggestions(combined);
      } catch { /* keep local results */ }
      finally { setSearching(false); }
    }, 400);
  };

  const handleSelect = (loc: LocationResult) => {
    setQuery(loc.city);
    setSuggestions([]);
    setOpen(false);
    onChange(loc);
  };

  const handleGps = () => {
    if (!navigator.geolocation) return;
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude: lat, longitude: lng } = pos.coords;
        const city = await reverseGeocode(lat, lng);
        const loc: LocationResult = { lat, lng, city, displayName: `${city}, Sri Lanka` };
        handleSelect(loc);
        setGpsLoading(false);
      },
      () => { setGpsLoading(false); },
      { timeout: 8000, maximumAge: 60000 }
    );
  };

  const handleFocus = () => {
    if (!query.trim()) {
      setSuggestions(SL_CITIES.slice(0, 6));
    }
    setOpen(true);
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions(SL_CITIES.slice(0, 6));
    setOpen(true);
    onChange(null);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative flex items-center">
        <MapPin className="absolute left-3 w-4 h-4 text-amber-500 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={e => handleInput(e.target.value)}
          onFocus={handleFocus}
          placeholder={placeholder}
          className="w-full pl-9 pr-20 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition placeholder:text-gray-400"
        />
        <div className="absolute right-2 flex items-center gap-1">
          {query && (
            <button onClick={handleClear} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg transition">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          {searching && <Loader2 className="w-3.5 h-3.5 text-amber-500 animate-spin" />}
          <button
            onClick={handleGps}
            disabled={gpsLoading}
            title="Use my current location"
            className="p-1.5 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition disabled:opacity-50"
          >
            {gpsLoading
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <Navigation className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Dropdown */}
      {open && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
          {suggestions.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-400 text-center">No locations found</p>
          ) : (
            <>
              {!query && (
                <p className="px-3 py-2 text-xs text-gray-400 font-medium uppercase tracking-wider border-b border-gray-100">
                  Popular cities
                </p>
              )}
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(s)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-amber-50 transition text-left group"
                >
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 group-hover:text-amber-600 transition" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{s.city}</p>
                    <p className="text-xs text-gray-400 truncate">{s.displayName}</p>
                  </div>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
