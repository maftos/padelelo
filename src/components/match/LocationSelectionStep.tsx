
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Calendar, Clock, DollarSign } from "lucide-react";

interface LocationSelectionStepProps {
  selectedLocation: string;
  onLocationChange: (location: string) => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
  selectedTime: string;
  onTimeChange: (time: string) => void;
  feePerPlayer: string;
  onFeeChange: (fee: string) => void;
  onBack: () => void;
  onNext: () => void;
  isSubmitting: boolean;
  hasAllPlayers: boolean;
}

export const LocationSelectionStep = ({
  selectedLocation,
  onLocationChange,
  selectedDate,
  onDateChange,
  selectedTime,
  onTimeChange,
  feePerPlayer,
  onFeeChange,
  onBack,
  onNext,
  isSubmitting,
  hasAllPlayers
}: LocationSelectionStepProps) => {
  // Mock venues data - in a real app this would come from the venues table
  const venues = [
    { venue_id: "venue1", name: "Padel Club Mauritius" },
    { venue_id: "venue2", name: "Sports Complex Grand Bay" },
    { venue_id: "venue3", name: "Elite Padel Center" },
    { venue_id: "venue4", name: "Coastal Sports Club" }
  ];

  const handleSubmit = () => {
    // Validate required fields when not all players are added
    if (!hasAllPlayers) {
      if (!selectedLocation || !selectedDate || !selectedTime || !feePerPlayer) {
        return; // Prevent submission if required fields are missing
      }
    }
    onNext();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location {!hasAllPlayers && <span className="text-red-500">*</span>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedLocation} onValueChange={onLocationChange}>
            <SelectTrigger>
              <SelectValue placeholder={hasAllPlayers ? "Choose a venue (optional)" : "Choose a venue"} />
            </SelectTrigger>
            <SelectContent>
              {venues.map((venue) => (
                <SelectItem key={venue.venue_id} value={venue.venue_id}>
                  {venue.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Date {!hasAllPlayers && <span className="text-red-500">*</span>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Time {!hasAllPlayers && <span className="text-red-500">*</span>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="time"
            value={selectedTime}
            onChange={(e) => onTimeChange(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Fee per Player {!hasAllPlayers && <span className="text-red-500">*</span>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Input
              type="number"
              value={feePerPlayer}
              onChange={(e) => onFeeChange(e.target.value)}
              placeholder={hasAllPlayers ? "Enter fee (optional)" : "Enter fee"}
              min="0"
              step="0.01"
              className="pl-8"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              Rs
            </span>
          </div>
        </CardContent>
      </Card>

      {!hasAllPlayers && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-700">
            <span className="text-red-500">*</span> Required fields - Since you haven't added all 4 players, these details are mandatory for others to join your match.
          </p>
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || (!hasAllPlayers && (!selectedLocation || !selectedDate || !selectedTime || !feePerPlayer))}
          size="lg"
        >
          {isSubmitting ? "Creating Match..." : "Create Match"}
        </Button>
      </div>
    </div>
  );
};
