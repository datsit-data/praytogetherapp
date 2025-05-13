import PrayerPlanOrchestrator from '@/components/prayer-plan-orchestrator';

export default async function HomePage() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-primary">Welcome to PrayTogether</h1>
        <p className="text-lg text-muted-foreground">
          Share your heart, and let us help you craft a personalized prayer journey, guided by wisdom and scripture.
        </p>
      </section>
      <PrayerPlanOrchestrator />
    </div>
  );
}
