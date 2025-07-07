
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { PageContainer } from "@/components/layouts/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, MapPin, Users, ArrowLeft, DollarSign } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePlayerSelection } from "@/hooks/match/use-player-selection";
import { useUserProfile } from "@/hooks/use-user-profile";
import { toast } from "sonner";

const CreateMatch = () => {
  const navigate = useNavigate();
  const { getPlayerName, playerOptions } = usePlayerSelection();
  const { profile } = useUserProfile();
  
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [matchDate, setMatchDate] = useState("");
  const [matchTime, setMatchTime] = useState("");
  const [location, setLocation] = useState("");
  const [feePerPlayer, setFeePerPlayer] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (profile?.id && !selectedPlayers.includes(profile.id)) {
      setSelectedPlayers([profile.id]);
    }
  }, [profile?.id]);

  const getPlayerPhoto = (playerId: string) => {
    if (playerId === profile?.id) {
      return profile.profile_photo || "";
    }
    const player = playerOptions.find((p) => p.id === playerId);
    return player?.profile_photo || "";
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handlePlayerToggle = (playerId: string) => {
    if (playerId === profile?.id) return; // Can't remove current user
    
    if (selectedPlayers.includes(playerId)) {
      setSelectedPlayers(selectedPlayers.filter(p => p !== playerId));
    } else if (selectedPlayers.length < 4) {
      setSelectedPlayers([...selectedPlayers, playerId]);
    } else {
      toast.error("Maximum 4 players allowed");
    }
  };

  const filteredPlayers = playerOptions.filter(player => 
    player.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    player.id !== profile?.id
  );

  const handleCreateMatch = () => {
    // Validation for incomplete matches (less than 4 players)
    if (selectedPlayers.length < 4) {
      if (!location.trim()) {
        toast.error("Location is required for incomplete matches");
        return;
      }
      if (!matchDate) {
        toast.error("Date is required for incomplete matches");
        return;
      }
      if (!matchTime) {
        toast.error("Time is required for incomplete matches");
        return;
      }
      if (!feePerPlayer.trim()) {
        toast.error("Fee per player is required for incomplete matches");
        return;
      }
    }

    toast.success("Match created successfully!");
    navigate("/manage-matches");
  };

  const formatDateTime = () => {
    if (!matchDate || !matchTime) return "";
    const date = new Date(`${matchDate}T${matchTime}`);
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const requiresDetails = selectedPlayers.length < 4;

  return (
    <>
      <Navigation />
      <PageContainer>
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => navigate("/manage-matches")} 
              variant="ghost" 
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <h1 className="text-2xl font-bold">Create New Match</h1>
            </div>
          </div>

          {/* Players Selection */}
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Users className="h-4 w-4" />
                  Players ({selectedPlayers.length}/4)
                </div>
                
                {/* Search */}
                <Input
                  placeholder="Search for players..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                {/* Selected Players */}
                <div className="grid gap-3">
                  {selectedPlayers.map((playerId) => (
                    <div key={playerId} className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={getPlayerPhoto(playerId)} />
                          <AvatarFallback className="text-sm">
                            {getInitials(getPlayerName(playerId))}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{getPlayerName(playerId)}</span>
                        {playerId === profile?.id && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">You</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Available Players */}
                {filteredPlayers.length > 0 && selectedPlayers.length < 4 && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Available Players</div>
                    <div className="grid gap-2 max-h-48 overflow-y-auto">
                      {filteredPlayers.slice(0, 10).map((player) => (
                        <div
                          key={player.id}
                          onClick={() => handlePlayerToggle(player.id)}
                          className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={player.profile_photo || ""} />
                            <AvatarFallback className="text-xs">
                              {getInitials(player.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{player.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedPlayers.length < 4 && (
                  <div className="text-sm text-muted-foreground p-3 bg-muted/30 rounded">
                    {4 - selectedPlayers.length} more player{4 - selectedPlayers.length > 1 ? 's' : ''} needed
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Match Details - Show if less than 4 players or always for complete matches */}
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Calendar className="h-4 w-4" />
                  Match Details {requiresDetails && <span className="text-destructive">*</span>}
                </div>

                {/* Location */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <MapPin className="h-4 w-4" />
                    Location {requiresDetails && <span className="text-destructive">*</span>}
                  </div>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter match location"
                    required={requiresDetails}
                  />
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">
                      Date {requiresDetails && <span className="text-destructive">*</span>}
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={matchDate}
                      onChange={(e) => setMatchDate(e.target.value)}
                      required={requiresDetails}
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">
                      Time {requiresDetails && <span className="text-destructive">*</span>}
                    </Label>
                    <Input
                      id="time"
                      type="time"
                      value={matchTime}
                      onChange={(e) => setMatchTime(e.target.value)}
                      required={requiresDetails}
                    />
                  </div>
                </div>

                {matchDate && matchTime && (
                  <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
                    {formatDateTime()}
                  </div>
                )}

                {/* Fee Per Player */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <DollarSign className="h-4 w-4" />
                    Fee per Player {requiresDetails && <span className="text-destructive">*</span>}
                  </div>
                  <Input
                    value={feePerPlayer}
                    onChange={(e) => setFeePerPlayer(e.target.value)}
                    placeholder="Enter fee amount"
                    required={requiresDetails}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="p-6">
              <Button onClick={handleCreateMatch} className="w-full" size="lg">
                Create Match
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </>
  );
};

export default CreateMatch;
