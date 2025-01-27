import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Crown } from "lucide-react";

interface PlayerDisplayProps {
  displayName?: string;
  profilePhoto?: string;
  isMatchCompleter: boolean;
  isRightAligned?: boolean;
}

export const PlayerDisplay = ({ 
  displayName, 
  profilePhoto, 
  isMatchCompleter,
  isRightAligned = false 
}: PlayerDisplayProps) => {
  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (isMatchCompleter) {
    console.log('Rendering crown for:', displayName);
  }

  return (
    <div className={`flex items-center ${isRightAligned ? 'justify-end' : ''} gap-1.5`}>
      {!isRightAligned && (
        <Avatar className="h-5 w-5">
          <AvatarImage src={profilePhoto} />
          <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
        </Avatar>
      )}
      <span className="text-xs truncate">{displayName}</span>
      {isMatchCompleter && (
        <Crown className="h-4 w-4 text-yellow-500" />
      )}
      {isRightAligned && (
        <Avatar className="h-5 w-5">
          <AvatarImage src={profilePhoto} />
          <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};