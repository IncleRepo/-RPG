import { clamp } from '../helpers.js';

export const DEFAULT_PLATFORMER_PHYSICS = Object.freeze({
  moveSpeed: 300,
  gravity: 1800,
  jumpVelocity: 760,
  maxFallSpeed: 1200,
  verticalStep: 8,
});

export function applyJumpImpulse(actorState, physics = DEFAULT_PLATFORMER_PHYSICS) {
  if (!actorState.grounded) {
    return false;
  }

  actorState.velocityY = physics.jumpVelocity;
  actorState.grounded = false;
  actorState.supportIndex = null;
  return true;
}

export function stepPlatformerPhysics(actorState, options) {
  const {
    deltaSeconds,
    horizontalInput = 0,
    physics = DEFAULT_PLATFORMER_PHYSICS,
    stageMetrics,
  } = options;

  const frameEvents = {
    horizontalCollision: null,
    landedOn: null,
    hitCeiling: null,
  };

  moveHorizontally(
    actorState,
    horizontalInput * physics.moveSpeed * deltaSeconds,
    stageMetrics,
    frameEvents
  );
  stepVerticalMotion(actorState, deltaSeconds, physics, stageMetrics, frameEvents);

  return frameEvents;
}

export function syncActorToSupport(actorState, stageMetrics) {
  let surfaceIndex = null;

  if (actorState.grounded) {
    surfaceIndex = actorState.supportIndex ?? findClosestSurfaceIndex(actorState, stageMetrics);
  }

  if (surfaceIndex === null) {
    actorState.grounded = false;
    actorState.supportIndex = null;
    return false;
  }

  const surface = stageMetrics.platforms[surfaceIndex];
  actorState.y = stageMetrics.height - surface.top;
  actorState.velocityY = 0;
  actorState.grounded = true;
  actorState.supportIndex = surfaceIndex;
  return true;
}

export function findClosestSurfaceIndex(actorState, stageMetrics) {
  const actorBounds = getActorBounds(actorState, stageMetrics.height);

  return stageMetrics.platforms.reduce((bestIndex, platform, index) => {
    if (!rangesOverlap(actorBounds.left, actorBounds.right, platform.left, platform.right)) {
      return bestIndex;
    }

    const distance = Math.abs(actorBounds.bottom - platform.top);
    if (bestIndex === null) {
      return index;
    }

    const bestDistance = Math.abs(actorBounds.bottom - stageMetrics.platforms[bestIndex].top);
    return distance < bestDistance ? index : bestIndex;
  }, null);
}

export function getActorBounds(actorState, stageHeight) {
  const top = stageHeight - actorState.y - actorState.height;

  return {
    left: actorState.x,
    right: actorState.x + actorState.width,
    top,
    bottom: top + actorState.height,
  };
}

function moveHorizontally(actorState, deltaX, stageMetrics, frameEvents) {
  if (deltaX === 0) {
    return;
  }

  const maxX = Math.max(0, stageMetrics.width - actorState.width);
  const previousX = actorState.x;
  let nextX = clamp(previousX + deltaX, 0, maxX);
  const previousBounds = getActorBounds(actorState, stageMetrics.height);
  const nextBounds = getActorBounds({ ...actorState, x: nextX }, stageMetrics.height);

  for (const platform of stageMetrics.platforms) {
    if (!rangesOverlap(previousBounds.top, previousBounds.bottom, platform.top, platform.bottom)) {
      continue;
    }

    if (deltaX > 0 && previousBounds.right <= platform.left && nextBounds.right > platform.left) {
      nextX = Math.min(nextX, platform.left - actorState.width);
      frameEvents.horizontalCollision = 'right';
      continue;
    }

    if (deltaX < 0 && previousBounds.left >= platform.right && nextBounds.left < platform.right) {
      nextX = Math.max(nextX, platform.right);
      frameEvents.horizontalCollision = 'left';
    }
  }

  actorState.x = clamp(nextX, 0, maxX);
}

function stepVerticalMotion(actorState, deltaSeconds, physics, stageMetrics, frameEvents) {
  const estimatedTravel =
    Math.abs(actorState.velocityY * deltaSeconds) + physics.gravity * deltaSeconds ** 2;
  const stepCount = Math.max(1, Math.ceil(estimatedTravel / physics.verticalStep));
  const stepDelta = deltaSeconds / stepCount;

  for (let stepIndex = 0; stepIndex < stepCount; stepIndex += 1) {
    const previousY = actorState.y;
    actorState.velocityY = Math.max(
      actorState.velocityY - physics.gravity * stepDelta,
      -physics.maxFallSpeed
    );
    actorState.y += actorState.velocityY * stepDelta;

    resolveVerticalCollisions(actorState, previousY, stageMetrics, frameEvents);

    if (actorState.grounded && actorState.velocityY === 0) {
      break;
    }
  }
}

function resolveVerticalCollisions(actorState, previousY, stageMetrics, frameEvents) {
  const previousBounds = getActorBounds({ ...actorState, y: previousY }, stageMetrics.height);
  const nextBounds = getActorBounds(actorState, stageMetrics.height);

  actorState.grounded = false;
  actorState.supportIndex = null;

  for (const [index, platform] of stageMetrics.platforms.entries()) {
    if (!rangesOverlap(nextBounds.left, nextBounds.right, platform.left, platform.right)) {
      continue;
    }

    const landed =
      actorState.velocityY <= 0 &&
      previousBounds.bottom <= platform.top &&
      nextBounds.bottom >= platform.top;

    if (landed) {
      actorState.y = stageMetrics.height - platform.top;
      actorState.velocityY = 0;
      actorState.grounded = true;
      actorState.supportIndex = index;
      frameEvents.landedOn = platform.name ?? `${index}`;
      return;
    }

    const hitCeiling =
      actorState.velocityY > 0 &&
      previousBounds.top >= platform.bottom &&
      nextBounds.top <= platform.bottom;

    if (hitCeiling) {
      actorState.y = stageMetrics.height - platform.bottom - actorState.height;
      actorState.velocityY = 0;
      frameEvents.hitCeiling = platform.name ?? `${index}`;
      return;
    }
  }

  if (actorState.y < 0) {
    actorState.y = 0;
    actorState.velocityY = 0;
    actorState.grounded = true;
  }
}

function rangesOverlap(startA, endA, startB, endB) {
  return endA > startB && startA < endB;
}
