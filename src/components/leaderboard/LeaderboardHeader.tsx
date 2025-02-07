
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
              <Select value={filters.gender} onValueChange={onGenderChange}>
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
                onCheckedChange={onFriendsOnlyChange}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
