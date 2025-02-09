
import { Helmet } from "react-helmet";
import { Navigation } from "@/components/Navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserProfile } from "@/hooks/use-user-profile";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileContent } from "@/components/profile/ProfileContent";
import { useProfileState } from "@/hooks/use-profile-state";

const Profile = () => {
  const { userId } = useUserProfile();
  const {
    isLoading,
    isEditing,
    uploading,
    formData,
    setIsEditing,
    handleFormChange,
    handleGenderSelect,
    handlePhotoUpload,
    handleSave,
    refetch
  } = useProfileState(userId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container max-w-4xl mx-auto py-8 px-4">
          <div className="text-center space-y-2">
            <Skeleton className="h-8 w-48 mx-auto" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>
          <div className="mt-8 space-y-6">
            <div className="flex flex-col items-center gap-4">
              <Skeleton className="h-24 w-24 rounded-full" />
              <Skeleton className="h-8 w-24" />
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>My Profile - PadelELO</title>
        <meta 
          name="description" 
          content="Manage your PadelELO profile, update your information, and track your progress in the Mauritius padel community." 
        />
      </Helmet>
      <Navigation />
      <main className="container max-w-4xl mx-auto py-8 px-4">
        <div className="space-y-8">
          <ProfileHeader 
            title="My Profile"
            description="Manage your profile information"
          />

          <ProfileContent
            isEditing={isEditing}
            uploading={uploading}
            formData={formData}
            onPhotoUpload={handlePhotoUpload}
            onFormChange={handleFormChange}
            onGenderSelect={handleGenderSelect}
            onSave={handleSave}
            onEdit={() => setIsEditing(true)}
            onCancel={async () => {
              setIsEditing(false);
              await refetch();
            }}
          />
        </div>
      </main>
    </div>
  );
};

export default Profile;
