import React from "react";

import { Card } from "@/components/ui/card";
import { Star, Users, CreditCard, MapPin } from "lucide-react";
import { PadelClub } from "@/pages/PadelCourts";

interface PadelCourtsListProps {
  clubs: PadelClub[];
  selectedClubId?: string | null;
  onSelectClub?: (clubId: string) => void;
  showLocationPrompt?: boolean;
  onRequestLocation?: () => void;
}

export const PadelCourtsList: React.FC<PadelCourtsListProps> = ({ clubs, selectedClubId, onSelectClub, showLocationPrompt, onRequestLocation }) => {
  return (
    <div className="flex h-full flex-col">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="px-4 py-3">
          <h2 className="text-lg font-semibold">{clubs.length} padel clubs</h2>
          <p className="text-sm text-muted-foreground">Explore venues across Mauritius</p>
          {showLocationPrompt && (
            <div className="mt-2">
              <button
                type="button"
                onClick={onRequestLocation}
                className="inline-flex items-center rounded-md border border-border bg-primary text-primary-foreground px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-primary/90"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Use my location
              </button>
            </div>
          )}
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
                aria-pressed={isActive}
                aria-label={`View ${club.name} on map`}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectClub?.(club.id);
                  }
                }}
                className={`overflow-hidden transition-shadow cursor-pointer ${isActive ? "ring-2 ring-primary" : "hover:shadow-md"}`}
              >
                <div className="flex">
                  <div className="relative h-20 w-[7.5rem] md:h-24 md:w-[9rem] overflow-hidden shrink-0">
                    <img
                      src={club.image}
                      alt={`${club.name} padel club in ${club.region}`}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute top-1.5 right-1.5 rounded-full border border-border bg-background/80 text-foreground backdrop-blur px-1.5 py-0.5 flex items-center gap-1 shadow-sm">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                      <span className="text-[10px] font-medium leading-none">{club.rating}</span>
                      <span className="sr-only">Rating</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 p-3">
                    <div>
                      <span className="text-sm font-medium" title={club.name}>{club.name}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 text-[10px] md:text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          <Users className="h-3.5 w-3.5" />
                          {club.numberOfCourts} court{club.numberOfCourts !== 1 ? "s" : ""}
                        </div>
                        {typeof club.distanceKm === 'number' && (
                          <div className="flex items-center gap-1.5 text-[10px] md:text-xs bg-accent/10 text-accent-foreground px-2 py-0.5 rounded-full">
                            <MapPin className="h-3.5 w-3.5" />
                            {club.distanceKm.toFixed(1)} km
                          </div>
                        )}
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
