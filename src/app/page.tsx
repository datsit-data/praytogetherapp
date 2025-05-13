"use client"; 

import PrayerPlanOrchestrator from '@/components/prayer-plan-orchestrator';
import { useLanguage } from '@/contexts/language-context';

export default function HomePage() {
  const { t } = useLanguage(); 

  return (
    <div className="w-full max-w-2xl mx-auto">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-primary">{t('welcome')}</h1>
        <p className="text-lg text-muted-foreground">
          {t('tagline')}
        </p>
      </section>
      <PrayerPlanOrchestrator />
    </div>
  );
}
