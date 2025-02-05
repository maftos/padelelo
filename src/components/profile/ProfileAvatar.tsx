import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";

interface ProfileAvatarProps {
  profilePhoto: string;
  displayName: string;
  isEditing: boolean;
  uploading: boolean;
  onPhotoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileAvatar: FC<ProfileAvatarProps> = ({
  profilePhoto,
  displayName,
  isEditing,
  uploading,
  onPhotoUpload,
}) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage src={profilePhoto} />
          <AvatarFallback>{displayName?.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        {isEditing && (
          <label 
            htmlFor="photo-upload" 
            className="absolute bottom-0 right-0 p-1 bg-background rounded-full border cursor-pointer hover:bg-accent"
          >
            <Camera className="h-4 w-4" />
            <Input
              type="file"
              accept="image/*"
              onChange={onPhotoUpload}
              disabled={uploading}
              className="hidden"
              id="photo-upload"
            />
          </label>
        )}
      </div>
    </div>
  );
};