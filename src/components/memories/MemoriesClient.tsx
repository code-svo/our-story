'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Memory } from '@/lib/types';
import MemoryCard from './MemoryCard';
import MemoryModal from './MemoryModal';

interface MemoriesClientProps {
  memories: Memory[];
}

export default function MemoriesClient({ memories }: MemoriesClientProps) {
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const sortedMemories = [...memories].sort((a, b) => {
    const dateA = new Date(a.memory_date).getTime();
    const dateB = new Date(b.memory_date).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className="min-h-screen pt-24 md:pt-28 pb-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p className="label-caps mb-3">Our Collection</p>
          <h1 className="text-gold-gradient text-3xl md:text-5xl font-light tracking-wide mb-4 font-display">
            Memories
          </h1>
          <div className="hairline-short" />
          <p className="text-muted-foreground text-sm mt-4 max-w-md mx-auto">
            Every moment we&apos;ve held dear, preserved in words and time.
          </p>
        </motion.div>

        {/* Sort Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex justify-center gap-4 mb-10"
        >
          <button
            onClick={() => setSortOrder('newest')}
            className={`label-caps transition-all duration-300 px-4 py-2 rounded-full border ${
              sortOrder === 'newest'
                ? '!text-gold border-gold/30 bg-gold/5 glow-gold'
                : '!text-muted-foreground/50 border-gold/10 hover:!text-muted-foreground'
            }`}
          >
            Newest First
          </button>
          <button
            onClick={() => setSortOrder('oldest')}
            className={`label-caps transition-all duration-300 px-4 py-2 rounded-full border ${
              sortOrder === 'oldest'
                ? '!text-gold border-gold/30 bg-gold/5 glow-gold'
                : '!text-muted-foreground/50 border-gold/10 hover:!text-muted-foreground'
            }`}
          >
            Oldest First
          </button>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Center line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/20 to-transparent" />

          <div className="space-y-8 md:space-y-12">
            {sortedMemories.map((memory, index) => (
              <motion.div
                key={memory.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                className={`relative flex items-start gap-6 md:gap-0 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-4 md:left-1/2 top-6 w-2 h-2 -translate-x-1/2 rounded-full bg-gold shadow-[0_0_8px_oklch(0.50_0.18_15_/_40%)] z-10" />

                {/* Spacer for mobile */}
                <div className="w-8 flex-shrink-0 md:hidden" />

                {/* Card */}
                <div className={`flex-1 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                  <MemoryCard
                    memory={memory}
                    index={index}
                    onClick={() => setSelectedMemory(memory)}
                  />
                </div>

                {/* Spacer for desktop */}
                <div className="hidden md:block flex-1 md:w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Empty state */}
        {memories.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground/50 text-sm font-display italic">
              Our first memory is waiting to be written...
            </p>
          </div>
        )}
      </div>

      {/* Memory Modal */}
      {selectedMemory && (
        <MemoryModal memory={selectedMemory} onClose={() => setSelectedMemory(null)} />
      )}
    </div>
  );
}
