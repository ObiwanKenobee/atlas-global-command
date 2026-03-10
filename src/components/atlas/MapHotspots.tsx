import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";

interface MapHotspot {
  id: string;
  label: string;
  severity: "critical" | "high" | "medium" | "low";
  x: number; // percentage
  y: number; // percentage
  signalTitle: string;
}

interface MapHotspotsProps {
  hotspots: MapHotspot[];
  onHotspotClick: (hotspot: MapHotspot) => void;
  className?: string;
}

const severityPulse = {
  critical: {
    dot: "bg-atlas-crimson",
    ring: "border-atlas-crimson/40",
    glow: "shadow-[0_0_12px_hsl(350,100%,41%,0.5)]",
  },
  high: {
    dot: "bg-atlas-amber",
    ring: "border-atlas-amber/40",
    glow: "shadow-[0_0_10px_hsl(45,100%,50%,0.4)]",
  },
  medium: {
    dot: "bg-primary",
    ring: "border-primary/40",
    glow: "shadow-[0_0_8px_hsl(195,100%,50%,0.3)]",
  },
  low: {
    dot: "bg-muted-foreground",
    ring: "border-muted-foreground/30",
    glow: "",
  },
};

export function MapHotspots({ hotspots, onHotspotClick, className }: MapHotspotsProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className={cn("absolute inset-0 z-10", className)}>
      {hotspots.map((hotspot) => {
        const config = severityPulse[hotspot.severity];
        const isHovered = hoveredId === hotspot.id;

        return (
          <div
            key={hotspot.id}
            className="absolute cursor-pointer group"
            style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%`, transform: "translate(-50%, -50%)" }}
            onClick={() => onHotspotClick(hotspot)}
            onMouseEnter={() => setHoveredId(hotspot.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Outer pulse ring */}
            <motion.div
              className={cn("absolute inset-0 rounded-full border-2", config.ring)}
              animate={{
                scale: [1, 2.5, 1],
                opacity: [0.6, 0, 0.6],
              }}
              transition={{
                duration: hotspot.severity === "critical" ? 2 : 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2,
              }}
              style={{ width: 16, height: 16, marginLeft: -8, marginTop: -8, left: "50%", top: "50%" }}
            />

            {/* Second ring for critical */}
            {hotspot.severity === "critical" && (
              <motion.div
                className={cn("absolute rounded-full border", config.ring)}
                animate={{
                  scale: [1, 3, 1],
                  opacity: [0.3, 0, 0.3],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                style={{ width: 16, height: 16, marginLeft: -8, marginTop: -8, left: "50%", top: "50%" }}
              />
            )}

            {/* Core dot */}
            <div className={cn(
              "relative w-3 h-3 rounded-full transition-transform duration-200",
              config.dot,
              config.glow,
              isHovered && "scale-150",
            )} />

            {/* Tooltip label */}
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute left-1/2 -translate-x-1/2 top-full mt-2 whitespace-nowrap bg-card/95 backdrop-blur-sm border border-border rounded-md px-2.5 py-1.5 pointer-events-none"
              >
                <p className="text-[10px] font-heading font-medium text-foreground">{hotspot.label}</p>
                <p className="text-[9px] text-muted-foreground">{hotspot.signalTitle}</p>
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export const defaultHotspots: MapHotspot[] = [
  { id: "h1", label: "South Asia", severity: "critical", x: 68, y: 45, signalTitle: "Cascading grid failure risk" },
  { id: "h2", label: "East Asia", severity: "high", x: 78, y: 38, signalTitle: "Supply chain disruption" },
  { id: "h3", label: "Oceania", severity: "high", x: 84, y: 68, signalTitle: "Coral bleaching event" },
  { id: "h4", label: "Europe", severity: "medium", x: 50, y: 30, signalTitle: "Fiscal stress indicators" },
  { id: "h5", label: "West Africa", severity: "medium", x: 42, y: 52, signalTitle: "AMR surge" },
  { id: "h6", label: "Arctic", severity: "critical", x: 55, y: 12, signalTitle: "Methane release acceleration" },
  { id: "h7", label: "Sahel", severity: "high", x: 47, y: 48, signalTitle: "Governance fragility" },
  { id: "h8", label: "Central Valley", severity: "medium", x: 18, y: 38, signalTitle: "Aquifer depletion" },
  { id: "h9", label: "Amazon", severity: "high", x: 30, y: 60, signalTitle: "Deforestation acceleration" },
  { id: "h10", label: "SE Asia", severity: "high", x: 76, y: 52, signalTitle: "Pandemic preparedness gap" },
];
