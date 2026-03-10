import { cn } from "@/lib/utils";
import { X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface InspectorPanelProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export function InspectorPanel({ open, onClose, title, subtitle, children, className }: InspectorPanelProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 360, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          className={cn(
            "h-full border-l border-border bg-card flex-shrink-0 overflow-hidden flex flex-col",
            className,
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 h-11 border-b border-border flex-shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs font-heading font-medium text-foreground truncate">{title}</span>
              {subtitle && <span className="text-[10px] text-muted-foreground truncate">· {subtitle}</span>}
            </div>
            <button
              onClick={onClose}
              className="h-6 w-6 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {children}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
