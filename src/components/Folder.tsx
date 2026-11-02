import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { CaseStudy } from '../content/cases';
import { caseTitle } from '../content/cases';
import { MiniScreens } from './Visuals';
import './folder.css';

const shade: Record<string, string> = { '#ff5b2e': '#d4431d', '#c9b8ff': '#a995ef', '#16130f': '#3a332b', '#e7dfd1': '#d0c5b1' };

export default function Folder({ c, compact = false, open = false }: { c: CaseStudy; compact?: boolean; open?: boolean }) {
  const [press, setPress] = useState(false);
  const peek = open || press;
  return (
    <Link
      to={`/work/${c.slug}`}
      className={`folder ${compact ? 'folder-compact' : ''} ${peek ? 'is-peek' : ''}`}
      style={{ ['--c' as string]: c.color, ['--c2' as string]: shade[c.color] ?? c.color, ['--fg' as string]: c.ink }}
      aria-label={`${caseTitle(c)}: read the case study`}
      onPointerDown={(e) => e.pointerType !== 'mouse' && setPress(true)}
      onPointerUp={() => setPress(false)}
      onPointerCancel={() => setPress(false)}
      onPointerLeave={() => setPress(false)}
    >
      <span className="folder-tab mono">{c.file}<i /></span>
      <span className="folder-back" />
      <span className="folder-paper pb"><MiniScreens slug={c.slug} /></span>
      <span className="folder-paper pf"><MiniScreens slug={c.slug} /></span>
      <span className="folder-front">
        <span className="folder-top">
          <span className="mono folder-label">0{c.index} — {c.label.replace(' · ', '  ·  ')}</span>
          <span className="folder-go" aria-hidden>
            <svg width="16" height="16" viewBox="0 0 16 16"><path d="M3.5 12.5l9-9M6 3.5h6.5V10" stroke="currentColor" strokeWidth="1.9" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
        </span>
        <span className="folder-title">{caseTitle(c)}</span>
        <span className="folder-chips">
          {c.folderChips.map((t, i) => <span key={t} className={`chip ${i === 0 && c.darkFirstChip ? 'chip-dark' : ''} ${i === 0 && !c.darkFirstChip ? 'chip-light' : ''}`}>{t}</span>)}
        </span>
      </span>
    </Link>
  );
}
