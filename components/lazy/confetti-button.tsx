
'use client';

import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';

interface ConfettiButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export function ConfettiButton({ onClick, children, className }: ConfettiButtonProps) {
  const handleClick = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    onClick?.();
  };

  return (
    <Button onClick={handleClick} className={className}>
      {children}
    </Button>
  );
}

export default ConfettiButton; //
