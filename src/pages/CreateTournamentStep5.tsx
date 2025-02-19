
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

export default function CreateTournamentStep5() {
  const [privacy, setPrivacy] = useState("");
  const navigate = useNavigate();

  const handleNext = () => {
    if (privacy) {
      localStorage.setItem("tournament_privacy", privacy);
      navigate("/tournament/create-tournament/step-6");
    }
  };

  return (
    <CreateTournamentLayout currentStep={5} totalSteps={6}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-center">Tournament Privacy</h1>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="privacy">Privacy Setting</Label>
            <Select value={privacy} onValueChange={setPrivacy}>
              <SelectTrigger id="privacy">
                <SelectValue placeholder="Select privacy setting" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PUBLIC">Public</SelectItem>
                <SelectItem value="PRIVATE">Private</SelectItem>
                <SelectItem value="UNLISTED">Unlisted</SelectItem>
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
