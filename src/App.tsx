
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { FacebookLayout } from "@/components/layouts/FacebookLayout";
import { MobileHeader } from "@/components/navigation/MobileHeader";

// Page imports
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";
import RegisterMatch from "./pages/RegisterMatch";
import Tournaments from "./pages/Tournaments";
import Friends from "./pages/Friends";
import Matches from "./pages/Matches";
import Profile from "./pages/Profile";
import Onboarding from "./pages/Onboarding";
import CreateTournament from "./pages/CreateTournament";
import EditTournament from "./pages/EditTournament";
import TournamentDetail from "./pages/TournamentDetail";
import HowItWorks from "./pages/HowItWorks";
import MatchmakingMath from "./pages/MatchmakingMath";
import Roadmap from "./pages/Roadmap";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <MobileHeader />
            <Routes>
              {/* Public routes without sidebar */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/matchmaking-math" element={<MatchmakingMath />} />
              <Route path="/roadmap" element={<Roadmap />} />
              
              {/* Protected routes with Facebook layout */}
              <Route path="/dashboard" element={
                <FacebookLayout>
                  <Dashboard />
                </FacebookLayout>
              } />
              <Route path="/leaderboard" element={
                <FacebookLayout>
                  <Leaderboard />
                </FacebookLayout>
              } />
              <Route path="/register-match" element={
                <FacebookLayout>
                  <RegisterMatch />
                </FacebookLayout>
              } />
              <Route path="/tournaments" element={
                <FacebookLayout>
                  <Tournaments />
                </FacebookLayout>
              } />
              <Route path="/tournaments/create" element={
                <FacebookLayout>
                  <CreateTournament />
                </FacebookLayout>
              } />
              <Route path="/tournaments/:id/edit" element={
                <FacebookLayout>
                  <EditTournament />
                </FacebookLayout>
              } />
              <Route path="/tournaments/:id" element={
                <FacebookLayout>
                  <TournamentDetail />
                </FacebookLayout>
              } />
              <Route path="/friends" element={
                <FacebookLayout>
                  <Friends />
                </FacebookLayout>
              } />
              <Route path="/matches" element={
                <FacebookLayout>
                  <Matches />
                </FacebookLayout>
              } />
              <Route path="/profile" element={
                <FacebookLayout>
                  <Profile />
                </FacebookLayout>
              } />
              <Route path="/onboarding" element={
                <FacebookLayout>
                  <Onboarding />
                </FacebookLayout>
              } />
            </Routes>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
