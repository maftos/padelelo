import { FC } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const App: FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
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
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;