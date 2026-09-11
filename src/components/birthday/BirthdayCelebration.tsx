'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Canvas Confetti ───
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
  color: string;
  alpha: number;
  shape: 'rect' | 'circle' | 'star';
}

const CONFETTI_COLORS = [
  '#D4AF6A', '#F0D48A', '#FFD700', '#E8C878',
  '#FF69B4', '#FF1493', '#FF85C2',
  '#A855F7', '#C084FC',
  '#FFF8DC', '#FFFAF0',
];

function createParticle(width: number, height: number, fromTop = true): Particle {
  return {
    x: Math.random() * width,
    y: fromTop ? Math.random() * -height * 0.5 : height * 0.4 + Math.random() * height * 0.2,
    vx: (Math.random() - 0.5) * 6,
    vy: fromTop ? Math.random() * 3 + 1.5 : -(Math.random() * 8 + 4),
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 12,
    size: Math.random() * 8 + 3,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    alpha: Math.random() * 0.4 + 0.6,
    shape: (['rect', 'circle', 'star'] as const)[Math.floor(Math.random() * 3)],
  };
}

// ─── Smoke particle for blowing out candles ───
interface SmokeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  life: number;
}

// ─── Synthesized Happy Birthday song ───
function playHappyBirthday(): { stop: () => void } {
  const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
  if (!AudioContext) return { stop: () => {} };

  const ctx = new AudioContext();
  const gainNode = ctx.createGain();
  gainNode.gain.value = 0.15;
  gainNode.connect(ctx.destination);

  // Happy Birthday melody - note frequencies and durations
  // "Happy birthday to you, happy birthday to you,
  //  happy birthday dear [name], happy birthday to you"
  const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.00;
  const A4 = 440.00, Bb4 = 466.16, C5 = 523.25;

  const melody: [number, number][] = [
    // Happy birthday to you
    [C4, 0.3], [C4, 0.15], [D4, 0.5], [C4, 0.5], [F4, 0.5], [E4, 0.9],
    // Happy birthday to you
    [C4, 0.3], [C4, 0.15], [D4, 0.5], [C4, 0.5], [G4, 0.5], [F4, 0.9],
    // Happy birthday dear ___
    [C4, 0.3], [C4, 0.15], [C5, 0.5], [A4, 0.5], [F4, 0.4], [E4, 0.4], [D4, 0.9],
    // Happy birthday to you
    [Bb4, 0.3], [Bb4, 0.15], [A4, 0.5], [F4, 0.5], [G4, 0.5], [F4, 1.0],
  ];

  const oscillators: OscillatorNode[] = [];
  let time = ctx.currentTime + 0.3;

  for (const [freq, dur] of melody) {
    const osc = ctx.createOscillator();
    const noteGain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = freq;

    // Add a slight vibrato for warmth
    const vibrato = ctx.createOscillator();
    const vibratoGain = ctx.createGain();
    vibrato.frequency.value = 5;
    vibratoGain.gain.value = 2;
    vibrato.connect(vibratoGain);
    vibratoGain.connect(osc.frequency);
    vibrato.start(time);
    vibrato.stop(time + dur);

    // Envelope
    noteGain.gain.setValueAtTime(0, time);
    noteGain.gain.linearRampToValueAtTime(1, time + 0.05);
    noteGain.gain.setValueAtTime(1, time + dur - 0.08);
    noteGain.gain.linearRampToValueAtTime(0, time + dur);

    osc.connect(noteGain);
    noteGain.connect(gainNode);

    osc.start(time);
    osc.stop(time + dur);
    oscillators.push(osc);

    time += dur + 0.05;
  }

  return {
    stop: () => {
      try {
        gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
        setTimeout(() => {
          if (ctx.state !== 'closed') {
            ctx.close().catch(() => {});
          }
        }, 500);
      } catch {
        // already closed
      }
    },
  };
}

// ─── Animated Cake SVG ───
function AnimatedCake({ candlesBlown }: { candlesBlown: boolean }) {
  return (
    <motion.div
      initial={{ scale: 0, y: 60 }}
      animate={{ scale: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 1.2, type: 'spring', bounce: 0.4 }}
      className="relative"
    >
      <svg viewBox="0 0 200 220" width="220" height="242" className="mx-auto drop-shadow-2xl">
        {/* Plate */}
        <motion.ellipse
          cx="100" cy="210" rx="95" ry="10"
          fill="url(#plateGrad)"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        />

        {/* Bottom cake layer */}
        <motion.rect
          x="25" y="150" width="150" height="60" rx="12"
          fill="url(#cakeGrad1)"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.6, duration: 0.5, ease: 'backOut' }}
          style={{ transformOrigin: '100px 210px' }}
        />
        <motion.path
          d="M25 158 Q40 168 55 155 Q70 168 85 155 Q100 168 115 155 Q130 168 145 155 Q160 168 175 155 L175 160 Q160 173 145 160 Q130 173 115 160 Q100 173 85 160 Q70 173 55 160 Q40 173 25 160 Z"
          fill="#FFF0DB"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.5 }}
        />

        {/* Middle cake layer */}
        <motion.rect
          x="40" y="100" width="120" height="55" rx="10"
          fill="url(#cakeGrad2)"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 0.8, duration: 0.5, ease: 'backOut' }}
          style={{ transformOrigin: '100px 155px' }}
        />
        <motion.path
          d="M40 108 Q52 118 64 105 Q76 118 88 105 Q100 118 112 105 Q124 118 136 105 Q148 118 160 105 L160 110 Q148 123 136 110 Q124 123 112 110 Q100 123 88 110 Q76 123 64 110 Q52 123 40 110 Z"
          fill="#FFE4C4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.5 }}
        />

        {/* Top cake layer */}
        <motion.rect
          x="60" y="60" width="80" height="45" rx="8"
          fill="url(#cakeGrad3)"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 1.0, duration: 0.5, ease: 'backOut' }}
          style={{ transformOrigin: '100px 105px' }}
        />
        <motion.path
          d="M60 68 Q70 78 80 65 Q90 78 100 65 Q110 78 120 65 Q130 78 140 65 L140 70 Q130 83 120 70 Q110 83 100 70 Q90 83 80 70 Q70 83 60 70 Z"
          fill="#FFD700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        />

        {/* Candles */}
        {[75, 100, 125].map((cx, i) => (
          <g key={i}>
            {/* Candle stick */}
            <motion.rect
              x={cx - 3} y={30} width={6} height={32} rx={3}
              fill={['#FF85C2', '#A855F7', '#FFD700'][i]}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 1.6 + i * 0.15, duration: 0.4, ease: 'backOut' }}
              style={{ transformOrigin: `${cx}px 62px` }}
            />
            <motion.line
              x1={cx} y1={34} x2={cx} y2={58}
              stroke="rgba(255,255,255,0.3)"
              strokeWidth={2}
              strokeDasharray="3,4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 + i * 0.15 }}
            />

            {/* Flame & glow — hidden when blown */}
            <AnimatePresence>
              {!candlesBlown && (
                <>
                  {/* Flame outer glow */}
                  <motion.ellipse
                    key={`glow-${i}`}
                    cx={cx} cy={22} rx={8} ry={12}
                    fill="url(#flameGlow)"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: [0, 0.5, 0.3, 0.5], scale: [0, 1.2, 1, 1.1] }}
                    exit={{ opacity: 0, scale: 0, transition: { duration: 0.3 } }}
                    transition={{ delay: 2.1 + i * 0.1, duration: 2, repeat: Infinity, repeatType: 'mirror' }}
                  />
                  {/* Flame */}
                  <motion.path
                    key={`flame-${i}`}
                    d={`M${cx} 12 Q${cx + 5} 20 ${cx} 30 Q${cx - 5} 20 ${cx} 12`}
                    fill="url(#flameGrad)"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: [1, 1.15, 0.95, 1.1, 1], x: [0, 0.5, -0.5, 0.3, 0] }}
                    exit={{ opacity: 0, scale: 0, y: -10, transition: { duration: 0.4 } }}
                    transition={{ delay: 2.0 + i * 0.1, duration: 1.5, repeat: Infinity, repeatType: 'mirror' }}
                    style={{ transformOrigin: `${cx}px 28px` }}
                  />
                  {/* Flame inner */}
                  <motion.path
                    key={`flame-inner-${i}`}
                    d={`M${cx} 18 Q${cx + 2.5} 23 ${cx} 28 Q${cx - 2.5} 23 ${cx} 18`}
                    fill="#FFFDE7"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0.7, 1] }}
                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                    transition={{ delay: 2.2 + i * 0.1, duration: 1.2, repeat: Infinity, repeatType: 'mirror' }}
                  />
                </>
              )}
            </AnimatePresence>

            {/* Smoke wisps — shown after blowing */}
            <AnimatePresence>
              {candlesBlown && (
                <>
                  {[0, 1, 2].map((s) => (
                    <motion.circle
                      key={`smoke-${i}-${s}`}
                      cx={cx + (s - 1) * 3}
                      cy={25}
                      r={3 + s}
                      fill="rgba(200,200,200,0.4)"
                      initial={{ opacity: 0.6, y: 0, scale: 0.5 }}
                      animate={{
                        opacity: [0.6, 0.3, 0],
                        y: [-5, -20 - s * 10, -35 - s * 15],
                        scale: [0.5, 1 + s * 0.3, 2 + s * 0.5],
                        x: [0, (s - 1) * 8, (s - 1) * 15],
                      }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 2, delay: s * 0.2, ease: 'easeOut' }}
                    />
                  ))}
                </>
              )}
            </AnimatePresence>
          </g>
        ))}

        {/* Decorative dots */}
        {[35, 55, 75, 95, 115, 135, 155, 165].map((x, i) => (
          <motion.circle
            key={`dot-${i}`}
            cx={x} cy={175} r={2.5}
            fill="#FFD700"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.8, scale: 1 }}
            transition={{ delay: 1.8 + i * 0.05 }}
          />
        ))}

        {/* Cherry on top */}
        <motion.circle
          cx={100} cy={58} r={5}
          fill="#FF1744"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 2.0, type: 'spring', bounce: 0.6 }}
        />
        <motion.circle
          cx={98} cy={56} r={1.5}
          fill="rgba(255,255,255,0.6)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 2.2 }}
        />

        {/* Gradients */}
        <defs>
          <linearGradient id="cakeGrad1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E8A0BF" />
            <stop offset="100%" stopColor="#D4789C" />
          </linearGradient>
          <linearGradient id="cakeGrad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C9A0DC" />
            <stop offset="100%" stopColor="#A87CC2" />
          </linearGradient>
          <linearGradient id="cakeGrad3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFD4A0" />
            <stop offset="100%" stopColor="#F5B97E" />
          </linearGradient>
          <linearGradient id="plateGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E8E8E8" />
            <stop offset="100%" stopColor="#CCCCCC" />
          </linearGradient>
          <radialGradient id="flameGrad">
            <stop offset="0%" stopColor="#FFFDE7" />
            <stop offset="40%" stopColor="#FFD54F" />
            <stop offset="100%" stopColor="#FF8F00" />
          </radialGradient>
          <radialGradient id="flameGlow">
            <stop offset="0%" stopColor="rgba(255,200,50,0.6)" />
            <stop offset="100%" stopColor="rgba(255,200,50,0)" />
          </radialGradient>
        </defs>
      </svg>
    </motion.div>
  );
}

// ─── Floating Hearts ───
function FloatingHearts() {
  const [windowHeight, setWindowHeight] = useState(800);

  useEffect(() => {
    setWindowHeight(window.innerHeight);
  }, []);

  const hearts = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: 5 + Math.random() * 90,
    delay: Math.random() * 4,
    duration: 4 + Math.random() * 4,
    size: 16 + Math.random() * 20,
    opacity: 0.3 + Math.random() * 0.5,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          className="absolute"
          style={{ left: `${h.left}%`, bottom: '-40px', fontSize: h.size }}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: [0, -windowHeight - 100],
            opacity: [0, h.opacity, h.opacity, 0],
            x: [0, Math.sin(h.id) * 40, Math.cos(h.id) * -30, 0],
          }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        >
          💖
        </motion.div>
      ))}
    </div>
  );
}

// ─── Phase definitions ───
type CelebrationPhase =
  | 'intro'        // cake building, song starts
  | 'blow-prompt'  // "Make a wish & blow the candles!"
  | 'blowing'      // candles blowing out animation
  | 'wish'         // final message after blowing
  | 'fadeout';      // transitioning back to website

interface BirthdayCelebrationProps {
  name: string;
  onComplete: () => void;
}

// ─── Main Celebration Component ───
export default function BirthdayCelebration({ name, onComplete }: BirthdayCelebrationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);
  const songRef = useRef<{ stop: () => void } | null>(null);
  const [phase, setPhase] = useState<CelebrationPhase>('intro');
  const [blowCountdown, setBlowCountdown] = useState(3);

  // Phase progression timers
  useEffect(() => {
    // Start song immediately
    try {
      songRef.current = playHappyBirthday();
    } catch {
      // Audio not available
    }

    // After cake builds (3s) → show "blow the candles" prompt
    const t1 = setTimeout(() => setPhase('blow-prompt'), 3000);

    return () => {
      clearTimeout(t1);
      songRef.current?.stop();
    };
  }, []);

  // Blow countdown: 3... 2... 1... BLOW!
  useEffect(() => {
    if (phase !== 'blow-prompt') return;

    const interval = setInterval(() => {
      setBlowCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setPhase('blowing');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase]);

  // After blowing → show wish message
  useEffect(() => {
    if (phase !== 'blowing') return;
    const t = setTimeout(() => setPhase('wish'), 1500);
    return () => clearTimeout(t);
  }, [phase]);

  // After wish → fade out and return to website
  useEffect(() => {
    if (phase !== 'wish') return;
    const t = setTimeout(() => {
      setPhase('fadeout');
      songRef.current?.stop();
      // Wait for fade animation then complete
      setTimeout(() => onComplete(), 1200);
    }, 4000);
    return () => clearTimeout(t);
  }, [phase, onComplete]);

  // ─── Canvas confetti ───
  const initParticles = useCallback((w: number, h: number) => {
    const p: Particle[] = [];
    for (let i = 0; i < 120; i++) p.push(createParticle(w, h, true));
    particlesRef.current = p;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.06;
        p.vx *= 0.998;
        p.rotation += p.rotationSpeed;
        p.alpha *= 0.999;

        if (p.y > canvas.height + 30) {
          Object.assign(p, createParticle(canvas.width, canvas.height, true));
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;

        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'star') {
          drawStar(ctx, 0, 0, 5, p.size / 2, p.size / 4);
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        }
        ctx.restore();
      }
      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [initParticles]);

  const candlesBlown = phase === 'blowing' || phase === 'wish' || phase === 'fadeout';

  return (
    <AnimatePresence>
      {phase !== 'fadeout' ? (
        <motion.div
          key="celebration"
          className="fixed inset-0 z-[999] flex items-center justify-center overflow-hidden"
          style={{ background: 'linear-gradient(to bottom, #0d0a14, #1a1028, #0d0a14)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Confetti */}
          <canvas ref={canvasRef} className="absolute inset-0 z-0" />

          {/* Radial glow */}
          <div className="absolute inset-0 z-0" style={{
            background: 'radial-gradient(ellipse at 50% 60%, rgba(139,34,82,0.15) 0%, transparent 60%)',
          }} />

          {/* Floating Hearts */}
          <FloatingHearts />

          {/* Content */}
          <div className="relative z-10 text-center px-6 max-w-xl mx-auto">
            {/* Happy Birthday Text */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, delay: 1.5, ease: [0.4, 0, 0.2, 1] }}
              className="mb-4"
            >
              <motion.p
                className="text-sm tracking-[0.35em] uppercase mb-3 text-gold-light"
              >
                🎂 A Very Special Day 🎂
              </motion.p>
              <motion.h1
                className="text-5xl sm:text-6xl md:text-8xl font-light tracking-wide font-display text-foreground"
                style={{
                  animation: 'shimmer 3s ease-in-out infinite',
                }}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.8, duration: 0.8, type: 'spring', bounce: 0.3 }}
              >
                Happy Birthday
              </motion.h1>
              <motion.h2
                className="text-3xl sm:text-4xl md:text-5xl font-light mt-2 font-display"
                style={{
                  background: 'linear-gradient(135deg, #FFD700, #FFF8DC)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 2.2, duration: 0.8 }}
              >
                {name}! 🎉
              </motion.h2>
            </motion.div>

            {/* Animated Cake */}
            <AnimatedCake candlesBlown={candlesBlown} />

            {/* Blow the candles prompt */}
            <AnimatePresence mode="wait">
              {phase === 'blow-prompt' && (
                <motion.div
                  key="blow-prompt"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-6"
                >
                  <motion.p
                    className="text-xl md:text-2xl font-display italic mb-3 text-gold-light"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ✨ Make a wish & blow the candles! ✨
                  </motion.p>
                  <motion.div
                    className="text-6xl md:text-7xl font-display font-light text-foreground"
                    key={blowCountdown}
                    initial={{ scale: 1.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.5, type: 'spring' }}
                  >
                    {blowCountdown}
                  </motion.div>
                </motion.div>
              )}

              {phase === 'blowing' && (
                <motion.div
                  key="blowing"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-6"
                >
                  <motion.p
                    className="text-3xl md:text-4xl font-display text-gold-light"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5 }}
                  >
                    💨 Fwoooosh! 💨
                  </motion.p>
                </motion.div>
              )}

              {phase === 'wish' && (
                <motion.div
                  key="wish"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="mt-6"
                >
                  <motion.p
                    className="text-lg md:text-xl font-display italic leading-relaxed max-w-md mx-auto text-foreground"
                  >
                    Wishing you all the love, joy, and happiness in the world.
                    Today and always. 💕
                  </motion.p>
                  <motion.p
                    className="text-sm mt-4 font-display text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                  >
                    ✨ Taking you to our story... ✨
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="fadeout"
          className="fixed inset-0 z-[999] bg-black"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
        />
      )}
    </AnimatePresence>
  );
}

// ─── Star Drawing Helper ───
function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerR: number, innerR: number) {
  let rot = (Math.PI / 2) * 3;
  const step = Math.PI / spikes;
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerR);
  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR);
    rot += step;
    ctx.lineTo(cx + Math.cos(rot) * innerR, cy + Math.sin(rot) * innerR);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerR);
  ctx.closePath();
  ctx.fill();
}
