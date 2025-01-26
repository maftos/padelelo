import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";

// Pages
import Index from "@/pages/Index";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import Profile from "@/pages/Profile";
import Friends from "@/pages/Friends";
import Matches from "@/pages/Matches";
import Leaderboard from "@/pages/Leaderboard";
import MatchmakingMath from "@/pages/MatchmakingMath";
import Roadmap from "@/pages/Roadmap";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/auth/signup" element={<SignUp />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/matchmaking-math" element={<MatchmakingMath />} />
            <Route path="/roadmap" element={<Roadmap />} />
          </Routes>
        </Router>
        <Toaster />
        <SonnerToaster position="bottom-right" />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;