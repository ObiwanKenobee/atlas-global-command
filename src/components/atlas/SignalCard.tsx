import { cn } from "@/lib/utils";
import { ConfidenceBadge } from "./ConfidenceBadge";
import { AlertTriangle, Activity, Zap, Radio } from "lucide-react";

export type SignalSeverity = "critical" | "high" | "medium" | "low";

interface SignalCardProps {
  title: string;
  description: string;
  severity: SignalSeverity;
  domain: string;
  region: string;
  confidence: "high" | "medium" | "low" | "uncertain";
  timestamp: string;
  isLive?: boolean;
  className?: string;
  onClick?: () => void;
}

const severityConfig = {
  critical: { icon: AlertTriangle, borderClass: "border-l-atlas-crimson", dotClass: "bg-atlas-crimson" },
  high: { icon: Zap, borderClass: "border-l-atlas-amber", dotClass: "bg-atlas-amber" },
  medium: { icon: Activity, borderClass: "border-l-primary", dotClass: "bg-primary" },
  low: { icon: Radio, borderClass: "border-l-muted-foreground", dotClass: "bg-muted-foreground" },
};

export function SignalCard({
  title, description, severity, domain, region, confidence, timestamp, isLive, className, onClick,
}: SignalCardProps) {
  const config = severityConfig[severity];
  const Icon = config.icon;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-lg border border-border bg-card p-3 border-l-2 transition-all duration-200",
        "hover:border-primary/30 hover:bg-secondary/50 cursor-pointer group",
        config.borderClass,
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2 min-w-0">
          <Icon className={cn("h-3.5 w-3.5 flex-shrink-0", 
            severity === "critical" && "text-atlas-crimson",
            severity === "high" && "text-atlas-amber",
            severity === "medium" && "text-signal",
            severity === "low" && "text-muted-foreground",
          )} />
          <h4 className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
            {title}
          </h4>
        </div>
        {isLive && (
          <span className="flex items-center gap-1 flex-shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-signal-pulse" />
            <span className="text-[10px] font-heading uppercase tracking-wider text-primary">Live</span>
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{description}</p>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
          {domain}
        </span>
        <span className="text-[10px] text-muted-foreground">{region}</span>
        <ConfidenceBadge level={confidence} />
        <span className="text-[10px] text-muted-foreground ml-auto">{timestamp}</span>
      </div>
    </button>
  );
}
