
import { Helmet } from "react-helmet";
import { Navigation } from "@/components/Navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserProfile } from "@/hooks/use-user-profile";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileContent } from "@/components/profile/ProfileContent";
import { useProfileState } from "@/hooks/use-profile-state";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

import { SocialShare } from "@/components/seo/SocialShare";

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

  const displayName = profileData?.profile?.first_name && profileData?.profile?.last_name 
    ? `${profileData.profile.first_name} ${profileData.profile.last_name}` 
    : "User";
  const pageTitle = isOwnProfile ? "My Profile" : `${displayName} - Player Profile`;
  const pageDescription = isOwnProfile 
    ? "Manage your PadelELO profile, update your information, and track your progress in the Mauritius padel community."
    : `View ${displayName}'s padel profile, stats, and match history in the Mauritius PadelELO community.`;

  const structuredData = !isOwnProfile && profileData?.profile ? {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": displayName,
    "description": `Padel player in Mauritius with ${profileData.profile.current_mmr || 'unrated'} MMR`,
    "url": `https://padel-elo.com/profile/${targetUserId}`,
    "image": profileData.profile.profile_photo,
    "nationality": profileData.profile.nationality,
    "sport": "Padel",
    "location": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "MU",
        "addressLocality": "Mauritius"
      }
    }
  } : null;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{pageTitle} - PadelELO</title>
        <meta 
          name="description" 
          content={pageDescription}
        />
        <meta name="keywords" content={`${displayName}, padel player, mauritius padel, player profile, MMR ranking`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={`https://padel-elo.com/profile/${targetUserId}`} />
        {profileData?.profile?.profile_photo && (
          <meta property="og:image" content={profileData.profile.profile_photo} />
        )}
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        
        {/* Structured Data for public profiles */}
        {structuredData && (
          <script type="application/ld+json">
            {JSON.stringify(structuredData)}
          </script>
        )}
        
        <link rel="canonical" href={`https://padel-elo.com/profile/${targetUserId}`} />
      </Helmet>
      <Navigation />
      <main className="container max-w-6xl mx-auto py-8 px-4">
        
        {!isOwnProfile && (
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">{displayName}</h1>
              <p className="text-muted-foreground">Player Profile</p>
            </div>
            <SocialShare
              title={`${displayName} - Padel Player Profile`}
              description={`Check out ${displayName}'s padel stats and match history in the Mauritius community`}
              hashtags={["padel", "mauritius", "player", "profile"]}
              showZapierIntegration={false}
            />
          </div>
        )}
        
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
