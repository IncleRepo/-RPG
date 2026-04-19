import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { Buffer } from 'node:buffer';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const audioOutputDir = path.join(projectRoot, 'assets/audio/bgm');
const contentOutputDir = path.join(projectRoot, 'src/content/audio');

const SAMPLE_RATE = 48_000;
const TWO_PI = Math.PI * 2;
const MODES = Object.freeze({
  ionian: [0, 2, 4, 5, 7, 9, 11],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  aeolian: [0, 2, 3, 5, 7, 8, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
});

const TRACKS = Object.freeze([
  {
    id: 'dawnbound-overture',
    title: 'Dawnbound Overture',
    category: '타이틀 / 메인 테마',
    chapters: ['타이틀 화면', '오프닝 스토리 요약', '대표 트레일러'],
    scenes: '반향해의 몽환성, 사라진 새벽의 불안, 모험 개시의 결의를 함께 잡는 메인 테마',
    mood: '꿈결 같은 항해감, 금빛 희망, 미세한 불길함',
    instrumentation: ['air pad', 'piano', 'bell', 'bass', 'brush kit', 'choir'],
    bpm: 92,
    key: 'D dorian',
    rootMidi: 62,
    mode: 'dorian',
    bars: 32,
    output: 'dawnbound-overture.ogg',
    style: 'title',
    reverbMix: 0.28,
    masterGain: 0.74,
    loop: true,
  },
  {
    id: 'mirajin-everdusk',
    title: 'Mirajin Everdusk',
    category: '마을 / 허브',
    chapters: ['프롤로그', '미라진 항구', '정박 허브'],
    scenes: '아침이 오지 않는 항구의 황혼과 주민들의 멈춘 불안을 표현하는 허브 BGM',
    mood: '붉은 황혼, 잔향, 조용한 죄책감',
    instrumentation: ['glass pad', 'felt piano', 'low strings', 'sea bell'],
    bpm: 74,
    key: 'A aeolian',
    rootMidi: 57,
    mode: 'aeolian',
    bars: 24,
    output: 'mirajin-everdusk.ogg',
    style: 'harbor',
    reverbMix: 0.32,
    masterGain: 0.76,
    loop: true,
  },
  {
    id: 'glasssalt-horizon',
    title: 'Glasssalt Horizon',
    category: '탐험',
    chapters: ['챕터 1', '유리염 사구'],
    scenes: '메마른 미래와 넓은 사막 항해감을 담는 필드 탐험용 루프',
    mood: '건조한 바람, 잔존 희망, 체념하지 않는 생존',
    instrumentation: ['desert pluck', 'warm pad', 'marimba', 'bass', 'frame drum'],
    bpm: 96,
    key: 'E lydian',
    rootMidi: 64,
    mode: 'lydian',
    bars: 24,
    output: 'glasssalt-horizon.ogg',
    style: 'desert',
    reverbMix: 0.22,
    masterGain: 0.8,
    loop: true,
  },
  {
    id: 'time-storm-surge',
    title: 'Time Storm Surge',
    category: '긴장 / 추적',
    chapters: ['프롤로그 추격', '챕터 1 구조전', '균열 폭주 이벤트'],
    scenes: '붕괴와 추적, 구조 우선 판단이 겹치는 긴급 시퀀스용 전개',
    mood: '압박, 균열, 분 단위의 생존 판단',
    instrumentation: ['pulse strings', 'synth bass', 'taiko', 'shaker', 'alarm bell'],
    bpm: 118,
    key: 'D phrygian',
    rootMidi: 62,
    mode: 'phrygian',
    bars: 24,
    output: 'time-storm-surge.ogg',
    style: 'tension',
    reverbMix: 0.18,
    masterGain: 0.82,
    loop: true,
  },
  {
    id: 'kadel-upside-tide',
    title: 'Kadel Upside Tide',
    category: '마을 / 정치 허브',
    chapters: ['챕터 2', '역항도 카델'],
    scenes: '거꾸로 매달린 도시의 냉정함, 효율, 불편한 안정감을 표현하는 도시 테마',
    mood: '차가운 질서, 구조화된 불안, 세련된 압박',
    instrumentation: ['clock arp', 'string pad', 'sub bass', 'muted pulse'],
    bpm: 88,
    key: 'C lydian',
    rootMidi: 60,
    mode: 'lydian',
    bars: 24,
    output: 'kadel-upside-tide.ogg',
    style: 'city',
    reverbMix: 0.2,
    masterGain: 0.8,
    loop: true,
  },
  {
    id: 'ceiling-heart-breach',
    title: 'Ceiling Heart Breach',
    category: '긴장 / 추적',
    chapters: ['챕터 2 코어 붕괴', '시민 구조 연속 전투'],
    scenes: '중력 전환 사고와 코어 방어전의 급박함을 위한 고밀도 액션 큐',
    mood: '기계적 공포, 수직 추락, 멈출 수 없는 붕괴',
    instrumentation: ['ostinato strings', 'choir stab', 'bass synth', 'hybrid drums'],
    bpm: 110,
    key: 'E aeolian',
    rootMidi: 64,
    mode: 'aeolian',
    bars: 24,
    output: 'ceiling-heart-breach.ogg',
    style: 'crisis',
    reverbMix: 0.18,
    masterGain: 0.82,
    loop: true,
  },
  {
    id: 'whispering-orchard',
    title: 'Whispering Orchard',
    category: '탐험 / 감정 이벤트',
    chapters: ['챕터 3', '속삭임 과수원'],
    scenes: '열매마다 아직 말하지 않은 감정이 흐르는 지역 탐험 및 대화 장면용 테마',
    mood: '부드러운 슬픔, 친밀한 불편함, 잔향의 다정함',
    instrumentation: ['harp', 'choir pad', 'soft piano', 'wood pulse'],
    bpm: 82,
    key: 'F lydian',
    rootMidi: 65,
    mode: 'lydian',
    bars: 24,
    output: 'whispering-orchard.ogg',
    style: 'orchard',
    reverbMix: 0.3,
    masterGain: 0.76,
    loop: true,
  },
  {
    id: 'spine-of-unwritten-days',
    title: 'Spine of Unwritten Days',
    category: '감정 이벤트 / 진실 공개',
    chapters: ['챕터 3', '무도서고 척추탑', '정체성 공개 장면'],
    scenes: '선택되지 못한 역사와 플레이어의 원죄가 드러나는 구간의 중후한 서사 음악',
    mood: '깊은 죄책감, 공허, 거대한 진실의 무게',
    instrumentation: ['low choir', 'dark piano', 'bowed pad', 'granular pulse'],
    bpm: 68,
    key: 'D aeolian',
    rootMidi: 62,
    mode: 'aeolian',
    bars: 24,
    output: 'spine-of-unwritten-days.ogg',
    style: 'revelation',
    reverbMix: 0.34,
    masterGain: 0.74,
    loop: true,
  },
  {
    id: 'echo-skirmish',
    title: 'Echo Skirmish',
    category: '전투',
    chapters: ['일반 필드 전투', '균열 생물 전투'],
    scenes: '기동성과 잔향 능력을 강조하는 기본 전투 루프',
    mood: '재빠른 긴장, 의지, 가속되는 판단',
    instrumentation: ['staccato strings', 'lead pulse', 'bass', 'battle drums'],
    bpm: 136,
    key: 'D dorian',
    rootMidi: 62,
    mode: 'dorian',
    bars: 24,
    output: 'echo-skirmish.ogg',
    style: 'battle',
    reverbMix: 0.16,
    masterGain: 0.84,
    loop: true,
  },
  {
    id: 'bellshard-colossus',
    title: 'Bellshard Colossus',
    category: '보스전',
    chapters: ['유리염 거신', '황혼 파수체', '역추자', '후회목'],
    scenes: '각 챕터 보스전에서 공통 사용 가능한 압도감 중심 보스 테마',
    mood: '위압, 파편 공명, 몰아치는 결전감',
    instrumentation: ['choir', 'aggressive strings', 'taiko', 'sub brass synth', 'bell hits'],
    bpm: 148,
    key: 'C phrygian',
    rootMidi: 60,
    mode: 'phrygian',
    bars: 32,
    output: 'bellshard-colossus.ogg',
    style: 'boss',
    reverbMix: 0.18,
    masterGain: 0.86,
    loop: true,
  },
  {
    id: 'saya-lens-vow',
    title: "Saya's Unfinished Vow",
    category: '감정 이벤트',
    chapters: ['사야 렌 단독 장면', '언니와 플레이어 사이의 갈등 장면'],
    scenes: '사야 렌의 집착, 죄책감, 애정을 묶는 개인 감정 테마',
    mood: '가까워질수록 아픈 다정함, 복구 욕망, 흔들리는 평정',
    instrumentation: ['felt piano', 'solo string', 'glass choir', 'soft bass'],
    bpm: 72,
    key: 'B ionian',
    rootMidi: 59,
    mode: 'ionian',
    bars: 24,
    output: 'saya-lens-vow.ogg',
    style: 'emotional',
    reverbMix: 0.34,
    masterGain: 0.74,
    loop: true,
  },
  {
    id: 'silent-coral-palace',
    title: 'Silent Coral Palace',
    category: '최종 던전',
    chapters: ['엔딩 챕터', '침묵 산호궁 외곽과 심해 기관실'],
    scenes: '심해 구조물, 오래된 종소리 잔향, 최후 선택 전 긴장을 유지하는 던전 BGM',
    mood: '심해의 압력, 장엄함, 끝이 다가오는 침묵',
    instrumentation: ['deep choir', 'organ pad', 'bell motif', 'sub bass', 'ritual drums'],
    bpm: 78,
    key: 'D dorian',
    rootMidi: 62,
    mode: 'dorian',
    bars: 24,
    output: 'silent-coral-palace.ogg',
    style: 'finale',
    reverbMix: 0.36,
    masterGain: 0.8,
    loop: true,
  },
  {
    id: 'ending-restored-dawn',
    title: 'Restored Dawn',
    category: '엔딩',
    chapters: ['엔딩 A: 새벽종 복구'],
    scenes: '안정과 통제가 함께 남는 복구 엔딩 전용 결과 음악',
    mood: '안도, 인공적 안정, 달콤하지만 완전하지 않은 마침',
    instrumentation: ['strings', 'piano', 'bell', 'soft choir'],
    bpm: 76,
    key: 'D ionian',
    rootMidi: 62,
    mode: 'ionian',
    bars: 16,
    output: 'ending-restored-dawn.ogg',
    style: 'ending-restore',
    reverbMix: 0.3,
    masterGain: 0.76,
    loop: false,
  },
  {
    id: 'ending-unbound-tide',
    title: 'Unbound Tide',
    category: '엔딩',
    chapters: ['엔딩 B: 새벽종 해체'],
    scenes: '불안정하지만 자유로워진 세계를 비추는 해체 엔딩 결과 음악',
    mood: '해방, 상실, 자연스러운 흔들림',
    instrumentation: ['harp', 'open strings', 'warm pad', 'hand percussion'],
    bpm: 84,
    key: 'G mixolydian',
    rootMidi: 67,
    mode: 'mixolydian',
    bars: 16,
    output: 'ending-unbound-tide.ogg',
    style: 'ending-release',
    reverbMix: 0.28,
    masterGain: 0.78,
    loop: false,
  },
  {
    id: 'ending-vigil-of-tomorrow',
    title: 'Vigil of Tomorrow',
    category: '엔딩',
    chapters: ['엔딩 C: 플레이어의 결속'],
    scenes: '플레이어가 매개체가 되는 결속 엔딩의 쓸쓸한 여운을 위한 전용 결과 음악',
    mood: '희생, 고요한 존엄, 멀어지는 인간적 체온',
    instrumentation: ['solo piano', 'low choir', 'pad', 'distant bell'],
    bpm: 66,
    key: 'B aeolian',
    rootMidi: 59,
    mode: 'aeolian',
    bars: 16,
    output: 'ending-vigil-of-tomorrow.ogg',
    style: 'ending-vigil',
    reverbMix: 0.36,
    masterGain: 0.74,
    loop: false,
  },
  {
    id: 'last-dawn-credits',
    title: 'Last Dawn Credits',
    category: '엔딩 / 크레딧',
    chapters: ['공통 크레딧', '후일담 정리'],
    scenes: '메인 테마를 회수하면서도 선택의 대가를 남기는 크레딧용 종결곡',
    mood: '회고, 바다의 여운, 다시 시작되는 내일',
    instrumentation: ['full strings', 'piano', 'harp', 'choir', 'bell', 'brush drums'],
    bpm: 90,
    key: 'D dorian',
    rootMidi: 62,
    mode: 'dorian',
    bars: 32,
    output: 'last-dawn-credits.ogg',
    style: 'credits',
    reverbMix: 0.28,
    masterGain: 0.78,
    loop: false,
  },
]);

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function midiToFrequency(midi) {
  return 440 * 2 ** ((midi - 69) / 12);
}

function createSeededRandom(seed) {
  let state = seed >>> 0;

  return () => {
    state = (state * 1_664_525 + 1_013_904_223) >>> 0;
    return state / 0x1_0000_0000;
  };
}

function hashString(value) {
  let hash = 2_166_136_261;

  for (const character of value) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16_777_619);
  }

  return hash >>> 0;
}

function degreeToMidi(track, degree, octave = 0, register = 0) {
  const intervals = MODES[track.mode];
  const scaleLength = intervals.length;
  const normalized = ((degree % scaleLength) + scaleLength) % scaleLength;
  const octaveOffset = Math.floor(degree / scaleLength) * 12;
  return track.rootMidi + intervals[normalized] + octaveOffset + octave * 12 + register;
}

function constantPowerPan(pan) {
  const normalized = clamp(pan, -1, 1);
  const angle = (normalized + 1) * (Math.PI / 4);
  return {
    left: Math.cos(angle),
    right: Math.sin(angle),
  };
}

function createBuffer(track) {
  const durationSeconds = track.bars * (240 / track.bpm);
  const length = Math.ceil(durationSeconds * SAMPLE_RATE);
  return {
    durationSeconds,
    length,
    left: new Float32Array(length),
    right: new Float32Array(length),
  };
}

function createTrackContext(track, buffer) {
  return {
    ...track,
    ...buffer,
    beatSeconds: 60 / track.bpm,
    barSeconds: 240 / track.bpm,
    bars: track.bars,
    random: createSeededRandom(hashString(track.id)),
  };
}

function addSample(buffer, index, sample, leftGain, rightGain) {
  if (index < 0 || index >= buffer.length) {
    return;
  }

  buffer.left[index] += sample * leftGain;
  buffer.right[index] += sample * rightGain;
}

function envelopeValue(t, duration, attack, decay, sustain, release) {
  const safeAttack = Math.max(attack, 0.0001);
  const safeDecay = Math.max(decay, 0.0001);
  const safeRelease = Math.max(release, 0.0001);
  const sustainStart = safeAttack + safeDecay;
  const releaseStart = Math.max(duration - safeRelease, sustainStart);

  if (t < 0 || t > duration) {
    return 0;
  }

  if (t < safeAttack) {
    return t / safeAttack;
  }

  if (t < sustainStart) {
    const progress = (t - safeAttack) / safeDecay;
    return 1 - (1 - sustain) * progress;
  }

  if (t < releaseStart) {
    return sustain;
  }

  const progress = (t - releaseStart) / safeRelease;
  return sustain * (1 - progress);
}

function harmonicWave(phase, waveform) {
  const wrapped = phase / TWO_PI;
  const fraction = wrapped - Math.floor(wrapped);

  if (waveform === 'triangle') {
    return 1 - 4 * Math.abs(fraction - 0.5);
  }

  if (waveform === 'saw') {
    return fraction * 2 - 1;
  }

  if (waveform === 'square') {
    return fraction < 0.5 ? 1 : -1;
  }

  return Math.sin(phase);
}

function renderTone(buffer, params) {
  const {
    start,
    duration,
    midi,
    gain = 0.2,
    pan = 0,
    attack = 0.01,
    decay = 0.14,
    sustain = 0.72,
    release = 0.24,
    vibratoRate = 0,
    vibratoDepth = 0,
    tremoloRate = 0,
    tremoloDepth = 0,
    pitchDrop = 0,
    partials = [{ multiple: 1, gain: 1, waveform: 'sine', detune: 0 }],
  } = params;

  const startIndex = Math.floor(start * SAMPLE_RATE);
  const sampleCount = Math.ceil(duration * SAMPLE_RATE);
  const baseFrequency = midiToFrequency(midi);
  const { left: leftGain, right: rightGain } = constantPowerPan(pan);

  for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex += 1) {
    const t = sampleIndex / SAMPLE_RATE;
    const env = envelopeValue(t, duration, attack, decay, sustain, release);

    if (env <= 0) {
      continue;
    }

    const vibrato = vibratoDepth ? 1 + Math.sin(TWO_PI * vibratoRate * t) * vibratoDepth : 1;
    const tremolo = tremoloDepth ? 1 + Math.sin(TWO_PI * tremoloRate * t) * tremoloDepth : 1;
    const pitchEnvelope = pitchDrop ? 1 + Math.exp(-t * 9) * pitchDrop : 1;
    let sample = 0;

    for (const partial of partials) {
      const detune = partial.detune ?? 0;
      const frequency = baseFrequency * partial.multiple * (1 + detune) * vibrato * pitchEnvelope;
      const phase = TWO_PI * frequency * t + (partial.phase ?? 0);
      sample += harmonicWave(phase, partial.waveform ?? 'sine') * partial.gain;
    }

    addSample(buffer, startIndex + sampleIndex, sample * gain * env * tremolo, leftGain, rightGain);
  }
}

function renderNoise(buffer, params) {
  const {
    start,
    duration,
    gain = 0.15,
    pan = 0,
    attack = 0.001,
    decay = 0.04,
    sustain = 0.18,
    release = 0.07,
    lowPass = 0.25,
    seed = 1,
  } = params;
  const random = createSeededRandom(seed);
  const startIndex = Math.floor(start * SAMPLE_RATE);
  const sampleCount = Math.ceil(duration * SAMPLE_RATE);
  const { left: leftGain, right: rightGain } = constantPowerPan(pan);
  let filtered = 0;

  for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex += 1) {
    const t = sampleIndex / SAMPLE_RATE;
    const env = envelopeValue(t, duration, attack, decay, sustain, release);

    if (env <= 0) {
      continue;
    }

    const white = random() * 2 - 1;
    filtered += (white - filtered) * lowPass;
    addSample(buffer, startIndex + sampleIndex, filtered * gain * env, leftGain, rightGain);
  }
}

function renderKick(buffer, start, gain = 0.42, pan = 0) {
  renderTone(buffer, {
    start,
    duration: 0.52,
    midi: 28,
    gain,
    pan,
    attack: 0.001,
    decay: 0.09,
    sustain: 0.16,
    release: 0.22,
    pitchDrop: 1.4,
    partials: [
      { multiple: 1, gain: 1, waveform: 'sine' },
      { multiple: 2, gain: 0.1, waveform: 'sine' },
    ],
  });
  renderNoise(buffer, {
    start,
    duration: 0.08,
    gain: gain * 0.12,
    pan,
    lowPass: 0.35,
    seed: 19_919,
  });
}

function renderSnare(buffer, start, gain = 0.2, pan = 0) {
  renderNoise(buffer, {
    start,
    duration: 0.18,
    gain,
    pan,
    attack: 0.001,
    decay: 0.04,
    sustain: 0.14,
    release: 0.08,
    lowPass: 0.58,
    seed: 8_731,
  });
  renderTone(buffer, {
    start,
    duration: 0.15,
    midi: 42,
    gain: gain * 0.2,
    pan,
    attack: 0.001,
    decay: 0.02,
    sustain: 0.18,
    release: 0.04,
    partials: [{ multiple: 1, gain: 1, waveform: 'triangle' }],
  });
}

function renderHat(buffer, start, gain = 0.08, pan = 0.2) {
  renderNoise(buffer, {
    start,
    duration: 0.09,
    gain,
    pan,
    attack: 0.001,
    decay: 0.01,
    sustain: 0.08,
    release: 0.03,
    lowPass: 0.82,
    seed: 4_111 + Math.floor(start * 97),
  });
}

function renderTom(buffer, start, midi = 40, gain = 0.2, pan = -0.25) {
  renderTone(buffer, {
    start,
    duration: 0.32,
    midi,
    gain,
    pan,
    attack: 0.001,
    decay: 0.03,
    sustain: 0.24,
    release: 0.12,
    pitchDrop: 0.55,
    partials: [
      { multiple: 1, gain: 1, waveform: 'sine' },
      { multiple: 1.5, gain: 0.12, waveform: 'sine' },
    ],
  });
}

function addChordPad(buffer, track, progression, options = {}) {
  const {
    barsPerChord = 2,
    startBar = 0,
    instrument = 'pad',
    octave = 0,
    register = 0,
    gain = 0.18,
    spread = [-0.35, 0, 0.35],
    includeSeventh = false,
  } = options;

  const instrumentPartials =
    instrument === 'choir'
      ? [
          { multiple: 1, gain: 0.8, waveform: 'sine' },
          { multiple: 2, gain: 0.15, waveform: 'triangle' },
          { multiple: 3, gain: 0.07, waveform: 'sine' },
        ]
      : [
          { multiple: 1, gain: 0.9, waveform: 'sine', detune: -0.004 },
          { multiple: 1, gain: 0.7, waveform: 'sine', detune: 0.005 },
          { multiple: 2, gain: 0.15, waveform: 'triangle' },
        ];

  progression.forEach((degree, chordIndex) => {
    const start = (startBar + chordIndex * barsPerChord) * track.barSeconds;
    const duration = barsPerChord * track.barSeconds;
    const tones = [degree, degree + 2, degree + 4];

    if (includeSeventh) {
      tones.push(degree + 6);
    }

    tones.forEach((toneDegree, noteIndex) => {
      renderTone(buffer, {
        start,
        duration,
        midi: degreeToMidi(track, toneDegree, octave, register),
        gain: gain * (noteIndex === 0 ? 1 : 0.84),
        pan: spread[noteIndex % spread.length],
        attack: 0.7,
        decay: 1.2,
        sustain: 0.7,
        release: 1.4,
        vibratoRate: 4.2,
        vibratoDepth: instrument === 'choir' ? 0.0022 : 0.0012,
        partials: instrumentPartials,
      });
    });
  });
}

function addBassPattern(buffer, track, progression, options = {}) {
  const {
    barsPerChord = 2,
    startBar = 0,
    octave = -2,
    gain = 0.16,
    sustainBeats = 2,
    pattern = [0, 0, 4, 0],
  } = options;

  progression.forEach((degree, chordIndex) => {
    const chordStartBar = startBar + chordIndex * barsPerChord;

    pattern.forEach((interval, beatIndex) => {
      const start = chordStartBar * track.barSeconds + beatIndex * track.beatSeconds;
      const duration = sustainBeats * track.beatSeconds;
      renderTone(buffer, {
        start,
        duration,
        midi: degreeToMidi(track, degree + interval, octave),
        gain,
        pan: -0.05,
        attack: 0.01,
        decay: 0.2,
        sustain: 0.72,
        release: 0.18,
        partials: [
          { multiple: 1, gain: 1, waveform: 'sine' },
          { multiple: 2, gain: 0.22, waveform: 'triangle' },
        ],
      });
    });
  });
}

function addArpeggio(buffer, track, progression, options = {}) {
  const {
    barsPerChord = 2,
    startBar = 0,
    octave = 0,
    register = 0,
    gain = 0.14,
    pattern = [0, 1, 2, 1, 3, 2, 1, 2],
    stepBeats = 0.5,
    panRange = 0.5,
    instrument = 'pluck',
  } = options;

  progression.forEach((degree, chordIndex) => {
    const chordStart = (startBar + chordIndex * barsPerChord) * track.barSeconds;
    const tones = [degree, degree + 2, degree + 4, degree + 6];

    for (let step = 0; step < barsPerChord * (4 / stepBeats); step += 1) {
      const toneDegree = tones[pattern[step % pattern.length] % tones.length];
      const pan = Math.sin((step / pattern.length) * TWO_PI) * panRange;
      renderTone(buffer, {
        start: chordStart + step * stepBeats * track.beatSeconds,
        duration: Math.max(stepBeats * track.beatSeconds * 1.5, 0.24),
        midi: degreeToMidi(track, toneDegree, octave, register),
        gain: instrument === 'clock' ? gain * 0.72 : gain,
        pan,
        attack: 0.004,
        decay: instrument === 'clock' ? 0.05 : 0.08,
        sustain: 0.18,
        release: instrument === 'clock' ? 0.08 : 0.16,
        partials:
          instrument === 'clock'
            ? [
                { multiple: 1, gain: 1, waveform: 'triangle' },
                { multiple: 2.9, gain: 0.22, waveform: 'sine' },
                { multiple: 4.7, gain: 0.16, waveform: 'sine' },
              ]
            : [
                { multiple: 1, gain: 1, waveform: 'triangle' },
                { multiple: 2, gain: 0.25, waveform: 'sine' },
                { multiple: 3, gain: 0.14, waveform: 'sine' },
              ],
      });
    }
  });
}

function addMelody(buffer, track, notes, options = {}) {
  const {
    startBar = 0,
    octave = 1,
    register = 0,
    gain = 0.2,
    pan = 0.08,
    instrument = 'lead',
    legato = 0.94,
  } = options;

  let cursorBeats = startBar * 4;

  for (const note of notes) {
    const durationBeats = note.beats;

    if (note.degree !== null && note.degree !== undefined) {
      renderTone(buffer, {
        start: cursorBeats * track.beatSeconds,
        duration: Math.max(durationBeats * track.beatSeconds * legato, 0.18),
        midi: degreeToMidi(track, note.degree, octave, register),
        gain: gain * (note.accent ?? 1),
        pan: note.pan ?? pan,
        attack: instrument === 'bell' ? 0.003 : 0.02,
        decay: instrument === 'bell' ? 0.3 : 0.16,
        sustain: instrument === 'bell' ? 0.12 : 0.7,
        release: instrument === 'bell' ? 0.45 : 0.22,
        vibratoRate: instrument === 'lead' ? 5.1 : 4.2,
        vibratoDepth: instrument === 'lead' ? 0.002 : 0.0012,
        partials:
          instrument === 'bell'
            ? [
                { multiple: 1, gain: 1, waveform: 'sine' },
                { multiple: 2.71, gain: 0.28, waveform: 'sine' },
                { multiple: 4.93, gain: 0.2, waveform: 'sine' },
              ]
            : instrument === 'string'
              ? [
                  { multiple: 1, gain: 0.85, waveform: 'sine', detune: -0.003 },
                  { multiple: 1, gain: 0.72, waveform: 'sine', detune: 0.004 },
                  { multiple: 2, gain: 0.14, waveform: 'triangle' },
                ]
              : [
                  { multiple: 1, gain: 1, waveform: 'triangle' },
                  { multiple: 2, gain: 0.26, waveform: 'sine' },
                  { multiple: 3, gain: 0.1, waveform: 'sine' },
                ],
      });
    }

    cursorBeats += durationBeats;
  }
}

function addDrumLoop(buffer, track, options = {}) {
  const {
    startBar = 0,
    endBar = track.bars,
    kickPattern = [0, 2],
    snarePattern = [1, 3],
    hatStep = 0.5,
    kickGain = 0.34,
    snareGain = 0.16,
    hatGain = 0.055,
    tomPattern = [],
    swing = 0,
  } = options;

  for (let bar = startBar; bar < endBar; bar += 1) {
    const barStart = bar * track.barSeconds;

    for (const beat of kickPattern) {
      renderKick(buffer, barStart + beat * track.beatSeconds, kickGain, 0);
    }

    for (const beat of snarePattern) {
      renderSnare(buffer, barStart + beat * track.beatSeconds, snareGain, 0.05);
    }

    const hatCount = Math.floor(4 / hatStep);
    for (let step = 0; step < hatCount; step += 1) {
      const beat = step * hatStep;
      const offset = step % 2 === 1 ? swing * track.beatSeconds : 0;
      renderHat(
        buffer,
        barStart + beat * track.beatSeconds + offset,
        hatGain * (step % 4 === 0 ? 1 : 0.84),
        step % 2 === 0 ? 0.22 : -0.22
      );
    }

    for (const tom of tomPattern) {
      renderTom(buffer, barStart + tom.beat * track.beatSeconds, tom.midi, tom.gain, tom.pan);
    }
  }
}

const MAIN_THEME = Object.freeze([
  { degree: 0, beats: 1 },
  { degree: 2, beats: 1 },
  { degree: 4, beats: 1 },
  { degree: 5, beats: 1 },
  { degree: 7, beats: 2 },
  { degree: 4, beats: 1 },
  { degree: 2, beats: 1 },
  { degree: 0, beats: 1 },
  { degree: 2, beats: 1 },
  { degree: 4, beats: 2 },
  { degree: 5, beats: 1 },
  { degree: 4, beats: 1 },
  { degree: 2, beats: 2 },
  { degree: null, beats: 2 },
]);

function stretchTheme(variant = []) {
  return MAIN_THEME.map((note, index) => {
    const change = variant[index] ?? 0;
    return note.degree === null
      ? note
      : {
          ...note,
          degree: note.degree + change,
        };
  });
}

function loopTheme(times, variantFactory) {
  const output = [];

  for (let index = 0; index < times; index += 1) {
    const variant = typeof variantFactory === 'function' ? variantFactory(index) : [];
    output.push(...stretchTheme(variant));
  }

  return output;
}

function arrangeTitle(track, buffer) {
  const progression = [0, 5, 3, 4, 0, 5, 2, 4, 0, 5, 3, 4, 0, 2, 4, 5];
  addChordPad(buffer, track, progression, {
    barsPerChord: 2,
    instrument: 'pad',
    octave: 0,
    gain: 0.16,
    includeSeventh: true,
  });
  addChordPad(buffer, track, progression, {
    barsPerChord: 2,
    instrument: 'choir',
    octave: 1,
    register: -12,
    gain: 0.07,
    includeSeventh: true,
  });
  addBassPattern(buffer, track, progression, {
    barsPerChord: 2,
    pattern: [0, 4, 0, 5],
    gain: 0.14,
  });
  addArpeggio(buffer, track, progression, {
    barsPerChord: 2,
    octave: 1,
    gain: 0.08,
    instrument: 'pluck',
  });
  addMelody(
    buffer,
    track,
    loopTheme(4, (index) => (index % 2 === 0 ? [] : [0, 0, -1, 0])),
    {
      startBar: 0,
      octave: 1,
      gain: 0.17,
      instrument: 'string',
    }
  );
  addMelody(
    buffer,
    track,
    [
      { degree: 0, beats: 2, accent: 0.75 },
      { degree: null, beats: 2 },
      { degree: 5, beats: 2, accent: 0.75 },
      { degree: null, beats: 2 },
      { degree: 4, beats: 2, accent: 0.75 },
      { degree: null, beats: 2 },
      { degree: 2, beats: 2, accent: 0.75 },
      { degree: null, beats: 2 },
    ],
    {
      startBar: 16,
      octave: 2,
      gain: 0.09,
      instrument: 'bell',
      pan: -0.16,
    }
  );
  addDrumLoop(buffer, track, {
    startBar: 8,
    endBar: track.bars,
    kickPattern: [0, 2.5],
    snarePattern: [1, 3],
    hatStep: 0.5,
    kickGain: 0.24,
    snareGain: 0.1,
    hatGain: 0.034,
    swing: 0.015,
  });
}

function arrangeHarbor(track, buffer) {
  const progression = [0, 5, 3, 4, 0, 5, 6, 4, 0, 5];
  addChordPad(buffer, track, progression, {
    barsPerChord: 2,
    instrument: 'pad',
    octave: 0,
    gain: 0.18,
    includeSeventh: true,
  });
  addBassPattern(buffer, track, progression, {
    barsPerChord: 2,
    pattern: [0, 0, 4, 0],
    gain: 0.13,
  });
  addMelody(
    buffer,
    track,
    [
      { degree: 0, beats: 2 },
      { degree: 2, beats: 2 },
      { degree: 3, beats: 2 },
      { degree: null, beats: 2 },
      { degree: 4, beats: 2 },
      { degree: 2, beats: 2 },
      { degree: 0, beats: 2 },
      { degree: null, beats: 2 },
      { degree: -1, beats: 2 },
      { degree: 0, beats: 2 },
      { degree: 2, beats: 2 },
      { degree: 4, beats: 2 },
      { degree: 3, beats: 4 },
      { degree: null, beats: 2 },
    ],
    {
      octave: 1,
      gain: 0.14,
      instrument: 'bell',
      pan: 0.14,
    }
  );
  addMelody(buffer, track, stretchTheme([-2, -2, -2, -2, -2, -1, -1, -2]), {
    startBar: 12,
    octave: 0,
    gain: 0.09,
    instrument: 'string',
    pan: -0.1,
  });
}

function arrangeDesert(track, buffer) {
  const progression = [0, 1, 4, 0, 0, 5, 1, 4, 0, 1, 4, 5];
  addChordPad(buffer, track, progression, {
    barsPerChord: 2,
    instrument: 'pad',
    octave: 0,
    gain: 0.12,
  });
  addArpeggio(buffer, track, progression, {
    barsPerChord: 2,
    octave: 1,
    gain: 0.12,
    instrument: 'pluck',
    pattern: [0, 2, 1, 3, 2, 1, 0, 1],
    panRange: 0.32,
  });
  addBassPattern(buffer, track, progression, {
    barsPerChord: 2,
    pattern: [0, 4, 0, 4],
    gain: 0.14,
  });
  addMelody(
    buffer,
    track,
    [
      { degree: 0, beats: 1 },
      { degree: 2, beats: 1 },
      { degree: 4, beats: 2 },
      { degree: 5, beats: 2 },
      { degree: 4, beats: 2 },
      { degree: 2, beats: 2 },
      { degree: 1, beats: 2 },
      { degree: 0, beats: 2 },
      { degree: 2, beats: 2 },
      { degree: 4, beats: 2 },
      { degree: 6, beats: 2 },
      { degree: 5, beats: 2 },
      { degree: 4, beats: 4 },
    ],
    {
      octave: 1,
      gain: 0.12,
      instrument: 'lead',
      pan: 0.08,
    }
  );
  addDrumLoop(buffer, track, {
    kickPattern: [0, 2],
    snarePattern: [3],
    hatStep: 1,
    kickGain: 0.18,
    snareGain: 0.08,
    hatGain: 0.025,
    swing: 0.02,
  });
}

function arrangeTension(track, buffer) {
  const progression = [0, 1, 0, 4, 0, 1, 5, 4, 0, 1, 0, 4];
  addChordPad(buffer, track, progression, {
    barsPerChord: 2,
    instrument: 'pad',
    octave: -1,
    gain: 0.11,
  });
  addBassPattern(buffer, track, progression, {
    barsPerChord: 2,
    pattern: [0, 0, 1, 0],
    gain: 0.17,
  });
  addArpeggio(buffer, track, progression, {
    barsPerChord: 2,
    octave: 0,
    register: 12,
    gain: 0.08,
    instrument: 'clock',
    pattern: [0, 2, 1, 2, 0, 3, 2, 1],
  });
  addMelody(
    buffer,
    track,
    [
      { degree: 0, beats: 0.5 },
      { degree: 1, beats: 0.5 },
      { degree: 4, beats: 1 },
      { degree: 3, beats: 0.5 },
      { degree: 1, beats: 0.5 },
      { degree: 0, beats: 1 },
      { degree: 0, beats: 0.5 },
      { degree: 1, beats: 0.5 },
      { degree: 5, beats: 1 },
      { degree: 4, beats: 1 },
      { degree: 1, beats: 1 },
      { degree: 0, beats: 1 },
      { degree: null, beats: 4 },
    ],
    {
      octave: 1,
      gain: 0.12,
      instrument: 'lead',
      pan: 0.16,
      legato: 0.82,
    }
  );
  addDrumLoop(buffer, track, {
    kickPattern: [0, 1.5, 2.5],
    snarePattern: [1, 3],
    hatStep: 0.5,
    kickGain: 0.34,
    snareGain: 0.16,
    hatGain: 0.05,
    tomPattern: [
      { beat: 3.5, midi: 41, gain: 0.14, pan: -0.24 },
      { beat: 3.75, midi: 38, gain: 0.13, pan: 0.2 },
    ],
    swing: 0.01,
  });
}

function arrangeCity(track, buffer) {
  const progression = [0, 4, 1, 5, 0, 4, 2, 5, 0, 4, 1, 5];
  addChordPad(buffer, track, progression, {
    barsPerChord: 2,
    instrument: 'pad',
    octave: 0,
    gain: 0.13,
    includeSeventh: true,
  });
  addArpeggio(buffer, track, progression, {
    barsPerChord: 2,
    octave: 1,
    gain: 0.09,
    instrument: 'clock',
    pattern: [0, 1, 2, 3, 2, 1, 0, 2],
    panRange: 0.24,
  });
  addBassPattern(buffer, track, progression, {
    barsPerChord: 2,
    pattern: [0, 0, 4, 5],
    gain: 0.14,
  });
  addMelody(
    buffer,
    track,
    loopTheme(3, (index) => (index === 1 ? [0, 0, 1, 1, 0, 0, 0, 1] : [])),
    {
      octave: 1,
      gain: 0.1,
      instrument: 'string',
      pan: -0.08,
    }
  );
}

function arrangeCrisis(track, buffer) {
  const progression = [0, 4, 5, 3, 0, 4, 6, 5, 0, 4, 5, 3];
  addChordPad(buffer, track, progression, {
    barsPerChord: 2,
    instrument: 'pad',
    octave: -1,
    gain: 0.1,
  });
  addBassPattern(buffer, track, progression, {
    barsPerChord: 2,
    pattern: [0, 4, 0, 5],
    gain: 0.16,
  });
  addArpeggio(buffer, track, progression, {
    barsPerChord: 2,
    octave: 0,
    gain: 0.08,
    instrument: 'clock',
    pattern: [0, 2, 1, 3, 2, 3, 1, 2],
  });
  addMelody(
    buffer,
    track,
    [
      { degree: 4, beats: 1 },
      { degree: 5, beats: 1 },
      { degree: 7, beats: 1 },
      { degree: 5, beats: 1 },
      { degree: 4, beats: 1 },
      { degree: 3, beats: 1 },
      { degree: 1, beats: 1 },
      { degree: 0, beats: 1 },
      { degree: 4, beats: 0.5 },
      { degree: 5, beats: 0.5 },
      { degree: 7, beats: 1 },
      { degree: 8, beats: 1 },
      { degree: 7, beats: 1 },
      { degree: 5, beats: 1 },
      { degree: 4, beats: 1 },
      { degree: 1, beats: 1 },
      { degree: null, beats: 4 },
    ],
    {
      octave: 1,
      gain: 0.11,
      instrument: 'lead',
      legato: 0.78,
    }
  );
  addDrumLoop(buffer, track, {
    kickPattern: [0, 1.5, 2.5, 3.25],
    snarePattern: [1, 3],
    hatStep: 0.5,
    kickGain: 0.35,
    snareGain: 0.17,
    hatGain: 0.042,
    tomPattern: [
      { beat: 3.5, midi: 43, gain: 0.14, pan: -0.2 },
      { beat: 3.75, midi: 38, gain: 0.13, pan: 0.18 },
    ],
  });
}

function arrangeOrchard(track, buffer) {
  const progression = [0, 4, 1, 5, 0, 4, 2, 5, 0, 3, 1, 5];
  addChordPad(buffer, track, progression, {
    barsPerChord: 2,
    instrument: 'choir',
    octave: 0,
    gain: 0.14,
    includeSeventh: true,
  });
  addArpeggio(buffer, track, progression, {
    barsPerChord: 2,
    octave: 1,
    gain: 0.12,
    instrument: 'pluck',
    pattern: [0, 2, 1, 3, 1, 2, 0, 1],
    panRange: 0.4,
  });
  addBassPattern(buffer, track, progression, {
    barsPerChord: 2,
    pattern: [0, 0, 4, 0],
    gain: 0.11,
  });
  addMelody(
    buffer,
    track,
    [
      { degree: 0, beats: 2 },
      { degree: 2, beats: 2 },
      { degree: 4, beats: 2 },
      { degree: 5, beats: 2 },
      { degree: 7, beats: 2 },
      { degree: 5, beats: 2 },
      { degree: 4, beats: 2 },
      { degree: 2, beats: 2 },
      { degree: 1, beats: 2 },
      { degree: 2, beats: 2 },
      { degree: 4, beats: 2 },
      { degree: 5, beats: 2 },
      { degree: 4, beats: 4 },
    ],
    {
      octave: 1,
      gain: 0.11,
      instrument: 'bell',
      pan: 0.1,
    }
  );
}

function arrangeRevelation(track, buffer) {
  const progression = [0, 5, 3, 6, 0, 5, 2, 4, 0, 5, 3, 4];
  addChordPad(buffer, track, progression, {
    barsPerChord: 2,
    instrument: 'choir',
    octave: -1,
    gain: 0.16,
    includeSeventh: true,
  });
  addBassPattern(buffer, track, progression, {
    barsPerChord: 2,
    pattern: [0, 0, 4, 0],
    gain: 0.13,
  });
  addArpeggio(buffer, track, progression, {
    barsPerChord: 2,
    octave: 0,
    gain: 0.05,
    instrument: 'clock',
    pattern: [0, 1, 3, 2, 1, 0, 2, 1],
    panRange: 0.18,
  });
  addMelody(
    buffer,
    track,
    [
      { degree: 0, beats: 2 },
      { degree: -1, beats: 2 },
      { degree: 0, beats: 2 },
      { degree: 2, beats: 2 },
      { degree: 3, beats: 4 },
      { degree: 2, beats: 2 },
      { degree: 0, beats: 2 },
      { degree: -1, beats: 2 },
      { degree: 0, beats: 2 },
      { degree: 2, beats: 4 },
      { degree: null, beats: 4 },
    ],
    {
      octave: 1,
      gain: 0.11,
      instrument: 'string',
      pan: 0.04,
    }
  );
}

function arrangeBattle(track, buffer) {
  const progression = [0, 4, 5, 3, 0, 4, 2, 5, 0, 4, 5, 3];
  addChordPad(buffer, track, progression, {
    barsPerChord: 2,
    instrument: 'pad',
    octave: -1,
    gain: 0.09,
  });
  addBassPattern(buffer, track, progression, {
    barsPerChord: 2,
    pattern: [0, 4, 0, 5],
    gain: 0.18,
  });
  addMelody(
    buffer,
    track,
    [
      { degree: 0, beats: 0.5 },
      { degree: 2, beats: 0.5 },
      { degree: 4, beats: 0.5 },
      { degree: 5, beats: 0.5 },
      { degree: 7, beats: 1 },
      { degree: 5, beats: 0.5 },
      { degree: 4, beats: 0.5 },
      { degree: 2, beats: 1 },
      { degree: 0, beats: 0.5 },
      { degree: 2, beats: 0.5 },
      { degree: 4, beats: 0.5 },
      { degree: 5, beats: 0.5 },
      { degree: 4, beats: 1 },
      { degree: 2, beats: 1 },
      { degree: 0, beats: 2 },
      { degree: null, beats: 4 },
    ],
    {
      octave: 1,
      gain: 0.13,
      instrument: 'lead',
      legato: 0.78,
    }
  );
  addDrumLoop(buffer, track, {
    kickPattern: [0, 1.5, 2.5],
    snarePattern: [1, 3],
    hatStep: 0.5,
    kickGain: 0.36,
    snareGain: 0.17,
    hatGain: 0.048,
    tomPattern: [
      { beat: 3.25, midi: 40, gain: 0.14, pan: -0.22 },
      { beat: 3.5, midi: 43, gain: 0.14, pan: 0.22 },
    ],
  });
}

function arrangeBoss(track, buffer) {
  const progression = [0, 5, 1, 4, 0, 5, 6, 4, 0, 5, 1, 4, 0, 5, 6, 4];
  addChordPad(buffer, track, progression, {
    barsPerChord: 2,
    instrument: 'choir',
    octave: -1,
    gain: 0.12,
    includeSeventh: true,
  });
  addBassPattern(buffer, track, progression, {
    barsPerChord: 2,
    pattern: [0, 0, 4, 0],
    gain: 0.19,
  });
  addArpeggio(buffer, track, progression, {
    barsPerChord: 2,
    octave: 0,
    gain: 0.06,
    instrument: 'clock',
    pattern: [0, 2, 3, 2, 1, 2, 0, 1],
    panRange: 0.16,
  });
  addMelody(
    buffer,
    track,
    [
      { degree: 0, beats: 1 },
      { degree: 1, beats: 1 },
      { degree: 4, beats: 1 },
      { degree: 5, beats: 1 },
      { degree: 7, beats: 1 },
      { degree: 5, beats: 1 },
      { degree: 4, beats: 1 },
      { degree: 1, beats: 1 },
      { degree: 0, beats: 1 },
      { degree: 1, beats: 1 },
      { degree: 4, beats: 1 },
      { degree: 6, beats: 1 },
      { degree: 7, beats: 2 },
      { degree: 5, beats: 2 },
      { degree: 4, beats: 2 },
      { degree: 1, beats: 2 },
      { degree: null, beats: 4 },
    ],
    {
      octave: 1,
      gain: 0.14,
      instrument: 'lead',
      legato: 0.74,
    }
  );
  addDrumLoop(buffer, track, {
    kickPattern: [0, 1, 2.5, 3.25],
    snarePattern: [1.5, 3],
    hatStep: 0.5,
    kickGain: 0.42,
    snareGain: 0.18,
    hatGain: 0.05,
    tomPattern: [
      { beat: 0.75, midi: 38, gain: 0.16, pan: -0.2 },
      { beat: 2.25, midi: 41, gain: 0.17, pan: 0.18 },
      { beat: 3.75, midi: 45, gain: 0.18, pan: -0.12 },
    ],
  });
}

function arrangeEmotional(track, buffer) {
  const progression = [0, 4, 5, 3, 0, 4, 2, 5, 0, 4, 5, 4];
  addChordPad(buffer, track, progression, {
    barsPerChord: 2,
    instrument: 'pad',
    octave: 0,
    gain: 0.16,
    includeSeventh: true,
  });
  addMelody(buffer, track, stretchTheme([0, 0, 0, -1, -1, -1, -1, -1]), {
    octave: 0,
    gain: 0.14,
    instrument: 'string',
    pan: -0.05,
  });
  addMelody(
    buffer,
    track,
    [
      { degree: 0, beats: 2 },
      { degree: 2, beats: 2 },
      { degree: 4, beats: 2 },
      { degree: 5, beats: 2 },
      { degree: 7, beats: 3 },
      { degree: 5, beats: 1 },
      { degree: 4, beats: 2 },
      { degree: 2, beats: 2 },
      { degree: 4, beats: 2 },
      { degree: 5, beats: 2 },
      { degree: 7, beats: 2 },
      { degree: 9, beats: 2 },
      { degree: 7, beats: 4 },
    ],
    {
      octave: 1,
      gain: 0.12,
      instrument: 'bell',
      pan: 0.12,
    }
  );
  addBassPattern(buffer, track, progression, {
    barsPerChord: 2,
    pattern: [0, 0, 4, 0],
    gain: 0.09,
  });
}

function arrangeFinale(track, buffer) {
  const progression = [0, 5, 3, 4, 0, 5, 1, 4, 0, 5, 3, 6];
  addChordPad(buffer, track, progression, {
    barsPerChord: 2,
    instrument: 'choir',
    octave: -1,
    gain: 0.16,
    includeSeventh: true,
  });
  addChordPad(buffer, track, progression, {
    barsPerChord: 2,
    instrument: 'pad',
    octave: 0,
    gain: 0.09,
  });
  addBassPattern(buffer, track, progression, {
    barsPerChord: 2,
    pattern: [0, 4, 0, 5],
    gain: 0.16,
  });
  addMelody(
    buffer,
    track,
    loopTheme(2, () => [0, 0, 0, 0, 0, -1, -1, 0]),
    {
      octave: 0,
      gain: 0.1,
      instrument: 'string',
      pan: -0.08,
    }
  );
  addMelody(
    buffer,
    track,
    [
      { degree: 0, beats: 2 },
      { degree: 2, beats: 2 },
      { degree: 4, beats: 2 },
      { degree: 5, beats: 2 },
      { degree: 7, beats: 2 },
      { degree: 9, beats: 2 },
      { degree: 7, beats: 2 },
      { degree: 5, beats: 2 },
      { degree: 4, beats: 2 },
      { degree: 2, beats: 2 },
      { degree: 0, beats: 4 },
      { degree: null, beats: 4 },
    ],
    {
      startBar: 8,
      octave: 1,
      gain: 0.12,
      instrument: 'bell',
      pan: 0.08,
    }
  );
  addDrumLoop(buffer, track, {
    startBar: 8,
    endBar: track.bars,
    kickPattern: [0, 2],
    snarePattern: [1, 3],
    hatStep: 1,
    kickGain: 0.22,
    snareGain: 0.09,
    hatGain: 0.025,
    tomPattern: [{ beat: 3.5, midi: 40, gain: 0.1, pan: -0.18 }],
  });
}

function arrangeEndingRestore(track, buffer) {
  const progression = [0, 4, 5, 3, 0, 4, 2, 5];
  addChordPad(buffer, track, progression, {
    barsPerChord: 2,
    instrument: 'pad',
    octave: 0,
    gain: 0.18,
    includeSeventh: true,
  });
  addBassPattern(buffer, track, progression, {
    barsPerChord: 2,
    pattern: [0, 0, 4, 5],
    gain: 0.1,
  });
  addMelody(buffer, track, stretchTheme(), {
    octave: 1,
    gain: 0.14,
    instrument: 'string',
  });
  addMelody(buffer, track, stretchTheme([-2, -2, -2, -2, -2, -1, -1, -1]), {
    octave: 2,
    gain: 0.08,
    instrument: 'bell',
    pan: 0.14,
  });
}

function arrangeEndingRelease(track, buffer) {
  const progression = [0, 4, 6, 3, 0, 4, 1, 6];
  addChordPad(buffer, track, progression, {
    barsPerChord: 2,
    instrument: 'pad',
    octave: 0,
    gain: 0.15,
    includeSeventh: true,
  });
  addArpeggio(buffer, track, progression, {
    barsPerChord: 2,
    octave: 1,
    gain: 0.1,
    instrument: 'pluck',
    pattern: [0, 2, 1, 3, 1, 2, 0, 1],
  });
  addBassPattern(buffer, track, progression, {
    barsPerChord: 2,
    pattern: [0, 0, 4, 0],
    gain: 0.09,
  });
  addMelody(
    buffer,
    track,
    [
      { degree: 0, beats: 2 },
      { degree: 2, beats: 2 },
      { degree: 4, beats: 2 },
      { degree: 6, beats: 2 },
      { degree: 7, beats: 2 },
      { degree: 6, beats: 2 },
      { degree: 4, beats: 2 },
      { degree: 2, beats: 2 },
      { degree: 1, beats: 2 },
      { degree: 2, beats: 2 },
      { degree: 4, beats: 4 },
      { degree: null, beats: 4 },
    ],
    {
      octave: 1,
      gain: 0.12,
      instrument: 'string',
    }
  );
}

function arrangeEndingVigil(track, buffer) {
  const progression = [0, 5, 3, 4, 0, 5, 2, 4];
  addChordPad(buffer, track, progression, {
    barsPerChord: 2,
    instrument: 'choir',
    octave: -1,
    gain: 0.16,
    includeSeventh: true,
  });
  addBassPattern(buffer, track, progression, {
    barsPerChord: 2,
    pattern: [0, 0, 4, 0],
    gain: 0.09,
  });
  addMelody(
    buffer,
    track,
    [
      { degree: 0, beats: 2 },
      { degree: 2, beats: 2 },
      { degree: 3, beats: 2 },
      { degree: 5, beats: 2 },
      { degree: 7, beats: 3 },
      { degree: 5, beats: 1 },
      { degree: 3, beats: 2 },
      { degree: 2, beats: 2 },
      { degree: 0, beats: 4 },
      { degree: null, beats: 4 },
    ],
    {
      octave: 1,
      gain: 0.11,
      instrument: 'string',
      pan: 0.02,
    }
  );
  addMelody(buffer, track, stretchTheme([-2, -2, -2, -2, -2, -2, -2, -2]), {
    octave: 1,
    gain: 0.07,
    instrument: 'bell',
    pan: -0.12,
  });
}

function arrangeCredits(track, buffer) {
  const progression = [0, 5, 3, 4, 0, 5, 2, 4, 0, 4, 5, 3, 0, 5, 2, 4];
  addChordPad(buffer, track, progression, {
    barsPerChord: 2,
    instrument: 'pad',
    octave: 0,
    gain: 0.15,
    includeSeventh: true,
  });
  addChordPad(buffer, track, progression, {
    barsPerChord: 2,
    instrument: 'choir',
    octave: -1,
    gain: 0.08,
    includeSeventh: true,
  });
  addArpeggio(buffer, track, progression, {
    barsPerChord: 2,
    octave: 1,
    gain: 0.08,
    instrument: 'pluck',
    panRange: 0.32,
  });
  addBassPattern(buffer, track, progression, {
    barsPerChord: 2,
    pattern: [0, 4, 0, 5],
    gain: 0.13,
  });
  addMelody(
    buffer,
    track,
    loopTheme(4, (index) => (index === 2 ? [0, 0, 0, 1, 0, 0, -1, -1] : [])),
    {
      octave: 1,
      gain: 0.15,
      instrument: 'string',
    }
  );
  addMelody(
    buffer,
    track,
    loopTheme(2, () => [-2, -2, -2, -2, -2, -2, -1, -1]),
    {
      startBar: 16,
      octave: 2,
      gain: 0.08,
      instrument: 'bell',
      pan: 0.16,
    }
  );
  addDrumLoop(buffer, track, {
    startBar: 8,
    endBar: track.bars,
    kickPattern: [0, 2.5],
    snarePattern: [1, 3],
    hatStep: 0.5,
    kickGain: 0.22,
    snareGain: 0.09,
    hatGain: 0.03,
    swing: 0.018,
  });
}

const STYLE_RENDERERS = Object.freeze({
  title: arrangeTitle,
  harbor: arrangeHarbor,
  desert: arrangeDesert,
  tension: arrangeTension,
  city: arrangeCity,
  crisis: arrangeCrisis,
  orchard: arrangeOrchard,
  revelation: arrangeRevelation,
  battle: arrangeBattle,
  boss: arrangeBoss,
  emotional: arrangeEmotional,
  finale: arrangeFinale,
  'ending-restore': arrangeEndingRestore,
  'ending-release': arrangeEndingRelease,
  'ending-vigil': arrangeEndingVigil,
  credits: arrangeCredits,
});

function applyEcho(buffer, options = {}) {
  const { delaySeconds = 0.28, feedback = 0.25, mix = 0.08 } = options;
  const delay = Math.max(1, Math.floor(delaySeconds * SAMPLE_RATE));
  const delayLeft = new Float32Array(delay);
  const delayRight = new Float32Array(delay);
  let cursor = 0;

  for (let index = 0; index < buffer.length; index += 1) {
    const delayedLeft = delayLeft[cursor];
    const delayedRight = delayRight[cursor];
    const inputLeft = buffer.left[index];
    const inputRight = buffer.right[index];

    delayLeft[cursor] = inputLeft + delayedRight * feedback;
    delayRight[cursor] = inputRight + delayedLeft * feedback;
    buffer.left[index] = inputLeft * (1 - mix) + delayedLeft * mix;
    buffer.right[index] = inputRight * (1 - mix) + delayedRight * mix;
    cursor = (cursor + 1) % delay;
  }
}

function applyReverb(buffer, mix = 0.24) {
  const delaySettings = [
    { samples: 1_679, feedback: 0.74 },
    { samples: 2_227, feedback: 0.69 },
    { samples: 2_869, feedback: 0.63 },
    { samples: 3_331, feedback: 0.58 },
  ];
  const lines = delaySettings.map((setting) => ({
    feedback: setting.feedback,
    left: new Float32Array(setting.samples),
    right: new Float32Array(setting.samples),
    cursor: 0,
    lowPassLeft: 0,
    lowPassRight: 0,
  }));

  for (let index = 0; index < buffer.length; index += 1) {
    const dryLeft = buffer.left[index];
    const dryRight = buffer.right[index];
    let wetLeft = 0;
    let wetRight = 0;

    for (const line of lines) {
      const delayedLeft = line.left[line.cursor];
      const delayedRight = line.right[line.cursor];
      line.lowPassLeft += (delayedRight - line.lowPassLeft) * 0.35;
      line.lowPassRight += (delayedLeft - line.lowPassRight) * 0.35;
      line.left[line.cursor] = dryLeft * 0.42 + line.lowPassLeft * line.feedback;
      line.right[line.cursor] = dryRight * 0.42 + line.lowPassRight * line.feedback;
      wetLeft += delayedLeft;
      wetRight += delayedRight;
      line.cursor = (line.cursor + 1) % line.left.length;
    }

    buffer.left[index] = dryLeft * (1 - mix) + wetLeft * mix * 0.26;
    buffer.right[index] = dryRight * (1 - mix) + wetRight * mix * 0.26;
  }
}

function applyHighPass(buffer, cutoffHz = 28) {
  const dt = 1 / SAMPLE_RATE;
  const rc = 1 / (TWO_PI * cutoffHz);
  const alpha = rc / (rc + dt);
  let previousInputLeft = 0;
  let previousInputRight = 0;
  let previousOutputLeft = 0;
  let previousOutputRight = 0;

  for (let index = 0; index < buffer.length; index += 1) {
    const inputLeft = buffer.left[index];
    const inputRight = buffer.right[index];
    const outputLeft = alpha * (previousOutputLeft + inputLeft - previousInputLeft);
    const outputRight = alpha * (previousOutputRight + inputRight - previousInputRight);

    buffer.left[index] = outputLeft;
    buffer.right[index] = outputRight;
    previousInputLeft = inputLeft;
    previousInputRight = inputRight;
    previousOutputLeft = outputLeft;
    previousOutputRight = outputRight;
  }
}

function normalize(buffer, targetPeak = 0.9, masterGain = 1) {
  let peak = 0;

  for (let index = 0; index < buffer.length; index += 1) {
    peak = Math.max(peak, Math.abs(buffer.left[index]), Math.abs(buffer.right[index]));
  }

  const scale = peak > 0 ? (targetPeak / peak) * masterGain : masterGain;

  for (let index = 0; index < buffer.length; index += 1) {
    buffer.left[index] *= scale;
    buffer.right[index] *= scale;
  }
}

function applyFade(buffer, fadeSeconds = 0.04) {
  const fadeSamples = Math.floor(fadeSeconds * SAMPLE_RATE);

  for (let index = 0; index < fadeSamples; index += 1) {
    const gain = index / fadeSamples;
    buffer.left[index] *= gain;
    buffer.right[index] *= gain;
    const tailGain = 1 - gain;
    const tailIndex = buffer.length - 1 - index;
    buffer.left[tailIndex] *= tailGain;
    buffer.right[tailIndex] *= tailGain;
  }
}

function renderTrack(track) {
  const buffer = createBuffer(track);
  const context = createTrackContext(track, buffer);
  const renderer = STYLE_RENDERERS[track.style];

  if (!renderer) {
    throw new Error(`Unknown track style: ${track.style}`);
  }

  renderer(context, buffer);

  if (
    ['title', 'harbor', 'desert', 'orchard', 'emotional', 'finale', 'credits'].includes(track.style)
  ) {
    applyEcho(buffer, {
      delaySeconds: track.style === 'credits' ? 0.31 : 0.27,
      feedback: track.style === 'finale' ? 0.3 : 0.24,
      mix: track.style === 'harbor' ? 0.11 : 0.08,
    });
  }

  applyReverb(buffer, track.reverbMix);
  applyHighPass(buffer);
  normalize(buffer, 0.92, track.masterGain);
  applyFade(buffer, 0.05);

  return buffer;
}

function writeWav(filePath, buffer) {
  const channelCount = 2;
  const bitsPerSample = 16;
  const blockAlign = channelCount * (bitsPerSample / 8);
  const byteRate = SAMPLE_RATE * blockAlign;
  const dataSize = buffer.length * blockAlign;
  const output = Buffer.alloc(44 + dataSize);

  output.write('RIFF', 0);
  output.writeUInt32LE(36 + dataSize, 4);
  output.write('WAVE', 8);
  output.write('fmt ', 12);
  output.writeUInt32LE(16, 16);
  output.writeUInt16LE(1, 20);
  output.writeUInt16LE(channelCount, 22);
  output.writeUInt32LE(SAMPLE_RATE, 24);
  output.writeUInt32LE(byteRate, 28);
  output.writeUInt16LE(blockAlign, 32);
  output.writeUInt16LE(bitsPerSample, 34);
  output.write('data', 36);
  output.writeUInt32LE(dataSize, 40);

  let offset = 44;
  for (let index = 0; index < buffer.length; index += 1) {
    const left = Math.round(clamp(buffer.left[index], -1, 1) * 32_767);
    const right = Math.round(clamp(buffer.right[index], -1, 1) * 32_767);
    output.writeInt16LE(left, offset);
    output.writeInt16LE(right, offset + 2);
    offset += 4;
  }

  fs.writeFileSync(filePath, output);
}

function ensureDirectory(directoryPath) {
  fs.mkdirSync(directoryPath, { recursive: true });
}

function encodeOgg(sourcePath, targetPath) {
  execFileSync(
    'ffmpeg',
    [
      '-y',
      '-loglevel',
      'error',
      '-i',
      sourcePath,
      '-filter:a',
      'acompressor=threshold=-18dB:ratio=3:attack=5:release=120,alimiter=limit=0.95',
      '-ar',
      String(SAMPLE_RATE),
      '-ac',
      '2',
      '-c:a',
      'libvorbis',
      '-q:a',
      '6',
      targetPath,
    ],
    { stdio: 'inherit' }
  );
}

function buildManifestEntry(track, buffer) {
  return {
    id: track.id,
    title: track.title,
    category: track.category,
    chapters: track.chapters,
    scenes: track.scenes,
    mood: track.mood,
    instrumentation: track.instrumentation,
    bpm: track.bpm,
    key: track.key,
    bars: track.bars,
    durationSeconds: Number(buffer.durationSeconds.toFixed(2)),
    loop: track.loop,
    file: `assets/audio/bgm/${track.output}`,
  };
}

function main() {
  ensureDirectory(audioOutputDir);
  ensureDirectory(contentOutputDir);

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rpg-bgm-'));
  const manifest = [];

  for (const track of TRACKS) {
    const buffer = renderTrack(track);
    const wavPath = path.join(tempDir, `${track.id}.wav`);
    const oggPath = path.join(audioOutputDir, track.output);
    writeWav(wavPath, buffer);
    encodeOgg(wavPath, oggPath);
    manifest.push(buildManifestEntry(track, buffer));
  }

  fs.writeFileSync(
    path.join(contentOutputDir, 'bgm-manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`
  );
}

main();
