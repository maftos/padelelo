
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import RegisterMatch from "./pages/RegisterMatch";
import Matches from "./pages/Matches";
import Friends from "./pages/Friends";
import Leaderboard from "./pages/Leaderboard";
import Roadmap from "./pages/Roadmap";
import MatchmakingMath from "./pages/MatchmakingMath";
import HowItWorks from "./pages/HowItWorks";
import Verify from "./pages/Verify";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/register-match" element={<RegisterMatch />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/matchmaking-math" element={<MatchmakingMath />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
