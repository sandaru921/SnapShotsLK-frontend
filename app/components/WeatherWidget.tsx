'use client';

import React, { useEffect, useState } from 'react';
import { Wind, Droplets, Thermometer, CloudRain, AlertCircle, RefreshCw } from 'lucide-react';
import { fetchWeather, WMO_CODES } from '@/app/lib/geo';

interface Props {
  lat: number;
  lng: number;
  locationName?: string;
  compact?: boolean; // true = smaller inline widget
}

export function WeatherWidget({ lat, lng, locationName, compact = false }: Props) {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetchWeather(lat, lng)
      .then(setWeather)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [lat, lng]);

  if (loading) {
    return (
      <div className={`flex items-center gap-2 text-slate-400 text-xs ${compact ? '' : 'py-4'}`}>
        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
        Loading weather…
      </div>
    );
  }

  if (error || !weather?.current_weather) {
    return (
      <div className="flex items-center gap-1.5 text-slate-400 text-xs">
        <AlertCircle className="w-3.5 h-3.5" />
        Weather unavailable
      </div>
    );
  }

  const cw = weather.current_weather;
  const wmo = WMO_CODES[cw.weathercode] ?? { label: 'Unknown', emoji: '🌡️' };
  const today = weather.daily;
  const maxTemp = today?.temperature_2m_max?.[0];
  const minTemp = today?.temperature_2m_min?.[0];
  const rain = today?.precipitation_sum?.[0];
  const windspeed = cw.windspeed;

  // Photography suitability score
  const isGoodForShoot = cw.weathercode <= 2 && windspeed < 30 && (rain ?? 0) < 1;
  const isFairForShoot = cw.weathercode <= 45 && windspeed < 50 && (rain ?? 0) < 5;

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="text-lg">{wmo.emoji}</span>
        <span className="font-semibold text-slate-700">{Math.round(cw.temperature)}°C</span>
        <span className="text-slate-400">{wmo.label}</span>
        {locationName && <span className="text-slate-400">· {locationName}</span>}
      </div>
    );
  }

  // 7-day forecast (show 5 days)
  const forecast = today?.weathercode?.slice(0, 5).map((code: number, i: number) => ({
    code,
    date: new Date(Date.now() + i * 86400000).toLocaleDateString('en-US', { weekday: 'short' }),
    max: today.temperature_2m_max[i],
    min: today.temperature_2m_min[i],
    rain: today.precipitation_sum[i],
  })) ?? [];

  return (
    <div className="bg-gradient-to-br from-sky-500 to-indigo-600 rounded-2xl p-5 text-white shadow-lg overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full -ml-6 -mb-6" />

      {/* Header */}
      <div className="relative">
        {locationName && (
          <p className="text-sky-200 text-xs font-medium uppercase tracking-wider mb-1">{locationName}</p>
        )}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-5xl">{wmo.emoji}</span>
              <div>
                <p className="text-4xl font-bold leading-none">{Math.round(cw.temperature)}°C</p>
                <p className="text-sky-200 text-sm mt-1">{wmo.label}</p>
              </div>
            </div>
            {maxTemp != null && (
              <p className="text-sky-200 text-xs mt-2">
                ↑ {Math.round(maxTemp)}° · ↓ {Math.round(minTemp)}°
              </p>
            )}
          </div>

          {/* Photography suitability badge */}
          <div className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
            isGoodForShoot ? 'bg-green-400/30 text-green-100 border border-green-300/30'
            : isFairForShoot ? 'bg-yellow-400/30 text-yellow-100 border border-yellow-300/30'
            : 'bg-red-400/30 text-red-100 border border-red-300/30'
          }`}>
            {isGoodForShoot ? '📸 Great for shooting'
              : isFairForShoot ? '🌤️ Fair conditions'
              : '⚠️ Poor conditions'}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { icon: Wind,         label: 'Wind',     value: `${Math.round(windspeed)} km/h` },
            { icon: CloudRain,    label: 'Rain',     value: `${rain?.toFixed(1) ?? '0'} mm` },
            { icon: Thermometer,  label: 'Feels like', value: `${Math.round(cw.temperature)}°` },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-white/10 rounded-xl p-2.5 text-center backdrop-blur-sm">
              <Icon className="w-3.5 h-3.5 mx-auto mb-1 text-sky-200" />
              <p className="text-xs text-sky-200">{label}</p>
              <p className="text-sm font-semibold">{value}</p>
            </div>
          ))}
        </div>

        {/* 5-day forecast */}
        {forecast.length > 0 && (
          <div className="border-t border-white/20 pt-3">
            <p className="text-sky-200 text-xs uppercase tracking-wider mb-2 font-medium">5-Day Forecast</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {forecast.map((d: any, i: number) => {
                const dayWmo = WMO_CODES[d.code] ?? { emoji: '🌡️' };
                return (
                  <div key={i} className="flex-shrink-0 flex flex-col items-center gap-1 bg-white/10 rounded-xl px-3 py-2 min-w-[50px]">
                    <p className="text-xs text-sky-200">{i === 0 ? 'Today' : d.date}</p>
                    <span className="text-lg">{dayWmo.emoji}</span>
                    <p className="text-xs font-semibold">{Math.round(d.max)}°</p>
                    <p className="text-xs text-sky-300">{Math.round(d.min)}°</p>
                    {d.rain > 0.5 && (
                      <div className="flex items-center gap-0.5 text-sky-200">
                        <Droplets className="w-2.5 h-2.5" />
                        <span className="text-[10px]">{d.rain.toFixed(0)}mm</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
