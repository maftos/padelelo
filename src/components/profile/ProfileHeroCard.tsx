
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit3, User, UserCheck } from "lucide-react";
import { countries } from "@/lib/countries";

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
  
  // Mock data for new fields - will be replaced with real data later
  const preferredSide = "Right";
  const totalGames = 127;

  const getInitials = () => {
    return profileData.display_name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase() || 'MT';
  };

  const getGenderIcon = () => {
    if (profileData.gender?.toLowerCase() === 'male') {
      return <User className="h-4 w-4 text-blue-500" />;
    } else if (profileData.gender?.toLowerCase() === 'female') {
      return <UserCheck className="h-4 w-4 text-pink-500" />;
    }
    return null;
  };

  const getNationalityFlag = () => {
    if (profileData.nationality) {
      const country = countries.find(c => c.code === profileData.nationality);
      return country ? country.flag : '🏳️';
    }
    return '🏳️';
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
              <div className="flex flex-col md:flex-row items-center md:items-baseline gap-2 md:gap-3">
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-2 flex-wrap justify-center md:justify-start">
                  {displayName} (#{ranking})
                  <Badge variant={rankingChange < 0 ? "destructive" : "secondary"} className={rankingChange < 0 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}>
                    {rankingChange > 0 ? '+' : ''}{rankingChange}
                  </Badge>
                </h1>
              </div>
            </div>

            {/* Personal Info Row */}
            <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
              {profileData.gender && (
                <div className="flex items-center gap-1">
                  {getGenderIcon()}
                  <span className="capitalize">{profileData.gender}</span>
                </div>
              )}
              
              {profileData.nationality && (
                <div className="flex items-center gap-1">
                  <span className="text-lg">{getNationalityFlag()}</span>
                  <span>{profileData.nationality}</span>
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <span>Prefers: {preferredSide}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <span>{totalGames} games</span>
              </div>
            </div>

            {/* MMR */}
            <div className="flex items-center justify-center md:justify-start">
              <div className="text-center md:text-left">
                <div className="text-2xl font-bold text-foreground">{profileData.current_mmr || 0}</div>
                <div className="text-sm text-muted-foreground">MMR</div>
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
