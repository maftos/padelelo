import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MatchHistoryCardProps {
  match_id: string;
  old_mmr: number;
  change_amount: number;
  change_type: string;
  created_at: string;
  partner_id: string;
  new_mmr: number;
  status: string;
}

export const MatchHistoryCard = ({
  old_mmr,
  change_amount,
  change_type,
  created_at,
  new_mmr,
  status,
}: MatchHistoryCardProps) => {
  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>P</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">
              {change_type === "WIN" ? "Victory" : "Defeat"}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(created_at), { addSuffix: true })}
            </p>
          </div>
        </div>
        <Badge variant={change_type === "WIN" ? "default" : "destructive"}>
          {change_type === "WIN" ? "+" : "-"}{change_amount} MMR
        </Badge>
      </div>
      <div className="flex justify-between text-sm">
        <span>Previous MMR: {old_mmr}</span>
        <span>New MMR: {new_mmr}</span>
      </div>
      <div className="text-xs text-muted-foreground text-right">
        Status: {status}
      </div>
    </Card>
  );
};