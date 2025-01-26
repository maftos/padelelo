import * as React from "react";
import { Navigation } from "@/components/Navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Filter, ChevronRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RecentMatches } from "@/components/RecentMatches";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useToast } from "@/hooks/use-toast";

interface LeaderboardPlayer {
  id: string;
  display_name: string;
  profile_photo: string | null;
  current_mmr: number;
  nationality: string | null;
  gender: string | null;
}

const Leaderboard = () => {
  const [filters, setFilters] = React.useState({
    gender: "both",
    friendsOnly: false,
  });
  const [selectedPlayer, setSelectedPlayer] = React.useState<LeaderboardPlayer | null>(null);
  const isMobile = useIsMobile();
  const { userId } = useUserProfile();
  const { toast } = useToast();

  const { data: leaderboardData, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users_sorted_by_mmr')
        .select('*')
        .limit(25)
        .order('current_mmr', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleGenderChange = (value: string) => {
    setFilters(prev => ({ ...prev, gender: value }));
  };

  const handleFriendsOnlyChange = (checked: boolean) => {
    setFilters(prev => ({ ...prev, friendsOnly: checked }));
  };

  const handleSendFriendRequest = async () => {
    if (!userId || !selectedPlayer) return;

    try {
      const { error } = await supabase.rpc('send_friend_request_leaderboard', {
        user_a_id_public: userId,
        user_b_id_public: selectedPlayer.id
      });

      if (error) {
        // Check if the error is due to an already sent invitation
        if (error.message.includes('Invitation sent already')) {
          toast({
            title: "Already Friends",
            description: `You have already sent a friend request to ${selectedPlayer.display_name}`,
          });
        } else {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Friend Request Sent",
          description: `A friend request has been sent to ${selectedPlayer.display_name}`,
        });
      }
      setSelectedPlayer(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container py-8 px-4">
        <div className="grid md:grid-cols-[1fr,auto] gap-8">
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Mauritius Padel Rankings
                </h1>
                <p className="text-muted-foreground mt-1">Top 25 players by MMR</p>
              </div>
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="shadow-sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filter Rankings</SheetTitle>
                  </SheetHeader>
                  <div className="space-y-6 mt-6">
                    <div className="space-y-2">
                      <Label>Gender</Label>
                      <Select value={filters.gender} onValueChange={handleGenderChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="both">Both</SelectItem>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label>Friends Only</Label>
                      <Switch
                        checked={filters.friendsOnly}
                        onCheckedChange={handleFriendsOnlyChange}
                      />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            
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
                      onClick={() => userId !== player.id && setSelectedPlayer(player)}
                    >
                      <TableCell className="font-medium">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full 
                          ${index < 3 ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground'}`}>
                          {index + 1}
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
          </div>
          
          <div className="md:w-80">
            <RecentMatches />
          </div>
        </div>
      </main>

      <Dialog open={!!selectedPlayer} onOpenChange={() => setSelectedPlayer(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Friend</DialogTitle>
            <DialogDescription>
              Do you want to add {selectedPlayer?.display_name} as a friend?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setSelectedPlayer(null)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendFriendRequest}
            >
              Send Friend Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Leaderboard;