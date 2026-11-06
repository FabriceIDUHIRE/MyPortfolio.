import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './blueprint.css';

/**
 * "Designed live" layer.
 * Every section on the page builds itself the first time it scrolls into view:
 *   wireframe (Figma-blue boxes, size labels, skeletons) → scan bar → content snaps in → outlines fade.
 * It never touches layout: all wireframe pieces live in an absolutely positioned overlay,
 * and content is hidden with `filter: opacity(0)` only while it is being "built".
 */

const SELECTOR = 'h1,h2,h3,h4,p,blockquote,img,video,canvas,button,a,figure,li,[data-bp]';
const TEXT = new Set(['H1', 'H2', 'H3', 'H4', 'P', 'BLOCKQUOTE']);
const HEAD = new Set(['H1', 'H2', 'H3']);
const MAX_BOXES = 18;

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const area = (r: DOMRect) => r.width * r.height;

function isMedia(el: Element) {
  const t = el.tagName;
  if (t === 'IMG' || t === 'VIDEO' || t === 'CANVAS' || t === 'FIGURE') return true;
  const bg = getComputedStyle(el).backgroundImage;
  return !!bg && bg !== 'none' && !bg.startsWith('linear-gradient') && !bg.startsWith('radial-gradient');
}

function pickTargets(sec: HTMLElement): HTMLElement[] {
  const sr = sec.getBoundingClientRect();
  const secArea = Math.max(1, area(sr));
  const all = Array.from(sec.querySelectorAll<HTMLElement>(SELECTOR)).filter((el) => {
    const r = el.getBoundingClientRect();
    const a = area(r);
    if (a < 900 || a > secArea * 0.72) return false;
    if (r.left < sr.left - 2 || r.right > Math.min(sr.right, window.innerWidth) + 2) return false;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    if (el.closest('.nav, .mmenu, [data-bp-skip]')) return false;
    return true;
  });
  // headings first, then biggest blocks
  all.sort((a, b) => {
    const ha = HEAD.has(a.tagName) ? 1 : 0, hb = HEAD.has(b.tagName) ? 1 : 0;
    if (ha !== hb) return hb - ha;
    return area(b.getBoundingClientRect()) - area(a.getBoundingClientRect());
  });
  const chosen: HTMLElement[] = [];
  for (const el of all) {
    if (chosen.length >= MAX_BOXES) break;
    // skip things nested inside a chosen text block, and near-duplicates (a > p of the same size)
    if (chosen.some((c) => c.contains(el) && TEXT.has(c.tagName))) continue;
    const r = el.getBoundingClientRect();
    if (chosen.some((c) => { const q = c.getBoundingClientRect(); return Math.abs(q.left - r.left) < 4 && Math.abs(q.top - r.top) < 4 && Math.abs(q.width - r.width) < 8 && Math.abs(q.height - r.height) < 8; })) continue;
    chosen.push(el);
  }
  return chosen;
}

function build(sec: HTMLElement, targets: HTMLElement[]) {
  const sr = sec.getBoundingClientRect();
  const layer = document.createElement('div');
  layer.className = 'bp-layer';
  layer.style.left = `${sr.left + window.scrollX}px`;
  layer.style.top = `${sr.top + window.scrollY}px`;
  layer.style.width = `${sr.width}px`;
  layer.style.height = `${sr.height}px`;
  document.body.appendChild(layer);

  const boxes: HTMLElement[] = [];
  targets.forEach((el, i) => {
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return;
    const b = document.createElement('div');
    const kind = isMedia(el) ? 'media' : TEXT.has(el.tagName) ? 'text' : 'block';
    b.className = `bp-box bp-${kind}`;
    b.style.left = `${r.left - sr.left}px`;
    b.style.top = `${r.top - sr.top}px`;
    b.style.width = `${r.width}px`;
    b.style.height = `${r.height}px`;
    b.style.transitionDelay = `${i * 22}ms`;
    if (kind === 'text') {
      const lh = parseFloat(getComputedStyle(el).lineHeight) || 20;
      b.style.setProperty('--lh', `${Math.max(10, lh)}px`);
    }
    b.innerHTML = `<i class="bp-h tl"></i><i class="bp-h tr"></i><i class="bp-h bl"></i><i class="bp-h br"></i>${
      kind === 'media' ? '<span class="bp-tag">Image</span>' : ''
    }<span class="bp-size">${Math.round(r.width)} × ${Math.round(r.height)}</span>`;
    layer.appendChild(b);
    boxes.push(b);
  });
  const scan = document.createElement('div');
  scan.className = 'bp-scan';
  layer.appendChild(scan);

  requestAnimationFrame(() => layer.classList.add('is-wire'));
  window.setTimeout(() => layer.classList.add('is-scan'), 320);
  // content snaps in, one by one
  targets.forEach((el, i) => {
    window.setTimeout(() => {
      el.classList.add('bp-reveal');
      el.classList.remove('bp-hide');
      window.setTimeout(() => el.classList.remove('bp-reveal'), 600);
      if (HEAD.has(el.tagName) || el.tagName === 'H4') {
        el.classList.add('bp-ghost');
        window.setTimeout(() => el.classList.remove('bp-ghost'), 560);
      }
      boxes[i]?.classList.add('is-filled');
    }, 480 + i * 55);
  });
  const doneAt = 480 + targets.length * 55;
  // a quick "selected" flash on one element, like clicking it in Figma
  window.setTimeout(() => {
    const pick = boxes.find((b) => b.classList.contains('bp-block')) || boxes[Math.min(1, boxes.length - 1)];
    pick?.classList.add('is-selected');
  }, Math.max(700, doneAt - 200));
  window.setTimeout(() => layer.classList.add('is-done'), doneAt + 420);
  window.setTimeout(() => layer.remove(), doneAt + 1100);
}

export default function Blueprint() {
  const { pathname } = useLocation();
  const [introDone, setIntroDone] = useState(() => {
    try { return reduced() || sessionStorage.getItem('fi-intro') === '1'; } catch { return true; }
  });
  const pending = useRef<Map<HTMLElement, HTMLElement[]>>(new Map());
  const introDoneRef = useRef(introDone);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // hide sections before first paint of a new route (no flash), then hand over to the observer
  useLayoutEffect(() => {
    if (reduced()) return;
    document.documentElement.classList.add('bp-pre');
    return () => document.documentElement.classList.remove('bp-pre');
  }, [pathname]);

  useEffect(() => {
    if (reduced()) { document.documentElement.classList.remove('bp-pre'); return; }
    let io: IntersectionObserver | null = null;
    let cancelled = false;
    const start = window.setTimeout(() => {
      if (cancelled) return;
      const secs = Array.from(document.querySelectorAll<HTMLElement>('main section, body > #root footer, footer'));
      const map = new Map<HTMLElement, HTMLElement[]>();
      for (const s of secs) {
        if (s.dataset.bpBuilt === pathname) continue;
        const t = pickTargets(s);
        t.forEach((el) => el.classList.add('bp-hide'));
        map.set(s, t);
      }
      pending.current = map;
      document.documentElement.classList.remove('bp-pre');
      if (!('IntersectionObserver' in window)) { map.forEach((t) => t.forEach((el) => el.classList.remove('bp-hide'))); return; }
      io = new IntersectionObserver((entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const s = e.target as HTMLElement;
          const t = pending.current.get(s);
          if (!t) continue;
          if (!introDoneRef.current) continue;
          pending.current.delete(s);
          s.dataset.bpBuilt = pathname;
          io?.unobserve(s);
          build(s, t);
        }
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      map.forEach((_, s) => io!.observe(s));
      observerRef.current = io;
    }, 60);
    return () => {
      cancelled = true;
      window.clearTimeout(start);
      io?.disconnect();
      // never leave content hidden when leaving a page
      pending.current.forEach((t) => t.forEach((el) => el.classList.remove('bp-hide')));
      document.querySelectorAll('.bp-layer').forEach((l) => l.remove());
      document.querySelectorAll('main section').forEach((s) => { delete (s as HTMLElement).dataset.bpBuilt; });
    };
  }, [pathname]);

  useEffect(() => {
    introDoneRef.current = introDone;
    if (!introDone) return;
    // re-check sections already on screen once the intro is gone
    const io = observerRef.current;
    if (io) pending.current.forEach((_, s) => { io.unobserve(s); io.observe(s); });
  }, [introDone]);

  return (
    <>
      <Particles />
      {!introDone && <Intro onDone={() => { try { sessionStorage.setItem('fi-intro', '1'); } catch { /* ignore */ } setIntroDone(true); }} />}
    </>
  );
}

/* ── Intro: particles swirl around a square, then the page starts building ── */
function Intro({ onDone }: { onDone: () => void }) {
  const [out, setOut] = useState(false);
  useEffect(() => {
    const a = window.setTimeout(() => setOut(true), 1300);
    const b = window.setTimeout(onDone, 1750);
    return () => { window.clearTimeout(a); window.clearTimeout(b); };
  }, [onDone]);
  return (
    <div className={`bp-intro ${out ? 'is-out' : ''}`} aria-hidden>
      <div className="bp-intro-square">
        <span className="bp-intro-label mono">building…</span>
      </div>
      {Array.from({ length: 14 }).map((_, i) => (
        <i key={i} className="bp-intro-p" style={{ ['--i' as string]: i, ['--c' as string]: ['var(--orange)', 'var(--lilac)', '#0D99FF', 'var(--ink)'][i % 4] }} />
      ))}
    </div>
  );
}

/* ── Floating particles: tiny cursor-shaped triangles drifting across the site ── */
function Particles() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (reduced()) return;
    const cv = ref.current!;
    const ctx = cv.getContext('2d')!;
    let w = 0, h = 0, dpr = 1, raf = 0;
    const mouse = { x: -9999, y: -9999 };
    const mobile = window.innerWidth < 900;
    const N = mobile ? 14 : 30;
    const colors = () => {
      const cs = getComputedStyle(document.documentElement);
      return [cs.getPropertyValue('--orange').trim() || '#FF5B2E', cs.getPropertyValue('--lilac').trim() || '#C9B8FF', '#0D99FF', cs.getPropertyValue('--ink').trim() || '#16130F'];
    };
    let pal = colors();
    const ps = Array.from({ length: N }).map((_, i) => ({
      x: Math.random(), y: Math.random(), vx: (Math.random() - 0.5) * 0.00018, vy: -0.00008 - Math.random() * 0.00016,
      r: Math.random() * Math.PI * 2, vr: (Math.random() - 0.5) * 0.01, s: 5 + Math.random() * 4, c: i % 4, ox: 0, oy: 0,
    }));
    const resize = () => { dpr = Math.min(2, window.devicePixelRatio || 1); w = window.innerWidth; h = window.innerHeight; cv.width = w * dpr; cv.height = h * dpr; cv.style.width = `${w}px`; cv.style.height = `${h}px`; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    resize();
    const onMove = (e: PointerEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const obs = new MutationObserver(() => { pal = colors(); });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove, { passive: true });
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        p.x += p.vx; p.y += p.vy; p.r += p.vr;
        if (p.y < -0.03) { p.y = 1.03; p.x = Math.random(); }
        if (p.x < -0.03) p.x = 1.03; if (p.x > 1.03) p.x = -0.03;
        const px = p.x * w, py = p.y * h;
        const dx = px - mouse.x, dy = py - mouse.y, d2 = dx * dx + dy * dy;
        if (d2 < 120 * 120) { const f = (1 - Math.sqrt(d2) / 120) * 2.2; p.ox += (dx / Math.sqrt(d2 + 1)) * f; p.oy += (dy / Math.sqrt(d2 + 1)) * f; }
        p.ox *= 0.92; p.oy *= 0.92;
        ctx.save();
        ctx.translate(px + p.ox, py + p.oy);
        ctx.rotate(p.r);
        ctx.fillStyle = pal[p.c];
        ctx.globalAlpha = p.c === 3 ? 0.35 : 0.7;
        ctx.beginPath(); ctx.moveTo(0, -p.s); ctx.lineTo(p.s * 0.72, p.s * 0.75); ctx.lineTo(0, p.s * 0.35); ctx.lineTo(-p.s * 0.72, p.s * 0.75); ctx.closePath(); ctx.fill();
        ctx.restore();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const vis = () => { if (document.hidden) cancelAnimationFrame(raf); else raf = requestAnimationFrame(tick); };
    document.addEventListener('visibilitychange', vis);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); window.removeEventListener('pointermove', onMove); document.removeEventListener('visibilitychange', vis); obs.disconnect(); };
  }, []);
  return <canvas ref={ref} className="bp-particles" aria-hidden />;
}
