import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import "./globals.css";
import { Providers } from './providers';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';

export const metadata: Metadata = {
  title: 'EcoCoin Space | Cultivate Virtual Trees & Earn EcoCoin',
  description:
    'Promote environmental sustainability through a blockchain-powered game. Grow virtual trees and earn EcoCoin rewards on Base L2.',
  openGraph: {
    title: 'EcoCoin Space | Cultivate Virtual Trees & Earn EcoCoin',
    description:
      'Promote environmental sustainability through a blockchain-powered game. Grow virtual trees and earn EcoCoin rewards on Base L2.',
    url: 'https://your-domain.com',
    images: [
      {
        url: 'https://your-domain.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'EcoCoin Space',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only px-4 py-2 bg-white dark:bg-black"
        >
          Skip to content
        </a>
        <Providers>
          <Navbar />
          <main id="main-content" className="pt-16">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
