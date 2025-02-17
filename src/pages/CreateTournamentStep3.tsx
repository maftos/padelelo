
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateTournamentLayout } from "@/components/tournament/CreateTournamentLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CreateTournamentStep3() {
  const [mmr, setMMR] = useState("");
  const navigate = useNavigate();

  const handleNext = () => {
    if (mmr.trim()) {
      localStorage.setItem("tournament_mmr", mmr.trim());
      navigate("/tournament/create-tournament/step-4");
    }
  };

  return (
    <CreateTournamentLayout currentStep={3} totalSteps={4}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-center">Recommended MMR</h1>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mmr">Minimum MMR Required</Label>
            <Input
              id="mmr"
              type="number"
              value={mmr}
              onChange={(e) => setMMR(e.target.value)}
              placeholder="Enter recommended MMR"
            />
          </div>
        </div>

        <Button
          className="w-full"
          onClick={handleNext}
          disabled={!mmr.trim()}
        >
          Continue
        </Button>
      </div>
    </CreateTournamentLayout>
  );
}
