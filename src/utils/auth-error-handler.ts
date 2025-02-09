
import { AuthError, AuthApiError } from "@supabase/supabase-js";

export const handleAuthError = (error: AuthError): string => {
  if (error instanceof AuthApiError) {
    switch (error.status) {
      case 400:
        if (error.message.includes("Phone number format is invalid")) {
          return "Please enter a valid phone number";
        }
        return error.message;
      case 422:
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
