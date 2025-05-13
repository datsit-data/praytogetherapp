"use client";

import { useFormState } from "react-dom";
import PrayerPlanForm from "./prayer-plan-form";
import PrayerPlanDisplay from "./prayer-plan-display";
import { submitPrayerRequestAction, type PrayerPlanState } from "@/app/actions";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

const initialState: PrayerPlanState = {
  data: undefined,
  error: undefined,
  message: undefined,
};

export default function PrayerPlanOrchestrator() {
  const [state, formAction] = useFormState(submitPrayerRequestAction, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.message) {
      toast({
        title: "Success!",
        description: state.message,
        variant: "default",
      });
    }
    if (state?.error && !state.data) { // Only show toast if there's an error and no data (i.e. plan generation failed)
      toast({
        title: "Error",
        description: state.error,
        variant: "destructive",
      });
    }
  }, [state, toast]);

  if (state?.data) {
    return <PrayerPlanDisplay plan={state.data} />;
  }

  return (
    <div>
      <PrayerPlanForm formAction={formAction} initialState={state} />
      {state?.error && !state.data && (
         <Alert variant="destructive" className="mt-6">
           <Terminal className="h-4 w-4" />
           <AlertTitle>Plan Generation Failed</AlertTitle>
           <AlertDescription>
             {state.error} Please try modifying your prayer reason or try again later.
           </AlertDescription>
         </Alert>
      )}
    </div>
  );
}
