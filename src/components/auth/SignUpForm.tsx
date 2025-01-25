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
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const referrerId = searchParams.get('ref');

  // Save referrerId to session storage when it's available
  useEffect(() => {
    if (referrerId) {
      sessionStorage.setItem('referrerId', referrerId);
      console.log('Saved referrerId to session storage:', referrerId);
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

  const insertReferralTemp = async (referrer_id: string, referred_user_email: string) => {
    try {
      console.log('Calling insertReferralTemp with:', { referrer_id, referred_user_email });
      
      const { data, error } = await supabase.rpc('insert_referral_temp', {
        referrer_id,
        referred_user_email
      });

      if (error) {
        console.error("Error inserting referral:", error);
        console.error("Error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw error; // Throw the error to be caught by the caller
      }

      console.log("Referral inserted successfully:", data);
      return true;
    } catch (err) {
      console.error("Unexpected error inserting referral:", err);
      throw err; // Re-throw the error to be caught by the caller
    }
  };

  const handleNext = async () => {
    try {
      if (!validateEmail(email)) {
        setError("Please enter a valid email address");
        return;
      }
      
      setLoading(true);
      const trimmedEmail = email.trim();
      sessionStorage.setItem('signupEmail', trimmedEmail);
      console.log('Saved email to session storage:', trimmedEmail);
      
      // Get the stored referrer ID and handle the referral
      const storedReferrerId = sessionStorage.getItem('referrerId');
      if (storedReferrerId) {
        await insertReferralTemp(storedReferrerId, trimmedEmail);
      }
      
      setError(null);
      setStep(2);
    } catch (err) {
      console.error("Error in handleNext:", err);
      setError("Failed to process referral. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    // Clear the stored email when going back
    sessionStorage.removeItem('signupEmail');
    setStep(1);
    setError(null);
  };

  const handleSignUp = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!validatePassword(password)) {
        setError("Password must be at least 6 characters long");
        return;
      }

      const trimmedEmail = email.trim();
      
      const signUpResponse = await supabase.auth.signUp({
        email: trimmedEmail,
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
          disabled={loading || step === 2}
        />
        
        {step === 2 && (
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full"
            disabled={loading}
          />
        )}
      </div>

      <div className="space-y-2">
        {step === 1 ? (
          <Button 
            onClick={handleNext}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Processing..." : "Next"}
          </Button>
        ) : (
          <div className="space-y-2">
            <Button 
              onClick={handleBack}
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              Back
            </Button>
            <Button 
              onClick={handleSignUp}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};