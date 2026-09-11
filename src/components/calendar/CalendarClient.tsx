'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SpecialDate, Memory } from '@/lib/types';
import { getNextOccurrence } from '@/lib/date-utils';

interface CalendarClientProps {
  specialDates: SpecialDate[];
  memories: Memory[];
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function CalendarClient({ specialDates, memories }: CalendarClientProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<SpecialDate | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Build calendar grid
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = [];

    // Leading empty cells
    for (let i = 0; i < firstDay; i++) days.push(null);
    // Day cells
    for (let d = 1; d <= daysInMonth; d++) days.push(d);

    return days;
  }, [year, month]);

  // Map special dates to this month (considering recurring)
  const specialDatesMap = useMemo(() => {
    const map = new Map<number, SpecialDate>();
    for (const sd of specialDates) {
      const d = new Date(sd.date);
      // Check if this date occurs in the current month
      if (sd.recurring) {
        if (d.getMonth() === month) {
          map.set(d.getDate(), sd);
        }
      } else {
        if (d.getFullYear() === year && d.getMonth() === month) {
          map.set(d.getDate(), sd);
        }
      }
    }
    return map;
  }, [specialDates, year, month]);

  // Find upcoming special date
  const upcomingDate = useMemo(() => {
    let closest: { sd: SpecialDate; diff: number } | null = null;
    const now = new Date();
    for (const sd of specialDates) {
      const next = getNextOccurrence(sd.date, sd.recurring);
      const diff = next.getTime() - now.getTime();
      if (diff > 0 && (!closest || diff < closest.diff)) {
        closest = { sd, diff };
      }
    }
    return closest;
  }, [specialDates]);

  const linkedMemory = selectedDate?.linked_memory_id
    ? memories.find(m => m.id === selectedDate.linked_memory_id)
    : null;

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <div className="min-h-screen pt-24 md:pt-28 pb-16 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p className="label-caps mb-3">Dates That Matter</p>
          <h1 className="text-gold-gradient text-3xl md:text-5xl font-light tracking-wide mb-4 font-display">
            Our Calendar
          </h1>
          <div className="hairline-short" />
        </motion.div>

        {/* Upcoming Widget */}
        {upcomingDate && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="max-w-md mx-auto mb-10 p-4 rounded-xl text-center card-soft glow-gold"
          >
            <p className="label-caps mb-1">Coming Up</p>
            <p className="text-gold text-lg font-normal font-display">
              {upcomingDate.sd.label}
            </p>
            <p className="text-muted-foreground/50 text-xs mt-1">
              in {Math.ceil(upcomingDate.diff / (1000 * 60 * 60 * 24))} days
            </p>
          </motion.div>
        )}

        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="max-w-lg mx-auto"
        >
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={prevMonth}
              className="p-2 rounded-full hover:bg-gold/5 transition-colors"
              aria-label="Previous month"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <h2 className="text-gold text-lg font-normal tracking-wide font-display">
              {MONTH_NAMES[month]} {year}
            </h2>

            <button
              onClick={nextMonth}
              className="p-2 rounded-full hover:bg-gold/5 transition-colors"
              aria-label="Next month"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {WEEKDAYS.map(day => (
              <div key={day} className="text-center label-caps py-2 !text-[0.55rem]">
                {day}
              </div>
            ))}
          </div>

          {/* Day Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, i) => {
              if (day === null) {
                return <div key={`empty-${i}`} className="aspect-square" />;
              }

              const specialDate = specialDatesMap.get(day);
              const isToday =
                day === new Date().getDate() &&
                month === new Date().getMonth() &&
                year === new Date().getFullYear();

              return (
                <button
                  key={`day-${day}`}
                  onClick={() => specialDate && setSelectedDate(specialDate)}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-all duration-300 relative
                    ${specialDate ? 'cursor-pointer hover:bg-gold/10' : 'cursor-default'}
                    ${isToday ? 'bg-gold/5 text-gold' : 'text-muted-foreground'}
                    ${selectedDate?.id === specialDate?.id ? 'bg-gold/10 ring-1 ring-gold/30' : ''}
                  `}
                >
                  <span className={isToday ? 'font-normal' : ''}>{day}</span>
                  {specialDate && (
                    <div className="absolute bottom-1.5 w-1 h-1 rounded-full bg-gold shadow-[0_0_4px_oklch(0.50_0.18_15_/_60%)]" />
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Selected Date Detail */}
        <AnimatePresence mode="wait">
          {selectedDate && (
            <motion.div
              key={selectedDate.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="max-w-lg mx-auto mt-8 p-6 rounded-xl card-soft"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="label-caps mb-2">
                    {new Date(selectedDate.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                    })}
                    {selectedDate.recurring && (
                      <span className="ml-2 text-gold/30">↻ Recurring</span>
                    )}
                  </p>
                  <h3 className="text-gold text-xl font-normal font-display">
                    {selectedDate.label}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedDate(null)}
                  className="text-muted-foreground/50 hover:text-gold transition-colors p-1"
                  aria-label="Close"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {linkedMemory && (
                <div className="mt-4 pt-4 border-t border-gold/10">
                  <p className="label-caps mb-2">Linked Memory</p>
                  <a
                    href={`/memories`}
                    className="text-gold-light text-sm hover:underline font-display"
                  >
                    {linkedMemory.title} →
                  </a>
                  {linkedMemory.caption && (
                    <p className="text-muted-foreground text-xs mt-2 line-clamp-2">
                      {linkedMemory.caption}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* All Special Dates List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="max-w-lg mx-auto mt-12"
        >
          <p className="label-caps text-center mb-6">All Special Dates</p>
          <div className="space-y-3">
            {specialDates.map((sd, i) => {
              const d = new Date(sd.date);
              return (
                <motion.div
                  key={sd.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.05 }}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-card/50 transition-colors cursor-pointer"
                  onClick={() => {
                    setCurrentDate(new Date(year, d.getMonth(), 1));
                    setSelectedDate(sd);
                  }}
                >
                  <div className="w-10 h-10 rounded-lg card-soft flex items-center justify-center flex-shrink-0 !transform-none">
                    <span className="text-gold text-xs font-normal">
                      {d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground text-sm font-medium truncate">{sd.label}</p>
                    <p className="text-muted-foreground/50 text-xs">
                      {d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                      {sd.recurring && ' · Every year'}
                    </p>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-gold/40 flex-shrink-0" />
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
