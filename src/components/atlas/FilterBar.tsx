import { useState } from "react";
import { cn } from "@/lib/utils";
import { useFilters, geographyOptions, systemTypeOptions, missionOptions, riskLevelOptions, timeHorizonOptions } from "./FilterContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter, X, ChevronDown, Save, Bookmark, Trash2, Share2, Globe, Layers, Target, AlertTriangle, Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const categoryConfig = {
  geography: { label: "Geography", icon: Globe, options: geographyOptions },
  systemType: { label: "System Type", icon: Layers, options: systemTypeOptions },
  mission: { label: "Mission", icon: Target, options: missionOptions },
  riskLevel: { label: "Risk Level", icon: AlertTriangle, options: riskLevelOptions },
};

const riskColors: Record<string, string> = {
  critical: "bg-atlas-crimson/20 text-atlas-crimson border-atlas-crimson/30",
  high: "bg-atlas-amber/20 text-atlas-amber border-atlas-amber/30",
  medium: "bg-primary/20 text-primary border-primary/30",
  low: "bg-muted text-muted-foreground border-border",
};

export function FilterBar() {
  const { filters, toggleFilter, setTimeHorizon, clearFilters, saveView, savedViews, loadView, deleteView, hasActiveFilters, activeFilterCount, activeViewId } = useFilters();
  const [expanded, setExpanded] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [showSaved, setShowSaved] = useState(false);

  return (
    <div className="flex-shrink-0">
      {/* Compact bar */}
      <div className="flex items-center gap-2 px-4 py-1.5 border-b border-border bg-card/50">
        <button
          onClick={() => setExpanded(!expanded)}
          className={cn(
            "flex items-center gap-1.5 h-6 px-2 rounded text-[10px] font-heading uppercase tracking-wider transition-all",
            hasActiveFilters ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Filter className="h-2.5 w-2.5" />
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-primary text-primary-foreground rounded-full h-3.5 w-3.5 flex items-center justify-center text-[8px]">{activeFilterCount}</span>
          )}
          <ChevronDown className={cn("h-2.5 w-2.5 transition-transform", expanded && "rotate-180")} />
        </button>

        {/* Active filter chips */}
        {hasActiveFilters && (
          <div className="flex items-center gap-1 flex-1 overflow-x-auto">
            {(Object.keys(categoryConfig) as Array<keyof typeof categoryConfig>).map((cat) => 
              filters[cat].map((val) => (
                <span
                  key={`${cat}-${val}`}
                  className={cn(
                    "flex items-center gap-1 text-[9px] font-heading px-1.5 py-0.5 rounded border whitespace-nowrap",
                    cat === "riskLevel" ? riskColors[val] : "bg-secondary text-foreground border-border"
                  )}
                >
                  {val}
                  <button onClick={() => toggleFilter(cat, val)} className="hover:text-atlas-crimson">
                    <X className="h-2 w-2" />
                  </button>
                </span>
              ))
            )}
            {filters.timeHorizon !== "all" && (
              <span className="flex items-center gap-1 text-[9px] font-heading px-1.5 py-0.5 rounded border bg-secondary text-foreground border-border whitespace-nowrap">
                <Clock className="h-2 w-2" />
                {timeHorizonOptions.find(t => t.value === filters.timeHorizon)?.label}
                <button onClick={() => setTimeHorizon("all")} className="hover:text-atlas-crimson">
                  <X className="h-2 w-2" />
                </button>
              </span>
            )}
            <button onClick={clearFilters} className="text-[9px] text-muted-foreground hover:text-atlas-crimson whitespace-nowrap ml-1">
              Clear all
            </button>
          </div>
        )}

        <div className="flex items-center gap-1 ml-auto">
          {/* Saved views */}
          <div className="relative">
            <button
              onClick={() => setShowSaved(!showSaved)}
              className={cn(
                "flex items-center gap-1 h-6 px-2 rounded text-[10px] font-heading uppercase tracking-wider transition-all",
                activeViewId ? "bg-accent/10 text-accent" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Bookmark className="h-2.5 w-2.5" />
              Views
            </button>
            <AnimatePresence>
              {showSaved && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute right-0 top-full mt-1 w-56 rounded-lg border border-border bg-card shadow-lg z-50 p-2"
                >
                  <div className="text-[9px] font-heading uppercase tracking-wider text-muted-foreground px-2 py-1">Saved Views</div>
                  {savedViews.map((view) => (
                    <div
                      key={view.id}
                      className={cn(
                        "flex items-center justify-between px-2 py-1.5 rounded hover:bg-secondary cursor-pointer group",
                        activeViewId === view.id && "bg-primary/10"
                      )}
                    >
                      <button onClick={() => { loadView(view.id); setShowSaved(false); }} className="flex-1 text-left">
                        <span className="text-xs text-foreground">{view.name}</span>
                        <span className="text-[9px] text-muted-foreground ml-2">{view.createdAt}</span>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteView(view.id); }}
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-atlas-crimson transition-all"
                      >
                        <Trash2 className="h-2.5 w-2.5" />
                      </button>
                    </div>
                  ))}
                  {savedViews.length === 0 && <p className="text-[10px] text-muted-foreground px-2 py-1">No saved views</p>}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Save current */}
          {hasActiveFilters && (
            <div className="relative">
              <button
                onClick={() => setSaveDialogOpen(!saveDialogOpen)}
                className="flex items-center gap-1 h-6 px-2 rounded text-[10px] font-heading uppercase tracking-wider text-muted-foreground hover:text-foreground transition-all"
              >
                <Save className="h-2.5 w-2.5" />
              </button>
              <AnimatePresence>
                {saveDialogOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="absolute right-0 top-full mt-1 w-52 rounded-lg border border-border bg-card shadow-lg z-50 p-2"
                  >
                    <input
                      type="text"
                      value={saveName}
                      onChange={(e) => setSaveName(e.target.value)}
                      placeholder="View name..."
                      className="w-full h-7 text-xs bg-secondary border border-border rounded px-2 text-foreground placeholder:text-muted-foreground mb-1.5"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && saveName.trim()) {
                          saveView(saveName.trim());
                          setSaveName("");
                          setSaveDialogOpen(false);
                        }
                      }}
                    />
                    <Button
                      variant="signal"
                      size="sm"
                      className="w-full h-6 text-[10px]"
                      onClick={() => {
                        if (saveName.trim()) {
                          saveView(saveName.trim());
                          setSaveName("");
                          setSaveDialogOpen(false);
                        }
                      }}
                    >
                      Save View
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Expanded filter panel */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-b border-border bg-card/30"
          >
            <div className="px-4 py-3 grid grid-cols-2 md:grid-cols-5 gap-4">
              {(Object.keys(categoryConfig) as Array<keyof typeof categoryConfig>).map((cat) => {
                const config = categoryConfig[cat];
                const Icon = config.icon;
                return (
                  <div key={cat}>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Icon className="h-2.5 w-2.5 text-muted-foreground" />
                      <span className="text-[9px] font-heading uppercase tracking-wider text-muted-foreground">{config.label}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {config.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => toggleFilter(cat, opt)}
                          className={cn(
                            "text-[9px] font-heading px-1.5 py-0.5 rounded border transition-all",
                            filters[cat].includes(opt)
                              ? cat === "riskLevel" ? riskColors[opt] : "bg-primary/10 text-primary border-primary/20"
                              : "bg-secondary text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
                          )}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Time horizon */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Clock className="h-2.5 w-2.5 text-muted-foreground" />
                  <span className="text-[9px] font-heading uppercase tracking-wider text-muted-foreground">Time Horizon</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {timeHorizonOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setTimeHorizon(opt.value)}
                      className={cn(
                        "text-[9px] font-heading px-1.5 py-0.5 rounded border transition-all",
                        filters.timeHorizon === opt.value
                          ? "bg-primary/10 text-primary border-primary/20"
                          : "bg-secondary text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
