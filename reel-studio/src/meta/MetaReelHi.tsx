import type { Line } from "../reel/timeline";
import hiRaw from "../timelines/meta-scale-hi.json";
import { makeMetaReel } from "./MetaReel";

/**
 * Hindi version of "The $14B Hire": same edit, timed to the Hindi ElevenLabs v3 voice.
 * Caption-word indices refer to the `show` text in script/meta-scale-hi.json.
 */
export const META_HI = makeMetaReel({
  tl: hiRaw as { duration: number; lines: Line[] },
  vo: "meta-scale-hi/vo.wav",
  music: "meta-scale-hi/music.wav",
  hide: {
    hook1: [5, 6, 11, 12, 13], // $14 बिलियन · ₹1.2 लाख करोड़
    hook2: [7], // 28
    origin: [0], // 19
    billionaire: [13], // बिलियनेयर
    deal: [5], // 49%
    google: [10, 11], // $200 मिलियन
    layoffs: [7], // 14%
  },
  // English word index -> Hindi caption-word index, so the big moments hit on the Hindi word
  map: {
    hook1: { 3: 3, 5: 5 }, // मेटा, $14
    hook2: { 0: 0, 3: 1, 4: 5, 6: 7 }, // किसी, कंपनी, सिर्फ़, 28
    origin: { 1: 0, 2: 5, 3: 7, 7: 9 }, // 19, उसने, छोड़, और
    feeds: { 4: 5 }, // वो
    labels: { 4: 2, 9: 7, 10: 8, 11: 9 }, // डेटा, Google, OpenAI, और
    billionaire: { 5: 8, 7: 13 }, // सबसे, बिलियनेयर
    llama: { 4: 5, 9: 9, 11: 14, 13: 19 }, // Llama, ख़ास, ज़करबर्ग, पीछे
    deal: { 3: 5, 6: 9, 12: 13 }, // 49%, और, नई
    crazy: { 3: 5 }, // पागलपन
    google: { 4: 6, 6: 10 }, // Google, $200
    split: { 7: 8, 10: 9 }, // Google, अलग
    layoffs: { 5: 7, 6: 8 }, // 14%, कर्मचारियों
    reframe: { 4: 2, 5: 5, 9: 8 }, // कंपनी, एक, और
    outro1: { 7: 7 }, // स्मार्ट
  },
  texts: { "billionaire.": "बिलियनेयर।" },
  // the Hindi hook also gives the rupee figure; Hindi lines run longer, so a few extra cuts keep the pace
  extra: (hw) => [
    { k: "big", text: "₹1.2 लाख करोड़", bg: "cream", at: hw("hook1", 9) - 0.04, cap: "top", tone: "dark" },
    { k: "img", src: "meta-hq.jpg", at: hw("hook1", 13) + 0.35, bw: true, pos: "42% 50%", zoom: [1.2, 1.35] },
    { k: "vid", src: "wang-yc3.mp4", at: hw("name", 3) - 0.04 }, // अलेक्ज़ेंडर
    { k: "vid", src: "wang-yc4.mp4", at: hw("origin", 13) - 0.04 }, // AI.
    { k: "vid", src: "servers2.mp4", at: hw("labels", 17) - 0.04, bw: true }, // ट्रेन
    { k: "img", src: "zuck-team.jpg", at: hw("why", 6) - 0.04, pos: "50% 45%", bw: true, zoom: [1.15, 1.3] }, // इतना
    { k: "img", src: "meta-hq.jpg", at: hw("llama", 12) - 0.04, bw: true, zoom: [1.3, 1.45] }, // आया।
    { k: "vid", src: "wang-yc3.mp4", at: hw("deal", 17) - 0.04 }, // कमान
    { k: "vid", src: "office2.mp4", at: hw("reframe", 12) - 0.04, red: true }, // कंपनी
  ],
});
