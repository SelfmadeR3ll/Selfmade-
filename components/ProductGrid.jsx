'use client';
import { useState } from 'react';
import { useInView } from '../hooks/useInView';

const products = [
  {
    id: 1,
    name: 'Neon Drift',
    price: 68,
    desc: 'Signature glass art piece. Bold lines, soft glow.',
    badge: 'New Drop',
    badgeColor: 'bg-sfx-lime text-sfx-black',
    color1: '#C8FF00',
    color2: '#00E5FF',
    delay: 0,
  },
  {
    id: 2,
    name: 'Cherry Static',
    price: 74,
    desc: 'Bold colorway drop. Deep reds meet electric pop.',
    badge: 'Fan Fav',
    badgeColor: 'bg-sfx-pink text-white',
    color1: '#FF1F71',
    color2: '#FF6416',
    delay: 100,
  },
  {
    id: 3,
    name: 'Blue Voltage',
    price: 79,
    desc: 'Clean curves, loud energy. Pure electric blue.',
    badge: 'Limited',
    badgeColor: 'bg-sfx-cyan/20 text-sfx-cyan border border-sfx-cyan/40',
    color1: '#00E5FF',
    color2: '#9B5CFF',
    delay: 200,
  },
  {
    id: 4,
    name: 'Lime Riot',
    price: 72,
    desc: 'Playful studio favorite. Acid brights, collector status.',
    badge: 'Best Seller',
    badgeColor: 'bg-sfx-purple/20 text-sfx-purple border border-sfx-purple/40',
    color1: '#9B5CFF',
    color2: '#C8FF00',
    delay: 300,
  },
];

function MiniGlassArt({ color1, color2 }) {
  return (
    <svg width="130" height="180" viewBox="0 0 130 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`g${color1.slice(1)}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color1} stopOpacity="0.9" />
          <stop offset="100%" stopColor={color2} stopOpacity="0.7" />
        </linearGradient>
        <filter id={`gf${color1.slice(1)}`}>
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <ellipse cx="65" cy="164" rx="40" ry="11" fill={color1} opacity="0.5" />
      <path d="M25 162 C25 162 18 130 22 100 C26 70 35 50 47 34 C54 24 60 16 65 10 C70 16 76 24 83 34 C95 50 104 70 108 100 C112 130 105 162 105 162 Z"
        fill={`url(#g${color1.slice(1)})`} filter={`url(#gf${color1.slice(1)})`} />
      <rect x="57" y="2" width="16" height="34" rx="8" fill={color2} opacity="0.85" />
      <ellipse cx="65" cy="4" rx="12" ry="5" fill={color2} />
      <path d="M36 140 C35 122 36 104 41 86 C45 72 51 56 59 40" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.28" fill="none" />
    </svg>
  );
}

function ProductCard({ product, inView }) {
  const [added, setAdded] = useState(false);

  return (
    <div
      className={`group relative flex flex-col rounded-3xl bg-sfx-card border border-sfx-border overflow-hidden
        hover:border-opacity-60 hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(0,0,0,0.55)]
        transition-all duration-300 cursor-pointer noise
        ${inView ? 'animate-fade-up opacity-100' : 'opacity-0'}`}
      style={{ animationDelay: `${product.delay}ms`, borderColor: 'transparent',
        background: `linear-gradient(#12121A, #12121A) padding-box, linear-gradient(135deg, ${product.color1}33, ${product.color2}22) border-box`,
        border: '1px solid transparent' }}
    >
      {/* Visual */}
      <div className="relative h-56 flex items-center justify-center overflow-hidden">
        {/* Glow bg */}
        <div
          className="absolute inset-0 opacity-20 transition-opacity duration-300 group-hover:opacity-35"
          style={{ background: `radial-gradient(circle at 50% 60%, ${product.color1}, transparent 65%)` }}
        />
        <div className="relative z-10 animate-float group-hover:scale-105 transition-transform duration-300">
          <MiniGlassArt color1={product.color1} color2={product.color2} />
        </div>
        {/* Badge */}
        <span className={`absolute top-4 left-4 text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full ${product.badgeColor}`}>
          {product.badge}
        </span>
        {/* Quick view overlay */}
        <div className="absolute inset-0 bg-sfx-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <span className="text-xs font-black tracking-widest uppercase text-white px-4 py-2 rounded-full border border-white/30 backdrop-blur-sm">
            Quick View
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-3 p-5 flex-1">
        <div>
          <h3
            className="font-black text-xl text-sfx-text mb-1"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            {product.name}
          </h3>
          <p className="text-sfx-muted text-sm leading-relaxed">{product.desc}</p>
        </div>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-sfx-border">
          <span
            className="text-2xl font-black"
            style={{ color: product.color1, fontFamily: 'Syne, sans-serif' }}
          >
            ${product.price}
          </span>
          <button
            onClick={() => { setAdded(true); setTimeout(() => setAdded(false), 2000); }}
            className={`px-5 py-2.5 rounded-full text-xs font-black tracking-wider uppercase transition-all duration-200 ${
              added
                ? 'bg-transparent border border-sfx-lime/40 text-sfx-lime'
                : 'bg-sfx-text/10 text-sfx-text hover:bg-sfx-lime hover:text-sfx-black hover:-translate-y-0.5'
            }`}
          >
            {added ? '✓ Added' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductGrid() {
  const [ref, inView] = useInView();

  return (
    <section id="shop" className="py-24 px-6 lg:px-10 bg-sfx-dark" ref={ref}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs font-bold tracking-[0.18em] uppercase text-sfx-lime mb-3">The Lineup</div>
            <h2
              className="font-black text-5xl lg:text-6xl leading-none tracking-tight text-sfx-text"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              CURRENT <br />
              <span className="text-gradient-multi">DROPS</span>
            </h2>
          </div>
          <a
            href="#"
            className="text-sm font-bold text-sfx-muted hover:text-sfx-lime transition-colors tracking-wide self-end sm:self-auto"
          >
            View all →
          </a>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map(p => (
            <ProductCard key={p.id} product={p} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
