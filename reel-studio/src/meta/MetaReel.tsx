import React from "react";
import { Audio, Video } from "@remotion/media";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import {
  AbsoluteFill,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, clamp, DISPLAY, Grain, MONO, SANS, ScanLines, Stamp, useU, Vignette } from "../reel/kit";
import { buildChunks, Captions, CapPos } from "../reel/captions";
import type { Line } from "../reel/timeline";
import raw from "../timelines/meta-scale.json";
import { GRAPHICS, M } from "./graphics";

/* ------------------------------------------------------------------ timeline */
const TL = raw as { duration: number; lines: Line[] };
export const TOTAL_SEC = TL.duration + 1.2;
export const totalFrames = (fps: number) => Math.ceil(TOTAL_SEC * fps);
const TD = 8; // fade length between shots, in frames

const w = (id: string, i: number) => {
  const l = TL.lines.find((x) => x.id === id);
  if (!l) throw new Error(id);
  return l.words[i].start;
};
const at = (id: string, i: number) => Math.max(0, w(id, i) - 0.04);
const lineStart = (id: string) => TL.lines.find((x) => x.id === id)!.start;

/* --------------------------------------------------------------------- shots */
type Cam = { zoom?: [number, number]; focus?: string };
type Base = { at: number; cap?: CapPos } & Cam;
type MediaShot = Base & {
  k: "img" | "vid";
  src: string;
  pos?: string;
  trim?: number; // seconds into the clip
  bw?: boolean;
  red?: boolean;
  dim?: boolean;
  fit?: "blur"; // 16:9 uses the pre-baked "<name>-wide.mp4"
  label?: { title: string; sub?: string };
  stamp?: { text: string; at: number };
};
type HeroShot = Base & { k: "hero"; text: string; bg: string; color?: string; italic?: boolean };
type GShot = Base & { k: "g"; g: string; mark?: number; logo?: string; label?: string };
type Shot = MediaShot | HeroShot | GShot;

const SHOTS: Shot[] = [
  // HOOK — "In June 2025, Meta paid $14 billion."
  { k: "img", src: "meta-hq.jpg", at: 0, pos: "42% 50%" },
  { k: "img", src: "meta-hq.jpg", at: 1.0, zoom: [1.45, 1.6], focus: "38% 42%" },
  { k: "img", src: "zuck-mwc.jpg", at: at("hook1", 3), pos: "50% 16%" },
  { k: "hero", text: "$14.3B", bg: "meta-hq.jpg", at: at("hook1", 5), cap: "top" },
  { k: "img", src: "zuck-mwc.jpg", at: 3.7, pos: "50% 14%", bw: true, zoom: [1.5, 1.65], focus: "52% 30%" },
  // "Not for a company. For one 28-year-old."
  { k: "g", g: "strike", logo: "logo-scale.png", at: at("hook2", 0), mark: w("hook2", 3), cap: "bottom" },
  { k: "img", src: "wang-redtie.jpg", at: at("hook2", 4), pos: "45% 35%", cap: "bottom" },
  { k: "hero", text: "28", bg: "wang-redtie.jpg", at: at("hook2", 6), cap: "top" },
  { k: "img", src: "wang-bloomberg.jpg", at: 6.95, pos: "40% 40%", cap: "bottom" },
  // "His name is Alexandr Wang."
  { k: "vid", src: "wang-senra-med1.mp4", at: at("name", 0), label: { title: "ALEXANDR WANG", sub: "Founder, Scale AI" }, cap: "top" },
  { k: "vid", src: "wang-yc3.mp4", at: at("name", 4), cap: "top" },
  // "At 19, he dropped out of MIT and started Scale AI."
  { k: "hero", text: "19", bg: "mit.jpg", at: at("origin", 0), cap: "top" },
  { k: "img", src: "mit.jpg", at: at("origin", 2), stamp: { text: "DROPOUT", at: w("origin", 3) + 0.12 }, cap: "bottom" },
  { k: "g", g: "logoCard", logo: "logo-scale.png", label: "FOUNDED 2016 · SAN FRANCISCO", at: at("origin", 7), cap: "bottom" },
  { k: "vid", src: "wang-yc4.mp4", at: at("origin", 9), cap: "top" },
  // "Scale doesn't build AI. It feeds it."
  { k: "vid", src: "wang-yc1.mp4", at: at("feeds", 0), cap: "top" },
  { k: "vid", src: "servers1.mp4", at: at("feeds", 3), cap: "center" },
  { k: "vid", src: "servers2.mp4", at: at("feeds", 4), cap: "center" },
  // "Its workers label the data that trains AI for Google, OpenAI, and even the US military."
  { k: "g", g: "labeling", at: at("labels", 0), cap: "bottom" },
  { k: "g", g: "labeling", at: at("labels", 4), zoom: [1.9, 2.05], focus: "39% 45%", cap: "bottom" },
  { k: "vid", src: "servers3.mp4", at: at("labels", 7), cap: "center" },
  { k: "g", g: "logoPop", logo: "logo-google.png", at: at("labels", 9), cap: "bottom" },
  { k: "g", g: "logoPop", logo: "logo-openai.png", at: at("labels", 10), cap: "bottom" },
  { k: "vid", src: "wang-yc2.mp4", at: 20.7, cap: "top" },
  { k: "g", g: "radar", at: at("labels", 11), cap: "bottom" },
  { k: "g", g: "radar", at: at("labels", 14), zoom: [1.5, 1.65], focus: "55% 45%", cap: "bottom" },
  // "It made him the world's youngest self-made billionaire."
  { k: "img", src: "wang-bloomberg.jpg", at: at("billionaire", 0), pos: "40% 40%", cap: "bottom" },
  { k: "vid", src: "wang-senra-cu2.mp4", at: at("billionaire", 5), fit: "blur", cap: "bottom" },
  { k: "hero", text: "billionaire.", italic: true, bg: "wang-bloomberg.jpg", at: at("billionaire", 7), cap: "top" },
  // "So why did Meta pay so much?"
  { k: "img", src: "meta-hq.jpg", at: at("why", 0), dim: true, cap: "center" },
  { k: "img", src: "zuck-mwc.jpg", at: at("why", 4), pos: "50% 16%", dim: true, cap: "center" },
  // "Because its newest model, Llama 4, landed with a shrug, and Zuckerberg was falling behind in the AI race."
  { k: "img", src: "meta-hq.jpg", at: at("llama", 0), bw: true, zoom: [1.2, 1.35], cap: "center" },
  { k: "vid", src: "servers2.mp4", at: at("llama", 3), trim: 2, bw: true, cap: "center" },
  { k: "g", g: "llama", at: at("llama", 4), mark: w("llama", 9), cap: "bottom" },
  { k: "g", g: "llama", at: at("llama", 6), mark: w("llama", 9), zoom: [1.55, 1.7], focus: "50% 45%", cap: "bottom" },
  { k: "img", src: "zuck-mwc.jpg", at: at("llama", 10), pos: "50% 14%", bw: true, cap: "center" },
  { k: "g", g: "race", at: at("llama", 13), cap: "bottom" },
  { k: "g", g: "race", at: at("llama", 17), zoom: [1.35, 1.5], focus: "45% 35%", cap: "bottom" },
  // "So Meta bought 49% of Scale, and hired Wang to run its new superintelligence lab."
  { k: "g", g: "handshake", at: at("deal", 0), cap: "top" },
  { k: "hero", text: "49%", bg: "zuck-team.jpg", at: at("deal", 3), cap: "top" },
  { k: "g", g: "termSheet", at: at("deal", 4), cap: "bottom" },
  { k: "vid", src: "wang-senra-cu3.mp4", at: at("deal", 6), fit: "blur", cap: "bottom" },
  { k: "vid", src: "wang-senra-med2.mp4", at: at("deal", 8), cap: "top" },
  { k: "img", src: "zuck-team.jpg", at: at("deal", 12), pos: "50% 45%", label: { title: "META SUPERINTELLIGENCE LABS" }, cap: "top" },
  { k: "img", src: "zuck-team.jpg", at: at("deal", 14), bw: true, zoom: [1.5, 1.6], focus: "52% 40%", cap: "top" },
  // "And here's the crazy part."
  { k: "vid", src: "office1.mp4", at: at("crazy", 0), dim: true, cap: "center" },
  { k: "vid", src: "servers3.mp4", at: at("crazy", 3), trim: 1, dim: true, cap: "center" },
  // "Scale's biggest customer was Google. About $200 million that year."
  { k: "img", src: "google-nyt.jpg", at: at("google", 0), pos: "50% 50%", cap: "bottom" },
  { k: "g", g: "logoPop", logo: "logo-google.png", at: at("google", 2), cap: "bottom" },
  { k: "img", src: "google-sign.jpg", at: at("google", 4), pos: "50% 40%", cap: "bottom" },
  { k: "hero", text: "$200M", bg: "google-sign.jpg", at: at("google", 6), cap: "top" },
  { k: "img", src: "google-sign.jpg", at: at("google", 8), bw: true, zoom: [1.5, 1.65], focus: "40% 45%", cap: "bottom" },
  // "The day after the deal, reports said Google planned to walk away."
  { k: "g", g: "handshake", at: at("split", 0), cap: "top" },
  { k: "g", g: "quote", at: at("split", 4), cap: "off" },
  { k: "g", g: "snap", at: at("split", 7), mark: w("split", 10), cap: "bottom" },
  { k: "g", g: "snap", at: at("split", 10), mark: w("split", 10), zoom: [1.25, 1.35], cap: "bottom" },
  // "A month later, Scale cut 14% of its staff."
  { k: "vid", src: "office1.mp4", at: at("layoffs", 0), trim: 2, bw: true, cap: "center" },
  { k: "vid", src: "office2.mp4", at: at("layoffs", 3), bw: true, cap: "center" },
  { k: "hero", text: "14%", color: C.red, bg: "office3.mp4", at: at("layoffs", 5), cap: "top" },
  { k: "vid", src: "office3.mp4", at: at("layoffs", 6), bw: true, cap: "center" },
  // "Meta didn't buy a company. It bought a person. And the company paid the price."
  { k: "img", src: "meta-hq.jpg", at: at("reframe", 0), bw: true, pos: "40% 50%", cap: "center" },
  { k: "g", g: "strike", logo: "logo-scale.png", at: at("reframe", 4), mark: w("reframe", 4) + 0.1, cap: "bottom" },
  { k: "vid", src: "wang-yc2.mp4", at: at("reframe", 5), trim: 2, cap: "top" },
  { k: "vid", src: "office3.mp4", at: at("reframe", 9), trim: 1, red: true, cap: "center" },
  { k: "vid", src: "office2.mp4", at: at("reframe", 12), trim: 1.5, red: true, cap: "center" },
  // "So was it the smartest hire in AI history? Or the most expensive one ever?"
  { k: "vid", src: "wang-senra-cu4.mp4", at: at("outro1", 0), fit: "blur", cap: "bottom" },
  { k: "vid", src: "wang-yc4.mp4", at: at("outro1", 5), trim: 2, cap: "top" },
  { k: "vid", src: "servers3.mp4", at: at("outro1", 7), trim: 1, bw: true, cap: "center" },
  { k: "g", g: "outro", at: at("outro2", 0), cap: "bottom" },
];

/** Caption words that a hero number already shows. */
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
const capOf = (s: Shot): CapPos => s.cap ?? (s.k === "hero" ? "top" : s.k === "g" ? "bottom" : "center");

/* ------------------------------------------------------------ camera push-in */
/** Every shot: slow push-in (1 → 1.12) with a small sideways drift. */
const Push: React.FC<{ dur: number; idx: number; children: React.ReactNode } & Cam> = ({ dur, idx, zoom, focus, children }) => {
  const frame = useCurrentFrame();
  const { u } = useU();
  const z = zoom ?? [1, 1.12];
  const s = interpolate(frame, [0, dur], z, clamp);
  const x = interpolate(frame, [0, dur], [0, (idx % 2 ? -30 : 30) * u], clamp);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${s}) translateX(${x}px)`, transformOrigin: focus ?? "50% 50%" }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- media shot */
const MediaView: React.FC<{ s: MediaShot }> = ({ s }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { u, portrait } = useU();
  const wide = s.fit === "blur" && !portrait;
  const filter = [
    s.bw ? "grayscale(1) contrast(1.18) brightness(0.92)" : "contrast(1.06) saturate(1.06)",
    s.dim ? "brightness(0.38) blur(3px)" : "",
  ].join(" ");
  const local = (sec: number) => Math.round((sec - s.at) * fps);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ filter }}>
        {s.k === "vid" ? (
          <Video
            src={M(wide ? s.src.replace(".mp4", "-wide.mp4") : s.src)}
            trimBefore={s.trim ? Math.round(s.trim * fps) : undefined}
            muted
            objectFit="cover"
            style={{ width: "100%", height: "100%" }}
          />
        ) : (
          <Img src={M(s.src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: s.pos ?? "50% 50%" }} />
        )}
      </AbsoluteFill>
      {s.red ? (
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(215,38,43,0.55), rgba(90,0,0,0.75))", mixBlendMode: "multiply" }} />
      ) : null}
      <AbsoluteFill style={{ background: "linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0) 30%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.45))" }} />
      {s.label ? (
        <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "flex-start", padding: `${100 * u}px ${90 * u}px` }}>
          <div style={{ opacity: interpolate(frame, [4, 14], [0, 1], clamp), transform: `translateX(${interpolate(frame, [4, 14], [-50, 0], clamp) * u}px)` }}>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 40 * u, color: "#fff", letterSpacing: 6 * u, textShadow: "0 2px 12px #000" }}>{s.label.title}</div>
            <div style={{ height: 4 * u, width: interpolate(frame, [10, 26], [0, 360], clamp) * u, background: C.gold, margin: `${10 * u}px 0` }} />
            {s.label.sub ? <div style={{ fontFamily: MONO, fontSize: 24 * u, color: "#ddd", letterSpacing: 3 * u }}>{s.label.sub}</div> : null}
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

/* ------------------------------------------------------------ hero numbers */
const HeroText: React.FC<{ text: string; color: string; italic?: boolean }> = ({ text, color, italic }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { u, w: W } = useU();
  const p = spring({ frame, fps, config: { damping: 14 } });
  const size = Math.min(260 * u, (W * 0.82) / (text.length * 0.62));
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          fontFamily: DISPLAY,
          fontWeight: 800,
          fontStyle: italic ? "italic" : "normal",
          fontSize: size,
          letterSpacing: -0.02 * size,
          lineHeight: 1,
          color,
          opacity: interpolate(p, [0, 0.3], [0, 1], clamp),
          transform: `scale(${interpolate(p, [0, 1], [1.4, 1])})`,
          textShadow: `0 0 40px ${color === "#fff" ? "rgba(255,255,255,.7)" : "rgba(215,38,43,.7)"}, 0 0 120px rgba(255,255,255,.25)`,
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

const Hero: React.FC<{ s: HeroShot }> = ({ s }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    {/* a dim, blurred picture behind so the frame is never empty */}
    <AbsoluteFill style={{ filter: "blur(18px) brightness(0.22) grayscale(0.5)", transform: "scale(1.15)" }}>
      {s.bg.endsWith(".mp4") ? (
        <Video src={M(s.bg)} muted objectFit="cover" style={{ width: "100%", height: "100%" }} />
      ) : (
        <Img src={M(s.bg)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      )}
    </AbsoluteFill>
    <CameraMotionBlur shutterAngle={180} samples={8}>
      <HeroText text={s.text} color={s.color ?? "#fff"} italic={s.italic} />
    </CameraMotionBlur>
    <ScanLines opacity={0.18} gap={4} />
  </AbsoluteFill>
);

const ShotView: React.FC<{ s: Shot; dur: number; idx: number }> = ({ s, dur, idx }) => {
  const { fps } = useVideoConfig();
  let body: React.ReactNode;
  if (s.k === "img" || s.k === "vid") body = <MediaView s={s as MediaShot} />;
  else if (s.k === "hero") body = <Hero s={s as HeroShot} />;
  else {
    const g = s as GShot;
    const G = GRAPHICS[g.g];
    const mark = g.mark !== undefined ? (g.mark - g.at) * 30 : undefined; // graphics count 30 fps beats
    body = <G dur={(dur * 30) / fps} mark={mark} logo={g.logo} label={g.label} />;
  }
  return (
    <Push dur={dur} idx={idx} zoom={s.zoom} focus={s.focus}>
      {body}
    </Push>
  );
};

/* -------------------------------------------------------------------- audio */
type Cue = { at: number; src: string; vol: number };
const CUES: Cue[] = (() => {
  const c: Cue[] = [];
  SHOTS.forEach((s, i) => {
    if (i) c.push({ at: s.at - 0.08, src: "whoosh", vol: 0.1 });
    if (s.k === "hero") c.push({ at: s.at + 0.03, src: "impact", vol: 0.55 });
    if (s.k === "g" && (s.g === "logoPop" || s.g === "logoCard")) c.push({ at: s.at + 0.05, src: "tick", vol: 0.45 });
    if (s.k === "g" && (s.g === "strike" || s.g === "snap") && s.mark && s.zoom === undefined) c.push({ at: s.mark + 0.08, src: "stamp", vol: 0.6 });
    if (s.k === "img" && s.stamp) c.push({ at: s.stamp.at, src: "stamp", vol: 0.65 });
    if (s.k === "g" && s.g === "termSheet") c.push({ at: s.at + 0.15, src: "ding", vol: 0.3 });
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
  const { fps } = useVideoConfig();
  const total = totalFrames(fps);
  const starts = SHOTS.map((s) => Math.round(s.at * fps));
  const crazyStart = lineStart("crazy");
  const crazyEnd = lineStart("google");
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* Contiguous shots: shot i starts exactly on its word; each one runs TD frames into the next for the fade. */}
      <TransitionSeries>
        {SHOTS.map((s, i) => {
          const last = i === SHOTS.length - 1;
          const len = (last ? total : starts[i + 1]) - starts[i];
          const dur = last ? len : len + TD;
          return (
            <React.Fragment key={i}>
              <TransitionSeries.Sequence durationInFrames={dur} name={`${i + 1} ${s.k === "g" ? s.g : s.k === "hero" ? s.text : s.src}`}>
                <ShotView s={s} dur={dur} idx={i} />
              </TransitionSeries.Sequence>
              {!last ? <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: TD })} /> : null}
            </React.Fragment>
          );
        })}
      </TransitionSeries>
      {/* one grade over everything */}
      <Vignette strength={0.55} />
      <Grain opacity={0.08} />
      <Captions chunks={CHUNKS} posAt={(t) => capOf(shotAt(t))} />
      <Audio src={staticFile("meta-scale/vo.wav")} />
      <Audio
        src={staticFile("meta-scale/music.wav")}
        volume={(f) => {
          const t = f / fps;
          const duck = t > crazyStart - 0.2 && t < crazyEnd ? 0.35 : 1;
          return 0.16 * duck * interpolate(t, [TOTAL_SEC - 2, TOTAL_SEC], [1, 0], clamp);
        }}
      />
      {CUES.map((c, i) => (
        <Sequence key={i} from={Math.round(c.at * fps)} durationInFrames={2 * fps} layout="none" name={`sfx ${c.src}`}>
          <Audio src={staticFile(`sfx/${c.src}.wav`)} volume={c.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
