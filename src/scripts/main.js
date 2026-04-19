import '../styles/main.css';
import { BGMManager } from './bgm-manager.js';
import { BGM_TRACK_LIBRARY } from './bgm-track-library.js';
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
  'scenario-overview',
  'scenario-prologue',
  'scenario-chapter-1',
  'scenario-chapter-2',
  'scenario-chapter-3',
  'scenario-ending',
  'audio-scenario-bgm',
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
  return BGM_TRACK_LIBRARY.find((track) => track.id === trackId);
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

function getAudioStatusText(snapshot) {
  if (!snapshot.supported) {
    return '이 브라우저는 Web Audio 렌더링을 지원하지 않습니다.';
  }

  switch (snapshot.status) {
    case 'rendering':
      return `${snapshot.pendingTrackTitle || '트랙'}을 브라우저에서 합성하고 있습니다.`;
    case 'playing':
      return `${snapshot.currentTrackTitle} 재생 중`;
    case 'stopped':
      return '재생이 멈췄습니다.';
    case 'error':
      return snapshot.errorMessage || '오디오를 준비하지 못했습니다.';
    default:
      return '재생 버튼을 눌러 첫 합성을 시작하세요.';
  }
}

function renderMusicSection(manager, onSelectDocument) {
  const consoleRoot = document.querySelector('[data-music-console]');
  const trackRoot = document.querySelector('[data-music-track-list]');

  if (!consoleRoot || !trackRoot) {
    return;
  }

  const snapshot = manager.getSnapshot();
  const activeTrack = getTrackById(snapshot.currentTrackId);
  const pendingTrack = getTrackById(snapshot.pendingTrackId);

  consoleRoot.innerHTML = `
    <div class="music-console__topline">
      <span class="eyebrow">Web Audio Score</span>
      <span class="music-console__status music-console__status--${snapshot.status}">
        ${getAudioStatusText(snapshot)}
      </span>
    </div>
    <div class="music-console__hero">
      <div>
        <p class="music-console__label">Now Playing</p>
        <h3>${activeTrack?.title ?? pendingTrack?.title ?? '대기 중'}</h3>
        <p class="music-console__copy">
          ${activeTrack?.summary ?? pendingTrack?.summary ?? '장면에 맞는 트랙을 선택하면 브라우저 안에서 직접 합성해 재생합니다.'}
        </p>
      </div>
      <div class="music-console__chips">
        <span>${activeTrack?.category ?? pendingTrack?.category ?? '시나리오 BGM'}</span>
        <span>${activeTrack?.chapter ?? pendingTrack?.chapter ?? '전체 문서 기반 설계'}</span>
        <span>${activeTrack ? `${activeTrack.tempo} BPM` : pendingTrack ? `${pendingTrack.tempo} BPM` : '10 Tracks'}</span>
      </div>
    </div>
    <div class="music-console__controls">
      <button
        type="button"
        class="music-action music-action--primary"
        data-audio-stop
        ${!snapshot.isPlaying ? 'disabled' : ''}
      >
        정지
      </button>
      <label class="music-volume">
        <span>볼륨</span>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value="${Math.round(snapshot.volume * 100)}"
          data-audio-volume
        />
        <strong>${Math.round(snapshot.volume * 100)}%</strong>
      </label>
      <button type="button" class="music-action" data-audio-open-doc>오디오 설계 문서</button>
    </div>
    <p class="music-console__note">
      모든 트랙은 <code>Web Audio API</code>로 합성되며, 한 번에 하나만 재생됩니다. 첫 재생 시 브라우저 정책 때문에 버튼 클릭이 필요합니다.
    </p>
  `;

  consoleRoot.querySelector('[data-audio-stop]')?.addEventListener('click', () => {
    manager.stop();
  });

  consoleRoot.querySelector('[data-audio-open-doc]')?.addEventListener('click', () => {
    onSelectDocument('audio-scenario-bgm');
  });

  consoleRoot.querySelector('[data-audio-volume]')?.addEventListener('input', (event) => {
    const target = event.currentTarget;

    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    manager.setVolume(Number(target.value) / 100);
  });

  trackRoot.innerHTML = BGM_TRACK_LIBRARY.map((track) => {
    const isActive = snapshot.currentTrackId === track.id && snapshot.isPlaying;
    const isPending = snapshot.pendingTrackId === track.id;
    const referenceTitles = track.scenarioRefs
      .map((documentId) => getDocumentById(documentId)?.title)
      .filter(Boolean)
      .slice(0, 3);

    return `
      <article class="music-card${isActive ? ' is-active' : ''}${isPending ? ' is-pending' : ''}">
        <div class="music-card__header">
          <div>
            <span class="music-card__category">${track.category}</span>
            <h3>${track.title}</h3>
          </div>
          <button
            type="button"
            class="music-action music-action--${isActive ? 'secondary' : 'primary'}"
            data-audio-play="${track.id}"
            ${!snapshot.supported || isPending ? 'disabled' : ''}
          >
            ${isPending ? '준비 중...' : isActive ? '재생 중' : '재생'}
          </button>
        </div>
        <p class="music-card__summary">${track.summary}</p>
        <dl class="music-card__meta">
          <div>
            <dt>챕터</dt>
            <dd>${track.chapter}</dd>
          </div>
          <div>
            <dt>분위기</dt>
            <dd>${track.mood}</dd>
          </div>
          <div>
            <dt>리듬</dt>
            <dd>${track.tempo} BPM · ${track.meter}/4</dd>
          </div>
        </dl>
        <div class="music-card__chips">
          ${track.useCases.map((item) => `<span>${item}</span>`).join('')}
        </div>
        <div class="music-card__footer">
          <span>${referenceTitles.join(' · ')}</span>
          <button type="button" class="music-link" data-audio-ref="${track.scenarioRefs[0]}">
            관련 문서 열기
          </button>
        </div>
      </article>
    `;
  }).join('');

  trackRoot.querySelectorAll('[data-audio-play]').forEach((button) => {
    button.addEventListener('click', () => {
      const trackId = button.getAttribute('data-audio-play');

      if (!trackId) {
        return;
      }

      if (snapshot.currentTrackId === trackId && snapshot.isPlaying) {
        manager.stop();
        return;
      }

      manager.playTrack(trackId);
    });
  });

  trackRoot.querySelectorAll('[data-audio-ref]').forEach((button) => {
    button.addEventListener('click', () => {
      const documentId = button.getAttribute('data-audio-ref');

      if (!documentId) {
        return;
      }

      onSelectDocument(documentId);
    });
  });
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
        <section class="spotlight-section" aria-label="이번 브랜치 바로가기">
          <div class="section-heading">
            <p class="eyebrow">Branch Focus</p>
            <h2>이번 브랜치에서 바로 볼 문서</h2>
            <p class="section-copy">
              메인 시나리오와 새로 추가한 오디오 설계 문서를 빠르게 오갈 수 있도록 묶었습니다.
            </p>
          </div>
          <div class="spotlight-grid" data-featured-links></div>
        </section>

        <section class="music-section" aria-label="시나리오 기반 음악">
          <div class="section-heading">
            <p class="eyebrow">Scenario Score</p>
            <h2>시나리오 기반 BGM 청취</h2>
            <p class="section-copy">
              문서에서 정리한 장면별 감정선을 기준으로 만든 트랙들입니다. 버튼을 누르면 브라우저 안에서 직접 합성해서 재생합니다.
            </p>
          </div>
          <div class="music-layout">
            <article class="music-console" data-music-console></article>
            <div class="music-track-grid" data-music-track-list></div>
          </div>
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
            <h2>스토리와 설정 문서 전체 보기</h2>
            <p class="section-copy">
              왼쪽 전체 목록과 위 빠른 열기를 함께 써서 챕터 문서, 설정 문서, 오디오 설계 문서를 오갈 수 있습니다.
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
  let bgmManager = null;

  const selectDocument = (documentId, { syncHash = true } = {}) => {
    activeDocumentId = getDocumentById(documentId)?.id ?? activeDocumentId;
    renderFeaturedDocuments(activeDocumentId, selectDocument);
    renderDocumentList(activeDocumentId, selectDocument);
    renderActiveDocument(activeDocumentId);

    if (syncHash) {
      syncLocationHash(activeDocumentId);
    }

    if (bgmManager) {
      renderMusicSection(bgmManager, selectDocument);
    }
  };

  createAppShell();

  bgmManager = new BGMManager({
    initialTrackId: 'echoes-of-tomorrow',
    initialVolume: 0.58,
    onStateChange: () => {
      renderMusicSection(bgmManager, selectDocument);
    },
  });

  selectDocument(activeDocumentId);
  renderMusicSection(bgmManager, selectDocument);

  window.addEventListener('hashchange', () => {
    const hashDocumentId = getDocumentIdFromHash();

    if (hashDocumentId && hashDocumentId !== activeDocumentId) {
      selectDocument(hashDocumentId, { syncHash: false });
    }
  });

  window.addEventListener(
    'beforeunload',
    () => {
      bgmManager?.destroy();
    },
    { once: true }
  );
}

bootstrap();
