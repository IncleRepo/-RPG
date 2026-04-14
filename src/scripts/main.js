const stage = document.getElementById('game-stage');
const playerElement = document.getElementById('player');
const groundElement = document.getElementById('ground');
const statusBadge = document.getElementById('status-badge');
const movementState = document.getElementById('movement-state');
const positionX = document.getElementById('position-x');
const positionY = document.getElementById('position-y');
const velocityY = document.getElementById('velocity-y');
const groundedState = document.getElementById('grounded-state');

if (
  stage instanceof HTMLElement &&
  playerElement instanceof HTMLElement &&
  groundElement instanceof HTMLElement &&
  statusBadge &&
  movementState &&
  positionX &&
  positionY &&
  velocityY &&
  groundedState
) {
  const floatingPlatforms = [...stage.querySelectorAll('.platform-floating')].filter(
    (platform) => platform instanceof HTMLElement
  );

  const physics = {
    moveSpeed: 320,
    gravity: 1850,
    jumpVelocity: -720,
  };

  const player = {
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    grounded: false,
    facing: 1,
  };

  const stageMetrics = {
    width: 0,
    height: 0,
    floorY: 0,
  };

  const keys = new Set();
  let lastFrameTime = performance.now();

  function updateStageMetrics() {
    const stageRect = stage.getBoundingClientRect();
    const groundRect = groundElement.getBoundingClientRect();
    const playerRect = playerElement.getBoundingClientRect();

    stageMetrics.width = stageRect.width;
    stageMetrics.height = stageRect.height;
    stageMetrics.floorY = groundRect.top - stageRect.top;
    player.width = playerRect.width;
    player.height = playerRect.height;

    player.x = clamp(player.x, 0, Math.max(0, stageMetrics.width - player.width));
    player.y = Math.min(player.y, stageMetrics.floorY - player.height);
  }

  function getPlatformBounds(platform) {
    const platformRect = platform.getBoundingClientRect();
    const stageRect = stage.getBoundingClientRect();

    return {
      left: platformRect.left - stageRect.left,
      right: platformRect.right - stageRect.left,
      top: platformRect.top - stageRect.top,
    };
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function isMoveLeftPressed() {
    return keys.has('ArrowLeft') || keys.has('KeyA');
  }

  function isMoveRightPressed() {
    return keys.has('ArrowRight') || keys.has('KeyD');
  }

  function refreshPlayerVisuals() {
    playerElement.style.transform = `translate3d(${player.x}px, ${player.y}px, 0)`;
    playerElement.style.setProperty('--facing', player.facing.toString());
    playerElement.classList.toggle('is-running', player.grounded && Math.abs(player.vx) > 0);
    playerElement.classList.toggle('is-jumping', !player.grounded);
  }

  function refreshHud() {
    const stateLabel = player.grounded
      ? Math.abs(player.vx) > 0
        ? '이동 중'
        : '대기'
      : player.vy < 0
        ? '점프'
        : '낙하';

    statusBadge.textContent = stateLabel;
    movementState.textContent = stateLabel;
    positionX.textContent = Math.round(player.x).toString();
    positionY.textContent = Math.round(player.y).toString();
    velocityY.textContent = Math.round(player.vy).toString();
    groundedState.textContent = player.grounded ? '접촉 중' : '공중';
  }

  function resetPlayerPosition() {
    updateStageMetrics();
    player.x = stageMetrics.width * 0.08;
    player.y = stageMetrics.floorY - player.height;
    player.vx = 0;
    player.vy = 0;
    player.grounded = true;
    player.facing = 1;
    refreshPlayerVisuals();
    refreshHud();
  }

  function tryJump() {
    if (!player.grounded) {
      return;
    }

    player.vy = physics.jumpVelocity;
    player.grounded = false;
  }

  function handleKeyDown(event) {
    if (event.repeat) {
      return;
    }

    if (
      ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'KeyA', 'KeyD', 'KeyW', 'Space'].includes(event.code)
    ) {
      event.preventDefault();
    }

    keys.add(event.code);

    if (['ArrowUp', 'KeyW', 'Space'].includes(event.code)) {
      tryJump();
    }
  }

  function handleKeyUp(event) {
    keys.delete(event.code);
  }

  function resolveVerticalCollision(nextY, previousBottom) {
    const nextBottom = nextY + player.height;

    if (nextBottom >= stageMetrics.floorY) {
      return {
        grounded: true,
        y: stageMetrics.floorY - player.height,
      };
    }

    if (player.vy < 0) {
      return null;
    }

    const playerLeft = player.x;
    const playerRight = player.x + player.width;
    let landingY = Number.POSITIVE_INFINITY;

    for (const platform of floatingPlatforms) {
      const bounds = getPlatformBounds(platform);
      const overlapsHorizontally = playerRight > bounds.left + 10 && playerLeft < bounds.right - 10;
      const crossedPlatformTop = previousBottom <= bounds.top && nextBottom >= bounds.top;

      if (overlapsHorizontally && crossedPlatformTop && bounds.top < landingY) {
        landingY = bounds.top - player.height;
      }
    }

    if (landingY !== Number.POSITIVE_INFINITY) {
      return {
        grounded: true,
        y: landingY,
      };
    }

    return null;
  }

  function tick(currentTime) {
    const deltaTime = Math.min((currentTime - lastFrameTime) / 1000, 1 / 30);
    lastFrameTime = currentTime;

    updateStageMetrics();

    const horizontalInput = Number(isMoveRightPressed()) - Number(isMoveLeftPressed());
    player.vx = horizontalInput * physics.moveSpeed;

    if (horizontalInput !== 0) {
      player.facing = horizontalInput > 0 ? 1 : -1;
    }

    player.x = clamp(
      player.x + player.vx * deltaTime,
      0,
      Math.max(0, stageMetrics.width - player.width)
    );

    const previousBottom = player.y + player.height;

    player.vy += physics.gravity * deltaTime;
    let nextY = player.y + player.vy * deltaTime;
    let isGrounded = false;

    const collision = resolveVerticalCollision(nextY, previousBottom);
    if (collision) {
      nextY = collision.y;
      player.vy = 0;
      isGrounded = collision.grounded;
    }

    player.y = nextY;
    player.grounded = isGrounded;

    refreshPlayerVisuals();
    refreshHud();

    window.requestAnimationFrame(tick);
  }

  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
  window.addEventListener('blur', () => keys.clear());
  window.addEventListener('resize', updateStageMetrics);

  resetPlayerPosition();
  statusBadge.textContent = '준비 완료';
  lastFrameTime = performance.now();
  window.requestAnimationFrame(tick);
}
