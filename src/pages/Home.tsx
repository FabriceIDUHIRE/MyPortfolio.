import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { cases } from '../content/cases';
import { links, isExternal } from '../content/site';
import { currently, currentlyMobile, stats, bricks, quotes } from '../content/home';
import { Cursor, Reveal, Roller, SectionHead, Stage, Title, useInView } from '../components/bits';
import Folder from '../components/Folder';
import WhereToNext from '../components/WhereToNext';
import { experiments, ExperimentCard } from '../components/Experiments';
import { useIsMobile } from '../useIsMobile';
import './home.css';

const ext = (h: string) => (isExternal(h) ? { target: '_blank', rel: 'noreferrer' } : {});

/* ═══════════════ HERO ═══════════════ */
const words = ['Loved', 'Useful', 'Shipped'] as const;
const sizes = { Loved: 1031, Useful: 1049, Shipped: 1151 };
function useWord() {
  const [w, setW] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setW((x) => (x + 1) % 3), 2000);
    return () => clearInterval(id);
  }, []);
  return words[w];
}
const bouncy = { type: 'spring', stiffness: 260, damping: 15 } as const;

function SwapWord({ word }: { word: string }) {
  return (
    <motion.span layout className="swap" transition={{ layout: bouncy }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={word} className="it" initial={{ y: '95%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-95%', opacity: 0 }} transition={bouncy}>
          {word}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
}

function StickyNote({ mobile = false }: { mobile?: boolean }) {
  const [hover, setHover] = useState(false);
  return (
    <motion.div
      className={`sticky ${mobile ? 'sticky-m' : ''}`}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      onTap={() => setHover((h) => !h)}
      animate={hover ? { rotate: 1, y: 3 } : { rotate: [-6, -2, -6], y: [0, 7, 0] }}
      transition={hover ? { duration: 0.45, ease: [0.22, 1, 0.36, 1] } : { duration: 3.7, repeat: Infinity, ease: 'easeInOut' }}
    >
      <span className="sticky-tape" />
      <p className="hand">note to self:<br />hire this<br /><span className="sticky-u">person!!
        <motion.svg viewBox="0 0 120 12" className="sticky-wave" initial={false} animate={{ pathLength: 1, opacity: hover ? 1 : 0 }}>
          <motion.path d="M2 7 Q 15 1 28 7 T 54 7 T 80 7 T 106 7 T 118 6" stroke="#ff5b2e" strokeWidth="3" fill="none" strokeLinecap="round" initial={false} animate={{ pathLength: hover ? 1 : 0 }} transition={{ duration: 0.45 }} />
        </motion.svg></span>
      </p>
      <motion.svg className="sticky-check" viewBox="0 0 40 30" initial={false} animate={{ opacity: hover ? 1 : 0, scale: hover ? 1 : 0.5 }}>
        <motion.path d="M3 16 L14 26 L37 3" stroke="#ff5b2e" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" initial={false} animate={{ pathLength: hover ? 1 : 0 }} transition={{ duration: 0.4, delay: 0.1 }} />
      </motion.svg>
      <motion.span className="hand sticky-ser" initial={false} animate={{ opacity: hover ? 1 : 0, y: hover ? 0 : 6 }}>(seriously)</motion.span>
    </motion.div>
  );
}

function Recruiter({ pts }: { pts: [number, number][] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % pts.length), 1800);
    return () => clearInterval(id);
  }, [pts.length]);
  return (
    <motion.div className="recruiter" animate={{ x: pts[i][0], y: pts[i][1] }} transition={{ duration: 1.2, ease: 'easeInOut' }}>
      <Cursor label="Recruiter" color="lilac" />
    </motion.div>
  );
}

function Comment() {
  const [hover, setHover] = useState(false);
  const [open, setOpen] = useState(false);
  return (
    <motion.div className="cmt" initial={{ opacity: 0, scale: 0.92, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.45 }}>
      <span className="cmt-pin">FI</span>
      <motion.div layout className="cmt-bubble" onHoverStart={() => setHover(true)} onHoverEnd={() => setHover(false)} onClick={() => setOpen((o) => !o)} animate={{ y: hover && !open ? -3 : 0 }} transition={{ layout: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}>
        <motion.p layout="position" className="cmt-top"><b>Fabrice Iduhire</b> <span>just now</span></motion.p>
        <motion.p layout="position" className="cmt-msg">Things I get pulled into: product design, design systems, research &amp; prototyping. Ask me about any of them!</motion.p>
        <AnimatePresence>
          {open && (
            <motion.div className="cmt-replies" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.35 }}>
              <div className="cmt-r"><i className="av lilac">R</i><p><b>Recruiter</b><br />Noted. Booking a call right now.</p></div>
              <div className="cmt-r"><i className="av orange">HM</i><p><b>Hiring manager</b><br />Same. Are you free Monday?</p></div>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button layout="position" className="cmt-link">{open ? 'Hide replies' : hover ? '2 replies  ·  click to open' : '2 replies'}</motion.button>
      </motion.div>
    </motion.div>
  );
}

type CtaState = 'idle' | 'book' | 'work';
function Cta({ mobile = false }: { mobile?: boolean }) {
  const [s, setS] = useState<CtaState>('idle');
  const [ab, setAb] = useState(0);
  const [marked, setMarked] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMarked(true), 600); return () => clearTimeout(t); }, []);
  useEffect(() => {
    if (s !== 'idle') return;
    const id = setInterval(() => setAb((x) => 1 - x), 1200);
    return () => clearInterval(id);
  }, [s]);
  const pos = mobile
    ? { idle: ab ? [262, 140] : [270, 134], book: [262, 128], work: [262, 196] }[s]
    : { idle: ab ? [166, 167] : [180, 179], book: [120, 153], work: [330, 169] }[s];
  const label = { idle: mobile ? 'you, about to tap' : 'you, about to click', book: 'yes! that one', work: 'ooh, scroll!' }[s];
  return (
    <div className={`cta ${mobile ? 'cta-m' : ''}`}>
      <p className="cta-intro">
        I{mobile ? '’' : "'"}m a product designer who takes{' '}
        <span className="scrib">tangled problems<motion.svg viewBox="0 0 161 12" preserveAspectRatio="none" initial={false} animate={{ opacity: marked ? 1 : 0 }}><motion.path d="M1 6 Q 6 1 11 6 T 21 6 T 31 6 T 41 6 T 51 6 T 61 6 T 71 6 T 81 6 T 91 6 T 101 6 T 111 6 T 121 6 T 131 6 T 141 6 T 151 6 T 160 6" stroke="#ff5b2e" strokeWidth="2.2" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: marked ? 1 : 0 }} transition={{ duration: 0.9, ease: 'easeOut' }} /></motion.svg></span>{' '}
        and turns them into products people <span className="marker"><motion.i initial={{ scaleX: 0 }} animate={{ scaleX: marked ? 1 : 0 }} transition={{ duration: 0.9, ease: 'easeOut', delay: 0.15 }} />actually enjoy</span> using, then helps ship them.
      </p>
      <div className="cta-btns">
        <a href={links.book} {...ext(links.book)} className={`btn cta-book ${s === 'book' ? 'on' : ''}`} onMouseEnter={() => setS('book')} onMouseLeave={() => setS('idle')}>
          {s === 'book' ? 'Pick a time  ↗' : 'Book a 30-min call'}
        </a>
        <a href="#work" className={`btn cta-work ${s === 'work' ? 'on' : ''}`} onMouseEnter={() => setS('work')} onMouseLeave={() => setS('idle')}>
          See the work <span className="cta-arrow">↓</span>
        </a>
      </div>
      <motion.div className="cta-you" animate={{ x: pos[0], y: pos[1] }} transition={{ duration: s === 'idle' ? 0.9 : 0.45, ease: 'easeInOut' }}>
        <Cursor label={label} />
      </motion.div>
    </div>
  );
}

function Stats({ mobile = false }: { mobile?: boolean }) {
  const [run, setRun] = useState(0);
  return (
    <div className={`stats ${mobile ? 'stats-m' : ''}`} onMouseEnter={() => setRun((r) => r + 1)} onClick={() => setRun((r) => r + 1)}>
      {stats.map((s) => (
        <div key={s.label} className="stat">
          <span className="stat-num"><Roller value={s.value} step={s.step} run={run} />{s.suffix}</span>
          <span className="mono stat-l">{mobile ? s.short : s.label}</span>
        </div>
      ))}
    </div>
  );
}

function HeroDesktop() {
  const word = useWord();
  return (
    <Stage w={1512} h={881} className="hero-stage">
      <motion.p className="mono hero-cur" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><i />{currently}</motion.p>
      <motion.div className="hl" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
        <motion.div layout className="sel" transition={{ layout: bouncy }}>
          <span className="sel-name mono">Headline</span>
          <i className="hd tl" /><i className="hd tr" /><i className="hd bl" /><i className="hd br" />
          <h1 className="hl-h1">
            <span className="hl-l1">Messy ideas in.</span>
            <span className="hl-l2"><SwapWord word={word} /> <motion.span layout transition={{ layout: bouncy }} className="hl-rest">products out.</motion.span></span>
          </h1>
          <motion.span layout="position" className="sel-size mono" transition={{ layout: bouncy }}>{sizes[word]} × Hug</motion.span>
        </motion.div>
      </motion.div>
      <div className="pos" style={{ left: 1184 + 68, top: 100 + 50 }}><StickyNote /></div>
      <div className="pos" style={{ left: 703, top: 68 }}><Recruiter pts={[[320, 10], [60, 150], [430, 230]]} /></div>
      <div className="pos" style={{ left: 1116, top: 438 }}><Comment /></div>
      <div className="pos" style={{ left: 64, top: 538 }}><Cta /></div>
      <div className="pos" style={{ left: 955, top: 673 }}><Stats /></div>
      <a href="#work" className="pos keep mono" style={{ left: 1210, top: 635 }}>04 FILES  ·  KEEP SCROLLING <span>↓</span></a>
    </Stage>
  );
}

function HeroMobile() {
  const word = useWord();
  return (
    <Stage w={440} h={729} className="hero-stage" max={1.35}>
      <p className="mono hero-cur m" style={{ left: 20, top: 28 }}><i />{currentlyMobile}</p>
      <div className="pos" style={{ left: 20, top: 64 }}>
        <div className="sel sel-m">
          <span className="sel-name mono">Headline</span>
          <i className="hd tl" /><i className="hd tr" /><i className="hd bl" /><i className="hd br" />
          <h1 className="hl-h1 m">
            <span className="hl-l1">Messy ideas in.</span>
            <span className="hl-l2"><SwapWord word={word} /> <motion.span layout transition={{ layout: bouncy }} className="hl-rest">products</motion.span></span>
            <span className="hl-l1">out.</span>
          </h1>
        </div>
      </div>
      <div className="pos" style={{ left: 292, top: 210 }}><StickyNote mobile /></div>
      <div className="pos" style={{ left: 300, top: 30 }}><Recruiter pts={[[20, 10], [-60, 30], [10, 60]]} /></div>
      <div className="pos" style={{ left: 20, top: 342 }}><Cta mobile /></div>
      <div className="pos" style={{ left: 20, top: 601 }}><Stats mobile /></div>
    </Stage>
  );
}

function Hero() {
  const mobile = useIsMobile();
  return <section className="hero grid-bg">{mobile ? <HeroMobile /> : <HeroDesktop />}</section>;
}

/* ═══════════════ SELECTED WORK ═══════════════ */
const pileAt = [[376, 364, 2], [364, 376, -4], [386, 388, 5], [358, 400, -7]];
const spreadAt = [[680, 10, 2], [20, 220, -2], [744, 440, 3], [20, 650, -1]];
function SelectedWork() {
  const mobile = useIsMobile();
  const [spread, setSpread] = useState(false);
  return (
    <section className="section" id="work">
      <div className="wrap">
        <div className="sw-head">
          <Reveal>
            <h2 className="h-lg">Selected <span className="it">work</span><sup className="mono sw-count">(04 FILES)</sup></h2>
          </Reveal>
          <Reveal delay={0.1}><p className="lead">A few projects I’m proud of — with the numbers to back them up.</p></Reveal>
        </div>
        {mobile ? (
          <>
            <div className="work-list">{cases.map((c) => <Reveal key={c.slug}><Folder c={c} compact /></Reveal>)}</div>
            <p className="hand swipe-note">press &amp; hold a folder to peek inside</p>
          </>
        ) : (
          <Stage w={1384} h={1110}>
            <div className="pile" onMouseEnter={() => setSpread(true)} onMouseLeave={() => setSpread(false)}>
              <motion.p className="mono pile-label" animate={{ opacity: spread ? 0 : 1 }}>04 FILES  ·  NEATLY PILED</motion.p>
              {[...cases].reverse().map((c) => {
                const i = c.index - 1;
                const p = spread ? spreadAt[i] : pileAt[i];
                return (
                  <motion.div key={c.slug} className="pile-item" style={{ zIndex: 10 - i }} initial={false} animate={{ x: p[0], y: p[1], rotate: p[2] }} transition={{ type: 'spring', stiffness: 210, damping: 24, delay: spread ? i * 0.03 : (3 - i) * 0.03 }}>
                    <Folder c={c} />
                  </motion.div>
                );
              })}
              <motion.div className="pile-hint" animate={{ opacity: spread ? 0 : 1 }} transition={{ duration: 0.3, delay: spread ? 0 : 0.35 }}>
                <p className="hand">four files, one messy pile.<br />hover to spread them out!</p>
                <svg width="80" height="40" viewBox="0 0 80 40" fill="none"><path d="M76 6C56 2 30 10 8 30" stroke="#16130f" strokeWidth="2" strokeLinecap="round" /><path d="M6 18l2 13 13-3" stroke="#16130f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <motion.div animate={{ x: [0, 8, 0], y: [0, -6, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }} className="pile-cursor"><Cursor label="you, curious" color="lilac" /></motion.div>
              </motion.div>
            </div>
          </Stage>
        )}
      </div>
    </section>
  );
}

/* ═══════════════ WHAT I WORK ON ═══════════════ */
function WorkCard({ n, t, d, art: Art }: { n: string; t: string; d: string; art: (p: { h: boolean }) => JSX.Element }) {
  const [h, setH] = useState(false);
  return (
    <div className={`wo ${h ? 'on' : ''}`} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} onClick={() => setH((x) => !x)}>
      <span className="mono wo-n"># {n}  {t}</span>
      <div className="wo-card">
        <div className="wo-art"><Art h={h} /></div>
        <h3>{t}</h3>
        <p>{d}</p>
      </div>
    </div>
  );
}
const ArtMessy = ({ h }: { h: boolean }) => (
  <div className="art a-messy">
    <svg viewBox="0 0 300 180" className="a-svg">
      <motion.path d="M30 120 C 40 40, 70 150, 80 80 S 100 20, 120 90 S 90 140, 70 100 S 100 40, 130 70" stroke="#16130f" strokeWidth="3" fill="none" strokeLinecap="round" animate={{ opacity: h ? 0.25 : 1 }} />
      <motion.path d="M150 82 H 180" stroke="#16130f" strokeWidth="3" strokeLinecap="round" />
      <path d="M172 75 l9 7 -9 7" stroke="#16130f" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <motion.path d="M186 82 H 270" stroke="#f3eee4" strokeWidth="3.5" strokeLinecap="round" initial={false} animate={{ pathLength: h ? 1 : 0 }} transition={{ duration: 0.45 }} />
      <circle cx="275" cy="82" r="7" fill="#16130f" />
    </svg>
    <span className="hand a-l1">messy</span><span className="hand a-l2">clear!</span>
  </div>
);
const tilesH1 = [1, 3, 4, 5, 7];
const ArtSystem = ({ h }: { h: boolean }) => {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (!h) { setStage(0); return; }
    setStage(1);
    const t = setTimeout(() => setStage(2), 420);
    return () => clearTimeout(t);
  }, [h]);
  return (
    <div className="art a-system">
      {Array.from({ length: 9 }).map((_, i) => {
        const dark = i === 4 || (stage >= 1 && tilesH1.includes(i)) || stage === 2;
        const core = i === 4 && stage === 2;
        return <motion.i key={i} animate={{ background: core ? '#ff5b2e' : dark ? '#16130f' : '#f3eee4', color: dark ? '#f3eee4' : '#16130f', scale: h ? 1.04 : 1 }} transition={{ duration: 0.4, delay: h ? (tilesH1.includes(i) ? 0 : 0.06) : 0 }}>{dark ? '◇' : ''}</motion.i>;
      })}
      <motion.span className="hand a-feel" animate={{ opacity: stage === 2 ? 1 : 0, rotate: 8 }}>feels right</motion.span>
    </div>
  );
};
const ArtMotion = ({ h }: { h: boolean }) => (
  <div className="art a-motion">
    <span className="mono am-l">FIGMA</span><span className="mono am-r">MOTION</span>
    <span className={`am-btn ${h ? 'on' : ''}`}>Button</span>
    <pre className="mono am-code">{h ? 'on tap:\n  squish 0.92\n  wiggle!' : 'on tap:\n  squish 0.96\n  bounce back'}</pre>
    <motion.span className="hand am-feel" animate={{ opacity: h ? 1 : 0, y: h ? 0 : 6 }}>feels right</motion.span>
  </div>
);
const ArtNotes = ({ h }: { h: boolean }) => (
  <div className={`art a-notes ${h ? 'on' : ''}`}>
    <span className="hand n1">why?</span><span className="hand n2">users?</span><span className="hand n3">MVP</span><span className="hand n4">this one!</span>
    <svg viewBox="0 0 160 90" className="n-circle"><motion.ellipse cx="80" cy="45" rx="74" ry="38" stroke="#16130f" strokeWidth="3" fill="none" initial={false} animate={{ pathLength: h ? 1 : 0, opacity: h ? 1 : 0 }} transition={{ duration: 0.5 }} /></svg>
  </div>
);
function WorkOn() {
  const items = [
    { n: '01', t: 'Complex products', d: 'I make products with lots of moving parts feel simple to understand and use.', art: ArtMessy },
    { n: '02', t: 'Design systems', d: 'I help teams build products that feel consistent, without solving the same problem twice.', art: ArtSystem },
    { n: '03', t: 'Interaction design', d: 'I design every hover, tap and transition, so the finished product feels the way it was designed.', art: ArtMotion },
    { n: '04', t: 'Figuring out what to build', d: 'When the problem isn’t clear yet, I help teams work out what people need — and what to build.', art: ArtNotes },
  ];
  return (
    <section className="section">
      <div className="wrap">
        <SectionHead kicker="WHAT I WORK ON" title="Problems I love getting pulled into" word="love" sub="Four kinds of problems I get pulled into — and the ones I go looking for." />
      </div>
      <div className="wrap h-scroller">
        <div className="wo-row">{items.map((it, i) => <Reveal key={it.n} delay={i * 0.08}><WorkCard {...it} /></Reveal>)}</div>
      </div>
      <p className="hand swipe-note wrap m-only">swipe for more →</p>
    </section>
  );
}

/* ═══════════════ BRICK BY BRICK ═══════════════ */
const brickGeo = [[312, 670, 460], [562, 544, 440], [332, 418, 580], [512, 292, 580], [422, 166, 480]];
const rulerYears = [['2019', 718], ['2020', 592], ['2021', 466], ['2023', 340], ['2025', 214], ['2026', 89]] as const;
function Brick({ b }: { b: (typeof bricks)[number] }) {
  return (
    <div className={`brick brick-${b.color}`}>
      <span className="mono brick-y">{b.years}</span>
      {b.now && <span className="mono brick-now">NOW</span>}
      <b className="brick-co">{b.company}</b>
      <span className="brick-role">{b.role}</span>
    </div>
  );
}
function BrickWall() {
  const [ref, inView] = useInView<HTMLDivElement>();
  const [phase, setPhase] = useState(5); // 5 = full wall, -1 = all lifted, 0..4 = bricks placed
  useEffect(() => {
    if (!inView) return;
    let t: number[] = [];
    const cycle = () => {
      t = [];
      t.push(window.setTimeout(() => setPhase(-1), 3000));
      for (let k = 0; k < 5; k++) t.push(window.setTimeout(() => setPhase(k), 3000 + 450 + 300 + k * 160));
      t.push(window.setTimeout(() => { setPhase(5); }, 3000 + 450 + 300 + 5 * 160 + 200));
      t.push(window.setTimeout(cycle, 3000 + 450 + 300 + 5 * 160 + 700));
    };
    setPhase(-1);
    t.push(window.setTimeout(() => {
      for (let k = 0; k < 5; k++) t.push(window.setTimeout(() => setPhase(k), k * 160));
      t.push(window.setTimeout(() => { setPhase(5); cycle(); }, 5 * 160 + 400));
    }, 300));
    return () => t.forEach(clearTimeout);
  }, [inView]);
  return (
    <div ref={ref}>
      <Stage w={1384} h={862}>
        <div className="wall">
          <div className="ruler" />
          {rulerYears.map(([y, top]) => <span key={y} className="ruler-y mono" style={{ top }}><i />{y}</span>)}
          {bricks.map((b, i) => {
            const [x, y, w] = brickGeo[i];
            const placed = phase >= i;
            return (
              <motion.div key={b.company} className="brick-pos" style={{ left: x, width: w, top: y }} initial={false} animate={placed ? { y: 0, rotate: 0, opacity: 1 } : { y: -y - 230, rotate: i % 2 ? 7 : -7, opacity: 1 }} transition={placed ? { type: 'spring', stiffness: 260, damping: 15 } : { duration: 0.45, ease: 'easeIn' }}>
                <Brick b={b} />
              </motion.div>
            );
          })}
          <motion.div className="ghost" animate={{ opacity: phase === 5 ? 1 : 0, y: phase === 5 ? 0 : -180 }} transition={{ duration: 0.5 }}>
            <a href={links.email} className="ghost-in"><span className="mono">NEXT BRICK</span><b>Your company?</b><em>Let’s talk  →</em></a>
          </motion.div>
          <motion.div className="dropzone" animate={{ opacity: phase === 5 ? 1 : 0 }} />
          <motion.div className="wall-still" animate={{ opacity: phase === 5 ? 1 : 0 }}>
            <span className="hand">still building…</span>
            <svg width="70" height="30" viewBox="0 0 70 30" fill="none"><path d="M2 8C20 4 40 10 62 22" stroke="#16130f" strokeWidth="2" strokeLinecap="round" /><path d="M52 24l11-1-4-10" stroke="#16130f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </motion.div>
          <motion.div className="wall-you" animate={{ opacity: phase === 5 ? 1 : 0, x: phase === 5 ? [0, -10, 0] : 0, y: phase === 5 ? [0, 6, 0] : 0 }} transition={{ x: { duration: 2.2, repeat: Infinity }, y: { duration: 2.2, repeat: Infinity }, opacity: { duration: 0.4 } }}>
            <svg width="22" height="24" viewBox="0 0 24 24"><path d="M8 11V4.5a1.5 1.5 0 013 0V10m0-1.5a1.5 1.5 0 013 0V10m0-1a1.5 1.5 0 013 0v2m0-1a1.5 1.5 0 013 0v4.5c0 4-2.5 6.5-6.5 6.5S7.5 19 6 17l-2.5-4a1.6 1.6 0 012.6-1.8L8 13.5" fill="#fff" stroke="#16130f" strokeWidth="1.4" strokeLinejoin="round" /></svg>
            <span className="cursor-lilac-tag">you, placing it?</span>
          </motion.div>
          <div className="ground" />
          <p className="mono foundation">THE FOUNDATION — WHERE IT ALL STARTED</p>
        </div>
      </Stage>
    </div>
  );
}
function BrickMobile() {
  const offs = [10, 0, 20, 5, 15];
  const list = [...bricks].reverse();
  return (
    <div className="wall-m">
      <a href={links.email} className="ghost-in m"><span className="mono">NEXT BRICK</span><b>Your company?</b></a>
      {list.map((b, i) => (
        <motion.div key={b.company} style={{ marginLeft: `${offs[i]}%`, width: `${[85, 92, 80, 75, 70][i]}%` }} initial={{ y: -80, opacity: 0, rotate: i % 2 ? 5 : -5 }} whileInView={{ y: 0, opacity: 1, rotate: 0 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 240, damping: 15, delay: (list.length - i) * 0.12 }}>
          <Brick b={b} />
        </motion.div>
      ))}
      <div className="ground m" />
      <p className="mono foundation m">THE FOUNDATION</p>
    </div>
  );
}
export function Bricks() {
  const mobile = useIsMobile();
  return (
    <section className="section">
      <div className="wrap">
        <SectionHead kicker="WHERE I’VE BEEN" title="Built brick by brick" word="brick" sub={mobile ? 'Every role is a brick in how I work today. The wall is still going up.' : 'Every role is a brick in how I work today. The wall is still going up — maybe your team is the next brick.'}>
          {!mobile && (
            <div className="brick-links">
              <a href={links.resume} {...ext(links.resume)}>Download resume  ↓</a>
              <a href={links.linkedin} {...ext(links.linkedin)} className="orange">LinkedIn  ↗</a>
            </div>
          )}
        </SectionHead>
        {mobile ? <BrickMobile /> : <BrickWall />}
      </div>
    </section>
  );
}

/* ═══════════════ WORD OF MOUTH ═══════════════ */
function Quotes() {
  const [i, setI] = useState(0);
  const [lit, setLit] = useState(false);
  const [ref, inView] = useInView<HTMLDivElement>();
  useEffect(() => {
    setLit(false);
    const a = setTimeout(() => setLit(true), 300);
    const b = inView ? setTimeout(() => setI((x) => (x + 1) % quotes.length), 5500) : undefined;
    return () => { clearTimeout(a); if (b) clearTimeout(b); };
  }, [i, inView]);
  const q = quotes[i];
  return (
    <section className="section wom" ref={ref}>
      <div className="wrap">
        <Reveal className="wom-head">
          <span className="kicker">{'{ WORD OF MOUTH }'}</span>
          <Title text="In their words" word="words" />
        </Reveal>
        <div className="wom-quote">
          <span className="wom-mark">“</span>
          <AnimatePresence mode="wait">
            <motion.blockquote key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.45 }}>
              {q.lead}<br />
              <motion.span className="qhl" initial={{ backgroundSize: '0% 36%' }} animate={{ backgroundSize: lit ? '100% 36%' : '0% 36%' }} transition={{ duration: 0.7, ease: 'easeOut' }}>{q.hl}</motion.span>
            </motion.blockquote>
          </AnimatePresence>
          <div className="wom-people">
            {quotes.map((p, k) => (
              <button key={p.initials} className={`wom-av ${k === i ? 'on' : ''}`} style={{ background: p.color }} onClick={() => setI(k)} aria-label={`Quote ${k + 1}`}>{p.initials}</button>
            ))}
            <AnimatePresence mode="wait">
              <motion.div key={i} className="wom-who" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                <b>{q.name}</b><span>{q.role}</span>
              </motion.div>
            </AnimatePresence>
          </div>
          <p className="mono wom-n">0{i + 1}  /  0{quotes.length}</p>
          <p className="hand wom-hint">click a face to switch</p>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════ PLAYGROUND TEASER ═══════════════ */
function PlaygroundTeaser() {
  const picks = [0, 3, 6, 10, 9].map((i) => experiments[i]);
  const tilt = [-5, 4, -2, 5, -3];
  const lift = [70, 10, 80, 20, 100];
  return (
    <section className="section pg-teaser">
      <div className="wrap">
        <div className="sec-head">
          <Reveal>
            <Link to="/playground" className="mono pg-top">See all experiments  →</Link>
            <Title text="Built just to see if it works" word="works" />
          </Reveal>
          <Reveal delay={0.1}>
            <p className="lead">Side quests, design experiments and tiny tools. Some are useful. Most are just fun.</p>
            <Link to="/playground" className="btn btn-ghost d-only" style={{ marginTop: 22 }}>See all 24 experiments  →</Link>
          </Reveal>
        </div>
      </div>
      <div className="wrap h-scroller">
        <div className="pg-row">
          {picks.map((e, i) => (
            <motion.div key={e.name} className="pg-polaroid" style={{ marginTop: lift[i] }} initial={{ opacity: 0, y: 40, rotate: 0 }} whileInView={{ opacity: 1, y: 0, rotate: tilt[i] }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 120, damping: 14, delay: i * 0.07 }} whileHover={{ rotate: 0, y: -14, scale: 1.04, zIndex: 5, transition: { type: 'spring', stiffness: 300, damping: 14 } }}>
              <span className="tape" />
              <ExperimentCard exp={e} showFrameLabel={false} polaroid />
            </motion.div>
          ))}
        </div>
        <div className="pg-burst d-only"><i className="pg-burst-star" /><span>24 &amp;<br />counting</span></div>
        <div className="pg-me d-only"><Cursor label="me, at 2am" color="lilac" /></div>
        <p className="pg-note hand d-only">most of these are useless.<br />all of them were fun.
          <svg width="44" height="40" viewBox="0 0 44 40" fill="none"><path d="M4 36C14 26 24 14 38 6" stroke="#16130f" strokeWidth="2" strokeLinecap="round" /><path d="M28 4l11 1-2 11" stroke="#16130f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </p>
      </div>
      <div className="wrap m-only"><Link to="/playground" className="btn btn-ghost pg-all">See all experiments →</Link></div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <SelectedWork />
      <WorkOn />
      <Bricks />
      <Quotes />
      <PlaygroundTeaser />
      <WhereToNext />
    </>
  );
}
