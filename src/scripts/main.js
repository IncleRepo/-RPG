const world = {
  width: 960,
  height: 540,
};

const physics = {
  moveSpeed: 300,
  jumpVelocity: 760,
  gravity: 1900,
  maxFallSpeed: 1050,
};

const stage = document.getElementById('game-stage');
const playerElement = document.getElementById('player');
const statusBadge = document.getElementById('status-badge');
const positionLabel = document.getElementById('player-position');
const velocityLabel = document.getElementById('player-velocity');
const stateLabel = document.getElementById('player-state');

if (
  stage instanceof HTMLElement &&
  playerElement instanceof HTMLElement &&
  statusBadge &&
  positionLabel &&
  velocityLabel &&
  stateLabel
) {
  const platformElements = [...stage.querySelectorAll('[data-platform]')].filter(
    (platform) => platform instanceof HTMLElement
  );

  const platforms = platformElements.map((element) => {
    const platform = createPlatform(element);
    renderEntity(element, platform);
    return platform;
  });

  const player = {
    width: 48,
    height: 64,
    x: 84,
    y: 0,
    vx: 0,
    vy: 0,
    grounded: true,
    facing: 'right',
  };

  const input = {
    left: false,
    right: false,
    jumpQueued: false,
  };

  const spawnPlatform = platforms[0];
  let lastFrameTime = performance.now();

  player.y = spawnPlatform.top;
  renderPlayer();
  updateHud();
  statusBadge.textContent = '준비 완료';

  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
  window.addEventListener('blur', clearInput);

  window.requestAnimationFrame(tick);

  function tick(currentTime) {
    const deltaTime = Math.min((currentTime - lastFrameTime) / 1000, 1 / 30);
    lastFrameTime = currentTime;

    applyInput();
    applyGravity(deltaTime);
    moveHorizontally(deltaTime);
    moveVertically(deltaTime);
    renderPlayer();
    updateHud();

    window.requestAnimationFrame(tick);
  }

  function applyInput() {
    const direction = Number(input.right) - Number(input.left);
    player.vx = direction * physics.moveSpeed;

    if (direction !== 0) {
      player.facing = direction > 0 ? 'right' : 'left';
    }

    if (input.jumpQueued && player.grounded) {
      player.vy = physics.jumpVelocity;
      player.grounded = false;
    }

    input.jumpQueued = false;
  }

  function applyGravity(deltaTime) {
    player.vy = Math.max(player.vy - physics.gravity * deltaTime, -physics.maxFallSpeed);
  }

  function moveHorizontally(deltaTime) {
    const currentRect = getRect(player.x, player.y, player.width, player.height);
    let nextX = clamp(player.x + player.vx * deltaTime, 0, world.width - player.width);
    let movedRect = getRect(nextX, player.y, player.width, player.height);

    for (const platform of platforms) {
      if (!overlapsVertically(movedRect, platform)) {
        continue;
      }

      if (player.vx > 0 && currentRect.right <= platform.left && movedRect.right > platform.left) {
        nextX = platform.left - player.width;
        movedRect = getRect(nextX, player.y, player.width, player.height);
      }

      if (player.vx < 0 && currentRect.left >= platform.right && movedRect.left < platform.right) {
        nextX = platform.right;
        movedRect = getRect(nextX, player.y, player.width, player.height);
      }
    }

    player.x = clamp(nextX, 0, world.width - player.width);
  }

  function moveVertically(deltaTime) {
    const currentRect = getRect(player.x, player.y, player.width, player.height);
    let nextY = player.y + player.vy * deltaTime;
    let movedRect = getRect(player.x, nextY, player.width, player.height);

    player.grounded = false;

    for (const platform of platforms) {
      if (!overlapsHorizontally(movedRect, platform)) {
        continue;
      }

      if (player.vy <= 0 && currentRect.bottom >= platform.top && movedRect.bottom < platform.top) {
        nextY = platform.top;
        player.vy = 0;
        player.grounded = true;
        movedRect = getRect(player.x, nextY, player.width, player.height);
      }

      if (player.vy > 0 && currentRect.top <= platform.bottom && movedRect.top > platform.bottom) {
        nextY = platform.bottom - player.height;
        player.vy = 0;
        movedRect = getRect(player.x, nextY, player.width, player.height);
      }
    }

    if (nextY < 0) {
      nextY = 0;
      player.vy = 0;
      player.grounded = true;
    }

    if (nextY + player.height > world.height) {
      nextY = world.height - player.height;
      player.vy = 0;
    }

    player.y = nextY;
  }

  function renderPlayer() {
    renderEntity(playerElement, player);
    playerElement.classList.toggle('is-running', player.grounded && Math.abs(player.vx) > 0);
    playerElement.classList.toggle('is-airborne', !player.grounded);
    playerElement.classList.toggle('is-facing-left', player.facing === 'left');
  }

  function updateHud() {
    const label = getMovementLabel();

    statusBadge.textContent = label;
    positionLabel.textContent = `x ${Math.round(player.x)} / y ${Math.round(player.y)}`;
    velocityLabel.textContent = `vx ${Math.round(player.vx)} / vy ${Math.round(player.vy)}`;
    stateLabel.textContent = label;
  }

  function getMovementLabel() {
    if (!player.grounded) {
      return player.vy > 0 ? '점프 중' : '낙하 중';
    }

    if (Math.abs(player.vx) > 0) {
      return '이동 중';
    }

    return '대기';
  }

  function handleKeyDown(event) {
    if (isControlKey(event.code)) {
      event.preventDefault();
    }

    if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
      input.left = true;
    }

    if (event.code === 'ArrowRight' || event.code === 'KeyD') {
      input.right = true;
    }

    if (!event.repeat && isJumpKey(event.code)) {
      input.jumpQueued = true;
    }
  }

  function handleKeyUp(event) {
    if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
      input.left = false;
    }

    if (event.code === 'ArrowRight' || event.code === 'KeyD') {
      input.right = false;
    }
  }

  function clearInput() {
    input.left = false;
    input.right = false;
    input.jumpQueued = false;
  }
}

function createPlatform(element) {
  const x = Number(element.dataset.x);
  const y = Number(element.dataset.y);
  const width = Number(element.dataset.width);
  const height = Number(element.dataset.height);

  return {
    x,
    y,
    width,
    height,
    left: x,
    right: x + width,
    bottom: y,
    top: y + height,
  };
}

function renderEntity(element, entity) {
  element.style.left = `${toPercent(entity.x, world.width)}%`;
  element.style.bottom = `${toPercent(entity.y, world.height)}%`;
  element.style.width = `${toPercent(entity.width, world.width)}%`;
  element.style.height = `${toPercent(entity.height, world.height)}%`;
}

function getRect(x, y, width, height) {
  return {
    left: x,
    right: x + width,
    bottom: y,
    top: y + height,
  };
}

function overlapsHorizontally(rect, platform) {
  return rect.left < platform.right && rect.right > platform.left;
}

function overlapsVertically(rect, platform) {
  return rect.bottom < platform.top && rect.top > platform.bottom;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function toPercent(value, total) {
  return (value / total) * 100;
}

function isJumpKey(code) {
  return code === 'Space' || code === 'KeyW' || code === 'ArrowUp';
}

function isControlKey(code) {
  return (
    code === 'ArrowLeft' ||
    code === 'ArrowRight' ||
    code === 'ArrowUp' ||
    code === 'KeyA' ||
    code === 'KeyD' ||
    code === 'KeyW' ||
    code === 'Space'
  );
}
