
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
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
  // Mock venues data - in a real app this would come from the venues table
  const venues = [
    { venue_id: "venue1", name: "Padel Club Mauritius" },
    { venue_id: "venue2", name: "Sports Complex Grand Bay" },
    { venue_id: "venue3", name: "Elite Padel Center" },
    { venue_id: "venue4", name: "Coastal Sports Club" }
  ];

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
      {!hasAllPlayers && (
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Match Details</h2>
          <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
            Open Game
          </Badge>
        </div>
      )}

      {/* Location */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <MapPin className="h-4 w-4" />
          Location {requiresDetails && <span className="text-destructive">*</span>}
        </div>
        <Select value={data.location} onValueChange={(value) => onDataChange({ location: value })}>
          <SelectTrigger>
            <SelectValue placeholder={requiresDetails ? "Choose a venue" : "Choose a venue (optional)"} />
          </SelectTrigger>
          <SelectContent>
            {venues.map((venue) => (
              <SelectItem key={venue.venue_id} value={venue.venue_id}>
                {venue.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
