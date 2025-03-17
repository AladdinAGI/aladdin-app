import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Theme } from '@radix-ui/themes';
import Header from '@/components/common/Header';
import { Locale } from '@/app/i18n/config';
import { Web3Provider } from '@/components/common/Web3Provider';
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Aladdin App',
  description: 'Aladdin AI',
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  // 等待 params 解析
  const resolvedParams = await params;

  return (
    <html lang={resolvedParams.lang}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Theme>
          <Web3Provider>
            <Header lang={resolvedParams.lang} />
            {children}
          </Web3Provider>
        </Theme>
      </body>
    </html>
  );
}
