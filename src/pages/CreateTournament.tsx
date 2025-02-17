
import { useState } from "react";
import { CreateTournamentLayout } from "@/components/tournament/CreateTournamentLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

export default function CreateTournament() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleNext = () => {
    if (name.trim() && description.trim()) {
      localStorage.setItem("tournament_name", name.trim());
      localStorage.setItem("tournament_description", description.trim());
      navigate("/tournament/create-tournament/step-2");
    }
  };

  return (
    <CreateTournamentLayout currentStep={1} totalSteps={4}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-center">Create Tournament</h1>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tournament Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter tournament name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter tournament description"
            />
          </div>
        </div>

        <Button
          className="w-full"
          onClick={handleNext}
          disabled={!name.trim() || !description.trim()}
        >
          Continue
        </Button>
      </div>
    </CreateTournamentLayout>
  );
}
