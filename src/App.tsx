import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "@/components/atlas/AppShell";
import GlobalDashboard from "./pages/GlobalDashboard";
import SignalsPage from "./pages/SignalsPage";
import RisksPage from "./pages/RisksPage";
import MissionsPage from "./pages/MissionsPage";
import SimulationPage from "./pages/SimulationPage";
import WorldModelPage from "./pages/WorldModelPage";
import { MemoryPage, CoordinationPage, OversightPage } from "./pages/PlaceholderPages";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<GlobalDashboard />} />
            <Route path="/signals" element={<SignalsPage />} />
            <Route path="/risks" element={<RisksPage />} />
            <Route path="/missions" element={<MissionsPage />} />
            <Route path="/simulation" element={<SimulationPage />} />
            <Route path="/world-model" element={<WorldModelPage />} />
            <Route path="/memory" element={<MemoryPage />} />
            <Route path="/coordination" element={<CoordinationPage />} />
            <Route path="/oversight" element={<OversightPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
