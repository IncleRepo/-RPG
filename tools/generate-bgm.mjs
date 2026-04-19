import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';
import { Note, Scale } from 'tonal';
import wavefile from 'wavefile';

const { WaveFile } = wavefile;

const SAMPLE_RATE = 44100;
const MASTER_GAIN = 0.68;
const OUTPUT_DIR = path.resolve(process.cwd(), 'assets/audio/bgm');

const RHYTHM_LIBRARY = Object.freeze({
  open: Object.freeze({
    offsets: [0, 0.75, 1.5, 2.5, 3.25],
    lengths: [0.6, 0.55, 0.7, 0.55, 0.65],
  }),
  lyrical: Object.freeze({
    offsets: [0, 0.5, 1.5, 2.25, 3],
    lengths: [0.45, 0.7, 0.55, 0.55, 0.85],
  }),
  urgent: Object.freeze({
    offsets: [0, 0.5, 1, 1.5, 2.25, 2.75, 3.25, 3.5],
    lengths: [0.35, 0.3, 0.35, 0.4, 0.25, 0.3, 0.3, 0.45],
  }),
  pulse: Object.freeze({
    offsets: [0, 0.5, 1, 1.5, 2, 2.75, 3.25],
    lengths: [0.25, 0.25, 0.25, 0.35, 0.25, 0.25, 0.45],
  }),
});

const DAWN_MOTIF = Object.freeze([0, 2, 4, 6, 4, 2, 1, 0]);

const TRACKS = Object.freeze([
  {
    id: '01-tide-of-unarrived-dawn',
    title: '도착하지 않은 새벽의 조류',
    purpose: '타이틀 / 메인 테마',
    scenes: ['타이틀 화면', '세계 소개 컷신', '핵심 회상 장면'],
    chapters: ['공통'],
    summary: '몽환적이지만 희미한 불안이 남는 메인 테마. 새벽 모티프를 처음 제시한다.',
    key: 'D',
    mode: 'dorian',
    tempo: 84,
    bars: 32,
    progression: [0, 5, 3, 4],
    padOctave: 4,
    bassOctave: 2,
    leadOctave: 5,
    arpOctave: 5,
    padInstrument: 'haloPad',
    arpInstrument: 'glassBell',
    leadInstrument: 'feltLead',
    bassInstrument: 'warmBass',
    melodyRhythm: 'lyrical',
    arpPattern: [0, 2, 4, 6, 4, 2, 1, 2],
    melodyPatterns: [DAWN_MOTIF, [0, 1, 2, 4, 5, 4, 2, 1]],
    texture: 'air',
    sections: [
      { bars: 4, pad: 0.58, arp: 0.3, bass: 0, melody: 0, drums: 'none' },
      { bars: 8, pad: 0.68, arp: 0.46, bass: 0.44, melody: 0.24, drums: 'soft' },
      { bars: 8, pad: 0.76, arp: 0.52, bass: 0.55, melody: 0.42, drums: 'soft' },
      { bars: 4, pad: 0.62, arp: 0.38, bass: 0.2, melody: 0.2, drums: 'none' },
      { bars: 8, pad: 0.8, arp: 0.58, bass: 0.56, melody: 0.52, drums: 'light' },
    ],
  },
  {
    id: '02-mirajin-false-dawn',
    title: '미라진의 거짓 새벽',
    purpose: '프롤로그 / 항구 허브 / 미스터리',
    scenes: ['등외항 미라진 탐색', '시계탑 진입 전후', '황혼 항구 허브'],
    chapters: ['프롤로그'],
    summary: '젖은 공기와 멈춘 시간을 떠올리게 하는 항구 곡. 고독한 종소리와 잔향이 중심이다.',
    key: 'A',
    mode: 'aeolian',
    tempo: 74,
    bars: 32,
    progression: [0, 5, 2, 4],
    padOctave: 4,
    bassOctave: 2,
    leadOctave: 5,
    arpOctave: 5,
    padInstrument: 'mistPad',
    arpInstrument: 'musicBox',
    leadInstrument: 'softFlute',
    bassInstrument: 'warmBass',
    melodyRhythm: 'open',
    arpPattern: [0, 2, 4, 2, 1, 0, 2, 4],
    melodyPatterns: [
      [0, 2, 4, 2, 1],
      [0, 1, 3, 2, 0],
    ],
    texture: 'harbor',
    sections: [
      { bars: 8, pad: 0.62, arp: 0.24, bass: 0.12, melody: 0.12, drums: 'none' },
      { bars: 8, pad: 0.7, arp: 0.32, bass: 0.36, melody: 0.18, drums: 'soft' },
      { bars: 8, pad: 0.72, arp: 0.42, bass: 0.4, melody: 0.28, drums: 'soft' },
      { bars: 8, pad: 0.66, arp: 0.24, bass: 0.18, melody: 0.14, drums: 'none' },
    ],
  },
  {
    id: '03-glasssalt-expedition',
    title: '유리염 사구 원정',
    purpose: '챕터 1 탐험 / 구조 현장',
    scenes: ['유리염 사구 탐험', '역참 구조 루트', '폐채굴 첨탑 접근'],
    chapters: ['챕터 1'],
    summary: '마른 바람과 구조 활동의 박동을 같이 담은 탐험 곡. 고요함보다 전진감이 앞선다.',
    key: 'G',
    mode: 'dorian',
    tempo: 96,
    bars: 32,
    progression: [0, 3, 5, 4],
    padOctave: 4,
    bassOctave: 2,
    leadOctave: 5,
    arpOctave: 5,
    padInstrument: 'sunPad',
    arpInstrument: 'glassBell',
    leadInstrument: 'reedLead',
    bassInstrument: 'pulseBass',
    melodyRhythm: 'pulse',
    arpPattern: [0, 2, 4, 6, 4, 2, 3, 2],
    melodyPatterns: [
      [0, 2, 4, 5, 4, 2, 1],
      [0, 1, 2, 4, 3, 2, 0],
    ],
    texture: 'sand',
    sections: [
      { bars: 4, pad: 0.56, arp: 0.36, bass: 0.28, melody: 0.1, drums: 'light' },
      { bars: 8, pad: 0.64, arp: 0.48, bass: 0.48, melody: 0.22, drums: 'folk' },
      { bars: 8, pad: 0.68, arp: 0.52, bass: 0.52, melody: 0.28, drums: 'folk' },
      { bars: 4, pad: 0.48, arp: 0.4, bass: 0.36, melody: 0.14, drums: 'light' },
      { bars: 8, pad: 0.72, arp: 0.54, bass: 0.58, melody: 0.3, drums: 'folk' },
    ],
  },
  {
    id: '04-fracture-pursuit',
    title: '균열 추적선',
    purpose: '긴장 / 추적 / 구조 압박',
    scenes: ['방파제 탈출', '구조선 방어전 전개', '시간폭풍 추격 구간'],
    chapters: ['프롤로그', '챕터 1', '챕터 2'],
    summary: '공포보다 속도와 압박에 초점을 둔 긴장 곡. 저역 펄스와 금속성 리듬을 사용한다.',
    key: 'C',
    mode: 'aeolian',
    tempo: 118,
    bars: 24,
    progression: [0, 4, 5, 3],
    padOctave: 4,
    bassOctave: 2,
    leadOctave: 5,
    arpOctave: 5,
    padInstrument: 'mistPad',
    arpInstrument: 'metalPulse',
    leadInstrument: 'reedLead',
    bassInstrument: 'pulseBass',
    melodyRhythm: 'urgent',
    arpPattern: [0, 0, 2, 4, 2, 4, 6, 4],
    melodyPatterns: [
      [0, 1, 2, 4, 3, 2, 1, 0],
      [0, 2, 4, 2, 4, 5, 4, 2],
    ],
    texture: 'mechanical',
    sections: [
      { bars: 4, pad: 0.44, arp: 0.42, bass: 0.46, melody: 0.16, drums: 'tense' },
      { bars: 8, pad: 0.5, arp: 0.5, bass: 0.56, melody: 0.24, drums: 'tense' },
      { bars: 4, pad: 0.36, arp: 0.44, bass: 0.48, melody: 0.18, drums: 'none' },
      { bars: 8, pad: 0.54, arp: 0.54, bass: 0.62, melody: 0.26, drums: 'tense' },
    ],
  },
  {
    id: '05-kadel-upside-harbor',
    title: '역항도 카델',
    purpose: '챕터 2 도시 / 정치적 긴장',
    scenes: ['카델 항구 진입', '도시 조사', '유라 베인 협상 전후'],
    chapters: ['챕터 2'],
    summary: '질서와 압박이 동시에 느껴지는 도시 테마. 규칙적인 아르페지오와 낯선 부유감을 겹쳤다.',
    key: 'F',
    mode: 'lydian',
    tempo: 102,
    bars: 32,
    progression: [0, 1, 4, 0],
    padOctave: 4,
    bassOctave: 2,
    leadOctave: 5,
    arpOctave: 6,
    padInstrument: 'haloPad',
    arpInstrument: 'metalPulse',
    leadInstrument: 'softFlute',
    bassInstrument: 'pulseBass',
    melodyRhythm: 'lyrical',
    arpPattern: [0, 2, 4, 6, 4, 6, 8, 6],
    melodyPatterns: [
      [0, 2, 4, 6, 5],
      [0, 1, 3, 5, 4],
    ],
    texture: 'mechanical',
    sections: [
      { bars: 8, pad: 0.58, arp: 0.46, bass: 0.36, melody: 0.18, drums: 'light' },
      { bars: 8, pad: 0.64, arp: 0.52, bass: 0.44, melody: 0.24, drums: 'light' },
      { bars: 8, pad: 0.68, arp: 0.56, bass: 0.48, melody: 0.26, drums: 'soft' },
      { bars: 8, pad: 0.54, arp: 0.42, bass: 0.28, melody: 0.18, drums: 'none' },
    ],
  },
  {
    id: '06-rift-skirmish',
    title: '균열 교전',
    purpose: '일반 전투',
    scenes: ['균열 생물 전투', '시계탑 전투', '필드 일반 전투'],
    chapters: ['공통'],
    summary: '현장형 전투를 위한 기본 BGM. 지나치게 과격하지 않되 추진력은 유지한다.',
    key: 'D',
    mode: 'aeolian',
    tempo: 128,
    bars: 24,
    progression: [0, 5, 3, 4],
    padOctave: 4,
    bassOctave: 2,
    leadOctave: 5,
    arpOctave: 5,
    padInstrument: 'sunPad',
    arpInstrument: 'metalPulse',
    leadInstrument: 'reedLead',
    bassInstrument: 'pulseBass',
    melodyRhythm: 'urgent',
    arpPattern: [0, 2, 4, 2, 4, 6, 4, 2],
    melodyPatterns: [
      [0, 2, 4, 2, 1, 2, 4, 6],
      [0, 1, 3, 1, 0, 1, 3, 4],
    ],
    texture: 'spark',
    sections: [
      { bars: 4, pad: 0.42, arp: 0.56, bass: 0.62, melody: 0.18, drums: 'battle' },
      { bars: 8, pad: 0.46, arp: 0.62, bass: 0.68, melody: 0.24, drums: 'battle' },
      { bars: 4, pad: 0.3, arp: 0.42, bass: 0.52, melody: 0.12, drums: 'battle' },
      { bars: 8, pad: 0.5, arp: 0.64, bass: 0.72, melody: 0.28, drums: 'battle' },
    ],
  },
  {
    id: '07-bellshard-overlord',
    title: '종편의 포식자',
    purpose: '보스전',
    scenes: ['황혼 파수체', '유리염 거신', '역추자', '후회목', '최종 보스 1페이즈'],
    chapters: ['공통'],
    summary:
      '저음 압박과 종편 모티프를 섞은 보스전 곡. 강하지만 귀를 찌르지 않게 저역과 중역 중심으로 조정했다.',
    key: 'G',
    mode: 'phrygian',
    tempo: 138,
    bars: 28,
    progression: [0, 1, 5, 4],
    padOctave: 4,
    bassOctave: 1,
    leadOctave: 5,
    arpOctave: 5,
    padInstrument: 'choirPad',
    arpInstrument: 'metalPulse',
    leadInstrument: 'glassBell',
    bassInstrument: 'darkBass',
    melodyRhythm: 'urgent',
    arpPattern: [0, 0, 2, 4, 2, 4, 6, 7],
    melodyPatterns: [
      [0, 1, 2, 4, 6, 4, 2, 1],
      [0, 2, 4, 5, 4, 2, 1, 0],
    ],
    texture: 'abyss',
    sections: [
      { bars: 4, pad: 0.46, arp: 0.48, bass: 0.6, melody: 0.14, drums: 'boss' },
      { bars: 8, pad: 0.5, arp: 0.58, bass: 0.72, melody: 0.22, drums: 'boss' },
      { bars: 4, pad: 0.36, arp: 0.4, bass: 0.64, melody: 0.12, drums: 'boss' },
      { bars: 12, pad: 0.54, arp: 0.64, bass: 0.76, melody: 0.26, drums: 'boss' },
    ],
  },
  {
    id: '08-whispering-orchard',
    title: '속삭임 과수원',
    purpose: '감정 이벤트 / 챕터 3 탐색',
    scenes: ['속삭임 과수원 탐색', '사야 렌 감정 장면', '정체성 대화 직전'],
    chapters: ['챕터 3'],
    summary:
      '정서 회수용 BGM. 목소리처럼 흔들리는 패드와 부드러운 멜로디로 챕터 3의 감정선을 지탱한다.',
    key: 'Bb',
    mode: 'ionian',
    tempo: 72,
    bars: 32,
    progression: [0, 4, 5, 3],
    padOctave: 4,
    bassOctave: 2,
    leadOctave: 5,
    arpOctave: 5,
    padInstrument: 'choirPad',
    arpInstrument: 'musicBox',
    leadInstrument: 'feltLead',
    bassInstrument: 'warmBass',
    melodyRhythm: 'lyrical',
    arpPattern: [0, 2, 4, 2, 3, 2, 1, 0],
    melodyPatterns: [DAWN_MOTIF, [0, 1, 2, 4, 3, 2, 1, 0]],
    texture: 'orchard',
    sections: [
      { bars: 8, pad: 0.72, arp: 0.18, bass: 0.18, melody: 0.2, drums: 'none' },
      { bars: 8, pad: 0.78, arp: 0.28, bass: 0.26, melody: 0.28, drums: 'soft' },
      { bars: 8, pad: 0.8, arp: 0.22, bass: 0.18, melody: 0.34, drums: 'none' },
      { bars: 8, pad: 0.76, arp: 0.24, bass: 0.2, melody: 0.3, drums: 'soft' },
    ],
  },
  {
    id: '09-silent-coral-palace',
    title: '침묵 산호궁',
    purpose: '최종 던전 / 심해 탐험',
    scenes: ['침묵 산호궁 외곽', '심연 내부 이동', '최종 결전 전 긴장'],
    chapters: ['엔딩'],
    summary:
      '심해의 심장 박동과 먼 종소리를 동시에 담은 최종 던전 곡. 숨이 얕아지는 느낌으로 설계했다.',
    key: 'C#',
    mode: 'aeolian',
    tempo: 78,
    bars: 30,
    progression: [0, 5, 4, 2, 0],
    padOctave: 4,
    bassOctave: 1,
    leadOctave: 5,
    arpOctave: 5,
    padInstrument: 'choirPad',
    arpInstrument: 'glassBell',
    leadInstrument: 'softFlute',
    bassInstrument: 'darkBass',
    melodyRhythm: 'open',
    arpPattern: [0, 2, 4, 6, 4, 2, 1, 0],
    melodyPatterns: [
      [0, 2, 4, 2, 1],
      [0, 1, 3, 2, 0],
    ],
    texture: 'abyss',
    sections: [
      { bars: 6, pad: 0.7, arp: 0.16, bass: 0.26, melody: 0.14, drums: 'none' },
      { bars: 8, pad: 0.74, arp: 0.24, bass: 0.34, melody: 0.16, drums: 'soft' },
      { bars: 8, pad: 0.78, arp: 0.3, bass: 0.38, melody: 0.2, drums: 'soft' },
      { bars: 8, pad: 0.72, arp: 0.18, bass: 0.28, melody: 0.14, drums: 'none' },
    ],
  },
  {
    id: '10-last-dawn-credits',
    title: '마지막 새벽의 기록',
    purpose: '엔딩 / 크레딧',
    scenes: ['엔딩 후일담', '크레딧', '엔딩 A/B/C 공통 여운'],
    chapters: ['엔딩'],
    summary: '메인 테마와 감정 테마를 회수하는 크레딧 곡. 상실을 남기되 끝은 앞으로 열어 둔다.',
    key: 'D',
    mode: 'ionian',
    tempo: 82,
    bars: 40,
    progression: [0, 4, 5, 3, 0],
    padOctave: 4,
    bassOctave: 2,
    leadOctave: 5,
    arpOctave: 5,
    padInstrument: 'haloPad',
    arpInstrument: 'musicBox',
    leadInstrument: 'feltLead',
    bassInstrument: 'warmBass',
    melodyRhythm: 'lyrical',
    arpPattern: [0, 2, 4, 2, 1, 2, 4, 6],
    melodyPatterns: [DAWN_MOTIF, [0, 1, 2, 4, 5, 4, 2, 0]],
    texture: 'air',
    sections: [
      { bars: 8, pad: 0.68, arp: 0.22, bass: 0.14, melody: 0.2, drums: 'none' },
      { bars: 8, pad: 0.72, arp: 0.3, bass: 0.24, melody: 0.28, drums: 'soft' },
      { bars: 8, pad: 0.78, arp: 0.34, bass: 0.3, melody: 0.34, drums: 'soft' },
      { bars: 8, pad: 0.74, arp: 0.28, bass: 0.2, melody: 0.26, drums: 'none' },
      { bars: 8, pad: 0.8, arp: 0.36, bass: 0.32, melody: 0.38, drums: 'light' },
    ],
  },
]);

function createRng(seed) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(value) {
  let hash = 2166136261;

  for (const character of value) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function midiToFrequency(midi) {
  return 440 * 2 ** ((midi - 69) / 12);
}

function getScale(track) {
  const notes = Scale.get(`${track.key} ${track.mode}`).notes;

  if (!notes.length) {
    throw new Error(`Invalid scale configuration: ${track.key} ${track.mode}`);
  }

  return notes;
}

function degreeToMidi(scale, degree, octave) {
  const normalizedDegree = ((degree % scale.length) + scale.length) % scale.length;
  const octaveOffset = Math.floor(degree / scale.length);
  const noteName = `${scale[normalizedDegree]}${octave + octaveOffset}`;
  const midi = Note.midi(noteName);

  if (midi === null) {
    throw new Error(`Failed to resolve note ${noteName}`);
  }

  return midi;
}

function buildChord(scale, degree, octave) {
  return [degree, degree + 2, degree + 4].map((scaleDegree) =>
    degreeToMidi(scale, scaleDegree, octave)
  );
}

function beatsToSeconds(track, beats) {
  return (60 / track.tempo) * beats;
}

function barToSeconds(track, barIndex) {
  return beatsToSeconds(track, barIndex * 4);
}

function createTrackBuffers(totalSamples) {
  return {
    left: new Float32Array(totalSamples),
    right: new Float32Array(totalSamples),
  };
}

function addSample(buffers, sampleIndex, left, right) {
  if (sampleIndex < 0 || sampleIndex >= buffers.left.length) {
    return;
  }

  buffers.left[sampleIndex] += left;
  buffers.right[sampleIndex] += right;
}

function panSample(value, pan) {
  const left = value * Math.sqrt((1 - pan) * 0.5);
  const right = value * Math.sqrt((1 + pan) * 0.5);
  return [left, right];
}

function envelope(time, duration, attack, decay, sustainLevel, release) {
  if (time < 0) {
    return 0;
  }

  if (time < attack) {
    return time / Math.max(attack, 0.0001);
  }

  const decayTime = time - attack;

  if (decayTime < decay) {
    const blend = decayTime / Math.max(decay, 0.0001);
    return 1 + (sustainLevel - 1) * blend;
  }

  if (time < duration) {
    return sustainLevel;
  }

  const releaseTime = time - duration;

  if (releaseTime >= release) {
    return 0;
  }

  return sustainLevel * (1 - releaseTime / Math.max(release, 0.0001));
}

function noiseSample(state) {
  state.value += 0x6d2b79f5;
  let value = Math.imul(state.value ^ (state.value >>> 15), 1 | state.value);
  value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
  return ((((value ^ (value >>> 14)) >>> 0) / 4294967296) * 2 - 1) * 0.9;
}

function triangle(phase) {
  return 2 * Math.abs(2 * (phase / (2 * Math.PI) - Math.floor(phase / (2 * Math.PI) + 0.5))) - 1;
}

function renderNote(buffers, event) {
  const startSample = Math.floor(event.start * SAMPLE_RATE);
  const totalDuration = event.duration + event.release;
  const endSample = Math.min(
    buffers.left.length,
    Math.ceil((event.start + totalDuration) * SAMPLE_RATE)
  );
  const frequency = midiToFrequency(event.midi + event.detune);
  const pan = clamp(event.pan, -1, 1);
  const noiseState = { value: event.seed >>> 0 };
  let carrierPhase = event.phaseOffset;
  let modPhase = event.phaseOffset * 0.75;
  let auxPhase = event.phaseOffset * 1.3;
  let subPhase = event.phaseOffset * 0.5;
  const carrierStep = (Math.PI * 2 * frequency) / SAMPLE_RATE;
  const detunedStep = (Math.PI * 2 * frequency * 1.005) / SAMPLE_RATE;
  const modStep = (Math.PI * 2 * frequency * 2.01) / SAMPLE_RATE;
  const auxStep = (Math.PI * 2 * frequency * 0.5) / SAMPLE_RATE;
  const subStep = (Math.PI * 2 * frequency * 0.25) / SAMPLE_RATE;

  for (let sampleIndex = startSample; sampleIndex < endSample; sampleIndex += 1) {
    const time = (sampleIndex - startSample) / SAMPLE_RATE;
    const amp =
      envelope(time, event.duration, event.attack, event.decay, event.sustain, event.release) *
      event.velocity;

    if (amp <= 0.00001) {
      carrierPhase += carrierStep;
      modPhase += modStep;
      auxPhase += auxStep;
      subPhase += subStep;
      continue;
    }

    const tremolo =
      1 + Math.sin(Math.PI * 2 * event.tremoloRate * time + event.phaseOffset) * event.tremoloDepth;
    const noise = noiseSample(noiseState);
    const mod = Math.sin(modPhase) * event.modAmount * Math.exp(-time * event.modDecay);
    let value = 0;

    switch (event.instrument) {
      case 'haloPad':
        value =
          Math.sin(carrierPhase + mod) * 0.58 +
          Math.sin(carrierPhase * 2.01) * 0.2 +
          triangle(auxPhase) * 0.14 +
          Math.sin(subPhase) * 0.08;
        break;
      case 'mistPad':
        value =
          Math.sin(carrierPhase + mod * 0.7) * 0.62 +
          Math.sin(auxPhase) * 0.18 +
          triangle(subPhase) * 0.08 +
          noise * 0.03;
        break;
      case 'sunPad':
        value =
          Math.sin(carrierPhase + mod * 0.55) * 0.48 +
          triangle(carrierPhase) * 0.18 +
          Math.sin(carrierPhase * 2.02) * 0.12 +
          noise * 0.02;
        break;
      case 'choirPad':
        value =
          Math.sin(carrierPhase + mod * 0.8) * 0.48 +
          Math.sin(carrierPhase * 1.5) * 0.16 +
          Math.sin(detunedStep * (sampleIndex - startSample) + event.phaseOffset) * 0.1 +
          Math.sin(auxPhase) * 0.08;
        break;
      case 'glassBell':
        value =
          Math.sin(carrierPhase + Math.sin(modPhase) * 3.2 * Math.exp(-time * 4.4)) * 0.72 +
          Math.sin(carrierPhase * 2.99) * Math.exp(-time * 5.8) * 0.18;
        break;
      case 'musicBox':
        value =
          Math.sin(carrierPhase + Math.sin(modPhase) * 1.4 * Math.exp(-time * 5.2)) * 0.78 +
          Math.sin(carrierPhase * 2) * Math.exp(-time * 7) * 0.1;
        break;
      case 'metalPulse':
        value =
          triangle(carrierPhase + mod * 0.4) * 0.48 +
          Math.sin(carrierPhase * 2.5) * Math.exp(-time * 1.6) * 0.2 +
          noise * 0.04;
        break;
      case 'feltLead':
        value =
          Math.sin(carrierPhase + Math.sin(modPhase) * 0.9 * Math.exp(-time * 2.1)) * 0.68 +
          triangle(auxPhase) * 0.12 +
          noise * Math.exp(-time * 14) * 0.04;
        break;
      case 'softFlute':
        value =
          Math.sin(carrierPhase + Math.sin(modPhase) * 0.22) * 0.74 +
          Math.sin(auxPhase) * 0.12 +
          noise * 0.015;
        break;
      case 'reedLead':
        value =
          triangle(carrierPhase + Math.sin(modPhase) * 0.4) * 0.52 +
          Math.sin(carrierPhase * 2) * 0.14 +
          noise * 0.025;
        break;
      case 'warmBass':
        value =
          Math.sin(carrierPhase) * 0.72 + triangle(auxPhase) * 0.12 + Math.sin(subPhase) * 0.08;
        break;
      case 'pulseBass':
        value =
          triangle(carrierPhase) * 0.48 + Math.sin(auxPhase) * 0.22 + Math.sin(subPhase) * 0.12;
        break;
      case 'darkBass':
        value = Math.sin(carrierPhase) * 0.76 + Math.sin(auxPhase) * 0.18 + noise * 0.015;
        break;
      default:
        value = Math.sin(carrierPhase);
        break;
    }

    const sample = value * amp * tremolo;
    const [left, right] = panSample(sample, pan);
    addSample(buffers, sampleIndex, left, right);
    carrierPhase += carrierStep;
    modPhase += modStep;
    auxPhase += auxStep;
    subPhase += subStep;
  }
}

function renderPercussion(buffers, event) {
  const startSample = Math.floor(event.start * SAMPLE_RATE);
  const endSample = Math.min(
    buffers.left.length,
    Math.ceil((event.start + event.duration) * SAMPLE_RATE)
  );
  const noiseState = { value: event.seed >>> 0 };

  for (let sampleIndex = startSample; sampleIndex < endSample; sampleIndex += 1) {
    const time = (sampleIndex - startSample) / SAMPLE_RATE;
    const pan = clamp(event.pan, -1, 1);
    let sample = 0;

    switch (event.instrument) {
      case 'kick': {
        const sweep = 92 * Math.exp(-time * 6.2) + 40;
        sample = Math.sin(Math.PI * 2 * sweep * time) * Math.exp(-time * 7.5);
        sample += Math.sin(Math.PI * 2 * 180 * time) * Math.exp(-time * 18) * 0.08;
        break;
      }
      case 'snare': {
        const tone = Math.sin(Math.PI * 2 * 190 * time) * Math.exp(-time * 11) * 0.22;
        sample = noiseSample(noiseState) * Math.exp(-time * 17) * 0.58 + tone;
        break;
      }
      case 'hat': {
        sample = noiseSample(noiseState) * Math.exp(-time * 42) * 0.34;
        break;
      }
      case 'tom': {
        const sweep = 210 * Math.exp(-time * 5.1) + 70;
        sample = Math.sin(Math.PI * 2 * sweep * time) * Math.exp(-time * 9) * 0.76;
        break;
      }
      case 'pulse': {
        const sweep = 130 * Math.exp(-time * 4.2) + 60;
        sample = Math.sin(Math.PI * 2 * sweep * time) * Math.exp(-time * 10) * 0.48;
        sample += noiseSample(noiseState) * Math.exp(-time * 24) * 0.08;
        break;
      }
      default:
        sample = 0;
    }

    sample *= event.velocity;
    const [left, right] = panSample(sample, pan);
    addSample(buffers, sampleIndex, left, right);
  }
}

function addTexture(buffers, track) {
  const rng = createRng(hashString(`${track.id}-texture`));
  const totalSamples = buffers.left.length;
  let noiseA = 0;
  let noiseB = 0;

  for (let sampleIndex = 0; sampleIndex < totalSamples; sampleIndex += 1) {
    const time = sampleIndex / SAMPLE_RATE;
    const sampleNoiseA = rng() * 2 - 1;
    const sampleNoiseB = rng() * 2 - 1;
    let amount = 0.012;
    let color = 0.02;

    switch (track.texture) {
      case 'harbor':
        amount = 0.018;
        color = 0.014;
        break;
      case 'sand':
        amount = 0.014;
        color = 0.032;
        break;
      case 'mechanical':
        amount = 0.012;
        color = 0.022;
        break;
      case 'orchard':
        amount = 0.015;
        color = 0.02;
        break;
      case 'abyss':
        amount = 0.02;
        color = 0.01;
        break;
      case 'spark':
        amount = 0.01;
        color = 0.03;
        break;
      default:
        break;
    }

    noiseA = noiseA * 0.995 + sampleNoiseA * 0.005;
    noiseB = noiseB * 0.993 + sampleNoiseB * 0.007;
    const motion = Math.sin(time * 0.13 + track.tempo * 0.02) * 0.5 + 0.5;
    let sample = (noiseA * (1 - color) + noiseB * color) * amount * (0.4 + motion * 0.6);

    if (track.texture === 'mechanical') {
      const pulse = Math.sin(Math.PI * 2 * (track.tempo / 240) * time);
      sample += Math.sign(pulse) * 0.0025 * motion;
    }

    if (track.texture === 'abyss') {
      sample += Math.sin(Math.PI * 2 * 28 * time) * 0.0035;
    }

    if (track.texture === 'orchard') {
      sample += Math.sin(Math.PI * 2 * 0.41 * time + 0.7) * 0.002;
    }

    buffers.left[sampleIndex] += sample * 0.9;
    buffers.right[sampleIndex] += sample * 1.1;
  }
}

function applySpatialEffects(buffers) {
  const lengths = [0.19, 0.27, 0.33, 0.41].map((seconds) =>
    Math.max(1, Math.round(seconds * SAMPLE_RATE))
  );
  const lines = lengths.map((length, index) => ({
    left: new Float32Array(length),
    right: new Float32Array(length),
    index: 0,
    feedback: 0.38 - index * 0.04,
    damp: 0.08 + index * 0.04,
    lowLeft: 0,
    lowRight: 0,
  }));

  for (let sampleIndex = 0; sampleIndex < buffers.left.length; sampleIndex += 1) {
    let wetLeft = 0;
    let wetRight = 0;

    for (const line of lines) {
      const delayedLeft = line.left[line.index];
      const delayedRight = line.right[line.index];
      line.lowLeft += (delayedLeft - line.lowLeft) * line.damp;
      line.lowRight += (delayedRight - line.lowRight) * line.damp;
      wetLeft += line.lowLeft;
      wetRight += line.lowRight;

      line.left[line.index] = buffers.left[sampleIndex] * 0.22 + delayedRight * line.feedback;
      line.right[line.index] = buffers.right[sampleIndex] * 0.22 + delayedLeft * line.feedback;
      line.index = (line.index + 1) % line.left.length;
    }

    buffers.left[sampleIndex] += wetLeft * 0.11;
    buffers.right[sampleIndex] += wetRight * 0.11;
  }
}

function finalizeMix(buffers) {
  let peak = 0;

  for (let sampleIndex = 0; sampleIndex < buffers.left.length; sampleIndex += 1) {
    const left = Math.tanh(buffers.left[sampleIndex] * MASTER_GAIN);
    const right = Math.tanh(buffers.right[sampleIndex] * MASTER_GAIN);
    buffers.left[sampleIndex] = left;
    buffers.right[sampleIndex] = right;
    peak = Math.max(peak, Math.abs(left), Math.abs(right));
  }

  const normalize = peak > 0 ? 0.92 / peak : 1;

  for (let sampleIndex = 0; sampleIndex < buffers.left.length; sampleIndex += 1) {
    buffers.left[sampleIndex] *= normalize;
    buffers.right[sampleIndex] *= normalize;
  }
}

function createNoteEvent(track, instrument, midi, start, duration, velocity, pan, seedOffset) {
  const baseShape = {
    haloPad: {
      attack: 1.1,
      decay: 1.8,
      sustain: 0.72,
      release: 1.6,
      modAmount: 0.26,
      modDecay: 0.42,
      tremoloRate: 0.16,
      tremoloDepth: 0.05,
    },
    mistPad: {
      attack: 0.8,
      decay: 1.3,
      sustain: 0.68,
      release: 1.2,
      modAmount: 0.18,
      modDecay: 0.5,
      tremoloRate: 0.11,
      tremoloDepth: 0.04,
    },
    sunPad: {
      attack: 0.4,
      decay: 0.8,
      sustain: 0.62,
      release: 0.9,
      modAmount: 0.18,
      modDecay: 0.8,
      tremoloRate: 0.22,
      tremoloDepth: 0.03,
    },
    choirPad: {
      attack: 0.9,
      decay: 1.4,
      sustain: 0.7,
      release: 1.5,
      modAmount: 0.22,
      modDecay: 0.46,
      tremoloRate: 0.12,
      tremoloDepth: 0.06,
    },
    glassBell: {
      attack: 0.002,
      decay: 0.14,
      sustain: 0.18,
      release: 1.5,
      modAmount: 0.9,
      modDecay: 1.4,
      tremoloRate: 0.2,
      tremoloDepth: 0.02,
    },
    musicBox: {
      attack: 0.003,
      decay: 0.1,
      sustain: 0.2,
      release: 0.9,
      modAmount: 0.66,
      modDecay: 1.6,
      tremoloRate: 0.18,
      tremoloDepth: 0.02,
    },
    metalPulse: {
      attack: 0.005,
      decay: 0.08,
      sustain: 0.24,
      release: 0.4,
      modAmount: 0.4,
      modDecay: 2.4,
      tremoloRate: 0.16,
      tremoloDepth: 0.01,
    },
    feltLead: {
      attack: 0.015,
      decay: 0.18,
      sustain: 0.54,
      release: 0.5,
      modAmount: 0.26,
      modDecay: 1.8,
      tremoloRate: 0.2,
      tremoloDepth: 0.02,
    },
    softFlute: {
      attack: 0.08,
      decay: 0.3,
      sustain: 0.74,
      release: 0.32,
      modAmount: 0.1,
      modDecay: 1.4,
      tremoloRate: 0.22,
      tremoloDepth: 0.03,
    },
    reedLead: {
      attack: 0.01,
      decay: 0.16,
      sustain: 0.56,
      release: 0.28,
      modAmount: 0.18,
      modDecay: 1.5,
      tremoloRate: 0.18,
      tremoloDepth: 0.01,
    },
    warmBass: {
      attack: 0.008,
      decay: 0.12,
      sustain: 0.56,
      release: 0.24,
      modAmount: 0.06,
      modDecay: 2.2,
      tremoloRate: 0.08,
      tremoloDepth: 0.01,
    },
    pulseBass: {
      attack: 0.005,
      decay: 0.08,
      sustain: 0.48,
      release: 0.2,
      modAmount: 0.08,
      modDecay: 2.4,
      tremoloRate: 0.08,
      tremoloDepth: 0.01,
    },
    darkBass: {
      attack: 0.005,
      decay: 0.1,
      sustain: 0.5,
      release: 0.32,
      modAmount: 0.04,
      modDecay: 2.8,
      tremoloRate: 0.06,
      tremoloDepth: 0.01,
    },
  }[instrument];

  return {
    instrument,
    midi,
    start,
    duration,
    velocity,
    pan,
    detune: 0,
    seed: hashString(`${track.id}-${instrument}-${seedOffset}-${midi}`),
    phaseOffset: (seedOffset * 0.113 + midi * 0.017) % (Math.PI * 2),
    ...baseShape,
  };
}

function createPercussionEvent(track, instrument, start, velocity, pan) {
  const durationMap = {
    kick: 0.5,
    snare: 0.35,
    hat: 0.12,
    tom: 0.42,
    pulse: 0.28,
  };

  return {
    instrument,
    start,
    duration: durationMap[instrument] ?? 0.25,
    velocity,
    pan,
    seed: hashString(`${track.id}-${instrument}-${start}`),
  };
}

function schedulePad(events, track, scale, chordDegree, barStart, section, barIndex) {
  const chord = buildChord(scale, chordDegree, track.padOctave);
  const duration = beatsToSeconds(track, 4);

  chord.forEach((midi, chordIndex) => {
    events.notes.push(
      createNoteEvent(
        track,
        track.padInstrument,
        midi,
        barStart,
        duration,
        section.pad * (0.42 - chordIndex * 0.03),
        -0.22 + chordIndex * 0.22,
        barIndex * 10 + chordIndex
      )
    );
  });
}

function scheduleBass(events, track, scale, chordDegree, barStart, section, barIndex) {
  if (section.bass <= 0) {
    return;
  }

  const rootMidi = degreeToMidi(scale, chordDegree, track.bassOctave);
  const fifthMidi = degreeToMidi(scale, chordDegree + 4, track.bassOctave);
  const beat = 60 / track.tempo;
  const pattern =
    track.bassInstrument === 'pulseBass'
      ? [
          [0, rootMidi, 0.5],
          [1.5, rootMidi + 12, 0.32],
          [2, fifthMidi, 0.45],
          [3, rootMidi, 0.45],
        ]
      : [
          [0, rootMidi, 1.6],
          [2, fifthMidi, 0.8],
          [3, rootMidi, 0.9],
        ];

  pattern.forEach(([offset, midi, beats], patternIndex) => {
    events.notes.push(
      createNoteEvent(
        track,
        track.bassInstrument,
        midi,
        barStart + offset * beat,
        beatsToSeconds(track, beats),
        section.bass * 0.48,
        -0.04 + patternIndex * 0.03,
        barIndex * 30 + patternIndex
      )
    );
  });
}

function scheduleArp(events, track, scale, chordDegree, barStart, section, barIndex) {
  if (section.arp <= 0) {
    return;
  }

  const stepDuration = beatsToSeconds(track, 0.5);

  track.arpPattern.forEach((degreeOffset, stepIndex) => {
    const midi = degreeToMidi(scale, chordDegree + degreeOffset, track.arpOctave);
    events.notes.push(
      createNoteEvent(
        track,
        track.arpInstrument,
        midi,
        barStart + stepIndex * stepDuration,
        beatsToSeconds(track, 0.4),
        section.arp * 0.34,
        -0.3 + (stepIndex / Math.max(track.arpPattern.length - 1, 1)) * 0.6,
        barIndex * 50 + stepIndex
      )
    );
  });
}

function scheduleMelody(events, track, scale, chordDegree, barStart, section, barIndex) {
  if (section.melody <= 0) {
    return;
  }

  const rhythm = RHYTHM_LIBRARY[track.melodyRhythm];
  const melodyPattern = track.melodyPatterns[barIndex % track.melodyPatterns.length];

  melodyPattern.forEach((degreeOffset, noteIndex) => {
    const offset = rhythm.offsets[noteIndex];
    const length = rhythm.lengths[noteIndex];

    if (typeof offset !== 'number' || typeof length !== 'number') {
      return;
    }

    const midi = degreeToMidi(scale, chordDegree + degreeOffset, track.leadOctave);
    events.notes.push(
      createNoteEvent(
        track,
        track.leadInstrument,
        midi,
        barStart + beatsToSeconds(track, offset),
        beatsToSeconds(track, length),
        section.melody * 0.42,
        -0.06 + noteIndex * 0.02,
        barIndex * 80 + noteIndex
      )
    );
  });
}

function scheduleDrums(events, track, barStart, section, barIndex) {
  const beat = 60 / track.tempo;
  const addDrum = (instrument, beatOffset, velocity, pan = 0) => {
    events.drums.push(
      createPercussionEvent(track, instrument, barStart + beatOffset * beat, velocity, pan)
    );
  };

  switch (section.drums) {
    case 'soft':
      addDrum('pulse', 0, 0.32);
      addDrum('snare', 2.9, 0.16, 0.05);
      [0.5, 1.5, 2.5, 3.5].forEach((offset, index) => {
        addDrum('hat', offset, 0.09, index % 2 === 0 ? -0.12 : 0.12);
      });
      break;
    case 'light':
      addDrum('kick', 0, 0.2);
      addDrum('snare', 2, 0.14, 0.08);
      [0.5, 1, 1.5, 2.5, 3, 3.5].forEach((offset, index) => {
        addDrum('hat', offset, 0.08, index % 2 === 0 ? -0.1 : 0.1);
      });
      break;
    case 'folk':
      addDrum('kick', 0, 0.26);
      addDrum('pulse', 1.75, 0.16);
      addDrum('snare', 2.4, 0.16, 0.06);
      [0.5, 1.5, 2.5, 3.5].forEach((offset, index) => {
        addDrum('hat', offset, 0.09, index % 2 === 0 ? -0.12 : 0.12);
      });
      break;
    case 'tense':
      addDrum('kick', 0, 0.22);
      addDrum('pulse', 1.25, 0.16, -0.04);
      addDrum('snare', 2, 0.16, 0.08);
      addDrum('kick', 2.75, 0.18);
      [0.25, 0.75, 1.25, 1.75, 2.25, 2.75, 3.25, 3.75].forEach((offset, index) => {
        addDrum('hat', offset, 0.07, index % 2 === 0 ? -0.1 : 0.1);
      });
      break;
    case 'battle':
      addDrum('kick', 0, 0.28);
      addDrum('kick', 1.5, 0.22);
      addDrum('snare', 2, 0.18, 0.04);
      addDrum('kick', 3, 0.26);
      [0.25, 0.75, 1.25, 1.75, 2.25, 2.75, 3.25, 3.75].forEach((offset, index) => {
        addDrum('hat', offset, 0.08, index % 2 === 0 ? -0.08 : 0.08);
      });
      if (barIndex % 4 === 3) {
        addDrum('tom', 3.5, 0.16, -0.05);
      }
      break;
    case 'boss':
      addDrum('kick', 0, 0.34);
      addDrum('kick', 1.25, 0.24);
      addDrum('snare', 2, 0.22, 0.03);
      addDrum('kick', 2.75, 0.28);
      addDrum('tom', 3.5, 0.22, -0.05);
      [0.25, 0.75, 1.25, 1.75, 2.25, 2.75, 3.25, 3.75].forEach((offset, index) => {
        addDrum('hat', offset, 0.085, index % 2 === 0 ? -0.08 : 0.08);
      });
      break;
    default:
      break;
  }
}

function buildEvents(track) {
  const scale = getScale(track);
  const events = {
    notes: [],
    drums: [],
  };
  let barCursor = 0;

  track.sections.forEach((section) => {
    for (let barOffset = 0; barOffset < section.bars; barOffset += 1) {
      const globalBar = barCursor + barOffset;
      const chordDegree = track.progression[globalBar % track.progression.length];
      const barStart = barToSeconds(track, globalBar);
      schedulePad(events, track, scale, chordDegree, barStart, section, globalBar);
      scheduleBass(events, track, scale, chordDegree, barStart, section, globalBar);
      scheduleArp(events, track, scale, chordDegree, barStart, section, globalBar);
      scheduleMelody(events, track, scale, chordDegree, barStart, section, globalBar);
      scheduleDrums(events, track, barStart, section, globalBar);
    }

    barCursor += section.bars;
  });

  return events;
}

function writeWaveFile(track, buffers) {
  const wav = new WaveFile();
  wav.fromScratch(2, SAMPLE_RATE, '32f', [buffers.left, buffers.right]);
  const wavPath = path.join(OUTPUT_DIR, `${track.id}.wav`);
  fs.writeFileSync(wavPath, wav.toBuffer());
  return wavPath;
}

function convertToOgg(wavPath, track) {
  const oggPath = path.join(OUTPUT_DIR, `${track.id}.ogg`);
  const result = spawnSync(
    'ffmpeg',
    [
      '-y',
      '-hide_banner',
      '-loglevel',
      'error',
      '-i',
      wavPath,
      '-c:a',
      'libvorbis',
      '-q:a',
      '5',
      oggPath,
    ],
    {
      stdio: 'pipe',
      encoding: 'utf-8',
    }
  );

  if (result.status !== 0) {
    throw new Error(`ffmpeg failed for ${track.id}: ${result.stderr}`);
  }

  fs.unlinkSync(wavPath);
  return oggPath;
}

function renderTrack(track) {
  const durationSeconds = beatsToSeconds(track, track.bars * 4) + 3;
  const totalSamples = Math.ceil(durationSeconds * SAMPLE_RATE);
  const buffers = createTrackBuffers(totalSamples);
  const events = buildEvents(track);
  addTexture(buffers, track);
  events.notes.forEach((event) => renderNote(buffers, event));
  events.drums.forEach((event) => renderPercussion(buffers, event));
  applySpatialEffects(buffers);
  finalizeMix(buffers);
  const wavPath = writeWaveFile(track, buffers);
  const oggPath = convertToOgg(wavPath, track);
  return {
    ...track,
    file: path.relative(process.cwd(), oggPath).replaceAll('\\', '/'),
    durationSeconds: Number(durationSeconds.toFixed(2)),
  };
}

function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const manifest = TRACKS.map((track) => {
    console.log(`Rendering ${track.id}...`);
    return renderTrack(track);
  });

  const manifestPath = path.join(OUTPUT_DIR, 'manifest.json');
  fs.writeFileSync(
    manifestPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        sampleRate: SAMPLE_RATE,
        generator: 'tools/generate-bgm.mjs',
        stack: ['tonal', 'wavefile', 'ffmpeg libvorbis'],
        tracks: manifest,
      },
      null,
      2
    )
  );

  console.log(`Wrote ${manifest.length} tracks to ${OUTPUT_DIR}`);
}

main();
