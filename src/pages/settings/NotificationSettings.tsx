import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Bell } from "lucide-react";

const NotificationSettings = () => {
  const [notifications, setNotifications] = useState({
    matchInvites: true,
    friendRequests: true,
    tournamentUpdates: true,
    weeklyDigest: false,
    emailNotifications: true,
    pushNotifications: true,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notifications
        </CardTitle>
        <CardDescription>
          Choose what notifications you want to receive
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="match-invites">Match Invitations</Label>
              <p className="text-sm text-muted-foreground">Get notified when someone invites you to a match</p>
            </div>
            <Switch
              id="match-invites"
              checked={notifications.matchInvites}
              onCheckedChange={(checked) => 
                setNotifications(prev => ({ ...prev, matchInvites: checked }))
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="friend-requests">Friend Requests</Label>
              <p className="text-sm text-muted-foreground">Get notified when someone sends you a friend request</p>
            </div>
            <Switch
              id="friend-requests"
              checked={notifications.friendRequests}
              onCheckedChange={(checked) => 
                setNotifications(prev => ({ ...prev, friendRequests: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="tournament-updates">Tournament Updates</Label>
              <p className="text-sm text-muted-foreground">Get notified about tournament results and updates</p>
            </div>
            <Switch
              id="tournament-updates"
              checked={notifications.tournamentUpdates}
              onCheckedChange={(checked) => 
                setNotifications(prev => ({ ...prev, tournamentUpdates: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="weekly-digest">Weekly Digest</Label>
              <p className="text-sm text-muted-foreground">Receive a summary of your weekly activity</p>
            </div>
            <Switch
              id="weekly-digest"
              checked={notifications.weeklyDigest}
              onCheckedChange={(checked) => 
                setNotifications(prev => ({ ...prev, weeklyDigest: checked }))
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive notifications via email</p>
            </div>
            <Switch
              id="email-notifications"
              checked={notifications.emailNotifications}
              onCheckedChange={(checked) => 
                setNotifications(prev => ({ ...prev, emailNotifications: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
            </div>
            <Switch
              id="push-notifications"
              checked={notifications.pushNotifications}
              onCheckedChange={(checked) => 
                setNotifications(prev => ({ ...prev, pushNotifications: checked }))
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;