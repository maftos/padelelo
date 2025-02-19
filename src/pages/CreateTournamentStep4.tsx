
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateTournamentLayout } from "@/components/tournament/CreateTournamentLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function CreateTournamentStep4() {
  const [recommendedMmr, setRecommendedMmr] = useState("");
  const navigate = useNavigate();

  const handleNext = () => {
    if (recommendedMmr) {
      localStorage.setItem("tournament_recommended_mmr", recommendedMmr);
      navigate("/tournament/create-tournament/step-5");
    }
  };

  return (
    <CreateTournamentLayout currentStep={4} totalSteps={6}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-center">Recommended Level</h1>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mmr">Recommended MMR</Label>
            <Input
              id="mmr"
              type="number"
              value={recommendedMmr}
              onChange={(e) => setRecommendedMmr(e.target.value)}
              placeholder="Enter recommended MMR"
              min="0"
              max="5000"
            />
          </div>
        </div>

        <Button
          className="w-full"
          onClick={handleNext}
          disabled={!recommendedMmr}
        >
          Continue
        </Button>
      </div>
    </CreateTournamentLayout>
  );
}
