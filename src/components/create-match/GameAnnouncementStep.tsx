
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText } from "lucide-react";
import { StepHeader } from "./StepHeader";

interface GameAnnouncementData {
  gameTitle: string;
  gameDescription: string;
}

interface GameAnnouncementStepProps {
  data: GameAnnouncementData;
  onDataChange: (data: Partial<GameAnnouncementData>) => void;
}

export const GameAnnouncementStep = ({ data, onDataChange }: GameAnnouncementStepProps) => {
  console.log('GameAnnouncementStep: Received data:', data);
  
  return (
    <div className="space-y-6">
      <StepHeader 
        title="Match Details"
        description="This game will be publicly visible for 24h"
        showOpenGameBadge={true}
      />

      {/* Game Title */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <FileText className="h-4 w-4" />
          Game Title <span className="text-destructive">*</span>
        </div>
        <Input
          value={data.gameTitle}
          onChange={(e) => onDataChange({ gameTitle: e.target.value })}
          placeholder="e.g., Friday Evening Padel - Need 2 More Players"
          required
        />
      </div>

      {/* Game Description */}
      <div className="space-y-3">
        <Label htmlFor="description">
          Description (optional)
        </Label>
        <Textarea
          id="description"
          value={data.gameDescription}
          onChange={(e) => onDataChange({ gameDescription: e.target.value })}
          placeholder="Add any additional details about the game, skill level requirements, or other information..."
          rows={4}
        />
      </div>
    </div>
  );
};
