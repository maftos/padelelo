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
      <div className="flex items-center space-x-2">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">
            {changeType === "WIN" ? "Victory" : "Defeat"}
          </p>
          <img 
            src={changeType === "WIN" 
              ? "/lovable-uploads/0358eddd-eaa0-4d76-ab94-9c1e6b47e269.png" 
              : "/lovable-uploads/dfc03b48-66e1-4c1d-8450-f3b2f5355c4d.png"} 
            alt={changeType === "WIN" ? "Victory" : "Defeat"}
            className="w-6 h-6"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </p>
      </div>
      <Badge 
        variant={changeType === "WIN" ? "default" : "destructive"}
        className={changeType === "WIN" ? "bg-green-500 hover:bg-green-600" : ""}
      >
        {changeType === "WIN" ? "+" : "-"}{changeAmount} MMR
      </Badge>
    </div>
  );
};