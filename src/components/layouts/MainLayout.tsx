
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/use-user-profile";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { MobileHeader } from "@/components/navigation/MobileHeader";
import { Navigation } from "@/components/Navigation";
import { useIsMobile } from "@/hooks/use-mobile";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { user } = useAuth();
  const { profile, isLoading } = useUserProfile();
  const isMobile = useIsMobile();

  // Don't show navigation until we know onboarding status for authenticated users
  if (user && isLoading) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  const isAuthenticated = !!user;
  const isOnboarded = profile?.is_onboarded === true;
  
  // Navigation logic based on requirements:
  // Desktop + Not logged in: Show Navigation component
  // Desktop + Logged in: Show AppSidebar only
  // Mobile + Not logged in: Show Navigation component  
  // Mobile + Logged in: Show MobileHeader only
  
  const showNavigation = !isAuthenticated;
  const showDesktopSidebar = !isMobile && isAuthenticated && isOnboarded;
  const showMobileHeader = isMobile && isAuthenticated && isOnboarded;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation for non-authenticated users (both mobile and desktop) */}
      {showNavigation && <Navigation />}
      
      {/* Authenticated user navigation */}
      {isAuthenticated && isOnboarded && (
        <>
          {/* Mobile Header for authenticated users */}
          {showMobileHeader && (
            <div className="md:hidden">
              <MobileHeader />
            </div>
          )}
          
          {/* Desktop layout with sidebar for authenticated users */}
          {showDesktopSidebar && (
            <div className="hidden md:flex">
              <AppSidebar />
              <main className="flex-1">
                <div className="w-full px-4 py-6">
                  {children}
                </div>
              </main>
            </div>
          )}
          
          {/* Mobile layout for authenticated users */}
          {showMobileHeader && (
            <div className="md:hidden">
              <main className="w-full">
                <div className="px-4 py-6">
                  {children}
                </div>
              </main>
            </div>
          )}
        </>
      )}
      
      {/* Content without navigation (non-authenticated or not onboarded) */}
      {(!isAuthenticated || !isOnboarded) && (
        <div className="w-full">
          {children}
        </div>
      )}
    </div>
  );
};
