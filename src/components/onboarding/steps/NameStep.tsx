
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NameStepProps {
  firstName: string;
  lastName: string;
  onFirstNameChange: (name: string) => void;
  onLastNameChange: (name: string) => void;
  onNext: () => void;
  canGoNext: boolean;
}

export const NameStep = ({ firstName, lastName, onFirstNameChange, onLastNameChange, onNext, canGoNext }: NameStepProps) => {

  return (
    <div className="flex-1 flex flex-col justify-center space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">What's your name?</h1>
        <p className="text-muted-foreground">We'll use this to personalize your profile</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="first_name" className="text-base font-medium">
            First name
          </Label>
          <Input
            id="first_name"
            type="text"
            value={firstName}
            onChange={(e) => onFirstNameChange(e.target.value)}
            placeholder="Enter your first name"
            className="h-12 text-base"
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="last_name" className="text-base font-medium">
            Last name
          </Label>
          <Input
            id="last_name"
            type="text"
            value={lastName}
            onChange={(e) => onLastNameChange(e.target.value)}
            placeholder="Enter your last name"
            className="h-12 text-base"
          />
        </div>
      </div>
    </div>
  );
};
