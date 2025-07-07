
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Calendar, Clock, DollarSign } from "lucide-react";

interface LocationDetailsData {
  location: string;
  matchDate: string;
  matchTime: string;
  feePerPlayer: string;
}

interface LocationDetailsStepProps {
  data: LocationDetailsData;
  hasAllPlayers: boolean;
  onDataChange: (data: Partial<LocationDetailsData>) => void;
}

export const LocationDetailsStep = ({ data, hasAllPlayers, onDataChange }: LocationDetailsStepProps) => {
  const formatDateTime = () => {
    if (!data.matchDate || !data.matchTime) return "";
    const date = new Date(`${data.matchDate}T${data.matchTime}`);
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const requiresDetails = !hasAllPlayers;

  return (
    <div className="space-y-6">
      {requiresDetails && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-700">
            <span className="text-red-500">*</span> Required fields - Since you haven't added all 4 players, these details are mandatory for others to join your match.
          </p>
        </div>
      )}

      {/* Location */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <MapPin className="h-4 w-4" />
          Location {requiresDetails && <span className="text-destructive">*</span>}
        </div>
        <Input
          value={data.location}
          onChange={(e) => onDataChange({ location: e.target.value })}
          placeholder="Enter match location"
          required={requiresDetails}
        />
      </div>

      {/* Date & Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date">
            Date {requiresDetails && <span className="text-destructive">*</span>}
          </Label>
          <Input
            id="date"
            type="date"
            value={data.matchDate}
            onChange={(e) => onDataChange({ matchDate: e.target.value })}
            required={requiresDetails}
          />
        </div>
        <div>
          <Label htmlFor="time">
            Time {requiresDetails && <span className="text-destructive">*</span>}
          </Label>
          <Input
            id="time"
            type="time"
            value={data.matchTime}
            onChange={(e) => onDataChange({ matchTime: e.target.value })}
            required={requiresDetails}
          />
        </div>
      </div>

      {data.matchDate && data.matchTime && (
        <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
          <Clock className="h-4 w-4 inline mr-2" />
          {formatDateTime()}
        </div>
      )}

      {/* Fee Per Player */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <DollarSign className="h-4 w-4" />
          Fee per Player {requiresDetails && <span className="text-destructive">*</span>}
        </div>
        <Input
          value={data.feePerPlayer}
          onChange={(e) => onDataChange({ feePerPlayer: e.target.value })}
          placeholder="Enter fee amount"
          required={requiresDetails}
        />
      </div>
    </div>
  );
};
