import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { C, clamp, Grain, SERIF, useU, Vignette } from "./kit";
import { LOOK, SCENES } from "./scenes";
import { FPS, line, sceneWindow, sec, TIMELINE, TOTAL_FRAMES, Word, wordAt } from "./timeline";

/* ------------------------------------------------------------------ captions */
type Chunk = { words: (Word & { hidden: boolean })[]; from: number; to: number; lineId: string };

const buildChunks = (): Chunk[] => {
  const out: Chunk[] = [];
  TIMELINE.lines.forEach((l, li) => {
    const hide = new Set(LOOK[l.id]?.hide ?? []);
    let cur: Chunk["words"] = [];
    const flush = () => {
      if (cur.length) out.push({ words: cur, from: 0, to: 0, lineId: l.id });
      cur = [];
    };
    l.words.forEach((w, i) => {
      cur.push({ ...w, hidden: hide.has(i) });
      // break on punctuation, or at 4 words unless only one word is left before the next break
      const rest = l.words.slice(i + 1);
      const toBreak = rest.findIndex((x) => /[,.?!]$/.test(x.text));
      const left = toBreak === -1 ? rest.length : toBreak + 1;
      if (/[,.?!]$/.test(w.text) || (cur.length >= 4 && left > 1) || cur.length >= 5) flush();
    });
    flush();
    const nextLine = TIMELINE.lines[li + 1];
    out.forEach((c, k) => {
      if (c.lineId !== l.id) return;
      c.from = c.words[0].start - 0.05;
      const next = out[k + 1];
      c.to = next && next.lineId === l.id ? next.words[0].start - 0.05 : Math.min(l.end + 0.35, nextLine ? nextLine.start : 1e9);
    });
  });
  return out.filter((c) => c.words.some((w) => !w.hidden));
};
const CHUNKS = buildChunks();

const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const { u, portrait } = useU();
  const chunk = CHUNKS.find((c) => t >= c.from && t < c.to);
  if (!chunk) return null;
  const look = LOOK[chunk.lineId] ?? { tone: "light", pos: "center" };
  if (look.pos === "off") return null;
  const dark = look.tone === "dark";
  const top = { center: "50%", low: portrait ? "74%" : "80%", top: portrait ? "24%" : "18%" }[look.pos];
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
          rowGap: 0,
          fontFamily: SERIF,
          fontStyle: "italic",
          fontSize: (portrait ? 92 : 84) * u,
          lineHeight: 1.1,
          color: dark ? C.ink : "#fff",
          textShadow: dark ? "none" : `0 0 ${18 * u}px rgba(0,0,0,0.85), 0 ${2 * u}px ${6 * u}px rgba(0,0,0,0.9)`,
        }}
      >
        {chunk.words
          .filter((w) => !w.hidden)
          .map((w, i) => {
            const p = interpolate(t, [w.start, w.start + 0.16], [0, 1], clamp);
            return (
              <span
                key={i}
                style={{
                  opacity: p,
                  filter: `blur(${(1 - p) * 8}px)`,
                  translate: `0px ${(1 - p) * 14 * u}px`,
                  display: "inline-block",
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

/* ---------------------------------------------------------------------- sfx */
type Cue = { at: number; src: string; vol: number };
const cues = (): Cue[] => {
  const c: Cue[] = [];
  // whoosh into every scene except the first
  TIMELINE.lines.slice(1).forEach((l) => c.push({ at: sceneWindow(l.id).start - 0.12, src: "whoosh", vol: 0.22 }));
  const hit = (id: string, i: number, src = "impact", vol = 0.45, off = 0) => c.push({ at: wordAt(id, i) + off, src, vol });
  hit("hook1", 3, "stamp", 0.7);
  hit("hook2", 5, "impact", 0.6, -0.1);
  hit("twitter", 2, "stamp", 0.6);
  hit("rule", 0, "tick", 0.4);
  hit("rule", 2, "tick", 0.4);
  hit("rule", 4, "tick", 0.4);
  hit("named", 3, "impact", 0.45, -0.1);
  hit("users", 1, "impact", 0.45, -0.1);
  hit("users", 2, "riser", 0.25, -0.2);
  hit("staff", 7, "impact", 0.5, -0.1);
  for (let i = 0; i < 55; i += 5) c.push({ at: wordAt("staff", 2) + (i * 0.8) / FPS, src: "tick", vol: 0.12 });
  hit("offer", 0, "ding", 0.35);
  hit("perhead", 2, "impact", 0.6, -0.1);
  c.push({ at: line("crazy").start - 1.4, src: "riser", vol: 0.35 });
  hit("crazy", 3, "impact", 0.55);
  hit("walk", 1, "impact", 0.45, -0.1);
  hit("walk", 9, "stamp", 0.7);
  hit("tweet", 2, "impact", 0.45, -0.1);
  const del = sceneWindow("delete").start;
  for (let k = 0; k < 27; k++) c.push({ at: del + k / 22 + (k % 3) * 0.01, src: "key", vol: 0.12 });
  hit("outro2", 6, "whoosh", 0.3);
  c.push({ at: TIMELINE.duration - 0.35, src: "impact", vol: 0.6 });
  return c.filter((x) => x.at >= 0);
};
const CUES = cues();

/* -------------------------------------------------------------------- reel */
export const Reel: React.FC = () => {
  const crazy = sceneWindow("crazy");
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {TIMELINE.lines.map((l) => {
        const { start, end } = sceneWindow(l.id);
        const Scene = SCENES[l.id];
        const dur = sec(end) - sec(start);
        return (
          <Sequence key={l.id} name={l.id} from={sec(start)} durationInFrames={dur} layout="absolute-fill">
            <Scene dur={dur} />
          </Sequence>
        );
      })}
      <Vignette />
      <Grain />
      <Captions />
      <Audio src={staticFile("vo.wav")} />
      <Audio
        src={staticFile("music.wav")}
        volume={(f) => {
          const t = f / FPS;
          // duck under the "crazy part" beat, swell at the end
          const duck = t > crazy.start - 0.2 && t < crazy.end ? 0.35 : 1;
          return 0.16 * duck;
        }}
      />
      {CUES.map((c, i) => (
        <Sequence key={i} from={Math.max(0, Math.round(c.at * FPS))} durationInFrames={sec(2)} layout="none" name={`sfx ${c.src}`}>
          <Audio src={staticFile(`sfx/${c.src}.wav`)} volume={c.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export { TOTAL_FRAMES };
