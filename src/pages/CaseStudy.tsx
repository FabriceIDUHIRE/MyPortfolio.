import { useEffect, useState, type ReactNode } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { caseBySlug, caseTitle, cases, nextCase } from '../content/cases';
import { Reveal, Roller } from '../components/bits';
import { Cover, BeforeAfter } from '../components/Visuals';
import Folder from '../components/Folder';
import { useIsMobile } from '../useIsMobile';
import './case.css';

const chapters = ['The problem', 'The stakes', 'Research', 'The idea', 'The result', 'Impact', 'Takeaways'];

function Chapter({ n, id, children }: { n: number; id: string; children: ReactNode }) {
  return (
    <section className="chapter" id={id}>
      <div className="wrap chapter-inner">
        <Reveal className="chapter-num">
          <span className="chapter-n">0{n}</span>
          <span className="mono chapter-l">{chapters[n - 1].toUpperCase()}</span>
        </Reveal>
        <div className="chapter-body">{children}</div>
      </div>
    </section>
  );
}

function Impact({ items }: { items: { value: number; unit: string; label: string; decimals?: number }[] }) {
  const [run, setRun] = useState(0);
  return (
    <motion.div className="impact" onMouseEnter={() => setRun((r) => r + 1)} onClick={() => setRun((r) => r + 1)} onViewportEnter={() => setRun((r) => (r === 0 ? 1 : r))} viewport={{ once: true, margin: '-100px' }}>
      {items.map((it, i) => (
        <div key={it.label} className={`impact-card ${i === 0 ? 'hot' : ''}`}>
          <span className="impact-v">
            {run > 0 ? <Roller value={it.value} step={it.decimals ? 0.4 : it.value > 20 ? 5 : 1} decimals={it.decimals} run={run} duration={1.2} /> : <span>0</span>}
            <em>{it.unit}</em>
          </span>
          <span className="mono impact-l">{it.label}</span>
        </div>
      ))}
    </motion.div>
  );
}

export default function CaseStudyPage() {
  const { slug = '' } = useParams();
  const c = caseBySlug(slug);
  const mobile = useIsMobile();
  const [after, setAfter] = useState(false);
  const [active, setActive] = useState(0);
  const [showBar, setShowBar] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  useEffect(() => {
    if (c) document.title = `${caseTitle(c)} · Fabrice Iduhire`;
    setAfter(false);
  }, [c]);
  useEffect(() => {
    const els = chapters.map((_, i) => document.getElementById(`ch-${i + 1}`)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(Number(e.target.id.split('-')[1]) - 1); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    els.forEach((el) => io.observe(el));
    const on = () => {
      const a = document.getElementById('ch-1');
      const n = document.querySelector('.next-case');
      if (!a || !n) return;
      setShowBar(a.getBoundingClientRect().top < window.innerHeight * 0.7 && n.getBoundingClientRect().top > window.innerHeight * 0.7);
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => { io.disconnect(); window.removeEventListener('scroll', on); };
  }, [slug]);

  if (!c) return <Navigate to="/" replace />;
  const nx = nextCase(c.slug);
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <article className="case">
      <motion.div className="case-progress" style={{ scaleX: progress }} />

      <header className="case-hero" id="case-top">
        <div className="wrap">
          <div className="case-crumbs">
            <Link to="/#work" className="crumb-back">←  All work</Link>
            <span className="crumb-sep">/</span>
            <span className="crumb-file mono"><i style={{ background: c.color }} />{c.file}</span>
            <span className="crumb-count mono">CASE STUDY 0{c.index} / 0{cases.length}</span>
          </div>
          <div className="case-hero-grid">
            <div>
              <motion.h1 className="h-xl case-title" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
                {c.title[0]} <span className="it">{c.title[1]}</span> {c.title[2]}
              </motion.h1>
              <motion.p className="lead case-intro" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>{c.intro}</motion.p>
              <motion.div className="case-chips" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                {c.heroChips.map((t, i) => <span key={t} className={`hchip ${i === 0 ? 'dark' : ''}`}>{t}</span>)}
              </motion.div>
            </div>
            <motion.aside className="props" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <div className="props-head"><b>Properties</b><span className="mono">{c.file}</span></div>
              {[['Client', c.client], ['Year', c.year], ['My role', c.role], ['Team', c.team], ['Timeline', c.timeline], ['Platform', c.platform]].map(([k, v]) => (
                <p key={k}><span>{k}</span><b>{v}</b></p>
              ))}
              <div className="props-tags">{c.tags.map((t, i) => <span key={t} className={`t${i}`}>{t}</span>)}</div>
            </motion.aside>
          </div>
          <Reveal className="case-cover">
            <span className="mono cover-name">{c.slug}-flow.png</span>
            <Cover slug={c.slug} />
          </Reveal>
        </div>
      </header>

      <Chapter n={1} id="ch-1">
        <Reveal><h2 className="h-md">{c.problem.title}</h2><p className="lead">{c.problem.body}</p></Reveal>
        <div className="steps-row">
          {c.problem.steps.map((s, i) => (
            <motion.span key={s} className="step-wrap" initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 + i * 0.18 }}>
              <span className={`step-chip ${i === c.problem.steps.length - 1 ? 'last' : ''}`}>{s}</span>
              {i < c.problem.steps.length - 1 && <em aria-hidden>→</em>}
            </motion.span>
          ))}
        </div>
        <p className="hand aside">{c.problem.aside}</p>
      </Chapter>

      <Chapter n={2} id="ch-2">
        <Reveal><h2 className="h-md">{c.stakes.title}</h2><p className="lead">{c.stakes.body}</p></Reveal>
        <div className="stakes">
          {c.stakes.items.map((s, i) => (
            <Reveal key={s.wrong} delay={i * 0.1} className="stake">
              <p className="mono stake-k red">WHAT WENT WRONG</p>
              <h3>{s.wrong}</h3>
              <p className="mono stake-k">→  DESIGN RESPONSE</p>
              <p className="stake-r">{s.response}</p>
            </Reveal>
          ))}
        </div>
      </Chapter>

      <Chapter n={3} id="ch-3">
        <Reveal><h2 className="h-md">{c.research.title}</h2><p className="lead">{c.research.body}</p></Reveal>
        <div className="rstats">
          {c.research.stats.map(([v, l], i) => (
            <Reveal key={l} delay={i * 0.08} className="rstat"><b>{v}</b><span className="mono">{l}</span></Reveal>
          ))}
        </div>
        <div className="rquote-row">
          <Reveal className="rquote"><p>{c.research.quote}</p><span>{c.research.quoteBy}</span></Reveal>
          <motion.div className="insight-note" initial={{ opacity: 0, rotate: 0, y: 30 }} whileInView={{ opacity: 1, rotate: -2, y: 0 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 160, damping: 12, delay: 0.2 }}>
            <span className="mono">KEY INSIGHT</span>
            <p className="hand">{c.research.insight}</p>
          </motion.div>
        </div>
      </Chapter>

      <Chapter n={4} id="ch-4">
        <Reveal><h2 className="h-md">{c.idea.title}</h2><p className="lead">{c.idea.body}</p></Reveal>
        <div className="idea-steps">
          {c.idea.steps.map((s, i) => (
            <Reveal key={s.t} delay={i * 0.12} className={`idea-step is-${i}`}>
              <span className="mono">0{i + 1}</span>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
              {i < 3 && <i className="idea-arrow" aria-hidden />}
            </Reveal>
          ))}
        </div>
        <p className="hand aside dark">{c.idea.aside}</p>
      </Chapter>

      <Chapter n={5} id="ch-5">
        <Reveal><h2 className="h-md">{c.result.title}</h2><p className="lead">{c.result.body}</p></Reveal>
        <div className="ba">
          <div className="ba-top">
            <div className="ba-toggle" role="tablist" aria-label="Before or after">
              {(['Before', 'After'] as const).map((l) => {
                const on = (l === 'After') === after;
                return (
                  <button key={l} role="tab" aria-selected={on} className={on ? 'on' : ''} onClick={() => setAfter(l === 'After')}>
                    {on && <motion.span layoutId="ba-pill" className="ba-pill" transition={{ type: 'spring', stiffness: 500, damping: 36 }} />}
                    <span className="ba-t">{l}</span>
                  </button>
                );
              })}
            </div>
            <span className="hand ba-hint">{mobile ? 'tap to compare' : 'click to compare'}</span>
          </div>
          <div className={`ba-stage ${after ? 'is-after' : ''}`} onClick={() => setAfter((a) => !a)}>
            <AnimatePresence mode="wait">
              <motion.div key={String(after)} className="ba-visual" initial={{ opacity: 0, x: after ? 40 : -40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: after ? -40 : 40 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                <BeforeAfter slug={c.slug} after={after} />
              </motion.div>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.p key={String(after)} className={`hand ba-caption ${after ? 'good' : ''}`} initial={{ opacity: 0, rotate: -6, y: 10 }} animate={{ opacity: 1, rotate: -3, y: 0 }} exit={{ opacity: 0 }}>
                {(after ? c.result.after : c.result.before).split(' · ').map((x, i, a) => <span key={i}>{x}{i < a.length - 1 ? ' ·' : ''} </span>)}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </Chapter>

      <Chapter n={6} id="ch-6">
        <Reveal><h2 className="h-md">{c.impact.title}</h2><p className="lead">{c.impact.body}</p></Reveal>
        <Impact items={c.impact.items} />
        <p className="impact-src">{c.impact.source}</p>
      </Chapter>

      <Chapter n={7} id="ch-7">
        <Reveal><h2 className="h-md">What I’m taking to the next project.</h2></Reveal>
        <ol className="takeaways">
          {c.takeaways.items.map((t, i) => (
            <Reveal key={t} delay={i * 0.08}><li><span className="mono">0{i + 1}</span>{t}</li></Reveal>
          ))}
        </ol>
        <Reveal><blockquote className="case-quote">{c.takeaways.quote}</blockquote></Reveal>
      </Chapter>

      <section className="section next-case">
        <div className="wrap next-inner">
          <span className="kicker">{nx.index === 1 ? '{ BACK TO THE FIRST ONE }' : '{ NEXT CASE STUDY }'}</span>
          <h2 className="h-md next-title">{nx.title[0]} <span className="it">{nx.title[1]}</span> {nx.title[2]}</h2>
          <motion.div className="next-folder" whileHover={{ rotate: -1, y: -6 }}><Folder c={nx} compact={mobile} /></motion.div>
          <div className="next-links">
            <Link to="/#work" className="btn btn-ghost">←  All work</Link>
            <Link to={`/work/${nx.slug}`} className="btn btn-dark">Read next  →</Link>
          </div>
        </div>
      </section>

      <nav className={`contents ${showBar ? 'show' : ''}`} aria-label="Chapters">
        <span className="mono contents-l">CONTENTS</span>
        {chapters.map((ch, i) => (
          <button key={ch} className={active === i ? 'on' : ''} onClick={() => go(`ch-${i + 1}`)} title={ch}>
            {active === i && <motion.span layoutId="contents-pill" className="contents-pill" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
            <span className="mono contents-t">0{i + 1}</span>
          </button>
        ))}
        <button className="contents-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑ Top</button>
      </nav>
    </article>
  );
}
