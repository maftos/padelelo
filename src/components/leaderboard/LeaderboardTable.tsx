
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronRight } from "lucide-react";
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

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b border-accent">
            <TableHead className="w-[60px] font-semibold text-foreground">Rank</TableHead>
            {!isMobile && <TableHead className="w-[60px]"></TableHead>}
            <TableHead className="font-semibold text-foreground">Player</TableHead>
            {!isMobile && (
              <>
                <TableHead className="font-semibold text-foreground">Gender</TableHead>
                <TableHead className="font-semibold text-foreground">Nationality</TableHead>
              </>
            )}
            <TableHead className="text-right font-semibold text-foreground">MMR</TableHead>
            <TableHead className="w-[40px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-primary/20 animate-pulse"></div>
                  <div className="w-4 h-4 rounded-full bg-primary/20 animate-pulse delay-100"></div>
                  <div className="w-4 h-4 rounded-full bg-primary/20 animate-pulse delay-200"></div>
                </div>
              </TableCell>
            </TableRow>
          ) : leaderboardData?.map((player, index) => (
            <TableRow 
              key={player.id} 
              className="hover:bg-accent/50 transition-colors cursor-pointer group"
              onClick={() => userId !== player.id && onPlayerSelect(player)}
            >
              <TableCell className="font-medium">
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full 
                  ${index < 3 ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground'}`}>
                  {index === 0 ? (
                    <img src="/lovable-uploads/9fc3a4aa-a0b9-4dd5-8dfc-603e98b34c78.png" alt="Crown" className="w-5 h-5" />
                  ) : index === leaderboardData.length - 1 ? (
                    <img src="/lovable-uploads/9e4f079f-6938-41d4-a79c-db25e2a2ff45.png" alt="Last Place" className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </span>
              </TableCell>
              {!isMobile && (
                <TableCell>
                  <Avatar className="h-8 w-8 ring-2 ring-background">
                    <AvatarImage src={player.profile_photo || ''} alt={player.display_name || ''} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(player.display_name || 'User')}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
              )}
              <TableCell>
                <div className="flex items-center gap-2">
                  {isMobile && (
                    <Avatar className="h-8 w-8 ring-2 ring-background">
                      <AvatarImage src={player.profile_photo || ''} alt={player.display_name || ''} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(player.display_name || 'User')}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    <p className="font-medium">{player.display_name}</p>
                    {isMobile && (
                      <p className="text-xs text-muted-foreground">
                        {player.nationality || 'N/A'}
                      </p>
                    )}
                  </div>
                </div>
              </TableCell>
              {!isMobile && (
                <>
                  <TableCell>{player.gender || 'N/A'}</TableCell>
                  <TableCell>{player.nationality || 'N/A'}</TableCell>
                </>
              )}
              <TableCell className="text-right">
                <span className="font-semibold bg-accent px-2.5 py-1 rounded-full">
                  {player.current_mmr || 0}
                </span>
              </TableCell>
              <TableCell>
                {userId !== player.id && (
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
