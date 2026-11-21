import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, clamp, SERIF, useU } from "./kit";
import type { Line, Word } from "./timeline";

export type CapPos = "center" | "low" | "top" | "off";
export type Tone = "light" | "dark";
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
      c.from = c.words[0].start - 0.05;
      const next = mine[k + 1];
      c.to = next ? next.words[0].start - 0.05 : Math.min(l.end + 0.35, nextLine ? nextLine.start : 1e9);
    });
    out.push(...mine);
  });
  return out.filter((c) => c.words.some((w) => !w.hidden));
};

export const Captions: React.FC<{
  chunks: Chunk[];
  lookAt: (t: number) => { pos: CapPos; tone: Tone };
  /** outer-glow colour for light captions (default soft white) */
  glow?: string;
}> = ({ chunks, lookAt, glow = "rgba(255,255,255,0.6)" }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const { u, portrait } = useU();
  const chunk = chunks.find((c) => t >= c.from && t < c.to);
  if (!chunk) return null;
  const look = lookAt(t);
  if (look.pos === "off") return null;
  const dark = look.tone === "dark";
  const top = { center: "50%", low: portrait ? "73%" : "80%", top: portrait ? "22%" : "17%" }[look.pos];
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top,
          left: 80 * u,
          right: 80 * u,
          translate: "0 -50%",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          columnGap: 26 * u,
          fontFamily: SERIF,
          fontStyle: "italic",
          fontSize: (portrait ? 96 : 86) * u,
          lineHeight: 1.1,
          color: dark ? C.ink : "#fff",
          // Text Glow / Outer Glow: soft light around the letters
          textShadow: dark
            ? `0 0 ${16 * u}px rgba(255,255,255,0.95), 0 0 ${34 * u}px rgba(255,255,255,0.6)`
            : `0 0 ${20 * u}px ${glow}, 0 0 ${44 * u}px rgba(255,255,255,0.25), 0 ${2 * u}px ${8 * u}px rgba(0,0,0,0.8)`,
        }}
      >
        {chunk.words
          .filter((w) => !w.hidden)
          .map((w, i) => {
            // Word-by-word reveal: fully hidden until spoken, then Blur In with a short motion streak
            const startFrame = Math.round(w.start * fps);
            const visible = f >= startFrame;
            const p = visible ? spring({ frame: f - startFrame, fps, config: { damping: 200 }, durationInFrames: 9 }) : 0;
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  opacity: visible ? interpolate(p, [0, 0.35], [0, 1], clamp) : 0,
                  filter: `blur(${(1 - p) * 12}px)`,
                  translate: `${(1 - p) * -22 * u}px ${(1 - p) * 10 * u}px`,
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
