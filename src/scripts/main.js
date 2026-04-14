const stage = document.getElementById('game-stage');
const playerElement = document.getElementById('player');
const statusBadge = document.getElementById('status-badge');
const positionReadout = document.getElementById('position-readout');
const motionReadout = document.getElementById('motion-readout');
const hintCopy = document.getElementById('hint-copy');

if (
  stage instanceof HTMLElement &&
  playerElement instanceof HTMLElement &&
  statusBadge instanceof HTMLElement &&
  positionReadout instanceof HTMLElement &&
  motionReadout instanceof HTMLElement &&
  hintCopy instanceof HTMLElement
) {
  initMovementPrototype({
    stage,
    playerElement,
    statusBadge,
    positionReadout,
    motionReadout,
    hintCopy,
  });
}

function initMovementPrototype(elements) {
  const {
    stage: stageElement,
    playerElement,
    statusBadge,
    positionReadout,
    motionReadout,
    hintCopy,
  } = elements;

  const platformElements = Array.from(stageElement.querySelectorAll('.platform'));
  const moveKeys = new Set(['ArrowLeft', 'ArrowRight', 'KeyA', 'KeyD']);
  const jumpKeys = new Set(['ArrowUp', 'KeyW', 'Space']);
  const controlKeys = new Set([...moveKeys, ...jumpKeys]);
  const physics = {
    gravity: 1800,
    moveSpeed: 320,
    jumpVelocity: 760,
  };
  const controls = {
    left: false,
    right: false,
  };
  const state = {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    width: playerElement.offsetWidth || 56,
    height: playerElement.offsetHeight || 72,
    facing: 1,
    onGround: false,
  };

  let stageMetrics = measureStage();
  let lastTimestamp = 0;

  resetPlayerToStart();
  updateHud();

  window.addEventListener('keydown', handleKeydown);
  window.addEventListener('keyup', handleKeyup);
  window.addEventListener('blur', releaseControls);
  window.addEventListener('resize', handleResize);
  requestAnimationFrame(frame);

  function measureStage() {
    return {
      width: stageElement.clientWidth,
      height: stageElement.clientHeight,
      platforms: platformElements
        .filter((platform) => platform instanceof HTMLElement)
        .map((platform) => {
          const left = platform.offsetLeft;
          const top = platform.offsetTop;
          const width = platform.offsetWidth;
          const height = platform.offsetHeight;

          return {
            label: platform.dataset.platformLabel || '발판',
            left,
            top,
            width,
            height,
            right: left + width,
          };
        })
        .sort((firstPlatform, secondPlatform) => firstPlatform.top - secondPlatform.top),
    };
  }

  function resetPlayerToStart() {
    const groundPlatform = getLowestPlatform();

    state.x = stageMetrics.width * 0.08;
    state.y = groundPlatform.top - state.height;
    state.vx = 0;
    state.vy = 0;
    state.onGround = true;
    renderPlayer();
  }

  function getLowestPlatform() {
    return stageMetrics.platforms.reduce((lowestPlatform, currentPlatform) => {
      if (!lowestPlatform || currentPlatform.top > lowestPlatform.top) {
        return currentPlatform;
      }

      return lowestPlatform;
    }, null);
  }

  function handleKeydown(event) {
    if (!controlKeys.has(event.code)) {
      return;
    }

    event.preventDefault();

    if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
      controls.left = true;
    }

    if (event.code === 'ArrowRight' || event.code === 'KeyD') {
      controls.right = true;
    }

    if (jumpKeys.has(event.code) && !event.repeat) {
      tryJump();
    }
  }

  function handleKeyup(event) {
    if (!controlKeys.has(event.code)) {
      return;
    }

    event.preventDefault();

    if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
      controls.left = false;
    }

    if (event.code === 'ArrowRight' || event.code === 'KeyD') {
      controls.right = false;
    }
  }

  function releaseControls() {
    controls.left = false;
    controls.right = false;
  }

  function tryJump() {
    if (!state.onGround) {
      hintCopy.textContent = '공중에서는 다시 점프할 수 없습니다. 먼저 착지하세요.';
      return;
    }

    state.vy = -physics.jumpVelocity;
    state.onGround = false;
    hintCopy.textContent = '점프 중입니다. 다음 발판 위치를 맞춰 보세요.';
    updateHud();
  }

  function handleResize() {
    const previousMetrics = stageMetrics;

    stageMetrics = measureStage();

    if (!previousMetrics.width || !previousMetrics.height) {
      resetPlayerToStart();
      updateHud();
      return;
    }

    state.x = clamp(
      (state.x / previousMetrics.width) * stageMetrics.width,
      0,
      stageMetrics.width - state.width
    );
    state.y = clamp(
      (state.y / previousMetrics.height) * stageMetrics.height,
      0,
      stageMetrics.height - state.height
    );

    renderPlayer();
    updateHud();
  }

  function frame(timestamp) {
    if (!lastTimestamp) {
      lastTimestamp = timestamp;
    }

    const deltaSeconds = Math.min((timestamp - lastTimestamp) / 1000, 0.032);
    lastTimestamp = timestamp;

    update(deltaSeconds);
    renderPlayer();
    updateHud();

    requestAnimationFrame(frame);
  }

  function update(deltaSeconds) {
    const direction = Number(controls.right) - Number(controls.left);

    state.vx = direction * physics.moveSpeed;

    if (direction !== 0) {
      state.facing = direction;
    }

    state.x = clamp(state.x + state.vx * deltaSeconds, 0, stageMetrics.width - state.width);

    const previousBottom = state.y + state.height;
    const previousTop = state.y;

    state.vy += physics.gravity * deltaSeconds;
    state.y += state.vy * deltaSeconds;

    if (state.y < 0) {
      state.y = 0;
      state.vy = 0;
    }

    state.onGround = false;

    const landingPlatform = findLandingPlatform(previousBottom, state.y + state.height);

    if (landingPlatform) {
      state.y = landingPlatform.top - state.height;
      state.vy = 0;
      state.onGround = true;
    } else {
      resolveCeilingCollision(previousTop);
    }
  }

  function findLandingPlatform(previousBottom, currentBottom) {
    return stageMetrics.platforms.find((platform) => {
      if (!hasHorizontalOverlap(platform, 8)) {
        return false;
      }

      return previousBottom <= platform.top + 6 && currentBottom >= platform.top;
    });
  }

  function resolveCeilingCollision(previousTop) {
    if (state.vy >= 0) {
      return;
    }

    const collidedPlatform = stageMetrics.platforms.find((platform) => {
      if (!hasHorizontalOverlap(platform, 10)) {
        return false;
      }

      const previousHead = previousTop;
      const currentHead = state.y;
      const platformBottom = platform.top + platform.height;

      return previousHead >= platformBottom && currentHead <= platformBottom;
    });

    if (collidedPlatform) {
      state.y = collidedPlatform.top + collidedPlatform.height;
      state.vy = 0;
    }
  }

  function hasHorizontalOverlap(platform, inset) {
    const playerLeft = state.x + inset;
    const playerRight = state.x + state.width - inset;

    return playerRight > platform.left && playerLeft < platform.right;
  }

  function getSupportingPlatform() {
    const playerBottom = state.y + state.height;

    return stageMetrics.platforms.find((platform) => {
      if (!hasHorizontalOverlap(platform, 8)) {
        return false;
      }

      return Math.abs(playerBottom - platform.top) <= 6;
    });
  }

  function renderPlayer() {
    playerElement.style.left = `${state.x}px`;
    playerElement.style.top = `${state.y}px`;
    playerElement.style.transform = `scaleX(${state.facing})`;

    if (!state.onGround) {
      playerElement.dataset.motion = 'jump';
      return;
    }

    playerElement.dataset.motion = Math.abs(state.vx) > 0 ? 'run' : 'idle';
  }

  function updateHud() {
    const supportPlatform = getSupportingPlatform();
    const movementLabel = !state.onGround ? '점프 중' : Math.abs(state.vx) > 0 ? '이동 중' : '대기';
    const verticalLabel =
      Math.abs(state.vy) < 10
        ? '안정'
        : state.vy < 0
          ? `상승 ${Math.round(Math.abs(state.vy))}`
          : `낙하 ${Math.round(state.vy)}`;

    statusBadge.textContent = movementLabel;
    positionReadout.textContent = `${Math.round(state.x)}, ${Math.round(state.y)}`;
    motionReadout.textContent = `${movementLabel} · ${verticalLabel}`;

    if (state.onGround && supportPlatform) {
      hintCopy.textContent = `${supportPlatform.label} 위에 있습니다. 점프로 다음 발판으로 이동할 수 있습니다.`;
    }
  }
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
