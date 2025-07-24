
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

import { Check, User } from "lucide-react";
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
  status: 'pending' | 'accepted' | 'rejected';
  isFriend?: boolean;
}

interface ViewApplicantsResponsiveProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gameId: string;
  spotsAvailable?: number;
  applicants?: Applicant[];
  onApplicationResponse?: (applicationId: number, status: 'ACCEPTED', applicant: Applicant) => void;
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
  onApplicationResponse?: (applicationId: number, status: 'ACCEPTED', applicant: Applicant) => void;
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [localApplicants, setLocalApplicants] = useState(applicants);
  const [selectedApplicantId, setSelectedApplicantId] = useState<number | null>(null);

  // Update local applicants when prop changes
  useEffect(() => {
    setLocalApplicants(applicants);
    setSelectedApplicantId(null); // Reset selection when applicants change
  }, [applicants]);

  const handleRespondToApplication = async (applicationId: number, status: 'ACCEPTED') => {
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
        
        // Call the callback to update the parent component
        if (onApplicationResponse && applicant) {
          onApplicationResponse(applicationId, status, applicant);
        }
        
        // Close the modal/drawer
        onClose();
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

  const handleAcceptSelected = () => {
    if (selectedApplicantId !== null) {
      handleRespondToApplication(selectedApplicantId, 'ACCEPTED');
    }
  };

  const handleApplicantSelect = (applicantId: number) => {
    setSelectedApplicantId(selectedApplicantId === applicantId ? null : applicantId);
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
        <>
          <div className="space-y-3">
            {localApplicants
              .filter(app => app.status === 'pending')
              .map((applicant) => (
                <div 
                  key={applicant.id} 
                  className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                    selectedApplicantId === applicant.id 
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                      : 'hover:border-primary/50 hover:bg-muted/30'
                  }`}
                  onClick={() => handleApplicantSelect(applicant.id)}
                >
                  {/* Profile section */}
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={applicant.profile_photo} />
                      <AvatarFallback>
                        {applicant.display_name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">
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
                        {selectedApplicantId === applicant.id && (
                          <Badge variant="default" className="text-xs">
                            Selected
                          </Badge>
                        )}
                      </div>
                    </div>
                    {/* Profile link icon */}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProfileClick(applicant.id);
                      }}
                      className="opacity-60 hover:opacity-100"
                    >
                      <User className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            
            {localApplicants.filter(app => app.status === 'pending').length === 0 && (
              <div className="text-center py-8">
                <User className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No pending applicants</p>
              </div>
            )}
          </div>

          {/* Accept Selected Button */}
          {selectedApplicantId !== null && (
            <div className="pt-4 border-t">
              <Button 
                onClick={handleAcceptSelected}
                disabled={loadingStates[selectedApplicantId.toString()]}
                className="w-full"
                size="lg"
              >
                <Check className="w-4 h-4 mr-2" />
                {loadingStates[selectedApplicantId.toString()] ? 'Processing...' : 'Accept Selected Applicant'}
              </Button>
            </div>
          )}
        </>
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
