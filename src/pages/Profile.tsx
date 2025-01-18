import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navigation } from "@/components/Navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Profile = () => {
  const [profileData, setProfileData] = useState({
    displayName: "",
    country: "",
    gender: "male",
    age: "",
    languages: "",
    whatsappNumber: "+230123456789", // Mock number
  });

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
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>UP</AvatarFallback>
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
                value={profileData.displayName}
                onChange={(e) =>
                  setProfileData({ ...profileData, displayName: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={profileData.country}
                onChange={(e) =>
                  setProfileData({ ...profileData, country: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Gender</Label>
              <div className="flex gap-4">
                <Button
                  variant={profileData.gender === "male" ? "default" : "outline"}
                  onClick={() => setProfileData({ ...profileData, gender: "male" })}
                >
                  Male
                </Button>
                <Button
                  variant={profileData.gender === "female" ? "default" : "outline"}
                  onClick={() => setProfileData({ ...profileData, gender: "female" })}
                >
                  Female
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={profileData.age}
                onChange={(e) =>
                  setProfileData({ ...profileData, age: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="languages">Languages</Label>
              <Input
                id="languages"
                value={profileData.languages}
                onChange={(e) =>
                  setProfileData({ ...profileData, languages: e.target.value })
                }
                placeholder="e.g., English, French"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
              <Input
                id="whatsappNumber"
                value={profileData.whatsappNumber}
                disabled
                className="bg-muted"
              />
            </div>

            <Button className="w-full">Save Changes</Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;