import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { AuthError, AuthApiError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export const useSignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
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

  const insertReferralTemp = async (p_referrer_id: string, p_referred_user_email: string) => {
    try {
      console.log('Calling insertReferralTemp with:', { p_referrer_id, p_referred_user_email });
      
      const { data, error } = await supabase.rpc('insert_referral_temp', {
        p_referrer_id,
        p_referred_user_email
      });

      if (error) {
        console.error("Error inserting referral:", error);
        console.error("Error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }

      console.log("Referral inserted successfully:", data);
      return true;
    } catch (err) {
      console.error("Unexpected error inserting referral:", err);
      throw err;
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

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    step,
    handleNext,
    handleBack,
    handleSignUp,
  };
};