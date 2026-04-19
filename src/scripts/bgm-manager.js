import { BGM_TRACK_LIBRARY } from './bgm-track-library.js';

const MODE_INTERVALS = Object.freeze({
  ionian: [0, 2, 4, 5, 7, 9, 11],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  aeolian: [0, 2, 3, 5, 7, 8, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
});

const TRACK_LOOKUP = new Map(BGM_TRACK_LIBRARY.map((track) => [track.id, track]));
const DEFAULT_TRACK_ID = BGM_TRACK_LIBRARY[0]?.id ?? '';
const DEFAULT_SAMPLE_RATE = 48_000;

const INSTRUMENT_PRESETS = Object.freeze({
  'glass-pad': {
    partials: [
      { type: 'sawtooth', gain: 0.52, detune: -8 },
      { type: 'sawtooth', gain: 0.52, detune: 8 },
      { type: 'triangle', gain: 0.24, detune: 0 },
      { type: 'sine', gain: 0.08, harmonic: 2 },
    ],
    gain: 0.038,
    attack: 0.72,
    release: 1.5,
    filter: 1900,
    q: 0.7,
    reverb: 0.72,
    delay: 0.12,
  },
  'mist-choir': {
    partials: [
      { type: 'sine', gain: 0.58, detune: -6 },
      { type: 'triangle', gain: 0.32, detune: 5 },
      { type: 'sine', gain: 0.12, harmonic: 2 },
    ],
    gain: 0.034,
    attack: 0.86,
    release: 1.8,
    filter: 1500,
    q: 0.9,
    reverb: 0.82,
    delay: 0.1,
  },
  'tense-pad': {
    partials: [
      { type: 'sawtooth', gain: 0.5, detune: -4 },
      { type: 'sawtooth', gain: 0.5, detune: 4 },
      { type: 'triangle', gain: 0.18 },
    ],
    gain: 0.03,
    attack: 0.2,
    release: 0.8,
    filter: 1350,
    q: 1.4,
    reverb: 0.42,
    delay: 0.06,
  },
  'clock-pad': {
    partials: [
      { type: 'triangle', gain: 0.52, detune: -4 },
      { type: 'triangle', gain: 0.46, detune: 4 },
      { type: 'sine', gain: 0.12, harmonic: 2 },
    ],
    gain: 0.03,
    attack: 0.38,
    release: 1.04,
    filter: 1650,
    q: 1.1,
    reverb: 0.48,
    delay: 0.12,
  },
  'battle-pad': {
    partials: [
      { type: 'sawtooth', gain: 0.56, detune: -6 },
      { type: 'triangle', gain: 0.26 },
      { type: 'sawtooth', gain: 0.56, detune: 6 },
    ],
    gain: 0.028,
    attack: 0.12,
    release: 0.58,
    filter: 1420,
    q: 1.5,
    reverb: 0.24,
    delay: 0.04,
  },
  'iron-choir': {
    partials: [
      { type: 'triangle', gain: 0.48, detune: -5 },
      { type: 'triangle', gain: 0.48, detune: 5 },
      { type: 'sine', gain: 0.14, harmonic: 2 },
      { type: 'sawtooth', gain: 0.1, harmonic: 0.5 },
    ],
    gain: 0.034,
    attack: 0.42,
    release: 1.32,
    filter: 1180,
    q: 1.25,
    reverb: 0.52,
    delay: 0.08,
  },
  'star-lead': {
    partials: [
      { type: 'triangle', gain: 0.58 },
      { type: 'sine', gain: 0.24, harmonic: 2 },
      { type: 'sine', gain: 0.12, harmonic: 3 },
    ],
    gain: 0.03,
    attack: 0.04,
    release: 0.5,
    filter: 3000,
    q: 0.4,
    reverb: 0.38,
    delay: 0.24,
  },
  'whisper-lead': {
    partials: [
      { type: 'sine', gain: 0.66 },
      { type: 'triangle', gain: 0.18, harmonic: 2 },
    ],
    gain: 0.025,
    attack: 0.08,
    release: 0.92,
    filter: 2200,
    q: 0.6,
    reverb: 0.62,
    delay: 0.18,
  },
  'salt-pluck': {
    partials: [
      { type: 'triangle', gain: 0.56 },
      { type: 'square', gain: 0.16 },
      { type: 'sine', gain: 0.1, harmonic: 2 },
    ],
    gain: 0.024,
    attack: 0.01,
    release: 0.22,
    filter: 2350,
    q: 1.1,
    reverb: 0.28,
    delay: 0.12,
  },
  'alarm-bell': {
    partials: [
      { type: 'sine', gain: 0.78 },
      { type: 'sine', gain: 0.22, harmonic: 2.01 },
      { type: 'sine', gain: 0.12, harmonic: 3.99 },
    ],
    gain: 0.026,
    attack: 0.01,
    release: 0.6,
    filter: 3600,
    q: 0.2,
    reverb: 0.3,
    delay: 0.18,
  },
  'inversion-pluck': {
    partials: [
      { type: 'triangle', gain: 0.54 },
      { type: 'sine', gain: 0.18, harmonic: 2 },
      { type: 'square', gain: 0.1 },
    ],
    gain: 0.022,
    attack: 0.01,
    release: 0.24,
    filter: 2500,
    q: 0.95,
    reverb: 0.2,
    delay: 0.16,
  },
  'ember-horn': {
    partials: [
      { type: 'sawtooth', gain: 0.42, detune: -5 },
      { type: 'triangle', gain: 0.26 },
      { type: 'sawtooth', gain: 0.42, detune: 5 },
    ],
    gain: 0.028,
    attack: 0.02,
    release: 0.38,
    filter: 1800,
    q: 0.9,
    reverb: 0.18,
    delay: 0.08,
  },
  'memory-piano': {
    partials: [
      { type: 'triangle', gain: 0.62 },
      { type: 'sine', gain: 0.18, harmonic: 2 },
      { type: 'sine', gain: 0.08, harmonic: 3 },
    ],
    gain: 0.024,
    attack: 0.01,
    release: 0.56,
    filter: 2850,
    q: 0.45,
    reverb: 0.46,
    delay: 0.14,
  },
  'abyss-bell': {
    partials: [
      { type: 'sine', gain: 0.72 },
      { type: 'sine', gain: 0.18, harmonic: 2.02 },
      { type: 'triangle', gain: 0.08, harmonic: 0.5 },
    ],
    gain: 0.028,
    attack: 0.02,
    release: 1.08,
    filter: 2400,
    q: 0.35,
    reverb: 0.7,
    delay: 0.08,
  },
  'hollow-bell': {
    partials: [
      { type: 'sine', gain: 0.74 },
      { type: 'sine', gain: 0.18, harmonic: 1.5 },
      { type: 'sine', gain: 0.08, harmonic: 2.7 },
    ],
    gain: 0.018,
    attack: 0.01,
    release: 0.82,
    filter: 2600,
    q: 0.3,
    reverb: 0.56,
    delay: 0.18,
  },
  'cello-bass': {
    partials: [
      { type: 'triangle', gain: 0.68 },
      { type: 'sine', gain: 0.22, harmonic: 0.5 },
      { type: 'triangle', gain: 0.1, harmonic: 2 },
    ],
    gain: 0.038,
    attack: 0.012,
    release: 0.26,
    filter: 420,
    q: 0.6,
    reverb: 0.1,
    delay: 0,
  },
  'sub-bass': {
    partials: [
      { type: 'sine', gain: 0.84 },
      { type: 'triangle', gain: 0.12, harmonic: 0.5 },
    ],
    gain: 0.04,
    attack: 0.02,
    release: 0.34,
    filter: 260,
    q: 0.7,
    reverb: 0.02,
    delay: 0,
  },
  'dust-bass': {
    partials: [
      { type: 'triangle', gain: 0.64 },
      { type: 'square', gain: 0.1 },
      { type: 'sine', gain: 0.18, harmonic: 0.5 },
    ],
    gain: 0.032,
    attack: 0.01,
    release: 0.22,
    filter: 540,
    q: 0.7,
    reverb: 0.06,
    delay: 0,
  },
  'pulse-bass': {
    partials: [
      { type: 'sawtooth', gain: 0.34, detune: -2 },
      { type: 'triangle', gain: 0.28 },
      { type: 'sawtooth', gain: 0.34, detune: 2 },
    ],
    gain: 0.036,
    attack: 0.006,
    release: 0.16,
    filter: 620,
    q: 0.9,
    reverb: 0.02,
    delay: 0,
  },
  'soft-bass': {
    partials: [
      { type: 'sine', gain: 0.76 },
      { type: 'triangle', gain: 0.16 },
    ],
    gain: 0.034,
    attack: 0.01,
    release: 0.3,
    filter: 340,
    q: 0.55,
    reverb: 0.04,
    delay: 0,
  },
  'abyss-bass': {
    partials: [
      { type: 'triangle', gain: 0.58 },
      { type: 'sawtooth', gain: 0.16, harmonic: 0.5 },
      { type: 'sine', gain: 0.16, harmonic: 2 },
    ],
    gain: 0.042,
    attack: 0.01,
    release: 0.22,
    filter: 360,
    q: 1.1,
    reverb: 0.04,
    delay: 0,
  },
});

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function midiToFrequency(midi) {
  return 440 * 2 ** ((midi - 69) / 12);
}

function getModeIntervals(mode) {
  return MODE_INTERVALS[mode] ?? MODE_INTERVALS.ionian;
}

function resolveScaleMidi(track, scaleIndex, registerOffset = 0) {
  const intervals = getModeIntervals(track.mode);
  const normalizedIndex = ((scaleIndex % intervals.length) + intervals.length) % intervals.length;
  const octaveOffset = Math.floor(scaleIndex / intervals.length) * 12;
  return track.tonicMidi + intervals[normalizedIndex] + octaveOffset + registerOffset;
}

function buildChord(track, degree) {
  return Object.freeze({
    root: resolveScaleMidi(track, degree, -12),
    third: resolveScaleMidi(track, degree + 2),
    fifth: resolveScaleMidi(track, degree + 4),
    seventh: resolveScaleMidi(track, degree + 6),
    ninth: resolveScaleMidi(track, degree + 8),
    highRoot: resolveScaleMidi(track, degree + 7),
  });
}

function createImpulseResponse(context, seconds = 2.8, decay = 2.6) {
  const frameCount = Math.max(1, Math.floor(context.sampleRate * seconds));
  const impulse = context.createBuffer(2, frameCount, context.sampleRate);

  for (let channel = 0; channel < impulse.numberOfChannels; channel += 1) {
    const channelData = impulse.getChannelData(channel);

    for (let index = 0; index < frameCount; index += 1) {
      const t = index / frameCount;
      const envelope = (1 - t) ** decay;
      channelData[index] = (Math.random() * 2 - 1) * envelope;
    }
  }

  return impulse;
}

function createNoiseBuffer(context, { color = 'white', seconds = 1 } = {}) {
  const frameCount = Math.max(1, Math.floor(context.sampleRate * seconds));
  const buffer = context.createBuffer(1, frameCount, context.sampleRate);
  const channelData = buffer.getChannelData(0);
  let lastValue = 0;

  for (let index = 0; index < frameCount; index += 1) {
    const white = Math.random() * 2 - 1;

    if (color === 'brown') {
      lastValue = (lastValue + 0.02 * white) / 1.02;
      channelData[index] = lastValue * 3.5;
      continue;
    }

    if (color === 'pink') {
      lastValue = 0.985 * lastValue + 0.15 * white;
      channelData[index] = lastValue;
      continue;
    }

    channelData[index] = white;
  }

  return buffer;
}

function createContextBuses(context, track) {
  const dryBus = context.createGain();
  const reverbSend = context.createGain();
  const delaySend = context.createGain();
  const masterTone = context.createBiquadFilter();
  const masterGain = context.createGain();
  const compressor = context.createDynamicsCompressor();
  const reverb = context.createConvolver();
  const reverbGain = context.createGain();
  const delay = context.createDelay(1.4);
  const delayFeedback = context.createGain();
  const delayFilter = context.createBiquadFilter();
  const delayGain = context.createGain();

  masterTone.type = 'lowpass';
  masterTone.frequency.value = 1900 + (track.mix?.brightness ?? 0.84) * 4200;
  masterTone.Q.value = 0.2;

  masterGain.gain.value = 0.76;

  compressor.threshold.value = -19;
  compressor.knee.value = 14;
  compressor.ratio.value = 5;
  compressor.attack.value = 0.002;
  compressor.release.value = 0.18;

  reverb.buffer = createImpulseResponse(context, 2.6 + (track.mix?.reverb ?? 0.3) * 1.6, 2.6);
  reverbGain.gain.value = 0.56;

  delay.delayTime.value = (60 / track.tempo) * (track.meter === 6 ? 0.75 : 0.5);
  delayFeedback.gain.value = 0.28;
  delayFilter.type = 'lowpass';
  delayFilter.frequency.value = 2200;
  delayGain.gain.value = 0.5;

  dryBus.connect(masterTone);
  reverbSend.connect(reverb);
  reverb.connect(reverbGain);
  reverbGain.connect(masterTone);
  delaySend.connect(delay);
  delay.connect(delayFilter);
  delayFilter.connect(delayFeedback);
  delayFeedback.connect(delay);
  delayFilter.connect(delayGain);
  delayGain.connect(masterTone);

  masterTone.connect(masterGain);
  masterGain.connect(compressor);
  compressor.connect(context.destination);

  return Object.freeze({
    dryBus,
    reverbSend,
    delaySend,
  });
}

function createPanner(context, pan = 0) {
  if (typeof context.createStereoPanner === 'function') {
    const panner = context.createStereoPanner();
    panner.pan.value = clamp(pan, -1, 1);
    return panner;
  }

  const gain = context.createGain();
  return gain;
}

function scheduleSynthNote(
  context,
  buses,
  instrumentName,
  midi,
  startTime,
  durationSeconds,
  velocity = 0.8,
  options = {}
) {
  const preset = INSTRUMENT_PRESETS[instrumentName];

  if (!preset || durationSeconds <= 0) {
    return;
  }

  const filter = context.createBiquadFilter();
  const envelope = context.createGain();
  const panner = createPanner(context, options.pan ?? 0);
  const amplitude = preset.gain * velocity * (options.velocityScale ?? 1);
  const attack = Math.max(0.005, options.attack ?? preset.attack);
  const release = Math.max(0.04, options.release ?? preset.release);
  const noteEnd = startTime + durationSeconds;
  const stopTime = noteEnd + release + 0.04;
  const filterFrequency = Math.max(
    180,
    (options.filterFrequency ?? preset.filter) * (options.brightness ?? 1)
  );

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(filterFrequency * 0.72, startTime);
  filter.frequency.linearRampToValueAtTime(filterFrequency, startTime + attack * 1.4);
  filter.Q.value = preset.q;

  envelope.gain.setValueAtTime(0.0001, startTime);
  envelope.gain.linearRampToValueAtTime(amplitude, startTime + attack);
  envelope.gain.linearRampToValueAtTime(amplitude * 0.72, noteEnd);
  envelope.gain.linearRampToValueAtTime(0.0001, noteEnd + release);

  filter.connect(envelope);
  envelope.connect(panner);
  panner.connect(buses.dryBus);

  if (preset.reverb > 0) {
    const reverbGain = context.createGain();
    reverbGain.gain.value = preset.reverb * (options.reverbScale ?? 1);
    panner.connect(reverbGain);
    reverbGain.connect(buses.reverbSend);
  }

  if (preset.delay > 0) {
    const delayGain = context.createGain();
    delayGain.gain.value = preset.delay * (options.delayScale ?? 1);
    panner.connect(delayGain);
    delayGain.connect(buses.delaySend);
  }

  preset.partials.forEach((partial) => {
    const oscillator = context.createOscillator();
    const partialGain = context.createGain();
    const frequency = midiToFrequency(midi) * (partial.harmonic ?? 1);

    oscillator.type = partial.type;
    oscillator.frequency.setValueAtTime(frequency, startTime);
    oscillator.detune.setValueAtTime((partial.detune ?? 0) + (options.detune ?? 0), startTime);

    partialGain.gain.value = partial.gain;

    oscillator.connect(partialGain);
    partialGain.connect(filter);
    oscillator.start(startTime);
    oscillator.stop(stopTime);
  });
}

function scheduleNoiseLayer(context, buses, noiseBuffer, startTime, durationSeconds, options = {}) {
  if (durationSeconds <= 0) {
    return;
  }

  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const envelope = context.createGain();
  const panner = createPanner(context, options.pan ?? 0);
  const attack = Math.max(0.003, options.attack ?? 0.02);
  const release = Math.max(0.04, options.release ?? 0.12);
  const gainValue = options.gain ?? 0.02;
  const stopTime = startTime + durationSeconds + release + 0.02;

  source.buffer = noiseBuffer;
  source.loop = durationSeconds > noiseBuffer.duration;
  source.playbackRate.value = options.playbackRate ?? 1;

  filter.type = options.filterType ?? 'highpass';
  filter.frequency.value = options.filterFrequency ?? 1800;
  filter.Q.value = options.q ?? 0.4;

  envelope.gain.setValueAtTime(0.0001, startTime);
  envelope.gain.linearRampToValueAtTime(gainValue, startTime + attack);
  envelope.gain.linearRampToValueAtTime(gainValue * 0.6, startTime + durationSeconds);
  envelope.gain.linearRampToValueAtTime(0.0001, startTime + durationSeconds + release);

  source.connect(filter);
  filter.connect(envelope);
  envelope.connect(panner);
  panner.connect(buses.dryBus);

  const reverbGain = context.createGain();
  reverbGain.gain.value = options.reverb ?? 0.08;
  panner.connect(reverbGain);
  reverbGain.connect(buses.reverbSend);

  source.start(startTime);
  source.stop(stopTime);
}

function scheduleKick(context, buses, startTime, amplitude = 0.26) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const filter = context.createBiquadFilter();
  const stopTime = startTime + 0.5;

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(142, startTime);
  oscillator.frequency.exponentialRampToValueAtTime(46, startTime + 0.14);

  filter.type = 'lowpass';
  filter.frequency.value = 760;

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(amplitude, startTime + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.28);

  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(buses.dryBus);
  oscillator.start(startTime);
  oscillator.stop(stopTime);
}

function scheduleSnare(context, buses, noiseBuffer, startTime, amplitude = 0.12) {
  scheduleNoiseLayer(context, buses, noiseBuffer, startTime, 0.14, {
    filterType: 'bandpass',
    filterFrequency: 2100,
    q: 0.8,
    gain: amplitude,
    attack: 0.004,
    release: 0.08,
    reverb: 0.04,
  });

  scheduleSynthNote(context, buses, 'pulse-bass', 38, startTime, 0.09, 0.28, {
    filterFrequency: 940,
    reverbScale: 0.06,
    delayScale: 0,
  });
}

function scheduleHat(context, buses, noiseBuffer, startTime, amplitude = 0.05) {
  scheduleNoiseLayer(context, buses, noiseBuffer, startTime, 0.05, {
    filterType: 'highpass',
    filterFrequency: 5200,
    q: 0.3,
    gain: amplitude,
    attack: 0.002,
    release: 0.03,
    reverb: 0.02,
  });
}

function scheduleTick(context, buses, noiseBuffer, startTime, amplitude = 0.03) {
  scheduleNoiseLayer(context, buses, noiseBuffer, startTime, 0.04, {
    filterType: 'bandpass',
    filterFrequency: 2800,
    q: 2.2,
    gain: amplitude,
    attack: 0.002,
    release: 0.04,
    reverb: 0.01,
  });
}

function scheduleTom(context, buses, startTime, amplitude = 0.11) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const stopTime = startTime + 0.38;

  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(110, startTime);
  oscillator.frequency.exponentialRampToValueAtTime(72, startTime + 0.18);

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(amplitude, startTime + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.24);

  oscillator.connect(gain);
  gain.connect(buses.dryBus);
  oscillator.start(startTime);
  oscillator.stop(stopTime);
}

function schedulePadMeasure(context, buses, track, chordDegree, startTime, measureSeconds) {
  const chord = buildChord(track, chordDegree);
  const notes = [
    { midi: chord.root, velocity: 0.42, pan: -0.26 },
    { midi: chord.third, velocity: 0.34, pan: -0.08 },
    { midi: chord.fifth, velocity: 0.32, pan: 0.12 },
    { midi: chord.seventh, velocity: 0.2, pan: 0.26 },
    { midi: chord.highRoot, velocity: 0.16, pan: 0.42 },
  ];

  notes.forEach((voice) => {
    scheduleSynthNote(
      context,
      buses,
      track.padInstrument,
      voice.midi,
      startTime,
      measureSeconds * 0.94,
      voice.velocity,
      {
        pan: voice.pan * (track.mix?.width ?? 0.5),
      }
    );
  });
}

function scheduleMelodyMeasure(
  context,
  buses,
  track,
  instrumentName,
  events,
  startTime,
  secondsPerBeat,
  panOffset = 0
) {
  events.forEach((event) => {
    const midi = resolveScaleMidi(track, event.degree, event.octave * 12);

    scheduleSynthNote(
      context,
      buses,
      instrumentName,
      midi,
      startTime + event.beat * secondsPerBeat,
      event.duration * secondsPerBeat,
      event.velocity,
      {
        pan: clamp((event.pan ?? 0) + panOffset, -0.9, 0.9),
      }
    );
  });
}

function scheduleBassPattern(
  context,
  buses,
  track,
  chordDegree,
  startTime,
  secondsPerBeat,
  measureIndex
) {
  const chord = buildChord(track, chordDegree);
  const style = track.bassStyle;

  const play = (midi, beat, duration, velocity = 0.8) => {
    scheduleSynthNote(
      context,
      buses,
      track.bassInstrument,
      midi,
      startTime + beat * secondsPerBeat,
      duration * secondsPerBeat,
      velocity,
      {
        pan: -0.02,
      }
    );
  };

  switch (style) {
    case 'pedal-cinematic':
      play(chord.root, 0, 2, 0.82);
      play(chord.fifth - 12, 2.25, 0.75, 0.62);
      play(chord.root, 3, 0.75, 0.74);
      return;
    case 'drone-tide':
      play(chord.root, 0, 3.5, 0.72);
      if (measureIndex % 2 === 1) {
        play(chord.fifth - 12, 3, 0.75, 0.46);
      }
      return;
    case 'restless-roots':
      play(chord.root, 0, 1.25, 0.78);
      play(chord.fifth - 12, 1.75, 0.75, 0.58);
      play(chord.root, 3, 0.75, 0.76);
      return;
    case 'pumping-octaves':
      [0, 1, 2, 3].forEach((beat, index) => {
        play(index % 2 === 0 ? chord.root : chord.root + 12, beat, 0.5, 0.76);
      });
      return;
    case 'measured-steps':
      play(chord.root, 0, 1, 0.74);
      play(chord.fifth - 12, 1.5, 0.75, 0.56);
      play(chord.root, 3, 0.5, 0.66);
      return;
    case 'battle-drive':
      [0, 1, 2, 3].forEach((beat, index) => {
        play(index === 2 ? chord.fifth - 12 : chord.root, beat, 0.5, 0.78);
      });
      play(chord.root + 12, 3.5, 0.25, 0.54);
      return;
    case 'slow-6':
      play(chord.root, 0, 2, 0.76);
      play(chord.fifth - 12, 3, 1.5, 0.58);
      return;
    case 'boss-march':
      [0, 1, 2, 3].forEach((beat, index) => {
        const midi = index % 2 === 0 ? chord.root : chord.fifth - 12;
        play(midi, beat, 0.75, 0.82);
      });
      return;
    case 'abyss-pedal':
      play(chord.root, 0, 4, 0.7);
      play(chord.root + 12, 2.5, 0.5, 0.36);
      return;
    default:
      play(chord.root, 0, track.meter, 0.68);
  }
}

function schedulePulsePattern(context, buses, track, chordDegree, startTime, secondsPerBeat) {
  const chord = buildChord(track, chordDegree);
  const style = track.pulseStyle;
  const lead = track.leadInstrument;

  const play = (midi, beat, duration, velocity, pan = 0) => {
    scheduleSynthNote(
      context,
      buses,
      lead,
      midi,
      startTime + beat * secondsPerBeat,
      duration * secondsPerBeat,
      velocity,
      {
        pan,
        velocityScale: 0.9,
      }
    );
  };

  switch (style) {
    case 'shimmer-8ths': {
      const pattern = [
        chord.third,
        chord.fifth,
        chord.seventh,
        chord.fifth,
        chord.highRoot,
        chord.fifth,
        chord.seventh,
        chord.third,
      ];
      pattern.forEach((midi, index) =>
        play(
          midi,
          index * 0.5,
          0.28,
          0.26,
          (index % 2 === 0 ? -0.2 : 0.2) * (track.mix?.width ?? 0.5)
        )
      );
      return;
    }
    case 'salt-ostinato': {
      const pattern = [
        chord.root + 12,
        chord.third,
        chord.fifth,
        chord.third,
        chord.ninth,
        chord.fifth,
        chord.third,
        chord.fifth,
      ];
      pattern.forEach((midi, index) =>
        play(midi, index * 0.5, 0.2, 0.2, index % 2 === 0 ? -0.12 : 0.14)
      );
      return;
    }
    case 'fracture-16ths': {
      const pattern = [
        chord.root + 12,
        chord.third,
        chord.fifth,
        chord.third,
        chord.seventh,
        chord.fifth,
        chord.third,
        chord.fifth,
      ];
      pattern.forEach((midi, index) => {
        const beat = index * 0.5;
        play(midi, beat, 0.16, 0.18, index % 2 === 0 ? -0.08 : 0.08);
        play(midi, beat + 0.25, 0.12, 0.12, index % 2 === 0 ? 0.08 : -0.08);
      });
      return;
    }
    case 'inversion-arp': {
      const pattern = [
        chord.third,
        chord.seventh,
        chord.fifth,
        chord.highRoot,
        chord.third,
        chord.fifth,
        chord.seventh,
        chord.highRoot,
      ];
      pattern.forEach((midi, index) =>
        play(midi, index * 0.5, 0.2, 0.18, index % 2 === 0 ? -0.18 : 0.18)
      );
      return;
    }
    case 'war-stabs': {
      [0, 1.5, 2.5, 3.25].forEach((beat, index) => {
        const midi = [chord.root + 12, chord.fifth, chord.seventh, chord.fifth][index];
        play(midi, beat, 0.22, 0.26, index % 2 === 0 ? -0.1 : 0.1);
      });
      return;
    }
    case 'memory-ripple': {
      const beats = [0, 1.5, 3, 4.5];
      const notes = [chord.third, chord.fifth, chord.seventh, chord.highRoot];
      beats.forEach((beat, index) =>
        play(notes[index], beat, 0.42, 0.18, index % 2 === 0 ? -0.18 : 0.18)
      );
      return;
    }
    case 'choir-stabs': {
      [0, 1, 2.5, 3.25].forEach((beat, index) => {
        const midi = [chord.root + 12, chord.third, chord.fifth, chord.seventh][index];
        scheduleSynthNote(
          context,
          buses,
          track.padInstrument,
          midi,
          startTime + beat * secondsPerBeat,
          0.32 * secondsPerBeat,
          0.22,
          {
            pan: index % 2 === 0 ? -0.12 : 0.12,
            attack: 0.02,
            release: 0.24,
          }
        );
      });
      return;
    }
    case 'abyss-ripples': {
      [0.5, 2, 3.5].forEach((beat, index) => {
        const midi = [chord.third, chord.fifth, chord.seventh][index];
        play(midi, beat, 0.5, 0.16, index % 2 === 0 ? -0.14 : 0.14);
      });
      return;
    }
    case 'credits-ripple': {
      const beats = [0, 1.5, 3, 4.5];
      const notes = [chord.third, chord.fifth, chord.highRoot, chord.fifth];
      beats.forEach((beat, index) =>
        play(notes[index], beat, 0.4, 0.2, index % 2 === 0 ? -0.2 : 0.2)
      );
      return;
    }
    default:
  }
}

function schedulePercussion(
  context,
  buses,
  track,
  startTime,
  secondsPerBeat,
  measureIndex,
  noiseBuffers
) {
  const style = track.percussionStyle;
  const whiteNoise = noiseBuffers.white;
  const pinkNoise = noiseBuffers.pink;

  switch (style) {
    case 'none':
      return;
    case 'soft-heartbeat':
      scheduleKick(context, buses, startTime, 0.18);
      scheduleTom(context, buses, startTime + 2.5 * secondsPerBeat, 0.05);
      return;
    case 'brush-travel':
      scheduleKick(context, buses, startTime, 0.18);
      scheduleSnare(context, buses, pinkNoise, startTime + 2 * secondsPerBeat, 0.07);
      [0.5, 1.5, 2.5, 3.5].forEach((beat) =>
        scheduleHat(context, buses, whiteNoise, startTime + beat * secondsPerBeat, 0.02)
      );
      return;
    case 'chase-kit':
      [0, 1.5, 2.5].forEach((beat) =>
        scheduleKick(context, buses, startTime + beat * secondsPerBeat, 0.2)
      );
      [2, 3.5].forEach((beat) =>
        scheduleSnare(context, buses, whiteNoise, startTime + beat * secondsPerBeat, 0.09)
      );
      Array.from({ length: 8 }, (_, index) => index * 0.5).forEach((beat) =>
        scheduleHat(context, buses, whiteNoise, startTime + beat * secondsPerBeat, 0.024)
      );
      return;
    case 'tick-kit':
      [0, 2].forEach((beat) =>
        scheduleKick(context, buses, startTime + beat * secondsPerBeat, 0.12)
      );
      Array.from({ length: 8 }, (_, index) => index * 0.5).forEach((beat) =>
        scheduleTick(context, buses, whiteNoise, startTime + beat * secondsPerBeat, 0.02)
      );
      return;
    case 'battle-kit':
      [0, 1.5, 2.5].forEach((beat) =>
        scheduleKick(context, buses, startTime + beat * secondsPerBeat, 0.24)
      );
      [2].forEach((beat) =>
        scheduleSnare(context, buses, whiteNoise, startTime + beat * secondsPerBeat, 0.1)
      );
      Array.from({ length: 8 }, (_, index) => index * 0.5).forEach((beat) =>
        scheduleHat(context, buses, whiteNoise, startTime + beat * secondsPerBeat, 0.03)
      );
      if (measureIndex % 4 === 3) {
        scheduleTom(context, buses, startTime + 3.5 * secondsPerBeat, 0.1);
      }
      return;
    case 'felt-ticks':
      [0, 3].forEach((beat) =>
        scheduleTick(context, buses, pinkNoise, startTime + beat * secondsPerBeat, 0.018)
      );
      return;
    case 'boss-kit':
      [0, 1.5, 3].forEach((beat) =>
        scheduleKick(context, buses, startTime + beat * secondsPerBeat, 0.28)
      );
      [2].forEach((beat) =>
        scheduleSnare(context, buses, whiteNoise, startTime + beat * secondsPerBeat, 0.11)
      );
      Array.from({ length: 8 }, (_, index) => index * 0.5).forEach((beat) =>
        scheduleHat(context, buses, whiteNoise, startTime + beat * secondsPerBeat, 0.026)
      );
      if (measureIndex % 2 === 1) {
        scheduleTom(context, buses, startTime + 3.5 * secondsPerBeat, 0.12);
      }
      return;
    case 'deep-pulses':
      [0, 2.5].forEach((beat) =>
        scheduleKick(context, buses, startTime + beat * secondsPerBeat, 0.14)
      );
      [1.5, 3.5].forEach((beat) =>
        scheduleTick(context, buses, pinkNoise, startTime + beat * secondsPerBeat, 0.016)
      );
      return;
    default:
  }
}

function scheduleTexture(
  context,
  buses,
  track,
  startTime,
  measureSeconds,
  measureIndex,
  noiseBuffers
) {
  const style = track.textureStyle;
  const secondsPerBeat = measureSeconds / track.meter;

  switch (style) {
    case 'sea-wind':
      if (measureIndex % 4 === 0) {
        scheduleNoiseLayer(context, buses, noiseBuffers.pink, startTime, measureSeconds * 0.9, {
          filterType: 'bandpass',
          filterFrequency: 940,
          q: 0.45,
          gain: 0.015,
          attack: 0.14,
          release: 0.6,
          reverb: 0.18,
          pan: -0.18,
        });
      }
      return;
    case 'clock-dust':
      [0.75, 2.75].forEach((beat) =>
        scheduleTick(context, buses, noiseBuffers.pink, startTime + beat * secondsPerBeat, 0.012)
      );
      if (measureIndex % 2 === 0) {
        scheduleNoiseLayer(
          context,
          buses,
          noiseBuffers.white,
          startTime + 1.25 * secondsPerBeat,
          0.35,
          {
            filterType: 'bandpass',
            filterFrequency: 1600,
            q: 1.8,
            gain: 0.01,
            reverb: 0.06,
          }
        );
      }
      return;
    case 'salt-wind':
      scheduleNoiseLayer(
        context,
        buses,
        noiseBuffers.white,
        startTime + 0.1,
        measureSeconds * 0.8,
        {
          filterType: 'highpass',
          filterFrequency: 1900,
          q: 0.4,
          gain: 0.01,
          attack: 0.08,
          release: 0.28,
          reverb: 0.08,
          pan: measureIndex % 2 === 0 ? -0.2 : 0.2,
        }
      );
      return;
    case 'crackle':
      [0.25, 1.75, 3.25].forEach((beat) =>
        scheduleNoiseLayer(
          context,
          buses,
          noiseBuffers.white,
          startTime + beat * secondsPerBeat,
          0.08,
          {
            filterType: 'bandpass',
            filterFrequency: 2600,
            q: 2.6,
            gain: 0.014,
            reverb: 0.02,
          }
        )
      );
      return;
    case 'gravity-whispers':
      if (measureIndex % 2 === 0) {
        scheduleSynthNote(
          context,
          buses,
          'hollow-bell',
          resolveScaleMidi(track, 14),
          startTime + 2 * secondsPerBeat,
          0.4,
          0.22,
          {
            pan: measureIndex % 4 === 0 ? -0.22 : 0.22,
          }
        );
      }
      return;
    case 'rift-sparks':
      [0.75, 2.25, 3.75].forEach((beat) =>
        scheduleNoiseLayer(
          context,
          buses,
          noiseBuffers.white,
          startTime + beat * secondsPerBeat,
          0.06,
          {
            filterType: 'highpass',
            filterFrequency: 4200,
            q: 0.4,
            gain: 0.012,
            reverb: 0.02,
          }
        )
      );
      return;
    case 'glow':
      if (measureIndex % 2 === 0) {
        scheduleNoiseLayer(context, buses, noiseBuffers.pink, startTime, measureSeconds, {
          filterType: 'bandpass',
          filterFrequency: 1200,
          q: 0.35,
          gain: 0.014,
          attack: 0.2,
          release: 0.4,
          reverb: 0.16,
          pan: -0.12,
        });
      }
      return;
    case 'abyss-rumble':
      scheduleSynthNote(
        context,
        buses,
        'sub-bass',
        resolveScaleMidi(track, -7),
        startTime,
        measureSeconds * 0.8,
        0.2,
        {
          filterFrequency: 180,
          reverbScale: 0.02,
        }
      );
      return;
    case 'deep-water':
      scheduleNoiseLayer(context, buses, noiseBuffers.brown, startTime, measureSeconds, {
        filterType: 'lowpass',
        filterFrequency: 420,
        q: 0.2,
        gain: 0.012,
        attack: 0.1,
        release: 0.4,
        reverb: 0.12,
      });
      return;
    default:
  }
}

async function renderTrackBuffer(track) {
  const OfflineAudioContextConstructor =
    window.OfflineAudioContext || window.webkitOfflineAudioContext;
  const secondsPerBeat = 60 / track.tempo;
  const measureSeconds = track.meter * secondsPerBeat;
  const loopDuration = track.loopMeasures * measureSeconds;
  const tailDuration = 2.8;
  const frameCount = Math.ceil((loopDuration + tailDuration) * DEFAULT_SAMPLE_RATE);
  const context = new OfflineAudioContextConstructor(2, frameCount, DEFAULT_SAMPLE_RATE);
  const buses = createContextBuses(context, track);
  const noiseBuffers = Object.freeze({
    white: createNoiseBuffer(context, { color: 'white', seconds: 1 }),
    pink: createNoiseBuffer(context, { color: 'pink', seconds: 1.4 }),
    brown: createNoiseBuffer(context, { color: 'brown', seconds: 1.8 }),
  });

  for (let measureIndex = 0; measureIndex < track.loopMeasures; measureIndex += 1) {
    const startTime = measureIndex * measureSeconds;
    const chordDegree = track.progression[measureIndex % track.progression.length];
    const melodyEvents = track.melodyMeasures[measureIndex] ?? [];
    const counterEvents = track.counterMeasures[measureIndex] ?? [];

    schedulePadMeasure(context, buses, track, chordDegree, startTime, measureSeconds);
    scheduleBassPattern(
      context,
      buses,
      track,
      chordDegree,
      startTime,
      secondsPerBeat,
      measureIndex
    );
    schedulePulsePattern(context, buses, track, chordDegree, startTime, secondsPerBeat);
    scheduleTexture(context, buses, track, startTime, measureSeconds, measureIndex, noiseBuffers);
    schedulePercussion(
      context,
      buses,
      track,
      startTime,
      secondsPerBeat,
      measureIndex,
      noiseBuffers
    );
    scheduleMelodyMeasure(
      context,
      buses,
      track,
      track.leadInstrument,
      melodyEvents,
      startTime,
      secondsPerBeat,
      0.04
    );
    scheduleMelodyMeasure(
      context,
      buses,
      track,
      track.counterInstrument,
      counterEvents,
      startTime,
      secondsPerBeat,
      -0.06
    );
  }

  const buffer = await context.startRendering();

  return Object.freeze({
    buffer,
    loopDuration,
  });
}

export class BGMManager {
  constructor({ initialTrackId = DEFAULT_TRACK_ID, initialVolume = 0.6, onStateChange } = {}) {
    this.onStateChange = typeof onStateChange === 'function' ? onStateChange : null;
    this.audioContext = null;
    this.masterGain = null;
    this.compressor = null;
    this.currentSource = null;
    this.currentSourceGain = null;
    this.currentTrackId = TRACK_LOOKUP.has(initialTrackId) ? initialTrackId : DEFAULT_TRACK_ID;
    this.pendingTrackId = '';
    this.hasStarted = false;
    this.isPlaying = false;
    this.volume = clamp(initialVolume, 0, 1);
    this.renderCache = new Map();
    this.operationToken = 0;
    this.status = 'idle';
    this.errorMessage = '';
    this.supported = Boolean(
      (window.AudioContext || window.webkitAudioContext) &&
      (window.OfflineAudioContext || window.webkitOfflineAudioContext)
    );
  }

  getSnapshot() {
    const currentTrack = TRACK_LOOKUP.get(this.currentTrackId) ?? null;
    const pendingTrack = TRACK_LOOKUP.get(this.pendingTrackId) ?? null;

    return {
      supported: this.supported,
      status: this.status,
      isPlaying: this.isPlaying,
      hasStarted: this.hasStarted,
      volume: this.volume,
      currentTrackId: currentTrack?.id ?? '',
      currentTrackTitle: currentTrack?.title ?? '대기 중',
      pendingTrackId: pendingTrack?.id ?? '',
      pendingTrackTitle: pendingTrack?.title ?? '',
      trackCount: BGM_TRACK_LIBRARY.length,
      errorMessage: this.errorMessage,
    };
  }

  notifyState() {
    this.onStateChange?.(this.getSnapshot());
  }

  ensureAudioGraph() {
    if (!this.supported || this.audioContext) {
      return;
    }

    const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContextConstructor();
    this.masterGain = this.audioContext.createGain();
    this.compressor = this.audioContext.createDynamicsCompressor();

    this.masterGain.gain.value = this.volume;
    this.compressor.threshold.value = -18;
    this.compressor.knee.value = 16;
    this.compressor.ratio.value = 4.5;
    this.compressor.attack.value = 0.003;
    this.compressor.release.value = 0.2;

    this.masterGain.connect(this.compressor);
    this.compressor.connect(this.audioContext.destination);
  }

  async resumeFromGesture() {
    if (!this.supported) {
      return false;
    }

    this.ensureAudioGraph();

    if (!this.audioContext) {
      return false;
    }

    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    this.hasStarted = true;
    return true;
  }

  async getRenderedTrack(trackId) {
    const existingEntry = this.renderCache.get(trackId);

    if (existingEntry) {
      return existingEntry instanceof Promise ? existingEntry : Promise.resolve(existingEntry);
    }

    const track = TRACK_LOOKUP.get(trackId);

    if (!track) {
      throw new Error(`알 수 없는 트랙입니다: ${trackId}`);
    }

    const renderingPromise = renderTrackBuffer(track)
      .then((rendered) => {
        this.renderCache.set(trackId, rendered);
        return rendered;
      })
      .catch((error) => {
        this.renderCache.delete(trackId);
        throw error;
      });

    this.renderCache.set(trackId, renderingPromise);
    return renderingPromise;
  }

  fadeOutCurrentTrack({ clearTrackId = false } = {}) {
    if (!this.audioContext || !this.currentSource || !this.currentSourceGain) {
      if (clearTrackId) {
        this.currentTrackId = '';
      }

      return;
    }

    const source = this.currentSource;
    const gainNode = this.currentSourceGain;
    const now = this.audioContext.currentTime;

    gainNode.gain.cancelScheduledValues(now);
    gainNode.gain.setValueAtTime(gainNode.gain.value, now);
    gainNode.gain.linearRampToValueAtTime(0.0001, now + 0.18);
    source.stop(now + 0.24);
    source.onended = () => {
      try {
        source.disconnect();
        gainNode.disconnect();
      } catch {
        // already detached
      }
    };

    this.currentSource = null;
    this.currentSourceGain = null;

    if (clearTrackId) {
      this.currentTrackId = '';
    }
  }

  startRenderedTrack(trackId, renderedTrack) {
    if (!this.audioContext || !this.masterGain) {
      return;
    }

    this.fadeOutCurrentTrack();

    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();
    const now = this.audioContext.currentTime;

    source.buffer = renderedTrack.buffer;
    source.loop = true;
    source.loopStart = 0;
    source.loopEnd = renderedTrack.loopDuration;

    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.linearRampToValueAtTime(1, now + 0.2);

    source.connect(gainNode);
    gainNode.connect(this.masterGain);
    source.start(now + 0.02);

    this.currentSource = source;
    this.currentSourceGain = gainNode;
    this.currentTrackId = trackId;
    this.pendingTrackId = '';
    this.isPlaying = true;
    this.status = 'playing';
    this.errorMessage = '';
    this.notifyState();
  }

  async playTrack(trackId) {
    if (!this.supported || !TRACK_LOOKUP.has(trackId)) {
      return false;
    }

    const token = ++this.operationToken;

    try {
      this.pendingTrackId = trackId;
      this.status = 'rendering';
      this.errorMessage = '';
      this.notifyState();

      const resumed = await this.resumeFromGesture();

      if (!resumed) {
        return false;
      }

      const renderedTrack = await this.getRenderedTrack(trackId);

      if (token !== this.operationToken) {
        return false;
      }

      this.startRenderedTrack(trackId, renderedTrack);
      return true;
    } catch (error) {
      if (token !== this.operationToken) {
        return false;
      }

      this.pendingTrackId = '';
      this.status = 'error';
      this.errorMessage =
        error instanceof Error ? error.message : '오디오 트랙을 렌더링하지 못했습니다.';
      this.notifyState();
      return false;
    }
  }

  async stop() {
    this.operationToken += 1;
    this.pendingTrackId = '';
    this.fadeOutCurrentTrack({ clearTrackId: true });
    this.isPlaying = false;
    this.status = this.hasStarted ? 'stopped' : 'idle';
    this.errorMessage = '';

    if (this.audioContext && this.audioContext.state === 'running') {
      const suspendPromise = this.audioContext.suspend();

      if (typeof suspendPromise?.catch === 'function') {
        suspendPromise.catch(() => {});
      }
    }

    this.notifyState();
  }

  setVolume(nextVolume) {
    this.volume = clamp(nextVolume, 0, 1);

    if (this.masterGain && this.audioContext) {
      const now = this.audioContext.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(this.volume, now + 0.08);
    }

    this.notifyState();
  }

  destroy() {
    this.fadeOutCurrentTrack({ clearTrackId: true });
    this.isPlaying = false;

    if (this.audioContext) {
      const closePromise = this.audioContext.close();

      if (typeof closePromise?.catch === 'function') {
        closePromise.catch(() => {});
      }

      this.audioContext = null;
      this.masterGain = null;
      this.compressor = null;
    }
  }
}
