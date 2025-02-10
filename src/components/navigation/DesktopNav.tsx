
import { Link } from "react-router-dom";
import { UserMenu } from "./UserMenu";
import { UserProfile } from "@/hooks/use-user-profile";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

interface DesktopNavProps {
  profile: UserProfile | null;
  onSignInClick: () => void;
}

export const DesktopNav = ({ profile, onSignInClick }: DesktopNavProps) => {
  return (
    <div className="hidden md:flex flex-1 items-center justify-between">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/14a55cb7-6df6-47ec-af26-fab66670c638.png" 
            alt="PadelELO Logo" 
            className="h-8 w-8" 
          />
          <span className="font-bold text-primary">PadelELO</span>
        </Link>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>About</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[400px] gap-3 p-4">
                  <Link 
                    to="/how-it-works"
                    className={cn(
                      "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    )}
                  >
                    <div className="text-sm font-medium leading-none">How it works</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Learn about our ELO rating system and match tracking
                    </p>
                  </Link>
                  <Link 
                    to="/matchmaking-math"
                    className={cn(
                      "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    )}
                  >
                    <div className="text-sm font-medium leading-none">Matchmaking Math</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Deep dive into our matchmaking algorithm
                    </p>
                  </Link>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/leaderboard" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                Leaderboard
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/roadmap" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                Roadmap
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="flex items-center gap-4">
        <UserMenu 
          profile={profile} 
          onSignInClick={onSignInClick} 
        />
      </div>
    </div>
  );
};
