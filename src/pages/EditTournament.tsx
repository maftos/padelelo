
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { useAuth } from "@/contexts/AuthContext";
import { ChevronLeft } from "lucide-react";
import { TournamentStatus } from "@/types/tournament";

interface ViewTournamentResponse {
  status: TournamentStatus;
  start_date: string;
  end_date: string | null;
  name: string;
  venue_id: string | null;
  description: string | null;
  max_players: number;
  bracket_type: string;
}

export default function EditTournament() {
  const { tournamentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    formData,
    setFormData,
    showEndDate,
    setShowEndDate,
    isSubmitting,
    setIsSubmitting,
    venues,
    setVenues,
    validateForm,
  } = useTournamentForm();

  const [tournamentStatus, setTournamentStatus] = useState<TournamentStatus>('INCOMPLETE');
  const [isLoading, setIsLoading] = useState(true);
  
  const defaultPhoto = 'https://skocnzoyobnoyyegfzdt.supabase.co/storage/v1/object/public/tournament-photos//manuel-pappacena-zTwzxr4BbTA-unsplash.webp';

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id || !tournamentId) return;

      setIsLoading(true);
      try {
        const [tournamentResponse, venuesResponse] = await Promise.all([
          supabase.rpc('view_tournament', {
            p_tournament_id: tournamentId,
            p_user_a_id: user.id
          }),
          supabase.rpc('get_venues')
        ]);

        if (tournamentResponse.error) {
          throw new Error(tournamentResponse.error.message);
        }

        if (venuesResponse.error) {
          throw new Error(venuesResponse.error.message);
        }

        if (tournamentResponse.data) {
          const tournament = tournamentResponse.data as ViewTournamentResponse;
          setTournamentStatus(tournament.status);
          const startDate = new Date(tournament.start_date);
          const endDate = tournament.end_date ? new Date(tournament.end_date) : null;

          setFormData({
            name: tournament.name || "",
            startDate: startDate.toISOString().split('T')[0],
            startTime: startDate.toTimeString().slice(0, 5),
            endDate: endDate ? endDate.toISOString().split('T')[0] : "",
            endTime: endDate ? endDate.toTimeString().slice(0, 5) : "",
            venue: tournament.venue_id || "",
            description: tournament.description || "",
            maxPlayers: tournament.max_players?.toString() || "",
            bracketType: tournament.bracket_type,
          });

          setShowEndDate(!!tournament.end_date);
        }

        setVenues(venuesResponse.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error("Failed to load tournament data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [tournamentId, setFormData, setVenues, user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      toast.error("You must be logged in to edit a tournament");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}+04:00`).toISOString();
      const endDateTime = showEndDate && formData.endDate && formData.endTime
        ? new Date(`${formData.endDate}T${formData.endTime}+04:00`).toISOString()
        : null;

      const maxPlayers = formData.maxPlayers ? parseInt(formData.maxPlayers) : 16;

      const { error } = await supabase.rpc('edit_tournament', {
        tournament_id: tournamentId,
        user_a_id: user.id,
        updates: {
          max_players: maxPlayers,
          venue_id: formData.venue,
          start_date: startDateTime,
          end_date: endDateTime,
          bracket_type: formData.bracketType,
          name: formData.name,
          description: formData.description
        }
      });

      if (error) throw error;

      toast.success("Tournament updated successfully!");
      navigate(`/tournaments/${tournamentId}`);
    } catch (error) {
      console.error('Error updating tournament:', error);
      toast.error("Failed to update tournament");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(`/tournaments/${tournamentId}`);
  };

  const handlePublish = async () => {
    if (!user?.id) {
      toast.error("You must be logged in to publish a tournament");
      return;
    }

    try {
      const { error } = await supabase.rpc('publish_tournament', {
        tournament_id: tournamentId,
        user_a_id: user.id
      });

      if (error) throw error;

      toast.success("Tournament published successfully!");
      setTournamentStatus('PENDING');
    } catch (error) {
      console.error('Error publishing tournament:', error);
      toast.error("Failed to publish tournament");
    }
  };

  if (isLoading) {
    return (
      <>
        <Navigation />
        <PageContainer>
          <div className="flex items-center justify-center h-screen">
            Loading...
          </div>
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <PageContainer>
        <div className="max-w-2xl mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-6"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Tournament
          </Button>

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

              {tournamentStatus === 'INCOMPLETE' && (
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
