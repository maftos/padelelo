import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const PageContainer = ({ children, className }: PageContainerProps) => {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      <main className="container mx-auto px-4 py-4 space-y-4">
        {children}
      </main>
    </div>
  );
};