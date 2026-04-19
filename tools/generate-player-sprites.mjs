import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  createPlayerAssetManifest,
  createPlayerMotionSet,
} from '../src/scripts/player-sprite-data.mjs';
import { encodePng, renderSpriteFrame } from '../src/scripts/player-sprite-renderer.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const outputDirectory = path.join(repoRoot, 'assets', 'sprites', 'player');

async function generateSprites() {
  const motionSet = createPlayerMotionSet();
  const manifest = createPlayerAssetManifest();

  await mkdir(outputDirectory, { recursive: true });

  for (const motion of Object.values(motionSet)) {
    for (const frame of motion.frames) {
      const renderResult = renderSpriteFrame(frame);
      const pngBytes = encodePng(renderResult.width, renderResult.height, renderResult.pixels);

      await writeFile(path.join(outputDirectory, frame.fileName), pngBytes);
    }
  }

  await writeFile(
    path.join(outputDirectory, 'manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8'
  );
}

await generateSprites();
