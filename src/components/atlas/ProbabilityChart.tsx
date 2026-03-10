import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { cn } from "@/lib/utils";

interface ProbabilityChartProps {
  data: { name: string; probability: number }[];
  className?: string;
  title?: string;
}

const getBarColor = (prob: number) => {
  if (prob >= 60) return "hsl(350, 100%, 41%)";
  if (prob >= 40) return "hsl(45, 100%, 50%)";
  return "hsl(195, 100%, 50%)";
};

export function ProbabilityChart({ data, className, title }: ProbabilityChartProps) {
  return (
    <div className={cn("rounded-lg border border-border bg-card p-3", className)}>
      {title && <p className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground mb-2">{title}</p>}
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 10, bottom: 0, left: 0 }}>
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={{ fontSize: 9, fill: "hsl(220, 15%, 55%)" }}
            axisLine={{ stroke: "hsl(220, 25%, 18%)" }}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 9, fill: "hsl(220, 15%, 55%)" }}
            axisLine={false}
            tickLine={false}
            width={120}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(222, 30%, 8%)",
              border: "1px solid hsl(220, 25%, 18%)",
              borderRadius: "6px",
              fontSize: "10px",
              color: "hsl(220, 30%, 92%)",
            }}
            formatter={(value: number) => [`${value}%`, "Probability"]}
          />
          <Bar dataKey="probability" radius={[0, 3, 3, 0]} barSize={14}>
            {data.map((entry, i) => (
              <Cell key={i} fill={getBarColor(entry.probability)} fillOpacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
