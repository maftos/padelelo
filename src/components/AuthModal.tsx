import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";
import { Alert, AlertDescription } from "./ui/alert";
import { AuthError, AuthApiError } from "@supabase/supabase-js";

export const AuthModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const { toast } = useToast();

  // Clear error when modal is opened/closed
  useEffect(() => {
    setError(null);
    setIsSignUp(false);
  }, [isOpen]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const validateDisplayName = (name: string) => {
    return name.length >= 2;
  };

  const handleAuthError = (error: AuthError) => {
    if (error instanceof AuthApiError) {
      switch (error.status) {
        case 400:
          if (error.message.includes("email_address_invalid")) {
            return "Please enter a valid email address. Example: user@example.com";
          }
          if (error.message === "Email not confirmed") {
            return "Please check your email and click the confirmation link before signing in.";
          }
          switch (error.message) {
            case "Invalid login credentials":
              return "Invalid email or password. Please check your credentials.";
            default:
              return error.message;
          }
        case 422:
          return "Invalid email format.";
        case 429:
          return "Too many attempts. Please try again later.";
        case 500:
          return "An unexpected error occurred. Please try again later.";
        default:
          return error.message;
      }
    }
    return error.message;
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
        console.error("Sign in error:", signInError);
        setError(handleAuthError(signInError));
        return;
      }

      if (data.session) {
        toast({
          title: "Success!",
          description: "You have been successfully signed in",
        });
        onClose();
      }
    } catch (err: any) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred. Please try again.");
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

      if (!validateDisplayName(displayName)) {
        setError("Display name must be at least 2 characters long");
        return;
      }
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            display_name: displayName,
          }
        }
      });

      if (signUpError) {
        console.error("Sign up error:", signUpError);
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
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isSignUp ? "Create Account" : "Sign In"}</DialogTitle>
          <DialogDescription>
            {isSignUp 
              ? "Create a new account to get started."
              : "Enter your email and password to sign in."
            }
            {error?.includes("Email not confirmed") && (
              <p className="mt-2 text-sm text-primary">
                Please check your email inbox and spam folder for the confirmation link.
              </p>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {isSignUp && (
            <Input
              type="text"
              placeholder="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="flex-1"
              disabled={loading}
            />
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
            {isSignUp ? (
              <>
                <Button 
                  onClick={handleSignUp}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? "Creating..." : "Sign Up"}
                </Button>
                <Button
                  onClick={() => setIsSignUp(false)}
                  variant="outline"
                  className="flex-1"
                  disabled={loading}
                >
                  Back to Sign In
                </Button>
              </>
            ) : (
              <>
                <Button 
                  onClick={handleSignIn}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
                <Button 
                  onClick={() => setIsSignUp(true)}
                  variant="outline"
                  className="flex-1"
                  disabled={loading}
                >
                  Create Account
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};