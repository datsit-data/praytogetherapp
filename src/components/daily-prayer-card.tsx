// src/components/daily-prayer-card.tsx
import type { CreatePrayerPlanOutput } from "@/ai/flows/create-prayer-plan";
import { BookText, Lightbulb, Sparkles, ClipboardCheck, Star } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

interface DailyPrayerCardProps {
  dailyContent: CreatePrayerPlanOutput["prayerPlan"][0];
}

export default function DailyPrayerCard({ dailyContent }: DailyPrayerCardProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-md bg-secondary/20 border border-secondary">
        <div className="flex items-start gap-3 mb-2">
          <BookText className="h-5 w-5 text-primary mt-1 shrink-0" />
          <h3 className="text-lg font-semibold text-primary">Scripture for the Day: {dailyContent.bibleVerse}</h3>
        </div>
        <blockquote className="italic text-foreground pl-8 whitespace-pre-line">
          &quot;{dailyContent.bibleVerseText}&quot;
        </blockquote>
      </div>

      <div className="p-4 rounded-md bg-muted/50 border border-muted">
        <div className="flex items-start gap-3 mb-2">
          <Lightbulb className="h-5 w-5 text-primary mt-1 shrink-0" />
          <h3 className="text-lg font-semibold text-primary">{t('reflectionTitle')}</h3>
        </div>
        <p className="text-foreground pl-8 whitespace-pre-line">{dailyContent.reflection}</p>
      </div>
      
      {dailyContent.tipOfTheDay && (
        <div className="p-4 rounded-md bg-primary/10 border border-primary/30">
          <div className="flex items-start gap-3 mb-2">
            <Star className="h-5 w-5 text-primary mt-1 shrink-0" />
            <h3 className="text-lg font-semibold text-primary">{t('tipOfTheDayTitle')}</h3>
          </div>
          <p className="text-foreground pl-8 whitespace-pre-line">{dailyContent.tipOfTheDay}</p>
        </div>
      )}

      {dailyContent.actionableSteps && (
         <div className="p-4 rounded-md bg-accent/10 border border-accent/30">
          <div className="flex items-start gap-3 mb-2">
            <ClipboardCheck className="h-5 w-5 text-accent mt-1 shrink-0" />
            <h3 className="text-lg font-semibold text-accent">{t('actionableStepsTitle')}</h3>
          </div>
          <div className="text-foreground pl-8 whitespace-pre-line">{dailyContent.actionableSteps}</div>
        </div>
      )}

      <div className="p-4 rounded-md bg-accent/20 border border-accent/50">
        <div className="flex items-start gap-3 mb-2">
          <Sparkles className="h-5 w-5 text-accent mt-1 shrink-0" />
          <h3 className="text-lg font-semibold text-accent">{t('guidedPrayerTitle')}</h3>
        </div>
        <p className="text-foreground pl-8 whitespace-pre-line">{dailyContent.prayer}</p>
      </div>
    </div>
  );
}
