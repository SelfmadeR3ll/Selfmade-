'use client';
import { useEffect, useState } from 'react';
import { useInView } from '../hooks/useInView';

function getTimeLeft() {
  // Target: 3 days from now (static offset for demo)
  const target = new Date();
  target.setDate(target.getDate() + 3);
  target.setHours(20, 0, 0, 0);

  const diff = target - new Date();
  if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0 };

  return {
    days:  Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    mins:  Math.floor((diff % 3600000)  / 60000),
    secs:  Math.floor((diff % 60000)    / 1000),
  };
}

function Unit({ value, label }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-sfx-card border border-sfx-border flex items-center justify-center
          shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <span
            className="font-black text-3xl sm:text-4xl text-sfx-lime tabular-nums"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            {String(value).padStart(2, '0')}
          </span>
        </div>
        <div className="absolute inset-0 rounded-2xl bg-sfx-lime/5 blur-[6px] pointer-events-none" />
      </div>
      <span className="text-xs font-bold tracking-[0.18em] uppercase text-sfx-muted">{label}</span>
    </div>
  );
}

export default function DropCountdown() {
  const [time, setTime]       = useState(getTimeLeft());
  const [ref,  inView]        = useInView();
  const soldPct               = 71; // mock

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="py-24 px-6 lg:px-10 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-sfx-lime/5 via-sfx-dark to-sfx-purple/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-sfx-lime/5 blur-[120px]" />
      </div>

      {/* Recent purchase popup */}
      <div
        className={`fixed bottom-8 left-6 z-50 transition-all duration-500 ${
          inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
        }`}
        style={{ transitionDelay: '1s' }}
      >
        <div className="flex items-center gap-3 rounded-2xl bg-sfx-card border border-sfx-border px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.6)] max-w-xs animate-pop-in">
          <div className="w-10 h-10 rounded-xl bg-sfx-lime/20 flex items-center justify-center text-lg flex-shrink-0">
            🛒
          </div>
          <div>
            <p className="text-xs font-bold text-sfx-text">Someone in Portland just grabbed</p>
            <p className="text-xs text-sfx-lime font-black">Electric Bloom — Cyan Wave</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10 text-center" ref={ref}>
        {/* Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-sfx-lime/30 bg-sfx-lime/10 mb-6">
          <span className="w-2 h-2 rounded-full bg-sfx-lime animate-pulse" />
          <span className="text-xs font-black tracking-[0.18em] uppercase text-sfx-lime">Next Drop</span>
        </div>

        <h2
          className="font-black text-5xl lg:text-7xl leading-none tracking-tight mb-4"
          style={{ fontFamily: 'Syne, sans-serif' }}
        >
          NEXT DROP <br />
          <span className="text-gradient-lime">GOES LIVE SOON</span>
        </h2>

        <p className="text-sfx-muted text-lg mb-10 max-w-md mx-auto">
          Small-run pieces. Once they're gone, they're gone.
        </p>

        {/* Timer */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 mb-12">
          <Unit value={time.days}  label="Days"    />
          <span className="text-sfx-lime text-3xl font-black pb-6">:</span>
          <Unit value={time.hours} label="Hours"   />
          <span className="text-sfx-lime text-3xl font-black pb-6">:</span>
          <Unit value={time.mins}  label="Minutes" />
          <span className="text-sfx-lime text-3xl font-black pb-6">:</span>
          <Unit value={time.secs}  label="Seconds" />
        </div>

        {/* Sold bar */}
        <div className="max-w-sm mx-auto mb-8">
          <div className="flex justify-between text-xs font-bold mb-2.5">
            <span className="text-sfx-pink">{soldPct}% claimed</span>
            <span className="text-sfx-muted">{100 - soldPct}% remaining</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-sfx-border overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sfx-lime to-sfx-cyan transition-all duration-700"
              style={{ width: `${soldPct}%` }}
            />
          </div>
          <p className="text-sfx-muted text-xs mt-2 text-center">Last drop sold out in 48 hours</p>
        </div>

        <a
          href="#email"
          className="inline-flex items-center gap-3 px-10 py-4 rounded-full bg-sfx-lime text-sfx-black font-black text-base tracking-wider hover:shadow-lime-glow hover:-translate-y-1 transition-all duration-200"
        >
          Get Early Access
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M3 9h12M11 5l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        </a>

        <p className="text-sfx-muted text-xs mt-4">Free to join. First access on every drop.</p>
      </div>
    </section>
  );
}
