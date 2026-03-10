const PlaceholderPage = ({ title, description }: { title: string; description: string }) => (
  <div className="h-full flex items-center justify-center p-8">
    <div className="text-center max-w-md">
      <h1 className="text-lg font-heading font-semibold text-foreground mb-2">{title}</h1>
      <p className="text-sm text-muted-foreground">{description}</p>
      <div className="mt-6 grid grid-cols-2 gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 rounded-lg border border-border bg-card animate-pulse" />
        ))}
      </div>
    </div>
  </div>
);

export const MemoryPage = () => (
  <PlaceholderPage
    title="Historical Memory Engine"
    description="Explore prior incidents, interventions, and long-term outcomes. Reason through historical analogy to inform current decisions."
  />
);

export const CoordinationPage = () => (
  <PlaceholderPage
    title="Coordination Hub"
    description="Align institutions on missions, assign actions, escalate issues, and share evidence across organizational boundaries."
  />
);

export const OversightPage = () => (
  <PlaceholderPage
    title="Model Oversight & Ethics"
    description="Review model cards, data provenance, bias signals, calibration metrics, and recommendation audit trails."
  />
);
