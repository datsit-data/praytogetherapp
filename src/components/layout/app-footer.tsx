"use client"; 

import { useLanguage } from "@/contexts/language-context";

export default function AppFooter() {
  const { t } = useLanguage();
  return (
    <footer className="bg-card border-t border-border py-6 text-center">
      <div className="container mx-auto px-4">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {t('appName')}. {t('footerRights')}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {t('footerCrafted')}
        </p>
      </div>
    </footer>
  );
}
