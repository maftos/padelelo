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

// Sample data - will be replaced with real data later
const leaderboardData = [
  { 
    id: 1, 
    rank: 1, 
    displayName: "John Doe", 
    nationality: "Mauritian",
    gender: "Male",
    lastPlayed: "2024-03-15",
    mmr: 2500 
  },
  { 
    id: 2, 
    rank: 2, 
    displayName: "Jane Smith", 
    nationality: "French",
    gender: "Female",
    lastPlayed: "2024-03-14",
    mmr: 2450 
  },
  { 
    id: 3, 
    rank: 3, 
    displayName: "Mike Johnson", 
    nationality: "Mauritian",
    gender: "Male",
    lastPlayed: "2024-03-13",
    mmr: 2400 
  },
];

const Leaderboard = () => {
  const [filters, setFilters] = useState({
    gender: "both",
    friendsOnly: false,
  });

  const handleGenderChange = (value: string) => {
    setFilters(prev => ({ ...prev, gender: value }));
  };

  const handleFriendsOnlyChange = (checked: boolean) => {
    setFilters(prev => ({ ...prev, friendsOnly: checked }));
  };

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container py-8 px-4">
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
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Rank</TableHead>
                  <TableHead>Player</TableHead>
                  <TableHead className="w-[100px]">Gender</TableHead>
                  <TableHead className="w-[120px]">Nationality</TableHead>
                  <TableHead className="w-[120px]">Last Played</TableHead>
                  <TableHead className="text-right">MMR</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboardData.map((player) => (
                  <TableRow key={player.id}>
                    <TableCell className="font-medium">{player.rank}</TableCell>
                    <TableCell>{player.displayName}</TableCell>
                    <TableCell>{player.gender}</TableCell>
                    <TableCell>{player.nationality}</TableCell>
                    <TableCell>{formatDate(player.lastPlayed)}</TableCell>
                    <TableCell className="text-right">{player.mmr}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;