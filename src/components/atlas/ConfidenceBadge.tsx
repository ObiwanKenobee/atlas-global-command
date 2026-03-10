import { cn } from "@/lib/utils";

interface ConfidenceBadgeProps {
  level: "high" | "medium" | "low" | "uncertain";
  value?: number;
  className?: string;
}

const levelConfig = {
  high: { label: "High Confidence", className: "bg-accent/10 text-accent border-accent/30" },
  medium: { label: "Medium Confidence", className: "bg-atlas-amber/10 text-atlas-amber border-atlas-amber/30" },
  low: { label: "Low Confidence", className: "bg-atlas-crimson/10 text-atlas-crimson border-atlas-crimson/30" },
  uncertain: { label: "Uncertain", className: "bg-muted text-muted-foreground border-border" },
};

export function ConfidenceBadge({ level, value, className }: ConfidenceBadgeProps) {
  const config = levelConfig[level];
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-heading font-medium uppercase tracking-wider",
      config.className,
      className
    )}>
      <span className={cn(
        "h-1.5 w-1.5 rounded-full",
        level === "high" && "bg-accent",
        level === "medium" && "bg-atlas-amber",
        level === "low" && "bg-atlas-crimson",
        level === "uncertain" && "bg-muted-foreground",
      )} />
      {value !== undefined ? `${value}%` : config.label}
    </span>
  );
}
