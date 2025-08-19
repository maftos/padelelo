import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PasswordStepProps {
  password: string;
  onPasswordChange: (password: string) => void;
  onNext: () => void;
  canGoNext: boolean;
}

export const PasswordStep = ({ password, onPasswordChange, onNext, canGoNext }: PasswordStepProps) => {

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
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="Enter your password"
            className="h-12 text-base"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};