import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const repoRoot = process.cwd();
const outputDir = path.join(repoRoot, 'assets', 'player', 'prologue');

const colors = Object.freeze({
  transparent: [0, 0, 0, 0],
  outline: [15, 27, 39, 255],
  hairDark: [35, 50, 63, 255],
  hairMid: [66, 88, 105, 255],
  hairLight: [125, 152, 165, 255],
  skin: [244, 198, 163, 255],
  skinShade: [217, 156, 119, 255],
  eyeWhite: [248, 251, 255, 255],
  eyeIris: [40, 72, 96, 255],
  eyeGlow: [119, 194, 204, 255],
  coatDark: [20, 50, 74, 255],
  coatMid: [39, 82, 113, 255],
  coatLight: [75, 124, 153, 255],
  shirtDark: [30, 88, 97, 255],
  shirtLight: [79, 169, 176, 255],
  pantsDark: [96, 115, 134, 255],
  pantsLight: [145, 165, 182, 255],
  strapDark: [104, 67, 40, 255],
  strapLight: [181, 125, 70, 255],
  lanternFrame: [191, 143, 70, 255],
  lanternGlow: [87, 227, 233, 255],
  lanternCore: [218, 251, 255, 255],
  bootDark: [72, 49, 34, 255],
  bootLight: [141, 97, 59, 255],
  dawnAccent: [214, 188, 112, 255],
});

class Canvas {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.pixels = new Uint8ClampedArray(width * height * 4);
  }

  clone() {
    const next = new Canvas(this.width, this.height);
    next.pixels.set(this.pixels);
    return next;
  }

  index(x, y) {
    return (y * this.width + x) * 4;
  }

  inBounds(x, y) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  set(x, y, color) {
    if (!this.inBounds(x, y)) {
      return;
    }

    const offset = this.index(x, y);
    this.pixels[offset] = color[0];
    this.pixels[offset + 1] = color[1];
    this.pixels[offset + 2] = color[2];
    this.pixels[offset + 3] = color[3];
  }

  get(x, y) {
    if (!this.inBounds(x, y)) {
      return colors.transparent;
    }

    const offset = this.index(x, y);
    return this.pixels.slice(offset, offset + 4);
  }

  isOpaque(x, y) {
    if (!this.inBounds(x, y)) {
      return false;
    }

    return this.pixels[this.index(x, y) + 3] > 0;
  }

  fill(color) {
    for (let y = 0; y < this.height; y += 1) {
      for (let x = 0; x < this.width; x += 1) {
        this.set(x, y, color);
      }
    }
  }

  rect(x, y, width, height, color) {
    for (let py = y; py < y + height; py += 1) {
      for (let px = x; px < x + width; px += 1) {
        this.set(px, py, color);
      }
    }
  }

  segment(y, x1, x2, color) {
    for (let x = x1; x <= x2; x += 1) {
      this.set(x, y, color);
    }
  }

  points(points, color) {
    points.forEach(([x, y]) => this.set(x, y, color));
  }

  blit(source, dx, dy, scale = 1) {
    for (let y = 0; y < source.height; y += 1) {
      for (let x = 0; x < source.width; x += 1) {
        if (!source.isOpaque(x, y)) {
          continue;
        }

        const color = source.get(x, y);
        for (let sy = 0; sy < scale; sy += 1) {
          for (let sx = 0; sx < scale; sx += 1) {
            this.set(dx + x * scale + sx, dy + y * scale + sy, color);
          }
        }
      }
    }
  }
}

function applyOutline(canvas) {
  const outlined = canvas.clone();
  const neighbors = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [-1, 0],
    [1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
  ];

  for (let y = 0; y < canvas.height; y += 1) {
    for (let x = 0; x < canvas.width; x += 1) {
      if (!canvas.isOpaque(x, y)) {
        continue;
      }

      neighbors.forEach(([dx, dy]) => {
        const nx = x + dx;
        const ny = y + dy;

        if (outlined.inBounds(nx, ny) && !canvas.isOpaque(nx, ny)) {
          outlined.set(nx, ny, colors.outline);
        }
      });
    }
  }

  return outlined;
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writePng(canvas, filePath) {
  const ppmPath = `${filePath}.ppm`;
  const header = Buffer.from(`P6\n${canvas.width} ${canvas.height}\n255\n`, 'ascii');
  const data = Buffer.alloc(canvas.width * canvas.height * 3);

  for (let y = 0; y < canvas.height; y += 1) {
    for (let x = 0; x < canvas.width; x += 1) {
      const pixel = canvas.get(x, y);
      const alpha = pixel[3] / 255;
      const bg = [0, 0, 0];
      const offset = (y * canvas.width + x) * 3;

      data[offset] = Math.round(pixel[0] * alpha + bg[0] * (1 - alpha));
      data[offset + 1] = Math.round(pixel[1] * alpha + bg[1] * (1 - alpha));
      data[offset + 2] = Math.round(pixel[2] * alpha + bg[2] * (1 - alpha));
    }
  }

  fs.writeFileSync(ppmPath, Buffer.concat([header, data]));

  const alphaMask = new Canvas(canvas.width, canvas.height);
  for (let y = 0; y < canvas.height; y += 1) {
    for (let x = 0; x < canvas.width; x += 1) {
      const alpha = canvas.get(x, y)[3];
      alphaMask.set(x, y, [alpha, alpha, alpha, 255]);
    }
  }

  const maskPath = `${filePath}.mask.pgm`;
  const pgmHeader = Buffer.from(`P5\n${canvas.width} ${canvas.height}\n255\n`, 'ascii');
  const maskData = Buffer.alloc(canvas.width * canvas.height);
  for (let y = 0; y < canvas.height; y += 1) {
    for (let x = 0; x < canvas.width; x += 1) {
      maskData[y * canvas.width + x] = canvas.get(x, y)[3];
    }
  }

  fs.writeFileSync(maskPath, Buffer.concat([pgmHeader, maskData]));

  const result = spawnSync(
    'convert',
    [ppmPath, maskPath, '-alpha', 'off', '-compose', 'copyopacity', '-composite', filePath],
    { stdio: 'inherit' }
  );

  fs.unlinkSync(ppmPath);
  fs.unlinkSync(maskPath);

  if (result.status !== 0) {
    throw new Error(`이미지 변환에 실패했습니다: ${filePath}`);
  }
}

function drawHead(canvas, offsetX, offsetY, variant) {
  const headRows = [
    [0, 4, 8, colors.hairDark],
    [1, 3, 10, colors.hairDark],
    [1, 5, 7, colors.hairLight],
    [2, 2, 11, colors.hairDark],
    [2, 4, 9, colors.hairMid],
    [3, 2, 11, colors.hairDark],
    [3, 3, 9, colors.hairMid],
    [3, 5, 7, colors.hairLight],
    [4, 2, 10, colors.hairDark],
    [4, 4, 8, colors.hairMid],
    [5, 2, 5, colors.hairDark],
    [5, 8, 10, colors.hairDark],
    [5, 7, 8, colors.hairMid],
    [6, 3, 5, colors.hairDark],
    [6, 8, 10, colors.hairDark],
    [7, 4, 5, colors.hairDark],
    [7, 8, 9, colors.hairDark],
  ];

  headRows.forEach(([row, x1, x2, color]) => {
    canvas.segment(offsetY + row, offsetX + x1, offsetX + x2, color);
  });

  const faceRows = [
    [4, 6, 10],
    [5, 6, 10],
    [6, 6, 9],
    [7, 6, 8],
  ];
  faceRows.forEach(([row, x1, x2]) => {
    canvas.segment(offsetY + row, offsetX + x1, offsetX + x2, colors.skin);
  });

  canvas.points(
    [
      [offsetX + 5, offsetY + 5],
      [offsetX + 5, offsetY + 6],
      [offsetX + 5, offsetY + 7],
    ],
    colors.skin
  );
  canvas.points(
    [
      [offsetX + 4, offsetY + 5],
      [offsetX + 4, offsetY + 6],
    ],
    colors.skinShade
  );

  canvas.points(
    [
      [offsetX + 6, offsetY + 6],
      [offsetX + 7, offsetY + 6],
      [offsetX + 9, offsetY + 6],
      [offsetX + 10, offsetY + 6],
    ],
    colors.eyeWhite
  );
  canvas.points(
    [
      [offsetX + 7, offsetY + 6],
      [offsetX + 10, offsetY + 6],
      [offsetX + 7, offsetY + 7],
      [offsetX + 10, offsetY + 7],
    ],
    colors.eyeIris
  );
  canvas.points(
    [
      [offsetX + 7, offsetY + 6],
      [offsetX + 10, offsetY + 6],
    ],
    colors.eyeGlow
  );
  canvas.points(
    [
      [offsetX + 8, offsetY + 8],
      [offsetX + 9, offsetY + 8],
    ],
    colors.skinShade
  );

  canvas.points(
    [
      [offsetX + 6, offsetY + 3],
      [offsetX + 7, offsetY + 3],
      [offsetX + 8, offsetY + 4],
    ],
    colors.hairLight
  );

  if (variant === 'b') {
    canvas.points(
      [
        [offsetX + 10, offsetY + 4],
        [offsetX + 11, offsetY + 5],
        [offsetX + 11, offsetY + 6],
      ],
      colors.hairMid
    );
    canvas.points([[offsetX + 8, offsetY + 8]], colors.skinShade);
  }

  if (variant === 'c') {
    canvas.points(
      [
        [offsetX + 3, offsetY + 8],
        [offsetX + 4, offsetY + 8],
        [offsetX + 10, offsetY + 3],
      ],
      colors.hairDark
    );
    canvas.points(
      [
        [offsetX + 9, offsetY + 4],
        [offsetX + 10, offsetY + 4],
      ],
      colors.hairLight
    );
  }
}

function drawTorso(canvas, offsetX, offsetY, variant) {
  const coatRows = [
    [0, 5, 16, colors.coatDark],
    [1, 4, 17, colors.coatDark],
    [2, 4, 17, colors.coatDark],
    [3, 4, 17, colors.coatDark],
    [4, 3, 10, colors.coatDark],
    [4, 12, 18, colors.coatDark],
    [5, 3, 10, colors.coatDark],
    [5, 12, 18, colors.coatDark],
    [6, 2, 8, colors.coatDark],
    [6, 12, 18, colors.coatDark],
    [7, 2, 8, colors.coatDark],
    [7, 12, 18, colors.coatDark],
    [8, 2, 8, colors.coatDark],
    [8, 12, 19, colors.coatDark],
    [9, 2, 8, colors.coatDark],
    [9, 12, 19, colors.coatDark],
    [10, 2, 8, colors.coatDark],
    [10, 12, 20, colors.coatDark],
    [11, 2, 8, colors.coatDark],
    [11, 12, 20, colors.coatDark],
    [12, 3, 9, colors.coatDark],
    [12, 12, 20, colors.coatDark],
    [13, 3, 9, colors.coatDark],
    [13, 12, 20, colors.coatDark],
    [14, 3, 9, colors.coatDark],
    [14, 13, 20, colors.coatDark],
    [15, 3, 9, colors.coatDark],
    [15, 13, 20, colors.coatDark],
    [16, 4, 10, colors.coatDark],
    [16, 13, 20, colors.coatDark],
    [17, 4, 10, colors.coatDark],
    [17, 13, 19, colors.coatDark],
    [18, 4, 10, colors.coatDark],
    [18, 13, 19, colors.coatDark],
    [19, 4, 10, colors.coatDark],
    [19, 13, 19, colors.coatDark],
    [20, 4, 9, colors.coatDark],
    [20, 14, 19, colors.coatDark],
    [21, 4, 9, colors.coatDark],
    [21, 14, 19, colors.coatDark],
    [22, 4, 8, colors.coatDark],
    [22, 15, 18, colors.coatDark],
    [23, 5, 8, colors.coatDark],
    [23, 15, 18, colors.coatDark],
    [24, 5, 8, colors.coatDark],
    [24, 15, 18, colors.coatDark],
  ];
  coatRows.forEach(([row, x1, x2, color]) => {
    canvas.segment(offsetY + row, offsetX + x1, offsetX + x2, color);
  });

  const coatMidRows = [
    [1, 6, 15],
    [2, 5, 15],
    [3, 5, 15],
    [4, 4, 8],
    [4, 13, 17],
    [5, 4, 8],
    [5, 13, 17],
    [6, 3, 7],
    [6, 13, 17],
    [7, 3, 7],
    [7, 13, 17],
    [8, 3, 7],
    [8, 13, 18],
    [9, 3, 7],
    [9, 13, 18],
    [10, 3, 7],
    [10, 13, 18],
    [11, 3, 7],
    [11, 13, 18],
    [12, 4, 8],
    [12, 13, 18],
    [13, 4, 8],
    [13, 13, 18],
    [14, 4, 8],
    [14, 14, 18],
    [15, 4, 8],
    [15, 14, 18],
    [16, 5, 8],
    [16, 14, 18],
    [17, 5, 8],
    [17, 14, 17],
    [18, 5, 8],
    [18, 14, 17],
    [19, 5, 8],
    [19, 14, 17],
    [20, 5, 8],
    [20, 15, 17],
  ];
  coatMidRows.forEach(([row, x1, x2]) => {
    canvas.segment(offsetY + row, offsetX + x1, offsetX + x2, colors.coatMid);
  });

  canvas.rect(offsetX + 9, offsetY + 2, 3, 10, colors.shirtDark);
  canvas.rect(offsetX + 11, offsetY + 2, 2, 10, colors.shirtLight);
  canvas.points(
    [
      [offsetX + 10, offsetY + 1],
      [offsetX + 11, offsetY + 1],
      [offsetX + 9, offsetY + 2],
      [offsetX + 13, offsetY + 2],
      [offsetX + 10, offsetY + 3],
      [offsetX + 12, offsetY + 3],
      [offsetX + 11, offsetY + 4],
    ],
    colors.shirtLight
  );

  canvas.rect(offsetX + 8, offsetY + 18, 5, 6, colors.pantsDark);
  canvas.rect(offsetX + 10, offsetY + 18, 2, 6, colors.pantsLight);
  canvas.rect(offsetX + 7, offsetY + 24, 3, 3, colors.bootDark);
  canvas.rect(offsetX + 11, offsetY + 24, 3, 3, colors.bootDark);
  canvas.rect(offsetX + 8, offsetY + 25, 2, 1, colors.bootLight);
  canvas.rect(offsetX + 12, offsetY + 25, 2, 1, colors.bootLight);

  canvas.points(
    [
      [offsetX + 8, offsetY + 0],
      [offsetX + 9, offsetY + 0],
      [offsetX + 10, offsetY + 0],
    ],
    colors.skin
  );
  canvas.points(
    [
      [offsetX + 10, offsetY + 0],
      [offsetX + 11, offsetY + 0],
      [offsetX + 12, offsetY + 0],
    ],
    colors.skinShade
  );

  const strapPoints = [
    [offsetX + 8, offsetY + 2],
    [offsetX + 9, offsetY + 3],
    [offsetX + 10, offsetY + 4],
    [offsetX + 11, offsetY + 5],
    [offsetX + 12, offsetY + 6],
    [offsetX + 13, offsetY + 7],
    [offsetX + 14, offsetY + 8],
    [offsetX + 15, offsetY + 9],
    [offsetX + 16, offsetY + 10],
    [offsetX + 17, offsetY + 11],
    [offsetX + 18, offsetY + 12],
    [offsetX + 18, offsetY + 13],
  ];
  canvas.points(strapPoints, colors.strapDark);
  canvas.points(
    strapPoints.map(([x, y]) => [x + 1, y]),
    colors.strapLight
  );

  canvas.points(
    [
      [offsetX + 2, offsetY + 14],
      [offsetX + 2, offsetY + 15],
      [offsetX + 3, offsetY + 15],
      [offsetX + 15, offsetY + 15],
      [offsetX + 16, offsetY + 15],
      [offsetX + 17, offsetY + 16],
    ],
    colors.skin
  );

  canvas.rect(offsetX + 15, offsetY + 13, 3, 5, colors.lanternFrame);
  canvas.rect(offsetX + 16, offsetY + 14, 2, 3, colors.lanternGlow);
  canvas.points(
    [
      [offsetX + 16, offsetY + 14],
      [offsetX + 17, offsetY + 15],
    ],
    colors.lanternCore
  );
  canvas.points(
    [
      [offsetX + 16, offsetY + 13],
      [offsetX + 17, offsetY + 13],
    ],
    colors.dawnAccent
  );

  canvas.points(
    [
      [offsetX + 8, offsetY + 1],
      [offsetX + 12, offsetY + 1],
      [offsetX + 11, offsetY + 0],
    ],
    colors.dawnAccent
  );

  if (variant === 'b') {
    canvas.rect(offsetX + 15, offsetY + 14, 2, 5, colors.lanternFrame);
    canvas.rect(offsetX + 16, offsetY + 15, 1, 3, colors.lanternGlow);
    canvas.points(
      [
        [offsetX + 4, offsetY + 16],
        [offsetX + 4, offsetY + 17],
      ],
      colors.skin
    );
    canvas.points(
      [
        [offsetX + 14, offsetY + 12],
        [offsetX + 15, offsetY + 12],
      ],
      colors.strapLight
    );
  }

  if (variant === 'c') {
    canvas.segment(offsetY + 6, offsetX + 13, offsetX + 19, colors.coatDark);
    canvas.segment(offsetY + 7, offsetX + 13, offsetX + 19, colors.coatMid);
    canvas.rect(offsetX + 6, offsetY + 19, 5, 5, colors.pantsDark);
    canvas.points(
      [
        [offsetX + 2, offsetY + 13],
        [offsetX + 3, offsetY + 13],
        [offsetX + 4, offsetY + 13],
        [offsetX + 5, offsetY + 14],
      ],
      colors.skin
    );
    canvas.rect(offsetX + 14, offsetY + 12, 4, 4, colors.lanternFrame);
    canvas.rect(offsetX + 15, offsetY + 13, 2, 2, colors.lanternGlow);
    canvas.points([[offsetX + 15, offsetY + 13]], colors.lanternCore);
  }
}

function drawSprite(variant) {
  const canvas = new Canvas(32, 48);

  const configs = {
    a: {
      head: [8, 4],
      torso: [6, 14],
    },
    b: {
      head: [9, 3],
      torso: [7, 14],
    },
    c: {
      head: [7, 4],
      torso: [5, 14],
    },
  };

  const config = configs[variant];
  drawHead(canvas, config.head[0], config.head[1], variant);
  drawTorso(canvas, config.torso[0], config.torso[1], variant);

  if (variant === 'b') {
    canvas.points(
      [
        [12, 37],
        [13, 38],
        [14, 39],
      ],
      colors.coatMid
    );
  }

  if (variant === 'c') {
    canvas.points(
      [
        [21, 20],
        [22, 21],
        [22, 22],
        [23, 23],
      ],
      colors.coatMid
    );
    canvas.points(
      [
        [11, 40],
        [12, 41],
      ],
      colors.coatLight
    );
  }

  return applyOutline(canvas);
}

function createPaletteBoard() {
  const board = new Canvas(320, 112);
  board.fill([238, 236, 228, 255]);

  const swatches = [
    ['Outline', colors.outline],
    ['Hair Dark', colors.hairDark],
    ['Hair Mid', colors.hairMid],
    ['Hair Light', colors.hairLight],
    ['Skin', colors.skin],
    ['Skin Shade', colors.skinShade],
    ['Coat Dark', colors.coatDark],
    ['Coat Mid', colors.coatMid],
    ['Coat Light', colors.coatLight],
    ['Shirt Dark', colors.shirtDark],
    ['Shirt Light', colors.shirtLight],
    ['Pants Dark', colors.pantsDark],
    ['Pants Light', colors.pantsLight],
    ['Strap Dark', colors.strapDark],
    ['Strap Light', colors.strapLight],
    ['Lantern Glow', colors.lanternGlow],
  ];

  swatches.forEach(([, color], index) => {
    const row = Math.floor(index / 4);
    const column = index % 4;
    const startX = 24 + column * 72;
    const startY = 20 + row * 28;

    board.rect(startX, startY, 20, 20, color);
    board.rect(startX, startY, 20, 1, colors.outline);
    board.rect(startX, startY + 19, 20, 1, colors.outline);
    board.rect(startX, startY, 1, 20, colors.outline);
    board.rect(startX + 19, startY, 1, 20, colors.outline);
  });

  return board;
}

function createReviewBoard(scale) {
  const board = new Canvas(1280, 720);
  const background = scale === 1 ? [231, 228, 221, 255] : [244, 242, 236, 255];
  board.fill(background);

  const options = {
    a: drawSprite('a'),
    b: drawSprite('b'),
    c: drawSprite('c'),
  };

  const sprites = [
    { canvas: options.a, x: 220, y: 150 },
    { canvas: options.b, x: 500, y: 150 },
    { canvas: options.c, x: 780, y: 150 },
    { canvas: options.a, x: 420, y: 400 },
  ];

  sprites.forEach(({ canvas, x, y }) => {
    board.blit(canvas, x, y, scale);
  });

  const idle = createIdleSheet();
  board.blit(idle, 600, 400, scale);

  const palette = createPaletteBoard();
  board.blit(palette, 860, 390, scale === 1 ? 1 : 2);

  return board;
}

function createThemePreview(backgroundColor) {
  const board = new Canvas(1280, 720);
  board.fill(backgroundColor);

  const option = drawSprite('a');
  const idle = createIdleSheet();

  board.blit(option, 360, 250, 4);
  board.blit(idle, 620, 250, 4);

  return board;
}

function shiftOpaquePixels(source, shiftY = 0) {
  const target = new Canvas(source.width, source.height);

  for (let y = 0; y < source.height; y += 1) {
    for (let x = 0; x < source.width; x += 1) {
      if (!source.isOpaque(x, y)) {
        continue;
      }

      target.set(x, y + shiftY, source.get(x, y));
    }
  }

  return target;
}

function withIdleAdjustments(baseSprite, mode) {
  const canvas = baseSprite.clone();

  if (mode === 'breathe-in') {
    canvas.points(
      [
        [17, 17],
        [18, 17],
        [17, 18],
        [18, 18],
      ],
      colors.shirtLight
    );
    canvas.points(
      [
        [22, 29],
        [22, 30],
      ],
      colors.lanternGlow
    );
  }

  if (mode === 'settle') {
    const lowered = shiftOpaquePixels(canvas, 1);
    return applyOutline(lowered);
  }

  if (mode === 'ready') {
    canvas.points(
      [
        [23, 31],
        [24, 31],
        [23, 32],
      ],
      colors.skin
    );
    canvas.points(
      [
        [16, 10],
        [17, 10],
      ],
      colors.hairLight
    );
  }

  return applyOutline(canvas);
}

function createIdleSheet() {
  const sheet = new Canvas(96, 48);
  const base = drawSprite('a');
  const frames = [
    withIdleAdjustments(base, 'settle'),
    withIdleAdjustments(base, 'breathe-in'),
    withIdleAdjustments(base, 'ready'),
  ];

  frames.forEach((frame, index) => {
    sheet.blit(frame, index * 32, 0, 1);
  });

  return sheet;
}

function main() {
  ensureDir(outputDir);

  const optionA = drawSprite('a');
  const optionB = drawSprite('b');
  const optionC = drawSprite('c');
  const idleSheet = createIdleSheet();

  writePng(optionA, path.join(outputDir, 'player-stand-option-a.png'));
  writePng(optionB, path.join(outputDir, 'player-stand-option-b.png'));
  writePng(optionC, path.join(outputDir, 'player-stand-option-c.png'));
  writePng(optionA, path.join(outputDir, 'player-master-stand.png'));
  writePng(idleSheet, path.join(outputDir, 'player-idle-keyposes.png'));
  writePng(createPaletteBoard(), path.join(outputDir, 'player-palette.png'));
  writePng(createReviewBoard(1), path.join(outputDir, 'player-review-100.png'));
  writePng(createReviewBoard(4), path.join(outputDir, 'player-review-400.png'));
  writePng(
    createThemePreview([236, 233, 226, 255]),
    path.join(outputDir, 'player-preview-light.png')
  );
  writePng(createThemePreview([33, 43, 55, 255]), path.join(outputDir, 'player-preview-dark.png'));
}

main();
