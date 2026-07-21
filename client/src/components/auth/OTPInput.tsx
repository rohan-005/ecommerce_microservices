import React, { useRef, useState, useEffect } from 'react';

interface OTPInputProps {
  length?: number;
  onChange: (otp: string) => void;
}

export const OTPInput: React.FC<OTPInputProps> = ({ length = 6, onChange }) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const inputsRef = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    // Focus the first input on load
    if (inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, []);

  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = element.value.replace(/[^0-9]/g, ''); // only allow numbers
    if (!value) return;

    const newOtp = [...otp];
    // Take only the last character if user types fast
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    onChange(newOtp.join(''));

    // Move focus to next input
    if (value && index < length - 1 && inputsRef.current[index + 1]) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      if (!otp[index]) {
        // If current is empty, move focus to previous and clear it
        if (index > 0 && inputsRef.current[index - 1]) {
          inputsRef.current[index - 1].focus();
          newOtp[index - 1] = '';
        }
      } else {
        // Just clear current
        newOtp[index] = '';
      }
      setOtp(newOtp);
      onChange(newOtp.join(''));
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim().replace(/[^0-9]/g, '');
    if (pastedData.length === 0) return;

    const newOtp = [...otp];
    const takeLength = Math.min(pastedData.length, length);

    for (let i = 0; i < takeLength; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    onChange(newOtp.join(''));

    // Focus the next empty input or last input
    const focusIndex = takeLength < length ? takeLength : length - 1;
    if (inputsRef.current[focusIndex]) {
      inputsRef.current[focusIndex].focus();
    }
  };

  return (
    <div className="flex justify-center space-x-2 md:space-x-3" onPaste={handlePaste}>
      {otp.map((digit, index) => (
        <input
          key={index}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          ref={(el) => {
            if (el) inputsRef.current[index] = el;
          }}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="w-12 h-12 md:w-14 md:h-14 text-center text-lg md:text-xl font-bold border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-slate-900 transition-all"
        />
      ))}
    </div>
  );
};

export default OTPInput;
