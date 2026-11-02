import { useState } from 'react';
import { motion } from 'framer-motion';
import { experiments, ExperimentCard, type Category } from '../components/Experiments';
import { SectionHead } from '../components/bits';
import WhereToNext from '../components/WhereToNext';
import './playground.css';

const filters: ('All' | Category)[] = ['All', 'Apps', 'Motion', 'Tools', 'Fun'];

function Stickers() {
  const s = [
    { cls: 'stk-burst', txt: <>12<br />experiments</>, x: 0, r: -12, d: 0.3 },
    { cls: 'stk-lilac', txt: <>made<br />for fun</>, x: 1, r: 8, d: 0.45 },
    { cls: 'stk-ink', txt: <>0<br />regrets</>, x: 2, r: -6, d: 0.6 },
  ];
  return (
    <div className="stickers" aria-hidden>
      {s.map((k) => (
        <motion.div key={k.cls} className={`stk ${k.cls}`} initial={{ y: -260, opacity: 0, rotate: 0 }} animate={{ y: 0, opacity: 1, rotate: k.r }} transition={{ type: 'spring', stiffness: 180, damping: 11, delay: k.d }} whileHover={{ scale: 1.1, rotate: k.r + 14 }} drag dragSnapToOrigin dragElastic={0.6}>
          <span>{k.txt}</span>
        </motion.div>
      ))}
      <motion.p className="hand stk-note" initial={{ opacity: 0 }} animate={{ opacity: 1, rotate: -6 }} transition={{ delay: 1.1 }}>(ok, maybe one)</motion.p>
    </div>
  );
}

export default function Playground() {
  const [f, setF] = useState<'All' | Category>('All');
  const ordered = f === 'All' ? experiments : [...experiments.filter((e) => e.cat === f), ...experiments.filter((e) => e.cat !== f)];
  const count = (c: 'All' | Category) => (c === 'All' ? experiments.length : experiments.filter((e) => e.cat === c).length);
  return (
    <>
      <section className="pg-hero grid-bg">
        <div className="wrap pg-hero-inner">
          <div>
            <motion.p className="mono pg-kicker" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>PLAYGROUND · SIDE QUESTS &amp; 2AM IDEAS</motion.p>
            <motion.h1 className="h-xl" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
              Built just to see<br />if it <span className="it">works</span>.
            </motion.h1>
            <motion.p className="lead pg-lead" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              Design experiments, tiny tools and things I made because I wanted to know if they’d work. Some are useful. Most are just fun. All of them taught me something.
            </motion.p>
            <motion.p className="pg-pill" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <span className="mono">⌘K</span> 12 pieces · hover to play, pick a page to filter
            </motion.p>
          </div>
          <Stickers />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionHead kicker="EXPERIMENTS" title="Twelve tiny side quests" word="side quests" sub="Organised like a Figma file, because of course. Pick a page to filter. Hover (or tap) any frame to play with it." />
          <div className="ws">
            <aside className="ws-side">
              <div className="ws-pages">
                <div className="ws-pages-head"><b>Pages</b><span className="mono">playground.fig</span></div>
                {filters.map((c) => (
                  <button key={c} className={`ws-page ${f === c ? 'on' : ''}`} onClick={() => setF(c)} aria-pressed={f === c}>
                    {f === c && <motion.span layoutId="ws-hi" className="ws-hi" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
                    <span className="ws-page-t">· {c === 'All' ? 'All experiments' : c}</span>
                    <span className="mono ws-page-n">{String(count(c)).padStart(2, '0')}</span>
                  </button>
                ))}
                <p className="hand ws-hint">pick a page to<br />filter the frames →</p>
              </div>
              <div className="ws-sticky hand">more coming<br />soon, probably.</div>
            </aside>
            <div className="ws-main">
              <div className="ws-bar mono">
                <span>{f === 'All' ? '12 OF 12 FRAMES · ALL' : `${String(count(f)).padStart(2, '0')} OF 12 FRAMES · ${f.toUpperCase()}`}</span>
                <span className="ws-bar-r">HOVER TO PLAY</span>
              </div>
              <div className="ws-grid">
                {ordered.map((e) => (
                  <motion.div key={e.name} layout transition={{ type: 'spring', stiffness: 220, damping: 26 }}>
                    <ExperimentCard exp={e} dim={f !== 'All' && e.cat !== f} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <WhereToNext />
    </>
  );
}
