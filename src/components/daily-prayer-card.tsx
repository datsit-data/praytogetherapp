import type { CreatePrayerPlanOutput } from "@/ai/flows/create-prayer-plan";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Quote, Info, Sparkles } from "lucide-react";

interface DailyPrayerCardProps {
  dailyContent: CreatePrayerPlanOutput["prayerPlan"][0];
}

export default function DailyPrayerCard({ dailyContent }: DailyPrayerCardProps) {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-md bg-secondary/20 border border-secondary">
        <div className="flex items-start gap-3 mb-2">
          <Quote className="h-5 w-5 text-primary mt-1 shrink-0" />
          <h3 className="text-lg font-semibold text-primary">Scripture for the Day</h3>
        </div>
        <p className="italic text-foreground pl-8">&quot;{dailyContent.bibleVerse}&quot;</p>
      </div>

      <div className="p-4 rounded-md bg-muted/20 border border-muted">
        <div className="flex items-start gap-3 mb-2">
          <Info className="h-5 w-5 text-primary mt-1 shrink-0" />
          <h3 className="text-lg font-semibold text-primary">Reflection</h3>
        </div>
        <p className="text-foreground pl-8">{dailyContent.rationale}</p>
      </div>

      <div className="p-4 rounded-md bg-accent/10 border border-accent/50">
        <div className="flex items-start gap-3 mb-2">
          <Sparkles className="h-5 w-5 text-accent mt-1 shrink-0" />
          <h3 className="text-lg font-semibold text-accent">Guided Prayer</h3>
        </div>
        <p className="text-foreground pl-8">{dailyContent.prayer}</p>
      </div>
    </div>
  );
}
