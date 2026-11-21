import React from "react";
import { Composition } from "remotion";
import { Reel } from "./reel/Reel";
import { FPS, TOTAL_FRAMES } from "./reel/timeline";

export const RemotionRoot: React.FC = () => (
  <>
    {/* Same 16:9 frame as the reference videos */}
    <Composition id="Reel16x9" component={Reel} width={1920} height={1080} fps={FPS} durationInFrames={TOTAL_FRAMES} />
    {/* Vertical version for Reels / Shorts / TikTok */}
    <Composition id="Reel9x16" component={Reel} width={1080} height={1920} fps={FPS} durationInFrames={TOTAL_FRAMES} />
  </>
);
