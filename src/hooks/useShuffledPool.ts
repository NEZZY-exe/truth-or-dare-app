import { useCallback, useRef, useState } from "react";
import { shuffle } from "../utils/shuffle";

export function useShuffledPool(source: string[]) {
  const poolRef = useRef<string[]>(shuffle(source));
  const lastRef = useRef<string | null>(null);
  const [tick, setTick] = useState(0);

  const next = useCallback(() => {
    if (poolRef.current.length === 0) {
      poolRef.current = shuffle(source);
    }
    let candidate = poolRef.current.pop()!;
    // avoid immediate repeat
    if (candidate === lastRef.current && poolRef.current.length > 0) {
      const swap = poolRef.current.pop()!;
      poolRef.current.unshift(candidate);
      candidate = swap;
    }
    lastRef.current = candidate;
    setTick((t) => t + 1);
    return candidate;
  }, [source]);

  const reset = useCallback(() => {
    poolRef.current = shuffle(source);
    lastRef.current = null;
    setTick((t) => t + 1);
  }, [source]);

  return { next, reset, tick };
}
