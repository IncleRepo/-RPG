export const STAGE_LAYOUT = Object.freeze({
  aspectRatio: 16 / 9,
  platforms: Object.freeze([
    Object.freeze({
      name: 'small',
      leftRatio: 0.18,
      widthRatio: 0.14,
      topRatio: 0.61,
      heightRatio: 0.07,
    }),
    Object.freeze({
      name: 'mid',
      leftRatio: 0.43,
      widthRatio: 0.16,
      topRatio: 0.48,
      heightRatio: 0.07,
    }),
    Object.freeze({
      name: 'high',
      leftRatio: 0.69,
      widthRatio: 0.15,
      topRatio: 0.59,
      heightRatio: 0.07,
    }),
    Object.freeze({
      name: 'ground',
      leftRatio: 0,
      widthRatio: 1,
      topRatio: 0.82,
      heightRatio: 0.18,
    }),
  ]),
});

export function measureStageLayout(width, height) {
  return {
    width,
    height,
    platforms: STAGE_LAYOUT.platforms.map((definition) =>
      measurePlatform(definition, width, height)
    ),
  };
}

export function getTopSurfaceAtX(x, platforms) {
  return platforms.reduce((best, platform) => {
    if (x < platform.left || x > platform.right) {
      return best;
    }

    if (!best || platform.top < best.top) {
      return platform;
    }

    return best;
  }, null);
}

export function sampleVisualTerrainY(x, platforms) {
  const surface =
    getTopSurfaceAtX(x, platforms) ?? platforms.find((platform) => platform.name === 'ground');

  if (!surface) {
    return 0;
  }

  const span = Math.max(surface.right - surface.left, 1);
  const t = (x - surface.left) / span;

  if (surface.name === 'ground') {
    const roll = Math.sin(t * Math.PI * 5.4) * 4 + Math.sin(t * Math.PI * 11.2) * 1.8;
    return surface.top + roll;
  }

  return surface.top + Math.sin(t * Math.PI) * 1.6;
}

function measurePlatform(definition, width, height) {
  const left = Math.round(width * definition.leftRatio);
  const platformWidth = Math.round(width * definition.widthRatio);
  const top = Math.round(height * definition.topRatio);
  const platformHeight =
    definition.name === 'ground'
      ? Math.max(1, height - top)
      : Math.max(1, Math.round(height * definition.heightRatio));

  return {
    name: definition.name,
    left,
    right: left + platformWidth,
    top,
    bottom: top + platformHeight,
    width: platformWidth,
    height: platformHeight,
  };
}
