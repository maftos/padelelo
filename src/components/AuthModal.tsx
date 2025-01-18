import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";
import { Alert, AlertDescription } from "./ui/alert";

export const AuthModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmitPhone = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) throw error;

      setStep("otp");
      toast({
        title: "Verification code sent",
        description: "Please check your phone for the verification code",
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setLoading(true);
      setError(null);

      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
      const { error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: 'sms'
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "You have been successfully authenticated",
      });
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === "phone" ? "Enter your phone number" : "Enter verification code"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {step === "phone" ? (
            <>
              <Input
                type="tel"
                placeholder="Phone number (e.g. +23012345678)"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="flex-1"
                disabled={loading}
              />
              <Button onClick={handleSubmitPhone} disabled={loading}>
                {loading ? "Sending..." : "Continue"}
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <InputOTP 
                maxLength={6} 
                value={otp} 
                onChange={setOtp}
                disabled={loading}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <Button 
                onClick={handleVerifyOTP} 
                className="w-full"
                disabled={loading || otp.length !== 6}
              >
                {loading ? "Verifying..." : "Verify Code"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};