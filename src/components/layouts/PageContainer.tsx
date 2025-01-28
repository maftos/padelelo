import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const PageContainer = ({ children, className }: PageContainerProps) => {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      <main className="container max-w-lg mx-auto p-4 space-y-6">
        {children}
      </main>
    </div>
  );
};