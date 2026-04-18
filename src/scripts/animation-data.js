const BASE_POSE = Object.freeze({
  bodyLean: 0,
  headTilt: 0,
  pelvisLift: 0,
  pelvisTilt: 0,
  armLeft: 0,
  forearmLeft: 0,
  armRight: 0,
  forearmRight: 0,
  footLeftX: -12,
  footLeftY: 0,
  footRightX: 12,
  footRightY: 0,
  weaponSwing: 0,
  capeSwing: 0,
});

export const POSE_CHANNELS = Object.freeze([
  Object.freeze({ key: 'bodyLean', label: 'Body Lean', min: -20, max: 20, step: 1 }),
  Object.freeze({ key: 'headTilt', label: 'Head Tilt', min: -25, max: 25, step: 1 }),
  Object.freeze({ key: 'pelvisLift', label: 'Pelvis Lift', min: -12, max: 14, step: 1 }),
  Object.freeze({ key: 'pelvisTilt', label: 'Pelvis Tilt', min: -18, max: 18, step: 1 }),
  Object.freeze({ key: 'armLeft', label: 'Arm Left', min: -60, max: 60, step: 1 }),
  Object.freeze({ key: 'forearmLeft', label: 'Forearm Left', min: -75, max: 75, step: 1 }),
  Object.freeze({ key: 'armRight', label: 'Arm Right', min: -60, max: 60, step: 1 }),
  Object.freeze({ key: 'forearmRight', label: 'Forearm Right', min: -75, max: 75, step: 1 }),
  Object.freeze({ key: 'footLeftX', label: 'Foot Left X', min: -36, max: 12, step: 1 }),
  Object.freeze({ key: 'footLeftY', label: 'Foot Left Y', min: -18, max: 24, step: 1 }),
  Object.freeze({ key: 'footRightX', label: 'Foot Right X', min: -12, max: 36, step: 1 }),
  Object.freeze({ key: 'footRightY', label: 'Foot Right Y', min: -18, max: 24, step: 1 }),
  Object.freeze({ key: 'weaponSwing', label: 'Weapon Swing', min: -40, max: 40, step: 1 }),
  Object.freeze({ key: 'capeSwing', label: 'Cape Swing', min: -36, max: 36, step: 1 }),
]);

const ANIMATION_LIBRARY_SOURCE = Object.freeze({
  idle: Object.freeze({
    label: 'Idle',
    loop: true,
    frames: Object.freeze([
      Object.freeze({
        duration: 0.34,
        values: Object.freeze({
          bodyLean: -1,
          headTilt: 3,
          pelvisLift: 1,
          armLeft: -6,
          forearmLeft: 8,
          armRight: 10,
          forearmRight: -4,
          footLeftX: -13,
          footRightX: 11,
          weaponSwing: 8,
          capeSwing: 6,
        }),
      }),
      Object.freeze({
        duration: 0.34,
        values: Object.freeze({
          bodyLean: 1,
          headTilt: -2,
          pelvisLift: 3,
          pelvisTilt: 2,
          armLeft: 2,
          forearmLeft: -8,
          armRight: -4,
          forearmRight: 4,
          footLeftX: -11,
          footRightX: 13,
          weaponSwing: 4,
          capeSwing: -4,
        }),
      }),
      Object.freeze({
        duration: 0.34,
        values: Object.freeze({
          bodyLean: 0,
          headTilt: 2,
          pelvisLift: 0,
          pelvisTilt: -2,
          armLeft: -4,
          forearmLeft: 12,
          armRight: 8,
          forearmRight: -2,
          footLeftX: -12,
          footRightX: 12,
          weaponSwing: 10,
          capeSwing: 2,
        }),
      }),
    ]),
  }),
  run: Object.freeze({
    label: 'Run',
    loop: true,
    frames: Object.freeze([
      Object.freeze({
        duration: 0.12,
        values: Object.freeze({
          bodyLean: 7,
          headTilt: -4,
          pelvisLift: -2,
          pelvisTilt: -5,
          armLeft: 34,
          forearmLeft: -18,
          armRight: -34,
          forearmRight: 24,
          footLeftX: -24,
          footLeftY: 2,
          footRightX: 26,
          footRightY: -6,
          weaponSwing: -14,
          capeSwing: 26,
        }),
      }),
      Object.freeze({
        duration: 0.12,
        values: Object.freeze({
          bodyLean: 5,
          headTilt: -2,
          pelvisLift: 4,
          pelvisTilt: 4,
          armLeft: 6,
          forearmLeft: -24,
          armRight: -8,
          forearmRight: 20,
          footLeftX: -10,
          footLeftY: -4,
          footRightX: 18,
          footRightY: 6,
          weaponSwing: -6,
          capeSwing: 14,
        }),
      }),
      Object.freeze({
        duration: 0.12,
        values: Object.freeze({
          bodyLean: 7,
          headTilt: 2,
          pelvisLift: -3,
          pelvisTilt: 6,
          armLeft: -34,
          forearmLeft: 22,
          armRight: 34,
          forearmRight: -18,
          footLeftX: 22,
          footLeftY: -6,
          footRightX: -18,
          footRightY: 4,
          weaponSwing: 18,
          capeSwing: -26,
        }),
      }),
      Object.freeze({
        duration: 0.12,
        values: Object.freeze({
          bodyLean: 5,
          headTilt: 1,
          pelvisLift: 3,
          pelvisTilt: -5,
          armLeft: -8,
          forearmLeft: 18,
          armRight: 7,
          forearmRight: -22,
          footLeftX: 18,
          footLeftY: 6,
          footRightX: -10,
          footRightY: -4,
          weaponSwing: 10,
          capeSwing: -12,
        }),
      }),
    ]),
  }),
  jump: Object.freeze({
    label: 'Jump',
    loop: false,
    frames: Object.freeze([
      Object.freeze({
        duration: 0.2,
        values: Object.freeze({
          bodyLean: 4,
          headTilt: -3,
          pelvisLift: 8,
          pelvisTilt: -2,
          armLeft: 24,
          forearmLeft: -16,
          armRight: 18,
          forearmRight: -10,
          footLeftX: -10,
          footLeftY: 16,
          footRightX: 10,
          footRightY: 16,
          weaponSwing: 16,
          capeSwing: 22,
        }),
      }),
      Object.freeze({
        duration: 0.22,
        values: Object.freeze({
          bodyLean: 0,
          headTilt: 2,
          pelvisLift: 12,
          armLeft: 30,
          forearmLeft: -8,
          armRight: 22,
          forearmRight: -4,
          footLeftX: -6,
          footLeftY: 24,
          footRightX: 6,
          footRightY: 24,
          weaponSwing: 12,
          capeSwing: 28,
        }),
      }),
    ]),
  }),
  fall: Object.freeze({
    label: 'Fall',
    loop: false,
    frames: Object.freeze([
      Object.freeze({
        duration: 0.18,
        values: Object.freeze({
          bodyLean: 2,
          headTilt: 5,
          pelvisLift: 6,
          armLeft: -4,
          forearmLeft: 16,
          armRight: 8,
          forearmRight: 10,
          footLeftX: -8,
          footLeftY: 10,
          footRightX: 8,
          footRightY: 8,
          weaponSwing: 6,
          capeSwing: -12,
        }),
      }),
      Object.freeze({
        duration: 0.18,
        values: Object.freeze({
          bodyLean: -1,
          headTilt: 2,
          pelvisLift: 3,
          armLeft: 4,
          forearmLeft: 8,
          armRight: 12,
          forearmRight: 14,
          footLeftX: -10,
          footLeftY: 14,
          footRightX: 10,
          footRightY: 12,
          weaponSwing: 0,
          capeSwing: -20,
        }),
      }),
    ]),
  }),
});

export const ANIMATION_LIBRARY = createAnimationLibrary();

export function createAnimationLibrary() {
  return deepClone(ANIMATION_LIBRARY_SOURCE);
}

export function createPose(values = {}) {
  return { ...BASE_POSE, ...values };
}

export function getClipNames(library = ANIMATION_LIBRARY) {
  return Object.keys(library);
}

export function getAnimationClip(library, clipName) {
  return library[clipName] ?? library.idle;
}

export function getFramePose(clip, frameIndex) {
  const frame = clip.frames[clampIndex(frameIndex, clip.frames.length)];
  return createPose(frame?.values);
}

export function sampleAnimationClip(clip, elapsedSeconds) {
  if (!clip.frames.length) {
    return createPose();
  }

  if (clip.frames.length === 1) {
    return getFramePose(clip, 0);
  }

  const totalDuration = getClipDuration(clip);
  const clampedTime = clip.loop
    ? positiveModulo(elapsedSeconds, totalDuration)
    : clamp(elapsedSeconds, 0, totalDuration);

  let timeCursor = 0;

  for (let index = 0; index < clip.frames.length; index += 1) {
    const frame = clip.frames[index];
    const nextFrame = clip.frames[index + 1] ?? (clip.loop ? clip.frames[0] : frame);
    const frameDuration = Math.max(frame.duration, 0.0001);
    const frameEnd = timeCursor + frameDuration;

    if (clampedTime <= frameEnd || index === clip.frames.length - 1) {
      const amount =
        frame === nextFrame ? 0 : clamp((clampedTime - timeCursor) / frameDuration, 0, 1);
      return interpolatePose(createPose(frame.values), createPose(nextFrame.values), amount);
    }

    timeCursor = frameEnd;
  }

  return getFramePose(clip, clip.frames.length - 1);
}

export function getClipDuration(clip) {
  return clip.frames.reduce((total, frame) => total + Math.max(frame.duration, 0.0001), 0);
}

export function updateClipFrameValue(library, clipName, frameIndex, channelKey, value) {
  const clip = getAnimationClip(library, clipName);
  const frame = clip.frames[clampIndex(frameIndex, clip.frames.length)];

  if (!frame) {
    return;
  }

  frame.values[channelKey] = value;
}

export function serializeAnimationLibrary(library) {
  return JSON.stringify(library, null, 2);
}

function interpolatePose(fromPose, toPose, amount) {
  return Object.fromEntries(
    Object.keys(BASE_POSE).map((key) => [key, lerp(fromPose[key], toPose[key], amount)])
  );
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function clampIndex(index, length) {
  return clamp(Math.round(index), 0, Math.max(length - 1, 0));
}

function deepClone(value) {
  if (Array.isArray(value)) {
    return value.map((entry) => deepClone(entry));
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, deepClone(entry)]));
  }

  return value;
}

function lerp(from, to, amount) {
  return from + (to - from) * amount;
}

function positiveModulo(value, divisor) {
  return ((value % divisor) + divisor) % divisor;
}
