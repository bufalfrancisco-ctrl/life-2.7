import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MoodProvider } from "@/hooks/useMood";
import AuthGate from "@/components/AuthGate";
import Index from "./pages/Index.tsx";
import Project from "./pages/Project.tsx";
import History from "./pages/History.tsx";
import Auth from "./pages/Auth.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <MoodProvider>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<AuthGate><Index /></AuthGate>} />
            <Route path="/project" element={<AuthGate><Project /></AuthGate>} />
            <Route path="/history" element={<AuthGate><History /></AuthGate>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </MoodProvider>
  </QueryClientProvider>
);

export default App;
