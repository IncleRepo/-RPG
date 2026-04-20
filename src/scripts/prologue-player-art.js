import optionA from '../../assets/art/player/prologue-player-option-a.png';
import optionB from '../../assets/art/player/prologue-player-option-b.png';
import optionC from '../../assets/art/player/prologue-player-option-c.png';
import masterSprite from '../../assets/art/player/prologue-player-master.png';
import idleKeyposes from '../../assets/art/player/prologue-player-idle-keyposes.png';
import review100 from '../../assets/art/player/prologue-player-review-100.png';
import review400 from '../../assets/art/player/prologue-player-review-400.png';
import previewLight from '../../assets/art/player/prologue-player-preview-light.png';
import previewDark from '../../assets/art/player/prologue-player-preview-dark.png';

export const prologuePlayerArt = Object.freeze({
  eyebrow: 'Issue #80 · Prologue Player Art',
  title: '프롤로그 플레이어 마스터 스프라이트 확정안',
  summary:
    '정지 기본 포즈 3안 중 B안을 마스터 스프라이트로 확정하고, 같은 비례를 유지한 idle 키포즈와 720p 검수 이미지를 함께 제출합니다.',
  decision: {
    selectedLabel: '마스터 스프라이트: B안',
    canvas: '기본 캔버스 32 x 48 px',
    review: '100%, 400%, 밝은 배경, 어두운 배경, 720p 검수 완료',
  },
  rationale: Object.freeze([
    '얼굴 중앙 2px 눈선과 피부 하이라이트를 먼저 읽히게 정리해 의상보다 인물이 먼저 보이도록 고정했습니다.',
    '머리, 얼굴, 목, 상의가 단일 청색 덩어리로 겹치지 않도록 머리와 피부, 상의 명도 차를 크게 벌렸습니다.',
    '외투 자락은 허벅지 중간에서 끊어 다리 실루엣과 보행 축이 100% 보기에서도 유지되게 설계했습니다.',
  ]),
  poseOptions: Object.freeze([
    {
      label: '안 A',
      image: optionA,
      note: '왼손 랜턴과 전방 기울기를 강조한 탐색형 정지 포즈입니다.',
    },
    {
      label: '안 B · 확정',
      image: optionB,
      note: '정면 축, 얼굴 가독성, 상하체 분리가 가장 안정적이어서 마스터 스프라이트로 채택했습니다.',
    },
    {
      label: '안 C',
      image: optionC,
      note: '허리 장비와 비대칭 무게중심을 더 강하게 준 현장형 포즈입니다.',
    },
  ]),
  deliverables: Object.freeze([
    {
      label: '마스터 스프라이트',
      image: masterSprite,
      note: '얼굴과 목선을 먼저 읽히게 정리한 최종 1종입니다.',
    },
    {
      label: 'Idle 키포즈',
      image: idleKeyposes,
      note: '상체 호흡, 시선 이동, 미세한 체중 변화를 4프레임 키포즈로 정리했습니다.',
    },
    {
      label: '100% 검수 시트',
      image: review100,
      note: '작은 크기에서 얼굴, 코트, 다리 분리 기준을 확인하는 시트입니다.',
    },
    {
      label: '400% 검수 시트',
      image: review400,
      note: '확대 시 픽셀 클러스터와 머리-피부-의상 경계를 확인하는 시트입니다.',
    },
    {
      label: '밝은 배경 720p 프리뷰',
      image: previewLight,
      note: '밝은 부두 배경 위에서 실루엣과 피부색 분리를 확인합니다.',
    },
    {
      label: '어두운 배경 720p 프리뷰',
      image: previewDark,
      note: '야간 배경 위에서 외곽과 얼굴 포인트 유지 여부를 확인합니다.',
    },
  ]),
  palette: Object.freeze([
    { name: 'Hair Shadow', hex: '#30445f', role: '머리 외곽과 실루엣 고정' },
    { name: 'Hair Mid', hex: '#4f698c', role: '머리 덩어리 분리' },
    { name: 'Hair Light', hex: '#7b93b3', role: '앞머리 하이라이트' },
    { name: 'Skin Shadow', hex: '#aa7458', role: '턱선과 목선 분리' },
    { name: 'Skin Base', hex: '#d89a74', role: '얼굴 기본색' },
    { name: 'Skin Light', hex: '#f0c3a1', role: '이마와 광대 하이라이트' },
    { name: 'Coat Dark', hex: '#1c4b63', role: '외투 실루엣 고정' },
    { name: 'Coat Base', hex: '#2f6d84', role: '젖은 남청 외투 기본색' },
    { name: 'Coat Light', hex: '#4c97ac', role: '몸통 면 분리' },
    { name: 'Shirt', hex: '#9fb8bf', role: '목 아래 상의 구분' },
    { name: 'Pants Dark', hex: '#39475f', role: '하체 암부' },
    { name: 'Pants Base', hex: '#556783', role: '하체 기본색' },
    { name: 'Pants Light', hex: '#7185a3', role: '무릎과 허벅지 면 분리' },
    { name: 'Leather', hex: '#9b6a4c', role: '장비 벨트와 소지품 포인트' },
    { name: 'Glow', hex: '#f5cf74', role: '이어피스와 새벽빛 악센트' },
  ]),
});
