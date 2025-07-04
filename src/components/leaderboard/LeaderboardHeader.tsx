
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface LeaderboardHeaderProps {
  filters: {
    gender: string;
    friendsOnly: boolean;
  };
  onGenderChange: (value: string) => void;
  onFriendsOnlyChange: (checked: boolean) => void;
}

export const LeaderboardHeader = ({
  filters,
  onGenderChange,
  onFriendsOnlyChange,
}: LeaderboardHeaderProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent leading-tight">
          Mauritius Padel Rankings
        </h1>
        <p className="text-muted-foreground text-lg">Compete with the island's finest players</p>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-1 w-12 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Top 25 Players</span>
        </div>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="shadow-sm border-2 hover:border-primary/20 transition-all duration-200">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent className="w-80">
            <SheetHeader>
              <SheetTitle className="text-xl">Filter Rankings</SheetTitle>
            </SheetHeader>
            <div className="space-y-8 mt-8">
              <div className="space-y-3">
                <Label className="text-base font-medium">Gender</Label>
                <Select value={filters.gender} onValueChange={onGenderChange}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="both">Both</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Friends Only</Label>
                  <p className="text-sm text-muted-foreground">Show only your friends</p>
                </div>
                <Switch
                  checked={filters.friendsOnly}
                  onCheckedChange={onFriendsOnlyChange}
                />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};
