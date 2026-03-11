import { useState } from "react";
import { cn } from "@/lib/utils";
import { ConfidenceBadge } from "./ConfidenceBadge";
import { ExplainabilityDrawer } from "./ExplainabilityDrawer";
import { SystemStressIndicator } from "./SystemStressIndicator";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2, XCircle, AlertTriangle, Scale, Users,
  ChevronDown, ChevronRight, ArrowRight, Shield, Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DecisionOption {
  title: string;
  description: string;
  riskScore: number;
  benefitScore: number;
  timeToEffect: string;
  secondOrderEffects: string[];
}

interface Stakeholder {
  name: string;
  role: string;
  status: "approved" | "pending" | "reviewing" | "objected";
  avatar: string;
}

interface DecisionRoomProps {
  title: string;
  mission: string;
  urgency: "critical" | "high" | "medium";
  recommendation: string;
  confidence: number;
  evidenceSummary: string;
  sources: string[];
  assumptions: string[];
  riskOfAction: { score: number; factors: string[] };
  riskOfInaction: { score: number; factors: string[] };
  alternatives: DecisionOption[];
  stakeholders: Stakeholder[];
  className?: string;
}

const urgencyColors = {
  critical: "border-l-atlas-crimson",
  high: "border-l-atlas-amber",
  medium: "border-l-primary",
};

const stakeholderStatusConfig = {
  approved: { label: "Approved", class: "bg-accent/10 text-accent border-accent/20", icon: CheckCircle2 },
  pending: { label: "Pending", class: "bg-secondary text-muted-foreground border-border", icon: Clock },
  reviewing: { label: "Reviewing", class: "bg-primary/10 text-primary border-primary/20", icon: Shield },
  objected: { label: "Objected", class: "bg-atlas-crimson/10 text-atlas-crimson border-atlas-crimson/20", icon: XCircle },
};

export function DecisionRoom({
  title, mission, urgency, recommendation, confidence, evidenceSummary,
  sources, assumptions, riskOfAction, riskOfInaction, alternatives,
  stakeholders, className,
}: DecisionRoomProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>("recommendation");
  const [selectedAlt, setSelectedAlt] = useState<number | null>(null);

  const toggleSection = (id: string) => setExpandedSection(expandedSection === id ? null : id);

  const approvedCount = stakeholders.filter(s => s.status === "approved").length;

  return (
    <div className={cn("space-y-3", className)}>
      {/* Header */}
      <div className={cn("rounded-lg border border-border bg-card p-4 border-l-2", urgencyColors[urgency])}>
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-base font-heading font-semibold text-foreground">{title}</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">{mission} · Decision Required</p>
          </div>
          <div className="flex items-center gap-2">
            <ConfidenceBadge level={confidence >= 80 ? "high" : confidence >= 60 ? "medium" : "low"} value={confidence} />
            <span className={cn(
              "text-[9px] font-heading uppercase px-2 py-0.5 rounded",
              urgency === "critical" ? "bg-atlas-crimson/10 text-atlas-crimson" :
              urgency === "high" ? "bg-atlas-amber/10 text-atlas-amber" :
              "bg-primary/10 text-primary"
            )}>
              {urgency} urgency
            </span>
          </div>
        </div>
      </div>

      {/* Recommended action */}
      <CollapsibleSection
        id="recommendation"
        title="Recommended Action"
        icon={<CheckCircle2 className="h-3.5 w-3.5 text-accent" />}
        expanded={expandedSection === "recommendation"}
        onToggle={() => toggleSection("recommendation")}
      >
        <div className="bg-accent/5 border border-accent/20 rounded-md p-3 mb-3">
          <p className="text-sm text-foreground font-medium">{recommendation}</p>
        </div>
        <p className="text-xs text-muted-foreground mb-3">{evidenceSummary}</p>
        <ExplainabilityDrawer
          summary={recommendation}
          sources={sources}
          confidence={confidence}
          assumptions={assumptions}
          alternatives={alternatives.map(a => a.title)}
        />
      </CollapsibleSection>

      {/* Risk comparison */}
      <CollapsibleSection
        id="risk"
        title="Risk Assessment"
        icon={<Scale className="h-3.5 w-3.5 text-atlas-amber" />}
        expanded={expandedSection === "risk"}
        onToggle={() => toggleSection("risk")}
      >
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-md border border-border bg-secondary/30 p-3">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-3 w-3 text-atlas-amber" />
              <span className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">Risk of Action</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className={cn(
                "text-xl font-heading font-bold",
                riskOfAction.score >= 70 ? "text-atlas-crimson" : riskOfAction.score >= 40 ? "text-atlas-amber" : "text-accent"
              )}>
                {riskOfAction.score}
              </span>
              <span className="text-[10px] text-muted-foreground">/ 100</span>
            </div>
            <ul className="space-y-1">
              {riskOfAction.factors.map((f, i) => (
                <li key={i} className="text-[10px] text-muted-foreground flex items-start gap-1.5">
                  <span className="text-atlas-amber mt-0.5">•</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-md border border-border bg-secondary/30 p-3">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="h-3 w-3 text-atlas-crimson" />
              <span className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">Risk of Inaction</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className={cn(
                "text-xl font-heading font-bold",
                riskOfInaction.score >= 70 ? "text-atlas-crimson" : riskOfInaction.score >= 40 ? "text-atlas-amber" : "text-accent"
              )}>
                {riskOfInaction.score}
              </span>
              <span className="text-[10px] text-muted-foreground">/ 100</span>
            </div>
            <ul className="space-y-1">
              {riskOfInaction.factors.map((f, i) => (
                <li key={i} className="text-[10px] text-muted-foreground flex items-start gap-1.5">
                  <span className="text-atlas-crimson mt-0.5">•</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CollapsibleSection>

      {/* Alternatives */}
      <CollapsibleSection
        id="alternatives"
        title={`Alternatives (${alternatives.length})`}
        icon={<ArrowRight className="h-3.5 w-3.5 text-primary" />}
        expanded={expandedSection === "alternatives"}
        onToggle={() => toggleSection("alternatives")}
      >
        <div className="space-y-2">
          {alternatives.map((alt, i) => (
            <button
              key={i}
              onClick={() => setSelectedAlt(selectedAlt === i ? null : i)}
              className={cn(
                "w-full text-left rounded-md border border-border bg-secondary/30 p-3 transition-all hover:border-primary/30",
                selectedAlt === i && "border-primary/40 bg-primary/5"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <h5 className="text-xs font-medium text-foreground">{alt.title}</h5>
                <span className="text-[9px] text-muted-foreground">{alt.timeToEffect}</span>
              </div>
              <p className="text-[10px] text-muted-foreground mb-2">{alt.description}</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-heading uppercase text-muted-foreground">Risk</span>
                  <div className="w-12 h-1 bg-secondary rounded-full">
                    <div className={cn("h-full rounded-full", alt.riskScore >= 70 ? "bg-atlas-crimson" : alt.riskScore >= 40 ? "bg-atlas-amber" : "bg-accent")} style={{ width: `${alt.riskScore}%` }} />
                  </div>
                  <span className="text-[9px] font-heading text-muted-foreground">{alt.riskScore}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-heading uppercase text-muted-foreground">Benefit</span>
                  <div className="w-12 h-1 bg-secondary rounded-full">
                    <div className="h-full rounded-full bg-accent" style={{ width: `${alt.benefitScore}%` }} />
                  </div>
                  <span className="text-[9px] font-heading text-muted-foreground">{alt.benefitScore}</span>
                </div>
              </div>
              <AnimatePresence>
                {selectedAlt === i && alt.secondOrderEffects.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 pt-2 border-t border-border">
                      <span className="text-[9px] font-heading uppercase text-muted-foreground">Second-order effects</span>
                      <ul className="mt-1 space-y-0.5">
                        {alt.secondOrderEffects.map((e, j) => (
                          <li key={j} className="text-[10px] text-muted-foreground flex items-start gap-1.5">
                            <span className="text-primary mt-0.5">→</span> {e}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          ))}
        </div>
      </CollapsibleSection>

      {/* Stakeholder approval */}
      <CollapsibleSection
        id="stakeholders"
        title={`Approval (${approvedCount}/${stakeholders.length})`}
        icon={<Users className="h-3.5 w-3.5 text-primary" />}
        expanded={expandedSection === "stakeholders"}
        onToggle={() => toggleSection("stakeholders")}
      >
        <div className="space-y-1.5 mb-3">
          {stakeholders.map((s) => {
            const sc = stakeholderStatusConfig[s.status];
            const Icon = sc.icon;
            return (
              <div key={s.name} className="flex items-center gap-3 rounded-md bg-secondary/30 p-2">
                <div className="h-7 w-7 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[9px] font-heading font-semibold text-primary">{s.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-medium text-foreground">{s.name}</span>
                  <p className="text-[9px] text-muted-foreground">{s.role}</p>
                </div>
                <span className={cn("text-[9px] font-heading uppercase px-1.5 py-0.5 rounded border flex items-center gap-1", sc.class)}>
                  <Icon className="h-2.5 w-2.5" />
                  {sc.label}
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex gap-2">
          <Button variant="signal" size="sm" className="flex-1">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Approve
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            Request Changes
          </Button>
        </div>
      </CollapsibleSection>
    </div>
  );
}

function CollapsibleSection({
  id, title, icon, expanded, onToggle, children,
}: {
  id: string; title: string; icon: React.ReactNode; expanded: boolean; onToggle: () => void; children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-secondary/30 transition-all"
      >
        {icon}
        <span className="text-xs font-heading font-medium text-foreground flex-1">{title}</span>
        {expanded ? <ChevronDown className="h-3 w-3 text-muted-foreground" /> : <ChevronRight className="h-3 w-3 text-muted-foreground" />}
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 pt-1">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
