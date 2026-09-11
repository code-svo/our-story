'use client';

import { useState, useEffect } from 'react';

interface TimeUnits {
  years: number;
  months: number;
  days: number;
}

function calculateTimeTogether(startDate: string): TimeUnits {
  const start = new Date(startDate);
  const now = new Date();

  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
}

export default function LiveCounter({ startDate }: { startDate: string }) {
  const [time, setTime] = useState<TimeUnits>(calculateTimeTogether(startDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(calculateTimeTogether(startDate));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [startDate]);

  return (
    <div className="flex items-center justify-center gap-3 md:gap-6 flex-wrap">
      <CountUnit value={time.years} label="Years" />
      <span className="text-gold-deep text-2xl font-light hidden md:block">·</span>
      <CountUnit value={time.months} label="Months" />
      <span className="text-gold-deep text-2xl font-light hidden md:block">·</span>
      <CountUnit value={time.days} label="Days" />
    </div>
  );
}

function CountUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <div className="text-gold-gradient text-3xl md:text-5xl font-light tracking-tight font-display">
        {value}
      </div>
      <div className="label-caps mt-1">{label}</div>
    </div>
  );
}
