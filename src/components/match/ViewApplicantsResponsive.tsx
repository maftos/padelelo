
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
import { useState, useEffect } from "react";

interface Applicant {
  id: number;
  display_name: string;
  profile_photo?: string;
  current_mmr: number;
  status: 'pending' | 'accepted' | 'rejected' | 'declined';
  isFriend?: boolean;
}

interface ViewApplicantsResponsiveProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gameId: string;
  spotsAvailable?: number;
  applicants?: Applicant[];
  onApplicationResponse?: (applicationId: number, status: 'ACCEPTED' | 'DECLINED', applicant: Applicant) => void;
}

const ViewApplicantsContent = ({ 
  gameId, 
  spotsAvailable = 3,
  applicants = [],
  onClose,
  onApplicationResponse
}: {
  gameId: string;
  spotsAvailable: number;
  applicants: Applicant[];
  onClose: () => void;
  onApplicationResponse?: (applicationId: number, status: 'ACCEPTED' | 'DECLINED', applicant: Applicant) => void;
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [localApplicants, setLocalApplicants] = useState(applicants);

  // Update local applicants when prop changes
  useEffect(() => {
    setLocalApplicants(applicants);
  }, [applicants]);

  const handleRespondToApplication = async (applicationId: number, status: 'ACCEPTED' | 'DECLINED') => {
    if (!user?.id) {
      toast.error('You must be logged in to respond to applications');
      return;
    }

    setLoadingStates(prev => ({ ...prev, [applicationId.toString()]: true }));

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
        
        // Find the applicant details
        const applicant = localApplicants.find(app => app.id === applicationId);
        
        if (status === 'ACCEPTED') {
          // Call the callback to update the parent component
          if (onApplicationResponse && applicant) {
            onApplicationResponse(applicationId, status, applicant);
          }
          
          // Close the modal/drawer only for accepted applications
          onClose();
        } else if (status === 'DECLINED') {
          // For declined applications, update status to 'declined' locally without closing modal
          setLocalApplicants(prev => prev.map(app => 
            app.id === applicationId 
              ? { ...app, status: 'declined' as const }
              : app
          ));
          
          // Still call the callback for data consistency
          if (onApplicationResponse && applicant) {
            onApplicationResponse(applicationId, status, applicant);
          }
        }
      } else {
        toast.error(result?.message || 'Failed to respond to application');
      }
    } catch (error) {
      console.error('Error responding to application:', error);
      toast.error('An error occurred while responding to the application');
    } finally {
      setLoadingStates(prev => ({ ...prev, [applicationId.toString()]: false }));
    }
  };

  const handleAcceptApplicant = (applicationId: number) => {
    handleRespondToApplication(applicationId, 'ACCEPTED');
  };

  const handleRejectApplicant = (applicationId: number) => {
    handleRespondToApplication(applicationId, 'DECLINED');
  };

  const handleProfileClick = (applicantId: number) => {
    console.log('Navigate to profile:', applicantId);
    navigate(`/profile/${applicantId}`);
    onClose();
  };

  return (
    <div className="space-y-4">
      {localApplicants.length === 0 ? (
        <div className="text-center py-8">
          <User className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No applicants yet</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pending Applications Section */}
          {localApplicants.filter(app => app.status === 'pending').length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Pending</h3>
              <div className="space-y-3">
                {localApplicants
                  .filter(app => app.status === 'pending')
                  .map((applicant) => (
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
                      
                      {/* Action buttons - only for pending */}
                      <div className="flex gap-2">
                        <Button 
                          size="sm"
                          variant="default"
                          onClick={() => handleAcceptApplicant(applicant.id)}
                          disabled={loadingStates[applicant.id.toString()]}
                          className="flex-1"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          {loadingStates[applicant.id.toString()] ? 'Processing...' : 'Accept'}
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => handleRejectApplicant(applicant.id)}
                          disabled={loadingStates[applicant.id.toString()]}
                          className="flex-1"
                        >
                          <X className="w-4 h-4 mr-1" />
                          {loadingStates[applicant.id.toString()] ? 'Processing...' : 'Decline'}
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Declined Applications Section */}
          {localApplicants.filter(app => app.status === 'declined').length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Declined</h3>
              <div className="space-y-3">
                {localApplicants
                  .filter(app => app.status === 'declined')
                  .map((applicant) => (
                    <div 
                      key={applicant.id} 
                      className="border rounded-lg p-4 bg-muted/20"
                    >
                      {/* Profile section - clickable but muted */}
                      <div 
                        className="flex items-center gap-3 cursor-pointer hover:bg-muted/30 -m-2 p-2 rounded-md transition-colors"
                        onClick={() => handleProfileClick(applicant.id)}
                      >
                        <Avatar className="w-12 h-12 opacity-75">
                          <AvatarImage src={applicant.profile_photo} />
                          <AvatarFallback>
                            {applicant.display_name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium hover:underline transition-all duration-200 opacity-75">
                            {applicant.display_name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs opacity-75">
                              {applicant.current_mmr} MMR
                            </Badge>
                            {applicant.isFriend && (
                              <Badge variant="secondary" className="text-xs opacity-75">
                                Friend
                              </Badge>
                            )}
                            <Badge variant="destructive" className="text-xs">
                              Declined
                            </Badge>
                          </div>
                        </div>
                      </div>
                      {/* No action buttons for declined applicants */}
                    </div>
                  ))}
              </div>
            </div>
          )}
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
  applicants = [],
  onApplicationResponse
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
            onApplicationResponse={onApplicationResponse}
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
          onApplicationResponse={onApplicationResponse}
        />
      </DialogContent>
    </Dialog>
  );
};
