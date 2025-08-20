import React, { useState } from "react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { PadelCourtsList } from "./PadelCourtsList";
import { PadelClub } from "@/pages/PadelCourts";

interface MobileCourtsDrawerProps {
  clubs: PadelClub[];
  selectedClubId?: string | null;
  onSelectClub?: (clubId: string) => void;
  showLocationPrompt?: boolean;
  onRequestLocation?: () => void;
  onRefreshLocation?: () => void;
  hasUserLocation?: boolean;
}

export const MobileCourtsDrawer: React.FC<MobileCourtsDrawerProps> = ({
  clubs,
  selectedClubId,
  onSelectClub,
  showLocationPrompt,
  onRequestLocation,
  onRefreshLocation,
  hasUserLocation,
}) => {
  const [snap, setSnap] = useState<number | string | null>(0.15);

  return (
    <Drawer
      open={true}
      snapPoints={[0.15, 0.85]}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
      dismissible={false}
    >
      <DrawerContent className="bg-background">
        {snap === 0.15 ? (
          // Minimized view
          <div className="px-4 py-3">
            <div className="flex items-center justify-center mb-2">
              <div className="w-12 h-1 bg-muted-foreground/50 rounded-full"></div>
            </div>
            <h2 className="text-lg font-semibold text-center">{clubs.length} padel clubs</h2>
            <p className="text-sm text-muted-foreground text-center">Swipe up to view clubs</p>
          </div>
        ) : (
          // Expanded view
          <div className="flex-1 overflow-hidden">
            <PadelCourtsList 
              clubs={clubs} 
              selectedClubId={selectedClubId} 
              onSelectClub={onSelectClub} 
              showLocationPrompt={showLocationPrompt} 
              onRequestLocation={onRequestLocation}
              onRefreshLocation={onRefreshLocation}
              hasUserLocation={hasUserLocation}
              subtitle="Swipe down to close list"
            />
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
};