import { formatDistanceToNow } from "date-fns";
import { MatchCard } from "./MatchCard";
import { SetCard } from "./SetCard";
import { TrendingUp, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SetData {
  set_number: number;
  team1_score: number;
  team2_score: number;
  result: "WIN" | "LOSS";
  change_amount: number;
}

interface MatchData {
  match_id: string;
  team1_player1_display_name: string;
  team1_player1_profile_photo: string;
  team1_player2_display_name: string;
  team1_player2_profile_photo: string;
  team2_player1_display_name: string;
  team2_player1_profile_photo: string;
  team2_player2_display_name: string;
  team2_player2_profile_photo: string;
  total_team1_score: number;
  total_team2_score: number;
  sets: SetData[];
}

interface BookingCardProps {
  booking_id: string;
  date: string;
  location: string;
  matches: MatchData[];
  status: "MMR_CALCULATED" | "SCORE_RECORDED";
  mmr_before?: number;
  mmr_after?: number;
}

export const BookingCard = ({ booking_id, date, location, matches, status, mmr_before, mmr_after }: BookingCardProps) => {
  // Calculate total MMR change for this booking
  const totalMmrChange = status === "MMR_CALCULATED" ? matches.reduce((bookingTotal, match) => {
    return bookingTotal + match.sets.reduce((matchTotal, set) => {
      if (set.result && set.change_amount !== null) {
        return matchTotal + (set.result === "WIN" ? set.change_amount : -set.change_amount);
      }
      return matchTotal;
    }, 0);
  }, 0) : null;
  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Booking Header */}
      <div className="flex flex-col space-y-3 pb-4 border-b border-border/30 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="space-y-1 min-w-0 flex-1">
          <h3 className="text-base sm:text-lg font-semibold text-foreground">
            {date ? formatDistanceToNow(new Date(date), { addSuffix: true }) : 'Invalid date'}
          </h3>
          <p className="text-sm text-muted-foreground truncate">{location}</p>
        </div>
        <div className="text-left sm:text-right space-y-1 flex-shrink-0">
          {status === "SCORE_RECORDED" ? (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              PROCESSING
            </Badge>
          ) : status === "MMR_CALCULATED" && mmr_before !== undefined && mmr_after !== undefined ? (
            <div className="flex items-center gap-2 justify-end">
              <span className="text-sm font-medium">{mmr_before}</span>
              <TrendingUp className={`w-4 h-4 ${
                mmr_after >= mmr_before ? "text-green-600" : "text-red-600 rotate-180"
              }`} />
              <span className={`text-sm font-bold ${
                mmr_after >= mmr_before 
                  ? "text-green-600" 
                  : "text-red-600"
              }`}>
                {mmr_after}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 justify-end">
              <span className="text-sm font-medium">{mmr_before || "N/A"}</span>
              <Clock className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-600">Pending</span>
            </div>
          )}
        </div>
      </div>

      {/* Matches */}
      <div className="space-y-4">
        {matches.map((match) => (
          <MatchCard key={match.match_id} {...match} />
        ))}
      </div>
    </div>
  );
};