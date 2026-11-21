// node scripts/stills.mjs <compId> <outDir> <frame,frame,...> [scale]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
const [id, out, frames, scale = "0.5"] = process.argv.slice(2);
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const browserExecutable = process.env.REMOTION_CHROME || null;
const composition = await selectComposition({ serveUrl, id, browserExecutable });
for (const f of frames.split(",").map(Number)) {
  await renderStill({ serveUrl, composition, browserExecutable, frame: f, output: `${out}/${id}_${String(f).padStart(4, "0")}.jpg`, imageFormat: "jpeg", scale: Number(scale) });
  process.stdout.write(f + " ");
}
