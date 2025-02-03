import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const PageContainer = ({ children, className }: PageContainerProps) => {
  return (
    <div className={cn("bg-background min-h-screen pt-[3.5rem]", className)}>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};