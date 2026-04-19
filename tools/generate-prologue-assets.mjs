import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputRoot = join(__dirname, '..', 'assets', 'prologue-vertical-slice');
const sheetsRoot = join(outputRoot, 'sheets');

function rect(x, y, width, height, fill, opacity = 1) {
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${fill}" opacity="${opacity}" />`;
}

function circle(cx, cy, radius, fill, opacity = 1) {
  return `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="${fill}" opacity="${opacity}" />`;
}

function group(items, offsetX, offsetY) {
  return `<g transform="translate(${offsetX} ${offsetY})">${items.join('')}</g>`;
}

function shadow(width, y, fill = '#050813', opacity = 0.18) {
  return rect(5, y, width, 2, fill, opacity);
}

function humaniodFrame(palette, pose = {}) {
  const leftLeg = pose.leftLeg ?? 0;
  const rightLeg = pose.rightLeg ?? 0;
  const leftArm = pose.leftArm ?? 0;
  const rightArm = pose.rightArm ?? 0;
  const lean = pose.lean ?? 0;
  const head = pose.head ?? 0;
  const glow = pose.glow ?? 0;
  const blade = pose.blade ?? false;
  const aura = pose.aura ?? false;
  const skirt = pose.skirt ?? 0;
  const stance = pose.stance ?? 0;
  const items = [
    shadow(12, 37),
    rect(9 + lean, 2 + head, 6, 2, palette.hairDark),
    rect(8 + lean, 4 + head, 8, 2, palette.hair),
    rect(9 + lean, 6 + head, 6, 5, palette.skin),
    rect(8 + lean, 8 + head, 2, 1, palette.hairDark),
    rect(14 + lean, 8 + head, 2, 1, palette.hairDark),
    rect(8 + lean + leftArm, 11, 2, 8, palette.primaryDark),
    rect(14 + lean + rightArm, 11, 2, 8, palette.primaryDark),
    rect(9 + lean, 11, 6, 8, palette.primary),
    rect(8 + lean, 19, 8, 7, palette.secondary),
    rect(10 + lean, 19, 4, 5, palette.accent),
    rect(8 + lean, 26 + skirt, 4, 5, palette.secondaryDark ?? palette.secondary),
    rect(12 + lean, 26 - skirt, 4, 5, palette.secondaryDark ?? palette.secondary),
    rect(9 + lean + leftLeg - stance, 30, 2, 7, palette.boot),
    rect(13 + lean + rightLeg + stance, 30, 2, 7, palette.boot),
    rect(10 + lean, 14, 4, 1, palette.trim ?? palette.accent),
    rect(7 + lean, 18, 10, 2, palette.primaryDark, 0.45),
  ];

  if (palette.tool) {
    items.push(rect(15 + lean + rightArm, 16, 3, 4, palette.tool));
  }

  if (blade) {
    items.push(rect(15 + lean + rightArm, 15, 2, 6, palette.bladeHandle ?? palette.accent));
    items.push(rect(17 + lean + rightArm, 13, 5, 2, palette.bladeLight ?? '#f6e3a6'));
    items.push(rect(17 + lean + rightArm, 15, 4, 2, palette.blade));
    items.push(rect(17 + lean + rightArm, 17, 3, 2, palette.bladeDark ?? palette.blade));
  }

  if (aura) {
    items.unshift(circle(12, 20, 10, palette.aura ?? '#84d8f6', 0.16));
    items.unshift(circle(12, 20, 14, palette.aura ?? '#84d8f6', 0.08));
  }

  if (glow > 0) {
    items.unshift(circle(12, 20, 12, palette.glow ?? '#efdba1', glow * 0.3));
  }

  return items;
}

function gullFrame(wing = 0) {
  return [
    shadow(10, 18, '#050813', 0.14),
    rect(6, 8, 8, 4, '#d3d9df'),
    rect(8, 6, 4, 4, '#edf1f4'),
    rect(14, 8, 2, 2, '#f0a65d'),
    rect(4, 8 - wing, 4, 2, '#d8e3ea'),
    rect(12, 8 + wing, 4, 2, '#c6d4dd'),
    rect(9, 12, 2, 4, '#7d8790'),
    rect(11, 12, 2, 4, '#7d8790'),
    rect(10, 9, 1, 1, '#1f2830'),
  ];
}

function huskFrame(pose = {}) {
  return humaniodFrame(
    {
      hairDark: '#20232d',
      hair: '#3a4654',
      skin: '#7c8d91',
      primaryDark: '#35454c',
      primary: '#4f6a74',
      secondary: '#63808a',
      secondaryDark: '#476169',
      accent: '#91c4d1',
      boot: '#243038',
      trim: '#c84f4d',
      tool: '#8eb2bd',
      aura: '#6cc4d5',
    },
    pose
  );
}

function watcherFrame(pose = {}) {
  const shift = pose.shift ?? 0;
  const jaw = pose.jaw ?? 0;
  const arm = pose.arm ?? 0;
  const glow = pose.glow ?? 0.35;

  return [
    circle(20, 22, 18, '#6f5031', 0.12),
    rect(12 + shift, 6, 16, 7, '#6a4a2a'),
    rect(10 + shift, 13, 20, 8, '#8a6338'),
    rect(8 + shift, 20, 24, 9, '#5f4126'),
    rect(12 + shift, 29, 16, 5, '#3a2b1c'),
    rect(14 + shift, 34, 4, 5, '#2f2318'),
    rect(22 + shift, 34, 4, 5, '#2f2318'),
    rect(6 + shift + arm, 19, 4, 12, '#8a6338'),
    rect(30 + shift - arm, 19, 4, 12, '#8a6338'),
    rect(14 + shift, 15, 12, 3 + jaw, '#d29e58'),
    rect(13 + shift, 12, 3, 3, '#f6d296', glow),
    rect(24 + shift, 12, 3, 3, '#f6d296', glow),
    rect(16 + shift, 24, 8, 2, '#d29e58'),
    rect(18 + shift, 10, 4, 2, '#ad7d43'),
    rect(12 + shift, 18, 16, 1, '#f2c170', 0.42),
  ];
}

function buildSheet({ frameWidth, frameHeight, frames, label }) {
  const width = frameWidth * frames.length;
  const height = frameHeight;
  const frameMarkup = frames.map((frame, index) => group(frame, frameWidth * index, 0)).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" aria-label="${label}" shape-rendering="crispEdges">
  ${frameMarkup}
</svg>
`;
}

function tileFrame(layout) {
  return layout;
}

function offsetFrame(layout, offsetX, offsetY) {
  return [group(layout, offsetX, offsetY)];
}

const heroFrames = [
  humaniodFrame(
    {
      hairDark: '#15212d',
      hair: '#20354a',
      skin: '#d9b596',
      primaryDark: '#18344a',
      primary: '#274c69',
      secondary: '#36708b',
      secondaryDark: '#224d63',
      accent: '#cbb97d',
      boot: '#13202b',
      trim: '#73c5d5',
      blade: '#8af5ff',
      bladeDark: '#4cc0d4',
      bladeHandle: '#c5a96e',
      aura: '#8ae1ff',
      glow: '#f6dea4',
    },
    { head: 0, skirt: 0 }
  ),
  humaniodFrame(
    {
      hairDark: '#15212d',
      hair: '#20354a',
      skin: '#d9b596',
      primaryDark: '#18344a',
      primary: '#274c69',
      secondary: '#36708b',
      secondaryDark: '#224d63',
      accent: '#cbb97d',
      boot: '#13202b',
      trim: '#73c5d5',
      blade: '#8af5ff',
      bladeDark: '#4cc0d4',
      bladeHandle: '#c5a96e',
      aura: '#8ae1ff',
      glow: '#f6dea4',
    },
    { head: 1, skirt: 1, leftArm: -1, rightArm: 1 }
  ),
  humaniodFrame(
    {
      hairDark: '#15212d',
      hair: '#20354a',
      skin: '#d9b596',
      primaryDark: '#18344a',
      primary: '#274c69',
      secondary: '#36708b',
      secondaryDark: '#224d63',
      accent: '#cbb97d',
      boot: '#13202b',
      trim: '#73c5d5',
      blade: '#8af5ff',
      bladeDark: '#4cc0d4',
      bladeHandle: '#c5a96e',
      aura: '#8ae1ff',
      glow: '#f6dea4',
    },
    { leftLeg: -1, rightLeg: 1, leftArm: 1, rightArm: -1, skirt: 1, stance: 1 }
  ),
  humaniodFrame(
    {
      hairDark: '#15212d',
      hair: '#20354a',
      skin: '#d9b596',
      primaryDark: '#18344a',
      primary: '#274c69',
      secondary: '#36708b',
      secondaryDark: '#224d63',
      accent: '#cbb97d',
      boot: '#13202b',
      trim: '#73c5d5',
      blade: '#8af5ff',
      bladeDark: '#4cc0d4',
      bladeHandle: '#c5a96e',
      aura: '#8ae1ff',
      glow: '#f6dea4',
    },
    { leftLeg: 1, rightLeg: -1, leftArm: -1, rightArm: 1, skirt: -1, stance: -1 }
  ),
  humaniodFrame(
    {
      hairDark: '#15212d',
      hair: '#20354a',
      skin: '#d9b596',
      primaryDark: '#18344a',
      primary: '#274c69',
      secondary: '#36708b',
      secondaryDark: '#224d63',
      accent: '#cbb97d',
      boot: '#13202b',
      trim: '#73c5d5',
      blade: '#8af5ff',
      bladeDark: '#4cc0d4',
      bladeHandle: '#c5a96e',
      aura: '#8ae1ff',
      glow: '#f6dea4',
    },
    { rightArm: 3, leftArm: -2, lean: 1, blade: true, glow: 1 }
  ),
  humaniodFrame(
    {
      hairDark: '#15212d',
      hair: '#20354a',
      skin: '#d9b596',
      primaryDark: '#18344a',
      primary: '#274c69',
      secondary: '#36708b',
      secondaryDark: '#224d63',
      accent: '#cbb97d',
      boot: '#13202b',
      trim: '#73c5d5',
      blade: '#8af5ff',
      bladeDark: '#4cc0d4',
      bladeHandle: '#c5a96e',
      aura: '#8ae1ff',
      glow: '#f6dea4',
    },
    { leftLeg: -2, rightLeg: 2, lean: 3, leftArm: 2, rightArm: 4, blade: true, glow: 0.6 }
  ),
  humaniodFrame(
    {
      hairDark: '#15212d',
      hair: '#20354a',
      skin: '#d9b596',
      primaryDark: '#18344a',
      primary: '#274c69',
      secondary: '#36708b',
      secondaryDark: '#224d63',
      accent: '#cbb97d',
      boot: '#13202b',
      trim: '#73c5d5',
      blade: '#8af5ff',
      bladeDark: '#4cc0d4',
      bladeHandle: '#c5a96e',
      aura: '#8ae1ff',
      glow: '#f6dea4',
    },
    { lean: 4, leftLeg: 2, rightLeg: -3, leftArm: 2, rightArm: 4, aura: true }
  ),
  humaniodFrame(
    {
      hairDark: '#15212d',
      hair: '#20354a',
      skin: '#d9b596',
      primaryDark: '#18344a',
      primary: '#274c69',
      secondary: '#36708b',
      secondaryDark: '#224d63',
      accent: '#cbb97d',
      boot: '#13202b',
      trim: '#73c5d5',
      blade: '#8af5ff',
      bladeDark: '#4cc0d4',
      bladeHandle: '#c5a96e',
      aura: '#8ae1ff',
      glow: '#f6dea4',
    },
    { head: 1, leftArm: 1, rightArm: -1, skirt: 1, glow: 0.2 }
  ),
];

const alliesFrames = [
  humaniodFrame(
    {
      hairDark: '#5d6875',
      hair: '#8592a0',
      skin: '#e2c5b4',
      primaryDark: '#d0d4d8',
      primary: '#f0f1ea',
      secondary: '#95a9b8',
      secondaryDark: '#74889a',
      accent: '#d3c48e',
      boot: '#4f5f6f',
      trim: '#88a7be',
      tool: '#bcc9d6',
    },
    { head: 0, rightArm: 1 }
  ),
  humaniodFrame(
    {
      hairDark: '#5d6875',
      hair: '#8592a0',
      skin: '#e2c5b4',
      primaryDark: '#d0d4d8',
      primary: '#f0f1ea',
      secondary: '#95a9b8',
      secondaryDark: '#74889a',
      accent: '#d3c48e',
      boot: '#4f5f6f',
      trim: '#88a7be',
      tool: '#bcc9d6',
    },
    { head: 1, leftArm: -1, rightArm: 2, skirt: 1 }
  ),
  humaniodFrame(
    {
      hairDark: '#6d3d26',
      hair: '#8c5434',
      skin: '#c08a61',
      primaryDark: '#604437',
      primary: '#885f48',
      secondary: '#bf7e4f',
      secondaryDark: '#935b39',
      accent: '#da9d52',
      boot: '#3b281c',
      trim: '#df6046',
      tool: '#a9a190',
    },
    { head: 0, stance: 1, leftArm: 1 }
  ),
  humaniodFrame(
    {
      hairDark: '#d3cfd8',
      hair: '#f0e6ee',
      skin: '#f4e7e4',
      primaryDark: '#d6d2de',
      primary: '#f7f0f8',
      secondary: '#dfe0ef',
      secondaryDark: '#c5c5d7',
      accent: '#f2cae6',
      boot: '#d0d4e3',
      trim: '#9ddcf2',
      aura: '#b8f1ff',
    },
    { head: 0, aura: true, glow: 1 }
  ),
];

const citizenFrames = [
  humaniodFrame(
    {
      hairDark: '#5f3b24',
      hair: '#8a5a39',
      skin: '#cda180',
      primaryDark: '#3e5b62',
      primary: '#50747d',
      secondary: '#7b8e6f',
      secondaryDark: '#586650',
      accent: '#d1c17a',
      boot: '#2b3037',
      trim: '#df7d5b',
    },
    { leftArm: -1, rightArm: 2 }
  ),
  humaniodFrame(
    {
      hairDark: '#463e45',
      hair: '#716578',
      skin: '#dfb7a1',
      primaryDark: '#7b6061',
      primary: '#b58574',
      secondary: '#d2b28c',
      secondaryDark: '#ac8d68',
      accent: '#f0daa0',
      boot: '#413433',
      trim: '#80afb6',
    },
    { head: 1, skirt: 1 }
  ),
  humaniodFrame(
    {
      hairDark: '#7a6f64',
      hair: '#bcae9f',
      skin: '#d8b299',
      primaryDark: '#445664',
      primary: '#5e7687',
      secondary: '#95a382',
      secondaryDark: '#6d7a62',
      accent: '#ead28c',
      boot: '#26323b',
      trim: '#a8d1c5',
      tool: '#c7c69b',
    },
    { leftArm: 1, rightArm: -1 }
  ),
];

const enemyFrames = [
  offsetFrame(gullFrame(2), 10, 8),
  offsetFrame(gullFrame(-2), 10, 8),
  offsetFrame(huskFrame({ leftLeg: -1, rightLeg: 1, leftArm: 1, rightArm: -1 }), 8, 0),
  offsetFrame(huskFrame({ leftLeg: 1, rightLeg: -1, leftArm: -1, rightArm: 1 }), 8, 0),
  offsetFrame(huskFrame({ rightArm: 3, lean: 1, glow: 0.6 }), 8, 0),
  watcherFrame({ shift: 0, arm: 0, jaw: 0, glow: 0.42 }),
  watcherFrame({ shift: 1, arm: 2, jaw: 1, glow: 0.7 }),
  watcherFrame({ shift: -1, arm: -1, jaw: 0, glow: 0.3 }),
];

const harborTiles = [
  tileFrame([
    rect(0, 0, 16, 16, '#1c2b37'),
    rect(0, 11, 16, 5, '#3e5763'),
    rect(0, 12, 16, 4, '#536f7f'),
    rect(0, 13, 16, 3, '#7c8f93'),
    rect(2, 8, 2, 3, '#916c42'),
    rect(6, 7, 2, 4, '#916c42'),
    rect(12, 8, 2, 3, '#916c42'),
  ]),
  tileFrame([
    rect(0, 0, 16, 16, '#273746'),
    rect(0, 0, 16, 3, '#435767'),
    rect(0, 3, 16, 13, '#314455'),
    rect(1, 4, 2, 12, '#8a6238'),
    rect(7, 4, 2, 12, '#8a6238'),
    rect(13, 4, 2, 12, '#8a6238'),
  ]),
  tileFrame([
    rect(0, 0, 16, 16, '#132531'),
    rect(0, 8, 16, 8, '#234357'),
    rect(1, 9, 4, 1, '#7fd1d6', 0.65),
    rect(8, 11, 6, 1, '#96e1df', 0.58),
    rect(5, 13, 5, 1, '#5abfc7', 0.5),
  ]),
  tileFrame([
    rect(0, 0, 16, 16, '#2c3946'),
    rect(2, 2, 12, 12, '#405161'),
    rect(3, 3, 10, 10, '#556878'),
    rect(6, 0, 4, 16, '#a17c44'),
    rect(0, 6, 16, 4, '#a17c44'),
  ]),
  tileFrame([
    rect(0, 0, 16, 16, '#243443'),
    rect(3, 8, 10, 6, '#65492a'),
    rect(2, 6, 12, 2, '#91693e'),
    rect(5, 3, 6, 4, '#c28c46'),
    rect(7, 1, 2, 2, '#f7d17d'),
  ]),
  tileFrame([
    rect(0, 0, 16, 16, '#182935'),
    rect(6, 2, 4, 10, '#675b50'),
    rect(5, 12, 6, 2, '#96724d'),
    rect(4, 14, 8, 2, '#715337'),
    rect(7, 4, 2, 3, '#ffe291', 0.72),
  ]),
];

const towerTiles = [
  tileFrame([
    rect(0, 0, 16, 16, '#1e202e'),
    rect(0, 11, 16, 5, '#43475f'),
    rect(0, 12, 16, 4, '#646b82'),
    rect(4, 8, 2, 3, '#8890aa'),
    rect(10, 7, 2, 4, '#8890aa'),
  ]),
  tileFrame([
    rect(0, 0, 16, 16, '#21263a'),
    rect(0, 0, 16, 3, '#3a4562'),
    rect(0, 3, 16, 13, '#2b3147'),
    rect(1, 3, 2, 13, '#8488a3'),
    rect(7, 3, 2, 13, '#8488a3'),
    rect(13, 3, 2, 13, '#8488a3'),
  ]),
  tileFrame([
    rect(0, 0, 16, 16, '#1c2031'),
    rect(2, 2, 12, 12, '#39425e'),
    rect(3, 3, 10, 10, '#59617b'),
    rect(6, 0, 4, 16, '#d0ad63'),
    rect(0, 6, 16, 4, '#d0ad63'),
  ]),
  tileFrame([
    rect(0, 0, 16, 16, '#241c2d'),
    rect(6, 1, 4, 11, '#69769d'),
    rect(5, 12, 6, 2, '#9db7d0'),
    rect(4, 14, 8, 2, '#526179'),
    rect(7, 4, 2, 2, '#f8e7a8', 0.8),
  ]),
  tileFrame([
    rect(0, 0, 16, 16, '#24263a'),
    rect(2, 8, 12, 6, '#4e5571'),
    rect(1, 6, 14, 2, '#6f7592'),
    rect(5, 3, 6, 4, '#8ea0bf'),
    rect(7, 1, 2, 2, '#edf2ff', 0.78),
  ]),
  tileFrame([
    rect(0, 0, 16, 16, '#261d2b'),
    rect(0, 8, 16, 8, '#3b3152'),
    rect(2, 9, 4, 1, '#bca7de', 0.48),
    rect(9, 11, 5, 1, '#e6d0ff', 0.4),
    rect(4, 13, 6, 1, '#8f75cf', 0.38),
  ]),
];

const manifest = {
  generatedAt: new Date().toISOString(),
  outputDirectory: 'assets/prologue-vertical-slice',
  sheets: [
    {
      file: 'sheets/hero-sheet.svg',
      role: '플레이어 스프라이트 시트',
      frameSize: '24x40',
      frames: ['idle-a', 'idle-b', 'walk-a', 'walk-b', 'attack-a', 'attack-b', 'dash', 'hit'],
    },
    {
      file: 'sheets/allies-sheet.svg',
      role: '사야 렌 / 라오 템 / 백야 주요 동료 시트',
      frameSize: '24x40',
      frames: ['saya-idle', 'saya-gesture', 'lao-idle', 'baekya-aura'],
    },
    {
      file: 'sheets/citizens-sheet.svg',
      role: '어시장 조사 NPC 시트',
      frameSize: '24x40',
      frames: ['fisher', 'apothecary', 'keeper'],
    },
    {
      file: 'sheets/enemies-sheet.svg',
      role: '균열 갈매기 / 하역 인형 / 황혼 파수체 시트',
      frameSize: '40x40',
      frames: [
        'gull-a',
        'gull-b',
        'husk-a',
        'husk-b',
        'husk-attack',
        'watcher-idle',
        'watcher-attack',
        'watcher-stagger',
      ],
    },
    {
      file: 'sheets/harbor-tiles.svg',
      role: '미라진 항구 타일/오브젝트 시트',
      frameSize: '16x16',
      frames: ['dock-floor', 'dock-wall', 'water', 'recorder', 'crate', 'lantern'],
    },
    {
      file: 'sheets/tower-tiles.svg',
      role: '시계탑 타일/오브젝트 시트',
      frameSize: '16x16',
      frames: ['tower-floor', 'tower-wall', 'sealed-door', 'anchor', 'bell-core', 'rift'],
    },
  ],
};

const readme = `# Prologue Vertical Slice Pixel Assets

프롤로그 버티컬 슬라이스용 도트 스타일 리소스입니다.

## 구성

- \`sheets/hero-sheet.svg\`: 플레이어 이동/공격/대시/피격 프레임
- \`sheets/allies-sheet.svg\`: 사야 렌, 라오 템, 백야 프레임
- \`sheets/citizens-sheet.svg\`: 조사 NPC 프레임
- \`sheets/enemies-sheet.svg\`: 균열 갈매기, 하역 인형, 황혼 파수체 프레임
- \`sheets/harbor-tiles.svg\`: 미라진 항구용 타일과 오브젝트
- \`sheets/tower-tiles.svg\`: 시계탑용 타일과 오브젝트
- \`manifest.json\`: 프레임 순서와 용도

## 재생성

\`\`\`bash
node tools/generate-prologue-assets.mjs
\`\`\`
`;

async function writeSheet(fileName, content) {
  await writeFile(join(sheetsRoot, fileName), content, 'utf8');
}

async function main() {
  await mkdir(sheetsRoot, { recursive: true });

  await writeSheet(
    'hero-sheet.svg',
    buildSheet({ frameWidth: 24, frameHeight: 40, frames: heroFrames, label: 'Hero Sheet' })
  );
  await writeSheet(
    'allies-sheet.svg',
    buildSheet({
      frameWidth: 24,
      frameHeight: 40,
      frames: alliesFrames,
      label: 'Allies Sheet',
    })
  );
  await writeSheet(
    'citizens-sheet.svg',
    buildSheet({
      frameWidth: 24,
      frameHeight: 40,
      frames: citizenFrames,
      label: 'Citizens Sheet',
    })
  );
  await writeSheet(
    'enemies-sheet.svg',
    buildSheet({
      frameWidth: 40,
      frameHeight: 40,
      frames: enemyFrames,
      label: 'Enemies Sheet',
    })
  );
  await writeSheet(
    'harbor-tiles.svg',
    buildSheet({
      frameWidth: 16,
      frameHeight: 16,
      frames: harborTiles,
      label: 'Harbor Tiles',
    })
  );
  await writeSheet(
    'tower-tiles.svg',
    buildSheet({
      frameWidth: 16,
      frameHeight: 16,
      frames: towerTiles,
      label: 'Tower Tiles',
    })
  );

  await writeFile(
    join(outputRoot, 'manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8'
  );
  await writeFile(join(outputRoot, 'README.md'), readme, 'utf8');
}

main().catch((error) => {
  globalThis.console.error(error);
  process.exitCode = 1;
});
