'use client';

import { useEffect, useRef, useCallback, useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiPiece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  width: number;
  height: number;
  color: string;
  alpha: number;
}

const COLORS = [
  '#D4AF6A', '#F0D48A', '#A08545', '#E8C878',
  '#5C1A2B', '#7A2940', '#FFD700', '#FFF8DC',
];

export default function BirthdayClient({ name, message }: { name: string; message: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const confettiRef = useRef<ConfettiPiece[]>([]);
  const animationRef = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [showBlowPrompt, setShowBlowPrompt] = useState(false);
  const [blowCountdown, setBlowCountdown] = useState(3);

  const initConfetti = useCallback((width: number, height: number) => {
    const pieces: ConfettiPiece[] = [];
    for (let i = 0; i < 150; i++) {
      pieces.push({
        x: Math.random() * width,
        y: Math.random() * -height,
        vx: (Math.random() - 0.5) * 3,
        vy: Math.random() * 3 + 1,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        width: Math.random() * 8 + 4,
        height: Math.random() * 4 + 2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: Math.random() * 0.5 + 0.5,
      });
    }
    confettiRef.current = pieces;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initConfetti(canvas.width, canvas.height);
    };

    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of confettiRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.vy += 0.02;
        p.vx *= 0.999;

        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
          p.vy = Math.random() * 3 + 1;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
        ctx.restore();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [initConfetti]);

  // Show blow prompt after 3s
  useEffect(() => {
    if (candlesBlown) return;
    const t = setTimeout(() => setShowBlowPrompt(true), 3000);
    return () => clearTimeout(t);
  }, [candlesBlown]);

  // Blow countdown
  useEffect(() => {
    if (!showBlowPrompt || candlesBlown) return;
    const interval = setInterval(() => {
      setBlowCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setCandlesBlown(true);
          setShowBlowPrompt(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [showBlowPrompt, candlesBlown]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      <div className="absolute inset-0 radial-gold-glow opacity-60 z-0" />

      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
        >
          <p className="label-caps mb-4">🎂 A Very Special Day</p>

          <h1 className="text-gold-shimmer text-5xl sm:text-6xl md:text-8xl font-light tracking-wide mb-4 font-display">
            Happy Birthday
          </h1>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-gold-gradient text-3xl sm:text-4xl md:text-5xl font-light mb-8 font-display"
          >
            {name}!
          </motion.h2>
        </motion.div>

        {/* Mini Cake with candle blowing */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.6, type: 'spring' }}
          className="mb-6"
        >
          <MiniCake candlesBlown={candlesBlown} />
        </motion.div>

        {/* Blow prompt */}
        <AnimatePresence mode="wait">
          {showBlowPrompt && !candlesBlown && (
            <motion.div
              key="blow"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4"
            >
              <motion.p
                className="text-lg font-display italic mb-2 text-gold-light"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ✨ Make a wish & blow! ✨
              </motion.p>
              <motion.span
                key={blowCountdown}
                className="text-4xl font-display text-foreground"
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring' }}
              >
                {blowCountdown}
              </motion.span>
            </motion.div>
          )}

          {candlesBlown && (
            <motion.p
              key="blown"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-gold/60 font-display mb-6"
            >
              💨 The candles are blown! 🎉
            </motion.p>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div className="hairline-short mb-8" />
          <p className="text-foreground/80 text-sm md:text-base leading-relaxed max-w-lg mx-auto font-display italic">
            {message}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="mt-10"
        >
          <AudioPlayer ref={audioRef} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="mt-12"
        >
          <a href="/" className="btn-outline-gold text-xs">
            ← Back to Our Story
          </a>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Mini Cake for birthday page ───
function MiniCake({ candlesBlown }: { candlesBlown: boolean }) {
  return (
    <svg viewBox="0 0 120 100" width="120" height="100" className="mx-auto">
      {/* Plate */}
      <ellipse cx="60" cy="95" rx="55" ry="5" fill="#ddd" />
      {/* Cake */}
      <rect x="20" y="55" width="80" height="40" rx="6" fill="url(#miniCake)" />
      {/* Frosting */}
      <path d="M20 60 Q30 68 40 58 Q50 68 60 58 Q70 68 80 58 Q90 68 100 58 L100 62 Q90 72 80 62 Q70 72 60 62 Q50 72 40 62 Q30 72 20 62 Z" fill="#FFF0DB" />
      {/* Candle */}
      <rect x="57" y="30" width="6" height="26" rx="3" fill="#FF85C2" />
      {/* Flame or smoke */}
      <AnimatePresence>
        {!candlesBlown ? (
          <motion.g key="flame">
            <motion.path
              d="M60 15 Q64 22 60 30 Q56 22 60 15"
              fill="#FFD54F"
              animate={{ scale: [1, 1.15, 0.95, 1.1, 1], x: [0, 0.3, -0.3, 0.2, 0] }}
              exit={{ opacity: 0, scale: 0, y: -5, transition: { duration: 0.3 } }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: 'mirror' }}
              style={{ transformOrigin: '60px 25px' }}
            />
            <motion.path
              d="M60 20 Q62 24 60 28 Q58 24 60 20"
              fill="#FFFDE7"
              animate={{ opacity: [0.7, 1, 0.7] }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </motion.g>
        ) : (
          <motion.g key="smoke">
            {[0, 1, 2].map(s => (
              <motion.circle
                key={s}
                cx={60 + (s - 1) * 3}
                cy={25}
                r={2 + s}
                fill="rgba(200,200,200,0.4)"
                initial={{ opacity: 0.5, y: 0, scale: 0.5 }}
                animate={{
                  opacity: [0.5, 0.2, 0],
                  y: [-3, -15 - s * 8],
                  scale: [0.5, 1.5 + s * 0.3],
                  x: [(s - 1) * 2, (s - 1) * 10],
                }}
                transition={{ duration: 1.8, delay: s * 0.15 }}
              />
            ))}
          </motion.g>
        )}
      </AnimatePresence>
      <defs>
        <linearGradient id="miniCake" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8A0BF" />
          <stop offset="100%" stopColor="#D4789C" />
        </linearGradient>
      </defs>
    </svg>
  );
}



const AudioPlayer = forwardRef<HTMLAudioElement>(function AudioPlayer(_, ref) {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    const audio = (ref as React.RefObject<HTMLAudioElement | null>)?.current;
    if (!audio) {
      setIsPlaying(!isPlaying);
      return;
    }

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={togglePlay}
        className="w-14 h-14 rounded-full border border-gold/30 flex items-center justify-center transition-all duration-400 hover:border-gold hover:glow-gold hover:bg-gold/5"
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
      >
        {isPlaying ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--gold)">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--gold)">
            <polygon points="5,3 19,12 5,21" />
          </svg>
        )}
      </button>
      <p className="text-muted-foreground/50 text-xs">
        {isPlaying ? 'Playing' : 'Play birthday song'}
      </p>
      <audio ref={ref} src="/audio/birthday.mp3" loop />
    </div>
  );
});
