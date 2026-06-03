// Haversine distance formula — returns distance in km
export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m away`;
  if (km < 10) return `${km.toFixed(1)} km away`;
  return `${Math.round(km)} km away`;
}

// Open-Meteo weather code → description + emoji
export const WMO_CODES: Record<number, { label: string; emoji: string }> = {
  0:  { label: 'Clear sky',        emoji: '☀️' },
  1:  { label: 'Mainly clear',     emoji: '🌤️' },
  2:  { label: 'Partly cloudy',    emoji: '⛅' },
  3:  { label: 'Overcast',         emoji: '☁️' },
  45: { label: 'Foggy',            emoji: '🌫️' },
  48: { label: 'Icy fog',          emoji: '🌫️' },
  51: { label: 'Light drizzle',    emoji: '🌦️' },
  53: { label: 'Drizzle',          emoji: '🌦️' },
  55: { label: 'Heavy drizzle',    emoji: '🌧️' },
  61: { label: 'Slight rain',      emoji: '🌧️' },
  63: { label: 'Rain',             emoji: '🌧️' },
  65: { label: 'Heavy rain',       emoji: '🌧️' },
  71: { label: 'Slight snow',      emoji: '❄️' },
  73: { label: 'Snow',             emoji: '❄️' },
  75: { label: 'Heavy snow',       emoji: '❄️' },
  80: { label: 'Rain showers',     emoji: '🌦️' },
  81: { label: 'Rain showers',     emoji: '🌦️' },
  82: { label: 'Heavy showers',    emoji: '⛈️' },
  95: { label: 'Thunderstorm',     emoji: '⛈️' },
  96: { label: 'Thunderstorm + hail', emoji: '⛈️' },
  99: { label: 'Thunderstorm + hail', emoji: '⛈️' },
};

// Fetch weather from Open-Meteo (no API key needed)
export async function fetchWeather(lat: number, lng: number) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&hourly=precipitation_probability,windspeed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=auto&forecast_days=7`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Weather fetch failed');
  return res.json();
}

export async function fetchExtendedForecast(lat: number, lng: number) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,temperature_2m_min,weathercode&hourly=temperature_2m,weathercode,precipitation_probability&timezone=auto&forecast_days=16`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Weather fetch failed');
  return res.json();
}

// Nominatim geocode: city name → {lat, lng, displayName}
export async function geocodeSriLanka(query: string) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query + ', Sri Lanka')}&format=json&limit=5&addressdetails=1`;
  const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
  const data: any[] = await res.json();
  return data.map(r => ({
    lat: parseFloat(r.lat),
    lng: parseFloat(r.lon),
    displayName: r.display_name.split(',').slice(0, 3).join(','),
    city: r.address?.city || r.address?.town || r.address?.village || r.address?.county || r.display_name.split(',')[0],
  }));
}

// Reverse geocode: lat/lng → city name
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;
    const res = await fetch(url);
    const d = await res.json();
    return d.city || d.locality || d.principalSubdivision || 'Your location';
  } catch {
    return 'Your location';
  }
}
