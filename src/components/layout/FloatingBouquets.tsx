'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const BOUQUETS = ['💐', '🌹', '🌸', '🌺', '🌷'];

interface BouquetItem {
  id: number;
  emoji: string;
  x: number;
  y: number;
  scale: number;
  duration: number;
  delay: number;
  rotation: number;
}

export default function FloatingBouquets() {
  const [items, setItems] = useState<BouquetItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Generate 12 random flower elements spread across the screen
    const newItems = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      emoji: BOUQUETS[Math.floor(Math.random() * BOUQUETS.length)],
      x: Math.random() * 100, // percentage vw
      y: Math.random() * 100, // percentage vh
      scale: 0.8 + Math.random() * 1.2, // scale 0.8 to 2.0
      duration: 15 + Math.random() * 20, // 15s to 35s animation
      delay: Math.random() * -20, // random start time
      rotation: Math.random() * 360,
    }));
    setItems(newItems);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden opacity-30">
      {items.map((item) => (
        <motion.div
          key={item.id}
          className="absolute text-4xl drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
          initial={{
            left: `${item.x}vw`,
            top: `${item.y}vh`,
            scale: item.scale,
            rotate: item.rotation,
          }}
          animate={{
            y: [0, -30, 0, 30, 0],
            x: [0, 20, 0, -20, 0],
            rotate: [item.rotation, item.rotation + 45, item.rotation - 45, item.rotation],
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            left: `${item.x}vw`,
            top: `${item.y}vh`,
          }}
        >
          {item.emoji}
        </motion.div>
      ))}
    </div>
  );
}
