'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Letter } from '@/lib/types';

interface LettersClientProps {
  letters: Letter[];
}

export default function LettersClient({ letters }: LettersClientProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="min-h-screen pt-24 md:pt-28 pb-16 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p className="label-caps mb-3">Words From The Heart</p>
          <h1 className="text-gold-gradient text-3xl md:text-5xl font-light tracking-wide mb-4 font-display">
            Letters
          </h1>
          <div className="hairline-short" />
          <p className="text-muted-foreground text-sm mt-4 max-w-md mx-auto">
            Some things are best said in writing — quietly, tenderly, with time to choose every word.
          </p>
        </motion.div>

        {/* Letters */}
        <div className="space-y-6">
          {letters.map((letter, index) => (
            <motion.div
              key={letter.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.6 }}
            >
              <LetterCard
                letter={letter}
                isExpanded={expandedId === letter.id}
                onToggle={() => setExpandedId(expandedId === letter.id ? null : letter.id)}
                index={index}
              />
            </motion.div>
          ))}
        </div>

        {/* Empty state */}
        {letters.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground/50 text-sm font-display italic">
              The first letter is waiting to be written...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function LetterCard({
  letter,
  isExpanded,
  onToggle,
  index,
}: {
  letter: Letter;
  isExpanded: boolean;
  onToggle: () => void;
  index: number;
}) {
  const date = new Date(letter.letter_date);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="card-soft rounded-xl overflow-hidden">
      {/* Header — always visible */}
      <button
        onClick={onToggle}
        className="w-full text-left p-6 group cursor-pointer flex items-start justify-between gap-4"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            {/* Wax seal icon */}
            <div className="w-8 h-8 rounded-full bg-wine/30 border border-wine/50 flex items-center justify-center flex-shrink-0">
              <span className="text-gold text-xs">♥</span>
            </div>
            <span className="label-caps">{formattedDate}</span>
          </div>

          {letter.title && (
            <h3 className="text-gold text-lg font-normal tracking-wide font-display">
              {letter.title}
            </h3>
          )}

          {!isExpanded && (
            <p className="text-muted-foreground text-sm mt-2 line-clamp-2 leading-relaxed">
              {letter.content}
            </p>
          )}
        </div>

        {/* Expand indicator */}
        <motion.svg
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="var(--gold-deep)" strokeWidth="1.5"
          className="mt-3 flex-shrink-0"
        >
          <path d="M6 9l6 6 6-6" />
        </motion.svg>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6">
              <div className="hairline mb-6" />

              <div className="space-y-4 pl-2 border-l border-gold/10">
                {letter.content.split('\n').filter(p => p.trim()).map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-foreground/80 text-sm md:text-base leading-loose pl-4 font-display italic"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-6 text-right">
                <p className="text-gold-deep text-xs font-display">
                  — with all my love
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
