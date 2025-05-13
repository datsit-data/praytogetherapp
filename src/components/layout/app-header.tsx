// src/components/layout/app-header.tsx
import { Sparkles, ListChecks } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AppHeader() {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
          <Sparkles className="h-7 w-7 text-accent" />
          <span>PrayTogether</span>
        </Link>
        <nav>
          <Button variant="ghost" asChild>
            <Link href="/saved-plans" className="flex items-center gap-2">
              <ListChecks className="h-5 w-5" />
              Saved Plans
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
