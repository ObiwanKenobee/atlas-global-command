import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string;
  change?: number;
  unit?: string;
  variant?: "default" | "signal" | "amber" | "teal" | "crimson";
  className?: string;
}

const variantStyles = {
  default: "border-border",
  signal: "border-primary/20 gradient-signal",
  amber: "border-atlas-amber/20 gradient-amber",
  teal: "border-accent/20 gradient-teal",
  crimson: "border-atlas-crimson/20 gradient-crimson",
};

export function MetricCard({ label, value, change, unit, variant = "default", className }: MetricCardProps) {
  return (
    <div className={cn(
      "rounded-lg border bg-card p-3 transition-all duration-200 hover:border-primary/30",
      variantStyles[variant],
      className,
    )}>
      <p className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground mb-1.5">{label}</p>
      <div className="flex items-baseline gap-1.5">
        <span className="text-xl font-heading font-semibold text-foreground">{value}</span>
        {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
      </div>
      {change !== undefined && (
        <div className={cn(
          "flex items-center gap-1 mt-1 text-xs",
          change > 0 && "text-atlas-crimson",
          change < 0 && "text-accent",
          change === 0 && "text-muted-foreground",
        )}>
          {change > 0 ? <TrendingUp className="h-3 w-3" /> : change < 0 ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
          <span>{change > 0 ? "+" : ""}{change}%</span>
        </div>
      )}
    </div>
  );
}
