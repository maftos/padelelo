import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RecentMatches } from "@/components/RecentMatches";
import { useIsMobile } from "@/hooks/use-mobile";

const Leaderboard = () => {
  const [filters, setFilters] = useState({
    gender: "both",
    friendsOnly: false,
  });
  const isMobile = useIsMobile();

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
                    <TableRow key={player.id} className="hover:bg-accent/50 transition-colors">
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
    </div>
  );
};

export default Leaderboard;