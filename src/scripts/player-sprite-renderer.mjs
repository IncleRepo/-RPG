import { PLAYER_PARTS, PLAYER_SPRITE_PALETTE, SPRITE_CANVAS } from './player-sprite-data.mjs';

const HEX_CACHE = new Map();

const PART_META = Object.freeze({
  harpoon: { hitRadius: 8, rotateDistance: 10, scaleDistance: 7 },
  backArm: { hitRadius: 7, rotateDistance: 8, scaleDistance: 6 },
  backLeg: { hitRadius: 7, rotateDistance: 8, scaleDistance: 6 },
  scarf: { hitRadius: 8, rotateDistance: 9, scaleDistance: 7 },
  torso: { hitRadius: 10, rotateDistance: 10, scaleDistance: 7 },
  mantle: { hitRadius: 10, rotateDistance: 10, scaleDistance: 7 },
  head: { hitRadius: 8, rotateDistance: 8, scaleDistance: 6 },
  hair: { hitRadius: 7, rotateDistance: 8, scaleDistance: 6 },
  satchel: { hitRadius: 6, rotateDistance: 7, scaleDistance: 5 },
  lantern: { hitRadius: 6, rotateDistance: 7, scaleDistance: 5 },
  frontLeg: { hitRadius: 7, rotateDistance: 8, scaleDistance: 6 },
  frontArm: { hitRadius: 7, rotateDistance: 8, scaleDistance: 6 },
});

const BODY_ORDER = PLAYER_PARTS.map((part) => part.id);

const armShape = [
  [-2.5, 0],
  [2.5, 0],
  [3.2, 12],
  [2, 15],
  [-1.8, 15],
  [-3.2, 12],
];

const legShape = [
  [-3, 0],
  [3, 0],
  [3.6, 12],
  [1.6, 16],
  [-2, 16],
  [-3.8, 12],
];

const torsoShape = [
  [-6.5, -8],
  [6.5, -8],
  [7.5, -1],
  [8, 5.5],
  [0, 12],
  [-8, 5.5],
  [-7.5, -1],
];

const torsoFrontShape = [
  [-3.2, -6.5],
  [3.2, -6.5],
  [4.5, 3],
  [0, 8.5],
  [-4.5, 3],
];

const mantleShape = [
  [-8, -3],
  [8, -3],
  [10, 8],
  [4, 13],
  [-4, 13],
  [-10, 8],
];

const scarfTailShape = [
  [-1.5, -1],
  [4, -1],
  [3.2, 8],
  [1.4, 13],
  [-2.6, 12],
  [-1.6, 5],
];

const scarfKnotShape = [
  [-3.5, -2],
  [3.5, -2],
  [4.2, 3],
  [0, 5.2],
  [-4.2, 3],
];

const satchelShape = [
  [-4.5, -3.5],
  [4.5, -3.5],
  [5.2, 3],
  [3.4, 6],
  [-3.8, 6],
  [-5.2, 3],
];

const lanternShape = [
  [-3, -4],
  [3, -4],
  [4, -1],
  [4, 4],
  [2, 6],
  [-2, 6],
  [-4, 4],
  [-4, -1],
];

const lanternCoreShape = [
  [-2, -2],
  [2, -2],
  [2, 3],
  [-2, 3],
];

const harpoonShaftShape = [
  [-1, -16],
  [1, -16],
  [1.2, 15],
  [-1.2, 15],
];

const harpoonTipShape = [
  [-3.2, -17],
  [0, -23],
  [3.2, -17],
];

const harpoonHookShape = [
  [1, -10],
  [4.5, -12],
  [5.8, -8],
  [2.8, -6],
];

const headShape = ellipsePoints(0, 0, 5.6, 6.5, 14);
const hairShape = [
  [-5.6, -4.4],
  [4.8, -4.4],
  [5.2, 0],
  [3.2, 4.4],
  [0.6, 2.8],
  [-1, 4.4],
  [-4.2, 2.8],
  [-5.8, -0.8],
];

const faceShadowShape = [
  [-3.8, -1],
  [3.8, -1],
  [3.2, 3.8],
  [0, 5],
  [-3.4, 3.8],
];

const bootShape = [
  [-4.4, 11],
  [4.4, 11],
  [5.4, 15],
  [0.6, 16.4],
  [-5.4, 15.4],
];

const innerArmShape = [
  [-1.2, 1],
  [1.2, 1],
  [1.6, 13],
  [0.8, 14.5],
  [-0.8, 14.5],
  [-1.6, 13],
];

const beltShape = [
  [-6.4, 0.8],
  [6.4, 0.8],
  [5.6, 2.6],
  [-5.6, 2.6],
];

const outlineColor = parseHexColor(PLAYER_SPRITE_PALETTE.outline);

function ellipsePoints(centerX, centerY, radiusX, radiusY, segments) {
  return Array.from({ length: segments }, (_, index) => {
    const angle = (Math.PI * 2 * index) / segments;

    return [centerX + Math.cos(angle) * radiusX, centerY + Math.sin(angle) * radiusY];
  });
}

function parseHexColor(hex) {
  if (HEX_CACHE.has(hex)) {
    return HEX_CACHE.get(hex);
  }

  const value = hex.replace('#', '');
  const color = [
    Number.parseInt(value.slice(0, 2), 16),
    Number.parseInt(value.slice(2, 4), 16),
    Number.parseInt(value.slice(4, 6), 16),
    255,
  ];

  HEX_CACHE.set(hex, color);

  return color;
}

function transformPoint([x, y], transform) {
  const scaleX = transform.scaleX ?? 1;
  const scaleY = transform.scaleY ?? 1;
  const radians = (transform.rotation * Math.PI) / 180;
  const scaledX = x * scaleX;
  const scaledY = y * scaleY;
  const rotatedX = scaledX * Math.cos(radians) - scaledY * Math.sin(radians);
  const rotatedY = scaledX * Math.sin(radians) + scaledY * Math.cos(radians);

  return [rotatedX + transform.x, rotatedY + transform.y];
}

function transformPolygon(points, transform) {
  return points.map((point) => transformPoint(point, transform));
}

function translatePolygon(points, offsetX, offsetY) {
  return points.map(([x, y]) => [x + offsetX, y + offsetY]);
}

function createPrimitive(partId, points, colorKey) {
  return {
    partId,
    points,
    color: parseHexColor(PLAYER_SPRITE_PALETTE[colorKey]),
  };
}

function createPartPrimitives(partId, transform) {
  const partTransform = {
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
    ...transform,
  };

  switch (partId) {
    case 'harpoon':
      return [
        createPrimitive(partId, transformPolygon(harpoonShaftShape, partTransform), 'metal'),
        createPrimitive(partId, transformPolygon(harpoonTipShape, partTransform), 'cloth'),
        createPrimitive(partId, transformPolygon(harpoonHookShape, partTransform), 'clothShadow'),
      ];
    case 'backArm':
      return [
        createPrimitive(partId, transformPolygon(armShape, partTransform), 'coatShadow'),
        createPrimitive(partId, transformPolygon(innerArmShape, partTransform), 'clothShadow'),
      ];
    case 'frontArm':
      return [
        createPrimitive(partId, transformPolygon(armShape, partTransform), 'coatLight'),
        createPrimitive(partId, transformPolygon(innerArmShape, partTransform), 'cloth'),
      ];
    case 'backLeg':
      return [
        createPrimitive(partId, transformPolygon(legShape, partTransform), 'coatShadow'),
        createPrimitive(partId, transformPolygon(bootShape, partTransform), 'boot'),
      ];
    case 'frontLeg':
      return [
        createPrimitive(partId, transformPolygon(legShape, partTransform), 'coatMain'),
        createPrimitive(partId, transformPolygon(bootShape, partTransform), 'boot'),
      ];
    case 'scarf':
      return [
        createPrimitive(
          partId,
          transformPolygon(translatePolygon(scarfTailShape, 0, 3), partTransform),
          'scarf'
        ),
        createPrimitive(partId, transformPolygon(scarfKnotShape, partTransform), 'scarfLight'),
      ];
    case 'torso':
      return [
        createPrimitive(partId, transformPolygon(torsoShape, partTransform), 'coatMain'),
        createPrimitive(partId, transformPolygon(torsoFrontShape, partTransform), 'cloth'),
        createPrimitive(partId, transformPolygon(beltShape, partTransform), 'satchel'),
      ];
    case 'mantle':
      return [
        createPrimitive(partId, transformPolygon(mantleShape, partTransform), 'coatLight'),
        createPrimitive(
          partId,
          transformPolygon(
            translatePolygon(mantleShape, 0, 2.4).map(([x, y]) => [x * 0.78, y * 0.66]),
            partTransform
          ),
          'coatShadow'
        ),
      ];
    case 'head':
      return [
        createPrimitive(partId, transformPolygon(headShape, partTransform), 'skin'),
        createPrimitive(partId, transformPolygon(faceShadowShape, partTransform), 'skin'),
      ];
    case 'hair':
      return [
        createPrimitive(partId, transformPolygon(hairShape, partTransform), 'hair'),
        createPrimitive(
          partId,
          transformPolygon(
            translatePolygon(hairShape, 0.4, 1.1).map(([x, y]) => [x * 0.72, y * 0.64]),
            partTransform
          ),
          'hairShadow'
        ),
      ];
    case 'satchel':
      return [
        createPrimitive(partId, transformPolygon(satchelShape, partTransform), 'satchel'),
        createPrimitive(
          partId,
          transformPolygon(
            translatePolygon(satchelShape, 0.2, 1.4).map(([x, y]) => [x * 0.72, y * 0.5]),
            partTransform
          ),
          'satchelShadow'
        ),
      ];
    case 'lantern':
      return [
        createPrimitive(partId, transformPolygon(lanternShape, partTransform), 'lantern'),
        createPrimitive(partId, transformPolygon(lanternCoreShape, partTransform), 'lanternCore'),
      ];
    default:
      return [];
  }
}

function pointInPolygon(x, y, polygon) {
  let isInside = false;

  for (let index = 0, nextIndex = polygon.length - 1; index < polygon.length; nextIndex = index++) {
    const [x1, y1] = polygon[index];
    const [x2, y2] = polygon[nextIndex];
    const intersects =
      y1 > y !== y2 > y && x < ((x2 - x1) * (y - y1)) / (y2 - y1 || Number.EPSILON) + x1;

    if (intersects) {
      isInside = !isInside;
    }
  }

  return isInside;
}

function fillPolygon(buffer, width, height, polygon, color, alphaMultiplier = 1) {
  const minX = Math.max(0, Math.floor(Math.min(...polygon.map(([x]) => x))));
  const maxX = Math.min(width - 1, Math.ceil(Math.max(...polygon.map(([x]) => x))));
  const minY = Math.max(0, Math.floor(Math.min(...polygon.map(([, y]) => y))));
  const maxY = Math.min(height - 1, Math.ceil(Math.max(...polygon.map(([, y]) => y))));

  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      if (pointInPolygon(x + 0.5, y + 0.5, polygon)) {
        setPixel(buffer, width, x, y, color, alphaMultiplier);
      }
    }
  }
}

function setPixel(buffer, width, x, y, color, alphaMultiplier = 1) {
  if (x < 0 || y < 0) {
    return;
  }

  const index = (y * width + x) * 4;
  const sourceAlpha = (color[3] / 255) * alphaMultiplier;
  const destinationAlpha = buffer[index + 3] / 255;
  const outputAlpha = sourceAlpha + destinationAlpha * (1 - sourceAlpha);

  if (outputAlpha <= 0) {
    return;
  }

  buffer[index] = Math.round(
    (color[0] * sourceAlpha + buffer[index] * destinationAlpha * (1 - sourceAlpha)) / outputAlpha
  );
  buffer[index + 1] = Math.round(
    (color[1] * sourceAlpha + buffer[index + 1] * destinationAlpha * (1 - sourceAlpha)) /
      outputAlpha
  );
  buffer[index + 2] = Math.round(
    (color[2] * sourceAlpha + buffer[index + 2] * destinationAlpha * (1 - sourceAlpha)) /
      outputAlpha
  );
  buffer[index + 3] = Math.round(outputAlpha * 255);
}

function addOutline(buffer, width, height) {
  const source = new Uint8ClampedArray(buffer);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;

      if (source[index + 3] > 0) {
        continue;
      }

      let hasNeighbor = false;

      for (let offsetY = -1; offsetY <= 1 && !hasNeighbor; offsetY += 1) {
        for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
          if (offsetX === 0 && offsetY === 0) {
            continue;
          }

          const neighborX = x + offsetX;
          const neighborY = y + offsetY;

          if (neighborX < 0 || neighborY < 0 || neighborX >= width || neighborY >= height) {
            continue;
          }

          const neighborIndex = (neighborY * width + neighborX) * 4;

          if (source[neighborIndex + 3] > 0) {
            hasNeighbor = true;
            break;
          }
        }
      }

      if (hasNeighbor) {
        buffer[index] = outlineColor[0];
        buffer[index + 1] = outlineColor[1];
        buffer[index + 2] = outlineColor[2];
        buffer[index + 3] = 255;
      }
    }
  }
}

function createGeometryEntry(partId, transform, polygons) {
  const meta = PART_META[partId] ?? PART_META.torso;
  const radians = (transform.rotation * Math.PI) / 180;
  const anchor = { x: transform.x, y: transform.y };
  const rotateHandle = {
    x: anchor.x + Math.cos(radians - Math.PI / 2) * meta.rotateDistance,
    y: anchor.y + Math.sin(radians - Math.PI / 2) * meta.rotateDistance,
  };
  const scaleHandle = {
    x: anchor.x + Math.cos(radians) * meta.scaleDistance,
    y: anchor.y + Math.sin(radians) * meta.scaleDistance,
  };

  return {
    partId,
    polygons,
    anchor,
    rotateHandle,
    scaleHandle,
    hitRadius: meta.hitRadius,
  };
}

export function renderSpriteFrame(frame, options = {}) {
  const width = options.width ?? SPRITE_CANVAS.width;
  const height = options.height ?? SPRITE_CANVAS.height;
  const alphaMultiplier = options.alphaMultiplier ?? 1;
  const pixels = new Uint8ClampedArray(width * height * 4);
  const geometry = [];

  BODY_ORDER.forEach((partId) => {
    const primitives = createPartPrimitives(partId, frame.parts[partId]);

    if (!primitives.length) {
      return;
    }

    const polygons = primitives.map((primitive) => primitive.points);

    geometry.push(createGeometryEntry(partId, frame.parts[partId], polygons));

    primitives.forEach((primitive) => {
      fillPolygon(pixels, width, height, primitive.points, primitive.color, alphaMultiplier);
    });
  });

  if (options.outline !== false) {
    addOutline(pixels, width, height);
  }

  return {
    width,
    height,
    pixels,
    geometry,
  };
}

export function drawSpriteToCanvas(context, renderResult, scale, options = {}) {
  const clear = options.clear !== false;
  const offsetX = options.offsetX ?? 0;
  const offsetY = options.offsetY ?? 0;

  if (clear) {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  }

  context.imageSmoothingEnabled = false;

  for (let y = 0; y < renderResult.height; y += 1) {
    for (let x = 0; x < renderResult.width; x += 1) {
      const index = (y * renderResult.width + x) * 4;
      const alpha = renderResult.pixels[index + 3];

      if (alpha === 0) {
        continue;
      }

      context.fillStyle = `rgba(${renderResult.pixels[index]}, ${renderResult.pixels[index + 1]}, ${renderResult.pixels[index + 2]}, ${alpha / 255})`;
      context.fillRect(offsetX + x * scale, offsetY + y * scale, scale, scale);
    }
  }
}

export function drawStudioBackdrop(context, scale) {
  const cell = scale * 3;

  context.clearRect(0, 0, context.canvas.width, context.canvas.height);

  for (let y = 0; y < context.canvas.height; y += cell) {
    for (let x = 0; x < context.canvas.width; x += cell) {
      const isOdd = (x / cell + y / cell) % 2 === 0;
      context.fillStyle = isOdd ? 'rgba(255, 249, 237, 0.85)' : 'rgba(222, 234, 234, 0.9)';
      context.fillRect(x, y, cell, cell);
    }
  }
}

export function drawRigOverlay(context, renderResult, scale, selectedPartId) {
  context.save();
  context.lineWidth = 1.5;
  context.font = '12px "Noto Sans KR", sans-serif';

  renderResult.geometry.forEach((part) => {
    const isSelected = part.partId === selectedPartId;

    context.strokeStyle = isSelected ? 'rgba(14, 60, 68, 0.95)' : 'rgba(20, 53, 58, 0.34)';

    part.polygons.forEach((polygon) => {
      context.beginPath();
      polygon.forEach(([x, y], index) => {
        const drawX = x * scale;
        const drawY = y * scale;

        if (index === 0) {
          context.moveTo(drawX, drawY);
        } else {
          context.lineTo(drawX, drawY);
        }
      });
      context.closePath();
      context.stroke();
    });

    context.beginPath();
    context.fillStyle = isSelected ? '#143d39' : 'rgba(20, 53, 58, 0.55)';
    context.arc(part.anchor.x * scale, part.anchor.y * scale, isSelected ? 6 : 4, 0, Math.PI * 2);
    context.fill();

    if (isSelected) {
      context.beginPath();
      context.fillStyle = '#f0b14d';
      context.arc(part.rotateHandle.x * scale, part.rotateHandle.y * scale, 5, 0, Math.PI * 2);
      context.fill();

      context.beginPath();
      context.fillStyle = '#cf765e';
      context.arc(part.scaleHandle.x * scale, part.scaleHandle.y * scale, 5, 0, Math.PI * 2);
      context.fill();

      const partLabel = PLAYER_PARTS.find((item) => item.id === part.partId)?.label ?? part.partId;
      context.fillStyle = '#143d39';
      context.fillText(partLabel, part.anchor.x * scale + 10, part.anchor.y * scale - 10);
    }
  });

  context.restore();
}

export function distanceBetween(pointA, pointB) {
  return Math.hypot(pointA.x - pointB.x, pointA.y - pointB.y);
}

export function findPartAtPoint(geometry, point) {
  for (let index = geometry.length - 1; index >= 0; index -= 1) {
    const part = geometry[index];

    if (distanceBetween(part.rotateHandle, point) <= 1.4) {
      return { partId: part.partId, mode: 'rotate' };
    }

    if (distanceBetween(part.scaleHandle, point) <= 1.4) {
      return { partId: part.partId, mode: 'scale' };
    }

    if (distanceBetween(part.anchor, point) <= part.hitRadius / 4) {
      return { partId: part.partId, mode: 'move' };
    }

    if (part.polygons.some((polygon) => pointInPolygon(point.x, point.y, polygon))) {
      return { partId: part.partId, mode: 'move' };
    }
  }

  return null;
}

function crc32(bytes) {
  let crc = 0xffffffff;

  for (const value of bytes) {
    crc ^= value;

    for (let bit = 0; bit < 8; bit += 1) {
      const mask = -(crc & 1);
      crc = (crc >>> 1) ^ (0xedb88320 & mask);
    }
  }

  return (crc ^ 0xffffffff) >>> 0;
}

function adler32(bytes) {
  let a = 1;
  let b = 0;

  for (const value of bytes) {
    a = (a + value) % 65521;
    b = (b + a) % 65521;
  }

  return ((b << 16) | a) >>> 0;
}

function uint32Bytes(value) {
  return new Uint8Array([
    (value >>> 24) & 0xff,
    (value >>> 16) & 0xff,
    (value >>> 8) & 0xff,
    value & 0xff,
  ]);
}

function makeChunk(type, data) {
  const typeBytes = new TextEncoder().encode(type);
  const crcBytes = new Uint8Array(typeBytes.length + data.length);
  crcBytes.set(typeBytes, 0);
  crcBytes.set(data, typeBytes.length);
  const chunk = new Uint8Array(12 + data.length);

  chunk.set(uint32Bytes(data.length), 0);
  chunk.set(typeBytes, 4);
  chunk.set(data, 8);
  chunk.set(uint32Bytes(crc32(crcBytes)), 8 + data.length);

  return chunk;
}

function concatArrays(...arrays) {
  const totalLength = arrays.reduce((sum, array) => sum + array.length, 0);
  const output = new Uint8Array(totalLength);
  let offset = 0;

  arrays.forEach((array) => {
    output.set(array, offset);
    offset += array.length;
  });

  return output;
}

function zlibStore(rawData) {
  const blocks = [];
  let offset = 0;

  while (offset < rawData.length) {
    const blockLength = Math.min(65535, rawData.length - offset);
    const isFinal = offset + blockLength >= rawData.length;
    const block = new Uint8Array(5 + blockLength);

    block[0] = isFinal ? 0x01 : 0x00;
    block[1] = blockLength & 0xff;
    block[2] = (blockLength >>> 8) & 0xff;
    block[3] = ~blockLength & 0xff;
    block[4] = (~blockLength >>> 8) & 0xff;
    block.set(rawData.subarray(offset, offset + blockLength), 5);
    blocks.push(block);
    offset += blockLength;
  }

  return concatArrays(new Uint8Array([0x78, 0x01]), ...blocks, uint32Bytes(adler32(rawData)));
}

export function encodePng(width, height, pixels) {
  const signature = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = new Uint8Array(13);

  ihdr.set(uint32Bytes(width), 0);
  ihdr.set(uint32Bytes(height), 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const rowLength = width * 4 + 1;
  const rawData = new Uint8Array(rowLength * height);

  for (let y = 0; y < height; y += 1) {
    const rowOffset = y * rowLength;
    rawData[rowOffset] = 0;
    rawData.set(pixels.subarray(y * width * 4, (y + 1) * width * 4), rowOffset + 1);
  }

  return concatArrays(
    signature,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', zlibStore(rawData)),
    makeChunk('IEND', new Uint8Array())
  );
}
