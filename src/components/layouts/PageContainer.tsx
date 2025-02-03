import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const PageContainer = ({ children, className }: PageContainerProps) => {
  return (
    <div className={cn("bg-background pt-14", className)}>
      <main className="container mx-auto px-4">
        {children}
      </main>
    </div>
  );
};