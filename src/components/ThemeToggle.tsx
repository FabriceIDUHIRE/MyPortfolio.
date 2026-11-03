import { useEffect, useId, useState, type MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { flushSync } from 'react-dom';

type Theme = 'light' | 'dark';
const KEY = 'fi-theme';

const current = (): Theme => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');

function apply(t: Theme) {
  document.documentElement.dataset.theme = t;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', t === 'dark' ? '#14110d' : '#f3eee4');
  try { localStorage.setItem(KEY, t); } catch { /* private mode */ }
}

// Keeps every toggle on the page (desktop + mobile) in sync.
const listeners = new Set<(t: Theme) => void>();

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>(current);
  const mid = `tt${useId().replace(/:/g, '')}`;
  useEffect(() => {
    listeners.add(setTheme);
    return () => { listeners.delete(setTheme); };
  }, []);

  const toggle = (e: MouseEvent<HTMLButtonElement>) => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    const run = () => { apply(next); listeners.forEach((l) => l(next)); };
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!doc.startViewTransition || reduce) { run(); return; }

    // Circular reveal growing out of the button.
    const r = e.currentTarget.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const vt = doc.startViewTransition(() => flushSync(run));
    vt.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 650, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::view-transition-new(root)' },
      );
    });
  };

  const dark = theme === 'dark';
  return (
    <button
      className={`theme-toggle ${className}`}
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Lights on' : 'Lights off'}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <mask id={mid}>
          <rect width="24" height="24" fill="#fff" />
          <motion.circle r="6" fill="#000" initial={false} animate={{ cx: dark ? 17 : 30, cy: dark ? 7 : -4 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }} />
        </mask>
        <motion.circle cx="12" cy="12" fill="currentColor" mask={`url(#${mid})`} initial={false} animate={{ r: dark ? 8 : 5 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }} />
        <motion.g
          stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          style={{ originX: '12px', originY: '12px' }}
          initial={false}
          animate={{ rotate: dark ? 90 : 0, scale: dark ? 0 : 1, opacity: dark ? 0 : 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        >
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
            const rad = (a * Math.PI) / 180;
            return <line key={a} x1={12 + Math.cos(rad) * 8.5} y1={12 + Math.sin(rad) * 8.5} x2={12 + Math.cos(rad) * 10.5} y2={12 + Math.sin(rad) * 10.5} />;
          })}
        </motion.g>
      </svg>
    </button>
  );
}
