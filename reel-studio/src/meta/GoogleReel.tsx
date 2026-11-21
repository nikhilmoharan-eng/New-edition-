import type { Line } from "../reel/timeline";
import enRaw from "../timelines/google-shazeer.json";
import hiRaw from "../timelines/google-shazeer-hi.json";
import { makeMetaReel, type Shot, type Timing } from "./MetaReel";

/** Reel 3: "Google Rehires Its Quitter" ($2.7B for Noam Shazeer). Same engine and look as The $14B Hire. */
type TLT = { duration: number; lines: Line[] };
const EN = enRaw as TLT;

const shots = ({ w, at, lineStart }: Timing): Shot[] => [
  // "Google just paid $2.7 billion... to rehire one guy... who quit."
  { k: "img", src: "google-sign.jpg", at: 0, pos: "50% 40%", zoom: [1.0, 1.12] },
  { k: "big", text: "$2,700,000,000", bg: "cream", at: at("hook1", 3), cap: "top", tone: "dark" },
  { k: "img", src: "shazeer.jpg", card: true, at: at("hook2", 0) },
  { k: "g", g: "walk", at: at("hook2", 4) },
  // "His name is Noam Shazeer."
  { k: "img", src: "shazeer.jpg", card: true, at: lineStart("name"), label: { title: "NOAM SHAZEER", sub: "Co-author, “Attention Is All You Need”" }, cap: "top" },
  // "In 2017, he co-wrote the paper that invented the Transformer... the T in ChatGPT."
  { k: "big", text: "2017.", bg: "cream", at: lineStart("paper"), cap: "top", tone: "dark" },
  { k: "img", src: "attention.jpg", at: at("paper", 3), zoom: [1.05, 1.2] },
  { k: "g", g: "chatT", at: at("paper", 10), mark: w("paper", 11), cap: "top", tone: "dark" },
  // "At Google, he helped build a chatbot that could talk like a human. Years before ChatGPT."
  { k: "img", src: "google-nyt.jpg", at: lineStart("chatbot"), pos: "50% 50%" },
  { k: "vid", src: "servers1.mp4", at: at("chatbot", 6) },
  { k: "g", g: "logoPop", logo: "logo-openai.png", at: at("chatbot", 13) },
  // "But Google was afraid to launch it."
  { k: "img", src: "google-sign.jpg", at: lineStart("scared"), bw: true, zoom: [1.3, 1.45] },
  // "So in 2021, he quit... and started Character.AI."
  { k: "big", text: "2021.", bg: "cream", at: lineStart("quit"), cap: "top", tone: "dark" },
  { k: "g", g: "walk", at: at("quit", 3) },
  { k: "g", g: "logoPop", logo: "logo-cai.png", at: at("quit", 6) },
  // "Two years later, it was worth a billion dollars."
  { k: "g", g: "logoCard", logo: "logo-cai.png", label: "FOUNDED 2021 · VALUED AT $1B IN 2023", at: lineStart("billion"), cap: "low", tone: "dark" },
  { k: "big", text: "$1,000,000,000", bg: "cream", at: at("billion", 6), cap: "top", tone: "dark" },
  // "Then ChatGPT exploded... and Google was suddenly behind."
  { k: "g", g: "logoPop", logo: "logo-openai.png", at: lineStart("chatgpt") },
  { k: "img", src: "pichai.jpg", at: at("chatgpt", 3), bw: true, pos: "50% 30%" },
  // "So in 2024, Google paid about $2.7 billion... to license Character's tech, and bring Shazeer back."
  { k: "big", text: "2024.", bg: "cream", at: lineStart("deal"), cap: "top", tone: "dark" },
  { k: "g", g: "handshake", logo: "logo-google.png", logo2: "logo-cai.png", at: at("deal", 3), cap: "top" },
  { k: "g", g: "license", at: at("deal", 6) },
  { k: "img", src: "shazeer.jpg", card: true, at: at("deal", 12), stamp: { text: "REHIRED", at: w("deal", 14) + 0.1 } },
  // "And here's the crazy part."
  { k: "g", g: "black", at: lineStart("crazy"), cap: "center" },
  // "Google didn't buy the company. Character.AI kept running."
  { k: "img", src: "google-sign.jpg", at: lineStart("license"), bw: true, pos: "50% 40%", stamp: { text: "NOT ACQUIRED", at: w("license", 2) + 0.1 } },
  { k: "g", g: "logoCard", logo: "logo-cai.png", label: "STILL RUNNING", at: at("license", 5), cap: "low", tone: "dark" },
  // "And Google made Shazeer a co-lead of Gemini, its biggest AI bet."
  { k: "img", src: "shazeer.jpg", card: true, at: lineStart("lead"), label: { title: "NOAM SHAZEER", sub: "Co-lead, Gemini" }, cap: "top" },
  { k: "g", g: "logoCard", logo: "logo-gemini.png", label: "GOOGLE’S BIGGEST AI BET", at: at("lead", 7), cap: "low", tone: "dark" },
  // "Then the US Justice Department started asking... was this deal built to dodge merger rules?"
  { k: "img", src: "doj.jpg", card: true, at: lineStart("doj") },
  { k: "g", g: "doj", at: at("doj", 7), cap: "off" },
  // "Google didn't buy a startup. It bought back the man it let walk out."
  { k: "img", src: "google-nyt.jpg", at: lineStart("reframe"), bw: true, zoom: [1.0, 1.15] },
  { k: "img", src: "shazeer.jpg", card: true, at: at("reframe", 5), stamp: { text: "REHIRED", at: w("reframe", 6) + 0.15 } },
  // "So was he worth $2.7 billion? Or did Google just pay for its own mistake?"
  { k: "img", src: "shazeer.jpg", card: true, at: lineStart("outro1") },
  { k: "vid", src: "servers3.mp4", at: at("outro1", 4), bw: true },
  { k: "g", g: "outro", img: "shazeer.jpg", text: "$2,700,000,000", at: lineStart("outro2"), cap: "low" },
];

export const GOOGLE_EN = makeMetaReel({
  tl: EN,
  base: EN,
  vo: "google-shazeer/vo.wav",
  music: "google-shazeer/music.wav",
  shots,
  hide: { hook1: [3, 4], paper: [1], quit: [2], billion: [6, 7], deal: [2] },
});

export const GOOGLE_HI = makeMetaReel({
  tl: hiRaw as TLT,
  base: EN,
  vo: "google-shazeer-hi/vo.wav",
  music: "google-shazeer-hi/music.wav",
  shots,
  // Hinglish captions; indices refer to script/google-shazeer-hi.json `show`
  hide: { hook1: [3, 4, 8, 9], paper: [0], quit: [1], billion: [7, 8], deal: [1] },
  map: {
    hook1: { 3: 3 }, // $2.7
    hook2: { 0: 0, 4: 8 }, // Ek, jisne
    paper: { 3: 6, 10: 10, 11: 13 }, // likha, yaani, "T"
    chatbot: { 6: 5, 13: 17 }, // chatbot, ChatGPT
    quit: { 3: 3, 6: 8 }, // usne, shuru
    billion: { 6: 7 }, // $1
    chatgpt: { 3: 5 }, // aur
    deal: { 3: 3, 6: 6, 12: 16, 14: 17 }, // Google, $2.7, aur, Shazeer
    crazy: { 3: 5 }, // paagalpan
    license: { 2: 3, 5: 6 }, // khareedi, Character.AI
    lead: { 3: 3, 7: 10 }, // Shazeer, Gemini
    doj: { 7: 8 }, // kya
    reframe: { 5: 6 }, // Usne
    outro1: { 4: 5 }, // $2.7
  },
  extra: (hw) => [
    { k: "big", text: "₹22,000 crore", bg: "cream", at: hw("hook1", 6) - 0.04, cap: "top", tone: "dark" }, // yaani
    { k: "g", g: "logoPop", logo: "logo-cai.png", at: hw("deal", 9) - 0.04 }, // Character
    { k: "vid", src: "servers2.mp4", at: hw("chatbot", 10) - 0.04, bw: true }, // jo insaan...
    { k: "img", src: "pichai.jpg", at: hw("doj", 13) - 0.04, bw: true, pos: "50% 30%", zoom: [1.2, 1.35] }, // niyamon
  ],
});
