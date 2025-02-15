
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/use-user-profile";

const Index = () => {
  const { user, loading } = useAuth();
  const { profile, isLoading: profileLoading } = useUserProfile();
  
  if (loading || profileLoading) return null;
  
  if (user && profile && !profile.is_onboarded) {
    return <Navigate to="/onboarding" replace />;
  }
  
  return <Navigate to={user ? "/dashboard" : "/home"} replace />;
};

export default Index;
