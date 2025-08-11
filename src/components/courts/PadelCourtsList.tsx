import React from "react";

import { Card } from "@/components/ui/card";
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

      <div className="flex-1 overflow-auto overscroll-contain px-3 py-3 space-y-2">
        {clubs.map((club) => {
          const isActive = selectedClubId === club.id;
          return (
            <div key={club.id}>
              <Card
                onClick={() => onSelectClub?.(club.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectClub?.(club.id);
                  }
                }}
                className={`overflow-hidden transition-shadow cursor-pointer ${isActive ? "ring-2 ring-primary" : "hover:shadow-md"}`}
              >
                <div className="flex gap-3 p-3">
                  <div className="h-16 w-24 rounded-md overflow-hidden shrink-0">
                    <img
                      src={club.image}
                      alt={`${club.name} padel club in ${club.region}`}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <span className="truncate text-sm font-medium" title={club.name}>{club.name}</span>
                      <div className="ml-2 flex items-center gap-1 shrink-0">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium">{club.rating}</span>
                      </div>
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      <span className="truncate">{club.region}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[10px] md:text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        <Users className="h-3.5 w-3.5" />
                        {club.numberOfCourts} court{club.numberOfCourts !== 1 ? "s" : ""}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <CreditCard className="h-4 w-4" />
                        {club.estimatedFeePerPerson}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
};
