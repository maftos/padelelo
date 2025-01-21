import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navigation } from "@/components/Navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const HARDCODED_USER_ID = "1cf886ac-aaf3-4dbd-98ce-0b1717fb19cf";

const Profile = () => {
  const { data: profileData, isLoading } = useQuery({
    queryKey: ["profile", HARDCODED_USER_ID],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_user_profile', {
        user_id: HARDCODED_USER_ID
      });
      
      if (error) throw error;
      return data[0]; // get_user_profile returns an array with one item
    }
  });

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
              <AvatarImage src={profileData?.profile_photo} />
              <AvatarFallback>{profileData?.display_name?.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm">
              Change Photo
            </Button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={profileData?.display_name || ""}
                readOnly
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Nationality</Label>
              <Input
                id="country"
                value={profileData?.nationality || ""}
                readOnly
              />
            </div>

            <div className="space-y-2">
              <Label>Gender</Label>
              <div className="flex gap-4">
                <Button
                  variant={profileData?.gender === "MALE" ? "default" : "outline"}
                  disabled
                >
                  Male
                </Button>
                <Button
                  variant={profileData?.gender === "FEMALE" ? "default" : "outline"}
                  disabled
                >
                  Female
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={profileData?.location || ""}
                readOnly
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="languages">Languages</Label>
              <Input
                id="languages"
                value={profileData?.languages?.join(", ") || ""}
                readOnly
                placeholder="e.g., English, French"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
              <Input
                id="whatsappNumber"
                value={profileData?.whatsapp_number || ""}
                readOnly
                className="bg-muted"
              />
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

            <Button className="w-full">Edit Profile</Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;