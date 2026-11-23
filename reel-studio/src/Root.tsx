import React from "react";
import { Composition, Folder } from "remotion";
import { Reel } from "./reel/Reel";
import { FPS, TOTAL_FRAMES } from "./reel/timeline";
import { MetaReel, TOTAL_FRAMES as META_FRAMES } from "./meta/MetaReel";
import { META_HI } from "./meta/MetaReelHi";
import { GOOGLE_EN, GOOGLE_HI } from "./meta/GoogleReel";
import { MSFT_EN, MSFT_HI } from "./meta/MicrosoftReel";

export const RemotionRoot: React.FC = () => (
  <>
    <Folder name="WhatsApp-19B">
      {/* Same 16:9 frame as the reference videos */}
      <Composition id="Reel16x9" component={Reel} width={1920} height={1080} fps={FPS} durationInFrames={TOTAL_FRAMES} />
      {/* Vertical version for Reels / Shorts / TikTok */}
      <Composition id="Reel9x16" component={Reel} width={1080} height={1920} fps={FPS} durationInFrames={TOTAL_FRAMES} />
    </Folder>
    <Folder name="Meta-Scale-14B">
      <Composition id="MetaScale16x9" component={MetaReel} width={1920} height={1080} fps={30} durationInFrames={META_FRAMES} />
      <Composition id="MetaScale9x16" component={MetaReel} width={1080} height={1920} fps={30} durationInFrames={META_FRAMES} />
    </Folder>
    <Folder name="Meta-Scale-14B-Hindi">
      <Composition id="MetaScaleHi16x9" component={META_HI.Reel} width={1920} height={1080} fps={30} durationInFrames={META_HI.totalFrames} />
      <Composition id="MetaScaleHi9x16" component={META_HI.Reel} width={1080} height={1920} fps={30} durationInFrames={META_HI.totalFrames} />
    </Folder>
    <Folder name="Google-Shazeer-27B">
      <Composition id="Google16x9" component={GOOGLE_EN.Reel} width={1920} height={1080} fps={30} durationInFrames={GOOGLE_EN.totalFrames} />
      <Composition id="GoogleHi16x9" component={GOOGLE_HI.Reel} width={1920} height={1080} fps={30} durationInFrames={GOOGLE_HI.totalFrames} />
    </Folder>
    <Folder name="Microsoft-OpenAI-13B">
      <Composition id="Msft16x9" component={MSFT_EN.Reel} width={1920} height={1080} fps={30} durationInFrames={MSFT_EN.totalFrames} />
      <Composition id="MsftHi16x9" component={MSFT_HI.Reel} width={1920} height={1080} fps={30} durationInFrames={MSFT_HI.totalFrames} />
    </Folder>
  </>
);
