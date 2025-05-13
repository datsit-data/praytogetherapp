// src/components/prayer-plan-orchestrator.tsx
"use client";

import { useActionState, useEffect, useState } from "react"; 
import PrayerPlanForm from "./prayer-plan-form";
import PrayerPlanDisplay from "./prayer-plan-display";
import { submitPrayerRequestAction, type PrayerPlanState } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import type { SavedPrayerPlan } from "@/types/prayer-plan";
import { useLanguage } from "@/contexts/language-context"; 

const initialActionState: PrayerPlanState = {
  data: undefined,
  input: undefined,
  error: undefined,
  message: undefined,
};

export default function PrayerPlanOrchestrator() {
  const { locale, t } = useLanguage(); 
  
  // Bind the current locale to the server action
  const boundFormAction = submitPrayerRequestAction.bind(null, locale);
  
  const [actionState, formAction] = useActionState(boundFormAction, initialActionState);
  const { toast } = useToast();
  
  const [showForm, setShowForm] = useState(true); // Kept for potential future use, though not strictly necessary now
  const [currentPlan, setCurrentPlan] = useState<SavedPrayerPlan | null>(null);


  useEffect(() => {
    if (actionState?.message && actionState.data) {
      toast({
        title: t('success'),
        description: actionState.message, 
        variant: "default",
      });
       // If a plan is successfully generated, we expect to show the display, not the form.
      setShowForm(false); 
    }
    if (actionState?.error && !actionState.data) { 
      toast({
        title: t('error'),
        description: actionState.error, 
        variant: "destructive",
      });
      setShowForm(true); // If error, keep showing form or allow re-try
    }
  }, [actionState, toast, t]);

  const handlePlanSaved = (savedPlan: SavedPrayerPlan) => {
    console.log("Plan saved in orchestrator:", savedPlan.id);
    // Potentially set currentPlan here if we want to keep showing it after saving
    // For now, if a plan is saved from the display, the display itself handles its state.
  };


  if (actionState?.data) {
    return (
      <div>
        <PrayerPlanDisplay 
          plan={actionState.data} 
          onPlanSaved={handlePlanSaved}
        />
      </div>
    );
  }
  
  // This logic might need adjustment based on UX flow, e.g., if we want to show a saved plan directly
  if (currentPlan) { 
     return <PrayerPlanDisplay plan={currentPlan} isSavedPlanView={true} />;
  }

  // Default to showing the form if no data/plan is active
  return (
    <div>
      <PrayerPlanForm formAction={formAction} initialState={actionState} />
      {actionState?.error && !actionState.data && (
         <Alert variant="destructive" className="mt-6">
           <Terminal className="h-4 w-4" />
           <AlertTitle>{t('planGenerationFailedTitle')}</AlertTitle>
           <AlertDescription>
             {t('planGenerationFailedDescription', { error: actionState.error })}
           </AlertDescription>
         </Alert>
      )}
       {actionState?.message && !actionState.data && actionState.error && ( 
         <Alert variant="destructive" className="mt-6">
           <Terminal className="h-4 w-4" />
           <AlertTitle>{t('notice')}</AlertTitle>
           <AlertDescription>
             {actionState.error}
           </AlertDescription>
         </Alert>
      )}
    </div>
  );
}
