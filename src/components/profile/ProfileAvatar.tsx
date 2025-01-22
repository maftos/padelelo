import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
      <Avatar className="h-24 w-24">
        <AvatarImage src={profilePhoto} />
        <AvatarFallback>{displayName?.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col items-center gap-2">
        <Input
          type="file"
          accept="image/*"
          onChange={onPhotoUpload}
          disabled={uploading || !isEditing}
          className="hidden"
          id="photo-upload"
        />
        <label htmlFor="photo-upload">
          <Button variant="outline" size="sm" disabled={uploading || !isEditing} asChild>
            <span>{uploading ? "Uploading..." : "Change Photo"}</span>
          </Button>
        </label>
      </div>
    </div>
  );
};