import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { site, mailto } from '../content/site';
import { Photo } from './bits';
import './nav.css';

const links = [
  { to: '/', label: 'Work', match: (p: string) => p === '/' || p.startsWith('/work') },
  { to: '/about', label: 'About', match: (p: string) => p === '/about' },
  { to: '/playground', label: 'Playground', match: (p: string) => p === '/playground' },
];

export default function Nav() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.href = mailto;
    }
  };

  return (
    <>
      <header className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="wrap nav-inner">
          <Link to="/" className="nav-logo" aria-label="Fabrice Iduhire, home">
            <Photo src="/images/fabrice.jpg" alt="" className="nav-avatar" />
            <span>{site.name}</span>
          </Link>

          <nav className="nav-links" aria-label="Main">
            {links.map((l) => {
              const active = l.match(pathname);
              return (
                <NavLink key={l.label} to={l.to} className={`nav-link ${active ? 'active' : ''}`}>
                  {active && <motion.span layoutId="nav-pill" className="nav-pill" transition={{ type: 'spring', stiffness: 420, damping: 32 }} />}
                  <span className="nav-link-text">{l.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <button className="nav-email" onClick={copy} aria-live="polite">
            <span>{copied ? 'copied to clipboard!' : site.email}</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <rect x="4" y="4" width="8.5" height="8.5" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M9.5 2.2A1.5 1.5 0 0 0 8 1H2.5A1.5 1.5 0 0 0 1 2.5V8a1.5 1.5 0 0 0 1.2 1.5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>

          <button className="nav-menu-btn" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="mobile-menu">
            Menu
            <svg width="18" height="12" viewBox="0 0 18 12" aria-hidden><path d="M1 1h16M1 6h16M7 11h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="mmenu"
            role="dialog"
            aria-modal="true"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mmenu-top">
              <span className="mono">MENU</span>
              <button className="mmenu-close" onClick={() => setOpen(false)}>Close ×</button>
            </div>
            <ul className="mmenu-links">
              {[...links.map((l, i) => ({ ...l, n: `0${i + 1}` })), ...(site.resume ? [{ to: site.resume, label: 'Resume ↓', n: '04', external: true }] : [])].map((l, i) => (
                <motion.li key={l.label} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
                  {'external' in l ? (
                    <a href={l.to} target="_blank" rel="noreferrer"><span className="mono">{l.n}</span>{l.label}</a>
                  ) : (
                    <Link to={l.to}><span className="mono">{l.n}</span>{l.label}</Link>
                  )}
                </motion.li>
              ))}
            </ul>
            <motion.div className="mmenu-sticky hand" initial={{ opacity: 0, rotate: 0, scale: 0.8 }} animate={{ opacity: 1, rotate: -6, scale: 1 }} transition={{ delay: 0.45, type: 'spring', stiffness: 300, damping: 16 }}>
              psst… the folders are the fun part
            </motion.div>
            <a className="btn btn-dark mmenu-cta" href={site.bookCall || mailto} target={site.bookCall ? '_blank' : undefined} rel="noreferrer">
              {site.bookCall ? 'Book a 30-min call ↗' : 'Email me →'}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
