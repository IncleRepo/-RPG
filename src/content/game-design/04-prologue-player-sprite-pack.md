# 프롤로그 플레이어 스프라이트 팩

## 문서 목적

- 이 문서는 이슈 `#80` 산출물 기준으로 제작한 프롤로그 플레이어 도트 시트의 고정안을 정리한다.
- 이번 범위는 시스템 연결이 아니라 `실루엣`, `팔레트`, `핵심 모션 시트` 확보에 집중한다.

## 산출물 경로

- 메인 미리보기: `assets/sprites/player/prologue/player-720p-preview.png`
- 통합 아틀라스: `assets/sprites/player/prologue/player-motion-atlas.png`
- 모션별 시트:
- `assets/sprites/player/prologue/player-idle-sheet.png`
- `assets/sprites/player/prologue/player-walk-sheet.png`
- `assets/sprites/player/prologue/player-run-sheet.png`
- `assets/sprites/player/prologue/player-jump-start-sheet.png`
- `assets/sprites/player/prologue/player-jump-rise-sheet.png`
- `assets/sprites/player/prologue/player-fall-sheet.png`
- `assets/sprites/player/prologue/player-land-sheet.png`
- `assets/sprites/player/prologue/player-attack-1-sheet.png`
- `assets/sprites/player/prologue/player-attack-2-sheet.png`
- `assets/sprites/player/prologue/player-attack-3-sheet.png`
- `assets/sprites/player/prologue/player-heavy-attack-sheet.png`
- `assets/sprites/player/prologue/player-hit-sheet.png`
- 생성 기록: `assets/sprites/player/prologue/generation-manifest.txt`

## 실루엣 고정안

- 긴 방수 외투가 먼저 읽히도록 하체보다 코트 기둥을 크게 잡았다.
- 한쪽으로 기운 장비 벨트와 허리 랜턴으로 `인양사` 생활감을 남겼다.
- 등 뒤 장비와 짧은 검 실루엣을 분리해서 비전투 프레임에서도 장비 인지가 가능하게 했다.
- 정면이 아닌 우향 기준 포즈로 보행 자세와 상체 추진력을 우선 고정했다.

## 기본 팔레트

- 외투 암부: `#233f53`
- 외투 중간톤: `#305872`
- 외투 하이라이트: `#4d8494`
- 내피 / 셔츠: `#7c888e`
- 가죽 벨트 / 파우치: `#5c483b`, `#7b5f46`
- 금속: `#60797a`, `#a7b0b8`
- 피부: `#d1b396`
- 머리 / 외곽선: `#353a49`, `#13212a`
- 새벽빛 포인트: `#e6c57e`

## 프레임 구성

- `idle`: `32x48`, `8` 프레임
- `walk`: `32x48`, `8` 프레임
- `run`: `32x48`, `10` 프레임
- `jump_start`: `48x48`, `3` 프레임
- `jump_rise`: `48x48`, `3` 프레임
- `fall`: `48x48`, `3` 프레임
- `land`: `48x48`, `3` 프레임
- `attack_1`: `48x48`, `6` 프레임
- `attack_2`: `48x48`, `7` 프레임
- `attack_3`: `48x48`, `8` 프레임
- `heavy_attack`: `48x64`, `8` 프레임
- `hit`: `48x48`, `4` 프레임

## 문서 기준 대응

- 기본 대기 / 이동은 `32x48` 기준을 유지했다.
- 확장 액션은 `48x48`, 강공격은 `48x64`로 분리해 문서의 확장 캔버스 규격을 넘겼다.
- 이슈에서 요구한 모션은 모두 문서 하한선 이상 프레임으로 제작했다.
- 검수용 프리뷰는 `1280x720` 단일 PNG로 함께 산출했다.

## 이번 산출물의 해석 범위

- 방향별 분화나 전투 FX 확장은 이번 이슈 범위에 포함하지 않았다.
- 현재 시트는 프롤로그 플레이어 `1종`, 우향 기준 베이스라인 확정안이다.
- 이후 시스템 연결 단계에서는 본 시트의 실루엣, 팔레트, 프레임 밀도를 기준선으로 삼는다.
