import { MetricCard } from "@/components/atlas/MetricCard";
import { ExplainabilityDrawer } from "@/components/atlas/ExplainabilityDrawer";
import { ConfidenceBadge } from "@/components/atlas/ConfidenceBadge";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, GitCompare } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const scenarios = [
  { name: "Baseline", description: "No intervention — current trajectory", outcome: "73% failure probability within 72h", risk: "critical" as const, confidence: 87 },
  { name: "Load Shedding Protocol", description: "Implement rolling blackouts across non-critical sectors", outcome: "31% failure probability, 12M affected by outages", risk: "medium" as const, confidence: 74 },
  { name: "Cross-border Power Sharing", description: "Activate emergency agreements with Myanmar and Nepal", outcome: "44% failure probability, diplomatic complexity", risk: "high" as const, confidence: 58 },
];

const variables = [
  { name: "Heatwave Duration", value: 96, unit: "hours", min: 48, max: 192 },
  { name: "Grid Load Factor", value: 94, unit: "%", min: 70, max: 100 },
  { name: "Emergency Reserve", value: 8, unit: "%", min: 0, max: 25 },
  { name: "Solar Contribution", value: 12, unit: "%", min: 5, max: 30 },
];

export default function SimulationPage() {
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [sliderValues, setSliderValues] = useState(variables.map(v => v.value));

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-heading font-semibold text-foreground">Simulation Studio</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Pacific Grid Resilience — Scenario modeling</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset
          </Button>
          <Button variant="teal" size="sm">
            <Play className="h-3 w-3 mr-1" />
            Run Simulation
          </Button>
        </div>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        {/* Variables panel */}
        <div className="w-64 flex-shrink-0 space-y-4 overflow-y-auto">
          <div className="border border-border rounded-lg bg-card p-3">
            <h3 className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground mb-3">Parameters</h3>
            <div className="space-y-4">
              {variables.map((v, i) => (
                <div key={v.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-heading text-foreground">{v.name}</span>
                    <span className="text-xs font-heading text-primary">{sliderValues[i]}{v.unit}</span>
                  </div>
                  <input
                    type="range"
                    min={v.min}
                    max={v.max}
                    value={sliderValues[i]}
                    onChange={(e) => {
                      const next = [...sliderValues];
                      next[i] = Number(e.target.value);
                      setSliderValues(next);
                    }}
                    className="w-full h-1 rounded-full appearance-none cursor-pointer bg-secondary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
                  />
                  <div className="flex justify-between text-[9px] text-muted-foreground mt-0.5">
                    <span>{v.min}{v.unit}</span>
                    <span>{v.max}{v.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <ExplainabilityDrawer
            summary="Model uses ensemble of 3 grid simulation engines with weather coupling"
            sources={["GridSim v4.2", "ThermalFlow", "NOAA Weather API"]}
            confidence={82}
            assumptions={["Grid topology is static", "No new generation capacity", "Weather models accurate ±6h"]}
          />
        </div>

        {/* Scenario comparison */}
        <div className="flex-1 space-y-4 overflow-y-auto">
          <div className="flex items-center gap-2 mb-2">
            <GitCompare className="h-3.5 w-3.5 text-accent" />
            <span className="text-xs font-heading font-medium text-foreground">Scenario Comparison</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {scenarios.map((s, i) => (
              <button
                key={s.name}
                onClick={() => setSelectedScenario(i)}
                className={cn(
                  "text-left rounded-lg border p-4 transition-all duration-200",
                  selectedScenario === i
                    ? "border-accent/50 bg-accent/5 glow-signal"
                    : "border-border bg-card hover:border-primary/30",
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-heading font-medium text-foreground">{s.name}</h4>
                  <ConfidenceBadge level={s.confidence >= 75 ? "high" : s.confidence >= 50 ? "medium" : "low"} value={s.confidence} />
                </div>
                <p className="text-xs text-muted-foreground mb-3">{s.description}</p>
                <div className="p-2 rounded bg-secondary/50 border border-border">
                  <p className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground mb-1">Projected Outcome</p>
                  <p className={cn(
                    "text-xs font-medium",
                    s.risk === "critical" ? "text-atlas-crimson" : s.risk === "high" ? "text-atlas-amber" : "text-accent"
                  )}>{s.outcome}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Result metrics */}
          <div className="grid grid-cols-4 gap-2">
            <MetricCard label="Failure Probability" value={scenarios[selectedScenario].confidence >= 75 ? "73%" : scenarios[selectedScenario].confidence >= 50 ? "44%" : "31%"} variant={selectedScenario === 0 ? "crimson" : selectedScenario === 2 ? "amber" : "teal"} />
            <MetricCard label="Population Affected" value={selectedScenario === 1 ? "12M" : selectedScenario === 2 ? "6M" : "48M"} variant="default" />
            <MetricCard label="Economic Impact" value={selectedScenario === 1 ? "$2.1B" : selectedScenario === 2 ? "$3.4B" : "$8.7B"} variant="amber" />
            <MetricCard label="Recovery Time" value={selectedScenario === 1 ? "6d" : selectedScenario === 2 ? "14d" : "28d"} variant="default" />
          </div>

          {/* Ethical considerations */}
          <div className="border border-border rounded-lg bg-card p-4">
            <h4 className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground mb-2">Trade-off Analysis</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <p className="text-[10px] font-heading uppercase text-muted-foreground">Risk of Action</p>
                <p className="text-xs text-foreground">
                  {selectedScenario === 1
                    ? "Rolling blackouts disproportionately affect low-income communities. Hospital backup systems may be insufficient."
                    : selectedScenario === 2
                    ? "Diplomatic complexity may delay activation. Dependency on foreign grid introduces new vulnerabilities."
                    : "Continued stress accelerates infrastructure degradation. Cascade probability increases daily."}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-heading uppercase text-muted-foreground">Risk of Inaction</p>
                <p className="text-xs text-foreground">
                  Full grid collapse affecting 48M+ people. Economic damage estimated at $8.7B. Recovery timeline 28+ days. Potential secondary health crisis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
