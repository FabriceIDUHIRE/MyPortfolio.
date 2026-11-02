import { motion } from 'framer-motion';
import { useState, type ReactNode, type CSSProperties } from 'react';

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
