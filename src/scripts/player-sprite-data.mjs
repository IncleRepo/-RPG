const deepClone = (value) => JSON.parse(JSON.stringify(value));

const makeFrame = (parts, note = '') => ({ parts, note });

export const SPRITE_CANVAS = Object.freeze({
  width: 48,
  height: 48,
  previewScale: 8,
  exportScale: 1,
});

export const PLAYER_SPRITE_CONCEPT = Object.freeze({
  name: '미라진 여명 인양사',
  role: '반향해 구조·인양 겸용 기본 주인공 프리셋',
  silhouette: '짧은 망토, 긴 코트, 허리 랜턴, 갈고리형 인양 장비가 함께 보이는 해양 판타지 실루엣',
  summary:
    '플레이어가 아직 정식 고정 외형을 갖지 않는 설정을 유지하면서도, 이동·전투·피격 시스템에 바로 연결할 수 있도록 만든 공용 제작용 주인공 세트다.',
  notes: [
    '기본 비율은 전체화면 RPG 기준으로 읽히도록 48x48 프레임 안에서 머리와 몸 비중을 키웠다.',
    '움직임은 목도리, 망토, 랜턴의 후행 동작으로 속도와 감정 변화를 읽게 설계했다.',
    '현재 PNG는 리그 기반 프로토타입 산출물이며, 스프라이트 에디터에서 프레임을 계속 다듬을 수 있다.',
  ],
});

export const PLAYER_SPRITE_PALETTE = Object.freeze({
  outline: '#12202d',
  coatMain: '#255f71',
  coatLight: '#3d8695',
  coatShadow: '#153643',
  scarf: '#cf765e',
  scarfLight: '#efb38f',
  skin: '#f0ccb0',
  hair: '#f4d5a4',
  hairShadow: '#b8875f',
  metal: '#a8c6d0',
  lantern: '#f0b14d',
  lanternCore: '#ffe39f',
  satchel: '#8f5f45',
  satchelShadow: '#57382d',
  cloth: '#c7d8db',
  clothShadow: '#77949a',
  boot: '#263743',
  ghost: '#6fa5aa',
});

export const PLAYER_PARTS = Object.freeze([
  { id: 'harpoon', label: '인양 장비' },
  { id: 'backArm', label: '뒤팔' },
  { id: 'backLeg', label: '뒤다리' },
  { id: 'scarf', label: '목도리' },
  { id: 'torso', label: '몸통' },
  { id: 'mantle', label: '망토' },
  { id: 'head', label: '머리' },
  { id: 'hair', label: '머리카락' },
  { id: 'satchel', label: '가방' },
  { id: 'lantern', label: '랜턴' },
  { id: 'frontLeg', label: '앞다리' },
  { id: 'frontArm', label: '앞팔' },
]);

export const PLAYER_DEFAULT_FRAME = Object.freeze({
  harpoon: { x: -11, y: 19, rotation: 60, scaleX: 1, scaleY: 1 },
  backArm: { x: -8, y: 16, rotation: 18, scaleX: 1, scaleY: 1 },
  backLeg: { x: -4, y: 28, rotation: 8, scaleX: 1, scaleY: 1 },
  scarf: { x: -1, y: 12, rotation: -10, scaleX: 1, scaleY: 1 },
  torso: { x: 0, y: 19, rotation: 0, scaleX: 1, scaleY: 1 },
  mantle: { x: 0, y: 14, rotation: 0, scaleX: 1, scaleY: 1 },
  head: { x: 0, y: 8, rotation: 0, scaleX: 1, scaleY: 1 },
  hair: { x: 0, y: 7, rotation: 0, scaleX: 1, scaleY: 1 },
  satchel: { x: 7, y: 23, rotation: 16, scaleX: 1, scaleY: 1 },
  lantern: { x: 10, y: 28, rotation: 8, scaleX: 1, scaleY: 1 },
  frontLeg: { x: 4, y: 28, rotation: -6, scaleX: 1, scaleY: 1 },
  frontArm: { x: 8, y: 16, rotation: -10, scaleX: 1, scaleY: 1 },
});

const idleFrames = [
  makeFrame(
    {
      head: { y: 8 },
      hair: { y: 7, rotation: -2 },
      scarf: { rotation: -12 },
      mantle: { rotation: -1 },
      backArm: { rotation: 18 },
      frontArm: { rotation: -12 },
      lantern: { rotation: 6 },
    },
    '호흡을 가다듬는 기본 자세'
  ),
  makeFrame({
    torso: { y: 18.5 },
    head: { y: 7.5 },
    hair: { y: 6.5, rotation: 0 },
    scarf: { x: -1.5, rotation: -4, scaleX: 1.04 },
    mantle: { rotation: 2, scaleY: 1.02 },
    backArm: { rotation: 20 },
    frontArm: { rotation: -8 },
    lantern: { x: 10.5, rotation: 12 },
  }),
  makeFrame({
    torso: { y: 18 },
    head: { y: 7.7 },
    hair: { y: 6.8, rotation: 2 },
    scarf: { x: -0.5, rotation: 3, scaleX: 1.08 },
    mantle: { rotation: 3 },
    frontLeg: { rotation: -4 },
    backLeg: { rotation: 6 },
    frontArm: { rotation: -6 },
    lantern: { x: 11, rotation: 16 },
  }),
  makeFrame({
    torso: { y: 18.6 },
    head: { y: 8.1 },
    hair: { y: 7.2, rotation: 0 },
    scarf: { rotation: -8, scaleX: 1.02 },
    mantle: { rotation: 0 },
    frontArm: { rotation: -10 },
    backArm: { rotation: 17 },
    lantern: { x: 10, rotation: 8 },
  }),
];

const walkFrames = [
  makeFrame({
    torso: { x: -0.3, rotation: -2 },
    head: { x: -0.4, rotation: -1 },
    scarf: { x: -2, rotation: -22, scaleX: 1.06 },
    mantle: { x: -0.6, rotation: -8 },
    backArm: { x: -9, rotation: 34 },
    frontArm: { x: 7, rotation: -34 },
    backLeg: { x: -5, rotation: 24 },
    frontLeg: { x: 5, rotation: -26 },
    lantern: { x: 10, y: 29, rotation: -12 },
    satchel: { rotation: 10 },
  }),
  makeFrame({
    torso: { rotation: -1 },
    scarf: { x: -1.6, rotation: -16, scaleX: 1.03 },
    mantle: { rotation: -4 },
    backArm: { rotation: 20 },
    frontArm: { rotation: -20 },
    backLeg: { rotation: 8 },
    frontLeg: { rotation: -8 },
    lantern: { rotation: 0 },
  }),
  makeFrame({
    torso: { x: 0.2, rotation: 1 },
    head: { x: 0.2, rotation: 1 },
    scarf: { x: -1, rotation: -6 },
    mantle: { x: 0.4, rotation: 2 },
    backArm: { rotation: 4 },
    frontArm: { rotation: -4 },
    backLeg: { rotation: -10 },
    frontLeg: { rotation: 14 },
    lantern: { x: 11, rotation: 10 },
    satchel: { rotation: 18 },
  }),
  makeFrame({
    torso: { x: 0.3, rotation: 2 },
    head: { x: 0.4, rotation: 1 },
    scarf: { x: -0.4, rotation: 8 },
    mantle: { x: 0.6, rotation: 8 },
    backArm: { x: -7, rotation: -18 },
    frontArm: { x: 9, rotation: 24 },
    backLeg: { x: -3, rotation: -24 },
    frontLeg: { x: 3, rotation: 26 },
    lantern: { x: 12, rotation: 18 },
    satchel: { rotation: 24 },
  }),
  makeFrame({
    torso: { rotation: 1 },
    scarf: { rotation: 2 },
    mantle: { rotation: 4 },
    backArm: { rotation: -6 },
    frontArm: { rotation: 8 },
    backLeg: { rotation: -8 },
    frontLeg: { rotation: 10 },
    lantern: { rotation: 12 },
  }),
  makeFrame({
    torso: { x: -0.2, rotation: -1 },
    head: { x: -0.3, rotation: -1 },
    scarf: { x: -1.6, rotation: -14, scaleX: 1.04 },
    mantle: { x: -0.4, rotation: -6 },
    backArm: { rotation: 18 },
    frontArm: { rotation: -18 },
    backLeg: { rotation: 12 },
    frontLeg: { rotation: -16 },
    lantern: { x: 10.5, rotation: -2 },
    satchel: { rotation: 14 },
  }),
];

const runFrames = [
  makeFrame({
    torso: { x: -1.2, y: 18, rotation: -10 },
    head: { x: -1.4, y: 7.5, rotation: -6 },
    scarf: { x: -3, rotation: -36, scaleX: 1.12, scaleY: 1.02 },
    mantle: { x: -1.5, rotation: -18, scaleX: 1.05 },
    backArm: { x: -10, rotation: 52 },
    frontArm: { x: 7, rotation: -52 },
    backLeg: { x: -6, rotation: 40 },
    frontLeg: { x: 6, rotation: -42 },
    satchel: { rotation: 8 },
    lantern: { x: 9, y: 30, rotation: -18 },
    harpoon: { x: -12, y: 18, rotation: 66 },
  }),
  makeFrame({
    torso: { x: -0.8, y: 18.2, rotation: -7 },
    head: { x: -0.9, y: 7.7, rotation: -4 },
    scarf: { x: -2.4, rotation: -24, scaleX: 1.08 },
    mantle: { x: -1.1, rotation: -12 },
    backArm: { rotation: 28 },
    frontArm: { rotation: -26 },
    backLeg: { rotation: 16 },
    frontLeg: { rotation: -18 },
    lantern: { rotation: -6 },
  }),
  makeFrame({
    torso: { x: 0.2, y: 18.3, rotation: -2 },
    head: { x: 0.1, y: 7.8, rotation: -1 },
    scarf: { x: -1.6, rotation: -8, scaleX: 1.04 },
    mantle: { rotation: -2 },
    backArm: { rotation: -4 },
    frontArm: { rotation: 12 },
    backLeg: { rotation: -12 },
    frontLeg: { rotation: 18 },
    lantern: { x: 11.4, rotation: 14 },
    satchel: { rotation: 20 },
  }),
  makeFrame({
    torso: { x: 0.8, y: 18.1, rotation: 4 },
    head: { x: 1, y: 7.6, rotation: 3 },
    scarf: { x: -0.6, rotation: 14, scaleX: 1.02 },
    mantle: { x: 1.1, rotation: 10, scaleX: 0.98 },
    backArm: { x: -7, rotation: -36 },
    frontArm: { x: 10, rotation: 48 },
    backLeg: { x: -3, rotation: -34 },
    frontLeg: { x: 3, rotation: 38 },
    lantern: { x: 12.4, rotation: 24 },
    satchel: { rotation: 28 },
    harpoon: { x: -10.5, y: 18.3, rotation: 52 },
  }),
  makeFrame({
    torso: { x: 0.4, y: 18.1, rotation: 1 },
    head: { x: 0.6, y: 7.7, rotation: 1 },
    scarf: { rotation: 4 },
    mantle: { rotation: 5 },
    backArm: { rotation: -10 },
    frontArm: { rotation: 24 },
    backLeg: { rotation: -18 },
    frontLeg: { rotation: 22 },
    lantern: { rotation: 16 },
  }),
  makeFrame({
    torso: { x: -0.4, y: 18.2, rotation: -5 },
    head: { x: -0.5, y: 7.7, rotation: -2 },
    scarf: { x: -2.3, rotation: -18, scaleX: 1.09 },
    mantle: { x: -0.8, rotation: -10 },
    backArm: { rotation: 18 },
    frontArm: { rotation: -18 },
    backLeg: { rotation: 10 },
    frontLeg: { rotation: -12 },
    lantern: { x: 10.4, rotation: -4 },
  }),
];

const jumpFrames = [
  makeFrame(
    {
      torso: { y: 20, scaleY: 0.95 },
      mantle: { y: 15, scaleY: 0.96 },
      head: { y: 9 },
      scarf: { rotation: -6 },
      backArm: { rotation: 12 },
      frontArm: { rotation: -16 },
      backLeg: { y: 30, rotation: 30, scaleY: 0.94 },
      frontLeg: { y: 30, rotation: -28, scaleY: 0.94 },
      lantern: { y: 29, rotation: 6 },
    },
    '점프 전 웅크림'
  ),
  makeFrame(
    {
      torso: { y: 17.6, rotation: -2, scaleY: 1.02 },
      mantle: { y: 12.6, rotation: -12, scaleY: 1.06 },
      head: { y: 6.4 },
      hair: { y: 5.6, rotation: -4 },
      scarf: { x: -2, rotation: -30, scaleX: 1.1 },
      backArm: { y: 14.5, rotation: 42 },
      frontArm: { y: 14.5, rotation: -42 },
      backLeg: { y: 26, rotation: 8, scaleY: 1.02 },
      frontLeg: { y: 26, rotation: -4, scaleY: 1.02 },
      lantern: { y: 26.4, rotation: -8 },
      satchel: { y: 21.8, rotation: 6 },
    },
    '도약'
  ),
  makeFrame(
    {
      torso: { y: 15.8, rotation: 1 },
      mantle: { y: 10.4, rotation: 8, scaleY: 1.08 },
      head: { y: 4.8 },
      hair: { y: 4, rotation: 2 },
      scarf: { x: -0.6, rotation: 18, scaleX: 1.08 },
      backArm: { y: 13.2, rotation: -14 },
      frontArm: { y: 13.2, rotation: 24 },
      backLeg: { y: 24.2, rotation: -12 },
      frontLeg: { y: 24.2, rotation: 20 },
      lantern: { y: 25, rotation: 18 },
      satchel: { y: 20.2, rotation: 24 },
    },
    '정점'
  ),
  makeFrame(
    {
      torso: { y: 17.2, rotation: 2 },
      mantle: { y: 11.8, rotation: 14 },
      head: { y: 6.2 },
      scarf: { x: 0.8, rotation: 24, scaleX: 1.04 },
      backArm: { rotation: -26 },
      frontArm: { rotation: 30 },
      backLeg: { rotation: -22 },
      frontLeg: { rotation: 24 },
      lantern: { y: 26.6, rotation: 24 },
      satchel: { rotation: 28 },
    },
    '착지 준비'
  ),
];

const fallFrames = [
  makeFrame(
    {
      torso: { y: 15.5, rotation: 0 },
      mantle: { y: 11, rotation: -6, scaleY: 1.06 },
      head: { y: 5 },
      hair: { y: 4.2, rotation: -2 },
      scarf: { x: -2.2, rotation: -34, scaleX: 1.14 },
      backArm: { y: 14, rotation: 58 },
      frontArm: { y: 14, rotation: -58 },
      backLeg: { y: 25, rotation: 16 },
      frontLeg: { y: 24.6, rotation: -14 },
      lantern: { y: 25.4, rotation: -12 },
    },
    '낙하 시작'
  ),
  makeFrame({
    torso: { y: 14.8, rotation: -3 },
    mantle: { y: 10, rotation: -14, scaleY: 1.1 },
    head: { y: 4.1 },
    hair: { y: 3.2, rotation: -6 },
    scarf: { x: -3.2, rotation: -44, scaleX: 1.16 },
    backArm: { rotation: 74 },
    frontArm: { rotation: -70 },
    backLeg: { rotation: 4 },
    frontLeg: { rotation: 6 },
    lantern: { x: 8.4, rotation: -24 },
    satchel: { rotation: 2 },
  }),
  makeFrame({
    torso: { y: 15.2, rotation: -1 },
    mantle: { y: 10.6, rotation: -10, scaleY: 1.08 },
    head: { y: 4.4 },
    hair: { y: 3.6, rotation: -4 },
    scarf: { x: -2.6, rotation: -36, scaleX: 1.12 },
    backArm: { rotation: 42 },
    frontArm: { rotation: -36 },
    backLeg: { rotation: -18 },
    frontLeg: { rotation: 24 },
    lantern: { x: 11.4, rotation: 18 },
    satchel: { rotation: 24 },
  }),
  makeFrame(
    {
      torso: { y: 16.6, rotation: 4 },
      mantle: { y: 12.2, rotation: 16 },
      head: { y: 5.8, rotation: 2 },
      scarf: { x: 0.8, rotation: 20, scaleX: 1.04 },
      backArm: { rotation: -10 },
      frontArm: { rotation: 14 },
      backLeg: { rotation: -32 },
      frontLeg: { rotation: 34 },
      lantern: { x: 12.6, rotation: 26 },
      satchel: { rotation: 30 },
    },
    '착지 직전'
  ),
];

const attackFrames = [
  makeFrame(
    {
      torso: { x: -0.8, rotation: -8 },
      head: { x: -0.4, rotation: -5 },
      scarf: { x: -2.2, rotation: -22 },
      mantle: { x: -0.6, rotation: -10 },
      backArm: { x: -10, rotation: 42 },
      frontArm: { x: 7, rotation: -48, scaleY: 1.02 },
      backLeg: { rotation: 18 },
      frontLeg: { rotation: -18 },
      harpoon: { x: -12.2, y: 18.2, rotation: 78, scaleY: 1.04 },
      lantern: { rotation: -10 },
    },
    '준비 동작'
  ),
  makeFrame({
    torso: { x: -1.4, rotation: -14 },
    head: { x: -0.8, rotation: -8 },
    scarf: { x: -3, rotation: -36, scaleX: 1.08 },
    mantle: { x: -1.2, rotation: -18, scaleY: 1.04 },
    backArm: { rotation: 60 },
    frontArm: { x: 5.8, rotation: -78, scaleY: 1.06 },
    backLeg: { rotation: 28 },
    frontLeg: { rotation: -30 },
    harpoon: { x: -13, y: 18, rotation: 108, scaleY: 1.08 },
    lantern: { x: 9, rotation: -24 },
  }),
  makeFrame(
    {
      torso: { x: 0.2, rotation: -4 },
      head: { x: 0.4, rotation: -1 },
      scarf: { x: -0.6, rotation: -8 },
      mantle: { x: 0.4, rotation: -2 },
      backArm: { x: -8, rotation: 8 },
      frontArm: { x: 11, rotation: 10, scaleX: 1.05 },
      backLeg: { rotation: -4 },
      frontLeg: { rotation: 8 },
      harpoon: { x: 12, y: 11, rotation: 8, scaleY: 1.1 },
      lantern: { x: 12.6, y: 27.8, rotation: 22 },
      satchel: { rotation: 26 },
    },
    '공격 최대 가속'
  ),
  makeFrame({
    torso: { x: 1.4, rotation: 6 },
    head: { x: 1.4, rotation: 4 },
    scarf: { x: 1.6, rotation: 18, scaleX: 1.06 },
    mantle: { x: 1.4, rotation: 16, scaleY: 1.04 },
    backArm: { x: -6.6, rotation: -28 },
    frontArm: { x: 12.4, rotation: 40, scaleX: 1.06 },
    backLeg: { x: -2, rotation: -22 },
    frontLeg: { x: 2, rotation: 24 },
    harpoon: { x: 16.6, y: 14.6, rotation: -26, scaleY: 1.02 },
    lantern: { x: 13.6, y: 29.2, rotation: 34 },
    satchel: { rotation: 30 },
  }),
  makeFrame({
    torso: { x: 0.8, rotation: 4 },
    head: { x: 0.8, rotation: 3 },
    scarf: { x: 1.2, rotation: 14 },
    mantle: { x: 0.8, rotation: 10 },
    backArm: { rotation: -18 },
    frontArm: { rotation: 24 },
    backLeg: { rotation: -12 },
    frontLeg: { rotation: 16 },
    harpoon: { x: 8.8, y: 15.2, rotation: 20 },
    lantern: { rotation: 18 },
  }),
  makeFrame(
    {
      torso: { x: 0.1, rotation: 1 },
      head: { x: 0.1, rotation: 0 },
      scarf: { x: -0.4, rotation: 4 },
      mantle: { rotation: 3 },
      backArm: { rotation: 2 },
      frontArm: { rotation: 4 },
      backLeg: { rotation: -4 },
      frontLeg: { rotation: 6 },
      harpoon: { x: -4, y: 17.6, rotation: 54 },
      lantern: { rotation: 10 },
    },
    '회수'
  ),
];

const hurtFrames = [
  makeFrame(
    {
      torso: { x: -1, rotation: -12 },
      head: { x: -0.8, rotation: -10 },
      scarf: { x: -1.8, rotation: -18 },
      mantle: { x: -0.8, rotation: -16 },
      backArm: { rotation: 38 },
      frontArm: { rotation: -36 },
      backLeg: { rotation: 12 },
      frontLeg: { rotation: -10 },
      lantern: { x: 8.8, rotation: -20 },
      satchel: { rotation: 4 },
    },
    '피격 반응'
  ),
  makeFrame({
    torso: { x: -1.4, y: 19.6, rotation: -18, scaleY: 0.98 },
    head: { x: -1.2, y: 8.8, rotation: -14 },
    scarf: { x: -2.6, rotation: -30 },
    mantle: { x: -1.2, rotation: -24 },
    backArm: { rotation: 54 },
    frontArm: { rotation: -54 },
    backLeg: { rotation: 28 },
    frontLeg: { rotation: -24 },
    lantern: { x: 8, rotation: -34 },
    satchel: { rotation: -8 },
  }),
  makeFrame(
    {
      torso: { x: -0.2, rotation: -4 },
      head: { x: -0.2, rotation: -2 },
      scarf: { x: -1.2, rotation: -10 },
      mantle: { rotation: -6 },
      backArm: { rotation: 20 },
      frontArm: { rotation: -16 },
      backLeg: { rotation: 8 },
      frontLeg: { rotation: -6 },
      lantern: { rotation: -8 },
      satchel: { rotation: 8 },
    },
    '자세 회복'
  ),
];

const deathFrames = [
  makeFrame(
    {
      torso: { x: -1, rotation: -10 },
      head: { x: -0.8, rotation: -8 },
      scarf: { x: -1.8, rotation: -20 },
      mantle: { x: -1, rotation: -16 },
      backArm: { rotation: 30 },
      frontArm: { rotation: -28 },
      backLeg: { rotation: 18 },
      frontLeg: { rotation: -18 },
      lantern: { rotation: -18 },
    },
    '균형 상실'
  ),
  makeFrame({
    torso: { x: -1.8, y: 20.6, rotation: -24, scaleY: 0.96 },
    mantle: { x: -1.6, y: 15.2, rotation: -28, scaleY: 0.98 },
    head: { x: -1.4, y: 9.8, rotation: -18 },
    hair: { x: -0.6, y: 8.8, rotation: -12 },
    scarf: { x: -2.8, rotation: -32 },
    backArm: { rotation: 52 },
    frontArm: { rotation: -50 },
    backLeg: { y: 29.2, rotation: 28 },
    frontLeg: { y: 29.2, rotation: -26 },
    lantern: { x: 8, y: 29.8, rotation: -38 },
    satchel: { rotation: -10 },
  }),
  makeFrame(
    {
      torso: { x: -2.2, y: 23.4, rotation: -44, scaleY: 0.9, scaleX: 1.08 },
      mantle: { x: -2.2, y: 18.4, rotation: -46, scaleY: 0.94, scaleX: 1.08 },
      head: { x: -2.6, y: 13, rotation: -28 },
      hair: { x: -1.4, y: 12, rotation: -20 },
      scarf: { x: -3.6, y: 15.2, rotation: -42, scaleX: 1.08 },
      backArm: { x: -9.6, y: 18.8, rotation: 88 },
      frontArm: { x: 6.2, y: 18.6, rotation: -86 },
      backLeg: { x: -5, y: 30.8, rotation: 14, scaleY: 1.02 },
      frontLeg: { x: 2.6, y: 31.2, rotation: -56, scaleY: 1.02 },
      lantern: { x: 6, y: 31.4, rotation: -72 },
      satchel: { x: 5.2, y: 25.8, rotation: -28 },
      harpoon: { x: -10.6, y: 23.4, rotation: 18 },
    },
    '붕괴'
  ),
  makeFrame({
    torso: { x: -1.8, y: 26.2, rotation: -76, scaleY: 0.8, scaleX: 1.12 },
    mantle: { x: -1.8, y: 21.2, rotation: -74, scaleY: 0.84, scaleX: 1.1 },
    head: { x: -5.8, y: 17.6, rotation: -42 },
    hair: { x: -4.6, y: 16.8, rotation: -32 },
    scarf: { x: -4.8, y: 18.2, rotation: -58, scaleX: 1.14 },
    backArm: { x: -9.8, y: 22.4, rotation: 112 },
    frontArm: { x: 4.8, y: 22, rotation: -110 },
    backLeg: { x: -6.2, y: 32.4, rotation: -18 },
    frontLeg: { x: 0.8, y: 33, rotation: -84 },
    lantern: { x: 4.8, y: 32.8, rotation: -104 },
    satchel: { x: 3.4, y: 28.2, rotation: -54 },
    harpoon: { x: -9.2, y: 27.2, rotation: -8 },
  }),
  makeFrame({
    torso: { x: -0.6, y: 28.4, rotation: -88, scaleY: 0.74, scaleX: 1.16 },
    mantle: { x: -0.8, y: 22.8, rotation: -84, scaleY: 0.78, scaleX: 1.12 },
    head: { x: -7.6, y: 20.2, rotation: -52 },
    hair: { x: -6.2, y: 19.4, rotation: -40 },
    scarf: { x: -5.8, y: 20.4, rotation: -70, scaleX: 1.12 },
    backArm: { x: -10.2, y: 24.4, rotation: 124 },
    frontArm: { x: 3.6, y: 24.2, rotation: -124 },
    backLeg: { x: -6.6, y: 33.2, rotation: -32 },
    frontLeg: { x: -0.6, y: 34, rotation: -102 },
    lantern: { x: 3.8, y: 33.8, rotation: -118 },
    satchel: { x: 2.4, y: 29.4, rotation: -74 },
    harpoon: { x: -7.2, y: 29.8, rotation: -28 },
  }),
  makeFrame(
    {
      torso: { x: -0.4, y: 28.8, rotation: -90, scaleY: 0.72, scaleX: 1.16 },
      mantle: { x: -0.6, y: 23, rotation: -86, scaleY: 0.76, scaleX: 1.12 },
      head: { x: -8.4, y: 20.8, rotation: -54 },
      hair: { x: -6.8, y: 20, rotation: -42 },
      scarf: { x: -6.2, y: 20.8, rotation: -74, scaleX: 1.1 },
      backArm: { x: -10.4, y: 24.8, rotation: 128 },
      frontArm: { x: 3.2, y: 24.6, rotation: -128 },
      backLeg: { x: -6.8, y: 33.4, rotation: -36 },
      frontLeg: { x: -1, y: 34.2, rotation: -108 },
      lantern: { x: 3.4, y: 34, rotation: -126 },
      satchel: { x: 2.2, y: 29.6, rotation: -80 },
      harpoon: { x: -6.8, y: 30.2, rotation: -34 },
    },
    '정지'
  ),
];

export const PLAYER_MOTIONS = Object.freeze({
  idle: {
    label: 'Idle',
    description: '대기 호흡과 장비의 잔흔이 드러나는 기본 자세',
    fps: 6,
    frames: idleFrames,
  },
  walk: {
    label: 'Walk',
    description: '현장 탐색과 항구 이동에 맞춘 기본 이동',
    fps: 10,
    frames: walkFrames,
  },
  run: {
    label: 'Run',
    description: '긴박한 탈출과 돌진을 위한 가속 동작',
    fps: 12,
    frames: runFrames,
  },
  jump: {
    label: 'Jump',
    description: '웅크림부터 정점까지 묶은 점프 시퀀스',
    fps: 8,
    frames: jumpFrames,
  },
  fall: {
    label: 'Fall',
    description: '하강 중 자세와 착지 직전 긴장을 보여주는 시퀀스',
    fps: 8,
    frames: fallFrames,
  },
  attack: {
    label: 'Attack',
    description: '인양 장비를 휘두르는 근접 공격 시퀀스',
    fps: 12,
    frames: attackFrames,
  },
  hurt: {
    label: 'Hurt',
    description: '짧고 강한 피격 반응',
    fps: 8,
    frames: hurtFrames,
  },
  death: {
    label: 'Death',
    description: '균형 붕괴 후 쓰러져 정지하는 시퀀스',
    fps: 8,
    frames: deathFrames,
  },
});

const expandFrame = (motionId, frameIndex, frame) => {
  const merged = deepClone(PLAYER_DEFAULT_FRAME);

  Object.entries(frame.parts).forEach(([partId, values]) => {
    Object.assign(merged[partId], values);
  });

  return {
    id: `${motionId}-${String(frameIndex).padStart(2, '0')}`,
    fileName: `${motionId}_${String(frameIndex).padStart(2, '0')}.png`,
    note: frame.note,
    parts: merged,
  };
};

export function createPlayerMotionSet() {
  return Object.entries(PLAYER_MOTIONS).reduce((accumulator, [motionId, motion]) => {
    accumulator[motionId] = {
      ...motion,
      frames: motion.frames.map((frame, index) => expandFrame(motionId, index, frame)),
    };

    return accumulator;
  }, {});
}

export function createPlayerAssetManifest() {
  const motions = createPlayerMotionSet();
  const frameCount = Object.values(motions).reduce(
    (total, motion) => total + motion.frames.length,
    0
  );

  return {
    concept: PLAYER_SPRITE_CONCEPT,
    canvas: SPRITE_CANVAS,
    palette: PLAYER_SPRITE_PALETTE,
    frameCount,
    motions: Object.entries(motions).map(([motionId, motion]) => ({
      id: motionId,
      label: motion.label,
      description: motion.description,
      fps: motion.fps,
      frames: motion.frames.map((frame) => ({
        id: frame.id,
        note: frame.note,
        fileName: frame.fileName,
      })),
    })),
  };
}
