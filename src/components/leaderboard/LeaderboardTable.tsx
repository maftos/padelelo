
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronRight, Crown, Award, User, UserX } from "lucide-react";
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

  const getGenderIcon = (gender: string | null) => {
    if (gender?.toLowerCase() === 'male') {
      return <User className="w-4 h-4 text-blue-500" />;
    } else if (gender?.toLowerCase() === 'female') {
      return <User className="w-4 h-4 text-pink-500" />;
    }
    return <UserX className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b border-border/30 bg-muted/20">
            <TableHead className="w-[50px] md:w-[60px] font-bold text-foreground text-sm md:text-base h-12 md:h-16 px-2 md:px-4">Rank</TableHead>
            <TableHead className="font-bold text-foreground text-sm md:text-base flex-1 px-2 md:px-4">Player</TableHead>
            {!isMobile && (
              <>
                <TableHead className="font-bold text-foreground text-base w-[60px] px-4">Gender</TableHead>
                <TableHead className="font-bold text-foreground text-base px-4">Country</TableHead>
              </>
            )}
            <TableHead className="text-right font-bold text-foreground text-sm md:text-base w-[70px] md:w-[80px] px-2 md:px-4">MMR</TableHead>
            <TableHead className="w-[30px] md:w-[40px] px-1 md:px-4"></TableHead>
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
              className={`hover:bg-accent/30 transition-all duration-200 cursor-pointer group border-b border-border/20 h-14 md:h-20 ${
                userId === player.id ? 'bg-primary/5 border-primary/20' : ''
              }`}
              onClick={() => userId !== player.id && onPlayerSelect(player)}
            >
              <TableCell className="font-medium px-2 md:px-4">
                <div className={`inline-flex items-center justify-center w-8 h-8 md:w-12 md:h-12 rounded-xl transition-all duration-200 ${getRankStyling(index)}`}>
                  {getRankIcon(index) || (
                    <span className="text-xs md:text-sm">{index + 1}</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="px-2 md:px-4">
                <div className="flex items-center gap-2 md:gap-3 min-w-0">
                  <Avatar className="h-8 w-8 md:h-12 md:w-12 ring-2 ring-background shadow-md flex-shrink-0">
                    <AvatarImage src={player.profile_photo || ''} alt={player.display_name || ''} />
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-primary font-semibold text-xs md:text-sm">
                      {getInitials(player.display_name || 'User')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1 min-w-0 flex-1">
                    <p className="font-semibold text-foreground text-xs md:text-base leading-none truncate">
                      {player.display_name}
                      {userId === player.id && (
                        <span className="ml-1 md:ml-2 text-xs bg-primary/10 text-primary px-1 md:px-2 py-1 rounded-full">You</span>
                      )}
                    </p>
                    {isMobile && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="truncate max-w-[80px]">{player.nationality || 'Unknown'}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          {getGenderIcon(player.gender)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>
              {!isMobile && (
                <>
                  <TableCell className="text-center px-4">
                    <div className="flex justify-center">
                      {getGenderIcon(player.gender)}
                    </div>
                  </TableCell>
                  <TableCell className="text-base px-4">{player.nationality || 'Unknown'}</TableCell>
                </>
              )}
              <TableCell className="text-right px-2 md:px-4">
                <div className="inline-flex items-center justify-center">
                  <span className="font-bold text-xs md:text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent px-1 md:px-4 py-1 md:py-2 rounded-xl bg-accent/20 border border-accent/30">
                    {player.current_mmr || 0}
                  </span>
                </div>
              </TableCell>
              <TableCell className="px-1 md:px-4">
                {userId !== player.id && (
                  <ChevronRight className="h-3 w-3 md:h-5 md:w-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
