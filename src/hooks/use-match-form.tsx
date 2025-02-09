
import { useState } from "react";
import { toast } from "sonner";
import { useUserProfile } from "@/hooks/use-user-profile";
import { usePlayerSelection } from "./match/use-player-selection";
import { useScoreHandling } from "./match/use-score-handling";
import { useMMRCalculation } from "./match/use-mmr-calculation";
import { useMatchSubmission } from "./match/use-match-submission";

export function useMatchForm() {
  const [page, setPage] = useState(1);
  const { userId } = useUserProfile();

  const {
    player1,
    setPlayer1,
    player2,
    setPlayer2,
    player3,
    setPlayer3,
    player4,
    setPlayer4,
    searchQuery,
    setSearchQuery,
    playerOptions,
    getPlayerName
  } = usePlayerSelection();

  const {
    scores,
    setScores,
    date,
    setDate
  } = useScoreHandling();

  const {
    matchId,
    mmrData,
    isCalculating,
    calculateMMR
  } = useMMRCalculation(userId);

  const {
    isSubmitting,
    submitMatch
  } = useMatchSubmission();

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

  const resetForm = () => {
    setPage(1);
    setPlayer1("");
    setPlayer2("");
    setPlayer3("");
    setPlayer4("");
    setScores([{ team1: "", team2: "" }]);
    setDate(new Date().toISOString().split("T")[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await submitMatch(userId, matchId, mmrData, scores);
    if (success) {
      resetForm();
    }
  };

  const handleCalculateMMR = async (team1Player2Id: string) => {
    const success = await calculateMMR(team1Player2Id, player1, player2, player3, player4, date);
    if (success) {
      setPage(3);
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
    calculateMMR: handleCalculateMMR,
    searchQuery,
    setSearchQuery,
    resetForm
  };
}
