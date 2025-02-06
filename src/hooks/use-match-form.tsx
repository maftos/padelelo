import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useQuery } from "@tanstack/react-query";

const STORAGE_KEY = "last_match_players";

interface PlayerOption {
  id: string;
  name: string;
  profile_photo?: string;
}

export function useMatchForm() {
  const [page, setPage] = useState(1);
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [player3, setPlayer3] = useState("");
  const [player4, setPlayer4] = useState("");
  const [scores, setScores] = useState([{ team1: "", team2: "" }]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [matchId, setMatchId] = useState<string | null>(null);
  const [mmrData, setMmrData] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { userId } = useUserProfile();

  // Load last selected players from localStorage
  useEffect(() => {
    const savedPlayers = localStorage.getItem(STORAGE_KEY);
    if (savedPlayers) {
      const { player1, player2, player3, player4 } = JSON.parse(savedPlayers);
      setPlayer1(player1 || "");
      setPlayer2(player2 || "");
      setPlayer3(player3 || "");
      setPlayer4(player4 || "");
    }
  }, []);

  // Save selected players to localStorage whenever they change
  useEffect(() => {
    if (player1 || player2 || player3 || player4) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ player1, player2, player3, player4 })
      );
    }
  }, [player1, player2, player3, player4]);

  const { data: friends = [], isLoading: isLoadingFriends } = useQuery({
    queryKey: ['friends', userId],
    queryFn: async () => {
      if (!userId) return [];
      try {
        const { data, error } = await supabase.rpc('view_my_friends', {
          i_user_id: userId
        });
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error fetching friends:', error);
        throw error;
      }
    },
    enabled: !!userId,
  });

  // Filter player options based on search query
  const playerOptions: PlayerOption[] = [
    { id: userId || "current-user", name: "Me" },
    ...friends
      .filter(friend => 
        friend.display_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map(friend => ({
        id: friend.friend_id,
        name: friend.display_name,
        profile_photo: friend.profile_photo
      }))
  ];

  const getPlayerName = (playerId: string) => {
    if (playerId === userId) return "Me";
    const friend = friends.find(f => f.friend_id === playerId);
    return friend ? friend.display_name : "Unknown";
  };

  const handleNext = async () => {
    if (!userId) {
      toast.error("You must be logged in to create a match");
      return;
    }

    if (!player1 || !player2 || !player3 || !player4) {
      toast.error("Please fill in all player fields");
      return;
    }

    const players = new Set([player1, player2, player3, player4]);
    if (players.size !== 4) {
      toast.error("All players must be different");
      return;
    }

    setPage(2);
  };

  const calculateMMR = async (team1Player2Id: string) => {
    try {
      setIsCalculating(true);
      
      // Create the match first with the selected partner as team1_player2
      const { data: matchData, error: matchError } = await supabase.rpc('create_match', {
        user_a_id: userId,
        team1_player1_id: player1,
        team1_player2_id: team1Player2Id,  // This is the selected partner
        team2_player1_id: [player2, player3, player4].find(p => p !== team1Player2Id && p !== player1),
        team2_player2_id: [player2, player3, player4].find(p => p !== team1Player2Id && p !== player1 && p !== [player2, player3, player4].find(p => p !== team1Player2Id && p !== player1)),
        match_date: new Date(date).toISOString()
      });

      if (matchError) {
        console.error('Match creation error:', matchError);
        throw matchError;
      }

      if (!matchData) {
        throw new Error('No match ID returned from create_match');
      }

      setMatchId(matchData);

      const { data: mmrCalcData, error: mmrError } = await supabase.rpc('calculate_mmr_change', {
        match_id: matchData
      });

      if (mmrError) {
        console.error('MMR calculation error:', mmrError);
        throw mmrError;
      }

      if (!mmrCalcData || mmrCalcData.length === 0) {
        throw new Error('No MMR data returned from calculate_mmr_change');
      }

      setMmrData({...mmrCalcData[0], selectedPartnerId: team1Player2Id});
      setPage(3);
    } catch (error) {
      console.error('Error preparing match:', error);
      toast.error("Failed to prepare match. Please try again.");
    } finally {
      setIsCalculating(false);
    }
  };

  const resetForm = () => {
    setPage(1);
    setMatchId(null);
    setMmrData(null);
    setScores([{ team1: "", team2: "" }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      toast.error("You must be logged in to complete a match");
      return;
    }

    if (!matchId || !mmrData) {
      toast.error("Match data not ready. Please try again.");
      return;
    }

    const hasEmptyScores = scores.some(score => !score.team1 || !score.team2);
    if (hasEmptyScores) {
      toast.error("Please fill in all score fields");
      return;
    }

    if (scores[0].team1 === scores[0].team2) {
      toast.error("Scores cannot be equal - there must be a winner!");
      return;
    }

    try {
      setIsSubmitting(true);
      const { error: completeError } = await supabase.rpc('complete_match', {
        i_match_id: matchId,
        new_team1_score: parseInt(scores[0].team1),
        new_team2_score: parseInt(scores[0].team2),
        team1_win_mmr_change_amount: mmrData.team1_win_mmr_change_amount,
        team2_win_mmr_change_amount: mmrData.team2_win_mmr_change_amount,
        user_a_id: userId
      });

      if (completeError) throw completeError;

      toast.success("Match registered successfully!");
      
      // Reset form
      setPage(1);
      setPlayer1("");
      setPlayer2("");
      setPlayer3("");
      setPlayer4("");
      setScores([{ team1: "", team2: "" }]);
      setDate(new Date().toISOString().split("T")[0]);
      setMatchId(null);
      setMmrData(null);
    } catch (error) {
      console.error('Error completing match:', error);
      toast.error("Failed to register match. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    page,
    setPage,
    player1,
    setPlayer1,
    player2,
    setPlayer2,
    player3,
    setPlayer3,
    player4,
    setPlayer4,
    scores,
    setScores,
    date,
    setDate,
    matchId,
    mmrData,
    isCalculating,
    isSubmitting,
    playerOptions,
    getPlayerName,
    handleNext,
    handleSubmit,
    calculateMMR,
    searchQuery,
    setSearchQuery,
    resetForm
  };
}