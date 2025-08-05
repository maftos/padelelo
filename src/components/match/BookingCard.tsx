import { formatDistanceToNow } from "date-fns";
import { MatchCard } from "./MatchCard";
import { SetCard } from "./SetCard";
import { TrendingUp, Clock } from "lucide-react";

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
          <h3 className="text-lg font-semibold text-foreground">
            {formatDistanceToNow(new Date(date), { addSuffix: true })}
          </h3>
          <p className="text-sm text-muted-foreground">{location}</p>
        </div>
        <div className="text-right space-y-1">
          {status === "MMR_CALCULATED" && totalMmrChange !== null ? (
            <div className="flex items-center gap-2 justify-end">
              <span className="text-sm font-medium">1842</span>
              <TrendingUp className={`w-4 h-4 ${
                totalMmrChange >= 0 ? "text-green-600" : "text-red-600 rotate-180"
              }`} />
              <span className={`text-sm font-bold ${
                totalMmrChange >= 0 
                  ? "text-green-600" 
                  : "text-red-600"
              }`}>
                {1842 + totalMmrChange}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 justify-end">
              <span className="text-sm font-medium">1842</span>
              <Clock className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-600">Pending</span>
            </div>
          )}
        </div>
      </div>

      {/* Matches */}
      <div className="space-y-4">
        {matches.map((match) => (
          <div key={match.match_id} className="bg-accent/5 rounded-xl border border-accent/20 p-4 space-y-4">
            {/* Match Header with Teams and Total Score */}
            <div className="flex items-center justify-between">
              {/* Team 1 */}
              <div className="flex items-center space-x-3 flex-1">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-xs font-medium">
                      {match.team1_player1_display_name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-xs font-medium">
                      {match.team1_player2_display_name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-foreground">{match.team1_player1_display_name}</p>
                  <p className="font-medium text-foreground">{match.team1_player2_display_name}</p>
                </div>
              </div>

              {/* Total Score */}
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-foreground">{match.total_team1_score}</p>
                </div>
                <div className="text-muted-foreground">:</div>
                <div className="text-center">
                  <p className="text-lg font-bold text-foreground">{match.total_team2_score}</p>
                </div>
              </div>

              {/* Team 2 */}
              <div className="flex items-center space-x-3 flex-1 justify-end">
                <div className="text-sm text-right">
                  <p className="font-medium text-foreground">{match.team2_player1_display_name}</p>
                  <p className="font-medium text-foreground">{match.team2_player2_display_name}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-xs font-medium">
                      {match.team2_player1_display_name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-xs font-medium">
                      {match.team2_player2_display_name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sets */}
            <div className="space-y-2">
              {match.sets.map((set) => (
                <SetCard key={set.set_number} {...set} status={status} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};