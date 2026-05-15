import type {Metadata} from 'next';
import { Inter, Oswald, Montserrat } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-oswald-family',
  weight: ['400', '500', '600', '700'],
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat-family',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Daily Nasehat Flyer Generator',
  description: 'Create beautiful Islamic daily advice flyers for Instagram',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${oswald.variable} ${montserrat.variable}`}>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=camera_alt,public,send" />
      </head>
      <body suppressHydrationWarning className="bg-zinc-50 text-zinc-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
