import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useAuth } from "@/contexts/AuthContext";
import { UserMenu } from "./navigation/UserMenu";
import { AppSidebar } from "./navigation/AppSidebar";
import { SidebarProvider } from "./ui/sidebar";

export const Navigation = () => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const { profile } = useUserProfile();
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex flex-1 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/6c2aa848-d126-4ee6-9af5-78a13698d72c.png" 
              alt="PadelELO Logo" 
              className="h-8 w-8" 
            />
            <span className="font-bold text-primary">PadelELO</span>
          </Link>

          <div className="flex items-center gap-4">
            <UserMenu 
              profile={profile} 
              onSignInClick={() => navigate('/login')} 
            />
            
            <Sheet open={isSideMenuOpen} onOpenChange={setIsSideMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="p-0" side="right">
                <SidebarProvider defaultOpen={true}>
                  <AppSidebar />
                </SidebarProvider>
              </SheetContent>
            </Sheet>

            <Button 
              variant="ghost" 
              size="icon" 
              className="hidden md:inline-flex"
              onClick={() => setIsSideMenuOpen(!isSideMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};