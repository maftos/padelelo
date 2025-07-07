
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProfileAvatar } from "./ProfileAvatar";
import { Badge } from "@/components/ui/badge";
import { Edit, Check, X } from "lucide-react";

interface ProfileFormState {
  first_name: string;
  last_name: string;
  nationality: string;
  gender: string;
  profile_photo: string;
  current_mmr: number;
  years_playing: string;
  favorite_position: string;
}

interface ProfileHeroCardProps {
  isEditing: boolean;
  uploading: boolean;
  formData: ProfileFormState;
  profileData: any;
  onPhotoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  isOwnProfile?: boolean;
}

export const ProfileHeroCard = ({
  isEditing,
  uploading,
  formData,
  profileData,
  onPhotoUpload,
  onEdit,
  onSave,
  onCancel,
  isOwnProfile = true
}: ProfileHeroCardProps) => {
  const displayName = `${formData.first_name} ${formData.last_name}`.trim() || "User Name";
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <ProfileAvatar
            isEditing={isEditing && isOwnProfile}
            uploading={uploading}
            profilePhoto={formData.profile_photo}
            displayName={displayName}
            onPhotoUpload={onPhotoUpload}
          />
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{displayName}</h1>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="secondary">
                {formData.current_mmr || 3000} MMR
              </Badge>
              {formData.nationality && (
                <Badge variant="outline">
                  {formData.nationality}
                </Badge>
              )}
              {formData.gender && (
                <Badge variant="outline">
                  {formData.gender}
                </Badge>
              )}
            </div>
          </div>

          {/* Edit Controls - Only show for own profile */}
          {isOwnProfile && (
            <div className="flex gap-2 w-full">
              {isEditing ? (
                <>
                  <Button onClick={onSave} className="flex-1">
                    <Check className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button onClick={onCancel} variant="outline" className="flex-1">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={onEdit} variant="outline" className="w-full">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
