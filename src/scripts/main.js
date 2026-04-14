const stage = document.getElementById('game-stage');
const player = document.getElementById('player');
const statusBadge = document.getElementById('status-badge');
const movementState = document.getElementById('movement-state');
const jumpState = document.getElementById('jump-state');
const playerPosition = document.getElementById('player-position');

if (
  stage instanceof HTMLElement &&
  player instanceof HTMLElement &&
  statusBadge &&
  movementState &&
  jumpState &&
  playerPosition
) {
  initializeMovementDemo({
    stage,
    player,
    statusBadge,
    movementState,
    jumpState,
    playerPosition,
  });
}

function initializeMovementDemo(elements) {
  const { stage, player, statusBadge, movementState, jumpState, playerPosition } = elements;
  const platformElements = Array.from(stage.querySelectorAll('[data-platform]')).filter(
    (platform) => platform instanceof HTMLElement
  );

  if (platformElements.length === 0) {
    statusBadge.textContent = '스테이지 오류';
    return;
  }

  const keys = {
    left: false,
    right: false,
  };

  const metrics = {
    stageWidth: 0,
    stageHeight: 0,
    playerWidth: 0,
    playerHeight: 0,
    platforms: [],
  };

  const state = {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    onGround: false,
    facing: 'right',
  };

  let animationFrameId = 0;
  let previousTimestamp = 0;

  function measureScene() {
    const previousWidth = metrics.stageWidth;
    const previousHeight = metrics.stageHeight;
    const nextWidth = stage.clientWidth;
    const nextHeight = stage.clientHeight;

    if (nextWidth === 0 || nextHeight === 0) {
      return;
    }

    metrics.stageWidth = nextWidth;
    metrics.stageHeight = nextHeight;
    metrics.playerWidth = player.offsetWidth;
    metrics.playerHeight = player.offsetHeight;
    metrics.platforms = platformElements
      .map((platform) => ({
        x: platform.offsetLeft,
        y: platform.offsetTop,
        width: platform.offsetWidth,
        height: platform.offsetHeight,
        isGround: platform.hasAttribute('data-ground'),
      }))
      .sort((first, second) => first.y - second.y);

    if (previousWidth > 0 && previousHeight > 0) {
      const widthRatio = nextWidth / previousWidth;
      const heightRatio = nextHeight / previousHeight;

      state.x *= widthRatio;
      state.y *= heightRatio;
      state.vx *= widthRatio;
      state.vy *= heightRatio;
    } else {
      const ground = metrics.platforms.find((platform) => platform.isGround);
      state.x = nextWidth * 0.12;
      state.y = ground ? ground.y - metrics.playerHeight : nextHeight - metrics.playerHeight;
      state.onGround = true;
    }

    clampPlayer();

    if (state.onGround) {
      snapPlayerToSurface();
    }
  }

  function clampPlayer() {
    const maxX = Math.max(metrics.stageWidth - metrics.playerWidth, 0);
    const maxY = Math.max(metrics.stageHeight - metrics.playerHeight, 0);

    state.x = Math.min(Math.max(state.x, 0), maxX);
    state.y = Math.min(Math.max(state.y, 0), maxY);
  }

  function snapPlayerToSurface() {
    const footPosition = state.x + metrics.playerWidth / 2;
    let closestPlatform = null;
    let closestDistance = Number.POSITIVE_INFINITY;

    for (const platform of metrics.platforms) {
      const withinPlatform =
        footPosition >= platform.x && footPosition <= platform.x + platform.width;

      if (!withinPlatform) {
        continue;
      }

      const distance = Math.abs(platform.y - (state.y + metrics.playerHeight));

      if (distance < closestDistance) {
        closestDistance = distance;
        closestPlatform = platform;
      }
    }

    if (!closestPlatform) {
      return;
    }

    state.y = closestPlatform.y - metrics.playerHeight;
    state.vy = 0;
  }

  function intersectsPlatform(platform) {
    const left = state.x;
    const right = state.x + metrics.playerWidth;

    return right > platform.x + 4 && left < platform.x + platform.width - 4;
  }

  function handleHorizontalMovement(deltaTime) {
    const direction = Number(keys.right) - Number(keys.left);
    const moveSpeed = metrics.stageWidth * 0.42;

    state.vx = direction * moveSpeed;
    state.x += state.vx * deltaTime;
    clampPlayer();

    if (direction !== 0) {
      state.facing = direction < 0 ? 'left' : 'right';
    }
  }

  function handleVerticalMovement(deltaTime) {
    const gravity = metrics.stageHeight * 2.7;
    const maxFallSpeed = metrics.stageHeight * 1.8;
    const previousTop = state.y;
    const previousBottom = previousTop + metrics.playerHeight;

    state.vy = Math.min(state.vy + gravity * deltaTime, maxFallSpeed);

    let nextY = previousTop + state.vy * deltaTime;
    let grounded = false;

    if (state.vy >= 0) {
      const nextBottom = nextY + metrics.playerHeight;

      for (const platform of metrics.platforms) {
        if (!intersectsPlatform(platform)) {
          continue;
        }

        const crossedPlatformTop = previousBottom <= platform.y && nextBottom >= platform.y;

        if (crossedPlatformTop) {
          nextY = platform.y - metrics.playerHeight;
          state.vy = 0;
          grounded = true;
          break;
        }
      }
    } else {
      for (const platform of metrics.platforms) {
        if (!intersectsPlatform(platform)) {
          continue;
        }

        const platformBottom = platform.y + platform.height;
        const crossedPlatformBottom = previousTop >= platformBottom && nextY <= platformBottom;

        if (crossedPlatformBottom) {
          nextY = platformBottom;
          state.vy = 0;
          break;
        }
      }
    }

    state.y = nextY;

    if (state.y + metrics.playerHeight >= metrics.stageHeight) {
      state.y = metrics.stageHeight - metrics.playerHeight;
      state.vy = 0;
      grounded = true;
    }

    state.onGround = grounded;
  }

  function render() {
    const direction = Number(keys.right) - Number(keys.left);

    player.style.transform = `translate(${state.x}px, ${state.y}px)`;
    player.dataset.facing = state.facing;
    player.dataset.state = state.onGround && direction !== 0 ? 'moving' : 'idle';

    movementState.textContent = direction === 0 ? '대기' : '이동 중';
    jumpState.textContent = state.onGround ? '지면' : state.vy < 0 ? '상승' : '하강';
    playerPosition.textContent = `${Math.round(state.x)}, ${Math.round(state.y)}`;

    if (!state.onGround) {
      statusBadge.textContent = '점프 중';
    } else if (direction !== 0) {
      statusBadge.textContent = '이동 중';
    } else {
      statusBadge.textContent = '플레이 가능';
    }
  }

  function jump() {
    if (!state.onGround) {
      return;
    }

    state.vy = -(metrics.stageHeight * 1.18);
    state.onGround = false;
  }

  function animate(timestamp) {
    if (previousTimestamp === 0) {
      previousTimestamp = timestamp;
    }

    const deltaTime = Math.min((timestamp - previousTimestamp) / 1000, 0.032);
    previousTimestamp = timestamp;

    handleHorizontalMovement(deltaTime);
    handleVerticalMovement(deltaTime);
    render();

    animationFrameId = window.requestAnimationFrame(animate);
  }

  function handleKeyChange(event, isPressed) {
    const isJumpKey = event.code === 'Space' || event.code === 'ArrowUp' || event.code === 'KeyW';
    const isLeftKey = event.code === 'ArrowLeft' || event.code === 'KeyA';
    const isRightKey = event.code === 'ArrowRight' || event.code === 'KeyD';

    if (!isJumpKey && !isLeftKey && !isRightKey) {
      return;
    }

    event.preventDefault();

    if (isLeftKey) {
      keys.left = isPressed;
    }

    if (isRightKey) {
      keys.right = isPressed;
    }

    if (isJumpKey && isPressed && !event.repeat) {
      jump();
    }
  }

  measureScene();
  render();

  animationFrameId = window.requestAnimationFrame(animate);

  window.addEventListener('keydown', (event) => handleKeyChange(event, true));
  window.addEventListener('keyup', (event) => handleKeyChange(event, false));
  window.addEventListener('resize', () => {
    previousTimestamp = 0;
    measureScene();
    render();
  });
  window.addEventListener('beforeunload', () => {
    window.cancelAnimationFrame(animationFrameId);
  });
}
