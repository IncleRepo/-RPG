import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const { Buffer } = globalThis;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const catalogPath = path.join(repoRoot, 'src/content/audio/track-catalog.json');
const outputDir = path.join(repoRoot, 'assets/audio/bgm');
const manifestPath = path.join(repoRoot, 'assets/audio/manifest.json');
const sampleRate = 32000;

const MODES = Object.freeze({
  ionian: [0, 2, 4, 5, 7, 9, 11],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  aeolian: [0, 2, 3, 5, 7, 8, 10],
  locrian: [0, 1, 3, 5, 6, 8, 10],
});

const PRESETS = Object.freeze({
  bell: {
    attack: 0.002,
    decay: 0.22,
    sustain: 0,
    release: 1.8,
    vibratoDepth: 0.0008,
    vibratoRate: 5.6,
    layers: [
      { wave: 'sine', amp: 1, ratio: 1 },
      { wave: 'sine', amp: 0.48, ratio: 2.63 },
      { wave: 'sine', amp: 0.28, ratio: 4.2 },
      { wave: 'sine', amp: 0.12, ratio: 6.8 },
    ],
  },
  pad: {
    attack: 0.18,
    decay: 0.4,
    sustain: 0.8,
    release: 0.7,
    vibratoDepth: 0.0018,
    vibratoRate: 4.2,
    layers: [
      { wave: 'triangle', amp: 0.7, ratio: 1, detuneCents: -6 },
      { wave: 'sine', amp: 0.55, ratio: 1, detuneCents: 7 },
      { wave: 'sine', amp: 0.24, ratio: 2 },
    ],
  },
  choir: {
    attack: 0.12,
    decay: 0.28,
    sustain: 0.76,
    release: 0.58,
    vibratoDepth: 0.0025,
    vibratoRate: 5.2,
    layers: [
      { wave: 'saw', amp: 0.5, ratio: 1, detuneCents: -8 },
      { wave: 'triangle', amp: 0.34, ratio: 1, detuneCents: 9 },
      { wave: 'sine', amp: 0.22, ratio: 2 },
    ],
  },
  piano: {
    attack: 0.005,
    decay: 0.32,
    sustain: 0.22,
    release: 0.52,
    layers: [
      { wave: 'triangle', amp: 0.9, ratio: 1 },
      { wave: 'sine', amp: 0.22, ratio: 2 },
      { wave: 'noise', amp: 0.05, ratio: 1 },
    ],
  },
  pluck: {
    attack: 0.003,
    decay: 0.14,
    sustain: 0.08,
    release: 0.24,
    layers: [
      { wave: 'triangle', amp: 0.7, ratio: 1 },
      { wave: 'saw', amp: 0.24, ratio: 2 },
    ],
  },
  pulse: {
    attack: 0.004,
    decay: 0.08,
    sustain: 0.26,
    release: 0.1,
    layers: [
      { wave: 'square', amp: 0.64, ratio: 1 },
      { wave: 'triangle', amp: 0.3, ratio: 2 },
    ],
  },
  lead: {
    attack: 0.01,
    decay: 0.12,
    sustain: 0.6,
    release: 0.22,
    vibratoDepth: 0.003,
    vibratoRate: 5.5,
    layers: [
      { wave: 'triangle', amp: 0.74, ratio: 1, detuneCents: -3 },
      { wave: 'saw', amp: 0.26, ratio: 1, detuneCents: 4 },
    ],
  },
  brass: {
    attack: 0.012,
    decay: 0.18,
    sustain: 0.68,
    release: 0.24,
    vibratoDepth: 0.002,
    vibratoRate: 5,
    layers: [
      { wave: 'saw', amp: 0.62, ratio: 1, detuneCents: -5 },
      { wave: 'square', amp: 0.28, ratio: 1, detuneCents: 6 },
      { wave: 'triangle', amp: 0.18, ratio: 2 },
    ],
  },
  bass: {
    attack: 0.005,
    decay: 0.09,
    sustain: 0.78,
    release: 0.14,
    layers: [
      { wave: 'sine', amp: 0.82, ratio: 1 },
      { wave: 'triangle', amp: 0.24, ratio: 0.5 },
      { wave: 'triangle', amp: 0.2, ratio: 2 },
    ],
  },
  glass: {
    attack: 0.006,
    decay: 0.18,
    sustain: 0.1,
    release: 0.8,
    vibratoDepth: 0.0012,
    vibratoRate: 6.8,
    layers: [
      { wave: 'sine', amp: 0.82, ratio: 1 },
      { wave: 'sine', amp: 0.24, ratio: 3.01 },
      { wave: 'triangle', amp: 0.14, ratio: 2 },
    ],
  },
});

function midiToFrequency(midi) {
  return 440 * 2 ** ((midi - 69) / 12);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function degreeToMidi(track, degree, octave = 0) {
  const intervals = MODES[track.mode];
  const scaleLength = intervals.length;
  const normalizedDegree = ((degree % scaleLength) + scaleLength) % scaleLength;
  const octaveOffset = Math.floor(degree / scaleLength);
  return track.tonicMidi + intervals[normalizedDegree] + 12 * (octave + octaveOffset);
}

function chordMidis(track, degree, octave = 0, size = 3) {
  return Array.from({ length: size }, (_, index) =>
    degreeToMidi(track, degree + index * 2, octave)
  );
}

function createBuffer(durationSeconds) {
  const totalSamples = Math.ceil(durationSeconds * sampleRate);
  return {
    left: new Float32Array(totalSamples),
    right: new Float32Array(totalSamples),
    durationSeconds,
  };
}

function oscillator(wave, phase) {
  const wrapped = phase - Math.floor(phase);

  switch (wave) {
    case 'sine':
      return Math.sin(Math.PI * 2 * wrapped);
    case 'triangle':
      return 1 - 4 * Math.abs(wrapped - 0.5);
    case 'saw':
      return 2 * wrapped - 1;
    case 'square':
      return wrapped < 0.5 ? 1 : -1;
    case 'noise':
      return (Math.sin(phase * 12.9898) * 43758.5453) % 1;
    default:
      return Math.sin(Math.PI * 2 * wrapped);
  }
}

function envelopeAt(time, duration, preset) {
  const attack = preset.attack ?? 0.01;
  const decay = preset.decay ?? 0.1;
  const sustain = preset.sustain ?? 0.6;
  const release = preset.release ?? 0.2;
  const hold = Math.max(duration - attack - decay - release, 0);

  if (time < 0 || time > duration) {
    return 0;
  }

  if (time < attack) {
    return attack <= 0 ? 1 : time / attack;
  }

  if (time < attack + decay) {
    const decayProgress = (time - attack) / Math.max(decay, 1e-6);
    return 1 + (sustain - 1) * decayProgress;
  }

  if (time < attack + decay + hold) {
    return sustain;
  }

  const releaseProgress = (time - attack - decay - hold) / Math.max(release, 1e-6);
  return sustain * (1 - releaseProgress);
}

function addInstrumentNote(
  buffer,
  startSeconds,
  durationSeconds,
  frequency,
  amplitude,
  presetName,
  options = {}
) {
  const preset = PRESETS[presetName];

  if (!preset || durationSeconds <= 0 || frequency <= 0) {
    return;
  }

  const totalDuration = durationSeconds;
  const startSample = Math.max(0, Math.floor(startSeconds * sampleRate));
  const endSample = Math.min(
    buffer.left.length,
    Math.ceil((startSeconds + totalDuration) * sampleRate)
  );
  const pan = clamp(options.pan ?? 0, -1, 1);
  const leftPan = Math.cos(((pan + 1) * Math.PI) / 4);
  const rightPan = Math.sin(((pan + 1) * Math.PI) / 4);
  const vibratoDepth = options.vibratoDepth ?? preset.vibratoDepth ?? 0;
  const vibratoRate = options.vibratoRate ?? preset.vibratoRate ?? 0;

  for (let sampleIndex = startSample; sampleIndex < endSample; sampleIndex += 1) {
    const t = sampleIndex / sampleRate - startSeconds;
    const env = envelopeAt(t, totalDuration, preset);

    if (env <= 0) {
      continue;
    }

    let sampleValue = 0;

    for (const layer of preset.layers) {
      const detuneRatio = 2 ** (((layer.detuneCents ?? 0) + (options.detuneCents ?? 0)) / 1200);
      const vibratoRatio =
        vibratoDepth > 0 ? 1 + Math.sin(Math.PI * 2 * vibratoRate * t) * vibratoDepth : 1;
      const layerFrequency = frequency * layer.ratio * detuneRatio * vibratoRatio;
      const phase = t * layerFrequency;
      sampleValue += oscillator(layer.wave, phase) * layer.amp;
    }

    const value = sampleValue * amplitude * env;
    buffer.left[sampleIndex] += value * leftPan;
    buffer.right[sampleIndex] += value * rightPan;
  }
}

function addKick(buffer, startSeconds, amplitude = 0.9) {
  const duration = 0.26;
  const startSample = Math.max(0, Math.floor(startSeconds * sampleRate));
  const endSample = Math.min(buffer.left.length, Math.ceil((startSeconds + duration) * sampleRate));

  for (let sampleIndex = startSample; sampleIndex < endSample; sampleIndex += 1) {
    const t = sampleIndex / sampleRate - startSeconds;
    const progress = t / duration;
    const env = Math.exp(-8.2 * progress);
    const freq = 110 * (1 - progress) + 42;
    const body = Math.sin(Math.PI * 2 * freq * t) * env * amplitude;
    const click = Math.sin(Math.PI * 2 * 180 * t) * Math.exp(-40 * t) * 0.18;
    buffer.left[sampleIndex] += body + click;
    buffer.right[sampleIndex] += body + click;
  }
}

function addSnare(buffer, startSeconds, amplitude = 0.55) {
  const duration = 0.2;
  const startSample = Math.max(0, Math.floor(startSeconds * sampleRate));
  const endSample = Math.min(buffer.left.length, Math.ceil((startSeconds + duration) * sampleRate));

  for (let sampleIndex = startSample; sampleIndex < endSample; sampleIndex += 1) {
    const t = sampleIndex / sampleRate - startSeconds;
    const env = Math.exp(-18 * t);
    const tone = Math.sin(Math.PI * 2 * 196 * t) * Math.exp(-12 * t) * 0.22;
    const noiseSeed = Math.sin((sampleIndex + 17) * 0.173) + Math.sin((sampleIndex + 91) * 0.037);
    const noise = noiseSeed * 0.5 * env * amplitude;
    buffer.left[sampleIndex] += noise + tone;
    buffer.right[sampleIndex] += noise + tone;
  }
}

function addHat(buffer, startSeconds, amplitude = 0.18) {
  const duration = 0.08;
  const startSample = Math.max(0, Math.floor(startSeconds * sampleRate));
  const endSample = Math.min(buffer.left.length, Math.ceil((startSeconds + duration) * sampleRate));

  for (let sampleIndex = startSample; sampleIndex < endSample; sampleIndex += 1) {
    const t = sampleIndex / sampleRate - startSeconds;
    const env = Math.exp(-42 * t);
    const noise =
      (Math.sin((sampleIndex + 13) * 0.927) + Math.sin((sampleIndex + 37) * 0.521)) *
      0.22 *
      env *
      amplitude;
    buffer.left[sampleIndex] += noise;
    buffer.right[sampleIndex] += noise;
  }
}

function addSweep(buffer, startSeconds, durationSeconds, amplitude = 0.14, pan = 0) {
  const startSample = Math.max(0, Math.floor(startSeconds * sampleRate));
  const endSample = Math.min(
    buffer.left.length,
    Math.ceil((startSeconds + durationSeconds) * sampleRate)
  );
  const leftPan = Math.cos(((pan + 1) * Math.PI) / 4);
  const rightPan = Math.sin(((pan + 1) * Math.PI) / 4);

  for (let sampleIndex = startSample; sampleIndex < endSample; sampleIndex += 1) {
    const t = sampleIndex / sampleRate - startSeconds;
    const progress = t / durationSeconds;
    const env = Math.sin(Math.PI * progress) ** 2;
    const noise =
      (Math.sin((sampleIndex + 11) * 0.043) + Math.sin((sampleIndex + 89) * 0.061)) *
      env *
      amplitude;
    buffer.left[sampleIndex] += noise * leftPan;
    buffer.right[sampleIndex] += noise * rightPan;
  }
}

function addChord(ctx, beat, degree, octave, instrument, amplitude, durationBeats, options = {}) {
  const notes = chordMidis(ctx.track, degree, octave, options.size ?? 3);
  const noteDuration = durationBeats * ctx.secondsPerBeat;
  const noteStart = beat * ctx.secondsPerBeat;
  const spread = options.spread ?? 0.18;

  notes.forEach((midi, index) => {
    const pan = options.pan !== undefined ? options.pan : (index - (notes.length - 1) / 2) * spread;
    addInstrumentNote(
      ctx.buffer,
      noteStart,
      noteDuration,
      midiToFrequency(midi),
      amplitude / Math.max(notes.length, 1),
      instrument,
      { pan }
    );
  });
}

function addBassPattern(
  ctx,
  bar,
  degree,
  pattern,
  octave = -2,
  instrument = 'bass',
  amplitude = 0.24
) {
  const barStartBeat = bar * ctx.track.beatsPerBar;

  for (const step of pattern) {
    const midi = degreeToMidi(ctx.track, degree + (step.degreeOffset ?? 0), octave);
    addInstrumentNote(
      ctx.buffer,
      (barStartBeat + step.offset) * ctx.secondsPerBeat,
      step.duration * ctx.secondsPerBeat,
      midiToFrequency(midi),
      amplitude * (step.amp ?? 1),
      instrument,
      { pan: step.pan ?? 0 }
    );
  }
}

function addDegreeSequence(
  ctx,
  startBeat,
  degrees,
  instrument,
  amplitude,
  durationBeats,
  octave,
  options = {}
) {
  degrees.forEach((degree, index) => {
    const beat = startBeat + index * durationBeats;

    if (degree === null) {
      return;
    }

    const midi = degreeToMidi(ctx.track, degree, octave);
    addInstrumentNote(
      ctx.buffer,
      beat * ctx.secondsPerBeat,
      durationBeats * ctx.secondsPerBeat * (options.lengthScale ?? 0.96),
      midiToFrequency(midi),
      amplitude * (options.ampScale?.[index] ?? 1),
      instrument,
      { pan: options.panPattern?.[index % (options.panPattern?.length ?? 1)] ?? options.pan ?? 0 }
    );
  });
}

function addPercussionLoop(ctx, bar, options = {}) {
  const barStart = bar * ctx.track.beatsPerBar;
  const beatCount = ctx.track.beatsPerBar;
  const kickPattern = options.kick ?? [0];
  const snarePattern = options.snare ?? [];
  const hatStep = options.hatStep ?? 0.5;

  kickPattern.forEach((offset) =>
    addKick(ctx.buffer, (barStart + offset) * ctx.secondsPerBeat, options.kickAmp ?? 0.72)
  );
  snarePattern.forEach((offset) =>
    addSnare(ctx.buffer, (barStart + offset) * ctx.secondsPerBeat, options.snareAmp ?? 0.5)
  );

  if (hatStep > 0) {
    for (let beat = 0; beat < beatCount; beat += hatStep) {
      addHat(ctx.buffer, (barStart + beat) * ctx.secondsPerBeat, options.hatAmp ?? 0.13);
    }
  }
}

function motifDegrees(style) {
  switch (style) {
    case 'title':
      return [0, 2, 4, 1, 0, 5, 4, 2];
    case 'harbor':
      return [0, null, 2, 1, 0, null, 4, 2];
    case 'tension':
      return [0, 0, 3, 2, 1, 1, 4, 3];
    case 'expedition':
      return [0, 2, 3, 5, 4, 2, 1, 0];
    case 'battle':
      return [0, 3, 4, 5, 4, 3, 2, 1];
    case 'city':
      return [0, 2, 1, 4, 3, 2, 5, 4, 2, 1];
    case 'emotion':
      return [0, 2, 4, 5, 4, 2, 1, 0];
    case 'revelation':
      return [0, 1, 3, 6, 4, 3, 1, 0, 2, 1];
    case 'dungeon':
      return [0, 2, 1, 0, 3, 4, 2, 1];
    case 'boss':
      return [0, 3, 5, 6, 5, 3, 2, 1];
    case 'credits':
      return [0, 2, 4, 1, 0, 5, 4, 2];
    default:
      return [0, 2, 4, 2];
  }
}

function defaultProgression(style) {
  switch (style) {
    case 'title':
      return [0, 5, 3, 4];
    case 'harbor':
      return [0, 5, 6, 4];
    case 'tension':
      return [0, 1, 6, 4];
    case 'expedition':
      return [0, 3, 5, 4];
    case 'battle':
      return [0, 6, 5, 4];
    case 'city':
      return [0, 4, 1, 6];
    case 'emotion':
      return [0, 5, 3, 4];
    case 'revelation':
      return [0, 2, 6, 4];
    case 'dungeon':
      return [0, 5, 6, 1];
    case 'boss':
      return [0, 1, 5, 6];
    case 'credits':
      return [0, 5, 3, 4];
    default:
      return [0, 3, 4, 0];
  }
}

function renderTitle(ctx) {
  const progression = defaultProgression(ctx.track.style);
  const motif = motifDegrees(ctx.track.style);

  for (let bar = 0; bar < ctx.track.bars; bar += 1) {
    const degree = progression[bar % progression.length];
    addChord(ctx, bar * 4, degree, 0, 'pad', 0.32, 4.2);
    addChord(ctx, bar * 4, degree, 1, 'choir', 0.16, 3.8, { spread: 0.24 });
    addBassPattern(
      ctx,
      bar,
      degree,
      [
        { offset: 0, duration: 1.4, degreeOffset: 0, amp: 1 },
        { offset: 2, duration: 1.2, degreeOffset: 4, amp: 0.72 },
      ],
      -2,
      'bass',
      0.22
    );
    addInstrumentNote(
      ctx.buffer,
      bar * 4 * ctx.secondsPerBeat,
      1.6 * ctx.secondsPerBeat,
      midiToFrequency(degreeToMidi(ctx.track, degree + 4, 1)),
      0.12,
      'bell',
      { pan: bar % 2 === 0 ? -0.18 : 0.18 }
    );
    addDegreeSequence(
      ctx,
      bar * 4 + 0.5,
      motif.slice((bar % 2) * 4, (bar % 2) * 4 + 4),
      'piano',
      0.12,
      0.5,
      1,
      {
        panPattern: [-0.14, 0.12, -0.06, 0.08],
      }
    );
    if (bar >= 8) {
      addPercussionLoop(ctx, bar, {
        kick: [0],
        snare: [2],
        hatStep: 0.5,
        hatAmp: 0.09,
        snareAmp: 0.32,
      });
    }
  }

  addSweep(ctx.buffer, 0, 2.8, 0.08, -0.4);
}

function renderHarbor(ctx) {
  const progression = defaultProgression(ctx.track.style);
  const motif = motifDegrees(ctx.track.style);

  for (let bar = 0; bar < ctx.track.bars; bar += 1) {
    const degree = progression[bar % progression.length];
    addChord(ctx, bar * 4, degree, 0, 'pad', 0.26, 4.3);
    addChord(ctx, bar * 4 + 1.5, degree, 1, 'glass', 0.1, 2.2, { spread: 0.3 });
    addBassPattern(
      ctx,
      bar,
      degree,
      [
        { offset: 0, duration: 1.9, degreeOffset: 0, amp: 1 },
        { offset: 2, duration: 1.4, degreeOffset: 4, amp: 0.65 },
      ],
      -2,
      'bass',
      0.16
    );

    if (bar % 2 === 0) {
      addDegreeSequence(ctx, bar * 4 + 0.25, motif, 'piano', 0.08, 0.5, 1, {
        lengthScale: 0.82,
        panPattern: [-0.18, 0.12, -0.1, 0.14, -0.12, 0.1, -0.08, 0.08],
      });
    }
  }

  addSweep(ctx.buffer, 0.6, 5.4, 0.06, 0.38);
  addSweep(ctx.buffer, 14, 3.8, 0.05, -0.28);
}

function renderTension(ctx) {
  const progression = defaultProgression(ctx.track.style);
  const motif = motifDegrees(ctx.track.style);

  for (let bar = 0; bar < ctx.track.bars; bar += 1) {
    const degree = progression[bar % progression.length];
    addChord(ctx, bar * 4, degree, -1, 'choir', 0.16, 4);
    addBassPattern(
      ctx,
      bar,
      degree,
      [
        { offset: 0, duration: 0.8, degreeOffset: 0, amp: 1 },
        { offset: 1, duration: 0.8, degreeOffset: 0, amp: 0.9 },
        { offset: 2, duration: 0.8, degreeOffset: 1, amp: 0.92 },
        { offset: 3, duration: 0.8, degreeOffset: 0, amp: 0.88 },
      ],
      -2,
      'pulse',
      0.2
    );
    addDegreeSequence(ctx, bar * 4, motif, 'pulse', 0.08, 0.5, 1, {
      panPattern: [-0.2, 0.18, -0.12, 0.1, -0.18, 0.16, -0.08, 0.08],
      lengthScale: 0.72,
    });

    if (bar >= 2) {
      addPercussionLoop(ctx, bar, {
        kick: [0, 2.5],
        snare: [1.5, 3],
        hatStep: 0.5,
        hatAmp: 0.1,
        snareAmp: 0.3,
      });
    }

    if (bar % 4 === 3) {
      addInstrumentNote(
        ctx.buffer,
        (bar * 4 + 3.2) * ctx.secondsPerBeat,
        1.1 * ctx.secondsPerBeat,
        midiToFrequency(degreeToMidi(ctx.track, degree + 4, 1)),
        0.12,
        'bell',
        { pan: 0.12 }
      );
    }
  }
}

function renderExpedition(ctx) {
  const progression = defaultProgression(ctx.track.style);
  const motif = motifDegrees(ctx.track.style);

  for (let bar = 0; bar < ctx.track.bars; bar += 1) {
    const degree = progression[bar % progression.length];
    addChord(ctx, bar * 4, degree, 0, 'pad', 0.2, 3.8);
    addChord(ctx, bar * 4, degree, 1, 'glass', 0.12, 1.6, { spread: 0.26 });
    addBassPattern(
      ctx,
      bar,
      degree,
      [
        { offset: 0, duration: 1.2, degreeOffset: 0, amp: 1 },
        { offset: 1.5, duration: 0.9, degreeOffset: 2, amp: 0.7 },
        { offset: 3, duration: 0.8, degreeOffset: 4, amp: 0.72 },
      ],
      -2,
      'bass',
      0.18
    );
    addDegreeSequence(ctx, bar * 4, motif, 'pluck', 0.09, 0.5, 1, {
      panPattern: [-0.22, 0.22, -0.16, 0.14, -0.18, 0.18, -0.12, 0.1],
      lengthScale: 0.68,
    });
    if (bar >= 4) {
      addPercussionLoop(ctx, bar, {
        kick: [0, 2.5],
        snare: [2],
        hatStep: 1,
        hatAmp: 0.08,
        kickAmp: 0.58,
        snareAmp: 0.22,
      });
    }
  }

  addSweep(ctx.buffer, 4.2, 6.6, 0.08, -0.45);
}

function renderBattle(ctx) {
  const progression = defaultProgression(ctx.track.style);
  const motif = motifDegrees(ctx.track.style);

  for (let bar = 0; bar < ctx.track.bars; bar += 1) {
    const degree = progression[bar % progression.length];
    addChord(ctx, bar * 4, degree, -1, 'choir', 0.13, 4.1);
    addBassPattern(
      ctx,
      bar,
      degree,
      [
        { offset: 0, duration: 0.7, degreeOffset: 0, amp: 1 },
        { offset: 1, duration: 0.6, degreeOffset: 0, amp: 0.92 },
        { offset: 2, duration: 0.7, degreeOffset: 4, amp: 0.86 },
        { offset: 3, duration: 0.6, degreeOffset: 5, amp: 0.84 },
      ],
      -2,
      'bass',
      0.24
    );
    addDegreeSequence(ctx, bar * 4, motif, 'brass', 0.12, 0.5, 1, {
      panPattern: [-0.12, 0.12, -0.08, 0.08, -0.1, 0.1, -0.06, 0.06],
      lengthScale: 0.82,
    });
    addPercussionLoop(ctx, bar, {
      kick: [0, 1.5, 2.5],
      snare: [1, 3],
      hatStep: 0.5,
      hatAmp: 0.12,
      kickAmp: 0.76,
      snareAmp: 0.4,
    });

    if (bar % 4 === 0) {
      addInstrumentNote(
        ctx.buffer,
        bar * 4 * ctx.secondsPerBeat,
        0.8 * ctx.secondsPerBeat,
        midiToFrequency(degreeToMidi(ctx.track, degree + 7, 1)),
        0.14,
        'bell',
        { pan: -0.08 }
      );
    }
  }
}

function renderCity(ctx) {
  const progression = defaultProgression(ctx.track.style);
  const motif = motifDegrees(ctx.track.style);

  for (let bar = 0; bar < ctx.track.bars; bar += 1) {
    const degree = progression[bar % progression.length];
    addChord(ctx, bar * 5, degree, 0, 'pad', 0.24, 5.1);
    addBassPattern(
      ctx,
      bar,
      degree,
      [
        { offset: 0, duration: 1.1, degreeOffset: 0, amp: 1 },
        { offset: 2, duration: 0.9, degreeOffset: 2, amp: 0.72 },
        { offset: 3.5, duration: 0.9, degreeOffset: 4, amp: 0.7 },
      ],
      -2,
      'bass',
      0.18
    );
    addDegreeSequence(ctx, bar * 5, motif, 'glass', 0.08, 0.5, 1, {
      panPattern: [-0.22, 0.2, -0.16, 0.14, -0.12, 0.12, -0.08, 0.08, -0.14, 0.14],
      lengthScale: 0.74,
    });

    if (bar >= 3) {
      addPercussionLoop(ctx, bar, {
        kick: [0, 3],
        snare: [2],
        hatStep: 1,
        hatAmp: 0.08,
        kickAmp: 0.54,
        snareAmp: 0.2,
      });
    }
  }
}

function renderEmotion(ctx) {
  const progression = defaultProgression(ctx.track.style);
  const motif = motifDegrees(ctx.track.style);

  for (let bar = 0; bar < ctx.track.bars; bar += 1) {
    const degree = progression[bar % progression.length];
    addChord(ctx, bar * 6, degree, 0, 'pad', 0.22, 6.2);
    addChord(ctx, bar * 6, degree, 1, 'choir', 0.1, 5.8, { spread: 0.18 });
    addBassPattern(
      ctx,
      bar,
      degree,
      [
        { offset: 0, duration: 1.8, degreeOffset: 0, amp: 1 },
        { offset: 3, duration: 1.6, degreeOffset: 4, amp: 0.68 },
      ],
      -2,
      'bass',
      0.14
    );
    addDegreeSequence(ctx, bar * 6, motif, 'piano', 0.1, 0.75, 1, {
      panPattern: [-0.14, 0.1, -0.08, 0.08, -0.12, 0.1, -0.06, 0.06],
      lengthScale: 0.88,
    });

    if (bar % 3 === 2) {
      addInstrumentNote(
        ctx.buffer,
        (bar * 6 + 5.2) * ctx.secondsPerBeat,
        1.1 * ctx.secondsPerBeat,
        midiToFrequency(degreeToMidi(ctx.track, degree + 4, 2)),
        0.08,
        'bell',
        { pan: 0.16 }
      );
    }
  }
}

function renderRevelation(ctx) {
  const progression = defaultProgression(ctx.track.style);
  const motif = motifDegrees(ctx.track.style);

  for (let bar = 0; bar < ctx.track.bars; bar += 1) {
    const degree = progression[bar % progression.length];
    addChord(ctx, bar * 5, degree, 0, 'choir', 0.18, 5.1);
    addChord(ctx, bar * 5 + 2.5, degree, 1, 'glass', 0.08, 1.4, { spread: 0.28 });
    addBassPattern(
      ctx,
      bar,
      degree,
      [
        { offset: 0, duration: 1.2, degreeOffset: 0, amp: 1 },
        { offset: 2.5, duration: 1, degreeOffset: 3, amp: 0.8 },
        { offset: 4, duration: 0.8, degreeOffset: 6, amp: 0.78 },
      ],
      -2,
      'pulse',
      0.16
    );
    addDegreeSequence(ctx, bar * 5, motif, 'glass', 0.07, 0.5, 1, {
      panPattern: [-0.24, 0.22, -0.18, 0.16, -0.12, 0.12, -0.08, 0.08, -0.1, 0.1],
      lengthScale: 0.76,
    });

    if (bar >= 4) {
      addPercussionLoop(ctx, bar, {
        kick: [0, 3.5],
        snare: [2],
        hatStep: 1,
        hatAmp: 0.06,
        kickAmp: 0.46,
        snareAmp: 0.18,
      });
    }
  }
}

function renderDungeon(ctx) {
  const progression = defaultProgression(ctx.track.style);
  const motif = motifDegrees(ctx.track.style);

  for (let bar = 0; bar < ctx.track.bars; bar += 1) {
    const degree = progression[bar % progression.length];
    addChord(ctx, bar * 4, degree, -1, 'choir', 0.16, 4.2);
    addChord(ctx, bar * 4, degree, 0, 'pad', 0.18, 3.8);
    addBassPattern(
      ctx,
      bar,
      degree,
      [
        { offset: 0, duration: 1.4, degreeOffset: 0, amp: 1 },
        { offset: 2, duration: 1.1, degreeOffset: 4, amp: 0.74 },
      ],
      -2,
      'bass',
      0.2
    );
    addDegreeSequence(ctx, bar * 4 + 0.5, motif, 'glass', 0.06, 0.5, 1, {
      panPattern: [-0.2, 0.18, -0.14, 0.12, -0.18, 0.16, -0.1, 0.08],
      lengthScale: 0.72,
    });

    if (bar >= 2) {
      addPercussionLoop(ctx, bar, {
        kick: [0, 2],
        snare: [3],
        hatStep: 1,
        hatAmp: 0.05,
        kickAmp: 0.5,
        snareAmp: 0.16,
      });
    }

    if (bar % 3 === 0) {
      addInstrumentNote(
        ctx.buffer,
        bar * 4 * ctx.secondsPerBeat,
        1.5 * ctx.secondsPerBeat,
        midiToFrequency(degreeToMidi(ctx.track, degree + 7, 1)),
        0.1,
        'bell',
        { pan: -0.1 }
      );
    }
  }
}

function renderBoss(ctx) {
  const progression = defaultProgression(ctx.track.style);
  const motif = motifDegrees(ctx.track.style);

  for (let bar = 0; bar < ctx.track.bars; bar += 1) {
    const degree = progression[bar % progression.length];
    addChord(ctx, bar * 4, degree, -1, 'choir', 0.14, 4.2);
    addBassPattern(
      ctx,
      bar,
      degree,
      [
        { offset: 0, duration: 0.7, degreeOffset: 0, amp: 1 },
        { offset: 1, duration: 0.5, degreeOffset: 0, amp: 0.96 },
        { offset: 2, duration: 0.7, degreeOffset: 3, amp: 0.9 },
        { offset: 3, duration: 0.5, degreeOffset: 5, amp: 0.86 },
      ],
      -2,
      'bass',
      0.26
    );
    addDegreeSequence(ctx, bar * 4, motif, 'brass', 0.13, 0.5, 1, {
      panPattern: [-0.1, 0.1, -0.08, 0.08, -0.12, 0.12, -0.06, 0.06],
      lengthScale: 0.82,
    });
    addPercussionLoop(ctx, bar, {
      kick: [0, 1.5, 2.5],
      snare: [1, 3],
      hatStep: 0.5,
      hatAmp: 0.11,
      kickAmp: 0.8,
      snareAmp: 0.38,
    });

    if (bar % 2 === 0) {
      addInstrumentNote(
        ctx.buffer,
        bar * 4 * ctx.secondsPerBeat,
        0.9 * ctx.secondsPerBeat,
        midiToFrequency(degreeToMidi(ctx.track, degree + 7, 1)),
        0.16,
        'bell',
        { pan: 0.06 }
      );
    }
  }
}

function renderCredits(ctx) {
  const progression = defaultProgression(ctx.track.style);
  const motif = motifDegrees(ctx.track.style);

  for (let bar = 0; bar < ctx.track.bars; bar += 1) {
    const degree = progression[bar % progression.length];
    addChord(ctx, bar * 4, degree, 0, 'pad', 0.3, 4.2);
    addChord(ctx, bar * 4, degree, 1, 'choir', 0.14, 4);
    addBassPattern(
      ctx,
      bar,
      degree,
      [
        { offset: 0, duration: 1.6, degreeOffset: 0, amp: 1 },
        { offset: 2, duration: 1.2, degreeOffset: 4, amp: 0.68 },
      ],
      -2,
      'bass',
      0.16
    );
    addDegreeSequence(ctx, bar * 4 + 0.25, motif, 'piano', 0.11, 0.5, 1, {
      panPattern: [-0.14, 0.12, -0.08, 0.1, -0.12, 0.1, -0.06, 0.08],
      lengthScale: 0.84,
    });
    if (bar % 4 === 0) {
      addInstrumentNote(
        ctx.buffer,
        (bar * 4 + 0.2) * ctx.secondsPerBeat,
        1.2 * ctx.secondsPerBeat,
        midiToFrequency(degreeToMidi(ctx.track, degree + 4, 2)),
        0.08,
        'bell',
        { pan: -0.1 }
      );
    }
    if (bar >= 8) {
      addPercussionLoop(ctx, bar, {
        kick: [0],
        snare: [2],
        hatStep: 1,
        hatAmp: 0.05,
        kickAmp: 0.38,
        snareAmp: 0.14,
      });
    }
  }
}

const RENDERERS = Object.freeze({
  title: renderTitle,
  harbor: renderHarbor,
  tension: renderTension,
  expedition: renderExpedition,
  battle: renderBattle,
  city: renderCity,
  emotion: renderEmotion,
  revelation: renderRevelation,
  dungeon: renderDungeon,
  boss: renderBoss,
  credits: renderCredits,
});

function applyShortReverb(buffer, amount = 0.1) {
  const taps = [
    { delay: 0.09, feedback: 0.32, pan: -0.2 },
    { delay: 0.14, feedback: 0.24, pan: 0.18 },
    { delay: 0.21, feedback: 0.18, pan: -0.08 },
  ];

  taps.forEach((tap) => {
    const delaySamples = Math.floor(tap.delay * sampleRate);

    for (let index = delaySamples; index < buffer.left.length; index += 1) {
      buffer.left[index] += buffer.left[index - delaySamples] * tap.feedback * amount;
      buffer.right[index] += buffer.right[index - delaySamples] * tap.feedback * amount;
      buffer.left[index] += buffer.right[index - delaySamples] * tap.pan * 0.01;
      buffer.right[index] += buffer.left[index - delaySamples] * tap.pan * 0.01;
    }
  });
}

function normalize(buffer, limit = 0.84) {
  let peak = 0;

  for (let index = 0; index < buffer.left.length; index += 1) {
    peak = Math.max(peak, Math.abs(buffer.left[index]), Math.abs(buffer.right[index]));
  }

  if (peak <= 0) {
    return;
  }

  const gain = Math.min(limit / peak, 1.8);

  for (let index = 0; index < buffer.left.length; index += 1) {
    buffer.left[index] = clamp(buffer.left[index] * gain, -0.98, 0.98);
    buffer.right[index] = clamp(buffer.right[index] * gain, -0.98, 0.98);
  }
}

function applyEdgeFade(buffer, fadeSeconds = 0.02) {
  const fadeSamples = Math.floor(fadeSeconds * sampleRate);

  for (let index = 0; index < fadeSamples; index += 1) {
    const multiplier = index / Math.max(fadeSamples, 1);
    const tailMultiplier = (fadeSamples - index) / Math.max(fadeSamples, 1);
    buffer.left[index] *= multiplier;
    buffer.right[index] *= multiplier;
    const tailIndex = buffer.left.length - 1 - index;
    buffer.left[tailIndex] *= tailMultiplier;
    buffer.right[tailIndex] *= tailMultiplier;
  }
}

function writeWaveFile(filePath, buffer) {
  const channels = 2;
  const bitsPerSample = 16;
  const blockAlign = channels * (bitsPerSample / 8);
  const byteRate = sampleRate * blockAlign;
  const dataSize = buffer.left.length * blockAlign;
  const output = Buffer.alloc(44 + dataSize);

  output.write('RIFF', 0, 'ascii');
  output.writeUInt32LE(36 + dataSize, 4);
  output.write('WAVE', 8, 'ascii');
  output.write('fmt ', 12, 'ascii');
  output.writeUInt32LE(16, 16);
  output.writeUInt16LE(1, 20);
  output.writeUInt16LE(channels, 22);
  output.writeUInt32LE(sampleRate, 24);
  output.writeUInt32LE(byteRate, 28);
  output.writeUInt16LE(blockAlign, 32);
  output.writeUInt16LE(bitsPerSample, 34);
  output.write('data', 36, 'ascii');
  output.writeUInt32LE(dataSize, 40);

  for (let index = 0; index < buffer.left.length; index += 1) {
    const leftSample = Math.round(clamp(buffer.left[index], -1, 1) * 32767);
    const rightSample = Math.round(clamp(buffer.right[index], -1, 1) * 32767);
    output.writeInt16LE(leftSample, 44 + index * 4);
    output.writeInt16LE(rightSample, 44 + index * 4 + 2);
  }

  fs.writeFileSync(filePath, output);
}

function encodeOgg(wavePath, oggPath) {
  const result = spawnSync(
    'ffmpeg',
    [
      '-y',
      '-loglevel',
      'error',
      '-i',
      wavePath,
      '-codec:a',
      'libvorbis',
      '-qscale:a',
      '3',
      oggPath,
    ],
    { stdio: 'inherit' }
  );

  if (result.status !== 0) {
    throw new Error(`ffmpeg encoding failed for ${oggPath}`);
  }
}

function generateTrack(track) {
  const durationSeconds = (track.bars * track.beatsPerBar * 60) / track.bpm;
  const buffer = createBuffer(durationSeconds);
  const ctx = {
    track,
    buffer,
    secondsPerBeat: 60 / track.bpm,
  };
  const renderer = RENDERERS[track.style];

  if (!renderer) {
    throw new Error(`Unknown renderer style: ${track.style}`);
  }

  renderer(ctx);
  applyShortReverb(buffer, track.style === 'boss' ? 0.07 : 0.1);
  applyEdgeFade(buffer, 0.02);
  normalize(buffer);

  return buffer;
}

function main() {
  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'scenario-bgm-'));

  fs.mkdirSync(outputDir, { recursive: true });

  const manifest = {
    project: catalog.project,
    generatedAt: new Date().toISOString(),
    sampleRate,
    format: 'ogg/vorbis',
    tracks: [],
  };

  for (const track of catalog.tracks) {
    const buffer = generateTrack(track);
    const wavePath = path.join(tempDir, `${track.slug}.wav`);
    const oggPath = path.join(outputDir, `${track.slug}.ogg`);

    writeWaveFile(wavePath, buffer);
    encodeOgg(wavePath, oggPath);

    manifest.tracks.push({
      id: track.id,
      slug: track.slug,
      title: track.title,
      chapter: track.chapter,
      file: `assets/audio/bgm/${track.slug}.ogg`,
      durationSeconds: Number(buffer.durationSeconds.toFixed(2)),
      bpm: track.bpm,
      mode: track.mode,
      tonicMidi: track.tonicMidi,
      situations: track.situations,
      mood: track.mood,
    });
  }

  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
}

main();
