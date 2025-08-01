
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingLayout } from "../OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Camera } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const PhotoStep = () => {
  const [uploading, setUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");
  const navigate = useNavigate();

  // Function to convert image to WebP format
  const convertToWebP = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Set canvas dimensions
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw image on canvas
        ctx?.drawImage(img, 0, 0);
        
        // Convert to WebP blob
        canvas.toBlob((blob) => {
          if (blob) {
            const webpFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.webp'), {
              type: 'image/webp',
              lastModified: Date.now()
            });
            resolve(webpFile);
          }
        }, 'image/webp', 0.8); // 80% quality
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file");
        return;
      }

      // Convert to WebP format
      const webpFile = await convertToWebP(file);
      
      const fileName = `${Math.random()}.webp`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('user-photos')
        .upload(filePath, webpFile);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('user-photos')
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
    navigate("/onboarding/step-5");
  };

  return (
    <OnboardingLayout currentStep={4} totalSteps={6}>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Add a photo</h1>
          <p className="text-muted-foreground">
            Help other players recognize you.
          </p>
        </div>

        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={photoUrl} />
                  <AvatarFallback className="text-lg">
                    {localStorage.getItem("onboarding_first_name")?.substring(0, 1).toUpperCase()}{localStorage.getItem("onboarding_last_name")?.substring(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <label 
                  htmlFor="photo-upload" 
                  className="absolute bottom-0 right-0 p-2 bg-background rounded-full border cursor-pointer hover:bg-accent transition-colors"
                >
                  <Camera className="h-4 w-4" />
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
              {uploading && (
                <p className="text-sm text-muted-foreground">Uploading...</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Button
          className="w-full h-12 text-base font-semibold"
          onClick={handleNext}
          disabled={uploading}
        >
          {photoUrl ? "Next" : "Skip for now"}
        </Button>
      </div>
    </OnboardingLayout>
  );
};
