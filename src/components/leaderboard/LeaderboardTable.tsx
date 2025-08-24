
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronRight } from "lucide-react";
import { countries } from "@/lib/countries";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

interface LeaderboardPlayer {
  id: string;
  first_name: string | null;
  last_name: string | null;
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
  currentPage?: number;
}

export const LeaderboardTable = ({ 
  isLoading, 
  data: leaderboardData,
  userId,
  onPlayerSelect,
  currentPage = 1
}: LeaderboardTableProps) => {
  const isMobile = useIsMobile();

  const getInitials = (firstName: string | null, lastName: string | null) => {
    const name = `${firstName || ''} ${lastName || ''}`.trim();
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase() || 'U';
  };


  const getRankStyling = (index: number) => {
    if (index < 3) return "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary font-bold";
    if (index < 10) return "bg-accent/30 text-foreground font-semibold";
    return "text-muted-foreground";
  };

  const getCountryName = (nationality: string | null) => {
    if (!nationality) return 'Unknown country';
    try {
      const displayNames = new Intl.DisplayNames([navigator?.language || 'en'], { type: 'region' });
      return displayNames.of(nationality) || nationality;
    } catch {
      return nationality || 'Unknown country';
    }
  };

  const getCountryFlag = (nationality: string | null) => {
    if (!nationality) return '🏳️';
    const country = countries.find(c => c.code === nationality);
    return country?.flag || '🏳️';
  };

  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b border-border/30 bg-muted/20">
            <TableHead className="w-[80px] md:w-[120px] font-bold text-foreground text-sm md:text-base h-12 md:h-16 px-2 md:px-4">Rank</TableHead>
            <TableHead className="font-bold text-foreground text-sm md:text-base flex-1 px-2 md:px-4">Player</TableHead>
            <TableHead className="text-right font-bold text-foreground text-sm md:text-base w-[70px] md:w-[80px] px-2 md:px-4">MMR</TableHead>
            <TableHead className="w-[30px] md:w-[40px] px-1 md:px-4"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-16">
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-primary/30 animate-pulse"></div>
                  <div className="w-3 h-3 rounded-full bg-primary/30 animate-pulse delay-100"></div>
                  <div className="w-3 h-3 rounded-full bg-primary/30 animate-pulse delay-200"></div>
                </div>
                <p className="text-muted-foreground mt-4">Loading rankings...</p>
              </TableCell>
            </TableRow>
          ) : leaderboardData?.map((player, index) => {
            const globalRank = (currentPage - 1) * 10 + index + 1;
            return (
              <TableRow 
                key={player.id} 
                className={`hover:bg-accent/30 transition-all duration-200 cursor-pointer group border-b border-border/20 h-14 md:h-20 ${
                  userId === player.id ? 'bg-primary/5 border-primary/20' : ''
                }`}
                onClick={() => userId !== player.id && onPlayerSelect(player)}
              >
                <TableCell className="font-medium px-2 md:px-4">
                  <div className="flex items-center gap-2">
                    <div className="inline-flex items-center justify-center w-8 h-8 md:w-12 md:h-12 rounded-xl bg-muted text-foreground">
                      <span className="text-xs md:text-sm">#{globalRank}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-2 md:px-4">
                  <div className="flex items-center gap-2 md:gap-3 min-w-0">
                    <Avatar className="h-8 w-8 md:h-12 md:w-12 ring-2 ring-background shadow-md flex-shrink-0">
                      <AvatarImage src={player.profile_photo || ''} alt={`${player.first_name || ''} ${player.last_name || ''}`.trim() || 'User'} />
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-primary font-semibold text-xs md:text-sm">
                        {getInitials(player.first_name, player.last_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1 min-w-0 flex-1">
                      <p className="font-semibold text-foreground text-xs md:text-base leading-none truncate flex items-center gap-1">
                        <span className="truncate">{`${player.first_name || ''} ${player.last_name || ''}`.trim() || 'User'}</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="text-base cursor-help">{getCountryFlag(player.nationality)}</span>
                            </TooltipTrigger>
                            <TooltipContent>
                              {getCountryName(player.nationality)}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right px-2 md:px-4">
                  <div className="inline-flex items-center justify-center">
                    <span className="font-semibold text-xs md:text-lg text-muted-foreground px-1 md:px-2 py-0.5 md:py-1">
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
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
