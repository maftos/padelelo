import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";

export const AuthModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmitPhone = () => {
    // Mock OTP send
    setStep("otp");
  };

  const handleVerifyOTP = () => {
    // Mock successful authentication
    onClose();
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
          {step === "phone" ? (
            <>
              <Input
                type="tel"
                placeholder="WhatsApp number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSubmitPhone}>Continue</Button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <InputOTP maxLength={6} value="" onChange={() => {}}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <Button onClick={handleVerifyOTP} className="w-full">
                Verify Code
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};