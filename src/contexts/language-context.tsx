// src/contexts/language-context.tsx
"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import type { Locale } from '@/lib/i18n';
import { getTranslations, translations as allTranslations } from '@/lib/i18n';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: keyof typeof allTranslations.en, params?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('es'); // Default to Spanish

  useEffect(() => {
    const storedLocale = localStorage.getItem('appLanguage') as Locale | null;
    if (storedLocale && (storedLocale === 'en' || storedLocale === 'es')) {
      setLocaleState(storedLocale);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    if (newLocale === 'en' || newLocale === 'es') {
        setLocaleState(newLocale);
        localStorage.setItem('appLanguage', newLocale);
    }
  };

  const t = (key: keyof typeof allTranslations.en, params?: Record<string, string>): string => {
    let text = getTranslations(locale)[key] || allTranslations.en[key]; // Fallback to English key if translation missing
    if (!text && key) { // Fallback to key itself if not found in English either
        text = key;
    }
    if (params) {
      Object.keys(params).forEach(paramKey => {
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), params[paramKey]);
      });
    }
    return text;
  };


  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

