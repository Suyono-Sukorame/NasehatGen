import type {Metadata} from 'next';
import { Inter, Playfair_Display, Outfit } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'Daily Nasehat Flyer Generator',
  description: 'Create beautiful Islamic daily advice flyers for Instagram',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${outfit.variable}`}>
      <body suppressHydrationWarning className="bg-zinc-50 text-zinc-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
