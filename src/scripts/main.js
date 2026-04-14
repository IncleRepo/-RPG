const stage = document.getElementById('game-stage');
const player = document.getElementById('player');
const statusBadge = document.getElementById('status-badge');
const horizontalState = document.getElementById('horizontal-state');
const verticalState = document.getElementById('vertical-state');
const groundState = document.getElementById('ground-state');
const positionState = document.getElementById('position-state');

if (
  stage instanceof HTMLDivElement &&
  player instanceof HTMLDivElement &&
  statusBadge &&
  horizontalState &&
  verticalState &&
  groundState &&
  positionState
) {
  const physics = {
    groundHeightRatio: 0.14,
    moveSpeed: 320,
    jumpVelocity: 760,
    gravity: 2000,
    maxFallSpeed: 1200,
  };

  const playerState = {
    x: 72,
    y: 0,
    width: 48,
    height: 64,
    velocityX: 0,
    velocityY: 0,
    facing: 'right',
    grounded: true,
    groundLabel: '바닥',
  };

  const keys = {
    left: false,
    right: false,
  };

  const jumpKeys = new Set(['ArrowUp', 'KeyW', 'Space']);
  const controlKeys = new Set([...jumpKeys, 'ArrowLeft', 'ArrowRight', 'KeyA', 'KeyD']);

  const world = {
    width: 0,
    height: 0,
  };

  let jumpRequested = false;
  let previousFrameTime = 0;

  const measureWorld = () => {
    world.width = stage.clientWidth;
    world.height = stage.clientHeight;

    const maxX = Math.max(world.width - playerState.width, 0);
    const groundTop = getGroundTop();

    playerState.x = clamp(playerState.x, 0, maxX);
    playerState.y = Math.min(playerState.y, groundTop - playerState.height);
  };

  const getGroundTop = () => world.height * (1 - physics.groundHeightRatio);

  const getPlatformRects = () => {
    return Array.from(stage.querySelectorAll('[data-platform]')).map((platform) => ({
      left: platform.offsetLeft,
      top: platform.offsetTop,
      right: platform.offsetLeft + platform.offsetWidth,
      label: platform.dataset.platformLabel ?? '발판',
    }));
  };

  const updateHud = () => {
    const horizontalLabel =
      playerState.velocityX === 0
        ? '정지'
        : playerState.velocityX > 0
          ? '오른쪽 이동'
          : '왼쪽 이동';
    const verticalLabel = playerState.grounded
      ? '대기'
      : playerState.velocityY < 0
        ? '점프 중'
        : '낙하 중';

    horizontalState.textContent = horizontalLabel;
    verticalState.textContent = verticalLabel;
    groundState.textContent = playerState.groundLabel;
    positionState.textContent = `(${Math.round(playerState.x)}, ${Math.round(playerState.y)})`;

    statusBadge.textContent = playerState.grounded
      ? horizontalLabel === '정지'
        ? '대기 중'
        : '이동 중'
      : verticalLabel;
  };

  const renderPlayer = (isRunning) => {
    player.dataset.facing = playerState.facing;
    player.style.setProperty('--player-x', `${playerState.x}px`);
    player.style.setProperty('--player-y', `${playerState.y}px`);
    player.classList.toggle('is-running', isRunning);
    player.classList.toggle('is-airborne', !playerState.grounded);
  };

  const tryJump = () => {
    if (!jumpRequested || !playerState.grounded) {
      jumpRequested = false;
      return;
    }

    playerState.velocityY = -physics.jumpVelocity;
    playerState.grounded = false;
    playerState.groundLabel = '공중';
    jumpRequested = false;
  };

  const update = (deltaTime) => {
    measureWorld();
    tryJump();

    const moveDirection = Number(keys.right) - Number(keys.left);
    playerState.velocityX = moveDirection * physics.moveSpeed;

    if (moveDirection !== 0) {
      playerState.facing = moveDirection > 0 ? 'right' : 'left';
    }

    if (!playerState.grounded) {
      playerState.velocityY = Math.min(
        playerState.velocityY + physics.gravity * deltaTime,
        physics.maxFallSpeed
      );
    }

    const previousBottom = playerState.y + playerState.height;
    const nextX = clamp(
      playerState.x + playerState.velocityX * deltaTime,
      0,
      Math.max(world.width - playerState.width, 0)
    );
    let nextY = playerState.y + playerState.velocityY * deltaTime;
    let floorTop = getGroundTop();
    let groundLabel = '바닥';

    if (playerState.velocityY >= 0) {
      for (const platform of getPlatformRects()) {
        const nextBottom = nextY + playerState.height;
        const isCrossingPlatform = previousBottom <= platform.top && nextBottom >= platform.top;
        const overlapsHorizontally =
          nextX + playerState.width > platform.left + 8 && nextX < platform.right - 8;

        if (isCrossingPlatform && overlapsHorizontally && platform.top < floorTop) {
          floorTop = platform.top;
          groundLabel = platform.label;
        }
      }
    }

    if (nextY >= floorTop - playerState.height) {
      nextY = floorTop - playerState.height;
      playerState.velocityY = 0;
      playerState.grounded = true;
      playerState.groundLabel = groundLabel;
    } else {
      playerState.grounded = false;
      playerState.groundLabel = '공중';
    }

    playerState.x = nextX;
    playerState.y = nextY;

    renderPlayer(moveDirection !== 0 && playerState.grounded);
    updateHud();
  };

  const onKeyDown = (event) => {
    if (controlKeys.has(event.code)) {
      event.preventDefault();
    }

    if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
      keys.left = true;
    }

    if (event.code === 'ArrowRight' || event.code === 'KeyD') {
      keys.right = true;
    }

    if (!event.repeat && jumpKeys.has(event.code)) {
      jumpRequested = true;
    }
  };

  const onKeyUp = (event) => {
    if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
      keys.left = false;
    }

    if (event.code === 'ArrowRight' || event.code === 'KeyD') {
      keys.right = false;
    }
  };

  const loop = (timeStamp) => {
    if (previousFrameTime === 0) {
      previousFrameTime = timeStamp;
    }

    const deltaTime = Math.min((timeStamp - previousFrameTime) / 1000, 0.033);
    previousFrameTime = timeStamp;

    update(deltaTime);
    requestAnimationFrame(loop);
  };

  measureWorld();
  playerState.y = getGroundTop() - playerState.height;
  renderPlayer(false);
  updateHud();

  window.addEventListener('resize', measureWorld);
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);

  requestAnimationFrame(loop);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
