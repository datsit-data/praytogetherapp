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
import { useAuth } from "@/contexts/auth-context"; // Added

const initialActionState: PrayerPlanState = {
  data: undefined,
  input: undefined,
  error: undefined,
  message: undefined,
};

export default function PrayerPlanOrchestrator() {
  const { locale, t } = useLanguage(); 
  const { userProfile } = useAuth(); // Added: Get userProfile for Bible version

  // Bind currentLocale and preferredBibleVersion to the action
  const boundFormAction = submitPrayerRequestAction.bind(
    null, 
    locale, 
    userProfile?.preferredBibleVersion // Pass preferred Bible version
  );
  
  const [internalActionState, formAction, isPending] = useActionState(boundFormAction, initialActionState);
  const { toast } = useToast();
  
  const [planToDisplay, setPlanToDisplay] = useState<CreatePrayerPlanOutput | SavedPrayerPlan | null>(null);
  const [formKey, setFormKey] = useState(0); 
  const [currentFormInitialState, setCurrentFormInitialState] = useState<PrayerPlanState>(initialActionState);


  useEffect(() => {
    if (internalActionState?.data && !internalActionState.error) {
      toast({
        title: t('success'),
        description: internalActionState.message || t('planGeneratedSuccessMessage', { reason: internalActionState.data.prayerReasonContext }), 
        variant: "default",
      });
      setPlanToDisplay(internalActionState.data);
    }
    if (internalActionState?.error && !internalActionState.data) { 
      toast({
        title: t('error'),
        description: internalActionState.error, 
        variant: "destructive",
      });
      setPlanToDisplay(null); 
      setCurrentFormInitialState(internalActionState); 
    }
  }, [internalActionState, toast, t]);

  const handlePlanSaved = (savedPlan: SavedPrayerPlan) => {
    setPlanToDisplay(savedPlan); 
  };

  const handleCreateAnotherPlan = () => {
    setPlanToDisplay(null); 
    setCurrentFormInitialState(initialActionState); 
    setFormKey(prevKey => prevKey + 1); 
  };


  if (planToDisplay) {
    return (
      <div>
        <PrayerPlanDisplay 
          plan={planToDisplay} 
          onPlanSaved={handlePlanSaved}
          isSavedPlanView={'id' in planToDisplay} 
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
