
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface MatchHeaderProps {
  changeType: string;
  createdAt: string;
  changeAmount: number;
}

export const MatchHeader = ({ changeType, createdAt, changeAmount }: MatchHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <img 
              src={changeType === "WIN" 
                ? "/lovable-uploads/0358eddd-eaa0-4d76-ab94-9c1e6b47e269.png" 
                : "/lovable-uploads/dfc03b48-66e1-4c1d-8450-f3b2f5355c4d.png"} 
              alt={changeType === "WIN" ? "Victory" : "Defeat"}
              className="w-5 h-5"
            />
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-foreground">
              {changeType === "WIN" ? "Victory" : "Defeat"}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
      </div>
      <Badge 
        variant={changeType === "WIN" ? "default" : "destructive"}
        className={`px-3 py-1.5 text-sm font-semibold ${
          changeType === "WIN" 
            ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white" 
            : ""
        }`}
      >
        {changeType === "WIN" ? "+" : "-"}{changeAmount} MMR
      </Badge>
    </div>
  );
};
