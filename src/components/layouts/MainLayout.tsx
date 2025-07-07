
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/use-user-profile";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { MobileHeader } from "@/components/navigation/MobileHeader";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { user } = useAuth();
  const { profile, isLoading } = useUserProfile();

  if (!user) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  // Don't show navigation until we know onboarding status
  if (isLoading) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  // Only show navigation if user has completed onboarding
  const showNavigation = profile?.is_onboarded === true;

  return (
    <div className="min-h-screen bg-background">
      {/* Only render navigation when onboarded */}
      {showNavigation && (
        <>
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
        </>
      )}
      
      {/* When not onboarded, show content without navigation */}
      {!showNavigation && (
        <div className="w-full">
          {children}
        </div>
      )}
    </div>
  );
};
