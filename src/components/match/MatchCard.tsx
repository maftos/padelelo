import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SetCard } from "./SetCard";

interface SetData {
  set_number: number;
  team1_score: number;
  team2_score: number;
  result: "WIN" | "LOSS";
  change_amount: number;
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
    <div className="bg-accent/5 rounded-xl border border-accent/20 p-4 space-y-4">
      {/* Match Header with Teams and Total Score */}
      <div className="flex items-center justify-between">
        {/* Team 1 */}
        <div className="flex items-center space-x-3 flex-1">
          <div className="flex items-center space-x-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={team1_player1_profile_photo} />
              <AvatarFallback className="text-xs">
                {getInitials(team1_player1_display_name)}
              </AvatarFallback>
            </Avatar>
            <Avatar className="w-8 h-8">
              <AvatarImage src={team1_player2_profile_photo} />
              <AvatarFallback className="text-xs">
                {getInitials(team1_player2_display_name)}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="text-sm">
            <p className="font-medium text-foreground">{team1_player1_display_name}</p>
            <p className="font-medium text-foreground">{team1_player2_display_name}</p>
          </div>
        </div>

        {/* Total Score */}
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">{total_team1_score}</p>
          </div>
          <div className="text-muted-foreground">vs</div>
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">{total_team2_score}</p>
          </div>
        </div>

        {/* Team 2 */}
        <div className="flex items-center space-x-3 flex-1 justify-end">
          <div className="text-sm text-right">
            <p className="font-medium text-foreground">{team2_player1_display_name}</p>
            <p className="font-medium text-foreground">{team2_player2_display_name}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={team2_player1_profile_photo} />
              <AvatarFallback className="text-xs">
                {getInitials(team2_player1_display_name)}
              </AvatarFallback>
            </Avatar>
            <Avatar className="w-8 h-8">
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
          <SetCard key={set.set_number} {...set} />
        ))}
      </div>
    </div>
  );
};