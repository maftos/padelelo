
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Upload } from "lucide-react";
import { useRef } from "react";

interface ProfileAvatarProps {
  profilePhoto?: string;
  firstName?: string;
  lastName?: string;
  isEditing: boolean;
  uploading: boolean;
  onPhotoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileAvatar = ({
  profilePhoto,
  firstName,
  lastName,
  isEditing,
  uploading,
  onPhotoUpload
}: ProfileAvatarProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitials = () => {
    const first = firstName?.[0]?.toUpperCase() || '';
    const last = lastName?.[0]?.toUpperCase() || '';
    return first + last || '?';
  };

  const getDisplayName = () => {
    return `${firstName || ''} ${lastName || ''}`.trim() || 'User';
  };

  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Avatar 
          className={`h-24 w-24 ${isEditing ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
          onClick={handleAvatarClick}
        >
          <AvatarImage src={profilePhoto || ''} alt={getDisplayName()} />
          <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-primary/20 to-secondary/20">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        
        {isEditing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-pointer" onClick={handleAvatarClick}>
            <Camera className="h-6 w-6 text-white" />
          </div>
        )}
      </div>

      {isEditing && (
        <div className="flex flex-col items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAvatarClick}
            disabled={uploading}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            {uploading ? 'Uploading...' : 'Change Photo'}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onPhotoUpload}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
};
