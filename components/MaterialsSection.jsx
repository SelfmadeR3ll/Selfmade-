'use client';
import { useInView } from '../hooks/useInView';

const materials = [
  {
    icon: '🔬',
    name: 'Borosilicate Glass',
    desc: 'Durable, heat-resistant, optically clear. The same material used in premium lab equipment and collectible art glass.',
    tag: 'Core Material',
    color: '#00E5FF',
  },
  {
    icon: '✋',
    name: 'Hand-Finished Detail',
    desc: 'Every piece passes through skilled hands before it ships. Silhouette, balance, and finish are reviewed piece by piece.',
    tag: 'Craft Process',
    color: '#C8FF00',
  },
  {
    icon: '🎨',
    name: 'Color-First Design',
    desc: 'Candy-toned palettes that photograph brilliantly. We design around color, not despite it. Loud is the point.',
    tag: 'Design DNA',
    color: '#FF1F71',
  },
  {
    icon: '🏆',
    name: 'Collector Energy',
    desc: 'Built like functional art for display and vibe. Limited quantities. Drop-model releases. Designed to be kept.',
    tag: 'Brand Philosophy',
    color: '#9B5CFF',
  },
];

export default function MaterialsSection() {
  const [ref, inView] = useInView();

  return (
    <section className="py-24 px-6 lg:px-10 bg-sfx-dark relative overflow-hidden">
      {/* Big bg text */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <span
          className="font-black text-[25vw] leading-none text-white/[0.02] whitespace-nowrap"
          style={{ fontFamily: 'Syne, sans-serif' }}
        >
          PURE
        </span>
      </div>

      <div className="max-w-7xl mx-auto relative z-10" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left text */}
          <div className={`transition-all duration-700 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <div className="text-xs font-bold tracking-[0.18em] uppercase text-sfx-lime mb-4">The Formula</div>
            <h2
              className="font-black text-5xl lg:text-6xl leading-none tracking-tight mb-6"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              WHAT WE'RE<br />
              <span className="text-gradient-multi">MADE OF</span>
            </h2>
            <p className="text-sfx-muted text-lg leading-relaxed mb-8 max-w-sm">
              No filler. No shortcuts. Every element of an SFX piece is intentional — from the glass formula to the color palette to the box it ships in.
            </p>

            {/* Accent stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { val: '100%', label: 'Borosilicate glass' },
                { val: 'Hand', label: 'Finished every piece' },
                { val: 'Lab', label: 'Quality tested' },
                { val: 'Small', label: 'Batch drops only' },
              ].map((s, i) => (
                <div key={i} className="rounded-2xl bg-sfx-card border border-sfx-border p-4">
                  <div className="text-sfx-lime font-black text-xl" style={{ fontFamily: 'Syne, sans-serif' }}>{s.val}</div>
                  <div className="text-sfx-muted text-xs mt-0.5 tracking-wide">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right cards */}
          <div className="grid gap-4">
            {materials.map((m, i) => (
              <div
                key={i}
                className={`group flex gap-5 items-start rounded-2xl p-5 border border-sfx-border bg-sfx-card
                  hover:border-opacity-60 hover:-translate-x-1 transition-all duration-300 noise
                  ${inView ? 'animate-fade-up opacity-100' : 'opacity-0'}`}
                style={{
                  animationDelay: `${i * 100}ms`,
                  background: `linear-gradient(#12121A, #12121A) padding-box, linear-gradient(90deg, ${m.color}22, transparent) border-box`,
                  border: '1px solid transparent',
                }}
              >
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-xl transition-transform duration-200 group-hover:scale-110"
                  style={{ background: `${m.color}18`, border: `1px solid ${m.color}30` }}
                >
                  {m.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <h4 className="font-black text-sfx-text" style={{ fontFamily: 'Syne, sans-serif', color: m.color }}>
                      {m.name}
                    </h4>
                    <span
                      className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
                      style={{ background: `${m.color}18`, color: m.color, border: `1px solid ${m.color}30` }}
                    >
                      {m.tag}
                    </span>
                  </div>
                  <p className="text-sfx-muted text-sm leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
