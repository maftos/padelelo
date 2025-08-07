import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell } from "lucide-react";
import { useNotificationPreferences } from "@/hooks/use-notification-preferences";
import { ScheduleManager } from "@/components/schedule/ScheduleManager";
import { useState, useEffect } from "react";

const NotificationSettings = () => {
  // Fixed edit mode functionality
  const { preferences, loading, saving, batchUpdatePreferences } = useNotificationPreferences();
  const [editMode, setEditMode] = useState(false);
  const [localPreferences, setLocalPreferences] = useState<any>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const regions = [
    { id: "CENTER", label: "Center" },
    { id: "NORTH", label: "North" },
    { id: "WEST", label: "West" },
    { id: "EAST", label: "East" },
    { id: "SOUTH", label: "South" },
  ];

  // Initialize local preferences when preferences change
  useEffect(() => {
    if (preferences && !localPreferences) {
      setLocalPreferences({ ...preferences });
    }
  }, [preferences]);

  // Check if there are unsaved changes
  useEffect(() => {
    if (preferences && localPreferences) {
      const hasChanges = JSON.stringify(preferences) !== JSON.stringify(localPreferences);
      setHasChanges(hasChanges);
    }
  }, [preferences, localPreferences]);

  const updateLocalPreference = (updates: any) => {
    if (!localPreferences) return;
    setLocalPreferences(prev => ({ ...prev, ...updates }));
  };

  const handleRegionChange = (regionId: string, checked: boolean) => {
    if (!localPreferences) return;
    
    const newRegions = checked 
      ? [...localPreferences.regions, regionId]
      : localPreferences.regions.filter(r => r !== regionId);
    
    updateLocalPreference({ regions: newRegions });
  };

  const saveChanges = async () => {
    if (!hasChanges || !localPreferences || !preferences) return;
    
    // Create an object with only the changed fields
    const changes: any = {};
    Object.keys(localPreferences).forEach(key => {
      if (JSON.stringify(localPreferences[key]) !== JSON.stringify(preferences[key])) {
        changes[key] = localPreferences[key];
      }
    });

    const success = await batchUpdatePreferences(changes);
    if (success) {
      setEditMode(false);
    }
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
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Choose what notifications you want to receive via WhatsApp
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {editMode && hasChanges && (
              <Button 
                variant="default" 
                size="sm" 
                onClick={saveChanges}
                disabled={saving}
                className="flex items-center gap-1"
              >
                Save Changes
              </Button>
            )}
            <Button 
              variant={editMode ? "secondary" : "outline"} 
              size="sm" 
              onClick={() => {
                if (editMode) {
                  // Cancel changes - reset local preferences
                  setLocalPreferences({ ...preferences });
                  setEditMode(false);
                } else {
                  setEditMode(true);
                }
              }}
              disabled={saving}
            >
              {editMode ? "Cancel" : "Edit"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Bookings Section */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">Bookings</h3>
          </div>
          
          <div className="space-y-4 pl-4 border-l-2 border-muted">
            {/* Receiving Applications */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Receiving Applications</h4>
                <p className="text-xs text-muted-foreground">Get notified when someone applies to join your games</p>
              </div>
              <Switch
                id="booking-applications"
                checked={localPreferences?.booking_applications ?? false}
                onCheckedChange={(checked) => 
                  updateLocalPreference({ booking_applications: checked })
                }
                disabled={saving || !editMode}
              />
            </div>

            {/* Confirmations */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">Confirmations</h4>
                <p className="text-xs text-muted-foreground">Get notified about booking confirmations and updates</p>
              </div>
              <Switch
                id="booking-confirmations"
                checked={localPreferences?.booking_confirmations ?? false}
                onCheckedChange={(checked) => 
                  updateLocalPreference({ booking_confirmations: checked })
                }
                disabled={saving || !editMode}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Open Bookings Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Open Bookings</h3>
              <p className="text-sm text-muted-foreground">Get notified about new open booking opportunities</p>
            </div>
            <Switch
              id="open-bookings"
              checked={localPreferences?.open_bookings ?? false}
              onCheckedChange={(checked) => 
                updateLocalPreference({ open_bookings: checked })
              }
              disabled={saving || !editMode}
            />
          </div>

          {(localPreferences?.open_bookings) && (
            <div className="space-y-6 pl-4 border-l-2 border-muted">
              {/* Regions */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Regions</h4>
                <div className="flex flex-wrap gap-2">
                  {regions.map((region) => (
                    <Button
                      key={region.id}
                      variant={(localPreferences?.regions || []).includes(region.id) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleRegionChange(region.id, !(localPreferences?.regions || []).includes(region.id))}
                      className="px-4 py-2"
                      disabled={saving || !editMode}
                    >
                      {region.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Schedule */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Schedule</h4>
                <p className="text-xs text-muted-foreground">
                  Set your preferred booking times to receive notifications about open games. Remove all time ranges for days you don't want notifications.
                </p>
                <ScheduleManager
                  schedule={localPreferences?.schedule || {}}
                  onScheduleChange={(schedule) => updateLocalPreference({ schedule })}
                  disabled={saving || !editMode}
                  editMode={editMode}
                />
              </div>
            </div>
          )}
        </div>

      </CardContent>
    </Card>
  );
};

export default NotificationSettings;