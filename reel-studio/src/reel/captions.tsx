import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SERIF, useU } from "./kit";
import type { Line, Word } from "./timeline";

export type CapPos = "top" | "center" | "bottom" | "off";
export type Chunk = { words: (Word & { hidden: boolean })[]; from: number; to: number; lineId: string };

const BREAK = /[,.?!]$/;

/** Split every line into 2–5 word phrases, the way the reference reels reveal captions. */
export const buildChunks = (lines: Line[], hide: Record<string, number[]> = {}): Chunk[] => {
  const out: Chunk[] = [];
  lines.forEach((l, li) => {
    const hidden = new Set(hide[l.id] ?? []);
    const mine: Chunk[] = [];
    let cur: Chunk["words"] = [];
    const flush = () => {
      if (cur.length) mine.push({ words: cur, from: 0, to: 0, lineId: l.id });
      cur = [];
    };
    l.words.forEach((w, i) => {
      cur.push({ ...w, hidden: hidden.has(i) });
      const rest = l.words.slice(i + 1);
      const nb = rest.findIndex((x) => BREAK.test(x.text));
      const left = nb === -1 ? rest.length : nb + 1;
      if (BREAK.test(w.text) || (cur.length >= 4 && left > 1) || cur.length >= 5) flush();
    });
    flush();
    const nextLine = lines[li + 1];
    mine.forEach((c, k) => {
      c.from = c.words[0].start - 0.02;
      const next = mine[k + 1];
      c.to = next ? next.words[0].start - 0.02 : Math.min(l.end + 0.35, nextLine ? nextLine.start : 1e9);
    });
    out.push(...mine);
  });
  return out.filter((c) => c.words.some((w) => !w.hidden));
};

/**
 * Centred, glowing, word-by-word captions. A word is fully invisible until the frame it is
 * spoken, then springs in (blur + rise). Always rendered above every scene (zIndex 10).
 */
export const Captions: React.FC<{ chunks: Chunk[]; posAt: (t: number) => CapPos }> = ({ chunks, posAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const { u } = useU();
  const chunk = chunks.find((c) => t >= c.from && t < c.to);
  if (!chunk) return null;
  const pos = posAt(t);
  if (pos === "off") return null;
  const justify = { top: "flex-start", center: "center", bottom: "flex-end" }[pos] as "flex-start" | "center" | "flex-end";
  return (
    <AbsoluteFill style={{ zIndex: 10, pointerEvents: "none", justifyContent: justify, alignItems: "center", padding: `${150 * u}px ${110 * u}px` }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0 0.8em",
          fontFamily: SERIF,
          fontStyle: "italic",
          fontSize: 64 * u,
          lineHeight: 1.2,
          color: "#fff",
          textShadow: "0 0 20px rgba(255,255,255,.6), 0 2px 8px rgba(0,0,0,.8)",
        }}
      >
        {chunk.words
          .filter((w) => !w.hidden)
          .map((w, i) => {
            const startFrame = Math.round(w.start * fps);
            const visible = frame >= startFrame;
            const p = visible ? spring({ frame: frame - startFrame, fps, config: { damping: 200 } }) : 0;
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  opacity: visible ? p : 0,
                  filter: `blur(${(1 - p) * 8}px)`,
                  transform: `translateY(${(1 - p) * 10 * u}px)`,
                }}
              >
                {w.text}
              </span>
            );
          })}
      </div>
    </AbsoluteFill>
  );
};
