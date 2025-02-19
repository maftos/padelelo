
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
import Onboarding from "./pages/Onboarding";
import Index from "./pages/Index";
import Tournaments from "./pages/Tournaments";
import TournamentDetail from "./pages/TournamentDetail";
import CreateTournament from "./pages/CreateTournament";
import CreateTournamentStep2 from "./pages/CreateTournamentStep2";
import CreateTournamentStep3 from "./pages/CreateTournamentStep3";
import CreateTournamentStep4 from "./pages/CreateTournamentStep4";
import CreateTournamentStep5 from "./pages/CreateTournamentStep5";
import CreateTournamentStep6 from "./pages/CreateTournamentStep6";
import CreateTournamentStep7 from "./pages/CreateTournamentStep7";
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
            <Route path="/" element={<Index />} />
            <Route path="/home" element={<Home />} />
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
            <Route path="/onboarding/*" element={<Onboarding />} />
            <Route path="/tournaments" element={<Tournaments />} />
            <Route path="/tournaments/:tournamentId" element={<TournamentDetail />} />
            <Route path="/tournament/create-tournament" element={<CreateTournament />} />
            <Route path="/tournament/create-tournament/step-2" element={<CreateTournamentStep2 />} />
            <Route path="/tournament/create-tournament/step-3" element={<CreateTournamentStep3 />} />
            <Route path="/tournament/create-tournament/step-4" element={<CreateTournamentStep4 />} />
            <Route path="/tournament/create-tournament/step-5" element={<CreateTournamentStep5 />} />
            <Route path="/tournament/create-tournament/step-6" element={<CreateTournamentStep6 />} />
            <Route path="/tournament/create-tournament/step-7" element={<CreateTournamentStep7 />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
