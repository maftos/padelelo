
import { Button } from "@/components/ui/button";
import { TournamentBasicInfo } from "./TournamentBasicInfo";
import { TournamentDateTime } from "./TournamentDateTime";
import { TournamentVenue } from "./TournamentVenue";
import { TournamentBracketType } from "./TournamentBracketType";
import { TournamentSettings } from "./TournamentSettings";
import { TournamentDescription } from "./TournamentDescription";
import { TournamentFormData } from "@/hooks/tournament/use-tournament-form";
import { TournamentStatus } from "@/types/tournament";

interface TournamentFormProps {
  formData: TournamentFormData;
  onChange: (data: Partial<TournamentFormData>) => void;
  showEndDate: boolean;
  setShowEndDate: (show: boolean) => void;
  venues: { venue_id: string; name: string; }[];
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  validateForm: () => boolean;
  tournamentStatus: TournamentStatus;
  onDelete: () => void;
  defaultPhoto: string;
}

export function TournamentForm({
  formData,
  onChange,
  showEndDate,
  setShowEndDate,
  venues,
  onSubmit,
  isSubmitting,
  validateForm,
  tournamentStatus,
  onDelete,
  defaultPhoto,
}: TournamentFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
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
          onChange={(data) => onChange({ ...formData, ...data })}
        />

        <TournamentDateTime
          formData={formData}
          onChange={(data) => onChange({ ...formData, ...data })}
          showEndDate={showEndDate}
          onShowEndDateChange={setShowEndDate}
        />

        <TournamentVenue
          formData={formData}
          onChange={(data) => onChange({ ...formData, ...data })}
          venues={venues}
        />

        <TournamentBracketType
          formData={formData}
          onChange={(data) => onChange({ ...formData, ...data })}
        />

        <TournamentSettings
          formData={formData}
          onChange={(data) => onChange({ ...formData, ...data })}
        />

        <TournamentDescription
          formData={formData}
          onChange={(data) => onChange({ ...formData, ...data })}
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
            variant="destructive"
            onClick={onDelete}
            className="flex-1"
          >
            Delete Tournament
          </Button>
        )}
      </div>
    </form>
  );
}
