import { MetricCard } from "@/components/atlas/MetricCard";
import { ExplainabilityDrawer } from "@/components/atlas/ExplainabilityDrawer";
import { ConfidenceBadge } from "@/components/atlas/ConfidenceBadge";
import { ProbabilityChart } from "@/components/atlas/ProbabilityChart";
import { ForecastChart } from "@/components/atlas/ForecastChart";

const risks = [
  { name: "South Asian Grid Cascade", probability: 73, impact: "Catastrophic", systems: ["Power", "Water", "Transport"], trend: "rising" as const },
  { name: "Rare Earth Supply Shock", probability: 58, impact: "Severe", systems: ["Semiconductors", "Defense", "Renewables"], trend: "rising" as const },
  { name: "Arctic Methane Feedback", probability: 41, impact: "Catastrophic", systems: ["Climate", "Agriculture", "Coastal"], trend: "rising" as const },
  { name: "Sahel Governance Failure", probability: 52, impact: "Major", systems: ["Governance", "Food Security", "Migration"], trend: "stable" as const },
  { name: "AMR Pandemic Risk", probability: 28, impact: "Severe", systems: ["Health", "Economy", "Trade"], trend: "rising" as const },
  { name: "European Fiscal Crisis", probability: 34, impact: "Major", systems: ["Finance", "Trade", "Employment"], trend: "stable" as const },
];

const cascadeForecast = [
  { month: "Jan", actual: 20 },
  { month: "Feb", actual: 28 },
  { month: "Mar", actual: 35, forecast: 35 },
  { month: "Apr", actual: 48, forecast: 42, upper: 55, lower: 30 },
  { month: "May", actual: 58, forecast: 52, upper: 68, lower: 36 },
  { month: "Jun", forecast: 65, upper: 82, lower: 48 },
  { month: "Jul", forecast: 73, upper: 90, lower: 56 },
  { month: "Aug", forecast: 78, upper: 95, lower: 61 },
];

export default function RisksPage() {
  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-heading font-semibold text-foreground">Risk & Failure Probability</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Cascading risk analysis across 6 critical domains</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <MetricCard label="Critical Risks" value="2" variant="crimson" change={1} sparklineData={[1, 1, 1, 2, 1, 2, 2, 2]} />
        <MetricCard label="Rising Trends" value="4" variant="amber" change={2} sparklineData={[2, 2, 3, 3, 3, 3, 4, 4]} />
        <MetricCard label="Systems at Risk" value="18" variant="signal" sparklineData={[12, 13, 14, 15, 16, 16, 17, 18]} />
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        {/* Risk list */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {risks.map((risk) => (
            <div key={risk.name} className="border border-border rounded-lg bg-card p-4 hover:border-primary/30 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-heading font-medium text-foreground">{risk.name}</h3>
                  <ConfidenceBadge
                    level={risk.probability >= 60 ? "low" : risk.probability >= 40 ? "medium" : "high"}
                    value={risk.probability}
                  />
                </div>
                <span className="text-xs font-heading text-muted-foreground">{risk.impact} Impact</span>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-heading uppercase text-muted-foreground">Failure Probability</span>
                  <span className={`text-xs font-heading ${risk.probability >= 60 ? "text-atlas-crimson" : risk.probability >= 40 ? "text-atlas-amber" : "text-primary"}`}>
                    {risk.probability}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${risk.probability >= 60 ? "bg-atlas-crimson" : risk.probability >= 40 ? "bg-atlas-amber" : "bg-primary"}`}
                    style={{ width: `${risk.probability}%` }}
                  />
                </div>
                <div className="relative h-1 mt-0.5">
                  <div
                    className="absolute h-full rounded-full bg-atlas-amber/20"
                    style={{ left: `${Math.max(0, risk.probability - 15)}%`, width: "30%" }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-heading uppercase text-muted-foreground mr-1">Affected:</span>
                {risk.systems.map((s) => (
                  <span key={s} className="text-[10px] bg-secondary text-foreground px-1.5 py-0.5 rounded">{s}</span>
                ))}
                <span className={`text-[10px] font-heading uppercase ml-auto ${risk.trend === "rising" ? "text-atlas-crimson" : "text-muted-foreground"}`}>
                  {risk.trend === "rising" ? "↑ Rising" : "→ Stable"}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts sidebar */}
        <div className="w-96 flex-shrink-0 space-y-4 overflow-y-auto">
          <ProbabilityChart
            title="Failure Probability Distribution"
            data={risks.map((r) => ({ name: r.name, probability: r.probability }))}
          />

          <ForecastChart
            title="Cascade Risk Trajectory — 6mo Forecast"
            data={cascadeForecast}
          />

          <ExplainabilityDrawer
            summary="Cascade probability model incorporates 4 system interdependency layers with weather coupling"
            sources={["Atlas Risk Engine v3.1", "IPCC Scenario Models", "Infrastructure Dependency Graph"]}
            confidence={76}
            assumptions={[
              "System interdependencies remain stable",
              "No major policy interventions in forecast window",
              "Climate forcing follows RCP4.5 trajectory",
            ]}
            alternatives={[
              "Policy action could reduce risk trajectory by 15-25%",
              "Infrastructure hardening may decouple cascades",
            ]}
          />
        </div>
      </div>
    </div>
  );
}
