// src/components/prayer-plan-orchestrator.tsx
"use client";

import { useFormState } from "react-dom";
import PrayerPlanForm from "./prayer-plan-form";
import PrayerPlanDisplay from "./prayer-plan-display";
import { submitPrayerRequestAction, type PrayerPlanState } from "@/app/actions";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, CheckCircle } from "lucide-react";
import type { SavedPrayerPlan } from "@/types/prayer-plan";

const initialActionState: PrayerPlanState = {
  data: undefined,
  input: undefined,
  error: undefined,
  message: undefined,
};

export default function PrayerPlanOrchestrator() {
  const [actionState, formAction] = useFormState(submitPrayerRequestAction, initialActionState);
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(true);
  // Local state to hold the plan if we decide to hide the form post-generation/saving
  const [currentPlan, setCurrentPlan] = useState<SavedPrayerPlan | null>(null);


  useEffect(() => {
    if (actionState?.message && actionState.data) {
      toast({
        title: "Success!",
        description: actionState.message,
        variant: "default",
      });
      // Optionally, update currentPlan here if you want to persist display after form state changes
      // setCurrentPlan(actionState.data); // This might not be needed if actionState.data persists
    }
    if (actionState?.error && !actionState.data) { 
      toast({
        title: "Error",
        description: actionState.error,
        variant: "destructive",
      });
    }
  }, [actionState, toast]);

  const handlePlanSaved = (savedPlan: SavedPrayerPlan) => {
    // Potentially hide the form or navigate away, or just show a persistent success message
    // For now, we'll just allow the user to make a new plan or navigate.
    // If we wanted to show *only* the saved plan, we'd set currentPlan and hide the form.
    // e.g. setCurrentPlan(savedPlan); setShowForm(false);
    console.log("Plan saved in orchestrator:", savedPlan.id);
  };


  if (actionState?.data) {
    return (
      <div>
        <PrayerPlanDisplay 
          plan={actionState.data} 
          onPlanSaved={handlePlanSaved}
        />
        {/* Optionally, add a button to create a new plan, which would reset actionState or setShowForm(true) */}
      </div>
    );
  }
  
  // If currentPlan is set (e.g., after saving and deciding to hide form), show it
  if (currentPlan) {
     return <PrayerPlanDisplay plan={currentPlan} isSavedPlanView={true} />;
  }


  return (
    <div>
      {showForm && <PrayerPlanForm formAction={formAction} initialState={actionState} />}
      {actionState?.error && !actionState.data && (
         <Alert variant="destructive" className="mt-6">
           <Terminal className="h-4 w-4" />
           <AlertTitle>Plan Generation Failed</AlertTitle>
           <AlertDescription>
             {actionState.error} Please try modifying your prayer reason or try again later.
           </AlertDescription>
         </Alert>
      )}
       {actionState?.message && !actionState.data && actionState.error && ( // A case where there's a message but also an error, e.g. validation error
         <Alert variant="destructive" className="mt-6">
           <Terminal className="h-4 w-4" />
           <AlertTitle>Notice</AlertTitle>
           <AlertDescription>
             {actionState.error}
           </AlertDescription>
         </Alert>
      )}
    </div>
  );
}
