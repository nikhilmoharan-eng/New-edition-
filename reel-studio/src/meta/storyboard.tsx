import React from "react";
import { Video } from "@remotion/media";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, DISPLAY, MONO, prog, SANS, useU } from "../reel/kit";
import type { GProps } from "./graphics";
import { M } from "./graphics";

/*
 * Drop-in animations from the "Drop-In Animation Storyboard" (re-edit of The $14B Hire, Hindi).
 * Style guide: obsidian #0B0C0E, off-white #F2F2F2, green #00E676, red #E53935, gold #E6B800,
 * serif headlines + mono labels, everything in the top ~78% so the captions below stay clear.
 */
const S = { bg: "#0B0C0E", ink: "#F2F2F2", line: "rgba(255,255,255,0.18)", green: "#00E676", red: "#E53935", gold: "#E6B800" };
const Obsidian: React.FC = () => <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, ${S.bg} 0%, #050507 80%)` }} />;
const mono = (u: number, size: number, color = S.ink, ls = 4): React.CSSProperties => ({ fontFamily: MONO, fontSize: size * u, color, letterSpacing: ls * u, fontWeight: 700 });

/* #1 "Scale khud AI nahi banati, woh AI ko khaana khilaati hai": raw media -> green scanner -> AI model. */
export const GPipeline: React.FC<GProps> = ({ dur }) => {
  const f = useCurrentFrame();
  const { u, w } = useU();
  const y = 400 * u; // conveyor line (top part of the frame)
  const scanX = w * 0.5, sphereX = w * 0.82, CW = 150 * u, CH = 110 * u;
  const cards = ["IMG", "TXT", "VID", "AUD"];
  const travel = Math.max(40, Math.round(dur * 0.5));
  const gap = Math.max(8, Math.floor((dur - travel - 6) / cards.length));
  const hits = cards.filter((_, i) => f >= 2 + i * gap + travel).length;
  const lastHit = hits ? 2 + (hits - 1) * gap + travel : -99;
  const pulse = Math.max(0, 1 - (f - lastHit) / 12);
  const R = (110 + hits * 10 + pulse * 18) * u;
  return (
    <AbsoluteFill>
      <Obsidian />
      {/* conveyor */}
      <div style={{ position: "absolute", left: w * 0.03, width: sphereX - w * 0.03, top: y, borderTop: `${2 * u}px dotted ${S.line}`, opacity: prog(f, 0, 8) }} />
      {/* scanner */}
      <div style={{ position: "absolute", left: scanX - 3 * u, top: y - 230 * u, width: 6 * u, height: 460 * u, background: S.green, boxShadow: `0 0 ${30 * u}px ${S.green}, 0 0 ${80 * u}px rgba(0,230,118,0.5)`, opacity: prog(f, 0, 8) * (0.8 + 0.2 * Math.sin(f * 0.6)) }} />
      <div style={{ position: "absolute", left: scanX - 300 * u, width: 600 * u, textAlign: "center", top: y - 290 * u, ...mono(u, 26, S.green, 6), opacity: prog(f, 2, 10) }}>SCALE AI // LABELING</div>
      {/* AI model: wireframe sphere */}
      <svg style={{ position: "absolute", left: sphereX - 200 * u, top: y - 200 * u, width: 400 * u, height: 400 * u, overflow: "visible", opacity: prog(f, 0, 10) }}>
        <circle cx={200 * u} cy={200 * u} r={R} fill={`rgba(0,230,118,${0.06 + 0.04 * hits + 0.25 * pulse})`} stroke={S.green} strokeWidth={2 * u} style={{ filter: `drop-shadow(0 0 ${(10 + 30 * pulse) * u}px ${S.green})` }} />
        {[0, 1, 2, 3].map((k) => (
          <ellipse key={k} cx={200 * u} cy={200 * u} rx={R * Math.abs(Math.cos(f * 0.05 + (k * Math.PI) / 4))} ry={R} fill="none" stroke="rgba(0,230,118,0.45)" strokeWidth={1.5 * u} />
        ))}
        {[-0.5, 0, 0.5].map((k) => (
          <ellipse key={`h${k}`} cx={200 * u} cy={200 * u + k * R} rx={R * Math.sqrt(1 - k * k)} ry={R * 0.12} fill="none" stroke="rgba(0,230,118,0.35)" strokeWidth={1.5 * u} />
        ))}
      </svg>
      <div style={{ position: "absolute", left: sphereX - 200 * u, width: 400 * u, textAlign: "center", top: y + 170 * u, ...mono(u, 26, S.ink, 6), opacity: prog(f, 4, 12) }}>AI MODEL</div>
      {/* media cards */}
      {cards.map((c, i) => {
        const t0 = 2 + i * gap;
        const p = interpolate(f, [t0, t0 + travel], [0, 1], clamp);
        if (f < t0 || p >= 1) return null;
        const x = p < 0.6 ? interpolate(p, [0, 0.6], [w * 0.04, scanX]) : interpolate(p, [0.6, 1], [scanX, sphereX], { easing: Easing.in(Easing.cubic) });
        const labeled = x >= scanX - CW * 0.2;
        const shrink = interpolate(p, [0.85, 1], [1, 0.2], clamp);
        return (
          <div key={c} style={{ position: "absolute", left: x - CW / 2, top: y - CH / 2, width: CW, height: CH, scale: String(shrink), opacity: interpolate(p, [0, 0.06, 0.92, 1], [0, 1, 1, 0]) }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 10 * u, background: "#16181c", border: `${2 * u}px solid ${S.line}`, display: "flex", alignItems: "center", justifyContent: "center", ...mono(u, 30, labeled ? S.ink : "#8a8f98", 3) }}>{c}</div>
            {labeled ? (
              <>
                <div style={{ position: "absolute", inset: -10 * u, border: `${3 * u}px solid ${S.green}`, boxShadow: `0 0 ${16 * u}px rgba(0,230,118,0.6)` }} />
                <div style={{ position: "absolute", left: -10 * u, top: -44 * u, padding: `${3 * u}px ${8 * u}px`, background: S.green, ...mono(u, 18, "#04130b", 1) }}>{i % 2 ? "VERIFIED" : `0.9${8 + (i % 2)}`}</div>
              </>
            ) : null}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* #2 "...American sena ka AI train hota hai": Google, OpenAI, U.S. Military -> one trained AI. */
export const GClients: React.FC<GProps> = ({ dur }) => {
  const f = useCurrentFrame();
  const { u, w } = useU();
  const ys = [190, 380, 570].map((v) => v * u);
  const x0 = w * 0.3, cx = w * 0.72, cy = 380 * u;
  const names = ["GOOGLE", "OPENAI", "U.S. MILITARY"];
  const shoot = interpolate(f, [8, Math.max(16, dur - 14)], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const arrived = shoot >= 1;
  const ring = (k: number) => interpolate(f, [dur - 14 + k * 5, dur - 2 + k * 5], [0, 1], clamp);
  const bez = (t: number, y0: number) => {
    const p0 = [x0 + 150 * u, y0], p1 = [w * 0.5, y0], p2 = [w * 0.55, cy], p3 = [cx - 90 * u, cy];
    const m = 1 - t;
    return [0, 1].map((k) => m * m * m * p0[k] + 3 * m * m * t * p1[k] + 3 * m * t * t * p2[k] + t * t * t * p3[k]);
  };
  return (
    <AbsoluteFill>
      <Obsidian />
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        {ys.map((y0, i) => (
          <path key={i} d={`M ${x0 + 150 * u} ${y0} C ${w * 0.5} ${y0}, ${w * 0.55} ${cy}, ${cx - 90 * u} ${cy}`} fill="none" stroke={S.line} strokeWidth={2 * u} strokeDasharray={`${2000 * u}`} strokeDashoffset={2000 * u * (1 - prog(f, 0, 8))} />
        ))}
        {!arrived &&
          ys.map((y0, i) => {
            const [px, py] = bez(shoot, y0);
            return <circle key={i} cx={px} cy={py} r={12 * u} fill="#eafff3" style={{ filter: `drop-shadow(0 0 ${14 * u}px ${S.green})` }} />;
          })}
        {[0, 1].map((k) => (
          <circle key={k} cx={cx} cy={cy} r={(90 + 160 * ring(k)) * u} fill="none" stroke={S.green} strokeWidth={3 * u} opacity={ring(k) > 0 ? 1 - ring(k) : 0} />
        ))}
      </svg>
      {names.map((n, i) => (
        <div key={n} style={{ position: "absolute", left: x0 - 150 * u, top: ys[i] - 42 * u, width: 300 * u, height: 84 * u, borderRadius: 42 * u, border: `${2 * u}px solid rgba(255,255,255,0.5)`, background: "#121418", display: "flex", alignItems: "center", justifyContent: "center", ...mono(u, 28, S.ink, 4), opacity: prog(f, i * 2, i * 2 + 6), translate: `${interpolate(prog(f, i * 2, i * 2 + 6), [0, 1], [-40, 0]) * u}px 0px` }}>
          {n}
        </div>
      ))}
      <div style={{ position: "absolute", left: cx - 90 * u, top: cy - 90 * u, width: 180 * u, height: 180 * u, borderRadius: "50%", background: arrived ? "radial-gradient(circle, #eafff3, #00E676 60%, #0a5c33)" : "radial-gradient(circle, #1d3a2b, #0d1a13)", border: `${3 * u}px solid ${S.green}`, boxShadow: `0 0 ${(arrived ? 70 : 20) * u}px rgba(0,230,118,0.7)`, scale: String(arrived ? 1 + 0.1 * Math.max(0, 1 - ring(0) * 2) : 1) }} />
      <div style={{ position: "absolute", left: cx - 200 * u, width: 400 * u, textAlign: "center", top: cy + 120 * u, ...mono(u, 28, S.green, 6) }}>TRAINED AI</div>
    </AbsoluteFill>
  );
};

/* #4 "Aur ek mahine baad Scale ne apne 14% karmchaariyon ko nikaal diya": dim office + 100 people, 14 drop out. */
const Person: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 20 20">
    <circle cx="10" cy="5.5" r="3.6" fill={color} />
    <path d="M3.5 19 C3.5 12.5 6.5 10.5 10 10.5 C13.5 10.5 16.5 12.5 16.5 19 Z" fill={color} />
  </svg>
);
export const GLayoffs: React.FC<GProps> = ({ dur, mark = 60 }) => {
  const f = useCurrentFrame();
  const { u, w } = useU();
  const cell = 56 * u, gx = w * 0.17, gy = 230 * u;
  // the 14 that go: the right-most column plus the top 4 of the next one
  const gone = new Set<number>([...Array.from({ length: 10 }, (_, r) => r * 10 + 9), 8, 18, 28, 38]);
  const order = [...gone];
  const pct = Math.round(interpolate(f, [mark, mark + 40], [0, 14], clamp));
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ filter: "grayscale(1) brightness(0.35)" }}>
        <Video src={M("office1.mp4")} muted objectFit="cover" style={{ width: "100%", height: "100%" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 45% 40%, rgba(0,0,0,0.2), rgba(0,0,0,0.75))" }} />
      {/* badge */}
      <div style={{ position: "absolute", top: 80 * u, width: "100%", display: "flex", justifyContent: "center" }}>
        <div style={{ padding: `${10 * u}px ${28 * u}px`, border: `${2 * u}px solid rgba(255,255,255,0.5)`, borderRadius: 40 * u, background: "rgba(11,12,14,0.75)", ...mono(u, 28, S.ink, interpolate(prog(f, 0, 24), [0, 1], [16, 6])), opacity: prog(f, 0, 12) }}>[ +30 DAYS LATER ]</div>
      </div>
      {/* 10 x 10 workforce */}
      {Array.from({ length: 100 }, (_, i) => {
        const r = Math.floor(i / 10), c = i % 10;
        const appear = prog(f, 14 + (r + c) * 1.2, 22 + (r + c) * 1.2);
        const k = order.indexOf(i);
        const hit = k >= 0 ? interpolate(f, [mark + k * 2, mark + k * 2 + 6], [0, 1], clamp) : 0;
        const fall = k >= 0 ? interpolate(f, [mark + 14 + k * 2, mark + 34 + k * 2], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) }) : 0;
        return (
          <div key={i} style={{ position: "absolute", left: gx + c * cell, top: gy + r * cell + fall * 160 * u, opacity: appear * (1 - fall), scale: String(interpolate(appear, [0, 1], [0.5, 1])) }}>
            <Person size={cell * 0.82} color={hit > 0.5 ? S.red : "#F2F2F2"} />
            {hit > 0 ? <div style={{ position: "absolute", left: -4 * u, top: cell * 0.38, width: cell * 0.9 * hit, height: 4 * u, background: S.red, rotate: "-35deg", transformOrigin: "0 50%" }} /> : null}
          </div>
        );
      })}
      {/* counter */}
      <div style={{ position: "absolute", left: w * 0.6, top: 300 * u, opacity: prog(f, mark - 6, mark + 4) }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 230 * u, color: pct ? S.red : S.ink, lineHeight: 1, textShadow: pct ? "0 0 40px rgba(229,57,53,0.45)" : "none", fontVariantNumeric: "tabular-nums" }}>{pct ? `−${pct}%` : "0%"}</div>
        <div style={{ ...mono(u, 28, "#cfcfcf", 6), marginTop: 18 * u }}>WORKFORCE LAID OFF</div>
      </div>
    </AbsoluteFill>
  );
};

/* #5 "Aur uski keemat chukaayi... company ne": balance scale, 1 PERSON vs SCALE AI. */
export const GBalance: React.FC<GProps> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { u, w } = useU();
  const cx = w / 2, py = 260 * u, L = 480 * u;
  const draw = prog(f, 0, 14);
  const leftIn = spring({ frame: f - 10, fps, config: { damping: 14 } });
  const land = Math.round(dur * 0.38);
  const rightIn = spring({ frame: f - land + 8, fps, config: { damping: 16, stiffness: 160 } });
  const tilt = 16 * spring({ frame: f - land, fps, config: { damping: 7, stiffness: 120, mass: 1.1 } });
  const rad = (tilt * Math.PI) / 180;
  const end = (s: number) => [cx + s * L * Math.cos(rad), py + s * L * Math.sin(rad)];
  const [lx, ly] = end(-1), [rx, ry] = end(1);
  const pan = (x: number, y: number, children: React.ReactNode, key: string) => (
    <div key={key} style={{ position: "absolute", left: x - 180 * u, top: y, width: 360 * u, height: 230 * u, opacity: draw }}>
      <svg width={360 * u} height={230 * u} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <line x1={180 * u} y1={0} x2={25 * u} y2={200 * u} stroke={S.ink} strokeWidth={2 * u} />
        <line x1={180 * u} y1={0} x2={335 * u} y2={200 * u} stroke={S.ink} strokeWidth={2 * u} />
        <path d={`M ${10 * u} ${200 * u} Q ${180 * u} ${250 * u} ${350 * u} ${200 * u}`} fill="none" stroke={S.ink} strokeWidth={3 * u} />
      </svg>
      {/* the load sits in the pan, below the hanger lines */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 200 * u, display: "flex", justifyContent: "center" }}>
        <div style={{ translate: "0px -100%" }}>{children}</div>
      </div>
    </div>
  );
  const pill = (t: string, k: number) => {
    const p = spring({ frame: f - land - 6 - k * 5, fps, config: { damping: 12 } });
    return <div key={t} style={{ padding: `${8 * u}px ${18 * u}px`, borderRadius: 30 * u, background: S.red, ...mono(u, 26, "#fff", 2), scale: String(p), opacity: p }}>{t}</div>;
  };
  return (
    <AbsoluteFill>
      <Obsidian />
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        {/* fulcrum */}
        <path d={`M ${cx} ${py} L ${cx - 80 * u} ${py + 430 * u} L ${cx + 80 * u} ${py + 430 * u} Z`} fill="none" stroke={S.ink} strokeWidth={2 * u} strokeDasharray={1400 * u} strokeDashoffset={1400 * u * (1 - draw)} />
        <line x1={lx} y1={ly} x2={cx + (rx - cx) * draw} y2={py + (ry - py) * draw} stroke={S.ink} strokeWidth={3 * u} />
        <line x1={cx - (cx - lx) * draw} y1={py - (py - ly) * draw} x2={cx} y2={py} stroke={S.ink} strokeWidth={3 * u} />
        <circle cx={cx} cy={py} r={9 * u} fill={S.gold} />
      </svg>
      {pan(
        lx,
        ly,
        <div style={{ translate: `0px ${interpolate(leftIn, [0, 1], [-260, 0]) * u}px`, opacity: Math.min(1, leftIn * 2), padding: `${12 * u}px ${20 * u}px`, border: `${3 * u}px solid ${S.gold}`, borderRadius: 10 * u, background: "#15140f", display: "flex", alignItems: "center", gap: 10 * u, whiteSpace: "nowrap", ...mono(u, 30, S.gold, 3) }}>
          <Person size={40 * u} color={S.gold} />1 PERSON
        </div>,
        "l",
      )}
      {pan(
        rx,
        ry,
        <div style={{ translate: `0px ${interpolate(rightIn, [0, 1], [-420, 0]) * u}px`, opacity: Math.min(1, rightIn * 2), padding: `${22 * u}px ${30 * u}px`, borderRadius: 8 * u, background: "#e9e9e9", fontFamily: DISPLAY, fontWeight: 800, fontSize: 50 * u, color: "#111", whiteSpace: "nowrap" }}>SCALE AI</div>,
        "r",
      )}
      <div style={{ position: "absolute", left: rx - 170 * u, width: 340 * u, top: ry + 270 * u, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 * u }}>
        {pill("−$200M CLIENT", 0)}
        {pill("−14% WORKFORCE", 1)}
      </div>
    </AbsoluteFill>
  );
};


/* Reference-style press insert: a plain news article (no outlet branding), one phrase swept with a yellow marker.
   text = headline, text2 = the phrase to highlight (must appear in text), label = date kicker. */
export const GPress: React.FC<GProps> = ({ dur, text = "", text2 = "", label = "" }) => {
  const f = useCurrentFrame();
  const { u } = useU();
  const sweep = interpolate(f, [8, 20], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const i = text2 ? text.indexOf(text2) : -1;
  const [a, b, c] = i >= 0 ? [text.slice(0, i), text2, text.slice(i + text2.length)] : [text, "", ""];
  return (
    <AbsoluteFill style={{ background: "#d9d6cf", overflow: "hidden" }}>
      <AbsoluteFill style={{ scale: String(interpolate(f, [0, dur], [1.0, 1.07])), rotate: `${interpolate(f, [0, dur], [-1.2, 0.4])}deg`, justifyContent: "center", alignItems: "center" }}>
        <div style={{ width: 1300 * u, padding: `${70 * u}px ${90 * u}px`, background: "#ffffff", boxShadow: `0 ${30 * u}px ${90 * u}px rgba(0,0,0,0.25)`, translate: `0px ${-70 * u}px` }}>
          <div style={{ fontFamily: MONO, fontSize: 24 * u, letterSpacing: 4 * u, color: "#8a8a8a", marginBottom: 22 * u }}>{label}</div>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 76 * u, lineHeight: 1.12, color: "#111", letterSpacing: -1.5 * u }}>
            {a}
            <span style={{ backgroundImage: "linear-gradient(#F5C518, #F5C518)", backgroundRepeat: "no-repeat", backgroundSize: `${sweep * 100}% 88%`, backgroundPosition: "0 60%", padding: `0 ${4 * u}px` }}>{b}</span>
            {c}
          </div>
          {/* soft-focus body text */}
          <div style={{ marginTop: 36 * u, display: "flex", flexDirection: "column", gap: 16 * u, filter: `blur(${3 * u}px)`, opacity: 0.55 }}>
            {[96, 88, 93, 60].map((wd, k) => (
              <div key={k} style={{ height: 18 * u, width: `${wd}%`, background: "#9a9a9a", borderRadius: 4 * u }} />
            ))}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const STORYBOARD = {
  press: GPress, pipeline: GPipeline, clients: GClients, layoffs: GLayoffs, balance: GBalance };
