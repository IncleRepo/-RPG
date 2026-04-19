# 시나리오 기반 BGM 설계

## 작업 범위

이번 이슈에서는 아래 문서를 기준으로 장면별 음악 수요를 정리했다.

- `src/content/lore/story-overview.md`
- `src/content/lore/main-story.md`
- `src/content/lore/world-rules.md`
- `src/content/lore/regions.md`
- `src/content/lore/factions.md`
- `src/content/lore/characters.md`
- `src/content/scenario/00-overview.md`
- `src/content/scenario/01-prologue.md`
- `src/content/scenario/02-chapter-1.md`
- `src/content/scenario/03-chapter-2.md`
- `src/content/scenario/04-chapter-3.md`
- `src/content/scenario/05-ending.md`

## 음악 방향 핵심

- 세계의 기본 정서는 `몽환적 서정성`, `시간 재난`, `불길한 희망`이다.
- 그래서 음악도 단순한 필드 루프가 아니라 `공명`, `잔향`, `유실된 새벽`의 감각을 유지해야 한다.
- 전투와 긴장 장면조차 과도하게 영웅적이기보다 `판단`, `희생`, `균열`을 먼저 들리게 설계했다.
- 사야 렌과 플레이어의 감정선은 별도 러브 테마보다 `공통 모티프의 온도 변화`로 처리하는 편이 시나리오 톤에 맞다.

## 공통 라이트모티프

전체 라이브러리는 `Dawn Motif`라는 5음 모티프를 공유한다.

- 음형: `0, 2, 5, 4, 1`
- 리듬: `1, 0.5, 0.5, 1, 1`
- 역할: 타이틀에서는 가장 맑게, 전투와 보스전에서는 뒤틀린 형태로, 엔딩에서는 각 결말의 가치관에 맞게 재해석한다.

이렇게 하면 곡이 서로 따로 노는 대신 하나의 장편 시나리오처럼 이어진다.

## 챕터별 요구 음악

## 프롤로그

- 필요한 정서: 멈춘 새벽, 항구의 체온, 첫 균열의 불안
- 필요한 음악:
- 타이틀 / 메인 테마
- 미라진 허브 / 프롤로그 탐색
- 추적 / 탈출 긴장

## 챕터 1

- 필요한 정서: 생존, 메마른 현장감, 첫 구조와 첫 책임
- 필요한 음악:
- 유리염 사구 탐험
- 일반 전투
- 구조선 방어전 겸용 전투

## 챕터 2

- 필요한 정서: 정돈된 질서, 부유감, 체제 불안
- 필요한 음악:
- 역항도 카델 탐험
- 균열 추적 / 내부 조사 긴장
- 일반 전투 재사용

## 챕터 3

- 필요한 정서: 속내 노출, 고백, 죄책감, 진실 공개
- 필요한 음악:
- 감정 이벤트
- 후회목 보스전
- 척추탑 / 진실 공개 미스터리

## 엔딩

- 필요한 정서: 심해 압력, 최종 판단, 상실의 모양
- 필요한 음악:
- 침묵 산호궁 탐험
- 최종 보스전
- 엔딩 A
- 엔딩 B
- 엔딩 C

## 산출물 구조

- 오디오 자산: `assets/audio/*.ogg`
- 메타데이터: `assets/audio/manifest.json`
- 설계 문서: `src/content/audio/*.md`
- 재생성 스크립트: `tools/render-bgm-library.mjs`

## 품질 기준

- 모든 트랙은 `48kHz` 스테레오 기준으로 렌더한 뒤 `Ogg Vorbis q8`로 배포했다.
- 저비트레이트 레트로 질감이 아니라, 패드와 잔향이 충분히 남는 방향으로 설계했다.
- 외부 유명 곡의 진행을 복제하지 않고 저장소 안의 생성 스크립트로 직접 합성해 표절 리스크를 낮췄다.
