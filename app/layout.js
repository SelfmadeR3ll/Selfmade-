import './globals.css';

export const metadata = {
  title: 'SFX CLUB — Loud Design. Clean Energy.',
  description:
    'SFX CLUB creates collectible lifestyle pieces with bold color, playful attitude, and premium design made to stand out on your shelf and your feed.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syne:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="bg-sfx-black text-sfx-text"
        style={{ '--font-display': "'Syne'", '--font-body': "'Space Grotesk'" }}
      >
        {children}
      </body>
    </html>
  );
}
