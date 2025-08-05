import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
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
        {/* Push Notifications */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Push Notifications</h3>
            <p className="text-sm text-muted-foreground">Receive notifications via WhatsApp and on your device</p>
          </div>
          <Switch
            id="push-notifications-main"
            checked={notifications.pushNotifications}
            onCheckedChange={(checked) => 
              setNotifications(prev => ({ ...prev, pushNotifications: checked }))
            }
          />
        </div>

        <Separator />

        {/* Open Bookings Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Open Bookings</h3>
              <p className="text-sm text-muted-foreground">Get notified about new open booking opportunities</p>
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
            <div className="flex gap-2">
              <Button
                variant={openBookings.gamesFrom === "anyone" ? "default" : "outline"}
                size="sm"
                onClick={() => setOpenBookings(prev => ({ ...prev, gamesFrom: "anyone" }))}
                className="flex-1"
              >
                Anyone
              </Button>
              <Button
                variant={openBookings.gamesFrom === "friends" ? "default" : "outline"}
                size="sm"
                onClick={() => setOpenBookings(prev => ({ ...prev, gamesFrom: "friends" }))}
                className="flex-1"
              >
                Friends only
              </Button>
            </div>
          </div>

          {/* Regions */}
          <div className="space-y-3">
            <Label>Regions</Label>
            <div className="flex flex-wrap gap-2">
              {regions.map((region) => (
                <Button
                  key={region.id}
                  variant={openBookings.regions.includes(region.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleRegionChange(region.id, !openBookings.regions.includes(region.id))}
                  className="px-4 py-2"
                >
                  {region.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Level */}
          <div className="space-y-2">
            <Label className="text-muted-foreground">Level (disabled)</Label>
            <p className="text-sm text-muted-foreground">Level-based notifications coming soon</p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default NotificationSettings;