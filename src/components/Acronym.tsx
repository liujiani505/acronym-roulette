import { useEffect, useState } from 'react';

const POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const FRAME_MS = 55;
const SETTLE_BASE = 260;
const SETTLE_STEP = 150;

export type Mood = 'idle' | 'correct' | 'wrong';

interface Props {
  letters: string;
  /** Changes whenever a new card arrives, which restarts the spin. */
  spinKey: string;
  mood: Mood;
  reducedMotion: boolean;
}

/**
 * The giant acronym. Each letter spins like a roulette reel and lands one
 * after another; on reveal the letters hop (right) or wobble (wrong).
 */
export function Acronym({ letters, spinKey, mood, reducedMotion }: Props) {
  const target = letters.split('');
  const [shown, setShown] = useState<string[]>(target);
  const [settled, setSettled] = useState<boolean[]>(target.map(() => true));

  useEffect(() => {
    const goal = letters.split('');
    if (reducedMotion) {
      setShown(goal);
      setSettled(goal.map(() => true));
      return;
    }
    const start = performance.now();
    const settleAt = goal.map((_, i) => SETTLE_BASE + i * SETTLE_STEP);
    const tick = () => {
      const t = performance.now() - start;
      const done = settleAt.map((s) => t >= s);
      setShown(goal.map((ch, i) => (done[i] ? ch : POOL[Math.floor(Math.random() * POOL.length)])));
      setSettled(done);
      if (done.every(Boolean)) window.clearInterval(id);
    };
    const id = window.setInterval(tick, FRAME_MS);
    tick();
    return () => window.clearInterval(id);
  }, [spinKey, letters, reducedMotion]);

  return (
    <div className={`acronym acronym--${mood}`} aria-hidden="true">
      {shown.map((ch, i) => (
        <span
          key={`${spinKey}-${i}`}
          className={`acronym__letter pat-${i % 3}${settled[i] ? ' is-settled' : ' is-spinning'}`}
          style={{ ['--i' as string]: i }}
        >
          {ch}
        </span>
      ))}
    </div>
  );
}
