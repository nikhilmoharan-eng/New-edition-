import React from "react";
import { Audio, Video } from "@remotion/media";
import { AbsoluteFill, Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { BigType, C, Camera, clamp, CreamBG, DarkBG, Grain, MONO, SANS, Stamp, useU, Vignette } from "../reel/kit";
import { buildChunks, Captions, CapPos, Tone } from "../reel/captions";
import type { Line } from "../reel/timeline";
import raw from "../timelines/meta-scale.json";
import { GRAPHICS, M } from "./graphics";

/* ------------------------------------------------------------------ timeline */
const TL = raw as { duration: number; lines: Line[] };
export const FPS = 30;
export const TOTAL_SEC = TL.duration + 1.2;
export const TOTAL_FRAMES = Math.ceil(TOTAL_SEC * FPS);
const w = (id: string, i: number) => {
  const l = TL.lines.find((x) => x.id === id);
  if (!l) throw new Error(id);
  return l.words[i].start;
};
const lineStart = (id: string) => TL.lines.find((x) => x.id === id)!.start;

/* --------------------------------------------------------------------- shots */
type Base = { at: number; cap?: CapPos; tone?: Tone };
type MediaShot = Base & {
  k: "img" | "vid";
  src: string;
  pos?: string;
  bw?: boolean;
  red?: boolean;
  zoom?: [number, number];
  /** "blur": in 16:9 use the pre-baked "<name>-wide.mp4" (whole frame over a blurred copy) */
  fit?: "blur";
  label?: { title: string; sub?: string };
  stamp?: { text: string; at: number };
};
type BigShot = Base & { k: "big"; text: string; bg: "cream" | "black"; color?: string; italic?: boolean };
type GShot = Base & { k: "g"; g: string; mark?: number; logo?: string; label?: string };
type Shot = MediaShot | BigShot | GShot;

const at = (id: string, i: number) => Math.max(0, w(id, i) - 0.04);

const SHOTS: Shot[] = [
  // HOOK
  { k: "img", src: "meta-hq.jpg", at: 0, pos: "42% 50%", zoom: [1.0, 1.12] },
  { k: "img", src: "zuck-mwc.jpg", at: at("hook1", 3), pos: "50% 16%" },
  { k: "big", text: "$14,300,000,000", bg: "cream", at: at("hook1", 5), cap: "top", tone: "dark" },
  { k: "g", g: "strike", logo: "logo-scale.png", at: at("hook2", 0), mark: w("hook2", 3), cap: "low", tone: "dark" },
  { k: "img", src: "wang-redtie.jpg", at: at("hook2", 4), pos: "45% 35%", zoom: [1.18, 1.05] },
  { k: "big", text: "28.", bg: "cream", at: at("hook2", 6), cap: "top", tone: "dark" },
  // NAME + ORIGIN
  { k: "vid", src: "wang-senra-med1.mp4", at: lineStart("name"), label: { title: "ALEXANDR WANG", sub: "Founder, Scale AI" }, cap: "top" },
  { k: "big", text: "19.", bg: "cream", at: lineStart("origin"), cap: "top", tone: "dark" },
  { k: "img", src: "mit.jpg", at: at("origin", 2), stamp: { text: "DROPOUT", at: w("origin", 3) + 0.15 } },
  { k: "g", g: "logoCard", logo: "logo-scale.png", label: "FOUNDED 2016 · SAN FRANCISCO", at: at("origin", 7), cap: "low", tone: "dark" },
  // WHAT SCALE DOES
  { k: "vid", src: "wang-yc1.mp4", at: lineStart("feeds") },
  { k: "vid", src: "servers1.mp4", at: at("feeds", 4), zoom: [1.15, 1.0] },
  { k: "vid", src: "worker1.mp4", at: lineStart("labels") },
  { k: "g", g: "labeling", at: at("labels", 4), cap: "low", tone: "light" },
  { k: "g", g: "logoPop", logo: "logo-google.png", at: at("labels", 9) },
  { k: "g", g: "logoPop", logo: "logo-openai.png", at: at("labels", 10) },
  { k: "g", g: "radar", at: at("labels", 11) },
  // BILLIONAIRE
  { k: "img", src: "wang-bloomberg.jpg", at: lineStart("billionaire"), pos: "40% 40%", zoom: [1.05, 1.18] },
  { k: "vid", src: "wang-senra-cu2.mp4", at: at("billionaire", 5), fit: "blur", zoom: [1.0, 1.06] },
  { k: "big", text: "billionaire.", bg: "black", italic: true, color: "#fff", at: at("billionaire", 7), cap: "top" },
  // WHY
  { k: "g", g: "cream", at: lineStart("why"), cap: "center", tone: "dark" },
  { k: "img", src: "meta-hq.jpg", at: lineStart("llama"), pos: "45% 50%", bw: true, zoom: [1.2, 1.05] },
  { k: "g", g: "llama", at: at("llama", 4), mark: w("llama", 9) },
  { k: "img", src: "zuck-mwc.jpg", at: at("llama", 11), pos: "50% 14%", bw: true, zoom: [1.0, 1.15] },
  { k: "g", g: "race", at: at("llama", 13) },
  // THE DEAL
  { k: "g", g: "handshake", at: lineStart("deal"), cap: "top" },
  { k: "g", g: "termSheet", at: at("deal", 3) },
  { k: "vid", src: "wang-senra-cu3.mp4", at: at("deal", 6), fit: "blur", zoom: [1.0, 1.06] },
  { k: "img", src: "zuck-team.jpg", at: at("deal", 12), pos: "50% 45%", label: { title: "META SUPERINTELLIGENCE LABS" }, cap: "top" },
  // TURN
  { k: "g", g: "black", at: lineStart("crazy"), cap: "center" },
  { k: "img", src: "google-nyt.jpg", at: lineStart("google"), pos: "50% 45%" },
  { k: "img", src: "google-sign.jpg", at: at("google", 4), pos: "50% 40%", zoom: [1.2, 1.05] },
  { k: "big", text: "$200M", bg: "cream", at: at("google", 6), cap: "top", tone: "dark" },
  { k: "g", g: "quote", at: lineStart("split"), cap: "off" },
  { k: "g", g: "snap", at: at("split", 7), mark: w("split", 10) },
  { k: "vid", src: "office1.mp4", at: lineStart("layoffs"), bw: true },
  { k: "big", text: "14%", bg: "cream", color: C.red, at: at("layoffs", 5), cap: "top", tone: "dark" },
  { k: "vid", src: "office2.mp4", at: at("layoffs", 6), bw: true },
  // REFRAME
  { k: "img", src: "meta-hq.jpg", at: lineStart("reframe"), pos: "40% 50%", bw: true, zoom: [1.0, 1.18] },
  { k: "g", g: "strike", logo: "logo-scale.png", at: at("reframe", 4), mark: w("reframe", 4) + 0.1, cap: "low", tone: "dark" },
  { k: "vid", src: "wang-yc2.mp4", at: at("reframe", 5) },
  { k: "vid", src: "office3.mp4", at: at("reframe", 9), red: true },
  // OUTRO
  { k: "vid", src: "wang-senra-cu4.mp4", at: lineStart("outro1"), fit: "blur", zoom: [1.0, 1.06] },
  { k: "vid", src: "servers3.mp4", at: at("outro1", 7), bw: true },
  { k: "g", g: "outro", at: lineStart("outro2"), cap: "low" },
];

/** Caption words that a big-type card already shows. */
const HIDE: Record<string, number[]> = {
  hook1: [5, 6],
  hook2: [6],
  origin: [1],
  billionaire: [7],
  deal: [3],
  google: [6, 7],
  layoffs: [5],
};

const shotAt = (t: number) => {
  let s = SHOTS[0];
  for (const x of SHOTS) if (x.at <= t + 1e-6) s = x;
  return s;
};
const lookOf = (s: Shot): { pos: CapPos; tone: Tone } => {
  if (s.k === "big") return { pos: s.cap ?? "top", tone: s.tone ?? (s.bg === "cream" ? "dark" : "light") };
  return { pos: s.cap ?? "low", tone: s.tone ?? "light" };
};

/* ------------------------------------------------------------- media shot */
const MediaView: React.FC<{ s: MediaShot; dur: number; idx: number }> = ({ s, dur, idx }) => {
  const f = useCurrentFrame();
  const { u, portrait } = useU();
  const wide = s.fit === "blur" && !portrait;
  const z = s.zoom ?? (idx % 2 ? [1.02, 1.13] : [1.14, 1.03]);
  const pan = (idx % 3) - 1;
  const local = (sec: number) => Math.round((sec - s.at) * FPS);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          scale: String(interpolate(f, [0, dur], z, clamp)),
          translate: `${interpolate(f, [0, dur], [0, pan * 30 * u], clamp)}px 0px`,
          filter: s.bw ? "grayscale(1) contrast(1.18) brightness(0.92)" : "contrast(1.06) saturate(1.06)",
        }}
      >
        {s.k === "vid" ? (
          <Video src={M(wide ? s.src.replace(".mp4", "-wide.mp4") : s.src)} muted objectFit="cover" style={{ width: "100%", height: "100%" }} />
        ) : (
          <Img src={M(s.src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: s.pos ?? "50% 50%" }} />
        )}
      </AbsoluteFill>
      {s.red ? (
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(215,38,43,0.55), rgba(90,0,0,0.75))", mixBlendMode: "multiply" }} />
      ) : null}
      {/* soft bottom shade so captions always read */}
      <AbsoluteFill style={{ background: "linear-gradient(rgba(0,0,0,0) 55%, rgba(0,0,0,0.5))" }} />
      {s.label ? (
        <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "flex-start", padding: `${110 * u}px ${90 * u}px` }}>
          <div style={{ opacity: interpolate(f, [4, 12], [0, 1], clamp), translate: `${interpolate(f, [4, 12], [-50, 0], clamp) * u}px 0px` }}>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 44 * u, color: "#fff", letterSpacing: 6 * u, textShadow: "0 2px 12px #000" }}>{s.label.title}</div>
            <div style={{ height: 4 * u, width: interpolate(f, [8, 20], [0, 380], clamp) * u, background: C.gold, margin: `${12 * u}px 0` }} />
            {s.label.sub ? <div style={{ fontFamily: MONO, fontSize: 26 * u, color: "#ddd", letterSpacing: 3 * u }}>{s.label.sub}</div> : null}
          </div>
        </AbsoluteFill>
      ) : null}
      {s.stamp ? (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <Stamp text={s.stamp.text} at={local(s.stamp.at)} size={130} />
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

const ShotView: React.FC<{ s: Shot; dur: number; idx: number }> = ({ s, dur, idx }) => {
  if (s.k === "img" || s.k === "vid") {
    return (
      <Camera dur={dur} from={1} to={1}>
        <MediaView s={s} dur={dur} idx={idx} />
      </Camera>
    );
  }
  if (s.k === "big") {
    return (
      <AbsoluteFill>
        {s.bg === "cream" ? <CreamBG /> : <DarkBG />}
        <BigType text={s.text} at={6} color={s.color ?? (s.bg === "cream" ? C.ink : "#fff")} italic={s.italic} glow={s.bg === "black"} />
      </AbsoluteFill>
    );
  }
  const g = s as GShot;
  const G = GRAPHICS[g.g];
  const mark = g.mark !== undefined ? Math.round((g.mark - g.at) * FPS) : undefined;
  return (
    <Camera dur={dur} from={1.0} to={1.04}>
      <G dur={dur} mark={mark} logo={g.logo} label={g.label} />
    </Camera>
  );
};

/* -------------------------------------------------------------------- audio */
type Cue = { at: number; src: string; vol: number };
const CUES: Cue[] = (() => {
  const c: Cue[] = [];
  SHOTS.forEach((s, i) => {
    if (i) c.push({ at: s.at - 0.1, src: "whoosh", vol: 0.13 });
    if (s.k === "big") c.push({ at: s.at + 0.05, src: "impact", vol: 0.5 });
    if (s.k === "g" && (s.g === "logoPop" || s.g === "logoCard")) c.push({ at: s.at + 0.05, src: "tick", vol: 0.45 });
    if (s.k === "g" && (s.g === "strike" || s.g === "snap") && s.mark) c.push({ at: s.mark + 0.08, src: "stamp", vol: 0.6 });
    if (s.k === "img" && s.stamp) c.push({ at: s.stamp.at, src: "stamp", vol: 0.65 });
    if (s.k === "g" && s.g === "termSheet") c.push({ at: s.at + 0.2, src: "ding", vol: 0.3 });
    if (s.k === "g" && s.g === "quote") for (let k = 0; k < 14; k++) c.push({ at: s.at + 0.1 + k * 0.06, src: "key", vol: 0.1 });
  });
  c.push({ at: lineStart("crazy") - 1.5, src: "riser", vol: 0.35 });
  c.push({ at: w("crazy", 3), src: "impact", vol: 0.55 });
  c.push({ at: TOTAL_SEC - 1.45, src: "impact", vol: 0.65 });
  return c.filter((x) => x.at >= 0);
})();

const CHUNKS = buildChunks(TL.lines, HIDE);

/* --------------------------------------------------------------------- reel */
export const MetaReel: React.FC = () => {
  const crazyStart = lineStart("crazy");
  const crazyEnd = lineStart("google");
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {SHOTS.map((s, i) => {
        const from = Math.round(s.at * FPS);
        const to = i + 1 < SHOTS.length ? Math.round(SHOTS[i + 1].at * FPS) : TOTAL_FRAMES;
        return (
          <Sequence key={i} name={`${i + 1} ${s.k === "g" ? s.g : s.k === "big" ? s.text : s.src}`} from={from} durationInFrames={to - from} layout="absolute-fill">
            <ShotView s={s} dur={to - from} idx={i} />
          </Sequence>
        );
      })}
      <Vignette strength={0.5} />
      <Grain opacity={0.08} />
      <Captions chunks={CHUNKS} lookAt={(t) => lookOf(shotAt(t))} />
      <Audio src={staticFile("meta-scale/vo.wav")} />
      <Audio
        src={staticFile("meta-scale/music.wav")}
        volume={(f) => {
          const t = f / FPS;
          const duck = t > crazyStart - 0.2 && t < crazyEnd ? 0.35 : 1;
          return 0.16 * duck * interpolate(t, [TOTAL_SEC - 2, TOTAL_SEC], [1, 0], clamp);
        }}
      />
      {CUES.map((c, i) => (
        <Sequence key={i} from={Math.round(c.at * FPS)} durationInFrames={2 * FPS} layout="none" name={`sfx ${c.src}`}>
          <Audio src={staticFile(`sfx/${c.src}.wav`)} volume={c.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
