# Prologue Vertical Slice Pixel Assets

프롤로그 버티컬 슬라이스용 도트 스타일 리소스입니다.

## 구성

- `sheets/hero-sheet.svg`: 플레이어 이동/공격/대시/피격 프레임
- `sheets/allies-sheet.svg`: 사야 렌, 라오 템, 백야 프레임
- `sheets/citizens-sheet.svg`: 조사 NPC 프레임
- `sheets/enemies-sheet.svg`: 균열 갈매기, 하역 인형, 황혼 파수체 프레임
- `sheets/harbor-tiles.svg`: 미라진 항구용 타일과 오브젝트
- `sheets/tower-tiles.svg`: 시계탑용 타일과 오브젝트
- `manifest.json`: 프레임 순서와 용도

## 재생성

```bash
node tools/generate-prologue-assets.mjs
```
