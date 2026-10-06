import { useSyncExternalStore } from 'react';

// một timer dùng chung cho mọi component, tự tắt khi không còn ai subscribe
const TICK_MS = 60_000;

let currentTime = Date.now();
let timerId: number | null = null;
const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  if (timerId === null) {
    timerId = window.setInterval(() => {
      currentTime = Date.now();
      listeners.forEach((fn) => fn());
    }, TICK_MS);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timerId !== null) {
      window.clearInterval(timerId);
      timerId = null;
    }
  };
}

const getSnapshot = () => currentTime;

export function useNow(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
