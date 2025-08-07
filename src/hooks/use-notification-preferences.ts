import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface NotificationPreferences {
  id?: number;
  user_id: string;
  open_bookings: boolean;
  booking_applications: boolean;
  booking_confirmations: boolean;
  friends_only: boolean;
  regions: string[];
  schedule: {
    [key: string]: {
      enabled: boolean;
      ranges: Array<{
        start: string;
        end: string;
      }>;
    };
  };
}

export const useNotificationPreferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchPreferences = async () => {
    if (!user?.id) return;

    try {
      // Direct query to notification_preferences table
      const { data: directData, error: directError } = await supabase
        .from("notification_preferences" as any)
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (directError) throw directError;
      
      if (directData) {
        setPreferences(directData as unknown as NotificationPreferences);
      } else {
        // Create default preferences
        await createDefaultPreferences();
      }
    } catch (error) {
      console.error("Error fetching notification preferences:", error);
      toast.error("Failed to load notification preferences");
    } finally {
      setLoading(false);
    }
  };

  const createDefaultPreferences = async () => {
    if (!user?.id) return;

    const defaultPreferences = {
      user_id: user.id,
      open_bookings: false,
      booking_applications: true,
      booking_confirmations: true,
      friends_only: false,
      regions: ["NORTH", "CENTER", "EAST", "WEST", "SOUTH"],
      schedule: {
        monday: { enabled: true, ranges: [{ start: "07:00", end: "21:00" }] },
        tuesday: { enabled: true, ranges: [{ start: "07:00", end: "21:00" }] },
        wednesday: { enabled: true, ranges: [{ start: "07:00", end: "21:00" }] },
        thursday: { enabled: true, ranges: [{ start: "07:00", end: "21:00" }] },
        friday: { enabled: true, ranges: [{ start: "07:00", end: "21:00" }] },
        saturday: { enabled: true, ranges: [{ start: "07:00", end: "21:00" }] },
        sunday: { enabled: true, ranges: [{ start: "07:00", end: "21:00" }] },
      },
    };

    const { data: newData, error: insertError } = await supabase
      .from("notification_preferences" as any)
      .insert(defaultPreferences)
      .select()
      .single();

    if (insertError) throw insertError;
    setPreferences(newData as unknown as NotificationPreferences);
  };

  const updatePreferences = async (updates: Partial<NotificationPreferences>) => {
    if (!user?.id || !preferences) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("notification_preferences" as any)
        .update(updates)
        .eq("user_id", user.id);

      if (error) throw error;

      setPreferences(prev => prev ? { ...prev, ...updates } : null);
      toast.success("Notification preferences updated");
    } catch (error) {
      console.error("Error updating notification preferences:", error);
      toast.error("Failed to update notification preferences");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchPreferences();
  }, [user?.id]);

  return {
    preferences,
    loading,
    saving,
    updatePreferences,
  };
};