
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

export default function CreateTournamentStep3() {
  const [bracketType, setBracketType] = useState("");
  const navigate = useNavigate();

  const handleNext = () => {
    if (bracketType) {
      localStorage.setItem("tournament_bracket_type", bracketType);
      navigate("/tournament/create-tournament/step-4");
    }
  };

  return (
    <CreateTournamentLayout currentStep={3} totalSteps={6}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-center">Tournament Format</h1>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bracket-type">Bracket Type</Label>
            <Select value={bracketType} onValueChange={setBracketType}>
              <SelectTrigger id="bracket-type">
                <SelectValue placeholder="Select bracket type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SINGLE_ELIM">Single Elimination</SelectItem>
                <SelectItem value="DOUBLE_ELIM">Double Elimination</SelectItem>
                <SelectItem value="ROUND_ROBIN">Round Robin</SelectItem>
                <SelectItem value="MEXICANO">Mexicano</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          className="w-full"
          onClick={handleNext}
          disabled={!bracketType}
        >
          Continue
        </Button>
      </div>
    </CreateTournamentLayout>
  );
}
