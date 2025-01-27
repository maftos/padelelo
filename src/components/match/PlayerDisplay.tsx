import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    console.log('Rendering completed by text for:', displayName);
  }

  return (
    <div className={`flex items-center ${isRightAligned ? 'justify-end' : ''} gap-1.5`}>
      {!isRightAligned && (
        <Avatar className="h-5 w-5">
          <AvatarImage src={profilePhoto} />
          <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
        </Avatar>
      )}
      <div className="flex flex-col">
        <span className="text-xs truncate">{displayName}</span>
        {isMatchCompleter && (
          <span className="text-[10px] text-muted-foreground">completed by</span>
        )}
      </div>
      {isRightAligned && (
        <Avatar className="h-5 w-5">
          <AvatarImage src={profilePhoto} />
          <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};