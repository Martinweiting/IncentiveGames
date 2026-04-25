import { useEffect, useState } from 'react';
import styles from './Countdown.module.css';

function formatCountdown(targetTime: number) {
  const remaining = Math.max(targetTime - Date.now(), 0);
  const totalSeconds = Math.floor(remaining / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds].map((value) => String(value).padStart(2, '0')).join(':');
}

interface CountdownProps {
  targetTime: number;
}

export default function Countdown({ targetTime }: CountdownProps) {
  const [value, setValue] = useState(() => formatCountdown(targetTime));

  useEffect(() => {
    setValue(formatCountdown(targetTime));

    const timerId = window.setInterval(() => {
      setValue(formatCountdown(targetTime));
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [targetTime]);

  return (
    <div className={styles.countdown}>
      <span className={styles.label}>倒數結束</span>
      <span className={styles.value}>{value}</span>
    </div>
  );
}
