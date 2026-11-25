import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { SStay } from "../reel/scenes";
import {
  Bust,
  C,
  clamp,
  CreamBG,
  DarkBG,
  DISPLAY,
  INOUT,
  MONO,
  prog,
  SANS,
  ScanLines,
  SERIF,
  useU,
} from "../reel/kit";

export const M = (f: string) => staticFile(`meta-scale/media/${f}`);
export type GProps = { dur: number; mark?: number; logo?: string; logo2?: string; label?: string; img?: string; text?: string; text2?: string };

/* Logo on cream; a red line strikes through it at `mark`. */
export const GStrikeLogo: React.FC<GProps> = ({ mark = 8, logo = "logo-scale.png", label }) => {
  const f = useCurrentFrame();
  const { u } = useU();
  const s = prog(f, mark, mark + 7, INOUT);
  const pop = prog(f, 0, 10, Easing.bezier(0.3, 1.4, 0.5, 1));
  return (
    <AbsoluteFill>
      <CreamBG />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ position: "relative", scale: String(interpolate(pop, [0, 1], [0.85, 1])), opacity: pop }}>
          <Img src={M(logo)} style={{ width: 820 * u, opacity: interpolate(s, [0, 1], [1, 0.35]) }} />
          <div
            style={{
              position: "absolute",
              left: -40 * u,
              top: "52%",
              height: 18 * u,
              width: `calc(${s * 100}% + ${80 * u * s}px)`,
              background: C.red,
              rotate: "-4deg",
              borderRadius: 9 * u,
              boxShadow: `0 ${4 * u}px ${14 * u}px rgba(215,38,43,0.4)`,
            }}
          />
          {label ? (
            <div style={{ textAlign: "center", fontFamily: MONO, fontSize: 30 * u, letterSpacing: 8 * u, color: "#6c6656", marginTop: 30 * u }}>
              {label}
            </div>
          ) : null}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* Logo card on cream with a small caption under it. */
export const GLogoCard: React.FC<GProps> = ({ logo = "logo-scale.png", label }) => {
  const f = useCurrentFrame();
  const { u } = useU();
  const pop = prog(f, 0, 12, Easing.bezier(0.3, 1.4, 0.5, 1));
  return (
    <AbsoluteFill>
      <CreamBG />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", translate: `0px ${-60 * u}px` }}>
        <div style={{ scale: String(interpolate(pop, [0, 1], [0.7, 1])), opacity: pop, textAlign: "center" }}>
          <Img src={M(logo)} style={{ width: 760 * u }} />
          {label ? (
            <div style={{ fontFamily: MONO, fontSize: 30 * u, letterSpacing: 8 * u, color: "#6c6656", marginTop: 40 * u, opacity: prog(f, 10, 20) }}>
              {label}
            </div>
          ) : null}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* Logo pops onto a white disc on a dark background with a pulse ring. */
export const GLogoPop: React.FC<GProps> = ({ logo = "logo-google.png" }) => {
  const f = useCurrentFrame();
  const { u } = useU();
  const pop = prog(f, 0, 9, Easing.bezier(0.3, 1.6, 0.5, 1));
  const ring = prog(f, 2, 22);
  return (
    <AbsoluteFill>
      <DarkBG tint="#1a1d24" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", translate: `0px ${-50 * u}px` }}>
        <div
          style={{
            position: "absolute",
            width: 560 * u,
            height: 560 * u,
            borderRadius: "50%",
            border: `${4 * u}px solid rgba(255,255,255,${0.5 * (1 - ring)})`,
            scale: String(interpolate(ring, [0, 1], [1, 1.6])),
          }}
        />
        <div
          style={{
            width: 520 * u,
            height: 520 * u,
            borderRadius: "50%",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            scale: String(pop),
            boxShadow: `0 0 ${80 * u}px rgba(255,255,255,0.25)`,
          }}
        >
          <Img src={M(logo)} style={{ width: 340 * u, height: 340 * u, objectFit: "contain" }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* Radar sweep for "the US military". */
export const GRadar: React.FC<GProps> = () => {
  const f = useCurrentFrame();
  const { u, w, h } = useU();
  const R = Math.min(w, h) * 0.42;
  const blips = [
    [0.3, 0.4],
    [-0.5, 0.2],
    [0.15, -0.6],
    [-0.25, -0.3],
    [0.62, -0.18],
  ];
  const ang = f * 7;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, #08170f, #020604 75%)" }}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ position: "relative", width: R * 2, height: R * 2 }}>
          {[1, 0.75, 0.5, 0.25].map((k) => (
            <div
              key={k}
              style={{
                position: "absolute",
                inset: (1 - k) * R,
                borderRadius: "50%",
                border: `${2 * u}px solid rgba(60,255,140,0.25)`,
              }}
            />
          ))}
          <div style={{ position: "absolute", left: 0, right: 0, top: R, height: 2 * u, background: "rgba(60,255,140,0.2)" }} />
          <div style={{ position: "absolute", top: 0, bottom: 0, left: R, width: 2 * u, background: "rgba(60,255,140,0.2)" }} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: `conic-gradient(from ${ang}deg, rgba(60,255,140,0.55), rgba(60,255,140,0) 70deg, rgba(0,0,0,0) 360deg)`,
            }}
          />
          {blips.map(([x, y], i) => {
            const a = ((Math.atan2(y, x) * 180) / Math.PI + 450) % 360;
            const since = (((ang - a) % 360) + 360) % 360;
            const o = interpolate(since, [0, 200], [1, 0.1], clamp);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: R + x * R - 9 * u,
                  top: R + y * R - 9 * u,
                  width: 18 * u,
                  height: 18 * u,
                  borderRadius: "50%",
                  background: "#5dff9d",
                  opacity: o,
                  boxShadow: `0 0 ${20 * u}px #5dff9d`,
                }}
              />
            );
          })}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 70 * u }}>
        <div style={{ fontFamily: MONO, fontSize: 34 * u, letterSpacing: 12 * u, color: "#5dff9d", opacity: prog(f, 4, 14) }}>
          US MILITARY
        </div>
      </AbsoluteFill>
      <ScanLines opacity={0.25} />
      <div style={{ position: "absolute", width: w, height: h, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

/* "Workers label the data": bounding boxes drawn over photos. */
export const GLabeling: React.FC<GProps> = () => {
  const f = useCurrentFrame();
  const { u, portrait } = useU();
  const tiles: { src: string; box: [number, number, number, number]; tag: string; pos?: string }[] = [
    { src: "meta-hq.jpg", box: [0.16, 0.1, 0.86, 0.8], tag: "building 0.98" },
    { src: "zuck-mwc.jpg", box: [0.12, 0.05, 0.88, 0.98], tag: "person 0.99", pos: "50% 20%" },
    { src: "google-nyt.jpg", box: [0.56, 0.35, 0.74, 0.8], tag: "person 0.91" },
    { src: "mit.jpg", box: [0.12, 0.05, 0.9, 0.9], tag: "building 0.96" },
  ];
  const cols = portrait ? 2 : 4;
  const tw = (portrait ? 440 : 400) * u;
  const th = (portrait ? 560 : 520) * u;
  return (
    <AbsoluteFill style={{ background: "#0b0c10" }}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", translate: `0px ${(portrait ? -120 : -50) * u}px` }}>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, ${tw}px)`, gap: 22 * u }}>
          {tiles.map((t, i) => {
            const a = 2 + i * 6;
            const p = prog(f, a, a + 8);
            const [x0, y0, x1, y1] = t.box;
            return (
              <div key={i} style={{ position: "relative", width: tw, height: th, overflow: "hidden", opacity: prog(f, i * 3, i * 3 + 6) }}>
                <Img src={M(t.src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: t.pos ?? "50% 50%", filter: "saturate(0.7)" }} />
                <div
                  style={{
                    position: "absolute",
                    left: `${x0 * 100}%`,
                    top: `${y0 * 100}%`,
                    width: `${(x1 - x0) * 100 * p}%`,
                    height: `${(y1 - y0) * 100 * p}%`,
                    border: `${4 * u}px solid ${C.green}`,
                    boxShadow: `0 0 ${12 * u}px rgba(37,211,102,0.6)`,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: `${x0 * 100}%`,
                    top: `calc(${y0 * 100}% - ${34 * u}px)`,
                    background: C.green,
                    color: "#062b14",
                    fontFamily: MONO,
                    fontSize: 22 * u,
                    padding: `${2 * u}px ${10 * u}px`,
                    opacity: prog(f, a + 6, a + 9),
                    whiteSpace: "nowrap",
                  }}
                >
                  {t.tag}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* Llama 4 card with a "reception" needle that drops at `mark` (the "shrug"). */
export const GLlama: React.FC<GProps> = ({ mark = 40 }) => {
  const f = useCurrentFrame();
  const { u } = useU();
  const inn = prog(f, 0, 12);
  const needle = interpolate(f, [0, 14, mark, mark + 10], [-80, 55, 55, -8], {
    ...clamp,
    easing: Easing.bezier(0.3, 1.3, 0.5, 1),
  });
  const R = 220 * u;
  return (
    <AbsoluteFill>
      <DarkBG tint="#141a2a" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", translate: `0px ${-40 * u}px` }}>
        <div
          style={{
            width: 900 * u,
            padding: `${50 * u}px ${60 * u}px`,
            borderRadius: 34 * u,
            background: "linear-gradient(160deg,#1d2640,#0e1322)",
            border: `${2 * u}px solid rgba(255,255,255,0.08)`,
            boxShadow: `0 ${40 * u}px ${100 * u}px rgba(0,0,0,0.6)`,
            opacity: inn,
            translate: `0px ${interpolate(inn, [0, 1], [80, 0]) * u}px`,
            textAlign: "center",
          }}
        >
          <div style={{ fontFamily: MONO, fontSize: 24 * u, letterSpacing: 8 * u, color: "#8fa2d8" }}>META · APRIL 2025</div>
          <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 130 * u, color: "#fff", lineHeight: 1.1 }}>Llama 4</div>
          <svg width={R * 2.2} height={R * 1.25} viewBox={`${-R * 1.1} ${-R * 1.1} ${R * 2.2} ${R * 1.25}`} style={{ marginTop: 10 * u }}>
            <path d={`M ${-R} 0 A ${R} ${R} 0 0 1 ${R} 0`} fill="none" stroke="#2c3657" strokeWidth={26 * u} strokeLinecap="round" />
            <path d={`M ${-R} 0 A ${R} ${R} 0 0 1 ${R * Math.cos(Math.PI / 3)} ${-R * Math.sin(Math.PI / 3)}`} fill="none" stroke="#4c6fff" strokeWidth={26 * u} strokeLinecap="round" opacity={0.35} />
            <g style={{ rotate: `${needle}deg` }}>
              <line x1={0} y1={0} x2={0} y2={-R * 0.92} stroke="#fff" strokeWidth={8 * u} strokeLinecap="round" />
            </g>
            <circle r={18 * u} fill="#fff" />
            <text x={-R} y={R * 0.12} textAnchor="middle" fill="#8fa2d8" fontFamily="JetBrains Mono" fontSize={22 * u}>MEH</text>
            <text x={R} y={R * 0.12} textAnchor="middle" fill="#8fa2d8" fontFamily="JetBrains Mono" fontSize={22 * u}>HYPE</text>
          </svg>
          <div style={{ fontFamily: MONO, fontSize: 26 * u, letterSpacing: 6 * u, color: "#c9d3f2", marginTop: 8 * u }}>RECEPTION</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* The AI race: three runners pull ahead, the Meta runner falls behind. */
export const GRace: React.FC<GProps> = ({ dur, label }) => {
  // label "labels": name the leaders and mark Meta falling behind (storyboard insert #3)
  const named = label === "labels";
  const NAMES = ["OPENAI", "GOOGLE", "", "ANTHROPIC"];
  const lead = (l: number) => interpolate(f, [0, dur], [0.05, 0.05 + (0.85 + l * 0.04) * 0.9], clamp);
  const f = useCurrentFrame();
  const { u, w } = useU();
  const lanes = [0, 1, 2, 3];
  const trackW = w * 0.8;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#0b0b0f,#15151c)" }}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", translate: `0px ${-110 * u}px` }}>
        <div style={{ width: trackW, display: "flex", flexDirection: "column", gap: 48 * u }}>
          <div style={{ fontFamily: MONO, fontSize: 30 * u, letterSpacing: 12 * u, color: "#9a9a9a", textAlign: "center" }}>THE AI RACE</div>
          {lanes.map((l) => {
            const meta = l === 2;
            const speed = meta ? 0.45 : 0.85 + l * 0.04;
            const x = interpolate(f, [0, dur], [0.05, 0.05 + speed * 0.9], clamp) * (trackW - 90 * u);
            return (
              <div key={l} style={{ position: "relative", height: 90 * u, borderBottom: `${2 * u}px dashed rgba(255,255,255,0.15)` }}>
                <div
                  style={{
                    position: "absolute",
                    left: x,
                    top: 0,
                    width: 90 * u,
                    height: 90 * u,
                    borderRadius: "50%",
                    background: meta ? "#fff" : "rgba(255,255,255,0.85)",
                    boxShadow: meta ? `0 0 ${30 * u}px rgba(215,38,43,0.8)` : `0 0 ${24 * u}px rgba(255,255,255,0.4)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: meta ? `${5 * u}px solid ${C.red}` : "none",
                  }}
                >
                  {meta ? <Img src={M("logo-meta.png")} style={{ width: 64 * u, height: 64 * u, objectFit: "contain", objectPosition: "0% 50%" }} /> : null}
                </div>
                {!meta ? (
                  <div style={{ position: "absolute", left: 0, top: 43 * u, height: 4 * u, width: x, background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.35))" }} />
                ) : null}
                {named && !meta ? (
                  <div style={{ position: "absolute", left: x + 110 * u, top: 26 * u, fontFamily: MONO, fontWeight: 700, fontSize: 30 * u, letterSpacing: 4 * u, color: "#F2F2F2", opacity: prog(f, 3, 10) }}>{NAMES[l]}</div>
                ) : null}
                {named && meta ? (
                  <>
                    <div style={{ position: "absolute", left: x + 100 * u, top: 43 * u, width: Math.max(0, (lead(1) * (trackW - 90 * u) - x - 100 * u) * prog(f, 4, 22)), height: 0, borderTop: `${3 * u}px dashed #E53935` }} />
                    <div style={{ position: "absolute", left: x + 100 * u, top: 28 * u, width: 3 * u, height: 34 * u, background: "#E53935", opacity: prog(f, 4, 8) }} />
                    <div style={{ position: "absolute", left: x + 100 * u + Math.max(0, (lead(1) * (trackW - 90 * u) - x - 100 * u) * prog(f, 4, 22)), top: 28 * u, width: 3 * u, height: 34 * u, background: "#E53935", opacity: prog(f, 4, 8) }} />
                    <div style={{ position: "absolute", left: x + 120 * u, top: -34 * u, padding: `${4 * u}px ${12 * u}px`, background: "#E53935", fontFamily: MONO, fontWeight: 700, fontSize: 22 * u, letterSpacing: 3 * u, color: "#fff", opacity: prog(f, 10, 18) }}>FALLING BEHIND</div>
                  </>
                ) : null}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* Logo-head handshake: Meta and Scale figures slide together. */
export const GHandshake: React.FC<GProps> = ({ logo = "logo-meta.png", logo2 = "logo-scale.png" }) => {
  const f = useCurrentFrame();
  const { u, portrait } = useU();
  const p = prog(f, 0, 14);
  const sep = interpolate(p, [0, 1], [760, portrait ? 250 : 300]) * u;
  return (
    <AbsoluteFill>
      <DarkBG tint="#1b2233" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", translate: `0px ${60 * u}px` }}>
        <div style={{ position: "absolute", translate: `${-sep}px 0px`, filter: `drop-shadow(0 0 ${26 * u}px rgba(80,140,255,0.45))` }}>
          <Bust label="" logo={M(logo)} size={portrait ? 380 : 430} />
        </div>
        <div style={{ position: "absolute", translate: `${sep}px 0px`, filter: `drop-shadow(0 0 ${26 * u}px rgba(200,90,255,0.45))` }}>
          <Bust label="" logo={M(logo2)} size={portrait ? 380 : 430} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* Term sheet with the 49% stake highlighted. */
export const GTermSheet: React.FC<GProps> = ({ dur }) => {
  const f = useCurrentFrame();
  const { u, w, portrait } = useU();
  const hl = prog(f, 3, 14, INOUT);
  const row = (k: string, v: React.ReactNode) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `${1.5 * u}px solid #ddd6c6`, padding: `${14 * u}px 0`, fontFamily: SANS, fontSize: 28 * u, color: "#2a2a2a" }}>
      <span style={{ fontFamily: MONO, fontSize: 22 * u, color: "#7a7262", letterSpacing: 3 * u }}>{k}</span>
      {v}
    </div>
  );
  const s = interpolate(f, [0, dur], portrait ? [1.0, 1.08] : [1.12, 1.28], clamp);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(135deg,#2b2b2b,#0d0d0d)" }}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", perspective: 1800 * u, scale: String(s) }}>
        <div style={{ width: Math.min(980 * u, w * 0.9), background: C.paper, padding: `${54 * u}px ${64 * u}px`, transform: "rotateX(20deg) rotateZ(-4deg)", boxShadow: `0 ${50 * u}px ${120 * u}px rgba(0,0,0,0.7)` }}>
          <div style={{ textAlign: "center", fontFamily: DISPLAY, fontWeight: 700, fontSize: 38 * u, letterSpacing: 8 * u, color: "#222" }}>INVESTMENT TERMS</div>
          <div style={{ textAlign: "center", fontFamily: MONO, fontSize: 18 * u, color: "#8b8373", margin: `${8 * u}px 0 ${26 * u}px`, letterSpacing: 4 * u }}>AS REPORTED · JUNE 2025</div>
          {row("INVESTOR", <span>Meta Platforms</span>)}
          {row("COMPANY", <span>Scale AI</span>)}
          {row(
            "STAKE",
            <span style={{ position: "relative", fontFamily: DISPLAY, fontWeight: 800, fontSize: 84 * u }}>
              <span style={{ position: "absolute", inset: `${10 * u}px ${-12 * u}px`, background: C.yellow, transformOrigin: "left", scale: `${hl} 1`, mixBlendMode: "multiply" }} />
              <span style={{ position: "relative" }}>49%</span>
            </span>,
          )}
          {row("AMOUNT", <span>$14.3 billion</span>)}
          {row("VALUATION", <span>$29 billion+</span>)}
          <div style={{ fontFamily: MONO, fontSize: 14 * u, color: "#b0a894", marginTop: 18 * u }}>illustration · figures as reported by Reuters</div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 40% 40%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.55) 100%)" }} />
    </AbsoluteFill>
  );
};

/* A quoted, attributed headline (not a fake screenshot). */
export const GQuote: React.FC<GProps> = ({ dur }) => {
  const f = useCurrentFrame();
  const { u, w } = useU();
  const inn = prog(f, 0, 10);
  const hl = prog(f, 14, 30, INOUT);
  return (
    <AbsoluteFill>
      <CreamBG />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", scale: String(interpolate(f, [0, dur], [1.0, 1.06], clamp)) }}>
        <div style={{ width: Math.min(1300 * u, w * 0.86), opacity: inn, translate: `0px ${interpolate(inn, [0, 1], [40, 0]) * u}px` }}>
          <div style={{ fontFamily: MONO, fontSize: 28 * u, letterSpacing: 6 * u, color: C.red, marginBottom: 24 * u }}>REUTERS · JUNE 14, 2025</div>
          <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 84 * u, lineHeight: 1.12, color: C.ink }}>
            “Google, Scale AI's largest customer,{" "}
            <span style={{ position: "relative", whiteSpace: "nowrap" }}>
              <span style={{ position: "absolute", inset: `${18 * u}px ${-8 * u}px ${4 * u}px`, background: C.yellow, transformOrigin: "left", scale: `${hl} 1`, mixBlendMode: "multiply" }} />
              <span style={{ position: "relative" }}>plans split</span>
            </span>{" "}
            after Meta deal”
          </div>
          <div style={{ height: 4 * u, width: 220 * u, background: C.ink, marginTop: 36 * u }} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* Google ↔ Scale link that snaps at `mark`. */
export const GSnap: React.FC<GProps> = ({ mark = 20, logo = "logo-google.png", logo2 = "logo-scale.png" }) => {
  const f = useCurrentFrame();
  const { u, portrait } = useU();
  const sn = prog(f, mark, mark + 12);
  const gap = (portrait ? 230 : 420) * u;
  const drift = sn * 120 * u;
  const disc = (logo: string, x: number) => (
    <div
      style={{
        position: "absolute",
        translate: `${x}px 0px`,
        width: 300 * u,
        height: 300 * u,
        borderRadius: "50%",
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `0 0 ${50 * u}px rgba(255,255,255,0.25)`,
      }}
    >
      <Img src={M(logo)} style={{ width: 210 * u, height: 210 * u, objectFit: "contain" }} />
    </div>
  );
  const half = gap - 150 * u;
  return (
    <AbsoluteFill>
      <DarkBG tint="#1a1a1a" />
      <AbsoluteFill style={{ background: `rgba(215,38,43,${0.35 * (1 - Math.abs(sn - 0.15) / 0.85) * (f >= mark ? 1 : 0)})` }} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", translate: `0px ${-60 * u}px` }}>
        {/* link: two halves that recoil after the snap */}
        <div style={{ position: "absolute", height: 8 * u, width: half, background: f < mark ? "#fff" : C.red, translate: `${-half / 2 - drift * 0.6}px 0px`, rotate: `${sn * -12}deg`, transformOrigin: "left", opacity: 1 - sn * 0.6 }} />
        <div style={{ position: "absolute", height: 8 * u, width: half, background: f < mark ? "#fff" : C.red, translate: `${half / 2 + drift * 0.6}px 0px`, rotate: `${sn * 12}deg`, transformOrigin: "right", opacity: 1 - sn * 0.6 }} />
        {disc(logo, -gap - drift)}
        {disc(logo2, gap + drift)}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* Split-screen ending: the person vs the price, then a giant "?". */
export const GOutro: React.FC<GProps> = ({ dur, img = "wang-redtie.jpg", text = "$14,300,000,000", label, text2 = "THE PERSON" }) => {
  // label "card": the photo is small, so show it as a framed print over a blurred copy instead of filling the half
  const card = label === "card";
  const f = useCurrentFrame();
  const { u, portrait } = useU();
  const l = prog(f, 0, 12);
  const r = prog(f, 10, 24);
  const q = prog(f, dur - 40, dur - 26);
  const half: React.CSSProperties = {
    position: "absolute",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 24 * u,
    ...(portrait ? { left: 0, right: 0, height: "50%" } : { top: 0, bottom: 0, width: "50%" }),
  };
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <div style={{ ...half, ...(portrait ? { top: 0 } : { left: 0 }), opacity: l }}>
        {card ? (
          <>
            <Img src={M(img)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", filter: "blur(28px) brightness(0.45)", scale: "1.2" }} />
            <Img
              src={M(img)}
              style={{ position: "relative", maxWidth: "72%", maxHeight: "56%", border: `${10 * u}px solid #f4f1ea`, boxShadow: `0 ${30 * u}px ${80 * u}px rgba(0,0,0,0.7)`, rotate: "-2deg", translate: `0px ${-90 * u}px`, filter: `grayscale(${1 - prog(f, 20, 60)})`, scale: String(interpolate(f, [0, dur], [1.0, 1.06], clamp)) }}
            />
          </>
        ) : (
          <Img
            src={M(img)}
            style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", objectPosition: "45% 35%", filter: `grayscale(${1 - prog(f, 20, 60)}) contrast(1.1)`, scale: String(interpolate(f, [0, dur], [1.05, 1.15], clamp)) }}
          />
        )}
        <div style={{ position: "absolute", top: 60 * u, fontFamily: MONO, fontSize: 30 * u, color: "#fff", letterSpacing: 6 * u, textShadow: "0 0 12px #000" }}>{text2}</div>
      </div>
      <div style={{ ...half, ...(portrait ? { bottom: 0 } : { right: 0 }), background: C.cream, opacity: r }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: Math.min(portrait ? 96 : 100, (portrait ? 1500 : 1150) / Math.max(1, text.length)) * u, color: C.ink, whiteSpace: "nowrap", scale: String(interpolate(r, [0, 1], [1.2, 1])) }}>{text}</div>
        <div style={{ fontFamily: MONO, fontSize: 26 * u, color: "#6c6656", letterSpacing: 6 * u }}>THE PRICE</div>
      </div>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: q, background: `rgba(5,5,5,${0.78 * q})` }}>
        <div style={{ fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 800, fontSize: 420 * u, color: "#fff", scale: String(interpolate(q, [0, 1], [1.4, 1])) }}>?</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const GCream: React.FC<GProps> = () => <CreamBG />;
export const GBlack: React.FC<GProps> = () => <DarkBG tint="#0e0e0e" />;


/* "Chat GPT": the T gets highlighted and labelled TRANSFORMER. */
export const GChatT: React.FC<GProps> = ({ mark = 18 }) => {
  const f = useCurrentFrame();
  const { u } = useU();
  const inn = prog(f, 0, 10);
  const hl = prog(f, mark, mark + 10, INOUT);
  return (
    <AbsoluteFill>
      <CreamBG />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", translate: `0px ${-40 * u}px` }}>
        <div style={{ position: "relative", fontFamily: DISPLAY, fontWeight: 800, fontSize: 240 * u, color: C.ink, opacity: inn, scale: String(interpolate(inn, [0, 1], [1.15, 1])) }}>
          <span style={{ opacity: interpolate(hl, [0, 1], [1, 0.35]) }}>ChatGP</span>
          <span style={{ position: "relative", color: interpolate(hl, [0, 1], [0, 1]) > 0.5 ? C.red : C.ink }}>
            <span style={{ position: "absolute", inset: `${40 * u}px ${-14 * u}px ${20 * u}px`, background: C.yellow, transformOrigin: "bottom", scale: `1 ${hl}`, mixBlendMode: "multiply", zIndex: -1 }} />
            T
          </span>
          <div style={{ position: "absolute", right: -10 * u, top: "100%", fontFamily: MONO, fontWeight: 500, fontSize: 34 * u, letterSpacing: 8 * u, color: C.red, opacity: hl, whiteSpace: "nowrap", translate: `0px ${interpolate(hl, [0, 1], [20, 0]) * u}px` }}>
            ↑ TRANSFORMER
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* Licence terms as reported (Google x Character.AI). */
export const GLicense: React.FC<GProps> = ({ dur }) => {
  const f = useCurrentFrame();
  const { u, w } = useU();
  const hl = prog(f, 6, 18, INOUT);
  const row = (k: string, v: React.ReactNode) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `${1.5 * u}px solid #ddd6c6`, padding: `${14 * u}px 0`, fontFamily: SANS, fontSize: 28 * u, color: "#2a2a2a" }}>
      <span style={{ fontFamily: MONO, fontSize: 22 * u, color: "#7a7262", letterSpacing: 3 * u }}>{k}</span>
      {v}
    </div>
  );
  return (
    <AbsoluteFill style={{ background: "linear-gradient(135deg,#2b2b2b,#0d0d0d)" }}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", perspective: 1800 * u, scale: String(interpolate(f, [0, dur], [1.05, 1.18], clamp)) }}>
        <div style={{ width: Math.min(980 * u, w * 0.9), background: C.paper, padding: `${54 * u}px ${64 * u}px`, transform: "rotateX(18deg) rotateZ(-3deg)", boxShadow: `0 ${50 * u}px ${120 * u}px rgba(0,0,0,0.7)` }}>
          <div style={{ textAlign: "center", fontFamily: DISPLAY, fontWeight: 700, fontSize: 38 * u, letterSpacing: 8 * u, color: "#222" }}>LICENSE AGREEMENT</div>
          <div style={{ textAlign: "center", fontFamily: MONO, fontSize: 18 * u, color: "#8b8373", margin: `${8 * u}px 0 ${26 * u}px`, letterSpacing: 4 * u }}>AS REPORTED · AUGUST 2024</div>
          {row("LICENSEE", <span>Google</span>)}
          {row("LICENSOR", <span>Character.AI</span>)}
          {row("TYPE", <span>Non-exclusive licence</span>)}
          {row(
            "AMOUNT",
            <span style={{ position: "relative", fontFamily: DISPLAY, fontWeight: 800, fontSize: 64 * u }}>
              <span style={{ position: "absolute", inset: `${8 * u}px ${-12 * u}px`, background: C.yellow, transformOrigin: "left", scale: `${hl} 1`, mixBlendMode: "multiply" }} />
              <span style={{ position: "relative" }}>~$2.7 billion</span>
            </span>,
          )}
          {row("ALSO", <span>Founders rejoin Google</span>)}
          <div style={{ fontFamily: MONO, fontSize: 14 * u, color: "#b0a894", marginTop: 18 * u }}>illustration · terms as reported by the Wall Street Journal</div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 40% 40%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.55) 100%)" }} />
    </AbsoluteFill>
  );
};

/* DOJ question over the Justice Department photo, with source and date. */
export const GDoj: React.FC<GProps> = ({ dur }) => {
  const f = useCurrentFrame();
  const { u, w } = useU();
  const inn = prog(f, 4, 14);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Img src={M("doj.jpg")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", filter: "blur(10px) grayscale(0.4) brightness(0.45)", scale: String(interpolate(f, [0, dur], [1.15, 1.25], clamp)) }} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ width: Math.min(1250 * u, w * 0.86), opacity: inn, translate: `0px ${interpolate(inn, [0, 1], [30, 0]) * u}px`, background: C.paper, padding: `${48 * u}px ${58 * u}px`, rotate: "-1.2deg", boxShadow: `0 ${40 * u}px ${100 * u}px rgba(0,0,0,0.7)` }}>
          <div style={{ fontFamily: MONO, fontSize: 26 * u, letterSpacing: 6 * u, color: C.red, marginBottom: 20 * u }}>BLOOMBERG LAW · MAY 2025 · AS REPORTED</div>
          <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 66 * u, lineHeight: 1.15, color: C.ink }}>
            US Justice Department examines whether the Character.AI deal was built to avoid merger review
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* Walking-away corridor, reused from the first reel. */
export const GWalk: React.FC<GProps> = ({ dur }) => <SStay dur={dur} />;


const termBg = (u: number) => (
  <>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 42%, #1c1c1c 0%, #050505 75%)", opacity: u > 0 ? 1 : 1 }} />
  </>
);

/* "5 DAYS": fired Nov 17 -> back Nov 22. */
export const GFiveDays: React.FC<GProps> = () => {
  const f = useCurrentFrame();
  const { u, w } = useU();
  const W = Math.min(1300 * u, w * 0.84);
  const p = prog(f, 6, 36, INOUT);
  const days = ["NOV 17", "18", "19", "20", "21", "NOV 22"];
  return (
    <AbsoluteFill>
      {termBg(u)}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", translate: `0px ${-60 * u}px` }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 170 * u, color: "#ffffff", textShadow: "0 0 30px rgba(217,178,107,0.45)", opacity: prog(f, 0, 8) }}>5 DAYS</div>
        <div style={{ position: "relative", width: W, height: 120 * u, marginTop: 30 * u }}>
          <div style={{ position: "absolute", top: 30 * u, left: 0, right: 0, height: 4 * u, background: "rgba(255,255,255,0.15)" }} />
          <div style={{ position: "absolute", top: 30 * u, left: 0, width: W * p, height: 4 * u, background: C.gold, boxShadow: "0 0 14px #D9B26B" }} />
          {days.map((d, i) => {
            const x = (i / 5) * W;
            const on = p >= i / 5 - 0.001;
            return (
              <div key={i} style={{ position: "absolute", left: x - 60 * u, width: 120 * u, textAlign: "center" }}>
                <div style={{ width: 22 * u, height: 22 * u, borderRadius: "50%", margin: `${21 * u}px auto 0`, background: on ? (i === 0 ? C.red : C.gold) : "#333" }} />
                <div style={{ fontFamily: MONO, fontSize: 22 * u, color: "#ddd", marginTop: 12 * u }}>{d}</div>
                {i === 0 ? <div style={{ fontFamily: MONO, fontSize: 24 * u, color: C.red, letterSpacing: 3 * u }}>FIRED</div> : null}
                {i === 5 ? <div style={{ fontFamily: MONO, fontSize: 24 * u, color: C.gold, letterSpacing: 3 * u, opacity: on ? 1 : 0 }}>BACK</div> : null}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* "PARTNER" struck through -> "COMPETITOR" (Microsoft FY2024 annual report). */
export const GRival: React.FC<GProps> = ({ mark = 14 }) => {
  const f = useCurrentFrame();
  const { u } = useU();
  const s = prog(f, mark, mark + 8, INOUT);
  const c = prog(f, mark + 6, mark + 16);
  return (
    <AbsoluteFill>
      {termBg(u)}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", translate: `0px ${-50 * u}px` }}>
        <div style={{ fontFamily: MONO, fontSize: 26 * u, letterSpacing: 6 * u, color: "#a9a39a", marginBottom: 24 * u }}>MICROSOFT ANNUAL REPORT · FY2024 · ON OPENAI</div>
        <div style={{ position: "relative", fontFamily: DISPLAY, fontWeight: 800, fontSize: 140 * u, color: "#ffffff", opacity: interpolate(s, [0, 1], [1, 0.4]) }}>
          PARTNER
          <div style={{ position: "absolute", left: -20 * u, top: "52%", height: 14 * u, width: `calc(${s * 100}% + ${40 * u * s}px)`, background: C.red, rotate: "-3deg", borderRadius: 7 * u }} />
        </div>
        <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 140 * u, color: C.red, opacity: c, scale: String(interpolate(c, [0, 1], [1.3, 1])), textShadow: "0 0 30px rgba(215,38,43,0.5)" }}>COMPETITOR</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* NON-PROFIT -> FOR-PROFIT PBC, Microsoft 27%. */
export const GStructure: React.FC<GProps> = () => {
  const f = useCurrentFrame();
  const { u } = useU();
  const a = prog(f, 0, 10);
  const b = prog(f, 12, 24);
  const box = (t: string, sub: string, col: string, o: number) => (
    <div style={{ opacity: o, padding: `${30 * u}px ${40 * u}px`, border: `${3 * u}px solid ${col}`, borderRadius: 18 * u, background: "rgba(0,0,0,0.4)", textAlign: "center", minWidth: 460 * u }}>
      <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 72 * u, color: "#ffffff" }}>{t}</div>
      <div style={{ fontFamily: MONO, fontSize: 22 * u, color: col, letterSpacing: 4 * u, marginTop: 8 * u }}>{sub}</div>
    </div>
  );
  return (
    <AbsoluteFill>
      {termBg(u)}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "row", gap: 50 * u, translate: `0px ${-50 * u}px` }}>
        {box("NON-PROFIT", "OPENAI · 2015", "#a9a39a", a)}
        <div style={{ fontFamily: DISPLAY, fontSize: 110 * u, color: C.gold, opacity: b }}>→</div>
        {box("FOR-PROFIT", "PUBLIC BENEFIT CORP · 2025", C.gold, b)}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};


/* One GPU chip, drawn in code: package, gold pins, die. `on` 0..1 lights it up. */
const Chip: React.FC<{ size: number; on: number; label?: boolean }> = ({ size, on, label }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.08,
      background: "linear-gradient(145deg, #2a2a2a, #121212)",
      border: `${Math.max(1, size * 0.02)}px solid rgba(217,178,107,${0.25 + 0.6 * on})`,
      boxShadow: on > 0 ? `0 0 ${size * 0.35 * on}px rgba(217,178,107,${0.55 * on})` : "none",
      position: "relative",
      flexShrink: 0,
    }}
  >
    {/* pins */}
    <div style={{ position: "absolute", inset: -size * 0.06, borderRadius: size * 0.1, background: `repeating-linear-gradient(90deg, rgba(217,178,107,0.55) 0 ${size * 0.03}px, transparent ${size * 0.03}px ${size * 0.075}px)`, zIndex: -1, opacity: 0.8 }} />
    {/* die */}
    <div
      style={{
        position: "absolute",
        inset: size * 0.2,
        borderRadius: size * 0.04,
        background: `linear-gradient(135deg, rgba(${Math.round(60 + 190 * on)},${Math.round(60 + 140 * on)},${Math.round(60 + 60 * on)},1), #1b1b1b)`,
        backgroundSize: "cover",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {label ? <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: size * 0.13, color: on > 0.5 ? "#141414" : "#888", letterSpacing: size * 0.01 }}>GPU</div> : null}
    </div>
  </div>
);

/* "AI needs giant computers": one chip -> the camera pulls back on a field of chips lighting up,
   counter to 10,000 GPUs (the Azure supercomputer Microsoft built for OpenAI, announced May 2020). */
export const GGpus: React.FC<GProps> = ({ dur }) => {
  const f = useCurrentFrame();
  const { u, w, h } = useU();
  const N = 29; // 29 x 29 grid, fills the frame when pulled back
  const cell = 150 * u;
  const pull = interpolate(f, [8, Math.max(20, dur - 10)], [0, 1], { ...clamp, easing: INOUT });
  const zoom = interpolate(pull, [0, 1], [3.2, 0.5]);
  const reach = interpolate(f, [4, dur - 6], [0, N * 0.75], clamp); // light-up wave radius in cells
  const count = Math.round(interpolate(f, [6, dur - 8], [1, 10000], { ...clamp, easing: Easing.in(Easing.cubic) }));
  const c = (N - 1) / 2;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #1a1712 0%, #050505 70%)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: w / 2 - (N * cell) / 2, top: h / 2 - (N * cell) / 2 - 40 * u, width: N * cell, height: N * cell, scale: String(zoom), rotate: `${interpolate(pull, [0, 1], [0, -5])}deg`, display: "grid", gridTemplateColumns: `repeat(${N}, ${cell}px)`, placeItems: "center" }}>
        {Array.from({ length: N * N }, (_, i) => {
          const d = Math.hypot((i % N) - c, Math.floor(i / N) - c);
          const on = Math.min(1, Math.max(0, reach - d + 1));
          return <Chip key={i} size={cell * 0.72} on={on} label={d === 0} />;
        })}
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.85) 100%)" }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 300 * u, background: "linear-gradient(rgba(5,5,5,0.92) 55%, rgba(5,5,5,0))" }} />
      <div style={{ position: "absolute", top: 60 * u, width: "100%", textAlign: "center", opacity: prog(f, 4, 12) }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 120 * u, color: "#fff", textShadow: "0 0 30px rgba(217,178,107,0.5)", fontVariantNumeric: "tabular-nums" }}>
          {count.toLocaleString("en-US")} <span style={{ color: C.gold }}>{count === 1 ? "GPU" : "GPUs"}</span>
        </div>
        <div style={{ fontFamily: MONO, fontSize: 24 * u, letterSpacing: 6 * u, color: "#a9a39a", marginTop: 6 * u }}>AZURE SUPERCOMPUTER FOR OPENAI · 2020</div>
      </div>
    </AbsoluteFill>
  );
};

/* "...and giant computers need money": bills fly into a glowing chip and burn up; a FUNDS meter drains to red. */
export const GFuel: React.FC<GProps> = ({ dur }) => {
  const f = useCurrentFrame();
  const { u, w, h } = useU();
  const cx = w / 2, cy = h / 2 - 40 * u;
  const fuel = interpolate(f, [6, dur - 8], [1, 0.06], { ...clamp, easing: Easing.in(Easing.quad) });
  const low = fuel < 0.25;
  const blink = low ? 0.55 + 0.45 * Math.sin(f * 0.9) : 1;
  const BILLS = 30;
  const hot = 0.6 + 0.4 * Math.sin(f * 0.5);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #1b1510 0%, #050505 72%)", overflow: "hidden" }}>
      {/* heat behind the chip */}
      <div style={{ position: "absolute", left: cx - 380 * u, top: cy - 380 * u, width: 760 * u, height: 760 * u, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,140,40,${0.28 * hot}) 0%, rgba(215,38,43,0.08) 45%, rgba(0,0,0,0) 70%)` }} />
      {Array.from({ length: BILLS }, (_, i) => {
        const t0 = 2 + i * ((dur - 16) / BILLS);
        const p = interpolate(f, [t0, t0 + 18], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
        if (p <= 0 || p >= 1) return null;
        const side = i % 2 ? 1 : -1;
        const sx = cx + side * (w * 0.55), sy = cy + ((i * 97) % 600 - 300) * u;
        const x = interpolate(p, [0, 1], [sx, cx]);
        const y = interpolate(p, [0, 1], [sy, cy]) - Math.sin(p * Math.PI) * 120 * u;
        return (
          <div key={i} style={{ position: "absolute", left: x - 130 * u, top: y - 59 * u, width: 260 * u, height: 118 * u, borderRadius: 8 * u, background: "linear-gradient(135deg, #8fbf8a, #3f7a47)", border: `${4 * u}px solid #d8ead2`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: DISPLAY, fontWeight: 800, fontSize: 60 * u, color: "#1e4424", rotate: `${side * (20 + p * 160) + i * 13}deg`, scale: String(interpolate(p, [0, 0.8, 1], [1, 0.7, 0.1])), opacity: interpolate(p, [0, 0.1, 0.85, 1], [0, 1, 1, 0]), boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
            $
          </div>
        );
      })}
      <div style={{ position: "absolute", left: cx - 190 * u, top: cy - 190 * u, scale: String(1 + 0.03 * Math.sin(f * 0.8)) }}>
        <Chip size={380 * u} on={0.85 + 0.15 * hot} label />
      </div>
      {/* FUNDS meter */}
      <div style={{ position: "absolute", right: 120 * u, top: cy - 260 * u, width: 70 * u, height: 520 * u, border: `${4 * u}px solid #555`, borderRadius: 14 * u, padding: 8 * u, display: "flex", alignItems: "flex-end", opacity: prog(f, 0, 10) }}>
        <div style={{ width: "100%", height: `${fuel * 100}%`, borderRadius: 8 * u, background: low ? C.red : fuel < 0.5 ? "#e0a030" : "#5fb86a", opacity: blink, boxShadow: low ? "0 0 24px rgba(215,38,43,0.7)" : "none" }} />
      </div>
      <div style={{ position: "absolute", right: 70 * u, width: 170 * u, top: cy + 280 * u, textAlign: "center", fontFamily: MONO, fontSize: 26 * u, letterSpacing: 4 * u, color: low ? C.red : "#a9a39a", opacity: prog(f, 0, 10) * (low ? blink : 1) }}>{low ? "LOW" : "FUNDS"}</div>
    </AbsoluteFill>
  );
};

export const GRAPHICS: Record<string, React.FC<GProps>> = {
  gpus: GGpus,
  fuel: GFuel,
  strike: GStrikeLogo,
  logoCard: GLogoCard,
  logoPop: GLogoPop,
  radar: GRadar,
  labeling: GLabeling,
  llama: GLlama,
  race: GRace,
  handshake: GHandshake,
  termSheet: GTermSheet,
  quote: GQuote,
  snap: GSnap,
  outro: GOutro,
  chatT: GChatT,
  license: GLicense,
  doj: GDoj,
  walk: GWalk,
  fiveDays: GFiveDays,
  rival: GRival,
  structure: GStructure,
  cream: GCream,
  black: GBlack,
};

export { SERIF };
