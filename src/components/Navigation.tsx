import { useState } from "react";
import { LogIn, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { AuthModal } from "./AuthModal";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const Navigation = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  // Mock authenticated state - this will be replaced with real auth later
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex flex-1 items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/placeholder.svg" alt="Logo" className="h-8 w-8" />
              <span className="font-bold">MatchPadel</span>
            </Link>

            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <Link to="/profile">
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>MP</AvatarFallback>
                  </Avatar>
                </Link>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              )}
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-4 mt-4">
                    <Link to="/" className="flex items-center gap-2 text-lg">
                      Home
                    </Link>
                    <Link to="/leaderboard" className="flex items-center gap-2 text-lg">
                      Leaderboard
                    </Link>
                    <Link to="/friends" className="flex items-center gap-2 text-lg">
                      Friends
                    </Link>
                    <Link to="/register-match" className="flex items-center gap-2 text-lg">
                      Register a Match
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          // Mock successful authentication
          setIsAuthenticated(true);
        }}
      />
    </>
  );
};