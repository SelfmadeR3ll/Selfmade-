'use client';
import { useState } from 'react';

const navCols = [
  {
    title: 'Shop',
    links: ['All Products', 'New Drops', 'Featured', 'Bundles', 'Blind Bags'],
  },
  {
    title: 'Brand',
    links: ['Our Story', 'Lookbook', 'Press', 'Collaborations'],
  },
  {
    title: 'Info',
    links: ['Shipping & Returns', 'FAQ', 'Care Guide', 'Contact Us'],
  },
];

const socials = [
  {
    name: 'TikTok',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: 'Discord',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const [email, setEmail]       = useState('');
  const [signed, setSigned]     = useState(false);

  return (
    <footer className="bg-sfx-dark border-t border-sfx-border pt-16 pb-8 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Main grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-baseline gap-1 mb-4">
              <span
                className="text-3xl font-black tracking-tighter text-sfx-text"
                style={{ fontFamily: 'Syne, sans-serif' }}
              >
                SFX
              </span>
              <span
                className="text-3xl font-black tracking-tighter text-sfx-lime"
                style={{ fontFamily: 'Syne, sans-serif' }}
              >
                CLUB
              </span>
            </div>
            <p className="text-sfx-muted text-sm leading-relaxed mb-6 max-w-xs">
              Collectible lifestyle pieces built with bold color, playful attitude, and premium design.
              Not basic. Never quiet.
            </p>

            {/* Social */}
            <div className="flex gap-3">
              {socials.map(s => (
                <a
                  key={s.name}
                  href="#"
                  aria-label={s.name}
                  className="w-9 h-9 rounded-xl border border-sfx-border text-sfx-muted hover:text-sfx-lime hover:border-sfx-lime/40 transition-all flex items-center justify-center"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav links */}
          {navCols.map(col => (
            <div key={col.title}>
              <h5 className="text-xs font-black tracking-[0.18em] uppercase text-sfx-lime mb-4">
                {col.title}
              </h5>
              <ul className="flex flex-col gap-2.5">
                {col.links.map(link => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-sfx-muted hover:text-sfx-text transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter mini bar */}
        <div className="rounded-2xl bg-sfx-card border border-sfx-border p-5 flex flex-col sm:flex-row gap-4 items-center justify-between mb-10 noise">
          <div>
            <p className="font-black text-sfx-text text-sm" style={{ fontFamily: 'Syne, sans-serif' }}>
              Get drops before everyone else.
            </p>
            <p className="text-sfx-muted text-xs">Join 50K+ collectors on the early access list.</p>
          </div>
          {!signed ? (
            <form
              onSubmit={e => { e.preventDefault(); if (email) setSigned(true); }}
              className="flex gap-2 w-full sm:w-auto"
            >
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 sm:w-56 px-4 py-2.5 rounded-xl bg-sfx-dark border border-sfx-border text-sfx-text placeholder-sfx-muted/40 text-sm focus:outline-none focus:border-sfx-lime/50 transition-colors"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-sfx-lime text-sfx-black font-black text-sm hover:shadow-lime-glow transition-all"
              >
                Join
              </button>
            </form>
          ) : (
            <span className="text-sfx-lime font-bold text-sm">✓ You're in!</span>
          )}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-sfx-border">
          <p className="text-sfx-muted text-xs">
            © 2024 SFX Club. All rights reserved. For adults 21+ only. Not for sale to minors.
          </p>
          <div className="flex gap-5">
            {['Privacy Policy', 'Terms of Service', 'Age Verification'].map(link => (
              <a
                key={link}
                href="#"
                className="text-xs text-sfx-muted/50 hover:text-sfx-muted transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
