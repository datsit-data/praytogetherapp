// src/app/saved-plans/page.tsx
"use client";

import { useEffect, useState } from "react";
import { usePrayerPlansStore } from "@/hooks/use-prayer-plans-store";
import type { SavedPrayerPlan } from "@/types/prayer-plan";
import PrayerPlanDisplay from "@/components/prayer-plan-display";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Trash2, Info, CalendarClock } from "lucide-react";
import { format, parseISO } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function SavedPlansPage() {
  const { savedPlans, deletePlan, isInitialized } = usePrayerPlansStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isInitialized) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-muted-foreground">Loading saved plans...</p>
      </div>
    );
  }

  if (savedPlans.length === 0) {
    return (
      <Card className="mt-8 shadow-lg w-full max-w-md mx-auto">
        <CardHeader className="items-center">
          <Info className="h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-2xl">No Saved Plans Yet</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            You haven&apos;t saved any prayer plans. Create a new plan from the homepage and save it to see it here.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Sort plans by savedAt date, newest first
  const sortedPlans = [...savedPlans].sort((a, b) => parseISO(b.savedAt).getTime() - parseISO(a.savedAt).getTime());


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-primary text-center">Your Saved Prayer Plans</h1>
      
      <Accordion type="multiple" className="w-full space-y-4">
        {sortedPlans.map((plan) => (
          <AccordionItem key={plan.id} value={plan.id} className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4">
              <AccordionTrigger className="flex-1 text-left hover:no-underline">
                <div className="flex flex-col">
                   <span className="font-semibold text-primary text-lg">
                    Plan for: &quot;{plan.prayerReasonContext.length > 50 ? `${plan.prayerReasonContext.substring(0, 50)}...` : plan.prayerReasonContext}&quot;
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <CalendarClock size={14} /> Saved: {format(parseISO(plan.savedAt), "MMM d, yyyy h:mm a")} ({plan.languageContext})
                  </span>
                </div>
              </AccordionTrigger>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-4 text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-5 w-5" />
                    <span className="sr-only">Delete plan</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete this prayer plan.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deletePlan(plan.id)} className="bg-destructive hover:bg-destructive/90">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <AccordionContent className="px-6 pb-6 border-t border-border">
              {/* Pass isSavedPlanView to hide the "Save Plan" button again */}
              <PrayerPlanDisplay plan={plan} isSavedPlanView={true} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
