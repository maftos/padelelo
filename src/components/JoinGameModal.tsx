
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Calendar, DollarSign, UserCheck, Users, AlertCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface JoinGameModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gamePost: {
    id: string;
    title: string;
    courtName: string;
    distance: string;
    gameDate: Date;
    startTime: string;
    endTime: string;
    price: string;
    preferences: string;
    description: string;
    existingPlayers: Array<{ id: string; name: string | null; mmr: number; avatar: string | null; isHost: boolean } | null>;
    spotsAvailable: number;
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

export const JoinGameModal = ({ open, onOpenChange, gamePost }: JoinGameModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!gamePost) return null;

  const handleJoinRequest = async () => {
    setIsSubmitting(true);
    console.log("Sending join request for game:", gamePost.id);
    
    // TODO: Implement actual join request logic
    // This would typically involve:
    // 1. Creating a join request in the database
    // 2. Notifying the host
    // 3. Setting up the request expiry
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    onOpenChange(false);
  };

  const hostPlayer = gamePost.existingPlayers.find(player => player?.isHost);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Join Game Request</DialogTitle>
          <DialogDescription>
            Review the game details and send your request to join
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Game Requirements Recap */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Game Details</h4>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{gamePost.courtName} ({gamePost.distance})</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{formatGameDate(gamePost.gameDate)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{gamePost.startTime} - {gamePost.endTime}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span>{gamePost.price}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-muted-foreground" />
                <span>{gamePost.preferences}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{gamePost.spotsAvailable} spot{gamePost.spotsAvailable > 1 ? 's' : ''} available</span>
              </div>
            </div>
          </div>

          {/* Host Information */}
          {hostPlayer && (
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Hosted by</h4>
              <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={hostPlayer.avatar || ''} alt={hostPlayer.name || 'Host'} />
                  <AvatarFallback className="text-xs">
                    {hostPlayer.name ? hostPlayer.name[0] : 'H'}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <div className="font-medium">{hostPlayer.name || 'Host'}</div>
                  <div className="text-xs text-muted-foreground">{hostPlayer.mmr} MMR</div>
                </div>
              </div>
            </div>
          )}

          {/* Process Explanation */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              How it works
            </h4>
            <div className="bg-blue-50 rounded-lg p-3 space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>This sends a <strong>request to join</strong> - not a confirmation</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>The host will be <strong>notified immediately</strong> and needs to confirm</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>Your request is <strong>valid for 24 hours</strong></span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <span>You'll be notified of the decision <strong>as soon as possible</strong></span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleJoinRequest} 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending Request..." : "Send Join Request"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
