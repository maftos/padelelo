import { useState, useEffect } from "react";
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

  // Save referrerId to session storage when it's available
  useEffect(() => {
    if (referrerId) {
      sessionStorage.setItem('referrerId', referrerId);
    }
  }, [referrerId]);

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
            return "Please enter a valid email address";
          }
          return error.message;
        case 422:
          return "Invalid email format";
        case 429:
          return "Too many attempts. Please try again later";
        default:
          return error.message;
      }
    }
    return error.message;
  };

  const insertReferralTemp = async (referrerId: string, email: string) => {
    try {
      const { error } = await supabase.rpc('insert_referral_temp', {
        referrer_id: referrerId,
        referred_user_email: email
      });

      if (error) {
        console.error("Error inserting referral:", error);
        // We don't want to show this error to the user as the signup was successful
      }
    } catch (err) {
      console.error("Unexpected error inserting referral:", err);
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

      // Save email to session storage
      sessionStorage.setItem('signupEmail', email.trim());

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
        // If we have a referrerId, call insert_referral_temp
        const storedReferrerId = sessionStorage.getItem('referrerId');
        if (storedReferrerId) {
          await insertReferralTemp(storedReferrerId, email.trim());
        }

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
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full"
          disabled={loading}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full"
          disabled={loading}
        />
      </div>

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