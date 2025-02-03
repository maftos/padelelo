import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarHeader as Header } from "@/components/ui/sidebar";
import { UserProfile } from "@/hooks/use-user-profile";

interface SidebarHeaderProps {
  profile: UserProfile;
}

export function SidebarHeader({ profile }: SidebarHeaderProps) {
  return (
    <Header className="border-b px-6 py-4">
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage src={profile.profile_photo || ''} alt={profile.display_name} />
          <AvatarFallback>{profile.display_name?.[0]?.toUpperCase() || '?'}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold">{profile.display_name}</h3>
          <p className="text-sm text-muted-foreground">MMR: {profile.current_mmr}</p>
        </div>
      </div>
    </Header>
  );
}