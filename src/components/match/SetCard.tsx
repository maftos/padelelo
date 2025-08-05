import { Badge } from "@/components/ui/badge";

interface SetCardProps {
  set_number: number;
  team1_score: number;
  team2_score: number;
  result: "WIN" | "LOSS";
  change_amount: number;
}

export const SetCard = ({
  set_number,
  team1_score,
  team2_score,
  result,
  change_amount
}: SetCardProps) => {

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/30">
      {/* Set Info */}
      <div className="flex items-center space-x-4">
        <div className="text-sm">
          <span className="text-muted-foreground">Set {set_number}</span>
        </div>
        
        {/* Set Score */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">{team1_score}</span>
          <span className="text-muted-foreground text-sm">-</span>
          <span className="text-sm font-medium">{team2_score}</span>
        </div>
      </div>

      {/* Result Badge */}
      <Badge 
        variant={result === "WIN" ? "default" : "destructive"}
        className={`text-xs ${
          result === "WIN" 
            ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white" 
            : ""
        }`}
      >
        {result === "WIN" ? "+" : "-"}{change_amount} MMR
      </Badge>
    </div>
  );
};