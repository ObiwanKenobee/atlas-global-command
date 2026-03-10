import { SignalCard } from "@/components/atlas/SignalCard";
import { ConfidenceBadge } from "@/components/atlas/ConfidenceBadge";
import { Button } from "@/components/ui/button";
import { Filter, SortAsc } from "lucide-react";

const allSignals = [
  { title: "Cascading grid failure risk — South Asia", description: "Anomalous load patterns detected across interconnected power grids.", severity: "critical" as const, domain: "Infrastructure", region: "South Asia", confidence: "high" as const, timestamp: "12m ago", isLive: true },
  { title: "Supply chain disruption — Rare earth minerals", description: "Export restrictions creating bottleneck in semiconductor supply chain.", severity: "high" as const, domain: "Economy", region: "East Asia", confidence: "medium" as const, timestamp: "1h ago", isLive: true },
  { title: "Coral bleaching event — Great Barrier Reef", description: "Sea surface temperature anomaly exceeding 2°C threshold.", severity: "high" as const, domain: "Ecosystem", region: "Oceania", confidence: "high" as const, timestamp: "3h ago", isLive: false },
  { title: "Fiscal stress indicators — European sovereigns", description: "Bond spread widening across peripheral economies.", severity: "medium" as const, domain: "Economy", region: "Europe", confidence: "medium" as const, timestamp: "6h ago", isLive: false },
  { title: "Antimicrobial resistance surge — West Africa", description: "Hospital surveillance data indicating 40% increase in resistant infections.", severity: "medium" as const, domain: "Health", region: "West Africa", confidence: "low" as const, timestamp: "8h ago", isLive: false },
  { title: "Arctic methane release acceleration", description: "Permafrost degradation rates exceeding IPCC projections by 40%.", severity: "critical" as const, domain: "Climate", region: "Arctic", confidence: "medium" as const, timestamp: "10h ago", isLive: false },
  { title: "Governance fragility — Sahel region", description: "Multiple indicators of institutional erosion across 4 nations.", severity: "high" as const, domain: "Governance", region: "Sahel", confidence: "low" as const, timestamp: "12h ago", isLive: false },
  { title: "Freshwater aquifer depletion — Central Valley", description: "Groundwater extraction exceeding recharge rate by 3:1.", severity: "medium" as const, domain: "Water", region: "North America", confidence: "high" as const, timestamp: "1d ago", isLive: false },
];

export default function SignalsPage() {
  return (
    <div className="h-full flex flex-col p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-heading font-semibold text-foreground">Signals & Alerts</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Monitoring 247 active signals across 6 domains</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-3 w-3 mr-1" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <SortAsc className="h-3 w-3 mr-1" />
            Sort
          </Button>
        </div>
      </div>

      {/* Severity summary */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-atlas-crimson" />
          <span className="text-[10px] font-heading uppercase text-muted-foreground">2 Critical</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-atlas-amber" />
          <span className="text-[10px] font-heading uppercase text-muted-foreground">3 High</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-primary" />
          <span className="text-[10px] font-heading uppercase text-muted-foreground">3 Medium</span>
        </div>
      </div>

      {/* Signal grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {allSignals.map((signal, i) => (
            <SignalCard key={i} {...signal} />
          ))}
        </div>
      </div>
    </div>
  );
}
