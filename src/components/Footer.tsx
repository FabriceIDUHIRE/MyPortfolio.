import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { site } from '../content/site';
import { signatures, visitorCount } from '../content/home';
import { Stage } from './bits';
import { useIsMobile } from '../useIsMobile';
import './footer.css';

const COLORS = ['#ff5b2e', '#c9b8ff', '#f3eee4'];
const KEY = 'fi-guestbook-v2';
type Mine = { t: string; x: number; y: number; r: number; c: string };
const spots = [[660, 200], [930, 330], [300, 410], [700, 540], [1250, 470], [960, 200], [560, 410], [1300, 200]];

function useClock() {
  const [t, setT] = useState(() => new Date());
  useEffect(() => { const id = setInterval(() => setT(new Date()), 30_000); return () => clearInterval(id); }, []);
  return t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toUpperCase();
}
function useMine() {
  const [mine, setMine] = useState<Mine[]>(() => { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } });
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(mine.slice(-8))); } catch { /* storage unavailable */ } }, [mine]);
  return [mine, setMine] as const;
}

/** The signature field: plays a little demo until someone signs for real. */
function SignBox({ color, onSign, mobile = false }: { color: string; onSign: (t: string) => void; mobile?: boolean }) {
  const [phase, setPhase] = useState(0); // 0 empty, 1 writing, 2 signed
  const [typing, setTyping] = useState(false);
  const [val, setVal] = useState('');
  const [done, setDone] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (typing || mobile) return;
    const d = [1200, 1700, 2200][phase];
    const id = setTimeout(() => setPhase((p) => (p + 1) % 3), d);
    return () => clearTimeout(id);
  }, [phase, typing, mobile]);
  const submit = () => {
    const t = val.trim().slice(0, 28);
    if (!t) return;
    onSign(t);
    setVal('');
    setDone(true);
    setTimeout(() => setDone(false), 1800);
    input.current?.blur();
  };
  const demo = !typing && !val;
  return (
    <div className={`sign-box ${mobile ? 'm' : ''}`} onClick={() => { setTyping(true); input.current?.focus(); }}>
      <span className="sign-x">×</span>
      <div className="sign-line">
        <input
          ref={input}
          value={val}
          maxLength={28}
          onChange={(e) => setVal(e.target.value)}
          onFocus={() => setTyping(true)}
          onBlur={() => setTyping(false)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          className="hand sign-input"
          style={{ color }}
          placeholder={typing || mobile ? (mobile ? 'tap to sign here' : 'type your name, press enter') : ''}
          aria-label="Sign the guestbook with your name"
        />
        {demo && !mobile && (
          <>
            <span className="hand sign-ph" style={{ opacity: phase === 0 ? 1 : 0 }}>your signature here</span>
            <motion.span className="hand sign-demo" initial={false} animate={{ clipPath: phase === 0 ? 'inset(0 100% 0 0)' : 'inset(0 0% 0 0)' }} transition={{ duration: phase === 1 ? 1.6 : 0.4, ease: 'linear' }}>Amara K.</motion.span>
            <motion.svg className="sign-swoosh" viewBox="0 0 200 14" initial={false} animate={{ opacity: phase === 0 ? 0 : 1 }}>
              <motion.path d="M2 8 C 50 2, 120 14, 198 5" stroke="#ff5b2e" strokeWidth="3" fill="none" strokeLinecap="round" initial={false} animate={{ pathLength: phase === 0 ? 0 : 1 }} transition={{ duration: 0.6, delay: phase === 1 ? 1.2 : 0 }} />
            </motion.svg>
          </>
        )}
      </div>
      <motion.span className="sign-pen" animate={demo && !mobile ? { x: [0, 0, 150, 160][phase + 1] ?? 0, rotate: phase === 1 ? [0, -10, 6, -8, 0] : 0 } : { x: 0 }} transition={{ duration: phase === 1 ? 1.6 : 0.4 }}>
        <svg width="26" height="26" viewBox="0 0 26 26"><path d="M4 22l2-7L18 3l5 5L11 20l-7 2z" fill="#ff5b2e" stroke="#16130f" strokeWidth="1.5" strokeLinejoin="round" /></svg>
        <span className="sign-you">you</span>
      </motion.span>
      <AnimatePresence>
        {((demo && phase === 2 && !mobile) || done) && (
          <motion.span className="signed" initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 8 }} exit={{ scale: 0, opacity: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 12 }}>SIGNED!</motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

function SleepyCursor({ small = false }: { small?: boolean }) {
  const [awake, setAwake] = useState(false);
  return (
    <div className={`sleepy ${small ? 'small' : ''}`} onMouseEnter={() => setAwake(true)} onMouseLeave={() => setAwake(false)} onClick={() => setAwake((a) => !a)}>
      {!awake && ['z', 'z', 'Z'].map((z, i) => (
        <span key={i} className="zz hand" style={{ animationDelay: `${i * 0.35}s`, fontSize: 18 + i * 8 }}>{z}</span>
      ))}
      <AnimatePresence>{awake && <motion.span className="hand yawn" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>*yawn*</motion.span>}</AnimatePresence>
      <motion.div className="sleepy-cur" animate={awake ? { y: -10, rotate: 0 } : { y: 0, rotate: 0 }} transition={{ type: 'spring', stiffness: 320, damping: 10 }}>
        <svg width="22" height="24" viewBox="0 0 20 22"><path d="M2 2l15 8.5-6.6 1.6L7.2 19 2 2z" fill={awake ? '#ff5b2e' : '#c9b8ff'} stroke="#16130f" strokeWidth="1.6" strokeLinejoin="round" /></svg>
        <span className={`sleepy-tag ${awake ? 'awake' : ''}`}>{awake ? 'oh hi! I’m back' : 'Fabrice Iduhire · away'}</span>
      </motion.div>
    </div>
  );
}

export default function Footer() {
  const mobile = useIsMobile();
  const [color, setColor] = useState(COLORS[0]);
  const [mine, setMine] = useMine();
  const [zoom, setZoom] = useState(100);
  const time = useClock();
  const sign = (t: string) => setMine((m) => [...m, { t, x: spots[m.length % spots.length][0], y: spots[m.length % spots.length][1], r: (Math.random() * 10) - 5, c: color }]);
  const count = visitorCount + mine.length;
  const top = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  if (mobile) {
    return (
      <footer className="footer m">
        <div className="wrap">
          <h2 className="gb-title">Leave your <span className="it">mark</span><br />before you go.</h2>
          <p className="mono gb-sub">{count} VISITORS HAVE SIGNED</p>
          <div className="gb-wall-m">
            {signatures.slice(0, 6).map((s, i) => (
              <span key={s.t} className="hand" style={{ color: s.c, transform: `rotate(${s.r}deg)`, fontSize: [22, 18, 18, 26, 18, 20][i] }}>{s.t.split('\n')[0]}</span>
            ))}
            {mine.map((s, i) => <span key={i} className="hand" style={{ color: s.c, fontSize: 22 }}>{s.t}</span>)}
          </div>
          <SignBox color={color} onSign={sign} mobile />
          <div className="m-zz"><SleepyCursor small /></div>
        </div>
        <div className="status">
          <div className="wrap status-inner mono">
            <span>© {new Date().getFullYear()} {site.name.toUpperCase()}</span>
            <button className="btn status-top" onClick={top}>Top ↑</button>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="footer">
      <Stage w={1512} h={600}>
        <div className="gb" style={{ ['--z' as string]: zoom / 100 }}>
          <div className="gb-head">
            <h2 className="gb-title">Leave your <span className="it">mark</span><br />before you go.</h2>
            <p className="mono gb-sub">{count} VISITORS HAVE SIGNED  ·  YOU’RE NEXT</p>
          </div>
          <div className="gb-tools" role="toolbar" aria-label="Pen colour">
            <svg width="18" height="18" viewBox="0 0 16 16" aria-hidden><path d="M2 14l1-4 8-8 3 3-8 8-4 1z" stroke="#f3eee4" strokeWidth="1.4" fill="none" strokeLinejoin="round" /></svg>
            {COLORS.map((c) => <button key={c} className={`gb-swatch ${c === color ? 'on' : ''}`} style={{ background: c }} onClick={() => setColor(c)} aria-label={`Pen colour ${c}`} />)}
            <i className="gb-div" />
            <button className="gb-undo mono" onClick={() => setMine((m) => m.slice(0, -1))} disabled={!mine.length}>UNDO</button>
          </div>
          <div className="gb-wall">
            {signatures.map((s) => (
              <span key={s.t} className="hand sig" style={{ left: s.x, top: s.y, color: s.c, fontSize: s.s, transform: `rotate(${s.r}deg)` }}>
                {s.t.split('\n').map((l, i) => <span key={i} style={{ display: 'block' }}>{l}</span>)}
                {s.squiggle && <svg viewBox="0 0 110 16" className="sig-sq"><path d="M3 10 Q 15 2 27 10 T 51 10 T 75 10 T 99 10" stroke="#ff5b2e" strokeWidth="3" fill="none" strokeLinecap="round" /></svg>}
              </span>
            ))}
            <AnimatePresence>
              {mine.map((s, i) => (
                <motion.span key={`${s.t}-${i}`} className="hand sig" style={{ left: s.x, top: s.y, color: s.c, fontSize: 38 }} initial={{ opacity: 0, scale: 0.4, rotate: s.r - 20 }} animate={{ opacity: 1, scale: 1, rotate: s.r }} exit={{ opacity: 0, scale: 0.4 }} transition={{ type: 'spring', stiffness: 300, damping: 14 }}>{s.t}</motion.span>
              ))}
            </AnimatePresence>
            <svg className="doodle" style={{ left: 350, top: 250, transform: 'rotate(10deg)' }} width="40" height="36" viewBox="0 0 40 36"><path d="M20 33C9 24 3 17 3 10.5 3 5.8 6.5 2.5 11 2.5c3.8 0 6.6 2.4 9 5.5 2.4-3.1 5.2-5.5 9-5.5 4.5 0 8 3.3 8 8 0 6.5-6 13.5-17 22.5z" stroke="#ff5b2e" strokeWidth="2.4" fill="none" strokeLinejoin="round" /></svg>
            <svg className="doodle" style={{ left: 1392, top: 330, transform: 'rotate(-12deg)' }} width="44" height="44" viewBox="0 0 44 44"><path d="M22 3l5.5 12.5L41 17l-10 9 3 14-12-7-12 7 3-14-10-9 13.5-1.5z" stroke="#c9b8ff" strokeWidth="2.4" fill="none" strokeLinejoin="round" /></svg>
            <svg className="doodle" style={{ left: 1082, top: 450, transform: 'rotate(8deg)' }} width="48" height="48" viewBox="0 0 48 48"><circle cx="24" cy="24" r="20" stroke="#f3eee4" strokeWidth="2.4" fill="none" /><circle cx="17" cy="20" r="2.5" fill="#f3eee4" /><circle cx="31" cy="20" r="2.5" fill="#f3eee4" /><path d="M15 30c5 5 13 5 18 0" stroke="#f3eee4" strokeWidth="2.4" fill="none" strokeLinecap="round" /></svg>
            <svg className="doodle" style={{ left: 1412, top: 520 }} width="50" height="50" viewBox="0 0 50 50"><path d="M25 25c0-3 4-3 4 0s-6 6-9 2-1-12 7-11 12 9 8 16-16 10-22 3" stroke="#ff5b2e" strokeWidth="2.4" fill="none" strokeLinecap="round" /></svg>
            <motion.span className="sticker-hi" whileHover={{ scale: 1.15, rotate: 0 }}>HI!</motion.span>
            <motion.span className="sticker-10" whileHover={{ scale: 1.15, rotate: -4 }}>10/10</motion.span>
            <div className="sign-pos"><SignBox color={color} onSign={sign} /></div>
            <div className="sleepy-pos"><SleepyCursor /></div>
          </div>
        </div>
      </Stage>
      <div className="status">
        <div className="wrap status-inner mono">
          <div className="status-left">
            <span>© {new Date().getFullYear()} {site.name}</span>
            <span className="status-dot">LAST EDITED JUST NOW</span>
            <span>YOUR CITY · {time}</span>
          </div>
          <div className="status-right">
            <span className="zoom">
              <button onClick={() => setZoom((z) => Math.max(80, z - 10))} aria-label="Zoom out">−</button>
              <span>{zoom}%</span>
              <button onClick={() => setZoom((z) => Math.min(130, z + 10))} aria-label="Zoom in">+</button>
            </span>
            <button className="btn status-top" onClick={top}>Back to top  ↑</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
