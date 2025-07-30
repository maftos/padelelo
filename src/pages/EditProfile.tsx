import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { useProfileState } from "@/hooks/use-profile-state";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { PageContainer } from "@/components/layouts/PageContainer";

const EditProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const {
    isLoading,
    uploading,
    formData,
    profileData,
    handleFormChange,
    handleGenderSelect,
    handlePhotoUpload,
    handleSave,
    refetch
  } = useProfileState(user?.id);

  const handleSaveAndNavigate = async () => {
    await handleSave();
    navigate('/profile');
  };

  const handleCancel = async () => {
    await refetch();
    navigate('/profile');
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-48"></div>
            <div className="h-24 bg-muted rounded-full w-24 mx-auto"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Edit Profile - PadelELO</title>
        <meta 
          name="description" 
          content="Update your PadelELO profile information, upload a new photo, and manage your details."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <PageContainer>
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Profile
              </Button>
            </div>
            <h1 className="text-3xl font-bold">Edit Profile</h1>
            <p className="text-muted-foreground">
              Update your profile information and preferences
            </p>
          </div>

          {/* Profile Form */}
          <ProfileForm
            formData={formData}
            isEditing={true}
            uploading={uploading}
            onFormChange={handleFormChange}
            onGenderSelect={handleGenderSelect}
            onPhotoUpload={handlePhotoUpload}
            onSave={handleSaveAndNavigate}
            onCancel={handleCancel}
          />
        </div>
      </PageContainer>
    </div>
  );
};

export default EditProfile;