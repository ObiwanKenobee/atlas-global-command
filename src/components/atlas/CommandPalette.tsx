import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Globe, Radio, Target, BarChart3, FlaskConical, Network, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CommandItem {
  id: string;
  label: string;
  description: string;
  category: "signal" | "mission" | "system" | "page";
  icon: React.ElementType;
  path?: string;
}

const items: CommandItem[] = [
  // Pages
  { id: "overview", label: "Overview", description: "Global situational awareness", category: "page", icon: Globe, path: "/" },
  { id: "signals-page", label: "Signals & Alerts", description: "Signal monitoring center", category: "page", icon: Radio, path: "/signals" },
  { id: "risks-page", label: "Risk Dashboard", description: "Failure probability analysis", category: "page", icon: BarChart3, path: "/risks" },
  { id: "missions-page", label: "Missions", description: "Mission workspace", category: "page", icon: Target, path: "/missions" },
  { id: "sim-page", label: "Simulation Studio", description: "Scenario modeling", category: "page", icon: FlaskConical, path: "/simulation" },
  { id: "world-page", label: "World Model", description: "Knowledge graph explorer", category: "page", icon: Network, path: "/world-model" },
  // Signals
  { id: "sig-1", label: "Cascading grid failure — South Asia", description: "Critical · Infrastructure · Live", category: "signal", icon: Radio },
  { id: "sig-2", label: "Supply chain disruption — Rare earth", description: "High · Economy · Live", category: "signal", icon: Radio },
  { id: "sig-3", label: "Coral bleaching — Great Barrier Reef", description: "High · Ecosystem", category: "signal", icon: Radio },
  { id: "sig-4", label: "Arctic methane release acceleration", description: "Critical · Climate", category: "signal", icon: Radio },
  // Missions
  { id: "mis-1", label: "Pacific Grid Resilience", description: "Active · 14 signals · Critical risk", category: "mission", icon: Target },
  { id: "mis-2", label: "Pandemic Preparedness — SE Asia", description: "Active · 8 signals · High risk", category: "mission", icon: Target },
  { id: "mis-3", label: "Arctic Feedback Loop Monitor", description: "Monitoring · 22 signals", category: "mission", icon: Target },
  // Systems
  { id: "sys-1", label: "Power Grid", description: "Stress: 82% · Rising", category: "system", icon: BarChart3 },
  { id: "sys-2", label: "Water Supply", description: "Stress: 71% · Rising", category: "system", icon: BarChart3 },
  { id: "sys-3", label: "Healthcare", description: "Stress: 45% · Stable", category: "system", icon: BarChart3 },
];

const categoryLabels: Record<string, string> = {
  page: "Navigate",
  signal: "Signals",
  mission: "Missions",
  system: "Systems",
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const filtered = query.length === 0
    ? items
    : items.filter(
        (item) =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      );

  const grouped = filtered.reduce<Record<string, CommandItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const flatFiltered = Object.values(grouped).flat();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        setQuery("");
        setSelectedIndex(0);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const selectItem = useCallback((item: CommandItem) => {
    if (item.path) {
      navigate(item.path);
    }
    setOpen(false);
    setQuery("");
  }, [navigate]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, flatFiltered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && flatFiltered[selectedIndex]) {
        selectItem(flatFiltered[selectedIndex]);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, selectedIndex, flatFiltered, selectItem]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 z-50 w-full max-w-lg"
          >
            <div className="rounded-xl border border-border bg-card shadow-2xl overflow-hidden">
              {/* Input */}
              <div className="flex items-center gap-3 px-4 h-12 border-b border-border">
                <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search signals, missions, systems..."
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                />
                <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-80 overflow-y-auto p-1.5">
                {flatFiltered.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-6">No results found</p>
                )}
                {Object.entries(grouped).map(([category, categoryItems]) => (
                  <div key={category}>
                    <p className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground px-2.5 py-1.5 mt-1">
                      {categoryLabels[category] || category}
                    </p>
                    {categoryItems.map((item) => {
                      const globalIdx = flatFiltered.indexOf(item);
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => selectItem(item)}
                          onMouseEnter={() => setSelectedIndex(globalIdx)}
                          className={cn(
                            "w-full flex items-center gap-3 px-2.5 py-2 rounded-md text-left transition-colors",
                            globalIdx === selectedIndex
                              ? "bg-primary/10 text-primary"
                              : "text-foreground hover:bg-secondary",
                          )}
                        >
                          <Icon className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium truncate">{item.label}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{item.description}</p>
                          </div>
                          {item.path && (
                            <span className="text-[9px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded flex-shrink-0">↵</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center gap-3 px-4 h-8 border-t border-border text-[10px] text-muted-foreground">
                <span>↑↓ Navigate</span>
                <span>↵ Select</span>
                <span>Esc Close</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
