import { cn } from "@/lib/utils";

interface MissionCardProps {
  name: string;
  status: "active" | "monitoring" | "resolved" | "planning";
  signalCount: number;
  riskLevel: "critical" | "high" | "medium" | "low";
  lead: string;
  lastUpdate: string;
  className?: string;
  onClick?: () => void;
}

const statusConfig = {
  active: { label: "Active", dotClass: "bg-primary animate-signal-pulse" },
  monitoring: { label: "Monitoring", dotClass: "bg-atlas-amber" },
  resolved: { label: "Resolved", dotClass: "bg-accent" },
  planning: { label: "Planning", dotClass: "bg-muted-foreground" },
};

const riskColors = {
  critical: "text-atlas-crimson",
  high: "text-atlas-amber",
  medium: "text-primary",
  low: "text-muted-foreground",
};

export function MissionCard({
  name, status, signalCount, riskLevel, lead, lastUpdate, className, onClick,
}: MissionCardProps) {
  const sc = statusConfig[status];

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-lg border border-border bg-card p-3 transition-all duration-200",
        "hover:border-primary/30 hover:bg-secondary/50 cursor-pointer group",
        className,
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">{name}</h4>
        <span className="flex items-center gap-1.5 flex-shrink-0">
          <span className={cn("h-1.5 w-1.5 rounded-full", sc.dotClass)} />
          <span className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">{sc.label}</span>
        </span>
      </div>
      <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
        <span>{signalCount} signals</span>
        <span className={cn("font-heading uppercase", riskColors[riskLevel])}>{riskLevel} risk</span>
        <span className="ml-auto">{lead}</span>
      </div>
      <p className="text-[10px] text-muted-foreground mt-1.5">{lastUpdate}</p>
    </button>
  );
}
