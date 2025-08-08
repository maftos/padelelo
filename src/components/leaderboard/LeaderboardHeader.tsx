
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
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
  const isMobile = useIsMobile();
  return (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent leading-tight">
          Mauritius Padel Rankings
        </h1>
        <p className="text-muted-foreground text-lg">Compete with the island's finest players</p>
      </div>
      
      <div className="flex items-center justify-end">
        {isMobile ? (
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline" className="shadow-sm border-2 hover:border-primary/20 transition-all duration-200">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle className="text-xl">Filter Rankings</DrawerTitle>
              </DrawerHeader>
              <div className="space-y-6 p-4">
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
            </DrawerContent>
          </Drawer>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="shadow-sm border-2 hover:border-primary/20 transition-all duration-200">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl">Filter Rankings</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 mt-6">
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
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};
