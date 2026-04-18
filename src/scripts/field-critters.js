import { sampleVisualTerrainY } from './stage-layout.js';

const CRITTER_PHYSICS = Object.freeze({
  gravity: 1680,
  maxFallSpeed: 1120,
  verticalStep: 6,
});

const CRITTER_DEFINITIONS = Object.freeze([
  Object.freeze({
    id: 'duck-1',
    species: 'duck',
    width: 42,
    height: 34,
    scale: 0.96,
    xRatio: 0.14,
    anchorPlatform: 'ground',
    facing: 'right',
    animationOffset: 0.18,
    palette: Object.freeze({
      body: '#f4d25d',
      bodyShade: '#d9b34e',
      accent: '#fff0b0',
      line: 'rgba(115, 75, 18, 0.28)',
      beak: '#eb8c37',
      feet: '#cc7a2d',
      eye: '#2b201a',
      wing: '#e6bb4f',
    }),
    behavior: Object.freeze({
      walkSpeedMin: 38,
      walkSpeedMax: 68,
      maxAirSpeed: 150,
      jumpVelocity: 650,
      jumpReachX: 220,
      idleMin: 0.45,
      idleMax: 1.4,
      moveMin: 0.9,
      moveMax: 2.1,
      jumpCooldownMin: 1.7,
      jumpCooldownMax: 4.2,
      jumpChance: 0.18,
    }),
  }),
  Object.freeze({
    id: 'duck-2',
    species: 'duck',
    width: 42,
    height: 34,
    scale: 0.93,
    xRatio: 0.76,
    anchorPlatform: 'ground',
    facing: 'left',
    animationOffset: 1.34,
    palette: Object.freeze({
      body: '#f8da72',
      bodyShade: '#d7b650',
      accent: '#fff7c9',
      line: 'rgba(105, 66, 14, 0.28)',
      beak: '#ee9541',
      feet: '#d57a2f',
      eye: '#251b16',
      wing: '#edc75b',
    }),
    behavior: Object.freeze({
      walkSpeedMin: 40,
      walkSpeedMax: 72,
      maxAirSpeed: 156,
      jumpVelocity: 668,
      jumpReachX: 232,
      idleMin: 0.35,
      idleMax: 1.3,
      moveMin: 1,
      moveMax: 2.2,
      jumpCooldownMin: 1.6,
      jumpCooldownMax: 4,
      jumpChance: 0.2,
    }),
  }),
  Object.freeze({
    id: 'rabbit-1',
    species: 'rabbit',
    width: 38,
    height: 40,
    scale: 1,
    xRatio: 0.34,
    anchorPlatform: 'ground',
    facing: 'right',
    animationOffset: 0.76,
    palette: Object.freeze({
      body: '#f5f0ea',
      bodyShade: '#d9cec7',
      accent: '#fffaf6',
      line: 'rgba(92, 72, 63, 0.24)',
      earInner: '#f0b8b8',
      feet: '#e0d5cd',
      eye: '#2d2523',
      tail: '#fffdf9',
    }),
    behavior: Object.freeze({
      walkSpeedMin: 44,
      walkSpeedMax: 78,
      maxAirSpeed: 170,
      jumpVelocity: 705,
      jumpReachX: 246,
      idleMin: 0.4,
      idleMax: 1.15,
      moveMin: 0.8,
      moveMax: 1.8,
      jumpCooldownMin: 1.2,
      jumpCooldownMax: 3.1,
      jumpChance: 0.28,
    }),
  }),
  Object.freeze({
    id: 'rabbit-2',
    species: 'rabbit',
    width: 38,
    height: 40,
    scale: 0.97,
    xRatio: 0.58,
    anchorPlatform: 'ground',
    facing: 'left',
    animationOffset: 2.18,
    palette: Object.freeze({
      body: '#efe5de',
      bodyShade: '#d0c2b8',
      accent: '#fff9f2',
      line: 'rgba(90, 69, 60, 0.24)',
      earInner: '#e9aab1',
      feet: '#ddd0c5',
      eye: '#251e1b',
      tail: '#fffdfa',
    }),
    behavior: Object.freeze({
      walkSpeedMin: 46,
      walkSpeedMax: 82,
      maxAirSpeed: 176,
      jumpVelocity: 724,
      jumpReachX: 252,
      idleMin: 0.35,
      idleMax: 1.05,
      moveMin: 0.75,
      moveMax: 1.7,
      jumpCooldownMin: 1.1,
      jumpCooldownMax: 2.9,
      jumpChance: 0.32,
    }),
  }),
]);

export function createFieldCritters(stageMetrics) {
  return CRITTER_DEFINITIONS.map((definition) => createCritterState(definition, stageMetrics));
}

export function resizeFieldCritters(critters, stageMetrics, previousStageMetrics) {
  for (const critter of critters) {
    const previousWidth = Math.max(1, previousStageMetrics?.width ?? stageMetrics.width);
    const previousTravelWidth = Math.max(1, previousWidth - critter.width);
    const currentTravelWidth = Math.max(0, stageMetrics.width - critter.width);
    const xRatio = currentTravelWidth === 0 ? 0 : critter.x / previousTravelWidth;
    critter.x = clamp(xRatio * currentTravelWidth, 0, currentTravelWidth);

    if (critter.grounded) {
      const supportIndex = findPlatformIndexByName(stageMetrics, critter.supportName);
      const fallbackIndex = findGroundIndex(stageMetrics);
      const nextSupportIndex = supportIndex ?? fallbackIndex ?? 0;
      placeCritterOnPlatform(critter, stageMetrics, nextSupportIndex);
      continue;
    }

    const previousHeight = Math.max(1, previousStageMetrics?.height ?? stageMetrics.height);
    critter.y = clamp((critter.y / previousHeight) * stageMetrics.height, 0, stageMetrics.height);
  }
}

export function updateFieldCritters(critters, deltaSeconds, stageMetrics) {
  for (const critter of critters) {
    updateCritterDecision(critter, deltaSeconds, stageMetrics);
    critter.x += critter.velocityX * deltaSeconds;

    if (critter.velocityX < 0) {
      critter.facing = 'left';
    } else if (critter.velocityX > 0) {
      critter.facing = 'right';
    }

    confineCritterToScreen(critter, stageMetrics);
    stepCritterVerticalMotion(critter, deltaSeconds, stageMetrics);
  }
}

export function createCritterRenderActor(critter, stageMetrics, runtimeSeconds) {
  const centerX = critter.x + critter.width / 2;
  const support =
    critter.supportIndex !== null && critter.supportIndex !== undefined
      ? stageMetrics.platforms[critter.supportIndex]
      : null;
  const baseY =
    critter.grounded && support
      ? sampleVisualTerrainY(centerX, [support])
      : stageMetrics.height - critter.y;

  return {
    type: 'critter',
    x: centerX,
    baseY,
    facing: critter.facing,
    scale: critter.scale,
    critter,
    runtimeSeconds,
  };
}

export function drawFieldCritter(context, actor) {
  const { critter, x, baseY, facing, scale, runtimeSeconds } = actor;
  const phase = runtimeSeconds * (critter.species === 'duck' ? 4.6 : 5.4) + critter.animationOffset;
  const stride = critter.grounded ? Math.sin(phase) : Math.sin(phase * 0.5) * 0.18;
  const bounce = critter.grounded ? Math.abs(stride) : 0.85;
  const shadowScale = critter.grounded ? 1 : clamp(1 - critter.y / 360, 0.38, 0.84);

  context.save();
  context.translate(x, baseY);
  context.scale(facing === 'left' ? -scale : scale, -scale);
  drawCritterShadow(context, critter, shadowScale);

  if (critter.species === 'duck') {
    drawDuck(context, critter, stride, bounce, phase);
  } else {
    drawRabbit(context, critter, stride, bounce, phase);
  }

  context.restore();
}

function createCritterState(definition, stageMetrics) {
  const supportIndex =
    findPlatformIndexByName(stageMetrics, definition.anchorPlatform) ??
    findGroundIndex(stageMetrics) ??
    0;

  const critter = {
    ...definition,
    x: 0,
    y: 0,
    velocityX: 0,
    velocityY: 0,
    grounded: true,
    supportIndex,
    supportName: stageMetrics.platforms[supportIndex]?.name ?? 'ground',
    decisionTimer: randomRange(0.1, 0.9),
    jumpCooldown: randomRange(
      definition.behavior.jumpCooldownMin,
      definition.behavior.jumpCooldownMax
    ),
  };

  const support = stageMetrics.platforms[supportIndex];
  const travelMin = support ? support.left : 0;
  const travelMax = support ? support.right - critter.width : stageMetrics.width - critter.width;
  critter.x = clamp(
    stageMetrics.width * definition.xRatio - critter.width / 2,
    travelMin,
    travelMax
  );
  critter.y = stageMetrics.height - (support?.top ?? stageMetrics.height);

  chooseNextCritterAction(critter, stageMetrics, true);
  return critter;
}

function updateCritterDecision(critter, deltaSeconds, stageMetrics) {
  critter.decisionTimer -= deltaSeconds;
  critter.jumpCooldown = Math.max(0, critter.jumpCooldown - deltaSeconds);

  if (!critter.grounded) {
    return;
  }

  if (critter.decisionTimer > 0) {
    return;
  }

  chooseNextCritterAction(critter, stageMetrics, false);
}

function chooseNextCritterAction(critter, stageMetrics, isInitialSpawn) {
  const preferredDirection = getPreferredDirection(critter, stageMetrics);
  const jumpTarget = critter.jumpCooldown <= 0 ? findJumpTarget(critter, stageMetrics) : null;
  const jumpBias = jumpTarget ? 0.12 : 0;
  const shouldJump =
    !isInitialSpawn &&
    critter.jumpCooldown <= 0 &&
    Math.random() < critter.behavior.jumpChance + jumpBias;

  if (shouldJump) {
    startCritterJump(critter, jumpTarget, preferredDirection);
    return;
  }

  if (Math.random() < 0.34 && !isInitialSpawn) {
    critter.velocityX = 0;
    critter.decisionTimer = randomRange(critter.behavior.idleMin, critter.behavior.idleMax);
    return;
  }

  const direction = preferredDirection || (Math.random() < 0.5 ? -1 : 1);
  const speed = randomRange(critter.behavior.walkSpeedMin, critter.behavior.walkSpeedMax);
  critter.velocityX = speed * direction;
  critter.decisionTimer = randomRange(critter.behavior.moveMin, critter.behavior.moveMax);
}

function startCritterJump(critter, jumpTarget, preferredDirection) {
  const direction =
    jumpTarget?.direction ?? preferredDirection ?? (critter.facing === 'left' ? -1 : 1);
  const launchVelocity = critter.behavior.jumpVelocity * randomRange(0.94, 1.04);
  const travelSpeed = jumpTarget
    ? jumpTarget.velocityX
    : direction *
      randomRange(critter.behavior.walkSpeedMin * 1.15, critter.behavior.maxAirSpeed * 0.78);

  critter.velocityX = clamp(
    travelSpeed,
    -critter.behavior.maxAirSpeed,
    critter.behavior.maxAirSpeed
  );
  critter.velocityY = launchVelocity;
  critter.grounded = false;
  critter.supportIndex = null;
  critter.supportName = null;
  critter.facing = direction < 0 ? 'left' : 'right';
  critter.decisionTimer = randomRange(0.45, 0.95);
  critter.jumpCooldown = randomRange(
    critter.behavior.jumpCooldownMin,
    critter.behavior.jumpCooldownMax
  );
}

function findJumpTarget(critter, stageMetrics) {
  const critterCenterX = critter.x + critter.width / 2;
  const candidates = [];

  for (const [index, platform] of stageMetrics.platforms.entries()) {
    if (index === critter.supportIndex) {
      continue;
    }

    if (platform.name === 'ground' && critter.supportName === 'ground') {
      continue;
    }

    const targetCenterX = clamp(
      critterCenterX,
      platform.left + critter.width * 0.7,
      platform.right - critter.width * 0.7
    );
    const dx = targetCenterX - critterCenterX;
    if (Math.abs(dx) < critter.width * 0.9 || Math.abs(dx) > critter.behavior.jumpReachX) {
      continue;
    }

    const targetY = stageMetrics.height - platform.top;
    const travelTime = estimateJumpTravelTime(
      critter.behavior.jumpVelocity,
      targetY - critter.y,
      CRITTER_PHYSICS.gravity
    );

    if (!travelTime) {
      continue;
    }

    const velocityX = dx / travelTime;
    if (Math.abs(velocityX) > critter.behavior.maxAirSpeed) {
      continue;
    }

    const liftScore = clamp((critter.y - targetY) * -1, -160, 220);
    const heightScore = critter.supportName === 'ground' && platform.name !== 'ground' ? 90 : 30;
    const distancePenalty = Math.abs(dx) * 0.24;

    candidates.push({
      direction: Math.sign(dx) || 1,
      velocityX,
      score: heightScore + liftScore - distancePenalty + Math.random() * 18,
    });
  }

  return candidates.sort((left, right) => right.score - left.score)[0] ?? null;
}

function estimateJumpTravelTime(jumpVelocity, deltaY, gravity) {
  const discriminant = jumpVelocity ** 2 - 2 * gravity * deltaY;
  if (discriminant <= 0) {
    return null;
  }

  return (jumpVelocity + Math.sqrt(discriminant)) / gravity;
}

function stepCritterVerticalMotion(critter, deltaSeconds, stageMetrics) {
  const estimatedTravel =
    Math.abs(critter.velocityY * deltaSeconds) + CRITTER_PHYSICS.gravity * deltaSeconds ** 2;
  const stepCount = Math.max(1, Math.ceil(estimatedTravel / CRITTER_PHYSICS.verticalStep));
  const stepDelta = deltaSeconds / stepCount;

  for (let index = 0; index < stepCount; index += 1) {
    const previousY = critter.y;
    critter.velocityY = Math.max(
      critter.velocityY - CRITTER_PHYSICS.gravity * stepDelta,
      -CRITTER_PHYSICS.maxFallSpeed
    );
    critter.y += critter.velocityY * stepDelta;

    resolveCritterVerticalCollisions(critter, previousY, stageMetrics);

    if (critter.grounded && critter.velocityY === 0) {
      if (Math.abs(critter.velocityX) > critter.behavior.walkSpeedMax) {
        critter.velocityX = clamp(
          critter.velocityX,
          -critter.behavior.walkSpeedMax,
          critter.behavior.walkSpeedMax
        );
      }

      critter.decisionTimer = Math.min(critter.decisionTimer, randomRange(0.18, 0.6));
      break;
    }
  }
}

function resolveCritterVerticalCollisions(critter, previousY, stageMetrics) {
  const previousTop = stageMetrics.height - previousY - critter.height;
  const nextTop = stageMetrics.height - critter.y - critter.height;
  const critterLeft = critter.x;
  const critterRight = critter.x + critter.width;

  critter.grounded = false;
  critter.supportIndex = null;
  critter.supportName = null;

  for (const [index, platform] of stageMetrics.platforms.entries()) {
    const overlapsX = critterRight > platform.left && critterLeft < platform.right;
    if (!overlapsX) {
      continue;
    }

    const landing =
      critter.velocityY <= 0 &&
      previousTop + critter.height <= platform.top &&
      nextTop + critter.height >= platform.top;

    if (landing) {
      placeCritterOnPlatform(critter, stageMetrics, index);
      return;
    }

    const headBump =
      critter.velocityY > 0 && previousTop >= platform.bottom && nextTop <= platform.bottom;

    if (headBump) {
      critter.y = stageMetrics.height - platform.bottom - critter.height;
      critter.velocityY = 0;
      return;
    }
  }

  if (critter.y < 0) {
    const groundIndex = findGroundIndex(stageMetrics) ?? 0;
    placeCritterOnPlatform(critter, stageMetrics, groundIndex);
  }
}

function placeCritterOnPlatform(critter, stageMetrics, platformIndex) {
  const platform = stageMetrics.platforms[platformIndex];
  if (!platform) {
    return;
  }

  critter.y = stageMetrics.height - platform.top;
  critter.velocityY = 0;
  critter.grounded = true;
  critter.supportIndex = platformIndex;
  critter.supportName = platform.name;
}

function confineCritterToScreen(critter, stageMetrics) {
  const maxX = Math.max(0, stageMetrics.width - critter.width);

  if (critter.x <= 0) {
    critter.x = 0;
    critter.velocityX = Math.abs(critter.velocityX);
    critter.facing = 'right';
    return;
  }

  if (critter.x >= maxX) {
    critter.x = maxX;
    critter.velocityX = -Math.abs(critter.velocityX);
    critter.facing = 'left';
  }
}

function getPreferredDirection(critter, stageMetrics) {
  const centerX = critter.x + critter.width / 2;
  const leftThreshold = stageMetrics.width * 0.14;
  const rightThreshold = stageMetrics.width * 0.86;

  if (centerX <= leftThreshold) {
    return 1;
  }

  if (centerX >= rightThreshold) {
    return -1;
  }

  if (critter.velocityX !== 0 && Math.random() < 0.65) {
    return Math.sign(critter.velocityX);
  }

  if (Math.random() < 0.46) {
    return critter.facing === 'left' ? -1 : 1;
  }

  return 0;
}

function findPlatformIndexByName(stageMetrics, name) {
  const index = stageMetrics.platforms.findIndex((platform) => platform.name === name);
  return index >= 0 ? index : null;
}

function findGroundIndex(stageMetrics) {
  const index = findPlatformIndexByName(stageMetrics, 'ground');
  return index >= 0 ? index : null;
}

function drawCritterShadow(context, critter, shadowScale) {
  context.globalAlpha = critter.grounded ? 0.22 : 0.12;
  context.fillStyle = 'rgba(33, 24, 19, 0.35)';
  context.beginPath();
  context.ellipse(
    0,
    0,
    critter.width * 0.38 * shadowScale,
    critter.height * 0.12 * shadowScale,
    0,
    0,
    Math.PI * 2
  );
  context.fill();
  context.globalAlpha = 1;
}

function drawDuck(context, critter, stride, bounce, phase) {
  const bodyY = 15 + bounce * 1.3;
  const headY = 22 + bounce * 1.1;
  const neckTilt = stride * 0.08;
  const legFrontX = 6;
  const legBackX = -5;
  const stepOffset = stride * 3.2;

  drawDuckLeg(context, legBackX, bodyY - 12, stepOffset * -0.55, critter.palette);
  drawDuckLeg(context, legFrontX, bodyY - 12, stepOffset, critter.palette);

  context.fillStyle = critter.palette.body;
  context.beginPath();
  context.ellipse(0, bodyY, 17, 11.5, 0, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = critter.palette.wing;
  context.beginPath();
  context.ellipse(-2, bodyY + 1.2, 8.4, 6.8, -0.18 + stride * 0.06, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = critter.palette.bodyShade;
  context.beginPath();
  context.moveTo(-14, bodyY + 2.4);
  context.quadraticCurveTo(-20, bodyY + 1, -18, bodyY + 7);
  context.quadraticCurveTo(-12, bodyY + 7, -9, bodyY + 5);
  context.closePath();
  context.fill();

  context.fillStyle = critter.palette.accent;
  context.beginPath();
  context.ellipse(3, bodyY + 3.4, 8.6, 5.6, 0, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = critter.palette.body;
  context.beginPath();
  context.arc(14.5, headY, 7.4, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = critter.palette.accent;
  context.beginPath();
  context.ellipse(16.4, headY + 0.8, 4.4, 3.1, 0, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = critter.palette.beak;
  context.beginPath();
  context.moveTo(20, headY + 0.8);
  context.lineTo(29.2, headY + 3.2 + neckTilt);
  context.lineTo(20, headY - 2.6);
  context.closePath();
  context.fill();

  context.strokeStyle = critter.palette.line;
  context.lineWidth = 1.3;
  context.beginPath();
  context.moveTo(8, headY - 0.2);
  context.quadraticCurveTo(10, headY + 6, 7, bodyY + 7);
  context.stroke();

  context.fillStyle = critter.palette.eye;
  context.beginPath();
  context.arc(16.8, headY + 2.2, 1.3, 0, Math.PI * 2);
  context.fill();

  context.strokeStyle = critter.palette.line;
  context.lineWidth = 1.15;
  context.beginPath();
  context.moveTo(-11, bodyY + 1);
  context.quadraticCurveTo(-3, bodyY + 10, 11, bodyY + 8);
  context.stroke();

  context.strokeStyle = critter.palette.line;
  context.lineWidth = 0.95;
  context.beginPath();
  context.moveTo(20.2, headY - 2);
  context.lineTo(22.8, headY - 0.8);
  context.stroke();

  context.beginPath();
  context.moveTo(-10, bodyY + 8);
  context.quadraticCurveTo(-3, bodyY + 11, 7, bodyY + 10);
  context.stroke();

  context.globalAlpha = 0.12;
  context.fillStyle = '#ffffff';
  context.beginPath();
  context.ellipse(2, bodyY + 6, 6.4, 2.4, 0.12, 0, Math.PI * 2);
  context.fill();
  context.globalAlpha = 1;

  context.strokeStyle = critter.palette.line;
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(-4, bodyY + 13);
  context.quadraticCurveTo(4, bodyY + 15, 12, bodyY + 13);
  context.stroke();

  context.globalAlpha = 0.08;
  context.fillStyle = '#fff7dc';
  context.beginPath();
  context.ellipse(8, headY + 6, 3, 1.6, Math.sin(phase * 0.5) * 0.08, 0, Math.PI * 2);
  context.fill();
  context.globalAlpha = 1;
}

function drawDuckLeg(context, x, hipY, stride, palette) {
  const kneeY = hipY - 8;
  const footY = 1.6;

  context.strokeStyle = palette.feet;
  context.lineWidth = 2.1;
  context.lineCap = 'round';
  context.beginPath();
  context.moveTo(x, hipY);
  context.lineTo(x + stride * 0.18, kneeY);
  context.lineTo(x + stride * 0.3, footY);
  context.stroke();

  context.lineWidth = 1.5;
  context.beginPath();
  context.moveTo(x + stride * 0.3 - 3.2, footY);
  context.lineTo(x + stride * 0.3 + 3.4, footY);
  context.stroke();
}

function drawRabbit(context, critter, stride, bounce, phase) {
  const bodyY = 17 + bounce * 1.6;
  const headY = 24 + bounce * 1.1;
  const backFootLift = Math.max(0, stride) * 3.6;
  const frontFootLift = Math.max(0, -stride) * 2.6;
  const earSwing = Math.sin(phase * 0.7) * 0.18;

  drawRabbitRearLeg(context, -10, bodyY - 6, backFootLift, critter.palette);
  drawRabbitFrontLeg(context, 9, bodyY - 3, frontFootLift, critter.palette);

  context.fillStyle = critter.palette.body;
  context.beginPath();
  context.ellipse(-1, bodyY, 15.6, 12.4, 0.08, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = critter.palette.bodyShade;
  context.beginPath();
  context.ellipse(-6, bodyY - 1.2, 9, 7.4, -0.28, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = critter.palette.tail;
  context.beginPath();
  context.arc(-15, bodyY + 2.8, 5.3, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = critter.palette.body;
  context.beginPath();
  context.arc(14.6, headY, 8.2, 0, Math.PI * 2);
  context.fill();

  drawRabbitEar(context, 10.5, headY + 4.8, 11.8, 23.8, -0.16 + earSwing, critter.palette);
  drawRabbitEar(context, 17.4, headY + 4.2, 10.2, 22.1, 0.08 + earSwing * 0.85, critter.palette);

  context.fillStyle = critter.palette.accent;
  context.beginPath();
  context.ellipse(15.8, headY + 2.2, 4.2, 3.1, 0, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = '#e8b0b5';
  context.beginPath();
  context.ellipse(21.4, headY - 0.2, 1.9, 1.5, 0, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = critter.palette.eye;
  context.beginPath();
  context.arc(16.1, headY + 2.7, 1.25, 0, Math.PI * 2);
  context.fill();

  context.strokeStyle = critter.palette.line;
  context.lineWidth = 1.05;
  context.beginPath();
  context.moveTo(20.8, headY - 1.1);
  context.lineTo(24.3, headY - 2.2);
  context.moveTo(20.9, headY - 0.6);
  context.lineTo(24.6, headY - 0.4);
  context.moveTo(20.8, headY - 0.1);
  context.lineTo(24.2, headY + 1.3);
  context.stroke();

  context.beginPath();
  context.moveTo(7.2, headY - 0.2);
  context.quadraticCurveTo(2, bodyY + 6, -3, bodyY + 4);
  context.stroke();

  context.beginPath();
  context.moveTo(-9, bodyY + 9);
  context.quadraticCurveTo(2, bodyY + 11.5, 14, bodyY + 8.6);
  context.stroke();

  context.globalAlpha = 0.1;
  context.fillStyle = '#ffffff';
  context.beginPath();
  context.ellipse(2, bodyY + 7, 6.2, 2.6, 0.14, 0, Math.PI * 2);
  context.fill();
  context.globalAlpha = 1;
}

function drawRabbitRearLeg(context, x, bodyY, lift, palette) {
  context.strokeStyle = palette.feet;
  context.lineWidth = 5;
  context.lineCap = 'round';
  context.beginPath();
  context.moveTo(x, bodyY);
  context.lineTo(x - 2.2, 7 + lift);
  context.stroke();

  context.lineWidth = 3;
  context.beginPath();
  context.moveTo(x - 5.6, 5.2 + lift);
  context.lineTo(x + 1.8, 5.8 + lift);
  context.stroke();
}

function drawRabbitFrontLeg(context, x, bodyY, lift, palette) {
  context.strokeStyle = palette.feet;
  context.lineWidth = 3.1;
  context.lineCap = 'round';
  context.beginPath();
  context.moveTo(x, bodyY);
  context.lineTo(x + 0.6, 3.8 + lift);
  context.stroke();

  context.lineWidth = 2.2;
  context.beginPath();
  context.moveTo(x - 1.8, 3 + lift);
  context.lineTo(x + 2.1, 3.2 + lift);
  context.stroke();
}

function drawRabbitEar(context, x, y, radiusX, radiusY, rotation, palette) {
  context.save();
  context.translate(x, y);
  context.rotate(rotation);

  context.fillStyle = palette.body;
  context.beginPath();
  context.ellipse(0, 0, radiusX / 2, radiusY / 2, 0, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = palette.earInner;
  context.beginPath();
  context.ellipse(0.5, 1.2, radiusX / 4.4, radiusY / 3.4, 0, 0, Math.PI * 2);
  context.fill();

  context.restore();
}

function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
