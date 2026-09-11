'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/memories', label: 'Memories' },
  { href: '/calendar', label: 'Calendar' },
  { href: '/letters', label: 'Letters' },
  { href: '/date-planning', label: 'Date Ideas' },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Don't show nav on enter page
  if (pathname === '/enter') return null;

  return (
    <>
      {/* Desktop Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 hidden md:block">
        <div className="backdrop-blur-xl bg-background/80 border-b border-gold/8">
          <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
            <Link
              href="/"
              className="text-gold-gradient text-lg font-normal tracking-widest font-display"
            >
              Our Story
            </Link>

            <div className="flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`label-caps transition-colors duration-300 ${
                    pathname === link.href
                      ? '!text-gold'
                      : '!text-muted-foreground hover:!text-gold-light'
                  }`}
                >
                  {link.label}
                  {pathname === link.href && (
                    <motion.div
                      layoutId="nav-underline"
                      className="h-px bg-gold mt-1"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Nav Toggle */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-50 md:hidden p-3 rounded-full bg-card/80 backdrop-blur-md border border-gold/10"
        aria-label="Open menu"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Mobile Name - top left */}
      <Link
        href="/"
        className="fixed top-4 left-4 z-50 md:hidden text-gold-gradient text-sm font-normal tracking-widest font-display"
      >
        Our Story
      </Link>

      {/* Mobile Slide-Out Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 card-soft !rounded-none border-l border-gold/10 p-8 md:hidden flex flex-col"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="self-end mb-8 p-2"
                aria-label="Close menu"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              <div className="space-y-6 flex-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`block label-caps text-sm transition-colors duration-300 ${
                        pathname === link.href
                          ? '!text-gold'
                          : '!text-muted-foreground hover:!text-gold-light'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="hairline-short" />
              <p
                className="text-muted-foreground/50 text-xs text-center mt-4 font-display italic"
              >
                Made with ♥
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
