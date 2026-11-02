import { motion } from 'framer-motion';
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react';

export function Reveal({ children, delay = 0, y = 24, className, style }: { children: ReactNode; delay?: number; y?: number; className?: string; style?: CSSProperties }) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Title where the last word (or `word`) is set in italic serif orange. */
export function Title({ text, word, as = 'h2', className = 'h-lg' }: { text: string; word: string; as?: 'h1' | 'h2'; className?: string }) {
  const i = text.lastIndexOf(word);
  const Tag = as;
  return (
    <Tag className={className}>
      {text.slice(0, i)}
      <span className="it">{word}</span>
      {text.slice(i + word.length)}
    </Tag>
  );
}

export function SectionHead({ kicker, title, word, sub, children }: { kicker: string; title: string; word: string; sub?: string; children?: ReactNode }) {
  return (
    <div className="sec-head">
      <Reveal>
        <span className="kicker">{`{ ${kicker} }`}</span>
        <Title text={title} word={word} />
      </Reveal>
      <Reveal delay={0.1}>
        {sub && <p className="lead">{sub}</p>}
        {children}
      </Reveal>
    </div>
  );
}

export function Cursor({ label, color = 'orange', className, style }: { label: string; color?: 'orange' | 'lilac'; className?: string; style?: CSSProperties }) {
  return (
    <span className={`cursor-tag ${color === 'lilac' ? 'lilac' : ''} ${className ?? ''}`} style={style} aria-hidden>
      <svg width="20" height="22" viewBox="0 0 20 22" fill="none">
        <path d="M2 2l15 8.5-6.6 1.6L7.2 19 2 2z" fill={color === 'lilac' ? '#c9b8ff' : '#ff5b2e'} stroke="#16130f" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
      <span className="label">{label}</span>
    </span>
  );
}

/** Photo with graceful fallback when the image file isn't there yet. */
export function Photo({ src, alt, className, style, fallback }: { src: string; alt: string; className?: string; style?: CSSProperties; fallback?: ReactNode }) {
  const [ok, setOk] = useState(true);
  if (!ok) {
    return (
      <div className={className} style={{ ...style, display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg,#e7dfd1,#d9cfbf)' }} role="img" aria-label={alt}>
        {fallback ?? (
          <svg viewBox="0 0 100 100" width="60%" height="60%" aria-hidden>
            <text x="50" y="54" textAnchor="middle" dominantBaseline="middle" fontFamily="Bricolage Grotesque" fontWeight="800" fontSize="44" fill="#16130f">FI</text>
          </svg>
        )}
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} style={{ objectFit: 'cover', ...style }} onError={() => setOk(false)} loading="lazy" />;
}

/** Renders a fixed-size Figma frame (w×h) scaled to fit its container width. */
export function Stage({ w, h, children, className, max = 1 }: { w: number; h: number; children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [s, setS] = useState(1);
  const [cw, setCw] = useState(w);
  useLayoutEffect(() => {
    const el = ref.current!;
    const on = () => { const W = el.clientWidth; setCw(W); setS(Math.min(max, W / w)); };
    on();
    const ro = new ResizeObserver(on);
    ro.observe(el);
    return () => ro.disconnect();
  }, [w, max]);
  return (
    <div ref={ref} className={className} style={{ position: 'relative', height: h * s }}>
      <div style={{ position: 'absolute', top: 0, left: Math.max(0, (cw - w * s) / 2), width: w, height: h, transform: `scale(${s})`, transformOrigin: '0 0' }}>{children}</div>
    </div>
  );
}

/** Starts looping animations only while the element is on screen. */
export function useInView<T extends Element>(margin = '0px') {
  const ref = useRef<T>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setV(e.isIntersecting), { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return [ref, v] as const;
}

/** Slot-machine digits that roll from 0 to `value` whenever `run` changes. */
export function Roller({ value, step = 1, run, className, duration = 1.1, decimals = 0 }: { value: number; step?: number; run: number; className?: string; duration?: number; decimals?: number }) {
  const steps: number[] = [];
  for (let v = 0; v <= value + 1e-9; v += step) steps.push(+v.toFixed(decimals));
  if (steps[steps.length - 1] !== value) steps.push(value);
  return (
    <span className={`roller ${className ?? ''}`}>
      <motion.span
        key={run}
        className="roller-strip"
        initial={{ y: 0 }}
        animate={{ y: `-${((steps.length - 1) / steps.length) * 100}%` }}
        transition={{ duration, ease: [0.16, 1, 0.3, 1] }}
      >
        {steps.map((v, i) => <span key={i}>{decimals ? v.toFixed(decimals) : v}</span>)}
      </motion.span>
    </span>
  );
}
