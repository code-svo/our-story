import { Suspense } from 'react';
import { getSettings, getMemories, getSpecialDates } from '@/lib/data';
import HeroClient from '@/components/hero/HeroClient';

export default async function HomePage() {
  const settings = await getSettings();
  const memories = await getMemories();
  const specialDates = await getSpecialDates();

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gold/50 font-display text-lg">Loading...</div>
      </div>
    }>
      <HeroClient
        settings={settings}
        memoriesCount={memories.length}
        specialDatesCount={specialDates.length}
      />
    </Suspense>
  );
}
