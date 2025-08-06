import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SetCard } from "./SetCard";

interface SetData {
  set_number: number;
  team1_score: number;
  team2_score: number;
  result: "WIN" | "LOSS" | null;
  change_amount: number | null;
}

interface MatchCardProps {
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

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

export const MatchCard = ({
  match_id,
  team1_player1_display_name,
  team1_player1_profile_photo,
  team1_player2_display_name,
  team1_player2_profile_photo,
  team2_player1_display_name,
  team2_player1_profile_photo,
  team2_player2_display_name,
  team2_player2_profile_photo,
  total_team1_score,
  total_team2_score,
  sets
}: MatchCardProps) => {
  return (
    <div className="bg-accent/5 rounded-xl border border-accent/20 p-3 sm:p-4 space-y-3 sm:space-y-4">
      {/* Match Header with Teams - Mobile Optimized */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        {/* Team 1 */}
        <div className="flex items-center space-x-2 sm:space-x-3 flex-1">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Avatar className="w-6 h-6 sm:w-8 sm:h-8">
              <AvatarImage src={team1_player1_profile_photo} />
              <AvatarFallback className="text-xs">
                {getInitials(team1_player1_display_name)}
              </AvatarFallback>
            </Avatar>
            <Avatar className="w-6 h-6 sm:w-8 sm:h-8">
              <AvatarImage src={team1_player2_profile_photo} />
              <AvatarFallback className="text-xs">
                {getInitials(team1_player2_display_name)}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="text-xs sm:text-sm min-w-0 flex-1">
            <p className="font-medium text-foreground truncate">{team1_player1_display_name}</p>
            <p className="font-medium text-foreground truncate">{team1_player2_display_name}</p>
          </div>
        </div>

        {/* VS and Score - Mobile Centered */}
        <div className="flex items-center justify-center space-x-2 sm:space-x-4 order-last sm:order-none">
          <div className="text-center">
            <p className="text-base sm:text-lg font-bold text-foreground">{total_team1_score}</p>
          </div>
          <div className="text-muted-foreground text-sm sm:text-base">:</div>
          <div className="text-center">
            <p className="text-base sm:text-lg font-bold text-foreground">{total_team2_score}</p>
          </div>
        </div>

        {/* Team 2 */}
        <div className="flex items-center space-x-2 sm:space-x-3 flex-1 sm:justify-end">
          <div className="text-xs sm:text-sm text-left sm:text-right min-w-0 flex-1 sm:flex-none order-2 sm:order-1">
            <p className="font-medium text-foreground truncate">{team2_player1_display_name}</p>
            <p className="font-medium text-foreground truncate">{team2_player2_display_name}</p>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2 order-1 sm:order-2">
            <Avatar className="w-6 h-6 sm:w-8 sm:h-8">
              <AvatarImage src={team2_player1_profile_photo} />
              <AvatarFallback className="text-xs">
                {getInitials(team2_player1_display_name)}
              </AvatarFallback>
            </Avatar>
            <Avatar className="w-6 h-6 sm:w-8 sm:h-8">
              <AvatarImage src={team2_player2_profile_photo} />
              <AvatarFallback className="text-xs">
                {getInitials(team2_player2_display_name)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* Sets */}
      <div className="space-y-2">
        {sets.map((set) => (
          <SetCard key={set.set_number} {...set} status="MMR_CALCULATED" />
        ))}
      </div>
    </div>
  );
};