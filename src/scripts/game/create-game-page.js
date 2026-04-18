import { BGMManager } from '../bgm-manager.js';
import {
  DEFAULT_PLAYER_APPEARANCE_CONFIG,
  HAIR_COLOR_OPTIONS,
  HAIR_STYLE_OPTIONS,
  resolvePlayerAppearance,
} from '../canvas-animation.js';
import { CHIZURU_NPC, getChizuruDialogue } from '../chizuru-npc.js';
import {
  createFieldCritters,
  resizeFieldCritters,
  updateFieldCritters,
} from '../field-critters.js';
import { createPlayableCharacter } from '../player-character.js';
import { measureStageLayout } from '../stage-layout.js';
import { populateAppearanceSelect, clamp } from './helpers.js';
import {
  applyJumpImpulse,
  DEFAULT_PLATFORMER_PHYSICS,
  stepPlatformerPhysics,
  syncActorToSupport,
} from './physics/platformer-physics.js';
import { getGamePageElements } from './runtime-dom.js';
import {
  CHARACTER_COLLIDER,
  createChizuruSprites,
  createWorldState,
  getTimeLabel,
  NPC_COLLIDER,
  positionChizuru,
  renderScene,
  syncBackgroundScene,
  updateBackground,
} from './runtime-scene.js';

const chizuruIdleSpriteUrl = new URL('../../assets/chizuru-idle.png', import.meta.url).href;
const chizuruTalkingSpriteUrl = new URL('../../assets/chizuru-talking.png', import.meta.url).href;

export function initializeGamePage() {
  const dom = getGamePageElements();
  const touchInputQueries = [
    window.matchMedia('(pointer: coarse)'),
    window.matchMedia('(hover: none)'),
  ];
  const playableCharacter = createPlayableCharacter();
  const worldState = createWorldState();
  const playerStateData = createPlayerState();
  const chizuruState = createChizuruState();
  const chizuruSprites = createChizuruSprites({
    idle: chizuruIdleSpriteUrl,
    talking: chizuruTalkingSpriteUrl,
  });
  const keys = {
    left: false,
    right: false,
  };

  let stageMetrics = measureStage(dom.stageCanvas);
  let lastFrame = performance.now();
  let hasSpawned = false;
  let touchUiEnabled = false;
  let bgmAutostartArmed = false;
  let bgmManager = null;
  let bgmLastAudibleVolume = getDefaultBgmVolume(dom.bgmVolume);

  function getPlayerAppearanceState() {
    const savedAppearance = playableCharacter.attributes.appearance;

    return {
      ...DEFAULT_PLAYER_APPEARANCE_CONFIG,
      ...(savedAppearance && typeof savedAppearance === 'object' ? savedAppearance : {}),
    };
  }

  function getResolvedPlayerAppearance() {
    return resolvePlayerAppearance(getPlayerAppearanceState());
  }

  function render(direction = 0) {
    const motionState = getMotionState(playerStateData, direction);
    const lighting = renderScene({
      canvas: dom.stageCanvas,
      context: dom.stageContext,
      stageMetrics,
      worldState,
      playerState: playerStateData,
      chizuruState,
      chizuruSprites,
      motionState,
      playerAppearance: getResolvedPlayerAppearance(),
      touchUiEnabled,
    });

    renderCharacterPanel(dom, playableCharacter, getResolvedPlayerAppearance());
    renderChizuruPanel(dom, chizuruState, touchUiEnabled);
    dom.worldTimeReadout.textContent = getTimeLabel(lighting.cycleProgress);
    dom.playerState.textContent = getMotionLabel(motionState);
    dom.playerCoords.textContent = `x: ${Math.round(playerStateData.x)} / y: ${Math.round(playerStateData.y)}`;
    dom.statusBadge.textContent = getStatusBadgeLabel(motionState, chizuruState);
  }

  function refreshMeasurements() {
    const previousStageMetrics = stageMetrics;
    stageMetrics = measureStage(dom.stageCanvas);
    positionChizuru(chizuruState, stageMetrics);
    syncBackgroundScene(worldState, stageMetrics);
    resizeFieldCritters(worldState.fieldCritters, stageMetrics, previousStageMetrics);
    playerStateData.x = clamp(
      playerStateData.x,
      0,
      Math.max(0, stageMetrics.width - playerStateData.width)
    );

    if (!hasSpawned) {
      spawnPlayerAboveStage();
      hasSpawned = true;
      render(0);
      return;
    }

    syncActorToSupport(playerStateData, stageMetrics);
    render(0);
  }

  function spawnPlayerAboveStage() {
    playerStateData.y = stageMetrics.height + playerStateData.height;
    playerStateData.velocityY = 0;
    playerStateData.grounded = false;
    playerStateData.supportIndex = null;
  }

  function triggerJump() {
    if (!applyJumpImpulse(playerStateData, DEFAULT_PLATFORMER_PHYSICS)) {
      return false;
    }

    dom.statusBadge.textContent = '점프';
    return true;
  }

  function triggerInteraction() {
    if (!chizuruState.nearby) {
      return false;
    }

    advanceChizuruDialogue(chizuruState);
    render(Number(keys.right) - Number(keys.left));
    return true;
  }

  function setMovementKey(direction, pressed) {
    keys[direction] = pressed;

    if (pressed) {
      playerStateData.facing = direction === 'left' ? 'left' : 'right';
    }
  }

  function clearMovementInputs() {
    keys.left = false;
    keys.right = false;

    dom.touchControlButtons.forEach((button) => {
      if (button.dataset.touchControl === 'left' || button.dataset.touchControl === 'right') {
        button.classList.remove('is-active');
      }
    });
  }

  function onKeyDown(event) {
    if (isMovementKey(event.code)) {
      event.preventDefault();
    }

    if (event.code === 'KeyE' && chizuruState.nearby) {
      event.preventDefault();
      triggerInteraction();
      return;
    }

    if (event.repeat) {
      return;
    }

    if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
      setMovementKey('left', true);
    }

    if (event.code === 'ArrowRight' || event.code === 'KeyD') {
      setMovementKey('right', true);
    }

    if (event.code === 'ArrowUp' || event.code === 'KeyW' || event.code === 'Space') {
      triggerJump();
    }
  }

  function onKeyUp(event) {
    if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
      setMovementKey('left', false);
    }

    if (event.code === 'ArrowRight' || event.code === 'KeyD') {
      setMovementKey('right', false);
    }
  }

  function update(deltaSeconds) {
    updateBackground(worldState, deltaSeconds, stageMetrics);
    updateFieldCritters(worldState.fieldCritters, deltaSeconds, stageMetrics);

    const direction = Number(keys.right) - Number(keys.left);
    stepPlatformerPhysics(playerStateData, {
      deltaSeconds,
      horizontalInput: direction,
      physics: DEFAULT_PLATFORMER_PHYSICS,
      stageMetrics,
    });

    if (direction < 0) {
      playerStateData.facing = 'left';
    } else if (direction > 0) {
      playerStateData.facing = 'right';
    }

    updateChizuruInteraction(chizuruState, playerStateData);
    syncBgmMood();
    render(direction);
  }

  function syncTouchUiMode() {
    const previousTouchUiEnabled = touchUiEnabled;
    touchUiEnabled =
      navigator.maxTouchPoints > 0 || touchInputQueries.some((query) => query.matches);
    document.body.classList.toggle('touch-ui-enabled', touchUiEnabled);

    if (previousTouchUiEnabled && !touchUiEnabled) {
      clearMovementInputs();
    }
  }

  function pulseTouchButton(button) {
    button.classList.add('is-active');
    window.setTimeout(() => {
      button.classList.remove('is-active');
    }, 140);
  }

  function bindTouchControls() {
    dom.touchControlButtons.forEach((button) => {
      const action = button.dataset.touchControl;

      if (action === 'left' || action === 'right') {
        const releaseButton = () => {
          button.classList.remove('is-active');
          setMovementKey(action, false);
        };

        button.addEventListener('pointerdown', (event) => {
          if (event.pointerType === 'mouse' && event.button !== 0) {
            return;
          }

          event.preventDefault();
          button.classList.add('is-active');
          setMovementKey(action, true);

          if (button.setPointerCapture) {
            button.setPointerCapture(event.pointerId);
          }
        });
        button.addEventListener('pointerup', (event) => {
          event.preventDefault();

          if (button.hasPointerCapture?.(event.pointerId)) {
            button.releasePointerCapture(event.pointerId);
          }

          releaseButton();
        });
        button.addEventListener('pointercancel', releaseButton);
        button.addEventListener('lostpointercapture', releaseButton);
        button.addEventListener('contextmenu', (event) => {
          event.preventDefault();
        });
        return;
      }

      button.addEventListener('click', (event) => {
        event.preventDefault();
        pulseTouchButton(button);

        if (action === 'jump') {
          triggerJump();
          return;
        }

        triggerInteraction();
      });
    });
  }

  function clampBgmVolume(nextVolume) {
    return Math.max(0, Math.min(nextVolume, 1));
  }

  function syncBgmUi(snapshot = bgmManager?.getSnapshot()) {
    if (!snapshot) {
      return;
    }

    const volumePercent = Math.round(snapshot.volume * 100);
    const isMuted = volumePercent === 0;

    dom.bgmStatus.textContent = getBgmStatusLabel(snapshot.status);
    dom.bgmMood.textContent = `${snapshot.moodLabel} · ${getModeLabel(snapshot.mode)}`;
    dom.bgmProgression.textContent = snapshot.progressionLabel;
    dom.bgmVolume.value = `${volumePercent}`;
    dom.bgmVolumeOutput.textContent = `${volumePercent}%`;
    dom.bgmMute.disabled = !snapshot.supported;
    dom.bgmMute.classList.toggle('is-muted', isMuted);
    dom.bgmMute.setAttribute('aria-label', isMuted ? 'BGM 음소거 해제' : 'BGM 음소거');
    dom.bgmMute.setAttribute('aria-pressed', `${isMuted}`);
    dom.bgmToggle.disabled = !snapshot.supported || snapshot.isPlaying;

    if (!snapshot.supported) {
      dom.bgmToggle.textContent = '지원되지 않음';
      return;
    }

    if (snapshot.isPlaying) {
      dom.bgmToggle.textContent = '재생 중';
      return;
    }

    dom.bgmToggle.textContent = snapshot.hasStarted ? '다시 시작' : 'BGM 시작';
  }

  function setBgmVolume(nextVolume) {
    const clampedVolume = clampBgmVolume(nextVolume);

    if (clampedVolume > 0) {
      bgmLastAudibleVolume = clampedVolume;
    }

    dom.bgmVolume.value = `${Math.round(clampedVolume * 100)}`;
    bgmManager.setVolume(clampedVolume);
  }

  function disarmBgmAutostart() {
    if (!bgmAutostartArmed) {
      return;
    }

    bgmAutostartArmed = false;
    window.removeEventListener('keydown', handleBgmAutostart, true);
    window.removeEventListener('pointerdown', handleBgmAutostart, true);
    window.removeEventListener('touchstart', handleBgmAutostart, true);
  }

  function handleBgmAutostart(event) {
    if (event.target instanceof Element && event.target.closest('[data-bgm-control]')) {
      return;
    }

    disarmBgmAutostart();
    void bgmManager.resumeFromGesture().then(
      () => syncBgmUi(),
      () => syncBgmUi()
    );
  }

  function armBgmAutostart() {
    if (bgmAutostartArmed || !bgmManager.getSnapshot().supported) {
      return;
    }

    bgmAutostartArmed = true;
    window.addEventListener('keydown', handleBgmAutostart, { capture: true });
    window.addEventListener('pointerdown', handleBgmAutostart, {
      capture: true,
      passive: true,
    });
    window.addEventListener('touchstart', handleBgmAutostart, {
      capture: true,
      passive: true,
    });
  }

  function bindBgmControls() {
    dom.bgmVolume.addEventListener('input', () => {
      setBgmVolume(Number(dom.bgmVolume.value) / 100);
    });

    dom.bgmMute.addEventListener('click', () => {
      const { volume } = bgmManager.getSnapshot();

      if (volume === 0) {
        setBgmVolume(bgmLastAudibleVolume);
        return;
      }

      setBgmVolume(0);
    });

    dom.bgmToggle.addEventListener('click', () => {
      if (bgmManager.getSnapshot().isPlaying) {
        return;
      }

      void bgmManager.resumeFromGesture().then(
        () => syncBgmUi(),
        () => syncBgmUi()
      );
    });
  }

  function bindAppearanceControls() {
    populateAppearanceSelect(dom.playerHairStyle, HAIR_STYLE_OPTIONS);
    populateAppearanceSelect(dom.playerHairColor, HAIR_COLOR_OPTIONS);

    const appearanceState = getPlayerAppearanceState();
    dom.playerHairStyle.value = appearanceState.hairStyle;
    dom.playerHairColor.value = appearanceState.hairColor;

    dom.playerHairStyle.addEventListener('change', () => {
      playableCharacter.setAttribute('appearance', {
        ...getPlayerAppearanceState(),
        hairStyle: dom.playerHairStyle.value,
      });
      render(Number(keys.right) - Number(keys.left));
    });

    dom.playerHairColor.addEventListener('change', () => {
      playableCharacter.setAttribute('appearance', {
        ...getPlayerAppearanceState(),
        hairColor: dom.playerHairColor.value,
      });
      render(Number(keys.right) - Number(keys.left));
    });
  }

  function syncBgmMood() {
    bgmManager.setMood(getDesiredBgmMood(worldState, chizuruState));
  }

  function gameLoop(now) {
    const deltaSeconds = Math.min((now - lastFrame) / 1000, 1 / 30);
    lastFrame = now;
    update(deltaSeconds);
    requestAnimationFrame(gameLoop);
  }

  bgmManager = new BGMManager({
    initialVolume: Number(dom.bgmVolume.value) / 100,
    onStateChange: (snapshot) => syncBgmUi(snapshot),
  });
  worldState.fieldCritters = createFieldCritters(stageMetrics);
  bindTouchControls();
  bindBgmControls();
  bindAppearanceControls();
  syncTouchUiMode();
  syncBgmMood();
  syncBgmUi();
  armBgmAutostart();

  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('resize', refreshMeasurements);
  window.addEventListener('blur', clearMovementInputs);
  touchInputQueries.forEach((query) => {
    query.addEventListener('change', syncTouchUiMode);
  });
  window.addEventListener('pagehide', () => {
    disarmBgmAutostart();
    bgmManager.destroy();
  });

  refreshMeasurements();
  dom.worldTimeReadout.textContent = getTimeLabel(
    worldState.elapsedSeconds / worldState.cycleDuration
  );
  requestAnimationFrame(gameLoop);
}

function measureStage(stageCanvas) {
  const cssWidth = Math.max(320, Math.round(stageCanvas.clientWidth));
  const cssHeight = Math.max(240, Math.round(stageCanvas.clientHeight));
  const dpr = window.devicePixelRatio || 1;

  stageCanvas.width = Math.round(cssWidth * dpr);
  stageCanvas.height = Math.round(cssHeight * dpr);

  return {
    ...measureStageLayout(cssWidth, cssHeight),
    dpr,
  };
}

function createPlayerState() {
  return {
    x: 96,
    y: 0,
    velocityY: 0,
    width: CHARACTER_COLLIDER.width,
    height: CHARACTER_COLLIDER.height,
    grounded: false,
    facing: 'right',
    supportIndex: null,
  };
}

function createChizuruState() {
  return {
    x: 0,
    y: 0,
    width: NPC_COLLIDER.width,
    height: NPC_COLLIDER.height,
    nearby: false,
    talking: false,
    dialogueIndex: 0,
    hasMet: false,
    facing: 'left',
  };
}

function renderCharacterPanel(dom, playableCharacter, appearance) {
  dom.characterLevel.textContent = String(playableCharacter.level);
  dom.characterHealth.textContent = formatResource(playableCharacter.health);
  dom.characterMana.textContent = formatResource(playableCharacter.mana);
  dom.characterGold.textContent = `${playableCharacter.gold} G`;
  dom.characterInventory.textContent = `${playableCharacter.getCollectionSize('inventory')} slots`;
  dom.characterEquipment.textContent = `${playableCharacter.getCollectionSize('equipment')} equipped`;
  dom.characterAppearance.textContent = `${appearance.hairStyleLabel} · ${appearance.hairColorLabel}`;
}

function renderChizuruPanel(dom, chizuruState, touchUiEnabled) {
  dom.chizuruStatus.textContent = getChizuruStatusLabel(chizuruState);
  dom.chizuruScene.textContent = getChizuruSceneLabel(chizuruState, touchUiEnabled);
}

function updateChizuruInteraction(chizuruState, playerStateData) {
  const playerCenterX = playerStateData.x + playerStateData.width / 2;
  const npcCenterX = chizuruState.x + chizuruState.width / 2;
  const distanceX = Math.abs(playerCenterX - npcCenterX);
  const distanceY = Math.abs(playerStateData.y - chizuruState.y);

  chizuruState.nearby =
    distanceX <= CHIZURU_NPC.interactionRadiusX && distanceY <= CHIZURU_NPC.interactionRadiusY;

  if (!chizuruState.nearby) {
    chizuruState.talking = false;
  }
}

function getMotionState(playerStateData, direction) {
  if (!playerStateData.grounded) {
    return playerStateData.velocityY >= 0 ? 'jump' : 'fall';
  }

  if (direction !== 0) {
    return 'run';
  }

  return 'idle';
}

function getMotionLabel(motionState) {
  switch (motionState) {
    case 'run':
      return '질주 중';
    case 'jump':
      return '상승 중';
    case 'fall':
      return '낙하 중';
    default:
      return '대기';
  }
}

function getStatusBadgeLabel(motionState, chizuruState) {
  if (chizuruState.talking) {
    return '치즈루와 대화 중';
  }

  if (chizuruState.nearby) {
    return '치즈루와 상호작용 가능';
  }

  switch (motionState) {
    case 'run':
      return '전진 중';
    case 'jump':
      return '공중 상승';
    case 'fall':
      return '착지 중';
    default:
      return '이동 가능';
  }
}

function advanceChizuruDialogue(chizuruState) {
  if (!chizuruState.talking) {
    chizuruState.talking = true;
    chizuruState.hasMet = true;
    return;
  }

  chizuruState.dialogueIndex = (chizuruState.dialogueIndex + 1) % CHIZURU_NPC.dialogues.length;
}

function getChizuruStatusLabel(chizuruState) {
  if (chizuruState.talking) {
    return '대화 중';
  }

  if (chizuruState.nearby) {
    return '바로 앞에서 기다리는 중';
  }

  if (chizuruState.hasMet) {
    return '잠깐 떨어져서 대기 중';
  }

  return CHIZURU_NPC.encounterHint;
}

function getChizuruSceneLabel(chizuruState, touchUiEnabled) {
  const interactionLabel = touchUiEnabled ? '대화 버튼' : 'E 키';

  if (chizuruState.talking) {
    return getChizuruDialogue(chizuruState.dialogueIndex);
  }

  if (chizuruState.nearby) {
    return `${interactionLabel}를 누르면 다음 대사까지 이어서 볼 수 있습니다.`;
  }

  if (chizuruState.hasMet) {
    return `다시 가까이 가서 ${interactionLabel}를 누르면 대화를 이어갈 수 있습니다.`;
  }

  return `가까이 가서 ${interactionLabel}를 누르면 말을 걸 수 있습니다.`;
}

function getDesiredBgmMood(worldState, chizuruState) {
  const cycleProgress = worldState.elapsedSeconds / worldState.cycleDuration;

  if (chizuruState.talking) {
    return 'encounter';
  }

  if (cycleProgress < 0.22 || cycleProgress >= 0.84) {
    return 'night';
  }

  if (cycleProgress < 0.34 || cycleProgress >= 0.68) {
    return 'twilight';
  }

  return 'town';
}

function getBgmStatusLabel(status) {
  switch (status) {
    case 'playing':
      return '재생 중';
    case 'stopped':
      return '정지됨';
    case 'unsupported':
      return '브라우저 미지원';
    default:
      return '대기 중';
  }
}

function getModeLabel(mode) {
  switch (mode) {
    case 'ionian':
      return 'Ionian';
    case 'dorian':
      return 'Dorian';
    case 'aeolian':
      return 'Aeolian';
    case 'lydian':
      return 'Lydian';
    case 'mixolydian':
      return 'Mixolydian';
    default:
      return mode;
  }
}

function formatResource(resource) {
  return `${resource.current} / ${resource.max}`;
}

function getDefaultBgmVolume(volumeInput) {
  const numericValue = Number(volumeInput.value) / 100;
  return numericValue > 0 ? numericValue : 0.52;
}

function isMovementKey(code) {
  return ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'KeyA', 'KeyD', 'KeyW', 'Space'].includes(code);
}
