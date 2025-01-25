import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthError, AuthApiError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams } from "react-router-dom";

export const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const referrerId = searchParams.get('ref');

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleAuthError = (error: AuthError) => {
    if (error instanceof AuthApiError) {
      switch (error.status) {
        case 400:
          if (error.message.includes("email_address_invalid")) {
            return "Please enter a valid email address. Example: user@example.com";
          }
          return error.message;
        case 422:
          return "Invalid email format.";
        case 429:
          return "Too many attempts. Please try again later.";
        default:
          return error.message;
      }
    }
    return error.message;
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

      const signUpResponse = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            referrer_id: referrerId
          }
        }
      });

      if (signUpResponse.error) {
        console.error("Sign up error:", signUpResponse.error);
        setError(handleAuthError(signUpResponse.error));
        return;
      }

      if (signUpResponse.data.user) {
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account",
        });
        navigate('/');
      }
    } catch (err: any) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
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
      <Button 
        onClick={handleSignUp}
        disabled={loading}
        className="w-full"
      >
        {loading ? "Creating account..." : "Sign Up"}
      </Button>
    </div>
  );
};