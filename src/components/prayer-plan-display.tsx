// src/components/prayer-plan-display.tsx
"use client";

import type { CreatePrayerPlanOutput } from "@/ai/flows/create-prayer-plan";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import DailyPrayerCard from "./daily-prayer-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Save } from "lucide-react"; // Removed CalendarDays as it's no longer used
import { usePrayerPlansStore } from "@/hooks/use-prayer-plans-store";
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import type { SavedPrayerPlan } from "@/types/prayer-plan";
import { useLanguage } from "@/contexts/language-context"; 

interface PrayerPlanDisplayProps {
  plan: CreatePrayerPlanOutput | SavedPrayerPlan; 
  isSavedPlanView?: boolean; 
  onPlanSaved?: (savedPlan: SavedPrayerPlan) => void; 
}

export default function PrayerPlanDisplay({ plan, isSavedPlanView = false, onPlanSaved }: PrayerPlanDisplayProps) {
  const { savePlan: storeSavePlan } = usePrayerPlansStore();
  const { toast } = useToast();
  const { t } = useLanguage(); 

  const handleSavePlan = () => {
    const planToSave: CreatePrayerPlanOutput = {
        prayerReasonContext: plan.prayerReasonContext,
        languageContext: plan.languageContext,
        prayerPlan: plan.prayerPlan,
        recommendedDays: plan.recommendedDays, // Still pass it to save, even if not displayed prominently
        planDurationSuggestion: plan.planDurationSuggestion, // Still pass it to save
    };
    
    const savedPlan = storeSavePlan(planToSave);
    if (savedPlan) {
        toast({
            title: t('planSavedTitle'),
            description: t('planSavedDescription', { reason: plan.prayerReasonContext }),
        });
        if (onPlanSaved) {
            onPlanSaved(savedPlan);
        }
    } else {
         toast({
            title: t('errorSavingPlanTitle'),
            description: t('errorSavingPlanDescription'),
            variant: "destructive",
        });
    }
  };

  if (!plan || !plan.prayerPlan || plan.prayerPlan.length === 0) {
    return (
      <Card className="mt-8 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-destructive">{t('noPlanGeneratedTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            {t('noPlanGeneratedDescription')}
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="mt-12 space-y-8">
      <Card className="shadow-lg border-primary/50">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-primary">{t('yourPersonalizedPlan')}</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            {t('for')} &quot;{plan.prayerReasonContext}&quot; ({t('language')}: {plan.languageContext})
            { (plan as SavedPrayerPlan).savedAt && (
              <span className="block text-xs mt-1">{t('savedOn')}: {format(new Date((plan as SavedPrayerPlan).savedAt), "PPP p")}</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Removed the recommended days and duration block */}
          {!isSavedPlanView && (
            <div className="flex justify-end mt-4">
              <Button onClick={handleSavePlan}>
                <Save className="mr-2 h-4 w-4" />
                {t('saveThisPlan')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Accordion type="single" collapsible className="w-full space-y-4" defaultValue="item-0">
        {plan.prayerPlan.map((dailyContent, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
            <AccordionTrigger className="px-6 py-4 text-left hover:bg-secondary/30 transition-colors">
              <span className="font-semibold text-primary text-lg">{dailyContent.day}: Focus on {dailyContent.bibleVerse.split(':')[0]}</span>
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4 border-t border-border">
              <DailyPrayerCard dailyContent={dailyContent} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

