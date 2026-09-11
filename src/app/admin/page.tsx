'use client';

import { useState, useRef, FormEvent, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Tab = 'memory' | 'date' | 'letter' | 'settings';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('memory');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'memory', label: 'Add Memory', icon: '📸' },
    { key: 'date', label: 'Add Date', icon: '📅' },
    { key: 'letter', label: 'Add Letter', icon: '✉️' },
    { key: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen pt-24 md:pt-28 pb-16 px-4 md:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <p className="label-caps mb-3">Admin Panel</p>
          <h1 className="text-gold-gradient text-2xl md:text-3xl font-bold tracking-wide mb-4 font-display">
            Add to Our Story
          </h1>
          <div className="hairline-short" />
        </motion.div>

        {/* Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-6 p-4 rounded-lg text-center text-sm ${
                notification.type === 'success'
                  ? 'bg-green-900/30 border border-green-700/30 text-green-300'
                  : 'bg-red-900/30 border border-red-700/30 text-red-300'
              }`}
            >
              {notification.message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 justify-center flex-wrap">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`label-caps px-4 py-2 rounded-full border transition-all duration-300 whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.key
                  ? '!text-gold border-gold/30 bg-gold/5 glow-gold'
                  : '!text-muted-foreground/50 border-gold/10 hover:!text-muted-foreground'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Forms */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6 md:p-8 rounded-xl card-soft"
        >
          {activeTab === 'memory' && <MemoryForm onNotify={showNotification} />}
          {activeTab === 'date' && <DateForm onNotify={showNotification} />}
          {activeTab === 'letter' && <LetterForm onNotify={showNotification} />}
          {activeTab === 'settings' && <SettingsForm onNotify={showNotification} />}
        </motion.div>
      </div>
    </div>
  );
}

// ─── Notification helper type ───
type NotifyFn = (type: 'success' | 'error', message: string) => void;

// ─── Memory Form with Photo Upload ───
function MemoryForm({ onNotify }: { onNotify: NotifyFn }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [caption, setCaption] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    setFiles(prev => [...prev, ...selected]);

    // Generate previews
    selected.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // 1. Upload photos if any
      let photoUrls: string[] = [];
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadRes.ok) throw new Error('Photo upload failed');
        const { urls } = await uploadRes.json();
        photoUrls = urls;
      }

      // 2. Save memory
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'memory',
          data: {
            title,
            memory_date: date,
            caption,
            photo_urls: photoUrls,
          },
        }),
      });

      if (!res.ok) throw new Error('Failed to save memory');

      onNotify('success', `Memory "${title}" saved successfully! Refresh the Memories page to see it.`);
      setTitle('');
      setDate('');
      setCaption('');
      setFiles([]);
      setPreviews([]);
    } catch (err) {
      onNotify('error', `Failed to save: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h3 className="text-gold text-sm font-semibold tracking-wider uppercase mb-4 font-display">
        New Memory
      </h3>

      <div>
        <label className="label-caps block mb-2">Title *</label>
        <input
          type="text"
          className="input-base"
          placeholder="e.g. Our First Dance"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="label-caps block mb-2">Date *</label>
        <input
          type="date"
          className="input-base"
          value={date}
          onChange={e => setDate(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="label-caps block mb-2">Caption / Story</label>
        <textarea
          className="input-base min-h-[120px] resize-y"
          placeholder="Tell the story of this moment..."
          value={caption}
          onChange={e => setCaption(e.target.value)}
          rows={4}
        />
      </div>

      <div>
        <label className="label-caps block mb-2">Photos</label>

        {/* Photo previews */}
        {previews.length > 0 && (
          <div className="flex gap-3 flex-wrap mb-4">
            {previews.map((preview, i) => (
              <div key={i} className="relative group">
                <img
                  src={preview}
                  alt={`Preview ${i + 1}`}
                  className="w-20 h-20 object-cover rounded-lg border border-gold/10"
                />
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-900 rounded-full flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gold/15 rounded-lg p-6 text-center hover:border-gold/30 transition-colors cursor-pointer"
        >
          <svg className="w-8 h-8 mx-auto mb-2 text-gold/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          <p className="text-muted-foreground/50 text-sm">Click to add photos</p>
          <p className="text-muted-foreground/30 text-xs mt-1">JPG, PNG, WEBP — up to 10MB each</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <button type="submit" disabled={saving} className="btn-gold w-full disabled:opacity-50">
        {saving ? (
          <span className="inline-flex items-center gap-2">
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="30 70" />
            </svg>
            Saving...
          </span>
        ) : (
          'Save Memory'
        )}
      </button>
    </form>
  );
}

// ─── Date Form ───
function DateForm({ onNotify }: { onNotify: NotifyFn }) {
  const [date, setDate] = useState('');
  const [label, setLabel] = useState('');
  const [recurring, setRecurring] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'date',
          data: { date, label, recurring },
        }),
      });

      if (!res.ok) throw new Error('Failed to save');
      onNotify('success', `Special date "${label}" saved!`);
      setDate('');
      setLabel('');
    } catch (err) {
      onNotify('error', `Failed to save: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h3 className="text-gold text-sm font-semibold tracking-wider uppercase mb-4 font-display">
        New Special Date
      </h3>
      <div>
        <label className="label-caps block mb-2">Date *</label>
        <input type="date" className="input-base" value={date} onChange={e => setDate(e.target.value)} required />
      </div>
      <div>
        <label className="label-caps block mb-2">Label *</label>
        <input type="text" className="input-base" placeholder="e.g. Our Anniversary" value={label} onChange={e => setLabel(e.target.value)} required />
      </div>
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="recurring"
          checked={recurring}
          onChange={e => setRecurring(e.target.checked)}
          className="accent-[var(--gold)] w-4 h-4"
        />
        <label htmlFor="recurring" className="text-muted-foreground text-sm">Recurring every year</label>
      </div>
      <button type="submit" disabled={saving} className="btn-gold w-full disabled:opacity-50">
        {saving ? 'Saving...' : 'Save Date'}
      </button>
    </form>
  );
}

// ─── Letter Form ───
function LetterForm({ onNotify }: { onNotify: NotifyFn }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'letter',
          data: { title, content },
        }),
      });

      if (!res.ok) throw new Error('Failed to save');
      onNotify('success', 'Letter saved with love ♥');
      setTitle('');
      setContent('');
    } catch (err) {
      onNotify('error', `Failed to save: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h3 className="text-gold text-sm font-semibold tracking-wider uppercase mb-4 font-display">
        New Letter
      </h3>
      <div>
        <label className="label-caps block mb-2">Title (optional)</label>
        <input type="text" className="input-base" placeholder="e.g. For When You Miss Me" value={title} onChange={e => setTitle(e.target.value)} />
      </div>
      <div>
        <label className="label-caps block mb-2">Your Words *</label>
        <textarea
          className="input-base min-h-[200px] resize-y"
          placeholder="Write from the heart..."
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={8}
          required
          style={{ fontStyle: 'italic' }}
          className="input-base min-h-[200px] resize-y font-display"
        />
      </div>
      <button type="submit" disabled={saving} className="btn-gold w-full disabled:opacity-50">
        {saving ? 'Saving...' : 'Save Letter'}
      </button>
    </form>
  );
}

// ─── Settings Form ───
function SettingsForm({ onNotify }: { onNotify: NotifyFn }) {
  const [partner1, setPartner1] = useState('Shubhajit');
  const [partner2, setPartner2] = useState('Bubu');
  const [startDate, setStartDate] = useState('2025-07-19');
  const [birthday, setBirthday] = useState('2026-09-12');
  const [birthdayName, setBirthdayName] = useState('Bubu');
  const [birthdayMessage, setBirthdayMessage] = useState('Every moment with you is a gift I never knew I needed. You make the ordinary feel magical. Happy Birthday, my love. Here\'s to us — today, tomorrow, and always. ♥');
  const [passcode, setPasscode] = useState('ourstory');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'settings',
          data: {
            partner1_name: partner1,
            partner2_name: partner2,
            relationship_start: startDate,
            birthday,
            birthday_name: birthdayName,
            birthday_message: birthdayMessage,
            passcode,
          },
        }),
      });

      if (!res.ok) throw new Error('Failed to save');
      onNotify('success', 'Settings saved! Refresh the page to see changes.');
    } catch (err) {
      onNotify('error', `Failed to save: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h3 className="text-gold text-sm font-semibold tracking-wider uppercase mb-4 font-display">
        Site Settings
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label-caps block mb-2">Partner 1 Name</label>
          <input type="text" className="input-base" value={partner1} onChange={e => setPartner1(e.target.value)} />
        </div>
        <div>
          <label className="label-caps block mb-2">Partner 2 Name</label>
          <input type="text" className="input-base" value={partner2} onChange={e => setPartner2(e.target.value)} />
        </div>
      </div>
      <div>
        <label className="label-caps block mb-2">Relationship Start Date</label>
        <input type="date" className="input-base" value={startDate} onChange={e => setStartDate(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label-caps block mb-2">Birthday Date</label>
          <input type="date" className="input-base" value={birthday} onChange={e => setBirthday(e.target.value)} />
        </div>
        <div>
          <label className="label-caps block mb-2">Birthday Name</label>
          <input type="text" className="input-base" value={birthdayName} onChange={e => setBirthdayName(e.target.value)} />
        </div>
      </div>
      <div>
        <label className="label-caps block mb-2">Birthday Message</label>
        <textarea className="input-base min-h-[100px] resize-y" rows={3}
          value={birthdayMessage} onChange={e => setBirthdayMessage(e.target.value)}
        />
      </div>
      <div>
        <label className="label-caps block mb-2">Access Passcode</label>
        <input type="text" className="input-base" value={passcode} onChange={e => setPasscode(e.target.value)} />
      </div>
      <button type="submit" disabled={saving} className="btn-gold w-full disabled:opacity-50">
        {saving ? 'Saving...' : 'Save Settings'}
      </button>
    </form>
  );
}
