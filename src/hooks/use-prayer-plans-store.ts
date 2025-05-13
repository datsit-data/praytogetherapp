// src/hooks/use-prayer-plans-store.ts
"use client";

import type { CreatePrayerPlanOutput } from "@/ai/flows/create-prayer-plan";
import type { SavedPrayerPlan } from "@/types/prayer-plan";
import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "prayTogether_savedPlans";

export function usePrayerPlansStore() {
  const [savedPlans, setSavedPlans] = useState<SavedPrayerPlan[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const items = window.localStorage.getItem(STORAGE_KEY);
        if (items) {
          setSavedPlans(JSON.parse(items));
        }
      } catch (error) {
        console.error("Error reading saved plans from localStorage:", error);
        // Fallback to empty array if parsing fails or localStorage is inaccessible
        setSavedPlans([]);
      }
      setIsInitialized(true);
    }
  }, []);

  const updateLocalStorage = useCallback((plans: SavedPrayerPlan[]) => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
      } catch (error) {
        console.error("Error writing saved plans to localStorage:", error);
      }
    }
  }, []);

  const savePlan = useCallback((planToSave: CreatePrayerPlanOutput): SavedPrayerPlan | null => {
    if (!isInitialized) return null; // Don't save if not initialized

    const newPlan: SavedPrayerPlan = {
      ...planToSave,
      id: Date.now().toString(),
      savedAt: new Date().toISOString(),
    };

    setSavedPlans((prevPlans) => {
      const updatedPlans = [newPlan, ...prevPlans];
      updateLocalStorage(updatedPlans);
      return updatedPlans;
    });
    return newPlan;
  }, [isInitialized, updateLocalStorage]);

  const deletePlan = useCallback((planId: string) => {
    if (!isInitialized) return; 

    setSavedPlans((prevPlans) => {
      const updatedPlans = prevPlans.filter((plan) => plan.id !== planId);
      updateLocalStorage(updatedPlans);
      return updatedPlans;
    });
  }, [isInitialized, updateLocalStorage]);

  return {
    savedPlans,
    savePlan,
    deletePlan,
    isInitialized, // Expose initialization status
  };
}
