import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, GitBranch } from "lucide-react";
import { useState } from "react";

interface ExplainabilityDrawerProps {
  summary: string;
  sources: string[];
  confidence: number;
  assumptions: string[];
  alternatives?: string[];
  className?: string;
}

export function ExplainabilityDrawer({
  summary, sources, confidence, assumptions, alternatives, className,
}: ExplainabilityDrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("rounded-lg border border-border bg-card overflow-hidden", className)}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 p-3 text-left hover:bg-secondary/50 transition-colors group"
      >
        <GitBranch className="h-3.5 w-3.5 text-atlas-amber flex-shrink-0" />
        <span className="text-xs text-foreground flex-1">{summary}</span>
        <span className="text-[10px] font-heading text-atlas-amber border border-atlas-amber/30 rounded-full px-2 py-0.5">
          {confidence}% conf
        </span>
        <ChevronDown className={cn(
          "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
          open && "rotate-180"
        )} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-3 border-t border-border pt-3">
              <div>
                <p className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground mb-1">Data Sources</p>
                <div className="flex flex-wrap gap-1">
                  {sources.map((s) => (
                    <span key={s} className="text-[10px] bg-secondary text-foreground px-1.5 py-0.5 rounded">{s}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground mb-1">Assumptions</p>
                <ul className="space-y-0.5">
                  {assumptions.map((a) => (
                    <li key={a} className="text-[10px] text-muted-foreground flex items-start gap-1.5">
                      <span className="h-1 w-1 rounded-full bg-atlas-amber mt-1 flex-shrink-0" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
              {alternatives && alternatives.length > 0 && (
                <div>
                  <p className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground mb-1">Alternative Hypotheses</p>
                  <ul className="space-y-0.5">
                    {alternatives.map((a) => (
                      <li key={a} className="text-[10px] text-muted-foreground flex items-start gap-1.5">
                        <span className="h-1 w-1 rounded-full bg-primary mt-1 flex-shrink-0" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
