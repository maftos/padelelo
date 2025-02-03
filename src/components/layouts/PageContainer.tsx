import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const PageContainer = ({ children, className }: PageContainerProps) => {
  return (
    <div className={cn("min-h-screen bg-background pt-16 md:pt-20 overflow-x-hidden relative", className)}>
      <main className="container mx-auto px-4 w-full max-w-full relative">
        {children}
      </main>
    </div>
  );
};