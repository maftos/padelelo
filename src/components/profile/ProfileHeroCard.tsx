
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProfileAvatar } from "./ProfileAvatar";
import { Badge } from "@/components/ui/badge";
import { Edit, Check, X, UserPlus, Users, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface ProfileFormState {
  first_name: string;
  last_name: string;
  nationality: string;
  gender: string;
  profile_photo: string;
  current_mmr: number;
  years_playing: string;
  favorite_position: string;
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
  const [sendingRequest, setSendingRequest] = useState(false);

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
      const { error } = await supabase.rpc('send_friend_request_leaderboard', {
        user_a_id_public: user.id,
        user_b_id_public: profileData.profile.id
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
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="secondary">
                {formData.current_mmr || 3000} MMR
              </Badge>
              {formData.nationality && (
                <Badge variant="outline">
                  {formData.nationality}
                </Badge>
              )}
              {formData.gender && (
                <Badge variant="outline">
                  {formData.gender}
                </Badge>
              )}
            </div>
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
                <Button onClick={onEdit} variant="outline" className="w-full">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
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
                <Button 
                  onClick={handleSendFriendRequest} 
                  disabled={sendingRequest}
                  className="w-full"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  {sendingRequest ? 'Sending...' : 'Add Friend'}
                </Button>
              )
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
