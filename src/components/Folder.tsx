import { Link } from 'react-router-dom';
import type { CaseStudy } from '../content/cases';
import './folder.css';

const shade: Record<string, string> = {
  '#ff5b2e': '#d4431d',
  '#c9b8ff': '#a995ef',
  '#16130f': '#332c24',
  '#e7dfd1': '#d3c8b4',
};

export default function Folder({ c, compact = false }: { c: CaseStudy; compact?: boolean }) {
  return (
    <Link
      to={`/work/${c.slug}`}
      className={`folder ${compact ? 'folder-compact' : ''}`}
      style={{ ['--c' as string]: c.color, ['--c2' as string]: shade[c.color] ?? c.color, ['--fg' as string]: c.ink }}
      aria-label={`${c.title.join(' ')}: read the case study`}
    >
      <span className="folder-back">
        <span className="folder-tab mono">{c.file}<i /></span>
      </span>
      <span className="folder-paper p1" />
      <span className="folder-paper p2" />
      <span className="folder-front">
        <span className="folder-top">
          <span className="mono folder-label">0{c.index} — {c.label}</span>
          <span className="folder-go" aria-hidden>
            <svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 11L11 3M5 3h6v6" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
        </span>
        <span className="folder-title">{c.title[0]} {c.title[1]}</span>
        <span className="folder-chips">
          {c.status && <span className="chip chip-dark">● {c.status}</span>}
          {c.tags.slice(0, 2).map((t) => <span key={t} className="chip">{t}</span>)}
        </span>
      </span>
    </Link>
  );
}
