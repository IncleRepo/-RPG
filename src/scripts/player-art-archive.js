import previewImage from '../../assets/sprites/player/prologue/player-720p-preview.png';
import atlasImage from '../../assets/sprites/player/prologue/player-motion-atlas.png';
import idleSheet from '../../assets/sprites/player/prologue/player-idle-sheet.png';
import walkSheet from '../../assets/sprites/player/prologue/player-walk-sheet.png';
import runSheet from '../../assets/sprites/player/prologue/player-run-sheet.png';
import jumpStartSheet from '../../assets/sprites/player/prologue/player-jump-start-sheet.png';
import jumpRiseSheet from '../../assets/sprites/player/prologue/player-jump-rise-sheet.png';
import fallSheet from '../../assets/sprites/player/prologue/player-fall-sheet.png';
import landSheet from '../../assets/sprites/player/prologue/player-land-sheet.png';
import attack1Sheet from '../../assets/sprites/player/prologue/player-attack-1-sheet.png';
import attack2Sheet from '../../assets/sprites/player/prologue/player-attack-2-sheet.png';
import attack3Sheet from '../../assets/sprites/player/prologue/player-attack-3-sheet.png';
import heavyAttackSheet from '../../assets/sprites/player/prologue/player-heavy-attack-sheet.png';
import hitSheet from '../../assets/sprites/player/prologue/player-hit-sheet.png';

export const playerArtArchive = Object.freeze({
  eyebrow: 'Issue #80 · Prologue Player Art',
  title: '프롤로그 플레이어 도트 스프라이트 팩',
  summary:
    '문서 규격에 맞춰 플레이어 1종의 실루엣, 팔레트, 핵심 모션 시트를 우향 기준으로 먼저 고정한 산출물입니다.',
  overviewImage: previewImage,
  atlasImage,
  metrics: Object.freeze([
    { label: '검수 해상도', value: '1280 x 720' },
    { label: '기본 캔버스', value: '32 x 48' },
    { label: '확장 캔버스', value: '48 x 48 / 48 x 64' },
    { label: '핵심 모션 수', value: '12종' },
    { label: '총 프레임', value: '71프레임' },
  ]),
  silhouetteNotes: Object.freeze([
    '긴 방수 외투',
    '기운 장비 벨트',
    '허리 랜턴',
    '등 장비 / 검',
    '전진형 보행 자세',
  ]),
  palette: Object.freeze([
    { name: 'Coat Shadow', hex: '#233f53' },
    { name: 'Coat Mid', hex: '#305872' },
    { name: 'Coat Light', hex: '#4d8494' },
    { name: 'Inner', hex: '#7c888e' },
    { name: 'Leather', hex: '#7b5f46' },
    { name: 'Metal', hex: '#a7b0b8' },
    { name: 'Skin', hex: '#d1b396' },
    { name: 'Dawn Glow', hex: '#e6c57e' },
  ]),
  motions: Object.freeze([
    {
      id: 'idle',
      title: 'idle',
      sheet: idleSheet,
      frameCount: 8,
      canvas: '32x48',
      fps: '8~10 FPS',
    },
    {
      id: 'walk',
      title: 'walk',
      sheet: walkSheet,
      frameCount: 8,
      canvas: '32x48',
      fps: '10~12 FPS',
    },
    { id: 'run', title: 'run', sheet: runSheet, frameCount: 10, canvas: '32x48', fps: '10~12 FPS' },
    {
      id: 'jump-start',
      title: 'jump_start',
      sheet: jumpStartSheet,
      frameCount: 3,
      canvas: '48x48',
      fps: '10~12 FPS',
    },
    {
      id: 'jump-rise',
      title: 'jump_rise',
      sheet: jumpRiseSheet,
      frameCount: 3,
      canvas: '48x48',
      fps: '10~12 FPS',
    },
    {
      id: 'fall',
      title: 'fall',
      sheet: fallSheet,
      frameCount: 3,
      canvas: '48x48',
      fps: '10~12 FPS',
    },
    {
      id: 'land',
      title: 'land',
      sheet: landSheet,
      frameCount: 3,
      canvas: '48x48',
      fps: '10~12 FPS',
    },
    {
      id: 'attack-1',
      title: 'attack_1',
      sheet: attack1Sheet,
      frameCount: 6,
      canvas: '48x48',
      fps: '12~16 FPS',
    },
    {
      id: 'attack-2',
      title: 'attack_2',
      sheet: attack2Sheet,
      frameCount: 7,
      canvas: '48x48',
      fps: '12~16 FPS',
    },
    {
      id: 'attack-3',
      title: 'attack_3',
      sheet: attack3Sheet,
      frameCount: 8,
      canvas: '48x48',
      fps: '12~16 FPS',
    },
    {
      id: 'heavy-attack',
      title: 'heavy_attack',
      sheet: heavyAttackSheet,
      frameCount: 8,
      canvas: '48x64',
      fps: '12~16 FPS',
    },
    { id: 'hit', title: 'hit', sheet: hitSheet, frameCount: 4, canvas: '48x48', fps: '12~16 FPS' },
  ]),
});
