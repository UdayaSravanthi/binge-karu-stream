// My List, shared across pages and kept in the browser between visits.
import { useSyncExternalStore } from "react";
import { track } from "./analytics";

const KEY = "bingekaro:my-list";
const EMPTY: number[] = [];
let saved: number[] | null = null;
const listeners = new Set<() => void>();

function read(): number[] {
  if (saved) return saved;
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    saved = Array.isArray(parsed) ? parsed.filter((n): n is number => typeof n === "number") : [];
  } catch {
    saved = [];
  }
  return saved;
}

function write(next: number[]) {
  saved = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage may be blocked */
  }
  listeners.forEach((l) => l());
}

export function toggleSaved(id: number) {
  const current = read();
  if (current.includes(id)) write(current.filter((n) => n !== id));
  else {
    track("my_list_added", { id });
    write([...current, id]);
  }
}

export function useMyList(): number[] {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    read,
    () => EMPTY,
  );
}
