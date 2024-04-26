import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { Providers } from './providers';
import { IBM_Plex_Sans } from 'next/font/google';
import '@/styles/globals.css';

// const inter = Inter({ subsets: ['latin'] }); // Switching away for now
const inter = IBM_Plex_Sans({ weight: ['100', '200', '300', '500', '700'], subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ZephyrShare',
  description: 'Securely share your financial market data',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
