import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  BigType,
  Bust,
  C,
  Camera,
  CreamBG,
  DarkBG,
  DISPLAY,
  fmt,
  INOUT,
  MARKER,
  MONO,
  PostCard,
  prog,
  rnd,
  SANS,
  ScanLines,
  SERIF,
  Stamp,
  useU,
  Walker,
  clamp,
} from "./kit";
import { sceneWindow, sec, wordAt } from "./timeline";

/** Local frame (inside a scene) at which word i of line id starts. */
export const lf = (scene: string, id: string, i: number) => sec(wordAt(id, i) - sceneWindow(scene).start);

type SceneProps = { dur: number };

/* 1 ─ HOOK: the rejection post ------------------------------------------------ */
export const SHook1: React.FC<SceneProps> = ({ dur }) => {
  const f = useCurrentFrame();
  const { u, portrait } = useU();
  const rise = prog(f, 0, 18);
  return (
    <Camera dur={dur} from={1.0} to={1.12}>
      <DarkBG tint="#1a1a1d" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            translate: `0px ${interpolate(rise, [0, 1], [120, 0]) * u}px`,
            opacity: rise,
            rotate: "-2deg",
            filter: "grayscale(0.2)",
          }}
        >
          <PostCard
            name="Brian Acton"
            handle="@brianacton"
            initials="BA"
            text="Facebook turned me down. It was a great opportunity to connect with some fantastic people. Looking forward to life's next adventure."
            date="Aug 3, 2009"
          />
        </div>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", translate: `${(portrait ? 90 : 260) * u}px ${-40 * u}px` }}>
          <Stamp text="REJECTED" at={lf("hook1", "hook1", 3)} />
        </AbsoluteFill>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "rgba(0,0,0,0.12)" }} />
    </Camera>
  );
};

/* 2 ─ $19B giant type on cream -------------------------------------------------- */
export const SHook2: React.FC<SceneProps> = ({ dur }) => {
  const at = lf("hook2", "hook2", 5);
  return (
    <Camera dur={dur} from={1.0} to={1.04}>
      <CreamBG />
      <BigType text="$19,000,000,000" at={at} size={210} />
    </Camera>
  );
};

/* 3 ─ "His name is Brian Acton" — silhouette in an office --------------------- */
const Skyline: React.FC<{ seed: string; night?: boolean }> = ({ seed, night = true }) => {
  const { u, w, h } = useU();
  const n = 26;
  return (
    <AbsoluteFill
      style={{
        background: night
          ? "linear-gradient(#0d1424 0%, #1c2a44 55%, #3a3550 100%)"
          : "linear-gradient(#bcd3ea 0%, #e8eef4 70%)",
      }}
    >
      <svg width={w} height={h}>
        {Array.from({ length: n }).map((_, i) => {
          const bw = (w / n) * (0.8 + rnd(seed + i) * 0.6);
          const bh = h * (0.25 + rnd(seed + "h" + i) * 0.45);
          const x = (i / n) * w;
          return (
            <g key={i}>
              <rect x={x} y={h - bh} width={bw} height={bh} fill={night ? "#0a0f1a" : "#8fa4ba"} />
              {night
                ? Array.from({ length: 14 }).map((__, j) =>
                    rnd(seed + i + "w" + j) > 0.55 ? (
                      <rect
                        key={j}
                        x={x + 6 * u + (j % 3) * (bw / 3.4)}
                        y={h - bh + 14 * u + Math.floor(j / 3) * 26 * u}
                        width={8 * u}
                        height={12 * u}
                        fill="#f3d58a"
                        opacity={0.7}
                      />
                    ) : null,
                  )
                : null}
            </g>
          );
        })}
      </svg>
      {/* window mullions */}
      <AbsoluteFill
        style={{
          backgroundImage: `repeating-linear-gradient(90deg, rgba(0,0,0,0.85) 0px, rgba(0,0,0,0.85) ${10 * u}px, transparent ${10 * u}px, transparent ${w / 4}px)`,
        }}
      />
    </AbsoluteFill>
  );
};

export const SName: React.FC<SceneProps> = ({ dur }) => {
  const f = useCurrentFrame();
  const { u } = useU();
  const p = prog(f, 0, 14);
  const tag = prog(f, lf("name", "name", 3), lf("name", "name", 3) + 10);
  return (
    <Camera dur={dur} from={1.04} to={1.1}>
      <Skyline seed="sky" />
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center" }}>
        <div style={{ translate: `0px ${interpolate(p, [0, 1], [200, 0]) * u}px`, marginBottom: -20 * u, filter: `drop-shadow(0 0 ${30 * u}px rgba(243,213,138,0.35))` }}>
          <Bust label="BA" size={440} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "flex-start", padding: 90 * u }}>
        <div style={{ opacity: tag, translate: `${interpolate(tag, [0, 1], [-60, 0]) * u}px 0px` }}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 44 * u, color: "#fff", letterSpacing: 6 * u }}>
            BRIAN ACTON
          </div>
          <div style={{ height: 4 * u, width: 360 * u * tag, background: C.gold, margin: `${12 * u}px 0` }} />
          <div style={{ fontFamily: SANS, fontSize: 28 * u, color: "#cfcfcf" }}>ex-Yahoo engineer · age 37 in 2009</div>
        </div>
      </AbsoluteFill>
    </Camera>
  );
};

/* 4 ─ Twitter rejection ---------------------------------------------------------- */
export const STwitter: React.FC<SceneProps> = ({ dur }) => {
  const f = useCurrentFrame();
  const { u } = useU();
  const rise = prog(f, 0, 12);
  return (
    <Camera dur={dur} from={1.02} to={1.1} drift={[-30, 0]}>
      <CreamBG />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ rotate: "2deg", opacity: rise, translate: `${interpolate(rise, [0, 1], [200, 0]) * u}px 0px` }}>
          <PostCard
            dark={false}
            name="Brian Acton"
            handle="@brianacton"
            initials="BA"
            text="Got denied by Twitter HQ. That's ok. Would have been a long commute."
            date="May 23, 2009"
          />
        </div>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", translate: `${-170 * u}px ${110 * u}px` }}>
          <Stamp text="DENIED" at={lf("twitter", "twitter", 2)} rotate={8} />
        </AbsoluteFill>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "rgba(246,241,228,0.25)" }} />
    </Camera>
  );
};

/* 5 ─ Teams up with Jan Koum, builds an app ------------------------------------ */
const Phone: React.FC<{ appear: number }> = ({ appear }) => {
  const f = useCurrentFrame();
  const { u } = useU();
  const bubbles = [
    { me: false, t: "hey, is this thing working?" },
    { me: true, t: "yep. no ads. no games." },
    { me: false, t: "just messages?" },
    { me: true, t: "just messages." },
  ];
  return (
    <div
      style={{
        width: 400 * u,
        height: 800 * u,
        borderRadius: 60 * u,
        background: "#0a0a0a",
        padding: 16 * u,
        boxShadow: `0 ${40 * u}px ${100 * u}px rgba(0,0,0,0.6), inset 0 0 0 ${3 * u}px #2a2a2a`,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 46 * u,
          overflow: "hidden",
          background: "#ECE5DD",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ background: "#075E54", height: 120 * u, display: "flex", alignItems: "flex-end", padding: 22 * u, gap: 14 * u }}>
          <div style={{ width: 48 * u, height: 48 * u, borderRadius: "50%", background: "#cfd8dc" }} />
          <div style={{ color: "#fff", fontFamily: SANS, fontWeight: 600, fontSize: 26 * u, paddingBottom: 8 * u }}>Jan</div>
        </div>
        <div style={{ flex: 1, padding: 20 * u, display: "flex", flexDirection: "column", gap: 14 * u }}>
          {bubbles.map((b, i) => {
            const p = prog(f, appear + 8 + i * 9, appear + 14 + i * 9);
            return (
              <div
                key={i}
                style={{
                  alignSelf: b.me ? "flex-end" : "flex-start",
                  background: b.me ? "#DCF8C6" : "#fff",
                  borderRadius: 16 * u,
                  padding: `${12 * u}px ${18 * u}px`,
                  fontFamily: SANS,
                  fontSize: 24 * u,
                  color: "#111",
                  maxWidth: "80%",
                  opacity: p,
                  scale: String(interpolate(p, [0, 1], [0.8, 1])),
                  boxShadow: `0 ${2 * u}px ${3 * u}px rgba(0,0,0,0.12)`,
                }}
              >
                {b.t}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const SKoum: React.FC<SceneProps> = ({ dur }) => {
  const f = useCurrentFrame();
  const { u, portrait } = useU();
  const meet = prog(f, 0, 20);
  const phoneAt = lf("koum", "koum", 10);
  const ph = prog(f, phoneAt, phoneAt + 14);
  const sep = interpolate(meet, [0, 1], [700, 330]) * u;
  return (
    <Camera dur={dur} from={1.0} to={1.06}>
      <DarkBG tint="#1b2233" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: interpolate(ph, [0, 1], [1, 0.18]) }}>
        <div style={{ position: "absolute", translate: `${-sep}px ${portrait ? -120 * u : 0}px`, filter: `drop-shadow(0 0 ${26 * u}px rgba(217,178,107,0.45))` }}>
          <Bust label="BA" size={420} />
        </div>
        <div style={{ position: "absolute", translate: `${sep}px ${portrait ? -120 * u : 0}px`, filter: `drop-shadow(0 0 ${26 * u}px rgba(37,211,102,0.4))` }}>
          <Bust label="JK" size={420} disc="#1f3b2c" />
        </div>
        <div
          style={{
            position: "absolute",
            height: 4 * u,
            width: interpolate(prog(f, 12, 30), [0, 1], [0, 2 * sep - 380 * u]),
            background: C.gold,
            boxShadow: `0 0 ${20 * u}px ${C.gold}`,
            translate: `0px ${-130 * u}px`,
          }}
        />
        <div
          style={{
            position: "absolute",
            translate: `0px ${(portrait ? 300 : 330) * u}px`,
            display: "flex",
            gap: 2 * sep - 200 * u,
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 30 * u,
            color: "#ddd",
            letterSpacing: 4 * u,
            opacity: prog(f, 10, 24),
          }}
        >
          <span>BRIAN ACTON</span>
          <span>JAN KOUM</span>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            opacity: ph,
            translate: `0px ${interpolate(ph, [0, 1], [700, 0]) * u}px`,
            rotate: `${interpolate(ph, [0, 1], [8, -3])}deg`,
          }}
        >
          <Phone appear={phoneAt} />
        </div>
      </AbsoluteFill>
    </Camera>
  );
};

/* 6 ─ The note: No ads. No games. No gimmicks. --------------------------------- */
export const SRule: React.FC<SceneProps> = ({ dur }) => {
  const f = useCurrentFrame();
  const { u } = useU();
  const lines = [
    { t: "No Ads!", at: lf("rule", "rule", 0) },
    { t: "No Games!", at: lf("rule", "rule", 2) },
    { t: "No Gimmicks!", at: lf("rule", "rule", 4) },
  ];
  return (
    <Camera dur={dur} from={1.08} to={1.0}>
      {/* desk */}
      <AbsoluteFill
        style={{
          background:
            "repeating-linear-gradient(92deg, #6b4a2f 0px, #74502f 18px, #5f412a 40px, #6e4c30 70px), #6b4a2f",
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(255,210,150,0.25), rgba(0,0,0,0.6) 80%)" }} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            width: 760 * u,
            padding: `${70 * u}px ${80 * u}px`,
            background: "linear-gradient(#fffbe8, #fff3c4)",
            rotate: "-3deg",
            boxShadow: `0 ${30 * u}px ${70 * u}px rgba(0,0,0,0.5)`,
            backgroundImage: `repeating-linear-gradient(0deg, transparent 0px, transparent ${88 * u}px, rgba(90,140,200,0.35) ${88 * u}px, rgba(90,140,200,0.35) ${90 * u}px)`,
            backgroundColor: "#fff8dc",
          }}
        >
          {lines.map((l, i) => {
            const p = prog(f, l.at, l.at + 12, Easing.linear);
            return (
              <div key={i} style={{ position: "relative", height: 130 * u }}>
                <div
                  style={{
                    fontFamily: MARKER,
                    fontSize: 104 * u,
                    color: "#1b1b1b",
                    clipPath: `inset(-20% ${100 - p * 100}% -20% 0)`,
                    whiteSpace: "nowrap",
                  }}
                >
                  {l.t}
                </div>
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    bottom: 4 * u,
                    height: 8 * u,
                    borderRadius: 8 * u,
                    width: `${prog(f, l.at + 10, l.at + 18) * 92}%`,
                    background: C.red,
                    rotate: "-1deg",
                  }}
                />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </Camera>
  );
};

/* 7 ─ "They called it WhatsApp." ------------------------------------------------- */
export const SNamed: React.FC<SceneProps> = ({ dur }) => (
  <Camera dur={dur} from={1.0} to={1.05}>
    <CreamBG />
    <BigType text="WhatsApp." at={lf("named", "named", 3)} size={270} italic />
  </Camera>
);

/* 8 ─ 450M monthly users: dot globe + counter ---------------------------------- */
const Globe: React.FC<{ lit: number; r: number }> = ({ lit, r }) => {
  const f = useCurrentFrame();
  const rot = f * 0.012;
  const dots: React.ReactNode[] = [];
  let k = 0;
  for (let lat = -80; lat <= 80; lat += 8) {
    const cl = Math.cos((lat * Math.PI) / 180);
    const n = Math.max(6, Math.round(46 * cl));
    for (let j = 0; j < n; j++) {
      const lon = (j / n) * Math.PI * 2 + rot;
      const z = cl * Math.cos(lon);
      if (z < -0.05) continue;
      const x = r * cl * Math.sin(lon);
      const y = -r * Math.sin((lat * Math.PI) / 180);
      const on = rnd("g" + lat + "_" + j) < lit;
      k++;
      dots.push(
        <circle
          key={lat + "_" + j}
          cx={x}
          cy={y}
          r={(on ? 4.2 : 3) * (0.55 + 0.45 * z)}
          fill={on ? C.green : "#3b3b3b"}
          opacity={0.35 + 0.65 * z}
        />,
      );
    }
  }
  return (
    <svg width={r * 2.4} height={r * 2.4} viewBox={`${-r * 1.2} ${-r * 1.2} ${r * 2.4} ${r * 2.4}`}>
      <defs>
        <radialGradient id="gl">
          <stop offset="0" stopColor="rgba(37,211,102,0.25)" />
          <stop offset="1" stopColor="rgba(37,211,102,0)" />
        </radialGradient>
      </defs>
      <circle r={r * 1.15} fill="url(#gl)" opacity={lit} />
      {dots}
    </svg>
  );
};

export const SUsers: React.FC<SceneProps> = ({ dur }) => {
  const f = useCurrentFrame();
  const { u, portrait } = useU();
  const yearAt = lf("users", "users", 1);
  const cAt = lf("users", "users", 2);
  const yearOut = cAt - 2;
  const c = prog(f, cAt, cAt + 40, Easing.bezier(0.2, 0.7, 0.2, 1));
  return (
    <AbsoluteFill>
      <DarkBG tint="#0f1a14" />
      {f < yearOut ? (
        <AbsoluteFill style={{ background: C.cream }}>
          <BigType text="2014." at={yearAt} size={340} />
        </AbsoluteFill>
      ) : (
        <Camera dur={dur - yearOut} from={1.0} to={1.08}>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", translate: `0px ${(portrait ? -160 : -70) * u}px` }}>
            <Globe lit={c} r={(portrait ? 380 : 330) * u} />
          </AbsoluteFill>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", translate: `0px ${(portrait ? -160 : -70) * u}px` }}>
            <div
              style={{
                fontFamily: DISPLAY,
                fontWeight: 800,
                fontSize: 150 * u,
                color: "#fff",
                textShadow: `0 0 ${40 * u}px rgba(37,211,102,0.6), 0 ${6 * u}px ${30 * u}px #000`,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {fmt(450_000_000 * c)}
            </div>
          </AbsoluteFill>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", translate: `0px ${(portrait ? -30 : 50) * u}px` }}>
            <div style={{ fontFamily: MONO, fontSize: 32 * u, color: C.green, letterSpacing: 8 * u, opacity: c }}>
              MONTHLY ACTIVE USERS
            </div>
          </AbsoluteFill>
        </Camera>
      )}
    </AbsoluteFill>
  );
};

/* 9 ─ 55 employees: person grid ---------------------------------------------- */
export const SStaff: React.FC<SceneProps> = ({ dur }) => {
  const f = useCurrentFrame();
  const { u, portrait } = useU();
  const cols = portrait ? 7 : 11;
  const start = lf("staff", "staff", 2);
  const numAt = lf("staff", "staff", 7);
  const cell = (portrait ? 118 : 96) * u;
  const big = prog(f, numAt, numAt + 8);
  return (
    <Camera dur={dur} from={1.0} to={1.05}>
      <CreamBG />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, ${cell}px)`,
            gap: 14 * u,
            opacity: interpolate(big, [0, 1], [1, 0.25]),
          }}
        >
          {Array.from({ length: 55 }).map((_, i) => {
            const p = prog(f, start + i * 0.8, start + i * 0.8 + 6, Easing.bezier(0.3, 1.5, 0.5, 1));
            return (
              <svg key={i} width={cell} height={cell} viewBox="-50 -50 100 100" style={{ scale: String(p), opacity: p }}>
                <circle cx="0" cy="-18" r="17" fill={C.ink} />
                <path d="M -32 48 C -32 14, -16 6, 0 6 C 16 6, 32 14, 32 48 Z" fill={C.ink} />
              </svg>
            );
          })}
        </div>
      </AbsoluteFill>
      {f >= numAt - 6 ? (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 30 * u }}>
            <div style={{ position: "relative", width: 380 * u, height: 360 * u }}>
              <BigType text="55" at={numAt} size={360} color={C.red} scan={false} />
            </div>
            <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 96 * u, color: C.ink, opacity: big }}>
              employees.
            </div>
          </div>
        </AbsoluteFill>
      ) : null}
    </Camera>
  );
};

/* 10 ─ "Then Facebook came back." envelope ---------------------------------- */
export const SBack: React.FC<SceneProps> = ({ dur }) => {
  const f = useCurrentFrame();
  const { u } = useU();
  const p = prog(f, 0, 16);
  return (
    <Camera dur={dur} from={1.0} to={1.1}>
      <DarkBG tint="#14161c" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            width: 900 * u,
            height: 520 * u,
            background: "linear-gradient(160deg,#f3eee2,#ded5bf)",
            borderRadius: 10 * u,
            translate: `${interpolate(p, [0, 1], [-1400, 0]) * u}px 0px`,
            rotate: `${interpolate(p, [0, 1], [-14, -4])}deg`,
            boxShadow: `0 ${40 * u}px ${90 * u}px rgba(0,0,0,0.6)`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 900 520" preserveAspectRatio="none" style={{ position: "absolute" }}>
            <path d="M0 0 L450 290 L900 0" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="3" />
          </svg>
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 290 * u,
              translate: "-50% -50%",
              width: 140 * u,
              height: 140 * u,
              borderRadius: "50%",
              background: "radial-gradient(circle at 35% 35%, #4f6fd8, #1f3a9a)",
              boxShadow: `0 ${6 * u}px ${14 * u}px rgba(0,0,0,0.4)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(255,255,255,0.85)",
              fontFamily: DISPLAY,
              fontWeight: 800,
              fontSize: 40 * u,
            }}
          >
            $
          </div>
          <div
            style={{
              position: "absolute",
              left: 50 * u,
              bottom: 40 * u,
              fontFamily: MONO,
              fontSize: 26 * u,
              color: "#5b5444",
              letterSpacing: 4 * u,
            }}
          >
            CONFIDENTIAL · ACQUISITION OFFER
          </div>
        </div>
      </AbsoluteFill>
    </Camera>
  );
};

/* 11 ─ The offer document with highlighter ----------------------------------- */
const Scribble: React.FC<{ p: number; w: number }> = ({ p, w }) => (
  <svg width={w} height={w * 0.28} viewBox="0 0 300 84">
    <path
      d="M5 60 C 30 10, 50 10, 60 50 S 90 80, 110 30 S 150 20, 160 55 S 200 70, 220 35 S 260 40, 295 50"
      fill="none"
      stroke="#1d2a6b"
      strokeWidth="4"
      strokeLinecap="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - p}
    />
  </svg>
);

export const SOffer: React.FC<SceneProps> = ({ dur }) => {
  const f = useCurrentFrame();
  const { u, w, portrait } = useU();
  const hl = prog(f, 4, 16, INOUT);
  const row = (k: string, v: React.ReactNode, big = false) => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: `${1.5 * u}px solid #ddd6c6`,
        padding: `${16 * u}px 0`,
        fontFamily: SANS,
        fontSize: (big ? 40 : 28) * u,
        color: "#2a2a2a",
      }}
    >
      <span style={{ fontFamily: MONO, fontSize: 22 * u, color: "#7a7262", letterSpacing: 3 * u }}>{k}</span>
      {v}
    </div>
  );
  return (
    <Camera dur={dur} from={portrait ? 0.98 : 1.15} to={portrait ? 1.08 : 1.32} drift={portrait ? [0, 20] : [60, 30]}>
      <AbsoluteFill style={{ background: "linear-gradient(135deg,#2b2b2b,#0d0d0d)" }} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", perspective: 1800 * u }}>
        <div
          style={{
            width: Math.min(1000 * u, w * 0.9),
            background: C.paper,
            padding: `${60 * u}px ${70 * u}px`,
            transform: "rotateX(22deg) rotateZ(-5deg)",
            boxShadow: `0 ${50 * u}px ${120 * u}px rgba(0,0,0,0.7)`,
          }}
        >
          <div style={{ textAlign: "center", fontFamily: DISPLAY, fontWeight: 700, fontSize: 40 * u, letterSpacing: 8 * u, color: "#222" }}>
            ACQUISITION AGREEMENT
          </div>
          <div style={{ textAlign: "center", fontFamily: MONO, fontSize: 20 * u, color: "#8b8373", margin: `${10 * u}px 0 ${30 * u}px`, letterSpacing: 4 * u }}>
            SUMMARY OF TERMS
          </div>
          {row("PARTIES", <span>Facebook, Inc. · WhatsApp Inc.</span>)}
          {row("DATE", <span>February 19, 2014</span>)}
          {row(
            "PURCHASE PRICE",
            <span style={{ position: "relative", fontFamily: DISPLAY, fontWeight: 800, fontSize: 64 * u }}>
              <span
                style={{
                  position: "absolute",
                  inset: `${8 * u}px ${-10 * u}px`,
                  background: C.yellow,
                  transformOrigin: "left",
                  scale: `${hl} 1`,
                  zIndex: 0,
                  mixBlendMode: "multiply",
                }}
              />
              <span style={{ position: "relative" }}>$19,000,000,000</span>
            </span>,
            true,
          )}
          {row("STRUCTURE", <span>$4B cash · $12B stock · $3B RSUs</span>)}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 40 * u }}>
            {[0, 1].map((i) => (
              <div key={i} style={{ width: 380 * u }}>
                <Scribble p={prog(f, 14 + i * 10, 34 + i * 10, Easing.linear)} w={300 * u} />
                <div style={{ borderTop: `${2 * u}px solid #333`, fontFamily: MONO, fontSize: 18 * u, color: "#777", paddingTop: 8 * u }}>
                  {i === 0 ? "BUYER" : "SELLER"}
                </div>
              </div>
            ))}
          </div>
          <div style={{ fontFamily: MONO, fontSize: 14 * u, color: "#b0a894", marginTop: 20 * u }}>illustration</div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 40% 40%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.55) 100%)" }} />
    </Camera>
  );
};

/* 12 ─ $19B ÷ 55 = $345M ------------------------------------------------------- */
export const SPerHead: React.FC<SceneProps> = ({ dur }) => {
  const f = useCurrentFrame();
  const { u, portrait } = useU();
  const eq = prog(f, 0, 12);
  const at = lf("perhead", "perhead", 2);
  return (
    <AbsoluteFill>
      <DarkBG />
      <Camera dur={dur} from={1.0} to={1.06}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", translate: `0px ${(portrait ? -330 : -300) * u}px` }}>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 44 * u,
              color: "#9a9a9a",
              opacity: eq,
              letterSpacing: 2 * u,
            }}
          >
            $19,000,000,000 ÷ 55 =
          </div>
        </AbsoluteFill>
        <BigType text="$345M" at={at} size={portrait ? 300 : 340} color="#fff" glow scan />
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", translate: `0px ${(portrait ? 260 : 270) * u}px` }}>
          <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 70 * u, color: C.gold, opacity: prog(f, at + 18, at + 30) }}>
            per employee
          </div>
        </AbsoluteFill>
      </Camera>
    </AbsoluteFill>
  );
};

/* 13 ─ "And here's the crazy part." (caption-only on black) ------------------- */
export const SCrazy: React.FC<SceneProps> = () => <DarkBG tint="#0e0e0e" />;

/* 14 ─ "Acton didn't stay." — corridor walk-away ----------------------------- */
export const SStay: React.FC<SceneProps> = ({ dur }) => {
  const f = useCurrentFrame();
  const { u, w, h } = useU();
  const p = interpolate(f, [0, dur], [0, 1], clamp);
  const vx = w / 2;
  const vy = h * 0.46;
  return (
    <AbsoluteFill style={{ background: "#d9d6cf", filter: "grayscale(1) contrast(1.1)" }}>
      <svg width={w} height={h} style={{ position: "absolute" }}>
        <polygon points={`0,0 ${vx - 120 * u},${vy - 160 * u} ${vx - 120 * u},${vy + 160 * u} 0,${h}`} fill="#8e8a82" />
        <polygon points={`${w},0 ${vx + 120 * u},${vy - 160 * u} ${vx + 120 * u},${vy + 160 * u} ${w},${h}`} fill="#7c786f" />
        <polygon points={`0,0 ${w},0 ${vx + 120 * u},${vy - 160 * u} ${vx - 120 * u},${vy - 160 * u}`} fill="#b9b5ad" />
        <polygon points={`0,${h} ${w},${h} ${vx + 120 * u},${vy + 160 * u} ${vx - 120 * u},${vy + 160 * u}`} fill="#a19d94" />
        <rect x={vx - 120 * u} y={vy - 160 * u} width={240 * u} height={320 * u} fill="#f8f8f4" />
      </svg>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ translate: `0px ${interpolate(p, [0, 1], [260, 90]) * u}px` }}>
          <Walker h={interpolate(p, [0, 1], [760, 260], { easing: Easing.out(Easing.quad) }) * u} phase={f * 0.35} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: (vy - 220 * u) }}>
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 30 * u,
            color: "#fff",
            background: "#1b7b3a",
            padding: `${4 * u}px ${16 * u}px`,
            letterSpacing: 4 * u,
          }}
        >
          EXIT
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* 15 ─ 2017: walked away from $850M -------------------------------------------- */
export const SWalk: React.FC<SceneProps> = ({ dur }) => {
  const f = useCurrentFrame();
  const { u, w, portrait } = useU();
  const yearAt = lf("walk", "walk", 1);
  const certIn = lf("walk", "walk", 2) - 3;
  const stampAt = lf("walk", "walk", 9);
  const cp = prog(f, certIn, certIn + 16);
  const slide = prog(f, stampAt + 10, stampAt + 30, INOUT);
  if (f < certIn) {
    return (
      <AbsoluteFill style={{ background: C.cream }}>
        <BigType text="2017." at={yearAt} size={340} />
      </AbsoluteFill>
    );
  }
  return (
    <Camera dur={dur - certIn} from={1.05} to={1.12} drift={[0, -20]}>
      <AbsoluteFill
        style={{
          background:
            "repeating-linear-gradient(0deg, #3b2717 0px, #452d1a 22px, #352315 50px), #3b2717",
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(255,200,140,0.18), rgba(0,0,0,0.7) 85%)" }} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            width: Math.min(1040 * u, w * 0.9),
            padding: 22 * u,
            background: "#f4efdf",
            rotate: `${interpolate(cp, [0, 1], [12, 3]) + slide * 12}deg`,
            translate: `${interpolate(cp, [0, 1], [0, 0]) + slide * 1400 * u}px ${interpolate(cp, [0, 1], [900, 0]) * u}px`,
            boxShadow: `0 ${30 * u}px ${80 * u}px rgba(0,0,0,0.6)`,
          }}
        >
          <div
            style={{
              border: `${6 * u}px double #6f6a52`,
              padding: `${44 * u}px ${50 * u}px`,
              textAlign: "center",
              position: "relative",
            }}
          >
            <div style={{ fontFamily: MONO, fontSize: 22 * u, letterSpacing: 8 * u, color: "#6f6a52" }}>RESTRICTED STOCK · UNVESTED</div>
            <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: (portrait ? 96 : 120) * u, color: "#22301f", margin: `${16 * u}px 0` }}>
              $850,000,000
            </div>
            <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 42 * u, color: "#44402f" }}>
              payable to the holder, if he stays.
            </div>
            <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
              <Stamp text="FORFEITED" at={stampAt} size={110} />
            </AbsoluteFill>
          </div>
        </div>
      </AbsoluteFill>
    </Camera>
  );
};

/* 16 ─ 2018, posted three words ------------------------------------------------ */
export const STweet: React.FC<SceneProps> = ({ dur }) => {
  const f = useCurrentFrame();
  const { u } = useU();
  const yearAt = lf("tweet", "tweet", 2);
  const out = lf("tweet", "tweet", 3) - 1;
  if (f < out) {
    return (
      <AbsoluteFill style={{ background: C.cream }}>
        <BigType text="2018." at={yearAt} size={340} italic />
      </AbsoluteFill>
    );
  }
  const p = prog(f, out, out + 14);
  return (
    <Camera dur={dur - out} from={1.0} to={1.08}>
      <DarkBG tint="#101318" />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ opacity: p, translate: `0px ${interpolate(p, [0, 1], [80, 0]) * u}px` }}>
          <PostCard name="Brian Acton" handle="@brianacton" initials="BA" text="" typeFrom={9999} date="Mar 20, 2018" />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "rgba(0,0,0,0.3)" }} />
    </Camera>
  );
};

/* 17 ─ "It is time. #deletefacebook" typed ---------------------------------- */
export const SDelete: React.FC<SceneProps> = ({ dur }) => {
  const f = useCurrentFrame();
  const { portrait } = useU();
  const glow = prog(f, sec(1.0), sec(1.6));
  return (
    <Camera dur={dur} from={1.06} to={1.18}>
      <DarkBG tint="#1a0b0b" />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, rgba(215,38,43,${0.35 * glow}), rgba(0,0,0,0) 60%)` }} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", scale: portrait ? "1.05" : "1.3" }}>
        <PostCard
          name="Brian Acton"
          handle="@brianacton"
          initials="BA"
          text="It is time. #deletefacebook"
          typeFrom={0}
          typeCps={22}
          date="Mar 20, 2018"
        />
      </AbsoluteFill>
      <ScanLines opacity={0.12} />
    </Camera>
  );
};

/* 18 ─ Outro: who really won? ------------------------------------------------- */
export const SOutro1: React.FC<SceneProps> = () => <DarkBG tint="#121212" />;

export const SOutro2: React.FC<SceneProps> = ({ dur }) => {
  const f = useCurrentFrame();
  const { u, portrait } = useU();
  const l = prog(f, 0, 14);
  const r = prog(f, lf("outro2", "outro2", 6), lf("outro2", "outro2", 6) + 14);
  const q = prog(f, dur - sec(1.4), dur - sec(0.9));
  const half: React.CSSProperties = {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 30 * u,
    ...(portrait ? { left: 0, right: 0, height: "50%" } : { top: 0, bottom: 0, width: "50%" }),
  };
  return (
    <AbsoluteFill>
      <div style={{ ...half, ...(portrait ? { top: 0 } : { left: 0 }), background: "#0b0b0b", opacity: l }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 92 * u, color: "#fff", scale: String(interpolate(l, [0, 1], [1.2, 1])) }}>
          $19,000,000,000
        </div>
        <div style={{ fontFamily: MONO, fontSize: 26 * u, color: "#8a8a8a", letterSpacing: 6 * u }}>THE COMPANY THAT PAID</div>
      </div>
      <div style={{ ...half, ...(portrait ? { bottom: 0 } : { right: 0 }), background: C.cream, opacity: r }}>
        <div style={{ scale: String(interpolate(r, [0, 1], [1.15, 1])) }}>
          <Bust label="BA" size={portrait ? 360 : 400} />
        </div>
        <div style={{ fontFamily: MONO, fontSize: 26 * u, color: "#6c6656", letterSpacing: 6 * u }}>THE GUY THEY SAID NO TO</div>
      </div>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: q,
          background: `rgba(5,5,5,${0.75 * q})`,
        }}
      >
        <div style={{ fontFamily: DISPLAY, fontStyle: "italic", fontWeight: 800, fontSize: 420 * u, color: "#fff", scale: String(interpolate(q, [0, 1], [1.4, 1])) }}>
          ?
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ----------------------------------------------------------------- registry */
export const SCENES: Record<string, React.FC<SceneProps>> = {
  hook1: SHook1,
  hook2: SHook2,
  name: SName,
  twitter: STwitter,
  koum: SKoum,
  rule: SRule,
  named: SNamed,
  users: SUsers,
  staff: SStaff,
  back: SBack,
  offer: SOffer,
  perhead: SPerHead,
  crazy: SCrazy,
  stay: SStay,
  walk: SWalk,
  tweet: STweet,
  delete: SDelete,
  outro1: SOutro1,
  outro2: SOutro2,
};

/** Scene look: which caption colour + position to use, and which display tokens to hide. */
export const LOOK: Record<string, { tone: "light" | "dark"; pos: "center" | "low" | "top" | "off"; hide?: number[] }> = {
  hook1: { tone: "light", pos: "low" },
  hook2: { tone: "dark", pos: "top", hide: [5, 6, 7, 8, 9] },
  name: { tone: "light", pos: "top" },
  twitter: { tone: "dark", pos: "low" },
  koum: { tone: "light", pos: "top" },
  rule: { tone: "light", pos: "off" },
  named: { tone: "dark", pos: "top", hide: [3] },
  users: { tone: "light", pos: "low", hide: [0, 1, 2, 3] },
  staff: { tone: "dark", pos: "low", hide: [7, 8] },
  back: { tone: "light", pos: "low" },
  offer: { tone: "light", pos: "off" },
  perhead: { tone: "light", pos: "off" },
  crazy: { tone: "light", pos: "center" },
  stay: { tone: "light", pos: "low" },
  walk: { tone: "light", pos: "low", hide: [0, 1] },
  tweet: { tone: "light", pos: "low", hide: [0, 1, 2] },
  delete: { tone: "light", pos: "off" },
  outro1: { tone: "light", pos: "center" },
  outro2: { tone: "light", pos: "off" },
};
