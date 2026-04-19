import { Buffer } from 'node:buffer';
import { spawnSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(__dirname, '..');
const OUTPUT_DIR = resolve(ROOT_DIR, 'assets/audio');
const SAMPLE_RATE = 48_000;
const MASTER_PEAK = 0.92;

const MODES = Object.freeze({
  ionian: [0, 2, 4, 5, 7, 9, 11],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  aeolian: [0, 2, 3, 5, 7, 8, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
});

const DAWN_MOTIF = Object.freeze({
  degrees: [0, 2, 5, 4, 1],
  rhythms: [1, 0.5, 0.5, 1, 1],
});

const TRACKS = Object.freeze([
  {
    id: '01-dawn-overture',
    title: '유실된 새벽의 서곡',
    category: ['title', 'main-theme'],
    bpm: 92,
    bars: 20,
    tonicMidi: 62,
    mode: 'lydian',
    progression: [0, 4, 5, 3],
    pad: 'mistPad',
    arp: 'feltKeys',
    bass: 'warmBass',
    lead: 'glassLead',
    drone: 'choirPad',
    arpPattern: 'felt',
    bassPattern: 'anchored',
    drumPattern: 'lightPulse',
    texture: 'glow',
    sectionCurve: [0.44, 0.58, 0.72, 0.86, 0.94],
    loop: true,
    scenes: ['타이틀 화면', '오프닝 영상', '메인 테마 회상 장면'],
    summary: '반향해 연대기의 공통 선율을 가장 선명하게 제시하는 메인 테마.',
  },
  {
    id: '02-mirajin-afterglow',
    title: '미라진의 멈춘 황혼',
    category: ['town', 'prologue', 'hub'],
    bpm: 80,
    bars: 16,
    tonicMidi: 59,
    mode: 'ionian',
    progression: [0, 3, 4, 0],
    pad: 'choirPad',
    arp: 'feltKeys',
    bass: 'warmBass',
    lead: 'glassLead',
    drone: 'mistPad',
    arpPattern: 'sparseFelt',
    bassPattern: 'sparse',
    drumPattern: 'none',
    texture: 'harbor',
    sectionCurve: [0.32, 0.44, 0.56, 0.62],
    loop: true,
    scenes: ['프롤로그 항구 탐색', '허브 항구 미라진', '정지된 새벽 회상'],
    summary: '사라진 아침과 항구의 체온이 함께 남아 있는 정지된 허브 음악.',
  },
  {
    id: '03-saltless-horizon',
    title: '유리염 사구의 발자국',
    category: ['exploration', 'chapter-1'],
    bpm: 98,
    bars: 16,
    tonicMidi: 57,
    mode: 'dorian',
    progression: [0, 5, 3, 4],
    pad: 'mistPad',
    arp: 'glassOstinato',
    bass: 'warmBass',
    lead: 'celloLead',
    drone: 'none',
    arpPattern: 'rolling',
    bassPattern: 'travel',
    drumPattern: 'travel',
    texture: 'sand',
    sectionCurve: [0.4, 0.54, 0.68, 0.78],
    loop: true,
    scenes: ['챕터 1 필드 탐험', '유리염 폭풍 이후 이동', '폐채굴 첨탑 접근'],
    summary: '메마른 필드의 건조함과 앞으로 밀고 가는 생존 리듬을 함께 잡는 탐험 곡.',
  },
  {
    id: '04-reversed-mooring',
    title: '거꾸로 정박한 도시',
    category: ['exploration', 'chapter-2', 'mystery'],
    bpm: 104,
    bars: 16,
    tonicMidi: 64,
    mode: 'lydian',
    progression: [0, 2, 5, 4],
    pad: 'choirPad',
    arp: 'glassOstinato',
    bass: 'warmBass',
    lead: 'glassLead',
    drone: 'mistPad',
    arpPattern: 'glass',
    bassPattern: 'anchored',
    drumPattern: 'lightPulse',
    texture: 'inversion',
    sectionCurve: [0.36, 0.5, 0.66, 0.78],
    loop: true,
    scenes: ['역항도 카델 시가지', '중력 역전 구역', '질서와 불안이 공존하는 조사 장면'],
    summary: '역중력 도시 특유의 부유감과 정돈된 불안을 함께 그리는 탐험 곡.',
  },
  {
    id: '05-hollow-pursuit',
    title: '균열 추적선',
    category: ['tension', 'pursuit', 'investigation'],
    bpm: 112,
    bars: 16,
    tonicMidi: 55,
    mode: 'phrygian',
    progression: [0, 6, 3, 4],
    pad: 'shadowPad',
    arp: 'shadowPulse',
    bass: 'warmBass',
    lead: 'celloLead',
    drone: 'choirPad',
    arpPattern: 'pulse',
    bassPattern: 'pedal',
    drumPattern: 'tense',
    texture: 'fracture',
    sectionCurve: [0.46, 0.62, 0.76, 0.88],
    loop: true,
    scenes: ['공백 법정 추적', '균열 지역 탐문', '탈출 직전 긴장 전개'],
    summary: '발각 직전의 불안과 조류처럼 밀려오는 압박감을 다루는 긴장 곡.',
  },
  {
    id: '06-resonance-skirmish',
    title: '반향해 교전',
    category: ['battle', 'normal-combat'],
    bpm: 132,
    bars: 16,
    tonicMidi: 58,
    mode: 'dorian',
    progression: [0, 5, 6, 4],
    pad: 'shadowPad',
    arp: 'shadowPulse',
    bass: 'warmBass',
    lead: 'glassLead',
    drone: 'none',
    arpPattern: 'pulse',
    bassPattern: 'driven',
    drumPattern: 'battle',
    texture: 'combat',
    sectionCurve: [0.58, 0.72, 0.84, 0.92],
    loop: true,
    scenes: ['일반 전투', '구조선 방어전', '필드 적 조우'],
    summary: '과장된 영웅성보다 즉각적인 판단과 회피를 밀어 주는 기본 전투 곡.',
  },
  {
    id: '07-tree-of-regrets',
    title: '후회목 아래에서',
    category: ['boss', 'chapter-3'],
    bpm: 124,
    bars: 16,
    tonicMidi: 54,
    mode: 'aeolian',
    progression: [0, 2, 5, 1],
    pad: 'choirPad',
    arp: 'shadowPulse',
    bass: 'warmBass',
    lead: 'celloLead',
    drone: 'mistPad',
    arpPattern: 'pulse',
    bassPattern: 'driven',
    drumPattern: 'boss',
    texture: 'regret',
    sectionCurve: [0.56, 0.7, 0.84, 0.96],
    loop: true,
    scenes: ['후회목 보스전', '감정이 폭발하는 중간 보스', '거대한 잔향체 전투'],
    summary: '감정 이벤트 직후 곧바로 치닫는 비극적 중간 보스 음악.',
  },
  {
    id: '08-orchard-of-whispers',
    title: '속삭임 과수원의 밤',
    category: ['emotional', 'chapter-3', 'relationship'],
    bpm: 76,
    bars: 16,
    tonicMidi: 60,
    mode: 'mixolydian',
    progression: [0, 5, 3, 4],
    pad: 'mistPad',
    arp: 'feltKeys',
    bass: 'warmBass',
    lead: 'glassLead',
    drone: 'choirPad',
    arpPattern: 'sparseFelt',
    bassPattern: 'sparse',
    drumPattern: 'none',
    texture: 'orchard',
    sectionCurve: [0.28, 0.4, 0.52, 0.62],
    loop: true,
    scenes: ['사야 렌 감정 이벤트', '동료 속마음 장면', '잔향 회상'],
    summary: '숨겨 둔 후회와 연민이 조용히 새어 나오는 감정 이벤트 전용 곡.',
  },
  {
    id: '09-spine-tower-revelation',
    title: '선택되지 못한 탑',
    category: ['revelation', 'chapter-3', 'mystery'],
    bpm: 88,
    bars: 16,
    tonicMidi: 61,
    mode: 'aeolian',
    progression: [0, 6, 3, 4],
    pad: 'choirPad',
    arp: 'glassOstinato',
    bass: 'warmBass',
    lead: 'glassLead',
    drone: 'shadowPad',
    arpPattern: 'glass',
    bassPattern: 'anchored',
    drumPattern: 'none',
    texture: 'tower',
    sectionCurve: [0.34, 0.48, 0.62, 0.74],
    loop: true,
    scenes: ['무도서고 척추탑 탐사', '진실 공개', '플레이어 실루엣 접근 전'],
    summary: '선택되지 않은 역사와 플레이어의 원죄가 드러나는 구간용 미스터리 곡.',
  },
  {
    id: '10-silent-coral-approach',
    title: '침묵 산호궁 외곽',
    category: ['final-dungeon', 'exploration'],
    bpm: 90,
    bars: 16,
    tonicMidi: 52,
    mode: 'phrygian',
    progression: [0, 3, 6, 4],
    pad: 'shadowPad',
    arp: 'glassOstinato',
    bass: 'warmBass',
    lead: 'celloLead',
    drone: 'choirPad',
    arpPattern: 'glass',
    bassPattern: 'pedal',
    drumPattern: 'tense',
    texture: 'abyss',
    sectionCurve: [0.42, 0.56, 0.72, 0.84],
    loop: true,
    scenes: ['침묵 산호궁 외곽 탐험', '심해 내부 진입', '최종전 직전 이동'],
    summary: '심해 저음과 사라진 종소리의 공백을 공간감으로 채우는 최종 던전 곡.',
  },
  {
    id: '11-abyssal-chorus',
    title: '심연의 합창기',
    category: ['final-boss', 'boss'],
    bpm: 136,
    bars: 20,
    tonicMidi: 53,
    mode: 'aeolian',
    progression: [0, 4, 5, 2],
    pad: 'choirPad',
    arp: 'shadowPulse',
    bass: 'warmBass',
    lead: 'celloLead',
    drone: 'mistPad',
    arpPattern: 'pulse',
    bassPattern: 'driven',
    drumPattern: 'finalBoss',
    texture: 'choir',
    sectionCurve: [0.58, 0.72, 0.84, 0.94, 1],
    loop: false,
    scenes: ['심연의 합창기 최종 보스전', '최종 결전 3페이즈', '종편 전부가 반응하는 순간'],
    summary: '모든 모티프를 가장 무겁게 뒤틀어 들려주는 최종 보스전 음악.',
  },
  {
    id: '12-bell-of-restoration',
    title: '복구된 새벽의 종',
    category: ['ending', 'credits', 'ending-a'],
    bpm: 88,
    bars: 20,
    tonicMidi: 64,
    mode: 'ionian',
    progression: [0, 4, 3, 0],
    pad: 'mistPad',
    arp: 'feltKeys',
    bass: 'warmBass',
    lead: 'glassLead',
    drone: 'choirPad',
    arpPattern: 'felt',
    bassPattern: 'sparse',
    drumPattern: 'lightPulse',
    texture: 'restoration',
    sectionCurve: [0.3, 0.44, 0.56, 0.66, 0.74],
    loop: false,
    scenes: ['엔딩 A', '안정된 미래 후일담', '크레딧 시작'],
    summary: '안정과 통제의 대가를 품은 채 조용히 밝아지는 엔딩 A/크레딧 곡.',
  },
  {
    id: '13-unbound-morning',
    title: '묶이지 않은 아침',
    category: ['ending', 'credits', 'ending-b'],
    bpm: 94,
    bars: 20,
    tonicMidi: 62,
    mode: 'mixolydian',
    progression: [0, 5, 4, 0],
    pad: 'mistPad',
    arp: 'feltKeys',
    bass: 'warmBass',
    lead: 'celloLead',
    drone: 'none',
    arpPattern: 'felt',
    bassPattern: 'travel',
    drumPattern: 'travel',
    texture: 'release',
    sectionCurve: [0.34, 0.48, 0.62, 0.72, 0.8],
    loop: false,
    scenes: ['엔딩 B', '질서 해체 후일담', '자유와 혼란이 공존하는 크레딧'],
    summary: '해방의 여운과 아직 정리되지 않은 세계의 움직임을 함께 담은 엔딩 B 곡.',
  },
  {
    id: '14-last-anchor',
    title: '마지막 닻',
    category: ['ending', 'credits', 'ending-c'],
    bpm: 72,
    bars: 20,
    tonicMidi: 57,
    mode: 'aeolian',
    progression: [0, 5, 3, 1],
    pad: 'choirPad',
    arp: 'feltKeys',
    bass: 'warmBass',
    lead: 'glassLead',
    drone: 'shadowPad',
    arpPattern: 'sparseFelt',
    bassPattern: 'sparse',
    drumPattern: 'none',
    texture: 'anchor',
    sectionCurve: [0.3, 0.4, 0.52, 0.64, 0.7],
    loop: false,
    scenes: ['엔딩 C', '플레이어 결속 엔딩', '침잠하는 크레딧 후반'],
    summary: '플레이어가 닻이 된 엔딩의 고요한 상실감을 길게 남기는 엔딩 C 곡.',
  },
]);

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function hashString(value) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function createRandom(seed) {
  let state = seed >>> 0;

  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let result = Math.imul(state ^ (state >>> 15), 1 | state);
    result ^= result + Math.imul(result ^ (result >>> 7), 61 | result);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

function midiToFrequency(midi) {
  return 440 * 2 ** ((midi - 69) / 12);
}

function resolveScaleMidi(spec, scaleIndex, registerOffset = 0) {
  const intervals = MODES[spec.mode];
  const length = intervals.length;
  const normalizedIndex = ((scaleIndex % length) + length) % length;
  const octaveOffset = Math.floor(scaleIndex / length) * 12;
  return spec.tonicMidi + intervals[normalizedIndex] + octaveOffset + registerOffset;
}

function buildChord(spec, degree) {
  return {
    root: resolveScaleMidi(spec, degree, -12),
    fifth: resolveScaleMidi(spec, degree + 4, -12),
    tones: [
      resolveScaleMidi(spec, degree, 0),
      resolveScaleMidi(spec, degree + 2, 0),
      resolveScaleMidi(spec, degree + 4, 0),
      resolveScaleMidi(spec, degree + 6, 0),
    ],
    leadTones: [
      resolveScaleMidi(spec, degree, 12),
      resolveScaleMidi(spec, degree + 2, 12),
      resolveScaleMidi(spec, degree + 4, 12),
      resolveScaleMidi(spec, degree + 6, 12),
      resolveScaleMidi(spec, degree + 8, 12),
    ],
  };
}

function beatsToSeconds(beats, bpm) {
  return (60 / bpm) * beats;
}

function shapeSine(phase) {
  return Math.sin(Math.PI * 2 * phase);
}

function shapeSaw(phase) {
  return phase * 2 - 1;
}

function shapeTriangle(phase) {
  return 1 - 4 * Math.abs(phase - 0.5);
}

function shapePulse(phase, width = 0.5) {
  return phase < width ? 1 : -1;
}

function createStereoBuffer(length) {
  return {
    left: new Float32Array(length),
    right: new Float32Array(length),
  };
}

function envelopeAt(time, duration, attack, decay, sustainLevel, release) {
  if (time < 0 || time > duration) {
    return 0;
  }

  if (time < attack) {
    return time / Math.max(attack, 1e-4);
  }

  const sustainStart = Math.max(attack, duration - release);

  if (time < sustainStart) {
    const decayProgress = clamp((time - attack) / Math.max(decay, 1e-4), 0, 1);
    return 1 - (1 - sustainLevel) * decayProgress;
  }

  const releaseProgress = clamp((time - sustainStart) / Math.max(release, 1e-4), 0, 1);
  return sustainLevel * (1 - releaseProgress);
}

function mixSample(channels, sampleIndex, value, pan) {
  const leftGain = Math.cos(((pan + 1) * Math.PI) / 4);
  const rightGain = Math.sin(((pan + 1) * Math.PI) / 4);

  channels.left[sampleIndex] += value * leftGain;
  channels.right[sampleIndex] += value * rightGain;
}

function addInstrumentNote(channels, spec, options) {
  const {
    instrument,
    startSec,
    durationSec,
    midi,
    velocity = 0.25,
    pan = 0,
    brightness = 0.5,
    rng,
  } = options;
  const startSample = Math.floor(startSec * SAMPLE_RATE);
  const totalSamples = Math.max(1, Math.ceil(durationSec * SAMPLE_RATE));
  const endSample = Math.min(channels.left.length, startSample + totalSamples);
  const frequency = midiToFrequency(midi);
  const phaseOffset = rng() * Math.PI * 2;
  let phaseA = rng();
  let phaseB = rng();
  let phaseC = rng();
  let lowpassA = 0;
  let lowpassB = 0;

  const attack =
    instrument === 'mistPad' || instrument === 'choirPad' || instrument === 'shadowPad'
      ? 0.26
      : instrument === 'feltKeys'
        ? 0.01
        : 0.018;
  const decay = instrument === 'feltKeys' || instrument === 'glassLead' ? 0.18 : 0.26;
  const sustainLevel = instrument === 'feltKeys' ? 0.42 : instrument === 'warmBass' ? 0.55 : 0.72;
  const release =
    instrument === 'mistPad' || instrument === 'choirPad'
      ? Math.min(0.9, durationSec * 0.35)
      : instrument === 'shadowPad'
        ? Math.min(0.7, durationSec * 0.28)
        : instrument === 'warmBass'
          ? Math.min(0.24, durationSec * 0.24)
          : Math.min(0.3, durationSec * 0.22);

  const incrementA = frequency / SAMPLE_RATE;
  const incrementB = (frequency * 1.004) / SAMPLE_RATE;
  const incrementC = (frequency * 0.996) / SAMPLE_RATE;

  for (let sampleIndex = startSample; sampleIndex < endSample; sampleIndex += 1) {
    const localIndex = sampleIndex - startSample;
    const time = localIndex / SAMPLE_RATE;
    const env = envelopeAt(time, durationSec, attack, decay, sustainLevel, release);

    if (env <= 0) {
      continue;
    }

    phaseA += incrementA;
    phaseB += incrementB;
    phaseC += incrementC;

    if (phaseA >= 1) {
      phaseA -= 1;
    }

    if (phaseB >= 1) {
      phaseB -= 1;
    }

    if (phaseC >= 1) {
      phaseC -= 1;
    }

    const vibrato =
      1 +
      (instrument === 'celloLead' || instrument === 'glassLead' ? 0.0035 : 0.0015) *
        Math.sin((time * 5.2 + phaseOffset) * Math.PI * 2);
    const bodyPhase = phaseA * vibrato;
    const upperPhase = phaseB * vibrato;
    const lowerPhase = phaseC * vibrato;
    const noise = rng() * 2 - 1;
    let sample = 0;

    if (instrument === 'mistPad') {
      const source =
        shapeSaw(bodyPhase) * 0.54 +
        shapeTriangle(upperPhase) * 0.28 +
        shapeSine(lowerPhase) * 0.18;
      lowpassA += (source - lowpassA) * (0.03 + brightness * 0.06);
      sample = lowpassA;
    } else if (instrument === 'choirPad') {
      const source =
        shapeSaw(bodyPhase) * 0.28 +
        shapePulse(upperPhase, 0.42) * 0.14 +
        shapeSine(bodyPhase * 0.5) * 0.4 +
        shapeTriangle(lowerPhase) * 0.18;
      lowpassA += (source - lowpassA) * (0.018 + brightness * 0.03);
      lowpassB += (lowpassA - lowpassB) * (0.024 + brightness * 0.03);
      sample = lowpassB;
    } else if (instrument === 'shadowPad') {
      const source =
        shapePulse(bodyPhase, 0.35) * 0.34 +
        shapeSaw(lowerPhase) * 0.22 +
        shapeSine(upperPhase) * 0.18 +
        noise * 0.04;
      lowpassA += (source - lowpassA) * (0.028 + brightness * 0.034);
      sample = lowpassA;
    } else if (instrument === 'feltKeys') {
      const fmIndex = Math.exp(-time * 7) * (1.1 + brightness * 0.5);
      const carrier = Math.sin(
        Math.PI * 2 * (bodyPhase + Math.sin(Math.PI * 2 * upperPhase) * fmIndex * 0.08)
      );
      const attackNoise = noise * Math.exp(-time * 18) * 0.08;
      sample = carrier * 0.72 + shapeTriangle(lowerPhase) * 0.2 + attackNoise;
    } else if (instrument === 'glassOstinato' || instrument === 'glassLead') {
      const bell =
        shapeSine(bodyPhase) * 0.62 +
        shapeSine(upperPhase * 2.71) * Math.exp(-time * 1.7) * 0.22 +
        shapeSine(lowerPhase * 3.97) * Math.exp(-time * 2.6) * 0.12;
      sample = bell + noise * Math.exp(-time * 24) * 0.03;
    } else if (instrument === 'celloLead') {
      const source =
        shapeSaw(bodyPhase) * 0.46 +
        shapeTriangle(upperPhase) * 0.26 +
        shapeSine(lowerPhase) * 0.18;
      lowpassA += (source - lowpassA) * (0.04 + brightness * 0.05);
      sample = lowpassA;
    } else if (instrument === 'shadowPulse') {
      const source =
        shapePulse(bodyPhase, 0.28) * 0.42 +
        shapeSaw(upperPhase) * 0.2 +
        noise * Math.exp(-time * 9) * 0.05;
      lowpassA += (source - lowpassA) * (0.06 + brightness * 0.04);
      sample = lowpassA;
    } else {
      const source =
        shapeSine(bodyPhase) * 0.7 + shapeSaw(lowerPhase) * 0.16 + shapeTriangle(upperPhase) * 0.14;
      lowpassA += (source - lowpassA) * (0.08 + brightness * 0.04);
      sample = lowpassA;
    }

    const shaped = Math.tanh(sample * (1.2 + brightness * 0.3)) * env * velocity;
    mixSample(channels, sampleIndex, shaped, pan);
  }
}

function addKick(channels, startSec, velocity = 0.42, rng = Math.random) {
  const durationSec = 0.55;
  const startSample = Math.floor(startSec * SAMPLE_RATE);
  const endSample = Math.min(
    channels.left.length,
    startSample + Math.ceil(durationSec * SAMPLE_RATE)
  );

  for (let sampleIndex = startSample; sampleIndex < endSample; sampleIndex += 1) {
    const time = (sampleIndex - startSample) / SAMPLE_RATE;
    const envelope = Math.exp(-time * 8.5);
    const frequency = 132 * Math.exp(-time * 9.5) + 40;
    const sample =
      Math.sin(Math.PI * 2 * frequency * time + 1.4 * Math.exp(-time * 14)) * envelope * 0.9 +
      (rng() * 2 - 1) * Math.exp(-time * 35) * 0.035;
    mixSample(channels, sampleIndex, sample * velocity, 0);
  }
}

function addSnare(channels, startSec, velocity = 0.28, rng = Math.random) {
  const durationSec = 0.26;
  const startSample = Math.floor(startSec * SAMPLE_RATE);
  const endSample = Math.min(
    channels.left.length,
    startSample + Math.ceil(durationSec * SAMPLE_RATE)
  );
  let band = 0;

  for (let sampleIndex = startSample; sampleIndex < endSample; sampleIndex += 1) {
    const time = (sampleIndex - startSample) / SAMPLE_RATE;
    const noise = rng() * 2 - 1;
    band += (noise - band) * 0.34;
    const body = Math.sin(Math.PI * 2 * 182 * time) * Math.exp(-time * 14) * 0.22;
    const sample = (band - noise * 0.35) * Math.exp(-time * 16) * 0.68 + body;
    mixSample(channels, sampleIndex, sample * velocity, 0);
  }
}

function addHat(channels, startSec, velocity = 0.12, pan = 0.12, rng = Math.random) {
  const durationSec = 0.12;
  const startSample = Math.floor(startSec * SAMPLE_RATE);
  const endSample = Math.min(
    channels.left.length,
    startSample + Math.ceil(durationSec * SAMPLE_RATE)
  );
  let highpass = 0;

  for (let sampleIndex = startSample; sampleIndex < endSample; sampleIndex += 1) {
    const time = (sampleIndex - startSample) / SAMPLE_RATE;
    const noise = rng() * 2 - 1;
    highpass += (noise - highpass) * 0.12;
    const sample = (noise - highpass) * Math.exp(-time * 34);
    mixSample(channels, sampleIndex, sample * velocity, pan);
  }
}

function addTom(channels, startSec, velocity = 0.24, pan = -0.08) {
  const durationSec = 0.34;
  const startSample = Math.floor(startSec * SAMPLE_RATE);
  const endSample = Math.min(
    channels.left.length,
    startSample + Math.ceil(durationSec * SAMPLE_RATE)
  );

  for (let sampleIndex = startSample; sampleIndex < endSample; sampleIndex += 1) {
    const time = (sampleIndex - startSample) / SAMPLE_RATE;
    const envelope = Math.exp(-time * 10);
    const frequency = 96 * Math.exp(-time * 4.5) + 74;
    const sample = Math.sin(Math.PI * 2 * frequency * time) * envelope;
    mixSample(channels, sampleIndex, sample * velocity, pan);
  }
}

function addRiser(channels, startSec, durationSec, intensity, pan = 0, rng = Math.random) {
  const startSample = Math.floor(startSec * SAMPLE_RATE);
  const endSample = Math.min(
    channels.left.length,
    startSample + Math.ceil(durationSec * SAMPLE_RATE)
  );
  let lowpass = 0;

  for (let sampleIndex = startSample; sampleIndex < endSample; sampleIndex += 1) {
    const time = (sampleIndex - startSample) / SAMPLE_RATE;
    const progress = clamp(time / durationSec, 0, 1);
    const noise = rng() * 2 - 1;
    lowpass += (noise - lowpass) * (0.01 + progress * 0.08);
    const shimmer = Math.sin(Math.PI * 2 * (280 + progress * 420) * time) * 0.06;
    const sample = (lowpass * 0.16 + shimmer) * progress * intensity;
    mixSample(channels, sampleIndex, sample, pan);
  }
}

function addPadBar(channels, spec, chord, barStartSec, intensity, rng) {
  const notes = chord.tones.slice(0, 4);
  const pans = [-0.34, -0.12, 0.14, 0.32];
  const durationSec = beatsToSeconds(4.2, spec.bpm);

  notes.forEach((midi, index) => {
    addInstrumentNote(channels, spec, {
      instrument: spec.pad,
      startSec: barStartSec,
      durationSec,
      midi,
      velocity: 0.11 + intensity * 0.055,
      pan: pans[index],
      brightness: intensity,
      rng,
    });
  });
}

function addDroneBar(channels, spec, chord, barStartSec, intensity, rng) {
  if (!spec.drone || spec.drone === 'none' || intensity < 0.52) {
    return;
  }

  addInstrumentNote(channels, spec, {
    instrument: spec.drone,
    startSec: barStartSec,
    durationSec: beatsToSeconds(4.5, spec.bpm),
    midi: chord.root - 12,
    velocity: 0.08 + intensity * 0.03,
    pan: -0.06,
    brightness: 0.35 + intensity * 0.4,
    rng,
  });
}

function addBassBar(channels, spec, chord, barStartSec, intensity, rng) {
  if (!spec.bass) {
    return;
  }

  const patterns = {
    sparse: [
      [0, chord.root, 1.35],
      [2, chord.fifth, 1.15],
    ],
    anchored: [
      [0, chord.root, 1],
      [1.5, chord.fifth, 0.6],
      [2, chord.root - 12, 0.85],
      [3, chord.fifth, 0.45],
    ],
    travel: [
      [0, chord.root, 0.75],
      [1, chord.fifth, 0.6],
      [2, chord.root - 12, 0.75],
      [3, chord.fifth, 0.6],
    ],
    pedal: [
      [0, chord.root, 0.6],
      [0.5, chord.root, 0.4],
      [1.5, chord.root, 0.4],
      [2, chord.fifth, 0.5],
      [3, chord.root, 0.5],
    ],
    driven: [
      [0, chord.root, 0.45],
      [0.75, chord.fifth, 0.35],
      [1.5, chord.root, 0.35],
      [2, chord.root - 12, 0.45],
      [2.75, chord.fifth, 0.35],
      [3.5, chord.root, 0.28],
    ],
  };

  const selectedPattern = patterns[spec.bassPattern] ?? patterns.anchored;

  selectedPattern.forEach(([beatOffset, midi, beatDuration]) => {
    addInstrumentNote(channels, spec, {
      instrument: spec.bass,
      startSec: barStartSec + beatsToSeconds(beatOffset, spec.bpm),
      durationSec: beatsToSeconds(beatDuration, spec.bpm),
      midi,
      velocity: 0.15 + intensity * 0.08,
      pan: -0.02,
      brightness: 0.2 + intensity * 0.45,
      rng,
    });
  });
}

function addArpBar(channels, spec, chord, barStartSec, intensity, rng) {
  if (!spec.arp) {
    return;
  }

  const patterns = {
    felt: {
      steps: [0, 2, 1, 3, 2, 1, 4, 2],
      beatLength: 0.5,
    },
    sparseFelt: {
      steps: [0, 2, 3, 1],
      beatLength: 1,
    },
    rolling: {
      steps: [0, 1, 2, 1, 3, 2, 4, 2],
      beatLength: 0.5,
    },
    glass: {
      steps: [0, 2, 4, 1, 3, 2, 4, 3],
      beatLength: 0.5,
    },
    pulse: {
      steps: [0, 1, 0, 2, 0, 1, 3, 2],
      beatLength: 0.5,
    },
  };

  const pattern = patterns[spec.arpPattern] ?? patterns.felt;
  const notePool = chord.leadTones;

  pattern.steps.forEach((noteIndex, stepIndex) => {
    const beatOffset = pattern.beatLength * stepIndex;
    const pan = (stepIndex % 2 === 0 ? -1 : 1) * 0.14;

    addInstrumentNote(channels, spec, {
      instrument: spec.arp,
      startSec: barStartSec + beatsToSeconds(beatOffset, spec.bpm),
      durationSec: beatsToSeconds(pattern.beatLength * 0.92, spec.bpm),
      midi: notePool[noteIndex % notePool.length],
      velocity: 0.08 + intensity * 0.05,
      pan,
      brightness: 0.32 + intensity * 0.42,
      rng,
    });
  });
}

function addLeadPhrase(channels, spec, chord, barStartSec, intensity, sectionIndex, rng) {
  if (!spec.lead || intensity < 0.45) {
    return;
  }

  const degreeOffset = sectionIndex % 2 === 0 ? 0 : 2;
  let noteStart = barStartSec;

  DAWN_MOTIF.degrees.forEach((degree, index) => {
    const midi =
      index === 2 && spec.texture === 'regret'
        ? resolveScaleMidi(spec, degree + degreeOffset + 7, 0)
        : resolveScaleMidi(spec, degree + degreeOffset + 7, 0);
    const beatDuration = DAWN_MOTIF.rhythms[index];

    addInstrumentNote(channels, spec, {
      instrument: spec.lead,
      startSec: noteStart,
      durationSec: beatsToSeconds(beatDuration * 0.88, spec.bpm),
      midi,
      velocity: 0.11 + intensity * 0.07,
      pan: index % 2 === 0 ? -0.08 : 0.1,
      brightness: 0.42 + intensity * 0.48,
      rng,
    });

    noteStart += beatsToSeconds(beatDuration, spec.bpm);
  });

  if (spec.texture === 'choir' || spec.texture === 'anchor') {
    addInstrumentNote(channels, spec, {
      instrument: 'glassLead',
      startSec: barStartSec + beatsToSeconds(2, spec.bpm),
      durationSec: beatsToSeconds(2.1, spec.bpm),
      midi: chord.leadTones.at(-1) ?? chord.leadTones[0],
      velocity: 0.07 + intensity * 0.04,
      pan: 0.16,
      brightness: 0.6,
      rng,
    });
  }
}

function addDrumBar(channels, spec, barStartSec, intensity, barIndex, rng) {
  const beat = (offset) => barStartSec + beatsToSeconds(offset, spec.bpm);

  if (spec.drumPattern === 'none') {
    return;
  }

  if (spec.drumPattern === 'lightPulse') {
    addKick(channels, beat(0), 0.16 + intensity * 0.08, rng);
    addHat(channels, beat(1.5), 0.04 + intensity * 0.03, -0.1, rng);
    addHat(channels, beat(3.5), 0.04 + intensity * 0.03, 0.1, rng);
    return;
  }

  if (spec.drumPattern === 'travel') {
    addKick(channels, beat(0), 0.2 + intensity * 0.08, rng);
    addSnare(channels, beat(2), 0.09 + intensity * 0.06, rng);

    for (let index = 0; index < 8; index += 1) {
      addHat(
        channels,
        beat(index * 0.5),
        0.04 + intensity * 0.04,
        index % 2 === 0 ? -0.18 : 0.18,
        rng
      );
    }

    return;
  }

  if (spec.drumPattern === 'tense') {
    addKick(channels, beat(0), 0.22 + intensity * 0.1, rng);
    addTom(channels, beat(1.5), 0.08 + intensity * 0.08, -0.12);
    addSnare(channels, beat(3), 0.08 + intensity * 0.06, rng);

    for (let index = 1; index < 8; index += 2) {
      addHat(
        channels,
        beat(index * 0.5),
        0.05 + intensity * 0.03,
        index % 4 === 1 ? -0.16 : 0.16,
        rng
      );
    }

    return;
  }

  if (spec.drumPattern === 'battle') {
    addKick(channels, beat(0), 0.26 + intensity * 0.1, rng);
    addKick(channels, beat(1.75), 0.18 + intensity * 0.08, rng);
    addKick(channels, beat(2.5), 0.2 + intensity * 0.08, rng);
    addSnare(channels, beat(1), 0.13 + intensity * 0.07, rng);
    addSnare(channels, beat(3), 0.14 + intensity * 0.07, rng);

    for (let index = 0; index < 8; index += 1) {
      addHat(
        channels,
        beat(index * 0.5),
        0.06 + intensity * 0.04,
        index % 2 === 0 ? -0.18 : 0.18,
        rng
      );
    }

    return;
  }

  if (spec.drumPattern === 'boss' || spec.drumPattern === 'finalBoss') {
    addKick(channels, beat(0), 0.28 + intensity * 0.12, rng);
    addKick(channels, beat(2.5), 0.24 + intensity * 0.08, rng);
    addSnare(channels, beat(1), 0.15 + intensity * 0.08, rng);
    addSnare(channels, beat(3), 0.16 + intensity * 0.08, rng);
    addTom(channels, beat(3.5), 0.1 + intensity * 0.08, barIndex % 2 === 0 ? -0.2 : 0.2);

    for (let index = 0; index < 8; index += 1) {
      addHat(
        channels,
        beat(index * 0.5),
        0.07 + intensity * 0.04,
        index % 2 === 0 ? -0.2 : 0.2,
        rng
      );
    }

    if (spec.drumPattern === 'finalBoss') {
      addTom(channels, beat(2), 0.12 + intensity * 0.08, -0.1);
    }
  }
}

function applyStereoDelay(channels, mix = 0.12, feedback = 0.18, delaySec = 0.27) {
  const delaySamples = Math.max(1, Math.round(delaySec * SAMPLE_RATE));
  const delayedLeft = new Float32Array(channels.left.length);
  const delayedRight = new Float32Array(channels.right.length);

  for (let index = delaySamples; index < channels.left.length; index += 1) {
    delayedLeft[index] = channels.right[index - delaySamples] * feedback;
    delayedRight[index] = channels.left[index - delaySamples] * feedback;
  }

  for (let index = 0; index < channels.left.length; index += 1) {
    channels.left[index] += delayedLeft[index] * mix;
    channels.right[index] += delayedRight[index] * mix;
  }
}

function applyDiffuseReverb(channels, mix = 0.24) {
  const taps = [
    { delay: 0.089, gain: 0.23, cross: 0.08 },
    { delay: 0.131, gain: 0.18, cross: 0.12 },
    { delay: 0.197, gain: 0.14, cross: 0.16 },
    { delay: 0.271, gain: 0.09, cross: 0.12 },
  ].map((tap) => ({
    ...tap,
    delaySamples: Math.round(tap.delay * SAMPLE_RATE),
  }));

  const wetLeft = new Float32Array(channels.left.length);
  const wetRight = new Float32Array(channels.right.length);

  taps.forEach((tap) => {
    for (let index = tap.delaySamples; index < channels.left.length; index += 1) {
      wetLeft[index] +=
        channels.left[index - tap.delaySamples] * tap.gain +
        channels.right[index - tap.delaySamples] * tap.gain * tap.cross;
      wetRight[index] +=
        channels.right[index - tap.delaySamples] * tap.gain +
        channels.left[index - tap.delaySamples] * tap.gain * tap.cross;
    }
  });

  let smoothLeft = 0;
  let smoothRight = 0;

  for (let index = 0; index < channels.left.length; index += 1) {
    smoothLeft += (wetLeft[index] - smoothLeft) * 0.16;
    smoothRight += (wetRight[index] - smoothRight) * 0.16;
    channels.left[index] = channels.left[index] * (1 - mix) + smoothLeft * mix;
    channels.right[index] = channels.right[index] * (1 - mix) + smoothRight * mix;
  }
}

function normalize(channels) {
  let peak = 0;

  for (let index = 0; index < channels.left.length; index += 1) {
    peak = Math.max(peak, Math.abs(channels.left[index]), Math.abs(channels.right[index]));
  }

  const gain = peak > 0 ? MASTER_PEAK / peak : 1;

  for (let index = 0; index < channels.left.length; index += 1) {
    channels.left[index] = Math.tanh(channels.left[index] * gain * 1.05) * 0.96;
    channels.right[index] = Math.tanh(channels.right[index] * gain * 1.05) * 0.96;
  }
}

function renderTrack(spec) {
  const totalSeconds = beatsToSeconds(spec.bars * 4, spec.bpm) + 1.8;
  const totalSamples = Math.ceil(totalSeconds * SAMPLE_RATE);
  const channels = createStereoBuffer(totalSamples);
  const rng = createRandom(hashString(spec.id));

  for (let barIndex = 0; barIndex < spec.bars; barIndex += 1) {
    const sectionIndex = Math.floor(barIndex / 4);
    const intensity = spec.sectionCurve[sectionIndex] ?? spec.sectionCurve.at(-1) ?? 0.5;
    const barStartSec = beatsToSeconds(barIndex * 4, spec.bpm);
    const chord = buildChord(spec, spec.progression[barIndex % spec.progression.length]);

    addPadBar(channels, spec, chord, barStartSec, intensity, rng);
    addDroneBar(channels, spec, chord, barStartSec, intensity, rng);
    addBassBar(channels, spec, chord, barStartSec, intensity, rng);
    addArpBar(channels, spec, chord, barStartSec, intensity, rng);
    addDrumBar(channels, spec, barStartSec, intensity, barIndex, rng);

    const leadGate =
      barIndex % 4 === 0 &&
      (sectionIndex > 0 ||
        spec.category.includes('title') ||
        spec.category.includes('ending') ||
        spec.category.includes('final-boss'));

    if (leadGate) {
      addLeadPhrase(channels, spec, chord, barStartSec, intensity, sectionIndex, rng);
    }

    if (
      (spec.category.includes('tension') ||
        spec.category.includes('boss') ||
        spec.category.includes('final-dungeon')) &&
      barIndex % 4 === 3
    ) {
      addRiser(
        channels,
        barStartSec + beatsToSeconds(2.5, spec.bpm),
        beatsToSeconds(1.5, spec.bpm),
        intensity * 0.35,
        0,
        rng
      );
    }
  }

  applyStereoDelay(
    channels,
    spec.category.includes('battle') ? 0.08 : 0.12,
    spec.category.includes('final-boss') ? 0.24 : 0.18
  );
  applyDiffuseReverb(channels, spec.category.includes('battle') ? 0.18 : 0.26);
  normalize(channels);

  return {
    channels,
    durationSeconds: totalSeconds,
  };
}

function encodeWav24(channels) {
  const frameCount = channels.left.length;
  const byteRate = SAMPLE_RATE * 2 * 3;
  const blockAlign = 2 * 3;
  const dataLength = frameCount * blockAlign;
  const buffer = Buffer.alloc(44 + dataLength);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataLength, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(2, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(24, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataLength, 40);

  let offset = 44;

  for (let index = 0; index < frameCount; index += 1) {
    const left = Math.round(clamp(channels.left[index], -1, 1) * 8388607);
    const right = Math.round(clamp(channels.right[index], -1, 1) * 8388607);

    buffer.writeIntLE(left, offset, 3);
    offset += 3;
    buffer.writeIntLE(right, offset, 3);
    offset += 3;
  }

  return buffer;
}

function encodeTrack(wavPath, oggPath) {
  const ffmpeg = spawnSync(
    'ffmpeg',
    ['-y', '-loglevel', 'error', '-i', wavPath, '-c:a', 'libvorbis', '-qscale:a', '8', oggPath],
    { stdio: 'inherit' }
  );

  if (ffmpeg.status !== 0) {
    throw new Error(`ffmpeg 인코딩 실패: ${oggPath}`);
  }
}

function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  const manifest = {
    generatedAt: new Date().toISOString(),
    sampleRate: SAMPLE_RATE,
    sourceFormat: 'wav-24bit-stereo',
    distributionFormat: 'ogg-vorbis-q8',
    motif: {
      name: 'Dawn Motif',
      degrees: DAWN_MOTIF.degrees,
      rhythms: DAWN_MOTIF.rhythms,
    },
    tracks: [],
  };

  TRACKS.forEach((spec) => {
    const { channels, durationSeconds } = renderTrack(spec);
    const wavPath = resolve(OUTPUT_DIR, `${spec.id}.wav`);
    const oggPath = resolve(OUTPUT_DIR, `${spec.id}.ogg`);

    writeFileSync(wavPath, encodeWav24(channels));
    encodeTrack(wavPath, oggPath);
    rmSync(wavPath);

    manifest.tracks.push({
      id: spec.id,
      title: spec.title,
      bpm: spec.bpm,
      mode: spec.mode,
      tonicMidi: spec.tonicMidi,
      bars: spec.bars,
      loop: spec.loop,
      durationSeconds: Number(durationSeconds.toFixed(2)),
      category: spec.category,
      file: `assets/audio/${spec.id}.ogg`,
      scenes: spec.scenes,
      summary: spec.summary,
    });

    process.stdout.write(`rendered ${spec.id}.ogg\n`);
  });

  writeFileSync(resolve(OUTPUT_DIR, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
}

main();
