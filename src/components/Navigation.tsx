import { LogIn } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

export const Navigation = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex flex-1 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/placeholder.svg"
              alt="Logo"
              className="h-8 w-8"
            />
            <span className="font-bold">MatchPadel</span>
          </Link>

          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};