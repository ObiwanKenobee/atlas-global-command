import { useState } from "react";
import { MetricCard } from "@/components/atlas/MetricCard";
import { ConfidenceBadge } from "@/components/atlas/ConfidenceBadge";
import { TimelineRail } from "@/components/atlas/TimelineRail";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Users, Building2, CheckCircle2, AlertTriangle, Clock,
  ArrowUpRight, MessageSquare, FileText, Shield, ChevronRight,
  Send, Plus, Circle,
} from "lucide-react";

interface Institution {
  name: string;
  role: string;
  status: "aligned" | "pending" | "blocked" | "reviewing";
  tasksAssigned: number;
  tasksComplete: number;
  avatar: string;
  lastActive: string;
}

interface EscalationItem {
  title: string;
  from: string;
  to: string;
  severity: "critical" | "high" | "medium";
  timestamp: string;
  status: "open" | "acknowledged" | "resolved";
  mission: string;
}

interface ActionItem {
  title: string;
  assignee: string;
  mission: string;
  priority: "critical" | "high" | "medium" | "low";
  due: string;
  status: "pending" | "in-progress" | "review" | "complete";
}

const institutions: Institution[] = [
  { name: "WHO Regional Office", role: "Health Intelligence Lead", status: "aligned", tasksAssigned: 8, tasksComplete: 6, avatar: "WH", lastActive: "5m ago" },
  { name: "UNDP Climate Unit", role: "Ecosystem Assessment", status: "aligned", tasksAssigned: 12, tasksComplete: 9, avatar: "UN", lastActive: "15m ago" },
  { name: "World Bank IDA", role: "Fiscal Risk Analysis", status: "pending", tasksAssigned: 5, tasksComplete: 2, avatar: "WB", lastActive: "2h ago" },
  { name: "ISRO Earth Sciences", role: "Satellite Data Provider", status: "aligned", tasksAssigned: 4, tasksComplete: 4, avatar: "IS", lastActive: "1h ago" },
  { name: "EU DG ECHO", role: "Emergency Coordination", status: "reviewing", tasksAssigned: 6, tasksComplete: 3, avatar: "EU", lastActive: "30m ago" },
  { name: "African Union PSC", role: "Regional Governance", status: "blocked", tasksAssigned: 3, tasksComplete: 0, avatar: "AU", lastActive: "1d ago" },
];

const escalations: EscalationItem[] = [
  { title: "Grid failure threshold exceeded — immediate coordination needed", from: "ISRO Earth Sciences", to: "Pacific Grid Mission Lead", severity: "critical", timestamp: "12m ago", status: "open", mission: "Pacific Grid Resilience" },
  { title: "Funding gap for Sahel food security intervention", from: "UNDP Climate Unit", to: "World Bank IDA", severity: "high", timestamp: "2h ago", status: "acknowledged", mission: "Sahel Food Security" },
  { title: "Data sharing agreement pending — SE Asia health surveillance", from: "WHO Regional Office", to: "EU DG ECHO", severity: "medium", timestamp: "6h ago", status: "open", mission: "Pandemic Preparedness" },
];

const actions: ActionItem[] = [
  { title: "Deploy emergency load shedding protocol", assignee: "Dr. Chen", mission: "Pacific Grid Resilience", priority: "critical", due: "Today", status: "in-progress" },
  { title: "Submit cross-border power sharing request", assignee: "ISRO Team", mission: "Pacific Grid Resilience", priority: "high", due: "Today", status: "pending" },
  { title: "Review pandemic early warning thresholds", assignee: "WHO Team", mission: "Pandemic Preparedness", priority: "high", due: "Tomorrow", status: "review" },
  { title: "Compile satellite deforestation data package", assignee: "UNEP Analyst", mission: "Amazon Deforestation", priority: "medium", due: "Mar 14", status: "in-progress" },
  { title: "Draft fiscal risk assessment for ECB", assignee: "WB Analyst", mission: "European Fiscal", priority: "medium", due: "Mar 15", status: "pending" },
  { title: "Finalize stakeholder briefing deck", assignee: "Coordination Lead", mission: "Sahel Food Security", priority: "low", due: "Mar 16", status: "complete" },
];

const approvals = [
  { title: "Emergency load shedding — South Asia", requestedBy: "Dr. Chen", mission: "Pacific Grid Resilience", status: "awaiting" as const, approvers: ["WHO", "UNDP", "ISRO"], approved: ["ISRO"], timestamp: "30m ago" },
  { title: "Cross-border data sharing protocol", requestedBy: "WHO Team", mission: "Pandemic Preparedness", status: "awaiting" as const, approvers: ["EU DG ECHO", "WHO", "AU PSC"], approved: ["WHO"], timestamp: "4h ago" },
  { title: "Deforestation intervention funding", requestedBy: "UNEP", mission: "Amazon Deforestation", status: "approved" as const, approvers: ["WB IDA", "UNDP"], approved: ["WB IDA", "UNDP"], timestamp: "1d ago" },
];

const activityTimeline = [
  { time: "09:00", label: "WHO shared health surveillance data", type: "signal" as const },
  { time: "09:30", label: "Grid escalation filed by ISRO", type: "escalation" as const },
  { time: "10:00", label: "Emergency protocol review started", type: "decision" as const },
  { time: "10:45", label: "UNDP approved Sahel briefing", type: "intervention" as const },
  { time: "11:15", label: "Cross-border request submitted", type: "signal" as const },
  { time: "12:00", label: "EU reviewing data agreement", type: "decision" as const },
];

const statusColors = {
  aligned: "text-accent bg-accent/10 border-accent/20",
  pending: "text-atlas-amber bg-atlas-amber/10 border-atlas-amber/20",
  blocked: "text-atlas-crimson bg-atlas-crimson/10 border-atlas-crimson/20",
  reviewing: "text-primary bg-primary/10 border-primary/20",
};

const priorityColors = {
  critical: "text-atlas-crimson",
  high: "text-atlas-amber",
  medium: "text-primary",
  low: "text-muted-foreground",
};

const actionStatusConfig = {
  "pending": { label: "Pending", class: "bg-secondary text-muted-foreground" },
  "in-progress": { label: "In Progress", class: "bg-primary/10 text-primary" },
  "review": { label: "Review", class: "bg-atlas-amber/10 text-atlas-amber" },
  "complete": { label: "Complete", class: "bg-accent/10 text-accent" },
};

export default function CoordinationPage() {
  const [selectedTab, setSelectedTab] = useState<"stakeholders" | "actions" | "escalations" | "approvals">("stakeholders");

  return (
    <div className="h-full flex flex-col p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-heading font-semibold text-foreground">Coordination Hub</h1>
          <p className="text-xs text-muted-foreground mt-0.5">6 institutions · 3 active escalations · 2 pending approvals</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <MessageSquare className="h-3 w-3 mr-1" />
            Broadcast
          </Button>
          <Button variant="signal" size="sm">
            <Plus className="h-3 w-3 mr-1" />
            New Action
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-2 mb-4">
        <MetricCard label="Institutions" value="6" variant="default" sparklineData={[4, 4, 5, 5, 6, 6, 6, 6]} />
        <MetricCard label="Open Actions" value="12" change={3} variant="signal" sparklineData={[8, 9, 10, 11, 10, 11, 12, 12]} />
        <MetricCard label="Escalations" value="3" change={1} variant="crimson" sparklineData={[1, 1, 2, 1, 2, 2, 3, 3]} />
        <MetricCard label="Pending Approvals" value="2" variant="amber" sparklineData={[3, 3, 2, 3, 2, 2, 2, 2]} />
        <MetricCard label="Completion Rate" value="62" unit="%" variant="teal" sparklineData={[45, 48, 52, 55, 58, 60, 61, 62]} />
        <MetricCard label="Avg Response" value="2.4" unit="h" change={-0.5} variant="default" sparklineData={[4, 3.5, 3, 3.2, 2.8, 2.6, 2.5, 2.4]} />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-4 border-b border-border pb-px">
        {(["stakeholders", "actions", "escalations", "approvals"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={cn(
              "px-3 py-1.5 text-xs font-heading uppercase tracking-wider transition-all border-b-2 -mb-px",
              selectedTab === tab
                ? "text-primary border-primary"
                : "text-muted-foreground border-transparent hover:text-foreground"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        {/* Main content */}
        <div className="flex-1 overflow-y-auto pr-1">
          {selectedTab === "stakeholders" && (
            <div className="space-y-2">
              {institutions.map((inst) => (
                <div
                  key={inst.name}
                  className="rounded-lg border border-border bg-card p-3 hover:border-primary/30 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-heading font-semibold text-primary">{inst.avatar}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">{inst.name}</h4>
                        <span className={cn("text-[9px] font-heading uppercase tracking-wider px-1.5 py-0.5 rounded border", statusColors[inst.status])}>
                          {inst.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">{inst.role}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs font-heading text-foreground">{inst.tasksComplete}/{inst.tasksAssigned}</div>
                      <div className="w-16 h-1 bg-secondary rounded-full mt-1">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${(inst.tasksComplete / inst.tasksAssigned) * 100}%` }}
                        />
                      </div>
                      <p className="text-[9px] text-muted-foreground mt-0.5">{inst.lastActive}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedTab === "actions" && (
            <div className="space-y-1.5">
              {actions.map((action, i) => {
                const sc = actionStatusConfig[action.status];
                return (
                  <div
                    key={i}
                    className="rounded-lg border border-border bg-card p-3 hover:border-primary/30 transition-all cursor-pointer"
                  >
                    <div className="flex items-start gap-2">
                      <Circle className={cn("h-3.5 w-3.5 mt-0.5 flex-shrink-0", priorityColors[action.priority])} />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-foreground truncate">{action.title}</h4>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="text-[10px] text-muted-foreground">{action.assignee}</span>
                          <span className="text-[10px] bg-secondary text-muted-foreground px-1.5 py-0.5 rounded font-heading">{action.mission}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[10px] text-muted-foreground">{action.due}</span>
                        <span className={cn("text-[9px] font-heading uppercase tracking-wider px-1.5 py-0.5 rounded", sc.class)}>
                          {sc.label}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {selectedTab === "escalations" && (
            <div className="space-y-2">
              {escalations.map((esc, i) => (
                <div
                  key={i}
                  className={cn(
                    "rounded-lg border border-border bg-card p-3 border-l-2 hover:border-primary/30 transition-all cursor-pointer",
                    esc.severity === "critical" && "border-l-atlas-crimson",
                    esc.severity === "high" && "border-l-atlas-amber",
                    esc.severity === "medium" && "border-l-primary",
                  )}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={cn("h-3.5 w-3.5", priorityColors[esc.severity])} />
                      <h4 className="text-sm font-medium text-foreground">{esc.title}</h4>
                    </div>
                    <span className={cn(
                      "text-[9px] font-heading uppercase tracking-wider px-1.5 py-0.5 rounded",
                      esc.status === "open" ? "bg-atlas-crimson/10 text-atlas-crimson" :
                      esc.status === "acknowledged" ? "bg-atlas-amber/10 text-atlas-amber" :
                      "bg-accent/10 text-accent"
                    )}>
                      {esc.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <span>{esc.from}</span>
                    <ArrowUpRight className="h-2.5 w-2.5" />
                    <span className="text-foreground">{esc.to}</span>
                    <span className="mx-1">·</span>
                    <span className="bg-secondary px-1.5 py-0.5 rounded font-heading">{esc.mission}</span>
                    <span className="ml-auto">{esc.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedTab === "approvals" && (
            <div className="space-y-2">
              {approvals.map((appr, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border bg-card p-3 hover:border-primary/30 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="text-sm font-medium text-foreground">{appr.title}</h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Requested by {appr.requestedBy} · {appr.mission}</p>
                    </div>
                    <span className={cn(
                      "text-[9px] font-heading uppercase tracking-wider px-1.5 py-0.5 rounded",
                      appr.status === "awaiting" ? "bg-atlas-amber/10 text-atlas-amber" : "bg-accent/10 text-accent"
                    )}>
                      {appr.status === "awaiting" ? "Awaiting" : "Approved"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {appr.approvers.map((a) => (
                      <span
                        key={a}
                        className={cn(
                          "text-[9px] font-heading px-1.5 py-0.5 rounded border",
                          appr.approved.includes(a)
                            ? "bg-accent/10 text-accent border-accent/20"
                            : "bg-secondary text-muted-foreground border-border"
                        )}
                      >
                        {appr.approved.includes(a) ? "✓ " : ""}{a}
                      </span>
                    ))}
                    <span className="text-[10px] text-muted-foreground ml-auto">{appr.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right sidebar — Activity & Evidence */}
        <div className="w-80 flex-shrink-0 flex flex-col gap-4 min-h-0">
          {/* Activity feed */}
          <div className="border border-border rounded-lg bg-card p-3 flex-shrink-0">
            <h3 className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground mb-2">Activity — Today</h3>
            <TimelineRail events={activityTimeline} />
          </div>

          {/* Accountability map */}
          <div className="border border-border rounded-lg bg-card p-3 flex-1 overflow-y-auto">
            <h3 className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground mb-3">Accountability Map</h3>
            <div className="space-y-3">
              {[
                { mission: "Pacific Grid Resilience", leads: ["Dr. Chen", "ISRO"], status: "critical" },
                { mission: "Pandemic Preparedness", leads: ["WHO Team", "EU ECHO"], status: "high" },
                { mission: "Sahel Food Security", leads: ["UNDP", "AU PSC"], status: "medium" },
              ].map((m, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      m.status === "critical" ? "bg-atlas-crimson" : m.status === "high" ? "bg-atlas-amber" : "bg-primary"
                    )} />
                    <span className="text-xs font-medium text-foreground">{m.mission}</span>
                  </div>
                  <div className="flex gap-1 pl-3.5">
                    {m.leads.map((l) => (
                      <span key={l} className="text-[9px] bg-secondary text-muted-foreground px-1.5 py-0.5 rounded font-heading">{l}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick share */}
          <div className="border border-border rounded-lg bg-card p-3 flex-shrink-0">
            <h3 className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground mb-2">Share Evidence</h3>
            <div className="flex gap-1.5">
              <div className="flex-1 h-7 rounded-md bg-secondary border border-border px-2 flex items-center">
                <span className="text-[10px] text-muted-foreground">Attach intel or note...</span>
              </div>
              <Button variant="outline" size="icon-sm">
                <Send className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
