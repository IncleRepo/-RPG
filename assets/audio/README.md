# Audio Notes

이 브랜치의 BGM은 정적 음원 파일을 저장하는 대신 `Web Audio API`로 브라우저 안에서 합성됩니다.

- 트랙 기획 문서: `src/content/audio/scenario-bgm-direction.md`
- 트랙 정의: `src/scripts/bgm-track-library.js`
- 재생 엔진: `src/scripts/bgm-manager.js`

이 구조를 택한 이유는 아래와 같습니다.

- 프로젝트 내부에서 음악 출처와 구현 방식을 단순하게 관리할 수 있습니다.
- 장면별 루프를 코드와 함께 버전 관리할 수 있습니다.
- 외부 샘플 의존도를 줄여 표절 및 라이선스 리스크를 낮출 수 있습니다.
