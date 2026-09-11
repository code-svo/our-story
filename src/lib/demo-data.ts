// ─── Demo Data ───
// Used when Supabase is not configured. Replace with real data or connect Supabase.

import { Memory, SpecialDate, Letter, SiteSettings } from './types';

export const demoSettings: SiteSettings = {
  partner1_name: 'Shubhajit',
  partner2_name: 'Bubu',
  relationship_start: '2026-07-19',
  birthday: '2026-09-12',
  birthday_name: 'Bubu',
  birthday_message: 'Every moment with you is a gift I never knew I needed. You make the ordinary feel magical. Happy Birthday, my love. Here\'s to us — today, tomorrow, and always. ♥',
  passcode: 'ourstory',
};

export const demoMemories: Memory[] = [
  {
    id: '1',
    title: 'The Beginning',
    memory_date: '2026-07-19',
    caption: 'It started with a call. Before we became us, we were two people who loved roasting each other.',
    photo_urls: [],
    created_at: '2026-07-19T00:00:00Z',
  },
  {
    id: '2',
    title: 'Our First Date',
    memory_date: '2026-08-09',
    caption: 'A deal, three consecutive 8 Ball Pool wins, and a Spider-Man movie. Somehow, a silly challenge became our first date.',
    photo_urls: [],
    created_at: '2026-08-09T00:00:00Z',
  },
  {
    id: '3',
    title: 'The Goodbye',
    memory_date: '2026-08-17',
    caption: 'Another movie, some quiet time together, and a goodbye that felt harder than it should have. Somewhere in that moment, I realized I was falling for her even deeper.',
    photo_urls: [],
    created_at: '2026-08-17T00:00:00Z',
  },
  {
    id: '4',
    title: 'The Best Day',
    memory_date: '2026-08-29',
    caption: 'The best day of my life. A day that brought us closer than ever and gave us memories and first experiences I\'ll never forget.',
    photo_urls: [],
    created_at: '2026-08-29T00:00:00Z',
  },
  {
    id: '5',
    title: 'Still Us',
    memory_date: '2026-09-10',
    caption: 'We\'ve had our ups and downs, but we\'re still here. Choosing to communicate, understand, grow and face everything together.',
    photo_urls: [],
    created_at: '2026-09-10T00:00:00Z',
  },
];

export const demoSpecialDates: SpecialDate[] = [
  {
    id: '1',
    date: '2026-07-19',
    label: 'The Beginning',
    linked_memory_id: '1',
    recurring: true,
  },
  {
    id: '2',
    date: '2026-08-09',
    label: 'Our First Date',
    linked_memory_id: '2',
    recurring: true,
  },
  {
    id: '3',
    date: '2026-08-17',
    label: 'The Goodbye',
    linked_memory_id: '3',
    recurring: true,
  },
  {
    id: '4',
    date: '2026-08-29',
    label: 'The Best Day',
    linked_memory_id: '4',
    recurring: true,
  },
  {
    id: '5',
    date: '2026-09-12',
    label: 'Bubu\'s Birthday',
    linked_memory_id: null,
    recurring: true,
  },
];

export const demoLetters: Letter[] = [
  {
    id: '1',
    title: 'For the Days You Feel Unsure',
    content: 'I know some days are harder than others. I know the world gets loud, and doubt creeps in. But I want you to know — on those days, especially on those days — I choose you. Not because things are perfect, but because even the imperfect parts of us are worth fighting for.\n\nYou are braver than you believe, stronger than you seem, and more loved than you will ever know. And whenever you forget, I\'ll be right here to remind you.',
    letter_date: '2026-09-15',
    created_at: '2026-09-15T00:00:00Z',
  },
  {
    id: '2',
    title: 'What I Never Told You',
    content: 'I never told you that the first time you laughed — really laughed, the kind that makes your eyes disappear — I felt my heart rearrange itself. It\'s like everything I\'d been carrying suddenly became lighter.\n\nI never told you that I replay our conversations in my head before falling asleep. Or that your voice is the first thing I want to hear every morning.\n\nSome things are too big for words. But I\'m trying anyway, because you deserve to know.',
    letter_date: '2026-12-20',
    created_at: '2026-12-20T00:00:00Z',
  },
  {
    id: '3',
    title: 'A Promise',
    content: 'I promise to be your calm in the chaos. To listen when you need to be heard, and to sit beside you in silence when words aren\'t enough.\n\nI promise to celebrate your wins like they\'re my own, and to hold your hand through the losses. I promise to keep choosing us — not just on the easy days, but on the hard ones too.\n\nThis isn\'t a fairy tale. It\'s something better. It\'s real.',
    letter_date: '2026-07-19',
    created_at: '2026-07-19T00:00:00Z',
  },
];
