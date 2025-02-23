
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { useFormValidation } from "@/hooks/use-form-validation";
import { VerificationFormData } from "@/types/auth";

export default function Verify() {
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const phone = location.state?.phone;
  const { validateVerificationCode } = useFormValidation();

  useEffect(() => {
    if (!phone) {
      navigate('/signup');
    }
  }, [phone, navigate]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateVerificationCode(verificationCode)) {
      toast({
        title: "Error",
        description: "Please enter a valid 6-digit code",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: phone,
        token: verificationCode,
        type: 'sms'
      });

      if (error) {
        console.error("Verification error:", error);
        if (error.message.toLowerCase().includes("expired")) {
          toast({
            title: "Code Expired",
            description: "This verification code has expired. Please go back and request a new code.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
        return;
      }

      toast({
        title: "Success!",
        description: "Your phone number has been verified.",
      });
      
      navigate('/');
    } catch (error: any) {
      console.error("Verification error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="bg-card rounded-lg p-6 shadow-lg space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Verify your WhatsApp</h1>
            <p className="text-muted-foreground">
              Enter the 6-digit code sent to {phone}
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                type="text"
                inputMode="numeric"
                maxLength={6}
                pattern="\d{6}"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                className="text-center text-lg tracking-widest"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !validateVerificationCode(verificationCode)}
            >
              {loading ? "Verifying..." : "Verify"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
