import {
  createPlayerAssetManifest,
  createPlayerMotionSet,
  PLAYER_PARTS,
  PLAYER_SPRITE_CONCEPT,
  PLAYER_SPRITE_PALETTE,
  SPRITE_CANVAS,
} from './player-sprite-data.mjs';
import {
  distanceBetween,
  drawRigOverlay,
  drawSpriteToCanvas,
  drawStudioBackdrop,
  encodePng,
  findPartAtPoint,
  renderSpriteFrame,
} from './player-sprite-renderer.mjs';

const INSPECTOR_FIELDS = Object.freeze([
  { key: 'x', label: 'X', min: -24, max: 24, step: 0.1 },
  { key: 'y', label: 'Y', min: -12, max: 40, step: 0.1 },
  { key: 'rotation', label: '각도', min: -180, max: 180, step: 1 },
  { key: 'scaleX', label: '가로', min: 0.5, max: 1.8, step: 0.02 },
  { key: 'scaleY', label: '세로', min: 0.5, max: 1.8, step: 0.02 },
]);

const formatValue = (value) => Number.parseFloat(value).toFixed(2).replace(/\.00$/, '');
const deepClone = (value) => JSON.parse(JSON.stringify(value));

function createPaletteMarkup() {
  return Object.entries(PLAYER_SPRITE_PALETTE)
    .map(
      ([key, color]) => `
        <li class="palette-chip">
          <span class="palette-chip__swatch" style="background:${color}"></span>
          <span>${key}</span>
        </li>
      `
    )
    .join('');
}

function createMotionSummary(manifest) {
  return manifest.motions
    .map(
      (motion) => `
        <article class="motion-card">
          <strong>${motion.label}</strong>
          <span>${motion.frames.length} frames · ${motion.fps}fps</span>
          <p>${motion.description}</p>
        </article>
      `
    )
    .join('');
}

function createAssetGallery(manifest) {
  return manifest.motions
    .map(
      (motion) => `
        <article class="asset-group">
          <header class="asset-group__header">
            <div>
              <strong>${motion.label}</strong>
              <span>${motion.description}</span>
            </div>
            <span>${motion.frames.length} frames</span>
          </header>
          <div class="asset-grid">
            ${motion.frames
              .map(
                (frame) => `
                  <figure class="asset-card">
                    <img
                      src="./assets/sprites/player/${frame.fileName}"
                      alt="${motion.label} ${frame.fileName}"
                      loading="lazy"
                      width="96"
                      height="96"
                    />
                    <figcaption>${frame.fileName}</figcaption>
                  </figure>
                `
              )
              .join('')}
          </div>
        </article>
      `
    )
    .join('');
}

export function renderPlayerSpriteStudioSection() {
  const manifest = createPlayerAssetManifest();

  return `
    <section class="studio-section" aria-labelledby="sprite-studio-heading">
      <div class="section-heading">
        <p class="eyebrow">Hero Motion Lab</p>
        <h2 id="sprite-studio-heading">주인공 도트 모션 세트와 프레임 애니메이터</h2>
      </div>

      <div class="studio-overview">
        <article class="studio-card">
          <span class="studio-card__eyebrow">Preset</span>
          <h3>${PLAYER_SPRITE_CONCEPT.name}</h3>
          <p>${PLAYER_SPRITE_CONCEPT.summary}</p>
        </article>
        <article class="studio-card">
          <span class="studio-card__eyebrow">Silhouette</span>
          <h3>공용 주인공 프리셋</h3>
          <p>${PLAYER_SPRITE_CONCEPT.silhouette}</p>
        </article>
        <article class="studio-card">
          <span class="studio-card__eyebrow">Deliverables</span>
          <h3>${manifest.frameCount}개 프레임</h3>
          <p><code>assets/sprites/player/</code>에 저장되는 PNG 프레임과 JSON 매니페스트를 함께 관리합니다.</p>
        </article>
      </div>

      <div class="motion-grid">
        ${createMotionSummary(manifest)}
      </div>

      <div class="studio-shell" data-sprite-studio>
        <div class="studio-main">
          <div class="studio-toolbar">
            <div class="motion-tabs" data-motion-tabs role="tablist" aria-label="모션 목록"></div>
            <div class="playback-controls">
              <button type="button" class="ghost-button" data-action="toggle-play">재생</button>
              <button type="button" class="ghost-button" data-action="toggle-onion">오니언 스킨 켜짐</button>
              <label class="fps-control">
                <span>FPS</span>
                <input type="range" min="4" max="16" step="1" value="8" data-fps-input />
                <output data-fps-output>8</output>
              </label>
            </div>
          </div>

          <div class="studio-canvas-layout">
            <section class="canvas-panel">
              <header class="canvas-panel__header">
                <strong>프레임 에디터</strong>
                <span>드래그로 위치, 노랑 핸들로 회전, 주황 핸들로 크기 조절</span>
              </header>
              <canvas
                class="rig-canvas"
                width="${SPRITE_CANVAS.width * SPRITE_CANVAS.previewScale}"
                height="${SPRITE_CANVAS.height * SPRITE_CANVAS.previewScale}"
                data-rig-canvas
              ></canvas>
            </section>
            <section class="canvas-panel canvas-panel--pixel">
              <header class="canvas-panel__header">
                <strong>픽셀 출력 미리보기</strong>
                <span>실제 저장되는 48x48 프레임을 확대 표시</span>
              </header>
              <canvas
                class="pixel-canvas"
                width="${SPRITE_CANVAS.width * 6}"
                height="${SPRITE_CANVAS.height * 6}"
                data-pixel-canvas
              ></canvas>
            </section>
          </div>

          <div class="frame-strip" data-frame-strip aria-label="프레임 목록"></div>
          <p class="frame-note" data-frame-note></p>
        </div>

        <aside class="studio-sidebar">
          <section class="sidebar-card">
            <header class="sidebar-card__header">
              <strong>요소 선택</strong>
              <span>프레임마다 개별 조정 가능</span>
            </header>
            <div class="part-list" data-part-list></div>
          </section>

          <section class="sidebar-card">
            <header class="sidebar-card__header">
              <strong>선택 요소 인스펙터</strong>
              <span data-selected-part-label>몸통</span>
            </header>
            <div class="inspector-fields" data-inspector-fields></div>
          </section>

          <section class="sidebar-card">
            <header class="sidebar-card__header">
              <strong>에디터 액션</strong>
              <span>현재 모션과 프레임 기준</span>
            </header>
            <div class="action-stack">
              <button type="button" class="ghost-button" data-action="reset-part">현재 파트 초기화</button>
              <button type="button" class="ghost-button" data-action="copy-prev-frame">이전 프레임 복사</button>
              <button type="button" class="ghost-button" data-action="reset-motion">현재 모션 초기화</button>
              <button type="button" class="ghost-button" data-action="download-frame">현재 프레임 PNG 저장</button>
              <button type="button" class="ghost-button" data-action="copy-motion-json">현재 모션 JSON 복사</button>
            </div>
            <p class="studio-status" data-status aria-live="polite"></p>
          </section>

          <section class="sidebar-card">
            <header class="sidebar-card__header">
              <strong>팔레트</strong>
              <span>반향해 프로토타입 색 구성</span>
            </header>
            <ul class="palette-list">
              ${createPaletteMarkup()}
            </ul>
          </section>
        </aside>
      </div>
    </section>

    <section class="asset-gallery-section">
      <div class="section-heading">
        <p class="eyebrow">Exported Assets</p>
        <h2>커밋된 PNG 프레임 세트</h2>
      </div>
      <div class="asset-gallery">
        ${createAssetGallery(manifest)}
      </div>
    </section>
  `;
}

export function initializePlayerSpriteStudio(root) {
  if (!root) {
    return;
  }

  const originalMotionSet = createPlayerMotionSet();
  const editableMotionSet = createPlayerMotionSet();
  const state = {
    selectedMotionId: 'idle',
    selectedFrameIndex: 0,
    selectedPartId: 'torso',
    isPlaying: false,
    onionSkinEnabled: true,
    fps: editableMotionSet.idle.fps,
    dragState: null,
    lastTimestamp: 0,
  };

  const motionTabs = root.querySelector('[data-motion-tabs]');
  const frameStrip = root.querySelector('[data-frame-strip]');
  const frameNote = root.querySelector('[data-frame-note]');
  const partList = root.querySelector('[data-part-list]');
  const inspectorFields = root.querySelector('[data-inspector-fields]');
  const status = root.querySelector('[data-status]');
  const selectedPartLabel = root.querySelector('[data-selected-part-label]');
  const fpsInput = root.querySelector('[data-fps-input]');
  const fpsOutput = root.querySelector('[data-fps-output]');
  const rigCanvas = root.querySelector('[data-rig-canvas]');
  const pixelCanvas = root.querySelector('[data-pixel-canvas]');
  const rigContext = rigCanvas.getContext('2d');
  const pixelContext = pixelCanvas.getContext('2d');
  const rigScale = SPRITE_CANVAS.previewScale;
  const pixelScale = 6;

  const getCurrentMotion = () => editableMotionSet[state.selectedMotionId];
  const getCurrentFrame = () => getCurrentMotion().frames[state.selectedFrameIndex];
  const getSelectedPart = () => getCurrentFrame().parts[state.selectedPartId];

  function setStatus(message) {
    status.textContent = message;
  }

  function renderMotionTabs() {
    motionTabs.innerHTML = Object.entries(editableMotionSet)
      .map(
        ([motionId, motion]) => `
          <button
            type="button"
            role="tab"
            class="motion-tab${motionId === state.selectedMotionId ? ' is-active' : ''}"
            aria-selected="${motionId === state.selectedMotionId}"
            data-motion-id="${motionId}"
          >
            <strong>${motion.label}</strong>
            <span>${motion.frames.length}f</span>
          </button>
        `
      )
      .join('');

    motionTabs.querySelectorAll('[data-motion-id]').forEach((button) => {
      button.addEventListener('click', () => {
        state.selectedMotionId = button.getAttribute('data-motion-id') ?? state.selectedMotionId;
        state.selectedFrameIndex = 0;
        state.fps = getCurrentMotion().fps;
        fpsInput.value = String(state.fps);
        fpsOutput.textContent = String(state.fps);
        render();
      });
    });
  }

  function renderFrameStrip() {
    const currentMotion = getCurrentMotion();

    frameStrip.innerHTML = currentMotion.frames
      .map(
        (frame, index) => `
          <button
            type="button"
            class="frame-chip${index === state.selectedFrameIndex ? ' is-active' : ''}"
            data-frame-index="${index}"
            title="${frame.note || frame.fileName}"
          >
            <span>${String(index).padStart(2, '0')}</span>
            <strong>${frame.fileName}</strong>
          </button>
        `
      )
      .join('');

    frameStrip.querySelectorAll('[data-frame-index]').forEach((button) => {
      button.addEventListener('click', () => {
        state.selectedFrameIndex = Number(button.getAttribute('data-frame-index')) || 0;
        render();
      });
    });

    frameNote.textContent = getCurrentFrame().note || '노트 없음';
  }

  function renderPartList() {
    partList.innerHTML = PLAYER_PARTS.map(
      (part) => `
        <button
          type="button"
          class="part-chip${part.id === state.selectedPartId ? ' is-active' : ''}"
          data-part-id="${part.id}"
        >
          ${part.label}
        </button>
      `
    ).join('');

    partList.querySelectorAll('[data-part-id]').forEach((button) => {
      button.addEventListener('click', () => {
        state.selectedPartId = button.getAttribute('data-part-id') ?? state.selectedPartId;
        render();
      });
    });

    selectedPartLabel.textContent =
      PLAYER_PARTS.find((part) => part.id === state.selectedPartId)?.label ?? state.selectedPartId;
  }

  function renderInspector() {
    const part = getSelectedPart();

    inspectorFields.innerHTML = INSPECTOR_FIELDS.map(
      (field) => `
        <label class="inspector-field">
          <div class="inspector-field__meta">
            <span>${field.label}</span>
            <output>${formatValue(part[field.key])}</output>
          </div>
          <input
            type="range"
            min="${field.min}"
            max="${field.max}"
            step="${field.step}"
            value="${part[field.key]}"
            data-field-key="${field.key}"
          />
        </label>
      `
    ).join('');

    inspectorFields.querySelectorAll('[data-field-key]').forEach((input) => {
      input.addEventListener('input', () => {
        const field = input.getAttribute('data-field-key');

        if (!field) {
          return;
        }

        getSelectedPart()[field] = Number(input.value);
        renderCanvases();
        renderInspector();
      });
    });
  }

  function drawRigCanvas() {
    drawStudioBackdrop(rigContext, rigScale);

    const currentMotion = getCurrentMotion();
    const previousFrame =
      currentMotion.frames[
        (state.selectedFrameIndex - 1 + currentMotion.frames.length) % currentMotion.frames.length
      ];
    const nextFrame =
      currentMotion.frames[(state.selectedFrameIndex + 1) % currentMotion.frames.length];

    if (state.onionSkinEnabled) {
      drawSpriteToCanvas(
        rigContext,
        renderSpriteFrame(previousFrame, { alphaMultiplier: 0.12 }),
        rigScale,
        {
          clear: false,
        }
      );
      drawSpriteToCanvas(
        rigContext,
        renderSpriteFrame(nextFrame, { alphaMultiplier: 0.08 }),
        rigScale,
        {
          clear: false,
        }
      );
    }

    const currentRender = renderSpriteFrame(getCurrentFrame());
    drawSpriteToCanvas(rigContext, currentRender, rigScale, { clear: false });
    drawRigOverlay(rigContext, currentRender, rigScale, state.selectedPartId);

    return currentRender;
  }

  function drawPixelCanvas() {
    drawStudioBackdrop(pixelContext, pixelScale);
    const renderResult = renderSpriteFrame(getCurrentFrame());
    drawSpriteToCanvas(pixelContext, renderResult, pixelScale, { clear: false });
  }

  function renderCanvases() {
    drawRigCanvas();
    drawPixelCanvas();
  }

  function render() {
    renderMotionTabs();
    renderFrameStrip();
    renderPartList();
    renderInspector();
    renderCanvases();
    root.querySelector('[data-action="toggle-play"]').textContent = state.isPlaying
      ? '정지'
      : '재생';
    root.querySelector('[data-action="toggle-onion"]').textContent = state.onionSkinEnabled
      ? '오니언 스킨 켜짐'
      : '오니언 스킨 꺼짐';
  }

  function stepPlayback(timestamp) {
    if (!state.isPlaying) {
      state.lastTimestamp = timestamp;
      requestAnimationFrame(stepPlayback);
      return;
    }

    const frameDuration = 1000 / state.fps;

    if (timestamp - state.lastTimestamp >= frameDuration) {
      state.selectedFrameIndex = (state.selectedFrameIndex + 1) % getCurrentMotion().frames.length;
      state.lastTimestamp = timestamp;
      render();
    }

    requestAnimationFrame(stepPlayback);
  }

  function downloadCurrentFrame() {
    const renderResult = renderSpriteFrame(getCurrentFrame());
    const bytes = encodePng(renderResult.width, renderResult.height, renderResult.pixels);
    const blob = new Blob([bytes], { type: 'image/png' });
    const link = document.createElement('a');

    link.href = URL.createObjectURL(blob);
    link.download = getCurrentFrame().fileName;
    link.click();
    URL.revokeObjectURL(link.href);
    setStatus(`${getCurrentFrame().fileName} 저장을 시작했습니다.`);
  }

  async function copyMotionJson() {
    const currentMotion = getCurrentMotion();
    const payload = {
      motionId: state.selectedMotionId,
      label: currentMotion.label,
      fps: state.fps,
      frames: currentMotion.frames,
    };

    await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setStatus(`${state.selectedMotionId} 모션 JSON을 클립보드에 복사했습니다.`);
  }

  function copyPreviousFrame() {
    const currentMotion = getCurrentMotion();
    const sourceIndex = Math.max(0, state.selectedFrameIndex - 1);
    const sourceFrame = currentMotion.frames[sourceIndex];

    currentMotion.frames[state.selectedFrameIndex].parts = deepClone(sourceFrame.parts);
    setStatus(`${sourceFrame.fileName}의 포즈를 현재 프레임에 복사했습니다.`);
    render();
  }

  function resetSelectedPart() {
    const baseline =
      originalMotionSet[state.selectedMotionId].frames[state.selectedFrameIndex].parts[
        state.selectedPartId
      ];

    getCurrentFrame().parts[state.selectedPartId] = deepClone(baseline);
    setStatus(`${state.selectedPartId} 파트를 원본 값으로 되돌렸습니다.`);
    render();
  }

  function resetCurrentMotion() {
    editableMotionSet[state.selectedMotionId] = deepClone(
      originalMotionSet[state.selectedMotionId]
    );
    state.selectedFrameIndex = 0;
    setStatus(`${state.selectedMotionId} 모션 전체를 원본으로 되돌렸습니다.`);
    render();
  }

  function updatePointer(cursorPoint, dragState) {
    const selectedPart = getCurrentFrame().parts[dragState.partId];

    if (dragState.mode === 'move') {
      selectedPart.x = Number(
        (dragState.origin.x + (cursorPoint.x - dragState.startPoint.x)).toFixed(2)
      );
      selectedPart.y = Number(
        (dragState.origin.y + (cursorPoint.y - dragState.startPoint.y)).toFixed(2)
      );
      return;
    }

    if (dragState.mode === 'rotate') {
      const angle =
        (Math.atan2(cursorPoint.y - dragState.anchor.y, cursorPoint.x - dragState.anchor.x) * 180) /
          Math.PI +
        90;

      selectedPart.rotation = Number(angle.toFixed(1));
      return;
    }

    if (dragState.mode === 'scale') {
      const startDistance = Math.max(
        0.001,
        distanceBetween(dragState.startPoint, dragState.anchor)
      );
      const currentDistance = Math.max(0.2, distanceBetween(cursorPoint, dragState.anchor));
      const factor = Number((currentDistance / startDistance).toFixed(2));

      selectedPart.scaleX = Number(
        Math.max(0.5, Math.min(1.8, dragState.origin.scaleX * factor)).toFixed(2)
      );
      selectedPart.scaleY = Number(
        Math.max(0.5, Math.min(1.8, dragState.origin.scaleY * factor)).toFixed(2)
      );
    }
  }

  function pointerToSpritePoint(event) {
    const rect = rigCanvas.getBoundingClientRect();

    return {
      x: ((event.clientX - rect.left) / rect.width) * SPRITE_CANVAS.width,
      y: ((event.clientY - rect.top) / rect.height) * SPRITE_CANVAS.height,
    };
  }

  rigCanvas.addEventListener('pointerdown', (event) => {
    const point = pointerToSpritePoint(event);
    const renderResult = renderSpriteFrame(getCurrentFrame());
    const hit = findPartAtPoint(renderResult.geometry, point);

    if (!hit) {
      return;
    }

    state.selectedPartId = hit.partId;
    const part = getCurrentFrame().parts[hit.partId];
    const geometry = renderResult.geometry.find((item) => item.partId === hit.partId);

    state.dragState = {
      partId: hit.partId,
      mode: hit.mode,
      startPoint: point,
      origin: deepClone(part),
      anchor: geometry?.anchor ?? { x: part.x, y: part.y },
    };

    rigCanvas.setPointerCapture(event.pointerId);
    render();
  });

  rigCanvas.addEventListener('pointermove', (event) => {
    if (!state.dragState) {
      return;
    }

    updatePointer(pointerToSpritePoint(event), state.dragState);
    render();
  });

  rigCanvas.addEventListener('pointerup', (event) => {
    if (state.dragState) {
      setStatus(`${state.selectedPartId} 파트를 수정했습니다.`);
    }

    state.dragState = null;
    rigCanvas.releasePointerCapture(event.pointerId);
  });

  rigCanvas.addEventListener('pointerleave', () => {
    if (!state.dragState) {
      return;
    }

    state.dragState = null;
    render();
  });

  root.querySelectorAll('[data-action]').forEach((button) => {
    button.addEventListener('click', async () => {
      const action = button.getAttribute('data-action');

      if (action === 'toggle-play') {
        state.isPlaying = !state.isPlaying;
        state.lastTimestamp = performance.now();
        render();
        return;
      }

      if (action === 'toggle-onion') {
        state.onionSkinEnabled = !state.onionSkinEnabled;
        render();
        return;
      }

      if (action === 'download-frame') {
        downloadCurrentFrame();
        return;
      }

      if (action === 'copy-motion-json') {
        try {
          await copyMotionJson();
        } catch {
          setStatus('클립보드 복사에 실패했습니다.');
        }
        return;
      }

      if (action === 'copy-prev-frame') {
        copyPreviousFrame();
        return;
      }

      if (action === 'reset-part') {
        resetSelectedPart();
        return;
      }

      if (action === 'reset-motion') {
        resetCurrentMotion();
      }
    });
  });

  fpsInput.addEventListener('input', () => {
    state.fps = Number(fpsInput.value);
    fpsOutput.textContent = fpsInput.value;
  });

  fpsInput.value = String(state.fps);
  fpsOutput.textContent = String(state.fps);
  setStatus('프레임을 직접 다듬은 뒤 PNG나 JSON으로 꺼낼 수 있습니다.');
  render();
  requestAnimationFrame(stepPlayback);
}
