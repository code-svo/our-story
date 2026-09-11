'use client';

import { useState, useEffect } from 'react';

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
}

function calculateCountdown(targetDate: string): CountdownTime {
  const now = new Date();
  const target = new Date(targetDate);

  // If no year in the date, assume this year or next
  const thisYear = now.getFullYear();
  let nextBirthday = new Date(thisYear, target.getMonth(), target.getDate());
  if (nextBirthday <= now) {
    nextBirthday = new Date(thisYear + 1, target.getMonth(), target.getDate());
  }

  const diff = nextBirthday.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isComplete: false,
  };
}

export default function Countdown({
  targetDate,
  name,
}: {
  targetDate: string;
  name: string;
}) {
  const [time, setTime] = useState<CountdownTime>(calculateCountdown(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(calculateCountdown(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (time.isComplete) {
    return (
      <div className="text-center py-8">
        <p className="label-caps mb-3">🎂 Today is the day!</p>
        <h3 className="text-gold-gradient text-2xl md:text-3xl font-light font-display">
          Happy Birthday, {name}!
        </h3>
        <a
          href="/birthday"
          className="btn-gold inline-block mt-6 text-sm"
        >
          See the celebration →
        </a>
      </div>
    );
  }

  return (
    <div className="text-center">
      <p className="label-caps mb-6">Counting down to {name}&apos;s birthday</p>

      <div className="flex items-center justify-center gap-3 md:gap-5">
        <CountdownUnit value={time.days} label="Days" />
        <span className="text-gold/30 text-2xl mt-[-20px]">:</span>
        <CountdownUnit value={time.hours} label="Hours" />
        <span className="text-gold/30 text-2xl mt-[-20px]">:</span>
        <CountdownUnit value={time.minutes} label="Min" />
        <span className="text-gold/30 text-2xl mt-[-20px]">:</span>
        <CountdownUnit value={time.seconds} label="Sec" />
      </div>
    </div>
  );
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="relative">
      <div
        className="w-16 md:w-20 h-16 md:h-20 rounded-lg flex items-center justify-center animate-glow-pulse card-soft !bg-card"
      >
        <span className="text-gold-gradient text-2xl md:text-3xl font-light font-display">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <p className="label-caps mt-2 text-center !text-[0.55rem]">
        {label}
      </p>
    </div>
  );
}
