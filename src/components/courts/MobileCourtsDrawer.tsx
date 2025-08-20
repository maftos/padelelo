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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Always-visible minimized bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
        <div className="bg-background/95 backdrop-blur-sm border-t rounded-t-xl shadow-lg pointer-events-auto">
          <div 
            className="px-4 py-3 cursor-pointer"
            onClick={() => setIsOpen(true)}
          >
            <div className="flex items-center justify-center mb-2">
              <div className="w-12 h-1 bg-muted-foreground/50 rounded-full"></div>
            </div>
            <h2 className="text-lg font-semibold text-center">{clubs.length} padel clubs</h2>
            <p className="text-sm text-muted-foreground text-center">Swipe up to view clubs</p>
          </div>
        </div>
      </div>

      {/* Drawer overlay */}
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent className="h-[85vh] bg-background">
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
        </DrawerContent>
      </Drawer>
    </>
  );
};