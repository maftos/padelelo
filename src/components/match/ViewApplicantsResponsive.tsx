
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
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Users, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]);
  const navigate = useNavigate();

  const displayApplicants = applicants;
  const friends = displayApplicants.filter(applicant => applicant.isFriend);
  const others = displayApplicants.filter(applicant => !applicant.isFriend);

  const handleApplicantToggle = (applicantId: string) => {
    setSelectedApplicants(prev => {
      if (prev.includes(applicantId)) {
        return prev.filter(id => id !== applicantId);
      } else {
        // Limit selection to available spots
        if (prev.length < spotsAvailable) {
          return [...prev, applicantId];
        }
        return prev;
      }
    });
  };

  const handleBundleAccept = () => {
    console.log('Bundle accept applicants:', selectedApplicants);
    // TODO: Implement bundle accept logic
    onClose();
  };

  const handleProfileClick = (applicantId: string) => {
    console.log('Navigate to profile:', applicantId);
    navigate(`/profile/${applicantId}`);
    onClose();
  };

  const renderApplicantSection = (title: string, sectionApplicants: Applicant[]) => {
    if (sectionApplicants.length === 0) return null;

    return (
      <div className="space-y-3">
        <h3 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
          {title === 'Friends' ? <Users className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
          {title} ({sectionApplicants.length})
        </h3>
        <div className="space-y-2">
          {sectionApplicants.map((applicant) => (
            <div 
              key={applicant.id} 
              className="flex items-center border rounded-lg overflow-hidden transition-colors group"
            >
              {/* Left half - Profile click area */}
              <div 
                className="flex items-center gap-3 p-3 flex-1 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleProfileClick(applicant.id)}
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage src={applicant.profile_photo} />
                  <AvatarFallback>
                    {applicant.display_name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium transition-all duration-200 group-hover:underline">
                    {applicant.display_name}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {applicant.current_mmr} MMR
                    </Badge>
                  </div>
                </div>
              </div>
              
              {/* Right half - Selection toggle area */}
              <div 
                className="p-3 cursor-pointer flex items-center justify-center min-w-[60px] hover:bg-accent/50 transition-colors"
                onClick={() => handleApplicantToggle(applicant.id)}
              >
                <div className="hover:scale-110 transition-transform duration-200">
                  <Checkbox
                    checked={selectedApplicants.includes(applicant.id)}
                    disabled={!selectedApplicants.includes(applicant.id) && selectedApplicants.length >= spotsAvailable}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {displayApplicants.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No applicants yet</p>
        </div>
      ) : (
        <>
          {renderApplicantSection('Friends', friends)}
          {renderApplicantSection('Others', others)}
        </>
      )}
      
      {selectedApplicants.length > 0 && (
        <div className="pt-4 border-t">
          <Button 
            onClick={handleBundleAccept}
            className="w-full"
            disabled={selectedApplicants.length === 0}
          >
            Accept Selected ({selectedApplicants.length})
          </Button>
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
