
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText, DollarSign } from "lucide-react";
import { StepHeader } from "./StepHeader";

interface GameAnnouncementData {
  gameDescription: string;
  feePerPlayer: string;
}

interface GameAnnouncementStepProps {
  data: GameAnnouncementData;
  onDataChange: (data: Partial<GameAnnouncementData>) => void;
}

export const GameAnnouncementStep = ({ data, onDataChange }: GameAnnouncementStepProps) => {
  console.log('GameAnnouncementStep: Received data:', data);
  
  return (
    <div className="space-y-6">

      {/* Fee Per Player */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <DollarSign className="h-4 w-4" />
          Fee per Player <span className="text-destructive">*</span>
        </div>
        <Input
          value={data.feePerPlayer}
          onChange={(e) => onDataChange({ feePerPlayer: e.target.value })}
          placeholder="Enter fee amount"
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
