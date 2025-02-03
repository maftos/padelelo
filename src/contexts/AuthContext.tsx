import { createContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userId: string | null;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  userId: null,
  signOut: async () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAuthError = () => {
    setSession(null);
    setUser(null);
    navigate("/login");
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error.message);
        toast({
          title: "Error signing out",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        setUser(session.user);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      
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
        } else {
          handleAuthError();
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        userId: user?.id ?? null,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};