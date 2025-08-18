
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingLayout } from "../OnboardingLayout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, ChevronLeft } from "lucide-react";
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
      <div className="flex flex-col min-h-[calc(100vh-200px)] pb-20 sm:pb-0">
        <div className="flex items-center justify-center relative mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/onboarding/step-3")}
            className="absolute left-0 hover:bg-accent/50"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Add a photo</h1>
        </div>

        <div className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-sm">
            <div className="flex flex-col items-center space-y-8">
              {/* Large photo display area */}
              <div className="relative">
                <Avatar className="h-48 w-48 sm:h-56 sm:w-56 border-4 border-border shadow-2xl">
                  <AvatarImage src={photoUrl} className="object-cover" />
                  <AvatarFallback className="text-4xl sm:text-5xl font-semibold bg-gradient-to-br from-primary/20 to-primary/5">
                    {localStorage.getItem("onboarding_first_name")?.substring(0, 1).toUpperCase()}{localStorage.getItem("onboarding_last_name")?.substring(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                {/* Camera button overlay */}
                <label 
                  htmlFor="photo-upload" 
                  className="absolute bottom-4 right-4 p-4 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Camera className="h-6 w-6" />
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

              {/* Upload status and description */}
              <div className="text-center space-y-2">
                {uploading ? (
                  <p className="text-base text-muted-foreground animate-pulse">Uploading your photo...</p>
                ) : photoUrl ? (
                  <p className="text-base text-foreground font-medium">Looking great! 📸</p>
                ) : (
                  <div className="space-y-2">
                    <p className="text-base text-foreground font-medium">Add your profile picture</p>
                    <p className="text-sm text-muted-foreground">Help others recognize you on the court</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile sticky CTA */}
        <div className="sm:hidden fixed inset-x-0 bottom-0 z-50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
          <div className="container mx-auto max-w-md px-4 py-3">
            <Button
              className="w-full h-12 text-base font-semibold"
              variant={photoUrl ? "default" : "secondary"}
              onClick={handleNext}
              disabled={uploading}
            >
              {photoUrl ? "Next" : "Skip for now"}
            </Button>
          </div>
        </div>

        {/* Desktop CTA */}
        <div className="hidden sm:block pt-8">
          <Button
            className="w-full h-12 text-base font-semibold"
            variant={photoUrl ? "default" : "secondary"}
            onClick={handleNext}
            disabled={uploading}
          >
            {photoUrl ? "Next" : "Skip for now"}
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  );
};
