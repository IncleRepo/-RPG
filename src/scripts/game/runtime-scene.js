import { getAnimationClip, sampleAnimationClip, ANIMATION_LIBRARY } from '../animation-data.js';
import { CHIZURU_APPEARANCE, drawHumanoid } from '../canvas-animation.js';
import { CHIZURU_NPC, getChizuruDialogue } from '../chizuru-npc.js';
import { createCritterRenderActor, drawFieldCritter } from '../field-critters.js';
import { sampleVisualTerrainY } from '../stage-layout.js';
import {
  clamp,
  createSpriteImage,
  fillRoundedRect,
  strokeRoundedRect,
  wrapText,
} from './helpers.js';

export const CHARACTER_COLLIDER = Object.freeze({
  width: 52,
  height: 90,
  scale: 1.05,
});

export const NPC_COLLIDER = Object.freeze({
  width: 56,
  height: 94,
  scale: 1.04,
});

export const CHIZURU_SPRITE_LAYOUT = Object.freeze({
  height: 172,
  talkingHeight: 176,
  groundSink: 8,
  bubbleAnchorHeight: 154,
});

const SKY_PALETTE = {
  day: {
    top: [94, 184, 255],
    mid: [143, 212, 255],
    bottom: [215, 243, 255],
  },
  sunset: {
    top: [253, 138, 101],
    mid: [255, 186, 127],
    bottom: [255, 231, 176],
  },
  night: {
    top: [10, 22, 45],
    mid: [30, 54, 97],
    bottom: [83, 120, 177],
  },
};

export function createWorldState() {
  return {
    elapsedSeconds: 14,
    runtimeSeconds: 0,
    cycleDuration: 72,
    fieldCritters: [],
    clouds: [
      createCloud(0.22, 0.16, 18, 0.12, 10, 0.5, 0.96, 0.5),
      createCloud(0.18, 0.28, 14, 0.42, 8, 0.4, 0.82, 1.6),
      createCloud(0.19, 0.09, 16, 0.72, 12, 0.45, 0.88, 2.2),
      createCloud(0.24, 0.2, 26, 0.18, 14, 0.72, 1.08, 0.9),
      createCloud(0.21, 0.35, 22, 0.54, 10, 0.65, 0.94, 1.9),
      createCloud(0.26, 0.12, 28, 0.84, 16, 0.78, 1.12, 2.8),
    ],
  };
}

export function createChizuruSprites(spriteUrls) {
  return Object.freeze({
    idle: createSpriteImage(spriteUrls.idle),
    talking: createSpriteImage(spriteUrls.talking),
  });
}

export function syncBackgroundScene(worldState, stageMetrics) {
  for (const cloud of worldState.clouds) {
    cloud.width = clamp(stageMetrics.width * cloud.widthRatio, 88, stageMetrics.width * 0.34);
    cloud.baseY = stageMetrics.height * cloud.topRatio;
    cloud.x = calculateCloudTravelWidth(cloud, stageMetrics.width) * cloud.startRatio - cloud.width;
  }
}

export function updateBackground(worldState, deltaSeconds, stageMetrics) {
  worldState.elapsedSeconds = (worldState.elapsedSeconds + deltaSeconds) % worldState.cycleDuration;
  worldState.runtimeSeconds += deltaSeconds;

  for (const cloud of worldState.clouds) {
    cloud.x += cloud.speed * deltaSeconds;

    const wrapPoint = stageMetrics.width + cloud.width;
    if (cloud.x > wrapPoint) {
      cloud.x = -cloud.width * 1.35;
    }
  }
}

export function positionChizuru(chizuruState, stageMetrics) {
  const anchorPlatform =
    stageMetrics.platforms.find((platform) => platform.name === CHIZURU_NPC.anchorPlatform) ??
    stageMetrics.platforms.at(-1);

  if (!anchorPlatform) {
    return;
  }

  chizuruState.x = clamp(
    stageMetrics.width * CHIZURU_NPC.xRatio - chizuruState.width / 2,
    0,
    Math.max(0, stageMetrics.width - chizuruState.width)
  );
  chizuruState.y = stageMetrics.height - anchorPlatform.top;
}

export function renderScene(options) {
  const {
    canvas,
    context,
    stageMetrics,
    worldState,
    playerState,
    chizuruState,
    chizuruSprites,
    motionState,
    playerAppearance,
    touchUiEnabled,
  } = options;

  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.setTransform(stageMetrics.dpr, 0, 0, stageMetrics.dpr, 0, 0);

  const lighting = getLighting(worldState);
  drawSky(context, stageMetrics, lighting);
  drawStars(context, stageMetrics, lighting, worldState.runtimeSeconds);
  drawOrbitBodies(context, stageMetrics, lighting);
  drawMountains(context, stageMetrics, lighting);
  drawClouds(context, worldState, lighting);
  drawPlatforms(context, stageMetrics);

  const playerPose = sampleAnimationClip(
    getAnimationClip(ANIMATION_LIBRARY, motionState),
    worldState.runtimeSeconds
  );
  const npcPose = {
    ...sampleAnimationClip(
      getAnimationClip(ANIMATION_LIBRARY, 'idle'),
      worldState.runtimeSeconds + 0.45
    ),
    headTilt: chizuruState.talking ? 8 : 2,
    armRight: chizuruState.talking ? 16 : 4,
  };
  const entities = [
    createRenderActor(
      playerState,
      playerPose,
      playerAppearance,
      CHARACTER_COLLIDER.scale,
      stageMetrics
    ),
    createChizuruRenderActor(chizuruState, npcPose, worldState, chizuruSprites, stageMetrics),
    ...worldState.fieldCritters.map((critter) =>
      createCritterRenderActor(critter, stageMetrics, worldState.runtimeSeconds)
    ),
  ].sort((left, right) => left.baseY - right.baseY || left.x - right.x);

  for (const actor of entities) {
    if (actor.type === 'critter') {
      drawFieldCritter(context, actor);
      continue;
    }

    if (actor.type === 'chizuru-sprite') {
      drawChizuruSprite(context, actor);
      continue;
    }

    drawHumanoid(context, actor);
  }

  drawDialogueOverlay(context, stageMetrics, chizuruState, chizuruSprites, touchUiEnabled);
  return lighting;
}

export function getTimeLabel(progress) {
  if (progress < 0.12 || progress >= 0.9) {
    return '깊은 밤';
  }

  if (progress < 0.24) {
    return '새벽';
  }

  if (progress < 0.38) {
    return '아침';
  }

  if (progress < 0.62) {
    return '낮';
  }

  if (progress < 0.76) {
    return '노을';
  }

  return '밤';
}

export function resolveGroundedHumanoidFooting(entityState, pose, stageMetrics) {
  const centerX = entityState.x + entityState.width / 2;
  const facingSign = entityState.facing === 'left' ? -1 : 1;
  const leftFootWorldX = clamp(centerX + pose.footLeftX * facingSign, 0, stageMetrics.width);
  const rightFootWorldX = clamp(centerX + pose.footRightX * facingSign, 0, stageMetrics.width);
  const leftGroundY = sampleVisualTerrainY(leftFootWorldX, stageMetrics.platforms);
  const rightGroundY = sampleVisualTerrainY(rightFootWorldX, stageMetrics.platforms);
  const support =
    entityState.supportIndex !== null && entityState.supportIndex !== undefined
      ? stageMetrics.platforms[entityState.supportIndex]
      : null;
  const supportGroundY = support
    ? sampleVisualTerrainY(clamp(centerX, support.left, support.right), [support])
    : Math.min(leftGroundY, rightGroundY);
  const baseY = Math.min(leftGroundY, rightGroundY, supportGroundY);

  return {
    centerX,
    leftFootWorldX,
    rightFootWorldX,
    leftGroundY,
    rightGroundY,
    supportGroundY,
    baseY,
    footHeights: {
      left: baseY - leftGroundY,
      right: baseY - rightGroundY,
    },
  };
}

function createRenderActor(entityState, pose, appearance, scale, stageMetrics) {
  const grounded = entityState.grounded ?? true;

  if (!grounded) {
    const centerX = entityState.x + entityState.width / 2;

    return {
      x: centerX,
      baseY: stageMetrics.height - entityState.y,
      pose,
      appearance,
      facing: entityState.facing,
      scale,
      footHeights: { left: 0, right: 0 },
      shadowOpacity: 0.16,
      grounded: false,
    };
  }

  const groundedFooting = resolveGroundedHumanoidFooting(entityState, pose, stageMetrics);

  return {
    x: groundedFooting.centerX,
    baseY: groundedFooting.baseY,
    pose,
    appearance,
    facing: entityState.facing,
    scale,
    footHeights: groundedFooting.footHeights,
    shadowOpacity: 0.24,
    grounded: true,
  };
}

function createChizuruRenderActor(chizuruState, pose, worldState, chizuruSprites, stageMetrics) {
  if (!isChizuruSpriteReady(chizuruState, chizuruSprites)) {
    return createRenderActor(
      chizuruState,
      pose,
      CHIZURU_APPEARANCE,
      NPC_COLLIDER.scale,
      stageMetrics
    );
  }

  const centerX = chizuruState.x + chizuruState.width / 2;
  const baseY = sampleVisualTerrainY(centerX, stageMetrics.platforms);

  return {
    type: 'chizuru-sprite',
    x: centerX,
    baseY,
    runtimeSeconds: worldState.runtimeSeconds,
    sprite: getActiveChizuruSprite(chizuruState, chizuruSprites),
    talking: chizuruState.talking,
  };
}

function drawChizuruSprite(context, actor) {
  const { sprite, runtimeSeconds, talking } = actor;
  const renderHeight = talking ? CHIZURU_SPRITE_LAYOUT.talkingHeight : CHIZURU_SPRITE_LAYOUT.height;
  const renderWidth = renderHeight * (sprite.naturalWidth / sprite.naturalHeight);
  const sway = Math.sin(runtimeSeconds * (talking ? 3.8 : 1.6)) * (talking ? 1.8 : 0.8);
  const bob = Math.sin(runtimeSeconds * (talking ? 4.2 : 2.1)) * (talking ? 2.4 : 1.2);
  const drawX = Math.round(actor.x - renderWidth / 2 + sway);
  const drawY = Math.round(actor.baseY - renderHeight + CHIZURU_SPRITE_LAYOUT.groundSink - bob);

  context.save();
  context.imageSmoothingEnabled = false;
  context.drawImage(sprite, drawX, drawY, Math.round(renderWidth), renderHeight);
  context.restore();
}

function drawDialogueOverlay(context, stageMetrics, chizuruState, chizuruSprites, touchUiEnabled) {
  if (!chizuruState.nearby && !chizuruState.talking) {
    return;
  }

  const npcCenterX = chizuruState.x + chizuruState.width / 2;
  const npcTopY =
    stageMetrics.height -
    chizuruState.y -
    getChizuruBubbleAnchorHeight(chizuruState, chizuruSprites);

  if (chizuruState.talking) {
    const bubbleWidth = Math.min(300, stageMetrics.width * 0.42);
    const bubbleX = clamp(npcCenterX - bubbleWidth / 2, 18, stageMetrics.width - bubbleWidth - 18);
    context.font = '14px "Noto Sans KR", sans-serif';
    const lines = wrapText(
      context,
      getChizuruDialogue(chizuruState.dialogueIndex),
      bubbleWidth - 28
    );
    const bubbleHeight = 42 + lines.length * 20;
    const bubbleY = clamp(npcTopY - bubbleHeight - 34, 16, stageMetrics.height * 0.45);

    fillRoundedRect(
      context,
      bubbleX,
      bubbleY,
      bubbleWidth,
      bubbleHeight,
      18,
      'rgba(255, 251, 247, 0.94)'
    );
    context.strokeStyle = 'rgba(98, 56, 49, 0.14)';
    context.lineWidth = 1;
    strokeRoundedRect(context, bubbleX, bubbleY, bubbleWidth, bubbleHeight, 18);

    context.fillStyle = '#773e39';
    context.font = '700 13px "Noto Sans KR", sans-serif';
    context.fillText(CHIZURU_NPC.name, bubbleX + 14, bubbleY + 18);

    context.fillStyle = '#4a3328';
    lines.forEach((line, index) => {
      context.fillText(line, bubbleX + 14, bubbleY + 44 + index * 20);
    });

    context.fillStyle = 'rgba(255, 251, 247, 0.94)';
    context.beginPath();
    context.moveTo(npcCenterX - 8, bubbleY + bubbleHeight - 2);
    context.lineTo(npcCenterX + 8, bubbleY + bubbleHeight - 2);
    context.lineTo(npcCenterX, bubbleY + bubbleHeight + 14);
    context.closePath();
    context.fill();
    return;
  }

  const prompt = touchUiEnabled ? '대화' : 'E 대화';
  context.font = '700 13px "Noto Sans KR", sans-serif';
  const textWidth = context.measureText(prompt).width;
  const width = textWidth + 34;
  const x = clamp(npcCenterX - width / 2, 16, stageMetrics.width - width - 16);
  const y = npcTopY - 38;

  fillRoundedRect(context, x, y, width, 28, 999, 'rgba(255, 250, 244, 0.9)');
  context.strokeStyle = 'rgba(93, 52, 44, 0.12)';
  context.lineWidth = 1;
  strokeRoundedRect(context, x, y, width, 28, 999);
  context.fillStyle = '#5c332a';
  context.fillText(prompt, x + 17, y + 19);
}

function getActiveChizuruSprite(chizuruState, chizuruSprites) {
  return chizuruState.talking ? chizuruSprites.talking : chizuruSprites.idle;
}

function isChizuruSpriteReady(chizuruState, chizuruSprites) {
  const activeSprite = getActiveChizuruSprite(chizuruState, chizuruSprites);
  return activeSprite.complete && activeSprite.naturalWidth > 0 && activeSprite.naturalHeight > 0;
}

function getChizuruBubbleAnchorHeight(chizuruState, chizuruSprites) {
  if (isChizuruSpriteReady(chizuruState, chizuruSprites)) {
    return CHIZURU_SPRITE_LAYOUT.bubbleAnchorHeight;
  }

  return chizuruState.height * 1.1;
}

function drawSky(context, stageMetrics, lighting) {
  const gradient = context.createLinearGradient(0, 0, 0, stageMetrics.height);
  gradient.addColorStop(0, rgbToCss(lighting.skyTop));
  gradient.addColorStop(0.55, rgbToCss(lighting.skyMid));
  gradient.addColorStop(1, rgbToCss(lighting.skyBottom));
  context.fillStyle = gradient;
  context.fillRect(0, 0, stageMetrics.width, stageMetrics.height);

  context.fillStyle = `rgba(255, 255, 255, ${0.08 + lighting.daylight * 0.16 + lighting.twilight * 0.1})`;
  context.beginPath();
  context.ellipse(stageMetrics.width * 0.22, stageMetrics.height * 0.17, 96, 54, 0, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = `rgba(8, 20, 43, ${clamp((1 - lighting.daylight) * 0.4, 0, 0.42)})`;
  context.fillRect(0, 0, stageMetrics.width, stageMetrics.height);
}

function drawStars(context, stageMetrics, lighting, runtimeSeconds) {
  const opacity = clamp((1 - lighting.daylight) * 1.08, 0, 1);

  if (opacity <= 0.04) {
    return;
  }

  const stars = [
    [0.16, 0.12, 5],
    [0.42, 0.18, 4],
    [0.74, 0.1, 6],
    [0.68, 0.3, 3],
    [0.82, 0.24, 4],
  ];

  context.fillStyle = `rgba(255, 247, 191, ${opacity})`;

  for (const [xRatio, yRatio, radius] of stars) {
    const x = stageMetrics.width * xRatio;
    const y = stageMetrics.height * yRatio;
    const pulse = 0.75 + Math.sin(runtimeSeconds * 1.4 + xRatio * 16) * 0.25;

    context.globalAlpha = opacity * pulse;
    context.beginPath();
    context.moveTo(x, y - radius);
    context.lineTo(x + radius * 0.35, y - radius * 0.35);
    context.lineTo(x + radius, y);
    context.lineTo(x + radius * 0.35, y + radius * 0.35);
    context.lineTo(x, y + radius);
    context.lineTo(x - radius * 0.35, y + radius * 0.35);
    context.lineTo(x - radius, y);
    context.lineTo(x - radius * 0.35, y - radius * 0.35);
    context.closePath();
    context.fill();
  }

  context.globalAlpha = 1;
}

function drawOrbitBodies(context, stageMetrics, lighting) {
  const sunX = stageMetrics.width * (0.5 + Math.cos(lighting.orbitAngle) * 0.43);
  const sunY = stageMetrics.height * (0.76 - Math.sin(lighting.orbitAngle) * 0.6);
  const moonX = stageMetrics.width * (0.5 - Math.cos(lighting.orbitAngle) * 0.38);
  const moonY = stageMetrics.height * (0.76 + Math.sin(lighting.orbitAngle) * 0.54);

  const sunGradient = context.createRadialGradient(
    sunX,
    sunY,
    8,
    sunX,
    sunY,
    stageMetrics.width * 0.09
  );
  sunGradient.addColorStop(0, `rgba(255, 247, 189, ${0.8 + lighting.twilight * 0.12})`);
  sunGradient.addColorStop(0.6, `rgba(255, 209, 94, ${0.65 + lighting.twilight * 0.08})`);
  sunGradient.addColorStop(1, 'rgba(255, 209, 94, 0)');
  context.fillStyle = sunGradient;
  context.globalAlpha = clamp(lighting.daylight * 1.06 + lighting.twilight * 0.24, 0.18, 1);
  context.beginPath();
  context.arc(sunX, sunY, stageMetrics.width * 0.09, 0, Math.PI * 2);
  context.fill();

  const moonGradient = context.createRadialGradient(
    moonX,
    moonY,
    4,
    moonX,
    moonY,
    stageMetrics.width * 0.07
  );
  moonGradient.addColorStop(0, 'rgba(245, 248, 255, 0.96)');
  moonGradient.addColorStop(0.58, 'rgba(192, 210, 238, 0.92)');
  moonGradient.addColorStop(1, 'rgba(192, 210, 238, 0)');
  context.fillStyle = moonGradient;
  context.globalAlpha = clamp((1 - lighting.daylight) * 0.96, 0.12, 1);
  context.beginPath();
  context.arc(moonX, moonY, stageMetrics.width * 0.07, 0, Math.PI * 2);
  context.fill();
  context.globalAlpha = 1;
}

function drawClouds(context, worldState, lighting) {
  const farCount = 3;

  worldState.clouds.forEach((cloud, index) => {
    const bobOffset =
      Math.sin(worldState.elapsedSeconds * cloud.bobSpeed + cloud.phase) * cloud.bobAmplitude;
    const x = cloud.x;
    const y = cloud.baseY + bobOffset;
    const width = cloud.width;
    const height = width * 0.35;
    const opacity =
      index < farCount ? 0.46 + lighting.daylight * 0.18 : 0.62 + lighting.daylight * 0.12;

    context.save();
    context.translate(x, y);
    context.scale(cloud.scale, cloud.scale);
    context.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    context.beginPath();
    context.ellipse(width * 0.2, height * 0.52, width * 0.18, height * 0.28, 0, 0, Math.PI * 2);
    context.ellipse(width * 0.42, height * 0.38, width * 0.23, height * 0.32, 0, 0, Math.PI * 2);
    context.ellipse(width * 0.66, height * 0.48, width * 0.2, height * 0.26, 0, 0, Math.PI * 2);
    context.fill();
    context.restore();
  });
}

function drawMountains(context, stageMetrics, lighting) {
  const mountains = [
    {
      left: 0.04,
      width: 0.32,
      height: 0.38,
      color: `rgba(113, 170, 150, ${0.36 + lighting.daylight * 0.12})`,
    },
    {
      left: 0.28,
      width: 0.42,
      height: 0.48,
      color: `rgba(76, 131, 104, ${0.42 + lighting.daylight * 0.14})`,
    },
    {
      left: 0.64,
      width: 0.38,
      height: 0.44,
      color: `rgba(51, 104, 83, ${0.48 + lighting.daylight * 0.16})`,
    },
  ];

  for (const mountain of mountains) {
    const left = stageMetrics.width * mountain.left;
    const width = stageMetrics.width * mountain.width;
    const baseY = stageMetrics.height * 0.82;
    const peakY = baseY - stageMetrics.height * mountain.height;

    context.fillStyle = mountain.color;
    context.beginPath();
    context.moveTo(left, baseY);
    context.lineTo(left + width * 0.5, peakY);
    context.lineTo(left + width, baseY);
    context.closePath();
    context.fill();
  }
}

function drawPlatforms(context, stageMetrics) {
  for (const platform of stageMetrics.platforms) {
    if (platform.name === 'ground') {
      const gradient = context.createLinearGradient(0, platform.top, 0, platform.bottom);
      gradient.addColorStop(0, '#6a9c4d');
      gradient.addColorStop(0.22, '#6a9c4d');
      gradient.addColorStop(0.22, '#7d5433');
      gradient.addColorStop(1, '#57361f');
      context.fillStyle = gradient;
      context.fillRect(0, platform.top, stageMetrics.width, platform.height);
      continue;
    }

    const gradient = context.createLinearGradient(0, platform.top, 0, platform.bottom);
    gradient.addColorStop(0, '#8cc26b');
    gradient.addColorStop(0.28, '#8cc26b');
    gradient.addColorStop(0.28, '#7a5734');
    gradient.addColorStop(1, '#5a3d21');
    fillRoundedRect(
      context,
      platform.left,
      platform.top,
      platform.width,
      platform.height,
      12,
      gradient
    );
    context.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    context.lineWidth = 2;
    strokeRoundedRect(context, platform.left, platform.top, platform.width, platform.height, 12);
  }
}

function getLighting(worldState) {
  const cycleProgress = worldState.elapsedSeconds / worldState.cycleDuration;
  const orbitAngle = cycleProgress * Math.PI * 2 - Math.PI / 2;
  const sunHeight = Math.sin(orbitAngle);
  const daylight = clamp((sunHeight + 0.18) / 1.18, 0, 1);
  const twilight = 1 - clamp(Math.abs(sunHeight) * 1.9, 0, 1);

  return {
    cycleProgress,
    orbitAngle,
    daylight,
    twilight,
    skyTop: mixSkyColor('top', daylight, twilight),
    skyMid: mixSkyColor('mid', daylight, twilight),
    skyBottom: mixSkyColor('bottom', daylight, twilight),
  };
}

function mixSkyColor(tone, daylight, twilight) {
  const nightToSunset = mixColor(SKY_PALETTE.night[tone], SKY_PALETTE.sunset[tone], twilight);
  return mixColor(nightToSunset, SKY_PALETTE.day[tone], daylight);
}

function mixColor(from, to, amount) {
  return from.map((channel, index) => Math.round(channel + (to[index] - channel) * amount));
}

function rgbToCss(rgb) {
  return `rgb(${rgb.join(', ')})`;
}

function createCloud(
  widthRatio,
  topRatio,
  speed,
  startRatio,
  bobAmplitude,
  bobSpeed,
  scale,
  phase
) {
  return {
    widthRatio,
    topRatio,
    speed,
    startRatio,
    bobAmplitude,
    bobSpeed,
    scale,
    phase,
    width: 0,
    x: 0,
    baseY: 0,
  };
}

function calculateCloudTravelWidth(cloud, stageWidth) {
  return stageWidth + cloud.width * 2.35;
}
