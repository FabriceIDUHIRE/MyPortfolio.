import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import './experiments.css';

export type Category = 'Apps' | 'Motion' | 'Tools' | 'Fun';
export type Experiment = { name: string; cat: Category; tag: string; Toy: (p: { active: boolean }) => ReactNode };

/* ───────── helpers ───────── */
function useCount(target: number, active: boolean, from: number, ms = 700) {
  const [v, setV] = useState(from);
  useEffect(() => {
    const start = performance.now();
    const a = v;
    const b = active ? target : from;
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / ms);
      const e = 1 - Math.pow(1 - k, 3);
      setV(Math.round(a + (b - a) * e));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);
  return v;
}
const spring = { type: 'spring', stiffness: 380, damping: 18 } as const;

/* ───────── toys ───────── */
function PocketBudget({ active }: { active: boolean }) {
  const n = useCount(3120, active, 2430);
  const bars = active ? [30, 52, 40, 70, 88] : [22, 38, 30, 44, 52];
  return (
    <div className="toy" style={{ background: 'var(--orange)' }}>
      <div className="pb-phone">
        <span className="pb-amt">${n.toLocaleString()}</span>
        <div className="pb-bars">
          {bars.map((h, i) => <motion.i key={i} animate={{ height: h }} transition={{ ...spring, delay: i * 0.04 }} />)}
        </div>
      </div>
    </div>
  );
}
function SplitBill({ active }: { active: boolean }) {
  return (
    <div className="toy" style={{ background: 'var(--lilac)' }}>
      <motion.span className="sb-c sb-a" animate={{ x: active ? -34 : -12 }} transition={spring} />
      <motion.span className="sb-c sb-b" animate={{ x: active ? 34 : 12 }} transition={spring} />
      <AnimatePresence>{active && <motion.span className="sb-div" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>÷ 2</motion.span>}</AnimatePresence>
    </div>
  );
}
function FocusTimer({ active }: { active: boolean }) {
  const [s, setS] = useState(25 * 60);
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setS((x) => (x <= 0 ? 25 * 60 : x - 1)), 60);
    return () => clearInterval(id);
  }, [active]);
  const mm = String(Math.floor(s / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  const deg = ((25 * 60 - s) / (25 * 60)) * 360;
  return (
    <div className="toy" style={{ background: 'var(--sand-0)' }}>
      <span className="ft-time mono">{mm}:{ss}</span>
      <div className="ft-face"><i style={{ transform: `rotate(${deg}deg)` }} /><b /></div>
    </div>
  );
}
function SquishyToggle({ active }: { active: boolean }) {
  const [on, setOn] = useState(false);
  const isOn = on || active;
  return (
    <div className="toy" style={{ background: 'var(--lilac)' }}>
      <button className="st-track" onClick={(e) => { e.stopPropagation(); setOn((v) => !v); }} aria-pressed={isOn} aria-label="Squishy toggle">
        <motion.span className="st-knob" animate={{ x: isOn ? 66 : 0 }} whileTap={{ scaleX: 1.3, scaleY: 0.8 }} transition={{ type: 'spring', stiffness: 500, damping: 14 }} />
      </button>
      <AnimatePresence>{isOn && <motion.span className="st-on hand" initial={{ opacity: 0, rotate: -20, scale: 0.6 }} animate={{ opacity: 1, rotate: -8, scale: 1 }} exit={{ opacity: 0 }}>on!</motion.span>}</AnimatePresence>
    </div>
  );
}
function LoadingBlobs({ active }: { active: boolean }) {
  const cols = ['var(--orange)', 'var(--lilac)', 'var(--cream-0)'];
  return (
    <div className="toy" style={{ background: 'var(--ink-0)' }}>
      <div className="lb-row">
        {cols.map((c, i) => (
          <motion.span key={i} style={{ background: c }} animate={active ? { y: [0, -22, 0], scale: [1, 1.15, 1] } : { y: 0, scale: 1 }} transition={active ? { repeat: Infinity, duration: 0.9, delay: i * 0.15, ease: 'easeInOut' } : { duration: 0.3 }} />
        ))}
      </div>
    </div>
  );
}
function MagneticButton({ active }: { active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 200, damping: 12 });
  const y = useSpring(useMotionValue(0), { stiffness: 200, damping: 12 });
  useEffect(() => { if (!active) { x.set(0); y.set(0); } }, [active, x, y]);
  return (
    <div
      className="toy" ref={ref} style={{ background: 'var(--cream-0)' }}
      onPointerMove={(e) => { const r = ref.current!.getBoundingClientRect(); x.set((e.clientX - r.left - r.width / 2) * 0.35); y.set((e.clientY - r.top - r.height / 2) * 0.35); }}
    >
      <motion.span className="mb-btn" style={{ x, y, background: active ? 'var(--orange)' : 'var(--ink-0)', color: active ? 'var(--ink-0)' : 'var(--cream-0)' }}>Hover me</motion.span>
    </div>
  );
}
function TypeTester({ active }: { active: boolean }) {
  const w = useCount(800, active, 400, 600);
  return (
    <div className="toy" style={{ background: 'var(--ink-0)' }}>
      <span className="tt-w mono">{w}</span>
      <motion.span className="tt-aa" animate={{ color: active ? '#ff5b2e' : '#f3eee4', scale: active ? 1.12 : 1 }} transition={spring}>Aa</motion.span>
      <div className="tt-slider"><motion.i animate={{ left: active ? '88%' : '18%' }} transition={spring} /></div>
    </div>
  );
}
function ContrastChecker({ active }: { active: boolean }) {
  return (
    <div className="toy" style={{ background: 'var(--card-0)' }}>
      <div className="cc-row">
        <motion.span className="cc-sw" animate={{ background: '#16130f', color: active ? '#ff5b2e' : '#f3eee4' }}>Aa</motion.span>
        <motion.span className="cc-sw" animate={{ background: active ? '#ffffff' : '#e7dfd1', color: '#16130f' }}>Aa</motion.span>
      </div>
      <motion.span className="cc-pill mono" animate={{ background: active ? '#ff5b2e' : '#e7dfd1' }}>{active ? 'AAA  pass' : 'AA  check'}</motion.span>
    </div>
  );
}
const palette = [['Tangerine dream', '#FF5B2E'], ['Lilac haze', '#C9B8FF'], ['Midnight ink', '#16130F'], ['Oat milk', '#E7DFD1'], ['Mint chip', '#7FD6B0']];
function ColorNamer({ active }: { active: boolean }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!active) { setI(0); return; }
    setI(1);
    const id = setInterval(() => setI((x) => (x + 1) % palette.length), 1100);
    return () => clearInterval(id);
  }, [active]);
  const [name, hex] = palette[i];
  return (
    <div className="toy" style={{ background: 'var(--sand-0)' }}>
      <motion.span className="cn-dot" animate={{ background: hex }} transition={{ duration: 0.4 }} />
      <div className="cn-txt">
        <AnimatePresence mode="wait"><motion.b key={name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>{name}</motion.b></AnimatePresence>
        <span className="mono">{hex}</span>
      </div>
    </div>
  );
}
const face = ['..XXXXX..', '.XXXXXXX.', 'XX.XXX.XX', 'XX.XXX.XX', 'XXXXXXXXX', '.XX...XX.', '..XXXXX..', '.X.X.X.X.'];
const wink = ['..XXXXX..', '.XXXXXXX.', 'XX.XXXXXX', 'XX.XX...X', 'XXXXXXXXX', '.X.....X.', '..X...X..', '.X.X.X.X.'];
function PixelMe({ active }: { active: boolean }) {
  const g = active ? wink : face;
  return (
    <div className="toy" style={{ background: 'var(--card-0)' }}>
      <div className="px-grid">{g.join('').split('').map((c, i) => <motion.i key={i} animate={{ opacity: c === 'X' ? 1 : 0, scale: c === 'X' ? 1 : 0.4 }} transition={{ duration: 0.18, delay: (i % 9) * 0.01 }} />)}</div>
    </div>
  );
}
function HumToSearch({ active }: { active: boolean }) {
  const hs = [20, 44, 30, 70, 50, 88, 40, 64, 30, 76, 46, 24, 56, 34];
  return (
    <div className="toy" style={{ background: 'var(--sand-0)' }}>
      <div className="hs-wave">{hs.map((h, i) => (
        <motion.i key={i} style={{ background: i % 3 === 0 ? 'var(--orange)' : 'var(--ink-0)' }} animate={active ? { height: [h * 0.4, h, h * 0.6, h] } : { height: h * 0.8 }} transition={active ? { repeat: Infinity, duration: 0.8, delay: i * 0.05, ease: 'easeInOut' } : { duration: 0.3 }} />
      ))}</div>
    </div>
  );
}
function ConfettiCannon({ active }: { active: boolean }) {
  const [burst, setBurst] = useState(0);
  useEffect(() => { if (active) setBurst((b) => b + 1); }, [active]);
  const bits = Array.from({ length: 16 });
  const cols = ['#ff5b2e', '#c9b8ff', '#f3eee4'];
  return (
    <div className="toy" style={{ background: 'var(--ink-0)', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); setBurst((b) => b + 1); }}>
      <motion.span className="cf-cannon" animate={{ rotate: active ? -32 : -24 }} />
      {burst > 0 && bits.map((_, i) => {
        const a = (-70 + (i / bits.length) * 60) * (Math.PI / 180);
        const d = 90 + (i % 4) * 22;
        return (
          <motion.i key={`${burst}-${i}`} className="cf-bit" style={{ background: cols[i % 3] }}
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
            animate={{ x: Math.cos(a) * d, y: Math.sin(a) * d + 30, opacity: 0, rotate: 260 }}
            transition={{ duration: 1.1, ease: [0.2, 0.8, 0.4, 1] }} />
        );
      })}
    </div>
  );
}

export const experiments: Experiment[] = [
  { name: 'Pocket budget', cat: 'Apps', tag: 'APP', Toy: PocketBudget },
  { name: 'Split the bill', cat: 'Apps', tag: 'APP', Toy: SplitBill },
  { name: 'Focus timer', cat: 'Apps', tag: 'APP', Toy: FocusTimer },
  { name: 'Squishy toggle', cat: 'Motion', tag: 'MOTION', Toy: SquishyToggle },
  { name: 'Loading blobs', cat: 'Motion', tag: 'MOTION', Toy: LoadingBlobs },
  { name: 'Magnetic button', cat: 'Motion', tag: 'MOTION', Toy: MagneticButton },
  { name: 'Type tester', cat: 'Tools', tag: 'TOOL', Toy: TypeTester },
  { name: 'Contrast checker', cat: 'Tools', tag: 'TOOL', Toy: ContrastChecker },
  { name: 'Color namer', cat: 'Tools', tag: 'TOOL', Toy: ColorNamer },
  { name: 'Pixel me', cat: 'Fun', tag: 'FUN', Toy: PixelMe },
  { name: 'Hum to search', cat: 'Fun', tag: 'FUN', Toy: HumToSearch },
  { name: 'Confetti cannon', cat: 'Fun', tag: 'FUN', Toy: ConfettiCannon },
];

/** A frame-style card: hover (or tap on touch) to play. */
export function ExperimentCard({ exp, showFrameLabel = true, dim = false, polaroid = false }: { exp: Experiment; showFrameLabel?: boolean; dim?: boolean; polaroid?: boolean }) {
  const [active, setActive] = useState(false);
  const { Toy } = exp;
  return (
    <div
      className={`xp ${polaroid ? 'xp-pol' : ''} ${active ? 'is-active' : ''}`}
      style={{ opacity: dim ? 0.28 : 1 }}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setActive(false)}
      onClick={() => setActive((a) => !a)}
    >
      {showFrameLabel && <span className="xp-frame mono"># {exp.name}</span>}
      <div className="xp-card">
        <Toy active={active} />
        <div className="xp-meta">
          <b>{exp.name}</b>
          <span className="mono">{polaroid ? exp.tag : `${exp.tag}  ·  2026`}</span>
        </div>
      </div>
    </div>
  );
}
