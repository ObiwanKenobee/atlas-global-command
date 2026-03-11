import { useState } from "react";
import { MetricCard } from "@/components/atlas/MetricCard";
import { SignalCard } from "@/components/atlas/SignalCard";
import { MissionCard } from "@/components/atlas/MissionCard";
import { TimelineRail } from "@/components/atlas/TimelineRail";
import { InspectorPanel } from "@/components/atlas/InspectorPanel";
import { SystemStressIndicator } from "@/components/atlas/SystemStressIndicator";
import { ExplainabilityDrawer } from "@/components/atlas/ExplainabilityDrawer";
import { ConfidenceBadge } from "@/components/atlas/ConfidenceBadge";
import { MapHotspots, defaultHotspots } from "@/components/atlas/MapHotspots";
import { ForecastChart } from "@/components/atlas/ForecastChart";
import worldMap from "@/assets/world-map.jpg";
import { Layers, Filter, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const signals = [
  {
    title: "Cascading grid failure risk — South Asia",
    description: "Anomalous load patterns detected across interconnected power grids in India and Bangladesh. Heatwave amplifying demand beyond forecasted capacity.",
    severity: "critical" as const, domain: "Infrastructure", region: "South Asia", confidence: "high" as const, timestamp: "12m ago", isLive: true,
  },
  {
    title: "Supply chain disruption — Rare earth minerals",
    description: "Export restrictions and mining slowdowns creating bottleneck in semiconductor supply chain. 3 downstream industries affected.",
    severity: "high" as const, domain: "Economy", region: "East Asia", confidence: "medium" as const, timestamp: "1h ago", isLive: true,
  },
  {
    title: "Coral bleaching event — Great Barrier Reef",
    description: "Sea surface temperature anomaly exceeding 2°C threshold. Fourth mass bleaching event in seven years detected via satellite.",
    severity: "high" as const, domain: "Ecosystem", region: "Oceania", confidence: "high" as const, timestamp: "3h ago", isLive: false,
  },
  {
    title: "Fiscal stress indicators — European sovereigns",
    description: "Bond spread widening across peripheral economies. Debt-to-GDP trajectory diverging from sustainability framework thresholds.",
    severity: "medium" as const, domain: "Economy", region: "Europe", confidence: "medium" as const, timestamp: "6h ago", isLive: false,
  },
  {
    title: "Antimicrobial resistance surge — West Africa",
    description: "Hospital surveillance data indicating 40% increase in resistant infections. WHO threshold exceeded in 3 countries.",
    severity: "medium" as const, domain: "Health", region: "West Africa", confidence: "low" as const, timestamp: "8h ago", isLive: false,
  },
];

const missions = [
  { name: "Pacific Grid Resilience", status: "active" as const, signalCount: 14, riskLevel: "critical" as const, lead: "Dr. Chen", lastUpdate: "Updated 15 min ago" },
  { name: "Pandemic Preparedness — SE Asia", status: "active" as const, signalCount: 8, riskLevel: "high" as const, lead: "WHO Team", lastUpdate: "Updated 2h ago" },
  { name: "Arctic Feedback Loop Monitor", status: "monitoring" as const, signalCount: 22, riskLevel: "high" as const, lead: "Polar Inst.", lastUpdate: "Updated 4h ago" },
  { name: "Sahel Food Security", status: "active" as const, signalCount: 11, riskLevel: "medium" as const, lead: "UNDP", lastUpdate: "Updated 1d ago" },
];

const timelineEvents = [
  { time: "06:00", label: "Grid anomaly detected", type: "signal" as const },
  { time: "06:45", label: "Correlated with heatwave", type: "signal" as const },
  { time: "07:12", label: "Risk escalated to critical", type: "escalation" as const },
  { time: "08:00", label: "Mission team notified", type: "decision" as const },
  { time: "09:30", label: "Load shedding proposed", type: "intervention" as const },
  { time: "10:15", label: "Simulation run #47", type: "intervention" as const },
  { time: "11:00", label: "Cross-border alert", type: "escalation" as const },
  { time: "12:00", label: "Partial stabilization", type: "outcome" as const },
];

const inspectorForecastData = [
  { month: "Jan", actual: 32, forecast: 32 },
  { month: "Feb", actual: 38, forecast: 36 },
  { month: "Mar", actual: 45, forecast: 42, upper: 50, lower: 34 },
  { month: "Apr", actual: 56, forecast: 51, upper: 62, lower: 40 },
  { month: "May", actual: 68, forecast: 63, upper: 76, lower: 50 },
  { month: "Jun", forecast: 74, upper: 88, lower: 60 },
  { month: "Jul", forecast: 82, upper: 96, lower: 68 },
  { month: "Aug", forecast: 78, upper: 94, lower: 62 },
];

export default function GlobalDashboard() {
  const [inspectorOpen, setInspectorOpen] = useState(true);
  const [selectedSignal, setSelectedSignal] = useState(signals[0]);

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col min-w-0">
        {/* Metrics Row */}
        <div className="flex-shrink-0 p-4 pb-0">
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-2">
            <MetricCard label="Active Signals" value="247" change={12} variant="signal" sparklineData={[180, 195, 210, 205, 220, 235, 230, 247]} />
            <MetricCard label="Critical Risks" value="8" change={3} variant="crimson" sparklineData={[3, 4, 5, 4, 6, 5, 7, 8]} />
            <MetricCard label="Active Missions" value="14" variant="default" sparklineData={[10, 11, 12, 11, 13, 12, 13, 14]} />
            <MetricCard label="System Stress" value="67" unit="avg" change={5} variant="amber" sparklineData={[52, 55, 58, 61, 59, 63, 65, 67]} />
            <MetricCard label="Simulations Run" value="1,247" variant="teal" sparklineData={[800, 850, 920, 980, 1050, 1100, 1180, 1247]} />
            <MetricCard label="Confidence Avg" value="72" unit="%" change={-2} variant="default" sparklineData={[78, 76, 75, 74, 73, 74, 73, 72]} />
          </div>
        </div>

        {/* Map + Signals */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0 p-4 gap-4">
          {/* Map */}
          <div className="flex-1 relative rounded-lg border border-border overflow-hidden bg-card min-w-0 min-h-[200px]">
            <img
              src={worldMap}
              alt="Global situational awareness map showing active signals and risk regions"
              className="absolute inset-0 w-full h-full object-cover opacity-90"
            />

            {/* Interactive hotspots */}
            <MapHotspots
              hotspots={defaultHotspots}
              onHotspotClick={(hotspot) => {
                const matchedSignal = signals.find((s) =>
                  s.region.toLowerCase().includes(hotspot.label.toLowerCase().split(" ")[0]) ||
                  hotspot.signalTitle.toLowerCase().includes(s.title.toLowerCase().split("—")[0].trim().split(" ").slice(-2).join(" ").toLowerCase())
                );
                if (matchedSignal) {
                  setSelectedSignal(matchedSignal);
                }
                setInspectorOpen(true);
              }}
            />

            {/* Map overlay controls */}
            <div className="absolute top-3 left-3 flex gap-1.5 z-20">
              <Button variant="outline" size="sm" className="bg-card/80 backdrop-blur-sm border-border">
                <Layers className="h-3 w-3 mr-1" />
                Layers
              </Button>
              <Button variant="outline" size="sm" className="bg-card/80 backdrop-blur-sm border-border">
                <Filter className="h-3 w-3 mr-1" />
                Filter
              </Button>
            </div>
            <div className="absolute top-3 right-3 z-20">
              <Button variant="outline" size="icon-sm" className="bg-card/80 backdrop-blur-sm border-border">
                <Maximize2 className="h-3 w-3" />
              </Button>
            </div>

            {/* Live indicator */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-card/80 backdrop-blur-sm rounded-md px-2.5 py-1 border border-border z-20">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-signal-pulse" />
              <span className="text-[10px] font-heading text-foreground uppercase tracking-wider">Live Feed</span>
              <span className="text-[10px] text-muted-foreground">247 active signals</span>
            </div>
          </div>

          {/* Signal Feed */}
          <div className="w-full lg:w-80 flex-shrink-0 flex flex-col min-h-0 max-h-64 lg:max-h-none">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-heading font-semibold uppercase tracking-wider text-foreground">Priority Signals</h3>
              <span className="text-[10px] text-muted-foreground">5 of 247</span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {signals.map((signal, i) => (
                <SignalCard
                  key={i}
                  {...signal}
                  onClick={() => {
                    setSelectedSignal(signal);
                    setInspectorOpen(true);
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Timeline Rail */}
        <div className="flex-shrink-0 px-4 pb-2">
          <div className="border border-border rounded-lg bg-card p-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">Timeline — Today</span>
              <span className="text-[10px] text-muted-foreground">8 events</span>
            </div>
            <TimelineRail events={timelineEvents} />
          </div>
        </div>
      </div>

      {/* Inspector Panel */}
      <InspectorPanel
        open={inspectorOpen}
        onClose={() => setInspectorOpen(false)}
        title={selectedSignal.title}
        subtitle={selectedSignal.domain}
      >
        <div className="space-y-4">
          <div>
            <p className="text-xs text-foreground mb-2">{selectedSignal.description}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <ConfidenceBadge level={selectedSignal.confidence} value={selectedSignal.confidence === "high" ? 87 : selectedSignal.confidence === "medium" ? 62 : 34} />
              <span className="text-[10px] bg-secondary text-foreground px-1.5 py-0.5 rounded font-heading">{selectedSignal.region}</span>
              <span className="text-[10px] bg-secondary text-foreground px-1.5 py-0.5 rounded font-heading">{selectedSignal.domain}</span>
            </div>
          </div>

          {/* Forecast chart */}
          <ForecastChart data={inspectorForecastData} title="Stress Trajectory & Forecast" />

          <div>
            <h4 className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground mb-2">Affected Systems</h4>
            <div className="space-y-2.5">
              <SystemStressIndicator system="Power Grid" stress={82} trend="rising" />
              <SystemStressIndicator system="Transport" stress={56} trend="stable" />
              <SystemStressIndicator system="Water Supply" stress={71} trend="rising" />
              <SystemStressIndicator system="Communications" stress={34} trend="stable" />
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground mb-2">AI Analysis</h4>
            <ExplainabilityDrawer
              summary="High probability of cascading failure within 72h if load exceeds 94% sustained"
              sources={["ISRO Satellite", "BPDB Grid Data", "IMD Weather", "Historical Pattern DB"]}
              confidence={87}
              assumptions={[
                "Current heatwave persists for 48+ hours",
                "No emergency generation capacity activated",
                "Cross-border power sharing agreements remain static",
              ]}
              alternatives={[
                "Demand may plateau if temperatures stabilize",
                "Distributed solar may absorb peak load in urban areas",
              ]}
            />
          </div>

          <div>
            <h4 className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground mb-2">Linked Missions</h4>
            <div className="space-y-2">
              {missions.slice(0, 2).map((m, i) => (
                <MissionCard key={i} {...m} />
              ))}
            </div>
          </div>
        </div>
      </InspectorPanel>
    </div>
  );
}
