
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import AppHeader from '@/components/layout/app-header';
import AppFooter from '@/components/layout/app-footer';
import { LanguageProvider } from '@/contexts/language-context';
import { AuthProvider } from '@/contexts/auth-context'; 
import { Suspense } from 'react';
import SuspenseFallbackLoader from '@/components/layout/suspense-fallback-loader';

export const metadata: Metadata = {
  title: 'PrayAI - Personalized Prayer Plans',
  description: 'Let AI help you craft a meaningful prayer journey based on your needs. Join us to pray together.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className={`font-sans antialiased flex flex-col min-h-screen`}>
        <LanguageProvider>
          <Suspense fallback={<SuspenseFallbackLoader />}>
            <AuthProvider>
              <AppHeader />
              <main className="flex-grow container mx-auto px-4 py-8">
                {children}
              </main>
              <AppFooter />
              <Toaster />
            </AuthProvider>
          </Suspense>
        </LanguageProvider>
      </body>
    </html>
  );
}
