
import { useEffect } from "react";
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

export default function CreateTournament() {
  const {
    formData,
    setFormData,
    showEndDate,
    setShowEndDate,
    isSubmitting,
    venues,
    setVenues,
    validateForm,
    handleSubmit,
  } = useTournamentForm();
  
  const defaultPhoto = 'https://skocnzoyobnoyyegfzdt.supabase.co/storage/v1/object/public/tournament-photos//manuel-pappacena-zTwzxr4BbTA-unsplash.webp';

  useEffect(() => {
    const fetchVenues = async () => {
      const { data, error } = await supabase.rpc('get_venues');
      if (error) {
        toast.error("Failed to load venues");
        return;
      }
      setVenues(data as { venue_id: string; name: string; }[]);
    };
    fetchVenues();
  }, [setVenues]);

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

              <TournamentSettings
                formData={formData}
                onChange={(data) => setFormData({ ...formData, ...data })}
              />

              <TournamentDescription
                formData={formData}
                onChange={(data) => setFormData({ ...formData, ...data })}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !validateForm()}
            >
              {isSubmitting ? "Creating..." : "Create Tournament"}
            </Button>
          </form>
        </div>
      </PageContainer>
    </>
  );
}
