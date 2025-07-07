
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin } from "lucide-react";

interface LocationSelectionStepProps {
  selectedLocation: string;
  onLocationChange: (location: string) => void;
  onBack: () => void;
  onNext: () => void;
  isSubmitting: boolean;
}

export const LocationSelectionStep = ({
  selectedLocation,
  onLocationChange,
  onBack,
  onNext,
  isSubmitting
}: LocationSelectionStepProps) => {
  // Mock venues data - in a real app this would come from the venues table
  const venues = [
    { venue_id: "venue1", name: "Padel Club Mauritius" },
    { venue_id: "venue2", name: "Sports Complex Grand Bay" },
    { venue_id: "venue3", name: "Elite Padel Center" },
    { venue_id: "venue4", name: "Coastal Sports Club" }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Select Location (Optional)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedLocation} onValueChange={onLocationChange}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a venue (optional)" />
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
      
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={isSubmitting}
          size="lg"
        >
          {isSubmitting ? "Creating Match..." : "Create Match"}
        </Button>
      </div>
    </div>
  );
};
