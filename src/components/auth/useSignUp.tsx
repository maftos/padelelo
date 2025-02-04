import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { AuthError, AuthApiError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export const useSignUp = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  const navigate = useNavigate();

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleAuthError = (error: AuthError) => {
    if (error instanceof AuthApiError) {
      switch (error.status) {
        case 400:
          if (error.message.includes("Phone number format is invalid")) {
            return "Please enter a valid phone number in international format (e.g. +1234567890)";
          }
          return error.message;
        case 422:
          return "Invalid phone number format";
        case 429:
          return "Too many attempts. Please try again later";
        default:
          return error.message;
      }
    }
    return error.message;
  };

  const handleNext = async () => {
    try {
      if (!validatePhoneNumber(phoneNumber)) {
        setError("Please enter a valid phone number in international format (e.g. +1234567890)");
        return;
      }
      
      setLoading(true);
      const trimmedPhone = phoneNumber.trim();
      sessionStorage.setItem('signupPhone', trimmedPhone);
      
      setError(null);
      setStep(2);
    } catch (err) {
      console.error("Error in handleNext:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    sessionStorage.removeItem('signupPhone');
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

      const trimmedPhone = phoneNumber.trim();
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        phone: trimmedPhone,
        password,
        options: {
          data: {
            phone: trimmedPhone
          }
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
        navigate('/verify', { state: { phone: trimmedPhone } });
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