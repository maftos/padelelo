
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateTournamentLayout } from "@/components/tournament/CreateTournamentLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CreateTournamentStep2() {
  const [venue, setVenue] = useState("");
  const navigate = useNavigate();

  const handleNext = () => {
    if (venue.trim()) {
      localStorage.setItem("tournament_venue", venue.trim());
      navigate("/tournament/create-tournament/step-3");
    }
  };

  return (
    <CreateTournamentLayout currentStep={2} totalSteps={4}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-center">Select Venue</h1>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="venue">Venue</Label>
            <Input
              id="venue"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="Enter venue name"
            />
          </div>
        </div>

        <Button
          className="w-full"
          onClick={handleNext}
          disabled={!venue.trim()}
        >
          Continue
        </Button>
      </div>
    </CreateTournamentLayout>
  );
}
