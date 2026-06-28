import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'AI Investment Research Agent',
  description: 'AI-powered investment research and synthesis dashboard. Get instant INVEST or PASS verdicts for any company.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} font-sans scroll-smooth`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
