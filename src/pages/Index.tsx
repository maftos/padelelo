
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user, loading } = useAuth();
  
  if (loading) return null; // Prevent flashing of content during auth check
  
  return <Navigate to={user ? "/dashboard" : "/home"} replace />;
};

export default Index;
