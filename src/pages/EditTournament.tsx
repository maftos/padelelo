
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Navigation } from "@/components/Navigation";
import { PageContainer } from "@/components/layouts/PageContainer";
import { useTournamentForm } from "@/hooks/tournament/use-tournament-form";
import { TournamentBasicInfo } from "@/components/tournament/TournamentBasicInfo";
import { TournamentDateTime } from "@/components/tournament/TournamentDateTime";
import { TournamentVenue } from "@/components/tournament/TournamentVenue";
import { TournamentSettings } from "@/components/tournament/TournamentSettings";
import { TournamentDescription } from "@/components/tournament/TournamentDescription";
import { TournamentBracketType } from "@/components/tournament/TournamentBracketType";
import { useNavigate } from "react-router-dom";

export default function EditTournament() {
  const { tournamentId } = useParams();
  const navigate = useNavigate();
  const {
    formData,
    setFormData,
    showEndDate,
    setShowEndDate,
    isSubmitting,
    venues,
    setVenues,
    validateForm,
  } = useTournamentForm();

  const [tournamentStatus, setTournamentStatus] = useState<string>("INCOMPLETE");
  
  const defaultPhoto = 'https://skocnzoyobnoyyegfzdt.supabase.co/storage/v1/object/public/tournament-photos//manuel-pappacena-zTwzxr4BbTA-unsplash.webp';

  useEffect(() => {
    const fetchTournament = async () => {
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .eq('tournament_id', tournamentId)
        .single();

      if (error) {
        toast.error("Failed to load tournament");
        return;
      }

      if (data) {
        setTournamentStatus(data.status);
        const startDate = new Date(data.start_date);
        const endDate = new Date(data.end_date);

        setFormData({
          name: data.name || "",
          startDate: startDate.toISOString().split('T')[0],
          startTime: startDate.toTimeString().slice(0, 5),
          endDate: endDate.toISOString().split('T')[0],
          endTime: endDate.toTimeString().slice(0, 5),
          venue: data.venue_id || "",
          description: data.description || "",
          maxPlayers: data.max_players?.toString() || "",
          bracketType: data.bracket_type,
        });

        if (data.end_date) {
          setShowEndDate(true);
        }
      }
    };

    const fetchVenues = async () => {
      const { data, error } = await supabase.rpc('get_venues');
      if (error) {
        toast.error("Failed to load venues");
        return;
      }
      setVenues(data as { venue_id: string; name: string; }[]);
    };

    fetchTournament();
    fetchVenues();
  }, [tournamentId, setFormData, setShowEndDate, setVenues]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    try {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}+04:00`).toISOString();
      const endDateTime = showEndDate 
        ? new Date(`${formData.endDate}T${formData.endTime}+04:00`).toISOString()
        : new Date(`${formData.startDate}T${formData.startTime}+04:00`).toISOString();

      const maxPlayers = formData.maxPlayers ? parseInt(formData.maxPlayers) : 16;

      const { error } = await supabase.rpc('edit_tournament', {
        p_tournament_id: tournamentId,
        p_max_players: maxPlayers,
        p_venue_id: formData.venue,
        p_start_date: startDateTime,
        p_end_date: endDateTime,
        p_bracket_type: formData.bracketType,
      });

      if (error) throw error;

      toast.success("Tournament updated successfully!");
      navigate("/tournaments");
    } catch (error) {
      console.error('Error updating tournament:', error);
      toast.error("Failed to update tournament");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async () => {
    try {
      const { error } = await supabase.rpc('publish_tournament', {
        p_tournament_id: tournamentId
      });

      if (error) throw error;

      toast.success("Tournament published successfully!");
      setTournamentStatus("PUBLISHED");
    } catch (error) {
      console.error('Error publishing tournament:', error);
      toast.error("Failed to publish tournament");
    }
  };

  return (
    <>
      <Navigation />
      <PageContainer>
        <div className="max-w-2xl mx-auto px-4 py-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative aspect-video rounded-lg bg-gray-100 overflow-hidden">
              <img
                src={defaultPhoto}
                alt="Tournament cover"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="grid gap-6">
              <TournamentBasicInfo
                formData={formData}
                onChange={(data) => setFormData({ ...formData, ...data })}
              />

              <TournamentDateTime
                formData={formData}
                onChange={(data) => setFormData({ ...formData, ...data })}
                showEndDate={showEndDate}
                onShowEndDateChange={setShowEndDate}
              />

              <TournamentVenue
                formData={formData}
                onChange={(data) => setFormData({ ...formData, ...data })}
                venues={venues}
              />

              <TournamentBracketType
                formData={formData}
                onChange={(data) => setFormData({ ...formData, ...data })}
              />

              <TournamentSettings
                formData={formData}
                onChange={(data) => setFormData({ ...formData, ...data })}
              />

              <TournamentDescription
                formData={formData}
                onChange={(data) => setFormData({ ...formData, ...data })}
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                className="flex-1"
                disabled={isSubmitting || !validateForm()}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>

              {tournamentStatus === "INCOMPLETE" && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handlePublish}
                  className="flex-1"
                >
                  Publish Tournament
                </Button>
              )}
            </div>
          </form>
        </div>
      </PageContainer>
    </>
  );
}
