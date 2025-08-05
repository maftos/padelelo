import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
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

  const [openBookings, setOpenBookings] = useState({
    enabled: true,
    gamesFrom: "anyone",
    regions: ["center", "north", "west", "east", "south"],
  });

  const regions = [
    { id: "center", label: "Center" },
    { id: "north", label: "North" },
    { id: "west", label: "West" },
    { id: "east", label: "East" },
    { id: "south", label: "South" },
  ];

  const handleRegionChange = (regionId: string, checked: boolean) => {
    setOpenBookings(prev => ({
      ...prev,
      regions: checked 
        ? [...prev.regions, regionId]
        : prev.regions.filter(r => r !== regionId)
    }));
  };

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
      <CardContent className="space-y-6">
        {/* Open Bookings Section */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Open Bookings</h3>
            <p className="text-sm text-muted-foreground">Get notified about new open booking opportunities</p>
          </div>

          {/* General Open Bookings Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="open-bookings">Open Bookings</Label>
              <p className="text-sm text-muted-foreground">Receive notifications for new open bookings</p>
            </div>
            <Switch
              id="open-bookings"
              checked={openBookings.enabled}
              onCheckedChange={(checked) => 
                setOpenBookings(prev => ({ ...prev, enabled: checked }))
              }
            />
          </div>

          {/* Games From */}
          <div className="space-y-3">
            <Label>Games from</Label>
            <RadioGroup
              value={openBookings.gamesFrom}
              onValueChange={(value) => 
                setOpenBookings(prev => ({ ...prev, gamesFrom: value }))
              }
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="anyone" id="anyone" />
                <Label htmlFor="anyone">Anyone</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="friends" id="friends" />
                <Label htmlFor="friends">Friends only</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Regions */}
          <div className="space-y-3">
            <Label>Regions</Label>
            <div className="space-y-2">
              {regions.map((region) => (
                <div key={region.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={region.id}
                    checked={openBookings.regions.includes(region.id)}
                    onCheckedChange={(checked) => 
                      handleRegionChange(region.id, checked === true)
                    }
                  />
                  <Label htmlFor={region.id}>{region.label}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Level */}
          <div className="space-y-2">
            <Label className="text-muted-foreground">Level (disabled)</Label>
            <p className="text-sm text-muted-foreground">Level-based notifications coming soon</p>
          </div>
        </div>

        <Separator />

        {/* Push Notifications */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive notifications via WhatsApp and on your device</p>
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