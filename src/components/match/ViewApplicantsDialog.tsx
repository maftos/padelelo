
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Users, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Applicant {
  id: string;
  display_name: string;
  profile_photo?: string;
  current_mmr: number;
  status: 'pending' | 'accepted' | 'rejected';
  isFriend?: boolean;
}

interface ViewApplicantsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gameId: string;
  spotsAvailable?: number;
  applicants?: Applicant[];
}

export const ViewApplicantsDialog = ({ 
  open, 
  onOpenChange, 
  gameId, 
  spotsAvailable = 3,
  applicants = [] 
}: ViewApplicantsDialogProps) => {
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]);
  const navigate = useNavigate();

  // Mock applicants data with friends and others
  const mockApplicants: Applicant[] = [
    {
      id: "friend-1",
      display_name: "Sarah Wilson",
      profile_photo: "https://images.unsplash.com/photo-1494790108755-2616b612b630?w=150&h=150&fit=crop&crop=face",
      current_mmr: 3200,
      status: 'pending',
      isFriend: true
    },
    {
      id: "friend-2", 
      display_name: "Mike Johnson",
      profile_photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      current_mmr: 2900,
      status: 'pending',
      isFriend: true
    },
    {
      id: "other-1",
      display_name: "John Smith",
      profile_photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      current_mmr: 2800,
      status: 'pending',
      isFriend: false
    },
    {
      id: "other-2",
      display_name: "Alex Chen",
      profile_photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      current_mmr: 3100,
      status: 'pending',
      isFriend: false
    },
    {
      id: "other-3",
      display_name: "Emma Davis",
      profile_photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
      current_mmr: 2950,
      status: 'pending',
      isFriend: false
    }
  ];

  const displayApplicants = applicants.length > 0 ? applicants : mockApplicants;
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
    onOpenChange(false);
  };

  const handleProfileClick = (applicantId: string) => {
    console.log('Navigate to profile:', applicantId);
    navigate(`/profile/${applicantId}`);
    onOpenChange(false);
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
              className="flex items-center border rounded-lg overflow-hidden hover:bg-muted/50 transition-colors"
            >
              {/* Left half - Profile click area */}
              <div 
                className="flex items-center gap-3 p-3 flex-1 cursor-pointer"
                onClick={() => handleProfileClick(applicant.id)}
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage src={applicant.profile_photo} />
                  <AvatarFallback>
                    {applicant.display_name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{applicant.display_name}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {applicant.current_mmr} MMR
                    </Badge>
                  </div>
                </div>
              </div>
              
              {/* Right half - Selection toggle area */}
              <div 
                className="p-3 cursor-pointer flex items-center justify-center min-w-[60px]"
                onClick={() => handleApplicantToggle(applicant.id)}
              >
                <Checkbox
                  checked={selectedApplicants.includes(applicant.id)}
                  disabled={!selectedApplicants.includes(applicant.id) && selectedApplicants.length >= spotsAvailable}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Applicants - {spotsAvailable} slot{spotsAvailable !== 1 ? 's' : ''} left
          </DialogTitle>
        </DialogHeader>
        
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
      </DialogContent>
    </Dialog>
  );
};
