
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

interface Applicant {
  id: string;
  display_name: string;
  profile_photo?: string;
  current_mmr: number;
  status: 'pending' | 'accepted' | 'rejected';
}

interface ViewApplicantsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gameId: string;
  applicants?: Applicant[];
}

export const ViewApplicantsDialog = ({ 
  open, 
  onOpenChange, 
  gameId, 
  applicants = [] 
}: ViewApplicantsDialogProps) => {
  // Mock applicants data
  const mockApplicants: Applicant[] = [
    {
      id: "applicant-1",
      display_name: "John Smith",
      profile_photo: "",
      current_mmr: 2800,
      status: 'pending'
    },
    {
      id: "applicant-2", 
      display_name: "Sarah Wilson",
      profile_photo: "",
      current_mmr: 3200,
      status: 'pending'
    }
  ];

  const displayApplicants = applicants.length > 0 ? applicants : mockApplicants;

  const handleAccept = (applicantId: string) => {
    console.log('Accept applicant:', applicantId);
    // TODO: Implement accept logic
  };

  const handleReject = (applicantId: string) => {
    console.log('Reject applicant:', applicantId);
    // TODO: Implement reject logic
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Game Applicants</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {displayApplicants.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No applicants yet</p>
            </div>
          ) : (
            displayApplicants.map((applicant) => (
              <div key={applicant.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={applicant.profile_photo} />
                    <AvatarFallback>
                      {applicant.display_name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{applicant.display_name}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {applicant.current_mmr} MMR
                      </Badge>
                      {applicant.status !== 'pending' && (
                        <Badge 
                          variant={applicant.status === 'accepted' ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {applicant.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                {applicant.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAccept(applicant.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Check className="w-4 h-4 text-green-600" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReject(applicant.id)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
