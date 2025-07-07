
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePendingMatches } from "@/hooks/use-pending-matches";
import { usePlayerSelection } from "@/hooks/match/use-player-selection";
import { Clock, Users, Edit, Plus, MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

interface PendingMatchesListProps {
  onSelectMatch: (matchId: string) => void;
  selectedMatchId?: string;
}

export const PendingMatchesList = ({ onSelectMatch, selectedMatchId }: PendingMatchesListProps) => {
  const { pendingMatches, isLoading } = usePendingMatches();
  const { getPlayerName } = usePlayerSelection();
  const navigate = useNavigate();

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    };
    const formattedDate = date.toLocaleDateString('en-GB', options);
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Add ordinal suffix to day
    const day = date.getDate();
    const suffix = day % 10 === 1 && day !== 11 ? 'st' : 
                   day % 10 === 2 && day !== 12 ? 'nd' : 
                   day % 10 === 3 && day !== 13 ? 'rd' : 'th';
    
    return formattedDate.replace(`${day}`, `${day}${suffix}`) + ` @ ${time}`;
  };

  const getPlayersList = (match: any) => {
    return [
      match.team1_player1_id,
      match.team1_player2_id, 
      match.team2_player1_id,
      match.team2_player2_id
    ];
  };

  const getPlayerPhoto = (playerId: string) => {
    // Mock profile photos for demo
    const mockPhotos: { [key: string]: string } = {
      "player2": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      "player3": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      "player4": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      "player5": "https://images.unsplash.com/photo-1494790108755-2616b612b630?w=150&h=150&fit=crop&crop=face",
      "player6": "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face",
      "player7": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face"
    };
    
    return mockPhotos[playerId] || "";
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleAddResults = (matchId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectMatch(matchId);
  };

  const handleEdit = (matchId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/edit-match/${matchId}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="animate-pulse text-muted-foreground">Loading matches...</div>
      </div>
    );
  }

  if (pendingMatches.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-muted-foreground">No confirmed matches</div>
        <p className="text-sm text-muted-foreground mt-1">Create a match to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {pendingMatches.map((match) => {
        const formattedDateTime = formatDateTime(match.match_date);
        const playerIds = getPlayersList(match);
        
        return (
          <Card
            key={match.match_id}
            className={`transition-all ${
              selectedMatchId === match.match_id 
                ? "ring-2 ring-primary bg-primary/5" 
                : "hover:shadow-md"
            }`}
          >
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="font-medium">{formattedDateTime}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Padel Club Mauritius (0.5km)</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {playerIds.map((playerId, index) => (
                        <div key={playerId} className="flex items-center gap-1">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={getPlayerPhoto(playerId)} />
                            <AvatarFallback className="text-xs">
                              {getInitials(getPlayerName(playerId))}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{getPlayerName(playerId)}</span>
                          {index < playerIds.length - 1 && (
                            <span className="text-muted-foreground mx-1">•</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex items-center gap-2 pt-2 border-t">
                  <Button 
                    onClick={(e) => handleAddResults(match.match_id, e)}
                    className="flex-1"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Results
                  </Button>
                  <Button 
                    onClick={(e) => handleEdit(match.match_id, e)}
                    variant="outline"
                    size="sm"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
