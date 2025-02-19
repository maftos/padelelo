
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateTournamentLayout } from "@/components/tournament/CreateTournamentLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function CreateTournamentStep6() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!user?.id) {
      toast.error("You must be logged in to create a tournament");
      return;
    }

    setIsSubmitting(true);
    try {
      const name = localStorage.getItem("tournament_name");
      const description = localStorage.getItem("tournament_description");
      const startDate = localStorage.getItem("tournament_start_date");
      const endDate = localStorage.getItem("tournament_end_date");
      const bracketType = localStorage.getItem("tournament_bracket_type");
      const recommendedMmr = localStorage.getItem("tournament_recommended_mmr");
      const privacy = localStorage.getItem("tournament_privacy");

      const { error } = await supabase.rpc('create_tournament', {
        p_name: name,
        p_date: `[${startDate},${endDate}]`,
        p_bracket_type: bracketType,
        p_photo_gallery: [],
        p_venue_id: null, // We'll handle venue selection in a future update
        p_status: 'PENDING',
        p_privacy: privacy,
        p_description: description,
        p_recommended_mmr: parseInt(recommendedMmr || "0"),
        p_user_a_id: user.id
      });

      if (error) throw error;

      // Clear localStorage
      localStorage.removeItem("tournament_name");
      localStorage.removeItem("tournament_description");
      localStorage.removeItem("tournament_start_date");
      localStorage.removeItem("tournament_end_date");
      localStorage.removeItem("tournament_bracket_type");
      localStorage.removeItem("tournament_recommended_mmr");
      localStorage.removeItem("tournament_privacy");

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
    <CreateTournamentLayout currentStep={6} totalSteps={6}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-center">Review & Create</h1>

        <div className="space-y-4">
          <p className="text-center text-muted-foreground">
            Please review your tournament details before creating
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
