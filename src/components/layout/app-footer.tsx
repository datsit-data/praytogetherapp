export default function AppFooter() {
  return (
    <footer className="bg-card border-t border-border py-6 text-center">
      <div className="container mx-auto px-4">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} PrayTogether. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Crafted with care for your spiritual journey.
        </p>
      </div>
    </footer>
  );
}
