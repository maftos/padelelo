
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProfileAvatar } from "./ProfileAvatar";
import { Badge } from "@/components/ui/badge";
import { Edit, Check, X, UserPlus, Users, Clock, TrendingUp, TrendingDown, Instagram, Flag, ExternalLink, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { countries } from "@/lib/countries";
import { ReportPlayerModal } from "./ReportPlayerModal";
import { useNavigate } from "react-router-dom";

interface ProfileFormState {
  first_name: string;
  last_name: string;
  nationality: string;
  gender: string;
  profile_photo: string;
  current_mmr: number;
  years_playing: string;
  favorite_position: string;
  preferred_side: string;
  instagram_handle?: string;
}

interface ProfileHeroCardProps {
  isEditing: boolean;
  uploading: boolean;
  formData: ProfileFormState;
  profileData?: {
    profile: any;
    friendship: {
      exists: boolean;
      status: string | null;
      created_at: string | null;
      friendship_id: number | null;
    };
  };
  onPhotoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  isOwnProfile?: boolean;
}

export const ProfileHeroCard = ({
  isEditing,
  uploading,
  formData,
  profileData,
  onPhotoUpload,
  onEdit,
  onSave,
  onCancel,
  isOwnProfile = true
}: ProfileHeroCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [sendingRequest, setSendingRequest] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const handleSendFriendRequest = async () => {
    if (!user || !profileData?.profile?.id) {
      toast({
        title: "Error",
        description: "Unable to send friend request. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setSendingRequest(true);
    try {
      const { error } = await supabase
        .from('friendships')
        .insert({
          user_id: user.id,
          friend_id: profileData.profile.id,
          status: 'INVITED'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Friend request sent successfully!",
      });
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast({
        title: "Error",
        description: "Failed to send friend request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSendingRequest(false);
    }
  };

  const getFriendshipStatus = () => {
    if (!profileData?.friendship) return null;
    
    const { exists, status } = profileData.friendship;
    
    if (!exists) return null;
    
    switch (status) {
      case 'ACCEPTED':
        return 'friends';
      case 'PENDING':
        return 'pending';
      default:
        return null;
    }
  };

  const friendshipStatus = getFriendshipStatus();
  const displayName = `${formData.first_name} ${formData.last_name}`.trim() || "User Name";
  
  // Get country details
  const countryData = countries.find(c => c.code === formData.nationality);
  
  // Mock weekly MMR change for now
  const weeklyChange = 25; // Will be replaced with real data later

  // Mock mutual friends count (will be replaced with real data)
  const mutualFriendsCount = !isOwnProfile ? 5 : 0;
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <ProfileAvatar
            isEditing={isEditing && isOwnProfile}
            uploading={uploading}
            profilePhoto={formData.profile_photo}
            firstName={formData.first_name}
            lastName={formData.last_name}
            onPhotoUpload={onPhotoUpload}
          />
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{displayName}</h1>
            {!isOwnProfile && mutualFriendsCount > 0 && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Users className="w-3 h-3" />
                {mutualFriendsCount} mutual friend{mutualFriendsCount > 1 ? 's' : ''}
              </p>
            )}
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                {formData.current_mmr || 3000} MMR
                {weeklyChange > 0 ? (
                  <TrendingUp className="w-3 h-3 text-green-500" />
                ) : weeklyChange < 0 ? (
                  <TrendingDown className="w-3 h-3 text-red-500" />
                ) : null}
                <span className={`text-xs ${weeklyChange > 0 ? 'text-green-500' : weeklyChange < 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
                  {weeklyChange > 0 ? '+' : ''}{weeklyChange}
                </span>
              </Badge>
              {countryData && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <span>{countryData.flag}</span>
                  {countryData.code}
                </Badge>
              )}
              {formData.gender && (
                <Badge variant="outline">
                  {formData.gender}
                </Badge>
              )}
              {formData.preferred_side && (
                <Badge variant="outline">
                  {formData.preferred_side} side
                </Badge>
              )}
            </div>
            
            {/* Instagram Handle */}
            {formData.instagram_handle && (
              <div className="flex justify-center">
                <a
                  href={`https://instagram.com/${formData.instagram_handle.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Instagram className="w-3 h-3" />
                  {formData.instagram_handle}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          {/* Action Controls */}
          <div className="flex gap-2 w-full">
            {isOwnProfile ? (
              // Edit Controls - Only show for own profile
              isEditing ? (
                <>
                  <Button onClick={onSave} className="flex-1">
                    <Check className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button onClick={onCancel} variant="outline" className="flex-1">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </>
              ) : (
                <div className="w-full space-y-2">
                  <Button onClick={onEdit} variant="outline" className="w-full">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button 
                    onClick={() => navigate('/settings')} 
                    variant="ghost" 
                    className="w-full"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </div>
              )
            ) : (
              // Friend Request Controls - For other users' profiles
              friendshipStatus === 'friends' ? (
                <Button variant="secondary" className="w-full" disabled>
                  <Users className="w-4 h-4 mr-2" />
                  Friends
                </Button>
              ) : friendshipStatus === 'pending' ? (
                <Button variant="outline" className="w-full" disabled>
                  <Clock className="w-4 h-4 mr-2" />
                  Request Sent
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={handleSendFriendRequest} 
                    disabled={sendingRequest}
                    className="flex-1"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    {sendingRequest ? 'Sending...' : 'Add Friend'}
                  </Button>
                  <Button 
                    onClick={() => setShowReportModal(true)}
                    variant="outline"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Flag className="w-4 h-4" />
                  </Button>
                </>
              )
            )}
          </div>
          
          <ReportPlayerModal
            isOpen={showReportModal}
            onClose={() => setShowReportModal(false)}
            playerName={displayName}
            playerId={profileData?.profile?.id || ""}
          />
        </div>
      </CardContent>
    </Card>
  );
};
