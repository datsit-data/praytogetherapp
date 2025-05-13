// src/components/layout/app-header.tsx
"use client"; 

import { Sparkles, ListChecks, LanguagesIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/language-context'; 
import type { Locale } from '@/lib/i18n'; 
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; 

export default function AppHeader() {
  const { locale, setLocale, t } = useLanguage(); 

  const handleLanguageChange = (value: string) => {
    setLocale(value as Locale);
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
          <Sparkles className="h-7 w-7 text-accent" />
          <span>{t('appName')}</span> 
        </Link>
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/saved-plans" className="flex items-center gap-2">
              <ListChecks className="h-5 w-5" />
              {t('savedPlansNav')} 
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <LanguagesIcon className="h-5 w-5 text-muted-foreground" />
            <Select value={locale} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-auto min-w-[120px] h-9 text-sm" aria-label={t('selectAppLanguage')}>
                <SelectValue placeholder={t('selectLanguage')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">{t('english')}</SelectItem>
                <SelectItem value="es">{t('spanish')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </nav>
      </div>
    </header>
  );
}
