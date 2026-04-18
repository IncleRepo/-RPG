function assertInstance(value, expectedType, errorMessage) {
  if (!(value instanceof expectedType)) {
    throw new Error(errorMessage);
  }

  return value;
}

export function getGamePageElements(doc = document) {
  const stageCanvas = assertInstance(
    doc.getElementById('stage-canvas'),
    HTMLCanvasElement,
    '필수 게임 요소를 찾을 수 없습니다.'
  );
  const statusBadge = assertInstance(
    doc.getElementById('status-badge'),
    HTMLElement,
    '필수 게임 요소를 찾을 수 없습니다.'
  );
  const playerState = assertInstance(
    doc.getElementById('player-state'),
    HTMLElement,
    '필수 게임 요소를 찾을 수 없습니다.'
  );
  const playerCoords = assertInstance(
    doc.getElementById('player-coords'),
    HTMLElement,
    '필수 게임 요소를 찾을 수 없습니다.'
  );
  const worldTimeReadout = assertInstance(
    doc.getElementById('world-time'),
    HTMLElement,
    '필수 게임 요소를 찾을 수 없습니다.'
  );
  const characterLevel = assertInstance(
    doc.getElementById('character-level'),
    HTMLElement,
    '필수 게임 요소를 찾을 수 없습니다.'
  );
  const characterHealth = assertInstance(
    doc.getElementById('character-health'),
    HTMLElement,
    '필수 게임 요소를 찾을 수 없습니다.'
  );
  const characterMana = assertInstance(
    doc.getElementById('character-mana'),
    HTMLElement,
    '필수 게임 요소를 찾을 수 없습니다.'
  );
  const characterGold = assertInstance(
    doc.getElementById('character-gold'),
    HTMLElement,
    '필수 게임 요소를 찾을 수 없습니다.'
  );
  const characterInventory = assertInstance(
    doc.getElementById('character-inventory'),
    HTMLElement,
    '필수 게임 요소를 찾을 수 없습니다.'
  );
  const characterEquipment = assertInstance(
    doc.getElementById('character-equipment'),
    HTMLElement,
    '필수 게임 요소를 찾을 수 없습니다.'
  );
  const characterAppearance = assertInstance(
    doc.getElementById('character-appearance'),
    HTMLElement,
    '필수 게임 요소를 찾을 수 없습니다.'
  );
  const playerHairStyle = assertInstance(
    doc.getElementById('player-hair-style'),
    HTMLSelectElement,
    '필수 게임 요소를 찾을 수 없습니다.'
  );
  const playerHairColor = assertInstance(
    doc.getElementById('player-hair-color'),
    HTMLSelectElement,
    '필수 게임 요소를 찾을 수 없습니다.'
  );
  const chizuruStatus = assertInstance(
    doc.getElementById('chizuru-status'),
    HTMLElement,
    '필수 게임 요소를 찾을 수 없습니다.'
  );
  const chizuruScene = assertInstance(
    doc.getElementById('chizuru-scene'),
    HTMLElement,
    '필수 게임 요소를 찾을 수 없습니다.'
  );
  const bgmStatus = assertInstance(
    doc.getElementById('bgm-status'),
    HTMLElement,
    '필수 게임 요소를 찾을 수 없습니다.'
  );
  const bgmMood = assertInstance(
    doc.getElementById('bgm-mood'),
    HTMLElement,
    '필수 게임 요소를 찾을 수 없습니다.'
  );
  const bgmProgression = assertInstance(
    doc.getElementById('bgm-progression'),
    HTMLElement,
    '필수 게임 요소를 찾을 수 없습니다.'
  );
  const bgmVolume = assertInstance(
    doc.getElementById('bgm-volume'),
    HTMLInputElement,
    '필수 게임 요소를 찾을 수 없습니다.'
  );
  const bgmVolumeOutput = assertInstance(
    doc.getElementById('bgm-volume-output'),
    HTMLElement,
    '필수 게임 요소를 찾을 수 없습니다.'
  );
  const bgmMute = assertInstance(
    doc.getElementById('bgm-mute'),
    HTMLButtonElement,
    '필수 게임 요소를 찾을 수 없습니다.'
  );
  const bgmToggle = assertInstance(
    doc.getElementById('bgm-toggle'),
    HTMLButtonElement,
    '필수 게임 요소를 찾을 수 없습니다.'
  );
  const touchControlButtons = Array.from(doc.querySelectorAll('[data-touch-control]')).filter(
    (button) => button instanceof HTMLButtonElement
  );
  const stageContext = stageCanvas.getContext('2d');

  if (!stageContext) {
    throw new Error('캔버스 렌더러를 초기화할 수 없습니다.');
  }

  return {
    stageCanvas,
    stageContext,
    statusBadge,
    playerState,
    playerCoords,
    worldTimeReadout,
    characterLevel,
    characterHealth,
    characterMana,
    characterGold,
    characterInventory,
    characterEquipment,
    characterAppearance,
    playerHairStyle,
    playerHairColor,
    chizuruStatus,
    chizuruScene,
    bgmStatus,
    bgmMood,
    bgmProgression,
    bgmVolume,
    bgmVolumeOutput,
    bgmMute,
    bgmToggle,
    touchControlButtons,
  };
}

export function getPhysicsLabElements(doc = document) {
  const canvas = assertInstance(
    doc.getElementById('physics-lab-canvas'),
    HTMLCanvasElement,
    '물리 테스트 페이지를 초기화할 수 없습니다.'
  );
  const scenarioButtons = Array.from(doc.querySelectorAll('[data-physics-scenario]')).filter(
    (button) => button instanceof HTMLButtonElement
  );
  const resetButton = assertInstance(
    doc.getElementById('physics-lab-reset'),
    HTMLButtonElement,
    '물리 테스트 페이지를 초기화할 수 없습니다.'
  );
  const scenarioTitle = assertInstance(
    doc.getElementById('physics-lab-title'),
    HTMLElement,
    '물리 테스트 페이지를 초기화할 수 없습니다.'
  );
  const scenarioDescription = assertInstance(
    doc.getElementById('physics-lab-description'),
    HTMLElement,
    '물리 테스트 페이지를 초기화할 수 없습니다.'
  );
  const scenarioExpectation = assertInstance(
    doc.getElementById('physics-lab-expectation'),
    HTMLElement,
    '물리 테스트 페이지를 초기화할 수 없습니다.'
  );
  const stateReadout = assertInstance(
    doc.getElementById('physics-lab-state'),
    HTMLElement,
    '물리 테스트 페이지를 초기화할 수 없습니다.'
  );
  const collisionReadout = assertInstance(
    doc.getElementById('physics-lab-collision'),
    HTMLElement,
    '물리 테스트 페이지를 초기화할 수 없습니다.'
  );
  const activeKeys = assertInstance(
    doc.getElementById('physics-lab-inputs'),
    HTMLElement,
    '물리 테스트 페이지를 초기화할 수 없습니다.'
  );
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('물리 테스트 캔버스를 초기화할 수 없습니다.');
  }

  return {
    canvas,
    context,
    scenarioButtons,
    resetButton,
    scenarioTitle,
    scenarioDescription,
    scenarioExpectation,
    stateReadout,
    collisionReadout,
    activeKeys,
  };
}
