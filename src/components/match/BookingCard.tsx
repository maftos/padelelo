import { formatDistanceToNow } from "date-fns";
import { MatchCard } from "./MatchCard";

interface SetData {
  set_number: number;
  team1_score: number;
  team2_score: number;
  result: "WIN" | "LOSS";
  old_mmr: number;
  change_amount: number;
  new_mmr: number;
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
}

export const BookingCard = ({ booking_id, date, location, matches }: BookingCardProps) => {
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
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Booking</p>
          <p className="text-xs text-muted-foreground">{booking_id}</p>
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