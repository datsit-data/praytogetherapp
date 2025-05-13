// src/components/prayer-plan-display.tsx
"use client";

import type { CreatePrayerPlanOutput } from "@/ai/flows/create-prayer-plan";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import DailyPrayerCard from "./daily-prayer-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CalendarDays, Save } from "lucide-react";
import { usePrayerPlansStore } from "@/hooks/use-prayer-plans-store";
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import type { SavedPrayerPlan } from "@/types/prayer-plan";

interface PrayerPlanDisplayProps {
  plan: CreatePrayerPlanOutput | SavedPrayerPlan; // Can be a newly generated or saved plan
  isSavedPlanView?: boolean; // To conditionally show save button or other elements
  onPlanSaved?: (savedPlan: SavedPrayerPlan) => void; // Optional callback after saving
}

export default function PrayerPlanDisplay({ plan, isSavedPlanView = false, onPlanSaved }: PrayerPlanDisplayProps) {
  const { savePlan: storeSavePlan } = usePrayerPlansStore();
  const { toast } = useToast();

  const handleSavePlan = () => {
    // Ensure we have the full CreatePrayerPlanOutput structure, even if it's already a SavedPrayerPlan
    // This is mainly to satisfy the storeSavePlan signature if it expects CreatePrayerPlanOutput
    const planToSave: CreatePrayerPlanOutput = {
        prayerReasonContext: plan.prayerReasonContext,
        languageContext: plan.languageContext,
        prayerPlan: plan.prayerPlan,
        recommendedDays: plan.recommendedDays,
        planDurationSuggestion: plan.planDurationSuggestion,
    };
    
    const savedPlan = storeSavePlan(planToSave);
    if (savedPlan) {
        toast({
            title: "Plan Saved!",
            description: `Your prayer plan for "${plan.prayerReasonContext}" has been saved.`,
        });
        if (onPlanSaved) {
            onPlanSaved(savedPlan);
        }
    } else {
         toast({
            title: "Error Saving Plan",
            description: "Could not save the plan. LocalStorage might be unavailable or full.",
            variant: "destructive",
        });
    }
  };

  if (!plan || !plan.prayerPlan || plan.prayerPlan.length === 0) {
    return (
      <Card className="mt-8 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-destructive">No Plan Generated</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            We couldn&apos;t generate a prayer plan based on your input. Please try rephrasing your reason or try again later.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="mt-12 space-y-8">
      <Card className="shadow-lg border-primary/50">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-primary">Your Personalized Prayer Plan</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            For: &quot;{plan.prayerReasonContext}&quot; (Language: {plan.languageContext})
            { (plan as SavedPrayerPlan).savedAt && (
              <span className="block text-xs mt-1">Saved on: {format(new Date((plan as SavedPrayerPlan).savedAt), "PPP p")}</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-md">
            <CalendarDays className="h-6 w-6 text-primary" />
            <div>
              <h3 className="font-semibold">Recommended Days & Duration</h3>
              <p className="text-sm text-muted-foreground">
                {plan.recommendedDays} for {plan.planDurationSuggestion}.
              </p>
            </div>
          </div>
          {!isSavedPlanView && (
            <div className="flex justify-end mt-4">
              <Button onClick={handleSavePlan}>
                <Save className="mr-2 h-4 w-4" />
                Save This Plan
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
