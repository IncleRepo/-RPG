const stage = document.getElementById('game-stage');
const playerElement = document.getElementById('player');
const statusBadge = document.getElementById('status-badge');
const positionReadout = document.getElementById('position-readout');
const stateReadout = document.getElementById('state-readout');
const velocityReadout = document.getElementById('velocity-readout');

if (
  stage instanceof HTMLElement &&
  playerElement instanceof HTMLElement &&
  statusBadge instanceof HTMLElement &&
  positionReadout instanceof HTMLElement &&
  stateReadout instanceof HTMLElement &&
  velocityReadout instanceof HTMLElement
) {
  initializeMovementDemo({
    stage,
    playerElement,
    statusBadge,
    positionReadout,
    stateReadout,
    velocityReadout,
  });
}

function initializeMovementDemo(elements) {
  const BASE_STAGE_WIDTH = 960;
  const MOVE_SPEED = 340;
  const JUMP_VELOCITY = 720;
  const GRAVITY = 1850;
  const FALLBACK_FLOOR_PADDING = 4;

  const keyState = {
    left: false,
    right: false,
  };

  const player = {
    x: 0,
    y: 0,
    width: 52,
    height: 76,
    vx: 0,
    vy: 0,
    grounded: true,
    direction: 1,
  };

  const world = {
    width: 0,
    height: 0,
    floorTop: 0,
    platforms: [],
  };

  let queueJump = false;
  let lastFrameTime = 0;

  const platformElements = Array.from(elements.stage.querySelectorAll('[data-platform]')).filter(
    (platform) => platform instanceof HTMLElement
  );

  refreshWorld(false);
  updateHud();
  elements.stage.focus();

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
  elements.stage.addEventListener('pointerdown', () => {
    elements.stage.focus();
  });

  if ('ResizeObserver' in window) {
    const resizeObserver = new ResizeObserver(() => {
      refreshWorld(true);
      updateHud();
    });

    resizeObserver.observe(elements.stage);
  } else {
    window.addEventListener('resize', () => {
      refreshWorld(true);
      updateHud();
    });
  }

  requestAnimationFrame(frame);

  function frame(timestamp) {
    if (!lastFrameTime) {
      lastFrameTime = timestamp;
    }

    const deltaTime = Math.min((timestamp - lastFrameTime) / 1000, 0.032);
    lastFrameTime = timestamp;

    update(deltaTime);
    renderPlayer();
    updateHud();

    requestAnimationFrame(frame);
  }

  function update(deltaTime) {
    if (!world.width || !world.height) {
      return;
    }

    const scale = world.width / BASE_STAGE_WIDTH;
    const horizontalInput = Number(keyState.right) - Number(keyState.left);

    player.vx = horizontalInput * MOVE_SPEED * scale;
    if (horizontalInput !== 0) {
      player.direction = horizontalInput < 0 ? -1 : 1;
    }

    if (queueJump && player.grounded) {
      player.vy = -JUMP_VELOCITY * scale;
      player.grounded = false;
    }
    queueJump = false;

    player.vy += GRAVITY * scale * deltaTime;

    const nextX = clamp(
      player.x + player.vx * deltaTime,
      0,
      Math.max(0, world.width - player.width)
    );
    let nextY = player.y + player.vy * deltaTime;
    let grounded = false;

    const previousTop = player.y;
    const previousBottom = player.y + player.height;
    const nextTop = nextY;
    const nextBottom = nextY + player.height;

    for (const platform of world.platforms) {
      if (!hasHorizontalOverlap(nextX, player.width, platform)) {
        continue;
      }

      if (player.vy >= 0 && previousBottom <= platform.top && nextBottom >= platform.top) {
        nextY = platform.top - player.height;
        player.vy = 0;
        grounded = true;
        break;
      }

      if (player.vy < 0 && previousTop >= platform.bottom && nextTop <= platform.bottom) {
        nextY = platform.bottom;
        player.vy = 0;
      }
    }

    if (!grounded && nextY + player.height > world.height - FALLBACK_FLOOR_PADDING) {
      nextY = world.height - player.height - FALLBACK_FLOOR_PADDING;
      player.vy = 0;
      grounded = true;
    }

    if (nextY < 0) {
      nextY = 0;
      player.vy = 0;
    }

    player.x = nextX;
    player.y = nextY;
    player.grounded = grounded;
  }

  function refreshWorld(preservePosition) {
    const nextWidth = elements.stage.clientWidth;
    const nextHeight = elements.stage.clientHeight;

    if (!nextWidth || !nextHeight) {
      return;
    }

    const previousWorld = {
      width: world.width,
      height: world.height,
    };
    const previousPlayer = {
      x: player.x,
      y: player.y,
    };

    const size = getPlayerSize(nextWidth);
    player.width = size.width;
    player.height = size.height;
    elements.playerElement.style.width = `${player.width}px`;
    elements.playerElement.style.height = `${player.height}px`;

    const stageBounds = elements.stage.getBoundingClientRect();
    const platforms = platformElements
      .map((platformElement) => {
        const platformBounds = platformElement.getBoundingClientRect();
        return {
          id: platformElement.dataset.platform || '',
          left: platformBounds.left - stageBounds.left,
          right: platformBounds.right - stageBounds.left,
          top: platformBounds.top - stageBounds.top,
          bottom: platformBounds.bottom - stageBounds.top,
        };
      })
      .sort((first, second) => first.top - second.top);

    world.width = nextWidth;
    world.height = nextHeight;
    world.platforms = platforms;
    world.floorTop = platforms.find((platform) => platform.id === 'ground')?.top ?? nextHeight;

    if (preservePosition && previousWorld.width && previousWorld.height) {
      player.x = clamp(
        (previousPlayer.x / previousWorld.width) * nextWidth,
        0,
        Math.max(0, nextWidth - player.width)
      );
      player.y = clamp(
        (previousPlayer.y / previousWorld.height) * nextHeight,
        0,
        Math.max(0, nextHeight - player.height)
      );
    } else {
      player.x = nextWidth * 0.08;
      player.y = world.floorTop - player.height;
      player.vx = 0;
      player.vy = 0;
      player.grounded = true;
    }

    if (player.y + player.height > world.floorTop) {
      player.y = world.floorTop - player.height;
      player.vy = 0;
      player.grounded = true;
    }

    renderPlayer();
  }

  function renderPlayer() {
    elements.playerElement.style.setProperty('--player-x', `${player.x}px`);
    elements.playerElement.style.setProperty('--player-y', `${player.y}px`);
    elements.playerElement.style.setProperty('--player-direction', String(player.direction));
  }

  function updateHud() {
    const altitude = Math.max(0, Math.round(world.floorTop - (player.y + player.height)));
    const movementState = player.grounded
      ? Math.abs(player.vx) > 0
        ? '지상 이동 중'
        : '대기 중'
      : player.vy < 0
        ? '점프 중'
        : '낙하 중';

    elements.statusBadge.textContent = movementState;
    elements.positionReadout.textContent = `X ${Math.round(player.x)} / Y ${altitude}`;
    elements.stateReadout.textContent = movementState;
    elements.velocityReadout.textContent = `VX ${Math.round(player.vx)} / VY ${Math.round(player.vy)}`;
  }

  function handleKeyDown(event) {
    const key = event.key.toLowerCase();

    if (key === 'a' || key === 'arrowleft') {
      keyState.left = true;
      event.preventDefault();
    }

    if (key === 'd' || key === 'arrowright') {
      keyState.right = true;
      event.preventDefault();
    }

    if (isJumpKey(key)) {
      if (!event.repeat) {
        queueJump = true;
      }
      event.preventDefault();
    }
  }

  function handleKeyUp(event) {
    const key = event.key.toLowerCase();

    if (key === 'a' || key === 'arrowleft') {
      keyState.left = false;
      event.preventDefault();
    }

    if (key === 'd' || key === 'arrowright') {
      keyState.right = false;
      event.preventDefault();
    }
  }
}

function getPlayerSize(stageWidth) {
  const width = clamp(stageWidth * 0.055, 40, 56);
  return {
    width,
    height: width * 1.45,
  };
}

function hasHorizontalOverlap(playerX, playerWidth, platform) {
  return playerX + playerWidth > platform.left && playerX < platform.right;
}

function isJumpKey(key) {
  return key === 'w' || key === 'arrowup' || key === ' ' || key === 'spacebar';
}

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}
