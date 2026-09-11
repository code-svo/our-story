import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { Memory, SpecialDate, Letter } from '@/lib/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const MEMORIES_FILE = path.join(DATA_DIR, 'memories.json');
const DATES_FILE = path.join(DATA_DIR, 'special-dates.json');
const LETTERS_FILE = path.join(DATA_DIR, 'letters.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

async function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
}

async function readJsonFile<T>(filepath: string, fallback: T): Promise<T> {
  try {
    if (!existsSync(filepath)) return fallback;
    const content = await readFile(filepath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return fallback;
  }
}

async function writeJsonFile(filepath: string, data: unknown) {
  await ensureDataDir();
  await writeFile(filepath, JSON.stringify(data, null, 2), 'utf-8');
}

// ─── GET: Read data ───
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  try {
    switch (type) {
      case 'memories':
        return NextResponse.json(await readJsonFile<Memory[]>(MEMORIES_FILE, []));
      case 'dates':
        return NextResponse.json(await readJsonFile<SpecialDate[]>(DATES_FILE, []));
      case 'letters':
        return NextResponse.json(await readJsonFile<Letter[]>(LETTERS_FILE, []));
      case 'settings':
        return NextResponse.json(await readJsonFile(SETTINGS_FILE, null));
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Read error:', error);
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

// ─── POST: Write data ───
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    switch (type) {
      case 'memory': {
        const memories = await readJsonFile<Memory[]>(MEMORIES_FILE, []);
        const newMemory: Memory = {
          id: crypto.randomUUID(),
          title: data.title,
          memory_date: data.memory_date,
          caption: data.caption || null,
          photo_urls: data.photo_urls || [],
          created_at: new Date().toISOString(),
        };
        memories.push(newMemory);
        await writeJsonFile(MEMORIES_FILE, memories);
        return NextResponse.json(newMemory);
      }

      case 'date': {
        const dates = await readJsonFile<SpecialDate[]>(DATES_FILE, []);
        const newDate: SpecialDate = {
          id: crypto.randomUUID(),
          date: data.date,
          label: data.label,
          linked_memory_id: data.linked_memory_id || null,
          recurring: data.recurring ?? true,
        };
        dates.push(newDate);
        await writeJsonFile(DATES_FILE, dates);
        return NextResponse.json(newDate);
      }

      case 'letter': {
        const letters = await readJsonFile<Letter[]>(LETTERS_FILE, []);
        const newLetter: Letter = {
          id: crypto.randomUUID(),
          title: data.title || null,
          content: data.content,
          letter_date: data.letter_date || new Date().toISOString().split('T')[0],
          created_at: new Date().toISOString(),
        };
        letters.push(newLetter);
        await writeJsonFile(LETTERS_FILE, letters);
        return NextResponse.json(newLetter);
      }

      case 'settings': {
        await writeJsonFile(SETTINGS_FILE, data);
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Write error:', error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}

// ─── DELETE: Remove data ───
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!type || !id) {
      return NextResponse.json({ error: 'Missing type or id' }, { status: 400 });
    }

    switch (type) {
      case 'memory': {
        const memories = await readJsonFile<Memory[]>(MEMORIES_FILE, []);
        const filtered = memories.filter(m => m.id !== id);
        await writeJsonFile(MEMORIES_FILE, filtered);
        return NextResponse.json({ success: true });
      }
      case 'date': {
        const dates = await readJsonFile<SpecialDate[]>(DATES_FILE, []);
        const filtered = dates.filter(d => d.id !== id);
        await writeJsonFile(DATES_FILE, filtered);
        return NextResponse.json({ success: true });
      }
      case 'letter': {
        const letters = await readJsonFile<Letter[]>(LETTERS_FILE, []);
        const filtered = letters.filter(l => l.id !== id);
        await writeJsonFile(LETTERS_FILE, filtered);
        return NextResponse.json({ success: true });
      }
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
