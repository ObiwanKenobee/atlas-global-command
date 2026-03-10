import { cn } from "@/lib/utils";
import { ConfidenceBadge } from "./ConfidenceBadge";

interface SystemStressIndicatorProps {
  system: string;
  stress: number; // 0-100
  trend: "rising" | "stable" | "falling";
  className?: string;
}

export function SystemStressIndicator({ system, stress, trend, className }: SystemStressIndicatorProps) {
  const getColor = () => {
    if (stress >= 75) return "bg-atlas-crimson";
    if (stress >= 50) return "bg-atlas-amber";
    if (stress >= 25) return "bg-primary";
    return "bg-accent";
  };

  const getTrackColor = () => {
    if (stress >= 75) return "bg-atlas-crimson/10";
    if (stress >= 50) return "bg-atlas-amber/10";
    if (stress >= 25) return "bg-primary/10";
    return "bg-accent/10";
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">{system}</span>
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-[10px] font-heading",
            stress >= 75 ? "text-atlas-crimson" : stress >= 50 ? "text-atlas-amber" : stress >= 25 ? "text-signal" : "text-teal"
          )}>
            {stress}%
          </span>
          <span className={cn(
            "text-[9px]",
            trend === "rising" ? "text-atlas-crimson" : trend === "falling" ? "text-accent" : "text-muted-foreground"
          )}>
            {trend === "rising" ? "↑" : trend === "falling" ? "↓" : "→"}
          </span>
        </div>
      </div>
      <div className={cn("h-1 rounded-full overflow-hidden", getTrackColor())}>
        <div
          className={cn("h-full rounded-full transition-all duration-700", getColor())}
          style={{ width: `${stress}%` }}
        />
      </div>
    </div>
  );
}
