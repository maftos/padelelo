
import { useParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { PageContainer } from "@/components/layouts/PageContainer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

// Sample data types
type BracketType = "SINGLE_ELIM" | "DOUBLE_ELIM";
type TournamentStatus = "DRAFT" | "PUBLISHED" | "COMPLETED";
type TournamentPrivacy = "PUBLIC" | "PRIVATE";
type ApprovalType = "AUTOMATIC" | "MANUAL";

interface TournamentFormData {
  name: string;
  bracket_type: BracketType;
  venue_id: string;
  status: TournamentStatus;
  privacy: TournamentPrivacy;
  description: string;
  recommended_mmr: number;
  main_photo: string;
  approval_type: ApprovalType;
  start_date: string;
  end_date: string;
  max_players: number;
}

// Sample tournament data
const sampleTournament: TournamentFormData = {
  name: "Sample Tournament 2024",
  bracket_type: "SINGLE_ELIM",
  venue_id: "venue-1",
  status: "DRAFT",
  privacy: "PUBLIC",
  description: "This is a sample tournament description.",
  recommended_mmr: 3000,
  main_photo: "https://example.com/photo.jpg",
  approval_type: "AUTOMATIC",
  start_date: "2024-03-20T14:00",
  end_date: "2024-03-20T18:00",
  max_players: 16
};

// Sample venues data
const sampleVenues = [
  { id: "venue-1", name: "Sports Complex A" },
  { id: "venue-2", name: "Tennis Club B" },
  { id: "venue-3", name: "Recreation Center C" },
];

export default function EditTournament() {
  const { tournamentId } = useParams();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This will be implemented later
    console.log("Form submitted");
  };

  return (
    <>
      <Navigation />
      <PageContainer>
        <div className="max-w-3xl mx-auto py-8 px-4">
          <h1 className="text-2xl font-bold mb-6">Edit Tournament</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Tournament Name</Label>
                    <Input
                      id="name"
                      defaultValue={sampleTournament.name}
                      placeholder="Enter tournament name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="venue">Venue</Label>
                    <Select defaultValue={sampleTournament.venue_id}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select venue" />
                      </SelectTrigger>
                      <SelectContent>
                        {sampleVenues.map((venue) => (
                          <SelectItem key={venue.id} value={venue.id}>
                            {venue.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bracketType">Bracket Type</Label>
                    <Select defaultValue={sampleTournament.bracket_type}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select bracket type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SINGLE_ELIM">Single Elimination</SelectItem>
                        <SelectItem value="DOUBLE_ELIM">Double Elimination</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select defaultValue={sampleTournament.status}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="PUBLISHED">Published</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="privacy">Privacy</Label>
                    <Select defaultValue={sampleTournament.privacy}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select privacy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PUBLIC">Public</SelectItem>
                        <SelectItem value="PRIVATE">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="approvalType">Approval Type</Label>
                    <Select defaultValue={sampleTournament.approval_type}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select approval type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AUTOMATIC">Automatic</SelectItem>
                        <SelectItem value="MANUAL">Manual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxPlayers">Maximum Players</Label>
                    <Input
                      id="maxPlayers"
                      type="number"
                      defaultValue={sampleTournament.max_players}
                      min={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recommendedMmr">Recommended MMR</Label>
                    <Input
                      id="recommendedMmr"
                      type="number"
                      defaultValue={sampleTournament.recommended_mmr}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date & Time</Label>
                    <Input
                      id="startDate"
                      type="datetime-local"
                      defaultValue={sampleTournament.start_date}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date & Time</Label>
                    <Input
                      id="endDate"
                      type="datetime-local"
                      defaultValue={sampleTournament.end_date}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="mainPhoto">Main Photo URL</Label>
                    <Input
                      id="mainPhoto"
                      defaultValue={sampleTournament.main_photo}
                      placeholder="Enter photo URL"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      defaultValue={sampleTournament.description}
                      placeholder="Enter tournament description"
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button variant="outline" type="button">
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </PageContainer>
    </>
  );
}
