import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProfileState } from "@/hooks/use-profile-state";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";

const EditProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const {
    isLoading,
    uploading,
    formData,
    profileData,
    handleFormChange,
    handleGenderSelect,
    handlePhotoUpload,
    handleSave,
  } = useProfileState(user?.id);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSaveAndNavigate = async () => {
    await handleSave();
    navigate('/profile');
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container max-w-2xl mx-auto py-8 px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-64 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Edit Profile - PadelELO</title>
        <meta name="description" content="Edit your PadelELO profile information" />
      </Helmet>

      <main className="container max-w-2xl mx-auto py-8 px-4">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Edit Profile</h1>
              <p className="text-muted-foreground">Update your profile information</p>
            </div>
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
      </main>
    </div>
  );
};

export default EditProfile;