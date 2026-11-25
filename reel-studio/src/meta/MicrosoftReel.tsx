import type { Line } from "../reel/timeline";
import enRaw from "../timelines/microsoft-openai.json";
import hiRaw from "../timelines/microsoft-openai-hi.json";
import hiBeats from "../../public/microsoft-openai-hi/beats.json";
import { makeMetaReel, type Shot, type Timing } from "./MetaReel";

/** Reel 4: "Microsoft's $13B Bet" (Microsoft x OpenAI). Classic look, same as reels 1–2 (set theme: "ticker" for the market-terminal look). */
type TLT = { duration: number; lines: Line[] };
const EN = enRaw as TLT;

const TAPE = "MICROSOFT × OPENAI   ▲   $1B IN 2019   ▲   $10B IN 2023   ▲   ~$13B COMMITTED   ▲   27% STAKE IN 2025   ▲   NON-PROFIT → FOR-PROFIT";

const shots = ({ w, at, lineStart }: Timing): Shot[] => [
  // "In 2019, Microsoft gave $1 billion... to a non-profit."
  { k: "img", src: "msft-stock.jpg", at: 0, zoom: [1.0, 1.12] },
  { k: "big", text: "$1,000,000,000", bg: "cream", at: at("hook1", 4), cap: "top" },
  { k: "img", src: "devday.jpg", at: at("hook1", 6), pos: "60% 40%" },
  // "Six years later, its stake was worth about $135 billion."
  { k: "img", src: "msft-courtyard.jpg", at: lineStart("hook2"), pos: "30% 62%", zoom: [1.1, 1.25] },
  { k: "big", text: "$135,000,000,000", bg: "cream", at: at("hook2", 8), cap: "top" },
  // "That non-profit was OpenAI."
  { k: "g", g: "logoPop", logo: "logo-openai.png", at: lineStart("name") },
  // "Started in 2015, to build AI that benefits all of humanity."
  { k: "big", text: "2015.", bg: "cream", at: lineStart("founded"), cap: "top" },
  { k: "img", src: "devday.jpg", at: at("founded", 3), bw: true, zoom: [1.25, 1.4] },
  // "But AI needs giant computers... and giant computers need money."
  { k: "g", g: "gpus", at: lineStart("compute"), cap: "low" },
  { k: "g", g: "fuel", at: at("compute", 5), cap: "low" },
  // "So Microsoft paid in cash, and in Azure cloud credits."
  { k: "vid", src: "nadella1.mp4", fit: "blur", zoom: [1.0, 1.06], at: lineStart("cash"), label: { title: "SATYA NADELLA", sub: "CEO, Microsoft" }, cap: "top" },
  { k: "g", g: "logoCard", logo: "logo-azure.png", label: "CLOUD CREDITS", at: at("cash", 7), cap: "low", tone: "dark" },
  // "Then in 2022, OpenAI launched ChatGPT... and the world changed overnight."
  { k: "big", text: "2022.", bg: "cream", at: lineStart("chatgpt"), cap: "top" },
  { k: "img", src: "ask-chatgpt.jpg", card: true, at: at("chatgpt", 4) },
  { k: "img", src: "devday.jpg", at: at("chatgpt", 6), zoom: [1.0, 1.15] },
  // "Microsoft went all in. $10 billion more, in 2023."
  { k: "vid", src: "nadella2.mp4", fit: "blur", zoom: [1.0, 1.06], at: lineStart("allin") },
  { k: "big", text: "$10,000,000,000", bg: "cream", at: at("allin", 4), cap: "top" },
  // "In total, about $13 billion."
  { k: "g", g: "handshake", logo: "logo-msft.png", logo2: "logo-openai.png", at: lineStart("total"), cap: "top" },
  { k: "big", text: "$13,000,000,000", bg: "cream", at: at("total", 3), cap: "top" },
  // "And here's the crazy part."
  { k: "g", g: "black", at: lineStart("crazy"), cap: "center" },
  // "In November 2023, the OpenAI board fired its own CEO, Sam Altman."
  { k: "img", src: "cnbc-fired.jpg", card: true, at: lineStart("fired") },
  { k: "vid", src: "altman1.mp4", at: at("fired", 10), label: { title: "SAM ALTMAN", sub: "CEO, OpenAI" }, cap: "top" },
  // "Within days, Microsoft said it would hire him... and hundreds of OpenAI employees threatened to follow."
  { k: "img", src: "nadella.jpg", card: true, at: lineStart("offer") },
  { k: "img", src: "devday.jpg", at: at("offer", 8), bw: true, pos: "30% 70%", zoom: [1.2, 1.35] },
  // "Five days later, Altman was back."
  { k: "g", g: "fiveDays", at: lineStart("back") },
  { k: "img", src: "cnbc-returns.jpg", card: true, at: at("back", 3) },
  // "In 2024, Microsoft officially listed OpenAI... as a competitor."
  { k: "img", src: "nadella-altman.jpg", card: true, at: lineStart("rival") },
  { k: "g", g: "rival", at: at("rival", 5), mark: w("rival", 5) + 0.6 },
  // "And in 2025, OpenAI became a for-profit public benefit company... and Microsoft kept 27%."
  { k: "g", g: "structure", at: lineStart("restructure") },
  { k: "big", text: "27%", bg: "cream", at: at("restructure", 13), cap: "top" },
  // "So did Microsoft win the AI race? Or did it pay $13 billion... to build its biggest rival?"
  { k: "vid", src: "altman2.mp4", at: lineStart("outro1") },
  { k: "vid", src: "nadella3.mp4", fit: "blur", zoom: [1.0, 1.06], at: at("outro1", 5) },
  { k: "g", g: "outro", img: "nadella-altman.jpg", label: "card", text: "$13,000,000,000", text2: "PARTNER... OR RIVAL?", at: lineStart("outro2"), cap: "low" },
];

const base = { theme: "classic" as const, tape: TAPE, shots };

export const MSFT_EN = makeMetaReel({
  ...base,
  tl: EN,
  base: EN,
  vo: "microsoft-openai/vo.wav",
  music: "microsoft-openai/music.wav",
  hide: { hook1: [4, 5], hook2: [8, 9], founded: [2], chatgpt: [2], allin: [4, 5], total: [3, 4], restructure: [13] },
});

export const MSFT_HI = makeMetaReel({
  ...base,
  tl: hiRaw as TLT,
  base: EN,
  vo: "microsoft-openai-hi/vo.wav",
  music: "microsoft-openai-hi/music.wav",
  beats: hiBeats.beats,
  // Hinglish captions; indices refer to script/microsoft-openai-hi.json `show`
  hide: { hook1: [4, 5], hook2: [9, 10, 13, 14, 15], founded: [0], chatgpt: [1], allin: [8, 9], total: [3, 4], restructure: [16] },
  map: {
    hook1: { 4: 4, 6: 7 }, // $1, ek
    hook2: { 8: 9 }, // $135
    founded: { 3: 4 }, // aisa
    compute: { 5: 7 }, // aur
    cash: { 7: 9 }, // Azure
    chatgpt: { 4: 6, 6: 8 }, // launch, aur
    allin: { 4: 8 }, // $10
    total: { 3: 3 }, // $13
    fired: { 10: 10 }, // Sam
    offer: { 8: 11 }, // aur
    back: { 3: 3 }, // Altman
    rival: { 5: 9 }, // apna
    restructure: { 13: 16 }, // 27%
    outro1: { 5: 4 }, // AI
  },
  extra: (hw) => [
    { k: "big", text: "₹12 lakh crore", bg: "cream", at: hw("hook2", 11) - 0.04, cap: "top" }, // Yaani
    { k: "vid", src: "altman3.mp4", at: hw("offer", 14) - 0.04 }, // saikdon
    { k: "img", src: "msft-courtyard.jpg", at: hw("restructure", 11) - 0.04, bw: true, pos: "30% 62%", zoom: [1.15, 1.3] }, // aur Microsoft
    { k: "img", src: "altman.jpg", at: hw("fired", 13) - 0.04, pos: "50% 20%", zoom: [1.0, 1.12] }, // nikaal
  ],
});
