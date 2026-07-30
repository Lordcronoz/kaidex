import * as React from "react";

/**
 * useShortcut — register a keyboard shortcut on window.
 *
 * `keys` is a combo string like "mod+k", "mod+shift+p", "?", "g d".
 *   - `mod` = Meta on macOS, Ctrl elsewhere
 *   - space-separated tokens = a sequence (e.g. "g d" = press g then d)
 */

type Handler = (e: KeyboardEvent) => void;

const isMac =
  typeof navigator !== "undefined" && /Mac|iPhone|iPad|iPod/.test(navigator.platform);

function normalize(combo: string) {
  return combo
    .toLowerCase()
    .split("+")
    .map((k) => k.trim())
    .sort()
    .join("+");
}

function eventCombo(e: KeyboardEvent) {
  const parts: string[] = [];
  if ((isMac ? e.metaKey : e.ctrlKey)) parts.push("mod");
  if (e.shiftKey) parts.push("shift");
  if (e.altKey) parts.push("alt");
  const key = e.key.toLowerCase();
  if (!["control", "meta", "shift", "alt"].includes(key)) parts.push(key);
  return parts.sort().join("+");
}

function isEditable(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  );
}

export function useShortcut(
  keys: string,
  handler: Handler,
  options: { allowInEditable?: boolean; enabled?: boolean } = {},
) {
  const { allowInEditable = false, enabled = true } = options;
  const handlerRef = React.useRef(handler);
  handlerRef.current = handler;

  React.useEffect(() => {
    if (!enabled) return;
    const sequence = keys.trim().includes(" ")
      ? keys.trim().split(/\s+/).map(normalize)
      : null;
    const single = sequence ? null : normalize(keys);

    let step = 0;
    let resetTimer: number | undefined;

    const onKey = (e: KeyboardEvent) => {
      if (!allowInEditable && isEditable(e.target)) return;
      const combo = eventCombo(e);
      if (sequence) {
        if (combo === sequence[step]) {
          step += 1;
          window.clearTimeout(resetTimer);
          if (step === sequence.length) {
            step = 0;
            e.preventDefault();
            handlerRef.current(e);
          } else {
            resetTimer = window.setTimeout(() => (step = 0), 900);
          }
        } else {
          step = 0;
        }
        return;
      }
      if (combo === single) {
        e.preventDefault();
        handlerRef.current(e);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(resetTimer);
    };
  }, [keys, allowInEditable, enabled]);
}

/** Format a combo string for display, e.g. "mod+k" -> "⌘K" on mac, "Ctrl K" elsewhere. */
export function formatShortcut(combo: string) {
  return combo
    .split("+")
    .map((k) => {
      const key = k.trim().toLowerCase();
      if (key === "mod") return isMac ? "⌘" : "Ctrl";
      if (key === "shift") return isMac ? "⇧" : "Shift";
      if (key === "alt") return isMac ? "⌥" : "Alt";
      if (key === "enter") return "↵";
      if (key === "escape") return "Esc";
      return key.length === 1 ? key.toUpperCase() : key;
    })
    .join(isMac ? "" : " ");
}