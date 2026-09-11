// ─── Types for Our Story ───

export interface Memory {
  id: string;
  title: string;
  memory_date: string;
  caption: string | null;
  photo_urls: string[];
  created_at: string;
}

export interface SpecialDate {
  id: string;
  date: string;
  label: string;
  linked_memory_id: string | null;
  recurring: boolean;
}

export interface Letter {
  id: string;
  title: string | null;
  content: string;
  letter_date: string;
  created_at: string;
}

export interface Setting {
  key: string;
  value: string;
}

export interface SiteSettings {
  partner1_name: string;
  partner2_name: string;
  relationship_start: string;
  birthday: string;
  birthday_name: string;
  birthday_message: string;
  passcode: string;
}
