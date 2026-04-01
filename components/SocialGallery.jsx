'use client';
import { useInView } from '../hooks/useInView';

const posts = [
  {
    user: '@maya.rips',
    caption: 'the colors are crazy in person 🤯',
    likes: '2.4K',
    color1: '#C8FF00',
    color2: '#00E5FF',
    tall: true,
  },
  {
    user: '@jalen.studio',
    caption: 'lowkey my favorite piece on my shelf rn',
    likes: '1.8K',
    color1: '#FF1F71',
    color2: '#9B5CFF',
    tall: false,
  },
  {
    user: '@ari.collects',
    caption: 'sfx club really gets the vibe right ✦',
    likes: '3.1K',
    color1: '#9B5CFF',
    color2: '#00E5FF',
    tall: false,
  },
  {
    user: '@setup.god',
    caption: 'desk setup never looked better tbh',
    likes: '4.7K',
    color1: '#00E5FF',
    color2: '#C8FF00',
    tall: true,
  },
  {
    user: '@colorwave_',
    caption: 'unboxing this was a whole moment 📦',
    likes: '1.2K',
    color1: '#FF6416',
    color2: '#FF1F71',
    tall: false,
  },
  {
    user: '@neonshelf',
    caption: 'the glow is real omg',
    likes: '2.9K',
    color1: '#C8FF00',
    color2: '#9B5CFF',
    tall: true,
  },
];

function MockPost({ post, delay, inView }) {
  return (
    <div
      className={`group relative rounded-2xl overflow-hidden border border-sfx-border bg-sfx-card
        hover:-translate-y-1 hover:border-opacity-60 transition-all duration-300 cursor-pointer noise
        ${post.tall ? 'row-span-2' : ''}
        ${inView ? 'animate-fade-up opacity-100' : 'opacity-0'}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Visual mockup */}
      <div
        className={`w-full ${post.tall ? 'h-72' : 'h-36'} relative overflow-hidden`}
        style={{ background: `linear-gradient(135deg, ${post.color1}30 0%, ${post.color2}20 100%)` }}
      >
        {/* Central abstract glass art */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="animate-float"
            style={{ animationDelay: `${delay * 0.001}s` }}
          >
            <svg
              width={post.tall ? 80 : 60}
              height={post.tall ? 120 : 90}
              viewBox="0 0 80 120"
              fill="none"
            >
              <defs>
                <linearGradient id={`pg${delay}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={post.color1} stopOpacity="0.9" />
                  <stop offset="100%" stopColor={post.color2} stopOpacity="0.7" />
                </linearGradient>
              </defs>
              <ellipse cx="40" cy="110" rx="26" ry="8" fill={post.color1} opacity="0.5" />
              <path d="M14 108 C14 108 10 84 12 62 C14 40 22 24 30 14 C33 10 37 6 40 4 C43 6 47 10 50 14 C58 24 66 40 68 62 C70 84 66 108 66 108 Z"
                fill={`url(#pg${delay})`} />
              <rect x="34" y="1" width="12" height="22" rx="6" fill={post.color2} opacity="0.85" />
            </svg>
          </div>
        </div>
        {/* Glow */}
        <div
          className="absolute inset-0 opacity-30"
          style={{ background: `radial-gradient(circle at 50% 50%, ${post.color1}, transparent 60%)` }}
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-sfx-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="flex items-center gap-1.5 text-white font-bold text-sm">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM8 9a6.5 6.5 0 0 0-6.5 6.5h13A6.5 6.5 0 0 0 8 9z" />
            </svg>
            {post.likes}
          </div>
        </div>
      </div>

      {/* Post info */}
      <div className="p-3">
        <p className="text-xs font-bold text-sfx-text mb-0.5">{post.user}</p>
        <p className="text-xs text-sfx-muted leading-snug">{post.caption}</p>
      </div>
    </div>
  );
}

export default function SocialGallery() {
  const [ref, inView] = useInView();

  return (
    <section className="py-24 px-6 lg:px-10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto" ref={ref}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="text-xs font-bold tracking-[0.18em] uppercase text-sfx-pink mb-3">Community</div>
            <h2
              className="font-black text-5xl lg:text-6xl leading-none tracking-tight"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              SEEN IN THE{' '}
              <span className="text-gradient-pink">WILD</span>
            </h2>
          </div>
          <a
            href="#"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-sfx-border text-sfx-muted text-sm font-bold hover:border-sfx-pink/40 hover:text-sfx-text transition-all"
          >
            Follow us
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M2 7h10M8 3l4 4-4 4" strokeLinecap="round" />
            </svg>
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 auto-rows-auto gap-3" style={{ gridAutoRows: '1fr' }}>
          {posts.map((p, i) => (
            <MockPost key={i} post={p} delay={i * 80} inView={inView} />
          ))}
        </div>

        {/* Tag CTA */}
        <p className="text-center text-sfx-muted text-sm mt-8">
          Tag{' '}
          <span className="text-sfx-pink font-bold">@sfxclub</span>
          {' '}to be featured. Use{' '}
          <span className="text-sfx-lime font-bold">#SFXCLUB</span>
        </p>
      </div>
    </section>
  );
}
