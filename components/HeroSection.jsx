'use client';
import { useEffect, useState } from 'react';

function GlassArtHero() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none">
      {/* Outer glow rings */}
      <div className="absolute w-80 h-80 rounded-full border border-sfx-lime/10 animate-spin-slow" />
      <div className="absolute w-64 h-64 rounded-full border border-sfx-cyan/10 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '12s' }} />

      {/* Background blobs */}
      <div className="absolute w-60 h-60 rounded-full bg-sfx-lime/15 blur-[60px] animate-glow-pulse" />
      <div className="absolute w-40 h-40 rounded-full bg-sfx-cyan/20 blur-[40px] animate-glow-pulse" style={{ animationDelay: '1.2s', top: '20%', right: '15%' }} />
      <div className="absolute w-36 h-36 rounded-full bg-sfx-purple/20 blur-[50px] animate-glow-pulse" style={{ animationDelay: '2.4s', bottom: '15%', left: '10%' }} />

      {/* Main glass art piece */}
      <div className="relative z-10 animate-float">
        <svg width="240" height="320" viewBox="0 0 240 320" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#C8FF00" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#00E5FF" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#9B5CFF" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="baseGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#C8FF00" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="neckGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#9B5CFF" stopOpacity="0.9" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="highlight" cx="30%" cy="30%" r="50%">
              <stop offset="0%" stopColor="white" stopOpacity="0.4" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Base */}
          <ellipse cx="120" cy="290" rx="68" ry="18" fill="url(#baseGrad)" />
          <ellipse cx="120" cy="288" rx="60" ry="14" fill="url(#bodyGrad)" opacity="0.6" />

          {/* Body - wide bottom */}
          <path
            d="M52 288 C52 288 42 240 46 190 C50 140 60 100 80 70 C95 46 108 30 120 20 C132 30 145 46 160 70 C180 100 190 140 194 190 C198 240 188 288 188 288 Z"
            fill="url(#bodyGrad)"
            filter="url(#glow)"
          />
          {/* Body highlight */}
          <path
            d="M70 260 C68 220 70 180 78 140 C84 112 94 88 108 64"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.35"
            fill="none"
          />
          <ellipse cx="120" cy="154" rx="74" ry="134" fill="url(#highlight)" />

          {/* Neck */}
          <rect x="104" y="4" width="32" height="60" rx="16" fill="url(#neckGrad)" filter="url(#glow)" />

          {/* Mouthpiece */}
          <ellipse cx="120" cy="6" rx="24" ry="8" fill="#00E5FF" opacity="0.85" />
          <ellipse cx="120" cy="4" rx="20" ry="6" fill="white" opacity="0.2" />

          {/* Percolator rings */}
          <ellipse cx="120" cy="200" rx="62" ry="12" fill="none" stroke="url(#neckGrad)" strokeWidth="2" opacity="0.6" />
          <ellipse cx="120" cy="200" rx="50" ry="9" fill="none" stroke="white" strokeWidth="1" opacity="0.15" />
        </svg>
      </div>

      {/* Floating badges */}
      <div className="absolute top-8 right-8 animate-float" style={{ animationDelay: '0.8s' }}>
        <div className="gradient-border rounded-2xl px-3.5 py-2 bg-sfx-card/80 backdrop-blur-sm">
          <div className="text-xs font-black text-sfx-lime tracking-widest uppercase">Limited</div>
          <div className="text-lg font-black text-sfx-text">Drop #07</div>
        </div>
      </div>
      <div className="absolute bottom-14 left-6 animate-float-alt">
        <div className="gradient-border-pink rounded-2xl px-3.5 py-2 bg-sfx-card/80 backdrop-blur-sm">
          <div className="text-xs font-black text-sfx-pink tracking-widest uppercase">From</div>
          <div className="text-2xl font-black text-sfx-text">$68</div>
        </div>
      </div>
      <div className="absolute top-1/2 left-2 animate-float" style={{ animationDelay: '1.5s' }}>
        <div className="w-10 h-10 rounded-2xl bg-sfx-cyan/20 border border-sfx-cyan/30 flex items-center justify-center text-xl">
          ✦
        </div>
      </div>
    </div>
  );
}

const stats = [
  { icon: '⚡', value: 'Limited Drops', sub: 'Small-run only' },
  { icon: '🏆', value: 'Collector Feel', sub: 'Built like art' },
  { icon: '📸', value: 'Feed-Ready', sub: 'Shelf + camera' },
];

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setLoaded(true); }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-28 pb-16 px-6 lg:px-10"
    >
      {/* Background gradient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-sfx-lime/8 blur-[120px] animate-glow-pulse" />
        <div className="absolute top-1/3 -right-20 w-[500px] h-[500px] rounded-full bg-sfx-cyan/8 blur-[100px] animate-glow-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-sfx-purple/8 blur-[100px] animate-glow-pulse" style={{ animationDelay: '4s' }} />
        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-0 items-center">
        {/* Left — text */}
        <div className={`transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sfx-card border border-sfx-border mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-sfx-lime animate-pulse" />
            <span className="text-xs font-bold tracking-[0.18em] uppercase text-sfx-muted">
              Drop 07 — Live Now
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-black leading-[0.92] tracking-tight mb-6"
            style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(3.2rem, 8vw, 7rem)' }}
          >
            <span className="block text-sfx-text">LOUD</span>
            <span className="block text-gradient-lime">DESIGN.</span>
            <span className="block text-sfx-text">CLEAN</span>
            <span className="block text-gradient-multi">ENERGY.</span>
          </h1>

          <p className="text-sfx-muted text-lg leading-relaxed mb-8 max-w-md">
            SFX CLUB creates collectible lifestyle pieces with bold color, playful attitude, and premium design — made to stand out on your shelf and your feed.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 mb-12">
            <a
              href="#products"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-sfx-lime text-sfx-black font-black text-sm tracking-wider hover:shadow-lime-glow hover:-translate-y-1 transition-all duration-200"
            >
              Shop the Drop
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
              </svg>
            </a>
            <a
              href="#featured"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full border border-sfx-border text-sfx-text font-bold text-sm tracking-wide hover:border-sfx-lime/40 hover:bg-sfx-card hover:-translate-y-1 transition-all duration-200"
            >
              View Lookbook
            </a>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Limited Drop', color: 'text-sfx-lime border-sfx-lime/30' },
              { label: 'Premium Build', color: 'text-sfx-cyan border-sfx-cyan/30' },
              { label: 'Fast Shipping', color: 'text-sfx-purple border-sfx-purple/30' },
            ].map(b => (
              <span key={b.label} className={`text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full border ${b.color}`}>
                {b.label}
              </span>
            ))}
          </div>
        </div>

        {/* Right — visual */}
        <div
          className={`h-[480px] lg:h-[580px] transition-all duration-700 delay-200 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <GlassArtHero />
        </div>
      </div>

      {/* Stats bar */}
      <div className="relative z-10 max-w-7xl mx-auto w-full mt-8 lg:mt-0">
        <div className="grid grid-cols-3 divide-x divide-sfx-border border border-sfx-border rounded-2xl bg-sfx-card/60 backdrop-blur-sm overflow-hidden">
          {stats.map((s, i) => (
            <div key={i} className="px-6 py-5 text-center group hover:bg-sfx-border/30 transition-colors">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="font-black text-sfx-text text-sm tracking-wide">{s.value}</div>
              <div className="text-sfx-muted text-xs mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
