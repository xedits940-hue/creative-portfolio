"use client";

// src/vtech/Capabilities.jsx — grouped capability list, with a user-controlled pause for the active highlight.
import { useEffect, useState } from 'react';
import { prefersReducedMotion } from './tier.js';
 
export const CAPABILITY_GROUPS = [
  { label: 'Web', items: ['Website Development', 'Vibe Coding', 'Prompt Engineering'] },
  { label: 'Design', items: ['Logo Design', 'Presentation Design', 'Social Media Posts'] },
  { label: 'Print & Documents', items: ['PDF & Brochure Design', 'Restaurant & Cafe Menus', 'Business Card Design', 'Certificate Design'] },
];
 
export default function Capabilities({ groups = CAPABILITY_GROUPS, intervalMs = 1800 }) {
  const flat = groups.flatMap((g) => g.items);
  const [active, setActive] = useState(0);
  const [pausedByUser, setPausedByUser] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const pause = pausedByUser || (mounted && prefersReducedMotion());
 
  useEffect(() => {
    if (pause || flat.length < 2) return undefined;
    const t = setInterval(() => {
      if (!document.hidden) setActive((i) => (i + 1) % flat.length);
    }, intervalMs);
    return () => clearInterval(t);
  }, [pause, flat.length, intervalMs]);
 
  let n = -1;
  return (
    <section className="vt-cap" aria-labelledby="vt-cap-title">
      <div className="vt-cap__heading-row flex items-center justify-between mb-4">
        <h2 id="vt-cap-title" className="vt-cap__title">Studio Capabilities</h2>
        {mounted && !prefersReducedMotion() ? (
          <button type="button" className="vt-btn vt-tap vt-cap__pause" onClick={() => setPausedByUser((p) => !p)} aria-pressed={pausedByUser}>
            {pausedByUser ? 'Resume highlight' : 'Pause highlight'}
          </button>
        ) : null}
      </div>
      <div className="vt-cap__groups">
        {groups.map((g) => (
          <div key={g.label} className="vt-cap__group">
            <h3 className="vt-cap__label">{g.label}</h3>
            <ul className="vt-cap__list" role="list">
              {g.items.map((item) => { n += 1; return (
                <li key={item} className="vt-cap__item" data-active={n === active ? 'true' : 'false'}>{item}</li>
              ); })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
