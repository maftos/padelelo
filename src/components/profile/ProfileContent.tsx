
import { Button } from "@/components/ui/button";
import { ProfileAvatar } from "./ProfileAvatar";
import { ProfileForm } from "./ProfileForm";

interface ProfileContentProps {
  isEditing: boolean;
  uploading: boolean;
  formData: any;
  onPhotoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFormChange: (field: string, value: string) => void;
  onGenderSelect: (gender: string) => void;
  onSave: () => void;
  onEdit: () => void;
  onCancel: () => Promise<void>;
}

export const ProfileContent = ({
  isEditing,
  uploading,
  formData,
  onPhotoUpload,
  onFormChange,
  onGenderSelect,
  onSave,
  onEdit,
  onCancel
}: ProfileContentProps) => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center gap-4">
        <ProfileAvatar
          profilePhoto={formData.profile_photo}
          firstName={formData.first_name}
          lastName={formData.last_name}
          isEditing={isEditing}
          uploading={uploading}
          onPhotoUpload={onPhotoUpload}
        />
        {!isEditing ? (
          <Button 
            onClick={onEdit}
            className="w-full max-w-[200px]"
          >
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-4 w-full max-w-[400px] justify-center">
            <Button 
              onClick={onSave}
              className="flex-1"
            >
              Save Changes
            </Button>
            <Button 
              variant="outline" 
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

      <ProfileForm
        formData={formData}
        isEditing={isEditing}
        onFormChange={onFormChange}
        onGenderSelect={onGenderSelect}
        onSave={onSave}
        onEdit={onEdit}
        onCancel={onCancel}
      />
    </div>
  );
};
