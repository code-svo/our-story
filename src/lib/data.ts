// ─── Data Access Layer ───
// Reads from local JSON files if they exist, otherwise falls back to demo data.
// On the server side (SSR), reads files directly. Client-side uses the API.

import { Memory, SpecialDate, Letter, SiteSettings } from './types';
import { demoSettings, demoMemories, demoSpecialDates, demoLetters } from './demo-data';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

async function readJsonFile<T>(filename: string, fallback: T): Promise<T> {
  try {
    const filepath = path.join(DATA_DIR, filename);
    if (!existsSync(filepath)) return fallback;
    const content = await readFile(filepath, 'utf-8');
    const data = JSON.parse(content);
    // Return fallback if array is empty (prefer demo data over empty arrays)
    if (Array.isArray(data) && data.length === 0) return fallback;
    return data;
  } catch {
    return fallback;
  }
}

// ─── Settings ───
export async function getSettings(): Promise<SiteSettings> {
  return readJsonFile<SiteSettings>('settings.json', demoSettings);
}

// ─── Memories ───
export async function getMemories(): Promise<Memory[]> {
  const memories = await readJsonFile<Memory[]>('memories.json', demoMemories);
  return [...memories].sort((a, b) =>
    new Date(b.memory_date).getTime() - new Date(a.memory_date).getTime()
  );
}

export async function getMemory(id: string): Promise<Memory | null> {
  const memories = await readJsonFile<Memory[]>('memories.json', demoMemories);
  return memories.find(m => m.id === id) || null;
}

// ─── Special Dates ───
export async function getSpecialDates(): Promise<SpecialDate[]> {
  const dates = await readJsonFile<SpecialDate[]>('special-dates.json', demoSpecialDates);
  return [...dates].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

// ─── Letters ───
export async function getLetters(): Promise<Letter[]> {
  const letters = await readJsonFile<Letter[]>('letters.json', demoLetters);
  return [...letters].sort((a, b) =>
    new Date(b.letter_date).getTime() - new Date(a.letter_date).getTime()
  );
}

// ─── Date Helpers (re-exported from client-safe module) ───
export { getNextOccurrence, getUpcomingSpecialDate } from './date-utils';
