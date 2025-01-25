import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Leaderboard from "./pages/Leaderboard";
import Friends from "./pages/Friends";
import Index from "./pages/Index";
import ReleaseNotes from "./pages/ReleaseNotes";
import MatchmakingMath from "./pages/MatchmakingMath";
import FutureImprovements from "./pages/FutureImprovements";
import Matches from "./pages/Matches";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/register-match" element={<Index />} />
          <Route path="/release-notes" element={<ReleaseNotes />} />
          <Route path="/matchmaking-math" element={<MatchmakingMath />} />
          <Route path="/future-improvements" element={<FutureImprovements />} />
        </Routes>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;