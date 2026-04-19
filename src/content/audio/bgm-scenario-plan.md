# 시나리오 기반 BGM 기획안

## 검토한 시나리오 문서

이번 BGM 설계는 아래 문서를 모두 읽고 정리했다.

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

## 음악 설계 기준

- 메인 정서는 `몽환적 서정성`, `불길한 희망`, `미래를 다루는 죄책감` 세 축으로 유지한다.
- 지역 BGM과 사건 큐를 분리해, 탐험 리듬과 서사 전환이 섞이지 않도록 한다.
- 메인 테마 음형은 여러 곡에 변주 형태로 재등장시켜 세계관 통일감을 만든다.
- 모든 곡은 저장소 내부에서 직접 생성 가능한 오프라인 합성 방식으로 만들고, 외부 유명 곡의 멜로디나 샘플을 사용하지 않는다.
- 루프 트랙은 게임 플레이 구간을 고려해 40초에서 85초 사이로 만들고, 엔딩 곡은 루프 없이 결과 장면 길이에 맞춘다.

## 챕터별 필요 음악 정리

| 챕터                      | 필요한 음악                              | 의도                                         |
| ------------------------- | ---------------------------------------- | -------------------------------------------- |
| 타이틀 / 오프닝           | `Dawnbound Overture`                     | 반향해 연대기의 대표 테마, 세계 톤 선언      |
| 프롤로그 미라진           | `Mirajin Everdusk`                       | 영원한 황혼, 멈춘 항구, 개인적 죄책감        |
| 프롤로그 추격 / 균열 폭주 | `Time Storm Surge`                       | 시계탑 붕괴, 방파제 탈출, 구조 우선 판단     |
| 챕터 1 필드               | `Glasssalt Horizon`                      | 메마른 미래와 생존형 탐험 감각               |
| 챕터 1 보스 / 구조전      | `Bellshard Colossus`, `Time Storm Surge` | 유리염 거신, 구조선 방어전                   |
| 챕터 2 카델 허브          | `Kadel Upside Tide`                      | 차가운 통제, 불안정한 안정                   |
| 챕터 2 코어 위기          | `Ceiling Heart Breach`                   | 시민 구조와 코어 유지가 동시에 요구되는 구간 |
| 챕터 3 과수원             | `Whispering Orchard`                     | 감정 잔향, 사야와 라오의 속내 노출           |
| 챕터 3 진실 공개          | `Spine of Unwritten Days`                | 플레이어 정체성, 새벽종의 원죄 공개          |
| 일반 전투                 | `Echo Skirmish`                          | 필드 전투 공통 루프                          |
| 보스전 공통               | `Bellshard Colossus`                     | 각 챕터 보스 공통 루프                       |
| 감정 이벤트               | `Saya's Unfinished Vow`                  | 사야 렌 중심 단독 장면과 감정 회수           |
| 최종 던전                 | `Silent Coral Palace`                    | 심해 구조물, 종소리 잔향, 결전 직전 긴장     |
| 엔딩 A                    | `Restored Dawn`                          | 안정과 통제의 양면성                         |
| 엔딩 B                    | `Unbound Tide`                           | 해방과 혼란의 동시성                         |
| 엔딩 C                    | `Vigil of Tomorrow`                      | 희생적 결속과 쓸쓸한 존엄                    |
| 크레딧                    | `Last Dawn Credits`                      | 메인 테마 회수, 전체 여운 정리               |

## 트랙 카탈로그

| 트랙                      | 분류                    | 주요 사용 장면                           | 분위기                                | 파일                                            |
| ------------------------- | ----------------------- | ---------------------------------------- | ------------------------------------- | ----------------------------------------------- |
| `Dawnbound Overture`      | 타이틀 / 메인 테마      | 타이틀, 오프닝, 트레일러                 | 몽환적 해양감, 금빛 희망, 불길한 잔향 | `assets/audio/bgm/dawnbound-overture.ogg`       |
| `Mirajin Everdusk`        | 마을 / 허브             | 미라진 항구, 프롤로그 정박 구간          | 붉은 황혼, 멈춘 시간, 낮은 죄책감     | `assets/audio/bgm/mirajin-everdusk.ogg`         |
| `Glasssalt Horizon`       | 탐험                    | 유리염 사구 필드 탐험                    | 건조한 바람, 생존, 남은 희망          | `assets/audio/bgm/glasssalt-horizon.ogg`        |
| `Time Storm Surge`        | 긴장 / 추적             | 시계탑 붕괴, 구조전, 균열 폭주           | 압박, 추격, 즉시 판단                 | `assets/audio/bgm/time-storm-surge.ogg`         |
| `Kadel Upside Tide`       | 마을 / 정치 허브        | 역항도 카델 도시 탐험, 협상 전후         | 냉정한 효율, 구조화된 불안            | `assets/audio/bgm/kadel-upside-tide.ogg`        |
| `Ceiling Heart Breach`    | 긴장 / 추적             | 코어 붕괴, 시민 구조 연속 시퀀스         | 기계적 공포, 추락감, 급박함           | `assets/audio/bgm/ceiling-heart-breach.ogg`     |
| `Whispering Orchard`      | 탐험 / 감정 이벤트      | 속삭임 과수원, 감정 단서 탐색            | 부드러운 슬픔, 친밀한 불편함          | `assets/audio/bgm/whispering-orchard.ogg`       |
| `Spine of Unwritten Days` | 감정 이벤트 / 진실 공개 | 척추탑 기록실, 실루엣 대치 직전          | 공허, 죄책감, 진실의 무게             | `assets/audio/bgm/spine-of-unwritten-days.ogg`  |
| `Echo Skirmish`           | 전투                    | 일반 필드 전투 전반                      | 빠른 기동, 응답성, 의지               | `assets/audio/bgm/echo-skirmish.ogg`            |
| `Bellshard Colossus`      | 보스전                  | 황혼 파수체, 유리염 거신, 역추자, 후회목 | 위압, 파편 공명, 결전                 | `assets/audio/bgm/bellshard-colossus.ogg`       |
| `Saya's Unfinished Vow`   | 감정 이벤트             | 사야 렌 고백, 단독 감정 장면             | 다정함과 집착의 동시 존재             | `assets/audio/bgm/saya-lens-vow.ogg`            |
| `Silent Coral Palace`     | 최종 던전               | 침묵 산호궁 외곽, 심해 기관실            | 심해 압력, 장엄한 침묵, 종말 직전     | `assets/audio/bgm/silent-coral-palace.ogg`      |
| `Restored Dawn`           | 엔딩                    | 엔딩 A 결과 장면                         | 안도, 인공적 안정, 남는 통제          | `assets/audio/bgm/ending-restored-dawn.ogg`     |
| `Unbound Tide`            | 엔딩                    | 엔딩 B 결과 장면                         | 해방, 상실, 자연스러운 불안정         | `assets/audio/bgm/ending-unbound-tide.ogg`      |
| `Vigil of Tomorrow`       | 엔딩                    | 엔딩 C 결과 장면                         | 희생, 고요한 존엄, 멀어지는 체온      | `assets/audio/bgm/ending-vigil-of-tomorrow.ogg` |
| `Last Dawn Credits`       | 엔딩 / 크레딧           | 공통 크레딧, 후일담 정리                 | 회고, 바다의 여운, 다시 시작되는 내일 | `assets/audio/bgm/last-dawn-credits.ogg`        |

## 장면 배치 메모

### 프롤로그

- 미라진 조사와 허브 구간은 `Mirajin Everdusk`
- 시계탑 내부의 전투 전 긴장 고조는 필요 시 `Mirajin Everdusk`를 유지하다가 추격 직전 `Time Storm Surge`로 전환
- 황혼 파수체와 방파제 탈출은 `Bellshard Colossus` 또는 `Time Storm Surge`

### 챕터 1

- 유리염 사구 이동과 구조 사이클은 `Glasssalt Horizon`
- 구조선 방어전은 `Time Storm Surge`
- 유리염 거신은 `Bellshard Colossus`
- 라오 템의 종편 인계 장면은 `Glasssalt Horizon` 저음량 혹은 무음 전환 후 `Saya's Unfinished Vow` 일부 사용 가능

### 챕터 2

- 카델 상층, 하층, 협상 준비는 `Kadel Upside Tide`
- 코어 붕괴와 시민 구조 연속 이벤트는 `Ceiling Heart Breach`
- 역추자 보스전은 `Bellshard Colossus`

### 챕터 3

- 과수원 탐험과 감정 단서 수집은 `Whispering Orchard`
- 사야 렌 단독 고백은 `Saya's Unfinished Vow`
- 척추탑 진입 이후 기록실과 실루엣 대치는 `Spine of Unwritten Days`

### 엔딩

- 침묵 산호궁 탐험 전반은 `Silent Coral Palace`
- 일반 전투는 `Echo Skirmish`, 보스급 충돌은 `Bellshard Colossus`
- 최종 선택 결과는 각 엔딩 전용 곡 사용
- 스태프 롤과 후일담 정리는 `Last Dawn Credits`

## 제작 메모

- 실제 생성 정보는 `src/content/audio/bgm-manifest.json`에 정리한다.
- 오디오 소스는 `tools/generate-bgm.mjs`에서 직접 합성하며, 결과물은 `assets/audio/bgm/`에 생성한다.
- 재생성 명령은 `npm run generate:bgm`이다.
- 생성 방식은 저장소 안에서 재현 가능해야 하므로 외부 샘플 라이브러리 없이 합성했다.
