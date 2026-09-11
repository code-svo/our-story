'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import FloatingParticles from './FloatingParticles';
import LiveCounter from './LiveCounter';
import Countdown from '../birthday/Countdown';
import BirthdayCelebration from '../birthday/BirthdayCelebration';
import { SiteSettings } from '@/lib/types';

interface HeroClientProps {
  settings: SiteSettings;
  memoriesCount: number;
  specialDatesCount: number;
}

export default function HeroClient({ settings, memoriesCount, specialDatesCount }: HeroClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showCelebration, setShowCelebration] = useState(false);

  // Calculate total days together
  const start = new Date(settings.relationship_start);
  const now = new Date();
  const totalDays = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  // Check if we should show the birthday celebration (from ?celebrate=1)
  useEffect(() => {
    if (searchParams.get('celebrate') === '1') {
      setShowCelebration(true);
      // Clean the URL without reloading
      window.history.replaceState({}, '', '/');
    }
  }, [searchParams]);

  const handleCelebrationComplete = () => {
    setShowCelebration(false);
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Birthday celebration overlay — pops on first visit when it's her birthday */}
      {showCelebration && (
        <BirthdayCelebration
          name={settings.birthday_name}
          onComplete={handleCelebrationComplete}
        />
      )}

      <FloatingParticles />

      {/* Hero Section */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-20 pb-12">
        {/* Names */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          className="text-center mb-8"
        >
          <p className="label-caps mb-4">A Love Story</p>
          <h1 className="text-gold-gradient text-4xl sm:text-5xl md:text-7xl font-light tracking-wide leading-tight font-display">
            My darling
            <span className="block text-gold-light mt-1">
              bubu
            </span>
          </h1>
        </motion.div>

        {/* Start Date */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="text-center mb-8"
        >
          <p className="label-caps mb-1">Together since</p>
          <p className="text-muted-foreground text-sm font-display">
            {new Date(settings.relationship_start).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </motion.div>

        {/* Gold Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="hairline-short mb-8"
        />

        {/* Live Counter */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <LiveCounter startDate={settings.relationship_start} />
        </motion.div>
      </section>

      {/* Birthday Countdown Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="relative z-10 px-6 py-16"
      >
        <div className="max-w-2xl mx-auto">
          <div className="card-soft rounded-2xl p-8 md:p-12 glow-gold">
            <Countdown
              targetDate={settings.birthday}
              name={settings.birthday_name}
            />
          </div>
        </div>
      </motion.section>

      {/* Stats Strip */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="relative z-10 px-6 py-12"
      >
        <div className="hairline mb-12" />
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-8 md:gap-16 flex-wrap">
          <StatItem value={totalDays} label="Days Together" />
          <div className="w-px h-8 bg-gold/10 hidden md:block" />
          <StatItem value={memoriesCount} label="Memories Logged" />
          <div className="w-px h-8 bg-gold/10 hidden md:block" />
          <StatItem value={specialDatesCount} label="Special Dates" />
        </div>
      </motion.section>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 2, duration: 1 }}
        className="relative z-10 text-center pb-8"
      >
        <p className="label-caps !text-muted-foreground/50 mb-2 !text-[0.6rem]">Explore</p>
        <motion.svg
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="var(--gold-deep)" strokeWidth="1.5"
          className="mx-auto"
        >
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </motion.svg>
      </motion.div>
    </div>
  );
}

function StatItem({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center group">
      <div className="text-gold text-2xl md:text-3xl font-light font-display transition-colors duration-300 group-hover:text-gold-light">
        {value.toLocaleString()}
      </div>
      <p className="label-caps mt-1">{label}</p>
    </div>
  );
}
