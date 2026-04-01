'use client';
import { useState } from 'react';
import { useInView } from '../hooks/useInView';

const faqs = [
  {
    q: 'When do new drops release?',
    a: 'New drops happen roughly every 4–6 weeks. Each drop is announced through our email list and social channels first. Join the early access list to be first in line — drops often sell out before they go public.',
  },
  {
    q: 'Are quantities limited?',
    a: 'Yes — always. Every SFX CLUB piece is a small-run release. We keep quantities intentionally low to maintain the collector feel. Once a colorway is gone, it doesn\'t come back.',
  },
  {
    q: 'How long does shipping take?',
    a: 'Standard domestic shipping takes 3–5 business days. Expedited 2-day options are available at checkout. All orders ship in our custom SFX CLUB packaging — designed to be unboxed, not just opened.',
  },
  {
    q: 'How should I clean my piece?',
    a: 'Warm water + isopropyl alcohol works great. Use a pipe cleaner for detailed spots. Borosilicate glass is durable and heat-resistant — avoid sudden temperature extremes and harsh abrasives. Your piece is built to last.',
  },
  {
    q: 'Can I join the early access list?',
    a: 'Yes! Scroll up and drop your email in the Join the Club section. Early access members get notified 24 hours before public drops. SMS subscribers get notified 48 hours early.',
  },
];

function FAQItem({ item, open, onToggle }) {
  return (
    <div className="border-b border-sfx-border last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-5 text-left hover:text-sfx-lime transition-colors group"
      >
        <span className="font-bold text-base text-sfx-text group-hover:text-sfx-lime transition-colors">
          {item.q}
        </span>
        <span
          className={`w-8 h-8 rounded-xl border border-sfx-border flex-shrink-0 flex items-center justify-center text-sfx-muted transition-all duration-300 ${
            open ? 'bg-sfx-lime text-sfx-black border-sfx-lime rotate-45' : 'group-hover:border-sfx-lime/40'
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M7 2v10M2 7h10" />
          </svg>
        </span>
      </button>

      <div className={`faq-answer ${open ? 'open' : ''}`}>
        <p className="text-sfx-muted text-sm leading-relaxed pb-5 pr-12">{item.a}</p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(null);
  const [ref, inView]         = useInView();

  return (
    <section id="faq" className="py-24 px-6 lg:px-10 bg-sfx-dark relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-sfx-lime/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div className={`transition-all duration-700 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <div className="text-xs font-bold tracking-[0.18em] uppercase text-sfx-lime mb-4">Got Questions</div>
            <h2
              className="font-black text-5xl lg:text-6xl leading-none tracking-tight mb-6"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              QUICK<br />
              <span className="text-gradient-lime">ANSWERS.</span>
            </h2>
            <p className="text-sfx-muted text-lg leading-relaxed mb-8">
              Everything you need to know before you order. Still got questions? We're one DM away.
            </p>
            <a
              href="mailto:hello@sfxclub.com"
              className="inline-flex items-center gap-2 text-sfx-lime font-bold text-sm hover:gap-3 transition-all"
            >
              Contact us
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" />
              </svg>
            </a>
          </div>

          {/* Right — accordion */}
          <div
            className={`rounded-3xl bg-sfx-card border border-sfx-border px-6 divide-y divide-sfx-border noise
              transition-all duration-700 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
            style={{ transitionDelay: '150ms' }}
          >
            {faqs.map((item, i) => (
              <FAQItem
                key={i}
                item={item}
                open={openIdx === i}
                onToggle={() => setOpenIdx(openIdx === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
