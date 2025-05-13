"use client";

import type { CreatePrayerPlanOutput } from "@/ai/flows/create-prayer-plan";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import DailyPrayerCard from "./daily-prayer-card";
import { CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PrayerPlanDisplayProps {
  plan: CreatePrayerPlanOutput;
}

export default function PrayerPlanDisplay({ plan }: PrayerPlanDisplayProps) {
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
           {/* Introductory text block removed as per user request */}
        </CardContent>
      </Card>

      <Accordion type="single" collapsible className="w-full space-y-4">
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
