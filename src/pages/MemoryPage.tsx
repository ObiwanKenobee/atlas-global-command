import { cn } from "@/lib/utils";
import { ConfidenceBadge } from "@/components/atlas/ConfidenceBadge";
import { TimelineRail } from "@/components/atlas/TimelineRail";
import { ForecastChart } from "@/components/atlas/ForecastChart";
import { MetricCard } from "@/components/atlas/MetricCard";
import { ExplainabilityDrawer } from "@/components/atlas/ExplainabilityDrawer";
import { Button } from "@/components/ui/button";
import { Clock, Search, ArrowRight } from "lucide-react";
import { useState } from "react";

interface HistoricalCase {
  id: string;
  title: string;
  date: string;
  region: string;
  domain: string;
  outcome: string;
  similarity: number;
  interventions: string[];
  lessonLearned: string;
  timeline: { time: string; label: string; type: "signal" | "escalation" | "intervention" | "decision" | "outcome" }[];
  trendData: { month: string; actual?: number; forecast?: number; upper?: number; lower?: number }[];
}

const historicalCases: HistoricalCase[] = [
  {
    id: "c1",
    title: "India Grid Collapse 2012",
    date: "Jul 30–31, 2012",
    region: "South Asia",
    domain: "Infrastructure",
    outcome: "700M people without power for 2 days. $5.6B estimated loss.",
    similarity: 89,
    interventions: ["Emergency load shedding", "Interstate grid isolation", "Military diesel backup"],
    lessonLearned: "Over-extraction by states during heatwave exceeded grid design capacity. Lack of real-time load monitoring delayed response by 6 hours.",
    timeline: [
      { time: "Jul 28", label: "Heatwave warning", type: "signal" },
      { time: "Jul 29", label: "Grid stress detected", type: "signal" },
      { time: "Jul 30 02:30", label: "Northern grid collapse", type: "escalation" },
      { time: "Jul 30 13:00", label: "Eastern grid cascade", type: "escalation" },
      { time: "Jul 31", label: "Partial restoration", type: "intervention" },
      { time: "Aug 1", label: "Full restoration", type: "outcome" },
    ],
    trendData: [
      { month: "Jul 25", actual: 42 },
      { month: "Jul 26", actual: 51 },
      { month: "Jul 27", actual: 64 },
      { month: "Jul 28", actual: 72 },
      { month: "Jul 29", actual: 88 },
      { month: "Jul 30", actual: 100 },
      { month: "Jul 31", actual: 65 },
      { month: "Aug 1", actual: 30 },
    ],
  },
  {
    id: "c2",
    title: "Texas Winter Storm 2021",
    date: "Feb 13–17, 2021",
    region: "North America",
    domain: "Infrastructure",
    outcome: "4.5M homes without power. 246 deaths. $195B damage.",
    similarity: 74,
    interventions: ["Emergency rolling blackouts", "Gas pipeline pressure reduction", "Federal emergency declaration"],
    lessonLearned: "Lack of winterization standards for gas infrastructure created cascading failure between heating demand and power generation.",
    timeline: [
      { time: "Feb 10", label: "Arctic blast forecast", type: "signal" },
      { time: "Feb 13", label: "Temperatures plunge", type: "signal" },
      { time: "Feb 14", label: "Gas supply drops 50%", type: "escalation" },
      { time: "Feb 15", label: "ERCOT orders blackouts", type: "decision" },
      { time: "Feb 16", label: "Federal emergency", type: "intervention" },
      { time: "Feb 17", label: "Gradual restoration", type: "outcome" },
    ],
    trendData: [
      { month: "Feb 10", actual: 30 },
      { month: "Feb 11", actual: 38 },
      { month: "Feb 12", actual: 52 },
      { month: "Feb 13", actual: 71 },
      { month: "Feb 14", actual: 92 },
      { month: "Feb 15", actual: 100 },
      { month: "Feb 16", actual: 78 },
      { month: "Feb 17", actual: 45 },
    ],
  },
  {
    id: "c3",
    title: "European Heat Wave 2003",
    date: "Jun–Aug 2003",
    region: "Europe",
    domain: "Climate / Health",
    outcome: "70,000+ excess deaths. Nuclear plants shut down due to cooling water. Agriculture loss €13B.",
    similarity: 61,
    interventions: ["Hospital surge capacity", "Public cooling centers", "Nuclear reactor throttling", "Water rationing"],
    lessonLearned: "Health systems were unprepared for sustained heat. France lacked a national heat action plan. Infrastructure interdependence (power + water + health) was underestimated.",
    timeline: [
      { time: "Jun", label: "Early heat signals", type: "signal" },
      { time: "Jul", label: "Persistent anomaly", type: "signal" },
      { time: "Aug 1", label: "Excess mortality detected", type: "escalation" },
      { time: "Aug 8", label: "France peak crisis", type: "escalation" },
      { time: "Aug 12", label: "Emergency response", type: "intervention" },
      { time: "Aug 20", label: "Heat subsides", type: "outcome" },
    ],
    trendData: [
      { month: "Jun", actual: 25 },
      { month: "Jul 1", actual: 42 },
      { month: "Jul 15", actual: 58 },
      { month: "Aug 1", actual: 78 },
      { month: "Aug 8", actual: 100 },
      { month: "Aug 15", actual: 72 },
      { month: "Aug 22", actual: 35 },
      { month: "Sep", actual: 15 },
    ],
  },
];

export default function MemoryPage() {
  const [selectedCase, setSelectedCase] = useState<HistoricalCase>(historicalCases[0]);
  const [compareCase, setCompareCase] = useState<HistoricalCase | null>(historicalCases[1]);

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-heading font-semibold text-foreground">Historical Memory Engine</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Analog matching and case comparison for current threats</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Search className="h-3 w-3 mr-1" />
            Search Cases
          </Button>
        </div>
      </div>

      {/* Current context banner */}
      <div className="rounded-lg border border-primary/20 gradient-signal p-3 mb-4 flex items-center gap-3">
        <Clock className="h-4 w-4 text-primary flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-foreground">Current Active Threat: Cascading Grid Failure — South Asia</p>
          <p className="text-[10px] text-muted-foreground">Atlas found {historicalCases.length} historical analogs based on system type, failure pattern, and contextual similarity</p>
        </div>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        {/* Case list */}
        <div className="w-72 flex-shrink-0 space-y-2 overflow-y-auto">
          <p className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground mb-1">Analog Cases</p>
          {historicalCases.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCase(c)}
              className={cn(
                "w-full text-left rounded-lg border p-3 transition-all duration-200",
                selectedCase.id === c.id
                  ? "border-primary/40 bg-primary/5"
                  : "border-border bg-card hover:border-primary/20",
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-xs font-medium text-foreground">{c.title}</h4>
                <span className={cn(
                  "text-[10px] font-heading px-1.5 py-0.5 rounded-full border",
                  c.similarity >= 80 ? "text-accent border-accent/30 bg-accent/10" :
                  c.similarity >= 60 ? "text-atlas-amber border-atlas-amber/30 bg-atlas-amber/10" :
                  "text-muted-foreground border-border bg-secondary",
                )}>
                  {c.similarity}% match
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground">{c.date} · {c.region}</p>
              <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">{c.outcome}</p>
            </button>
          ))}

          <div className="pt-2">
            <p className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground mb-1">Compare With</p>
            {historicalCases.filter(c => c.id !== selectedCase.id).map((c) => (
              <button
                key={c.id}
                onClick={() => setCompareCase(compareCase?.id === c.id ? null : c)}
                className={cn(
                  "w-full text-left rounded-lg border p-2 mb-1 transition-all text-[10px]",
                  compareCase?.id === c.id
                    ? "border-accent/40 bg-accent/5"
                    : "border-border bg-card hover:border-accent/20",
                )}
              >
                <span className="text-foreground">{c.title}</span>
                <span className="text-muted-foreground ml-1">· {c.similarity}%</span>
              </button>
            ))}
          </div>
        </div>

        {/* Case detail + comparison */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {/* Side by side headers */}
          <div className={cn("grid gap-4", compareCase ? "grid-cols-2" : "grid-cols-1")}>
            {/* Primary case */}
            <div className="rounded-lg border border-border bg-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-heading font-semibold text-foreground">{selectedCase.title}</h3>
                <span className="text-[10px] text-muted-foreground">{selectedCase.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-secondary text-foreground px-1.5 py-0.5 rounded font-heading">{selectedCase.region}</span>
                <span className="text-[10px] bg-secondary text-foreground px-1.5 py-0.5 rounded font-heading">{selectedCase.domain}</span>
                <ConfidenceBadge level={selectedCase.similarity >= 80 ? "high" : "medium"} value={selectedCase.similarity} />
              </div>
              <p className="text-xs text-foreground">{selectedCase.outcome}</p>
              <div>
                <p className="text-[10px] font-heading uppercase text-muted-foreground mb-1">Interventions Applied</p>
                <div className="flex flex-wrap gap-1">
                  {selectedCase.interventions.map((i) => (
                    <span key={i} className="text-[10px] bg-accent/10 text-accent border border-accent/20 px-1.5 py-0.5 rounded">{i}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-heading uppercase text-muted-foreground mb-1">Key Lesson</p>
                <p className="text-xs text-muted-foreground">{selectedCase.lessonLearned}</p>
              </div>
            </div>

            {/* Compare case */}
            {compareCase && (
              <div className="rounded-lg border border-accent/20 bg-card p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-heading font-semibold text-foreground">{compareCase.title}</h3>
                  <span className="text-[10px] text-muted-foreground">{compareCase.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-secondary text-foreground px-1.5 py-0.5 rounded font-heading">{compareCase.region}</span>
                  <span className="text-[10px] bg-secondary text-foreground px-1.5 py-0.5 rounded font-heading">{compareCase.domain}</span>
                  <ConfidenceBadge level={compareCase.similarity >= 80 ? "high" : "medium"} value={compareCase.similarity} />
                </div>
                <p className="text-xs text-foreground">{compareCase.outcome}</p>
                <div>
                  <p className="text-[10px] font-heading uppercase text-muted-foreground mb-1">Interventions Applied</p>
                  <div className="flex flex-wrap gap-1">
                    {compareCase.interventions.map((i) => (
                      <span key={i} className="text-[10px] bg-accent/10 text-accent border border-accent/20 px-1.5 py-0.5 rounded">{i}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-heading uppercase text-muted-foreground mb-1">Key Lesson</p>
                  <p className="text-xs text-muted-foreground">{compareCase.lessonLearned}</p>
                </div>
              </div>
            )}
          </div>

          {/* Timelines */}
          <div className={cn("grid gap-4", compareCase ? "grid-cols-2" : "grid-cols-1")}>
            <div className="border border-border rounded-lg bg-card p-3">
              <p className="text-[10px] font-heading uppercase text-muted-foreground mb-2">Event Timeline</p>
              <TimelineRail events={selectedCase.timeline} />
            </div>
            {compareCase && (
              <div className="border border-accent/20 rounded-lg bg-card p-3">
                <p className="text-[10px] font-heading uppercase text-muted-foreground mb-2">Event Timeline</p>
                <TimelineRail events={compareCase.timeline} />
              </div>
            )}
          </div>

          {/* Stress trend charts */}
          <div className={cn("grid gap-4", compareCase ? "grid-cols-2" : "grid-cols-1")}>
            <ForecastChart data={selectedCase.trendData} title="System Stress Over Time" />
            {compareCase && <ForecastChart data={compareCase.trendData} title="System Stress Over Time" />}
          </div>

          {/* Explainability */}
          <ExplainabilityDrawer
            summary={`${selectedCase.similarity}% analog match based on infrastructure type, weather coupling, and cascade pattern similarity`}
            sources={["Historical Incident DB", "IPCC AR6", "Grid Failure Archive", "WHO Event Records"]}
            confidence={selectedCase.similarity}
            assumptions={[
              "Infrastructure topology is comparable",
              "Governance response capacity is similar",
              "Climate forcing pattern matches within ±15%",
            ]}
            alternatives={[
              "Modern grid monitoring may reduce response delay",
              "Distributed energy may alter cascade dynamics",
            ]}
          />
        </div>
      </div>
    </div>
  );
}
