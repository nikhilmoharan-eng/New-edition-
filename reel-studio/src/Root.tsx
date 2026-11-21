import React from "react";
import { Composition, Folder } from "remotion";
import { Reel } from "./reel/Reel";
import { FPS, TOTAL_FRAMES } from "./reel/timeline";
import { MetaReel, TOTAL_FRAMES as META_FRAMES } from "./meta/MetaReel";

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
  </>
);
