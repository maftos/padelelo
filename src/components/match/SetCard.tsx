import { Badge } from "@/components/ui/badge";

interface SetCardProps {
  set_number: number;
  team1_score: number;
  team2_score: number;
  result: "WIN" | "LOSS";
  old_mmr: number;
  change_amount: number;
  new_mmr: number;
}

export const SetCard = ({
  set_number,
  team1_score,
  team2_score,
  result,
  old_mmr,
  change_amount,
  new_mmr
}: SetCardProps) => {
  const formatMmr = (mmr: number) => mmr.toFixed(0);

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

      {/* MMR Change */}
      <div className="flex items-center space-x-3 text-xs">
        <div className="text-center">
          <p className="text-muted-foreground">Previous</p>
          <p className="font-medium">{formatMmr(old_mmr)}</p>
        </div>
        <div className="h-px w-4 bg-gradient-to-r from-primary to-secondary"></div>
        <div className="text-center">
          <p className="text-muted-foreground">New</p>
          <p className="font-medium bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {formatMmr(new_mmr)}
          </p>
        </div>
      </div>
    </div>
  );
};