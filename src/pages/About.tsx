import { useEffect, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { links, isExternal } from '../content/site';
import { Bricks } from './Home';
import { Cursor, Photo, Reveal, SectionHead, Stage } from '../components/bits';
import WhereToNext from '../components/WhereToNext';
import { useIsMobile } from '../useIsMobile';
import './about.css';

/* ───────── hero ───────── */
function HeroButtons() {
  const [st, setSt] = useState<'idle' | 'book' | 'res'>('idle');
  const [ab, setAb] = useState(0);
  useEffect(() => {
    if (st !== 'idle') return;
    const id = setInterval(() => setAb((x) => 1 - x), 1200);
    return () => clearInterval(id);
  }, [st]);
  const pos = { idle: ab ? [136, 34] : [150, 46], book: [96, 20], res: [262, 38] }[st];
  const label = { idle: 'you, about to click', book: 'yes! that one', res: 'one page, promise' }[st];
  return (
    <div className="ab-btns">
      <a href={links.book} target={isExternal(links.book) ? '_blank' : undefined} rel="noreferrer" className={`btn cta-book ${st === 'book' ? 'on' : ''}`} onMouseEnter={() => setSt('book')} onMouseLeave={() => setSt('idle')}>{st === 'book' ? 'Pick a time  ↗' : 'Book a 30-min call'}</a>
      <a href={links.resume} target={isExternal(links.resume) ? '_blank' : undefined} rel="noreferrer" className={`btn cta-work ${st === 'res' ? 'on' : ''}`} onMouseEnter={() => setSt('res')} onMouseLeave={() => setSt('idle')}>Resume <span className="cta-arrow">↓</span></a>
      <motion.div className="cta-you" animate={{ x: pos[0], y: pos[1] }} transition={{ duration: st === 'idle' ? 0.9 : 0.45, ease: 'easeInOut' }}><Cursor label={label} /></motion.div>
    </div>
  );
}
const layers = [
  { icon: '◇', label: 'Product designer', hint: 'SINCE 2019' },
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
            <HeroButtons />
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
    const id = setInterval(() => setI((x) => (x + 1) % qa.length), 3250);
    return () => clearInterval(id);
  }, [paused]);
  const query = useTyped(qa[i].q.toLowerCase().replace('?', ''));
  return (
    <section className="section" id="ask">
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
  { tag: 'WHERE IT HAPPENS', t: 'Where it happens', d: 'My desk, a second monitor, and far too many open tabs.', note: 'the plant is fake.' },
  { tag: 'HOW MIGHT WE…', t: 'How might we…', d: 'A workshop wall after two hours of sticky notes and strong coffee.', note: 'we did find the answer' },
  { tag: 'HI AGAIN', t: 'Hi again', d: 'That’s me. Usually a lot less serious than this photo.', note: 'promise.' },
  { tag: 'SUNDAY WALK', t: 'Sunday walk', d: 'Where most of my “aha” moments quietly show up.', note: 'steps > screens' },
  { tag: 'NOW PLAYING', t: 'Now playing', d: 'Unwinding with a controller after a long week of pixels.', note: 'ask me about my FC squad' },
];
const FILL = 2600;
const depthRot = [0, 4, -3, 4, -3];
function Snapshots() {
  const mobile = useIsMobile();
  const [i, setI] = useState(0);          // current story (5 = all seen, about to reset)
  const [run, setRun] = useState(0);      // restarts the progress bar
  useEffect(() => {
    const t = window.setTimeout(() => {
      setI((x) => (x >= stories.length ? 0 : x + 1));
      setRun((r) => r + 1);
    }, i === stories.length ? 1000 : FILL + 50);
    return () => clearTimeout(t);
  }, [i, run]);
  const skip = () => {
    if (i >= stories.length - 1) { setI(0); } else { setI(i + 1); }
    setRun((r) => r + 1);
  };
  const cur = Math.min(i, stories.length - 1);
  const s = stories[cur];
  // geometry (desktop stage 1384×660, mobile stage 440×760)
  const G = mobile
    ? { card: [300, 390], top: [70, 40], step: [12, 9], pile: [8, 470], seg: [86, 20, 300] }
    : { card: [400, 520], top: [440, 70], step: [20, 12], pile: [50, 300], seg: [456, 40, 368] };
  const segW = (G.seg[2] - 4 * 6) / 5;
  return (
    <section className="section">
      <div className="wrap">
        <SectionHead kicker="SNAPSHOTS" title="Life outside the artboard" word="artboard" sub={mobile ? 'A few moments from my camera roll. They play like stories. Tap a photo to skip ahead.' : 'A few moments from my camera roll. They play like stories. Click a photo to skip ahead.'} />
        <Stage w={mobile ? 440 : 1384} h={mobile ? 700 : 660} max={mobile ? 1.3 : 1}>
          <div className="snap">
            {!mobile && <motion.span className="hand snap-seen" style={{ left: G.pile[0] + 40, top: G.pile[1] + (mobile ? 170 : 300) }} animate={{ opacity: i > 0 ? 1 : 0.3, rotate: 4 }}>seen it</motion.span>}
            {stories.map((st, k) => {
              const seen = k < i;
              const d = k - i;
              const order = seen ? k : 0;
              const pos = seen
                ? (mobile ? { x: -360, y: 120, rotate: -16, scale: 0.6, opacity: 0 } : { x: G.pile[0] + order * 8, y: G.pile[1] - order * 6, rotate: -10 + order * 4, scale: 0.5, opacity: 1 })
                : { x: G.top[0] + d * G.step[0], y: G.top[1] + d * G.step[1], rotate: depthRot[d] ?? 0, scale: 1, opacity: 1 };
              return (
                <motion.button
                  key={k}
                  className="snap-card"
                  style={{ width: G.card[0], height: G.card[1], zIndex: seen ? 20 + k : 10 - d, originX: 0, originY: 0 }}
                  initial={false}
                  animate={pos}
                  transition={i === 0 && run > 0 ? { type: 'spring', stiffness: 220, damping: 14 } : { duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  onClick={skip}
                  aria-label={`Story ${k + 1}: ${st.t}. Next story`}
                  tabIndex={k === cur ? 0 : -1}
                >
                  <Photo src={`/images/snap-${k + 1}.jpg`} alt={st.d} className="snap-img" fallback={<span className="hand snap-fb">{st.t}</span>} />
                  <span className="mono snap-chip">0{k + 1} · {st.tag}</span>
                </motion.button>
              );
            })}
            {stories.map((_, k) => (
              <span key={k} className="snap-seg" style={{ left: G.seg[0] + k * (segW + 6), top: G.seg[1], width: segW }}>
                {k < i || i === stories.length ? <i style={{ width: '100%' }} /> : k === i ? <i key={run} className="run" style={{ animationDuration: `${FILL}ms` }} /> : null}
              </span>
            ))}
            <span className="hand snap-skip" style={mobile ? { left: 250, top: 452 } : { left: 690, top: 620 }}>{mobile ? 'tap to skip →' : 'click to skip →'}</span>
            <div className="snap-text" style={mobile ? { left: 20, top: 500, width: 400 } : { left: 960, top: 170, width: 424 }}>
              <p className="mono kicker">STORY 0{cur + 1} / 0{stories.length}</p>
              <AnimatePresence mode="wait">
                <motion.div key={cur} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
                  <h3 className="snap-title">{s.t}</h3>
                  <p className="snap-desc">{s.d}</p>
                  <p className="hand snap-note">{s.note}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Stage>
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
    const id = setTimeout(() => setI((x) => (x + 1) % steps.length), i === steps.length - 1 ? 2100 : 1400);
    return () => clearTimeout(id);
  }, [i]);
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
      <Bricks />
      <Toolbox />
      <WhereToNext />
    </>
  );
}
