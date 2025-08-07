import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell } from "lucide-react";
import { useNotificationPreferences } from "@/hooks/use-notification-preferences";
import { ScheduleManager } from "@/components/schedule/ScheduleManager";

const NotificationSettings = () => {
  const { preferences, loading, saving, updatePreferences } = useNotificationPreferences();

  const regions = [
    { id: "CENTER", label: "Center" },
    { id: "NORTH", label: "North" },
    { id: "WEST", label: "West" },
    { id: "EAST", label: "East" },
    { id: "SOUTH", label: "South" },
  ];

  const handleRegionChange = (regionId: string, checked: boolean) => {
    if (!preferences) return;
    
    const newRegions = checked 
      ? [...preferences.regions, regionId]
      : preferences.regions.filter(r => r !== regionId);
    
    updatePreferences({ regions: newRegions });
  };

  if (loading) {
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
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-6 w-11" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!preferences) {
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
        <CardContent>
          <p className="text-muted-foreground">Failed to load notification preferences.</p>
        </CardContent>
      </Card>
    );
  }

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
        {/* Booking Applications */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Booking Applications</h3>
            <p className="text-sm text-muted-foreground">Get notified when someone applies to join your games</p>
          </div>
          <Switch
            id="booking-applications"
            checked={preferences.booking_applications}
            onCheckedChange={(checked) => 
              updatePreferences({ booking_applications: checked })
            }
            disabled={saving}
          />
        </div>

        <Separator />

        {/* Booking Confirmations */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Booking Confirmations</h3>
            <p className="text-sm text-muted-foreground">Get notified about booking confirmations and updates</p>
          </div>
          <Switch
            id="booking-confirmations"
            checked={preferences.booking_confirmations}
            onCheckedChange={(checked) => 
              updatePreferences({ booking_confirmations: checked })
            }
            disabled={saving}
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
              checked={preferences.open_bookings}
              onCheckedChange={(checked) => 
                updatePreferences({ open_bookings: checked })
              }
              disabled={saving}
            />
          </div>

          {preferences.open_bookings && (
            <>
              {/* Regions */}
              <div className="space-y-3">
                <Label>Regions</Label>
                <div className="flex flex-wrap gap-2">
                  {regions.map((region) => (
                    <Button
                      key={region.id}
                      variant={preferences.regions.includes(region.id) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleRegionChange(region.id, !preferences.regions.includes(region.id))}
                      className="px-4 py-2"
                      disabled={saving}
                    >
                      {region.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Schedule */}
              <div className="space-y-3">
                <Label>Schedule</Label>
                <p className="text-sm text-muted-foreground">
                  Set your preferred times to receive open booking notifications
                </p>
                <ScheduleManager
                  schedule={preferences.schedule}
                  onScheduleChange={(schedule) => updatePreferences({ schedule })}
                  disabled={saving}
                />
              </div>
            </>
          )}
        </div>

      </CardContent>
    </Card>
  );
};

export default NotificationSettings;