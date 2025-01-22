import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { useQuery } from "@tanstack/react-query";

const Profile = () => {
  const { userId } = useUserProfile();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    display_name: "",
    nationality: "",
    gender: "",
    location: "",
    languages: "",
    whatsapp_number: "",
    profile_photo: "",
    current_mmr: 0, // Added current_mmr with default value
  });

  const { data: profileData, isLoading, refetch } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase.rpc('get_user_profile', {
        user_a_id: userId
      });
      
      if (error) throw error;
      if (!data || data.length === 0) return null;
      
      // Update form data when profile data is fetched
      setFormData({
        display_name: data[0].display_name || "",
        nationality: data[0].nationality || "",
        gender: data[0].gender || "",
        location: data[0].location || "",
        languages: Array.isArray(data[0].languages) ? data[0].languages.join(", ") : "",
        whatsapp_number: data[0].whatsapp_number || "",
        profile_photo: data[0].profile_photo || "",
        current_mmr: data[0].current_mmr || 0,
      });
      
      return data[0];
    },
    enabled: !!userId,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;

      setUploading(true);

      const { data, error: uploadError } = await supabase.storage
        .from('user-photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('user-photos')
        .getPublicUrl(fileName);

      setFormData(prev => ({
        ...prev,
        profile_photo: publicUrl
      }));

      toast({
        title: "Photo uploaded",
        description: "Your profile photo has been updated successfully.",
      });
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenderSelect = (gender: string) => {
    setFormData(prev => ({
      ...prev,
      gender
    }));
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase.rpc('edit_user_profile', {
        user_a_id: userId,
        new_display_name: formData.display_name,
        new_gender: formData.gender,
        new_date_of_birth: null,
        new_languages: formData.languages.split(',').map(lang => lang.trim()),
        new_preferred_language: null,
        new_profile_photo: formData.profile_photo,
        new_whatsapp_number: formData.whatsapp_number,
        new_nationality: formData.nationality,
        new_location: formData.location
      });

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });

      setIsEditing(false);
      refetch();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container max-w-2xl py-8 px-4 space-y-8">
          <div className="text-center space-y-2">
            <Skeleton className="h-8 w-48 mx-auto" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>
          <div className="space-y-6">
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
      <Navigation />
      <main className="container max-w-2xl py-8 px-4 space-y-8">
        <ProfileHeader 
          title="My Profile"
          description="Manage your profile information"
        />

        <div className="space-y-6">
          <ProfileAvatar
            profilePhoto={formData.profile_photo}
            displayName={formData?.display_name}
            isEditing={isEditing}
            uploading={uploading}
            onPhotoUpload={handlePhotoUpload}
          />

          <ProfileForm
            formData={formData}
            isEditing={isEditing}
            onFormChange={handleFormChange}
            onGenderSelect={handleGenderSelect}
            onSave={handleSave}
            onEdit={() => setIsEditing(true)}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      </main>
    </div>
  );
};

export default Profile;