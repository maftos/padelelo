import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Settings } from "lucide-react";

interface NotificationsStepProps {
  openBookingsNotifications: boolean;
  onOpenBookingsChange: (value: boolean) => void;
}

export const NotificationsStep = ({
  openBookingsNotifications,
  onOpenBookingsChange,
}: NotificationsStepProps) => {

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Bell className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Stay in the loop</h1>
        <p className="text-muted-foreground">
          Get notified about new padel games you can join
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="open-bookings" className="text-base font-medium">
                Open Bookings Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Get notified when new games are available to join
              </p>
            </div>
            <Switch
              id="open-bookings"
              checked={openBookingsNotifications}
              onCheckedChange={onOpenBookingsChange}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
        <Settings className="w-4 h-4 flex-shrink-0" />
        <span>You can customize all notification settings later in your profile</span>
      </div>
    </div>
  );
};