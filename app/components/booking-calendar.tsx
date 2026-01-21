"use client";

import React, { useState } from "react";

interface BookedSlot {
  date: string; // format: "YYYY-MM-DD"
  time: string; // format: "HH:MM"
}

interface BookingCalendarProps {
  bookedSlots?: BookedSlot[];
  onSlotSelect?: (date: string, time: string) => void;
}

const timeSlots = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function BookingCalendar({
  bookedSlots = [],
  onSlotSelect,
}: BookingCalendarProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Get days in month
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday)
  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Format date as YYYY-MM-DD
  const formatDate = (day: number) => {
    const m = String(currentMonth + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${currentYear}-${m}-${d}`;
  };

  // Check if a date is in the past
  const isPastDate = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return date < todayStart;
  };

  // Check if a slot is booked
  const isSlotBooked = (date: string, time: string) => {
    return bookedSlots.some((slot) => slot.date === date && slot.time === time);
  };

  // Check if entire day is fully booked
  const isDayFullyBooked = (day: number) => {
    const date = formatDate(day);
    return timeSlots.every((time) => isSlotBooked(date, time));
  };

  // Check if day has any booked slots
  const dayHasBookings = (day: number) => {
    const date = formatDate(day);
    return bookedSlots.some((slot) => slot.date === date);
  };

  // Navigate months
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDate(null);
    setSelectedTime(null);
  };

  // Handle date selection
  const handleDateClick = (day: number) => {
    if (isPastDate(day) || isDayFullyBooked(day)) return;
    const date = formatDate(day);
    setSelectedDate(date);
    setSelectedTime(null);
  };

  // Handle time selection
  const handleTimeClick = (time: string) => {
    if (!selectedDate || isSlotBooked(selectedDate, time)) return;
    setSelectedTime(time);
    onSlotSelect?.(selectedDate, time);
  };

  // Generate calendar days
  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  const calendarDays: (number | null)[] = [];

  // Add empty cells for days before first day
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  // Add days of month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Check Availability
      </h2>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Previous month"
        >
          <span className="text-gray-600">‹</span>
        </button>
        <h3 className="text-base font-medium text-gray-900">
          {months[currentMonth]} {currentYear}
        </h3>
        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Next month"
        >
          <span className="text-gray-600">›</span>
        </button>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-6">
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="h-10" />;
          }

          const date = formatDate(day);
          const isPast = isPastDate(day);
          const isFullyBooked = isDayFullyBooked(day);
          const hasBookings = dayHasBookings(day);
          const isSelected = selectedDate === date;
          const isToday =
            day === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear();

          // Determine cell styles
          let cellClasses =
            "h-10 flex items-center justify-center text-sm rounded-lg transition-all duration-200 relative";

          if (isPast) {
            // Past dates - dissolved/faded
            cellClasses += " text-gray-300 cursor-not-allowed opacity-40";
          } else if (isFullyBooked) {
            // Fully booked - hidden/dissolved style
            cellClasses +=
              " text-gray-400 cursor-not-allowed bg-gray-100 opacity-50 line-through";
          } else if (isSelected) {
            // Selected date
            cellClasses +=
              " bg-amber-600 text-white font-semibold cursor-pointer shadow-md";
          } else if (hasBookings) {
            // Has some bookings but not full
            cellClasses +=
              " bg-amber-50 text-amber-800 cursor-pointer hover:bg-amber-100 border border-amber-200";
          } else {
            // Available
            cellClasses +=
              " text-gray-700 cursor-pointer hover:bg-amber-50 hover:text-amber-700";
          }

          if (isToday && !isSelected) {
            cellClasses += " ring-2 ring-amber-400 ring-offset-1";
          }

          return (
            <button
              key={day}
              onClick={() => handleDateClick(day)}
              disabled={isPast || isFullyBooked}
              className={cellClasses}
              aria-label={`${day} ${months[currentMonth]} ${currentYear}${
                isFullyBooked ? " - Fully booked" : ""
              }${isPast ? " - Past date" : ""}`}
            >
              {day}
              {hasBookings && !isFullyBooked && !isSelected && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-gray-600 mb-6 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-white border border-gray-200" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-amber-50 border border-amber-200" />
          <span>Partial</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-gray-100 opacity-50" />
          <span>Fully Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-white opacity-40 border border-gray-200" />
          <span>Past</span>
        </div>
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div className="animate-fadeIn">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Available times for{" "}
            <span className="text-amber-700">
              {new Date(selectedDate).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </span>
          </h4>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {timeSlots.map((time) => {
              const isBooked = isSlotBooked(selectedDate, time);
              const isSelectedTime = selectedTime === time;

              let timeClasses =
                "py-2 px-3 text-sm rounded-lg transition-all duration-200 text-center";

              if (isBooked) {
                // Booked slot - dissolved/hidden style
                timeClasses +=
                  " bg-gray-100 text-gray-400 cursor-not-allowed opacity-40 line-through";
              } else if (isSelectedTime) {
                // Selected time
                timeClasses +=
                  " bg-amber-600 text-white font-semibold cursor-pointer shadow-md";
              } else {
                // Available time
                timeClasses +=
                  " bg-amber-50 text-amber-700 cursor-pointer hover:bg-amber-100 border border-amber-100 hover:border-amber-300";
              }

              return (
                <button
                  key={time}
                  onClick={() => handleTimeClick(time)}
                  disabled={isBooked}
                  className={timeClasses}
                  aria-label={`${time}${isBooked ? " - Booked" : " - Available"}`}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Slot Summary */}
      {selectedDate && selectedTime && (
        <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200 animate-fadeIn">
          <p className="text-sm text-gray-700 mb-3">
            <span className="font-medium">Selected:</span>{" "}
            {new Date(selectedDate).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}{" "}
            at <span className="font-semibold text-amber-700">{selectedTime}</span>
          </p>
          <button className="w-full py-3 bg-amber-600 text-white font-semibold rounded-full hover:bg-amber-700 transition-colors">
            Confirm Booking
          </button>
        </div>
      )}

      {/* No date selected message */}
      {!selectedDate && (
        <p className="text-sm text-gray-500 text-center">
          Select a date to view available time slots
        </p>
      )}
    </div>
  );
}