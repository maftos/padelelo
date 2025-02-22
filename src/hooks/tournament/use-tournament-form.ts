
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export type BracketType = 
  | "SINGLE_ELIM"
  | "DOUBLE_ELIM"
  | "ROUND_ROBIN"
  | "AMERICANO_SOLO"
  | "MEXICANO_SOLO"
  | "AMERICANO_TEAM"
  | "MEXICANO_TEAM"
  | "MIXICANO";

export interface TournamentFormData {
  name: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  venue: string;
  description: string;
  maxPlayers: string;
  bracketType: BracketType;
}

export const useTournamentForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showEndDate, setShowEndDate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [venues, setVenues] = useState<{ venue_id: string; name: string; }[]>([]);
  
  const [formData, setFormData] = useState<TournamentFormData>({
    name: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    venue: "",
    description: "",
    maxPlayers: "",
    bracketType: "SINGLE_ELIM", // Default to single elimination
  });

  const validateForm = () => {
    const requiredFields = {
      name: formData.name.trim() !== "",
      startDate: formData.startDate !== "",
      startTime: formData.startTime !== "",
      venue: formData.venue !== "",
      bracketType: formData.bracketType !== undefined,
    };

    if (showEndDate) {
      return (
        Object.values(requiredFields).every(Boolean) &&
        formData.endDate !== "" &&
        formData.endTime !== ""
      );
    }

    return Object.values(requiredFields).every(Boolean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      toast.error("You must be logged in to create a tournament");
      return;
    }

    setIsSubmitting(true);
    try {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}+04:00`).toISOString();
      const endDateTime = showEndDate 
        ? new Date(`${formData.endDate}T${formData.endTime}+04:00`).toISOString()
        : new Date(`${formData.startDate}T${formData.startTime}+04:00`).toISOString();

      const maxPlayers = formData.maxPlayers ? parseInt(formData.maxPlayers) : 16;

      const { error } = await supabase.rpc('create_tournament', {
        p_max_players: maxPlayers,
        p_venue_id: formData.venue,
        p_start_date: startDateTime,
        p_end_date: endDateTime,
        p_bracket_type: formData.bracketType,
        p_user_a_id: user.id,
      });

      if (error) throw error;

      toast.success("Tournament created successfully!");
      navigate("/tournaments");
    } catch (error) {
      console.error('Error creating tournament:', error);
      toast.error("Failed to create tournament");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    showEndDate,
    setShowEndDate,
    isSubmitting,
    venues,
    setVenues,
    validateForm,
    handleSubmit,
  };
};
