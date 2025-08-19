import React, { useRef, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ScoreSequenceInputProps {
  onScoresChange: (team1Score: string, team2Score: string) => void;
  onComplete?: (team1Score?: string, team2Score?: string) => void;
  disabled?: boolean;
  isActive?: boolean;
  className?: string;
}

export const ScoreSequenceInput: React.FC<ScoreSequenceInputProps> = ({
  onScoresChange,
  onComplete,
  disabled = false,
  isActive = false,
  className
}) => {
  const [values, setValues] = useState<string[]>(["", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize refs
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 2);
  }, []);

  // Focus first input on mount
  useEffect(() => {
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
  }, []);

  // Reset values and focus first input when this matchup becomes active
  useEffect(() => {
    if (isActive) {
      setValues(["", ""]);
      // Use longer timeout and prevent blur to maintain keyboard on mobile
      setTimeout(() => {
        const firstInput = inputRefs.current[0];
        if (firstInput) {
          firstInput.focus();
          // Trigger click to ensure mobile keyboard stays open
          firstInput.click();
        }
      }, 150);
    }
  }, [isActive]);

  const handleChange = (index: number, value: string) => {
    // Only allow single digits 0-9
    if (value.length > 1 || (value !== "" && !/^[0-9]$/.test(value))) {
      return;
    }

    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);

    console.log("Score input:", { index, value, newValues, isActive });

    // Update parent component
    onScoresChange(newValues[0], newValues[1]);

    // Auto-advance to next input or complete
    if (value !== "") {
      if (index === 0) {
        // Move to second input immediately to maintain keyboard
        setTimeout(() => {
          const secondInput = inputRefs.current[1];
          if (secondInput) {
            secondInput.focus();
            secondInput.click(); // Ensure keyboard stays open on mobile
          }
        }, 50);
      } else if (index === 1 && newValues[0] !== "") {
        // Both scores entered, auto-complete immediately with current values
        console.log("Auto-completing with scores:", newValues);
        onComplete?.(newValues[0], newValues[1]);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && values[index] === "" && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const digits = pastedData.replace(/\D/g, "").slice(0, 2);
    
    if (digits.length >= 2) {
      const newValues = [digits[0], digits[1]];
      setValues(newValues);
      onScoresChange(newValues[0], newValues[1]);
      
      // Focus second input and complete if both filled
      inputRefs.current[1]?.focus();
      onComplete?.(newValues[0], newValues[1]);
    }
  };

  const handleFocus = (index: number) => {
    inputRefs.current[index]?.select();
  };

  return (
    <div className={cn("flex items-center justify-between", className)}>
      {/* Team 1 score */}
      <div className="flex-1 flex justify-center">
        <Input
          ref={(el) => (inputRefs.current[0] = el)}
          type="number"
          inputMode="numeric"
          pattern="[0-9]*"
          value={values[0]}
          onChange={(e) => handleChange(0, e.target.value)}
          onKeyDown={(e) => handleKeyDown(0, e)}
          onPaste={handlePaste}
          onFocus={() => handleFocus(0)}
          onBlur={(e) => {
            // Prevent blur if we're moving to the next input
            if (values[0] !== "" && !values[1]) {
              e.preventDefault();
              setTimeout(() => inputRefs.current[1]?.focus(), 50);
            }
          }}
          placeholder="0"
          className="w-12 text-center text-xl font-bold h-12"
          min="0"
          max="9"
          maxLength={1}
          disabled={disabled}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
      </div>
      
      {/* Spacer for VS alignment */}
      <div className="px-4"></div>
      
      {/* Team 2 score */}
      <div className="flex-1 flex justify-center">
        <Input
          ref={(el) => (inputRefs.current[1] = el)}
          type="number"
          inputMode="numeric"
          pattern="[0-9]*"
          value={values[1]}
          onChange={(e) => handleChange(1, e.target.value)}
          onKeyDown={(e) => handleKeyDown(1, e)}
          onPaste={handlePaste}
          onFocus={() => handleFocus(1)}
          onBlur={(e) => {
            // Only allow blur if both values are complete or we're moving backwards
            if (values[0] && values[1]) {
              // Both complete, allow blur
              return;
            }
            if (!values[0]) {
              // Move back to first input
              e.preventDefault();
              setTimeout(() => inputRefs.current[0]?.focus(), 50);
            }
          }}
          placeholder="0"
          className="w-12 text-center text-xl font-bold h-12"
          min="0"
          max="9"
          maxLength={1}
          disabled={disabled}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
      </div>
    </div>
  );
};