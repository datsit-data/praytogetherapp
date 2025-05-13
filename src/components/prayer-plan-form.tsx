"use client";

import { useFormStatus } from "react-dom";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Send, Loader2 } from "lucide-react";
import type { PrayerPlanState } from "@/app/actions";

interface PrayerPlanFormProps {
  formAction: (payload: FormData) => void;
  initialState: PrayerPlanState | null;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating Plan...
        </>
      ) : (
        <>
          <Send className="mr-2 h-4 w-4" />
          Create My Prayer Plan
        </>
      )}
    </Button>
  );
}

export default function PrayerPlanForm({ formAction, initialState }: PrayerPlanFormProps) {
  return (
    <form action={formAction} className="space-y-6 p-6 bg-card rounded-lg shadow-md">
      <div>
        <Label htmlFor="prayerReason" className="block text-lg font-medium mb-2">
          What would you like to pray for?
        </Label>
        <Textarea
          id="prayerReason"
          name="prayerReason"
          placeholder="E.g., for strength during a challenging time, for guidance in a decision, for gratitude for blessings received..."
          rows={5}
          required
          className="text-base"
        />
        {initialState?.error && !initialState.data && (
           <p className="text-sm text-destructive mt-2">{initialState.error}</p>
        )}
      </div>
      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
