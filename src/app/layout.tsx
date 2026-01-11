import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Silk Stride | Running Club - Tashkent',
  description: 'Silk Stride is a running club based in Tashkent, organizing marathon trips across the ancient Silk Road - from Samarkand to Almaty, Bukhara to Barsa Kelmes.',
  keywords: ['running club', 'marathon', 'Tashkent', 'Uzbekistan', 'Silk Road', 'trail running'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logos/icon-gold.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logos/icon-gold.png" />
      </head>
      <body>
        {/* Papyrus background texture */}
        <div className="papyrus-bg" aria-hidden="true" />
        
        <main>{children}</main>
      </body>
    </html>
  );
}
