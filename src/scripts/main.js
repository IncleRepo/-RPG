import { getAnimationClip, sampleAnimationClip, ANIMATION_LIBRARY } from './animation-data.js';
import { BGMManager } from './bgm-manager.js';
import {
  CHIZURU_APPEARANCE,
  DEFAULT_PLAYER_APPEARANCE_CONFIG,
  drawHumanoid,
  HAIR_COLOR_OPTIONS,
  HAIR_STYLE_OPTIONS,
  resolvePlayerAppearance,
} from './canvas-animation.js';
import { CHIZURU_NPC, getChizuruDialogue } from './chizuru-npc.js';
import {
  createCritterRenderActor,
  createFieldCritters,
  drawFieldCritter,
  resizeFieldCritters,
  updateFieldCritters,
} from './field-critters.js';
import { createPlayableCharacter } from './player-character.js';
import { measureStageLayout, sampleVisualTerrainY } from './stage-layout.js';

const stageCanvas = document.getElementById('stage-canvas');
const statusBadge = document.getElementById('status-badge');
const playerState = document.getElementById('player-state');
const playerCoords = document.getElementById('player-coords');
const worldTimeReadout = document.getElementById('world-time');
const characterLevel = document.getElementById('character-level');
const characterHealth = document.getElementById('character-health');
const characterMana = document.getElementById('character-mana');
const characterGold = document.getElementById('character-gold');
const characterInventory = document.getElementById('character-inventory');
const characterEquipment = document.getElementById('character-equipment');
const characterAppearance = document.getElementById('character-appearance');
const playerHairStyle = document.getElementById('player-hair-style');
const playerHairColor = document.getElementById('player-hair-color');
const chizuruStatus = document.getElementById('chizuru-status');
const chizuruScene = document.getElementById('chizuru-scene');
const bgmStatus = document.getElementById('bgm-status');
const bgmMood = document.getElementById('bgm-mood');
const bgmProgression = document.getElementById('bgm-progression');
const bgmVolume = document.getElementById('bgm-volume');
const bgmVolumeOutput = document.getElementById('bgm-volume-output');
const bgmMute = document.getElementById('bgm-mute');
const bgmToggle = document.getElementById('bgm-toggle');
const touchControlButtons = Array.from(document.querySelectorAll('[data-touch-control]')).filter(
  (button) => button instanceof HTMLButtonElement
);
const touchInputQueries = [
  window.matchMedia('(pointer: coarse)'),
  window.matchMedia('(hover: none)'),
];

if (
  !(stageCanvas instanceof HTMLCanvasElement) ||
  !(statusBadge instanceof HTMLElement) ||
  !(playerState instanceof HTMLElement) ||
  !(playerCoords instanceof HTMLElement) ||
  !(worldTimeReadout instanceof HTMLElement) ||
  !(characterLevel instanceof HTMLElement) ||
  !(characterHealth instanceof HTMLElement) ||
  !(characterMana instanceof HTMLElement) ||
  !(characterGold instanceof HTMLElement) ||
  !(characterInventory instanceof HTMLElement) ||
  !(characterEquipment instanceof HTMLElement) ||
  !(characterAppearance instanceof HTMLElement) ||
  !(playerHairStyle instanceof HTMLSelectElement) ||
  !(playerHairColor instanceof HTMLSelectElement) ||
  !(chizuruStatus instanceof HTMLElement) ||
  !(chizuruScene instanceof HTMLElement) ||
  !(bgmStatus instanceof HTMLElement) ||
  !(bgmMood instanceof HTMLElement) ||
  !(bgmProgression instanceof HTMLElement) ||
  !(bgmVolume instanceof HTMLInputElement) ||
  !(bgmVolumeOutput instanceof HTMLElement) ||
  !(bgmMute instanceof HTMLButtonElement) ||
  !(bgmToggle instanceof HTMLButtonElement)
) {
  throw new Error('필수 게임 요소를 찾을 수 없습니다.');
}

const stageContext = stageCanvas.getContext('2d');

if (!stageContext) {
  throw new Error('캔버스 렌더러를 초기화할 수 없습니다.');
}

const playableCharacter = createPlayableCharacter();

const CHARACTER_COLLIDER = Object.freeze({
  width: 52,
  height: 90,
  scale: 1.05,
});

const NPC_COLLIDER = Object.freeze({
  width: 56,
  height: 94,
  scale: 1.04,
});

const keys = {
  left: false,
  right: false,
};

const physics = {
  moveSpeed: 300,
  gravity: 1800,
  jumpVelocity: 760,
  maxFallSpeed: 1200,
  verticalStep: 8,
};

const playerStateData = {
  x: 96,
  y: 0,
  velocityY: 0,
  width: CHARACTER_COLLIDER.width,
  height: CHARACTER_COLLIDER.height,
  grounded: false,
  facing: 'right',
  supportIndex: null,
};

const chizuruState = {
  x: 0,
  y: 0,
  width: NPC_COLLIDER.width,
  height: NPC_COLLIDER.height,
  nearby: false,
  talking: false,
  dialogueIndex: 0,
  hasMet: false,
  facing: 'left',
};

const palette = {
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

const worldState = {
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

const bgmManager = new BGMManager({
  initialVolume: Number(bgmVolume.value) / 100,
  onStateChange: syncBgmUi,
});
const DEFAULT_BGM_VOLUME = Number(bgmVolume.value) > 0 ? Number(bgmVolume.value) / 100 : 0.52;

let stageMetrics = measureStage();
let lastFrame = performance.now();
let hasSpawned = false;
let touchUiEnabled = false;
let bgmAutostartArmed = false;
let bgmLastAudibleVolume = DEFAULT_BGM_VOLUME;

function measureStage() {
  const cssWidth = Math.max(320, Math.round(stageCanvas.clientWidth));
  const cssHeight = Math.max(240, Math.round(stageCanvas.clientHeight));
  const dpr = window.devicePixelRatio || 1;

  stageCanvas.width = Math.round(cssWidth * dpr);
  stageCanvas.height = Math.round(cssHeight * dpr);

  return {
    ...measureStageLayout(cssWidth, cssHeight),
    dpr,
  };
}

function refreshMeasurements() {
  const previousStageMetrics = stageMetrics;
  stageMetrics = measureStage();
  positionChizuru();
  syncBackgroundScene();
  resizeFieldCritters(worldState.fieldCritters, stageMetrics, previousStageMetrics);
  playerStateData.x = clamp(
    playerStateData.x,
    0,
    Math.max(0, stageMetrics.width - playerStateData.width)
  );

  if (!hasSpawned) {
    spawnPlayerAboveStage();
    hasSpawned = true;
    render(0);
    return;
  }

  let surfaceIndex = null;

  if (playerStateData.grounded) {
    surfaceIndex = playerStateData.supportIndex ?? findClosestSurfaceIndex(playerStateData.x);
  }

  if (surfaceIndex !== null) {
    const surface = stageMetrics.platforms[surfaceIndex];
    playerStateData.y = stageMetrics.height - surface.top;
    playerStateData.supportIndex = surfaceIndex;
    playerStateData.grounded = true;
    playerStateData.velocityY = 0;
  } else {
    playerStateData.grounded = false;
    playerStateData.supportIndex = null;
  }

  render(0);
}

function syncBackgroundScene() {
  for (const cloud of worldState.clouds) {
    cloud.width = clamp(stageMetrics.width * cloud.widthRatio, 88, stageMetrics.width * 0.34);
    cloud.baseY = stageMetrics.height * cloud.topRatio;
    cloud.x = calculateCloudTravelWidth(cloud) * cloud.startRatio - cloud.width;
  }
}

function spawnPlayerAboveStage() {
  playerStateData.y = stageMetrics.height + playerStateData.height;
  playerStateData.velocityY = 0;
  playerStateData.grounded = false;
  playerStateData.supportIndex = null;
}

function onKeyDown(event) {
  if (isMovementKey(event.code)) {
    event.preventDefault();
  }

  if (event.code === 'KeyE' && chizuruState.nearby) {
    event.preventDefault();
    triggerInteraction();
    return;
  }

  if (event.repeat) {
    return;
  }

  if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
    setMovementKey('left', true);
  }

  if (event.code === 'ArrowRight' || event.code === 'KeyD') {
    setMovementKey('right', true);
  }

  if (event.code === 'ArrowUp' || event.code === 'KeyW' || event.code === 'Space') {
    triggerJump();
  }
}

function onKeyUp(event) {
  if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
    setMovementKey('left', false);
  }

  if (event.code === 'ArrowRight' || event.code === 'KeyD') {
    setMovementKey('right', false);
  }
}

function setMovementKey(direction, pressed) {
  keys[direction] = pressed;

  if (pressed) {
    playerStateData.facing = direction === 'left' ? 'left' : 'right';
  }
}

function clearMovementInputs() {
  keys.left = false;
  keys.right = false;

  touchControlButtons.forEach((button) => {
    if (button.dataset.touchControl === 'left' || button.dataset.touchControl === 'right') {
      button.classList.remove('is-active');
    }
  });
}

function triggerJump() {
  if (!playerStateData.grounded) {
    return false;
  }

  playerStateData.velocityY = physics.jumpVelocity;
  playerStateData.grounded = false;
  playerStateData.supportIndex = null;
  statusBadge.textContent = '점프';
  return true;
}

function triggerInteraction() {
  if (!chizuruState.nearby) {
    return false;
  }

  advanceChizuruDialogue();
  render(Number(keys.right) - Number(keys.left));
  return true;
}

function update(deltaSeconds) {
  updateBackground(deltaSeconds);
  updateFieldCritters(worldState.fieldCritters, deltaSeconds, stageMetrics);

  const direction = Number(keys.right) - Number(keys.left);
  playerStateData.x += direction * physics.moveSpeed * deltaSeconds;
  playerStateData.x = clamp(
    playerStateData.x,
    0,
    Math.max(0, stageMetrics.width - playerStateData.width)
  );

  if (direction < 0) {
    playerStateData.facing = 'left';
  } else if (direction > 0) {
    playerStateData.facing = 'right';
  }

  stepVerticalMotion(deltaSeconds);
  updateChizuruInteraction();
  syncBgmMood();
  render(direction);
}

function stepVerticalMotion(deltaSeconds) {
  const estimatedTravel =
    Math.abs(playerStateData.velocityY * deltaSeconds) + physics.gravity * deltaSeconds ** 2;
  const stepCount = Math.max(1, Math.ceil(estimatedTravel / physics.verticalStep));
  const stepDelta = deltaSeconds / stepCount;

  for (let index = 0; index < stepCount; index += 1) {
    const previousY = playerStateData.y;
    playerStateData.velocityY = Math.max(
      playerStateData.velocityY - physics.gravity * stepDelta,
      -physics.maxFallSpeed
    );
    playerStateData.y += playerStateData.velocityY * stepDelta;

    resolveVerticalCollisions(previousY);

    if (playerStateData.grounded && playerStateData.velocityY === 0) {
      break;
    }
  }
}

function resolveVerticalCollisions(previousY) {
  const previousTop = stageMetrics.height - previousY - playerStateData.height;
  const nextTop = stageMetrics.height - playerStateData.y - playerStateData.height;
  const playerLeft = playerStateData.x;
  const playerRight = playerStateData.x + playerStateData.width;

  playerStateData.grounded = false;
  playerStateData.supportIndex = null;

  for (const [index, platform] of stageMetrics.platforms.entries()) {
    const overlapsX = playerRight > platform.left && playerLeft < platform.right;
    if (!overlapsX) {
      continue;
    }

    const landing =
      playerStateData.velocityY <= 0 &&
      previousTop + playerStateData.height <= platform.top &&
      nextTop + playerStateData.height >= platform.top;

    if (landing) {
      playerStateData.y = stageMetrics.height - platform.top;
      playerStateData.velocityY = 0;
      playerStateData.grounded = true;
      playerStateData.supportIndex = index;
      return;
    }

    const headBump =
      playerStateData.velocityY > 0 && previousTop >= platform.bottom && nextTop <= platform.bottom;

    if (headBump) {
      playerStateData.y = stageMetrics.height - platform.bottom - playerStateData.height;
      playerStateData.velocityY = 0;
      return;
    }
  }

  if (playerStateData.y < 0) {
    playerStateData.y = 0;
    playerStateData.velocityY = 0;
    playerStateData.grounded = true;
  }
}

function render(direction = 0) {
  const motionState = getMotionState(direction);

  renderScene(motionState);
  renderCharacterPanel();
  renderChizuruEncounter();

  playerState.textContent = getMotionLabel(motionState);
  playerCoords.textContent = `x: ${Math.round(playerStateData.x)} / y: ${Math.round(playerStateData.y)}`;
  statusBadge.textContent = getStatusBadgeLabel(motionState);
}

function renderScene(motionState) {
  const context = stageContext;
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, stageCanvas.width, stageCanvas.height);
  context.setTransform(stageMetrics.dpr, 0, 0, stageMetrics.dpr, 0, 0);

  const lighting = getLighting();
  worldTimeReadout.textContent = getTimeLabel(lighting.cycleProgress);
  drawSky(context, lighting);
  drawStars(context, lighting);
  drawOrbitBodies(context, lighting);
  drawMountains(context, lighting);
  drawClouds(context, lighting);
  drawPlatforms(context);

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
      playerStateData,
      playerPose,
      getResolvedPlayerAppearance(),
      CHARACTER_COLLIDER.scale
    ),
    createRenderActor(chizuruState, npcPose, CHIZURU_APPEARANCE, NPC_COLLIDER.scale),
    ...worldState.fieldCritters.map((critter) =>
      createCritterRenderActor(critter, stageMetrics, worldState.runtimeSeconds)
    ),
  ].sort((left, right) => left.baseY - right.baseY || left.x - right.x);

  for (const actor of entities) {
    if (actor.type === 'critter') {
      drawFieldCritter(context, actor);
      continue;
    }

    drawHumanoid(context, actor);
  }

  drawDialogueOverlay(context);
}

function renderCharacterPanel() {
  characterLevel.textContent = String(playableCharacter.level);
  characterHealth.textContent = formatResource(playableCharacter.health);
  characterMana.textContent = formatResource(playableCharacter.mana);
  characterGold.textContent = `${playableCharacter.gold} G`;
  characterInventory.textContent = `${playableCharacter.getCollectionSize('inventory')} slots`;
  characterEquipment.textContent = `${playableCharacter.getCollectionSize('equipment')} equipped`;

  const appearance = getResolvedPlayerAppearance();
  characterAppearance.textContent = `${appearance.hairStyleLabel} · ${appearance.hairColorLabel}`;
}

function getPlayerAppearanceState() {
  const savedAppearance = playableCharacter.attributes.appearance;

  return {
    ...DEFAULT_PLAYER_APPEARANCE_CONFIG,
    ...(savedAppearance && typeof savedAppearance === 'object' ? savedAppearance : {}),
  };
}

function getResolvedPlayerAppearance() {
  return resolvePlayerAppearance(getPlayerAppearanceState());
}

function renderChizuruEncounter() {
  chizuruStatus.textContent = getChizuruStatusLabel();
  chizuruScene.textContent = getChizuruSceneLabel();
}

function positionChizuru() {
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

function updateBackground(deltaSeconds) {
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

function updateChizuruInteraction() {
  const playerCenterX = playerStateData.x + playerStateData.width / 2;
  const npcCenterX = chizuruState.x + chizuruState.width / 2;
  const distanceX = Math.abs(playerCenterX - npcCenterX);
  const distanceY = Math.abs(playerStateData.y - chizuruState.y);

  chizuruState.nearby =
    distanceX <= CHIZURU_NPC.interactionRadiusX && distanceY <= CHIZURU_NPC.interactionRadiusY;

  if (!chizuruState.nearby) {
    chizuruState.talking = false;
  }
}

function drawSky(context, lighting) {
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

function drawStars(context, lighting) {
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
    const pulse = 0.75 + Math.sin(worldState.runtimeSeconds * 1.4 + xRatio * 16) * 0.25;

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

function drawOrbitBodies(context, lighting) {
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

function drawClouds(context, lighting) {
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

function drawMountains(context, lighting) {
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

function drawPlatforms(context) {
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

function drawDialogueOverlay(context) {
  if (!chizuruState.nearby && !chizuruState.talking) {
    return;
  }

  const npcCenterX = chizuruState.x + chizuruState.width / 2;
  const npcTopY = stageMetrics.height - chizuruState.y - chizuruState.height * 1.1;

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
  } else {
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
}

function createRenderActor(entityState, pose, appearance, scale) {
  const centerX = entityState.x + entityState.width / 2;
  const grounded = entityState.grounded ?? true;

  if (!grounded) {
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

  const facingSign = entityState.facing === 'left' ? -1 : 1;
  const leftFootWorldX = clamp(centerX + pose.footLeftX * facingSign, 0, stageMetrics.width);
  const rightFootWorldX = clamp(centerX + pose.footRightX * facingSign, 0, stageMetrics.width);
  const leftGroundY = sampleVisualTerrainY(leftFootWorldX, stageMetrics.platforms);
  const rightGroundY = sampleVisualTerrainY(rightFootWorldX, stageMetrics.platforms);
  const baseY = (leftGroundY + rightGroundY) / 2;

  return {
    x: centerX,
    baseY,
    pose,
    appearance,
    facing: entityState.facing,
    scale,
    footHeights: {
      left: baseY - leftGroundY,
      right: baseY - rightGroundY,
    },
    shadowOpacity: 0.24,
    grounded: true,
  };
}

function findClosestSurfaceIndex(playerX) {
  const playerLeft = playerX;
  const playerRight = playerX + playerStateData.width;
  const playerBottom = stageMetrics.height - playerStateData.y;

  return stageMetrics.platforms.reduce((best, platform, index) => {
    const overlapsX = playerRight > platform.left && playerLeft < platform.right;
    if (!overlapsX) {
      return best;
    }

    const distance = Math.abs(playerBottom - platform.top);
    if (best === null) {
      return index;
    }

    const bestDistance = Math.abs(playerBottom - stageMetrics.platforms[best].top);
    if (distance < bestDistance) {
      return index;
    }

    return best;
  }, null);
}

function getLighting() {
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
  const nightToSunset = mixColor(palette.night[tone], palette.sunset[tone], twilight);
  return mixColor(nightToSunset, palette.day[tone], daylight);
}

function mixColor(from, to, amount) {
  return from.map((channel, index) => Math.round(channel + (to[index] - channel) * amount));
}

function rgbToCss(rgb) {
  return `rgb(${rgb.join(', ')})`;
}

function formatResource(resource) {
  return `${resource.current} / ${resource.max}`;
}

function getMotionState(direction) {
  if (!playerStateData.grounded) {
    return playerStateData.velocityY >= 0 ? 'jump' : 'fall';
  }

  if (direction !== 0) {
    return 'run';
  }

  return 'idle';
}

function getMotionLabel(motionState) {
  switch (motionState) {
    case 'run':
      return '질주 중';
    case 'jump':
      return '상승 중';
    case 'fall':
      return '낙하 중';
    default:
      return '대기';
  }
}

function getStatusBadgeLabel(motionState) {
  if (chizuruState.talking) {
    return '치즈루와 대화 중';
  }

  if (chizuruState.nearby) {
    return '치즈루와 상호작용 가능';
  }

  switch (motionState) {
    case 'run':
      return '전진 중';
    case 'jump':
      return '공중 상승';
    case 'fall':
      return '착지 중';
    default:
      return '이동 가능';
  }
}

function advanceChizuruDialogue() {
  if (!chizuruState.talking) {
    chizuruState.talking = true;
    chizuruState.hasMet = true;
    return;
  }

  chizuruState.dialogueIndex = (chizuruState.dialogueIndex + 1) % CHIZURU_NPC.dialogues.length;
}

function getChizuruStatusLabel() {
  if (chizuruState.talking) {
    return '대화 중';
  }

  if (chizuruState.nearby) {
    return '바로 앞에서 기다리는 중';
  }

  if (chizuruState.hasMet) {
    return '잠깐 떨어져서 대기 중';
  }

  return CHIZURU_NPC.encounterHint;
}

function getChizuruSceneLabel() {
  const interactionLabel = touchUiEnabled ? '대화 버튼' : 'E 키';

  if (chizuruState.talking) {
    return getChizuruDialogue(chizuruState.dialogueIndex);
  }

  if (chizuruState.nearby) {
    return `${interactionLabel}를 누르면 다음 대사까지 이어서 볼 수 있습니다.`;
  }

  if (chizuruState.hasMet) {
    return `다시 가까이 가서 ${interactionLabel}를 누르면 대화를 이어갈 수 있습니다.`;
  }

  return `가까이 가서 ${interactionLabel}를 누르면 말을 걸 수 있습니다.`;
}

function getTimeLabel(progress) {
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

function getBgmStatusLabel(status) {
  switch (status) {
    case 'playing':
      return '재생 중';
    case 'stopped':
      return '정지됨';
    case 'unsupported':
      return '브라우저 미지원';
    default:
      return '대기 중';
  }
}

function getModeLabel(mode) {
  switch (mode) {
    case 'ionian':
      return 'Ionian';
    case 'dorian':
      return 'Dorian';
    case 'aeolian':
      return 'Aeolian';
    case 'lydian':
      return 'Lydian';
    case 'mixolydian':
      return 'Mixolydian';
    default:
      return mode;
  }
}

function getDesiredBgmMood() {
  const cycleProgress = worldState.elapsedSeconds / worldState.cycleDuration;

  if (chizuruState.talking) {
    return 'encounter';
  }

  if (cycleProgress < 0.22 || cycleProgress >= 0.84) {
    return 'night';
  }

  if (cycleProgress < 0.34 || cycleProgress >= 0.68) {
    return 'twilight';
  }

  return 'town';
}

function syncBgmMood() {
  bgmManager.setMood(getDesiredBgmMood());
}

function clampBgmVolume(nextVolume) {
  return Math.max(0, Math.min(nextVolume, 1));
}

function setBgmVolume(nextVolume) {
  const clampedVolume = clampBgmVolume(nextVolume);

  if (clampedVolume > 0) {
    bgmLastAudibleVolume = clampedVolume;
  }

  bgmVolume.value = `${Math.round(clampedVolume * 100)}`;
  bgmManager.setVolume(clampedVolume);
}

function syncBgmUi(snapshot = bgmManager.getSnapshot()) {
  const volumePercent = Math.round(snapshot.volume * 100);
  const isMuted = volumePercent === 0;

  bgmStatus.textContent = getBgmStatusLabel(snapshot.status);
  bgmMood.textContent = `${snapshot.moodLabel} · ${getModeLabel(snapshot.mode)}`;
  bgmProgression.textContent = snapshot.progressionLabel;
  bgmVolume.value = `${volumePercent}`;
  bgmVolumeOutput.textContent = `${volumePercent}%`;
  bgmMute.disabled = !snapshot.supported;
  bgmMute.classList.toggle('is-muted', isMuted);
  bgmMute.setAttribute('aria-label', isMuted ? 'BGM 음소거 해제' : 'BGM 음소거');
  bgmMute.setAttribute('aria-pressed', `${isMuted}`);
  bgmToggle.disabled = !snapshot.supported || snapshot.isPlaying;

  if (!snapshot.supported) {
    bgmToggle.textContent = '지원되지 않음';
    return;
  }

  if (snapshot.isPlaying) {
    bgmToggle.textContent = '재생 중';
    return;
  }

  bgmToggle.textContent = snapshot.hasStarted ? '다시 시작' : 'BGM 시작';
}

function disarmBgmAutostart() {
  if (!bgmAutostartArmed) {
    return;
  }

  bgmAutostartArmed = false;
  window.removeEventListener('keydown', handleBgmAutostart, true);
  window.removeEventListener('pointerdown', handleBgmAutostart, true);
  window.removeEventListener('touchstart', handleBgmAutostart, true);
}

function handleBgmAutostart(event) {
  if (event.target instanceof Element && event.target.closest('[data-bgm-control]')) {
    return;
  }

  disarmBgmAutostart();
  void bgmManager.resumeFromGesture().then(
    () => syncBgmUi(),
    () => syncBgmUi()
  );
}

function armBgmAutostart() {
  if (bgmAutostartArmed || !bgmManager.getSnapshot().supported) {
    return;
  }

  bgmAutostartArmed = true;
  window.addEventListener('keydown', handleBgmAutostart, { capture: true });
  window.addEventListener('pointerdown', handleBgmAutostart, { capture: true, passive: true });
  window.addEventListener('touchstart', handleBgmAutostart, { capture: true, passive: true });
}

function bindBgmControls() {
  bgmVolume.addEventListener('input', () => {
    setBgmVolume(Number(bgmVolume.value) / 100);
  });

  bgmMute.addEventListener('click', () => {
    const { volume } = bgmManager.getSnapshot();

    if (volume === 0) {
      setBgmVolume(bgmLastAudibleVolume);
      return;
    }

    setBgmVolume(0);
  });

  bgmToggle.addEventListener('click', () => {
    if (bgmManager.getSnapshot().isPlaying) {
      return;
    }

    void bgmManager.resumeFromGesture().then(
      () => syncBgmUi(),
      () => syncBgmUi()
    );
  });
}

function bindAppearanceControls() {
  populateAppearanceSelect(playerHairStyle, HAIR_STYLE_OPTIONS);
  populateAppearanceSelect(playerHairColor, HAIR_COLOR_OPTIONS);

  const appearanceState = getPlayerAppearanceState();
  playerHairStyle.value = appearanceState.hairStyle;
  playerHairColor.value = appearanceState.hairColor;

  playerHairStyle.addEventListener('change', () => {
    playableCharacter.setAttribute('appearance', {
      ...getPlayerAppearanceState(),
      hairStyle: playerHairStyle.value,
    });
    render(Number(keys.right) - Number(keys.left));
  });

  playerHairColor.addEventListener('change', () => {
    playableCharacter.setAttribute('appearance', {
      ...getPlayerAppearanceState(),
      hairColor: playerHairColor.value,
    });
    render(Number(keys.right) - Number(keys.left));
  });
}

function gameLoop(now) {
  const deltaSeconds = Math.min((now - lastFrame) / 1000, 1 / 30);
  lastFrame = now;
  update(deltaSeconds);
  requestAnimationFrame(gameLoop);
}

function wrapText(context, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    if (context.measureText(candidate).width <= maxWidth) {
      currentLine = candidate;
      continue;
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    currentLine = word;
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

function fillRoundedRect(context, x, y, width, height, radius, fillStyle) {
  context.fillStyle = fillStyle;
  context.beginPath();
  roundedRectPath(context, x, y, width, height, radius);
  context.fill();
}

function strokeRoundedRect(context, x, y, width, height, radius) {
  context.beginPath();
  roundedRectPath(context, x, y, width, height, radius);
  context.stroke();
}

function roundedRectPath(context, x, y, width, height, radius) {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  context.moveTo(x + safeRadius, y);
  context.arcTo(x + width, y, x + width, y + height, safeRadius);
  context.arcTo(x + width, y + height, x, y + height, safeRadius);
  context.arcTo(x, y + height, x, y, safeRadius);
  context.arcTo(x, y, x + width, y, safeRadius);
  context.closePath();
}

function calculateCloudTravelWidth(cloud) {
  return stageMetrics.width + cloud.width * 2.35;
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

function isMovementKey(code) {
  return ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'KeyA', 'KeyD', 'KeyW', 'Space'].includes(code);
}

function populateAppearanceSelect(select, options) {
  select.replaceChildren();

  for (const optionDefinition of options) {
    const option = document.createElement('option');
    option.value = optionDefinition.value;
    option.textContent = optionDefinition.label;
    select.append(option);
  }
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function syncTouchUiMode() {
  const previousTouchUiEnabled = touchUiEnabled;
  touchUiEnabled = navigator.maxTouchPoints > 0 || touchInputQueries.some((query) => query.matches);
  document.body.classList.toggle('touch-ui-enabled', touchUiEnabled);

  if (previousTouchUiEnabled && !touchUiEnabled) {
    clearMovementInputs();
  }
}

function pulseTouchButton(button) {
  button.classList.add('is-active');
  window.setTimeout(() => {
    button.classList.remove('is-active');
  }, 140);
}

function bindTouchControls() {
  touchControlButtons.forEach((button) => {
    const action = button.dataset.touchControl;

    if (action === 'left' || action === 'right') {
      const releaseButton = () => {
        button.classList.remove('is-active');
        setMovementKey(action, false);
      };

      button.addEventListener('pointerdown', (event) => {
        if (event.pointerType === 'mouse' && event.button !== 0) {
          return;
        }

        event.preventDefault();
        button.classList.add('is-active');
        setMovementKey(action, true);

        if (button.setPointerCapture) {
          button.setPointerCapture(event.pointerId);
        }
      });
      button.addEventListener('pointerup', (event) => {
        event.preventDefault();

        if (button.hasPointerCapture?.(event.pointerId)) {
          button.releasePointerCapture(event.pointerId);
        }

        releaseButton();
      });
      button.addEventListener('pointercancel', releaseButton);
      button.addEventListener('lostpointercapture', releaseButton);
      button.addEventListener('contextmenu', (event) => {
        event.preventDefault();
      });
      return;
    }

    button.addEventListener('click', (event) => {
      event.preventDefault();
      pulseTouchButton(button);

      if (action === 'jump') {
        triggerJump();
        return;
      }

      triggerInteraction();
    });
  });
}

window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);
window.addEventListener('resize', refreshMeasurements);
window.addEventListener('blur', clearMovementInputs);

worldState.fieldCritters = createFieldCritters(stageMetrics);
bindTouchControls();
bindBgmControls();
bindAppearanceControls();
syncTouchUiMode();
syncBgmMood();
syncBgmUi();
armBgmAutostart();
touchInputQueries.forEach((query) => {
  query.addEventListener('change', syncTouchUiMode);
});
window.addEventListener('pagehide', () => {
  disarmBgmAutostart();
  bgmManager.destroy();
});
refreshMeasurements();
worldTimeReadout.textContent = getTimeLabel(worldState.elapsedSeconds / worldState.cycleDuration);
requestAnimationFrame(gameLoop);
