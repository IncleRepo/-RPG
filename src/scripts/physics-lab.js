import { clamp } from './game/helpers.js';
import {
  DEFAULT_PLATFORMER_PHYSICS,
  applyJumpImpulse,
  stepPlatformerPhysics,
} from './game/physics/platformer-physics.js';
import { getPhysicsLabElements } from './game/runtime-dom.js';
import { CHARACTER_COLLIDER } from './game/runtime-scene.js';

const LAB_STAGE = Object.freeze({
  width: 960,
  height: 540,
});

const SCENARIOS = [
  {
    id: 'side-wall',
    name: '옆면 충돌',
    description:
      '점프 중 발판 옆면에 닿을 때 위로 타고 올라가지 않고 수평으로 멈춰야 하는 상황입니다.',
    expectation:
      '오른쪽으로 달려 점프하면 블록의 옆면에서 막히고, 블록 위로 자동으로 올라가지 않아야 합니다.',
    spawn: {
      surface: 'ground',
      x: 156,
      facing: 'right',
    },
    platforms: [
      createPlatform('ground', 0, 430, 960, 110),
      createPlatform('side-wall', 470, 248, 118, 182),
      createPlatform('landing', 680, 316, 150, 28),
    ],
  },
  {
    id: 'ceiling-bump',
    name: '천장 충돌',
    description: '낮은 천장 밑에서 점프할 때 머리가 천장에 닿는지 확인하는 시나리오입니다.',
    expectation: '천장 아래에서 점프하면 속도가 바로 끊기고 아래로 떨어져야 합니다.',
    spawn: {
      surface: 'ground',
      x: 360,
      facing: 'right',
    },
    platforms: [
      createPlatform('ground', 0, 430, 960, 110),
      createPlatform('ceiling', 318, 254, 252, 28),
      createPlatform('right-step', 650, 332, 180, 24),
    ],
  },
  {
    id: 'gap-landing',
    name: '착지 전환',
    description:
      '낮은 발판에서 높은 발판으로 이동하며 착지 판정이 자연스럽게 이어지는지 확인합니다.',
    expectation:
      '왼쪽 발판에서 달려 점프하면 오른쪽 발판에 안정적으로 착지하고 support surface가 바뀌어야 합니다.',
    spawn: {
      surface: 'left-step',
      x: 178,
      facing: 'right',
    },
    platforms: [
      createPlatform('ground', 0, 470, 960, 70),
      createPlatform('left-step', 120, 368, 190, 24),
      createPlatform('right-step', 462, 308, 210, 24),
      createPlatform('far-step', 762, 260, 128, 22),
    ],
  },
];

initializePhysicsLab();

function initializePhysicsLab() {
  const dom = getPhysicsLabElements();
  const inputState = {
    left: false,
    right: false,
    jumpQueued: false,
  };
  let currentScenario = SCENARIOS[0];
  let stageMetrics = buildStageMetrics(currentScenario);
  let playerState = createScenarioPlayerState(currentScenario, stageMetrics);
  let lastFrame = performance.now();
  let viewport = measureCanvas(dom.canvas);
  let lastFrameEvents = {
    horizontalCollision: null,
    landedOn: null,
    hitCeiling: null,
  };

  function activateScenario(nextScenarioId) {
    const foundScenario = SCENARIOS.find((scenario) => scenario.id === nextScenarioId);
    if (!foundScenario) {
      return;
    }

    currentScenario = foundScenario;
    stageMetrics = buildStageMetrics(currentScenario);
    playerState = createScenarioPlayerState(currentScenario, stageMetrics);
    lastFrameEvents = {
      horizontalCollision: null,
      landedOn: null,
      hitCeiling: null,
    };
    syncScenarioUi();
    render();
  }

  function resetScenario() {
    playerState = createScenarioPlayerState(currentScenario, stageMetrics);
    lastFrameEvents = {
      horizontalCollision: null,
      landedOn: null,
      hitCeiling: null,
    };
    render();
  }

  function syncScenarioUi() {
    dom.scenarioButtons.forEach((button) => {
      button.classList.toggle('is-active', button.dataset.physicsScenario === currentScenario.id);
    });

    dom.scenarioTitle.textContent = currentScenario.name;
    dom.scenarioDescription.textContent = currentScenario.description;
    dom.scenarioExpectation.textContent = currentScenario.expectation;
  }

  function updateReadouts() {
    const pressedKeys = [];

    if (inputState.left) {
      pressedKeys.push('←');
    }

    if (inputState.right) {
      pressedKeys.push('→');
    }

    dom.activeKeys.textContent = pressedKeys.length > 0 ? pressedKeys.join(' + ') : '없음';

    const supportLabel =
      playerState.supportIndex === null
        ? '없음'
        : (stageMetrics.platforms[playerState.supportIndex]?.name ?? '없음');
    dom.stateReadout.textContent =
      `x ${Math.round(playerState.x)} / y ${Math.round(playerState.y)} / ` +
      `vY ${Math.round(playerState.velocityY)} / grounded ${playerState.grounded ? 'yes' : 'no'} / ` +
      `support ${supportLabel}`;

    const collisionParts = [];

    if (lastFrameEvents.horizontalCollision) {
      collisionParts.push(`벽 충돌: ${lastFrameEvents.horizontalCollision}`);
    }

    if (lastFrameEvents.landedOn) {
      collisionParts.push(`착지: ${lastFrameEvents.landedOn}`);
    }

    if (lastFrameEvents.hitCeiling) {
      collisionParts.push(`천장 충돌: ${lastFrameEvents.hitCeiling}`);
    }

    dom.collisionReadout.textContent =
      collisionParts.length > 0 ? collisionParts.join(' / ') : '현재 프레임 이벤트 없음';
  }

  function update(deltaSeconds) {
    const direction = Number(inputState.right) - Number(inputState.left);

    if (direction < 0) {
      playerState.facing = 'left';
    } else if (direction > 0) {
      playerState.facing = 'right';
    }

    if (inputState.jumpQueued) {
      applyJumpImpulse(playerState, DEFAULT_PLATFORMER_PHYSICS);
      inputState.jumpQueued = false;
    }

    lastFrameEvents = stepPlatformerPhysics(playerState, {
      deltaSeconds,
      horizontalInput: direction,
      physics: DEFAULT_PLATFORMER_PHYSICS,
      stageMetrics,
    });
  }

  function render() {
    viewport = measureCanvas(dom.canvas);
    const { context } = dom;
    const { cssWidth, cssHeight, dpr, scale, offsetX, offsetY } = viewport;

    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, dom.canvas.width, dom.canvas.height);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    const background = context.createLinearGradient(0, 0, 0, cssHeight);
    background.addColorStop(0, '#f5fbff');
    background.addColorStop(1, '#dae8f5');
    context.fillStyle = background;
    context.fillRect(0, 0, cssWidth, cssHeight);

    context.save();
    context.translate(offsetX, offsetY);
    context.scale(scale, scale);

    drawGrid(context);
    drawPlatforms(context, stageMetrics.platforms);
    drawPlayer(context, playerState);
    drawHud(context, currentScenario, playerState, lastFrameEvents);

    context.restore();
    updateReadouts();
  }

  function gameLoop(now) {
    const deltaSeconds = Math.min((now - lastFrame) / 1000, 1 / 30);
    lastFrame = now;
    update(deltaSeconds);
    render();
    requestAnimationFrame(gameLoop);
  }

  function onKeyDown(event) {
    if (
      ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'KeyA', 'KeyD', 'KeyW', 'Space', 'KeyR'].includes(
        event.code
      )
    ) {
      event.preventDefault();
    }

    if (event.repeat) {
      return;
    }

    if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
      inputState.left = true;
    }

    if (event.code === 'ArrowRight' || event.code === 'KeyD') {
      inputState.right = true;
    }

    if (event.code === 'ArrowUp' || event.code === 'KeyW' || event.code === 'Space') {
      inputState.jumpQueued = true;
    }

    if (event.code === 'KeyR') {
      resetScenario();
    }
  }

  function onKeyUp(event) {
    if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
      inputState.left = false;
    }

    if (event.code === 'ArrowRight' || event.code === 'KeyD') {
      inputState.right = false;
    }
  }

  function clearInputs() {
    inputState.left = false;
    inputState.right = false;
    inputState.jumpQueued = false;
  }

  dom.scenarioButtons.forEach((button) => {
    button.addEventListener('click', () => {
      activateScenario(button.dataset.physicsScenario);
    });
  });
  dom.resetButton.addEventListener('click', resetScenario);
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('blur', clearInputs);
  window.addEventListener('resize', () => {
    render();
  });

  syncScenarioUi();
  render();
  requestAnimationFrame(gameLoop);
}

function buildStageMetrics(scenario) {
  return {
    width: LAB_STAGE.width,
    height: LAB_STAGE.height,
    platforms: scenario.platforms.map((platform) => ({
      ...platform,
      right: platform.left + platform.width,
      bottom: platform.top + platform.height,
    })),
  };
}

function createScenarioPlayerState(scenario, stageMetrics) {
  const spawnIndex = stageMetrics.platforms.findIndex(
    (platform) => platform.name === scenario.spawn.surface
  );
  const spawnSurface = stageMetrics.platforms[Math.max(0, spawnIndex)];
  const maxX = Math.max(0, stageMetrics.width - CHARACTER_COLLIDER.width);

  return {
    x: clamp(scenario.spawn.x, 0, maxX),
    y: stageMetrics.height - spawnSurface.top,
    velocityY: 0,
    width: CHARACTER_COLLIDER.width,
    height: CHARACTER_COLLIDER.height,
    grounded: true,
    facing: scenario.spawn.facing ?? 'right',
    supportIndex: spawnIndex,
  };
}

function measureCanvas(canvas) {
  const cssWidth = Math.max(320, Math.round(canvas.clientWidth));
  const cssHeight = Math.max(240, Math.round(canvas.clientHeight));
  const dpr = window.devicePixelRatio || 1;

  canvas.width = Math.round(cssWidth * dpr);
  canvas.height = Math.round(cssHeight * dpr);

  const scale = Math.min(cssWidth / LAB_STAGE.width, cssHeight / LAB_STAGE.height);

  return {
    cssWidth,
    cssHeight,
    dpr,
    scale,
    offsetX: (cssWidth - LAB_STAGE.width * scale) / 2,
    offsetY: (cssHeight - LAB_STAGE.height * scale) / 2,
  };
}

function drawGrid(context) {
  context.save();
  context.strokeStyle = 'rgba(38, 67, 102, 0.08)';
  context.lineWidth = 1;

  for (let x = 0; x <= LAB_STAGE.width; x += 48) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, LAB_STAGE.height);
    context.stroke();
  }

  for (let y = 0; y <= LAB_STAGE.height; y += 48) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(LAB_STAGE.width, y);
    context.stroke();
  }

  context.restore();
}

function drawPlatforms(context, platforms) {
  for (const platform of platforms) {
    if (platform.name === 'ground') {
      const gradient = context.createLinearGradient(0, platform.top, 0, platform.bottom);
      gradient.addColorStop(0, '#7ab15f');
      gradient.addColorStop(0.24, '#7ab15f');
      gradient.addColorStop(0.24, '#84583a');
      gradient.addColorStop(1, '#5f3d26');
      context.fillStyle = gradient;
      context.fillRect(platform.left, platform.top, platform.width, platform.height);
      continue;
    }

    context.fillStyle = '#90c373';
    context.strokeStyle = 'rgba(31, 54, 26, 0.16)';
    context.lineWidth = 2;
    context.beginPath();
    context.roundRect(platform.left, platform.top, platform.width, platform.height, 12);
    context.fill();
    context.stroke();

    context.fillStyle = 'rgba(24, 34, 48, 0.7)';
    context.font = '12px "Noto Sans KR", sans-serif';
    context.fillText(platform.name, platform.left + 12, platform.top - 10);
  }
}

function drawPlayer(context, playerState) {
  const drawX = playerState.x;
  const drawY = LAB_STAGE.height - playerState.y - playerState.height;

  context.save();
  context.shadowColor = 'rgba(32, 62, 98, 0.2)';
  context.shadowBlur = 16;
  context.fillStyle = '#2d6fa1';
  context.beginPath();
  context.roundRect(drawX, drawY, playerState.width, playerState.height, 18);
  context.fill();
  context.restore();

  context.fillStyle = '#f8fbff';
  context.beginPath();
  if (playerState.facing === 'right') {
    context.moveTo(drawX + playerState.width - 14, drawY + playerState.height / 2);
    context.lineTo(drawX + playerState.width - 30, drawY + playerState.height / 2 - 10);
    context.lineTo(drawX + playerState.width - 30, drawY + playerState.height / 2 + 10);
  } else {
    context.moveTo(drawX + 14, drawY + playerState.height / 2);
    context.lineTo(drawX + 30, drawY + playerState.height / 2 - 10);
    context.lineTo(drawX + 30, drawY + playerState.height / 2 + 10);
  }
  context.closePath();
  context.fill();
}

function drawHud(context, scenario, playerState, frameEvents) {
  context.save();
  context.fillStyle = 'rgba(255, 255, 255, 0.88)';
  context.strokeStyle = 'rgba(25, 48, 74, 0.08)';
  context.lineWidth = 1;
  context.beginPath();
  context.roundRect(24, 24, 356, 88, 18);
  context.fill();
  context.stroke();

  context.fillStyle = '#1f2530';
  context.font = '700 16px "Noto Sans KR", sans-serif';
  context.fillText(scenario.name, 42, 50);
  context.font = '13px "Noto Sans KR", sans-serif';
  context.fillText(`grounded: ${playerState.grounded ? 'yes' : 'no'}`, 42, 74);
  context.fillText(
    `support: ${playerState.supportIndex === null ? 'none' : stageMetricsLabel(scenario, playerState)}`,
    42,
    94
  );

  const eventLabel =
    frameEvents.horizontalCollision || frameEvents.landedOn || frameEvents.hitCeiling
      ? [
          frameEvents.horizontalCollision ? `wall ${frameEvents.horizontalCollision}` : null,
          frameEvents.landedOn ? `land ${frameEvents.landedOn}` : null,
          frameEvents.hitCeiling ? `ceiling ${frameEvents.hitCeiling}` : null,
        ]
          .filter(Boolean)
          .join(' / ')
      : 'frame event 없음';
  context.fillText(eventLabel, 186, 74);
  context.fillText('R로 리셋 / A,D,W 또는 방향키 사용', 186, 94);
  context.restore();
}

function stageMetricsLabel(scenario, playerState) {
  return scenario.platforms[playerState.supportIndex]?.name ?? 'none';
}

function createPlatform(name, left, top, width, height) {
  return {
    name,
    left,
    top,
    width,
    height,
  };
}
