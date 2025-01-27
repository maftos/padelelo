import { PlayerDisplay } from "./PlayerDisplay";

interface TeamDisplayProps {
  player1DisplayName?: string;
  player1ProfilePhoto?: string;
  player2DisplayName?: string;
  player2ProfilePhoto?: string;
  player1IsCompleter: boolean;
  player2IsCompleter: boolean;
  isRightAligned?: boolean;
}

export const TeamDisplay = ({
  player1DisplayName,
  player1ProfilePhoto,
  player2DisplayName,
  player2ProfilePhoto,
  player1IsCompleter,
  player2IsCompleter,
  isRightAligned = false
}: TeamDisplayProps) => {
  return (
    <div className="flex-1">
      <PlayerDisplay
        displayName={player1DisplayName}
        profilePhoto={player1ProfilePhoto}
        isMatchCompleter={player1IsCompleter}
        isRightAligned={isRightAligned}
      />
      <div className="mt-1">
        <PlayerDisplay
          displayName={player2DisplayName}
          profilePhoto={player2ProfilePhoto}
          isMatchCompleter={player2IsCompleter}
          isRightAligned={isRightAligned}
        />
      </div>
    </div>
  );
};