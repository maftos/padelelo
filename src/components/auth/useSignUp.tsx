
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { AuthApiError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { handleAuthError } from "@/utils/auth-error-handler";
import { usePhoneInput } from "@/hooks/auth/use-phone-input";
import { usePasswordInput } from "@/hooks/auth/use-password-input";

export const useSignUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const {
    phoneNumber,
    setPhoneNumber,
    countryCode,
    setCountryCode,
    isPhoneValid,
    getFullPhoneNumber,
  } = usePhoneInput();

  const {
    password,
    setPassword,
    isPasswordValid,
  } = usePasswordInput();

  const handleNext = async () => {
    try {
      if (!isPhoneValid()) {
        setError("Please enter a valid phone number");
        return;
      }

      if (!isPasswordValid()) {
        setError("Password must be at least 6 characters long");
        return;
      }
      
      setLoading(true);
      setError(null);

      const fullPhoneNumber = getFullPhoneNumber();
      sessionStorage.setItem('signupPhone', fullPhoneNumber);
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        phone: fullPhoneNumber,
        password,
        options: {
          channel: 'whatsapp'
        }
      });

      if (signUpError) {
        console.error("Sign up error:", signUpError);
        setError(handleAuthError(signUpError));
        return;
      }

      if (data?.user) {
        toast({
          title: "Verification code sent!",
          description: "Please check your WhatsApp for the verification code",
        });
        navigate('/verify', { state: { phone: fullPhoneNumber } });
      }
    } catch (err: any) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    phoneNumber,
    setPhoneNumber,
    countryCode,
    setCountryCode,
    password,
    setPassword,
    loading,
    error,
    handleNext,
  };
};
