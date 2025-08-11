import React from "react";

import { Card } from "@/components/ui/card";
import { Star, Users, CreditCard, Route } from "lucide-react";
import { PadelClub } from "@/pages/PadelCourts";

interface PadelCourtsListProps {
  clubs: PadelClub[];
  selectedClubId?: string | null;
  onSelectClub?: (clubId: string) => void;
  userLocation?: [number, number] | null;
  sortBy?: 'nearest' | 'popular' | 'newest';
  onSortChange?: (sort: 'nearest' | 'popular' | 'newest') => void;
}

export const PadelCourtsList: React.FC<PadelCourtsListProps> = ({ clubs, selectedClubId, onSelectClub, userLocation, sortBy = 'popular', onSortChange }) => {
  return (
    <div className="flex h-full flex-col">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">{clubs.length} padel clubs</h2>
            <p className="text-sm text-muted-foreground">Explore venues across Mauritius</p>
          </div>
          <div className="inline-flex items-center rounded-full border bg-card text-card-foreground p-1">
            {(['nearest','popular','newest'] as const).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onSortChange?.(opt)}
                disabled={opt === 'nearest' && !userLocation}
                className={`px-3 py-1.5 text-xs rounded-full transition-colors ${sortBy === opt ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'} ${opt === 'nearest' && !userLocation ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-pressed={sortBy === opt}
              >
                {opt === 'nearest' ? 'Nearest' : opt === 'popular' ? 'Most Popular' : 'Newest'}
              </button>
            ))}
          </div>
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
                aria-current={isActive ? 'true' : undefined}
              >
                <div className="flex">
                  <div className="relative h-20 w-[7.5rem] md:h-24 md:w-[9rem] overflow-hidden shrink-0">
                    <img
                      src={club.image}
                      alt={`${club.name} padel club in ${club.region}`}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                    {club.comingSoon && (
                      <div className="absolute top-1.5 left-1.5 rounded-full border border-border bg-background/80 text-foreground backdrop-blur px-1.5 py-0.5 text-[10px] font-medium shadow-sm">
                        Coming Soon
                      </div>
                    )}
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
                      <div className="flex items-center gap-1.5 text-[10px] md:text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        <Users className="h-3.5 w-3.5" />
                        {club.numberOfCourts} court{club.numberOfCourts !== 1 ? "s" : ""}
                      </div>
                      <div className="flex items-center gap-2">
                        {userLocation && (
                          <div className="flex items-center gap-1 text-[10px] md:text-xs text-muted-foreground">
                            <Route className="h-4 w-4" />
                            {(() => {
                              const toRad = (v: number) => (v * Math.PI) / 180;
                              const [lon1, lat1] = userLocation;
                              const [lon2, lat2] = club.coordinates;
                              const R = 6371;
                              const dLat = toRad(lat2 - lat1);
                              const dLon = toRad(lon2 - lon1);
                              const s1 = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
                              const c = 2 * Math.atan2(Math.sqrt(s1), Math.sqrt(1 - s1));
                              const km = R * c;
                              return <span>{km.toFixed(1)} km</span>;
                            })()}
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <CreditCard className="h-4 w-4" />
                          {club.estimatedFeePerPerson}
                        </div>
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
