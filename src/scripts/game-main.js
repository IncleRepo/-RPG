import '../styles/game.css';
import { soundtrackTracks } from './audio-tracks.js';

const app = document.querySelector('#app');

if (!app) {
  throw new Error('앱 루트 요소를 찾을 수 없습니다.');
}

const CANVAS_WIDTH = 320;
const CANVAS_HEIGHT = 180;
const WORLD_WIDTH = 1120;
const FLOOR_Y = 144;
const GRAVITY = 860;
const MAX_FALL_SPEED = 320;
const PLAYER_WIDTH = 12;
const PLAYER_HEIGHT = 30;
const PLAYER_SPEED = 86;
const PLAYER_JUMP = 272;
const PLAYER_DASH_SPEED = 248;
const PLAYER_DASH_DURATION = 0.16;
const PLAYER_ATTACK_WINDOW = 0.28;
const MAX_HP = 100;
const MAX_RESONANCE = 100;

const TRACKS = soundtrackTracks.reduce((map, track) => {
  map[track.id] = track;
  return map;
}, {});

const KEY_BINDINGS = new Set([
  'ArrowLeft',
  'ArrowRight',
  'KeyA',
  'KeyD',
  'ArrowUp',
  'KeyW',
  'Space',
  'ShiftLeft',
  'ShiftRight',
  'KeyJ',
  'KeyE',
  'KeyQ',
  'KeyR',
  'Enter',
]);

const ZONE_RANGES = Object.freeze([
  { max: 244, label: '동쪽 방파제' },
  { max: 640, label: '멈춘 어시장' },
  { max: 760, label: '시계탑 외곽 광장' },
  { max: 932, label: '시계탑 하층' },
  { max: Infinity, label: '붕괴한 방파제 끝' },
]);

const platforms = Object.freeze([
  { left: 450, right: 530, top: 120, style: 'wood' },
  { left: 856, right: 922, top: 114, style: 'stone' },
]);

const interactableDefs = Object.freeze([
  { id: 'cart', type: 'inspect', x: 178, y: FLOOR_Y, radius: 20, label: '뒤집힌 수레' },
  { id: 'fisherman', type: 'npc', x: 320, y: FLOOR_Y, radius: 24, label: '어부' },
  {
    id: 'rope-bundle',
    type: 'echo',
    x: 392,
    y: FLOOR_Y,
    radius: 24,
    label: '어부의 밧줄 묶음',
    stepLabel: '밧줄 묶음 잔향 회수',
  },
  {
    id: 'medicine',
    type: 'echo',
    x: 492,
    y: 120,
    radius: 24,
    label: '약사의 약상자',
    stepLabel: '약상자 잔향 회수',
  },
  {
    id: 'lever',
    type: 'echo',
    x: 590,
    y: FLOOR_Y,
    radius: 24,
    label: '등대 제어 레버',
    stepLabel: '등대 레버 잔향 회수',
  },
  { id: 'saya', type: 'npc', x: 720, y: FLOOR_Y, radius: 26, label: '사야 렌' },
  { id: 'bell-shell', type: 'device', x: 978, y: FLOOR_Y, radius: 26, label: '새벽종 외피' },
  { id: 'rope-line', type: 'exit', x: 1088, y: FLOOR_Y, radius: 24, label: '라오 템의 구조선' },
]);

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

function distanceBetween(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function rectsIntersect(a, b) {
  return a.left <= b.right && a.right >= b.left && a.top <= b.bottom && a.bottom >= b.top;
}

function buildTrackLabel(trackId) {
  return TRACKS[trackId]?.koreanTitle ?? '사운드 대기';
}

function createEnemy(type, x) {
  if (type === 'sentinel') {
    return {
      id: `sentinel-${Math.random().toString(36).slice(2, 8)}`,
      type,
      x,
      y: FLOOR_Y,
      width: 26,
      height: 28,
      hp: 142,
      maxHp: 142,
      breakMeter: 0,
      breakLimit: 112,
      facing: -1,
      moveSpeed: 34,
      attackRange: 34,
      attackCooldown: 1.8,
      state: 'idle',
      attackTimer: 0,
      stunTimer: 0,
      hurtTimer: 0,
      vx: 0,
      windupDone: false,
    };
  }

  return {
    id: `wraith-${Math.random().toString(36).slice(2, 8)}`,
    type,
    x,
    y: FLOOR_Y,
    width: 18,
    height: 18,
    hp: 44,
    maxHp: 44,
    breakMeter: 0,
    breakLimit: 38,
    facing: -1,
    moveSpeed: 28,
    attackRange: 20,
    attackCooldown: 1.1,
    state: 'idle',
    attackTimer: 0,
    stunTimer: 0,
    hurtTimer: 0,
    vx: 0,
  };
}

function createInitialState() {
  return {
    started: false,
    completed: false,
    phase: 'title',
    zone: '동쪽 방파제',
    elapsed: 0,
    cameraX: 0,
    shake: 0,
    objective: {
      title: '비명 소리가 난 항구 쪽으로 이동',
      steps: ['방파제 끝에서 이동 조작을 익힌다'],
    },
    banner: {
      text: '프롤로그 시작 준비',
      timer: 0,
    },
    overlay: {
      visible: true,
      title: '사라진 새벽의 첫 단서',
      body: '한 화면짜리 프롤로그 버티컬 슬라이스입니다. 이동, 조사, 대화, 기본 전투, 종료 연출을 순서대로 체험하며 메인 루프를 검증합니다.',
      primaryLabel: '프롤로그 시작',
      primaryMode: 'start',
    },
    prompt: '',
    logs: ['키보드 기준: 이동, 조사, 전투, HUD를 모두 한 화면에서 확인할 수 있습니다.'],
    echoesFound: new Set(),
    activeDialogue: null,
    activeInteractableId: '',
    encounter: '탐험',
    checkpointX: 74,
    checkpointPhase: 'approach',
    currentTrackId: 'mirajin-hub',
    audioEnabled: false,
    player: {
      x: 74,
      y: FLOOR_Y,
      vx: 0,
      vy: 0,
      width: PLAYER_WIDTH,
      height: PLAYER_HEIGHT,
      facing: 1,
      onGround: true,
      moveIntent: 0,
      hp: MAX_HP,
      resonance: MAX_RESONANCE,
      burden: 0,
      hitTimer: 0,
      invulnerableTimer: 0,
      dashCooldown: 0,
      dashTimer: 0,
      dashDirection: 1,
      attackTimer: 0,
      attackStep: 0,
      attackHitIds: new Set(),
      comboTimer: 0,
      wardTimer: 0,
      wardCooldown: 0,
      dashUnlocked: false,
      wardUnlocked: false,
      requestedJump: false,
    },
    enemies: [],
    effects: [],
    barriers: {
      left: null,
      right: null,
      gateClosed: true,
    },
    flags: {
      sawMarketObjective: false,
      metSaya: false,
      arenaCleared: false,
      bellInspected: false,
      bossCleared: false,
    },
  };
}

app.innerHTML = `
  <div class="game-page">
    <header class="landing">
      <div class="landing__copy">
        <p class="landing__eyebrow">Issue #76 · Prologue Vertical Slice</p>
        <h1 class="landing__title">반향해 연대기</h1>
        <p class="landing__subtitle">
          멈춘 새벽의 항구를 직접 걸으며 조사, 대화, 기본 전투, HUD 흐름을 검증하는
          프롤로그 플레이 프로토타입입니다.
        </p>
        <p class="landing__body">
          메인 주소는 이제 문서 뷰어가 아니라 실제 게임 진입점입니다. 프롤로그 일부를 한 구간으로
          압축해, 문서에 적힌 분위기와 핵심 루프가 플레이 감각으로 이어지는지 바로 확인할 수 있게
          정리했습니다.
        </p>
        <div class="landing__actions">
          <button type="button" class="action-button action-button--primary" data-start-button>
            프롤로그 시작
          </button>
          <a class="button-link button-link--secondary" href="./docs.html#prologue-playflow">
            문서 · BGM 뷰어 열기
          </a>
        </div>
      </div>

      <aside class="landing__panel" aria-label="버티컬 슬라이스 요약">
        <div class="stat-grid">
          <article class="stat-card">
            <strong>구현 범위</strong>
            <span>이동, 조사, 대화, HUD, 실시간 전투, 프롤로그 종료 연출</span>
          </article>
          <article class="stat-card">
            <strong>톤 & 비주얼</strong>
            <span>320×180 픽셀 캔버스 위에 항구 황혼 톤과 절제된 도트 모션을 맞췄습니다.</span>
          </article>
          <article class="stat-card">
            <strong>페이지 구조</strong>
            <span>메인 진입은 게임, 문서와 BGM 아카이브는 별도 docs.html로 분리했습니다.</span>
          </article>
        </div>
      </aside>
    </header>

    <main class="experience">
      <section class="game-stage__shell" aria-labelledby="slice-heading">
        <div class="game-stage__header">
          <div class="section-heading">
            <p class="section-heading__eyebrow">Playable Slice</p>
            <h2 id="slice-heading">미라진 프롤로그</h2>
            <p>오른쪽으로 전진하며 조사 목표를 완료하고, 시계탑 하층 전투를 돌파한 뒤 구조선으로 탈출하세요.</p>
          </div>
          <div class="status-badges" aria-label="상태 요약">
            <span class="status-pill status-pill--teal" data-zone-badge>동쪽 방파제</span>
            <span class="status-pill status-pill--gold" data-echo-badge>잔향 0/3</span>
            <span class="status-pill status-pill--rose" data-encounter-badge>탐험</span>
          </div>
        </div>

        <div class="game-frame">
          <canvas class="game-canvas" width="${CANVAS_WIDTH}" height="${CANVAS_HEIGHT}" data-game-canvas></canvas>

          <div class="frame-ui">
            <div class="hud-cluster hud-cluster--top-left">
              <section class="hud-card" aria-label="플레이어 상태">
                <p class="hud-card__label">여명 인양사</p>
                <div class="meter">
                  <div class="meter__track">
                    <div class="meter__fill meter__fill--hp" data-hp-fill></div>
                  </div>
                  <div class="meter__meta">
                    <span>HP</span>
                    <span data-hp-text>100 / 100</span>
                  </div>
                </div>
                <div class="meter">
                  <div class="meter__track">
                    <div class="meter__fill meter__fill--resonance" data-resonance-fill></div>
                  </div>
                  <div class="meter__meta">
                    <span>공명</span>
                    <span data-resonance-text>100 / 100</span>
                  </div>
                </div>
                <div class="memory-burden" aria-label="기억 부담">
                  <span class="memory-burden__node" data-burden-node="0"></span>
                  <span class="memory-burden__node" data-burden-node="1"></span>
                  <span class="memory-burden__node" data-burden-node="2"></span>
                </div>
                <p class="hud-card__caption">강한 방어를 사용할수록 기억 부담이 쌓입니다.</p>
              </section>
            </div>

            <div class="hud-cluster hud-cluster--top-right">
              <section class="hud-card hud-card--objective" aria-label="현재 목표">
                <p class="hud-card__label">현재 목표</p>
                <div class="hud-card__value" data-objective-title></div>
                <ul class="objective-list" data-objective-list></ul>
              </section>
            </div>

            <div class="hud-cluster hud-cluster--bottom-left">
              <section class="hud-card" aria-label="최근 기록">
                <p class="hud-card__label">현장 기록</p>
                <ul class="log-list" data-log-list></ul>
              </section>
            </div>

            <div class="hud-cluster hud-cluster--bottom-right">
              <section class="hud-card" aria-label="장착 액션">
                <p class="hud-card__label">액션 슬롯</p>
                <div class="skill-grid">
                  <div class="skill-chip is-ready" data-skill-chip="attack">
                    <strong>J 기본 공격</strong>
                    <span>연속 참격</span>
                  </div>
                  <div class="skill-chip is-locked" data-skill-chip="dash">
                    <strong>Shift 선행 발자국</strong>
                    <span>짧은 회피 이동</span>
                  </div>
                  <div class="skill-chip is-locked" data-skill-chip="ward">
                    <strong>R 미도착 상처</strong>
                    <span>피해 지연 보호</span>
                  </div>
                </div>
              </section>
            </div>

            <section class="hud-card hud-card--prompt" data-prompt-card aria-live="polite">
              <div data-prompt-text></div>
            </section>
          </div>

          <div class="dialogue-box" data-dialogue hidden>
            <div class="dialogue-box__panel">
              <p class="dialogue-box__speaker" data-dialogue-speaker></p>
              <p class="dialogue-box__text" data-dialogue-text></p>
              <div class="dialogue-box__footer">
                <span class="dialogue-box__hint">E, Enter, Space로 다음</span>
                <button type="button" class="dialogue-box__next" data-dialogue-next>
                  다음 대사
                </button>
              </div>
            </div>
          </div>

          <div class="frame-overlay" data-overlay>
            <div class="overlay-panel">
              <h2 data-overlay-title>사라진 새벽의 첫 단서</h2>
              <p data-overlay-body>
                한 화면짜리 프롤로그 버티컬 슬라이스입니다. 이동, 조사, 대화, 기본 전투, 종료
                연출을 순서대로 체험하며 메인 루프를 검증합니다.
              </p>
              <div class="overlay-panel__actions">
                <button type="button" class="action-button action-button--primary" data-overlay-primary>
                  프롤로그 시작
                </button>
                <a class="button-link button-link--secondary" href="./docs.html#prologue-playflow">
                  문서 기준 확인
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <aside class="sidebar">
        <section class="slice-card">
          <h2 class="panel-title">플레이 가이드</h2>
          <div class="control-grid">
            <article class="control-chip">
              <strong>이동</strong>
              <span>A/D 또는 방향키, Space 점프</span>
            </article>
            <article class="control-chip">
              <strong>조사</strong>
              <span>E 상호작용, Q 새벽 청취</span>
            </article>
            <article class="control-chip">
              <strong>전투</strong>
              <span>J 연속 공격</span>
            </article>
            <article class="control-chip">
              <strong>해금 스킬</strong>
              <span>Shift 선행 발자국, R 미도착 상처</span>
            </article>
          </div>
        </section>

        <section class="slice-card">
          <h2 class="panel-title">진행 상태</h2>
          <div class="stat-grid">
            <article class="status-card">
              <span class="status-card__label">현재 구역</span>
              <strong class="status-card__value" data-zone-status>동쪽 방파제</strong>
            </article>
            <article class="status-card">
              <span class="status-card__label">프롤로그 단계</span>
              <strong class="status-card__value" data-phase-status>이동 튜토리얼</strong>
              <span class="status-card__meta" data-phase-meta>오른쪽으로 전진해 항구의 이상 현상을 조사하세요.</span>
            </article>
            <article class="status-card">
              <span class="status-card__label">조사 진척</span>
              <strong class="status-card__value" data-progress-status>잔향 0 / 3</strong>
            </article>
          </div>
        </section>

        <section class="slice-card audio-panel">
          <h2 class="panel-title">현장 BGM</h2>
          <p class="audio-panel__meta" data-audio-track>
            현재 트랙: 미사용
          </p>
          <button type="button" class="action-button action-button--secondary" data-audio-toggle>
            BGM 켜기
          </button>
          <audio class="visually-hidden" data-bgm-player preload="auto" loop></audio>
        </section>

        <section class="slice-card">
          <h2 class="panel-title">이 슬라이스에 담은 요소</h2>
          <ul class="slice-list">
            <li>프롤로그 도입 컷신과 첫 목표 노출</li>
            <li>조사 가능한 오브젝트와 새벽 청취 잔향 회수</li>
            <li>사야 렌과의 합류 대화 및 능력 해금</li>
            <li>실시간 전투, 적 브레이크, 체크포인트성 복구</li>
            <li>라오 템 구조선으로 이어지는 종료 연출</li>
          </ul>
        </section>
      </aside>
    </main>

    <section class="summary-grid" aria-label="요약 카드">
      <article class="summary-card">
        <h2>메인 진입 정리</h2>
        <p>
          대표 주소는 실제 게임 플레이를 보여 주고, 문서와 BGM 아카이브는 별도 페이지에서 유지합니다.
        </p>
      </article>
      <article class="summary-card">
        <h2>도트 톤 조정</h2>
        <p>
          외부 이미지 파일 대신 캔버스에서 직접 픽셀형 캐릭터, 장치, 항구 배경을 그려 톤과 모션을
          한 방향으로 맞췄습니다.
        </p>
      </article>
      <article class="summary-card">
        <h2>문서 기준 반영</h2>
        <p>
          목표 표시, HUD 계층, 프롤로그 조사 순서, 사야 합류, 첫 전투, 종료 전환을 게임 화면에 바로
          대응시켰습니다.
        </p>
      </article>
    </section>

    <section class="detail-grid" aria-label="구현 상세">
      <article class="detail-card">
        <h3>플레이 흐름</h3>
        <p>
          방파제 이동에서 시작해 어시장 조사 3개를 완료하고, 사야 렌과 합류한 뒤 시계탑 하층 전투와
          황혼 파수체를 넘어 구조선에 탑승하는 짧은 완성 구간입니다.
        </p>
      </article>
      <article class="detail-card">
        <h3>문서 · BGM 분리</h3>
        <p>
          기존 문서/BGM 뷰어는 docs.html에서 계속 제공되며, 게임 페이지에서 바로 이동할 수 있습니다.
        </p>
      </article>
    </section>
  </div>
`;

class PrologueSlice {
  constructor(root) {
    this.root = root;
    this.canvas = root.querySelector('[data-game-canvas]');
    this.context = this.canvas?.getContext('2d');
    this.audioPlayer = root.querySelector('[data-bgm-player]');
    this.state = createInitialState();
    this.keys = new Map();
    this.justPressed = new Set();
    this.previousTimestamp = 0;
    this.frameHandle = 0;

    if (!this.canvas || !this.context || !this.audioPlayer) {
      throw new Error('게임 화면 초기화에 필요한 요소를 찾을 수 없습니다.');
    }

    this.context.imageSmoothingEnabled = false;

    this.refs = {
      startButton: root.querySelector('[data-start-button]'),
      overlay: root.querySelector('[data-overlay]'),
      overlayTitle: root.querySelector('[data-overlay-title]'),
      overlayBody: root.querySelector('[data-overlay-body]'),
      overlayPrimary: root.querySelector('[data-overlay-primary]'),
      dialogue: root.querySelector('[data-dialogue]'),
      dialogueSpeaker: root.querySelector('[data-dialogue-speaker]'),
      dialogueText: root.querySelector('[data-dialogue-text]'),
      dialogueNext: root.querySelector('[data-dialogue-next]'),
      hpFill: root.querySelector('[data-hp-fill]'),
      hpText: root.querySelector('[data-hp-text]'),
      resonanceFill: root.querySelector('[data-resonance-fill]'),
      resonanceText: root.querySelector('[data-resonance-text]'),
      burdenNodes: root.querySelectorAll('[data-burden-node]'),
      objectiveTitle: root.querySelector('[data-objective-title]'),
      objectiveList: root.querySelector('[data-objective-list]'),
      logList: root.querySelector('[data-log-list]'),
      promptCard: root.querySelector('[data-prompt-card]'),
      promptText: root.querySelector('[data-prompt-text]'),
      zoneBadge: root.querySelector('[data-zone-badge]'),
      echoBadge: root.querySelector('[data-echo-badge]'),
      encounterBadge: root.querySelector('[data-encounter-badge]'),
      zoneStatus: root.querySelector('[data-zone-status]'),
      phaseStatus: root.querySelector('[data-phase-status]'),
      phaseMeta: root.querySelector('[data-phase-meta]'),
      progressStatus: root.querySelector('[data-progress-status]'),
      audioToggle: root.querySelector('[data-audio-toggle]'),
      audioTrack: root.querySelector('[data-audio-track]'),
      skillAttack: root.querySelector('[data-skill-chip="attack"]'),
      skillDash: root.querySelector('[data-skill-chip="dash"]'),
      skillWard: root.querySelector('[data-skill-chip="ward"]'),
    };

    this.bindEvents();
    this.syncOverlay();
    this.syncHud();
    this.playTrack(this.state.currentTrackId);
    this.frameHandle = window.requestAnimationFrame((timestamp) => this.loop(timestamp));
  }

  bindEvents() {
    this.refs.startButton?.addEventListener('click', () => this.beginRun());
    this.refs.overlayPrimary?.addEventListener('click', () => {
      if (this.state.completed) {
        this.beginRun();
        return;
      }

      this.beginRun();
    });
    this.refs.dialogueNext?.addEventListener('click', () => this.advanceDialogue());
    this.refs.audioToggle?.addEventListener('click', () => this.toggleAudio());

    window.addEventListener('keydown', (event) => this.handleKey(event, true));
    window.addEventListener('keyup', (event) => this.handleKey(event, false));
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.audioPlayer.pause();
      } else if (this.state.audioEnabled && this.state.started && !this.state.completed) {
        this.audioPlayer.play().catch(() => {
          this.state.audioEnabled = false;
          this.syncHud();
        });
      }
    });
  }

  handleKey(event, isDown) {
    if (!KEY_BINDINGS.has(event.code)) {
      return;
    }

    if (this.state.overlay.visible && !['Enter', 'Space'].includes(event.code)) {
      if (!this.state.started) {
        return;
      }
    }

    event.preventDefault();

    if (isDown) {
      if (!this.keys.get(event.code)) {
        this.justPressed.add(event.code);
      }

      this.keys.set(event.code, true);

      if (this.state.activeDialogue && ['KeyE', 'Enter', 'Space'].includes(event.code)) {
        this.advanceDialogue();
      }

      if (this.state.overlay.visible && ['Enter', 'Space'].includes(event.code)) {
        if (this.state.completed || !this.state.started) {
          this.beginRun();
        }
      }

      return;
    }

    this.keys.set(event.code, false);
  }

  beginRun() {
    this.state = createInitialState();
    this.state.started = true;
    this.state.phase = 'opening';
    this.state.overlay.visible = false;
    this.state.zone = '동쪽 방파제';
    this.playTrack('mirajin-hub');
    this.toggleAudio(true);
    this.pushLog('항구 전체가 비틀린 채 멈춰 있다.');
    this.startDialogue(
      [
        { speaker: '플레이어', text: '파도가... 멈췄어. 아니, 뒤로 가고 있나.' },
        { speaker: '백야', text: '아침은 왔어. 다만 네가 닫아 버렸지.' },
        { speaker: '플레이어', text: '누구지. 어디서 말하는 거야.' },
        {
          speaker: '백야',
          text: '비명 소리가 난 항구 쪽으로 가. 물에 비친 너도 거기서 널 기다려.',
        },
      ],
      () => {
        this.state.phase = 'approach';
        this.setObjective('비명 소리가 난 항구 쪽으로 이동', [
          '오른쪽으로 전진하며 첫 조작을 익힌다',
          '조사 가능한 물체를 찾아본다',
        ]);
        this.setBanner('항구 쪽으로 이동하세요', 2.6);
      }
    );
    this.syncOverlay();
    this.syncHud();
  }

  toggleAudio(forceEnable = null) {
    if (typeof forceEnable === 'boolean') {
      this.state.audioEnabled = forceEnable;
    } else {
      this.state.audioEnabled = !this.state.audioEnabled;
    }

    if (this.state.audioEnabled) {
      this.audioPlayer.play().catch(() => {
        this.state.audioEnabled = false;
        this.pushLog('브라우저가 자동 재생을 막아 BGM을 켜지 못했습니다.');
        this.syncHud();
      });
    } else {
      this.audioPlayer.pause();
    }

    this.syncHud();
  }

  playTrack(trackId) {
    this.state.currentTrackId = TRACKS[trackId] ? trackId : 'mirajin-hub';
    const track = TRACKS[this.state.currentTrackId];

    if (!track) {
      return;
    }

    if (this.audioPlayer.getAttribute('src') !== track.src) {
      this.audioPlayer.src = track.src;
    }

    if (this.state.audioEnabled) {
      this.audioPlayer.play().catch(() => {
        this.state.audioEnabled = false;
        this.syncHud();
      });
    }

    this.syncHud();
  }

  setObjective(title, steps) {
    this.state.objective = { title, steps };
    this.syncHud();
  }

  setBanner(text, duration = 2.1) {
    this.state.banner.text = text;
    this.state.banner.timer = duration;
    this.syncHud();
  }

  pushLog(message) {
    this.state.logs = [message, ...this.state.logs].slice(0, 4);
    this.syncHud();
  }

  syncOverlay() {
    this.refs.overlay.hidden = !this.state.overlay.visible;
    this.refs.overlayTitle.textContent = this.state.overlay.title;
    this.refs.overlayBody.textContent = this.state.overlay.body;
    this.refs.overlayPrimary.textContent = this.state.overlay.primaryLabel;
  }

  startDialogue(lines, onComplete = null) {
    this.state.activeDialogue = {
      lines,
      index: 0,
      onComplete,
    };
    this.syncHud();
  }

  advanceDialogue() {
    if (!this.state.activeDialogue) {
      return;
    }

    const dialogue = this.state.activeDialogue;

    if (dialogue.index < dialogue.lines.length - 1) {
      dialogue.index += 1;
      this.syncHud();
      return;
    }

    const onComplete = dialogue.onComplete;
    this.state.activeDialogue = null;
    this.syncHud();
    onComplete?.();
  }

  getGroundY(x) {
    if (x < 244) {
      return 144;
    }

    if (x < 660) {
      return 140;
    }

    if (x < 760) {
      return 136;
    }

    if (x < 930) {
      return 138;
    }

    return 144;
  }

  getStandingPlatform(playerX, previousBottom, nextBottom) {
    return (
      platforms.find((platform) => {
        const withinPlatform =
          playerX + PLAYER_WIDTH / 2 > platform.left && playerX - PLAYER_WIDTH / 2 < platform.right;
        const crossesTop = previousBottom <= platform.top && nextBottom >= platform.top;

        return withinPlatform && crossesTop;
      }) ?? null
    );
  }

  isInteractableVisible(interactable) {
    if (interactable.id === 'saya') {
      return [
        'meet-saya',
        'arena-ready',
        'arena-battle',
        'after-arena',
        'boss-battle',
        'escape',
      ].includes(this.state.phase);
    }

    if (interactable.id === 'bell-shell') {
      return ['after-arena', 'boss-battle', 'escape', 'complete'].includes(this.state.phase);
    }

    if (interactable.id === 'rope-line') {
      return ['escape', 'complete'].includes(this.state.phase);
    }

    return true;
  }

  getInteractableById(id) {
    return interactableDefs.find((interactable) => interactable.id === id);
  }

  getCurrentInteractable() {
    const playerPoint = { x: this.state.player.x, y: this.state.player.y };
    const candidates = interactableDefs
      .filter((item) => this.isInteractableVisible(item))
      .map((item) => ({ ...item, distance: distanceBetween(playerPoint, item) }))
      .filter((item) => item.distance <= item.radius)
      .sort((left, right) => left.distance - right.distance);

    return candidates[0] ?? null;
  }

  handleInteraction() {
    const interactable = this.getCurrentInteractable();

    if (!interactable) {
      return;
    }

    switch (interactable.id) {
      case 'cart':
        this.pushLog(
          '수레 바퀴가 멈춘 채 떨리고 있다. 항구 전체가 단순 정지가 아니라 비틀린 상태다.'
        );
        this.setBanner('조사 로그가 현장 기록에 남았습니다', 1.6);
        break;
      case 'rope-bundle':
        this.pushLog('젖지 않은 밧줄이 세 번 같은 자리에서 묶여 있다. 시간을 되감는 손놀림이다.');
        break;
      case 'medicine':
        this.pushLog('약상자 뚜껑 안쪽에 따뜻한 체온이 남아 있지만, 항구에는 아침 냄새가 없다.');
        break;
      case 'lever':
        this.pushLog('등대 레버가 반 박자씩 뒤로 밀린다. 누군가 밤을 고정해 둔 것처럼 보인다.');
        break;
      case 'fisherman':
        this.startDialogue([
          { speaker: '어부', text: '밧줄을 세 번 묶어야 폭풍이 안 와. 분명 아까도 그랬어.' },
          { speaker: '플레이어', text: '폭풍은 아직 안 왔잖아요.' },
          { speaker: '어부', text: '왔어. 아니, 올 거야. 왜 다들 젖지도 않았지.' },
        ]);
        break;
      case 'saya':
        if (!this.state.flags.metSaya) {
          this.startDialogue(
            [
              {
                speaker: '사야 렌',
                text: '올 줄 알았어. 잔향을 들은 사람이라면 탑으로 올 수밖에 없으니까.',
              },
              { speaker: '플레이어', text: '당신이 신호를 보냈지. 대체 무슨 일이야.' },
              {
                speaker: '사야 렌',
                text: '누군가 새벽종을 부쉈어. 여기선 이제 아침이 잘려 나간 상태야.',
              },
              {
                speaker: '사야 렌',
                text: '먼저 하층을 정리하자. 내가 기록 경로를 열어 둘게. 너는 `선행 발자국`으로 빈틈을 메워.',
              },
            ],
            () => {
              this.state.flags.metSaya = true;
              this.state.player.dashUnlocked = true;
              this.state.phase = 'arena-ready';
              this.state.barriers.gateClosed = false;
              this.state.checkpointX = 728;
              this.state.checkpointPhase = 'arena-ready';
              this.setObjective('시계탑 하층을 돌파', [
                '사야 렌과 합류했다',
                'Shift로 선행 발자국을 사용해 전투에 대비한다',
              ]);
              this.pushLog('선행 발자국이 해금되었습니다. 짧은 무적 회피가 가능합니다.');
              this.setBanner('선행 발자국 해금', 2.2);
              this.syncHud();
            }
          );
        } else if (this.state.phase === 'after-arena') {
          this.startDialogue([
            {
              speaker: '사야 렌',
              text: '하층은 정리됐어. 이제 종 외피를 확인하면 방파제 쪽 탈출 경로가 보일 거야.',
            },
            {
              speaker: '사야 렌',
              text: '파수체가 나오면 무리해서 버티지 말고, `미도착 상처`로 충격을 한 번 늦춰.',
            },
          ]);
        }
        break;
      case 'bell-shell':
        if (this.state.phase === 'after-arena' && !this.state.flags.bellInspected) {
          this.state.flags.bellInspected = true;
          this.startDialogue(
            [
              { speaker: '플레이어', text: '이게 새벽종의 외피... 안쪽이 통째로 뜯겨 나가 있어.' },
              {
                speaker: '사야 렌',
                text: '핵심 공명축은 일곱 개야. 조각이 흩어지면 도시와 항로가 모두 어긋나기 시작해.',
              },
              { speaker: '백야', text: '확신은 늘 늦게 도착해. 하지만 파수체는 이미 너를 찾았어.' },
            ],
            () => {
              this.state.phase = 'boss-battle';
              this.state.player.wardUnlocked = true;
              this.state.checkpointX = 936;
              this.state.checkpointPhase = 'boss-battle';
              this.spawnBoss();
              this.setObjective('황혼 파수체를 제압', [
                'J 기본 공격으로 균열 게이지를 채운다',
                'R 미도착 상처로 큰 피해를 버틴다',
              ]);
              this.pushLog('미도착 상처가 해금되었습니다. 큰 충격을 한 번 지연시킵니다.');
              this.setBanner('황혼 파수체가 방파제를 봉쇄했다', 2.2);
              this.playTrack('crisis-pursuit');
            }
          );
        }
        break;
      case 'rope-line':
        if (this.state.phase === 'escape') {
          this.startDialogue(
            [
              { speaker: '라오 템', text: '둘 다 살아 있으면 뛰어. 설명은 배 위에서 해.' },
              { speaker: '사야 렌', text: '첫 종편 좌표가 잡혔어. 유리염 사구야.' },
              {
                speaker: '플레이어',
                text: '그래도 가야 해. 미라진을 이렇게 만든 조각이라면 반드시 찾아야 하니까.',
              },
            ],
            () => {
              this.finishRun();
            }
          );
        }
        break;
      default:
        break;
    }
  }

  handleListen() {
    const interactable = this.getCurrentInteractable();

    if (!interactable || interactable.type !== 'echo') {
      return;
    }

    if (this.state.echoesFound.has(interactable.id)) {
      this.pushLog('이미 회수한 잔향입니다.');
      return;
    }

    const echoLines = {
      'rope-bundle':
        '아직 오지 않은 폭풍 냄새가 밧줄에 남아 있다. 어부는 오지 않은 아침을 반복해서 기억하고 있다.',
      medicine:
        '약상자 안쪽에 손때가 남아 있다. 약사는 오늘 아침에 약을 건넸다고 믿지만, 항구엔 아침 냄새가 없다.',
      lever:
        '등대 레버가 미세하게 역회전한다. 누군가 밤이 끝나지 않도록 시간을 붙잡아 놓은 듯하다.',
    };

    this.state.echoesFound.add(interactable.id);
    this.pushLog(echoLines[interactable.id]);
    this.setBanner(`${interactable.label}의 잔향을 회수했습니다`, 1.8);

    if (this.state.echoesFound.size === 3 && this.state.phase === 'survey') {
      this.state.phase = 'meet-saya';
      this.state.barriers.gateClosed = false;
      this.setObjective('광장에서 사야 렌과 만나기', [
        '파문 기록기 3개를 모두 복구했다',
        '시계탑 외곽 광장으로 이동한다',
      ]);
      this.pushLog('사야 렌의 파문 기록이 시계탑 쪽에서 재생되기 시작한다.');
      this.setBanner('시계탑 광장이 개방되었습니다', 2.2);
    } else {
      this.syncHud();
    }
  }

  finishRun() {
    this.state.completed = true;
    this.state.started = false;
    this.state.phase = 'complete';
    this.state.encounter = '프롤로그 종료';
    this.state.overlay.visible = true;
    this.state.overlay.title = '프롤로그 종료';
    this.state.overlay.body =
      '미라진의 새벽은 아직 돌아오지 않았지만, 첫 항해의 방향은 정해졌습니다. 다음 목적지는 유리염 사구입니다.';
    this.state.overlay.primaryLabel = '처음부터 다시 플레이';
    this.playTrack('main-theme');
    this.pushLog('구조선이 방파제를 떠나며 프롤로그가 끝납니다.');
    this.syncOverlay();
    this.syncHud();
  }

  spawnArenaWave() {
    this.state.enemies = [createEnemy('wraith', 820), createEnemy('wraith', 892)];
    this.state.barriers.left = 760;
    this.state.barriers.right = 930;
    this.state.encounter = '하층 교전';
    this.playTrack('battle-skirmish');
  }

  spawnBoss() {
    this.state.enemies = [createEnemy('sentinel', 1022)];
    this.state.barriers.left = 910;
    this.state.barriers.right = 1098;
    this.state.encounter = '황혼 파수체';
  }

  resetEncounterFromCheckpoint() {
    this.state.player.hp = MAX_HP;
    this.state.player.resonance = MAX_RESONANCE;
    this.state.player.burden = Math.max(0, this.state.player.burden - 1);
    this.state.player.x = this.state.checkpointX;
    this.state.player.y = FLOOR_Y;
    this.state.player.vx = 0;
    this.state.player.vy = 0;
    this.state.player.onGround = true;
    this.state.player.attackTimer = 0;
    this.state.player.hitTimer = 0;
    this.state.player.invulnerableTimer = 1.1;
    this.state.player.dashTimer = 0;
    this.state.effects = [];
    this.state.shake = 0.4;

    if (
      this.state.checkpointPhase === 'arena-ready' ||
      this.state.checkpointPhase === 'arena-battle'
    ) {
      this.state.phase = 'arena-battle';
      this.spawnArenaWave();
      this.setObjective('시계탑 하층을 돌파', [
        '적을 모두 제압해 길을 확보한다',
        '공명과 회피를 함께 관리한다',
      ]);
    }

    if (this.state.checkpointPhase === 'boss-battle') {
      this.state.phase = 'boss-battle';
      this.spawnBoss();
      this.setObjective('황혼 파수체를 제압', [
        '균열 게이지를 채워 붕괴 상태를 만든다',
        '위험할 때는 R로 충격을 지연시킨다',
      ]);
      this.playTrack('crisis-pursuit');
    }

    this.pushLog('임시 닻 포인트에서 복구되었습니다.');
    this.setBanner('현장 복구 완료', 2);
  }

  consumeOneShotInput() {
    this.justPressed.clear();
  }

  isPressed(code) {
    return Boolean(this.keys.get(code));
  }

  wasPressed(code) {
    return this.justPressed.has(code);
  }

  update(dt) {
    this.state.elapsed += dt;

    if (this.state.banner.timer > 0) {
      this.state.banner.timer = Math.max(0, this.state.banner.timer - dt);
    }

    if (!this.state.started || this.state.completed) {
      this.updateCamera(dt);
      this.consumeOneShotInput();
      this.syncHud();
      return;
    }

    if (this.state.activeDialogue) {
      this.updateCamera(dt);
      this.consumeOneShotInput();
      this.syncHud();
      return;
    }

    if (this.wasPressed('KeyE')) {
      this.handleInteraction();
    }

    if (this.wasPressed('KeyQ')) {
      this.handleListen();
    }

    this.updatePhaseProgress();
    this.updatePlayer(dt);
    this.updateEnemies(dt);
    this.updateEffects(dt);
    this.updateCamera(dt);
    this.syncHud();
    this.consumeOneShotInput();
  }

  updatePhaseProgress() {
    if (
      this.state.phase === 'approach' &&
      this.state.player.x > 232 &&
      !this.state.flags.sawMarketObjective
    ) {
      this.state.phase = 'survey';
      this.state.flags.sawMarketObjective = true;
      this.setObjective('멈춘 어시장의 잔향을 조사', [
        `밧줄 묶음 잔향 회수 (${this.state.echoesFound.has('rope-bundle') ? '완료' : '미완료'})`,
        `약상자 잔향 회수 (${this.state.echoesFound.has('medicine') ? '완료' : '미완료'})`,
        `등대 레버 잔향 회수 (${this.state.echoesFound.has('lever') ? '완료' : '미완료'})`,
      ]);
      this.pushLog('세 군데 조사 지점에서 파문 잔향을 회수해 시계탑 경로를 복원해야 한다.');
      this.setBanner('새벽 청취로 잔향을 회수하세요', 2.4);
    }

    if (this.state.phase === 'arena-ready' && this.state.player.x > 770) {
      this.state.phase = 'arena-battle';
      this.spawnArenaWave();
      this.setObjective('시계탑 하층을 돌파', [
        '출현한 균열 생물 2체를 모두 제압한다',
        '공격으로 적의 균열 게이지를 누적한다',
      ]);
      this.pushLog('시계탑 하층에서 균열 생물이 튀어나왔다.');
      this.setBanner('전투 진입', 1.6);
    }

    if (
      this.state.phase === 'arena-battle' &&
      this.state.enemies.length === 0 &&
      !this.state.flags.arenaCleared
    ) {
      this.state.flags.arenaCleared = true;
      this.state.phase = 'after-arena';
      this.state.player.wardUnlocked = true;
      this.state.barriers.left = null;
      this.state.barriers.right = null;
      this.state.encounter = '탐험';
      this.setObjective('새벽종 외피를 조사', [
        '전투가 종료되었다',
        '새벽종 외피와 방파제 탈출 경로를 확인한다',
      ]);
      this.playTrack('mirajin-hub');
      this.pushLog('하층의 균열이 잠시 가라앉았다. 외피를 조사할 시간이다.');
      this.setBanner('미도착 상처 해금', 2.2);
    }

    if (
      this.state.phase === 'boss-battle' &&
      this.state.enemies.length === 0 &&
      !this.state.flags.bossCleared
    ) {
      this.state.flags.bossCleared = true;
      this.state.phase = 'escape';
      this.state.barriers.left = null;
      this.state.barriers.right = null;
      this.state.encounter = '탈출';
      this.setObjective('라오 템의 구조선에 탑승', [
        '황혼 파수체를 제압했다',
        '방파제 끝의 구조선으로 이동한다',
      ]);
      this.playTrack('main-theme');
      this.pushLog('파수체가 무너지고 방파제 끝에서 구조선이 닻을 맞춘다.');
      this.setBanner('탈출 경로 확보', 2.2);
    }
  }

  updatePlayer(dt) {
    const player = this.state.player;
    const moveIntent =
      (this.isPressed('ArrowRight') || this.isPressed('KeyD') ? 1 : 0) -
      (this.isPressed('ArrowLeft') || this.isPressed('KeyA') ? 1 : 0);
    player.moveIntent = moveIntent;

    player.hitTimer = Math.max(0, player.hitTimer - dt);
    player.invulnerableTimer = Math.max(0, player.invulnerableTimer - dt);
    player.dashCooldown = Math.max(0, player.dashCooldown - dt);
    player.wardCooldown = Math.max(0, player.wardCooldown - dt);
    player.comboTimer = Math.max(0, player.comboTimer - dt);

    if (player.wardTimer > 0) {
      player.wardTimer = Math.max(0, player.wardTimer - dt);
    }

    if (!['arena-battle', 'boss-battle'].includes(this.state.phase)) {
      player.resonance = clamp(player.resonance + dt * 9, 0, MAX_RESONANCE);
    }

    if (this.wasPressed('Space') || this.wasPressed('ArrowUp') || this.wasPressed('KeyW')) {
      player.requestedJump = true;
    }

    if (player.requestedJump && player.onGround) {
      player.vy = -PLAYER_JUMP;
      player.onGround = false;
      player.requestedJump = false;
      this.state.effects.push({
        type: 'dust',
        x: player.x,
        y: player.y,
        timer: 0.3,
      });
    }

    if (
      (this.wasPressed('ShiftLeft') || this.wasPressed('ShiftRight')) &&
      player.dashUnlocked &&
      player.dashCooldown <= 0 &&
      player.resonance >= 14
    ) {
      player.dashTimer = PLAYER_DASH_DURATION;
      player.dashCooldown = 1.35;
      player.dashDirection = moveIntent || player.facing || 1;
      player.resonance = clamp(player.resonance - 14, 0, MAX_RESONANCE);
      this.state.effects.push({
        type: 'trail',
        x: player.x,
        y: player.y - 12,
        timer: 0.28,
        facing: player.dashDirection,
      });
      this.pushLog('선행 발자국으로 짧은 빈틈을 파고들었다.');
    }

    if (
      this.wasPressed('KeyR') &&
      player.wardUnlocked &&
      player.wardCooldown <= 0 &&
      player.resonance >= 22
    ) {
      player.wardTimer = 1.6;
      player.wardCooldown = 5.4;
      player.resonance = clamp(player.resonance - 22, 0, MAX_RESONANCE);
      this.setBanner('미도착 상처 활성화', 1.4);
    }

    if (this.wasPressed('KeyJ') && player.attackTimer <= 0) {
      player.attackStep = player.comboTimer > 0 ? (player.attackStep % 3) + 1 : 1;
      player.attackTimer = PLAYER_ATTACK_WINDOW;
      player.comboTimer = 0.42;
      player.attackHitIds.clear();
      this.state.effects.push({
        type: 'slash',
        x: player.x + player.facing * 14,
        y: player.y - 16,
        timer: 0.18,
        facing: player.facing,
        step: player.attackStep,
      });
    }

    if (player.attackTimer > 0) {
      player.attackTimer = Math.max(0, player.attackTimer - dt);
    }

    if (player.dashTimer > 0) {
      player.dashTimer = Math.max(0, player.dashTimer - dt);
      player.vx = player.dashDirection * PLAYER_DASH_SPEED;
      player.facing = player.dashDirection;
      player.invulnerableTimer = Math.max(player.invulnerableTimer, 0.12);
    } else {
      player.vx = moveIntent * PLAYER_SPEED;

      if (moveIntent !== 0) {
        player.facing = moveIntent;
      }
    }

    const previousBottom = player.y;
    player.vy = clamp(player.vy + GRAVITY * dt, -PLAYER_JUMP, MAX_FALL_SPEED);

    let nextX = player.x + player.vx * dt;
    let nextBottom = player.y + player.vy * dt;
    const platform = this.getStandingPlatform(nextX, previousBottom, nextBottom);
    const groundY = this.getGroundY(nextX);
    let landingY = groundY;

    if (platform) {
      landingY = Math.min(landingY, platform.top);
    }

    if (nextBottom >= landingY) {
      nextBottom = landingY;
      player.vy = 0;
      player.onGround = true;
    } else {
      player.onGround = false;
    }

    player.requestedJump = false;

    const leftBarrier = this.state.barriers.left;
    const rightBarrier = this.state.barriers.right;
    const gateLimit = this.state.barriers.gateClosed ? 664 : WORLD_WIDTH - 20;
    nextX = clamp(nextX, 18, gateLimit);

    if (leftBarrier !== null) {
      nextX = Math.max(nextX, leftBarrier + 10);
    }

    if (rightBarrier !== null) {
      nextX = Math.min(nextX, rightBarrier - 10);
    }

    player.x = nextX;
    player.y = nextBottom;

    if (player.attackTimer > 0.1 && player.attackTimer < 0.24) {
      this.resolvePlayerAttack();
    }

    if (player.hp <= 0) {
      this.resetEncounterFromCheckpoint();
    }
  }

  resolvePlayerAttack() {
    const player = this.state.player;
    const attackReach = 26 + player.attackStep * 4;
    const hitbox = {
      left: player.x + (player.facing > 0 ? 4 : -attackReach),
      right: player.x + (player.facing > 0 ? attackReach : -4),
      top: player.y - 24,
      bottom: player.y - 2,
    };

    this.state.enemies = this.state.enemies.filter((enemy) => {
      const enemyRect = {
        left: enemy.x - enemy.width / 2,
        right: enemy.x + enemy.width / 2,
        top: enemy.y - enemy.height,
        bottom: enemy.y,
      };

      if (!rectsIntersect(hitbox, enemyRect) || player.attackHitIds.has(enemy.id)) {
        return true;
      }

      player.attackHitIds.add(enemy.id);
      enemy.hurtTimer = 0.18;
      enemy.breakMeter += 14 + player.attackStep * 5;
      enemy.hp -= 14 + player.attackStep * 6;
      enemy.x += player.facing * 8;
      player.resonance = clamp(player.resonance + 6, 0, MAX_RESONANCE);
      this.state.shake = Math.max(this.state.shake, 0.22);
      this.state.effects.push({
        type: 'spark',
        x: enemy.x,
        y: enemy.y - enemy.height / 2,
        timer: 0.22,
      });

      if (enemy.breakMeter >= enemy.breakLimit) {
        enemy.breakMeter = 0;
        enemy.stunTimer = enemy.type === 'sentinel' ? 1.5 : 1.1;
        this.pushLog(
          `${enemy.type === 'sentinel' ? '황혼 파수체' : '균열 생물'}가 붕괴 상태에 빠졌다.`
        );
      }

      if (enemy.hp <= 0) {
        this.pushLog(`${enemy.type === 'sentinel' ? '황혼 파수체' : '균열 생물'}를 제압했다.`);
        return false;
      }

      return true;
    });
  }

  applyDamage(amount, sourceX) {
    const player = this.state.player;

    if (player.invulnerableTimer > 0) {
      return;
    }

    let finalDamage = amount;

    if (player.wardTimer > 0) {
      finalDamage = Math.ceil(amount * 0.35);
      player.wardTimer = 0;
      player.burden = clamp(player.burden + 1, 0, 3);
      this.pushLog('미도착 상처가 충격을 지연시켰다.');
    }

    player.hp = clamp(player.hp - finalDamage, 0, MAX_HP);
    player.hitTimer = 0.28;
    player.invulnerableTimer = 0.84;
    player.vx = sourceX < player.x ? 72 : -72;
    this.state.shake = Math.max(this.state.shake, 0.4);
  }

  updateEnemies(dt) {
    const player = this.state.player;

    this.state.enemies.forEach((enemy) => {
      enemy.attackCooldown = Math.max(0, enemy.attackCooldown - dt);
      enemy.stunTimer = Math.max(0, enemy.stunTimer - dt);
      enemy.hurtTimer = Math.max(0, enemy.hurtTimer - dt);

      if (enemy.stunTimer > 0) {
        return;
      }

      const dx = player.x - enemy.x;
      const distance = Math.abs(dx);
      enemy.facing = dx >= 0 ? 1 : -1;

      if (enemy.type === 'sentinel') {
        if (enemy.state === 'attack') {
          enemy.attackTimer += dt;

          if (enemy.attackTimer >= 0.36 && !enemy.windupDone) {
            enemy.windupDone = true;
            enemy.x += enemy.facing * 26;
            this.state.effects.push({
              type: 'slash',
              x: enemy.x + enemy.facing * 18,
              y: enemy.y - 14,
              timer: 0.22,
              facing: enemy.facing,
              step: 3,
              hostile: true,
            });

            if (distance < 38) {
              this.applyDamage(24, enemy.x);
            }
          }

          if (enemy.attackTimer >= 0.76) {
            enemy.state = 'idle';
            enemy.attackTimer = 0;
            enemy.windupDone = false;
            enemy.attackCooldown = 1.5;
          }

          return;
        }

        if (distance < enemy.attackRange && enemy.attackCooldown <= 0) {
          enemy.state = 'attack';
          enemy.attackTimer = 0;
          enemy.windupDone = false;
          this.setBanner('황혼 파수체가 크게 휘두를 준비를 한다', 0.9);
          return;
        }

        enemy.x += clamp(dx, -1, 1) * enemy.moveSpeed * dt;
        return;
      }

      if (enemy.state === 'attack') {
        enemy.attackTimer += dt;

        if (enemy.attackTimer > 0.18 && enemy.attackTimer < 0.28 && distance < 22) {
          this.applyDamage(12, enemy.x);
        }

        if (enemy.attackTimer >= 0.44) {
          enemy.state = 'idle';
          enemy.attackTimer = 0;
          enemy.attackCooldown = 1.1;
        }

        return;
      }

      if (distance < enemy.attackRange && enemy.attackCooldown <= 0) {
        enemy.state = 'attack';
        enemy.attackTimer = 0;
        return;
      }

      enemy.x += clamp(dx, -1, 1) * enemy.moveSpeed * dt;
    });
  }

  updateEffects(dt) {
    this.state.shake = Math.max(0, this.state.shake - dt * 0.7);
    this.state.effects = this.state.effects
      .map((effect) => ({ ...effect, timer: effect.timer - dt }))
      .filter((effect) => effect.timer > 0);
  }

  updateCamera(dt) {
    const targetX = clamp(this.state.player.x - CANVAS_WIDTH * 0.42, 0, WORLD_WIDTH - CANVAS_WIDTH);
    this.state.cameraX = lerp(this.state.cameraX, targetX, clamp(dt * 5.4, 0, 1));
    this.state.zone =
      ZONE_RANGES.find((range) => this.state.player.x <= range.max)?.label ?? '미라진 항구';
  }

  syncHud() {
    const player = this.state.player;
    const activeDialogue = this.state.activeDialogue;
    const activeInteractable = this.getCurrentInteractable();
    const objectiveSteps =
      this.state.phase === 'survey'
        ? [
            `밧줄 묶음 잔향 회수 (${this.state.echoesFound.has('rope-bundle') ? '완료' : '미완료'})`,
            `약상자 잔향 회수 (${this.state.echoesFound.has('medicine') ? '완료' : '미완료'})`,
            `등대 레버 잔향 회수 (${this.state.echoesFound.has('lever') ? '완료' : '미완료'})`,
          ]
        : this.state.objective.steps;

    this.refs.hpFill.style.width = `${(player.hp / MAX_HP) * 100}%`;
    this.refs.hpText.textContent = `${Math.round(player.hp)} / ${MAX_HP}`;
    this.refs.resonanceFill.style.width = `${(player.resonance / MAX_RESONANCE) * 100}%`;
    this.refs.resonanceText.textContent = `${Math.round(player.resonance)} / ${MAX_RESONANCE}`;

    this.refs.burdenNodes.forEach((node, index) => {
      node.classList.toggle('is-active', index < player.burden);
    });

    this.refs.objectiveTitle.textContent =
      this.state.banner.timer > 0 ? this.state.banner.text : this.state.objective.title;
    this.refs.objectiveList.innerHTML = objectiveSteps.map((step) => `<li>${step}</li>`).join('');
    this.refs.logList.innerHTML = this.state.logs.map((log) => `<li>${log}</li>`).join('');

    let promptText = '';

    if (activeInteractable) {
      if (
        activeInteractable.type === 'echo' &&
        !this.state.echoesFound.has(activeInteractable.id)
      ) {
        promptText = `E 조사 · Q 새벽 청취 · ${activeInteractable.label}`;
      } else if (activeInteractable.id === 'bell-shell' && this.state.phase === 'after-arena') {
        promptText = `E 활성화 · ${activeInteractable.label}`;
      } else if (activeInteractable.id === 'rope-line' && this.state.phase === 'escape') {
        promptText = `E 탑승 · ${activeInteractable.label}`;
      } else {
        promptText = `E 상호작용 · ${activeInteractable.label}`;
      }
    }

    this.refs.promptText.textContent = promptText;
    this.refs.promptCard.classList.toggle('is-visible', Boolean(promptText) && !activeDialogue);

    this.refs.zoneBadge.textContent = this.state.zone;
    this.refs.echoBadge.textContent = `잔향 ${this.state.echoesFound.size}/3`;
    this.refs.encounterBadge.textContent = this.state.encounter;

    this.refs.zoneStatus.textContent = this.state.zone;
    this.refs.progressStatus.textContent = `잔향 ${this.state.echoesFound.size} / 3`;
    this.refs.phaseStatus.textContent = this.getPhaseTitle();
    this.refs.phaseMeta.textContent = this.getPhaseMeta();

    this.refs.audioTrack.textContent = `현재 트랙: ${buildTrackLabel(this.state.currentTrackId)}${this.state.audioEnabled ? '' : ' (대기 중)'}`;
    this.refs.audioToggle.textContent = this.state.audioEnabled ? 'BGM 끄기' : 'BGM 켜기';

    this.refs.skillDash.classList.toggle('is-locked', !player.dashUnlocked);
    this.refs.skillDash.classList.toggle(
      'is-ready',
      player.dashUnlocked && player.dashCooldown <= 0
    );
    this.refs.skillWard.classList.toggle('is-locked', !player.wardUnlocked);
    this.refs.skillWard.classList.toggle(
      'is-ready',
      player.wardUnlocked && player.wardCooldown <= 0
    );

    if (activeDialogue) {
      this.refs.dialogue.hidden = false;
      this.refs.dialogueSpeaker.textContent = activeDialogue.lines[activeDialogue.index].speaker;
      this.refs.dialogueText.textContent = activeDialogue.lines[activeDialogue.index].text;
    } else {
      this.refs.dialogue.hidden = true;
    }

    this.syncOverlay();
  }

  getPhaseTitle() {
    const mapping = {
      title: '프롤로그 준비',
      opening: '도입 대화',
      approach: '이동 튜토리얼',
      survey: '어시장 조사',
      'meet-saya': '사야 렌 합류',
      'arena-ready': '시계탑 진입',
      'arena-battle': '하층 전투',
      'after-arena': '새벽종 조사',
      'boss-battle': '황혼 파수체',
      escape: '구조선 탑승',
      complete: '프롤로그 종료',
    };

    return mapping[this.state.phase] ?? '프롤로그';
  }

  getPhaseMeta() {
    const mapping = {
      title: '게임 시작 버튼을 눌러 프롤로그를 열 수 있습니다.',
      opening: '도입 대사를 통해 사라진 새벽과 첫 목표를 제시합니다.',
      approach: '오른쪽으로 이동하며 항구 초입을 확인합니다.',
      survey: '세 개의 조사 지점에서 새벽 청취를 사용하세요.',
      'meet-saya': '시계탑 외곽 광장에서 사야 렌과 합류합니다.',
      'arena-ready': '하층 입구로 전진해 전투를 시작하세요.',
      'arena-battle': '균열 생물을 제압하고 길을 확보하세요.',
      'after-arena': '새벽종 외피를 조사해 다음 장면으로 넘어갑니다.',
      'boss-battle': '황혼 파수체를 브레이크시키며 방파제를 지켜내세요.',
      escape: '구조선에 탑승하면 프롤로그가 종료됩니다.',
      complete: '다음 목적지는 유리염 사구입니다.',
    };

    return mapping[this.state.phase] ?? '프롤로그를 진행 중입니다.';
  }

  loop(timestamp) {
    const deltaSeconds = clamp((timestamp - this.previousTimestamp) / 1000 || 0, 0, 0.05);
    this.previousTimestamp = timestamp;
    this.update(deltaSeconds);
    this.render();
    this.frameHandle = window.requestAnimationFrame((nextTimestamp) => this.loop(nextTimestamp));
  }

  render() {
    const ctx = this.context;
    const shakeOffsetX =
      this.state.shake > 0 ? Math.round((Math.random() - 0.5) * this.state.shake * 8) : 0;
    const shakeOffsetY =
      this.state.shake > 0 ? Math.round((Math.random() - 0.5) * this.state.shake * 5) : 0;
    const cameraX = this.state.cameraX + shakeOffsetX;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.save();
    ctx.translate(0, shakeOffsetY);

    this.drawBackdrop(ctx, cameraX);
    this.drawWorld(ctx, cameraX);
    this.drawCharacters(ctx, cameraX);
    this.drawEffects(ctx, cameraX);
    this.drawOverlayEffects(ctx);

    ctx.restore();
  }

  drawBackdrop(ctx, cameraX) {
    const skyGradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    skyGradient.addColorStop(0, '#2b3558');
    skyGradient.addColorStop(0.38, '#49385f');
    skyGradient.addColorStop(0.72, '#16324a');
    skyGradient.addColorStop(1, '#08121f');

    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.fillStyle = 'rgba(244, 198, 118, 0.22)';
    ctx.beginPath();
    ctx.arc(160, 40, 26, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    for (let index = 0; index < 28; index += 1) {
      const x = Math.round(((index * 41 + this.state.elapsed * 8) % (CANVAS_WIDTH + 80)) - 40);
      const y = 18 + ((index * 13) % 34);
      ctx.fillRect(x, y, 1, 1);
    }

    const farOffset = -cameraX * 0.18;
    ctx.fillStyle = '#14253a';
    for (let index = 0; index < 8; index += 1) {
      const x = Math.round(index * 56 + (farOffset % 56)) - 20;
      const height = 18 + (index % 3) * 6;
      ctx.fillRect(x, 104 - height, 40, height);
    }

    ctx.fillStyle = '#0b1a2a';
    for (let index = 0; index < 11; index += 1) {
      const x = Math.round(index * 36 + ((farOffset * 1.4) % 36)) - 16;
      const height = 14 + (index % 4) * 4;
      ctx.fillRect(x, 120 - height, 24, height);
    }

    ctx.fillStyle = '#1f5977';
    ctx.fillRect(0, 126, CANVAS_WIDTH, 54);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    for (let index = 0; index < 16; index += 1) {
      const waveY = 130 + ((index + Math.floor(this.state.elapsed * 4)) % 5);
      ctx.fillRect(index * 20, waveY, 10, 1);
    }
  }

  drawWorld(ctx, cameraX) {
    this.drawGround(ctx, cameraX);
    this.drawStructures(ctx, cameraX);
    this.drawPlatforms(ctx, cameraX);
    this.drawInteractables(ctx, cameraX);
    this.drawBarriers(ctx, cameraX);
  }

  drawGround(ctx, cameraX) {
    for (let screenX = -16; screenX <= CANVAS_WIDTH + 16; screenX += 16) {
      const worldX = cameraX + screenX + 8;
      const groundY = this.getGroundY(worldX);
      const tileX = Math.round(screenX);
      const top = Math.round(groundY);

      ctx.fillStyle = worldX < 660 ? '#4a3b37' : '#4e4648';
      ctx.fillRect(tileX, top, 16, CANVAS_HEIGHT - top);
      ctx.fillStyle = worldX < 660 ? '#856757' : '#72686a';
      ctx.fillRect(tileX, top, 16, 4);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.16)';
      ctx.fillRect(tileX, top + 8, 16, 1);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.fillRect(tileX, top + 4, 16, 1);
    }
  }

  drawStructures(ctx, cameraX) {
    const structures = [
      { x: 88, y: 92, w: 56, h: 48, tone: '#233145' },
      { x: 290, y: 86, w: 88, h: 56, tone: '#26354a' },
      { x: 430, y: 74, w: 68, h: 66, tone: '#2a3950' },
      { x: 688, y: 58, w: 84, h: 84, tone: '#314661' },
      { x: 938, y: 70, w: 92, h: 72, tone: '#2f3f55' },
    ];

    structures.forEach((item) => {
      const screenX = Math.round(item.x - cameraX);

      if (screenX < -item.w || screenX > CANVAS_WIDTH + item.w) {
        return;
      }

      ctx.fillStyle = item.tone;
      ctx.fillRect(screenX, item.y, item.w, item.h);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.fillRect(screenX + 6, item.y + 8, item.w - 12, 4);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      for (let row = 0; row < item.h; row += 12) {
        ctx.fillRect(screenX + 10, item.y + row + 14, item.w - 20, 1);
      }
    });

    const towerX = Math.round(716 - cameraX);
    ctx.fillStyle = '#384c64';
    ctx.fillRect(towerX, 34, 42, 102);
    ctx.fillStyle = '#516781';
    ctx.fillRect(towerX + 12, 20, 18, 14);
    ctx.fillStyle = '#6f8190';
    ctx.fillRect(towerX + 18, 42, 6, 48);
    ctx.fillRect(towerX + 10, 62, 22, 2);
  }

  drawPlatforms(ctx, cameraX) {
    platforms.forEach((platform) => {
      const screenX = Math.round(platform.left - cameraX);
      const width = Math.round(platform.right - platform.left);
      const colorBase = platform.style === 'wood' ? '#6a5142' : '#5f6770';
      const colorTop = platform.style === 'wood' ? '#a47d67' : '#8f99a2';
      ctx.fillStyle = colorBase;
      ctx.fillRect(screenX, platform.top, width, 10);
      ctx.fillStyle = colorTop;
      ctx.fillRect(screenX, platform.top, width, 3);
      for (let braceX = screenX + 4; braceX < screenX + width; braceX += 14) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
        ctx.fillRect(braceX, platform.top + 3, 2, 10);
      }
    });
  }

  drawInteractables(ctx, cameraX) {
    interactableDefs.forEach((item) => {
      if (!this.isInteractableVisible(item)) {
        return;
      }

      const x = Math.round(item.x - cameraX);
      const y = Math.round(item.y);
      const isActive = item.id === this.getCurrentInteractable()?.id;

      if (item.id === 'cart') {
        ctx.fillStyle = '#65483d';
        ctx.fillRect(x - 10, y - 14, 20, 8);
        ctx.fillStyle = '#4a3129';
        ctx.fillRect(x - 12, y - 8, 8, 8);
        ctx.fillRect(x + 4, y - 8, 8, 8);
      }

      if (item.id === 'fisherman') {
        this.drawHumanoid(ctx, x, y, {
          palette: {
            coat: '#526983',
            coatDark: '#344457',
            scarf: '#c88a6a',
            skin: '#e4c7a4',
            hair: '#6f5846',
            metal: '#8b99a2',
          },
          facing: 1,
          role: 'dockhand',
          bobOffset: 1.6,
        });
      }

      if (['rope-bundle', 'medicine', 'lever', 'bell-shell', 'rope-line'].includes(item.id)) {
        this.drawDevice(ctx, x, y, item, isActive);
      }

      if (item.id === 'saya') {
        this.drawHumanoid(ctx, x, y, {
          palette: {
            coat: '#d1d7dd',
            coatDark: '#a5aab4',
            scarf: '#7fb8cf',
            skin: '#ead7c0',
            hair: '#97a2b0',
            metal: '#dbe4ef',
          },
          facing: -1,
          role: 'saya',
          bobOffset: 2.4,
        });
      }

      if (item.type !== 'npc' && isActive) {
        ctx.fillStyle = 'rgba(242, 197, 111, 0.8)';
        ctx.fillRect(x - 8, y - 32, 16, 2);
      }
    });
  }

  drawDevice(ctx, x, y, item, isActive) {
    if (item.id === 'rope-bundle') {
      ctx.fillStyle = '#7d6554';
      ctx.fillRect(x - 8, y - 10, 16, 10);
      ctx.fillStyle = '#d2b394';
      ctx.fillRect(x - 6, y - 7, 12, 2);
      ctx.fillRect(x - 6, y - 3, 12, 2);
    }

    if (item.id === 'medicine') {
      ctx.fillStyle = '#6d7d89';
      ctx.fillRect(x - 10, y - 16, 20, 14);
      ctx.fillStyle = '#d8e0e8';
      ctx.fillRect(x - 2, y - 13, 4, 8);
      ctx.fillRect(x - 5, y - 10, 10, 2);
    }

    if (item.id === 'lever') {
      ctx.fillStyle = '#6d5f58';
      ctx.fillRect(x - 6, y - 16, 12, 16);
      ctx.fillStyle = '#df7e67';
      ctx.fillRect(x + 2, y - 24, 4, 12);
      ctx.fillStyle = '#9fb7cb';
      ctx.fillRect(x - 4, y - 20, 8, 3);
    }

    if (item.id === 'bell-shell') {
      ctx.fillStyle = '#7d7083';
      ctx.fillRect(x - 16, y - 26, 32, 24);
      ctx.fillStyle = '#b9a9c2';
      ctx.fillRect(x - 10, y - 30, 20, 6);
      ctx.fillStyle = 'rgba(242, 197, 111, 0.24)';
      ctx.fillRect(x - 6, y - 20, 12, 10);
    }

    if (item.id === 'rope-line') {
      ctx.fillStyle = '#5c8fa1';
      ctx.fillRect(x - 2, y - 40, 4, 40);
      ctx.fillStyle = '#d7d2be';
      ctx.fillRect(x - 1, y - 40, 18, 2);
      ctx.fillRect(x + 14, y - 40, 2, 18);
    }

    if (isActive) {
      ctx.fillStyle = 'rgba(95, 191, 194, 0.3)';
      ctx.fillRect(x - 14, y - 34, 28, 2);
    }
  }

  drawBarriers(ctx, cameraX) {
    if (this.state.barriers.gateClosed) {
      const gateX = Math.round(674 - cameraX);
      ctx.fillStyle = 'rgba(130, 180, 214, 0.28)';
      ctx.fillRect(gateX, 72, 6, 72);
      ctx.fillStyle = 'rgba(95, 191, 194, 0.7)';
      ctx.fillRect(gateX + 2, 72, 2, 72);
    }

    ['left', 'right'].forEach((side) => {
      const barrier = this.state.barriers[side];

      if (barrier === null) {
        return;
      }

      const screenX = Math.round(barrier - cameraX);
      ctx.fillStyle = 'rgba(95, 191, 194, 0.22)';
      ctx.fillRect(screenX - 2, 48, 4, 96);
      ctx.fillStyle = 'rgba(242, 197, 111, 0.46)';
      ctx.fillRect(screenX - 1, 48, 2, 96);
    });
  }

  drawCharacters(ctx, cameraX) {
    const playerX = Math.round(this.state.player.x - cameraX);
    this.drawPlayer(ctx, playerX, this.state.player.y, this.state.player);

    this.state.enemies.forEach((enemy) => {
      const x = Math.round(enemy.x - cameraX);

      if (enemy.type === 'sentinel') {
        this.drawSentinel(ctx, x, enemy.y, enemy);
      } else {
        this.drawWraith(ctx, x, enemy.y, enemy);
      }
    });
  }

  drawPlayer(ctx, x, y, player) {
    const palette = {
      coat: '#2d5374',
      coatDark: '#19364d',
      scarf: '#d3b067',
      skin: '#e7cbac',
      hair: '#bcc8d3',
      metal: '#8db0c9',
      glow: '#f0d48f',
    };

    this.drawHumanoid(ctx, x, y, {
      palette,
      facing: player.facing,
      role: 'player',
      moving: Math.abs(player.vx) > 8 && player.onGround,
      attacking: player.attackTimer > 0,
      dashing: player.dashTimer > 0,
      hurt: player.hitTimer > 0,
      airborne: !player.onGround,
      warding: player.wardTimer > 0,
      bobOffset: 0,
      runtime: this.state.elapsed,
    });
  }

  drawHumanoid(ctx, x, y, options) {
    const {
      palette,
      facing = 1,
      role = 'player',
      moving = false,
      attacking = false,
      dashing = false,
      hurt = false,
      airborne = false,
      warding = false,
      runtime = this.state.elapsed,
      bobOffset = 0,
    } = options;
    const walkPhase = runtime * (moving ? 8.8 : 3.2) + bobOffset;
    const bob = airborne ? -2 : Math.round(Math.sin(walkPhase) * (moving ? 1.5 : 1));
    const legSwing = moving ? Math.round(Math.sin(walkPhase) * 2) : 0;
    const armSwing = moving ? Math.round(Math.sin(walkPhase + Math.PI) * 2) : 0;
    const attackReach = attacking ? 4 : 0;
    const lean = dashing ? 2 : attacking ? 1 : hurt ? -1 : 0;

    ctx.save();
    ctx.translate(x, y - 38 + bob);

    if (facing < 0) {
      ctx.translate(24, 0);
      ctx.scale(-1, 1);
    }

    ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
    ctx.fillRect(5, 36, 14, 2);

    if (warding) {
      ctx.fillStyle = 'rgba(95, 191, 194, 0.24)';
      ctx.fillRect(2, 6, 20, 26);
    }

    ctx.fillStyle = palette.coatDark;
    ctx.fillRect(8, 14, 8, 16);
    ctx.fillRect(6, 26, 12, 8);
    ctx.fillStyle = palette.coat;
    ctx.fillRect(7, 14, 10, 14);
    ctx.fillRect(5, 24, 14, 10);

    ctx.fillStyle = palette.coatDark;
    ctx.fillRect(8 + lean, 30, 4, 6);
    ctx.fillRect(12 + legSwing, 30, 4, 6);
    ctx.fillStyle = role === 'saya' ? palette.metal : palette.scarf;
    ctx.fillRect(10, 12, 4, 3);

    ctx.fillStyle = palette.skin;
    ctx.fillRect(8, 5, 8, 7);
    ctx.fillStyle = palette.hair;
    ctx.fillRect(7, 3, 10, 4);
    ctx.fillStyle = '#0e1821';
    ctx.fillRect(10, 8, 1, 1);
    ctx.fillRect(13, 8, 1, 1);

    ctx.fillStyle = palette.coatDark;
    ctx.fillRect(4, 16 + armSwing, 3, 10);
    ctx.fillRect(17 + attackReach, 15 - armSwing, 3, 11);

    if (role === 'player') {
      ctx.fillStyle = palette.metal;
      ctx.fillRect(18 + attackReach, 19, 6, 2);
      if (attacking) {
        ctx.fillStyle = 'rgba(240, 212, 143, 0.72)';
        ctx.fillRect(20 + attackReach, 17, 8, 4);
      }
    }

    if (role === 'saya') {
      ctx.fillStyle = palette.metal;
      ctx.fillRect(16, 17, 6, 7);
    }

    if (role === 'dockhand') {
      ctx.fillStyle = palette.scarf;
      ctx.fillRect(3, 18, 3, 6);
    }

    ctx.restore();
  }

  drawWraith(ctx, x, y, enemy) {
    const floatOffset = Math.round(Math.sin(this.state.elapsed * 5 + x * 0.03) * 2);
    ctx.save();
    ctx.translate(x, y - 20 + floatOffset);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.24)';
    ctx.fillRect(-8, 18, 16, 2);
    ctx.fillStyle = enemy.hurtTimer > 0 ? '#f9b0a3' : '#4f6c86';
    ctx.fillRect(-8, 0, 16, 12);
    ctx.fillStyle = '#d87070';
    ctx.fillRect(-2, 4, 4, 4);
    ctx.fillStyle = '#96c6dd';
    ctx.fillRect(-6, 12, 4, 3);
    ctx.fillRect(2, 12, 4, 3);
    ctx.restore();
    this.drawEnemyBar(ctx, x, y - 26, enemy);
  }

  drawSentinel(ctx, x, y, enemy) {
    const pulse = Math.round(Math.sin(this.state.elapsed * 3.6) * 1.4);
    ctx.save();
    ctx.translate(x, y - 32);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.24)';
    ctx.fillRect(-12, 30, 24, 2);
    ctx.fillStyle = enemy.hurtTimer > 0 ? '#fac1ae' : '#6d7488';
    ctx.fillRect(-12, 8, 24, 20);
    ctx.fillStyle = '#9ba6ba';
    ctx.fillRect(-8, 0, 16, 10);
    ctx.fillStyle = '#f2c56f';
    ctx.fillRect(-3, 10 + pulse, 6, 6);
    ctx.fillStyle = '#44566e';
    ctx.fillRect(-15, 14, 3, 12);
    ctx.fillRect(12, 14, 3, 12);
    ctx.fillRect(-8, 28, 4, 6);
    ctx.fillRect(4, 28, 4, 6);
    ctx.restore();
    this.drawEnemyBar(ctx, x, y - 34, enemy);
  }

  drawEnemyBar(ctx, x, y, enemy) {
    const width = enemy.type === 'sentinel' ? 30 : 18;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.34)';
    ctx.fillRect(x - width / 2, y, width, 3);
    ctx.fillStyle = '#df7e67';
    ctx.fillRect(x - width / 2, y, width * (enemy.hp / enemy.maxHp), 2);
    ctx.fillStyle = '#5fbfc2';
    ctx.fillRect(x - width / 2, y + 2, width * (enemy.breakMeter / enemy.breakLimit), 1);
  }

  drawEffects(ctx, cameraX) {
    this.state.effects.forEach((effect) => {
      const x = Math.round(effect.x - cameraX);
      const alpha = clamp(effect.timer / 0.3, 0, 1);

      if (effect.type === 'slash') {
        ctx.fillStyle = effect.hostile
          ? `rgba(223, 126, 103, ${alpha * 0.7})`
          : `rgba(242, 197, 111, ${alpha * 0.7})`;
        ctx.fillRect(x - (effect.facing < 0 ? 10 : 0), Math.round(effect.y), 10 * effect.facing, 3);
      }

      if (effect.type === 'spark') {
        ctx.fillStyle = `rgba(255, 245, 210, ${alpha})`;
        ctx.fillRect(x - 3, Math.round(effect.y), 6, 2);
        ctx.fillRect(x - 1, Math.round(effect.y) - 3, 2, 8);
      }

      if (effect.type === 'trail') {
        ctx.fillStyle = `rgba(95, 191, 194, ${alpha * 0.55})`;
        ctx.fillRect(x - 10, Math.round(effect.y), 20, 8);
      }

      if (effect.type === 'dust') {
        ctx.fillStyle = `rgba(232, 212, 174, ${alpha * 0.7})`;
        ctx.fillRect(x - 8, Math.round(effect.y), 16, 2);
      }
    });
  }

  drawOverlayEffects(ctx) {
    if (this.state.player.wardTimer > 0) {
      ctx.fillStyle = 'rgba(95, 191, 194, 0.06)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    if (this.state.player.hitTimer > 0) {
      ctx.fillStyle = 'rgba(240, 118, 109, 0.08)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    if (this.state.player.burden >= 3) {
      ctx.fillStyle = 'rgba(242, 197, 111, 0.04)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
  }
}

new PrologueSlice(app);
