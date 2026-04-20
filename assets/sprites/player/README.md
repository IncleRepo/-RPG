# 주인공 스프라이트 에셋

`여명 인양사` 기본 모션 세트입니다.

## 콘셉트

- 반향해 세계관에 맞춘 황혼빛 항해자 실루엣
- 남청색 롱코트, 황동 장식, 비색 `내일결` 포인트
- 미래 잔향을 다루는 인양사 느낌이 보이도록 스카프와 결정 장비를 포함

## 기본 사양

- 캔버스: `72x96px`
- 배경: 투명
- 방향: 오른쪽 기준 단일 방향 세트
- 파일명: `<motion>_<frame>.png`

## 모션 구성

- `idle`: 4프레임
- `walk`: 6프레임
- `run`: 6프레임
- `jump`: 4프레임
- `fall`: 4프레임
- `attack`: 6프레임
- `hurt`: 3프레임
- `death`: 6프레임

## 재생성

```bash
npm run generate:player-sprites
```

위 명령은 PNG 프레임과 `player-motion-preview.png`, `player-motion-preview.gif`를 다시 생성합니다.
