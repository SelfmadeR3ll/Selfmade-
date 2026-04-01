'use client';
import { useState } from 'react';
import { useInView } from '../hooks/useInView';

const colors = [
  { name: 'Neon Lime',     hex: '#C8FF00', glow: 'rgba(200,255,0,0.4)'   },
  { name: 'Electric Pink', hex: '#FF1F71', glow: 'rgba(255,31,113,0.4)'  },
  { name: 'Cyan Wave',     hex: '#00E5FF', glow: 'rgba(0,229,255,0.4)'   },
  { name: 'Acid Purple',   hex: '#9B5CFF', glow: 'rgba(155,92,255,0.4)'  },
];

const features = [
  { icon: '💎', label: 'Premium glass build' },
  { icon: '🎨', label: 'Bold statement design' },
  { icon: '✨', label: 'Display-worthy finish' },
  { icon: '🧼', label: 'Easy-clean silhouette' },
];

function ProductVisual({ color }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Glow */}
      <div
        className="absolute w-72 h-72 rounded-full blur-[80px] transition-all duration-700 animate-glow-pulse"
        style={{ background: color.glow.replace('0.4', '0.25') }}
      />

      {/* Glass art piece */}
      <div className="relative z-10 animate-float">
        <svg width="220" height="300" viewBox="0 0 220 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="fb" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={color.hex} stopOpacity="0.9" />
              <stop offset="100%" stopColor="white" stopOpacity="0.3" />
            </linearGradient>
            <filter id="fg"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            <radialGradient id="fh" cx="30%" cy="25%" r="55%">
              <stop offset="0%" stopColor="white" stopOpacity="0.5" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* Base */}
          <ellipse cx="110" cy="272" rx="62" ry="16" fill={color.hex} opacity="0.5" />
          {/* Body */}
          <path d="M48 270 C48 270 40 225 44 178 C48 131 60 95 80 66 C93 44 104 28 110 18 C116 28 127 44 140 66 C160 95 172 131 176 178 C180 225 172 270 172 270 Z"
            fill="url(#fb)" filter="url(#fg)" />
          <ellipse cx="110" cy="144" rx="62" ry="126" fill="url(#fh)" />
          {/* Neck */}
          <rect x="97" y="4" width="26" height="52" rx="13" fill={color.hex} opacity="0.8" />
          {/* Mouthpiece */}
          <ellipse cx="110" cy="6" rx="20" ry="7" fill={color.hex} />
          <ellipse cx="110" cy="4" rx="16" ry="5" fill="white" opacity="0.3" />
          {/* Perc line */}
          <ellipse cx="110" cy="186" rx="54" ry="10" fill="none" stroke={color.hex} strokeWidth="2" opacity="0.5" />
          {/* Side highlight */}
          <path d="M66 240 C64 204 66 168 74 132 C80 106 90 84 102 60" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.3" fill="none" />
        </svg>
      </div>

      {/* Color accent dots decoration */}
      <div className="absolute top-6 right-6 w-3 h-3 rounded-full animate-float-alt" style={{ background: color.hex, opacity: 0.8 }} />
      <div className="absolute bottom-10 left-10 w-2 h-2 rounded-full animate-float" style={{ background: color.hex, opacity: 0.5, animationDelay: '1s' }} />
    </div>
  );
}

export default function FeaturedProduct() {
  const [selectedColor, setSelectedColor] = useState(0);
  const [qty, setQty]                     = useState(1);
  const [added, setAdded]                 = useState(false);
  const [ref, inView]                     = useInView();

  const color = colors[selectedColor];

  function handleAddToCart() {
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  }

  return (
    <section id="featured" className="relative py-24 px-6 lg:px-10 overflow-hidden">
      {/* bg blob */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px]"
          style={{ background: color.glow.replace('0.4', '0.07'), transition: 'background 0.7s' }} />
      </div>

      <div
        ref={ref}
        className={`max-w-7xl mx-auto transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        {/* Section label */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-sfx-border mb-4 text-xs font-bold tracking-[0.18em] uppercase text-sfx-muted">
            Featured Drop
          </div>
          <h2
            className="font-black text-5xl lg:text-7xl leading-none tracking-tight"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            ELECTRIC <span className="text-gradient-lime">BLOOM</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Visual card */}
          <div className="relative rounded-3xl bg-sfx-card border border-sfx-border overflow-hidden h-[500px] lg:h-[580px] noise">
            {/* Badges */}
            <div className="absolute top-5 left-5 z-20 flex flex-wrap gap-2">
              {['Featured', 'Limited', 'Best Seller'].map((b, i) => (
                <span
                  key={b}
                  className={`text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full ${
                    i === 0 ? 'bg-sfx-lime text-sfx-black' :
                    i === 1 ? 'bg-sfx-pink/20 text-sfx-pink border border-sfx-pink/30' :
                              'bg-sfx-cyan/20 text-sfx-cyan border border-sfx-cyan/30'
                  }`}
                >
                  {b}
                </span>
              ))}
            </div>
            <ProductVisual color={color} />
          </div>

          {/* Product details */}
          <div className="flex flex-col gap-6">
            {/* Price & rating */}
            <div className="flex items-center gap-4">
              <span className="text-5xl font-black text-sfx-lime" style={{ fontFamily: 'Syne, sans-serif' }}>$76</span>
              <div>
                <div className="flex gap-0.5 text-sfx-lime text-sm">{'★★★★★'}</div>
                <div className="text-xs text-sfx-muted mt-0.5">214 reviews</div>
              </div>
            </div>

            <p className="text-sfx-muted text-lg leading-relaxed">
              Bright, collectible, shelf-ready. The Electric Bloom is our most iconic piece — a color-forward statement built to live on your desk, your shelf, and your feed.
            </p>

            {/* Features */}
            <ul className="grid grid-cols-2 gap-2.5">
              {features.map(f => (
                <li key={f.label} className="flex items-center gap-2.5 rounded-xl bg-sfx-card border border-sfx-border px-4 py-3">
                  <span className="text-lg">{f.icon}</span>
                  <span className="text-sm font-semibold text-sfx-text">{f.label}</span>
                </li>
              ))}
            </ul>

            {/* Color picker */}
            <div>
              <div className="text-xs font-bold tracking-widest uppercase text-sfx-muted mb-3">
                Colorway — <span className="text-sfx-text">{color.name}</span>
              </div>
              <div className="flex gap-3">
                {colors.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(i)}
                    className={`w-9 h-9 rounded-full transition-all duration-200 ${
                      i === selectedColor ? 'ring-2 ring-offset-2 ring-offset-sfx-black scale-110' : 'hover:scale-105'
                    }`}
                    style={{ background: c.hex, ringColor: c.hex }}
                    aria-label={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Qty + Add to cart */}
            <div className="flex gap-3 items-center">
              <div className="flex items-center border border-sfx-border rounded-2xl bg-sfx-card overflow-hidden">
                <button
                  className="px-4 py-3.5 text-sfx-muted hover:text-sfx-text transition-colors font-bold"
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                >
                  −
                </button>
                <span className="w-10 text-center font-black text-sfx-text">{qty}</span>
                <button
                  className="px-4 py-3.5 text-sfx-muted hover:text-sfx-text transition-colors font-bold"
                  onClick={() => setQty(q => q + 1)}
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`flex-1 py-3.5 rounded-2xl font-black text-sm tracking-wider transition-all duration-200 ${
                  added
                    ? 'bg-sfx-cyan/20 text-sfx-cyan border border-sfx-cyan/40'
                    : 'bg-sfx-lime text-sfx-black hover:shadow-lime-glow hover:-translate-y-0.5'
                }`}
              >
                {added ? '✓ Added to Cart' : 'Add to Cart — $' + (76 * qty)}
              </button>
            </div>

            {/* Scarcity */}
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-sfx-pink/10 border border-sfx-pink/20">
              <span className="w-2 h-2 rounded-full bg-sfx-pink animate-pulse" />
              <span className="text-sm font-semibold text-sfx-pink">Only 14 left — last batch sold out in 48 hrs</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
