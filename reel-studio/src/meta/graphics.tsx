import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import {
  Bust,
  C,
  clamp,
  SmoothBlur,
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
export type GProps = { dur: number; mark?: number; logo?: string; label?: string };

/* Logo on the smooth blur; a red line strikes through it at `mark`. */
export const GStrikeLogo: React.FC<GProps> = ({ mark = 8, logo = "logo-scale.png", label }) => {
  const f = useCurrentFrame();
  const { u } = useU();
  const s = prog(f, mark, mark + 7, INOUT);
  const pop = prog(f, 0, 10, Easing.bezier(0.3, 1.4, 0.5, 1));
  return (
    <AbsoluteFill>
      <SmoothBlur seed="strike" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ position: "relative", scale: String(interpolate(pop, [0, 1], [0.85, 1])), opacity: pop, filter: `drop-shadow(0 0 ${36 * u}px rgba(255,255,255,0.35))` }}>
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
            <div style={{ textAlign: "center", fontFamily: MONO, fontSize: 30 * u, letterSpacing: 8 * u, color: "#d8d8d8", marginTop: 30 * u }}>
              {label}
            </div>
          ) : null}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* Logo card on the smooth blur with a small caption under it. */
export const GLogoCard: React.FC<GProps> = ({ logo = "logo-scale.png", label }) => {
  const f = useCurrentFrame();
  const { u } = useU();
  const pop = prog(f, 0, 12, Easing.bezier(0.3, 1.4, 0.5, 1));
  return (
    <AbsoluteFill>
      <SmoothBlur seed="logocard" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", translate: `0px ${-60 * u}px` }}>
        <div style={{ scale: String(interpolate(pop, [0, 1], [0.7, 1])), opacity: pop, textAlign: "center", filter: `drop-shadow(0 0 ${36 * u}px rgba(255,255,255,0.35))` }}>
          <Img src={M(logo)} style={{ width: 760 * u }} />
          {label ? (
            <div style={{ fontFamily: MONO, fontSize: 30 * u, letterSpacing: 8 * u, color: "#d8d8d8", marginTop: 40 * u, opacity: prog(f, 10, 20) }}>
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
      <SmoothBlur seed="pop" />
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
    <AbsoluteFill>
      <SmoothBlur seed="radar" brightness={0.8} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, rgba(10,60,30,0.55), rgba(0,10,4,0.35) 75%)", mixBlendMode: "multiply" }} />
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
    <AbsoluteFill>
      <SmoothBlur seed="label" brightness={0.8} />
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
      <SmoothBlur seed="llama" />
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
export const GRace: React.FC<GProps> = ({ dur }) => {
  const f = useCurrentFrame();
  const { u, w } = useU();
  const lanes = [0, 1, 2, 3];
  const trackW = w * 0.8;
  return (
    <AbsoluteFill>
      <SmoothBlur seed="race" brightness={0.85} />
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
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* Logo-head handshake: Meta and Scale figures slide together. */
export const GHandshake: React.FC<GProps> = () => {
  const f = useCurrentFrame();
  const { u, portrait } = useU();
  const p = prog(f, 0, 14);
  const sep = interpolate(p, [0, 1], [760, portrait ? 250 : 300]) * u;
  return (
    <AbsoluteFill>
      <SmoothBlur seed="hand" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", translate: `0px ${60 * u}px` }}>
        <div style={{ position: "absolute", translate: `${-sep}px 0px`, filter: `drop-shadow(0 0 ${26 * u}px rgba(80,140,255,0.45))` }}>
          <Bust label="" logo={M("logo-meta.png")} size={portrait ? 380 : 430} />
        </div>
        <div style={{ position: "absolute", translate: `${sep}px 0px`, filter: `drop-shadow(0 0 ${26 * u}px rgba(200,90,255,0.45))` }}>
          <Bust label="" logo={M("logo-scale.png")} size={portrait ? 380 : 430} />
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
    <AbsoluteFill>
      <SmoothBlur seed="terms" />
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
      <SmoothBlur seed="quote" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", scale: String(interpolate(f, [0, dur], [1.0, 1.06], clamp)) }}>
        <div style={{ width: Math.min(1300 * u, w * 0.86), opacity: inn, translate: `0px ${interpolate(inn, [0, 1], [40, 0]) * u}px`, background: C.paper, padding: `${50 * u}px ${60 * u}px`, rotate: "-1.5deg", boxShadow: `0 ${40 * u}px ${100 * u}px rgba(0,0,0,0.6)` }}>
          <div style={{ fontFamily: MONO, fontSize: 28 * u, letterSpacing: 6 * u, color: C.red, marginBottom: 24 * u }}>REUTERS · JUNE 14, 2025</div>
          <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 74 * u, lineHeight: 1.12, color: C.ink }}>
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
export const GSnap: React.FC<GProps> = ({ mark = 20 }) => {
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
      <SmoothBlur seed="snap" />
      <AbsoluteFill style={{ background: `rgba(215,38,43,${0.35 * (1 - Math.abs(sn - 0.15) / 0.85) * (f >= mark ? 1 : 0)})` }} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", translate: `0px ${-60 * u}px` }}>
        {/* link: two halves that recoil after the snap */}
        <div style={{ position: "absolute", height: 8 * u, width: half, background: f < mark ? "#fff" : C.red, translate: `${-half / 2 - drift * 0.6}px 0px`, rotate: `${sn * -12}deg`, transformOrigin: "left", opacity: 1 - sn * 0.6 }} />
        <div style={{ position: "absolute", height: 8 * u, width: half, background: f < mark ? "#fff" : C.red, translate: `${half / 2 + drift * 0.6}px 0px`, rotate: `${sn * 12}deg`, transformOrigin: "right", opacity: 1 - sn * 0.6 }} />
        {disc("logo-google.png", -gap - drift)}
        {disc("logo-scale.png", gap + drift)}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* Split-screen ending: the person vs the price, then a giant "?". */
export const GOutro: React.FC<GProps> = ({ dur }) => {
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
        <Img
          src={M("wang-redtie.jpg")}
          style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", objectPosition: "45% 35%", filter: `grayscale(${1 - prog(f, 20, 60)}) contrast(1.1)`, scale: String(interpolate(f, [0, dur], [1.05, 1.15], clamp)) }}
        />
        <div style={{ position: "absolute", bottom: 40 * u, fontFamily: MONO, fontSize: 26 * u, color: "#fff", letterSpacing: 6 * u, textShadow: "0 0 12px #000" }}>THE PERSON</div>
      </div>
      <div style={{ ...half, ...(portrait ? { bottom: 0 } : { right: 0 }), opacity: r }}>
        <AbsoluteFill>
          <SmoothBlur seed="outro" />
        </AbsoluteFill>
        <div style={{ position: "relative", fontFamily: DISPLAY, fontWeight: 800, fontSize: (portrait ? 96 : 100) * u, color: "#fff", scale: String(interpolate(r, [0, 1], [1.2, 1])), textShadow: "0 0 30px rgba(255,255,255,.55)" }}>$14,300,000,000</div>
        <div style={{ position: "relative", fontFamily: MONO, fontSize: 26 * u, color: "#d8d8d8", letterSpacing: 6 * u }}>THE PRICE</div>
      </div>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: q, background: `rgba(5,5,5,${0.78 * q})` }}>
        <div style={{ fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 800, fontSize: 420 * u, color: "#fff", scale: String(interpolate(q, [0, 1], [1.4, 1])) }}>?</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const GCream: React.FC<GProps> = () => <SmoothBlur seed="why" />;
export const GBlack: React.FC<GProps> = () => <SmoothBlur seed="black" />;

export const GRAPHICS: Record<string, React.FC<GProps>> = {
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
  cream: GCream,
  black: GBlack,
};

export { SERIF };
