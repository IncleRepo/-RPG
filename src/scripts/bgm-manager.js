const MODE_INTERVALS = Object.freeze({
  ionian: [0, 2, 4, 5, 7, 9, 11],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  aeolian: [0, 2, 3, 5, 7, 8, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
});

const MOOD_LIBRARY = Object.freeze({
  town: {
    label: '평온한 마을',
    tonicMidi: 60,
    mode: 'ionian',
    tempoRange: [84, 96],
    leadRegister: 24,
    bassRegister: -24,
    harmonyRegister: 12,
    leadWaveform: 'triangle',
    bassWaveform: 'triangle',
    progressionLibrary: [
      { label: 'I - IV - V - I', degrees: [0, 3, 4, 0] },
      { label: 'I - vi - IV - V', degrees: [0, 5, 3, 4] },
      { label: 'I - iii - IV - V', degrees: [0, 2, 3, 4] },
    ],
  },
  twilight: {
    label: '노을 들판',
    tonicMidi: 62,
    mode: 'lydian',
    tempoRange: [78, 90],
    leadRegister: 24,
    bassRegister: -24,
    harmonyRegister: 12,
    leadWaveform: 'sine',
    bassWaveform: 'triangle',
    progressionLibrary: [
      { label: 'I - II - V - I', degrees: [0, 1, 4, 0] },
      { label: 'I - V - II - I', degrees: [0, 4, 1, 0] },
      { label: 'I - IV - II - V', degrees: [0, 3, 1, 4] },
    ],
  },
  night: {
    label: '어두운 밤',
    tonicMidi: 57,
    mode: 'aeolian',
    tempoRange: [66, 78],
    leadRegister: 24,
    bassRegister: -24,
    harmonyRegister: 12,
    leadWaveform: 'sine',
    bassWaveform: 'sawtooth',
    progressionLibrary: [
      { label: 'i - iv - v - i', degrees: [0, 3, 4, 0] },
      { label: 'i - VI - III - VII', degrees: [0, 5, 2, 6] },
      { label: 'i - iv - VI - v', degrees: [0, 3, 5, 4] },
    ],
  },
  encounter: {
    label: '교감의 순간',
    tonicMidi: 64,
    mode: 'dorian',
    tempoRange: [88, 102],
    leadRegister: 24,
    bassRegister: -24,
    harmonyRegister: 12,
    leadWaveform: 'triangle',
    bassWaveform: 'triangle',
    progressionLibrary: [
      { label: 'i - IV - VII - i', degrees: [0, 3, 6, 0] },
      { label: 'i - v - IV - i', degrees: [0, 4, 3, 0] },
      { label: 'i - VII - IV - v', degrees: [0, 6, 3, 4] },
    ],
  },
});

const DEFAULT_MOOD = 'town';

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function weightedPick(options, random = Math.random) {
  const totalWeight = options.reduce((sum, option) => sum + option.weight, 0);
  let threshold = random() * totalWeight;

  for (const option of options) {
    threshold -= option.weight;

    if (threshold <= 0) {
      return option.value;
    }
  }

  return options.at(-1)?.value;
}

function randomBetween(min, max, random = Math.random) {
  return min + (max - min) * random();
}

function midiToFrequency(midi) {
  return 440 * 2 ** ((midi - 69) / 12);
}

function resolveScaleMidi(tonicMidi, intervals, scaleIndex, registerOffset = 0) {
  const normalizedIndex = ((scaleIndex % intervals.length) + intervals.length) % intervals.length;
  const octaveOffset = Math.floor(scaleIndex / intervals.length) * 12;
  return tonicMidi + intervals[normalizedIndex] + octaveOffset + registerOffset;
}

function buildChord(moodConfig, degree) {
  const intervals = MODE_INTERVALS[moodConfig.mode];
  const tones = [degree, degree + 2, degree + 4].map((scaleIndex) =>
    resolveScaleMidi(moodConfig.tonicMidi, intervals, scaleIndex, moodConfig.harmonyRegister)
  );

  return {
    rootMidi: resolveScaleMidi(moodConfig.tonicMidi, intervals, degree, moodConfig.bassRegister),
    fifthMidi: resolveScaleMidi(
      moodConfig.tonicMidi,
      intervals,
      degree + 4,
      moodConfig.bassRegister
    ),
    leadChordTones: tones.map((tone) => tone + 12),
    leadScaleTones: intervals.map((_, index) =>
      resolveScaleMidi(moodConfig.tonicMidi, intervals, index, moodConfig.leadRegister)
    ),
    harmonyTones: tones,
  };
}

export class BGMManager {
  constructor({ initialMood = DEFAULT_MOOD, initialVolume = 0.52, onStateChange } = {}) {
    this.onStateChange = typeof onStateChange === 'function' ? onStateChange : null;
    this.audioContext = null;
    this.masterGain = null;
    this.compressor = null;
    this.schedulerTimerId = null;
    this.stopTimerId = null;
    this.lookAheadMs = 120;
    this.scheduleAheadSeconds = 0.32;
    this.currentMoodId = MOOD_LIBRARY[initialMood] ? initialMood : DEFAULT_MOOD;
    this.currentProgression = null;
    this.previousProgressionLabel = '';
    this.tempo = 0;
    this.beatDuration = 0;
    this.measureDuration = 0;
    this.nextMeasureTime = 0;
    this.measureStep = 0;
    this.previousLeadMidi = null;
    this.hasStarted = false;
    this.isPlaying = false;
    this.volume = clamp(initialVolume, 0, 1);
    this.supported = Boolean(window.AudioContext || window.webkitAudioContext);
    this.status = this.supported ? 'idle' : 'unsupported';
  }

  getSnapshot() {
    const moodConfig = MOOD_LIBRARY[this.currentMoodId] ?? MOOD_LIBRARY[DEFAULT_MOOD];

    return {
      supported: this.supported,
      status: this.status,
      isPlaying: this.isPlaying,
      hasStarted: this.hasStarted,
      volume: this.volume,
      mood: this.currentMoodId,
      moodLabel: moodConfig.label,
      mode: moodConfig.mode,
      progressionLabel:
        this.currentProgression?.label ?? this.previousProgressionLabel ?? '대기 중',
      tempo: this.tempo || null,
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
    this.masterGain.gain.value = this.volume;

    this.compressor = this.audioContext.createDynamicsCompressor();
    this.compressor.threshold.value = -22;
    this.compressor.knee.value = 20;
    this.compressor.ratio.value = 8;
    this.compressor.attack.value = 0.003;
    this.compressor.release.value = 0.18;

    this.masterGain.connect(this.compressor);
    this.compressor.connect(this.audioContext.destination);
  }

  async resumeFromGesture() {
    if (!this.supported) {
      return false;
    }

    if (this.stopTimerId) {
      window.clearTimeout(this.stopTimerId);
      this.stopTimerId = null;
    }

    this.ensureAudioGraph();

    if (!this.audioContext) {
      return false;
    }

    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    if (!this.isPlaying) {
      this.startScheduling();
    }

    return true;
  }

  startScheduling() {
    if (!this.audioContext || !this.masterGain) {
      return;
    }

    if (this.stopTimerId) {
      window.clearTimeout(this.stopTimerId);
      this.stopTimerId = null;
    }

    if (this.schedulerTimerId) {
      window.clearTimeout(this.schedulerTimerId);
      this.schedulerTimerId = null;
    }

    this.hasStarted = true;
    this.isPlaying = true;
    this.status = 'playing';
    this.measureStep = 0;
    this.previousLeadMidi = null;
    this.selectProgression();
    this.nextMeasureTime = this.audioContext.currentTime + 0.08;

    const now = this.audioContext.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
    this.masterGain.gain.linearRampToValueAtTime(this.volume, now + 0.18);

    this.scheduleLoop();
    this.notifyState();
  }

  async stop() {
    if (!this.audioContext || !this.masterGain) {
      this.isPlaying = false;
      this.status = this.hasStarted ? 'stopped' : 'idle';
      this.notifyState();
      return;
    }

    this.isPlaying = false;
    this.status = 'stopped';

    if (this.schedulerTimerId) {
      window.clearTimeout(this.schedulerTimerId);
      this.schedulerTimerId = null;
    }

    const now = this.audioContext.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
    this.masterGain.gain.linearRampToValueAtTime(0, now + 0.2);

    if (this.stopTimerId) {
      window.clearTimeout(this.stopTimerId);
    }

    this.stopTimerId = window.setTimeout(() => {
      this.stopTimerId = null;

      if (!this.audioContext || this.isPlaying || this.audioContext.state !== 'running') {
        return;
      }

      const suspendPromise = this.audioContext.suspend();

      if (typeof suspendPromise?.catch === 'function') {
        suspendPromise.catch(() => {});
      }
    }, 240);

    this.notifyState();
  }

  destroy() {
    if (this.schedulerTimerId) {
      window.clearTimeout(this.schedulerTimerId);
      this.schedulerTimerId = null;
    }

    if (this.stopTimerId) {
      window.clearTimeout(this.stopTimerId);
      this.stopTimerId = null;
    }

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

  setVolume(nextVolume) {
    this.volume = clamp(nextVolume, 0, 1);

    if (this.masterGain && this.audioContext) {
      const now = this.audioContext.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(this.isPlaying ? this.volume : 0, now + 0.1);
    }

    this.notifyState();
  }

  setMood(nextMoodId) {
    if (!MOOD_LIBRARY[nextMoodId] || nextMoodId === this.currentMoodId) {
      return;
    }

    this.currentMoodId = nextMoodId;
    this.selectProgression();
    this.notifyState();
  }

  selectProgression() {
    const moodConfig = MOOD_LIBRARY[this.currentMoodId] ?? MOOD_LIBRARY[DEFAULT_MOOD];
    const nextProgression = weightedPick(
      moodConfig.progressionLibrary.map((progression) => ({
        value: progression,
        weight: progression.label === this.previousProgressionLabel ? 1 : 2,
      }))
    );

    this.currentProgression = nextProgression ?? moodConfig.progressionLibrary[0];
    this.previousProgressionLabel = this.currentProgression.label;
    this.tempo = Math.round(randomBetween(...moodConfig.tempoRange));
    this.beatDuration = 60 / this.tempo;
    this.measureDuration = this.beatDuration * 4;
    this.measureStep = 0;
  }

  scheduleLoop() {
    if (!this.audioContext || !this.isPlaying) {
      return;
    }

    while (this.nextMeasureTime < this.audioContext.currentTime + this.scheduleAheadSeconds) {
      this.scheduleMeasure(this.nextMeasureTime);
      this.nextMeasureTime += this.measureDuration;
    }

    this.schedulerTimerId = window.setTimeout(() => this.scheduleLoop(), this.lookAheadMs);
  }

  scheduleMeasure(startTime) {
    if (!this.currentProgression) {
      this.selectProgression();
    }

    const moodConfig = MOOD_LIBRARY[this.currentMoodId] ?? MOOD_LIBRARY[DEFAULT_MOOD];
    const chordDegree = this.currentProgression.degrees[this.measureStep];
    const chord = buildChord(moodConfig, chordDegree);

    this.scheduleHarmonyLayer(chord, moodConfig, startTime);
    this.scheduleBassLayer(chord, moodConfig, startTime);
    this.scheduleLeadLayer(chord, moodConfig, startTime);

    this.measureStep += 1;

    if (this.measureStep >= this.currentProgression.degrees.length) {
      this.selectProgression();
    }

    this.notifyState();
  }

  scheduleHarmonyLayer(chord, moodConfig, startTime) {
    chord.harmonyTones.forEach((midi, index) => {
      const detune = (index - 1) * 6;
      const frequency = midiToFrequency(midi);
      this.scheduleVoice({
        frequency,
        startTime,
        duration: this.measureDuration * randomBetween(0.9, 1.04),
        attack: 0.28,
        release: 0.52,
        gainValue: 0.036,
        type: index === 1 ? 'triangle' : 'sine',
        filterFrequency: moodConfig.mode === 'aeolian' ? 1250 : 1680,
        detune,
      });
    });
  }

  scheduleBassLayer(chord, moodConfig, startTime) {
    for (let beat = 0; beat < 4; beat += 1) {
      if (beat !== 0 && Math.random() < 0.18) {
        continue;
      }

      const useFifth = beat !== 0 && Math.random() < 0.42;
      const accent = beat === 0 ? 1.18 : 0.92;
      const midi = (useFifth ? chord.fifthMidi : chord.rootMidi) + (Math.random() < 0.16 ? -12 : 0);

      this.scheduleVoice({
        frequency: midiToFrequency(midi),
        startTime: startTime + beat * this.beatDuration,
        duration: this.beatDuration * (beat === 0 ? 0.88 : 0.58),
        attack: 0.012,
        release: 0.16,
        gainValue: 0.07 * accent,
        type: moodConfig.bassWaveform,
        filterFrequency: moodConfig.mode === 'aeolian' ? 420 : 520,
      });
    }
  }

  scheduleLeadLayer(chord, moodConfig, startTime) {
    const measureEnd = startTime + this.measureDuration;
    let noteTime = startTime;

    while (noteTime < measureEnd - 0.04) {
      const stepBeats = weightedPick([
        { value: 0.25, weight: 2 },
        { value: 0.5, weight: 5 },
        { value: 0.75, weight: 1 },
        { value: 1, weight: 2 },
      ]);

      if (Math.random() < 0.24) {
        noteTime += stepBeats * this.beatDuration;
        continue;
      }

      const noteDuration = Math.min(
        stepBeats * this.beatDuration * randomBetween(0.7, 0.96),
        measureEnd - noteTime - 0.02
      );

      const midi = this.pickLeadMidi(chord, moodConfig);

      this.scheduleVoice({
        frequency: midiToFrequency(midi),
        startTime: noteTime,
        duration: noteDuration,
        attack: 0.01,
        release: 0.12,
        gainValue: 0.03,
        type: moodConfig.leadWaveform,
        filterFrequency: 2400,
        detune: randomBetween(-4, 4),
      });

      this.previousLeadMidi = midi;
      noteTime += stepBeats * this.beatDuration;
    }
  }

  pickLeadMidi(chord, moodConfig) {
    const preferChordTone = Math.random() < 0.72;
    const pool = preferChordTone ? chord.leadChordTones : chord.leadScaleTones;

    if (this.previousLeadMidi === null) {
      return pool[Math.floor(Math.random() * pool.length)];
    }

    const sortedCandidates = [...pool].sort(
      (left, right) =>
        Math.abs(left - this.previousLeadMidi) - Math.abs(right - this.previousLeadMidi)
    );
    const closest = sortedCandidates.slice(0, 3);

    if (moodConfig.mode === 'aeolian' && Math.random() < 0.18) {
      return sortedCandidates.at(-1) ?? closest[0];
    }

    return closest[Math.floor(Math.random() * closest.length)];
  }

  scheduleVoice({
    frequency,
    startTime,
    duration,
    attack,
    release,
    gainValue,
    type,
    filterFrequency,
    detune = 0,
  }) {
    if (!this.audioContext || !this.masterGain) {
      return;
    }

    const oscillator = this.audioContext.createOscillator();
    const voiceGain = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, startTime);
    oscillator.detune.setValueAtTime(detune, startTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(filterFrequency, startTime);
    filter.Q.setValueAtTime(0.0001, startTime);

    voiceGain.gain.setValueAtTime(0.0001, startTime);
    voiceGain.gain.linearRampToValueAtTime(gainValue, startTime + attack);
    voiceGain.gain.linearRampToValueAtTime(
      gainValue * 0.72,
      startTime + Math.max(attack, duration * 0.6)
    );
    voiceGain.gain.linearRampToValueAtTime(0.0001, startTime + duration + release);

    oscillator.connect(filter);
    filter.connect(voiceGain);
    voiceGain.connect(this.masterGain);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration + release + 0.02);
  }
}
