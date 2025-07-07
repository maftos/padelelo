
import { Button } from "@/components/ui/button";
import { ProfileHeroCard } from "./ProfileHeroCard";
import { StatsGrid } from "./StatsGrid";
import { ActivityFeed } from "./ActivityFeed";
import { ProfileForm } from "./ProfileForm";

interface ProfileContentProps {
  isEditing: boolean;
  uploading: boolean;
  formData: any;
  profileData: any;
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
  profileData,
  onPhotoUpload,
  onFormChange,
  onGenderSelect,
  onSave,
  onEdit,
  onCancel
}: ProfileContentProps) => {
  if (isEditing) {
    // Show editing interface
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Edit Profile</h2>
          <div className="flex gap-3">
            <Button onClick={onSave} size="sm">
              Save Changes
            </Button>
            <Button variant="outline" onClick={onCancel} size="sm">
              Cancel
            </Button>
          </div>
        </div>
        
        <ProfileForm
          formData={formData}
          isEditing={isEditing}
          uploading={uploading}
          onFormChange={onFormChange}
          onGenderSelect={onGenderSelect}
          onPhotoUpload={onPhotoUpload}
          onSave={onSave}
          onEdit={onEdit}
          onCancel={onCancel}
        />
      </div>
    );
  }

  // Show viewer-oriented profile
  return (
    <div className="space-y-8">
      {/* Hero Profile Card */}
      <ProfileHeroCard
        profileData={profileData || formData}
        isEditing={isEditing}
        onEdit={onEdit}
      />

      {/* Stats Grid */}
      <StatsGrid profileData={profileData || formData} />

      {/* Activity Feed */}
      <ActivityFeed />
    </div>
  );
};
