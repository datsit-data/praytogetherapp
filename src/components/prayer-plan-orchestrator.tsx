// src/components/prayer-plan-orchestrator.tsx
"use client";

import { useActionState, useEffect, useState } from "react"; 
import PrayerPlanForm from "./prayer-plan-form";
import PrayerPlanDisplay from "./prayer-plan-display";
import { submitPrayerRequestAction, type PrayerPlanState } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Terminal } from "lucide-react";
import type { SavedPrayerPlan } from "@/types/prayer-plan";
import type { CreatePrayerPlanOutput } from "@/ai/flows/create-prayer-plan";
import { useLanguage } from "@/contexts/language-context"; 

const initialActionState: PrayerPlanState = {
  data: undefined,
  input: undefined,
  error: undefined,
  message: undefined,
};

export default function PrayerPlanOrchestrator() {
  const { locale, t } = useLanguage(); 
  
  const boundFormAction = submitPrayerRequestAction.bind(null, locale);
  
  const [internalActionState, formAction, isPending] = useActionState(boundFormAction, initialActionState);
  const { toast } = useToast();
  
  const [planToDisplay, setPlanToDisplay] = useState<CreatePrayerPlanOutput | SavedPrayerPlan | null>(null);
  const [formKey, setFormKey] = useState(0); // Key for resetting the PrayerPlanForm component
  const [currentFormInitialState, setCurrentFormInitialState] = useState<PrayerPlanState>(initialActionState);


  useEffect(() => {
    if (internalActionState?.data && !internalActionState.error) {
      toast({
        title: t('success'),
        description: internalActionState.message || t('planSavedDescription', { reason: internalActionState.data.prayerReasonContext }), 
        variant: "default",
      });
      setPlanToDisplay(internalActionState.data);
      // After successful plan generation, the *next* form (if "create another" is clicked) should be fresh.
      // currentFormInitialState will be reset by handleCreateAnotherPlan.
    }
    if (internalActionState?.error && !internalActionState.data) { 
      toast({
        title: t('error'),
        description: internalActionState.error, 
        variant: "destructive",
      });
      setPlanToDisplay(null); // Ensure form is shown on error
      setCurrentFormInitialState(internalActionState); // Pass error and input to form
    }
  }, [internalActionState, toast, t]);

  const handlePlanSaved = (savedPlan: SavedPrayerPlan) => {
    setPlanToDisplay(savedPlan); // Update display to show the saved version (e.g., with savedAt date)
    // Toast for saving is handled by PrayerPlanDisplay's internal save logic if it calls useToast
    // Or, if we want central control:
    // toast({
    //     title: t('planSavedTitle'),
    //     description: t('planSavedDescription', { reason: savedPlan.prayerReasonContext }),
    // });
  };

  const handleCreateAnotherPlan = () => {
    setPlanToDisplay(null); // Hide the current plan, to show the form
    setCurrentFormInitialState(initialActionState); // Reset form state for a new plan
    setFormKey(prevKey => prevKey + 1); // Increment key to re-mount and reset PrayerPlanForm
  };


  if (planToDisplay) {
    return (
      <div>
        <PrayerPlanDisplay 
          plan={planToDisplay} 
          onPlanSaved={handlePlanSaved}
          isSavedPlanView={'id' in planToDisplay} // Check if it's a SavedPrayerPlan
        />
        <div className="mt-8 flex justify-center">
          <Button onClick={handleCreateAnotherPlan} size="lg">
            {t('createAnotherPlan')}
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <PrayerPlanForm
        key={formKey}
        formAction={formAction}
        initialState={currentFormInitialState}
      />
      {currentFormInitialState?.error && !currentFormInitialState.data && (
         <Alert variant="destructive" className="mt-6">
           <Terminal className="h-4 w-4" />
           <AlertTitle>{t('planGenerationFailedTitle')}</AlertTitle>
           <AlertDescription>
             {t('planGenerationFailedDescription', { error: currentFormInitialState.error })}
           </AlertDescription>
         </Alert>
      )}
    </div>
  );
}

