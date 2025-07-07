
import { Helmet } from "react-helmet";
import { Navigation } from "@/components/Navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserProfile } from "@/hooks/use-user-profile";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileContent } from "@/components/profile/ProfileContent";
import { useProfileState } from "@/hooks/use-profile-state";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Profile = () => {
  const { userId: profileUserId } = useParams();
  const { user: currentUser } = useAuth();
  
  // If no userId in params, show current user's profile
  const targetUserId = profileUserId || currentUser?.id;
  const isOwnProfile = !profileUserId || profileUserId === currentUser?.id;
  
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
  } = useProfileState(targetUserId);

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

  const pageTitle = isOwnProfile ? "My Profile" : "User Profile";
  const pageDescription = isOwnProfile 
    ? "Manage your PadelELO profile, update your information, and track your progress in the Mauritius padel community."
    : "View user profile and stats in the PadelELO community.";

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{pageTitle} - PadelELO</title>
        <meta 
          name="description" 
          content={pageDescription}
        />
      </Helmet>
      <Navigation />
      <main className="container max-w-6xl mx-auto py-8 px-4">
        <div className="space-y-8">
          {/* Only show ProfileHeader when editing own profile */}
          {isEditing && isOwnProfile && (
            <ProfileHeader 
              title="Edit Profile"
              description="Update your profile information"
            />
          )}

          <ProfileContent
            isEditing={isEditing && isOwnProfile}
            uploading={uploading}
            formData={formData}
            profileData={undefined} // Will be populated when backend integration is ready
            onPhotoUpload={handlePhotoUpload}
            onFormChange={handleFormChange}
            onGenderSelect={handleGenderSelect}
            onSave={handleSave}
            onEdit={() => isOwnProfile && setIsEditing(true)}
            onCancel={async () => {
              setIsEditing(false);
              await refetch();
            }}
            isOwnProfile={isOwnProfile}
          />
        </div>
      </main>
    </div>
  );
};

export default Profile;
