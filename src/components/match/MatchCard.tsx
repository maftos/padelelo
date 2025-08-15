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
      <div className="flex items-start justify-between">
        {/* Team 1 */}
        <div className="flex flex-col space-y-1 flex-1">
          <div className="flex items-center space-x-2">
            <Avatar className="w-5 h-5 sm:w-6 sm:h-6">
              <AvatarImage src={team1_player1_profile_photo} />
              <AvatarFallback className="text-xs">
                {getInitials(team1_player1_display_name)}
              </AvatarFallback>
            </Avatar>
            <p className="font-medium text-foreground truncate text-xs sm:text-sm">{team1_player1_display_name}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Avatar className="w-5 h-5 sm:w-6 sm:h-6">
              <AvatarImage src={team1_player2_profile_photo} />
              <AvatarFallback className="text-xs">
                {getInitials(team1_player2_display_name)}
              </AvatarFallback>
            </Avatar>
            <p className="font-medium text-foreground truncate text-xs sm:text-sm">{team1_player2_display_name}</p>
          </div>
        </div>

        {/* Team 2 */}
        <div className="flex flex-col space-y-1 flex-1 items-end">
          <div className="flex items-center space-x-2">
            <p className="font-medium text-foreground truncate text-xs sm:text-sm text-right">{team2_player1_display_name}</p>
            <Avatar className="w-5 h-5 sm:w-6 sm:h-6">
              <AvatarImage src={team2_player1_profile_photo} />
              <AvatarFallback className="text-xs">
                {getInitials(team2_player1_display_name)}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex items-center space-x-2">
            <p className="font-medium text-foreground truncate text-xs sm:text-sm text-right">{team2_player2_display_name}</p>
            <Avatar className="w-5 h-5 sm:w-6 sm:h-6">
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