import storyOverview from '../content/lore/story-overview.md?raw';
import mainStory from '../content/lore/main-story.md?raw';
import coreSystems from '../content/game-design/00-core-systems.md?raw';
import scenarioOverview from '../content/scenario/00-overview.md?raw';
import scenarioPrologue from '../content/scenario/01-prologue.md?raw';
import scenarioChapter1 from '../content/scenario/02-chapter-1.md?raw';
import scenarioChapter2 from '../content/scenario/03-chapter-2.md?raw';
import scenarioChapter3 from '../content/scenario/04-chapter-3.md?raw';
import scenarioEnding from '../content/scenario/05-ending.md?raw';
import scenarioBgmPlan from '../content/audio/00-scenario-bgm-plan.md?raw';
import worldRules from '../content/lore/world-rules.md?raw';
import regions from '../content/lore/regions.md?raw';
import factions from '../content/lore/factions.md?raw';
import characters from '../content/lore/characters.md?raw';

export const storyProject = Object.freeze({
  title: '반향해 연대기',
  subtitle: '내일이 결정으로 떠오르는 세계에서, 사라진 새벽을 추적하는 해양 판타지 RPG 설정집',
  pitch:
    '플레이어는 미래의 잔향을 들을 수 있는 여명 인양사가 되어, 도시 국가와 고대 장치가 얽힌 세계에서 내일의 소유권을 둘러싼 전쟁을 마주한다.',
  setting: '반향해 기반 해양 판타지',
  mood: '몽환적 서정성과 시간 재난',
  coreConflict: '미래를 통제할 것인가, 모두에게 되돌릴 것인가',
});

export const storyHighlights = Object.freeze([
  {
    label: '세계 키워드',
    value: '반향해, 내일결, 새벽종',
  },
  {
    label: '플레이어 역할',
    value: '미래 반향을 듣는 여명 인양사',
  },
  {
    label: '메인 목표',
    value: '일곱 개의 새벽 종편 회수',
  },
  {
    label: '메인 플레이타임',
    value: '약 8시간',
  },
  {
    label: '문서 구성',
    value: '시나리오 6종 + 설정/설계 7종 + BGM 설계 1종',
  },
  {
    label: '서사 테마',
    value: '강한 미래는 누군가의 가능성을 앗아간다',
  },
]);

export const storyPillars = Object.freeze([
  {
    title: '미래를 자원처럼 쓰는 세계',
    text: '전투와 탐험, 정치가 모두 내일결 배분 구조와 연결된다.',
  },
  {
    title: '상실을 전제로 한 성장',
    text: '강력한 힘은 기억, 관계, 현재 감각을 대가로 요구한다.',
  },
  {
    title: '항해형 지역 구조',
    text: '도시와 던전이 조류와 시간대에 따라 다른 규칙을 가진다.',
  },
]);

export const storyTimeline = Object.freeze([
  {
    era: '첫 역조',
    detail: '하늘과 바다의 경계가 뒤집히고 반향해가 생겨난다.',
  },
  {
    era: '새벽종 시대',
    detail: '고대인들이 미래 배급 장치를 만들고 문명을 안정시킨다.',
  },
  {
    era: '무월조 발발',
    detail: '내일결 생성이 멈추고 일부 지역에서 아침이 사라진다.',
  },
  {
    era: '플레이어의 항해',
    detail: '종편 회수와 세계 질서 재구성의 선택이 시작된다.',
  },
]);

export const storyDocuments = Object.freeze([
  {
    id: 'story-overview',
    title: '스토리 개요',
    category: '메인 설정',
    summary: '세계의 한 줄 콘셉트, 플레이어 역할, 메인 목표를 빠르게 파악하는 문서',
    fileName: 'src/content/lore/story-overview.md',
    accent: 'teal',
    content: storyOverview,
  },
  {
    id: 'main-story',
    title: '메인 스토리',
    category: '메인 설정',
    summary: '프롤로그부터 엔딩 선택까지의 3막 구조와 핵심 반전을 정리한 문서',
    fileName: 'src/content/lore/main-story.md',
    accent: 'gold',
    content: mainStory,
  },
  {
    id: 'core-systems',
    title: '코어 게임 시스템 설계',
    category: '시스템 설계',
    summary:
      '이동, 전투, 자원, 성장, 세이브, 실패 패널티를 포함한 실제 구현 기준의 코어 시스템 설계 문서',
    fileName: 'src/content/game-design/00-core-systems.md',
    accent: 'slate',
    content: coreSystems,
  },
  {
    id: 'audio-scenario-plan',
    title: '시나리오 기반 BGM 설계안',
    category: '오디오 설계',
    summary: '챕터와 장면 감정선에 맞춘 핵심 BGM 8곡의 용도, 분위기, 배치 기준을 정리한 문서',
    fileName: 'src/content/audio/00-scenario-bgm-plan.md',
    accent: 'gold',
    content: scenarioBgmPlan,
  },
  {
    id: 'scenario-overview',
    title: '시나리오 개요',
    category: '시나리오 설계',
    summary:
      '메인 엔딩까지 약 8시간 기준의 챕터 수, 플레이타임, 대사 스크립트 작성 원칙을 정리한 문서',
    fileName: 'src/content/scenario/00-overview.md',
    accent: 'teal',
    content: scenarioOverview,
  },
  {
    id: 'scenario-prologue',
    title: '프롤로그',
    category: '챕터 시나리오',
    summary: '미라진에서 사라진 새벽을 목격하고 첫 항해를 시작하는 도입 챕터와 상세 대사 문서',
    fileName: 'src/content/scenario/01-prologue.md',
    accent: 'coral',
    content: scenarioPrologue,
  },
  {
    id: 'scenario-chapter-1',
    title: '챕터 1',
    category: '챕터 시나리오',
    summary: '유리염 사구에서 생존 갈등을 체감하고 첫 두 개의 종편을 회수하는 장면별 스크립트 문서',
    fileName: 'src/content/scenario/02-chapter-1.md',
    accent: 'gold',
    content: scenarioChapter1,
  },
  {
    id: 'scenario-chapter-2',
    title: '챕터 2',
    category: '챕터 시나리오',
    summary: '역항도 카델에서 유라 베인의 질서 논리와 두 개의 종편을 마주하는 장면별 스크립트 문서',
    fileName: 'src/content/scenario/03-chapter-2.md',
    accent: 'plum',
    content: scenarioChapter2,
  },
  {
    id: 'scenario-chapter-3',
    title: '챕터 3',
    category: '챕터 시나리오',
    summary: '속삭임 과수원과 척추탑에서 진실과 플레이어 정체성을 드러내는 장면별 스크립트 문서',
    fileName: 'src/content/scenario/04-chapter-3.md',
    accent: 'slate',
    content: scenarioChapter3,
  },
  {
    id: 'scenario-ending',
    title: '엔딩',
    category: '챕터 시나리오',
    summary: '침묵 산호궁 최종 던전과 세 가지 메인 엔딩 선택을 상세 스크립트로 정리한 문서',
    fileName: 'src/content/scenario/05-ending.md',
    accent: 'rose',
    content: scenarioEnding,
  },
  {
    id: 'world-rules',
    title: '세계 규칙',
    category: '시스템 설정',
    summary: '반향해, 내일결, 시간 균열, 여명 인양사의 규칙을 정의한 문서',
    fileName: 'src/content/lore/world-rules.md',
    accent: 'coral',
    content: worldRules,
  },
  {
    id: 'regions',
    title: '지역 설정',
    category: '세부 설정',
    summary: '항구, 사막, 역중력 도시, 최종 던전 등 탐험 지역의 성격을 정리한 문서',
    fileName: 'src/content/lore/regions.md',
    accent: 'plum',
    content: regions,
  },
  {
    id: 'factions',
    title: '세력 설정',
    category: '세부 설정',
    summary: '조율원, 염해 길드, 공백 법정 등 주요 집단의 논리와 강약점을 정의한 문서',
    fileName: 'src/content/lore/factions.md',
    accent: 'slate',
    content: factions,
  },
  {
    id: 'characters',
    title: '인물 설정',
    category: '세부 설정',
    summary: '플레이어와 주요 인물의 역할, 감정선, 외형 디자인 포인트를 정리한 문서',
    fileName: 'src/content/lore/characters.md',
    accent: 'rose',
    content: characters,
  },
]);
