
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

type BracketType = "SINGLE_ELIM" | "DOUBLE_ELIM" | "ROUND_ROBIN" | "AMERICANO_SOLO" | "MEXICANO_SOLO" | "AMERICANO_TEAM" | "MEXICANO_TEAM" | "MIXICANO";

export default function CreateTournamentStep3() {
  const [bracketType, setBracketType] = useState<BracketType | "">("");
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
            <Select value={bracketType} onValueChange={(value: BracketType) => setBracketType(value)}>
              <SelectTrigger id="bracket-type">
                <SelectValue placeholder="Select bracket type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SINGLE_ELIM">Single Elimination</SelectItem>
                <SelectItem value="DOUBLE_ELIM">Double Elimination</SelectItem>
                <SelectItem value="ROUND_ROBIN">Round Robin</SelectItem>
                <SelectItem value="AMERICANO_SOLO">Americano (Solo)</SelectItem>
                <SelectItem value="MEXICANO_SOLO">Mexicano (Solo)</SelectItem>
                <SelectItem value="AMERICANO_TEAM">Americano (Team)</SelectItem>
                <SelectItem value="MEXICANO_TEAM">Mexicano (Team)</SelectItem>
                <SelectItem value="MIXICANO">Mixicano</SelectItem>
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
