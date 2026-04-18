import {
  createAnimationLibrary,
  getAnimationClip,
  getClipNames,
  getFramePose,
  POSE_CHANNELS,
  sampleAnimationClip,
  serializeAnimationLibrary,
  updateClipFrameValue,
} from './animation-data.js';
import { drawHumanoid, PLAYER_APPEARANCE } from './canvas-animation.js';

const editorCanvas = document.getElementById('editor-canvas');
const clipSelect = document.getElementById('clip-select');
const frameSlider = document.getElementById('frame-slider');
const terrainSelect = document.getElementById('terrain-select');
const playToggle = document.getElementById('play-toggle');
const resetClipButton = document.getElementById('reset-clip');
const frameStrip = document.getElementById('frame-strip');
const channelControls = document.getElementById('channel-controls');
const animationJson = document.getElementById('animation-json');
const editorStatus = document.getElementById('editor-status');

if (
  !(editorCanvas instanceof HTMLCanvasElement) ||
  !(clipSelect instanceof HTMLSelectElement) ||
  !(frameSlider instanceof HTMLInputElement) ||
  !(terrainSelect instanceof HTMLSelectElement) ||
  !(playToggle instanceof HTMLButtonElement) ||
  !(resetClipButton instanceof HTMLButtonElement) ||
  !(frameStrip instanceof HTMLDivElement) ||
  !(channelControls instanceof HTMLDivElement) ||
  !(animationJson instanceof HTMLTextAreaElement) ||
  !(editorStatus instanceof HTMLElement)
) {
  throw new Error('애니메이터 UI를 초기화할 수 없습니다.');
}

const context = editorCanvas.getContext('2d');

if (!context) {
  throw new Error('에디터 캔버스 렌더러를 만들 수 없습니다.');
}

const library = createAnimationLibrary();

const state = {
  clipName: getClipNames(library)[0] ?? 'idle',
  frameIndex: 0,
  terrainMode: terrainSelect.value,
  playing: false,
  elapsedSeconds: 0,
  lastFrame: performance.now(),
};

initialize();
requestAnimationFrame(loop);

function initialize() {
  for (const clipName of getClipNames(library)) {
    const option = document.createElement('option');
    option.value = clipName;
    option.textContent = library[clipName].label;
    clipSelect.append(option);
  }

  clipSelect.value = state.clipName;
  buildChannelControls();
  syncClipUi();
  syncExport();

  clipSelect.addEventListener('change', () => {
    state.clipName = clipSelect.value;
    state.frameIndex = 0;
    state.elapsedSeconds = 0;
    syncClipUi();
  });

  frameSlider.addEventListener('input', () => {
    state.frameIndex = Number(frameSlider.value);
    state.playing = false;
    playToggle.textContent = '재생 시작';
    refreshChannelControls();
    syncFrameStrip();
  });

  terrainSelect.addEventListener('change', () => {
    state.terrainMode = terrainSelect.value;
  });

  playToggle.addEventListener('click', () => {
    state.playing = !state.playing;
    state.lastFrame = performance.now();
    playToggle.textContent = state.playing ? '재생 중지' : '재생 시작';
  });

  resetClipButton.addEventListener('click', () => {
    library[state.clipName] = createAnimationLibrary()[state.clipName];
    state.frameIndex = 0;
    state.elapsedSeconds = 0;
    syncClipUi();
    syncExport();
  });

  window.addEventListener('resize', () => {
    resizeCanvas();
    render();
  });
}

function buildChannelControls() {
  channelControls.replaceChildren();

  for (const channel of POSE_CHANNELS) {
    const wrapper = document.createElement('div');
    wrapper.className = 'channel-control';

    const label = document.createElement('label');
    label.htmlFor = `channel-${channel.key}`;

    const labelText = document.createElement('span');
    labelText.textContent = channel.label;

    const output = document.createElement('output');
    output.id = `output-${channel.key}`;

    label.append(labelText, output);

    const input = document.createElement('input');
    input.id = `channel-${channel.key}`;
    input.type = 'range';
    input.min = String(channel.min);
    input.max = String(channel.max);
    input.step = String(channel.step);
    input.dataset.channel = channel.key;
    input.addEventListener('input', () => {
      updateClipFrameValue(
        library,
        state.clipName,
        state.frameIndex,
        channel.key,
        Number(input.value)
      );
      const outputTarget = document.getElementById(`output-${channel.key}`);
      if (outputTarget instanceof HTMLOutputElement) {
        outputTarget.value = input.value;
      }
      syncExport();
      syncFrameStrip();
    });

    wrapper.append(label, input);
    channelControls.append(wrapper);
  }
}

function syncClipUi() {
  const clip = getAnimationClip(library, state.clipName);
  frameSlider.max = String(Math.max(clip.frames.length - 1, 0));
  frameSlider.value = String(clamp(state.frameIndex, 0, clip.frames.length - 1));
  state.frameIndex = Number(frameSlider.value);
  syncFrameStrip();
  refreshChannelControls();
  syncExport();
}

function syncFrameStrip() {
  const clip = getAnimationClip(library, state.clipName);
  frameStrip.replaceChildren();

  clip.frames.forEach((frame, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = index === state.frameIndex ? 'frame-button is-active' : 'frame-button';
    button.textContent = `F${index + 1}`;
    button.title = `${frame.duration.toFixed(2)}s`;
    button.addEventListener('click', () => {
      state.frameIndex = index;
      state.playing = false;
      playToggle.textContent = '재생 시작';
      frameSlider.value = String(index);
      refreshChannelControls();
      syncFrameStrip();
    });
    frameStrip.append(button);
  });
}

function refreshChannelControls() {
  const clip = getAnimationClip(library, state.clipName);
  const pose = getFramePose(clip, state.frameIndex);

  for (const channel of POSE_CHANNELS) {
    const input = document.getElementById(`channel-${channel.key}`);
    const output = document.getElementById(`output-${channel.key}`);

    if (input instanceof HTMLInputElement) {
      input.value = String(pose[channel.key]);
    }

    if (output instanceof HTMLOutputElement) {
      output.value = String(pose[channel.key]);
    }
  }
}

function syncExport() {
  animationJson.value = serializeAnimationLibrary(library);
}

function loop(now) {
  const deltaSeconds = Math.min((now - state.lastFrame) / 1000, 1 / 30);
  state.lastFrame = now;

  if (state.playing) {
    state.elapsedSeconds += deltaSeconds;
  }

  render();
  requestAnimationFrame(loop);
}

function render() {
  const { width, height, dpr } = resizeCanvas();
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, editorCanvas.width, editorCanvas.height);
  context.setTransform(dpr, 0, 0, dpr, 0, 0);

  const groundY = height * 0.74;
  const footHeights = getPreviewTerrain(state.terrainMode);
  const pose = state.playing
    ? sampleAnimationClip(getAnimationClip(library, state.clipName), state.elapsedSeconds)
    : getFramePose(getAnimationClip(library, state.clipName), state.frameIndex);

  drawEditorBackground(width, height, groundY);
  drawPreviewGround(width, groundY, footHeights);
  drawHumanoid(context, {
    x: width * 0.5,
    baseY: groundY,
    pose,
    appearance: PLAYER_APPEARANCE,
    facing: 'right',
    scale: 1.12,
    footHeights,
    shadowOpacity: 0.22,
  });

  editorStatus.textContent = `${state.clipName} · frame ${state.frameIndex + 1}`;
}

function drawEditorBackground(width, height, groundY) {
  const gradient = context.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#d7e7f5');
  gradient.addColorStop(1, '#eef4fa');
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  context.strokeStyle = 'rgba(22, 56, 89, 0.09)';
  context.lineWidth = 1;

  for (let x = 0; x <= width; x += 32) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, height);
    context.stroke();
  }

  for (let y = 0; y <= height; y += 32) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.stroke();
  }

  context.fillStyle = 'rgba(17, 39, 58, 0.08)';
  context.fillRect(0, groundY, width, height - groundY);
}

function drawPreviewGround(width, groundY, footHeights) {
  context.strokeStyle = 'rgba(35, 73, 106, 0.5)';
  context.lineWidth = 3;
  context.beginPath();

  switch (state.terrainMode) {
    case 'step':
      context.moveTo(width * 0.24, groundY - footHeights.left);
      context.lineTo(width * 0.46, groundY - footHeights.left);
      context.lineTo(width * 0.46, groundY - footHeights.right);
      context.lineTo(width * 0.76, groundY - footHeights.right);
      break;
    case 'slope':
      context.moveTo(width * 0.24, groundY - footHeights.left);
      context.lineTo(width * 0.76, groundY - footHeights.right);
      break;
    default:
      context.moveTo(width * 0.22, groundY);
      context.lineTo(width * 0.78, groundY);
      break;
  }

  context.stroke();
}

function getPreviewTerrain(mode) {
  switch (mode) {
    case 'step':
      return {
        left: 10,
        right: -6,
      };
    case 'slope':
      return {
        left: 12,
        right: -10,
      };
    default:
      return {
        left: 0,
        right: 0,
      };
  }
}

function resizeCanvas() {
  const width = Math.max(320, Math.round(editorCanvas.clientWidth));
  const height = Math.max(240, Math.round(editorCanvas.clientHeight));
  const dpr = window.devicePixelRatio || 1;

  if (
    editorCanvas.width !== Math.round(width * dpr) ||
    editorCanvas.height !== Math.round(height * dpr)
  ) {
    editorCanvas.width = Math.round(width * dpr);
    editorCanvas.height = Math.round(height * dpr);
  }

  return {
    width,
    height,
    dpr,
  };
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
