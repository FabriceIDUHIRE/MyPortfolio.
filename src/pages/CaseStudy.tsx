import { useEffect, useState, type ReactNode } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { caseBySlug, cases, nextCase } from '../content/cases';
import { Reveal } from '../components/bits';
import { Cover, BeforeAfter } from '../components/Visuals';
import Folder from '../components/Folder';
import './case.css';

const chapters = ['The problem', 'The stakes', 'The insight', 'The idea', 'The result', 'Takeaways'];

function Chapter({ n, label, id, children }: { n: number; label: string; id: string; children: ReactNode }) {
  return (
    <section className="chapter" id={id}>
      <div className="wrap chapter-inner">
        <Reveal className="chapter-num">
          <span className="chapter-n">0{n}</span>
          <span className="mono chapter-l">{label.toUpperCase()}</span>
        </Reveal>
        <div className="chapter-body">{children}</div>
      </div>
    </section>
  );
}

export default function CaseStudyPage() {
  const { slug = '' } = useParams();
  const c = caseBySlug(slug);
  const [after, setAfter] = useState(true);
  const [active, setActive] = useState(0);
  const [showBar, setShowBar] = useState(false);
  useEffect(() => {
    const on = () => {
      const a = document.getElementById('ch-1');
      const n = document.querySelector('.next-case');
      if (!a || !n) return;
      setShowBar(a.getBoundingClientRect().top < window.innerHeight * 0.6 && n.getBoundingClientRect().top > window.innerHeight * 0.8);
    };
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, [slug]);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  useEffect(() => {
    if (c) document.title = `${c.title.join(' ')} · Fabrice Iduhire`;
    setAfter(true);
  }, [c]);
  useEffect(() => {
    const els = chapters.map((_, i) => document.getElementById(`ch-${i + 1}`)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(Number(e.target.id.split('-')[1]) - 1); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [slug]);

  if (!c) return <Navigate to="/" replace />;
  const nx = nextCase(c.slug);

  return (
    <article className="case" style={{ ['--accent' as string]: c.color }}>
      <motion.div className="case-progress" style={{ scaleX: progress }} />

      <header className="case-hero">
        <div className="wrap">
          <div className="case-crumbs">
            <Link to="/#work" className="crumb-back">← All work</Link>
            <span className="crumb-sep">/</span>
            <span className="crumb-file mono"><i style={{ background: c.color }} />{c.file}</span>
            <span className="crumb-count mono">CASE STUDY 0{c.index} / 0{cases.length}</span>
          </div>
          <div className="case-hero-grid">
            <div>
              <motion.h1 className="h-xl case-title" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
                {c.title[0]} <span className="it">{c.title[1]}</span>
              </motion.h1>
              <motion.p className="lead case-intro" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>{c.intro}</motion.p>
            </div>
            <motion.aside className="props" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <div className="props-head"><b>Properties</b><span className="mono">{c.file}</span></div>
              <p><span>My role</span><b>{c.role}</b></p>
              <p><span>Year</span><b>{c.year}</b></p>
              <p><span>Platform</span><b>{c.platform}</b></p>
              {c.status && <p><span>Status</span><b className="props-status">● {c.status}</b></p>}
              <div className="props-tags">{c.tags.map((t) => <span key={t}>{t}</span>)}</div>
            </motion.aside>
          </div>
          <Reveal className="case-cover"><Cover slug={c.slug} /></Reveal>
        </div>
      </header>

      <Chapter n={1} label={chapters[0]} id="ch-1">
        <Reveal><h2 className="h-md">{c.problem.title}</h2><p className="lead">{c.problem.body}</p></Reveal>
        <div className="steps-row">
          {c.problem.steps.map((s, i) => (
            <motion.span key={s} className={`step-chip ${i === c.problem.steps.length - 1 ? 'last' : ''}`} initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 + i * 0.18 }}>
              {s}{i < c.problem.steps.length - 1 && <em aria-hidden>→</em>}
            </motion.span>
          ))}
        </div>
        <p className="hand aside">{c.problem.aside}</p>
      </Chapter>

      <Chapter n={2} label={chapters[1]} id="ch-2">
        <Reveal><h2 className="h-md">{c.stakes.title}</h2><p className="lead">{c.stakes.body}</p></Reveal>
        <div className="stakes">
          {c.stakes.items.map((s, i) => (
            <Reveal key={s.wrong} delay={i * 0.1} className="stake">
              <p className="mono stake-k red">WHAT GOES WRONG</p>
              <h3>{s.wrong}</h3>
              <p className="mono stake-k">→ DESIGN RESPONSE</p>
              <p className="stake-r">{s.response}</p>
            </Reveal>
          ))}
        </div>
      </Chapter>

      <Chapter n={3} label={chapters[2]} id="ch-3">
        <div className="insight-grid">
          <Reveal><h2 className="h-md">{c.research.title}</h2><p className="lead">{c.research.body}</p></Reveal>
          <motion.div className="insight-note" initial={{ opacity: 0, rotate: 0, y: 30 }} whileInView={{ opacity: 1, rotate: 3, y: 0 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 160, damping: 12, delay: 0.2 }}>
            <span className="mono">KEY INSIGHT</span>
            <p className="hand">{c.research.insight}</p>
          </motion.div>
        </div>
      </Chapter>

      <Chapter n={4} label={chapters[3]} id="ch-4">
        <Reveal><h2 className="h-md">{c.idea.title}</h2><p className="lead">{c.idea.body}</p></Reveal>
        <div className="idea-steps">
          {c.idea.steps.map((s, i) => (
            <Reveal key={s.t} delay={i * 0.1} className={`idea-step is-${i}`}>
              <span className="mono">0{i + 1}</span>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </Reveal>
          ))}
        </div>
        <p className="hand aside dark">{c.idea.aside}</p>
      </Chapter>

      <Chapter n={5} label={chapters[4]} id="ch-5">
        <Reveal><h2 className="h-md">{c.result.title}</h2><p className="lead">{c.result.body}</p></Reveal>
        <div className="ba">
          <div className="ba-toggle" role="tablist" aria-label="Before or after">
            {(['Before', 'After'] as const).map((l) => {
              const on = (l === 'After') === after;
              return (
                <button key={l} role="tab" aria-selected={on} className={on ? 'on' : ''} onClick={() => setAfter(l === 'After')}>
                  {on && <motion.span layoutId="ba-pill" className="ba-pill" transition={{ type: 'spring', stiffness: 500, damping: 36 }} />}
                  <span>{l}</span>
                </button>
              );
            })}
          </div>
          <div className={`ba-stage ${after ? 'is-after' : ''}`} onClick={() => setAfter((a) => !a)}>
            <AnimatePresence mode="wait">
              <motion.div key={String(after)} className="ba-visual" initial={{ opacity: 0, rotateY: -30, scale: 0.94 }} animate={{ opacity: 1, rotateY: 0, scale: 1 }} exit={{ opacity: 0, rotateY: 30, scale: 0.94 }} transition={{ duration: 0.4 }}>
                <BeforeAfter slug={c.slug} after={after} />
              </motion.div>
            </AnimatePresence>
            <span className="hand ba-hint">tap to compare</span>
          </div>
          <p className={`mono ba-caption ${after ? 'good' : ''}`}>{after ? c.result.after : c.result.before}</p>
        </div>
      </Chapter>

      <Chapter n={6} label={chapters[5]} id="ch-6">
        <Reveal><h2 className="h-md">What I’m taking to the next project.</h2></Reveal>
        <ol className="takeaways">
          {c.takeaways.items.map((t, i) => (
            <Reveal key={t} delay={i * 0.08}><li><span className="mono">0{i + 1}</span>{t}</li></Reveal>
          ))}
        </ol>
        <Reveal><blockquote className="case-quote">{c.takeaways.quote}</blockquote></Reveal>
      </Chapter>

      <section className="section next-case">
        <div className="wrap next-grid">
          <div>
            <span className="kicker">{nx.index === 1 ? '{ BACK TO THE FIRST ONE }' : '{ NEXT CASE STUDY }'}</span>
            <h2 className="h-lg next-title">{nx.title[0]} <span className="it">{nx.title[1]}</span></h2>
            <div className="next-links">
              <Link to="/#work" className="btn btn-ghost">← All work</Link>
              <Link to={`/work/${nx.slug}`} className="btn btn-dark">Read next →</Link>
            </div>
          </div>
          <div className="next-folder"><Folder c={nx} /></div>
        </div>
      </section>

      <nav className={`contents ${showBar ? 'show' : ''}`} aria-label="Chapters">
        {chapters.map((ch, i) => (
          <a key={ch} href={`#ch-${i + 1}`} className={active === i ? 'on' : ''} onClick={(e) => { e.preventDefault(); document.getElementById(`ch-${i + 1}`)?.scrollIntoView({ behavior: 'smooth' }); }}>
            {active === i && <motion.span layoutId="contents-pill" className="contents-pill" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
            <span className="contents-t"><b className="mono">0{i + 1}</b> {ch}</span>
          </a>
        ))}
      </nav>
    </article>
  );
}
