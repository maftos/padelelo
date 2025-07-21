import React, { useRef, useEffect, KeyboardEvent, ClipboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  value,
  onChange,
  disabled = false,
  className
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  // Focus management when value changes
  useEffect(() => {
    const nextEmptyIndex = value.length;
    if (nextEmptyIndex < length && inputRefs.current[nextEmptyIndex]) {
      inputRefs.current[nextEmptyIndex]?.focus();
    }
  }, [value, length]);

  const handleChange = (index: number, digit: string) => {
    // Only allow single digits
    if (digit.length > 1) digit = digit.slice(-1);
    if (!/^\d*$/.test(digit)) return;

    const newValue = value.split('');
    newValue[index] = digit;
    
    // Update the value
    const updatedValue = newValue.join('').slice(0, length);
    onChange(updatedValue);

    // Auto-focus next input
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      if (!value[index] && index > 0) {
        // If current field is empty, go to previous field
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current field
        const newValue = value.split('');
        newValue[index] = '';
        onChange(newValue.join(''));
      }
    }
    
    // Handle arrow keys
    else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '');
    const pastedDigits = pastedData.slice(0, length);
    onChange(pastedDigits);
    
    // Focus the next empty field or the last field
    const nextIndex = Math.min(pastedDigits.length, length - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleFocus = (index: number) => {
    // Select all text when focusing
    inputRefs.current[index]?.select();
  };

  return (
    <div className={cn("flex gap-2 justify-center", className)}>
      {Array.from({ length }, (_, index) => (
        <Input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          pattern="\d{1}"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={() => handleFocus(index)}
          disabled={disabled}
          className="w-12 h-12 text-center text-lg font-mono border-2 focus:border-primary"
          // Mobile autofill attributes
          autoComplete={index === 0 ? "one-time-code" : "off"}
          // Additional mobile-specific attributes for better autofill
          {...(index === 0 && {
            'data-testid': 'otp-input-0',
            'data-otp': 'true',
            'x-webkit-autofill': 'one-time-code',
            'data-sms-autofill': 'true'
          })}
        />
      ))}
    </div>
  );
};