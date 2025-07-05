import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthError, AuthApiError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { countries } from "@/lib/countries";
import { useFormValidation } from "@/hooks/use-form-validation";
import { SignInFormData } from "@/types/auth";

export const SignInForm = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+230");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordlessLoading, setPasswordlessLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { validatePhoneNumber, validatePassword } = useFormValidation();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, '');
    setPhoneNumber(cleaned);
  };

  const formatPhoneDisplay = (phone: string) => {
    if (phone.length <= 1) return phone;
    if (phone.length <= 4) return phone.replace(/(\d{1})(\d{0,3})/, '$1 $2').trim();
    return phone.replace(/(\d{1})(\d{3})(\d{0,4})/, '$1 $2 $3').trim();
  };

  const handleAuthError = (error: AuthError) => {
    if (error instanceof AuthApiError) {
      switch (error.status) {
        case 400:
          if (error.message.includes("Phone number format is invalid")) {
            return "Please enter a valid phone number with country code";
          }
          if (error.message === "Invalid login credentials") {
            return "Invalid phone number or password. Please check your credentials.";
          }
          return error.message;
        case 422:
          return "Invalid phone number format.";
        case 429:
          return "Too many attempts. Please try again later.";
        default:
          return error.message;
      }
    }
    return error.message;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      const fullPhoneNumber = countryCode + phoneNumber;

      if (!validatePhoneNumber(phoneNumber)) {
        setError("Please enter a valid phone number");
        return;
      }

      if (!validatePassword(password)) {
        setError("Password must be at least 6 characters long");
        return;
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        phone: fullPhoneNumber,
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
        navigate('/');
      }
    } catch (err: any) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordlessSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setPasswordlessLoading(true);
      setError(null);

      const fullPhoneNumber = countryCode + phoneNumber;

      if (!validatePhoneNumber(phoneNumber)) {
        setError("Please enter a valid phone number");
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithOtp({
        phone: fullPhoneNumber,
      });

      if (signInError) {
        console.error("Passwordless sign in error:", signInError);
        setError(handleAuthError(signInError));
        return;
      }

      toast({
        title: "SMS Sent!",
        description: "Please check your phone for the verification code",
      });

    } catch (err: any) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setPasswordlessLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {/* Password Login Form */}
      <form onSubmit={handleSignIn} className="space-y-4">
        <div className="space-y-2">
          <Label>WhatsApp Number</Label>
          <div className="flex gap-2">
            <Select 
              value={countryCode} 
              onValueChange={setCountryCode}
              disabled={loading || passwordlessLoading}
            >
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="Code" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {countries.map((country) => (
                  <SelectItem 
                    key={country.code} 
                    value={country.dial_code}
                  >
                    {country.flag} {country.dial_code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Input
              type="tel"
              placeholder="Phone number"
              value={formatPhoneDisplay(phoneNumber)}
              onChange={handlePhoneChange}
              className="flex-1"
              disabled={loading || passwordlessLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Password</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading || passwordlessLoading}
            minLength={6}
          />
        </div>

        <Button 
          type="submit"
          disabled={loading || passwordlessLoading || !phoneNumber || !password}
          className="w-full"
        >
          {loading ? "Signing in..." : "Sign In with Password"}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or
          </span>
        </div>
      </div>

      {/* Passwordless Login Form */}
      <form onSubmit={handlePasswordlessSignIn} className="space-y-4">
        <Button 
          type="submit"
          disabled={loading || passwordlessLoading || !phoneNumber}
          className="w-full"
          variant="outline"
        >
          {passwordlessLoading ? "Sending WhatsApp..." : "Sign In via WhatsApp"}
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          We'll send you a verification code via WhatsApp
        </p>
      </form>
    </div>
  );
};
