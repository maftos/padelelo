import { Button } from "@/components/ui/button";

interface NumberSelectorProps {
  onSelect: (number: number) => void;
  className?: string;
}

export const NumberSelector = ({ onSelect, className = "" }: NumberSelectorProps) => {
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className={`grid grid-cols-5 gap-2 p-4 bg-background border rounded-lg shadow-lg ${className}`}>
      {numbers.map((number) => (
        <Button
          key={number}
          variant="outline"
          size="sm"
          onClick={() => onSelect(number)}
          className="aspect-square flex items-center justify-center text-lg font-semibold hover:bg-primary hover:text-primary-foreground"
        >
          {number}
        </Button>
      ))}
    </div>
  );
};