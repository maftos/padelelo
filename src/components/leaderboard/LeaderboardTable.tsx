
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronRight, Crown, Award } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";

interface LeaderboardPlayer {
  id: string;
  display_name: string;
  profile_photo: string | null;
  current_mmr: number;
  nationality: string | null;
  gender: string | null;
}

interface LeaderboardTableProps {
  isLoading: boolean;
  data: LeaderboardPlayer[] | undefined;
  userId: string | undefined;
  onPlayerSelect: (player: LeaderboardPlayer) => void;
}

export const LeaderboardTable = ({ 
  isLoading, 
  data: leaderboardData,
  userId,
  onPlayerSelect
}: LeaderboardTableProps) => {
  const isMobile = useIsMobile();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="w-4 h-4 text-yellow-500" />;
    if (index === 1) return <Award className="w-4 h-4 text-gray-400" />;
    if (index === 2) return <Award className="w-4 h-4 text-amber-600" />;
    return null;
  };

  const getRankStyling = (index: number) => {
    if (index < 3) return "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary font-bold";
    if (index < 10) return "bg-accent/30 text-foreground font-semibold";
    return "text-muted-foreground";
  };

  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-border/30 bg-muted/20">
              <TableHead className="w-[60px] font-bold text-foreground text-sm md:text-base h-12 md:h-16">Rank</TableHead>
              <TableHead className="font-bold text-foreground text-sm md:text-base min-w-[140px]">Player</TableHead>
              {!isMobile && (
                <>
                  <TableHead className="font-bold text-foreground text-base">Gender</TableHead>
                  <TableHead className="font-bold text-foreground text-base">Country</TableHead>
                </>
              )}
              <TableHead className="text-right font-bold text-foreground text-sm md:text-base w-[80px]">MMR</TableHead>
              <TableHead className="w-[40px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={isMobile ? 4 : 6} className="text-center py-16">
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-primary/30 animate-pulse"></div>
                    <div className="w-3 h-3 rounded-full bg-primary/30 animate-pulse delay-100"></div>
                    <div className="w-3 h-3 rounded-full bg-primary/30 animate-pulse delay-200"></div>
                  </div>
                  <p className="text-muted-foreground mt-4">Loading rankings...</p>
                </TableCell>
              </TableRow>
            ) : leaderboardData?.map((player, index) => (
              <TableRow 
                key={player.id} 
                className={`hover:bg-accent/30 transition-all duration-200 cursor-pointer group border-b border-border/20 h-16 md:h-20 ${
                  userId === player.id ? 'bg-primary/5 border-primary/20' : ''
                }`}
                onClick={() => userId !== player.id && onPlayerSelect(player)}
              >
                <TableCell className="font-medium">
                  <div className={`inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl transition-all duration-200 ${getRankStyling(index)}`}>
                    {getRankIcon(index) || (
                      <span className="text-xs md:text-sm">{index + 1}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 md:gap-3">
                    <Avatar className="h-10 w-10 md:h-12 md:w-12 ring-2 ring-background shadow-md flex-shrink-0">
                      <AvatarImage src={player.profile_photo || ''} alt={player.display_name || ''} />
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-primary font-semibold text-xs md:text-sm">
                        {getInitials(player.display_name || 'User')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1 min-w-0 flex-1">
                      <p className="font-semibold text-foreground text-sm md:text-base leading-none truncate">
                        {player.display_name}
                        {userId === player.id && (
                          <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">You</span>
                        )}
                      </p>
                      {isMobile && (
                        <p className="text-xs text-muted-foreground truncate">
                          {player.nationality || 'Unknown'} • {player.gender ? player.gender.charAt(0).toUpperCase() + player.gender.slice(1) : 'N/A'}
                        </p>
                      )}
                    </div>
                  </div>
                </TableCell>
                {!isMobile && (
                  <>
                    <TableCell className="text-base">
                      <span className="capitalize">{player.gender || 'N/A'}</span>
                    </TableCell>
                    <TableCell className="text-base">{player.nationality || 'Unknown'}</TableCell>
                  </>
                )}
                <TableCell className="text-right">
                  <div className="inline-flex items-center justify-center">
                    <span className="font-bold text-sm md:text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent px-2 md:px-4 py-2 rounded-xl bg-accent/20 border border-accent/30">
                      {player.current_mmr || 0}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {userId !== player.id && (
                    <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
