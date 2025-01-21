import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";
import { Alert, AlertDescription } from "./ui/alert";
import { AuthError } from "@supabase/supabase-js";

export const AuthModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Clear error when modal is opened/closed
  useEffect(() => {
    setError(null);
  }, [isOpen]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleAuthError = (error: AuthError) => {
    switch (error.message) {
      case "Invalid login credentials":
        return "Invalid email or password";
      case "User already registered":
        return "An account with this email already exists";
      case "Email not confirmed":
        return "Please verify your email before signing in";
      default:
        return error.message;
    }
  };

  const handleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!validateEmail(email)) {
        setError("Please enter a valid email address");
        return;
      }

      if (!validatePassword(password)) {
        setError("Password must be at least 6 characters long");
        return;
      }
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        setError(handleAuthError(signInError));
        return;
      }

      if (data.session) {
        // Session contains the JWT token and user information
        toast({
          title: "Success!",
          description: "You have been successfully signed in",
        });
        onClose();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!validateEmail(email)) {
        setError("Please enter a valid email address");
        return;
      }

      if (!validatePassword(password)) {
        setError("Password must be at least 6 characters long");
        return;
      }
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      });

      if (signUpError) {
        setError(handleAuthError(signUpError));
        return;
      }

      if (data.user) {
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account",
        });
        onClose();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sign In or Create Account</DialogTitle>
          <DialogDescription>
            Enter your email and password to sign in or create a new account.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
            disabled={loading}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex-1"
            disabled={loading}
          />
          <div className="flex gap-2">
            <Button 
              onClick={handleSignIn} 
              disabled={loading}
              className="flex-1"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
            <Button 
              onClick={handleSignUp}
              disabled={loading}
              variant="outline"
              className="flex-1"
            >
              {loading ? "Creating..." : "Sign Up"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};