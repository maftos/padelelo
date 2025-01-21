import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navigation } from "@/components/Navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

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
  });

  const { data: profileData, isLoading, refetch } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase.rpc('get_user_profile', {
        user_id: userId
      });
      
      if (error) throw error;
      if (!data || data.length === 0) return null;
      return data[0];
    },
    enabled: !!userId,
  });

  useEffect(() => {
    if (profileData) {
      setFormData({
        display_name: profileData.display_name || "",
        nationality: profileData.nationality || "",
        gender: profileData.gender || "",
        location: profileData.location || "",
        languages: profileData.languages ? profileData.languages.join(", ") : "",
        whatsapp_number: profileData.whatsapp_number || "",
        profile_photo: profileData.profile_photo || "",
      });
    }
  }, [profileData]);

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

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase.rpc('edit_user_profile', {
        user_a_id_auth: userId,
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
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground">Manage your profile information</p>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={formData.profile_photo} />
              <AvatarFallback>{formData?.display_name?.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={uploading || !isEditing}
                className="hidden"
                id="photo-upload"
              />
              <label htmlFor="photo-upload">
                <Button variant="outline" size="sm" disabled={uploading || !isEditing} asChild>
                  <span>{uploading ? "Uploading..." : "Change Photo"}</span>
                </Button>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              {isEditing ? (
                <Input
                  id="displayName"
                  value={formData.display_name}
                  onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                />
              ) : (
                <Input
                  id="displayName"
                  value={formData.display_name}
                  readOnly
                  className="bg-muted"
                />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality</Label>
              {isEditing ? (
                <Input
                  id="nationality"
                  value={formData.nationality}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                />
              ) : (
                <Input
                  id="nationality"
                  value={formData.nationality}
                  readOnly
                  className="bg-muted"
                />
              )}
            </div>

            <div className="space-y-2">
              <Label>Gender</Label>
              {isEditing ? (
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant={formData.gender === "MALE" ? "default" : "outline"}
                    onClick={() => setFormData({ ...formData, gender: "MALE" })}
                  >
                    Male
                  </Button>
                  <Button
                    type="button"
                    variant={formData.gender === "FEMALE" ? "default" : "outline"}
                    onClick={() => setFormData({ ...formData, gender: "FEMALE" })}
                  >
                    Female
                  </Button>
                </div>
              ) : (
                <Input
                  value={formData.gender}
                  readOnly
                  className="bg-muted"
                />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              {isEditing ? (
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              ) : (
                <Input
                  id="location"
                  value={formData.location}
                  readOnly
                  className="bg-muted"
                />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="languages">Languages</Label>
              {isEditing ? (
                <Input
                  id="languages"
                  value={formData.languages}
                  onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                  placeholder="e.g., English, French"
                />
              ) : (
                <Input
                  id="languages"
                  value={formData.languages}
                  readOnly
                  className="bg-muted"
                  placeholder="e.g., English, French"
                />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
              {isEditing ? (
                <Input
                  id="whatsappNumber"
                  value={formData.whatsapp_number}
                  onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                />
              ) : (
                <Input
                  id="whatsappNumber"
                  value={formData.whatsapp_number}
                  readOnly
                  className="bg-muted"
                />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mmr">Current MMR</Label>
              <Input
                id="mmr"
                value={profileData?.current_mmr || ""}
                readOnly
                className="bg-muted"
              />
            </div>

            {isEditing ? (
              <div className="flex gap-4">
                <Button className="flex-1" onClick={handleSave}>Save Changes</Button>
                <Button className="flex-1" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              </div>
            ) : (
              <Button className="w-full" onClick={handleEditClick}>Edit Profile</Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
