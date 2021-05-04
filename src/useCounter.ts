import { useState, useCallback } from "react";

export function useCounter(
  initialValue: number,
  options: { min?: number; max?: number; step?: number } = {}
) {
  const { min = 1, max = Infinity, step = 1 } = options;
  const [value, setValue] = useState<number>(initialValue);
  const increment = useCallback(
    (by: number = step) => {
      setValue((prev) => Math.min(prev + by, max));
    },
    [max, step]
  );
  const decrement = useCallback(
    (by: number = step) => {
      setValue((prev) => Math.max(prev - by, min));
    },
    [min, step]
  );
  return {
    value,
    increment,
    decrement,
    setValue,
  };
}
