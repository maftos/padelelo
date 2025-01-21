import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { RecentMatches } from "@/components/RecentMatches";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";

interface Friend {
  friend_id: string;
  status: string;
  created_at: string;
  display_name: string;
}

const Friends = () => {
  const { toast } = useToast();

  const { data: friends, isLoading, error } = useQuery({
    queryKey: ['friends'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('view_my_friends', {
        user_id: "1cf886ac-aaf3-4dbd-98ce-0b1717fb19cf" // Hardcoded for now as requested
      });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load friends list",
          variant: "destructive",
        });
        throw error;
      }

      return data as Friend[];
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container py-8 px-4">
        <div className="space-y-6 animate-fade-in">
          <h1 className="text-2xl font-bold text-center">My Friends</h1>
          
          {isLoading ? (
            <div className="text-center">Loading friends...</div>
          ) : error ? (
            <div className="text-center text-destructive">
              An error occurred while loading your friends list
            </div>
          ) : !friends?.length ? (
            <div className="text-center text-muted-foreground">
              No friends found. Start adding some friends!
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {friends.map((friend) => (
                <Dialog key={friend.friend_id}>
                  <DialogTrigger asChild>
                    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback>{friend.display_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{friend.display_name}</p>
                          <p className="text-sm text-muted-foreground">
                            Friend since {new Date(friend.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{friend.display_name}'s Recent Matches</DialogTitle>
                    </DialogHeader>
                    <RecentMatches />
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Friends;