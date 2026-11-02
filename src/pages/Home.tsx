import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { cases } from '../content/cases';
import { site, mailto } from '../content/site';
import { Cursor, Reveal, SectionHead } from '../components/bits';
import Folder from '../components/Folder';
import WhereToNext from '../components/WhereToNext';
import { experiments, ExperimentCard } from '../components/Experiments';
import { useIsMobile } from '../useIsMobile';
import './home.css';

const words = ['Loved', 'Useful', 'Shipped'];

function Hero() {
  const [w, setW] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setW((x) => (x + 1) % words.length), 2400);
    return () => clearInterval(id);
  }, []);
  return (
    <section className="hero grid-bg">
      <div className="wrap hero-inner">
        <motion.p className="mono hero-kicker" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          PRODUCT DESIGNER · OPEN TO NEW ROLES
        </motion.p>

        <motion.div className="hero-select" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
          <span className="sel-name mono">Headline</span>
          <i className="h tl" /><i className="h tr" /><i className="h bl" /><i className="h br" />
          <h1 className="hero-h1">
            Messy ideas in.
            <br />
            <motion.span className="hero-swap" layout transition={{ layout: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={words[w]} className="it" initial={{ y: '60%', opacity: 0, rotate: 4 }} animate={{ y: 0, opacity: 1, rotate: 0 }} exit={{ y: '-60%', opacity: 0, rotate: -4 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
                  {words[w]}
                </motion.span>
              </AnimatePresence>
            </motion.span>{' '}
            <motion.span layout style={{ display: 'inline-block' }} transition={{ layout: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}>products out.</motion.span>
          </h1>
          <span className="sel-size mono">W × Hug</span>
        </motion.div>

        <motion.div className="hero-note hand" initial={{ opacity: 0, rotate: 0, y: -30 }} animate={{ opacity: 1, rotate: 6, y: 0 }} transition={{ delay: 0.6, type: 'spring', stiffness: 200, damping: 12 }} whileHover={{ rotate: -3, scale: 1.05 }}>
          note to self:<br />hire this<br />person!!
          <small>(seriously)</small>
        </motion.div>

        <motion.div className="hero-comment" initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.5 }}>
          <span className="hc-av">FI</span>
          <div>
            <p className="hc-top"><b>Fabrice</b> <span>just now</span></p>
            <p className="hc-msg">Things I get pulled into: product design, design systems, research &amp; prototyping. Ask me about any of them!</p>
          </div>
        </motion.div>

        <motion.div className="recruiter" aria-hidden initial={{ x: 0, y: 0 }} animate={{ x: [0, -380, -560, -200, 0], y: [0, 60, 150, 90, 0] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}>
          <Cursor label="Recruiter" color="lilac" />
        </motion.div>

        <div className="hero-bottom">
          <motion.p className="lead hero-lead" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            I’m a product designer who takes tangled problems and turns them into products people actually enjoy using, then helps ship them.
          </motion.p>
          <motion.div className="hero-ctas" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
            <a className="btn btn-dark" href={site.bookCall || mailto} target={site.bookCall ? '_blank' : undefined} rel="noreferrer">
              {site.bookCall ? 'Book a 30-min call' : 'Say hello'}
            </a>
            <a className="btn btn-ghost" href="#work">See the work ↓</a>
            <Cursor label="you, about to click" className="hero-you" />
          </motion.div>
        </div>
        <a href="#work" className="hero-scroll mono">04 FILES · KEEP SCROLLING <span>↓</span></a>
      </div>
    </section>
  );
}

const pile = [
  { x: 14, y: 46, r: 1.5 },
  { x: -34, y: 18, r: -4 },
  { x: 34, y: -8, r: 4.5 },
  { x: -46, y: 30, r: -8 },
];
const spread = [
  { x: -300, y: -190, r: -2 },
  { x: 300, y: -190, r: 2 },
  { x: -300, y: 200, r: 1.5 },
  { x: 300, y: 200, r: -1.5 },
];

function SelectedWork() {
  const mobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [k, setK] = useState(1);
  useEffect(() => {
    const on = () => {
      const w = Math.min(window.innerWidth, 1512) - 128;
      setK(Math.max(0.55, Math.min(1, (w - 560) / 620)));
    };
    on();
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  return (
    <section className="section" id="work">
      <div className="wrap">
        <SectionHead kicker="SELECTED WORK · 04 FILES" title="Selected work" word="work" sub="A few projects I’m proud of. Open a folder to see how the thinking went." />
        {mobile ? (
          <div className="work-list">
            {cases.map((c, i) => (
              <Reveal key={c.slug} delay={i * 0.05} style={{ transform: `rotate(${i % 2 ? 1 : -1}deg)` }}>
                <Folder c={c} compact />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="pile" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} onFocus={() => setOpen(true)}>
            <p className="pile-caption mono">{open ? '04 FILES · SPREAD OUT' : '04 FILES · NEATLY PILED'}</p>
            {[...cases].reverse().map((c) => {
              const i = c.index - 1;
              const p = open ? { ...spread[i], x: spread[i].x * k, y: spread[i].y } : pile[i];
              return (
                <motion.div key={c.slug} className="pile-item" style={{ zIndex: open ? 10 - i : 10 - i, scale: k < 0.8 ? 0.82 : 1 }} animate={{ x: p.x, y: p.y, rotate: p.r }} transition={{ type: 'spring', stiffness: 170, damping: 19, delay: open ? i * 0.04 : (3 - i) * 0.03 }}>
                  <Folder c={c} />
                </motion.div>
              );
            })}
            <AnimatePresence>
              {!open && (
                <motion.div className="pile-hint hand" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  four files, one messy pile.<br />hover to spread them out!
                  <svg width="60" height="28" viewBox="0 0 60 28" fill="none"><path d="M58 4C40 2 22 8 6 22" stroke="#16130f" strokeWidth="2" strokeLinecap="round" /><path d="M5 12l1 11 10-2" stroke="#16130f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}

function WorkOn() {
  const items = [
    { n: '01', t: 'Complex products', d: 'I make products with lots of moving parts feel simple to understand and use.', art: <ArtMessy /> },
    { n: '02', t: 'Design systems', d: 'I help teams build products that feel consistent, without solving the same problem twice.', art: <ArtSystem /> },
    { n: '03', t: 'Interaction design', d: 'I design every hover, tap and transition, so the finished product feels the way it was designed.', art: <ArtMotion /> },
    { n: '04', t: 'Figuring out what to build', d: 'When the problem isn’t clear yet, I help teams work out what people need, and what to build.', art: <ArtNotes /> },
  ];
  return (
    <section className="section">
      <div className="wrap">
        <SectionHead kicker="WHAT I WORK ON" title="Problems I love getting pulled into" word="love" sub="Four kinds of problems I get pulled into, and the ones I go looking for." />
      </div>
      <div className="wrap workon-scroller">
        <div className="workon">
          {items.map((it, i) => (
            <Reveal key={it.n} delay={i * 0.08} className="workon-item">
              <span className="mono workon-n"># {it.n} {it.t}</span>
              <div className="workon-card">
                <div className="workon-art">{it.art}</div>
                <h3>{it.t}</h3>
                <p>{it.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      <p className="mono swipe-hint wrap">SWIPE FOR MORE →</p>
    </section>
  );
}
function ArtMessy() {
  return (
    <div className="art art-messy">
      <svg viewBox="0 0 240 150" className="messy-svg" aria-hidden>
        <path className="scribble" d="M20 80 C 40 20, 60 140, 80 70 S 120 30, 100 110 S 60 90, 130 60 S 150 120, 150 75" stroke="#16130f" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path className="straight" d="M20 75 L 150 75" stroke="#16130f" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M165 75 h40" stroke="#16130f" strokeWidth="3" strokeLinecap="round" /><circle cx="212" cy="75" r="7" fill="#16130f" />
      </svg>
      <span className="hand art-l1">messy</span><span className="hand art-l2">clear!</span>
    </div>
  );
}
function ArtSystem() {
  return (
    <div className="art art-system">
      {Array.from({ length: 9 }).map((_, i) => <i key={i} className={i === 4 ? 'core' : ''} style={{ transitionDelay: `${[2, 1, 2, 1, 0, 1, 2, 1, 2][i] * 60}ms` }}>{i === 4 ? '◇' : ''}</i>)}
    </div>
  );
}
function ArtMotion() {
  return (
    <div className="art art-motion">
      <span className="mono am-l">FIGMA</span><span className="mono am-r">MOTION</span>
      <span className="am-btn">Button</span>
      <pre className="mono am-code">{'on tap:\n  squish 0.96\n  bounce back'}</pre>
    </div>
  );
}
function ArtNotes() {
  return (
    <div className="art art-notes">
      <span className="hand n1">why?</span><span className="hand n2">users?</span><span className="hand n3">MVP</span><span className="hand n4">this one!</span>
    </div>
  );
}

function PlaygroundTeaser() {
  const picks = [0, 3, 6, 10, 9].map((i) => experiments[i]);
  const tilt = [-4, 3, -2, 4, -3];
  const lift = [30, 0, 40, 10, 50];
  return (
    <section className="section pg-teaser">
      <div className="wrap">
        <SectionHead kicker="PLAYGROUND" title="Built just to see if it works" word="works" sub="Side quests, design experiments and tiny tools. Some are useful. Most are just fun.">
          <Link to="/playground" className="btn btn-ghost" style={{ marginTop: 20 }}>See all 12 experiments →</Link>
        </SectionHead>
      </div>
      <div className="wrap pg-scroller">
        <div className="pg-row">
          {picks.map((e, i) => (
            <motion.div key={e.name} className="pg-polaroid" style={{ marginTop: lift[i] }} initial={{ opacity: 0, y: 40, rotate: 0 }} whileInView={{ opacity: 1, y: 0, rotate: tilt[i] }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 120, damping: 14, delay: i * 0.07 }} whileHover={{ rotate: 0, y: -10, zIndex: 5 }}>
              <span className="tape" />
              <ExperimentCard exp={e} showFrameLabel={false} />
            </motion.div>
          ))}
        </div>
        <motion.div className="pg-burst" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 220, damping: 10, delay: 0.5 }}>
          <i className="pg-burst-star" />
          <span>12 &amp;<br />counting</span>
        </motion.div>
        <p className="pg-note hand">most of these are useless.<br />all of them were fun.</p>
      </div>
      <p className="mono swipe-hint wrap">SWIPE FOR MORE →</p>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <SelectedWork />
      <WorkOn />
      <PlaygroundTeaser />
      <WhereToNext />
    </>
  );
}
