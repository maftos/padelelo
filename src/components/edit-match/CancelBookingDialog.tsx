import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

interface CancelBookingDialogProps {
  bookingId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CancelBookingDialog({ bookingId, isOpen, onOpenChange }: CancelBookingDialogProps) {
  const [isCancelling, setIsCancelling] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleCancelBooking = async () => {
    if (!user?.id || !bookingId) return;

    setIsCancelling(true);
    try {
      const { data, error } = await supabase.rpc('cancel_booking', {
        p_user_id: user.id,
        p_booking_id: bookingId
      });

      if (error) throw error;

      // Type guard for the response data
      const result = data as { success: boolean; message: string } | null;
      
      if (result?.success) {
        toast.success(result.message);
        navigate("/manage-matches");
      } else {
        toast.error(result?.message || "Failed to cancel booking");
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error("An error occurred while cancelling the booking");
    } finally {
      setIsCancelling(false);
      onOpenChange(false);
    }
  };

  const content = (
    <>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Cancel this booking?</h3>
        <p className="text-sm text-muted-foreground">
          This action cannot be undone. The booking will be cancelled and all pending applications will be automatically declined.
        </p>
      </div>
    </>
  );

  const actions = (
    <div className="flex gap-2 w-full">
      <Button
        variant="outline"
        onClick={() => onOpenChange(false)}
        className="flex-1"
        disabled={isCancelling}
      >
        Keep Booking
      </Button>
      <Button
        variant="destructive"
        onClick={handleCancelBooking}
        disabled={isCancelling}
        className="flex-1"
      >
        {isCancelling ? "Cancelling..." : "Cancel Booking"}
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Cancel this booking?</DrawerTitle>
            <DrawerDescription>
              This action cannot be undone. The booking will be cancelled and all pending applications will be automatically declined.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="pt-2">
            {actions}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The booking will be cancelled and all pending applications will be automatically declined.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isCancelling}>Keep Booking</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleCancelBooking}
            disabled={isCancelling}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isCancelling ? "Cancelling..." : "Cancel Booking"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}