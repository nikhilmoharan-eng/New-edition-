import tl from "../timeline.json";

export type Word = { text: string; start: number; end: number };
export type Line = { id: string; show: string; start: number; end: number; words: Word[] };

export const TIMELINE = tl as { title: string; duration: number; lines: Line[] };
export const FPS = 30;
export const TAIL = 1.2; // seconds held after the last line
export const TOTAL_SEC = TIMELINE.duration + TAIL;
export const TOTAL_FRAMES = Math.ceil(TOTAL_SEC * FPS);

export const line = (id: string): Line => {
  const l = TIMELINE.lines.find((x) => x.id === id);
  if (!l) throw new Error(`No line ${id}`);
  return l;
};

/** Seconds at which word `i` of line `id` starts (absolute). */
export const wordAt = (id: string, i: number) => line(id).words[i].start;

/** Scene windows: each line's scene runs from its start until the next line starts. */
export const sceneWindow = (id: string) => {
  const idx = TIMELINE.lines.findIndex((x) => x.id === id);
  const start = idx === 0 ? 0 : TIMELINE.lines[idx].start;
  const next = TIMELINE.lines[idx + 1];
  const end = next ? next.start : TOTAL_SEC;
  return { start, end };
};

export const sec = (s: number) => Math.round(s * FPS);
