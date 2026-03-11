import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface FilterState {
  geography: string[];
  systemType: string[];
  mission: string[];
  riskLevel: string[];
  timeHorizon: string;
}

export interface SavedView {
  id: string;
  name: string;
  filters: FilterState;
  createdAt: string;
}

const defaultFilters: FilterState = {
  geography: [],
  systemType: [],
  mission: [],
  riskLevel: [],
  timeHorizon: "all",
};

const geographyOptions = ["South Asia", "East Asia", "Oceania", "Europe", "West Africa", "Arctic", "Sahel", "North America", "Central Asia", "South America"];
const systemTypeOptions = ["Infrastructure", "Economy", "Ecosystem", "Health", "Climate", "Governance", "Water"];
const missionOptions = ["Pacific Grid Resilience", "Pandemic Preparedness", "Arctic Feedback Loop", "Sahel Food Security", "European Fiscal", "Amazon Deforestation"];
const riskLevelOptions = ["critical", "high", "medium", "low"];
const timeHorizonOptions = [
  { value: "all", label: "All Time" },
  { value: "1h", label: "Last Hour" },
  { value: "24h", label: "Last 24h" },
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
];

interface FilterContextType {
  filters: FilterState;
  savedViews: SavedView[];
  activeViewId: string | null;
  setFilters: (filters: FilterState) => void;
  toggleFilter: (category: keyof Omit<FilterState, "timeHorizon">, value: string) => void;
  setTimeHorizon: (value: string) => void;
  clearFilters: () => void;
  saveView: (name: string) => void;
  loadView: (id: string) => void;
  deleteView: (id: string) => void;
  hasActiveFilters: boolean;
  activeFilterCount: number;
}

const FilterContext = createContext<FilterContextType | null>(null);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFiltersState] = useState<FilterState>(defaultFilters);
  const [savedViews, setSavedViews] = useState<SavedView[]>([
    { id: "sv-1", name: "Critical Infrastructure", filters: { ...defaultFilters, riskLevel: ["critical"], systemType: ["Infrastructure"] }, createdAt: "2d ago" },
    { id: "sv-2", name: "South Asia Monitor", filters: { ...defaultFilters, geography: ["South Asia", "East Asia"] }, createdAt: "5d ago" },
  ]);
  const [activeViewId, setActiveViewId] = useState<string | null>(null);

  const toggleFilter = useCallback((category: keyof Omit<FilterState, "timeHorizon">, value: string) => {
    setFiltersState((prev) => {
      const current = prev[category];
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      return { ...prev, [category]: next };
    });
    setActiveViewId(null);
  }, []);

  const setTimeHorizon = useCallback((value: string) => {
    setFiltersState((prev) => ({ ...prev, timeHorizon: value }));
    setActiveViewId(null);
  }, []);

  const clearFilters = useCallback(() => {
    setFiltersState(defaultFilters);
    setActiveViewId(null);
  }, []);

  const saveView = useCallback((name: string) => {
    const id = `sv-${Date.now()}`;
    setSavedViews((prev) => [...prev, { id, name, filters: { ...filters }, createdAt: "Just now" }]);
    setActiveViewId(id);
  }, [filters]);

  const loadView = useCallback((id: string) => {
    const view = savedViews.find((v) => v.id === id);
    if (view) {
      setFiltersState(view.filters);
      setActiveViewId(id);
    }
  }, [savedViews]);

  const deleteView = useCallback((id: string) => {
    setSavedViews((prev) => prev.filter((v) => v.id !== id));
    if (activeViewId === id) setActiveViewId(null);
  }, [activeViewId]);

  const activeFilterCount = filters.geography.length + filters.systemType.length + filters.mission.length + filters.riskLevel.length + (filters.timeHorizon !== "all" ? 1 : 0);

  return (
    <FilterContext.Provider value={{
      filters, savedViews, activeViewId,
      setFilters: setFiltersState, toggleFilter, setTimeHorizon,
      clearFilters, saveView, loadView, deleteView,
      hasActiveFilters: activeFilterCount > 0,
      activeFilterCount,
    }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilters must be used within FilterProvider");
  return ctx;
}

export { geographyOptions, systemTypeOptions, missionOptions, riskLevelOptions, timeHorizonOptions };
