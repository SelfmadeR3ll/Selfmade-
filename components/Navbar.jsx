'use client';
import { useState, useEffect } from 'react';

const links = ['Shop', 'Drops', 'About', 'Reviews', 'FAQ'];

function CartIcon({ count = 2 }) {
  return (
    <button className="relative p-2 rounded-xl hover:bg-sfx-border transition-colors">
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 text-[10px] font-black bg-sfx-lime text-sfx-black rounded-full flex items-center justify-center w-4 h-4">
          {count}
        </span>
      )}
    </button>
  );
}

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className={`fixed top-9 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-sfx-black/80 backdrop-blur-xl border-b border-sfx-border shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-16">
        {/* Logo */}
        <a href="#" className="flex items-center gap-1.5 group">
          <span
            className="text-2xl font-black tracking-tighter text-sfx-text group-hover:text-sfx-lime transition-colors"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            SFX
          </span>
          <span
            className="text-2xl font-black tracking-tighter text-sfx-lime"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            CLUB
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {links.map(link => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-sm font-semibold text-sfx-muted hover:text-sfx-text transition-colors tracking-wide relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-sfx-lime after:transition-all hover:after:w-full"
            >
              {link}
            </a>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <CartIcon />
          <a
            href="#products"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2 rounded-full bg-sfx-lime text-sfx-black text-sm font-black tracking-wider hover:shadow-lime-glow hover:-translate-y-0.5 transition-all duration-200"
          >
            Shop Drop
          </a>

          {/* Hamburger */}
          <button
            className="lg:hidden p-2 rounded-xl hover:bg-sfx-border transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-sfx-text mb-1.5 transition-transform origin-center ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-sfx-text mb-1.5 transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-sfx-text transition-transform origin-center ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? 'max-h-80 border-t border-sfx-border' : 'max-h-0'
        } bg-sfx-dark/95 backdrop-blur-xl`}
      >
        <div className="px-6 py-6 flex flex-col gap-4">
          {links.map(link => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              onClick={() => setMenuOpen(false)}
              className="text-base font-bold text-sfx-muted hover:text-sfx-lime transition-colors tracking-wide"
            >
              {link}
            </a>
          ))}
          <a
            href="#products"
            onClick={() => setMenuOpen(false)}
            className="mt-2 inline-flex justify-center px-6 py-3 rounded-full bg-sfx-lime text-sfx-black font-black text-sm tracking-wider"
          >
            Shop Drop
          </a>
        </div>
      </div>
    </header>
  );
}
