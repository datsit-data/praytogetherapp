// src/components/prayer-plan-orchestrator.tsx
"use client";

import { useActionState, useEffect, useState } from "react"; // Changed from react-dom to react for useActionState
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
  const [actionState, formAction] = useActionState(submitPrayerRequestAction, initialActionState); // Changed useFormState to useActionState
  const { toast } = useToast();
  const { t } = useLanguage(); 
  const [showForm, setShowForm] = useState(true);
  const [currentPlan, setCurrentPlan] = useState<SavedPrayerPlan | null>(null);


  useEffect(() => {
    if (actionState?.message && actionState.data) {
      toast({
        title: t('success'),
        description: actionState.message, 
        variant: "default",
      });
    }
    if (actionState?.error && !actionState.data) { 
      toast({
        title: t('error'),
        description: actionState.error, 
        variant: "destructive",
      });
    }
  }, [actionState, toast, t]);

  const handlePlanSaved = (savedPlan: SavedPrayerPlan) => {
    console.log("Plan saved in orchestrator:", savedPlan.id);
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
  
  if (currentPlan) {
     return <PrayerPlanDisplay plan={currentPlan} isSavedPlanView={true} />;
  }


  return (
    <div>
      {showForm && <PrayerPlanForm formAction={formAction} initialState={actionState} />}
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

