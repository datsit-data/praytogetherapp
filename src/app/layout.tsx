import type { Metadata } from 'next';
import { Lato } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import AppHeader from '@/components/layout/app-header';
import AppFooter from '@/components/layout/app-footer';
import { LanguageProvider } from '@/contexts/language-context';

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-lato',
});

export const metadata: Metadata = {
  title: 'PrayTogether - Personalized Prayer Plans',
  description: 'Let AI help you craft a meaningful prayer journey based on your needs. Join us to pray together.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lato.variable} font-sans antialiased flex flex-col min-h-screen`}>
        <LanguageProvider>
          <AppHeader />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <AppFooter />
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
