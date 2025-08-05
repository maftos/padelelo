import { formatDistanceToNow } from "date-fns";
import { MatchCard } from "./MatchCard";

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
}

export const BookingCard = ({ booking_id, date, location, matches, status }: BookingCardProps) => {
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
    <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg p-6 space-y-6">
      {/* Booking Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border/30">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-foreground">{location}</h3>
          <p className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(date), { addSuffix: true })}
          </p>
        </div>
        <div className="text-right space-y-1">
          {status === "MMR_CALCULATED" && totalMmrChange !== null ? (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Before:</span>
                <span className="text-sm font-medium">1842</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">After:</span>
                <span className={`text-sm font-bold ${
                  totalMmrChange >= 0 
                    ? "text-green-600" 
                    : "text-red-600"
                }`}>
                  {1842 + totalMmrChange} ({totalMmrChange >= 0 ? "+" : ""}{totalMmrChange})
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">MMR:</span>
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