
import { useAuth } from "@/contexts/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import { PageContainer } from "@/components/layouts/PageContainer";
import { CreateTournamentLayout } from "@/components/tournament/CreateTournamentLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Navigation } from "@/components/Navigation";

export default function EditTournament() {
  const { tournamentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    recommendedMmr: "",
    maxPlayers: "",
    startDate: "",
    endDate: "",
    bracketType: "",
    mainPhoto: "",
    approvalType: "",
    privacy: "",
  });

  // Fetch the existing tournament data
  const { data: tournament, isLoading, error } = useQuery({
    queryKey: ['tournament', tournamentId, user?.id],
    queryFn: async () => {
      const { data, error } = await (supabase.rpc as any)('view_tournament', {
        p_tournament_id: tournamentId,
        p_user_a_id: user?.id || null
      });

      if (error) {
        console.error('Error fetching tournament:', error);
        throw error;
      }

      return data;
    }
  });

  // Mutation for updating tournament
  const updateTournament = useMutation({
    mutationFn: async (updates: any) => {
      const { error } = await (supabase.rpc as any)('edit_tournament', {
        tournament_id: tournamentId,
        user_a_id: user?.id,
        updates
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Tournament updated successfully');
      navigate(`/tournaments/${tournamentId}`);
    },
    onError: (error) => {
      toast.error('Failed to update tournament');
      console.error('Error updating tournament:', error);
    }
  });

  // Update form data when tournament data is fetched
  useEffect(() => {
    if (tournament) {
      setFormData({
        name: tournament.name || "",
        description: tournament.description || "",
        recommendedMmr: tournament.recommended_mmr?.toString() || "",
        maxPlayers: tournament.max_players?.toString() || "",
        startDate: tournament.start_date ? format(new Date(tournament.start_date), "yyyy-MM-dd'T'HH:mm") : "",
        endDate: tournament.end_date ? format(new Date(tournament.end_date), "yyyy-MM-dd'T'HH:mm") : "",
        bracketType: tournament.bracket_type || "",
        mainPhoto: tournament.main_photo || "",
        approvalType: tournament.approval_type || "",
        privacy: tournament.privacy || "",
      });
    }
  }, [tournament]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const updates = {
      name: formData.name,
      description: formData.description,
      recommended_mmr: parseInt(formData.recommendedMmr),
      max_players: parseInt(formData.maxPlayers),
      start_date: formData.startDate,
      end_date: formData.endDate || null,
      bracket_type: formData.bracketType,
      main_photo: formData.mainPhoto,
      approval_type: formData.approvalType,
      privacy: formData.privacy,
    };

    updateTournament.mutate(updates);
  };

  if (isLoading) {
    return (
      <>
        <Navigation />
        <PageContainer>
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-pulse">Loading tournament details...</div>
          </div>
        </PageContainer>
      </>
    );
  }

  if (error || !tournament) {
    return (
      <>
        <Navigation />
        <PageContainer>
          <div className="text-center text-destructive">
            Error loading tournament details. Please try again later.
          </div>
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <CreateTournamentLayout>
        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tournament Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter tournament name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Enter tournament description"
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date & Time</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange("startDate", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date & Time (Optional)</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recommendedMmr">Recommended MMR</Label>
                <Input
                  id="recommendedMmr"
                  type="number"
                  value={formData.recommendedMmr}
                  onChange={(e) => handleInputChange("recommendedMmr", e.target.value)}
                  placeholder="Enter recommended MMR"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxPlayers">Maximum Players</Label>
                <Input
                  id="maxPlayers"
                  type="number"
                  value={formData.maxPlayers}
                  onChange={(e) => handleInputChange("maxPlayers", e.target.value)}
                  placeholder="Enter maximum players"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bracketType">Bracket Type</Label>
                <Select 
                  value={formData.bracketType} 
                  onValueChange={(value) => handleInputChange("bracketType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select bracket type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SINGLE_ELIMINATION">Single Elimination</SelectItem>
                    <SelectItem value="DOUBLE_ELIMINATION">Double Elimination</SelectItem>
                    <SelectItem value="ROUND_ROBIN">Round Robin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="approvalType">Approval Type</Label>
                <Select 
                  value={formData.approvalType} 
                  onValueChange={(value) => handleInputChange("approvalType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select approval type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AUTOMATIC">Automatic</SelectItem>
                    <SelectItem value="MANUAL">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="privacy">Privacy</Label>
              <Select 
                value={formData.privacy} 
                onValueChange={(value) => handleInputChange("privacy", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select privacy setting" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PUBLIC">Public</SelectItem>
                  <SelectItem value="PRIVATE">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mainPhoto">Main Photo URL</Label>
              <Input
                id="mainPhoto"
                value={formData.mainPhoto}
                onChange={(e) => handleInputChange("mainPhoto", e.target.value)}
                placeholder="Enter main photo URL"
              />
            </div>
          </div>

          <div className="flex gap-4 justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate(`/tournaments/${tournamentId}`)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </CreateTournamentLayout>
    </>
  );
}
