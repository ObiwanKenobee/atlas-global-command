import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, ReferenceLine, ReferenceArea } from "recharts";
import { cn } from "@/lib/utils";

interface ForecastChartProps {
  data: { month: string; actual?: number; forecast?: number; upper?: number; lower?: number }[];
  className?: string;
  title?: string;
}

export function ForecastChart({ data, className, title }: ForecastChartProps) {
  return (
    <div className={cn("rounded-lg border border-border bg-card p-3", className)}>
      {title && <p className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground mb-2">{title}</p>}
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(195, 100%, 50%)" stopOpacity={0.2} />
              <stop offset="100%" stopColor="hsl(195, 100%, 50%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="uncertaintyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(45, 100%, 50%)" stopOpacity={0.15} />
              <stop offset="100%" stopColor="hsl(45, 100%, 50%)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="month"
            tick={{ fontSize: 9, fill: "hsl(220, 15%, 55%)" }}
            axisLine={{ stroke: "hsl(220, 25%, 18%)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 9, fill: "hsl(220, 15%, 55%)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(222, 30%, 8%)",
              border: "1px solid hsl(220, 25%, 18%)",
              borderRadius: "6px",
              fontSize: "10px",
              color: "hsl(220, 30%, 92%)",
            }}
          />
          {/* Uncertainty band */}
          <Area
            type="monotone"
            dataKey="upper"
            stroke="none"
            fill="transparent"
            dot={false}
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="lower"
            stroke="none"
            fill="url(#uncertaintyGrad)"
            dot={false}
            isAnimationActive={false}
          />
          {/* Forecast dashed line */}
          <Area
            type="monotone"
            dataKey="forecast"
            stroke="hsl(195, 100%, 50%)"
            strokeWidth={1.5}
            strokeDasharray="4 3"
            fill="url(#forecastGrad)"
            dot={false}
          />
          {/* Actual solid line */}
          <Area
            type="monotone"
            dataKey="actual"
            stroke="hsl(220, 30%, 92%)"
            strokeWidth={2}
            fill="none"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-4 mt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-px bg-foreground" />
          <span className="text-[9px] text-muted-foreground">Actual</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-px border-t border-dashed border-primary" />
          <span className="text-[9px] text-muted-foreground">Forecast</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-2 rounded-sm bg-atlas-amber/20" />
          <span className="text-[9px] text-muted-foreground">Uncertainty</span>
        </div>
      </div>
    </div>
  );
}
