import {
  ARP_PATTERNS,
  BASS_PATTERNS,
  BELL_PATTERNS,
  bgmTrackCatalog,
  BGM_TRACK_LIBRARY,
  DEFAULT_TRACK_ID,
  DRUM_PATTERNS,
  getTrackDefinition,
  LEAD_PATTERNS,
  MODE_INTERVALS,
} from './bgm-library.js';

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

function createPRNG(seed) {
  let value = seed >>> 0;

  return () => {
    value += 0x6d2b79f5;
    let state = value;
    state = Math.imul(state ^ (state >>> 15), state | 1);
    state ^= state + Math.imul(state ^ (state >>> 7), state | 61);
    return ((state ^ (state >>> 14)) >>> 0) / 4294967296;
  };
}

function midiToFrequency(midi) {
  return 440 * 2 ** ((midi - 69) / 12);
}

function resolveScaleMidi(tonicMidi, intervals, scaleIndex, registerOffset = 0) {
  const normalizedIndex = ((scaleIndex % intervals.length) + intervals.length) % intervals.length;
  const octaveOffset = Math.floor(scaleIndex / intervals.length) * 12;
  return tonicMidi + intervals[normalizedIndex] + octaveOffset + registerOffset;
}

function buildChord(track, degree) {
  const intervals = MODE_INTERVALS[track.mode] ?? MODE_INTERVALS.dorian;
  const padScaleIndices = [degree, degree + 2, degree + 4, degree + 6];

  return {
    degree,
    tonicMidi: track.tonicMidi,
    intervals,
    padScaleIndices,
    padMidis: [
      resolveScaleMidi(track.tonicMidi, intervals, degree, 0),
      resolveScaleMidi(track.tonicMidi, intervals, degree + 4, 12),
      resolveScaleMidi(track.tonicMidi, intervals, degree + 2, 12),
      resolveScaleMidi(track.tonicMidi, intervals, degree + 6, 12),
    ],
  };
}

function resolveNoteToken(token, chord, registerOffset = 0) {
  if (!token) {
    return null;
  }

  if (token === 'root') {
    return resolveScaleMidi(chord.tonicMidi, chord.intervals, chord.degree, registerOffset);
  }

  if (token === 'fifth') {
    return resolveScaleMidi(chord.tonicMidi, chord.intervals, chord.degree + 4, registerOffset);
  }

  if (token === 'octave') {
    return resolveScaleMidi(chord.tonicMidi, chord.intervals, chord.degree + 7, registerOffset);
  }

  if (token === 'approachUp') {
    return resolveScaleMidi(chord.tonicMidi, chord.intervals, chord.degree + 1, registerOffset);
  }

  if (token === 'approachDown') {
    return resolveScaleMidi(chord.tonicMidi, chord.intervals, chord.degree - 1, registerOffset);
  }

  if (token.startsWith('chord:')) {
    const chordIndex = Number.parseInt(token.split(':')[1] ?? '0', 10);
    const scaleIndex =
      chord.padScaleIndices[clamp(chordIndex, 0, chord.padScaleIndices.length - 1)];
    return resolveScaleMidi(chord.tonicMidi, chord.intervals, scaleIndex, registerOffset);
  }

  if (token.startsWith('scale:')) {
    const scaleIndex = Number.parseInt(token.split(':')[1] ?? '0', 10);
    return resolveScaleMidi(chord.tonicMidi, chord.intervals, scaleIndex, registerOffset);
  }

  if (token.startsWith('degree:')) {
    const delta = Number.parseInt(token.split(':')[1] ?? '0', 10);
    return resolveScaleMidi(chord.tonicMidi, chord.intervals, chord.degree + delta, registerOffset);
  }

  return null;
}

function countTrailingRests(pattern, startIndex) {
  let restCount = 0;

  for (let index = startIndex + 1; index < pattern.length; index += 1) {
    if (pattern[index]) {
      break;
    }

    restCount += 1;
  }

  return restCount;
}

export class BGMManager {
  constructor({ initialTrackId = DEFAULT_TRACK_ID, initialVolume = 0.42, onStateChange } = {}) {
    this.onStateChange = typeof onStateChange === 'function' ? onStateChange : null;
    this.audioContext = null;
    this.masterGain = null;
    this.musicBus = null;
    this.reverbInput = null;
    this.delayInput = null;
    this.masterTone = null;
    this.compressor = null;
    this.schedulerTimerId = null;
    this.stopTimerId = null;
    this.lookAheadMs = 120;
    this.scheduleAheadSeconds = 0.36;
    this.currentTrackId = BGM_TRACK_LIBRARY[initialTrackId] ? initialTrackId : DEFAULT_TRACK_ID;
    this.measureIndex = 0;
    this.loopCount = 0;
    this.currentSectionName = '';
    this.tempo = 0;
    this.beatDuration = 0;
    this.measureDuration = 0;
    this.nextMeasureTime = 0;
    this.hasStarted = false;
    this.isPlaying = false;
    this.volume = clamp(initialVolume, 0, 1);
    this.supported = Boolean(window.AudioContext || window.webkitAudioContext);
    this.status = this.supported ? 'idle' : 'unsupported';
    this.noiseBuffer = null;
  }

  get currentTrack() {
    return getTrackDefinition(this.currentTrackId);
  }

  getSnapshot() {
    const track = this.currentTrack;

    return {
      supported: this.supported,
      status: this.status,
      isPlaying: this.isPlaying,
      hasStarted: this.hasStarted,
      volume: this.volume,
      trackId: track.id,
      trackTitle: track.title,
      chapter: track.chapter,
      usage: track.usage,
      summary: track.summary,
      section: this.currentSectionName || '대기',
      tempo: this.tempo || track.tempo,
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
    this.masterGain.gain.value = 0;

    this.musicBus = this.audioContext.createGain();
    this.musicBus.gain.value = 1;

    this.masterTone = this.audioContext.createBiquadFilter();
    this.masterTone.type = 'highshelf';
    this.masterTone.frequency.value = 3200;
    this.masterTone.gain.value = -5.5;

    this.compressor = this.audioContext.createDynamicsCompressor();
    this.compressor.threshold.value = -20;
    this.compressor.knee.value = 20;
    this.compressor.ratio.value = 5;
    this.compressor.attack.value = 0.012;
    this.compressor.release.value = 0.22;

    this.reverbInput = this.audioContext.createGain();
    this.reverbInput.gain.value = 1;

    const convolver = this.audioContext.createConvolver();
    convolver.buffer = this.createImpulseResponse(2.8, 2.4);

    const reverbTone = this.audioContext.createBiquadFilter();
    reverbTone.type = 'lowpass';
    reverbTone.frequency.value = 2800;

    this.delayInput = this.audioContext.createGain();
    this.delayInput.gain.value = 1;

    const delayNode = this.audioContext.createDelay(0.8);
    delayNode.delayTime.value = 0.31;

    const delayFeedback = this.audioContext.createGain();
    delayFeedback.gain.value = 0.2;

    const delayFilter = this.audioContext.createBiquadFilter();
    delayFilter.type = 'lowpass';
    delayFilter.frequency.value = 2200;

    const delayTone = this.audioContext.createBiquadFilter();
    delayTone.type = 'highpass';
    delayTone.frequency.value = 260;

    this.musicBus.connect(this.masterGain);
    this.masterGain.connect(this.masterTone);
    this.masterTone.connect(this.compressor);
    this.compressor.connect(this.audioContext.destination);

    this.reverbInput.connect(convolver);
    convolver.connect(reverbTone);
    reverbTone.connect(this.musicBus);

    this.delayInput.connect(delayNode);
    delayNode.connect(delayFilter);
    delayFilter.connect(delayFeedback);
    delayFeedback.connect(delayNode);
    delayNode.connect(delayTone);
    delayTone.connect(this.musicBus);

    this.noiseBuffer = this.createNoiseBuffer(1.4);
  }

  createImpulseResponse(durationSeconds, decayPower) {
    if (!this.audioContext) {
      return null;
    }

    const frameCount = Math.floor(this.audioContext.sampleRate * durationSeconds);
    const impulse = this.audioContext.createBuffer(2, frameCount, this.audioContext.sampleRate);

    for (let channel = 0; channel < impulse.numberOfChannels; channel += 1) {
      const channelData = impulse.getChannelData(channel);

      for (let frame = 0; frame < frameCount; frame += 1) {
        const envelope = (1 - frame / frameCount) ** decayPower;
        channelData[frame] = (Math.random() * 2 - 1) * envelope;
      }
    }

    return impulse;
  }

  createNoiseBuffer(durationSeconds) {
    if (!this.audioContext) {
      return null;
    }

    const frameCount = Math.floor(this.audioContext.sampleRate * durationSeconds);
    const buffer = this.audioContext.createBuffer(1, frameCount, this.audioContext.sampleRate);
    const channelData = buffer.getChannelData(0);

    for (let frame = 0; frame < frameCount; frame += 1) {
      channelData[frame] = Math.random() * 2 - 1;
    }

    return buffer;
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

  async playTrack(trackId) {
    if (!BGM_TRACK_LIBRARY[trackId]) {
      return false;
    }

    this.setTrack(trackId);
    return this.resumeFromGesture();
  }

  clearScheduler() {
    if (this.schedulerTimerId) {
      window.clearTimeout(this.schedulerTimerId);
      this.schedulerTimerId = null;
    }
  }

  startScheduling() {
    if (!this.audioContext || !this.masterGain) {
      return;
    }

    const track = this.currentTrack;

    this.clearScheduler();
    this.hasStarted = true;
    this.isPlaying = true;
    this.status = 'playing';
    this.measureIndex = 0;
    this.loopCount = 0;
    this.currentSectionName = track.arrangement[0] ?? '';
    this.tempo = track.tempo;
    this.beatDuration = 60 / this.tempo;
    this.measureDuration = this.beatDuration * 4;
    this.nextMeasureTime = this.audioContext.currentTime + 0.08;

    const now = this.audioContext.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
    this.masterGain.gain.linearRampToValueAtTime(this.volume, now + 0.18);

    this.scheduleLoop();
    this.notifyState();
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
    const track = this.currentTrack;
    const arrangementIndex = this.measureIndex % track.arrangement.length;
    const sectionName = track.arrangement[arrangementIndex];
    const section = track.sections[sectionName];

    if (!section) {
      return;
    }

    this.currentSectionName = sectionName;

    const chord = buildChord(track, section.degree);
    const random = createPRNG(hashString(`${track.id}:${this.loopCount}:${this.measureIndex}`));
    const measureState = {
      chord,
      random,
      section,
      startTime,
      track,
    };

    this.schedulePadLayer(measureState);
    this.scheduleDroneLayer(measureState);
    this.scheduleBassLayer(measureState);
    this.scheduleArpLayer(measureState);
    this.scheduleLeadLayer(measureState);
    this.scheduleBellLayer(measureState);
    this.schedulePercussionLayer(measureState);

    this.measureIndex += 1;

    if (this.measureIndex % track.arrangement.length === 0) {
      this.loopCount += 1;
    }

    this.notifyState();
  }

  schedulePadLayer({ chord, random, section, startTime, track }) {
    const layer = track.paletteSettings.pad;
    const sectionAccent = section.drums === 'none' ? 0.92 : 1.06;

    chord.padMidis.forEach((midi, index) => {
      const pan = (index - 1.5) * 0.16;
      const frequency = midiToFrequency(midi + (index === 0 ? -12 : 0));

      this.scheduleSynthNote({
        frequency,
        startTime,
        duration: this.measureDuration * 0.92,
        attack: 0.22,
        release: 0.64,
        gainScale: sectionAccent * (index === 3 ? 0.62 : 1),
        layer,
        pan,
        random,
        sustain: 0.84,
      });
    });
  }

  scheduleDroneLayer({ chord, section, startTime, track }) {
    const layer = track.paletteSettings.drone;
    const token = section.drums === 'boss' || section.drums === 'battle' ? 'root' : 'fifth';
    const midi = resolveNoteToken(token, chord, -24);

    if (!midi) {
      return;
    }

    this.scheduleSynthNote({
      frequency: midiToFrequency(midi),
      startTime,
      duration: this.measureDuration * 1.02,
      attack: 0.5,
      release: 0.78,
      gainScale: section.drums === 'none' ? 0.94 : 0.78,
      layer,
      pan: 0,
      random: () => 0.5,
      sustain: 0.92,
    });
  }

  scheduleBassLayer({ chord, random, section, startTime, track }) {
    const pattern = BASS_PATTERNS[section.bass] ?? BASS_PATTERNS.breath;
    const stepDuration = this.measureDuration / pattern.length;
    const layer = track.paletteSettings.bass;

    pattern.forEach((token, index) => {
      const midi = resolveNoteToken(token, chord, -24);

      if (!midi) {
        return;
      }

      const startOffset = index * stepDuration;
      const restCount = countTrailingRests(pattern, index);
      const duration = stepDuration * (0.76 + restCount * 0.12);

      this.scheduleSynthNote({
        frequency: midiToFrequency(midi),
        startTime: startTime + startOffset,
        duration,
        attack: 0.012,
        release: 0.18,
        gainScale: index === 0 ? 1.12 : 0.9,
        layer,
        pan: (random() - 0.5) * 0.06,
        random,
        sustain: 0.7,
      });
    });
  }

  scheduleArpLayer({ chord, random, section, startTime, track }) {
    const pattern = ARP_PATTERNS[section.arp] ?? ARP_PATTERNS.ripple;
    const stepDuration = this.measureDuration / pattern.length;
    const layer = track.paletteSettings.arp;

    pattern.forEach((token, index) => {
      const midi = resolveNoteToken(token, chord, 12);

      if (!midi) {
        return;
      }

      const startOffset = index * stepDuration;
      const shouldThinOut = section.drums === 'none' && index % 2 === 1 && random() < 0.3;

      if (shouldThinOut) {
        return;
      }

      this.scheduleSynthNote({
        frequency: midiToFrequency(midi),
        startTime: startTime + startOffset,
        duration: stepDuration * 0.72,
        attack: 0.01,
        release: 0.16,
        gainScale: 0.9,
        layer,
        pan: (random() - 0.5) * 0.48,
        random,
        sustain: 0.62,
      });
    });
  }

  scheduleLeadLayer({ chord, random, section, startTime, track }) {
    if (!section.lead) {
      return;
    }

    if (section.drums === 'none' && random() < 0.22) {
      return;
    }

    const pattern = LEAD_PATTERNS[section.lead] ?? LEAD_PATTERNS.theme;
    const stepDuration = this.measureDuration / pattern.length;
    const layer = track.paletteSettings.lead;

    pattern.forEach((token, index) => {
      const midi = resolveNoteToken(token, chord, 24);

      if (!midi) {
        return;
      }

      const startOffset = index * stepDuration;
      const restCount = countTrailingRests(pattern, index);
      const duration = stepDuration * (0.78 + restCount * 0.18);

      this.scheduleSynthNote({
        frequency: midiToFrequency(midi),
        startTime: startTime + startOffset,
        duration,
        attack: 0.014,
        release: 0.28,
        gainScale: 0.92,
        layer,
        pan: (random() - 0.5) * 0.24,
        random,
        sustain: 0.76,
      });
    });
  }

  scheduleBellLayer({ chord, random, section, startTime, track }) {
    if (!section.bell) {
      return;
    }

    const pattern = BELL_PATTERNS[section.bell] ?? BELL_PATTERNS.distant;
    const stepDuration = this.measureDuration / pattern.length;
    const layer = track.paletteSettings.bell;

    pattern.forEach((token, index) => {
      const midi = resolveNoteToken(token, chord, 36);

      if (!midi) {
        return;
      }

      if (index > 0 && random() < 0.16) {
        return;
      }

      this.scheduleBellNote({
        frequency: midiToFrequency(midi),
        startTime: startTime + index * stepDuration,
        layer,
        gainScale: index === 0 ? 1 : 0.84,
        pan: (random() - 0.5) * 0.64,
      });
    });
  }

  schedulePercussionLayer({ random, section, startTime }) {
    const pattern = DRUM_PATTERNS[section.drums] ?? DRUM_PATTERNS.none;

    if (
      !pattern.kick.length &&
      !pattern.snare.length &&
      !pattern.hat.length &&
      !pattern.low.length
    ) {
      return;
    }

    const stepDuration = this.measureDuration / pattern.steps;

    pattern.kick.forEach((velocity, index) => {
      if (velocity > 0) {
        this.scheduleKick(startTime + index * stepDuration, velocity);
      }
    });

    pattern.snare.forEach((velocity, index) => {
      if (velocity > 0) {
        this.scheduleNoiseHit({
          startTime: startTime + index * stepDuration,
          duration: 0.17,
          gainScale: velocity,
          centerFrequency: 1800,
          q: 0.8,
          highpassFrequency: 520,
          pan: (random() - 0.5) * 0.2,
          reverbAmount: 0.08,
        });
      }
    });

    pattern.hat.forEach((velocity, index) => {
      if (velocity > 0) {
        this.scheduleNoiseHit({
          startTime: startTime + index * stepDuration,
          duration: 0.08,
          gainScale: velocity,
          centerFrequency: 5400,
          q: 1.4,
          highpassFrequency: 2600,
          pan: (random() - 0.5) * 0.36,
          reverbAmount: 0.03,
        });
      }
    });

    pattern.low.forEach((velocity, index) => {
      if (velocity > 0) {
        this.scheduleLowPulse(startTime + index * stepDuration, velocity);
      }
    });
  }

  scheduleSynthNote({
    frequency,
    startTime,
    duration,
    attack,
    release,
    gainScale,
    layer,
    pan,
    random,
    sustain,
  }) {
    if (!this.audioContext || !this.musicBus || !this.reverbInput || !this.delayInput) {
      return;
    }

    const voiceGain = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    const outputNode =
      typeof this.audioContext.createStereoPanner === 'function'
        ? this.audioContext.createStereoPanner()
        : this.audioContext.createGain();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(layer.filter, startTime);
    filter.Q.setValueAtTime(0.2, startTime);

    if ('pan' in outputNode) {
      outputNode.pan.setValueAtTime(pan, startTime);
    }

    voiceGain.gain.setValueAtTime(0.0001, startTime);
    voiceGain.gain.linearRampToValueAtTime(layer.gain * gainScale, startTime + attack);
    voiceGain.gain.linearRampToValueAtTime(
      layer.gain * gainScale * sustain,
      startTime + Math.max(attack * 1.4, duration * 0.55)
    );
    voiceGain.gain.linearRampToValueAtTime(0.0001, startTime + duration + release);

    filter.connect(voiceGain);
    voiceGain.connect(outputNode);
    outputNode.connect(this.musicBus);

    if (layer.reverb > 0) {
      const reverbSend = this.audioContext.createGain();
      reverbSend.gain.setValueAtTime(layer.reverb * gainScale, startTime);
      outputNode.connect(reverbSend);
      reverbSend.connect(this.reverbInput);
    }

    if (layer.delay > 0) {
      const delaySend = this.audioContext.createGain();
      delaySend.gain.setValueAtTime(layer.delay * gainScale, startTime);
      outputNode.connect(delaySend);
      delaySend.connect(this.delayInput);
    }

    layer.waveforms.forEach((waveform, oscillatorIndex) => {
      const oscillator = this.audioContext.createOscillator();
      const detuneSpread = layer.waveforms.length === 1 ? 0 : (oscillatorIndex - 0.5) * 7;

      oscillator.type = waveform;
      oscillator.frequency.setValueAtTime(frequency, startTime);
      oscillator.detune.setValueAtTime(detuneSpread + (random() - 0.5) * 3.4, startTime);
      oscillator.connect(filter);
      oscillator.start(startTime);
      oscillator.stop(startTime + duration + release + 0.02);
    });
  }

  scheduleBellNote({ frequency, startTime, layer, gainScale, pan }) {
    if (!this.audioContext || !this.musicBus || !this.reverbInput) {
      return;
    }

    const bellGain = this.audioContext.createGain();
    const outputNode =
      typeof this.audioContext.createStereoPanner === 'function'
        ? this.audioContext.createStereoPanner()
        : this.audioContext.createGain();

    if ('pan' in outputNode) {
      outputNode.pan.setValueAtTime(pan, startTime);
    }

    bellGain.gain.setValueAtTime(0.0001, startTime);
    bellGain.gain.linearRampToValueAtTime(layer.gain * gainScale, startTime + 0.01);
    bellGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.8);
    bellGain.connect(outputNode);
    outputNode.connect(this.musicBus);

    const reverbSend = this.audioContext.createGain();
    reverbSend.gain.setValueAtTime(layer.reverb * gainScale, startTime);
    outputNode.connect(reverbSend);
    reverbSend.connect(this.reverbInput);

    [1, 2.01, 3.19].forEach((ratio, index) => {
      const oscillator = this.audioContext.createOscillator();
      const partialGain = this.audioContext.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency * ratio, startTime);

      partialGain.gain.setValueAtTime(index === 0 ? 1 : 0.38 / index, startTime);
      partialGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.6 - index * 0.22);

      oscillator.connect(partialGain);
      partialGain.connect(bellGain);

      oscillator.start(startTime);
      oscillator.stop(startTime + 1.9);
    });
  }

  scheduleKick(startTime, velocity) {
    if (!this.audioContext || !this.musicBus) {
      return;
    }

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(112, startTime);
    oscillator.frequency.exponentialRampToValueAtTime(46, startTime + 0.14);

    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.linearRampToValueAtTime(0.088 * velocity, startTime + 0.006);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.18);

    oscillator.connect(gainNode);
    gainNode.connect(this.musicBus);

    oscillator.start(startTime);
    oscillator.stop(startTime + 0.2);
  }

  scheduleLowPulse(startTime, velocity) {
    if (!this.audioContext || !this.musicBus || !this.reverbInput) {
      return;
    }

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(82, startTime);
    oscillator.frequency.exponentialRampToValueAtTime(54, startTime + 0.22);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(420, startTime);

    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.linearRampToValueAtTime(0.052 * velocity, startTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.26);

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.musicBus);

    const reverbSend = this.audioContext.createGain();
    reverbSend.gain.setValueAtTime(0.08 * velocity, startTime);
    gainNode.connect(reverbSend);
    reverbSend.connect(this.reverbInput);

    oscillator.start(startTime);
    oscillator.stop(startTime + 0.3);
  }

  scheduleNoiseHit({
    startTime,
    duration,
    gainScale,
    centerFrequency,
    q,
    highpassFrequency,
    pan,
    reverbAmount,
  }) {
    if (!this.audioContext || !this.noiseBuffer || !this.musicBus) {
      return;
    }

    const source = this.audioContext.createBufferSource();
    const bandpass = this.audioContext.createBiquadFilter();
    const highpass = this.audioContext.createBiquadFilter();
    const gainNode = this.audioContext.createGain();
    const outputNode =
      typeof this.audioContext.createStereoPanner === 'function'
        ? this.audioContext.createStereoPanner()
        : this.audioContext.createGain();

    source.buffer = this.noiseBuffer;

    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(centerFrequency, startTime);
    bandpass.Q.setValueAtTime(q, startTime);

    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(highpassFrequency, startTime);

    if ('pan' in outputNode) {
      outputNode.pan.setValueAtTime(pan, startTime);
    }

    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.linearRampToValueAtTime(0.08 * gainScale, startTime + 0.004);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    source.connect(bandpass);
    bandpass.connect(highpass);
    highpass.connect(gainNode);
    gainNode.connect(outputNode);
    outputNode.connect(this.musicBus);

    if (reverbAmount > 0 && this.reverbInput) {
      const reverbSend = this.audioContext.createGain();
      reverbSend.gain.setValueAtTime(reverbAmount * gainScale, startTime);
      outputNode.connect(reverbSend);
      reverbSend.connect(this.reverbInput);
    }

    source.start(startTime);
    source.stop(startTime + duration + 0.04);
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
    this.clearScheduler();

    const now = this.audioContext.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
    this.masterGain.gain.linearRampToValueAtTime(0, now + 0.22);

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
    }, 260);

    this.notifyState();
  }

  destroy() {
    this.clearScheduler();

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
      this.musicBus = null;
      this.reverbInput = null;
      this.delayInput = null;
      this.masterTone = null;
      this.compressor = null;
      this.noiseBuffer = null;
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

  setTrack(nextTrackId) {
    if (!BGM_TRACK_LIBRARY[nextTrackId] || nextTrackId === this.currentTrackId) {
      return;
    }

    this.currentTrackId = nextTrackId;
    const track = this.currentTrack;

    this.currentSectionName = track.arrangement[0] ?? '';
    this.tempo = track.tempo;
    this.beatDuration = 60 / this.tempo;
    this.measureDuration = this.beatDuration * 4;

    if (this.isPlaying) {
      this.startScheduling();
      return;
    }

    this.notifyState();
  }
}

export { bgmTrackCatalog };
