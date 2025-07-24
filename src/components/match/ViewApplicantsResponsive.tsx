
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import { Check, X, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

interface Applicant {
  id: string;
  display_name: string;
  profile_photo?: string;
  current_mmr: number;
  status: 'pending' | 'accepted' | 'rejected';
  isFriend?: boolean;
}

interface ViewApplicantsResponsiveProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gameId: string;
  spotsAvailable?: number;
  applicants?: Applicant[];
}

const ViewApplicantsContent = ({ 
  gameId, 
  spotsAvailable = 3,
  applicants = [],
  onClose
}: {
  gameId: string;
  spotsAvailable: number;
  applicants: Applicant[];
  onClose: () => void;
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const handleRespondToApplication = async (applicationId: string, status: 'ACCEPTED' | 'DECLINED') => {
    if (!user?.id) {
      toast.error('You must be logged in to respond to applications');
      return;
    }

    setLoadingStates(prev => ({ ...prev, [applicationId]: true }));

    try {
      const { data, error } = await supabase.rpc('respond_booking_application' as any, {
        p_user_id: user.id,
        p_booking_id: gameId,
        p_application_id: applicationId,
        p_status_new: status
      });

      if (error) throw error;

      const result = data as { success: boolean; message: string };
      if (result?.success) {
        toast.success(result.message);
        // The parent component should refetch the data to update the list
      } else {
        toast.error(result?.message || 'Failed to respond to application');
      }
    } catch (error) {
      console.error('Error responding to application:', error);
      toast.error('An error occurred while responding to the application');
    } finally {
      setLoadingStates(prev => ({ ...prev, [applicationId]: false }));
    }
  };

  const handleAcceptApplicant = (applicationId: string) => {
    handleRespondToApplication(applicationId, 'ACCEPTED');
  };

  const handleRejectApplicant = (applicationId: string) => {
    handleRespondToApplication(applicationId, 'DECLINED');
  };

  const handleProfileClick = (applicantId: string) => {
    console.log('Navigate to profile:', applicantId);
    navigate(`/profile/${applicantId}`);
    onClose();
  };

  return (
    <div className="space-y-4">
      {applicants.length === 0 ? (
        <div className="text-center py-8">
          <User className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No applicants yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {applicants.map((applicant) => (
            <div 
              key={applicant.id} 
              className="border rounded-lg p-4 space-y-3"
            >
              {/* Profile section - clickable */}
              <div 
                className="flex items-center gap-3 cursor-pointer hover:bg-muted/30 -m-2 p-2 rounded-md transition-colors"
                onClick={() => handleProfileClick(applicant.id)}
              >
                <Avatar className="w-12 h-12">
                  <AvatarImage src={applicant.profile_photo} />
                  <AvatarFallback>
                    {applicant.display_name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium hover:underline transition-all duration-200">
                    {applicant.display_name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {applicant.current_mmr} MMR
                    </Badge>
                    {applicant.isFriend && (
                      <Badge variant="secondary" className="text-xs">
                        Friend
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex gap-2">
                <Button 
                  size="sm"
                  variant="default"
                  onClick={() => handleAcceptApplicant(applicant.id)}
                  disabled={loadingStates[applicant.id]}
                  className="flex-1"
                >
                  <Check className="w-4 h-4 mr-1" />
                  {loadingStates[applicant.id] ? 'Processing...' : 'Accept'}
                </Button>
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={() => handleRejectApplicant(applicant.id)}
                  disabled={loadingStates[applicant.id]}
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-1" />
                  {loadingStates[applicant.id] ? 'Processing...' : 'Decline'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const ViewApplicantsResponsive = ({ 
  open, 
  onOpenChange, 
  gameId, 
  spotsAvailable = 3,
  applicants = [] 
}: ViewApplicantsResponsiveProps) => {
  const isMobile = useIsMobile();

  const handleClose = () => onOpenChange(false);

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="px-4 pb-6">
          <DrawerHeader className="text-center">
            <DrawerTitle>
              Applicants - {spotsAvailable} slot{spotsAvailable !== 1 ? 's' : ''} left
            </DrawerTitle>
            <DrawerDescription>
              Select applicants to accept for your game
            </DrawerDescription>
          </DrawerHeader>

          <ViewApplicantsContent
            gameId={gameId}
            spotsAvailable={spotsAvailable}
            applicants={applicants}
            onClose={handleClose}
          />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Applicants - {spotsAvailable} slot{spotsAvailable !== 1 ? 's' : ''} left
          </DialogTitle>
        </DialogHeader>
        
        <ViewApplicantsContent
          gameId={gameId}
          spotsAvailable={spotsAvailable}
          applicants={applicants}
          onClose={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
};
