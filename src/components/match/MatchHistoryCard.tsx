import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MatchHistoryCardProps {
  matchId: string;
  oldMmr: number;
  changeAmount: number;
  changeType: string;
  createdAt: string;
  partnerId: string;
  newMmr: number;
  status: string;
}

export const MatchHistoryCard = ({
  oldMmr,
  changeAmount,
  changeType,
  createdAt,
  newMmr,
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
              {changeType === "WIN" ? "Victory" : "Defeat"}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        <Badge variant={changeType === "WIN" ? "default" : "destructive"}>
          {changeType === "WIN" ? "+" : "-"}{changeAmount} MMR
        </Badge>
      </div>
      <div className="flex justify-between text-sm">
        <span>Previous MMR: {oldMmr}</span>
        <span>New MMR: {newMmr}</span>
      </div>
      <div className="text-xs text-muted-foreground text-right">
        Status: {status}
      </div>
    </Card>
  );
};