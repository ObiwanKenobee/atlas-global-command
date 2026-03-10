import { cn } from "@/lib/utils";

interface TimelineEvent {
  time: string;
  label: string;
  type: "signal" | "escalation" | "intervention" | "decision" | "outcome";
}

interface TimelineRailProps {
  events: TimelineEvent[];
  className?: string;
}

const typeConfig = {
  signal: { dotClass: "bg-primary", lineClass: "bg-primary/30" },
  escalation: { dotClass: "bg-atlas-amber", lineClass: "bg-atlas-amber/30" },
  intervention: { dotClass: "bg-accent", lineClass: "bg-accent/30" },
  decision: { dotClass: "bg-foreground", lineClass: "bg-foreground/30" },
  outcome: { dotClass: "bg-muted-foreground", lineClass: "bg-muted-foreground/30" },
};

export function TimelineRail({ events, className }: TimelineRailProps) {
  return (
    <div className={cn("flex items-center gap-0 overflow-x-auto py-2 px-1", className)}>
      {events.map((event, i) => {
        const config = typeConfig[event.type];
        return (
          <div key={i} className="flex items-center flex-shrink-0 group">
            <div className="flex flex-col items-center gap-1 cursor-pointer">
              <div className={cn("h-2.5 w-2.5 rounded-full transition-transform group-hover:scale-125", config.dotClass)} />
              <p className="text-[9px] font-heading text-muted-foreground whitespace-nowrap max-w-[80px] truncate group-hover:text-foreground transition-colors">
                {event.label}
              </p>
              <p className="text-[8px] text-muted-foreground/60">{event.time}</p>
            </div>
            {i < events.length - 1 && (
              <div className={cn("h-px w-8 mx-1", config.lineClass)} />
            )}
          </div>
        );
      })}
    </div>
  );
}
