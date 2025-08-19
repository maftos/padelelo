
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
        <div className="text-sm font-medium">
          Fee per player
        </div>
        <Input
          value={data.feePerPlayer}
          onChange={(e) => onDataChange({ feePerPlayer: e.target.value })}
          placeholder="Enter fee amount"
        />
      </div>

      {/* Game Description */}
      <div className="space-y-3">
        <Label htmlFor="description" className="text-sm font-medium">
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
