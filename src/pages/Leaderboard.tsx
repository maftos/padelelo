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
              <h1 className="text-2xl font-bold">Mauritius Padel Leaderboard</h1>
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filter Leaderboard</SheetTitle>
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
            
            <div className="rounded-md border bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[60px] font-medium">Rank</TableHead>
                    {!isMobile && <TableHead className="w-[60px]"></TableHead>}
                    <TableHead className="font-medium">Player</TableHead>
                    {!isMobile && (
                      <>
                        <TableHead className="font-medium">Gender</TableHead>
                        <TableHead className="font-medium">Nationality</TableHead>
                      </>
                    )}
                    <TableHead className="text-right font-medium">MMR</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        Loading leaderboard data...
                      </TableCell>
                    </TableRow>
                  ) : leaderboardData?.map((player, index) => (
                    <TableRow key={player.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      {!isMobile && (
                        <TableCell>
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={player.profile_photo || ''} alt={player.display_name || ''} />
                            <AvatarFallback>{getInitials(player.display_name || 'User')}</AvatarFallback>
                          </Avatar>
                        </TableCell>
                      )}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {isMobile && (
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={player.profile_photo || ''} alt={player.display_name || ''} />
                              <AvatarFallback>{getInitials(player.display_name || 'User')}</AvatarFallback>
                            </Avatar>
                          )}
                          <span className="font-medium">{player.display_name}</span>
                        </div>
                      </TableCell>
                      {!isMobile && (
                        <>
                          <TableCell>{player.gender || 'N/A'}</TableCell>
                          <TableCell>{player.nationality || 'N/A'}</TableCell>
                        </>
                      )}
                      <TableCell className="text-right font-medium">
                        {player.current_mmr || 0}
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