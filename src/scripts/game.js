import '../styles/game.css';
import { soundtrackTracks } from './audio-tracks.js';
import heroSheetUrl from '../../assets/prologue-vertical-slice/sheets/hero-sheet.svg';
import alliesSheetUrl from '../../assets/prologue-vertical-slice/sheets/allies-sheet.svg';
import citizensSheetUrl from '../../assets/prologue-vertical-slice/sheets/citizens-sheet.svg';
import enemiesSheetUrl from '../../assets/prologue-vertical-slice/sheets/enemies-sheet.svg';
import harborTilesUrl from '../../assets/prologue-vertical-slice/sheets/harbor-tiles.svg';
import towerTilesUrl from '../../assets/prologue-vertical-slice/sheets/tower-tiles.svg';

const app = document.querySelector('#app');

if (!app) {
  throw new Error('앱 루트 요소를 찾을 수 없습니다.');
}

const LOGICAL_WIDTH = 320;
const LOGICAL_HEIGHT = 180;
const TILE_SIZE = 16;
const PLAYER_HITBOX_WIDTH = 14;
const PLAYER_HITBOX_HEIGHT = 30;
const FIXED_DELTA = 1 / 60;
const MAX_DELTA = 1 / 20;
const PLAYER_SPEED = 84;
const PLAYER_JUMP = 206;
const PLAYER_GRAVITY = 620;
const PLAYER_DASH_SPEED = 220;
const PLAYER_DASH_DURATION = 0.16;
const PLAYER_ATTACK_DURATION = 0.24;
const PLAYER_ATTACK_COOLDOWN = 0.12;
const PLAYER_INVULN = 0.72;

const TRACKS = Object.freeze(
  soundtrackTracks.reduce((map, track) => {
    map[track.id] = track;
    return map;
  }, {})
);

const SHEET_CONFIG = Object.freeze({
  hero: { src: heroSheetUrl, frameWidth: 24, frameHeight: 40 },
  allies: { src: alliesSheetUrl, frameWidth: 24, frameHeight: 40 },
  citizens: { src: citizensSheetUrl, frameWidth: 24, frameHeight: 40 },
  enemies: { src: enemiesSheetUrl, frameWidth: 40, frameHeight: 40 },
  harbor: { src: harborTilesUrl, frameWidth: 16, frameHeight: 16 },
  tower: { src: towerTilesUrl, frameWidth: 16, frameHeight: 16 },
});

const SCENES = Object.freeze({
  breakwater: Object.freeze({
    id: 'breakwater',
    name: '미라진 동쪽 방파제',
    subtitle: '새벽이 끊긴 입구',
    theme: 'harbor',
    width: 64 * TILE_SIZE,
    music: 'mirajin-hub',
    startX: 40,
    cameraHint: 0.42,
    skyline: 0,
    solids: Object.freeze([
      { x: 0, y: 144, width: 64 * TILE_SIZE, height: 36 },
      { x: 256, y: 128, width: 48, height: 16 },
    ]),
    groundSegments: Object.freeze([{ x: 0, y: 144, width: 64 * TILE_SIZE, height: 36 }]),
    decorations: Object.freeze([
      { kind: 'tile', sheet: 'harbor', frame: 1, x: 96, y: 96, width: 32, height: 48 },
      { kind: 'tile', sheet: 'harbor', frame: 5, x: 156, y: 112, width: 16, height: 32 },
      { kind: 'tile', sheet: 'harbor', frame: 4, x: 256, y: 112, width: 32, height: 32 },
      { kind: 'tile', sheet: 'harbor', frame: 5, x: 338, y: 112, width: 16, height: 32 },
      { kind: 'tile', sheet: 'harbor', frame: 1, x: 712, y: 96, width: 32, height: 48 },
      { kind: 'tile', sheet: 'harbor', frame: 5, x: 848, y: 112, width: 16, height: 32 },
    ]),
  }),
  market: Object.freeze({
    id: 'market',
    name: '멈춘 어시장',
    subtitle: '새벽 청취 튜토리얼',
    theme: 'harbor',
    width: 78 * TILE_SIZE,
    music: 'mirajin-hub',
    startX: 48,
    cameraHint: 0.42,
    skyline: 1,
    solids: Object.freeze([
      { x: 0, y: 144, width: 78 * TILE_SIZE, height: 36 },
      { x: 208, y: 128, width: 32, height: 16 },
      { x: 592, y: 128, width: 48, height: 16 },
      { x: 960, y: 128, width: 64, height: 16 },
    ]),
    groundSegments: Object.freeze([{ x: 0, y: 144, width: 78 * TILE_SIZE, height: 36 }]),
    decorations: Object.freeze([
      { kind: 'tile', sheet: 'harbor', frame: 4, x: 208, y: 112, width: 32, height: 32 },
      { kind: 'tile', sheet: 'harbor', frame: 5, x: 260, y: 112, width: 16, height: 32 },
      { kind: 'tile', sheet: 'harbor', frame: 4, x: 584, y: 112, width: 32, height: 32 },
      { kind: 'tile', sheet: 'harbor', frame: 5, x: 648, y: 112, width: 16, height: 32 },
      { kind: 'door', x: 1136, y: 80, width: 48, height: 64 },
    ]),
  }),
  tower: Object.freeze({
    id: 'tower',
    name: '시계탑 하층',
    subtitle: '전투와 합류',
    theme: 'tower',
    width: 70 * TILE_SIZE,
    music: 'battle-skirmish',
    startX: 48,
    cameraHint: 0.4,
    skyline: 2,
    solids: Object.freeze([
      { x: 0, y: 144, width: 70 * TILE_SIZE, height: 36 },
      { x: 240, y: 128, width: 80, height: 16 },
      { x: 720, y: 112, width: 64, height: 16 },
      { x: 904, y: 96, width: 80, height: 16 },
    ]),
    groundSegments: Object.freeze([{ x: 0, y: 144, width: 70 * TILE_SIZE, height: 36 }]),
    decorations: Object.freeze([
      { kind: 'tile', sheet: 'tower', frame: 1, x: 112, y: 96, width: 32, height: 48 },
      { kind: 'tile', sheet: 'tower', frame: 3, x: 96, y: 96, width: 32, height: 48 },
      { kind: 'tile', sheet: 'tower', frame: 5, x: 388, y: 112, width: 16, height: 32 },
      { kind: 'tile', sheet: 'tower', frame: 5, x: 712, y: 96, width: 16, height: 32 },
      { kind: 'tile', sheet: 'tower', frame: 4, x: 964, y: 48, width: 48, height: 64 },
    ]),
  }),
  boss: Object.freeze({
    id: 'boss',
    name: '무너지는 방파제 끝',
    subtitle: '황혼 파수체',
    theme: 'boss',
    width: 68 * TILE_SIZE,
    music: 'crisis-pursuit',
    startX: 96,
    cameraHint: 0.4,
    skyline: 3,
    solids: Object.freeze([
      { x: 0, y: 144, width: 68 * TILE_SIZE, height: 36 },
      { x: 320, y: 128, width: 48, height: 16 },
      { x: 864, y: 128, width: 64, height: 16 },
    ]),
    groundSegments: Object.freeze([{ x: 0, y: 144, width: 68 * TILE_SIZE, height: 36 }]),
    decorations: Object.freeze([
      { kind: 'tile', sheet: 'harbor', frame: 4, x: 320, y: 112, width: 32, height: 32 },
      { kind: 'tile', sheet: 'harbor', frame: 5, x: 864, y: 112, width: 16, height: 32 },
    ]),
  }),
});

const INTERACTABLES = Object.freeze([
  {
    id: 'cart',
    scene: 'breakwater',
    x: 258,
    y: 104,
    width: 28,
    height: 40,
    prompt: 'E 조사',
    label: '뒤집힌 수레',
    render: { kind: 'tile', sheet: 'harbor', frame: 4, width: 32, height: 32, offsetY: 8 },
  },
  {
    id: 'fisher',
    scene: 'market',
    x: 152,
    y: 104,
    width: 20,
    height: 40,
    prompt: 'E 대화',
    echoPrompt: 'Q 새벽 청취',
    label: '어부',
    render: { kind: 'sprite', sheet: 'citizens', frame: 0, width: 24, height: 40 },
  },
  {
    id: 'apothecary',
    scene: 'market',
    x: 468,
    y: 104,
    width: 20,
    height: 40,
    prompt: 'E 대화',
    echoPrompt: 'Q 새벽 청취',
    label: '약사',
    render: { kind: 'sprite', sheet: 'citizens', frame: 1, width: 24, height: 40 },
  },
  {
    id: 'keeper',
    scene: 'market',
    x: 820,
    y: 104,
    width: 20,
    height: 40,
    prompt: 'E 대화',
    echoPrompt: 'Q 새벽 청취',
    label: '등대지기',
    render: { kind: 'sprite', sheet: 'citizens', frame: 2, width: 24, height: 40 },
  },
  {
    id: 'recorder',
    scene: 'market',
    x: 1024,
    y: 96,
    width: 32,
    height: 48,
    prompt: 'E 활성화',
    label: '파문 기록기',
    render: { kind: 'tile', sheet: 'harbor', frame: 3, width: 32, height: 48 },
  },
  {
    id: 'anchor',
    scene: 'tower',
    x: 96,
    y: 96,
    width: 32,
    height: 48,
    prompt: 'E 동기화',
    label: '임시 닻 포인트',
    render: { kind: 'tile', sheet: 'tower', frame: 3, width: 32, height: 48 },
  },
  {
    id: 'saya',
    scene: 'tower',
    x: 472,
    y: 104,
    width: 24,
    height: 40,
    prompt: 'E 대화',
    label: '사야 렌',
    render: { kind: 'sprite', sheet: 'allies', frame: 0, width: 24, height: 40 },
  },
  {
    id: 'bell',
    scene: 'tower',
    x: 956,
    y: 44,
    width: 48,
    height: 68,
    prompt: 'E 조사',
    label: '새벽종의 파편',
    render: { kind: 'tile', sheet: 'tower', frame: 4, width: 48, height: 64, offsetY: 4 },
  },
  {
    id: 'lao',
    scene: 'boss',
    x: 930,
    y: 104,
    width: 24,
    height: 40,
    prompt: 'E 승선',
    label: '라오 템',
    render: { kind: 'sprite', sheet: 'allies', frame: 2, width: 24, height: 40 },
  },
]);

const DIALOGUES = Object.freeze({
  opening: Object.freeze([
    { speaker: '플레이어', text: '파도가... 멈췄어. 아니, 뒤로 가고 있나.' },
    { speaker: '백야', text: '아침은 왔어. 다만 네가 닫아 버렸지.', tone: '잔향' },
    { speaker: '플레이어', text: '누구지. 물에 비친 저 얼굴... 왜 나를 닮았어.' },
    { speaker: '백야', text: '잊은 사람은 늘 자기 그림자를 범인이라 부르니까.', tone: '잔향' },
  ]),
  cart: Object.freeze([
    {
      speaker: '플레이어',
      text: '수레가 뒤집힌 채 멈춰 있다. 항구 전체가 멈춘 게 아니라 비틀리고 있어.',
    },
  ]),
  fisherTalk: Object.freeze([
    { speaker: '어부', text: '밧줄을 세 번 묶어야 폭풍이 안 와. 분명 아까도 그랬어.' },
    { speaker: '플레이어', text: '폭풍은 아직 안 왔잖아요.' },
    { speaker: '어부', text: '왔어. 아니, 올 거야. 왜 다들 젖지도 않았지.' },
  ]),
  fisherEcho: Object.freeze([
    {
      speaker: '잔향',
      text: '폭풍이 먼저 오고, 나는 그 뒤에 줄을 잡는다. 오늘은 순서가 뒤집혔어.',
      tone: '새벽 청취',
    },
  ]),
  apothecaryTalk: Object.freeze([
    { speaker: '약사', text: '아침 약은 이미 나눴는데 왜 사람들 눈이 아직 밤이지.' },
    { speaker: '플레이어', text: '오늘 아침을 기억하세요?' },
    { speaker: '약사', text: '기억은 나는데 냄새가 없어. 그런 아침이 있었나.' },
  ]),
  apothecaryEcho: Object.freeze([
    {
      speaker: '잔향',
      text: '해가 오기 전에 약향이 먼저 돌았어. 지금은 향만 남고 시간이 빠져나갔지.',
      tone: '새벽 청취',
    },
  ]),
  keeperTalk: Object.freeze([
    { speaker: '등대지기', text: '불빛 세기를 낮추면 해가 보여야 하는데, 오늘은 끝이 없어.' },
    { speaker: '플레이어', text: '시계탑에서 무슨 일 있었는지 아세요?' },
    { speaker: '등대지기', text: '종이 울린 뒤로 바다가 숨을 참더군. 탑으로 가면 알겠지.' },
  ]),
  keeperEcho: Object.freeze([
    {
      speaker: '잔향',
      text: '등대보다 먼저 탑이 울었고, 탑보다 먼저 누군가 새벽을 뜯어냈다.',
      tone: '새벽 청취',
    },
  ]),
  recorder: Object.freeze([
    {
      speaker: '사야 렌',
      text: '올 줄 알았어. 잔향을 들은 사람이라면 탑으로 올 수밖에 없으니까.',
      tone: '기록 재생',
    },
    {
      speaker: '사야 렌',
      text: '광장의 기록기를 열면 시계탑 봉인이 풀려. 내 신호를 따라와.',
      tone: '기록 재생',
    },
  ]),
  towerBattleStart: Object.freeze([
    { speaker: '플레이어', text: '균열 생물이 길을 막고 있어. 먼저 정리해야겠어.' },
  ]),
  sayaTalk: Object.freeze([
    { speaker: '사야 렌', text: '누군가 새벽종을 부쉈어. 그래서 미라진에서 아침이 잘려 나갔어.' },
    { speaker: '플레이어', text: '새벽 하나가 사라졌다고 도시가 이렇게 망가진다고?' },
    {
      speaker: '사야 렌',
      text: '하나가 아니야. 시작이 여기였을 뿐. 네가 종의 반응을 듣고 있다면 같이 올라가자.',
    },
    {
      speaker: '사야 렌',
      text: '선행 발자국을 열어 둘게. 짧게 베고 빠지는 데 써.',
      tone: '능력 해금',
    },
  ]),
  bell: Object.freeze([
    { speaker: '플레이어', text: '이게 새벽종... 안쪽이 비어 있어.' },
    {
      speaker: '사야 렌',
      text: '비어 있는 게 아니야. 뜯겨 나간 거지. 기록상 핵심 공명축은 일곱 개야.',
    },
    { speaker: '백야', text: '확신은 늘 늦게 도착해. 종은 벌써 두 번째로 깨졌는데.', tone: '잔향' },
    { speaker: '플레이어', text: '또 너냐. 두 번째라니 무슨 뜻이야.' },
    {
      speaker: '사야 렌',
      text: '아래가 무너져! 방파제로 내려가. 미도착 상처를 열어 둘게.',
      tone: '능력 해금',
    },
  ]),
  laoEnding: Object.freeze([
    { speaker: '라오 템', text: '둘 다 살아 있으면 뛰어. 설명은 배 위에서 해.' },
    { speaker: '사야 렌', text: '첫 종편 좌표가 잡혔어. 유리염 사구야.' },
    { speaker: '플레이어', text: '미라진을 이렇게 만든 조각이라면, 끝까지 따라간다.' },
    {
      speaker: '라오 템',
      text: '좋아. 바다에선 진실보다 먼저 사람부터 건진다. 승선해.',
      tone: '출항',
    },
  ]),
});

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function lerp(start, end, amount) {
  return start + (end - start) * amount;
}

function rectsIntersect(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

function distanceBetween(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.hypot(dx, dy);
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function createPlayer(startX, scene) {
  return {
    x: startX,
    y: findGroundY(scene, startX, PLAYER_HITBOX_WIDTH) - PLAYER_HITBOX_HEIGHT,
    width: PLAYER_HITBOX_WIDTH,
    height: PLAYER_HITBOX_HEIGHT,
    velocityX: 0,
    velocityY: 0,
    facing: 1,
    onGround: true,
    hp: 100,
    maxHp: 100,
    resonance: 46,
    memory: 12,
    attackTimer: 0,
    attackCooldown: 0,
    dashTimer: 0,
    dashCooldown: 0,
    dashPower: 1,
    invuln: 0,
    hitFlash: 0,
    shieldTimer: 0,
    shieldCooldown: 0,
    afterImages: [],
    attackHitIds: new Set(),
  };
}

function findGroundY(scene, x, width) {
  const center = x + width / 2;

  for (const solid of scene.solids) {
    if (center >= solid.x && center <= solid.x + solid.width && solid.y >= 112) {
      return solid.y;
    }
  }

  return 144;
}

class PrologueGame {
  constructor(root, assets) {
    this.root = root;
    this.assets = assets;
    this.animationFrameId = 0;
    this.lastTimestamp = 0;
    this.accumulator = 0;
    this.keys = new Set();
    this.justPressed = new Set();
    this.audioReady = false;
    this.dialogueIndex = 0;
    this.screenShake = 0;
    this.enemyIdCounter = 0;
    this.state = this.createInitialState();
    this.renderShell();
    this.cacheElements();
    this.bindEvents();
    this.renderHud();
    this.renderDialogue();
    this.renderMessages();
  }

  createInitialState() {
    const scene = SCENES.breakwater;

    return {
      started: false,
      ending: false,
      sceneId: scene.id,
      player: createPlayer(scene.startX, scene),
      cameraX: 0,
      objectivePulse: 0,
      currentTrackId: '',
      currentPrompt: null,
      messages: [],
      dialogue: null,
      areaBanner: scene.name,
      areaBannerTimer: 2.4,
      flags: {
        cartChecked: false,
        marketVisited: false,
        towerVisited: false,
        recorderActivated: false,
        echoes: { fisher: false, apothecary: false, keeper: false },
        talks: { fisher: false, apothecary: false, keeper: false },
        anchorBound: false,
        towerCombatTriggered: false,
        towerCombatCleared: false,
        sayaTalked: false,
        dashUnlocked: false,
        shieldUnlocked: false,
        bellSeen: false,
        bossStarted: false,
        bossDefeated: false,
        laoBoarded: false,
      },
      entities: [],
      checkpoint: { sceneId: scene.id, x: scene.startX },
      bannerQueue: [],
    };
  }

  renderShell() {
    this.root.innerHTML = `
      <div class="game-shell">
        <div class="game-toolbar">
          <a class="toolbar-link" href="./docs.html">문서 / BGM 아카이브</a>
          <button type="button" class="toolbar-button" data-audio-toggle>사운드 켜기</button>
        </div>

        <section class="landing" data-landing>
          <article class="landing-panel">
            <p class="eyebrow">Issue #76 · Prologue Vertical Slice</p>
            <h1>미라진에 새벽이 오지 않는다</h1>
            <p class="landing-summary">
              메인 주소를 실제 게임 진입점으로 정리하고, 이동 · 상호작용 · 대화 · 기본 전투 · HUD가
              연결된 프롤로그 플레이 구간을 바로 시작할 수 있게 구성했습니다.
            </p>
            <p class="landing-copy">
              오른쪽으로 이동해 항구 이상 현상을 조사하고, 세 명의 주민에게서 잔향을 들은 뒤
              시계탑으로 들어가세요. 사야 렌과 합류하면 전투와 능력이 열리고, 황혼 파수체를 넘기면
              유리염 사구로 향하는 첫 항해가 시작됩니다.
            </p>
            <div class="landing-actions">
              <button type="button" class="landing-action landing-action--primary" data-start-game>
                프롤로그 시작
              </button>
              <a class="landing-action" href="./docs.html">문서 / 설정 / BGM 보기</a>
            </div>
          </article>

          <aside class="landing-side">
            <section class="side-card">
              <strong>이번 슬라이스 범위</strong>
              <ul>
                <li>플레이어 이동, 점프, 회피/선행 발자국</li>
                <li>조사 가능한 오브젝트와 새벽 청취 대화</li>
                <li>시계탑 하층 전투 튜토리얼과 보스전</li>
                <li>HP / 공명 / 기억 부담 / 목표 HUD</li>
                <li>문서 뷰어 분리 후 메인 주소를 게임 진입점으로 전환</li>
              </ul>
            </section>

            <section class="side-card">
              <strong>조작</strong>
              <ul>
                <li><code>A</code> / <code>D</code> 또는 방향키: 이동</li>
                <li><code>Space</code> / <code>W</code>: 점프</li>
                <li><code>E</code>: 조사 / 대화 / 활성화</li>
                <li><code>Q</code>: 새벽 청취</li>
                <li><code>Shift</code>: 회피, 이후 선행 발자국</li>
                <li><code>J</code>: 기본 공격</li>
                <li><code>R</code>: 미도착 상처</li>
              </ul>
            </section>

            <section class="side-card">
              <strong>도트 리소스</strong>
              <p>
                이번 구현은 <code>assets/prologue-vertical-slice/</code> 아래의 스프라이트 시트와
                타일 시트를 직접 사용합니다. 플레이어, NPC, 적, 항구 타일, 시계탑 타일을 분리해 정리했습니다.
              </p>
            </section>
          </aside>
        </section>

        <section class="stage is-hidden" data-stage>
          <div class="canvas-shell">
            <canvas class="game-canvas" width="${LOGICAL_WIDTH}" height="${LOGICAL_HEIGHT}" data-canvas></canvas>
            <div class="hud-layer">
              <div class="hud-column">
                <section class="hud-card status-card" data-status-card></section>
                <section class="hud-card enemy-card is-hidden" data-enemy-card></section>
              </div>
              <div class="hud-column hud-column--right">
                <section class="hud-card objective-card" data-objective-card></section>
                <section class="hud-card skill-card" data-skill-card></section>
              </div>
              <section class="hud-card prompt-card is-hidden" data-prompt-card></section>
            </div>
          </div>
        </section>

        <section class="message-log is-hidden" data-message-log></section>

        <section class="dialogue-panel is-hidden" data-dialogue-panel>
          <div class="dialogue-meta">
            <strong class="dialogue-speaker" data-dialogue-speaker></strong>
            <span class="dialogue-tone" data-dialogue-tone></span>
          </div>
          <p class="dialogue-text" data-dialogue-text></p>
          <div class="dialogue-hint">다음 대사: <code>Space</code> / <code>E</code></div>
        </section>

        <section class="ending is-hidden" data-ending>
          <article class="ending-panel">
            <p class="eyebrow">Prologue Clear</p>
            <h2>첫 항해는 유리염 사구로 이어진다</h2>
            <p>
              프롤로그 버티컬 슬라이스를 마쳤습니다. 미라진의 새벽 정지는 단순 사고가 아니라,
              누군가 새벽종의 종편을 뜯어낸 결과라는 사실이 드러났고 사야 렌, 라오 템과 함께
              첫 종편을 추적할 항해가 시작됩니다.
            </p>
            <div class="ending-actions">
              <button type="button" class="ending-action ending-action--primary" data-restart-game>
                다시 플레이
              </button>
              <a class="ending-action" href="./docs.html#scenario-prologue">프롤로그 문서 보기</a>
            </div>
          </article>
        </section>

        <section class="loading" data-loading>
          <div class="loading-card">
            <p class="eyebrow">Loading</p>
            <p>프롤로그 버티컬 슬라이스 리소스를 불러오는 중입니다.</p>
          </div>
        </section>

        <audio data-bgm loop preload="auto"></audio>
      </div>
    `;
  }

  cacheElements() {
    this.canvas = this.root.querySelector('[data-canvas]');
    this.context = this.canvas?.getContext('2d');
    this.landing = this.root.querySelector('[data-landing]');
    this.stage = this.root.querySelector('[data-stage]');
    this.statusCard = this.root.querySelector('[data-status-card]');
    this.objectiveCard = this.root.querySelector('[data-objective-card]');
    this.enemyCard = this.root.querySelector('[data-enemy-card]');
    this.skillCard = this.root.querySelector('[data-skill-card]');
    this.promptCard = this.root.querySelector('[data-prompt-card]');
    this.messageLog = this.root.querySelector('[data-message-log]');
    this.dialoguePanel = this.root.querySelector('[data-dialogue-panel]');
    this.dialogueSpeaker = this.root.querySelector('[data-dialogue-speaker]');
    this.dialogueTone = this.root.querySelector('[data-dialogue-tone]');
    this.dialogueText = this.root.querySelector('[data-dialogue-text]');
    this.endingPanel = this.root.querySelector('[data-ending]');
    this.loading = this.root.querySelector('[data-loading]');
    this.audioElement = this.root.querySelector('[data-bgm]');
    this.audioToggle = this.root.querySelector('[data-audio-toggle]');
    this.startButton = this.root.querySelector('[data-start-game]');
    this.restartButton = this.root.querySelector('[data-restart-game]');

    if (!this.context || !this.canvas || !this.audioElement || !this.audioToggle) {
      throw new Error('게임 UI 초기화에 실패했습니다.');
    }

    this.context.imageSmoothingEnabled = false;
  }

  bindEvents() {
    window.addEventListener('keydown', (event) => {
      if (event.repeat) {
        return;
      }

      this.keys.add(event.code);
      this.justPressed.add(event.code);

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(event.code)) {
        event.preventDefault();
      }
    });

    window.addEventListener('keyup', (event) => {
      this.keys.delete(event.code);
    });

    this.audioToggle.addEventListener('click', async () => {
      if (this.audioReady) {
        this.audioReady = false;
        this.audioElement.pause();
        this.audioToggle.textContent = '사운드 켜기';
        return;
      }

      this.audioReady = true;
      this.audioToggle.textContent = '사운드 끄기';
      await this.syncMusic();
    });

    this.startButton?.addEventListener('click', async () => {
      this.state.started = true;
      this.landing?.classList.add('is-hidden');
      this.stage?.classList.remove('is-hidden');
      this.loading?.classList.add('is-hidden');
      this.pushMessage('비명 소리가 난 항구 쪽으로 이동합니다.', 'system');
      this.openDialogue(DIALOGUES.opening, {
        onComplete: () => {
          this.pushMessage(
            '목표 갱신: 멈춘 어시장을 조사하고 시계탑으로 향할 단서를 찾으세요.',
            'system'
          );
        },
      });

      if (!this.audioReady) {
        this.audioReady = true;
        this.audioToggle.textContent = '사운드 끄기';
      }

      await this.syncMusic();
    });

    this.restartButton?.addEventListener('click', () => {
      this.resetRun();
    });
  }

  resetRun() {
    this.state = this.createInitialState();
    this.landing?.classList.remove('is-hidden');
    this.stage?.classList.add('is-hidden');
    this.endingPanel?.classList.add('is-hidden');
    this.audioElement.pause();
    this.audioElement.currentTime = 0;
    this.audioReady = false;
    this.audioToggle.textContent = '사운드 켜기';
    this.renderHud();
    this.renderDialogue();
    this.renderMessages();
  }

  async syncMusic() {
    if (!this.audioReady || !this.state.started) {
      return;
    }

    const scene = SCENES[this.state.sceneId];
    let trackId = scene.music;

    if (this.state.sceneId === 'tower' && this.state.flags.towerCombatCleared) {
      trackId = 'mirajin-hub';
    }

    if (
      this.state.sceneId === 'boss' &&
      this.state.flags.bossStarted &&
      !this.state.flags.bossDefeated
    ) {
      trackId = 'battle-skirmish';
    } else if (this.state.sceneId === 'boss' && this.state.flags.bossDefeated) {
      trackId = 'mirajin-hub';
    }

    if (trackId === this.state.currentTrackId) {
      if (this.audioElement.paused) {
        try {
          await this.audioElement.play();
        } catch {
          this.audioReady = false;
          this.audioToggle.textContent = '사운드 켜기';
        }
      }

      return;
    }

    const track = TRACKS[trackId];

    if (!track) {
      return;
    }

    this.state.currentTrackId = trackId;
    this.audioElement.src = track.src;

    try {
      await this.audioElement.play();
    } catch {
      this.audioReady = false;
      this.audioToggle.textContent = '사운드 켜기';
    }
  }

  openDialogue(lines, { onComplete } = {}) {
    this.state.dialogue = {
      lines: [...lines],
      onComplete: typeof onComplete === 'function' ? onComplete : null,
    };
    this.dialogueIndex = 0;
    this.state.currentPrompt = null;
    this.renderHud();
    this.renderDialogue();
  }

  closeDialogue() {
    const onComplete = this.state.dialogue?.onComplete;
    this.state.dialogue = null;
    this.renderHud();
    this.renderDialogue();
    onComplete?.();
  }

  advanceDialogue() {
    if (!this.state.dialogue) {
      return;
    }

    if (this.dialogueIndex >= this.state.dialogue.lines.length - 1) {
      this.closeDialogue();
      return;
    }

    this.dialogueIndex += 1;
    this.renderDialogue();
  }

  pushMessage(text, tone = 'default') {
    if (this.state.messages[0]?.text === text) {
      return;
    }

    this.state.messages.unshift({ text, tone, ttl: 4.5 });
    this.state.messages = this.state.messages.slice(0, 4);
    this.renderMessages();
  }

  setAreaBanner(text) {
    this.state.areaBanner = text;
    this.state.areaBannerTimer = 2.6;
  }

  getActiveScene() {
    return SCENES[this.state.sceneId];
  }

  getInteractablesForScene() {
    return INTERACTABLES.filter((item) => item.scene === this.state.sceneId).filter((item) =>
      this.isInteractableAvailable(item)
    );
  }

  isInteractableAvailable(item) {
    const flags = this.state.flags;

    if (item.id === 'saya') {
      return flags.towerCombatCleared;
    }

    if (item.id === 'bell') {
      return flags.sayaTalked;
    }

    if (item.id === 'lao') {
      return flags.bossDefeated;
    }

    return true;
  }

  getNearbyInteractable(actionType) {
    const playerCenter = {
      x: this.state.player.x + this.state.player.width / 2,
      y: this.state.player.y + this.state.player.height / 2,
    };

    const range = 28;
    let best = null;
    let bestDistance = Number.POSITIVE_INFINITY;

    for (const item of this.getInteractablesForScene()) {
      const target = { x: item.x + item.width / 2, y: item.y + item.height / 2 };
      const distance = distanceBetween(playerCenter, target);

      if (distance > range) {
        continue;
      }

      if (actionType === 'echo' && !item.echoPrompt) {
        continue;
      }

      if (actionType === 'echo' && !this.canUseEchoOn(item.id)) {
        continue;
      }

      if (distance < bestDistance) {
        bestDistance = distance;
        best = item;
      }
    }

    return best;
  }

  canUseEchoOn(id) {
    const { talks, echoes } = this.state.flags;

    if (id === 'fisher') {
      return talks.fisher && !echoes.fisher;
    }

    if (id === 'apothecary') {
      return talks.apothecary && !echoes.apothecary;
    }

    if (id === 'keeper') {
      return talks.keeper && !echoes.keeper;
    }

    return false;
  }

  handleInteract(id) {
    const flags = this.state.flags;

    if (id === 'cart' && !flags.cartChecked) {
      flags.cartChecked = true;
      this.openDialogue(DIALOGUES.cart);
      return;
    }

    if (id === 'fisher') {
      flags.talks.fisher = true;
      this.openDialogue(DIALOGUES.fisherTalk);
      return;
    }

    if (id === 'apothecary') {
      flags.talks.apothecary = true;
      this.openDialogue(DIALOGUES.apothecaryTalk);
      return;
    }

    if (id === 'keeper') {
      flags.talks.keeper = true;
      this.openDialogue(DIALOGUES.keeperTalk);
      return;
    }

    if (id === 'recorder') {
      if (!this.hasAllEchoes()) {
        this.pushMessage(
          '세 명의 주민에게서 새벽 청취를 마쳐야 기록기를 복구할 수 있습니다.',
          'alert'
        );
        return;
      }

      if (flags.recorderActivated) {
        this.pushMessage('파문 기록기는 이미 시계탑 봉인문과 연결되었습니다.', 'system');
        return;
      }

      flags.recorderActivated = true;
      this.openDialogue(DIALOGUES.recorder, {
        onComplete: () => {
          this.pushMessage('시계탑 봉인이 열렸습니다. 오른쪽 끝으로 이동하세요.', 'system');
        },
      });
      return;
    }

    if (id === 'anchor') {
      flags.anchorBound = true;
      this.state.checkpoint = { sceneId: 'tower', x: 84 };
      this.state.player.hp = this.state.player.maxHp;
      this.state.player.resonance = clamp(this.state.player.resonance + 24, 0, 100);
      this.pushMessage('임시 닻 포인트와 동기화했습니다. HP와 공명이 회복됩니다.', 'system');
      return;
    }

    if (id === 'saya') {
      if (flags.sayaTalked) {
        this.pushMessage('사야 렌: 최상층의 종편 흔적을 확인해.', 'system');
        return;
      }

      flags.sayaTalked = true;
      flags.dashUnlocked = true;
      this.openDialogue(DIALOGUES.sayaTalk, {
        onComplete: async () => {
          this.pushMessage('선행 발자국 해금: Shift로 더 멀리 베고 빠질 수 있습니다.', 'system');
          await this.syncMusic();
        },
      });
      return;
    }

    if (id === 'bell') {
      if (flags.bellSeen) {
        return;
      }

      flags.bellSeen = true;
      flags.shieldUnlocked = true;
      this.openDialogue(DIALOGUES.bell, {
        onComplete: async () => {
          this.pushMessage('미도착 상처 해금: R로 한 번의 충격을 지연시킵니다.', 'system');
          this.setScene('boss', SCENES.boss.startX);
          this.state.checkpoint = { sceneId: 'boss', x: 84 };
          flags.bossStarted = true;
          this.spawnBoss();
          await this.syncMusic();
        },
      });
      return;
    }

    if (id === 'lao') {
      if (flags.laoBoarded) {
        return;
      }

      flags.laoBoarded = true;
      this.openDialogue(DIALOGUES.laoEnding, {
        onComplete: () => {
          this.state.ending = true;
          this.endingPanel?.classList.remove('is-hidden');
        },
      });
    }
  }

  handleEcho(id) {
    if (id === 'fisher') {
      this.state.flags.echoes.fisher = true;
      this.openDialogue(DIALOGUES.fisherEcho);
      return;
    }

    if (id === 'apothecary') {
      this.state.flags.echoes.apothecary = true;
      this.openDialogue(DIALOGUES.apothecaryEcho);
      return;
    }

    if (id === 'keeper') {
      this.state.flags.echoes.keeper = true;
      this.openDialogue(DIALOGUES.keeperEcho, {
        onComplete: () => {
          if (this.hasAllEchoes()) {
            this.pushMessage('잔향 조사 완료. 광장의 파문 기록기를 복구하세요.', 'system');
          }
        },
      });
    }
  }

  hasAllEchoes() {
    const { echoes } = this.state.flags;
    return echoes.fisher && echoes.apothecary && echoes.keeper;
  }

  setScene(sceneId, startX) {
    const scene = SCENES[sceneId];

    if (!scene) {
      return;
    }

    this.state.sceneId = sceneId;
    this.state.entities = [];
    this.state.cameraX = 0;
    this.state.player.x = startX;
    this.state.player.y =
      findGroundY(scene, startX, this.state.player.width) - this.state.player.height;
    this.state.player.velocityX = 0;
    this.state.player.velocityY = 0;
    this.setAreaBanner(scene.name);
  }

  spawnTowerEnemies() {
    if (this.state.flags.towerCombatCleared) {
      return;
    }

    this.state.entities = [this.createEnemy('husk', 360, 114), this.createEnemy('husk', 520, 114)];
    this.state.flags.towerCombatTriggered = true;
    this.openDialogue(DIALOGUES.towerBattleStart);
  }

  spawnBoss() {
    this.state.entities = [this.createEnemy('watcher', 680, 96)];
    this.pushMessage('황혼 파수체가 방파제를 봉쇄합니다.', 'alert');
  }

  createEnemy(type, x, y) {
    this.enemyIdCounter += 1;

    if (type === 'watcher') {
      return {
        id: `enemy-${this.enemyIdCounter}`,
        type,
        name: '황혼 파수체',
        x,
        y,
        width: 30,
        height: 38,
        velocityX: 0,
        facing: -1,
        hp: 160,
        maxHp: 160,
        stance: 100,
        maxStance: 100,
        cooldown: 0.8,
        windup: 0,
        stun: 0,
        flash: 0,
        attackTriggered: false,
      };
    }

    return {
      id: `enemy-${this.enemyIdCounter}`,
      type,
      name: '시간에 젖은 하역 인형',
      x,
      y,
      width: 16,
      height: 30,
      velocityX: 0,
      facing: -1,
      hp: 40,
      maxHp: 40,
      stance: 0,
      maxStance: 0,
      cooldown: 0.5,
      windup: 0,
      stun: 0,
      flash: 0,
      attackTriggered: false,
    };
  }

  run() {
    this.loading?.classList.add('is-hidden');
    this.animationFrameId = window.requestAnimationFrame((timestamp) => this.frame(timestamp));
  }

  frame(timestamp) {
    const delta = this.lastTimestamp
      ? Math.min((timestamp - this.lastTimestamp) / 1000, MAX_DELTA)
      : FIXED_DELTA;
    this.lastTimestamp = timestamp;
    this.accumulator += delta;

    while (this.accumulator >= FIXED_DELTA) {
      this.update(FIXED_DELTA);
      this.accumulator -= FIXED_DELTA;
    }

    this.render();
    this.justPressed.clear();
    this.animationFrameId = window.requestAnimationFrame((nextTimestamp) =>
      this.frame(nextTimestamp)
    );
  }

  update(delta) {
    this.updateMessages(delta);

    if (!this.state.started || this.state.ending) {
      return;
    }

    if (this.state.dialogue) {
      if (
        this.justPressed.has('Space') ||
        this.justPressed.has('Enter') ||
        this.justPressed.has('KeyE')
      ) {
        this.advanceDialogue();
      }

      this.updatePlayerAmbient(delta);
      this.updateBanner(delta);
      this.renderHud();
      return;
    }

    this.handleImmediateActions();
    this.updatePlayer(delta);
    this.updateEnemies(delta);
    this.updateStoryState();
    this.updateBanner(delta);
    this.updateCamera(delta);
    this.updatePrompt();
    this.renderHud();
  }

  updateMessages(delta) {
    this.state.messages = this.state.messages
      .map((message) => ({ ...message, ttl: message.ttl - delta }))
      .filter((message) => message.ttl > 0);
    this.renderMessages();
  }

  updateBanner(delta) {
    this.state.areaBannerTimer = Math.max(0, this.state.areaBannerTimer - delta);
  }

  updateCamera(delta) {
    const scene = this.getActiveScene();
    const targetX = clamp(
      this.state.player.x - LOGICAL_WIDTH * scene.cameraHint,
      0,
      Math.max(0, scene.width - LOGICAL_WIDTH)
    );
    this.state.cameraX = lerp(this.state.cameraX, targetX, Math.min(1, delta * 6));
    this.screenShake = Math.max(0, this.screenShake - delta * 10);
  }

  updatePrompt() {
    const interactionTarget = this.getNearbyInteractable('interact');
    const echoTarget = this.getNearbyInteractable('echo');

    if (echoTarget) {
      this.state.currentPrompt = {
        key: 'Q',
        text: `${echoTarget.label}의 잔향 듣기`,
      };
      return;
    }

    if (interactionTarget) {
      this.state.currentPrompt = {
        key: 'E',
        text: `${interactionTarget.label} ${interactionTarget.prompt.replace('E ', '')}`,
      };
      return;
    }

    this.state.currentPrompt = null;
  }

  handleImmediateActions() {
    if (this.justPressed.has('KeyE')) {
      const target = this.getNearbyInteractable('interact');

      if (target) {
        this.handleInteract(target.id);
      }
    }

    if (this.justPressed.has('KeyQ')) {
      const target = this.getNearbyInteractable('echo');

      if (target) {
        this.handleEcho(target.id);
      }
    }

    if (
      this.justPressed.has('KeyJ') &&
      this.state.player.attackTimer <= 0 &&
      this.state.player.attackCooldown <= 0
    ) {
      this.state.player.attackTimer = PLAYER_ATTACK_DURATION;
      this.state.player.attackCooldown = PLAYER_ATTACK_DURATION + PLAYER_ATTACK_COOLDOWN;
      this.state.player.attackHitIds.clear();
    }

    if (
      (this.justPressed.has('ShiftLeft') || this.justPressed.has('ShiftRight')) &&
      this.state.player.dashTimer <= 0 &&
      this.state.player.dashCooldown <= 0 &&
      this.state.player.resonance >= (this.state.flags.dashUnlocked ? 12 : 0)
    ) {
      this.state.player.dashTimer = PLAYER_DASH_DURATION;
      this.state.player.dashCooldown = this.state.flags.dashUnlocked ? 0.66 : 0.78;
      this.state.player.invuln = Math.max(this.state.player.invuln, 0.12);
      this.state.player.afterImages.push({
        x: this.state.player.x,
        y: this.state.player.y,
        facing: this.state.player.facing,
        ttl: 0.24,
      });

      if (this.state.flags.dashUnlocked) {
        this.state.player.resonance = clamp(this.state.player.resonance - 12, 0, 100);
      }
    }

    if (
      this.justPressed.has('KeyR') &&
      this.state.flags.shieldUnlocked &&
      this.state.player.shieldTimer <= 0 &&
      this.state.player.shieldCooldown <= 0 &&
      this.state.player.resonance >= 24
    ) {
      this.state.player.shieldTimer = 2.4;
      this.state.player.shieldCooldown = 4.2;
      this.state.player.resonance = clamp(this.state.player.resonance - 24, 0, 100);
      this.state.player.memory = clamp(this.state.player.memory + 18, 0, 100);
      this.pushMessage('미도착 상처가 전개되었습니다. 다음 강한 충격을 지연시킵니다.', 'system');
    }
  }

  updatePlayer(delta) {
    const player = this.state.player;
    const scene = this.getActiveScene();
    const moveInput =
      (this.keys.has('ArrowRight') || this.keys.has('KeyD') ? 1 : 0) -
      (this.keys.has('ArrowLeft') || this.keys.has('KeyA') ? 1 : 0);

    if (moveInput !== 0) {
      player.facing = moveInput > 0 ? 1 : -1;
    }

    player.attackTimer = Math.max(0, player.attackTimer - delta);
    player.attackCooldown = Math.max(0, player.attackCooldown - delta);
    player.dashCooldown = Math.max(0, player.dashCooldown - delta);
    player.invuln = Math.max(0, player.invuln - delta);
    player.hitFlash = Math.max(0, player.hitFlash - delta);
    player.shieldTimer = Math.max(0, player.shieldTimer - delta);
    player.shieldCooldown = Math.max(0, player.shieldCooldown - delta);

    if (player.shieldTimer <= 0) {
      player.shieldTimer = 0;
    }

    player.afterImages = player.afterImages
      .map((image) => ({ ...image, ttl: image.ttl - delta }))
      .filter((image) => image.ttl > 0);

    if (player.dashTimer > 0) {
      player.dashTimer = Math.max(0, player.dashTimer - delta);
      player.velocityX =
        player.facing * PLAYER_DASH_SPEED * (this.state.flags.dashUnlocked ? 1.25 : 1);
      player.velocityY = 0;
    } else {
      const speedMultiplier = player.attackTimer > 0 ? 0.45 : 1;
      player.velocityX = moveInput * PLAYER_SPEED * speedMultiplier;

      if (
        (this.justPressed.has('Space') ||
          this.justPressed.has('KeyW') ||
          this.justPressed.has('ArrowUp')) &&
        player.onGround
      ) {
        player.velocityY = -PLAYER_JUMP;
        player.onGround = false;
      }

      player.velocityY = Math.min(player.velocityY + PLAYER_GRAVITY * delta, 300);
    }

    player.x += player.velocityX * delta;
    this.resolveHorizontalCollisions(player, scene.solids);

    player.y += player.velocityY * delta;
    this.resolveVerticalCollisions(player, scene.solids);

    player.x = clamp(player.x, 0, scene.width - player.width);

    if (player.attackTimer > 0) {
      this.performPlayerAttack();
    }

    if (!this.state.flags.bossStarted || this.state.flags.bossDefeated) {
      player.resonance = clamp(player.resonance + delta * 3.2, 0, 100);
    }

    if (player.y > LOGICAL_HEIGHT + 40) {
      this.respawnPlayer();
    }
  }

  updatePlayerAmbient(delta) {
    const player = this.state.player;
    player.attackTimer = Math.max(0, player.attackTimer - delta);
    player.attackCooldown = Math.max(0, player.attackCooldown - delta);
    player.dashCooldown = Math.max(0, player.dashCooldown - delta);
    player.invuln = Math.max(0, player.invuln - delta);
    player.shieldTimer = Math.max(0, player.shieldTimer - delta);
    player.afterImages = player.afterImages
      .map((image) => ({ ...image, ttl: image.ttl - delta }))
      .filter((image) => image.ttl > 0);
  }

  resolveHorizontalCollisions(actor, solids) {
    for (const solid of solids) {
      if (!rectsIntersect(actor, solid)) {
        continue;
      }

      if (actor.velocityX > 0) {
        actor.x = solid.x - actor.width;
      } else if (actor.velocityX < 0) {
        actor.x = solid.x + solid.width;
      }
    }
  }

  resolveVerticalCollisions(actor, solids) {
    actor.onGround = false;

    for (const solid of solids) {
      if (!rectsIntersect(actor, solid)) {
        continue;
      }

      if (
        actor.velocityY >= 0 &&
        actor.y + actor.height - actor.velocityY * FIXED_DELTA <= solid.y + 6
      ) {
        actor.y = solid.y - actor.height;
        actor.velocityY = 0;
        actor.onGround = true;
      } else if (actor.velocityY < 0) {
        actor.y = solid.y + solid.height;
        actor.velocityY = 0;
      }
    }
  }

  performPlayerAttack() {
    const player = this.state.player;
    const reach = this.state.flags.dashUnlocked ? 26 : 22;
    const hitbox = {
      x: player.facing > 0 ? player.x + player.width - 2 : player.x - reach + 4,
      y: player.y + 4,
      width: reach,
      height: 22,
    };

    for (const enemy of this.state.entities) {
      if (player.attackHitIds.has(enemy.id)) {
        continue;
      }

      if (!rectsIntersect(hitbox, enemy)) {
        continue;
      }

      player.attackHitIds.add(enemy.id);
      this.damageEnemy(enemy, enemy.type === 'watcher' ? 18 : 20);
    }
  }

  damageEnemy(enemy, amount) {
    enemy.hp = Math.max(0, enemy.hp - amount);
    enemy.flash = 0.14;
    enemy.stun = Math.max(enemy.stun, enemy.type === 'watcher' ? 0.22 : 0.16);
    enemy.facing = enemy.x < this.state.player.x ? -1 : 1;
    this.state.player.resonance = clamp(this.state.player.resonance + 12, 0, 100);
    this.screenShake = Math.max(this.screenShake, 0.8);

    if (enemy.type === 'watcher') {
      enemy.stance = clamp(
        enemy.stance - (this.state.player.shieldTimer > 0 ? 30 : 14),
        0,
        enemy.maxStance
      );

      if (enemy.stance === 0) {
        enemy.stun = 1.8;
        enemy.stance = enemy.maxStance;
        this.pushMessage('균열 게이지가 붕괴했습니다. 지금이 반격 기회입니다.', 'system');
      }
    }

    if (enemy.hp <= 0) {
      if (enemy.type === 'watcher') {
        this.state.flags.bossDefeated = true;
        this.state.entities = [];
        this.pushMessage('황혼 파수체를 제압했습니다. 라오 템에게 승선하세요.', 'system');
        this.syncMusic();
      } else {
        this.state.entities = this.state.entities.filter((item) => item.id !== enemy.id);
      }
    }
  }

  updateEnemies(delta) {
    const player = this.state.player;

    for (const enemy of this.state.entities) {
      enemy.cooldown = Math.max(0, enemy.cooldown - delta);
      enemy.windup = Math.max(0, enemy.windup - delta);
      enemy.stun = Math.max(0, enemy.stun - delta);
      enemy.flash = Math.max(0, enemy.flash - delta);

      if (enemy.stun > 0) {
        continue;
      }

      const distanceX = player.x - enemy.x;
      enemy.facing = distanceX >= 0 ? 1 : -1;

      if (enemy.type === 'watcher') {
        this.updateWatcher(enemy, delta, distanceX);
      } else {
        this.updateHusk(enemy, delta, distanceX);
      }
    }
  }

  updateHusk(enemy, delta, distanceX) {
    if (enemy.windup > 0) {
      if (enemy.windup <= 0.12 && !enemy.attackTriggered) {
        enemy.attackTriggered = true;
        this.tryEnemyHit(enemy, 12, 18);
      }

      return;
    }

    enemy.attackTriggered = false;
    const absDistance = Math.abs(distanceX);

    if (absDistance < 24 && enemy.cooldown <= 0) {
      enemy.windup = 0.28;
      enemy.cooldown = 1.1;
      return;
    }

    const speed = absDistance > 18 ? 26 : 0;
    enemy.x += Math.sign(distanceX) * speed * delta;
  }

  updateWatcher(enemy, delta, distanceX) {
    if (enemy.windup > 0) {
      if (enemy.windup <= 0.18 && !enemy.attackTriggered) {
        enemy.attackTriggered = true;
        this.tryEnemyHit(enemy, 18, 30);
      }

      return;
    }

    enemy.attackTriggered = false;
    const absDistance = Math.abs(distanceX);

    if (absDistance < 42 && enemy.cooldown <= 0) {
      enemy.windup = 0.54;
      enemy.cooldown = 1.8;
      return;
    }

    const speed = absDistance > 24 ? 28 : 0;
    enemy.x += Math.sign(distanceX) * speed * delta;
  }

  tryEnemyHit(enemy, damage, range) {
    const hitbox = {
      x: enemy.facing > 0 ? enemy.x + enemy.width - 4 : enemy.x - range + 6,
      y: enemy.y + 4,
      width: range,
      height: enemy.height - 4,
    };

    if (!rectsIntersect(hitbox, this.state.player)) {
      return;
    }

    if (this.state.player.shieldTimer > 0) {
      this.state.player.shieldTimer = 0;
      this.state.player.shieldCooldown = Math.max(this.state.player.shieldCooldown, 3.2);
      enemy.stun = Math.max(enemy.stun, enemy.type === 'watcher' ? 1.4 : 0.7);
      this.state.player.memory = clamp(this.state.player.memory + 8, 0, 100);
      this.pushMessage('미도착 상처가 충격을 지연시키고 균열을 되돌렸습니다.', 'system');
      return;
    }

    if (this.state.player.invuln > 0) {
      return;
    }

    this.state.player.hp = Math.max(0, this.state.player.hp - damage);
    this.state.player.invuln = PLAYER_INVULN;
    this.state.player.hitFlash = 0.2;
    this.screenShake = Math.max(this.screenShake, 1.2);
    this.pushMessage(`피격: HP ${damage} 감소`, 'alert');

    if (this.state.player.hp <= 0) {
      this.respawnPlayer();
    }
  }

  respawnPlayer() {
    const checkpoint = this.state.checkpoint;
    this.pushMessage('임시 닻 포인트 또는 최근 진입 지점으로 복귀합니다.', 'alert');
    this.setScene(checkpoint.sceneId, checkpoint.x);
    this.state.player.hp = this.state.player.maxHp;
    this.state.player.resonance = clamp(this.state.player.resonance + 18, 0, 100);
    this.state.player.memory = clamp(this.state.player.memory - 16, 0, 100);
    this.state.player.shieldTimer = 0;
    this.state.player.shieldCooldown = 0;

    if (
      checkpoint.sceneId === 'boss' &&
      this.state.flags.bossStarted &&
      !this.state.flags.bossDefeated
    ) {
      this.spawnBoss();
    }

    if (
      checkpoint.sceneId === 'tower' &&
      this.state.flags.towerCombatTriggered &&
      !this.state.flags.towerCombatCleared
    ) {
      this.spawnTowerEnemies();
    }
  }

  updateStoryState() {
    const scene = this.getActiveScene();
    const player = this.state.player;
    const flags = this.state.flags;

    if (scene.id === 'breakwater' && player.x > scene.width - 24) {
      this.setScene('market', SCENES.market.startX);
      flags.marketVisited = true;
      this.pushMessage('새 목표: 멈춘 어시장의 세 인물에게서 잔향을 조사하세요.', 'system');
      this.syncMusic();
      return;
    }

    if (scene.id === 'market') {
      if (player.x < 8) {
        this.setScene('breakwater', SCENES.breakwater.width - 72);
        this.syncMusic();
        return;
      }

      if (player.x > scene.width - 24) {
        if (!flags.recorderActivated) {
          player.x = scene.width - 30;
          this.pushMessage(
            '시계탑으로 들어가려면 광장의 파문 기록기를 먼저 복구해야 합니다.',
            'alert'
          );
        } else {
          this.setScene('tower', SCENES.tower.startX);
          flags.towerVisited = true;
          this.state.checkpoint = { sceneId: 'tower', x: 84 };
          this.pushMessage(
            '시계탑 하층 진입. 닻 포인트를 활성화해 안전 지점을 확보하세요.',
            'system'
          );
          this.syncMusic();
        }
      }
    }

    if (scene.id === 'tower') {
      if (player.x < 8) {
        this.setScene('market', SCENES.market.width - 96);
        this.syncMusic();
        return;
      }

      if (!flags.towerCombatTriggered && player.x > 232) {
        this.spawnTowerEnemies();
      }

      if (
        flags.towerCombatTriggered &&
        !flags.towerCombatCleared &&
        this.state.entities.length === 0
      ) {
        flags.towerCombatCleared = true;
        this.pushMessage('전투 정리 완료. 사야 렌과 대화하세요.', 'system');
        this.syncMusic();
      }
    }

    if (
      scene.id === 'boss' &&
      flags.bossStarted &&
      !flags.bossDefeated &&
      this.state.entities.length === 0
    ) {
      flags.bossDefeated = true;
    }
  }

  getObjectiveModel() {
    const flags = this.state.flags;

    if (this.state.ending) {
      return {
        title: '프롤로그 완료',
        details: ['유리염 사구로 향하는 항로가 열렸습니다.'],
      };
    }

    if (this.state.sceneId === 'breakwater') {
      return {
        title: '비명 소리가 난 항구 쪽으로 이동',
        details: [
          flags.cartChecked ? '뒤집힌 수레 조사 완료' : '뒤집힌 수레를 한 번 조사해 분위기를 확인',
        ],
      };
    }

    if (this.state.sceneId === 'market' && !flags.recorderActivated) {
      return {
        title: '멈춘 어시장의 잔향 조사',
        details: [
          `${flags.echoes.fisher ? '완료' : '대기'} · 어부`,
          `${flags.echoes.apothecary ? '완료' : '대기'} · 약사`,
          `${flags.echoes.keeper ? '완료' : '대기'} · 등대지기`,
        ],
      };
    }

    if (this.state.sceneId === 'market' && flags.recorderActivated) {
      return {
        title: '시계탑 봉인문 진입',
        details: ['오른쪽 끝으로 이동해 시계탑 하층에 들어갑니다.'],
      };
    }

    if (this.state.sceneId === 'tower' && !flags.towerCombatTriggered) {
      return {
        title: '시계탑 내부 조사',
        details: [
          '오른쪽으로 전진해 균열의 원인을 찾습니다.',
          '닻 포인트를 활성화하면 안전 지점을 확보할 수 있습니다.',
        ],
      };
    }

    if (this.state.sceneId === 'tower' && !flags.towerCombatCleared) {
      return {
        title: '균열 생물 정리',
        details: ['기본 공격으로 길을 막는 하역 인형을 정리합니다.'],
      };
    }

    if (this.state.sceneId === 'tower' && !flags.sayaTalked) {
      return {
        title: '사야 렌과 합류',
        details: ['시계탑 중층에서 사야 렌과 대화해 다음 목표를 확인합니다.'],
      };
    }

    if (this.state.sceneId === 'tower' && !flags.bellSeen) {
      return {
        title: '최상층의 새벽종 조사',
        details: ['플랫폼 위를 넘어 최상층의 종편 흔적을 조사합니다.'],
      };
    }

    if (this.state.sceneId === 'boss' && !flags.bossDefeated) {
      return {
        title: '황혼 파수체를 격파',
        details: [
          '선행 발자국으로 피하고 공격 창을 만든다.',
          '미도착 상처로 한 번의 큰 충격을 지연시킨다.',
        ],
      };
    }

    if (this.state.sceneId === 'boss' && flags.bossDefeated) {
      return {
        title: '라오 템 구조선 탑승',
        details: ['오른쪽 끝으로 이동해 출항 장면으로 연결합니다.'],
      };
    }

    return { title: '프롤로그 진행', details: ['다음 구간으로 이동합니다.'] };
  }

  getActiveEnemyCard() {
    const activeEnemy = this.state.entities[0];

    if (!activeEnemy || this.state.dialogue || this.state.ending) {
      return null;
    }

    return activeEnemy;
  }

  renderHud() {
    const player = this.state.player;
    const objective = this.getObjectiveModel();
    const memoryPips = Math.max(1, Math.ceil(player.memory / 34));
    const activeEnemy = this.getActiveEnemyCard();

    this.statusCard.innerHTML = `
      <div class="status-header">
        <strong>여명 인양사</strong>
        <span class="status-chip">${SCENES[this.state.sceneId].subtitle}</span>
      </div>
      <div class="meter-group">
        <div class="meter-label">
          <span>HP</span>
          <span>${Math.ceil(player.hp)} / ${player.maxHp}</span>
        </div>
        <div class="meter">
          <div class="meter-ghost" style="width: ${Math.ceil((player.hp / player.maxHp) * 100)}%"></div>
          <div class="meter-fill meter-fill--hp" style="width: ${Math.ceil((player.hp / player.maxHp) * 100)}%"></div>
        </div>
      </div>
      <div class="meter-group">
        <div class="meter-label">
          <span>공명</span>
          <span>${Math.ceil(player.resonance)} / 100</span>
        </div>
        <div class="meter">
          <div class="meter-fill meter-fill--resonance" style="width: ${Math.ceil(player.resonance)}%"></div>
        </div>
      </div>
      <div class="meter-group">
        <div class="meter-label">
          <span>기억 부담</span>
          <span>${Math.ceil(player.memory)} / 100</span>
        </div>
        <div class="memory-pips">
          <span class="memory-pip${memoryPips >= 1 ? ' is-active' : ''}"></span>
          <span class="memory-pip${memoryPips >= 2 ? ' is-active' : ''}"></span>
          <span class="memory-pip${memoryPips >= 3 ? ' is-active' : ''}"></span>
        </div>
      </div>
    `;

    this.objectiveCard.innerHTML = `
      <strong>${SCENES[this.state.sceneId].name}</strong>
      <h2>현재 목표</h2>
      <ol class="objective-list">
        ${objective.details
          .map(
            (detail) => `
              <li class="objective-item${detail.startsWith('완료') ? ' is-done' : ''}">
                ${detail}
              </li>
            `
          )
          .join('')}
      </ol>
      <p>${objective.title}</p>
    `;

    this.skillCard.innerHTML = `
      <strong>액션 / 능력</strong>
      <h2>HUD</h2>
      <ul class="skill-list">
        <li><code>J</code> 기본 공격</li>
        <li><code>Q</code> 새벽 청취</li>
        <li><code>Shift</code> ${this.state.flags.dashUnlocked ? '선행 발자국' : '회피'}</li>
        <li><code>R</code> ${this.state.flags.shieldUnlocked ? '미도착 상처' : '잠금'}</li>
      </ul>
    `;

    if (activeEnemy) {
      this.enemyCard?.classList.remove('is-hidden');
      this.enemyCard.innerHTML = `
        <strong>${activeEnemy.name}</strong>
        <h2>전투 상태</h2>
        <div class="meter-group">
          <div class="meter-label">
            <span>적 HP</span>
            <span>${Math.ceil(activeEnemy.hp)} / ${activeEnemy.maxHp}</span>
          </div>
          <div class="meter">
            <div class="meter-fill meter-fill--hp" style="width: ${Math.ceil((activeEnemy.hp / activeEnemy.maxHp) * 100)}%"></div>
          </div>
        </div>
        ${
          activeEnemy.maxStance
            ? `
              <div class="meter-group">
                <div class="meter-label">
                  <span>균열 게이지</span>
                  <span>${Math.ceil(activeEnemy.stance)} / ${activeEnemy.maxStance}</span>
                </div>
                <div class="meter">
                  <div class="meter-fill meter-fill--resonance" style="width: ${Math.ceil((activeEnemy.stance / activeEnemy.maxStance) * 100)}%"></div>
                </div>
              </div>
            `
            : ''
        }
      `;
    } else {
      this.enemyCard?.classList.add('is-hidden');
      this.enemyCard.innerHTML = '';
    }

    if (this.state.currentPrompt) {
      this.promptCard?.classList.remove('is-hidden');
      this.promptCard.innerHTML = `
        <span class="prompt-label">${this.state.currentPrompt.key}</span>
        ${this.state.currentPrompt.text}
      `;
    } else {
      this.promptCard?.classList.add('is-hidden');
      this.promptCard.innerHTML = '';
    }
  }

  renderDialogue() {
    if (!this.state.dialogue) {
      this.dialoguePanel?.classList.add('is-hidden');
      return;
    }

    const line = this.state.dialogue.lines[this.dialogueIndex];

    if (!line) {
      return;
    }

    this.dialoguePanel?.classList.remove('is-hidden');
    if (this.dialogueSpeaker) {
      this.dialogueSpeaker.textContent = line.speaker;
    }
    if (this.dialogueTone) {
      this.dialogueTone.textContent = line.tone ?? '대화';
    }
    if (this.dialogueText) {
      this.dialogueText.textContent = line.text;
    }
  }

  renderMessages() {
    if (!this.messageLog) {
      return;
    }

    if (!this.state.messages.length || !this.state.started || this.state.ending) {
      this.messageLog.classList.add('is-hidden');
      this.messageLog.innerHTML = '';
      return;
    }

    this.messageLog.classList.remove('is-hidden');
    this.messageLog.innerHTML = this.state.messages
      .map(
        (message) => `
          <div class="message-item message-item--${message.tone}">
            ${message.text}
          </div>
        `
      )
      .join('');
  }

  render() {
    const ctx = this.context;

    if (!ctx) {
      return;
    }

    ctx.save();
    ctx.clearRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);
    ctx.fillStyle = '#050813';
    ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

    const shakeX = this.screenShake > 0 ? (Math.random() - 0.5) * this.screenShake * 2 : 0;
    const shakeY = this.screenShake > 0 ? (Math.random() - 0.5) * this.screenShake * 2 : 0;
    ctx.translate(shakeX, shakeY);

    this.drawSceneBackground(ctx);
    this.drawSceneGeometry(ctx);
    this.drawSceneDecorations(ctx);
    this.drawInteractables(ctx);
    this.drawEnemies(ctx);
    this.drawPlayer(ctx);
    this.drawOverlays(ctx);
    ctx.restore();
  }

  drawSceneBackground(ctx) {
    const scene = this.getActiveScene();
    const gradient = ctx.createLinearGradient(0, 0, 0, LOGICAL_HEIGHT);

    if (scene.theme === 'harbor') {
      gradient.addColorStop(0, '#4b2d38');
      gradient.addColorStop(0.48, '#1f3145');
      gradient.addColorStop(1, '#0a1321');
    } else if (scene.theme === 'boss') {
      gradient.addColorStop(0, '#572936');
      gradient.addColorStop(0.45, '#242b48');
      gradient.addColorStop(1, '#090f1f');
    } else {
      gradient.addColorStop(0, '#231f38');
      gradient.addColorStop(0.48, '#1a2338');
      gradient.addColorStop(1, '#090d18');
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

    const parallaxX = this.state.cameraX * 0.18;
    ctx.fillStyle = scene.theme === 'harbor' || scene.theme === 'boss' ? '#13273b' : '#1d2438';
    ctx.fillRect(0, 104, LOGICAL_WIDTH, 76);

    if (scene.theme === 'harbor' || scene.theme === 'boss') {
      ctx.fillStyle = '#0d1928';
      ctx.fillRect(0, 122, LOGICAL_WIDTH, 58);
      ctx.fillStyle = '#17324a';
      ctx.fillRect(0, 132, LOGICAL_WIDTH, 48);
      ctx.fillStyle = 'rgba(132, 228, 255, 0.18)';
      ctx.fillRect(0, 138, LOGICAL_WIDTH, 2);
      this.drawSilhouetteBlocks(ctx, parallaxX, scene.skyline);
    } else {
      ctx.fillStyle = '#111624';
      ctx.fillRect(0, 114, LOGICAL_WIDTH, 66);
      this.drawTowerSilhouettes(ctx, parallaxX);
    }
  }

  drawSilhouetteBlocks(ctx, parallaxX, skylineVariant) {
    const baseHeights = skylineVariant === 1 ? [48, 42, 58, 38, 64, 40] : [36, 52, 44, 60, 46, 54];
    let x = -((parallaxX % 64) + 64);

    for (let index = 0; index < 8; index += 1) {
      const width = 28 + (index % 3) * 12;
      const height = baseHeights[index % baseHeights.length];
      ctx.fillStyle = index % 2 === 0 ? '#15253a' : '#20354d';
      ctx.fillRect(x, 104 - height, width, height);
      x += width + 20;
    }
  }

  drawTowerSilhouettes(ctx, parallaxX) {
    let x = -((parallaxX % 72) + 72);

    for (let index = 0; index < 7; index += 1) {
      const width = 32 + (index % 2) * 18;
      const height = 62 + (index % 3) * 16;
      ctx.fillStyle = index % 2 === 0 ? '#1b2740' : '#26314f';
      ctx.fillRect(x, 96 - height, width, height);
      ctx.fillStyle = 'rgba(241, 207, 135, 0.22)';
      ctx.fillRect(x + width / 2 - 2, 40 - (index % 3) * 6, 4, 8);
      x += width + 24;
    }
  }

  drawSceneGeometry(ctx) {
    const scene = this.getActiveScene();

    for (const segment of scene.groundSegments) {
      this.drawTiledRect(
        ctx,
        scene.theme === 'tower' ? 'tower' : 'harbor',
        0,
        segment.x - this.state.cameraX,
        segment.y,
        segment.width,
        segment.height
      );
    }

    for (const solid of scene.solids) {
      if (solid.y < 144) {
        this.drawTiledRect(
          ctx,
          scene.theme === 'tower' ? 'tower' : 'harbor',
          0,
          solid.x - this.state.cameraX,
          solid.y,
          solid.width,
          solid.height
        );
      }
    }
  }

  drawSceneDecorations(ctx) {
    const scene = this.getActiveScene();

    for (const decoration of scene.decorations) {
      if (decoration.kind === 'door') {
        const unlocked = this.state.flags.recorderActivated;
        this.drawTileFrame(
          ctx,
          'tower',
          2,
          decoration.x - this.state.cameraX,
          decoration.y,
          decoration.width,
          decoration.height
        );
        if (!unlocked) {
          ctx.fillStyle = 'rgba(138, 97, 203, 0.24)';
          ctx.fillRect(
            decoration.x - this.state.cameraX,
            decoration.y,
            decoration.width,
            decoration.height
          );
        }
        continue;
      }

      this.drawTileFrame(
        ctx,
        decoration.sheet,
        decoration.frame,
        decoration.x - this.state.cameraX,
        decoration.y,
        decoration.width,
        decoration.height
      );
    }
  }

  drawInteractables(ctx) {
    const time = performance.now() * 0.001;

    for (const item of this.getInteractablesForScene()) {
      const screenX = item.x - this.state.cameraX;
      const screenY = item.y;
      const hovered =
        this.state.currentPrompt && this.state.currentPrompt.text.includes(item.label);

      if (item.render.kind === 'tile') {
        this.drawTileFrame(
          ctx,
          item.render.sheet,
          item.render.frame,
          screenX,
          screenY + (item.render.offsetY ?? 0),
          item.render.width,
          item.render.height
        );
      } else {
        this.drawSpriteFrame(
          ctx,
          item.render.sheet,
          item.render.frame,
          screenX,
          screenY,
          item.render.width,
          item.render.height,
          true,
          1,
          false
        );
      }

      ctx.strokeStyle = hovered ? 'rgba(130, 228, 255, 0.9)' : 'rgba(130, 228, 255, 0.34)';
      ctx.lineWidth = 1;
      ctx.strokeRect(
        screenX - 2,
        screenY - 3 + Math.sin(time * 4 + item.x * 0.01) * 1.5,
        item.width + 4,
        item.height + 4
      );
    }
  }

  drawEnemies(ctx) {
    for (const enemy of this.state.entities) {
      if (enemy.type === 'watcher') {
        let frame = 5;

        if (enemy.windup > 0) {
          frame = 6;
        } else if (enemy.stun > 0.4) {
          frame = 7;
        }

        this.drawSpriteFrame(
          ctx,
          'enemies',
          frame,
          enemy.x - this.state.cameraX - 6,
          enemy.y - 2,
          40,
          40,
          enemy.facing < 0,
          enemy.flash > 0 ? 0.72 : 1,
          false
        );
      } else {
        let frame = Math.floor(performance.now() * 0.008) % 2 === 0 ? 2 : 3;

        if (enemy.windup > 0) {
          frame = 4;
        }

        this.drawSpriteFrame(
          ctx,
          'enemies',
          frame,
          enemy.x - this.state.cameraX - 4,
          enemy.y - 10,
          24,
          40,
          enemy.facing < 0,
          enemy.flash > 0 ? 0.68 : 1,
          true
        );
      }
    }
  }

  drawPlayer(ctx) {
    const player = this.state.player;

    for (const afterImage of player.afterImages) {
      this.drawSpriteFrame(
        ctx,
        'hero',
        6,
        afterImage.x - this.state.cameraX - 5,
        afterImage.y - 10,
        24,
        40,
        afterImage.facing < 0,
        clamp(afterImage.ttl * 2.6, 0, 0.5),
        false
      );
    }

    let frame = Math.floor(performance.now() * 0.007) % 2 === 0 ? 0 : 1;

    if (!player.onGround) {
      frame = 7;
    } else if (player.dashTimer > 0) {
      frame = 6;
    } else if (player.attackTimer > 0.12) {
      frame = 4;
    } else if (player.attackTimer > 0) {
      frame = 5;
    } else if (Math.abs(player.velocityX) > 12) {
      frame = Math.floor(performance.now() * 0.011) % 2 === 0 ? 2 : 3;
    }

    this.drawSpriteFrame(
      ctx,
      'hero',
      frame,
      player.x - this.state.cameraX - 5,
      player.y - 10,
      24,
      40,
      player.facing < 0,
      player.invuln > 0 && Math.floor(performance.now() * 0.03) % 2 === 0 ? 0.52 : 1,
      false
    );

    if (player.shieldTimer > 0) {
      ctx.strokeStyle = 'rgba(130, 228, 255, 0.82)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(
        player.x - this.state.cameraX + player.width / 2,
        player.y + player.height / 2,
        18,
        0,
        Math.PI * 2
      );
      ctx.stroke();
    }
  }

  drawOverlays(ctx) {
    if (this.state.areaBannerTimer > 0) {
      const alpha = Math.min(1, this.state.areaBannerTimer);
      ctx.fillStyle = `rgba(4, 10, 20, ${0.56 * alpha})`;
      ctx.fillRect(88, 12, 144, 24);
      ctx.fillStyle = `rgba(239, 244, 255, ${alpha})`;
      ctx.font = '700 12px "Noto Sans KR"';
      ctx.textAlign = 'center';
      ctx.fillText(this.state.areaBanner, LOGICAL_WIDTH / 2, 28);
    }
  }

  drawTiledRect(ctx, sheetKey, frameIndex, x, y, width, height) {
    const sheet = SHEET_CONFIG[sheetKey];
    const image = this.assets[sheetKey];

    if (!image) {
      return;
    }

    const columns = image.width / sheet.frameWidth;
    const sourceX = (frameIndex % columns) * sheet.frameWidth;
    const sourceY = Math.floor(frameIndex / columns) * sheet.frameHeight;

    for (let tileY = 0; tileY < height; tileY += sheet.frameHeight) {
      for (let tileX = 0; tileX < width; tileX += sheet.frameWidth) {
        ctx.drawImage(
          image,
          sourceX,
          sourceY,
          sheet.frameWidth,
          sheet.frameHeight,
          Math.round(x + tileX),
          Math.round(y + tileY),
          sheet.frameWidth,
          sheet.frameHeight
        );
      }
    }
  }

  drawTileFrame(ctx, sheetKey, frameIndex, x, y, width, height) {
    const sheet = SHEET_CONFIG[sheetKey];
    const image = this.assets[sheetKey];

    if (!image) {
      return;
    }

    const columns = image.width / sheet.frameWidth;
    const sourceX = (frameIndex % columns) * sheet.frameWidth;
    const sourceY = Math.floor(frameIndex / columns) * sheet.frameHeight;

    ctx.drawImage(
      image,
      sourceX,
      sourceY,
      sheet.frameWidth,
      sheet.frameHeight,
      Math.round(x),
      Math.round(y),
      width,
      height
    );
  }

  drawSpriteFrame(ctx, sheetKey, frameIndex, x, y, width, height, flip, alpha, fitHeight) {
    const sheet = SHEET_CONFIG[sheetKey];
    const image = this.assets[sheetKey];

    if (!image) {
      return;
    }

    const columns = image.width / sheet.frameWidth;
    const sourceX = (frameIndex % columns) * sheet.frameWidth;
    const sourceY = Math.floor(frameIndex / columns) * sheet.frameHeight;
    const drawWidth = width ?? sheet.frameWidth;
    const drawHeight = fitHeight ? height : (height ?? sheet.frameHeight);

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(Math.round(x + drawWidth / 2), Math.round(y + drawHeight / 2));
    ctx.scale(flip ? -1 : 1, 1);
    ctx.drawImage(
      image,
      sourceX,
      sourceY,
      sheet.frameWidth,
      sheet.frameHeight,
      -drawWidth / 2,
      -drawHeight / 2,
      drawWidth,
      drawHeight
    );
    ctx.restore();
  }
}

async function bootstrap() {
  const assetEntries = await Promise.all(
    Object.entries(SHEET_CONFIG).map(async ([key, config]) => [key, await loadImage(config.src)])
  );
  const assets = Object.fromEntries(assetEntries);
  const game = new PrologueGame(app, assets);
  game.run();
}

bootstrap().catch((error) => {
  app.innerHTML = `
    <div style="padding:24px;color:#fff;font-family:'Noto Sans KR',sans-serif;">
      <h1>프롤로그를 불러오지 못했습니다.</h1>
      <p>${error instanceof Error ? error.message : '알 수 없는 오류'}</p>
    </div>
  `;
});
