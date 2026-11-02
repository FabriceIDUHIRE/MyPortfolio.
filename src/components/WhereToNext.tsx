import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { site, mailto } from '../content/site';
import { Reveal, Title } from './bits';
import './where.css';

type Sign = { label: string; sub: string; to: string; dir: 'r' | 'l'; bg: string; fg: string; external?: boolean };

export default function WhereToNext() {
  const signs: Sign[] = [
    { label: 'Work', sub: '04 FILES', to: '/#work', dir: 'r', bg: 'var(--orange)', fg: 'var(--ink)' },
    { label: 'Playground', sub: '12 EXPERIMENTS', to: '/playground', dir: 'l', bg: 'var(--lilac)', fg: 'var(--ink)' },
    { label: 'About', sub: 'THE LONG STORY', to: '/about', dir: 'r', bg: 'var(--card)', fg: 'var(--ink)' },
    ...(site.resume ? [{ label: 'Resume', sub: '1 PAGE, PROMISE', to: site.resume, dir: 'l' as const, bg: 'var(--ink)', fg: 'var(--cream)', external: true }] : []),
    ...(site.linkedin ? [{ label: 'LinkedIn', sub: 'SAY HELLO ↗', to: site.linkedin, dir: 'r' as const, bg: 'var(--sand)', fg: 'var(--ink)', external: true }] : []),
    { label: 'Email me', sub: 'REPLIES FAST', to: mailto, dir: 'l', bg: 'var(--orange)', fg: 'var(--ink)', external: true },
  ];
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
                  whileHover={{ rotate: s.dir === 'r' ? 4 : -4, scale: 1.04 }}
                >
                  {s.external ? (
                    <a href={s.to} target={s.to.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer" className="sign-shape">{inner}</a>
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
            <span className="chat-av">FI</span>
            <div className="bubble bubble-orange">So… you scrolled all the way down.</div>
          </motion.div>
          <motion.div className="chat-row chat-row-2" initial={{ opacity: 0, y: 20, scale: 0.96 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}>
            <div className="bubble bubble-lilac">Hiring for a product design role, or got something you want built properly? I’d love to hear about it.</div>
          </motion.div>
          <motion.div className="chat-typing" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.4 }}>
            <span className="hand">you’re typing…</span>
            <span className="dots"><i /><i /><i /></span>
          </motion.div>
          <motion.div className="chat-replies" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 1.8, duration: 0.5 }}>
            <a className="btn btn-ghost" href={`${mailto}?subject=${encodeURIComponent('Just saying hi 👋')}`}>Just saying hi</a>
            <a className="btn btn-lilac" href={mailto}>Email me →</a>
            {site.bookCall && <a className="btn btn-dark" href={site.bookCall} target="_blank" rel="noreferrer">Book a call ↗</a>}
          </motion.div>
          <p className="chat-seen mono">SEEN · USUALLY REPLIES WITHIN A DAY</p>
        </div>
      </div>
    </section>
  );
}
