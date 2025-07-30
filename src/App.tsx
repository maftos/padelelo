
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ManageMatches from "./pages/ManageMatches";
import CreateMatch from "./pages/CreateMatch";
import EditMatch from "./pages/EditMatch";
import Matches from "./pages/Matches";
import Friends from "./pages/Friends";
import Leaderboard from "./pages/Leaderboard";
import Roadmap from "./pages/Roadmap";
import MatchmakingMath from "./pages/MatchmakingMath";
import HowItWorks from "./pages/HowItWorks";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";
import Index from "./pages/Index";
import Tournaments from "./pages/Tournaments";
import TournamentDetail from "./pages/TournamentDetail";
import CreateTournament from "./pages/CreateTournament";
import EditTournament from "./pages/EditTournament";
import PadelCourts from "./pages/PadelCourts";
import PadelCourtDetail from "./pages/PadelCourtDetail";
import PlayerMatching from "./pages/PlayerMatching";
import NotFound from "./pages/NotFound";
import News from "./pages/News";
import Settings from "./pages/Settings";
import EditProfile from "./pages/EditProfile";
import { Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { MainLayout } from "./components/layouts/MainLayout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/home" element={<Navigate to="/" replace />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/:userId" element={<Profile />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/manage-bookings" element={<ManageMatches />} />
              <Route path="/create-match" element={<CreateMatch />} />
              <Route path="/edit-booking/:bookingId" element={<EditMatch />} />
              <Route path="/matches" element={<Matches />} />
              <Route path="/friends" element={<Friends />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/roadmap" element={<Roadmap />} />
              <Route path="/matchmaking-math" element={<MatchmakingMath />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/onboarding/*" element={<Onboarding />} />
              <Route path="/tournaments" element={<Tournaments />} />
              <Route path="/tournaments/:tournamentId" element={<TournamentDetail />} />
              <Route path="/tournaments/:tournamentId/edit" element={<EditTournament />} />
              <Route path="/tournament/create-tournament" element={<CreateTournament />} />
              <Route path="/padel-courts" element={<PadelCourts />} />
              <Route path="/padel-courts/:courtId" element={<PadelCourtDetail />} />
              <Route path="/open-bookings" element={<PlayerMatching />} />
              <Route path="/news" element={<News />} />
              {/* Catch-all route for 404 - must be last */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
          <Toaster />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
