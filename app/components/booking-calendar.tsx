"use client";

import React, { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Lock, Unlock } from "lucide-react";

interface BookedSlot {
  bookingDate: string;
  timeSlot: string;
  status: string;
  type: string;
}

interface BookingCalendarProps {
  bookedSlots?: BookedSlot[];
  onSlotSelect?: (date: string, time: string) => void;
  // Admin mode: allows blocking/unblocking own slots
  adminMode?: boolean;
  onBlockSlot?: (date: string, time: string) => void;
  // Optional weather data mapped by YYYY-MM-DD
  weatherForecast?: Record<string, {
    emoji: string;
    max: number;
    label: string;
    hourly?: Array<{ time: string; temp: number; emoji: string; precip: number; }>;
  }>;
}

const TIME_SLOTS = ["09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"];
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export function BookingCalendar({ bookedSlots = [], onSlotSelect, adminMode = false, onBlockSlot, weatherForecast }: BookingCalendarProps) {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const fmtDate = (day: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const isPast = (day: number) =>
    new Date(year, month, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const getSlot = (date: string, time: string) =>
    bookedSlots.find(s => s.bookingDate === date && s.timeSlot === time);

  const isSlotUnavailable = (date: string, time: string) => {
    const s = getSlot(date, time);
    return !!s && s.status !== "cancelled" && s.status !== "rejected";
  };

  const isDayFullyBooked = (day: number) => {
    const date = fmtDate(day);
    return TIME_SLOTS.every(t => isSlotUnavailable(date, t));
  };

  const dayHasAnySlot = (day: number) => {
    const date = fmtDate(day);
    return bookedSlots.some(s => s.bookingDate === date && s.status !== "cancelled" && s.status !== "rejected");
  };

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); setSelectedDate(null); setSelectedTime(null); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); setSelectedDate(null); setSelectedTime(null); };

  const handleDayClick = (day: number) => {
    if (isPast(day) || isDayFullyBooked(day)) return;
    setSelectedDate(fmtDate(day));
    setSelectedTime(null);
  };

  const handleTimeClick = (time: string) => {
    if (!selectedDate) return;
    const slot = getSlot(selectedDate, time);

    if (adminMode) {
      // Admin: toggle block
      onBlockSlot?.(selectedDate, time);
      return;
    }

    // Client: select available slot only
    if (slot && slot.status !== "cancelled" && slot.status !== "rejected") return;
    setSelectedTime(time);
    onSlotSelect?.(selectedDate, time);
  };

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  const getSlotStyle = (date: string, time: string) => {
    const slot = getSlot(date, time);
    const isSelected = selectedTime === time;

    if (isSelected) return "bg-amber-600 text-white font-semibold shadow-md scale-105";

    if (!slot || slot.status === "cancelled" || slot.status === "rejected") {
      if (adminMode) return "bg-gray-50 text-gray-700 hover:bg-amber-50 hover:text-amber-700 border border-gray-200 hover:border-amber-300 cursor-pointer";
      return "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-100 hover:border-amber-300 cursor-pointer";
    }

    if (slot.type === "blocked") return "bg-red-50 text-red-400 line-through opacity-70 cursor-pointer";
    if (slot.status === "confirmed") return "bg-gray-200 text-gray-400 line-through cursor-not-allowed";
    if (slot.status === "pending") return "bg-yellow-50 text-yellow-600 border border-yellow-200 cursor-not-allowed";

    return "bg-gray-100 text-gray-400 cursor-not-allowed";
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-amber-50 to-white border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900 text-base">
          {adminMode ? "📅 Manage Availability" : "📅 Check Availability"}
        </h2>
        <div className="flex items-center gap-1">
          <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-amber-100 transition text-gray-500 hover:text-amber-700">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-semibold text-gray-800 min-w-[130px] text-center">
            {MONTHS[month]} {year}
          </span>
          <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-amber-100 transition text-gray-500 hover:text-amber-700">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-5">
        {/* Day Headers */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map(d => <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">{d}</div>)}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-5">
          {cells.map((day, i) => {
            if (!day) return <div key={`e-${i}`} />;
            const date = fmtDate(day);
            const past = isPast(day);
            const full = isDayFullyBooked(day);
            const partial = dayHasAnySlot(day);
            const selected = selectedDate === date;
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

            const weather = weatherForecast?.[date];

            let cls = "h-11 w-11 mx-auto flex flex-col items-center justify-center text-sm rounded-xl transition-all duration-150 relative font-medium group";
            if (past) cls += " text-gray-300 cursor-not-allowed";
            else if (full && !adminMode) cls += " text-gray-300 line-through cursor-not-allowed bg-gray-50";
            else if (selected) cls += " bg-amber-600 text-white shadow-lg shadow-amber-200 scale-110";
            else if (partial) cls += " bg-amber-50 text-amber-800 hover:bg-amber-100 cursor-pointer border border-amber-200";
            else cls += " text-gray-700 hover:bg-amber-50 hover:text-amber-700 cursor-pointer";

            if (isToday && !selected) cls += " ring-2 ring-amber-400 ring-offset-1";

            return (
              <div key={day} className="relative mx-auto h-11 w-11 flex justify-center">
                <button onClick={() => handleDayClick(day)} disabled={past || (full && !adminMode)} className={cls}>
                  <span>{day}</span>
                  {weather && !past && (
                    <span className="text-[10px] leading-none mt-0.5">{weather.emoji}</span>
                  )}
                  {partial && !full && !selected && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-500" />
                  )}
                </button>
                {/* Weather Tooltip */}
                {weather && !past && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 px-2 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center shadow-lg before:content-[''] before:absolute before:-bottom-1 before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-gray-900">
                    <span className="text-base">{weather.emoji}</span> {weather.max}°C
                    <div className="text-gray-300 mt-0.5">{weather.label}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-50 border border-amber-200" />Available</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-600" />Selected</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-gray-200" />Booked</span>
          {adminMode && <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-50 border border-red-200" />Blocked</span>}
        </div>

        {/* Hourly Weather for Selected Date */}
        {!adminMode && selectedDate && weatherForecast?.[selectedDate]?.hourly && (
          <div className="mb-4 pb-4 border-b border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
              Hourly Weather Forecast
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {weatherForecast[selectedDate].hourly!.map((h, i) => (
                <div key={i} className="flex-shrink-0 flex flex-col items-center bg-sky-50 border border-sky-100/50 rounded-xl px-3 py-2 min-w-[55px]">
                  <span className="text-[10px] text-sky-700/70 font-medium mb-1">{h.time}</span>
                  <span className="text-lg leading-none">{h.emoji}</span>
                  <span className="text-xs font-bold text-sky-900 mt-1">{h.temp}°</span>
                  {h.precip > 0 ? (
                    <span className="text-[9px] text-blue-500 font-medium mt-0.5">🌧 {h.precip}%</span>
                  ) : (
                    <span className="text-[9px] text-transparent select-none mt-0.5">-</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Time Slots */}
        {selectedDate ? (
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">
              {adminMode ? (
                <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5 text-gray-400" /> Click to block/unblock · {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</span>
              ) : (
                <>Available times · <span className="text-amber-700">{new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}</span></>
              )}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {TIME_SLOTS.map(time => {
                const slot = getSlot(selectedDate, time);
                const isSelected = selectedTime === time;
                return (
                  <button
                    key={time}
                    onClick={() => handleTimeClick(time)}
                    className={`py-2 px-2 text-xs rounded-xl transition-all duration-150 text-center flex flex-col items-center gap-0.5 ${getSlotStyle(selectedDate, time)}`}
                    title={slot?.type === "blocked" ? "Blocked by you" : slot?.status === "confirmed" ? "Confirmed booking" : slot?.status === "pending" ? "Pending booking" : "Available"}
                  >
                    <span className="font-semibold">{time}</span>
                    {adminMode && slot && (
                      <span className="text-[9px] opacity-70">
                        {slot.type === "blocked" ? "blocked" : slot.status}
                      </span>
                    )}
                    {adminMode && !slot && <span className="text-[9px] opacity-40">click to block</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-3">
            {adminMode ? "Select a date to manage time slots" : "Select a date to see available times"}
          </p>
        )}

        {/* Selected slot summary (client mode) */}
        {!adminMode && selectedDate && selectedTime && (
          <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <p className="text-sm text-gray-700">
              ✅ <span className="font-semibold">{new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</span> at <span className="font-bold text-amber-700">{selectedTime}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}