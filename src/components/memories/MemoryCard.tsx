'use client';

import { Memory } from '@/lib/types';

interface MemoryCardProps {
  memory: Memory;
  index: number;
  onClick: () => void;
}

export default function MemoryCard({ memory, index, onClick }: MemoryCardProps) {
  const date = new Date(memory.memory_date);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Calculate relative time
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  let relativeTime = '';
  if (diffDays < 30) relativeTime = `${diffDays} days ago`;
  else if (diffDays < 365) relativeTime = `${Math.floor(diffDays / 30)} months ago`;
  else relativeTime = `${Math.floor(diffDays / 365)} years ago`;

  return (
    <button
      onClick={onClick}
      className="card-soft w-full text-left p-6 group cursor-pointer block rounded-xl"
    >
      {/* Memory number */}
      <span className="label-caps !text-gold/40">
        Memory №{String(index + 1).padStart(2, '0')}
      </span>

      {/* Photo placeholder or first image */}
      {memory.photo_urls.length > 0 && (
        <div className="mt-3 mb-4 rounded-lg overflow-hidden aspect-[16/10] bg-secondary">
          <img
            src={memory.photo_urls[0]}
            alt={memory.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      )}

      {/* Title */}
      <h3 className="text-gold-gradient text-lg md:text-xl font-normal mt-3 mb-2 tracking-wide font-display">
        {memory.title}
      </h3>

      {/* Date */}
      <div className="flex items-center gap-2 mb-3">
        <p className="text-muted-foreground/50 text-xs">{formattedDate}</p>
        <span className="text-muted-foreground/30 text-xs">·</span>
        <p className="text-muted-foreground/40 text-xs">{relativeTime}</p>
      </div>

      {/* Caption preview */}
      {memory.caption && (
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
          {memory.caption}
        </p>
      )}

      {/* Read more indicator */}
      <div className="mt-4 flex items-center gap-2 label-caps !text-gold-deep opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span>Read More</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}
