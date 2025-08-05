import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Shield } from "lucide-react";
import { toast } from "sonner";

const PrivacySettings = () => {
  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    allowFriendRequests: true,
  });


  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Privacy
        </CardTitle>
        <CardDescription>
          Manage your privacy settings and account preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="profile-visibility">Profile Visibility</Label>
            <Select 
              value={privacy.profileVisibility} 
              onValueChange={(value) => 
                setPrivacy(prev => ({ ...prev, profileVisibility: value }))
              }
              disabled
            >
              <SelectTrigger>
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="friends">Friends Only</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="friend-requests-privacy">Allow Friend Requests</Label>
              <p className="text-sm text-muted-foreground">Allow anyone to send you friend requests</p>
            </div>
            <Switch
              id="friend-requests-privacy"
              checked={privacy.allowFriendRequests}
              onCheckedChange={(checked) => 
                setPrivacy(prev => ({ ...prev, allowFriendRequests: checked }))
              }
              disabled
            />
          </div>

        </div>
      </CardContent>
    </Card>
  );
};

export default PrivacySettings;