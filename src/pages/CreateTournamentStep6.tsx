
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateTournamentLayout } from "@/components/tournament/CreateTournamentLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PrivacyType = "INVITE_ONLY" | "FRIENDS" | "PUBLIC";

export default function CreateTournamentStep6() {
  const [privacy, setPrivacy] = useState<PrivacyType | "">("");
  const navigate = useNavigate();

  const handleNext = () => {
    if (privacy) {
      localStorage.setItem("tournament_privacy", privacy);
      navigate("/tournament/create-tournament/step-7");
    }
  };

  return (
    <CreateTournamentLayout currentStep={6} totalSteps={7}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-center">Tournament Privacy</h1>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="privacy">Privacy Setting</Label>
            <Select value={privacy} onValueChange={(value: PrivacyType) => setPrivacy(value)}>
              <SelectTrigger id="privacy">
                <SelectValue placeholder="Select privacy setting" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PUBLIC">Public</SelectItem>
                <SelectItem value="FRIENDS">Friends Only</SelectItem>
                <SelectItem value="INVITE_ONLY">Invite Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          className="w-full"
          onClick={handleNext}
          disabled={!privacy}
        >
          Continue
        </Button>
      </div>
    </CreateTournamentLayout>
  );
}
