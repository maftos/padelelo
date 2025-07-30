
import { ProfileHeroCard } from "./ProfileHeroCard";
import { ProfileForm } from "./ProfileForm";
import { StatsGrid } from "./StatsGrid";
import { ActivityFeed } from "./ActivityFeed";

interface ProfileFormState {
  first_name: string;
  last_name: string;
  nationality: string;
  gender: string;
  profile_photo: string;
  current_mmr: number;
  years_playing: string;
  favorite_position: string;
  preferred_side: string;
}

interface ProfileContentProps {
  isEditing: boolean;
  uploading: boolean;
  formData: ProfileFormState;
  profileData: any;
  onPhotoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFormChange: (field: string, value: string) => void;
  onGenderSelect: (gender: string) => void;
  onSave: () => void;
  onEdit: () => void;
  onCancel: () => void;
  isOwnProfile?: boolean;
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
  onCancel,
  isOwnProfile = true
}: ProfileContentProps) => {
  // If editing, show focused edit layout
  if (isEditing && isOwnProfile) {
    return (
      <div className="max-w-2xl mx-auto">
        <ProfileForm
          formData={formData}
          isEditing={isEditing}
          uploading={uploading}
          onFormChange={onFormChange}
          onGenderSelect={onGenderSelect}
          onPhotoUpload={onPhotoUpload}
          onSave={onSave}
          onCancel={onCancel}
        />
      </div>
    );
  }

  // Default view layout with full grid
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Profile Info */}
      <div className="lg:col-span-1">
        <div className="space-y-6">
          <ProfileHeroCard 
            isEditing={isEditing}
            uploading={uploading}
            formData={formData}
            profileData={profileData}
            onPhotoUpload={onPhotoUpload}
            onEdit={onEdit}
            onSave={onSave}
            onCancel={onCancel}
            isOwnProfile={isOwnProfile}
            mutualFriendsCount={(profileData as any)?.mutual_friends_count || 0}
          />
        </div>
      </div>

      {/* Right Column - Stats and Activity */}
      <div className="lg:col-span-2">
        <div className="space-y-6">
          <StatsGrid profileData={{
            current_mmr: profileData?.profile?.current_mmr || formData.current_mmr || 3000,
            level: 1,
            total_xp: 0
          }} />
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
};
