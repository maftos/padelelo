import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarFooter as Footer } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";

interface SidebarFooterProps {
  onSignOut: () => void;
}

export function SidebarFooter({ onSignOut }: SidebarFooterProps) {
  const navigate = useNavigate();

  const handleSignOut = () => {
    onSignOut();
    navigate('/login');
  };

  return (
    <Footer className="border-t p-4">
      <Button 
        variant="ghost" 
        className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
        onClick={handleSignOut}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Sign Out
      </Button>
    </Footer>
  );
}