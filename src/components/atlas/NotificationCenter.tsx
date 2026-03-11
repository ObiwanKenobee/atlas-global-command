import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, X, Check, CheckCheck, AlertTriangle, Radio, Target,
  Shield, ArrowUpRight, Clock, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Notification {
  id: string;
  type: "escalation" | "signal" | "approval" | "mission" | "system";
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  severity?: "critical" | "high" | "medium" | "low";
  actionLabel?: string;
  mission?: string;
}

const defaultNotifications: Notification[] = [
  { id: "n1", type: "escalation", title: "Grid failure threshold exceeded", description: "South Asia grid stress at 82% — immediate coordination needed", timestamp: "12m ago", read: false, severity: "critical", actionLabel: "View Escalation", mission: "Pacific Grid Resilience" },
  { id: "n2", type: "approval", title: "Approval requested: Load shedding protocol", description: "Dr. Chen requests approval for emergency load shedding across India-Bangladesh interconnect", timestamp: "30m ago", read: false, severity: "high", actionLabel: "Review", mission: "Pacific Grid Resilience" },
  { id: "n3", type: "signal", title: "New critical signal detected", description: "Arctic methane release acceleration — permafrost degradation rates exceeding projections by 40%", timestamp: "1h ago", read: false, severity: "critical" },
  { id: "n4", type: "mission", title: "Sahel Food Security: Status update", description: "UNDP submitted stakeholder briefing deck for review", timestamp: "2h ago", read: true, mission: "Sahel Food Security" },
  { id: "n5", type: "system", title: "Model drift alert", description: "FiscalRisk-Ensemble accuracy dropped 4% in 30-day window", timestamp: "3h ago", read: true, severity: "medium" },
  { id: "n6", type: "signal", title: "Coral bleaching event intensifying", description: "Great Barrier Reef sea surface temp anomaly now exceeding 2.3°C", timestamp: "4h ago", read: true, severity: "high" },
  { id: "n7", type: "approval", title: "Cross-border data sharing approved", description: "WB IDA and UNDP approved deforestation intervention funding", timestamp: "1d ago", read: true, mission: "Amazon Deforestation" },
  { id: "n8", type: "escalation", title: "Funding gap escalation", description: "UNDP flagged funding gap for Sahel food security intervention", timestamp: "1d ago", read: true, severity: "high", mission: "Sahel Food Security" },
];

const typeIcons = {
  escalation: AlertTriangle,
  signal: Radio,
  approval: Shield,
  mission: Target,
  system: Bell,
};

const typeColors = {
  escalation: "text-atlas-crimson",
  signal: "text-primary",
  approval: "text-atlas-amber",
  mission: "text-accent",
  system: "text-muted-foreground",
};

const filterTabs = ["all", "escalation", "signal", "approval", "mission"] as const;

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(defaultNotifications);
  const [activeTab, setActiveTab] = useState<typeof filterTabs[number]>("all");

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filtered = activeTab === "all" ? notifications : notifications.filter((n) => n.type === activeTab);

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const dismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
      >
        <Bell className="h-3.5 w-3.5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-atlas-crimson flex items-center justify-center text-[8px] font-heading text-foreground animate-signal-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-96 max-h-[70vh] rounded-lg border border-border bg-card shadow-xl z-50 flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-border flex-shrink-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-heading font-semibold text-foreground">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="text-[9px] bg-atlas-crimson/10 text-atlas-crimson px-1.5 py-0.5 rounded font-heading">{unreadCount} new</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-[9px] text-muted-foreground hover:text-foreground flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-secondary transition-all">
                      <CheckCheck className="h-2.5 w-2.5" />
                      Mark all read
                    </button>
                  )}
                  <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground p-0.5 rounded hover:bg-secondary transition-all">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Filter tabs */}
              <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-border flex-shrink-0">
                {filterTabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "text-[9px] font-heading uppercase tracking-wider px-2 py-1 rounded transition-all",
                      activeTab === tab
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Notification list */}
              <div className="flex-1 overflow-y-auto">
                {filtered.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-xs text-muted-foreground">No notifications</p>
                  </div>
                ) : (
                  filtered.map((notif) => {
                    const Icon = typeIcons[notif.type];
                    return (
                      <div
                        key={notif.id}
                        className={cn(
                          "flex gap-2.5 px-3 py-2.5 border-b border-border hover:bg-secondary/30 transition-all cursor-pointer group",
                          !notif.read && "bg-primary/5"
                        )}
                        onClick={() => markRead(notif.id)}
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          <Icon className={cn("h-3.5 w-3.5", notif.severity === "critical" ? "text-atlas-crimson" : typeColors[notif.type])} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className={cn("text-xs font-medium truncate", notif.read ? "text-muted-foreground" : "text-foreground")}>{notif.title}</h4>
                            {!notif.read && <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />}
                          </div>
                          <p className="text-[10px] text-muted-foreground line-clamp-2 mt-0.5">{notif.description}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[9px] text-muted-foreground">{notif.timestamp}</span>
                            {notif.mission && (
                              <span className="text-[9px] bg-secondary text-muted-foreground px-1 py-0.5 rounded font-heading">{notif.mission}</span>
                            )}
                            {notif.actionLabel && (
                              <button className="text-[9px] text-primary hover:text-primary/80 font-heading flex items-center gap-0.5 ml-auto">
                                {notif.actionLabel}
                                <ChevronRight className="h-2 w-2" />
                              </button>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); dismiss(notif.id); }}
                          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-atlas-crimson transition-all flex-shrink-0 mt-0.5"
                        >
                          <X className="h-2.5 w-2.5" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
