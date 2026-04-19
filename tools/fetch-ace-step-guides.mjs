import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const { console, fetch, process } = globalThis;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const catalogPath = path.join(repoRoot, 'src/content/audio/track-catalog.json');
const outputPath = path.join(repoRoot, 'src/content/audio/ace-step-guides.json');

async function fetchGuide(track) {
  const response = await fetch('https://ace-step-api.gidong.dev/v1/create_sample', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      description: track.prompt,
      instrumental: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`ACE-Step request failed for ${track.slug}: ${response.status}`);
  }

  const payload = await response.json();
  return {
    id: track.id,
    slug: track.slug,
    title: track.title,
    prompt: track.prompt,
    response: payload.data ?? null,
    statusCode: payload.code ?? response.status,
  };
}

async function main() {
  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  const results = [];

  for (const track of catalog.tracks) {
    results.push(await fetchGuide(track));
  }

  fs.writeFileSync(
    outputPath,
    `${JSON.stringify(
      {
        project: catalog.project,
        source: 'ACE-Step API /v1/create_sample',
        generatedAt: new Date().toISOString(),
        tracks: results,
      },
      null,
      2
    )}\n`
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
