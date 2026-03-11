import { useState } from "react";
import { MetricCard } from "@/components/atlas/MetricCard";
import { ConfidenceBadge } from "@/components/atlas/ConfidenceBadge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Shield, Eye, AlertTriangle, BarChart3, FileText, Clock,
  ChevronDown, ChevronRight, ExternalLink, Database, Cpu,
  GitBranch, Scale, Activity,
} from "lucide-react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface ModelCard {
  name: string;
  version: string;
  domain: string;
  accuracy: number;
  calibration: number;
  drift: "stable" | "minor" | "significant";
  lastAudit: string;
  dataSources: number;
  biasFlags: number;
}

const models: ModelCard[] = [
  { name: "GridStress-7B", version: "v3.2.1", domain: "Infrastructure", accuracy: 89, calibration: 84, drift: "stable", lastAudit: "2d ago", dataSources: 14, biasFlags: 0 },
  { name: "PandemicWatch-LLM", version: "v2.1.0", domain: "Health", accuracy: 82, calibration: 76, drift: "minor", lastAudit: "5d ago", dataSources: 22, biasFlags: 2 },
  { name: "ClimateTrajectory-XL", version: "v4.0.3", domain: "Climate", accuracy: 91, calibration: 88, drift: "stable", lastAudit: "1d ago", dataSources: 31, biasFlags: 1 },
  { name: "FiscalRisk-Ensemble", version: "v1.8.2", domain: "Economy", accuracy: 78, calibration: 71, drift: "significant", lastAudit: "12d ago", dataSources: 9, biasFlags: 3 },
  { name: "EcosystemNet-Graph", version: "v2.4.0", domain: "Ecosystem", accuracy: 85, calibration: 81, drift: "minor", lastAudit: "3d ago", dataSources: 18, biasFlags: 1 },
];

const calibrationData = [
  { predicted: 10, actual: 12 }, { predicted: 20, actual: 19 }, { predicted: 30, actual: 28 },
  { predicted: 40, actual: 38 }, { predicted: 50, actual: 47 }, { predicted: 60, actual: 58 },
  { predicted: 70, actual: 72 }, { predicted: 80, actual: 78 }, { predicted: 90, actual: 86 },
];

const driftTimeline = [
  { month: "Oct", score: 88 }, { month: "Nov", score: 87 }, { month: "Dec", score: 86 },
  { month: "Jan", score: 85 }, { month: "Feb", score: 82 }, { month: "Mar", score: 78 },
];

const auditTrail = [
  { action: "Model retrained on updated ISRO dataset", model: "GridStress-7B", actor: "AutoML Pipeline", timestamp: "2h ago", type: "training" },
  { action: "Bias flag raised — underrepresentation of South Pacific data", model: "ClimateTrajectory-XL", actor: "Fairness Monitor", timestamp: "6h ago", type: "bias" },
  { action: "Calibration check passed (84% → target 80%)", model: "GridStress-7B", actor: "Validation Suite", timestamp: "1d ago", type: "calibration" },
  { action: "Drift alert — accuracy dropped 4% in 30d window", model: "FiscalRisk-Ensemble", actor: "Drift Detector", timestamp: "2d ago", type: "drift" },
  { action: "Data provenance verified — 22 sources authenticated", model: "PandemicWatch-LLM", actor: "Data Integrity", timestamp: "3d ago", type: "provenance" },
  { action: "Recommendation audit — 3 contested outputs flagged", model: "FiscalRisk-Ensemble", actor: "Human Reviewer", timestamp: "5d ago", type: "audit" },
];

const fairnessMetrics = [
  { dimension: "Geographic Coverage", score: 78, status: "warning" as const },
  { dimension: "Temporal Recency", score: 91, status: "good" as const },
  { dimension: "Source Diversity", score: 84, status: "good" as const },
  { dimension: "Population Representation", score: 63, status: "critical" as const },
  { dimension: "Language Coverage", score: 72, status: "warning" as const },
];

const driftColors = {
  stable: "text-accent bg-accent/10",
  minor: "text-atlas-amber bg-atlas-amber/10",
  significant: "text-atlas-crimson bg-atlas-crimson/10",
};

const auditTypeIcons = {
  training: Cpu,
  bias: Scale,
  calibration: BarChart3,
  drift: Activity,
  provenance: Database,
  audit: Eye,
};

export default function OversightPage() {
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [expandedCard, setExpandedCard] = useState<string | null>(models[0].name);

  return (
    <div className="h-full flex flex-col p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-heading font-semibold text-foreground">Model Oversight & Ethics</h1>
          <p className="text-xs text-muted-foreground mt-0.5">5 models · 7 bias flags · 1 significant drift alert</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FileText className="h-3 w-3 mr-1" />
            Export Report
          </Button>
          <Button variant="signal" size="sm">
            <Eye className="h-3 w-3 mr-1" />
            Run Audit
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-2 mb-4">
        <MetricCard label="Active Models" value="5" variant="default" sparklineData={[3, 3, 4, 4, 5, 5, 5, 5]} />
        <MetricCard label="Avg Accuracy" value="85" unit="%" variant="signal" sparklineData={[82, 83, 84, 84, 85, 85, 85, 85]} />
        <MetricCard label="Avg Calibration" value="80" unit="%" variant="teal" sparklineData={[76, 77, 78, 79, 80, 80, 80, 80]} />
        <MetricCard label="Bias Flags" value="7" change={2} variant="amber" sparklineData={[3, 3, 4, 5, 5, 6, 6, 7]} />
        <MetricCard label="Drift Alerts" value="1" variant="crimson" sparklineData={[0, 0, 0, 1, 0, 0, 1, 1]} />
        <MetricCard label="Data Sources" value="94" variant="default" sparklineData={[70, 75, 80, 82, 85, 88, 91, 94]} />
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        {/* Model cards */}
        <div className="w-80 flex-shrink-0 overflow-y-auto space-y-2 pr-1">
          <h3 className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground mb-1">Model Registry</h3>
          {models.map((model) => (
            <button
              key={model.name}
              onClick={() => { setSelectedModel(model); setExpandedCard(model.name); }}
              className={cn(
                "w-full text-left rounded-lg border border-border bg-card p-3 transition-all duration-200 hover:border-primary/30",
                selectedModel.name === model.name && "border-primary/40 bg-secondary/30"
              )}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <Cpu className="h-3.5 w-3.5 text-primary" />
                  <span className="text-sm font-medium text-foreground">{model.name}</span>
                </div>
                <span className={cn("text-[9px] font-heading uppercase px-1.5 py-0.5 rounded", driftColors[model.drift])}>
                  {model.drift}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <span className="font-heading">{model.version}</span>
                <span>·</span>
                <span>{model.domain}</span>
                <span>·</span>
                <span>{model.accuracy}% acc</span>
                {model.biasFlags > 0 && (
                  <>
                    <span>·</span>
                    <span className="text-atlas-amber">{model.biasFlags} flags</span>
                  </>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Model detail panel */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Model header */}
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-heading font-semibold text-foreground">{selectedModel.name}</h3>
                  <span className="text-[10px] font-heading text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">{selectedModel.version}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{selectedModel.domain} · {selectedModel.dataSources} data sources · Last audited {selectedModel.lastAudit}</p>
              </div>
              <ConfidenceBadge level={selectedModel.accuracy >= 85 ? "high" : selectedModel.accuracy >= 75 ? "medium" : "low"} value={selectedModel.accuracy} />
            </div>

            {/* Key metrics row */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Accuracy", value: `${selectedModel.accuracy}%`, color: selectedModel.accuracy >= 85 ? "text-accent" : "text-atlas-amber" },
                { label: "Calibration", value: `${selectedModel.calibration}%`, color: selectedModel.calibration >= 80 ? "text-accent" : "text-atlas-amber" },
                { label: "Drift Status", value: selectedModel.drift, color: selectedModel.drift === "stable" ? "text-accent" : selectedModel.drift === "minor" ? "text-atlas-amber" : "text-atlas-crimson" },
                { label: "Bias Flags", value: `${selectedModel.biasFlags}`, color: selectedModel.biasFlags === 0 ? "text-accent" : "text-atlas-amber" },
              ].map((m) => (
                <div key={m.label} className="bg-secondary/50 rounded-md p-2.5">
                  <span className="text-[9px] font-heading uppercase tracking-wider text-muted-foreground">{m.label}</span>
                  <p className={cn("text-lg font-heading font-semibold mt-0.5", m.color)}>{m.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Calibration chart */}
            <div className="rounded-lg border border-border bg-card p-3">
              <h4 className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground mb-2">Calibration Plot</h4>
              <div className="h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={calibrationData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 25% 18%)" />
                    <XAxis dataKey="predicted" tick={{ fontSize: 9, fill: "hsl(220 15% 55%)" }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 9, fill: "hsl(220 15% 55%)" }} tickLine={false} axisLine={false} />
                    <Line type="monotone" dataKey="actual" stroke="hsl(195 100% 50%)" strokeWidth={2} dot={{ r: 2.5, fill: "hsl(195 100% 50%)" }} />
                    <Line type="monotone" dataKey="predicted" stroke="hsl(220 15% 55%)" strokeWidth={1} strokeDasharray="4 4" dot={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "hsl(222 30% 8%)", border: "1px solid hsl(220 25% 18%)", borderRadius: 6, fontSize: 10 }}
                      labelStyle={{ color: "hsl(220 15% 55%)" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[9px] text-muted-foreground mt-1">Blue = actual · Dashed = perfect calibration</p>
            </div>

            {/* Drift timeline */}
            <div className="rounded-lg border border-border bg-card p-3">
              <h4 className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground mb-2">Performance Drift (6mo)</h4>
              <div className="h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={driftTimeline}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 25% 18%)" />
                    <XAxis dataKey="month" tick={{ fontSize: 9, fill: "hsl(220 15% 55%)" }} tickLine={false} axisLine={false} />
                    <YAxis domain={[70, 95]} tick={{ fontSize: 9, fill: "hsl(220 15% 55%)" }} tickLine={false} axisLine={false} />
                    <Area type="monotone" dataKey="score" stroke="hsl(45 100% 50%)" fill="hsl(45 100% 50% / 0.1)" strokeWidth={2} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "hsl(222 30% 8%)", border: "1px solid hsl(220 25% 18%)", borderRadius: 6, fontSize: 10 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Fairness metrics */}
          <div className="rounded-lg border border-border bg-card p-3">
            <h4 className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground mb-3">Fairness & Bias Assessment</h4>
            <div className="space-y-2">
              {fairnessMetrics.map((m) => (
                <div key={m.dimension} className="flex items-center gap-3">
                  <span className="text-xs text-foreground w-44 flex-shrink-0">{m.dimension}</span>
                  <div className="flex-1 h-1.5 bg-secondary rounded-full">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        m.status === "good" ? "bg-accent" : m.status === "warning" ? "bg-atlas-amber" : "bg-atlas-crimson"
                      )}
                      style={{ width: `${m.score}%` }}
                    />
                  </div>
                  <span className={cn(
                    "text-xs font-heading w-10 text-right",
                    m.status === "good" ? "text-accent" : m.status === "warning" ? "text-atlas-amber" : "text-atlas-crimson"
                  )}>{m.score}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Data provenance */}
          <div className="rounded-lg border border-border bg-card p-3">
            <h4 className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground mb-3">Data Provenance</h4>
            <div className="grid grid-cols-3 gap-2">
              {[
                { source: "ISRO Satellite", type: "Sensor", freshness: "Live", verified: true },
                { source: "WHO GHSI", type: "Registry", freshness: "Daily", verified: true },
                { source: "IMD Weather", type: "Model", freshness: "Hourly", verified: true },
                { source: "BPDB Grid Data", type: "Sensor", freshness: "Live", verified: true },
                { source: "World Bank WDI", type: "Registry", freshness: "Quarterly", verified: true },
                { source: "Community Reports", type: "Crowdsource", freshness: "Ad-hoc", verified: false },
              ].map((s) => (
                <div key={s.source} className="bg-secondary/50 rounded-md p-2">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Database className="h-2.5 w-2.5 text-muted-foreground" />
                    <span className="text-[10px] font-medium text-foreground truncate">{s.source}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground">
                    <span>{s.type}</span>
                    <span>·</span>
                    <span>{s.freshness}</span>
                    {s.verified && <Shield className="h-2 w-2 text-accent ml-auto" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Audit trail */}
        <div className="w-72 flex-shrink-0 overflow-y-auto">
          <h3 className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground mb-2">Audit Trail</h3>
          <div className="space-y-1.5">
            {auditTrail.map((entry, i) => {
              const Icon = auditTypeIcons[entry.type as keyof typeof auditTypeIcons] || Eye;
              return (
                <div key={i} className="rounded-lg border border-border bg-card p-2.5 hover:border-primary/30 transition-all cursor-pointer">
                  <div className="flex items-start gap-2">
                    <Icon className={cn(
                      "h-3 w-3 mt-0.5 flex-shrink-0",
                      entry.type === "bias" ? "text-atlas-amber" :
                      entry.type === "drift" ? "text-atlas-crimson" :
                      "text-muted-foreground"
                    )} />
                    <div className="min-w-0">
                      <p className="text-[10px] text-foreground leading-relaxed">{entry.action}</p>
                      <div className="flex items-center gap-1.5 mt-1 text-[9px] text-muted-foreground">
                        <span className="font-heading">{entry.model}</span>
                        <span>·</span>
                        <span>{entry.actor}</span>
                        <span>·</span>
                        <span>{entry.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
