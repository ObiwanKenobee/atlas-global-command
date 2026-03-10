import { MissionCard } from "@/components/atlas/MissionCard";
import { MetricCard } from "@/components/atlas/MetricCard";
import { TimelineRail } from "@/components/atlas/TimelineRail";
import { SystemStressIndicator } from "@/components/atlas/SystemStressIndicator";
import { ExplainabilityDrawer } from "@/components/atlas/ExplainabilityDrawer";
import { Button } from "@/components/ui/button";
import { Plus, Target } from "lucide-react";

const missions = [
  { name: "Pacific Grid Resilience", status: "active" as const, signalCount: 14, riskLevel: "critical" as const, lead: "Dr. Chen", lastUpdate: "Updated 15 min ago" },
  { name: "Pandemic Preparedness — SE Asia", status: "active" as const, signalCount: 8, riskLevel: "high" as const, lead: "WHO Team", lastUpdate: "Updated 2h ago" },
  { name: "Arctic Feedback Loop Monitor", status: "monitoring" as const, signalCount: 22, riskLevel: "high" as const, lead: "Polar Inst.", lastUpdate: "Updated 4h ago" },
  { name: "Sahel Food Security", status: "active" as const, signalCount: 11, riskLevel: "medium" as const, lead: "UNDP", lastUpdate: "Updated 1d ago" },
  { name: "European Fiscal Stability", status: "monitoring" as const, signalCount: 6, riskLevel: "medium" as const, lead: "ECB Liaison", lastUpdate: "Updated 2d ago" },
  { name: "Amazon Deforestation Response", status: "planning" as const, signalCount: 19, riskLevel: "high" as const, lead: "UNEP", lastUpdate: "Updated 3d ago" },
  { name: "Central Asian Water Disputes", status: "resolved" as const, signalCount: 4, riskLevel: "low" as const, lead: "Diplomatic Team", lastUpdate: "Resolved 1w ago" },
];

const timelineEvents = [
  { time: "Mar 1", label: "Mission created", type: "decision" as const },
  { time: "Mar 3", label: "Initial signals linked", type: "signal" as const },
  { time: "Mar 5", label: "Risk escalation", type: "escalation" as const },
  { time: "Mar 7", label: "Simulation batch", type: "intervention" as const },
  { time: "Mar 9", label: "Stakeholder briefing", type: "decision" as const },
  { time: "Mar 10", label: "Intervention proposed", type: "intervention" as const },
];

export default function MissionsPage() {
  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-heading font-semibold text-foreground">Mission Workspace</h1>
          <p className="text-xs text-muted-foreground mt-0.5">7 missions · 4 active · 2 monitoring</p>
        </div>
        <Button variant="signal" size="sm">
          <Plus className="h-3 w-3 mr-1" />
          New Mission
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <MetricCard label="Active Missions" value="4" variant="signal" />
        <MetricCard label="Total Signals" value="84" variant="default" />
        <MetricCard label="Pending Decisions" value="7" variant="amber" />
        <MetricCard label="Avg Risk Level" value="High" variant="crimson" />
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        {/* Mission list */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {missions.map((m, i) => (
            <MissionCard key={i} {...m} />
          ))}
        </div>

        {/* Mission detail panel */}
        <div className="w-96 border border-border rounded-lg bg-card p-4 overflow-y-auto flex-shrink-0 space-y-4">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-heading font-semibold text-foreground">Pacific Grid Resilience</h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Monitor and mitigate cascading grid failure risks across South and Southeast Asian power infrastructure during extreme heat events.
          </p>

          <div>
            <h4 className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground mb-2">System Stress</h4>
            <div className="space-y-2">
              <SystemStressIndicator system="Power Grid" stress={82} trend="rising" />
              <SystemStressIndicator system="Cooling Systems" stress={68} trend="rising" />
              <SystemStressIndicator system="Water Supply" stress={71} trend="stable" />
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground mb-2">Mission Timeline</h4>
            <div className="border border-border rounded-lg p-2 bg-background">
              <TimelineRail events={timelineEvents} />
            </div>
          </div>

          <ExplainabilityDrawer
            summary="Grid failure probability increases to 73% if heatwave extends beyond 96 hours"
            sources={["ISRO Thermal Data", "Grid Load Sensors", "Weather Models"]}
            confidence={73}
            assumptions={["No emergency generation activated", "Heatwave persists 96+ hours"]}
            alternatives={["Solar capacity may absorb 15% peak", "Cross-border sharing could reduce load"]}
          />
        </div>
      </div>
    </div>
  );
}
