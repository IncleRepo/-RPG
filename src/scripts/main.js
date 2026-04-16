import { createPlayableCharacter } from './player-character.js';

const stage = document.getElementById('stage');
const player = document.getElementById('player');
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
const cloudSprites =
  stage instanceof HTMLDivElement ? [...stage.querySelectorAll('[data-cloud]')] : [];

if (
  !(stage instanceof HTMLDivElement) ||
  !(player instanceof HTMLDivElement) ||
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
  cloudSprites.some((cloud) => !(cloud instanceof HTMLImageElement))
) {
  throw new Error('필수 게임 요소를 찾을 수 없습니다.');
}

const playableCharacter = createPlayableCharacter();

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
  width: 52,
  height: 74,
  grounded: false,
  facing: 'right',
  supportIndex: null,
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
  cycleDuration: 72,
  clouds: cloudSprites.map((cloud, index) => ({
    element: cloud,
    widthRatio: Number(cloud.dataset.width ?? 0.2),
    topRatio: Number(cloud.dataset.top ?? 0.2),
    speed: Number(cloud.dataset.speed ?? 20),
    startRatio: Number(cloud.dataset.start ?? index * 0.2),
    bobAmplitude: Number(cloud.dataset.bob ?? 10),
    bobSpeed: Number(cloud.dataset.bobSpeed ?? 0.6),
    scale: Number(cloud.dataset.scale ?? 1),
    phase: Number(cloud.dataset.phase ?? index),
    width: 0,
    x: 0,
    baseY: 0,
  })),
};

let stageMetrics = measureStage();
let lastFrame = performance.now();
let hasSpawned = false;

function measureStage() {
  const stageRect = stage.getBoundingClientRect();
  const platforms = [...stage.querySelectorAll('[data-platform]')].map((platform) => {
    const platformRect = platform.getBoundingClientRect();

    return {
      left: platformRect.left - stageRect.left,
      right: platformRect.right - stageRect.left,
      top: platformRect.top - stageRect.top,
      bottom: platformRect.bottom - stageRect.top,
    };
  });

  return {
    width: stage.clientWidth,
    height: stage.clientHeight,
    platforms,
  };
}

function syncPlayerSize() {
  const playerRect = player.getBoundingClientRect();
  playerStateData.width = playerRect.width;
  playerStateData.height = playerRect.height;
}

function refreshMeasurements() {
  stageMetrics = measureStage();
  syncPlayerSize();
  syncBackgroundScene();
  playerStateData.x = clamp(
    playerStateData.x,
    0,
    Math.max(0, stageMetrics.width - playerStateData.width)
  );

  if (!hasSpawned) {
    spawnPlayerAboveStage();
    hasSpawned = true;
    render();
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

  render();
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

  if (event.repeat) {
    return;
  }

  if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
    keys.left = true;
    playerStateData.facing = 'left';
  }

  if (event.code === 'ArrowRight' || event.code === 'KeyD') {
    keys.right = true;
    playerStateData.facing = 'right';
  }

  if (event.code === 'ArrowUp' || event.code === 'KeyW' || event.code === 'Space') {
    if (playerStateData.grounded) {
      playerStateData.velocityY = physics.jumpVelocity;
      playerStateData.grounded = false;
      playerStateData.supportIndex = null;
      statusBadge.textContent = '점프';
    }
  }
}

function onKeyUp(event) {
  if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
    keys.left = false;
  }

  if (event.code === 'ArrowRight' || event.code === 'KeyD') {
    keys.right = false;
  }
}

function update(deltaSeconds) {
  updateBackground(deltaSeconds);

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
  renderBackground();
  renderCharacterPanel();
  player.dataset.facing = playerStateData.facing;
  player.dataset.grounded = String(playerStateData.grounded);
  player.style.transform = `translate(${playerStateData.x}px, ${-playerStateData.y}px)`;

  let stateLabel = '대기';
  if (!playerStateData.grounded) {
    stateLabel = playerStateData.velocityY > 0 ? '상승 중' : '낙하 중';
  } else if (direction !== 0) {
    stateLabel = '이동 중';
  }

  playerState.textContent = stateLabel;
  playerCoords.textContent = `x: ${Math.round(playerStateData.x)} / y: ${Math.round(playerStateData.y)}`;
  statusBadge.textContent = playerStateData.grounded ? '이동 가능' : '공중 이동';
}

function renderCharacterPanel() {
  characterLevel.textContent = String(playableCharacter.level);
  characterHealth.textContent = formatResource(playableCharacter.health);
  characterMana.textContent = formatResource(playableCharacter.mana);
  characterGold.textContent = `${playableCharacter.gold} G`;
  characterInventory.textContent = `${playableCharacter.getCollectionSize('inventory')} slots`;
  characterEquipment.textContent = `${playableCharacter.getCollectionSize('equipment')} equipped`;
}

function syncBackgroundScene() {
  for (const cloud of worldState.clouds) {
    cloud.width = clamp(stageMetrics.width * cloud.widthRatio, 88, stageMetrics.width * 0.34);
    cloud.baseY = stageMetrics.height * cloud.topRatio;
    cloud.x = calculateCloudTravelWidth(cloud) * cloud.startRatio - cloud.width;
    cloud.element.style.width = `${cloud.width}px`;
  }
}

function updateBackground(deltaSeconds) {
  worldState.elapsedSeconds = (worldState.elapsedSeconds + deltaSeconds) % worldState.cycleDuration;

  for (const cloud of worldState.clouds) {
    cloud.x += cloud.speed * deltaSeconds;

    const wrapPoint = stageMetrics.width + cloud.width;
    if (cloud.x > wrapPoint) {
      cloud.x = -cloud.width * 1.35;
    }
  }
}

function renderBackground() {
  const cycleProgress = worldState.elapsedSeconds / worldState.cycleDuration;
  const orbitAngle = cycleProgress * Math.PI * 2 - Math.PI / 2;
  const sunHeight = Math.sin(orbitAngle);
  const daylight = clamp((sunHeight + 0.18) / 1.18, 0, 1);
  const twilight = 1 - clamp(Math.abs(sunHeight) * 1.9, 0, 1);

  const skyTop = mixSkyColor('top', daylight, twilight);
  const skyMid = mixSkyColor('mid', daylight, twilight);
  const skyBottom = mixSkyColor('bottom', daylight, twilight);

  stage.style.setProperty('--sky-top-current', rgbToCss(skyTop));
  stage.style.setProperty('--sky-mid-current', rgbToCss(skyMid));
  stage.style.setProperty('--sky-bottom-current', rgbToCss(skyBottom));
  stage.style.setProperty('--sun-x', `${50 + Math.cos(orbitAngle) * 43}%`);
  stage.style.setProperty('--sun-y', `${76 - sunHeight * 60}%`);
  stage.style.setProperty('--sun-opacity', `${clamp(daylight * 1.08 + twilight * 0.32, 0.2, 1)}`);
  stage.style.setProperty('--moon-x', `${50 - Math.cos(orbitAngle) * 38}%`);
  stage.style.setProperty('--moon-y', `${76 + sunHeight * 54}%`);
  stage.style.setProperty('--moon-opacity', `${clamp((1 - daylight) * 0.96, 0.12, 1)}`);
  stage.style.setProperty('--star-opacity', `${clamp((1 - daylight) * 1.08, 0, 1)}`);
  stage.style.setProperty(
    '--night-overlay',
    `${clamp((1 - daylight) * 0.42 + twilight * 0.08, 0, 0.42)}`
  );
  stage.style.setProperty('--haze-opacity', `${0.08 + daylight * 0.14 + twilight * 0.18}`);

  for (const cloud of worldState.clouds) {
    const bobOffset =
      Math.sin(worldState.elapsedSeconds * cloud.bobSpeed + cloud.phase) * cloud.bobAmplitude;
    cloud.element.style.transform = `translate(${cloud.x}px, ${cloud.baseY + bobOffset}px) scale(${cloud.scale})`;
  }

  worldTimeReadout.textContent = getTimeLabel(cycleProgress);
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

function isMovementKey(code) {
  return ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'KeyA', 'KeyD', 'KeyW', 'Space'].includes(code);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function calculateCloudTravelWidth(cloud) {
  return stageMetrics.width + cloud.width * 2.35;
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

function gameLoop(now) {
  const deltaSeconds = Math.min((now - lastFrame) / 1000, 1 / 30);
  lastFrame = now;
  update(deltaSeconds);
  requestAnimationFrame(gameLoop);
}

window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);
window.addEventListener('resize', refreshMeasurements);

refreshMeasurements();
requestAnimationFrame(gameLoop);
