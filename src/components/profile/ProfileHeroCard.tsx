
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit3, TrendingUp, TrendingDown } from "lucide-react";

interface ProfileHeroCardProps {
  profileData: {
    display_name: string;
    profile_photo?: string;
    current_mmr: number;
    nationality?: string;
    gender?: string;
  };
  isEditing: boolean;
  onEdit: () => void;
}

export const ProfileHeroCard = ({ profileData, isEditing, onEdit }: ProfileHeroCardProps) => {
  // Mock data for ranking - will be replaced with real data later
  const ranking = 45;
  const rankingChange = -3;

  const getInitials = () => {
    return profileData.display_name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase() || 'MT';
  };

  // Use sample data if display_name is empty
  const displayName = profileData.display_name || 'Matthew Tsang';

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5 border-0 shadow-lg">
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar Section */}
          <div className="relative">
            <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
              <AvatarImage src={profileData.profile_photo || ''} alt={displayName} />
              <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary/20 to-secondary/20">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Profile Info Section */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {displayName}
              </h1>
            </div>

            {/* MMR and Ranking */}
            <div className="flex items-center justify-center md:justify-start gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{profileData.current_mmr || 0}</div>
                <div className="text-sm text-muted-foreground">MMR</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">#{ranking}</div>
                <div className="text-sm text-muted-foreground">Ranking</div>
              </div>
              
              <div className="text-center">
                <Badge 
                  variant="secondary" 
                  className={`${rankingChange < 0 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"} flex items-center gap-1`}
                >
                  {rankingChange < 0 ? (
                    <TrendingDown className="h-3 w-3" />
                  ) : (
                    <TrendingUp className="h-3 w-3" />
                  )}
                  {rankingChange > 0 ? '+' : ''}{rankingChange}
                </Badge>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          {!isEditing && (
            <Button
              onClick={onEdit}
              variant="outline"
              size="sm"
              className="absolute top-4 right-4 md:relative md:top-auto md:right-auto"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
