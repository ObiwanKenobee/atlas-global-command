import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";

interface GraphNode {
  id: string;
  label: string;
  type: "system" | "risk" | "institution" | "policy" | "resource";
  x: number;
  y: number;
}

interface GraphEdge {
  from: string;
  to: string;
  type: "dependency" | "influence" | "causal";
}

const nodes: GraphNode[] = [
  { id: "power", label: "Power Grid", type: "system", x: 400, y: 200 },
  { id: "water", label: "Water Supply", type: "resource", x: 250, y: 320 },
  { id: "health", label: "Healthcare", type: "system", x: 550, y: 320 },
  { id: "climate", label: "Climate System", type: "system", x: 180, y: 150 },
  { id: "economy", label: "Economy", type: "system", x: 600, y: 180 },
  { id: "food", label: "Food Security", type: "resource", x: 300, y: 420 },
  { id: "transport", label: "Transport", type: "system", x: 500, y: 420 },
  { id: "gov", label: "Governance", type: "institution", x: 400, y: 80 },
  { id: "policy", label: "Energy Policy", type: "policy", x: 200, y: 230 },
  { id: "migration", label: "Migration", type: "risk", x: 650, y: 380 },
];

const edges: GraphEdge[] = [
  { from: "climate", to: "power", type: "causal" },
  { from: "climate", to: "water", type: "causal" },
  { from: "power", to: "health", type: "dependency" },
  { from: "power", to: "water", type: "dependency" },
  { from: "power", to: "transport", type: "dependency" },
  { from: "water", to: "food", type: "dependency" },
  { from: "water", to: "health", type: "influence" },
  { from: "economy", to: "power", type: "influence" },
  { from: "gov", to: "policy", type: "influence" },
  { from: "policy", to: "power", type: "influence" },
  { from: "food", to: "migration", type: "causal" },
  { from: "health", to: "economy", type: "influence" },
  { from: "transport", to: "economy", type: "dependency" },
];

const typeColors = {
  system: "bg-primary/20 border-primary/40 text-primary",
  risk: "bg-atlas-crimson/20 border-atlas-crimson/40 text-atlas-crimson",
  institution: "bg-atlas-amber/20 border-atlas-amber/40 text-atlas-amber",
  policy: "bg-accent/20 border-accent/40 text-accent",
  resource: "bg-foreground/10 border-foreground/30 text-foreground",
};

const edgeColors = {
  dependency: "stroke-primary/40",
  influence: "stroke-atlas-amber/30",
  causal: "stroke-atlas-crimson/40",
};

export default function WorldModelPage() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const connectedEdges = hoveredNode
    ? edges.filter(e => e.from === hoveredNode || e.to === hoveredNode)
    : [];
  const connectedNodeIds = new Set(connectedEdges.flatMap(e => [e.from, e.to]));

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-heading font-semibold text-foreground">World Model</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Knowledge graph — system dependencies and causal relationships</p>
        </div>
        <div className="flex items-center gap-3">
          {Object.entries(typeColors).map(([type, cls]) => (
            <div key={type} className="flex items-center gap-1.5">
              <span className={cn("h-2 w-2 rounded-full border", cls)} />
              <span className="text-[10px] font-heading uppercase text-muted-foreground">{type}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 border border-border rounded-lg bg-card overflow-hidden relative">
        <svg className="w-full h-full" viewBox="0 0 800 500">
          {/* Edges */}
          {edges.map((edge, i) => {
            const from = nodes.find(n => n.id === edge.from)!;
            const to = nodes.find(n => n.id === edge.to)!;
            const isHighlighted = hoveredNode && (edge.from === hoveredNode || edge.to === hoveredNode);
            const isDimmed = hoveredNode && !isHighlighted;
            return (
              <line
                key={i}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                className={cn(
                  edgeColors[edge.type],
                  "transition-all duration-300",
                  isDimmed && "opacity-10",
                  isHighlighted && "opacity-100 stroke-[2]",
                )}
                strokeWidth={isHighlighted ? 2 : 1}
                strokeDasharray={edge.type === "influence" ? "4 4" : undefined}
              />
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const isDimmed = hoveredNode && !connectedNodeIds.has(node.id) && node.id !== hoveredNode;
            return (
              <g
                key={node.id}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                className="cursor-pointer"
              >
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.id === hoveredNode ? 28 : 24}
                  className={cn(
                    "transition-all duration-300",
                    isDimmed ? "opacity-20" : "opacity-100",
                  )}
                  fill={
                    node.type === "risk" ? "hsl(350 100% 41% / 0.15)" :
                    node.type === "institution" ? "hsl(45 100% 50% / 0.15)" :
                    node.type === "policy" ? "hsl(162 100% 47% / 0.15)" :
                    node.type === "resource" ? "hsl(220 30% 92% / 0.08)" :
                    "hsl(195 100% 50% / 0.15)"
                  }
                  stroke={
                    node.type === "risk" ? "hsl(350 100% 41% / 0.4)" :
                    node.type === "institution" ? "hsl(45 100% 50% / 0.4)" :
                    node.type === "policy" ? "hsl(162 100% 47% / 0.4)" :
                    node.type === "resource" ? "hsl(220 30% 92% / 0.2)" :
                    "hsl(195 100% 50% / 0.4)"
                  }
                  strokeWidth={node.id === hoveredNode ? 2 : 1}
                />
                <text
                  x={node.x}
                  y={node.y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={cn(
                    "text-[9px] font-medium fill-current transition-opacity duration-300",
                    isDimmed ? "opacity-20" : "opacity-100",
                  )}
                  fill={
                    node.type === "risk" ? "hsl(350 100% 60%)" :
                    node.type === "institution" ? "hsl(45 100% 60%)" :
                    node.type === "policy" ? "hsl(162 100% 60%)" :
                    node.type === "resource" ? "hsl(220 30% 80%)" :
                    "hsl(195 100% 60%)"
                  }
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
