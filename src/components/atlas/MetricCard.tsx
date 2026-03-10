import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

interface MetricCardProps {
  label: string;
  value: string;
  change?: number;
  unit?: string;
  variant?: "default" | "signal" | "amber" | "teal" | "crimson";
  sparklineData?: number[];
  className?: string;
}

const variantStyles = {
  default: "border-border",
  signal: "border-primary/20 gradient-signal",
  amber: "border-atlas-amber/20 gradient-amber",
  teal: "border-accent/20 gradient-teal",
  crimson: "border-atlas-crimson/20 gradient-crimson",
};

const sparklineColors = {
  default: { stroke: "hsl(195, 100%, 50%)", fill: "hsl(195, 100%, 50%)" },
  signal: { stroke: "hsl(195, 100%, 50%)", fill: "hsl(195, 100%, 50%)" },
  amber: { stroke: "hsl(45, 100%, 50%)", fill: "hsl(45, 100%, 50%)" },
  teal: { stroke: "hsl(162, 100%, 47%)", fill: "hsl(162, 100%, 47%)" },
  crimson: { stroke: "hsl(350, 100%, 41%)", fill: "hsl(350, 100%, 41%)" },
};

export function MetricCard({ label, value, change, unit, variant = "default", sparklineData, className }: MetricCardProps) {
  const colors = sparklineColors[variant];

  return (
    <div className={cn(
      "rounded-lg border bg-card p-3 transition-all duration-200 hover:border-primary/30 relative overflow-hidden",
      variantStyles[variant],
      className,
    )}>
      {/* Sparkline background */}
      {sparklineData && sparklineData.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-10 opacity-30">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData.map((v, i) => ({ v, i }))} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id={`spark-${variant}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.fill} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={colors.fill} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke={colors.stroke}
                strokeWidth={1.5}
                fill={`url(#spark-${variant})`}
                dot={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      <p className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground mb-1.5 relative z-10">{label}</p>
      <div className="flex items-baseline gap-1.5 relative z-10">
        <span className="text-xl font-heading font-semibold text-foreground">{value}</span>
        {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
      </div>
      {change !== undefined && (
        <div className={cn(
          "flex items-center gap-1 mt-1 text-xs relative z-10",
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
