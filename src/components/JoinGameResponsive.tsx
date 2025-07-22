
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Calendar, AlertCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface JoinGameResponsiveProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gamePost: {
    id: string;
    title: string;
    courtName: string;
    venueId: string;
    gameDate: Date;
    startTime: string;
    price: string;
    description: string;
    existingPlayers: Array<{ 
      id: string; 
      name: string | null; 
      current_mmr: number; 
      avatar: string | null; 
    } | null>;
    spotsAvailable: number;
    createdBy: string;
  } | null;
}

const formatGameDate = (date: Date) => {
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayName = dayNames[date.getDay()];
  
  if (diffDays === 1) {
    return `Tomorrow, ${date.getDate()}${getOrdinalSuffix(date.getDate())} ${date.toLocaleDateString('en-US', { month: 'short' })}`;
  } else if (diffDays <= 7) {
    return `Next ${dayName}, ${date.getDate()}${getOrdinalSuffix(date.getDate())} ${date.toLocaleDateString('en-US', { month: 'short' })}`;
  } else {
    return `${dayName}, ${date.getDate()}${getOrdinalSuffix(date.getDate())} ${date.toLocaleDateString('en-US', { month: 'short' })}`;
  }
};

const getOrdinalSuffix = (day: number) => {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
};

const JoinGameContent = ({ gamePost, onJoinRequest, isSubmitting, onClose }: {
  gamePost: JoinGameResponsiveProps['gamePost'];
  onJoinRequest: () => void;
  isSubmitting: boolean;
  onClose: () => void;
}) => {
  if (!gamePost) return null;

  const hostPlayer = gamePost.existingPlayers.find(player => player?.id === gamePost.createdBy);

  return (
    <div className="space-y-6">
      {/* Game Details */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm">Game Details</h4>
        
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="font-medium">{gamePost.courtName}</span>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <div>
              <div className="font-medium">{formatGameDate(gamePost.gameDate)}</div>
              <div className="text-xs text-muted-foreground">{gamePost.startTime}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Host Information */}
      {hostPlayer && (
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Hosted by</h4>
          <div className="flex items-center gap-3 bg-muted/50 rounded-lg p-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={hostPlayer.avatar || ''} alt={hostPlayer.name || 'Host'} />
              <AvatarFallback className="text-sm">
                {hostPlayer.name ? hostPlayer.name[0] : 'H'}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <div className="font-medium">{hostPlayer.name || 'Host'}</div>
              <div className="text-xs text-muted-foreground">{hostPlayer.current_mmr} MMR</div>
            </div>
          </div>
        </div>
      )}

      {/* How it works */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          How it works
        </h4>
        <div className="bg-muted/50 rounded-lg p-4 space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
            <span>This sends a <strong>request to join</strong> - not a confirmation</span>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
            <span>The host will be <strong>notified immediately</strong> and needs to confirm</span>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
            <span>Your request is <strong>valid for 24 hours</strong></span>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
            <span>You'll be notified of the decision <strong>as soon as possible</strong></span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 pt-2">
        <Button 
          onClick={onJoinRequest} 
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? "Sending Request..." : "Send Join Request"}
        </Button>
        <Button 
          variant="outline" 
          onClick={onClose}
          disabled={isSubmitting}
          className="flex-1 sm:flex-none sm:min-w-[100px]"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export const JoinGameResponsive = ({ open, onOpenChange, gamePost }: JoinGameResponsiveProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleJoinRequest = async () => {
    if (!gamePost || !user) return;
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .rpc('apply_open_booking' as any, {
          p_user_id: user.id,
          p_booking_id: gamePost.id
        });

      if (error) {
        throw error;
      }

      // Cast the response to the expected format
      const response = data as { success: boolean; message: string } | null;

      if (response?.success) {
        toast({
          title: "Request sent successfully!",
          description: response.message || "Your join request has been submitted to the host.",
        });
        onOpenChange(false);
      } else {
        toast({
          title: "Request failed",
          description: response?.message || "Unable to send join request. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error applying to booking:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => onOpenChange(false);

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="px-4 pb-6">
          <DrawerHeader className="text-center">
            <DrawerTitle>Join Game Request</DrawerTitle>
            <DrawerDescription>
              Review the game details and send your request to join
            </DrawerDescription>
          </DrawerHeader>

          <JoinGameContent
            gamePost={gamePost}
            onJoinRequest={handleJoinRequest}
            isSubmitting={isSubmitting}
            onClose={handleClose}
          />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Join Game Request</DialogTitle>
          <DialogDescription>
            Review the game details and send your request to join
          </DialogDescription>
        </DialogHeader>

        <JoinGameContent
          gamePost={gamePost}
          onJoinRequest={handleJoinRequest}
          isSubmitting={isSubmitting}
          onClose={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
};
