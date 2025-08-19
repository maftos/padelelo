import { FC, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StepTransitionProps {
  children: ReactNode;
  isActive: boolean;
  direction?: 'forward' | 'backward';
  className?: string;
}

export const StepTransition: FC<StepTransitionProps> = ({
  children,
  isActive,
  direction = 'forward',
  className
}) => {
  return (
    <div
      className={cn(
        "w-full h-full transition-all duration-300 ease-in-out",
        isActive ? "opacity-100 transform translate-x-0" : "opacity-0 transform",
        !isActive && direction === 'forward' && "translate-x-4",
        !isActive && direction === 'backward' && "-translate-x-4",
        className
      )}
    >
      {children}
    </div>
  );
};