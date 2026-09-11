'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Memory } from '@/lib/types';
import { useEffect } from 'react';

interface MemoryModalProps {
  memory: Memory;
  onClose: () => void;
}

export default function MemoryModal({ memory, onClose }: MemoryModalProps) {
  const date = new Date(memory.memory_date);
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Close on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="relative z-10 w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl card-soft !transform-none"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-background/60 backdrop-blur-sm border border-gold/10 hover:border-gold/30 transition-colors"
            aria-label="Close"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Photo Gallery */}
          {memory.photo_urls.length > 0 && (
            <div className="relative">
              <div className="aspect-[16/10] overflow-hidden rounded-t-xl bg-secondary">
                <img
                  src={memory.photo_urls[0]}
                  alt={memory.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {memory.photo_urls.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {memory.photo_urls.slice(1).map((url, i) => (
                    <div key={i} className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-secondary">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-6 md:p-8">
            <p className="label-caps mb-3">{formattedDate}</p>

            <h2 className="text-gold-gradient text-2xl md:text-3xl font-light tracking-wide mb-4 font-display">
              {memory.title}
            </h2>

            <div className="hairline-short" style={{ margin: '1.5rem auto' }} />

            {memory.caption && (
              <div className="space-y-4">
                {memory.caption.split('\n').map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-foreground/80 text-sm md:text-base leading-relaxed font-display"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
