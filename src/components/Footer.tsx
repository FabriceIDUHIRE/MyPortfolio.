import { useEffect, useRef, useState } from 'react';
import { site } from '../content/site';
import './footer.css';

type Stroke = { color: string; pts: [number, number][] };
const COLORS = ['#ff5b2e', '#c9b8ff', '#f3eee4'];
const KEY = 'fi-guestbook-v1';

function useClock() {
  const [t, setT] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);
  return t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function Footer() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState(COLORS[0]);
  const [strokes, setStrokes] = useState<Stroke[]>(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
  });
  const drawing = useRef<Stroke | null>(null);
  const [hint, setHint] = useState(true);
  const time = useClock();

  // Redraw everything whenever strokes change or the canvas resizes
  useEffect(() => {
    const c = canvas.current!;
    const draw = () => {
      const r = c.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = r.width * dpr;
      c.height = r.height * dpr;
      const ctx = c.getContext('2d')!;
      ctx.scale(dpr, dpr);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 4;
      const all = drawing.current ? [...strokes, drawing.current] : strokes;
      for (const s of all) {
        ctx.strokeStyle = s.color;
        ctx.beginPath();
        s.pts.forEach(([x, y], i) => {
          const px = x * r.width, py = y * r.height;
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        });
        ctx.stroke();
      }
    };
    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(c);
    (c as unknown as { _draw: () => void })._draw = draw;
    return () => ro.disconnect();
  }, [strokes]);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(strokes.slice(-120))); } catch { /* storage unavailable */ }
  }, [strokes]);

  const pos = (e: React.PointerEvent): [number, number] => {
    const r = canvas.current!.getBoundingClientRect();
    return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height];
  };
  const redraw = () => (canvas.current as unknown as { _draw?: () => void })?._draw?.();

  return (
    <footer className="footer" id="guestbook">
      <div className="wrap">
        <div className="gb-head">
          <div>
            <h2 className="h-lg gb-title">Leave your <span className="it">mark</span><br />before you go.</h2>
            <p className="mono gb-sub">DRAW ANYTHING · IT STAYS ON THIS DEVICE</p>
          </div>
          <div className="gb-tools" role="toolbar" aria-label="Pen">
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden><path d="M2 14l1-4 8-8 3 3-8 8-4 1z" stroke="#f3eee4" strokeWidth="1.4" fill="none" strokeLinejoin="round" /></svg>
            {COLORS.map((c) => (
              <button key={c} className={`gb-swatch ${c === color ? 'on' : ''}`} style={{ background: c }} onClick={() => setColor(c)} aria-label={`Pen colour ${c}`} />
            ))}
            <button className="gb-undo mono" onClick={() => setStrokes((s) => s.slice(0, -1))} disabled={!strokes.length}>UNDO</button>
            <button className="gb-undo mono" onClick={() => setStrokes([])} disabled={!strokes.length}>CLEAR</button>
          </div>
        </div>

        <div className="gb-board">
          <canvas
            ref={canvas}
            className="gb-canvas"
            aria-label="Drawing board: sign the guestbook"
            onPointerDown={(e) => {
              (e.target as HTMLElement).setPointerCapture(e.pointerId);
              drawing.current = { color, pts: [pos(e)] };
              setHint(false);
            }}
            onPointerMove={(e) => {
              if (!drawing.current) return;
              drawing.current.pts.push(pos(e));
              redraw();
            }}
            onPointerUp={() => {
              if (drawing.current && drawing.current.pts.length > 1) {
                const s = drawing.current;
                setStrokes((all) => [...all, s]);
              }
              drawing.current = null;
            }}
          />
          {hint && !strokes.length && (
            <div className="gb-hint" aria-hidden>
              <span className="hand">your signature here</span>
              <svg width="26" height="26" viewBox="0 0 26 26"><path d="M4 22l2-7L18 3l5 5L11 20l-7 2z" fill="#ff5b2e" stroke="#16130f" strokeWidth="1.5" strokeLinejoin="round" /></svg>
            </div>
          )}
          <span className="gb-doodle hand d1" aria-hidden>hi!</span>
          <span className="gb-doodle d2" aria-hidden>☺</span>
          <span className="gb-doodle d3" aria-hidden>✦</span>
        </div>
      </div>

      <div className="status">
        <div className="wrap status-inner mono">
          <span>© {new Date().getFullYear()} {site.name}</span>
          <span className="status-dot">DESIGNED IN FIGMA, BUILT WITH LOVE</span>
          <span>YOUR TIME · {time}</span>
          <a href="#top" className="btn status-top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
