import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { links, isExternal } from '../content/site';
import { useIsMobile } from '../useIsMobile';
import { Reveal, Title } from './bits';
import './where.css';

type Sign = { label: string; sub: string; to: string; dir: 'r' | 'l'; bg: string; fg: string; external?: boolean };

export default function WhereToNext() {
  const mobile = useIsMobile();
  const all: Sign[] = [
    { label: 'Work', sub: '04 FILES', to: '/#work', dir: 'r', bg: 'var(--orange)', fg: 'var(--ink)' },
    { label: 'Playground', sub: '24 EXPERIMENTS', to: '/playground', dir: 'l', bg: 'var(--lilac)', fg: 'var(--ink)' },
    { label: 'About', sub: 'THE LONG STORY', to: '/about', dir: 'r', bg: 'var(--card)', fg: 'var(--ink)' },
    { label: 'Resume', sub: '1 PAGE, PROMISE', to: links.resume, dir: 'l', bg: 'var(--ink)', fg: 'var(--cream)', external: true },
    { label: 'LinkedIn', sub: 'SAY HELLO ↗', to: links.linkedin, dir: 'r', bg: 'var(--sand)', fg: 'var(--ink)', external: true },
    { label: 'Email me', sub: 'REPLIES FAST', to: links.email, dir: 'l', bg: 'var(--orange)', fg: 'var(--ink)', external: true },
  ];
  const signs = mobile ? all.filter((x) => x.label !== 'LinkedIn').map((x) => (x.label === 'Email me' ? { ...x, dir: 'r' as const, bg: 'var(--sand)' } : x)) : all;
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <section className="section where">
      <div className="wrap">
        <Reveal className="where-head">
          <span className="kicker">{'{ YOU MADE IT TO THE END }'}</span>
          <Title text="Where to next?" word="next" />
        </Reveal>

        <div className="post">
          <div className="post-pole" aria-hidden><span className="post-cap" /></div>
          <ul className="post-signs">
            {signs.map((s, i) => {
              const inner = (
                <>
                  <span className="sign-label">{s.label}</span>
                  <span className="sign-sub mono">{s.sub}</span>
                </>
              );
              return (
                <motion.li
                  key={s.label}
                  className={`sign sign-${s.dir}`}
                  style={{ ['--bg' as string]: s.bg, ['--fg' as string]: s.fg }}
                  initial={{ opacity: 0, rotate: s.dir === 'r' ? -14 : 14, x: s.dir === 'r' ? -30 : 30 }}
                  whileInView={{ opacity: 1, rotate: i % 2 ? 1.5 : -1.5, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ type: 'spring', stiffness: 170, damping: 12, delay: i * 0.08 }}
                  whileHover={{ rotate: s.dir === 'r' ? 6 : -6, transition: { type: 'spring', stiffness: 260, damping: 9 } }}
                >
                  {s.external ? (
                    <a href={s.to} target={isExternal(s.to) ? '_blank' : undefined} rel="noreferrer" className="sign-shape">{inner}</a>
                  ) : (
                    <Link to={s.to} className="sign-shape">{inner}</Link>
                  )}
                </motion.li>
              );
            })}
          </ul>
          <div className="post-base" aria-hidden />
          <div className="post-note hand" aria-hidden>
            pick a sign,<br />any sign
            <svg width="70" height="34" viewBox="0 0 70 34" fill="none"><path d="M2 30C20 30 38 22 60 6" stroke="#16130f" strokeWidth="2" strokeLinecap="round" /><path d="M50 5l11 0-3 10" stroke="#16130f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div className="post-here mono" aria-hidden>
            <svg width="18" height="24" viewBox="0 0 18 24"><path d="M9 23s8-8.2 8-14A8 8 0 0 0 1 9c0 5.8 8 14 8 14z" fill="#ff5b2e" stroke="#16130f" strokeWidth="1.5" /><circle cx="9" cy="9" r="3" fill="#16130f" /></svg>
            <span>YOU ARE HERE</span>
          </div>
        </div>

        <div className="chat">
          <p className="chat-time mono">TODAY · {time}</p>
          <motion.div className="chat-row" initial={{ opacity: 0, y: 20, scale: 0.96 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
            <span className="chat-av">YN</span>
            <div className="bubble bubble-orange">So… you scrolled all the way down.</div>
          </motion.div>
          <motion.div className="chat-row chat-row-2" initial={{ opacity: 0, y: 20, scale: 0.96 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}>
            <div className="bubble bubble-lilac">{mobile ? 'Hiring, or got something you want built properly? I’d love to hear about it.' : 'Hiring for a product design role, or got something you want built properly? I’d love to hear about it.'}</div>
          </motion.div>
          <Typing />
          <motion.div className="chat-replies" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.9, duration: 0.5 }}>
            {mobile ? (
              <>
                <a className="btn btn-dark" href={links.book} target={isExternal(links.book) ? '_blank' : undefined} rel="noreferrer">Book a call  ↗</a>
                <a className="btn btn-lilac" href={links.email}>Email me  →</a>
                <a className="btn btn-ghost" href={links.hi}>Just saying hi</a>
              </>
            ) : (
              <>
                <a className="btn btn-ghost" href={links.hi}>Just saying hi</a>
                <a className="btn btn-lilac" href={links.email}>Email me  →</a>
                <a className="btn btn-dark" href={links.book} target={isExternal(links.book) ? '_blank' : undefined} rel="noreferrer">Book a call  ↗</a>
              </>
            )}
          </motion.div>
          <p className="chat-seen mono">SEEN · USUALLY REPLIES WITHIN A DAY</p>
        </div>
      </div>
    </section>
  );
}

function Typing() {
  const [reply, setReply] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setReply((r) => !r), reply ? 2500 : 1700);
    return () => clearTimeout(id);
  }, [reply]);
  return (
    <div className="chat-typing">
      <AnimatePresence mode="wait" initial={false}>
        {reply ? (
          <motion.span key="r" className="reply" initial={{ opacity: 0, scale: 0.6, x: 20 }} animate={{ opacity: 1, scale: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ type: 'spring', stiffness: 300, damping: 15 }}>ok, you got me. let’s talk!</motion.span>
        ) : (
          <motion.span key="t" className="typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <span className="hand">you’re typing…</span>
            <span className="dots"><i /><i /><i /></span>
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
