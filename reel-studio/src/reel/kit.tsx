import React from "react";
import { loadFont } from "@remotion/fonts";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/* ------------------------------------------------------------------ fonts */
const F = (family: string, file: string, weight = "400", style = "normal") =>
  loadFont({ family, url: staticFile(`fonts/${file}`), weight, style });
F("Instrument Serif", "instrument-serif-latin-400-normal.woff2");
F("Instrument Serif", "instrument-serif-latin-400-italic.woff2", "400", "italic");
for (const w of ["700", "800", "900"]) {
  F("Playfair Display", `playfair-display-latin-${w}-normal.woff2`, w);
  F("Playfair Display", `playfair-display-latin-${w}-italic.woff2`, w, "italic");
}
for (const w of ["400", "500", "600", "700"]) F("Inter", `inter-latin-${w}-normal.woff2`, w);
F("JetBrains Mono", "jetbrains-mono-latin-500-normal.woff2", "500");
F("Caveat", "caveat-latin-700-normal.woff2", "700");
F("Permanent Marker", "permanent-marker-latin-400-normal.woff2");
// Devanagari (and ₹) fallback for Hindi reels; Latin text keeps Instrument Serif / Playfair
F("Tiro Devanagari Hindi", "tiro-devanagari-hindi-devanagari-400-normal.woff2");
F("Tiro Devanagari Hindi", "tiro-devanagari-hindi-devanagari-400-italic.woff2", "400", "italic");

export const SERIF = "'Instrument Serif', 'Tiro Devanagari Hindi', serif";
export const DISPLAY = "'Playfair Display', 'Tiro Devanagari Hindi', serif";
export const SANS = "Inter, sans-serif";
export const MONO = "'JetBrains Mono', monospace";
export const HAND = "Caveat, cursive";
export const MARKER = "'Permanent Marker', cursive";

export const C = {
  ink: "#141414",
  cream: "#F6F1E4",
  paper: "#FBF8F1",
  black: "#050505",
  red: "#D7262B",
  yellow: "#FFD84D",
  green: "#25D366",
  gold: "#D9B26B",
  blue: "#3B5BDB",
};

/* ---------------------------------------------------------------- helpers */
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const INOUT = Easing.bezier(0.65, 0, 0.35, 1);

/** Scale unit: 1u = 1px on a 1080-short-side canvas. */
export const useU = () => {
  const { width, height } = useVideoConfig();
  return { u: Math.min(width, height) / 1080, w: width, h: height, portrait: height > width };
};

/** 0→1 progress between two frames with ease-out. */
export const prog = (f: number, a: number, b: number, ease = OUT) =>
  interpolate(f, [a, b], [0, 1], { ...clamp, easing: ease });

/* -------------------------------------------------------------- overlays */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.09 }) => {
  const f = useCurrentFrame();
  const seed = Math.floor(f / 2) % 12;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity, mixBlendMode: "overlay" }}>
      <svg width="100%" height="100%">
        <filter id={`g${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#g${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.55 }) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: `radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,${strength}) 100%)`,
    }}
  />
);

export const ScanLines: React.FC<{ color?: string; opacity?: number; gap?: number }> = ({
  color = "#000",
  opacity = 0.18,
  gap = 4,
}) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      opacity,
      backgroundImage: `repeating-linear-gradient(0deg, ${color} 0px, ${color} 1px, transparent 1px, transparent ${gap}px)`,
    }}
  />
);

/** Paper / cream background with soft fibre texture. */
export const CreamBG: React.FC<{ color?: string }> = ({ color = C.cream }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse at 50% 40%, #fffdf7 0%, ${color} 60%, #e9e1cc 100%)`,
    }}
  />
);

export const DarkBG: React.FC<{ tint?: string }> = ({ tint = "#151515" }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, ${tint} 0%, ${C.black} 75%)` }} />
);

/**
 * Smooth blur background: charcoal base with soft grey light patches that drift slowly,
 * heavily blurred, with fine monochrome film grain on top.
 * `seed` changes the layout so consecutive scenes don't look identical.
 */
export const SmoothBlur: React.FC<{ seed?: string; brightness?: number }> = ({ seed = "a", brightness = 1 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { w, h } = useU();
  const t = f / fps;
  const blobs = Array.from({ length: 6 }).map((_, i) => {
    const r = (k: string) => random(`${seed}-${i}-${k}`);
    const size = Math.max(w, h) * (0.35 + r("s") * 0.4);
    const x = w * (0.1 + r("x") * 0.8) + Math.sin(t * (0.25 + r("vx") * 0.3) + r("px") * 6.28) * w * 0.08;
    const y = h * (0.1 + r("y") * 0.8) + Math.cos(t * (0.2 + r("vy") * 0.3) + r("py") * 6.28) * h * 0.1;
    const light = (0.18 + r("l") * 0.34) * brightness;
    return { size, x, y, light };
  });
  const gs = Math.floor(f / 2) % 8;
  return (
    <AbsoluteFill style={{ background: "#1c1c1c", overflow: "hidden" }}>
      <AbsoluteFill style={{ filter: "blur(70px)", transform: "scale(1.15)" }}>
        {blobs.map((b, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: b.x - b.size / 2,
              top: b.y - b.size / 2,
              width: b.size,
              height: b.size,
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(210,210,210,${b.light}) 0%, rgba(160,160,160,${b.light * 0.45}) 40%, rgba(0,0,0,0) 70%)`,
            }}
          />
        ))}
        {/* a couple of darker pools for depth */}
        <div style={{ position: "absolute", left: w * 0.05, top: h * 0.45, width: w * 0.6, height: h * 0.5, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,0,0,0.55), rgba(0,0,0,0) 70%)" }} />
        <div style={{ position: "absolute", left: w * 0.55, top: h * 0.1, width: w * 0.45, height: h * 0.45, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,0,0,0.45), rgba(0,0,0,0) 70%)" }} />
      </AbsoluteFill>
      {/* fine film grain, like the reference image */}
      <AbsoluteFill style={{ opacity: 0.22, mixBlendMode: "overlay" }}>
        <svg width="100%" height="100%">
          <filter id={`sbg${gs}`}>
            <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed={gs} stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter={`url(#sbg${gs})`} />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Slow camera push + entrance punch shared by every scene. */
export const Camera: React.FC<{
  children: React.ReactNode;
  dur: number;
  from?: number;
  to?: number;
  drift?: [number, number];
}> = ({ children, dur, from = 1.0, to = 1.07, drift = [0, 0] }) => {
  const f = useCurrentFrame();
  const { u } = useU();
  const enter = prog(f, 0, 7);
  const s = interpolate(f, [0, dur], [from, to], clamp) * interpolate(enter, [0, 1], [1.08, 1]);
  const dx = interpolate(f, [0, dur], [0, drift[0] * u], clamp);
  const dy = interpolate(f, [0, dur], [0, drift[1] * u], clamp);
  return (
    <AbsoluteFill
      style={{
        scale: String(s),
        translate: `${dx}px ${dy}px`,
        filter: `blur(${interpolate(enter, [0, 1], [10, 0])}px) brightness(${interpolate(enter, [0, 1], [1.6, 1])})`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/* -------------------------------------------------------------- big type */
/** Giant serif word that streaks in with a horizontal motion blur, like "2016." in the refs. */
export const BigType: React.FC<{
  text: string;
  at: number; // frame it lands
  size?: number;
  color?: string;
  italic?: boolean;
  glow?: boolean;
  scan?: boolean;
  dir?: 1 | -1;
}> = ({ text, at, size = 330, color = C.ink, italic = false, glow = false, scan = true, dir = 1 }) => {
  const f = useCurrentFrame();
  const { u, w } = useU();
  // auto-fit: never wider than ~88% of the frame (Playfair 800 averages ~0.62em per glyph)
  size = Math.min(size, (w * 0.88) / (text.length * 0.62) / u);
  const p = prog(f, at - 6, at + 4, Easing.bezier(0.2, 0.9, 0.2, 1));
  const x = interpolate(p, [0, 1], [dir * 900, 0]) * u + interpolate(f, [at, at + 90], [0, -dir * 40 * u], clamp);
  const ghosts = [0, 1, 2, 3, 4];
  const style: React.CSSProperties = {
    fontFamily: DISPLAY,
    fontWeight: 800,
    fontStyle: italic ? "italic" : "normal",
    fontSize: size * u,
    letterSpacing: -0.03 * size * u,
    color,
    lineHeight: 1,
    whiteSpace: "nowrap",
    position: "absolute",
  };
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: f < at - 6 ? 0 : 1 }}>
      {ghosts.map((g) => (
        <div
          key={g}
          style={{
            ...style,
            translate: `${x + dir * g * (1 - p) * 120 * u}px 0px`,
            opacity: g === 0 ? 1 : (1 - p) * 0.35,
            filter: `blur(${g === 0 ? (1 - p) * 14 : 10}px)`,
            textShadow: glow ? `0 0 ${40 * u}px rgba(255,255,255,0.55), 0 0 ${120 * u}px rgba(255,255,255,0.25)` : undefined,
          }}
        >
          {text}
        </div>
      ))}
      {scan ? <ScanLines color={glow ? "#000" : C.cream} opacity={0.35} gap={Math.max(3, 5 * u)} /> : null}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ stamp */
export const Stamp: React.FC<{ text: string; at: number; color?: string; rotate?: number; size?: number }> = ({
  text,
  at,
  color = C.red,
  rotate = -12,
  size = 120,
}) => {
  const f = useCurrentFrame();
  const { u } = useU();
  const p = prog(f, at, at + 5, Easing.bezier(0.3, 1.4, 0.5, 1));
  if (f < at) return null;
  return (
    <div
      style={{
        position: "absolute",
        rotate: `${rotate}deg`,
        scale: String(interpolate(p, [0, 1], [2.4, 1])),
        opacity: interpolate(p, [0, 1], [0, 0.92]),
        border: `${8 * u}px solid ${color}`,
        borderRadius: 14 * u,
        padding: `${6 * u}px ${30 * u}px`,
        color,
        fontFamily: SANS,
        fontWeight: 700,
        letterSpacing: 0.12 * size * u,
        fontSize: size * u,
        mixBlendMode: "multiply",
        maskImage:
          "repeating-radial-gradient(circle at 30% 40%, #000 0px, #000 3px, rgba(0,0,0,0.55) 4px, #000 6px)",
      }}
    >
      {text}
    </div>
  );
};

/* ------------------------------------------------------------- post card */
export const PostCard: React.FC<{
  name: string;
  handle: string;
  initials: string;
  text: string;
  date: string;
  typeFrom?: number; // if set, text types out from this frame
  typeCps?: number;
  width?: number;
  dark?: boolean;
}> = ({ name, handle, initials, text, date, typeFrom, typeCps = 18, width = 980, dark = true }) => {
  const f = useCurrentFrame();
  const { u, w: fw } = useU();
  const shown =
    typeFrom === undefined ? text : text.slice(0, Math.max(0, Math.floor(((f - typeFrom) / 30) * typeCps)));
  const fg = dark ? "#E7E9EA" : "#0F1419";
  const sub = dark ? "#71767B" : "#536471";
  return (
    <div
      style={{
        width: Math.min(width * u, fw * 0.86),
        background: dark ? "#0b0b0c" : "#ffffff",
        border: `${1.5 * u}px solid ${dark ? "#2f3336" : "#e6e6e6"}`,
        borderRadius: 28 * u,
        padding: 44 * u,
        boxShadow: `0 ${40 * u}px ${120 * u}px rgba(0,0,0,0.55)`,
        fontFamily: SANS,
        color: fg,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 22 * u }}>
        <div
          style={{
            width: 92 * u,
            height: 92 * u,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#3a3a3a,#111)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 34 * u,
            color: "#fff",
          }}
        >
          {initials}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 36 * u }}>{name}</div>
          <div style={{ color: sub, fontSize: 30 * u }}>{handle}</div>
        </div>
      </div>
      <div style={{ fontSize: 46 * u, lineHeight: 1.3, marginTop: 30 * u, minHeight: 60 * u }}>
        {shown}
        {typeFrom !== undefined && shown.length < text.length && Math.floor(f / 8) % 2 === 0 ? (
          <span style={{ color: C.blue }}>|</span>
        ) : null}
      </div>
      <div style={{ color: sub, fontSize: 28 * u, marginTop: 26 * u }}>{date}</div>
    </div>
  );
};

/* ------------------------------------------------------------ silhouette */
/** Bust silhouette with a disc "head" carrying initials (the refs' logo-for-a-face trick). */
export const Bust: React.FC<{ label: string; size?: number; disc?: string; suit?: string; tie?: string; logo?: string }> = ({
  label,
  size = 520,
  disc = "#0a0a0a",
  suit = "#111",
  tie = "#1d1d1d",
  logo,
}) => {
  const { u } = useU();
  return (
    <svg width={size * u} height={size * 1.2 * u} viewBox="-260 -300 520 624" style={{ overflow: "visible" }}>
      <path d="M -250 324 C -250 150, -150 90, 0 90 C 150 90, 250 150, 250 324 Z" fill={suit} />
      <path d="M -70 92 L 0 210 L 70 92 Z" fill="#e9e9e9" />
      <path d="M -16 112 L 16 112 L 26 250 L 0 285 L -26 250 Z" fill={tie} />
      <path d="M -70 92 L -10 220 L -120 140 Z" fill="#0b0b0b" />
      <path d="M 70 92 L 10 220 L 120 140 Z" fill="#0b0b0b" />
      <circle cx="0" cy="-70" r="150" fill={logo ? "#fff" : disc} />
      <circle cx="0" cy="-70" r="150" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="3" />
      {logo ? (
        <image href={logo} x={-112} y={-182} width={224} height={224} preserveAspectRatio="xMidYMid meet" />
      ) : null}
      <text
        opacity={logo ? 0 : 1}
        x="0"
        y="-52"
        textAnchor="middle"
        fontFamily="Inter"
        fontWeight={700}
        fontSize="78"
        fill="#fff"
        letterSpacing="4"
      >
        {label}
      </text>
    </svg>
  );
};

/** Full-body silhouette used walking away. */
export const Walker: React.FC<{ h: number; phase: number }> = ({ h, phase }) => {
  const swing = Math.sin(phase) * 14;
  return (
    <svg width={h * 0.42} height={h} viewBox="-50 -10 100 240" style={{ overflow: "visible" }}>
      <circle cx="0" cy="14" r="16" fill="#000" />
      <rect x="-24" y="34" width="48" height="86" rx="18" fill="#000" />
      <rect x="-21" y="110" width="16" height="104" rx="8" fill="#000" style={{ rotate: `${swing}deg`, transformOrigin: "-13px 112px" }} />
      <rect x="5" y="110" width="16" height="104" rx="8" fill="#000" style={{ rotate: `${-swing}deg`, transformOrigin: "13px 112px" }} />
    </svg>
  );
};

/* -------------------------------------------------------------- counter */
export const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

/** Deterministic pseudo random helper. */
export const rnd = (s: string | number) => random(s);
