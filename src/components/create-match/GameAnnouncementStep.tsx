
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

interface GameAnnouncementData {
  gameTitle: string;
  gameDescription: string;
}

interface GameAnnouncementStepProps {
  data: GameAnnouncementData;
  onDataChange: (data: Partial<GameAnnouncementData>) => void;
}

export const GameAnnouncementStep = ({ data, onDataChange }: GameAnnouncementStepProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold">Match Details</h2>
        <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
          Open Game
        </Badge>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-700">
          This game will be publicly visible for 24h
        </p>
      </div>

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
