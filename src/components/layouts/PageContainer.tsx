import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const PageContainer = ({ children, className }: PageContainerProps) => {
  const { open } = useSidebar();

  return (
    <div className={cn(
      "bg-background", 
      // Only apply backdrop blur on desktop when sidebar is open
      { "md:bg-background/95 md:backdrop-blur": open },
      className
    )}>
      <main className="container mx-auto px-4">
        {children}
      </main>
    </div>
  );
};