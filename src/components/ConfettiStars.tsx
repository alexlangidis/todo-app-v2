"use client";

import React from "react";
import confetti from "canvas-confetti";

interface ConfettiStarsProps {
  onComplete?: () => void;
}

interface ConfettiOptions {
  particleCount: number;
  angle: number;
  spread: number;
  origin: { x: number; y: number };
  colors: string[];
  shapes: ("star" | "circle")[];
  scalar: number;
  gravity: number;
  decay: number;
  startVelocity: number;
  ticks: number;
}

const useConfettiStars = (onComplete?: () => void) => {
  const triggerConfetti = React.useCallback(
    (origin: { x: number; y: number }) => {
      const colors = ["#FFE400", "#FFBD00", "#E89400", "#FFCA6C", "#FDFFB8"];

      const baseOptions: Partial<ConfettiOptions> = {
        spread: 360,
        origin,
        colors,
        gravity: 0,
        decay: 0.94,
        startVelocity: 30,
        ticks: 50,
      };

      // First burst: 40 star-shaped particles
      const starBurst = (): void => {
        confetti({
          ...baseOptions,
          particleCount: 40,
          shapes: ["star"],
          scalar: 1.2,
        } as confetti.Options);
      };

      // Second burst: 10 circular particles
      const circleBurst = (): void => {
        confetti({
          ...baseOptions,
          particleCount: 10,
          shapes: ["circle"],
          scalar: 0.75,
        } as confetti.Options);
      };

      // Trigger bursts in sequence with 100ms delays
      starBurst();

      setTimeout(() => {
        circleBurst();
      }, 100);

      setTimeout(() => {
        starBurst();
      }, 200);

      setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
      }, 300);
    },
    [onComplete]
  );

  return { triggerConfetti };
};

const ConfettiStars: React.FC<ConfettiStarsProps> = ({ onComplete }) => {
  const { triggerConfetti } = useConfettiStars(onComplete);

  // This component doesn't render anything visible
  React.useEffect(() => {
    // Component is ready to trigger confetti when needed
  }, []);

  return null;
};

export default ConfettiStars;
export { useConfettiStars };
export type { ConfettiStarsProps };
