import { Routes as RouterRoutes, Route } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import Profile from "@/pages/Profile";
import { useAuth } from "@/contexts/AuthContext";

export const Routes = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navigation />
      <RouterRoutes>
        <Route path="/profile" element={<Profile />} />
        {/* Add more routes as needed */}
      </RouterRoutes>
    </>
  );
};