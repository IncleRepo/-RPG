import '../styles/main.css';
import { BGMManager, bgmTrackCatalog } from './bgm-manager.js';
import {
  storyDocuments,
  storyHighlights,
  storyPillars,
  storyProject,
  storyTimeline,
} from './story-documents.js';

const app = document.querySelector('#app');

if (!app) {
  throw new Error('앱 루트 요소를 찾을 수 없습니다.');
}

const featuredDocumentIds = Object.freeze([
  'audio-score-map',
  'audio-web-audio-production',
  'scenario-prologue',
  'scenario-chapter-1',
  'scenario-chapter-2',
  'scenario-chapter-3',
  'scenario-ending',
  'characters',
]);

const featuredDocuments = Object.freeze(
  featuredDocumentIds
    .map((documentId) => storyDocuments.find((item) => item.id === documentId))
    .filter(Boolean)
);

function getDocumentById(documentId) {
  return storyDocuments.find((item) => item.id === documentId);
}

function getTrackById(trackId) {
  return bgmTrackCatalog.find((item) => item.id === trackId);
}

function getDocumentIdFromHash() {
  const hashValue = decodeURIComponent(window.location.hash.replace(/^#/, ''));
  return getDocumentById(hashValue) ? hashValue : '';
}

function syncLocationHash(documentId) {
  const nextHash = `#${documentId}`;

  if (window.location.hash !== nextHash) {
    window.history.replaceState(null, '', nextHash);
  }
}

function escapeHtml(text) {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatInline(text) {
  return escapeHtml(text)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

function markdownToHtml(markdown) {
  const lines = markdown.trim().split(/\r?\n/);
  const fragments = [];
  let paragraph = [];
  let listItems = [];
  let listTag = 'ul';
  let quoteLines = [];

  const flushParagraph = () => {
    if (!paragraph.length) {
      return;
    }

    fragments.push(`<p>${paragraph.map(formatInline).join('<br />')}</p>`);
    paragraph = [];
  };

  const flushList = () => {
    if (!listItems.length) {
      return;
    }

    const items = listItems.map((item) => `<li>${formatInline(item)}</li>`).join('');
    fragments.push(`<${listTag}>${items}</${listTag}>`);
    listItems = [];
    listTag = 'ul';
  };

  const flushQuote = () => {
    if (!quoteLines.length) {
      return;
    }

    fragments.push(
      `<blockquote><p>${quoteLines.map(formatInline).join('<br />')}</p></blockquote>`
    );
    quoteLines = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const headingMatch = line.match(/^(#{1,3})\s+(.*)$/);
    const unorderedMatch = line.match(/^-\s+(.*)$/);
    const orderedMatch = line.match(/^\d+\.\s+(.*)$/);
    const quoteMatch = line.match(/^>\s?(.*)$/);

    if (!line.trim()) {
      flushParagraph();
      flushList();
      flushQuote();
      continue;
    }

    if (line === '---') {
      flushParagraph();
      flushList();
      flushQuote();
      fragments.push('<hr />');
      continue;
    }

    if (headingMatch) {
      flushParagraph();
      flushList();
      flushQuote();
      const level = headingMatch[1].length;
      fragments.push(`<h${level}>${formatInline(headingMatch[2])}</h${level}>`);
      continue;
    }

    if (unorderedMatch) {
      flushParagraph();
      flushQuote();
      if (listTag !== 'ul' && listItems.length) {
        flushList();
      }

      listTag = 'ul';
      listItems.push(unorderedMatch[1]);
      continue;
    }

    if (orderedMatch) {
      flushParagraph();
      flushQuote();
      if (listTag !== 'ol' && listItems.length) {
        flushList();
      }

      listTag = 'ol';
      listItems.push(orderedMatch[1]);
      continue;
    }

    if (quoteMatch) {
      flushParagraph();
      flushList();
      quoteLines.push(quoteMatch[1]);
      continue;
    }

    paragraph.push(line);
  }

  flushParagraph();
  flushList();
  flushQuote();

  return fragments.join('');
}

function renderDocumentList(activeId, onSelect) {
  const nav = document.querySelector('[data-document-nav]');

  if (!nav) {
    return;
  }

  nav.innerHTML = storyDocuments
    .map(
      (document) => `
        <button
          type="button"
          class="document-card${document.id === activeId ? ' is-active' : ''}"
          data-document-trigger="${document.id}"
        >
          <span class="document-card__category">${document.category}</span>
          <strong>${document.title}</strong>
          <span>${document.summary}</span>
        </button>
      `
    )
    .join('');

  nav.querySelectorAll('[data-document-trigger]').forEach((button) => {
    button.addEventListener('click', () => {
      onSelect(button.getAttribute('data-document-trigger') || activeId);
    });
  });
}

function renderFeaturedDocuments(activeId, onSelect) {
  const container = document.querySelector('[data-featured-links]');

  if (!container) {
    return;
  }

  container.innerHTML = featuredDocuments
    .map(
      (document) => `
        <button
          type="button"
          class="spotlight-card spotlight-card--${document.accent}${document.id === activeId ? ' is-active' : ''}"
          data-featured-trigger="${document.id}"
        >
          <span class="spotlight-card__category">${document.category}</span>
          <strong>${document.title}</strong>
          <span>${document.summary}</span>
          <span class="spotlight-card__file">${document.fileName}</span>
        </button>
      `
    )
    .join('');

  container.querySelectorAll('[data-featured-trigger]').forEach((button) => {
    button.addEventListener('click', () => {
      onSelect(button.getAttribute('data-featured-trigger') || activeId);
    });
  });
}

function renderActiveDocument(documentId) {
  const activeDocument = getDocumentById(documentId) ?? storyDocuments[0];
  const viewer = document.querySelector('[data-document-viewer]');

  if (!viewer || !activeDocument) {
    return;
  }

  viewer.innerHTML = `
    <div class="viewer-meta">
      <span class="viewer-meta__badge viewer-meta__badge--${activeDocument.accent}">${activeDocument.category}</span>
      <span class="viewer-meta__file">${activeDocument.fileName}</span>
    </div>
    <header class="viewer-header">
      <h2>${activeDocument.title}</h2>
      <p>${activeDocument.summary}</p>
    </header>
    <article class="markdown-body">${markdownToHtml(activeDocument.content)}</article>
  `;
}

function renderAudioTrackGrid(activeTrackId, isPlaying, onPreview) {
  const container = document.querySelector('[data-audio-track-grid]');

  if (!container) {
    return;
  }

  container.innerHTML = bgmTrackCatalog
    .map((track) => {
      const isActive = track.id === activeTrackId;
      const buttonLabel = isPlaying && isActive ? '현재 재생 중' : '이 곡 듣기';

      return `
        <article class="audio-track-card audio-track-card--${track.accent}${isActive ? ' is-active' : ''}">
          <div class="audio-track-card__meta">
            <span>${track.chapter}</span>
            <span>${track.tempo} BPM · ${track.mode}</span>
          </div>
          <h3>${track.title}</h3>
          <p>${track.summary}</p>
          <p class="audio-track-card__usage">${track.usage}</p>
          <button
            type="button"
            class="audio-track-card__button"
            data-track-preview="${track.id}"
            ${isPlaying && isActive ? 'disabled' : ''}
          >
            ${buttonLabel}
          </button>
        </article>
      `;
    })
    .join('');

  container.querySelectorAll('[data-track-preview]').forEach((button) => {
    button.addEventListener('click', async () => {
      const trackId = button.getAttribute('data-track-preview');

      if (!trackId) {
        return;
      }

      await onPreview(trackId);
    });
  });
}

function renderAudioStatus(snapshot, activeTrackId) {
  const status = document.querySelector('[data-audio-status]');
  const toggleButton = document.querySelector('[data-audio-toggle]');
  const stopButton = document.querySelector('[data-audio-stop]');
  const volumeInput = document.querySelector('[data-audio-volume]');
  const activeTrack = getTrackById(activeTrackId);

  if (!status || !toggleButton || !stopButton || !volumeInput) {
    return;
  }

  if (!snapshot.supported) {
    status.innerHTML = `
      <p class="audio-now-playing__label">Web Audio Status</p>
      <strong>이 브라우저에서는 Web Audio API 미리듣기를 지원하지 않습니다.</strong>
      <p>문서만 확인할 수 있으며, 실제 청음은 지원 브라우저에서 진행해야 합니다.</p>
    `;
    toggleButton.disabled = true;
    stopButton.disabled = true;
    volumeInput.disabled = true;
    return;
  }

  status.innerHTML = `
    <p class="audio-now-playing__label">Now Playing</p>
    <strong>${snapshot.trackTitle}</strong>
    <p>${snapshot.chapter} · ${snapshot.usage}</p>
    <dl class="audio-now-playing__stats">
      <div>
        <dt>상태</dt>
        <dd>${snapshot.status}</dd>
      </div>
      <div>
        <dt>섹션</dt>
        <dd>${snapshot.section}</dd>
      </div>
      <div>
        <dt>템포</dt>
        <dd>${snapshot.tempo} BPM</dd>
      </div>
      <div>
        <dt>선택 트랙</dt>
        <dd>${activeTrack?.title ?? snapshot.trackTitle}</dd>
      </div>
    </dl>
    <p class="audio-now-playing__summary">${snapshot.summary}</p>
  `;

  toggleButton.disabled = snapshot.isPlaying;
  stopButton.disabled = !snapshot.isPlaying;
  volumeInput.disabled = false;
  volumeInput.value = String(Math.round(snapshot.volume * 100));
}

function createAppShell() {
  app.innerHTML = `
    <div class="page-shell">
      <header class="hero">
        <div class="hero__content">
          <p class="eyebrow">Issue #59 · Scenario BGM Suite</p>
          <h1>${storyProject.title}</h1>
          <p class="hero__subtitle">${storyProject.subtitle}</p>
          <p class="hero__pitch">${storyProject.pitch}</p>
        </div>
        <div class="hero__panel">
          <dl class="hero-stats">
            ${storyHighlights
              .map(
                (item) => `
                  <div>
                    <dt>${item.label}</dt>
                    <dd>${item.value}</dd>
                  </div>
                `
              )
              .join('')}
          </dl>
        </div>
      </header>

      <main class="layout">
        <section class="audio-section" aria-label="시나리오 BGM 아틀리에">
          <div class="section-heading">
            <p class="eyebrow">Scenario Score Atelier</p>
            <h2>장면별 BGM을 바로 청음할 수 있는 Web Audio 스위트</h2>
            <p class="section-copy">
              시나리오 문서를 읽고 정리한 트랙 세트를 브라우저에서 바로 확인할 수 있도록 붙였습니다.
              각 카드에서 곡을 재생하면 장면 용도와 감정 방향에 맞는 루프를 들을 수 있습니다.
            </p>
          </div>
          <div class="audio-layout">
            <aside class="audio-console">
              <div class="audio-console__heading">
                <p class="eyebrow">Live Preview</p>
                <h3>시나리오 기반 BGM 미리듣기</h3>
              </div>
              <div class="audio-now-playing" data-audio-status></div>
              <div class="audio-controls">
                <button type="button" class="audio-button" data-audio-toggle>
                  선택 트랙 재생
                </button>
                <button type="button" class="audio-button audio-button--ghost" data-audio-stop>
                  정지
                </button>
                <label class="audio-volume">
                  <span>볼륨</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value="42"
                    data-audio-volume
                  />
                </label>
              </div>
            </aside>
            <div class="audio-track-grid" data-audio-track-grid></div>
          </div>
        </section>

        <section class="spotlight-section" aria-label="이번 브랜치 바로가기">
          <div class="section-heading">
            <p class="eyebrow">Branch Focus</p>
            <h2>이번 브랜치에서 바로 볼 문서와 오디오 설계</h2>
            <p class="section-copy">
              오디오 기획 문서와 메인 챕터 문서를 같은 화면에서 오가며 트랙 맵을 바로 확인할 수 있게 묶었습니다.
            </p>
          </div>
          <div class="spotlight-grid" data-featured-links></div>
        </section>

        <section class="info-grid" aria-label="핵심 기둥">
          ${storyPillars
            .map(
              (pillar) => `
                <article class="info-card">
                  <h2>${pillar.title}</h2>
                  <p>${pillar.text}</p>
                </article>
              `
            )
            .join('')}
        </section>

        <section class="timeline-section" aria-label="타임라인">
          <div class="section-heading">
            <p class="eyebrow">World Flow</p>
            <h2>세계 사건 흐름</h2>
          </div>
          <div class="timeline">
            ${storyTimeline
              .map(
                (item) => `
                  <article class="timeline__item">
                    <strong>${item.era}</strong>
                    <p>${item.detail}</p>
                  </article>
                `
              )
              .join('')}
          </div>
        </section>

        <section class="viewer-section">
          <div class="section-heading">
            <p class="eyebrow">Story Viewer</p>
            <h2>스토리, 설정, 오디오 문서 전체 보기</h2>
            <p class="section-copy">
              왼쪽 전체 목록과 위 빠른 열기를 함께 써서 시나리오 문서와 BGM 설계 문서를 오갈 수 있습니다.
            </p>
          </div>
          <div class="viewer-layout">
            <nav class="document-nav" data-document-nav aria-label="문서 목록"></nav>
            <section class="document-viewer" data-document-viewer aria-live="polite"></section>
          </div>
        </section>
      </main>
    </div>
  `;
}

function bootstrap() {
  let activeDocumentId =
    getDocumentIdFromHash() || featuredDocuments[0]?.id || storyDocuments[0]?.id || '';
  let activeTrackId = bgmTrackCatalog[0]?.id || '';

  const bgmManager = new BGMManager({
    initialTrackId: activeTrackId,
    onStateChange: (snapshot) => {
      activeTrackId = snapshot.trackId;
      renderAudioStatus(snapshot, activeTrackId);
      renderAudioTrackGrid(activeTrackId, snapshot.isPlaying, previewTrack);
    },
  });

  const selectDocument = (documentId, { syncHash = true } = {}) => {
    activeDocumentId = getDocumentById(documentId)?.id ?? activeDocumentId;
    renderFeaturedDocuments(activeDocumentId, selectDocument);
    renderDocumentList(activeDocumentId, selectDocument);
    renderActiveDocument(activeDocumentId);

    if (syncHash) {
      syncLocationHash(activeDocumentId);
    }
  };

  const previewTrack = async (trackId) => {
    activeTrackId = trackId;
    renderAudioTrackGrid(activeTrackId, bgmManager.getSnapshot().isPlaying, previewTrack);
    await bgmManager.playTrack(trackId);
  };

  createAppShell();
  selectDocument(activeDocumentId);
  renderAudioStatus(bgmManager.getSnapshot(), activeTrackId);
  renderAudioTrackGrid(activeTrackId, false, previewTrack);

  const toggleButton = document.querySelector('[data-audio-toggle]');
  const stopButton = document.querySelector('[data-audio-stop]');
  const volumeInput = document.querySelector('[data-audio-volume]');

  toggleButton?.addEventListener('click', async () => {
    await bgmManager.playTrack(activeTrackId);
  });

  stopButton?.addEventListener('click', async () => {
    await bgmManager.stop();
    renderAudioStatus(bgmManager.getSnapshot(), activeTrackId);
    renderAudioTrackGrid(activeTrackId, false, previewTrack);
  });

  volumeInput?.addEventListener('input', (event) => {
    const nextVolume = Number(event.currentTarget?.value ?? 42) / 100;
    bgmManager.setVolume(nextVolume);
  });

  window.addEventListener('hashchange', () => {
    const hashDocumentId = getDocumentIdFromHash();

    if (hashDocumentId && hashDocumentId !== activeDocumentId) {
      selectDocument(hashDocumentId, { syncHash: false });
    }
  });

  window.addEventListener('beforeunload', () => {
    bgmManager.destroy();
  });
}

bootstrap();
