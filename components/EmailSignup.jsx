'use client';
import { useState } from 'react';
import { useInView } from '../hooks/useInView';

export default function EmailSignup() {
  const [email,     setEmail]     = useState('');
  const [phone,     setPhone]     = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [ref,       inView]       = useInView();

  function handleSubmit(e) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

  return (
    <section id="email" className="py-24 px-6 lg:px-10 relative overflow-hidden">
      {/* Loud gradient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(200,255,0,0.08) 0%, rgba(10,10,20,0) 40%, rgba(155,92,255,0.08) 100%)',
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 65%)' }} />
      </div>

      <div
        className={`max-w-2xl mx-auto relative z-10 text-center transition-all duration-700 ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
        ref={ref}
      >
        {/* Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-sfx-lime/30 bg-sfx-lime/10 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-sfx-lime animate-pulse" />
          <span className="text-xs font-black tracking-[0.18em] uppercase text-sfx-lime">Early Access</span>
        </div>

        <h2
          className="font-black text-5xl lg:text-7xl leading-none tracking-tight mb-4"
          style={{ fontFamily: 'Syne, sans-serif' }}
        >
          JOIN THE{' '}
          <span className="text-gradient-multi">CLUB.</span>
        </h2>
        <p className="text-sfx-muted text-lg mb-10 max-w-md mx-auto">
          Get early access to new drops, limited colorways, and exclusive launch updates.
          First in, first served.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md mx-auto">
            {/* Email */}
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-5 py-4 rounded-2xl bg-sfx-card border border-sfx-border text-sfx-text placeholder-sfx-muted/50 font-medium focus:outline-none focus:border-sfx-lime/50 transition-colors text-sm"
              />
            </div>

            {/* Optional SMS */}
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Phone number (optional — for SMS drops)"
                className="w-full px-5 py-4 rounded-2xl bg-sfx-card border border-sfx-border text-sfx-text placeholder-sfx-muted/50 font-medium focus:outline-none focus:border-sfx-lime/30 transition-colors text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-sfx-lime text-sfx-black font-black text-base tracking-wider hover:shadow-lime-glow hover:-translate-y-0.5 transition-all duration-200"
            >
              Get Early Access
            </button>

            <p className="text-sfx-muted text-xs">
              No spam. No sharing. Drop alerts only. Unsubscribe any time.
            </p>
          </form>
        ) : (
          <div className="animate-pop-in flex flex-col items-center gap-4 max-w-sm mx-auto">
            <div className="w-16 h-16 rounded-full bg-sfx-lime/20 border border-sfx-lime/40 flex items-center justify-center text-3xl">
              ✓
            </div>
            <h3 className="font-black text-2xl text-sfx-lime" style={{ fontFamily: 'Syne, sans-serif' }}>
              You're in the club.
            </h3>
            <p className="text-sfx-muted text-sm">
              We'll hit you first when the next drop goes live.
            </p>
          </div>
        )}

        {/* Social icons */}
        <div className="mt-12 flex items-center justify-center gap-4">
          <span className="text-sfx-muted text-sm">Also follow us:</span>
          {['TikTok', 'Instagram', 'Discord'].map(s => (
            <a
              key={s}
              href="#"
              className="text-xs font-bold text-sfx-muted hover:text-sfx-lime transition-colors tracking-wide border border-sfx-border hover:border-sfx-lime/30 px-3 py-1.5 rounded-full"
            >
              {s}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
