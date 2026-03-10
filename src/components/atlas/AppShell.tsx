import { cn } from "@/lib/utils";
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Globe, Radio, BarChart3, Target, FlaskConical,
  Network, Clock, Users, Shield, Search, Bell, ChevronRight,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { icon: Globe, label: "Overview", path: "/" },
  { icon: Radio, label: "Signals", path: "/signals" },
  { icon: BarChart3, label: "Risks", path: "/risks" },
  { icon: Target, label: "Missions", path: "/missions" },
  { icon: FlaskConical, label: "Simulation", path: "/simulation" },
  { icon: Network, label: "World Model", path: "/world-model" },
  { icon: Clock, label: "Memory", path: "/memory" },
  { icon: Users, label: "Coordination", path: "/coordination" },
  { icon: Shield, label: "Model Oversight", path: "/oversight" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [navExpanded, setNavExpanded] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Left Navigation Rail */}
      <motion.nav
        className="h-full flex-shrink-0 bg-card border-r border-border flex flex-col items-center py-4 z-30 relative"
        animate={{ width: navExpanded ? 200 : 56 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        onMouseEnter={() => setNavExpanded(true)}
        onMouseLeave={() => setNavExpanded(false)}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-6 px-3 w-full">
          <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
            <Globe className="h-4 w-4 text-primary" />
          </div>
          {navExpanded && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm font-heading font-semibold text-foreground tracking-wider"
            >
              ATLAS
            </motion.span>
          )}
        </div>

        {/* Nav Items */}
        <div className="flex-1 w-full space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-2 py-2 rounded-md transition-all duration-150 group relative",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r bg-primary"
                    transition={{ duration: 0.2 }}
                  />
                )}
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {navExpanded && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs font-medium whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Bottom items */}
        <div className="w-full px-2 space-y-1">
          <div className="h-px bg-border mx-1 mb-2" />
          <div className="flex items-center gap-3 px-2 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-all cursor-pointer">
            <div className="h-6 w-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-heading font-semibold text-primary">OP</span>
            </div>
            {navExpanded && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs">
                Operator
              </motion.span>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Command Bar */}
        <header className="h-11 flex-shrink-0 border-b border-border bg-card/80 backdrop-blur-sm flex items-center px-4 gap-3 z-20">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-heading uppercase tracking-wider text-foreground text-[11px]">
              {navItems.find(i => i.path === location.pathname)?.label || "Atlas"}
            </span>
            <ChevronRight className="h-3 w-3" />
            <span>Global</span>
          </div>

          <div className="flex-1" />

          {/* Search */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="flex items-center gap-2 h-7 px-3 rounded-md bg-secondary border border-border text-xs text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
          >
            <Search className="h-3 w-3" />
            <span>Search signals...</span>
            <kbd className="hidden sm:inline text-[10px] bg-background px-1 rounded border border-border">⌘K</kbd>
          </button>

          {/* Region Selector */}
          <button className="flex items-center gap-1.5 h-7 px-2.5 rounded-md bg-secondary border border-border text-xs text-muted-foreground hover:text-foreground transition-all">
            <Globe className="h-3 w-3" />
            <span>Global</span>
          </button>

          {/* Notifications */}
          <button className="relative h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
            <Bell className="h-3.5 w-3.5" />
            <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-primary animate-signal-pulse" />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
