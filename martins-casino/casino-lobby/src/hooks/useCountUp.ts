import { useEffect, useRef, useState } from 'react';

interface CountUpOptions {
  end: number;
  duration?: number;
  delay?: number;
  trigger?: boolean;
}

export function useCountUp({
  end,
  duration = 1800,
  delay = 0,
  trigger = true,
}: CountUpOptions): number {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!trigger) return undefined;

    let startTime = 0;
    let timeoutId: number | null = null;

    const animate = (timestamp: number) => {
      if (startTime === 0) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setValue(Math.round(end * eased));

      if (progress < 1) {
        rafRef.current = window.requestAnimationFrame(animate);
      }
    };

    timeoutId = window.setTimeout(() => {
      rafRef.current = window.requestAnimationFrame(animate);
    }, delay);

    return () => {
      if (timeoutId !== null) window.clearTimeout(timeoutId);
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
    };
  }, [delay, duration, end, trigger]);

  return value;
}
