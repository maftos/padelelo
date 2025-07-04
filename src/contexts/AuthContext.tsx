import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Handle auth state changes and token refresh
  useEffect(() => {
    // Clear any stale session data
    const handleAuthError = () => {
      setSession(null);
      setUser(null);
      // Clear all Supabase auth data from localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('supabase.auth.')) {
          localStorage.removeItem(key);
        }
      });
      navigate('/login');
    };

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        handleAuthError();
        return;
      }
      
      if (session) {
        setSession(session);
        setUser(session.user);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      
      if (event === 'SIGNED_OUT') {
        handleAuthError();
        toast({
          title: "Signed out",
          description: "You have been signed out of your account",
        });
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session) {
          setSession(session);
          setUser(session.user);
        }
      } else if (event === 'USER_UPDATED') {
        if (session?.user) {
          setUser(session.user);
        }
      }
      
      setLoading(false);
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const signOut = async () => {
    try {
      // First clear all auth data from localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('supabase.auth.')) {
          localStorage.removeItem(key);
        }
      });
      
      // Clear context state before signing out
      setSession(null);
      setUser(null);
      
      // Then sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Show success message
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account",
      });
      
      // Navigate to login page
      navigate('/login');
    } catch (error: any) {
      // Even if there's an error, we want to clear the local state
      setSession(null);
      setUser(null);
      navigate('/login');
      
      toast({
        title: "Signed out",
        description: "You have been signed out, but there was an error communicating with the server",
        variant: "destructive",
      });
    }
  };

  const value = {
    session,
    user,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}