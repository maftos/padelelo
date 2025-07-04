
import { useAuth } from "@/contexts/AuthContext";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { MobileHeader } from "@/components/navigation/MobileHeader";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { user } = useAuth();

  if (!user) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <MobileHeader />
      
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <AppSidebar />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="w-full px-4 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
