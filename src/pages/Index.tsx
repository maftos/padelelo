
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/use-user-profile";

const Index = () => {
  const { user, loading } = useAuth();
  const { profile, isLoading: profileLoading } = useUserProfile();
  
  // Add detailed logging
  console.log("Index.tsx state:", {
    user,
    loading,
    profileLoading,
    profile,
    isOnboarded: profile?.is_onboarded
  });
  
  if (loading || profileLoading) {
    console.log("Still loading...");
    return null;
  }
  
  // If user is logged in but profile is not loaded, wait
  if (user && !profile) {
    console.log("User exists but no profile yet");
    return null;
  }
  
  // If user is logged in and profile exists, check onboarding status
  if (user && profile) {
    console.log("Checking onboarding status:", profile.is_onboarded);
    // Explicitly check for false since null should also trigger onboarding
    if (profile.is_onboarded === false || profile.is_onboarded === null) {
      console.log("Redirecting to onboarding, profile:", profile);
      return <Navigate to="/onboarding" replace />;
    }
    console.log("User is onboarded, redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  }
  
  console.log("No user, redirecting to home");
  return <Navigate to="/home" replace />;
};

export default Index;
