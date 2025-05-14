// src/components/layout/suspense-fallback-loader.tsx
"use client";

import { Loader2 } from 'lucide-react';

export default function SuspenseFallbackLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="mt-4 text-lg">Loading application...</p>
    </div>
  );
}
