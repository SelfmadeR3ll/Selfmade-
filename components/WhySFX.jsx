'use client';
import { useInView } from '../hooks/useInView';

const features = [
  {
    icon: '🎨',
    title: 'Bold Design',
    desc: 'Not basic. Not quiet. Every piece is designed to stop the scroll — on your shelf and in your feed.',
    color: '#C8FF00',
    delay: 0,
  },
  {
    icon: '💎',
    title: 'Quality Build',
    desc: 'Premium borosilicate glass. Collector-grade finish. Made to feel like art, not an afterthought.',
    color: '#00E5FF',
    delay: 100,
  },
  {
    icon: '📸',
    title: 'Content Ready',
    desc: 'Color-forward. Light-catching. Built to look insane on camera. Your setup will never look basic again.',
    color: '#FF1F71',
    delay: 200,
  },
  {
    icon: '⚡',
    title: 'Limited Drops',
    desc: 'Small-run releases. Hype-energy launches. Once a drop sells out, it\'s gone. Collector culture by design.',
    color: '#9B5CFF',
    delay: 300,
  },
];

export default function WhySFX() {
  const [ref, inView] = useInView();

  return (
    <section id="about" className="py-24 px-6 lg:px-10 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-sfx-purple/6 blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-sfx-cyan/6 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10" ref={ref}>
        {/* Header */}
        <div className="text-center mb-16">
          <div className="text-xs font-bold tracking-[0.18em] uppercase text-sfx-lime mb-4">Why us</div>
          <h2
            className="font-black text-5xl lg:text-7xl leading-none tracking-tight"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            WHY{' '}
            <span className="text-gradient-multi">SFX CLUB?</span>
          </h2>
          <p className="text-sfx-muted mt-5 text-lg max-w-xl mx-auto">
            We're not a generic store. We're a creative studio that makes objects worth caring about.
          </p>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <div
              key={i}
              className={`group relative rounded-3xl p-6 bg-sfx-card border border-sfx-border
                hover:-translate-y-2 hover:border-opacity-60 transition-all duration-300 noise
                ${inView ? 'animate-fade-up opacity-100' : 'opacity-0'}`}
              style={{
                animationDelay: `${f.delay}ms`,
                background: `linear-gradient(#12121A, #12121A) padding-box, linear-gradient(135deg, ${f.color}33, transparent) border-box`,
                border: '1px solid transparent',
              }}
            >
              {/* Glow on hover */}
              <div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none blur-sm"
                style={{ background: f.color }}
              />

              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5 transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${f.color}18`, border: `1px solid ${f.color}30` }}
              >
                {f.icon}
              </div>

              <h3
                className="font-black text-xl mb-3 text-sfx-text"
                style={{ fontFamily: 'Syne, sans-serif', color: f.color }}
              >
                {f.title}
              </h3>
              <p className="text-sfx-muted text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA strip */}
        <div className="mt-12 rounded-3xl border border-sfx-border bg-sfx-card p-8 flex flex-col sm:flex-row items-center justify-between gap-6 noise">
          <div>
            <div className="font-black text-2xl text-sfx-text" style={{ fontFamily: 'Syne, sans-serif' }}>
              Ready to join the club?
            </div>
            <p className="text-sfx-muted text-sm mt-1">Get early access to drops before the general public.</p>
          </div>
          <a
            href="#email"
            className="whitespace-nowrap px-8 py-3.5 rounded-full bg-sfx-lime text-sfx-black font-black text-sm tracking-wider hover:shadow-lime-glow hover:-translate-y-0.5 transition-all duration-200"
          >
            Get Early Access
          </a>
        </div>
      </div>
    </section>
  );
}
