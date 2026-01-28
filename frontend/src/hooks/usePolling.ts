import { useEffect, useRef } from 'react';

export function usePolling(callback: () => void, interval: number = 5000) {
  const savedCallback = useRef<() => void>(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    if (interval > 0) {
      const id = setInterval(tick, interval);
      return () => clearInterval(id);
    }
  }, [interval]);
}
