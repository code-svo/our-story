'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';

interface DateIdea {
  id: string;
  text: string;
  category: 'romantic' | 'adventure' | 'chill' | 'food' | 'travel' | 'surprise';
  done: boolean;
  createdAt: number;
  note?: string;
}

const CATEGORY_CONFIG = {
  romantic: { emoji: '💕', label: 'Romantic', color: '#FF69B4' },
  adventure: { emoji: '🏔️', label: 'Adventure', color: '#4CAF50' },
  chill: { emoji: '🌙', label: 'Chill', color: '#7C4DFF' },
  food: { emoji: '🍕', label: 'Food', color: '#FF9800' },
  travel: { emoji: '✈️', label: 'Travel', color: '#2196F3' },
  surprise: { emoji: '🎁', label: 'Surprise', color: '#E91E63' },
} as const;

const STORAGE_KEY = 'our-story-date-ideas';

function loadIdeas(): DateIdea[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveIdeas(ideas: DateIdea[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ideas));
}

export default function DatePlanningClient() {
  const [ideas, setIdeas] = useState<DateIdea[]>([]);
  const [mounted, setMounted] = useState(false);
  const [newText, setNewText] = useState('');
  const [newCategory, setNewCategory] = useState<DateIdea['category']>('romantic');
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<DateIdea['category'] | 'all'>('all');
  const [showDone, setShowDone] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNote, setEditNote] = useState('');

  useEffect(() => {
    setIdeas(loadIdeas());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) saveIdeas(ideas);
  }, [ideas, mounted]);

  const addIdea = () => {
    if (!newText.trim()) return;
    const idea: DateIdea = {
      id: Date.now().toString(),
      text: newText.trim(),
      category: newCategory,
      done: false,
      createdAt: Date.now(),
    };
    setIdeas(prev => [idea, ...prev]);
    setNewText('');
    setShowForm(false);
  };

  const toggleDone = (id: string) => {
    setIdeas(prev => prev.map(i => i.id === id ? { ...i, done: !i.done } : i));
  };

  const deleteIdea = (id: string) => {
    setIdeas(prev => prev.filter(i => i.id !== id));
  };

  const saveNote = (id: string) => {
    setIdeas(prev => prev.map(i => i.id === id ? { ...i, note: editNote } : i));
    setEditingId(null);
    setEditNote('');
  };

  const filteredIdeas = ideas.filter(i => {
    if (filter !== 'all' && i.category !== filter) return false;
    if (!showDone && i.done) return false;
    return true;
  });

  const totalDone = ideas.filter(i => i.done).length;
  const totalPending = ideas.filter(i => !i.done).length;

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gold/50 font-display text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <p className="label-caps mb-3">📝 Our Scratchbook</p>
          <h1 className="text-gold-gradient text-3xl sm:text-4xl md:text-5xl font-light tracking-wide font-display mb-3">
            Date Ideas
          </h1>
          <p className="text-muted-foreground text-sm font-display max-w-md mx-auto">
            A place to collect all our date ideas, adventures we want to have, and memories we want to make together.
          </p>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex items-center justify-center gap-6 mb-8"
        >
          <div className="text-center">
            <span className="text-gold text-xl font-display">{totalPending}</span>
            <p className="label-caps mt-0.5 !text-[0.55rem]">Planned</p>
          </div>
          <div className="w-px h-6 bg-gold/10" />
          <div className="text-center">
            <span className="text-gold text-xl font-display">{totalDone}</span>
            <p className="label-caps mt-0.5 !text-[0.55rem]">Done</p>
          </div>
          <div className="w-px h-6 bg-gold/10" />
          <div className="text-center">
            <span className="text-gold text-xl font-display">{ideas.length}</span>
            <p className="label-caps mt-0.5 !text-[0.55rem]">Total</p>
          </div>
        </motion.div>

        {/* Add Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <AnimatePresence mode="wait">
            {!showForm ? (
              <motion.button
                key="add-btn"
                onClick={() => setShowForm(true)}
                className="w-full py-4 rounded-2xl border border-dashed border-gold/20 text-gold/60 text-sm font-display tracking-wider transition-all duration-300 hover:border-gold/40 hover:text-gold/80 hover:bg-gold/5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                + Add a new date idea
              </motion.button>
            ) : (
              <motion.div
                key="add-form"
                initial={{ opacity: 0, y: -10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.97 }}
                className="card-soft rounded-2xl p-6"
              >
                <input
                  type="text"
                  value={newText}
                  onChange={e => setNewText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addIdea()}
                  placeholder="What should we do? ✨"
                  autoFocus
                  className="w-full bg-transparent border-b border-gold/20 pb-3 text-foreground text-base font-display placeholder:text-muted-foreground/40 focus:outline-none focus:border-gold/50 transition-colors"
                />

                {/* Category picker */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {(Object.keys(CATEGORY_CONFIG) as DateIdea['category'][]).map(cat => {
                    const cfg = CATEGORY_CONFIG[cat];
                    return (
                      <button
                        key={cat}
                        onClick={() => setNewCategory(cat)}
                        className="px-3 py-1.5 rounded-full text-xs font-medium tracking-wider transition-all duration-200"
                        style={{
                          border: `1px solid ${newCategory === cat ? cfg.color : 'rgba(139,34,82,0.15)'}`,
                          color: newCategory === cat ? cfg.color : 'rgba(139,34,82,0.5)',
                          backgroundColor: newCategory === cat ? `${cfg.color}15` : 'transparent',
                        }}
                      >
                        {cfg.emoji} {cfg.label}
                      </button>
                    );
                  })}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 mt-5">
                  <button
                    onClick={() => { setShowForm(false); setNewText(''); }}
                    className="text-muted-foreground/60 text-xs tracking-wider hover:text-muted-foreground transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addIdea}
                    disabled={!newText.trim()}
                    className="btn-gold text-xs disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Add idea ✨
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Filters */}
        {ideas.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-between mb-6 flex-wrap gap-3"
          >
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-full text-xs tracking-wider transition-all duration-200 ${
                  filter === 'all'
                    ? 'bg-gold/15 text-gold border border-gold/30'
                    : 'text-muted-foreground/50 border border-transparent hover:text-gold/60'
                }`}
              >
                All
              </button>
              {(Object.keys(CATEGORY_CONFIG) as DateIdea['category'][]).map(cat => {
                const cfg = CATEGORY_CONFIG[cat];
                const count = ideas.filter(i => i.category === cat && (!i.done || showDone)).length;
                if (count === 0 && filter !== cat) return null;
                return (
                  <button
                    key={cat}
                    onClick={() => setFilter(filter === cat ? 'all' : cat)}
                    className={`px-3 py-1 rounded-full text-xs tracking-wider transition-all duration-200 ${
                      filter === cat
                        ? 'border'
                        : 'text-muted-foreground/50 border border-transparent hover:text-gold/60'
                    }`}
                    style={filter === cat ? {
                      borderColor: `${cfg.color}50`,
                      color: cfg.color,
                      backgroundColor: `${cfg.color}15`,
                    } : {}}
                  >
                    {cfg.emoji} {count}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setShowDone(!showDone)}
              className="text-xs text-muted-foreground/50 tracking-wider hover:text-gold/60 transition-colors"
            >
              {showDone ? 'Hide done' : 'Show done'}
            </button>
          </motion.div>
        )}

        {/* Ideas List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredIdeas.map((idea, index) => {
              const cfg = CATEGORY_CONFIG[idea.category];
              return (
                <motion.div
                  key={idea.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -40, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className={`group card-soft rounded-xl p-4 transition-all duration-300 hover:border-gold/15 ${
                    idea.done ? 'opacity-60' : ''
                  }`}
                  style={{
                    borderLeft: `3px solid ${idea.done ? 'rgba(139,34,82,0.15)' : cfg.color}`,
                  }}
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleDone(idea.id)}
                      className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border transition-all duration-300 flex items-center justify-center"
                      style={{
                        borderColor: idea.done ? cfg.color : 'rgba(139,34,82,0.25)',
                        backgroundColor: idea.done ? cfg.color : 'transparent',
                      }}
                    >
                      {idea.done && (
                        <motion.svg
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          width="10" height="10" viewBox="0 0 24 24"
                          fill="none" stroke="white" strokeWidth="3"
                        >
                          <path d="M5 12l5 5L20 7" />
                        </motion.svg>
                      )}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-sm font-display ${
                            idea.done ? 'line-through text-muted-foreground/50' : 'text-foreground'
                          }`}
                        >
                          {idea.text}
                        </span>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                          style={{
                            color: cfg.color,
                            backgroundColor: `${cfg.color}15`,
                            border: `1px solid ${cfg.color}30`,
                          }}
                        >
                          {cfg.emoji} {cfg.label}
                        </span>
                      </div>

                      {/* Note */}
                      {idea.note && editingId !== idea.id && (
                        <p className="text-xs text-muted-foreground/60 mt-2 font-display italic pl-0.5">
                          📝 {idea.note}
                        </p>
                      )}

                      {/* Edit note */}
                      {editingId === idea.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-3"
                        >
                          <textarea
                            value={editNote}
                            onChange={e => setEditNote(e.target.value)}
                            placeholder="Add notes, ideas, links..."
                            autoFocus
                            rows={2}
                            className="w-full bg-background/50 border border-gold/15 rounded-lg p-2 text-xs text-foreground font-display placeholder:text-muted-foreground/30 focus:outline-none focus:border-gold/30 resize-none"
                          />
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => saveNote(idea.id)}
                              className="text-xs text-gold tracking-wider hover:text-gold-light transition-colors"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => { setEditingId(null); setEditNote(''); }}
                              className="text-xs text-muted-foreground/50 tracking-wider hover:text-muted-foreground transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => {
                          setEditingId(editingId === idea.id ? null : idea.id);
                          setEditNote(idea.note || '');
                        }}
                        className="p-1.5 rounded-lg hover:bg-gold/10 transition-colors"
                        title="Add note"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteIdea(idea.id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                        title="Delete"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5">
                          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty state */}
        {ideas.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center py-16"
          >
            <div className="text-5xl mb-4">💭</div>
            <h3 className="text-gold/60 text-lg font-display mb-2">No ideas yet!</h3>
            <p className="text-muted-foreground/40 text-sm font-display max-w-xs mx-auto">
              Start adding date ideas — from romantic dinners to wild adventures. This is our planning scratchbook.
            </p>
          </motion.div>
        )}

        {/* Filtered empty state */}
        {ideas.length > 0 && filteredIdeas.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground/40 text-sm font-display">
              No ideas in this category yet.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
