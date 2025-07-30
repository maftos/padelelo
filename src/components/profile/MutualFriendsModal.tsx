import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

interface MutualFriend {
  id: string;
  first_name: string;
  last_name: string;
  profile_photo: string | null;
  nationality: string | null;
  gender: string | null;
}

interface MutualFriendsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileUserId: string;
  currentUserId: string;
}

const MutualFriendsContent = ({ 
  profileUserId,
  currentUserId,
  onClose
}: {
  profileUserId: string;
  currentUserId: string;
  onClose: () => void;
}) => {
  const navigate = useNavigate();

  const { data: mutualFriendsData, isLoading } = useQuery({
    queryKey: ['mutualFriends', currentUserId, profileUserId],
    queryFn: async () => {
      console.log('Fetching mutual friends for:', { currentUserId, profileUserId });
      
      const { data, error } = await supabase.rpc('get_mutual_friends' as any, {
        user_a_id: currentUserId,
        user_b_id: profileUserId,
        limit_count: 50,
        offset_count: 0
      });

      if (error) {
        console.error('Error fetching mutual friends:', error);
        throw error;
      }

      console.log('Mutual friends data:', data);
      return data;
    },
    enabled: !!currentUserId && !!profileUserId
  });

  const handleProfileClick = (friendId: string) => {
    console.log('Navigate to profile:', friendId);
    navigate(`/profile/${friendId}`);
    onClose();
  };

  const mutualFriends = (mutualFriendsData as any)?.mutual_friends || [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading mutual friends...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {mutualFriends.length === 0 ? (
        <div className="text-center py-8">
          <User className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No mutual friends</p>
        </div>
      ) : (
        <div className="space-y-3">
          {mutualFriends.map((friend: MutualFriend) => (
            <div 
              key={friend.id} 
              className="border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:border-primary/50 hover:bg-muted/30"
              onClick={() => handleProfileClick(friend.id)}
            >
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={friend.profile_photo || undefined} />
                  <AvatarFallback>
                    {`${friend.first_name || 'U'}${friend.last_name || 'U'}`.split('').slice(0, 2).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">
                    {`${friend.first_name || ''} ${friend.last_name || ''}`.trim() || 'Unknown User'}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {friend.nationality && (
                      <span className="text-xs text-muted-foreground">
                        {friend.nationality}
                      </span>
                    )}
                    {friend.gender && (
                      <span className="text-xs text-muted-foreground">
                        • {friend.gender}
                      </span>
                    )}
                  </div>
                </div>
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const MutualFriendsModal = ({ 
  open, 
  onOpenChange, 
  profileUserId,
  currentUserId
}: MutualFriendsModalProps) => {
  const isMobile = useIsMobile();

  const handleClose = () => onOpenChange(false);

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="px-4 pb-6">
          <DrawerHeader className="text-center">
            <DrawerTitle>Mutual Friends</DrawerTitle>
            <DrawerDescription>
              Friends you both have in common
            </DrawerDescription>
          </DrawerHeader>

          <MutualFriendsContent
            profileUserId={profileUserId}
            currentUserId={currentUserId}
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
          <DialogTitle>Mutual Friends</DialogTitle>
        </DialogHeader>
        
        <MutualFriendsContent
          profileUserId={profileUserId}
          currentUserId={currentUserId}
          onClose={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
};