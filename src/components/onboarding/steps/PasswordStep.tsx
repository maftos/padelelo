import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface PasswordStepProps {
  password: string;
  onPasswordChange: (password: string) => void;
  onNext: () => void;
  canGoNext: boolean;
  isSubmitting: boolean;
}

export const PasswordStep = ({ password, onPasswordChange, onNext, canGoNext, isSubmitting }: PasswordStepProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex-1 flex flex-col justify-center space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Set your password</h1>
        <p className="text-muted-foreground">Keep your account secure</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="password" className="text-base font-medium">
            Choose a secure password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              placeholder="Enter your password"
              className="h-12 text-base pr-12"
              autoFocus
              disabled={isSubmitting}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-12 px-3 py-2 hover:bg-transparent"
              onClick={togglePasswordVisibility}
              disabled={isSubmitting}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
        </div>
      </div>

    </div>
  );
};