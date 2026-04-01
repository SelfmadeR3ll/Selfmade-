'use client';
const items = [
  '✦ Free Shipping on Orders Over $50',
  '★ Limited Drops — Once They\'re Gone, They\'re Gone',
  '⚡ New Drop Dropping Soon — Get on the List',
  '✦ Premium Glass Art  ·  Collector Energy',
  '★ 4.9 / 5 Stars  ·  50 K+ Happy Collectors',
  '⚡ Free Shipping on Orders Over $50',
];

export default function AnnouncementBar() {
  const text = items.join('   ');
  return (
    <div className="relative z-50 overflow-hidden bg-sfx-lime py-2.5">
      <div className="flex">
        {/* duplicate for seamless loop */}
        <div className="ticker-track">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="flex gap-10 px-5">
              {items.map((item, j) => (
                <span
                  key={j}
                  className="text-sfx-black text-xs font-bold tracking-widest uppercase whitespace-nowrap"
                >
                  {item}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
