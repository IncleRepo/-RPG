import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const outputDir = path.join(repoRoot, 'assets', 'sprites', 'player');
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rpg-player-sprites-'));

const LOW_WIDTH = 24;
const LOW_HEIGHT = 32;
const SCALE = 2;
const FRAME_WIDTH = LOW_WIDTH * SCALE;
const FRAME_HEIGHT = LOW_HEIGHT * SCALE;
const GROUND_Y = 28;

const palette = {
  transparent: [0, 0, 0, 0],
  outline: [14, 22, 30, 255],
  coatShadow: [21, 39, 62, 255],
  coat: [35, 65, 100, 255],
  coatHighlight: [73, 115, 158, 255],
  teal: [63, 154, 166, 255],
  tealHighlight: [113, 207, 214, 255],
  saltGray: [141, 151, 160, 255],
  saltHighlight: [194, 205, 211, 255],
  skinShadow: [151, 109, 92, 255],
  skin: [208, 162, 138, 255],
  hair: [25, 40, 51, 255],
  hairHighlight: [59, 84, 99, 255],
  belt: [93, 73, 54, 255],
  brass: [173, 143, 86, 255],
  lantern: [214, 189, 112, 255],
  glow: [244, 213, 121, 255],
  glowSoft: [244, 213, 121, 168],
  steel: [153, 176, 194, 255],
  steelDark: [77, 93, 112, 255],
  hurt: [224, 101, 87, 220],
};

const motionFrames = {
  idle: [
    {
      bob: 0,
      lean: 0,
      head: [0, 0],
      scarf: 0,
      glow: 1,
      frontArm: [2, 3, 4, 7],
      backArm: [-2, 4, -1, 8],
      frontLeg: [1, 4, 2, 9],
      backLeg: [-1, 4, -1, 9],
      tail: [0, 0],
      hair: 0,
    },
    {
      bob: -1,
      lean: 0,
      head: [0, -1],
      scarf: 1,
      glow: 2,
      frontArm: [2, 2, 4, 7],
      backArm: [-2, 3, -1, 8],
      frontLeg: [1, 4, 2, 9],
      backLeg: [-1, 4, -1, 9],
      tail: [-1, 0],
      hair: 1,
    },
    {
      bob: 0,
      lean: 0,
      head: [0, 0],
      scarf: 0,
      glow: 1,
      frontArm: [2, 3, 4, 7],
      backArm: [-2, 4, -1, 8],
      frontLeg: [1, 4, 2, 9],
      backLeg: [-1, 4, -1, 9],
      tail: [0, 0],
      hair: 0,
    },
    {
      bob: 1,
      lean: 0,
      head: [0, 1],
      scarf: -1,
      glow: 0,
      frontArm: [2, 4, 4, 8],
      backArm: [-2, 5, -1, 9],
      frontLeg: [1, 4, 2, 9],
      backLeg: [-1, 4, -1, 9],
      tail: [0, 1],
      hair: -1,
    },
  ],
  walk: [
    {
      bob: 1,
      lean: 0,
      head: [0, 0],
      scarf: -1,
      glow: 0,
      frontArm: [3, 4, 4, 8],
      backArm: [-3, 2, -4, 6],
      frontLeg: [2, 4, 3, 9],
      backLeg: [-2, 4, -3, 9],
      tail: [1, -1],
      hair: -1,
    },
    {
      bob: 0,
      lean: 0,
      head: [0, 0],
      scarf: 0,
      glow: 1,
      frontArm: [1, 3, 2, 7],
      backArm: [-1, 4, 0, 8],
      frontLeg: [1, 4, 2, 9],
      backLeg: [-1, 4, -1, 9],
      tail: [0, 0],
      hair: 0,
    },
    {
      bob: -1,
      lean: 1,
      head: [0, -1],
      scarf: 1,
      glow: 1,
      frontArm: [-2, 2, -3, 6],
      backArm: [3, 4, 4, 8],
      frontLeg: [-1, 4, -2, 9],
      backLeg: [2, 4, 3, 9],
      tail: [-1, 1],
      hair: 1,
    },
    {
      bob: 0,
      lean: 0,
      head: [0, 0],
      scarf: 0,
      glow: 1,
      frontArm: [-1, 3, 0, 7],
      backArm: [1, 4, 2, 8],
      frontLeg: [-1, 4, -1, 9],
      backLeg: [1, 4, 2, 9],
      tail: [0, 0],
      hair: 0,
    },
    {
      bob: 1,
      lean: -1,
      head: [0, 0],
      scarf: -1,
      glow: 0,
      frontArm: [3, 4, 5, 8],
      backArm: [-3, 2, -4, 6],
      frontLeg: [2, 4, 4, 9],
      backLeg: [-2, 4, -2, 9],
      tail: [1, -1],
      hair: -1,
    },
    {
      bob: 0,
      lean: 0,
      head: [0, 0],
      scarf: 0,
      glow: 1,
      frontArm: [1, 3, 2, 7],
      backArm: [-1, 4, 0, 8],
      frontLeg: [1, 4, 2, 9],
      backLeg: [-1, 4, -1, 9],
      tail: [0, 0],
      hair: 0,
    },
  ],
  run: [
    {
      bob: 1,
      lean: 2,
      head: [0, 0],
      scarf: 2,
      glow: 1,
      frontArm: [4, 2, 6, 4],
      backArm: [-4, 4, -5, 8],
      frontLeg: [3, 3, 5, 9],
      backLeg: [-3, 5, -4, 9],
      tail: [-2, 2],
      hair: 1,
    },
    {
      bob: 0,
      lean: 1,
      head: [0, -1],
      scarf: 1,
      glow: 1,
      frontArm: [1, 1, 2, 5],
      backArm: [-1, 5, -2, 9],
      frontLeg: [1, 4, 3, 9],
      backLeg: [-1, 4, -2, 9],
      tail: [-1, 1],
      hair: 1,
    },
    {
      bob: -1,
      lean: 3,
      head: [1, -1],
      scarf: 3,
      glow: 2,
      frontArm: [-4, 3, -6, 6],
      backArm: [4, 1, 6, 4],
      frontLeg: [-3, 4, -5, 9],
      backLeg: [3, 3, 5, 9],
      tail: [2, -2],
      hair: 2,
    },
    {
      bob: 0,
      lean: 2,
      head: [0, 0],
      scarf: 2,
      glow: 1,
      frontArm: [-1, 5, -2, 9],
      backArm: [1, 1, 2, 5],
      frontLeg: [-1, 4, -3, 9],
      backLeg: [1, 4, 2, 9],
      tail: [1, -1],
      hair: 1,
    },
    {
      bob: 1,
      lean: 2,
      head: [0, 0],
      scarf: 2,
      glow: 1,
      frontArm: [4, 2, 6, 4],
      backArm: [-4, 4, -5, 8],
      frontLeg: [3, 3, 5, 9],
      backLeg: [-3, 5, -4, 9],
      tail: [-2, 2],
      hair: 1,
    },
    {
      bob: 0,
      lean: 1,
      head: [0, -1],
      scarf: 1,
      glow: 1,
      frontArm: [1, 1, 2, 5],
      backArm: [-1, 5, -2, 9],
      frontLeg: [1, 4, 3, 9],
      backLeg: [-1, 4, -2, 9],
      tail: [-1, 1],
      hair: 1,
    },
  ],
  jump: [
    {
      bob: 2,
      lean: 1,
      head: [0, 0],
      scarf: 1,
      glow: 1,
      frontArm: [2, 5, 2, 9],
      backArm: [-1, 4, -1, 8],
      frontLeg: [2, 3, 1, 7],
      backLeg: [-1, 3, -2, 7],
      tail: [1, -1],
      hair: 0,
      air: 0,
    },
    {
      bob: 0,
      lean: 1,
      head: [0, -1],
      scarf: 2,
      glow: 2,
      frontArm: [1, 1, 0, 5],
      backArm: [-2, 0, -3, 4],
      frontLeg: [1, 2, 0, 6],
      backLeg: [-1, 2, -2, 6],
      tail: [2, -2],
      hair: 1,
      air: -4,
    },
    {
      bob: -1,
      lean: 0,
      head: [0, -1],
      scarf: 3,
      glow: 2,
      frontArm: [0, 0, -1, 4],
      backArm: [-3, 0, -4, 4],
      frontLeg: [1, 1, 0, 4],
      backLeg: [-1, 1, -2, 4],
      tail: [3, -2],
      hair: 1,
      air: -7,
    },
    {
      bob: -1,
      lean: -1,
      head: [0, -1],
      scarf: 2,
      glow: 1,
      frontArm: [1, -1, 2, 3],
      backArm: [-2, 0, -3, 4],
      frontLeg: [2, 1, 3, 4],
      backLeg: [-1, 1, -2, 4],
      tail: [2, -1],
      hair: 0,
      air: -9,
    },
  ],
  fall: [
    {
      bob: -1,
      lean: -1,
      head: [0, 0],
      scarf: 2,
      glow: 1,
      frontArm: [1, 0, 3, 4],
      backArm: [-2, 1, -4, 5],
      frontLeg: [2, 2, 3, 7],
      backLeg: [-1, 3, -2, 7],
      tail: [2, -2],
      hair: 0,
      air: -8,
      fall: true,
    },
    {
      bob: 0,
      lean: 0,
      head: [0, 1],
      scarf: 3,
      glow: 1,
      frontArm: [2, 1, 4, 5],
      backArm: [-2, 1, -4, 5],
      frontLeg: [2, 2, 4, 8],
      backLeg: [-2, 2, -3, 7],
      tail: [3, -3],
      hair: -1,
      air: -4,
      fall: true,
    },
    {
      bob: 1,
      lean: 0,
      head: [0, 1],
      scarf: 2,
      glow: 0,
      frontArm: [2, 2, 3, 6],
      backArm: [-2, 2, -3, 6],
      frontLeg: [1, 4, 2, 9],
      backLeg: [-1, 4, -1, 9],
      tail: [2, -1],
      hair: -1,
      air: 0,
      fall: true,
    },
    {
      bob: 1,
      lean: 0,
      head: [0, 0],
      scarf: 1,
      glow: 0,
      frontArm: [2, 3, 4, 7],
      backArm: [-2, 3, -2, 7],
      frontLeg: [1, 4, 2, 9],
      backLeg: [-1, 4, -1, 9],
      tail: [1, 0],
      hair: 0,
      air: 2,
      fall: true,
    },
  ],
  attack: [
    {
      bob: 0,
      lean: -1,
      head: [0, 0],
      scarf: -1,
      glow: 1,
      frontArm: [-1, 2, -3, 4],
      backArm: [-2, 4, -3, 8],
      frontLeg: [0, 4, 1, 9],
      backLeg: [-2, 4, -3, 9],
      tail: [1, -1],
      hair: 0,
      weapon: { tip: [-5, 2] },
    },
    {
      bob: -1,
      lean: 0,
      head: [0, -1],
      scarf: 0,
      glow: 2,
      frontArm: [1, 1, 3, 2],
      backArm: [-2, 3, -3, 7],
      frontLeg: [1, 4, 2, 9],
      backLeg: [-1, 4, -2, 9],
      tail: [0, 0],
      hair: 1,
      weapon: { tip: [6, 0] },
      slash: 0,
    },
    {
      bob: -1,
      lean: 2,
      head: [0, -1],
      scarf: 2,
      glow: 2,
      frontArm: [3, -1, 7, -2],
      backArm: [-1, 4, -2, 8],
      frontLeg: [2, 3, 4, 9],
      backLeg: [-2, 5, -2, 9],
      tail: [-2, 2],
      hair: 1,
      weapon: { tip: [10, -2] },
      slash: 1,
    },
    {
      bob: 0,
      lean: 2,
      head: [1, 0],
      scarf: 3,
      glow: 2,
      frontArm: [4, 1, 8, 3],
      backArm: [0, 4, 1, 7],
      frontLeg: [2, 4, 4, 9],
      backLeg: [-1, 4, -2, 9],
      tail: [-2, 2],
      hair: 1,
      weapon: { tip: [10, 2] },
      slash: 2,
    },
    {
      bob: 1,
      lean: 0,
      head: [0, 0],
      scarf: 1,
      glow: 1,
      frontArm: [2, 3, 5, 6],
      backArm: [0, 4, 0, 8],
      frontLeg: [1, 4, 2, 9],
      backLeg: [-1, 4, -1, 9],
      tail: [-1, 1],
      hair: 0,
      weapon: { tip: [6, 5] },
      slash: 3,
    },
    {
      bob: 0,
      lean: 0,
      head: [0, 0],
      scarf: 0,
      glow: 1,
      frontArm: [2, 3, 4, 7],
      backArm: [-2, 4, -1, 8],
      frontLeg: [1, 4, 2, 9],
      backLeg: [-1, 4, -1, 9],
      tail: [0, 0],
      hair: 0,
      weapon: { tip: [4, 7] },
    },
  ],
  hurt: [
    {
      bob: 1,
      lean: -2,
      head: [-1, 0],
      scarf: -2,
      glow: 0,
      frontArm: [-1, 1, -2, 5],
      backArm: [-3, 2, -4, 6],
      frontLeg: [0, 4, 1, 9],
      backLeg: [-2, 4, -3, 9],
      tail: [2, -1],
      hair: -1,
      impact: 0,
    },
    {
      bob: 0,
      lean: -1,
      head: [-1, 0],
      scarf: -1,
      glow: 0,
      frontArm: [-1, 2, -2, 6],
      backArm: [-2, 3, -3, 7],
      frontLeg: [0, 4, 1, 9],
      backLeg: [-1, 4, -2, 9],
      tail: [1, 0],
      hair: -1,
      impact: 1,
    },
    {
      bob: 1,
      lean: 0,
      head: [0, 0],
      scarf: 0,
      glow: 0,
      frontArm: [2, 3, 3, 7],
      backArm: [-2, 4, -2, 8],
      frontLeg: [1, 4, 2, 9],
      backLeg: [-1, 4, -1, 9],
      tail: [0, 1],
      hair: 0,
      impact: 2,
    },
  ],
  death: [
    {
      bob: 1,
      lean: -2,
      head: [-1, 0],
      scarf: -1,
      glow: 0,
      frontArm: [-1, 3, -2, 7],
      backArm: [-3, 3, -4, 7],
      frontLeg: [0, 4, 0, 8],
      backLeg: [-2, 4, -3, 9],
      tail: [1, 0],
      hair: -1,
      impact: 1,
    },
    {
      bob: 2,
      lean: -3,
      head: [-2, 1],
      scarf: -2,
      glow: 0,
      frontArm: [-2, 4, -4, 8],
      backArm: [-4, 4, -5, 8],
      frontLeg: [-1, 4, -2, 8],
      backLeg: [-3, 4, -4, 8],
      tail: [2, -1],
      hair: -1,
      impact: 2,
    },
    {
      bob: 3,
      lean: -4,
      head: [-2, 2],
      scarf: -3,
      glow: 0,
      frontArm: [-3, 5, -5, 9],
      backArm: [-4, 5, -6, 8],
      frontLeg: [-2, 4, -4, 8],
      backLeg: [-4, 4, -5, 8],
      tail: [3, -1],
      hair: -2,
      impact: 2,
    },
    {
      fallen: true,
      collapse: 0,
      scarf: -2,
      glow: 0,
    },
    {
      fallen: true,
      collapse: 1,
      scarf: -1,
      glow: 0,
    },
    {
      fallen: true,
      collapse: 2,
      scarf: 0,
      glow: 0,
    },
  ],
};

class Canvas {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.data = new Uint8ClampedArray(width * height * 4);
  }

  clone() {
    const next = new Canvas(this.width, this.height);
    next.data.set(this.data);
    return next;
  }

  set(x, y, color) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      return;
    }

    const index = (y * this.width + x) * 4;
    const [sr, sg, sb, sa] = color;
    if (sa === 255) {
      this.data[index] = sr;
      this.data[index + 1] = sg;
      this.data[index + 2] = sb;
      this.data[index + 3] = sa;
      return;
    }

    const da = this.data[index + 3] / 255;
    const saNorm = sa / 255;
    const outA = saNorm + da * (1 - saNorm);

    if (outA === 0) {
      return;
    }

    const dr = this.data[index];
    const dg = this.data[index + 1];
    const db = this.data[index + 2];
    this.data[index] = Math.round((sr * saNorm + dr * da * (1 - saNorm)) / outA);
    this.data[index + 1] = Math.round((sg * saNorm + dg * da * (1 - saNorm)) / outA);
    this.data[index + 2] = Math.round((sb * saNorm + db * da * (1 - saNorm)) / outA);
    this.data[index + 3] = Math.round(outA * 255);
  }

  rect(x, y, width, height, color) {
    for (let yy = y; yy < y + height; yy += 1) {
      for (let xx = x; xx < x + width; xx += 1) {
        this.set(xx, yy, color);
      }
    }
  }

  line(x0, y0, x1, y1, color, thickness = 1) {
    let currentX = x0;
    let currentY = y0;
    const deltaX = Math.abs(x1 - currentX);
    const signX = currentX < x1 ? 1 : -1;
    const deltaY = -Math.abs(y1 - currentY);
    const signY = currentY < y1 ? 1 : -1;
    let error = deltaX + deltaY;

    while (true) {
      this.dot(currentX, currentY, color, thickness);
      if (currentX === x1 && currentY === y1) {
        break;
      }

      const twice = error * 2;
      if (twice >= deltaY) {
        error += deltaY;
        currentX += signX;
      }
      if (twice <= deltaX) {
        error += deltaX;
        currentY += signY;
      }
    }
  }

  dot(x, y, color, size = 1) {
    const radius = Math.floor(size / 2);
    for (let yy = -radius; yy <= radius; yy += 1) {
      for (let xx = -radius; xx <= radius; xx += 1) {
        this.set(x + xx, y + yy, color);
      }
    }
  }

  blit(source, targetX, targetY) {
    for (let y = 0; y < source.height; y += 1) {
      for (let x = 0; x < source.width; x += 1) {
        const index = (y * source.width + x) * 4;
        const alpha = source.data[index + 3];
        if (alpha === 0) {
          continue;
        }
        this.set(targetX + x, targetY + y, [
          source.data[index],
          source.data[index + 1],
          source.data[index + 2],
          alpha,
        ]);
      }
    }
  }

  scale(factor) {
    const next = new Canvas(this.width * factor, this.height * factor);
    for (let y = 0; y < this.height; y += 1) {
      for (let x = 0; x < this.width; x += 1) {
        const index = (y * this.width + x) * 4;
        const color = [
          this.data[index],
          this.data[index + 1],
          this.data[index + 2],
          this.data[index + 3],
        ];
        if (color[3] === 0) {
          continue;
        }
        for (let yy = 0; yy < factor; yy += 1) {
          for (let xx = 0; xx < factor; xx += 1) {
            next.set(x * factor + xx, y * factor + yy, color);
          }
        }
      }
    }
    return next;
  }
}

function drawOutRect(canvas, x, y, width, height, fill) {
  canvas.rect(x - 1, y - 1, width + 2, height + 2, palette.outline);
  canvas.rect(x, y, width, height, fill);
}

function drawSegment(canvas, start, middle, end, fill, outline = palette.outline) {
  canvas.line(start[0], start[1], middle[0], middle[1], outline, 3);
  canvas.line(middle[0], middle[1], end[0], end[1], outline, 3);
  canvas.line(start[0], start[1], middle[0], middle[1], fill, 1);
  canvas.line(middle[0], middle[1], end[0], end[1], fill, 1);
}

function drawBoot(canvas, x, y, facingFront) {
  canvas.rect(x - 1, y - 1, 4, 2, palette.outline);
  canvas.rect(x, y - 1, 3, 1, palette.steelDark);
  canvas.rect(x, y, 2 + (facingFront ? 1 : 0), 1, palette.saltGray);
}

function drawHead(canvas, x, y, pose) {
  const hairShift = pose.hair ?? 0;
  canvas.rect(x - 1, y, 7, 7, palette.outline);
  canvas.rect(x, y + 1, 5, 5, palette.skinShadow);
  canvas.rect(x + 1, y + 1, 4, 4, palette.skin);
  canvas.rect(x - 1, y, 5, 3, palette.hair);
  canvas.rect(x, y + 2, 1, 2, palette.hair);
  canvas.rect(x + 1, y - 1 + hairShift, 2, 1, palette.hairHighlight);
  canvas.rect(x + 4, y + 2, 1, 1, palette.outline);
  canvas.rect(x + 4, y + 3, 1, 1, palette.saltHighlight);
  canvas.rect(x, y + 3, 1, 1, palette.tealHighlight);
  canvas.rect(x + 2, y + 5, 2, 1, palette.skinShadow);

  if (pose.glow > 1) {
    canvas.rect(x + 5, y + 2, 1, 2, palette.glowSoft);
  }
}

function drawScarf(canvas, x, y, scarfSwing) {
  canvas.rect(x, y + 7, 6, 2, palette.outline);
  canvas.rect(x + 1, y + 7, 4, 1, palette.tealHighlight);
  canvas.rect(x + 1, y + 8, 4, 1, palette.teal);

  const trailBaseX = x - 1;
  const trailY = y + 8;
  canvas.rect(trailBaseX, trailY, 1, 1, palette.teal);
  canvas.rect(trailBaseX - 1, trailY + Math.sign(scarfSwing || 0), 1, 1, palette.teal);
  if (scarfSwing > 0) {
    canvas.rect(trailBaseX - 2, trailY - 1, 1, 1, palette.tealHighlight);
    canvas.rect(trailBaseX - 3, trailY - 1, 1, 1, palette.teal);
  }
  if (scarfSwing < 0) {
    canvas.rect(trailBaseX - 2, trailY + 1, 1, 1, palette.tealHighlight);
    canvas.rect(trailBaseX - 3, trailY + 1, 1, 1, palette.teal);
  }
}

function drawTorso(canvas, x, y, pose) {
  drawOutRect(canvas, x + 1, y + 9, 5, 8, palette.coat);
  canvas.rect(x + 4, y + 9, 1, 8, palette.coatHighlight);
  canvas.rect(x + 2, y + 16, 5, 2, palette.outline);
  canvas.rect(x + 3, y + 16, 3, 1, palette.belt);
  canvas.rect(x + 2, y + 17, 3, 1, palette.brass);
  canvas.rect(x, y + 14, 2, 4, palette.outline);
  canvas.rect(x + 1, y + 15, 1, 2, palette.belt);
  canvas.rect(x + 1, y + 17, 1, 1, palette.lantern);
  canvas.rect(x + 3, y + 10, 1, 1, palette.glowSoft);

  if (pose.glow > 0) {
    canvas.rect(x + 4, y + 8, 1, 1, palette.glow);
    canvas.rect(x + 5, y + 8, 1, 1, palette.glowSoft);
  }
}

function drawCoatTail(canvas, x, y, pose) {
  const [frontSwing, backSwing] = pose.tail ?? [0, 0];
  const tailY = y + 18;

  for (let step = 0; step < 5; step += 1) {
    canvas.rect(x + step, tailY + Math.max(step - 1 + backSwing, 0), 1, 6 - step, palette.outline);
  }

  canvas.rect(x + 1, tailY + 1 + backSwing, 2, 5, palette.coatShadow);
  canvas.rect(x + 3, tailY + Math.max(frontSwing, 0), 2, 6, palette.coat);
  canvas.rect(x + 5, tailY + 1 + Math.max(frontSwing, 0), 1, 5, palette.coatHighlight);
}

function drawRuneGlow(canvas, hand) {
  canvas.rect(hand[0], hand[1], 1, 1, palette.glow);
  canvas.rect(hand[0] + 1, hand[1], 1, 1, palette.glowSoft);
  canvas.rect(hand[0], hand[1] - 1, 1, 1, palette.glowSoft);
}

function absolutePoint(baseX, baseY, offset) {
  return [baseX + offset[0], baseY + offset[1]];
}

function drawAttackArc(canvas, hand, slashFrame) {
  const trails = [
    [
      [hand[0] + 2, hand[1] - 3],
      [hand[0] + 4, hand[1] - 4],
      [hand[0] + 6, hand[1] - 4],
    ],
    [
      [hand[0] + 4, hand[1] - 3],
      [hand[0] + 7, hand[1] - 2],
      [hand[0] + 9, hand[1]],
    ],
    [
      [hand[0] + 5, hand[1] - 1],
      [hand[0] + 8, hand[1] + 2],
      [hand[0] + 9, hand[1] + 5],
    ],
    [
      [hand[0] + 2, hand[1] + 2],
      [hand[0] + 4, hand[1] + 4],
      [hand[0] + 6, hand[1] + 5],
    ],
  ];

  const arc = trails[slashFrame];
  if (!arc) {
    return;
  }

  canvas.line(arc[0][0], arc[0][1], arc[1][0], arc[1][1], palette.glowSoft, 3);
  canvas.line(arc[1][0], arc[1][1], arc[2][0], arc[2][1], palette.glowSoft, 3);
  canvas.line(arc[0][0], arc[0][1], arc[1][0], arc[1][1], palette.glow, 1);
  canvas.line(arc[1][0], arc[1][1], arc[2][0], arc[2][1], palette.glow, 1);
}

function drawWeapon(canvas, hand, tip) {
  canvas.line(hand[0], hand[1], hand[0] + tip[0], hand[1] + tip[1], palette.steelDark, 3);
  canvas.line(hand[0], hand[1], hand[0] + tip[0], hand[1] + tip[1], palette.steel, 1);
  canvas.rect(hand[0] - 1, hand[1] - 1, 2, 2, palette.brass);
}

function drawImpact(canvas, x, y, impactFrame) {
  const patterns = [
    [
      [x + 10, y + 12],
      [x + 11, y + 11],
      [x + 12, y + 12],
    ],
    [
      [x + 9, y + 12],
      [x + 11, y + 10],
      [x + 13, y + 12],
      [x + 11, y + 14],
    ],
    [
      [x + 10, y + 13],
      [x + 12, y + 11],
      [x + 14, y + 13],
    ],
  ];

  for (const point of patterns[impactFrame] ?? []) {
    canvas.rect(point[0], point[1], 1, 1, palette.hurt);
  }
}

function drawStandingPose(canvas, pose) {
  const baseX = 8 + (pose.lean ?? 0);
  const airY = pose.air ?? 0;
  const baseY = GROUND_Y - 21 + (pose.bob ?? 0) + airY;
  const headX = baseX + 2 + (pose.head?.[0] ?? 0);
  const headY = baseY + (pose.head?.[1] ?? 0);
  const shoulderBack = [baseX + 2, baseY + 10];
  const shoulderFront = [baseX + 4, baseY + 10];
  const hipBack = [baseX + 2, baseY + 18];
  const hipFront = [baseX + 4, baseY + 18];
  const backElbow = absolutePoint(shoulderBack[0], shoulderBack[1], [
    pose.backArm[0],
    pose.backArm[1],
  ]);
  const backHand = absolutePoint(shoulderBack[0], shoulderBack[1], [
    pose.backArm[2],
    pose.backArm[3],
  ]);
  const frontElbow = absolutePoint(shoulderFront[0], shoulderFront[1], [
    pose.frontArm[0],
    pose.frontArm[1],
  ]);
  const frontHand = absolutePoint(shoulderFront[0], shoulderFront[1], [
    pose.frontArm[2],
    pose.frontArm[3],
  ]);
  const backKnee = absolutePoint(hipBack[0], hipBack[1], [pose.backLeg[0], pose.backLeg[1]]);
  const backFoot = absolutePoint(hipBack[0], hipBack[1], [pose.backLeg[2], pose.backLeg[3]]);
  const frontKnee = absolutePoint(hipFront[0], hipFront[1], [pose.frontLeg[0], pose.frontLeg[1]]);
  const frontFoot = absolutePoint(hipFront[0], hipFront[1], [pose.frontLeg[2], pose.frontLeg[3]]);

  if (pose.glow > 1) {
    canvas.dot(headX + 6, headY + 3, palette.glowSoft, 3);
    canvas.dot(frontHand[0] + 1, frontHand[1], palette.glowSoft, 3);
  }

  drawSegment(canvas, shoulderBack, backElbow, backHand, palette.coatShadow);
  drawSegment(canvas, hipBack, backKnee, backFoot, palette.saltGray);
  drawBoot(canvas, backFoot[0] - 1, backFoot[1] + 1, false);
  drawCoatTail(canvas, baseX + 1, baseY, pose);
  drawTorso(canvas, baseX + 1, baseY, pose);
  drawHead(canvas, headX, headY, pose);
  drawScarf(canvas, headX, headY, pose.scarf ?? 0);
  drawSegment(canvas, hipFront, frontKnee, frontFoot, palette.saltHighlight);
  drawBoot(canvas, frontFoot[0] - 1, frontFoot[1] + 1, true);
  drawSegment(canvas, shoulderFront, frontElbow, frontHand, palette.coatHighlight);

  if (pose.glow > 0) {
    drawRuneGlow(canvas, [frontHand[0], frontHand[1]]);
  }

  if (pose.weapon) {
    drawWeapon(canvas, frontHand, pose.weapon.tip);
  }

  if (typeof pose.slash === 'number') {
    drawAttackArc(canvas, frontHand, pose.slash);
  }

  if (typeof pose.impact === 'number') {
    drawImpact(canvas, baseX, baseY, pose.impact);
  }

  if (pose.air && !pose.fall) {
    canvas.dot(baseX + 5, GROUND_Y + 1, palette.glowSoft, 3);
  }
}

function drawFallenPose(canvas, pose) {
  const x = 4 + pose.collapse;
  const y = 18 + pose.collapse;

  canvas.dot(x + 8, y + 6, palette.glowSoft, 3);
  canvas.line(x + 6, y + 9, x + 14, y + 11, palette.outline, 5);
  canvas.line(x + 6, y + 9, x + 14, y + 11, palette.coat, 3);
  canvas.line(x + 14, y + 11, x + 20, y + 14, palette.outline, 5);
  canvas.line(x + 14, y + 11, x + 20, y + 14, palette.coatShadow, 3);
  canvas.line(x + 11, y + 7, x + 18, y + 8, palette.outline, 5);
  canvas.line(x + 11, y + 7, x + 18, y + 8, palette.coatHighlight, 3);
  canvas.line(x + 9, y + 10, x + 3, y + 14, palette.outline, 5);
  canvas.line(x + 9, y + 10, x + 3, y + 14, palette.saltGray, 3);
  canvas.line(x + 12, y + 12, x + 7, y + 17, palette.outline, 5);
  canvas.line(x + 12, y + 12, x + 7, y + 17, palette.saltHighlight, 3);
  drawBoot(canvas, x + 1, y + 14, false);
  drawBoot(canvas, x + 6, y + 17, true);

  canvas.rect(x + 17, y + 3, 7, 7, palette.outline);
  canvas.rect(x + 18, y + 4, 5, 5, palette.skinShadow);
  canvas.rect(x + 19, y + 4, 4, 4, palette.skin);
  canvas.rect(x + 17, y + 3, 5, 3, palette.hair);
  canvas.rect(x + 19, y + 2, 2, 1, palette.hairHighlight);
  canvas.rect(x + 22, y + 6, 1, 1, palette.saltHighlight);
  canvas.rect(x + 16, y + 10, 5, 1, palette.teal);
  canvas.rect(x + 13, y + 11 + (pose.scarf > 0 ? -1 : 1), 3, 1, palette.tealHighlight);
  canvas.rect(x + 10, y + 12 + (pose.scarf > 0 ? -1 : 1), 3, 1, palette.teal);
  canvas.rect(x + 6, y + 8, 1, 1, palette.lantern);
  canvas.rect(x + 8, y + 6, 1, 1, palette.brass);
}

function renderFrame(pose) {
  const canvas = new Canvas(LOW_WIDTH, LOW_HEIGHT);

  if (pose.fallen) {
    drawFallenPose(canvas, pose);
  } else {
    drawStandingPose(canvas, pose);
  }

  return canvas;
}

function writePam(filePath, canvas) {
  const header = `P7\nWIDTH ${canvas.width}\nHEIGHT ${canvas.height}\nDEPTH 4\nMAXVAL 255\nTUPLTYPE RGB_ALPHA\nENDHDR\n`;
  const body = Buffer.from(canvas.data);
  fs.writeFileSync(filePath, Buffer.concat([Buffer.from(header), body]));
}

function prepareOutputDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
  for (const entry of fs.readdirSync(dirPath)) {
    if (entry.endsWith('.png')) {
      fs.rmSync(path.join(dirPath, entry), { force: true });
    }
  }
}

function generatePreview(entries) {
  const columns = 6;
  const rows = Math.ceil(entries.length / columns);
  const padding = 8;
  const preview = new Canvas(
    columns * FRAME_WIDTH + (columns + 1) * padding,
    rows * FRAME_HEIGHT + (rows + 1) * padding
  );

  preview.rect(0, 0, preview.width, preview.height, [10, 18, 28, 255]);

  entries.forEach((entry, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const frameX = padding + column * (FRAME_WIDTH + padding);
    const frameY = padding + row * (FRAME_HEIGHT + padding);
    const shadow = entry.canvas.scale(SCALE);
    preview.dot(frameX + 18, frameY + FRAME_HEIGHT - 6, [0, 0, 0, 72], 13);
    preview.blit(shadow, frameX, frameY);
  });

  return preview;
}

prepareOutputDir(outputDir);

const generatedEntries = [];

for (const [motionName, frames] of Object.entries(motionFrames)) {
  frames.forEach((pose, index) => {
    const lowCanvas = renderFrame(pose);
    const pamPath = path.join(tempDir, `${motionName}_${String(index).padStart(2, '0')}.pam`);
    const pngPath = path.join(outputDir, `${motionName}_${String(index).padStart(2, '0')}.png`);
    writePam(pamPath, lowCanvas);
    execFileSync('convert', [
      pamPath,
      '-filter',
      'point',
      '-resize',
      `${FRAME_WIDTH}x${FRAME_HEIGHT}`,
      pngPath,
    ]);
    generatedEntries.push({ name: motionName, canvas: lowCanvas });
  });
}

const previewCanvas = generatePreview(generatedEntries);
const previewPamPath = path.join(tempDir, 'player-motion-preview.pam');
const previewPngPath = path.join(outputDir, 'player-motion-preview.png');
writePam(previewPamPath, previewCanvas);
execFileSync('convert', [previewPamPath, previewPngPath]);

fs.rmSync(tempDir, { recursive: true, force: true });

console.log(`Generated ${generatedEntries.length} player sprite frames in ${outputDir}`);
