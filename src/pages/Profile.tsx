
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
  
  const {
    isLoading,
    isEditing,
    uploading,
    formData,
    profileData,
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
        <main className="container max-w-6xl mx-auto py-8 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Info Skeleton */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* Profile Hero Card Skeleton */}
                <div className="p-6 rounded-lg border bg-card">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-8 w-48" />
                      <div className="flex justify-center gap-2">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-12" />
                      </div>
                    </div>
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Stats and Activity Skeleton */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {/* Stats Grid Skeleton */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 rounded-lg border bg-card">
                      <Skeleton className="h-4 w-16 mb-2" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                  ))}
                </div>
                
                {/* Activity Feed Skeleton */}
                <div className="p-6 rounded-lg border bg-card">
                  <Skeleton className="h-6 w-32 mb-4" />
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-full mb-1" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
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
            profileData={profileData}
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
