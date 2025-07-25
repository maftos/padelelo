
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { UserProfile } from "./use-user-profile";

interface ViewProfileResponse {
  profile: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    created_at: string;
    gender: string | null;
    location: string | null;
    profile_photo: string | null;
    current_mmr: number;
    nationality: string | null;
  };
  friendship: {
    exists: boolean;
    status: string | null;
    created_at: string | null;
    friendship_id: number | null;
  };
}

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
  instagram_handle?: string;
}

export const useProfileState = (profileUserId: string | undefined) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<ProfileFormState>({
    first_name: "",
    last_name: "",
    nationality: "",
    gender: "",
    profile_photo: "",
    current_mmr: 0,
    years_playing: "",
    favorite_position: "",
    preferred_side: "",
    instagram_handle: "",
  });

  const { data: profileData, isLoading, refetch } = useQuery<ViewProfileResponse | null>({
    queryKey: ["profile", profileUserId],
    queryFn: async (): Promise<ViewProfileResponse | null> => {
      if (!profileUserId) return null;
      
      // If user is authenticated, use view_profile function for friendship data
      if (user?.id) {
        const { data, error } = await supabase.rpc('view_profile', {
          user_a_id: user.id,
          user_b_id: profileUserId
        });
        
        if (error) throw error;
        if (!data) return null;
        
        return data as unknown as ViewProfileResponse;
      } else {
        // If user is not authenticated, fetch public profile data directly
        const { data, error } = await supabase
          .from('users')
          .select('id, first_name, last_name, created_at, gender, location, profile_photo, current_mmr, nationality')
          .eq('id', profileUserId)
          .single();
        
        if (error) throw error;
        if (!data) return null;
        
        // Return in the same format as view_profile
        return {
          profile: {
            ...data,
            created_at: data.created_at || new Date().toISOString()
          },
          friendship: {
            exists: false,
            status: null,
            created_at: null,
            friendship_id: null
          }
        } as ViewProfileResponse;
      }
    },
    enabled: !!profileUserId,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // Update form data when profile data changes
  useEffect(() => {
    if (profileData?.profile) {
      setFormData({
        first_name: profileData.profile.first_name || "",
        last_name: profileData.profile.last_name || "",
        nationality: profileData.profile.nationality || "",
        gender: profileData.profile.gender || "",
        profile_photo: profileData.profile.profile_photo || "",
        current_mmr: profileData.profile.current_mmr || 0,
        years_playing: "",
        favorite_position: "",
        preferred_side: "",
        instagram_handle: "",
      });
    }
  }, [profileData]);

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

  const handleSave = async () => {
    try {
      if (!profileUserId) {
        toast({
          title: "Error",
          description: "User ID not found. Please try logging in again.",
          variant: "destructive",
        });
        return;
      }

      console.log('Updating profile with data:', {
        profileUserId,
        formData
      });

      // Create display_name from first_name and last_name
      const displayName = `${formData.first_name} ${formData.last_name}`.trim();

      const { error } = await supabase.rpc('edit_user_profile', {
        user_a_id: profileUserId,
        new_display_name: displayName,
        new_gender: formData.gender,
        new_date_of_birth: null,
        new_languages: [], // Empty array since we removed languages
        new_preferred_language: null,
        new_profile_photo: formData.profile_photo,
        new_whatsapp_number: null, // Removed WhatsApp field
        new_nationality: formData.nationality,
        new_location: null // Set to null since we removed location
      });

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }

      await refetch();

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
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
  };
};
