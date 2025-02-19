
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateTournamentLayout } from "@/components/tournament/CreateTournamentLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type BracketType = "SINGLE_ELIM" | "DOUBLE_ELIM" | "ROUND_ROBIN" | "AMERICANO_SOLO" | "MEXICANO_SOLO" | "AMERICANO_TEAM" | "MEXICANO_TEAM" | "MIXICANO";
type PrivacyType = "INVITE_ONLY" | "FRIENDS" | "PUBLIC";
type ApprovalType = "AUTOMATIC" | "MANUAL";

export default function CreateTournamentStep7() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [maxPlayers, setMaxPlayers] = useState<string>("");
  const [approvalType, setApprovalType] = useState<ApprovalType>("AUTOMATIC");
  const [mainPhoto, setMainPhoto] = useState<string>("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!user?.id) {
      toast.error("You must be logged in to create a tournament");
      return;
    }

    if (!maxPlayers) {
      toast.error("Please enter the maximum number of players");
      return;
    }

    setIsSubmitting(true);
    try {
      // Retrieve all stored data
      const name = localStorage.getItem("tournament_name");
      const description = localStorage.getItem("tournament_description");
      const startDate = new Date(localStorage.getItem("tournament_start_date") || "");
      const endDate = new Date(localStorage.getItem("tournament_end_date") || "");
      const bracketType = localStorage.getItem("tournament_bracket_type") as BracketType;
      const recommendedMmr = localStorage.getItem("tournament_recommended_mmr");
      const privacy = localStorage.getItem("tournament_privacy") as PrivacyType;
      const venueId = localStorage.getItem("tournament_venue_id");

      if (!bracketType || !privacy || !venueId || !name || !description || !startDate || !endDate) {
        throw new Error("Missing required tournament settings");
      }

      const { error } = await supabase.rpc('create_tournament', {
        p_name: name,
        p_start_date: startDate.toISOString(),
        p_end_date: endDate.toISOString(),
        p_bracket_type: bracketType,
        p_main_photo: mainPhoto || null,
        p_venue_id: venueId,
        p_privacy: privacy,
        p_description: description,
        p_recommended_mmr: parseInt(recommendedMmr || "0"),
        p_max_players: parseInt(maxPlayers),
        p_approval_type: approvalType,
        p_user_a_id: user.id,
        p_admins: [] // Empty array for now, could be enhanced with admin selection
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
      localStorage.removeItem("tournament_venue_id");

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
    <CreateTournamentLayout currentStep={7} totalSteps={7}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-center">Final Details</h1>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="maxPlayers">Maximum Players</Label>
            <Input
              id="maxPlayers"
              type="number"
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(e.target.value)}
              placeholder="Enter maximum number of players"
              min="2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="approvalType">Approval Type</Label>
            <Select value={approvalType} onValueChange={(value: ApprovalType) => setApprovalType(value)}>
              <SelectTrigger id="approvalType">
                <SelectValue placeholder="Select approval type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AUTOMATIC">Automatic</SelectItem>
                <SelectItem value="MANUAL">Manual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mainPhoto">Main Photo URL</Label>
            <Input
              id="mainPhoto"
              type="text"
              value={mainPhoto}
              onChange={(e) => setMainPhoto(e.target.value)}
              placeholder="Enter main photo URL (optional)"
            />
          </div>
        </div>

        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={isSubmitting || !maxPlayers}
        >
          {isSubmitting ? "Creating Tournament..." : "Create Tournament"}
        </Button>
      </div>
    </CreateTournamentLayout>
  );
}
