'use client';
import { useInView } from '../hooks/useInView';

const reviews = [
  {
    quote: 'The branding is insane. It feels like a fashion drop, not a basic store. When I got the box I literally had to post it.',
    name: 'Maya R.',
    handle: '@maya.rips',
    avatar: 'MR',
    location: 'Los Angeles, CA',
    stars: 5,
    color: '#C8FF00',
    product: 'Electric Bloom',
    featured: true,
  },
  {
    quote: 'Colors go crazy in person. Super clean, super fun, and looks perfect in content. My setup never looked better.',
    name: 'Jalen T.',
    handle: '@jalent.studio',
    avatar: 'JT',
    location: 'Atlanta, GA',
    stars: 5,
    color: '#00E5FF',
    product: 'Blue Voltage',
  },
  {
    quote: 'SFX CLUB feels premium but playful. Everything looks collectible. I have three pieces and each one hits different.',
    name: 'Ari K.',
    handle: '@ari.collects',
    avatar: 'AK',
    location: 'New York, NY',
    stars: 5,
    color: '#9B5CFF',
    product: 'Cherry Static',
  },
];

function Stars({ count }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill={i < count ? '#C8FF00' : '#1E1E2C'}>
          <path d="M7 1l1.8 3.6L13 5.3l-3 2.9.7 4.1L7 10.2l-3.7 2.1.7-4.1-3-2.9 4.2-.7L7 1z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [ref, inView] = useInView();

  return (
    <section id="reviews" className="py-24 px-6 lg:px-10 bg-sfx-dark relative overflow-hidden">
      {/* bg blobs */}
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-sfx-purple/6 blur-[100px] pointer-events-none" />
      <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-sfx-cyan/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10" ref={ref}>
        {/* Header */}
        <div className="text-center mb-14">
          <div className="text-xs font-bold tracking-[0.18em] uppercase text-sfx-lime mb-4">Social Proof</div>
          <h2
            className="font-black text-5xl lg:text-7xl leading-none tracking-tight"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            THE{' '}
            <span className="text-gradient-pink">WORD</span>
          </h2>
          <p className="text-sfx-muted mt-4 max-w-md mx-auto">
            Don't take our word for it. These people have the receipts.
          </p>
        </div>

        {/* Rating summary */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12 p-6 rounded-3xl bg-sfx-card border border-sfx-border max-w-xl mx-auto noise">
          <div className="text-center sm:border-r border-sfx-border sm:pr-6">
            <div className="text-5xl font-black text-sfx-lime" style={{ fontFamily: 'Syne, sans-serif' }}>4.9</div>
            <Stars count={5} />
            <div className="text-xs text-sfx-muted mt-1">Average rating</div>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
            {[5,4,3,2,1].map(n => (
              <div key={n} className="flex items-center gap-2 col-span-2">
                <span className="text-sfx-muted text-xs w-3">{n}</span>
                <div className="flex-1 h-1.5 rounded-full bg-sfx-border overflow-hidden max-w-[120px]">
                  <div
                    className="h-full rounded-full bg-sfx-lime"
                    style={{ width: n === 5 ? '88%' : n === 4 ? '10%' : '2%' }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="text-center sm:border-l border-sfx-border sm:pl-6">
            <div className="text-3xl font-black text-sfx-text" style={{ fontFamily: 'Syne, sans-serif' }}>214</div>
            <div className="text-xs text-sfx-muted mt-1">Verified reviews</div>
          </div>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((r, i) => (
            <div
              key={i}
              className={`group rounded-3xl p-6 border border-sfx-border noise
                hover:-translate-y-2 hover:border-opacity-60 transition-all duration-300
                ${r.featured ? 'sm:col-span-2 lg:col-span-1' : ''}
                ${inView ? 'animate-fade-up opacity-100' : 'opacity-0'}`}
              style={{
                animationDelay: `${i * 120}ms`,
                background: `linear-gradient(135deg, #12121A 0%, #0E0E14 100%)`,
                borderColor: r.featured ? `${r.color}44` : undefined,
              }}
            >
              {/* Stars + product */}
              <div className="flex items-center justify-between mb-4">
                <Stars count={r.stars} />
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ background: `${r.color}18`, color: r.color, border: `1px solid ${r.color}30` }}
                >
                  {r.product}
                </span>
              </div>

              {/* Quote */}
              <p className="text-sfx-text text-base leading-relaxed mb-6 italic">
                &ldquo;{r.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black text-sfx-black flex-shrink-0"
                  style={{ background: r.color }}
                >
                  {r.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-sfx-text">{r.name}</div>
                  <div className="text-sfx-muted text-xs">{r.handle} · {r.location}</div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-sfx-lime">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                    <path d="M6 0l1.35 4.15H12L8.32 6.73 9.67 10.9 6 8.32 2.33 10.9l1.35-4.17L0 4.15h4.65L6 0z" />
                  </svg>
                  Verified
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
