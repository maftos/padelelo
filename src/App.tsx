import { Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Navigation } from "@/components/Navigation";
import { AuthProvider } from "@/contexts/AuthContext";
import Home from "@/pages/Home";
import Profile from "@/pages/Profile";
import RegisterMatch from "@/pages/RegisterMatch";
import Leaderboard from "@/pages/Leaderboard";
import Friends from "@/pages/Friends";
import Matches from "@/pages/Matches";
import ReleaseNotes from "@/pages/ReleaseNotes";
import MatchmakingMath from "@/pages/MatchmakingMath";
import FutureImprovements from "@/pages/FutureImprovements";
import { SignUpPage } from "./pages/SignUp";

function App() {
  return (
    <AuthProvider>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/register-match" element={<RegisterMatch />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/release-notes" element={<ReleaseNotes />} />
        <Route path="/matchmaking-math" element={<MatchmakingMath />} />
        <Route path="/future-improvements" element={<FutureImprovements />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
      <Toaster />
    </AuthProvider>
  );
}

export default App;