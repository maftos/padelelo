
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit3, MapPin, Trophy } from "lucide-react";

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
  const getInitials = () => {
    return profileData.display_name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase() || '?';
  };

  const getMmrLevel = (mmr: number) => {
    if (mmr >= 2000) return { label: "Elite", color: "bg-purple-500" };
    if (mmr >= 1500) return { label: "Advanced", color: "bg-blue-500" };
    if (mmr >= 1000) return { label: "Intermediate", color: "bg-green-500" };
    return { label: "Beginner", color: "bg-yellow-500" };
  };

  const mmrLevel = getMmrLevel(profileData.current_mmr || 0);

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5 border-0 shadow-lg">
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar Section */}
          <div className="relative">
            <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
              <AvatarImage src={profileData.profile_photo || ''} alt={profileData.display_name} />
              <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary/20 to-secondary/20">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Profile Info Section */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {profileData.display_name || 'User'}
              </h1>
              {profileData.nationality && (
                <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{profileData.nationality}</span>
                </div>
              )}
            </div>

            {/* MMR Badge */}
            <div className="flex items-center justify-center md:justify-start gap-3">
              <Badge variant="secondary" className={`${mmrLevel.color} text-white px-4 py-2 text-sm font-semibold`}>
                <Trophy className="h-4 w-4 mr-2" />
                {mmrLevel.label}
              </Badge>
              <div className="text-center">
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
