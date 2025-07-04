
import { ReactNode } from "react";
import { Sidebar } from "@/components/navigation/Sidebar";
import { useAuth } from "@/contexts/AuthContext";

interface FacebookLayoutProps {
  children: ReactNode;
}

export const FacebookLayout = ({ children }: FacebookLayoutProps) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Left Sidebar - Fixed width, scrollable */}
        <div className="hidden lg:flex lg:flex-shrink-0">
          <div className="flex flex-col w-80">
            <div className="flex flex-col flex-1 min-h-0 border-r border-border bg-card">
              <Sidebar />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>

        {/* Right Sidebar - Future use (hidden for now) */}
        <div className="hidden xl:flex xl:flex-shrink-0">
          <div className="flex flex-col w-80">
            <div className="flex flex-col flex-1 min-h-0 border-l border-border bg-card">
              {/* Future: Suggested friends, ads, etc. */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
