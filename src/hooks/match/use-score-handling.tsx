
import { useState } from "react";

export interface Score {
  team1: string;
  team2: string;
}

export function useScoreHandling() {
  const [scores, setScores] = useState<Score[]>([{ team1: "", team2: "" }]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  return {
    scores,
    setScores,
    date,
    setDate
  };
}
