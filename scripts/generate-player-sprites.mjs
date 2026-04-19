import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const outputDir = path.join(rootDir, 'assets', 'sprites', 'player');
const previewFramesDir = path.join(outputDir, '.preview-frames');

const width = 24;
const height = 32;
const scale = 3;
const exportWidth = width * scale;
const exportHeight = height * scale;

const palette = {
  outline: '#101925',
  hairShadow: '#7b8396',
  hairLight: '#d9deed',
  skinShadow: '#b07f5f',
  skin: '#e8ba95',
  scarfShadow: '#8f8a78',
  scarf: '#d6d1bc',
  coatShadow: '#17283a',
  coat: '#27435f',
  coatLight: '#3e6a87',
  pantsShadow: '#232536',
  pants: '#444a69',
  bootShadow: '#402b24',
  boot: '#6a483b',
  brass: '#c79d4f',
  satchel: '#6a4b31',
  crystalGlow: '#57d5e9',
  crystal: '#dbfdff',
  hitFlash: '#f4aba9',
};

const motionOrder = [
  ['idle', createIdleFrames()],
  ['walk', createWalkFrames()],
  ['run', createRunFrames()],
  ['jump', createJumpFrames()],
  ['fall', createFallFrames()],
  ['attack', createAttackFrames()],
  ['hurt', createHurtFrames()],
  ['death', createDeathFrames()],
];

main();

function main() {
  fs.mkdirSync(outputDir, { recursive: true });
  fs.rmSync(previewFramesDir, { recursive: true, force: true });
  fs.mkdirSync(previewFramesDir, { recursive: true });

  const existingPngs = fs
    .readdirSync(outputDir, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isFile() && entry.name.endsWith('.png') && entry.name !== 'player-motion-preview.png'
    )
    .map((entry) => path.join(outputDir, entry.name));

  for (const filePath of existingPngs) {
    fs.rmSync(filePath);
  }

  const previewFramePaths = [];

  for (const [motionName, frames] of motionOrder) {
    frames.forEach((pose, index) => {
      const svg = renderSprite(buildPose(pose));
      const basename = `${motionName}_${String(index).padStart(2, '0')}`;
      const svgPath = path.join(previewFramesDir, `${basename}.svg`);
      const pngPath = path.join(outputDir, `${basename}.png`);
      const previewPath = path.join(
        previewFramesDir,
        `${String(previewFramePaths.length).padStart(4, '0')}.png`
      );

      fs.writeFileSync(svgPath, svg, 'utf8');
      exportSprite(svgPath, pngPath);
      optimizePng(pngPath);
      fs.copyFileSync(pngPath, previewPath);
      previewFramePaths.push(previewPath);
    });
  }

  buildPreviewMontage();
  buildPreviewGif();

  fs.rmSync(previewFramesDir, { recursive: true, force: true });
}

function createIdleFrames() {
  return [
    {
      offsetY: 0,
      bodyAngle: -92,
      headOffsetY: 0,
      scarfAngle: 198,
      scarfLength: 7,
      frontArm: [65, 76],
      backArm: [118, 130],
      frontLeg: [92, 91],
      backLeg: [88, 92],
      coatSpread: 0.4,
    },
    {
      offsetY: -1,
      bodyAngle: -89,
      headOffsetY: -1,
      scarfAngle: 190,
      scarfLength: 8,
      frontArm: [62, 72],
      backArm: [116, 128],
      frontLeg: [91, 90],
      backLeg: [89, 91],
      coatSpread: 0.7,
      crystalPulse: 1,
    },
    {
      offsetY: 0,
      bodyAngle: -87,
      headOffsetY: 0,
      scarfAngle: 182,
      scarfLength: 7,
      frontArm: [60, 69],
      backArm: [114, 126],
      frontLeg: [90, 90],
      backLeg: [90, 90],
      coatSpread: 0.5,
    },
    {
      offsetY: 1,
      bodyAngle: -90,
      headOffsetY: 1,
      scarfAngle: 194,
      scarfLength: 8,
      frontArm: [64, 74],
      backArm: [117, 129],
      frontLeg: [91, 92],
      backLeg: [89, 92],
      coatSpread: 0.8,
      crystalPulse: 1,
    },
  ];
}

function createWalkFrames() {
  return Array.from({ length: 6 }, (_, index) => {
    const phase = (index / 6) * Math.PI * 2;
    const stride = Math.sin(phase);
    const bob = Math.round(Math.cos(phase * 2) * 1.4);

    return {
      offsetY: bob,
      bodyAngle: -90 + Math.round(Math.sin(phase) * 4),
      scarfAngle: 198 - Math.round(stride * 10),
      scarfLength: 8,
      frontArm: [72 - Math.round(stride * 20), 82 - Math.round(stride * 10)],
      backArm: [110 + Math.round(stride * 18), 125 + Math.round(stride * 10)],
      frontLeg: [90 + Math.round(stride * 20), 90 - Math.round(stride * 14)],
      backLeg: [90 - Math.round(stride * 20), 90 + Math.round(stride * 14)],
      frontFootAngle: 4 + Math.round(stride * 8),
      backFootAngle: -8 - Math.round(stride * 8),
      coatSpread: 1 + Math.abs(stride) * 1.6,
      crystalPulse: bob < 0 ? 1 : 0,
    };
  });
}

function createRunFrames() {
  return Array.from({ length: 6 }, (_, index) => {
    const phase = (index / 6) * Math.PI * 2;
    const stride = Math.sin(phase);
    const drive = Math.cos(phase * 2);

    return {
      offsetY: Math.round(drive * 2),
      offsetX: Math.round(stride * 0.5),
      bodyAngle: -78 + Math.round(Math.sin(phase) * 5),
      scarfAngle: 208 - Math.round(stride * 16),
      scarfLength: 10,
      frontArm: [62 - Math.round(stride * 28), 84 - Math.round(stride * 6)],
      backArm: [116 + Math.round(stride * 28), 128 + Math.round(stride * 8)],
      frontLeg: [86 + Math.round(stride * 30), 98 - Math.round(stride * 22)],
      backLeg: [94 - Math.round(stride * 30), 84 + Math.round(stride * 22)],
      frontFootAngle: 6 + Math.round(stride * 12),
      backFootAngle: -12 - Math.round(stride * 12),
      coatSpread: 2.4 + Math.abs(stride) * 2.1,
      crystalPulse: 1,
    };
  });
}

function createJumpFrames() {
  return [
    {
      offsetY: 3,
      bodyAngle: -98,
      scarfAngle: 202,
      scarfLength: 7,
      frontArm: [60, 80],
      backArm: [120, 135],
      frontLeg: [115, 120],
      backLeg: [65, 70],
      frontFootAngle: -10,
      backFootAngle: 22,
      coatSpread: 0.6,
    },
    {
      offsetY: -1,
      bodyAngle: -92,
      scarfAngle: 214,
      scarfLength: 10,
      frontArm: [55, 35],
      backArm: [145, 150],
      frontLeg: [74, 112],
      backLeg: [108, 72],
      frontFootAngle: 10,
      backFootAngle: -18,
      coatSpread: 2.8,
      crystalPulse: 1,
    },
    {
      offsetY: -5,
      bodyAngle: -88,
      scarfAngle: 226,
      scarfLength: 11,
      frontArm: [50, 20],
      backArm: [154, 162],
      frontLeg: [84, 118],
      backLeg: [102, 66],
      frontFootAngle: 18,
      backFootAngle: -22,
      coatSpread: 3.2,
      crystalPulse: 1,
    },
    {
      offsetY: -3,
      bodyAngle: -84,
      scarfAngle: 218,
      scarfLength: 10,
      frontArm: [58, 48],
      backArm: [144, 150],
      frontLeg: [92, 120],
      backLeg: [98, 70],
      frontFootAngle: 14,
      backFootAngle: -18,
      coatSpread: 2.7,
      crystalPulse: 1,
    },
  ];
}

function createFallFrames() {
  return [
    {
      offsetY: -1,
      bodyAngle: -80,
      scarfAngle: 230,
      scarfLength: 11,
      frontArm: [32, 8],
      backArm: [156, 170],
      frontLeg: [82, 110],
      backLeg: [98, 72],
      frontFootAngle: 12,
      backFootAngle: -12,
      coatSpread: 3.3,
      crystalPulse: 1,
    },
    {
      offsetY: 1,
      bodyAngle: -74,
      scarfAngle: 236,
      scarfLength: 11,
      frontArm: [18, -8],
      backArm: [164, 178],
      frontLeg: [88, 104],
      backLeg: [100, 78],
      frontFootAngle: 10,
      backFootAngle: -8,
      coatSpread: 3.1,
      crystalPulse: 1,
    },
    {
      offsetY: 3,
      bodyAngle: -68,
      scarfAngle: 242,
      scarfLength: 12,
      frontArm: [12, -12],
      backArm: [170, 184],
      frontLeg: [92, 102],
      backLeg: [104, 82],
      frontFootAngle: 8,
      backFootAngle: -4,
      coatSpread: 2.6,
    },
    {
      offsetY: 5,
      bodyAngle: -72,
      scarfAngle: 220,
      scarfLength: 10,
      frontArm: [28, 8],
      backArm: [156, 166],
      frontLeg: [96, 104],
      backLeg: [98, 88],
      frontFootAngle: 5,
      backFootAngle: 0,
      coatSpread: 2.1,
    },
  ];
}

function createAttackFrames() {
  return [
    {
      offsetY: 1,
      bodyAngle: -92,
      scarfAngle: 192,
      scarfLength: 8,
      frontArm: [52, 38],
      backArm: [128, 138],
      frontLeg: [96, 92],
      backLeg: [84, 96],
      frontFootAngle: 2,
      backFootAngle: -12,
      coatSpread: 1.1,
      weaponAngle: -18,
      weaponLength: 7,
    },
    {
      offsetY: 0,
      bodyAngle: -102,
      scarfAngle: 188,
      scarfLength: 7,
      frontArm: [-10, -46],
      backArm: [146, 156],
      frontLeg: [110, 106],
      backLeg: [72, 80],
      frontFootAngle: -8,
      backFootAngle: -18,
      coatSpread: 1.6,
      weaponAngle: -74,
      weaponLength: 7,
      crystalPulse: 1,
    },
    {
      offsetY: -1,
      bodyAngle: -86,
      scarfAngle: 210,
      scarfLength: 10,
      frontArm: [24, 10],
      backArm: [126, 134],
      frontLeg: [74, 86],
      backLeg: [108, 98],
      frontFootAngle: 10,
      backFootAngle: -18,
      coatSpread: 2.2,
      weaponAngle: -2,
      weaponLength: 9,
      slashArc: { angle: -6, radius: 8, spread: 18 },
      crystalPulse: 1,
    },
    {
      offsetY: 0,
      bodyAngle: -74,
      scarfAngle: 226,
      scarfLength: 11,
      frontArm: [58, 22],
      backArm: [108, 118],
      frontLeg: [68, 88],
      backLeg: [112, 102],
      frontFootAngle: 16,
      backFootAngle: -8,
      coatSpread: 2.6,
      weaponAngle: 28,
      weaponLength: 9,
      slashArc: { angle: 24, radius: 9, spread: 20 },
      crystalPulse: 1,
    },
    {
      offsetY: 1,
      bodyAngle: -80,
      scarfAngle: 214,
      scarfLength: 10,
      frontArm: [74, 48],
      backArm: [104, 118],
      frontLeg: [80, 96],
      backLeg: [102, 94],
      frontFootAngle: 12,
      backFootAngle: 0,
      coatSpread: 1.8,
      weaponAngle: 42,
      weaponLength: 8,
    },
    {
      offsetY: 0,
      bodyAngle: -88,
      scarfAngle: 198,
      scarfLength: 8,
      frontArm: [64, 58],
      backArm: [116, 126],
      frontLeg: [90, 92],
      backLeg: [90, 92],
      frontFootAngle: 6,
      backFootAngle: -6,
      coatSpread: 1.1,
      weaponAngle: 12,
      weaponLength: 7,
    },
  ];
}

function createHurtFrames() {
  return [
    {
      offsetY: 1,
      bodyAngle: -110,
      headOffsetY: 1,
      scarfAngle: 184,
      scarfLength: 7,
      frontArm: [136, 148],
      backArm: [160, 172],
      frontLeg: [108, 100],
      backLeg: [72, 92],
      frontFootAngle: -12,
      backFootAngle: -18,
      coatSpread: 1.6,
      flash: true,
    },
    {
      offsetY: 2,
      bodyAngle: -118,
      headOffsetY: 2,
      scarfAngle: 178,
      scarfLength: 6,
      frontArm: [152, 165],
      backArm: [170, 182],
      frontLeg: [118, 108],
      backLeg: [66, 84],
      frontFootAngle: -18,
      backFootAngle: -18,
      coatSpread: 1.2,
      flash: true,
    },
    {
      offsetY: 1,
      bodyAngle: -98,
      headOffsetY: 1,
      scarfAngle: 192,
      scarfLength: 7,
      frontArm: [96, 110],
      backArm: [132, 140],
      frontLeg: [100, 96],
      backLeg: [82, 92],
      frontFootAngle: -6,
      backFootAngle: -10,
      coatSpread: 0.9,
    },
  ];
}

function createDeathFrames() {
  return [
    {
      offsetY: 1,
      bodyAngle: -104,
      headOffsetY: 1,
      scarfAngle: 186,
      scarfLength: 7,
      frontArm: [142, 156],
      backArm: [166, 176],
      frontLeg: [110, 104],
      backLeg: [70, 86],
      frontFootAngle: -10,
      backFootAngle: -16,
      coatSpread: 1.4,
      flash: true,
    },
    {
      offsetY: 3,
      bodyAngle: -126,
      headOffsetY: 2,
      scarfAngle: 182,
      scarfLength: 6,
      frontArm: [164, 176],
      backArm: [176, 188],
      frontLeg: [126, 112],
      backLeg: [60, 74],
      frontFootAngle: -18,
      backFootAngle: -18,
      coatSpread: 1.1,
      flash: true,
    },
    {
      offsetY: 5,
      bodyAngle: -150,
      headOffsetY: 4,
      hipOffsetX: -1,
      scarfAngle: 176,
      scarfLength: 5,
      frontArm: [186, 196],
      backArm: [194, 204],
      frontLeg: [142, 118],
      backLeg: [50, 66],
      frontFootAngle: -18,
      backFootAngle: -18,
      coatSpread: 0.8,
    },
    {
      offsetY: 8,
      bodyAngle: -172,
      headOffsetY: 5,
      hipOffsetX: -2,
      scarfAngle: 170,
      scarfLength: 5,
      frontArm: [202, 208],
      backArm: [206, 214],
      frontLeg: [158, 126],
      backLeg: [42, 58],
      frontFootAngle: -10,
      backFootAngle: -10,
      coatSpread: 0.6,
    },
    {
      offsetY: 9,
      bodyAngle: -184,
      headOffsetY: 5,
      hipOffsetX: -2,
      scarfAngle: 166,
      scarfLength: 5,
      frontArm: [214, 220],
      backArm: [216, 224],
      frontLeg: [174, 134],
      backLeg: [34, 52],
      frontFootAngle: 0,
      backFootAngle: 0,
      coatSpread: 0.4,
    },
    {
      offsetY: 10,
      bodyAngle: -184,
      headOffsetY: 5,
      hipOffsetX: -2,
      scarfAngle: 164,
      scarfLength: 4,
      frontArm: [218, 224],
      backArm: [220, 228],
      frontLeg: [178, 138],
      backLeg: [30, 48],
      frontFootAngle: 0,
      backFootAngle: 0,
      coatSpread: 0.2,
    },
  ];
}

function buildPose(frame) {
  return {
    anchorX: 11 + (frame.offsetX ?? 0),
    hipY: 21 + (frame.offsetY ?? 0),
    hipOffsetX: frame.hipOffsetX ?? 0,
    bodyAngle: frame.bodyAngle,
    headOffsetY: frame.headOffsetY ?? 0,
    scarfAngle: frame.scarfAngle,
    scarfLength: frame.scarfLength,
    frontArm: { upperAngle: frame.frontArm[0], lowerAngle: frame.frontArm[1] },
    backArm: { upperAngle: frame.backArm[0], lowerAngle: frame.backArm[1] },
    frontLeg: {
      upperAngle: frame.frontLeg[0],
      lowerAngle: frame.frontLeg[1],
      footAngle: frame.frontFootAngle ?? 0,
    },
    backLeg: {
      upperAngle: frame.backLeg[0],
      lowerAngle: frame.backLeg[1],
      footAngle: frame.backFootAngle ?? 0,
    },
    coatSpread: frame.coatSpread ?? 1,
    weaponAngle: frame.weaponAngle,
    weaponLength: frame.weaponLength ?? 0,
    slashArc: frame.slashArc ?? null,
    flash: frame.flash ?? false,
    crystalPulse: frame.crystalPulse ?? 0,
  };
}

function renderSprite(pose) {
  const pixels = createCanvas();

  const hip = point(pose.anchorX + pose.hipOffsetX, pose.hipY);
  const up = vector(pose.bodyAngle, 8.2);
  const side = vector(pose.bodyAngle + 90, 1.9);
  const torsoTop = addPoint(hip, up);
  const neck = addPoint(torsoTop, vector(pose.bodyAngle, 1.4));
  const headCenter = addPoint(neck, point(1.3, pose.headOffsetY - 2.6));

  const backHip = addPoint(hip, scalePoint(side, -0.6));
  const frontHip = addPoint(hip, scalePoint(side, 0.75));
  const backShoulder = addPoint(torsoTop, scalePoint(side, -1.2));
  const frontShoulder = addPoint(torsoTop, scalePoint(side, 1.05));

  const backLeg = createLimb(backHip, pose.backLeg.upperAngle, pose.backLeg.lowerAngle, 4.5, 4.2);
  const frontLeg = createLimb(
    frontHip,
    pose.frontLeg.upperAngle,
    pose.frontLeg.lowerAngle,
    4.5,
    4.4
  );
  const backArm = createLimb(
    backShoulder,
    pose.backArm.upperAngle,
    pose.backArm.lowerAngle,
    3.9,
    3.8
  );
  const frontArm = createLimb(
    frontShoulder,
    pose.frontArm.upperAngle,
    pose.frontArm.lowerAngle,
    3.9,
    4.1
  );

  const backFootTip = addPoint(backLeg.end, vector(pose.backLeg.footAngle, 2.4));
  const frontFootTip = addPoint(frontLeg.end, vector(pose.frontLeg.footAngle, 2.8));

  const coatBottom = addPoint(hip, vector(pose.bodyAngle + 180, 7.8));
  const coatFlare = 2.4 + pose.coatSpread;
  const coatPoints = [
    addPoint(backShoulder, point(-1.3, -0.9)),
    addPoint(frontShoulder, point(1.2, -0.6)),
    addPoint(addPoint(coatBottom, scalePoint(side, coatFlare)), point(0.3, 0)),
    addPoint(addPoint(coatBottom, scalePoint(side, -coatFlare + 0.4)), point(-0.6, 0.2)),
  ];

  const coatShadePoints = [
    addPoint(backShoulder, point(-1.6, -0.8)),
    addPoint(torsoTop, point(-0.4, -1.2)),
    addPoint(hip, point(-0.5, 0.4)),
    addPoint(addPoint(coatBottom, scalePoint(side, -coatFlare + 0.8)), point(-0.8, 0.3)),
  ];

  const scarfBase = addPoint(neck, point(-1.2, -0.2));
  const scarfTip = addPoint(scarfBase, vector(pose.scarfAngle, pose.scarfLength));
  const scarfPoints = [
    addPoint(scarfBase, point(-0.8, -0.6)),
    addPoint(scarfBase, point(0.8, 0.4)),
    addPoint(scarfTip, point(0.6, 1.1)),
    addPoint(scarfTip, point(-0.9, -0.2)),
  ];

  const satchelTop = addPoint(hip, point(-2.7, -1.2));
  const satchelBottom = addPoint(hip, point(-3.7, 2.2));
  const crystalCenter = addPoint(hip, point(3.1, 0.9));
  const weaponTip =
    typeof pose.weaponAngle === 'number'
      ? addPoint(frontArm.end, vector(pose.weaponAngle, pose.weaponLength))
      : null;

  drawLimb(pixels, backLeg, palette.pantsShadow, 2);
  drawLine(pixels, backLeg.end, backFootTip, palette.bootShadow, 2);
  drawLimb(pixels, backArm, palette.coatShadow, 2);
  fillPolygon(
    pixels,
    [
      addPoint(satchelTop, point(-0.7, -0.2)),
      addPoint(satchelTop, point(1.4, 0)),
      addPoint(satchelBottom, point(1, 0.7)),
      addPoint(satchelBottom, point(-0.5, -0.6)),
    ],
    palette.satchel
  );
  drawLine(pixels, addPoint(backShoulder, point(-1, -0.4)), satchelTop, palette.brass, 1);

  fillPolygon(pixels, coatPoints, pose.flash ? palette.hitFlash : palette.coat);
  fillPolygon(pixels, coatShadePoints, palette.coatShadow);
  drawLine(
    pixels,
    addPoint(torsoTop, point(0.5, 0.2)),
    addPoint(hip, point(1.2, 3.6)),
    palette.coatLight,
    1
  );
  drawLine(
    pixels,
    addPoint(torsoTop, point(1.2, -0.2)),
    addPoint(hip, point(3, 4.3)),
    palette.brass,
    1
  );

  fillPolygon(pixels, scarfPoints, palette.scarfShadow);
  fillPolygon(
    pixels,
    [
      addPoint(scarfBase, point(-0.2, -0.7)),
      addPoint(scarfBase, point(1.1, -0.2)),
      addPoint(scarfTip, point(0.4, 0.8)),
      addPoint(scarfTip, point(-0.6, 0.1)),
    ],
    pose.flash ? palette.hitFlash : palette.scarf
  );

  fillEllipse(pixels, headCenter.x - 0.6, headCenter.y, 3.6, 4.1, palette.hairShadow);
  fillEllipse(pixels, headCenter.x + 0.6, headCenter.y + 0.4, 2.9, 3.2, palette.skin);
  fillPolygon(
    pixels,
    [
      point(headCenter.x - 4.1, headCenter.y - 1.4),
      point(headCenter.x - 0.4, headCenter.y - 4.5),
      point(headCenter.x + 3.7, headCenter.y - 2),
      point(headCenter.x + 2.2, headCenter.y + 0.4),
      point(headCenter.x - 1.2, headCenter.y - 0.2),
    ],
    palette.hairLight
  );
  fillPolygon(
    pixels,
    [
      point(headCenter.x - 1.5, headCenter.y + 0.6),
      point(headCenter.x + 0.5, headCenter.y + 2.4),
      point(headCenter.x + 3, headCenter.y + 0.7),
      point(headCenter.x + 2.4, headCenter.y - 0.4),
      point(headCenter.x + 0.4, headCenter.y - 0.2),
    ],
    palette.hairShadow
  );
  fillRect(
    pixels,
    Math.round(headCenter.x + 1.8),
    Math.round(headCenter.y - 0.2),
    1,
    1,
    palette.outline
  );
  fillRect(
    pixels,
    Math.round(headCenter.x + 2.6),
    Math.round(headCenter.y + 1.4),
    1,
    1,
    palette.skinShadow
  );

  drawLimb(pixels, frontLeg, palette.pants, 2);
  drawLine(pixels, frontLeg.end, frontFootTip, palette.boot, 2);
  drawLimb(pixels, frontArm, pose.flash ? palette.hitFlash : palette.coatLight, 2);
  fillRect(
    pixels,
    Math.round(frontArm.end.x - 0.5),
    Math.round(frontArm.end.y - 0.5),
    2,
    2,
    palette.skin
  );

  fillDiamond(
    pixels,
    crystalCenter.x,
    crystalCenter.y,
    2.1 + pose.crystalPulse * 0.35,
    palette.crystalGlow
  );
  fillDiamond(
    pixels,
    crystalCenter.x + 0.1,
    crystalCenter.y,
    1.2 + pose.crystalPulse * 0.2,
    palette.crystal
  );
  fillRect(
    pixels,
    Math.round(crystalCenter.x - 0.5),
    Math.round(crystalCenter.y - 2.4),
    1,
    2,
    palette.brass
  );

  if (weaponTip) {
    drawLine(pixels, frontArm.end, weaponTip, palette.brass, 1);
    drawLine(
      pixels,
      addPoint(frontArm.end, point(-0.2, -0.2)),
      addPoint(weaponTip, point(0.4, -0.2)),
      palette.outline,
      1
    );
    fillDiamond(pixels, weaponTip.x + 0.2, weaponTip.y, 1.1, palette.crystalGlow);
  }

  if (pose.slashArc) {
    drawSlashArc(pixels, frontArm.end, pose.slashArc);
  }

  drawOutline(pixels);

  return toSvg(pixels);
}

function createCanvas() {
  return Array.from({ length: height }, () => Array(width).fill(null));
}

function createLimb(origin, upperAngle, lowerAngle, upperLength, lowerLength) {
  const elbow = addPoint(origin, vector(upperAngle, upperLength));
  const end = addPoint(elbow, vector(lowerAngle, lowerLength));
  return { origin, elbow, end };
}

function drawLimb(pixels, limb, color, thickness) {
  drawLine(pixels, limb.origin, limb.elbow, color, thickness);
  drawLine(pixels, limb.elbow, limb.end, color, thickness);
}

function drawSlashArc(pixels, center, slashArc) {
  const startAngle = slashArc.angle - slashArc.spread;
  const endAngle = slashArc.angle + slashArc.spread;
  const steps = 8;

  for (let index = 0; index < steps; index += 1) {
    const currentAngle = startAngle + ((endAngle - startAngle) * index) / (steps - 1);
    const nextAngle = startAngle + ((endAngle - startAngle) * (index + 1)) / (steps - 1);
    const currentPoint = addPoint(center, vector(currentAngle, slashArc.radius));
    const nextPoint = addPoint(center, vector(nextAngle, slashArc.radius));

    drawLine(pixels, currentPoint, nextPoint, palette.crystalGlow, 2);
    drawLine(
      pixels,
      addPoint(currentPoint, point(0.2, 0.2)),
      addPoint(nextPoint, point(0.2, 0.2)),
      palette.crystal,
      1
    );
  }
}

function drawOutline(pixels) {
  const outlined = createCanvas();

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (pixels[y][x]) {
        continue;
      }

      if (hasNeighbouringColor(pixels, x, y)) {
        outlined[y][x] = palette.outline;
      }
    }
  }

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (!pixels[y][x] && outlined[y][x]) {
        pixels[y][x] = outlined[y][x];
      }
    }
  }
}

function hasNeighbouringColor(pixels, x, y) {
  const neighbors = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
  ];

  return neighbors.some(([dx, dy]) => {
    const targetX = x + dx;
    const targetY = y + dy;

    return (
      targetX >= 0 &&
      targetX < width &&
      targetY >= 0 &&
      targetY < height &&
      pixels[targetY][targetX]
    );
  });
}

function fillRect(pixels, x, y, rectWidth, rectHeight, color) {
  for (let offsetY = 0; offsetY < rectHeight; offsetY += 1) {
    for (let offsetX = 0; offsetX < rectWidth; offsetX += 1) {
      setPixel(pixels, x + offsetX, y + offsetY, color);
    }
  }
}

function fillEllipse(pixels, centerX, centerY, radiusX, radiusY, color) {
  const minX = Math.floor(centerX - radiusX);
  const maxX = Math.ceil(centerX + radiusX);
  const minY = Math.floor(centerY - radiusY);
  const maxY = Math.ceil(centerY + radiusY);

  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const normalizedX = (x + 0.5 - centerX) / radiusX;
      const normalizedY = (y + 0.5 - centerY) / radiusY;

      if (normalizedX * normalizedX + normalizedY * normalizedY <= 1) {
        setPixel(pixels, x, y, color);
      }
    }
  }
}

function fillDiamond(pixels, centerX, centerY, radius, color) {
  const minX = Math.floor(centerX - radius);
  const maxX = Math.ceil(centerX + radius);
  const minY = Math.floor(centerY - radius);
  const maxY = Math.ceil(centerY + radius);

  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const distance = Math.abs(x + 0.5 - centerX) + Math.abs(y + 0.5 - centerY);

      if (distance <= radius + 0.3) {
        setPixel(pixels, x, y, color);
      }
    }
  }
}

function fillPolygon(pixels, points, color) {
  const minY = Math.max(0, Math.floor(Math.min(...points.map((pointValue) => pointValue.y))));
  const maxY = Math.min(
    height - 1,
    Math.ceil(Math.max(...points.map((pointValue) => pointValue.y)))
  );

  for (let y = minY; y <= maxY; y += 1) {
    const scanlineY = y + 0.5;
    const intersections = [];

    for (let index = 0; index < points.length; index += 1) {
      const current = points[index];
      const next = points[(index + 1) % points.length];

      if (
        (current.y <= scanlineY && next.y > scanlineY) ||
        (next.y <= scanlineY && current.y > scanlineY)
      ) {
        const ratio = (scanlineY - current.y) / (next.y - current.y);
        intersections.push(current.x + (next.x - current.x) * ratio);
      }
    }

    intersections.sort((left, right) => left - right);

    for (let index = 0; index < intersections.length; index += 2) {
      const startX = Math.ceil(intersections[index]);
      const endX = Math.floor(intersections[index + 1]);

      for (let x = startX; x <= endX; x += 1) {
        setPixel(pixels, x, y, color);
      }
    }
  }
}

function drawLine(pixels, start, end, color, thickness = 1) {
  const steps = Math.max(Math.abs(end.x - start.x), Math.abs(end.y - start.y), 1);

  for (let step = 0; step <= steps; step += 1) {
    const ratio = step / steps;
    const x = start.x + (end.x - start.x) * ratio;
    const y = start.y + (end.y - start.y) * ratio;

    stampBrush(pixels, x, y, thickness, color);
  }
}

function stampBrush(pixels, centerX, centerY, size, color) {
  const radius = Math.max(0.6, size / 2);
  const minX = Math.floor(centerX - radius);
  const maxX = Math.ceil(centerX + radius);
  const minY = Math.floor(centerY - radius);
  const maxY = Math.ceil(centerY + radius);

  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const distance = Math.abs(x + 0.5 - centerX) + Math.abs(y + 0.5 - centerY);

      if (distance <= radius + 0.35) {
        setPixel(pixels, x, y, color);
      }
    }
  }
}

function setPixel(pixels, x, y, color) {
  const targetX = Math.round(x);
  const targetY = Math.round(y);

  if (targetX < 0 || targetX >= width || targetY < 0 || targetY >= height) {
    return;
  }

  pixels[targetY][targetX] = color;
}

function toSvg(pixels) {
  const rects = [];

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const color = pixels[y][x];

      if (color) {
        rects.push(`<rect x="${x}" y="${y}" width="1" height="1" fill="${color}" />`);
      }
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" shape-rendering="crispEdges">
  <rect width="${width}" height="${height}" fill="none" />
  ${rects.join('\n  ')}
</svg>
`;
}

function exportSprite(svgPath, pngPath) {
  execFileSync(
    'convert',
    [svgPath, '-filter', 'point', '-resize', `${exportWidth}x${exportHeight}`, pngPath],
    {
      stdio: 'ignore',
    }
  );
}

function optimizePng(filePath) {
  execFileSync(
    'pngquant',
    [
      '--force',
      '--skip-if-larger',
      '--quality=70-100',
      '--speed',
      '1',
      '--output',
      filePath,
      '--',
      filePath,
    ],
    {
      stdio: 'ignore',
    }
  );
  execFileSync('optipng', ['-quiet', filePath], { stdio: 'ignore' });
}

function buildPreviewMontage() {
  const orderedFiles = motionOrder.flatMap(([motionName, frames]) =>
    frames.map((_, index) =>
      path.join(outputDir, `${motionName}_${String(index).padStart(2, '0')}.png`)
    )
  );

  execFileSync(
    'montage',
    [
      ...orderedFiles,
      '-background',
      'none',
      '-tile',
      '6x',
      '-geometry',
      `${exportWidth}x${exportHeight}+0+0`,
      path.join(outputDir, 'player-motion-preview.png'),
    ],
    { stdio: 'ignore' }
  );

  optimizePng(path.join(outputDir, 'player-motion-preview.png'));
}

function buildPreviewGif() {
  execFileSync(
    'ffmpeg',
    [
      '-y',
      '-framerate',
      '8',
      '-i',
      path.join(previewFramesDir, '%04d.png'),
      '-vf',
      'split[s0][s1];[s0]palettegen=reserve_transparent=on[p];[s1][p]paletteuse',
      path.join(outputDir, 'player-motion-preview.gif'),
    ],
    { stdio: 'ignore' }
  );
}

function point(x, y) {
  return { x, y };
}

function addPoint(left, right) {
  return point(left.x + right.x, left.y + right.y);
}

function scalePoint(source, amount) {
  return point(source.x * amount, source.y * amount);
}

function vector(angle, length) {
  const radians = (angle * Math.PI) / 180;
  return point(Math.cos(radians) * length, Math.sin(radians) * length);
}
