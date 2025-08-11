import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MapPin, Star, Users, CreditCard } from "lucide-react";
import { PadelClub } from "@/pages/PadelCourts";

interface PadelCourtsListProps {
  clubs: PadelClub[];
  selectedClubId?: string | null;
  onSelectClub?: (clubId: string) => void;
}

export const PadelCourtsList: React.FC<PadelCourtsListProps> = ({ clubs, selectedClubId, onSelectClub }) => {
  return (
    <div className="flex h-full flex-col">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="px-4 py-3">
          <h2 className="text-lg font-semibold">{clubs.length} padel clubs</h2>
          <p className="text-sm text-muted-foreground">Explore venues across Mauritius</p>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-4 py-4 space-y-3">
        {clubs.map((club) => {
          const isActive = selectedClubId === club.id;
          return (
            <div key={club.id}>
              <Link to={`/padel-courts/${club.id}`} onMouseEnter={() => onSelectClub?.(club.id)} onClick={() => onSelectClub?.(club.id)}>
                <Card className={`overflow-hidden transition-shadow ${isActive ? "ring-2 ring-primary" : "hover:shadow-md"}`}>
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={club.image}
                      alt={`${club.name} padel club in ${club.region}`}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between text-base">
                      <span className="truncate" title={club.name}>{club.name}</span>
                      <div className="flex items-center gap-1 shrink-0">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{club.rating}</span>
                      </div>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {club.region}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs md:text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                        <Users className="h-4 w-4" />
                        {club.numberOfCourts} court{club.numberOfCourts !== 1 ? "s" : ""}
                      </div>
                      <div className="flex items-center gap-1 text-xs md:text-sm text-muted-foreground">
                        <CreditCard className="h-4 w-4" />
                        {club.estimatedFeePerPerson}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};
