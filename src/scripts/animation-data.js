const BASE_POSE = Object.freeze({
  bodyLean: 0,
  headTilt: 0,
  pelvisLift: 0,
  pelvisTilt: 0,
  shoulderTilt: 0,
  hipSwing: 0,
  armLeft: 0,
  forearmLeft: 0,
  armRight: 0,
  forearmRight: 0,
  kneeLeft: 12,
  kneeRight: 12,
  footLeftX: -12,
  footLeftY: 0,
  footRightX: 12,
  footRightY: 0,
  footLeftAngle: 4,
  footRightAngle: -4,
  weaponSwing: 0,
  capeSwing: 0,
});

export const POSE_CHANNELS = Object.freeze([
  Object.freeze({ key: 'bodyLean', label: 'Body Lean', min: -20, max: 20, step: 1 }),
  Object.freeze({ key: 'headTilt', label: 'Head Tilt', min: -25, max: 25, step: 1 }),
  Object.freeze({ key: 'pelvisLift', label: 'Pelvis Lift', min: -12, max: 16, step: 1 }),
  Object.freeze({ key: 'pelvisTilt', label: 'Pelvis Tilt', min: -18, max: 18, step: 1 }),
  Object.freeze({ key: 'shoulderTilt', label: 'Shoulder Tilt', min: -18, max: 18, step: 1 }),
  Object.freeze({ key: 'hipSwing', label: 'Hip Swing', min: -18, max: 18, step: 1 }),
  Object.freeze({ key: 'armLeft', label: 'Arm Left', min: -60, max: 60, step: 1 }),
  Object.freeze({ key: 'forearmLeft', label: 'Forearm Left', min: -75, max: 75, step: 1 }),
  Object.freeze({ key: 'armRight', label: 'Arm Right', min: -60, max: 60, step: 1 }),
  Object.freeze({ key: 'forearmRight', label: 'Forearm Right', min: -75, max: 75, step: 1 }),
  Object.freeze({ key: 'kneeLeft', label: 'Knee Left', min: -12, max: 32, step: 1 }),
  Object.freeze({ key: 'kneeRight', label: 'Knee Right', min: -12, max: 32, step: 1 }),
  Object.freeze({ key: 'footLeftX', label: 'Foot Left X', min: -36, max: 12, step: 1 }),
  Object.freeze({ key: 'footLeftY', label: 'Foot Left Y', min: -18, max: 28, step: 1 }),
  Object.freeze({ key: 'footRightX', label: 'Foot Right X', min: -12, max: 36, step: 1 }),
  Object.freeze({ key: 'footRightY', label: 'Foot Right Y', min: -18, max: 28, step: 1 }),
  Object.freeze({
    key: 'footLeftAngle',
    label: 'Foot Left Angle',
    min: -26,
    max: 26,
    step: 1,
  }),
  Object.freeze({
    key: 'footRightAngle',
    label: 'Foot Right Angle',
    min: -26,
    max: 26,
    step: 1,
  }),
  Object.freeze({ key: 'weaponSwing', label: 'Weapon Swing', min: -40, max: 40, step: 1 }),
  Object.freeze({ key: 'capeSwing', label: 'Cape Swing', min: -36, max: 36, step: 1 }),
]);

const ANIMATION_LIBRARY_SOURCE = Object.freeze({
  idle: Object.freeze({
    label: 'Idle',
    loop: true,
    frames: Object.freeze([
      Object.freeze({
        duration: 0.28,
        values: Object.freeze({
          bodyLean: -1,
          headTilt: 3,
          pelvisLift: 1,
          pelvisTilt: -1,
          shoulderTilt: 2,
          hipSwing: -2,
          armLeft: -8,
          forearmLeft: 10,
          armRight: 10,
          forearmRight: -8,
          kneeLeft: 12,
          kneeRight: 14,
          footLeftX: -13,
          footRightX: 11,
          footLeftAngle: 4,
          footRightAngle: -5,
          weaponSwing: 10,
          capeSwing: 5,
        }),
      }),
      Object.freeze({
        duration: 0.28,
        values: Object.freeze({
          bodyLean: 1,
          headTilt: -1,
          pelvisLift: 3,
          pelvisTilt: 2,
          shoulderTilt: -1,
          hipSwing: 1,
          armLeft: -2,
          forearmLeft: 2,
          armRight: 4,
          forearmRight: 3,
          kneeLeft: 14,
          kneeRight: 10,
          footLeftX: -11,
          footRightX: 13,
          footLeftAngle: 2,
          footRightAngle: -2,
          weaponSwing: 6,
          capeSwing: -2,
        }),
      }),
      Object.freeze({
        duration: 0.28,
        values: Object.freeze({
          bodyLean: 0,
          headTilt: 2,
          pelvisLift: 0,
          pelvisTilt: -2,
          shoulderTilt: -2,
          hipSwing: 2,
          armLeft: 2,
          forearmLeft: -6,
          armRight: 8,
          forearmRight: -2,
          kneeLeft: 11,
          kneeRight: 13,
          footLeftX: -12,
          footRightX: 12,
          footLeftAngle: 5,
          footRightAngle: -4,
          weaponSwing: 11,
          capeSwing: 2,
        }),
      }),
      Object.freeze({
        duration: 0.28,
        values: Object.freeze({
          bodyLean: -1,
          headTilt: 0,
          pelvisLift: 2,
          pelvisTilt: 1,
          shoulderTilt: 1,
          hipSwing: -1,
          armLeft: -4,
          forearmLeft: 7,
          armRight: 6,
          forearmRight: -5,
          kneeLeft: 13,
          kneeRight: 11,
          footLeftX: -12,
          footRightX: 12,
          footLeftAngle: 3,
          footRightAngle: -3,
          weaponSwing: 8,
          capeSwing: -4,
        }),
      }),
    ]),
  }),
  run: Object.freeze({
    label: 'Run',
    loop: true,
    frames: Object.freeze([
      Object.freeze({
        duration: 0.1,
        values: Object.freeze({
          bodyLean: 8,
          headTilt: -3,
          pelvisLift: -2,
          pelvisTilt: -5,
          shoulderTilt: 4,
          hipSwing: -4,
          armLeft: 30,
          forearmLeft: -18,
          armRight: -34,
          forearmRight: 20,
          kneeLeft: 4,
          kneeRight: 18,
          footLeftX: -22,
          footLeftY: 1,
          footRightX: 20,
          footRightY: -1,
          footLeftAngle: 16,
          footRightAngle: -12,
          weaponSwing: -14,
          capeSwing: 24,
        }),
      }),
      Object.freeze({
        duration: 0.1,
        values: Object.freeze({
          bodyLean: 6,
          headTilt: -1,
          pelvisLift: 2,
          pelvisTilt: 3,
          shoulderTilt: 2,
          hipSwing: -1,
          armLeft: 10,
          forearmLeft: -20,
          armRight: -12,
          forearmRight: 18,
          kneeLeft: 12,
          kneeRight: 10,
          footLeftX: -10,
          footLeftY: -2,
          footRightX: 14,
          footRightY: 5,
          footLeftAngle: 6,
          footRightAngle: 6,
          weaponSwing: -6,
          capeSwing: 12,
        }),
      }),
      Object.freeze({
        duration: 0.1,
        values: Object.freeze({
          bodyLean: 5,
          headTilt: 1,
          pelvisLift: 4,
          pelvisTilt: 5,
          shoulderTilt: -1,
          hipSwing: 3,
          armLeft: -12,
          forearmLeft: -8,
          armRight: 14,
          forearmRight: 4,
          kneeLeft: 22,
          kneeRight: 8,
          footLeftX: 8,
          footLeftY: 8,
          footRightX: 2,
          footRightY: -4,
          footLeftAngle: -12,
          footRightAngle: 10,
          weaponSwing: 4,
          capeSwing: -8,
        }),
      }),
      Object.freeze({
        duration: 0.1,
        values: Object.freeze({
          bodyLean: 8,
          headTilt: 2,
          pelvisLift: -2,
          pelvisTilt: 5,
          shoulderTilt: -4,
          hipSwing: 4,
          armLeft: -34,
          forearmLeft: 22,
          armRight: 32,
          forearmRight: -18,
          kneeLeft: 18,
          kneeRight: 4,
          footLeftX: 20,
          footLeftY: -1,
          footRightX: -22,
          footRightY: 1,
          footLeftAngle: -12,
          footRightAngle: 16,
          weaponSwing: 18,
          capeSwing: -24,
        }),
      }),
      Object.freeze({
        duration: 0.1,
        values: Object.freeze({
          bodyLean: 6,
          headTilt: 0,
          pelvisLift: 2,
          pelvisTilt: -3,
          shoulderTilt: -2,
          hipSwing: 1,
          armLeft: -12,
          forearmLeft: 18,
          armRight: 10,
          forearmRight: -20,
          kneeLeft: 10,
          kneeRight: 12,
          footLeftX: 14,
          footLeftY: 5,
          footRightX: -10,
          footRightY: -2,
          footLeftAngle: 6,
          footRightAngle: 6,
          weaponSwing: 8,
          capeSwing: -12,
        }),
      }),
      Object.freeze({
        duration: 0.1,
        values: Object.freeze({
          bodyLean: 5,
          headTilt: -2,
          pelvisLift: 4,
          pelvisTilt: -5,
          shoulderTilt: 1,
          hipSwing: -3,
          armLeft: 14,
          forearmLeft: 4,
          armRight: -12,
          forearmRight: -8,
          kneeLeft: 8,
          kneeRight: 22,
          footLeftX: 2,
          footLeftY: -4,
          footRightX: 8,
          footRightY: 8,
          footLeftAngle: 10,
          footRightAngle: -12,
          weaponSwing: -2,
          capeSwing: 8,
        }),
      }),
    ]),
  }),
  jump: Object.freeze({
    label: 'Jump',
    loop: false,
    frames: Object.freeze([
      Object.freeze({
        duration: 0.16,
        values: Object.freeze({
          bodyLean: 5,
          headTilt: -4,
          pelvisLift: 8,
          pelvisTilt: -2,
          shoulderTilt: 2,
          armLeft: 20,
          forearmLeft: -12,
          armRight: 18,
          forearmRight: -8,
          kneeLeft: 20,
          kneeRight: 18,
          footLeftX: -8,
          footLeftY: 16,
          footRightX: 10,
          footRightY: 14,
          footLeftAngle: -10,
          footRightAngle: -4,
          weaponSwing: 14,
          capeSwing: 20,
        }),
      }),
      Object.freeze({
        duration: 0.18,
        values: Object.freeze({
          bodyLean: 0,
          headTilt: 2,
          pelvisLift: 12,
          pelvisTilt: 1,
          shoulderTilt: -1,
          armLeft: 26,
          forearmLeft: -4,
          armRight: 24,
          forearmRight: -2,
          kneeLeft: 22,
          kneeRight: 20,
          footLeftX: -4,
          footLeftY: 22,
          footRightX: 6,
          footRightY: 20,
          footLeftAngle: -14,
          footRightAngle: -10,
          weaponSwing: 10,
          capeSwing: 28,
        }),
      }),
      Object.freeze({
        duration: 0.18,
        values: Object.freeze({
          bodyLean: -2,
          headTilt: 4,
          pelvisLift: 8,
          shoulderTilt: -3,
          hipSwing: 1,
          armLeft: 12,
          forearmLeft: 8,
          armRight: 16,
          forearmRight: 12,
          kneeLeft: 16,
          kneeRight: 18,
          footLeftX: -6,
          footLeftY: 18,
          footRightX: 8,
          footRightY: 16,
          footLeftAngle: 0,
          footRightAngle: -6,
          weaponSwing: 4,
          capeSwing: 14,
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
          headTilt: 6,
          pelvisLift: 6,
          shoulderTilt: -1,
          armLeft: -2,
          forearmLeft: 18,
          armRight: 10,
          forearmRight: 12,
          kneeLeft: 10,
          kneeRight: 12,
          footLeftX: -10,
          footLeftY: 8,
          footRightX: 10,
          footRightY: 10,
          footLeftAngle: 8,
          footRightAngle: 10,
          weaponSwing: 2,
          capeSwing: -10,
        }),
      }),
      Object.freeze({
        duration: 0.18,
        values: Object.freeze({
          bodyLean: -1,
          headTilt: 2,
          pelvisLift: 2,
          pelvisTilt: -1,
          shoulderTilt: 2,
          armLeft: 6,
          forearmLeft: 12,
          armRight: 14,
          forearmRight: 16,
          kneeLeft: 18,
          kneeRight: 20,
          footLeftX: -8,
          footLeftY: 12,
          footRightX: 8,
          footRightY: 14,
          footLeftAngle: -6,
          footRightAngle: -6,
          weaponSwing: -2,
          capeSwing: -18,
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
