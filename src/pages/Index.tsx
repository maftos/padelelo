
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/use-user-profile";

const Index = () => {
  const { user, loading } = useAuth();
  const { profile, isLoading: profileLoading } = useUserProfile();
  
  if (loading || profileLoading) return null;
  
  // If user is logged in but profile is not loaded, wait
  if (user && !profile) return null;
  
  // If user is logged in and profile exists, check onboarding status
  if (user && profile) {
    // Explicitly check for false since null should also trigger onboarding
    if (profile.is_onboarded === false || profile.is_onboarded === null) {
      console.log("Redirecting to onboarding, profile:", profile);
      return <Navigate to="/onboarding" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }
  
  // If no user, go to home
  return <Navigate to="/home" replace />;
};

export default Index;
