import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { AuthError, AuthApiError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export const useSignUp = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+230"); // Default to Mauritius
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const validatePhoneNumber = (phone: string) => {
    return phone.length > 0; // Basic validation to ensure number is not empty
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleAuthError = (error: AuthError) => {
    if (error instanceof AuthApiError) {
      switch (error.status) {
        case 400:
          if (error.message.includes("Phone number format is invalid")) {
            return "Please enter a valid phone number";
          }
          return error.message;
        case 422:
          // This could indicate Twilio configuration issues
          if (error.message.includes("Invalid From and To pair")) {
            return "WhatsApp messaging is not properly configured. Please contact support.";
          }
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
        setError("Please enter a valid phone number");
        return;
      }

      if (!validatePassword(password)) {
        setError("Password must be at least 6 characters long");
        return;
      }
      
      setLoading(true);
      setError(null);

      const fullPhoneNumber = countryCode + phoneNumber;
      
      // Store the phone number for verification later
      sessionStorage.setItem('signupPhone', fullPhoneNumber);
      
      // Attempt to sign up with phone and password
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