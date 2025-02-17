
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateTournamentLayout } from "@/components/tournament/CreateTournamentLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function CreateTournamentStep4() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const name = localStorage.getItem("tournament_name");
      const description = localStorage.getItem("tournament_description");
      const venue = localStorage.getItem("tournament_venue");
      const mmr = localStorage.getItem("tournament_mmr");

      const { error } = await supabase.rpc('create_tournament', {
        p_name: name,
        p_description: description,
        p_venue: venue,
        p_recommended_mmr: parseInt(mmr || "0"),
      });

      if (error) throw error;

      // Clear localStorage
      localStorage.removeItem("tournament_name");
      localStorage.removeItem("tournament_description");
      localStorage.removeItem("tournament_venue");
      localStorage.removeItem("tournament_mmr");

      toast.success("Tournament created successfully!");
      navigate("/tournaments");
    } catch (error) {
      console.error('Error creating tournament:', error);
      toast.error("Failed to create tournament");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CreateTournamentLayout currentStep={4} totalSteps={4}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-center">Confirm Details</h1>

        <div className="space-y-4">
          <p className="text-center text-muted-foreground">
            Review your tournament details before creating
          </p>
        </div>

        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating Tournament..." : "Create Tournament"}
        </Button>
      </div>
    </CreateTournamentLayout>
  );
}
