
import { useParams, useNavigate } from "react-router-dom";
import { PageContainer } from "@/components/layouts/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navigation } from "@/components/Navigation";
import { toast } from "sonner";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { ChevronLeft } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function EditTournament() {
  const { tournamentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    recommended_mmr: 0,
    max_players: 0,
    bracket_type: "",
    status: "",
    privacy: "",
    approval_type: ""
  });

  const { data: tournament, isLoading } = useQuery({
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

      setFormData({
        name: data.name,
        description: data.description || "",
        start_date: data.start_date ? format(new Date(data.start_date), "yyyy-MM-dd'T'HH:mm") : "",
        end_date: data.end_date ? format(new Date(data.end_date), "yyyy-MM-dd'T'HH:mm") : "",
        recommended_mmr: data.recommended_mmr || 0,
        max_players: data.max_participants || 0,
        bracket_type: data.bracket_type || "",
        status: data.status || "",
        privacy: data.privacy || "",
        approval_type: data.approval_type || "AUTOMATIC"
      });

      return data;
    }
  });

  const editMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await (supabase.rpc as any)('edit_tournament', {
        p_tournament_id: tournamentId,
        p_name: data.name,
        p_description: data.description,
        p_start_date: data.start_date,
        p_end_date: data.end_date,
        p_recommended_mmr: data.recommended_mmr,
        p_max_players: data.max_players,
        p_bracket_type: data.bracket_type,
        p_status: data.status,
        p_privacy: data.privacy,
        p_approval_type: data.approval_type
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Tournament updated successfully");
      navigate(`/tournaments/${tournamentId}`);
    },
    onError: (error) => {
      console.error('Error updating tournament:', error);
      toast.error("Failed to update tournament");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editMutation.mutate(formData);
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

  return (
    <>
      <Navigation />
      <PageContainer>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl font-bold">Edit Tournament</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tournament Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={5}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date & Time</Label>
                  <Input
                    id="start_date"
                    type="datetime-local"
                    value={formData.start_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date & Time</Label>
                  <Input
                    id="end_date"
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recommended_mmr">Recommended MMR</Label>
                  <Input
                    id="recommended_mmr"
                    type="number"
                    value={formData.recommended_mmr}
                    onChange={(e) => setFormData(prev => ({ ...prev, recommended_mmr: parseInt(e.target.value) }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max_players">Maximum Players</Label>
                  <Input
                    id="max_players"
                    type="number"
                    value={formData.max_players}
                    onChange={(e) => setFormData(prev => ({ ...prev, max_players: parseInt(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bracket_type">Bracket Type</Label>
                  <Select
                    value={formData.bracket_type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, bracket_type: value }))}
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
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="PUBLISHED">Published</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="privacy">Privacy</Label>
                  <Select
                    value={formData.privacy}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, privacy: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select privacy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PUBLIC">Public</SelectItem>
                      <SelectItem value="PRIVATE">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="approval_type">Approval Type</Label>
                  <Select
                    value={formData.approval_type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, approval_type: value }))}
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
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={editMutation.isPending}
              >
                {editMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </PageContainer>
    </>
  );
}
