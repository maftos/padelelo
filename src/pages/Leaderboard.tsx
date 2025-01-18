import { Navigation } from "@/components/Navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Sample data - will be replaced with real data later
const leaderboardData = [
  { id: 1, rank: 1, displayName: "John Doe", country: "MU", mmr: 2500 },
  { id: 2, rank: 2, displayName: "Jane Smith", country: "MU", mmr: 2450 },
  { id: 3, rank: 3, displayName: "Mike Johnson", country: "MU", mmr: 2400 },
];

const Leaderboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container py-8 px-4">
        <div className="space-y-4 animate-fade-in">
          <h1 className="text-2xl font-bold text-center mb-6">Mauritius Padel Leaderboard</h1>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Rank</TableHead>
                  <TableHead>Player</TableHead>
                  <TableHead className="w-[100px]">Country</TableHead>
                  <TableHead className="text-right">MMR</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboardData.map((player) => (
                  <TableRow key={player.id}>
                    <TableCell className="font-medium">{player.rank}</TableCell>
                    <TableCell>{player.displayName}</TableCell>
                    <TableCell>{player.country}</TableCell>
                    <TableCell className="text-right">{player.mmr}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;