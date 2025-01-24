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

  useEffect(() => {
    // Initialize the session from localStorage if available
    const savedSession = localStorage.getItem('supabase.auth.token');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        if (parsed?.currentSession) {
          setSession(parsed.currentSession);
          setUser(parsed.currentSession.user);
        }
      } catch (error) {
        console.error('Error parsing saved session:', error);
        localStorage.removeItem('supabase.auth.token');
      }
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      
      if (event === 'SIGNED_OUT') {
        // Clear local storage and state
        localStorage.removeItem('supabase.auth.token');
        setSession(null);
        setUser(null);
        navigate('/');
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        // Update session and user state
        setSession(session);
        setUser(session?.user ?? null);
        
        // Save session to localStorage
        if (session) {
          localStorage.setItem('supabase.auth.token', JSON.stringify({
            currentSession: session,
            expiresAt: session.expires_at
          }));
        }
      } else if (event === 'USER_DELETED') {
        // Handle account deletion
        await signOut();
        toast({
          title: "Account Deleted",
          description: "Your account has been successfully deleted",
        });
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      // Clear local storage
      localStorage.removeItem('supabase.auth.token');
      // Clear state
      setSession(null);
      setUser(null);
      // Show success message
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account",
      });
      // Redirect to home
      navigate('/');
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        description: "There was a problem signing out. Please try again.",
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