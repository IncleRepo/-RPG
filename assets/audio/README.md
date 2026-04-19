# Audio Assets

## 구조

- `assets/audio/bgm/`: 실제 배포용 OGG BGM 파일
- `src/content/audio/bgm-scenario-plan.md`: 시나리오 기준 음악 배치 문서
- `src/content/audio/bgm-manifest.json`: 트랙 메타데이터와 파일 경로
- `tools/generate-bgm.mjs`: 저장소 내부 합성 스크립트

## 재생성

```bash
npm run generate:bgm
```

위 명령은 다음을 수행한다.

- 각 트랙을 48kHz 스테레오로 오프라인 합성
- OGG 포맷으로 인코딩
- `src/content/audio/bgm-manifest.json` 갱신

## 관리 원칙

- 오디오 기획과 결과물은 모두 저장소 안에서 재현 가능해야 한다.
- 유명 곡 샘플이나 외부 상용 루프를 섞지 않는다.
- 파일명은 장면 목적이 드러나게 유지한다.
- 장면 배치 변경 시 먼저 `bgm-scenario-plan.md`를 수정한 뒤 실제 재생 연결을 반영한다.
