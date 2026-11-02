import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { site, mailto } from '../content/site';
import { Cursor, Photo, Reveal, SectionHead } from '../components/bits';
import WhereToNext from '../components/WhereToNext';
import { useIsMobile } from '../useIsMobile';
import './about.css';

/* ───────── hero ───────── */
const layers = [
  { icon: '◇', label: 'Product designer', hint: 'DAY JOB' },
  { icon: 'T', label: 'Sticky-note addict', hint: 'GUILTY' },
  { icon: '○', label: 'Coffee, 2 cups a day', hint: 'NO SUGAR' },
  { icon: '▶', label: 'Gamer after 6pm', hint: 'COD · NFS' },
  { icon: '□', label: 'Long walks', hint: 'THINKING TIME' },
  { icon: '✦', label: 'Motion nerd', hint: 'ALWAYS ON' },
];
function AboutHero() {
  const [hover, setHover] = useState<number | null>(null);
  return (
    <section className="ab-hero grid-bg">
      <div className="wrap ab-hero-inner">
        <div className="ab-copy">
          <motion.p className="mono ab-kicker" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>ABOUT · THE LONG STORY, SHORT</motion.p>
          <motion.h1 className="h-xl" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            A little about <br /><span className="it ab-me">me.</span>
          </motion.h1>
          <motion.p className="lead ab-lead" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            I’m Fabrice, a product designer who likes untangling messy problems and turning them into products people actually enjoy. I design in Figma, prototype everything, and I’m happiest when an idea goes from sticky note to shipped.
          </motion.p>
          <motion.div className="ab-ctas" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <a className="btn btn-dark" href={site.bookCall || mailto} target={site.bookCall ? '_blank' : undefined} rel="noreferrer">{site.bookCall ? 'Book a 30-min call' : 'Say hello'}</a>
            {site.resume && <a className="btn btn-ghost" href={site.resume} target="_blank" rel="noreferrer">Resume ↓</a>}
          </motion.div>
        </div>

        <motion.div className="ab-portrait" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 160, damping: 16 }}>
          <span className="mono ab-frame-name">me.work</span>
          <i className="h tl" /><i className="h tr" /><i className="h bl" /><i className="h br" />
          <Photo src="/images/fabrice.jpg" alt="Portrait of Fabrice Iduhire" className="ab-photo" />
          <span className="mono ab-size">340 × 340</span>
        </motion.div>

        <motion.div className="layers" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45, duration: 0.6 }}>
          <div className="layers-head"><b>Layers</b><span className="mono">me.work</span></div>
          <div className="layer root"><span>#</span><b>Fabrice Iduhire</b><em className="mono">FRAME</em></div>
          {layers.map((l, i) => (
            <motion.div
              key={l.label}
              className={`layer ${hover === i ? 'on' : ''}`}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i === layers.length - 1 ? 2.2 : 0.6 + i * 0.08 }}
            >
              <span>{l.icon}</span>{l.label}<em className="mono">{l.hint}</em>
            </motion.div>
          ))}
          <p className="hand layers-note">peek inside my<br />layers panel</p>
          <Cursor label="you, snooping" className="layers-cursor" />
        </motion.div>
      </div>
    </section>
  );
}

/* ───────── ask me anything ───────── */
const qa = [
  { icon: '◇', q: 'Figma or paper?', a: 'Both. Paper to think fast, Figma to find out if I was right.', aside: '(mostly Figma. don’t tell the devs)' },
  { icon: '⌘', q: 'Your most-used shortcut?', a: 'Cmd + Z. I make a lot of brave decisions.', aside: 'followed closely by Cmd + D' },
  { icon: '▲', q: 'A design hill you’d die on?', a: 'Empty states deserve as much love as the happy path.', aside: 'nobody starts with data' },
  { icon: '×', q: 'Worst design advice you ever got?', a: '“Just make it pop.” I still don’t know what pop means.', aside: '(more orange, apparently)' },
  { icon: '○', q: 'What do you do when you’re stuck?', a: 'Walk. My best ideas show up somewhere between two streets.', aside: 'long walks are in my layers panel ;)' },
  { icon: '▶', q: 'What are you learning right now?', a: 'Motion. This whole portfolio is basically my homework.', aside: 'hover everything. i dare you.' },
];
function useTyped(text: string) {
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0);
    const id = setInterval(() => setN((x) => (x >= text.length ? x : x + 1)), 38);
    return () => clearInterval(id);
  }, [text]);
  return text.slice(0, n);
}
function AskMe() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setI((x) => (x + 1) % qa.length), 3600);
    return () => clearInterval(id);
  }, [paused]);
  const query = useTyped(qa[i].q.toLowerCase().replace('?', ''));
  return (
    <section className="section">
      <div className="wrap">
        <SectionHead kicker="ASK ME ANYTHING" title="Press ⌘K, ask me anything" word="anything" sub="The questions I actually get at meetups, coffee chats and 2am DMs. It browses on its own. Hover one to pick it." />
        <Reveal>
          <div
            className="palette"
            tabIndex={0}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') { e.preventDefault(); setPaused(true); setI((x) => (x + 1) % qa.length); }
              if (e.key === 'ArrowUp') { e.preventDefault(); setPaused(true); setI((x) => (x - 1 + qa.length) % qa.length); }
            }}
            aria-label="Questions and answers. Use the arrow keys to browse."
          >
            <div className="pal-search">
              <span className="pal-k mono">⌘K</span>
              <span className="pal-q">{query}<i className="pal-caret" /></span>
              <span className="pal-esc mono">esc</span>
            </div>
            <div className="pal-body">
              <div className="pal-list">
                <p className="mono pal-label">QUESTIONS PEOPLE ACTUALLY ASK</p>
                {qa.map((x, k) => (
                  <button key={x.q} className={`pal-item ${k === i ? 'on' : ''}`} onMouseEnter={() => setI(k)} onFocus={() => setI(k)} onClick={() => { setI(k); setPaused(true); }}>
                    {k === i && <motion.span layoutId="pal-hi" className="pal-hi" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
                    <span className="pal-ic">{x.icon}</span>
                    <span className="pal-text">{x.q}</span>
                    {k === i && <span className="pal-enter">↵</span>}
                  </button>
                ))}
              </div>
              <div className="pal-answer" aria-live="polite">
                <p className="mono pal-label orange">ANSWER · 0{i + 1} / 0{qa.length}</p>
                <AnimatePresence mode="wait">
                  <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
                    <p className="pal-a">{qa[i].a}</p>
                    <p className="hand pal-aside">{qa[i].aside}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
            <div className="pal-foot mono">
              <span>↑ ↓ TO BROWSE · HOVER TO PICK · 06 QUESTIONS</span>
              <span>{paused ? 'PICKED' : 'BROWSING…'}</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────── snapshots ───────── */
const stories = [
  { tag: 'WHERE IT HAPPENS', t: 'Where it happens', d: 'My desk, a second monitor, and far too many open tabs.', note: 'the plant is fake.', bg: '#e7dfd1' },
  { tag: 'HOW MIGHT WE…', t: 'How might we…', d: 'A workshop wall after two hours of sticky notes and strong coffee.', note: 'we did find the answer', bg: '#c9b8ff' },
  { tag: 'HI AGAIN', t: 'Hi again', d: 'That’s me. Usually a lot less serious than this photo.', note: 'promise.', bg: '#f3eee4' },
  { tag: 'SUNDAY WALK', t: 'Sunday walk', d: 'Where most of my “aha” moments quietly show up.', note: 'steps > screens', bg: '#b9d9c3' },
  { tag: 'NOW PLAYING', t: 'Now playing', d: 'Unwinding with a controller after a long week of pixels.', note: 'ask me about my FC squad', bg: '#16130f' },
];
const DUR = 4800;
function Snapshots() {
  const [i, setI] = useState(0);
  const [k, setK] = useState(0); // restarts the progress animation
  const timer = useRef<number>();
  useEffect(() => {
    timer.current = window.setTimeout(() => { setI((x) => (x + 1) % stories.length); setK((x) => x + 1); }, DUR);
    return () => clearTimeout(timer.current);
  }, [i, k]);
  const next = () => { setI((x) => (x + 1) % stories.length); setK((x) => x + 1); };
  const s = stories[i];
  return (
    <section className="section">
      <div className="wrap">
        <SectionHead kicker="SNAPSHOTS" title="Life outside the artboard" word="artboard" sub="A few moments from my camera roll. They play like stories. Tap a photo to skip ahead." />
        <div className="stories">
          <div className="story-stack">
            <span className="story-ghost g2" /><span className="story-ghost g1" />
            <button className="story-card" onClick={next} aria-label="Next story">
              <div className="story-bars">
                {stories.map((_, n) => (
                  <span key={n}>{n < i ? <i style={{ width: '100%' }} /> : n === i ? <i key={k} className="run" style={{ animationDuration: `${DUR}ms` }} /> : null}</span>
                ))}
              </div>
              <AnimatePresence mode="popLayout">
                <motion.div key={i} className="story-photo" initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }}>
                  <Photo src={`/images/snap-${i + 1}.jpg`} alt={s.d} className="story-img" fallback={<span className="story-fallback hand" style={{ color: s.bg === '#16130f' ? '#f3eee4' : '#16130f' }}>{s.t}</span>} style={{ background: s.bg }} />
                </motion.div>
              </AnimatePresence>
              <span className="story-chip mono">0{i + 1} · {s.tag}</span>
            </button>
            <span className="hand story-skip">tap to skip →</span>
          </div>
          <div className="story-text">
            <p className="mono kicker">STORY 0{i + 1} / 0{stories.length}</p>
            <AnimatePresence mode="wait">
              <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
                <h3 className="h-md">{s.t}</h3>
                <p className="lead">{s.d}</p>
                <p className="hand story-note">{s.note}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── how I work ───────── */
const steps = [
  { t: 'Listen', d: 'Talk to people, read the data, and find the real problem.' },
  { t: 'Sketch', d: 'Messy sketches and sticky notes until the idea clicks.' },
  { t: 'Prototype', d: 'Click-through prototypes in Figma to test it early.' },
  { t: 'Ship', d: 'Polish the details with engineers and get it live.' },
];
function HowIWork() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % steps.length), 1700);
    return () => clearInterval(id);
  }, []);
  return (
    <section className="section">
      <div className="wrap">
        <SectionHead kicker="HOW I WORK" title="From sticky note to shipped" word="shipped" sub="Four steps, in this order most days. Watch the flow play through." />
        <div className="flow">
          {steps.map((s, k) => (
            <div key={s.t} className={`flow-step ${k === i ? 'on' : ''} ${k < i ? 'done' : ''}`}>
              {k === i && <motion.span layoutId="flow-tag" className="flow-tag mono" transition={{ type: 'spring', stiffness: 300, damping: 30 }}>▶ {s.t}</motion.span>}
              <div className={`flow-art fa-${k}`}>
                {k === 0 && <><i /><i /><i /></>}
                {k === 1 && <><i /><i /><i /></>}
                {k === 2 && <span className="fa-phone"><i /></span>}
                {k === 3 && <><span className="mono fa-live">LIVE</span><svg width="44" height="34" viewBox="0 0 44 34"><path d="M4 18l12 12L40 4" stroke="#ff5b2e" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg></>}
              </div>
              <p className="mono flow-n">STEP 0{k + 1}</p>
              <h3>{s.t}</h3>
              <p className="flow-d">{s.d}</p>
              {k < steps.length - 1 && <span className="flow-arrow" aria-hidden />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── toolbox ───────── */
const tools: { n: string; cat: 'DESIGN' | 'BUILD' | 'TALK'; m: [number, number, number] }[] = [
  { n: 'Figma', cat: 'DESIGN', m: [5, 10, -8] }, { n: 'Framer', cat: 'DESIGN', m: [26, 6, 6] }, { n: 'Rive', cat: 'DESIGN', m: [44, 22, 7] }, { n: 'LottieFiles', cat: 'DESIGN', m: [62, 4, -5] }, { n: 'Maze', cat: 'DESIGN', m: [82, 20, 9] },
  { n: 'ProtoPie', cat: 'BUILD', m: [12, 40, -6] }, { n: 'Claude', cat: 'BUILD', m: [32, 48, 5] }, { n: 'Spline', cat: 'BUILD', m: [53, 42, -7] }, { n: 'Jitter', cat: 'BUILD', m: [70, 54, 8] },
  { n: 'Notion', cat: 'TALK', m: [6, 74, 4] }, { n: 'Slack', cat: 'TALK', m: [36, 82, 8] }, { n: 'Miro', cat: 'TALK', m: [58, 76, -6] },
];
const catColor = { DESIGN: 'var(--orange)', BUILD: 'var(--lilac)', TALK: 'var(--white)' };
function Toolbox() {
  const mobile = useIsMobile();
  const [sorted, setSorted] = useState(false);
  const chip = (t: (typeof tools)[number], messy: boolean) => (
    <motion.span
      key={t.n}
      layoutId={`tool-${t.n}`}
      className="tool"
      style={{ background: catColor[t.cat], ...(messy ? { position: 'absolute', left: `${mobile ? 5 + ((tools.indexOf(t) % 2) * 44) + ((tools.indexOf(t) * 7) % 9) : t.m[0]}%`, top: `${mobile ? 4 + Math.floor(tools.indexOf(t) / 2) * 14.5 : t.m[1]}%` } : {}) }}
      animate={{ rotate: messy ? t.m[2] : 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <i>{t.n[0]}</i>{t.n}
    </motion.span>
  );
  return (
    <section className="section">
      <div className="wrap">
        <SectionHead kicker="WHAT’S IN THE TOOLBOX" title="Thrown in the toolbox" word="toolbox" sub={mobile ? 'Tossed in a pile, as usual. Tap the box to tidy it up.' : 'Tossed in a pile, as usual. Hover the box and watch them tidy themselves up.'} />
        <LayoutGroup>
          <div
            className={`toolbox ${sorted ? 'is-sorted' : ''}`}
            onMouseEnter={() => !mobile && setSorted(true)}
            onMouseLeave={() => !mobile && setSorted(false)}
            onClick={() => mobile && setSorted((s) => !s)}
            role={mobile ? 'button' : undefined}
            aria-pressed={mobile ? sorted : undefined}
          >
            {sorted ? (
              <div className="tb-sorted">
                {(['DESIGN', 'BUILD', 'TALK'] as const).map((c) => (
                  <div key={c} className="tb-row">
                    <motion.span className="mono tb-cat" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{c}</motion.span>
                    <div className="tb-chips">{tools.filter((t) => t.cat === c).map((t) => chip(t, false))}</div>
                  </div>
                ))}
              </div>
            ) : (
              tools.map((t) => chip(t, true))
            )}
            <span className="hand tb-note">{sorted ? 'ahh, much better.' : mobile ? '(it’s a mess. tap to tidy)' : '(it’s a mess, i know)'}</span>
          </div>
        </LayoutGroup>
      </div>
    </section>
  );
}

export default function About() {
  return (
    <>
      <AboutHero />
      <AskMe />
      <Snapshots />
      <HowIWork />
      <Toolbox />
      <WhereToNext />
    </>
  );
}
