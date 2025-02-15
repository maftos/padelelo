
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingLayout } from "../OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Camera } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const PhotoStep = () => {
  const [uploading, setUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");
  const navigate = useNavigate();

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setPhotoUrl(publicUrl);
      localStorage.setItem("onboarding_photo", publicUrl);
      toast.success("Photo uploaded successfully!");
    } catch (error) {
      toast.error("Error uploading photo");
      console.error('Error uploading photo:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleNext = () => {
    navigate("/onboarding/step5");
  };

  return (
    <OnboardingLayout currentStep={4} totalSteps={6}>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Add a photo</h1>
          <p className="text-muted-foreground">
            This step is optional, but it helps other players recognize you
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Avatar className="h-32 w-32">
              <AvatarImage src={photoUrl} />
              <AvatarFallback>
                {localStorage.getItem("onboarding_name")?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <label 
              htmlFor="photo-upload" 
              className="absolute bottom-0 right-0 p-2 bg-background rounded-full border cursor-pointer hover:bg-accent"
            >
              <Camera className="h-5 w-5" />
              <Input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={uploading}
                className="hidden"
                id="photo-upload"
              />
            </label>
          </div>
        </div>

        <Button
          className="w-full"
          onClick={handleNext}
          disabled={uploading}
        >
          {photoUrl ? "Continue" : "Skip for now"}
        </Button>
      </div>
    </OnboardingLayout>
  );
};
