import '../styles/main.css';
import { soundtrackTracks } from './audio-tracks.js';
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
  'core-systems',
  'audio-scenario-plan',
  'scenario-overview',
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

function createAudioState() {
  return {
    activeTrackId: soundtrackTracks[0]?.id ?? '',
    isPlaying: false,
  };
}

function getTrackById(trackId) {
  return soundtrackTracks.find((track) => track.id === trackId);
}

function renderSoundtrackPlayer(audioState) {
  const container = document.querySelector('[data-soundtrack-player]');
  const audioElement = document.querySelector('[data-soundtrack-element]');
  const activeTrack = getTrackById(audioState.activeTrackId) ?? soundtrackTracks[0];

  if (!container || !audioElement || !activeTrack) {
    return;
  }

  container.innerHTML = `
    <div class="soundtrack-player__content">
      <p class="eyebrow">Music Player</p>
      <h3>${activeTrack.koreanTitle}</h3>
      <p>${activeTrack.summary}</p>
      <dl class="soundtrack-player__meta">
        <div>
          <dt>분류</dt>
          <dd>${activeTrack.category}</dd>
        </div>
        <div>
          <dt>사용 장면</dt>
          <dd>${activeTrack.sceneUse}</dd>
        </div>
      </dl>
    </div>
    <div class="soundtrack-player__status">
      <span class="viewer-meta__badge viewer-meta__badge--${activeTrack.accent}">
        ${audioState.isPlaying ? '재생 중' : '준비됨'}
      </span>
      <span class="viewer-meta__file">${activeTrack.fileName}</span>
    </div>
  `;

  audioElement.setAttribute('aria-label', `${activeTrack.koreanTitle} 재생기`);
}

function renderSoundtrackTrackList(audioState) {
  const container = document.querySelector('[data-soundtrack-list]');

  if (!container) {
    return;
  }

  container.innerHTML = soundtrackTracks
    .map(
      (track) => `
        <article class="audio-card audio-card--${track.accent}${track.id === audioState.activeTrackId ? ' is-active' : ''}">
          <div class="audio-card__meta">
            <span class="document-card__category">${track.category}</span>
            <span>${track.durationLabel}</span>
          </div>
          <h3>${track.koreanTitle}</h3>
          <p>${track.summary}</p>
          <dl class="audio-card__details">
            <div>
              <dt>챕터</dt>
              <dd>${track.chapters}</dd>
            </div>
            <div>
              <dt>장면</dt>
              <dd>${track.sceneUse}</dd>
            </div>
            <div>
              <dt>정서</dt>
              <dd>${track.mood}</dd>
            </div>
            <div>
              <dt>주요 악기</dt>
              <dd>${track.instrumentation}</dd>
            </div>
          </dl>
          <div class="audio-card__actions">
            <button type="button" class="audio-card__button" data-audio-toggle="${track.id}">
              ${track.id === audioState.activeTrackId && audioState.isPlaying ? '일시정지' : '재생'}
            </button>
            <a class="audio-card__link" href="${track.src}" download>
              파일 받기
            </a>
          </div>
        </article>
      `
    )
    .join('');
}

function createAppShell() {
  app.innerHTML = `
    <div class="page-shell">
      <header class="hero">
        <div class="hero__content">
          <p class="eyebrow">Issue #59 · Scenario Soundtrack</p>
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
              메인 시나리오, 캐릭터 설정, 그리고 새로 추가한 시나리오 기반 BGM 설계안을 빠르게
              열 수 있도록 묶었습니다.
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

        <section class="soundtrack-section" aria-label="시나리오 기반 음악">
          <div class="section-heading">
            <p class="eyebrow">Soundtrack</p>
            <h2>시나리오 기반 음악 아카이브</h2>
            <p class="section-copy">
              챕터 감정선과 장면 용도에 맞춰 설계한 BGM 8곡을 이 페이지에서 바로 들을 수 있습니다.
              플레이어는 하나만 두고 관리해서 겹쳐 재생되지 않습니다.
            </p>
          </div>
          <div class="soundtrack-layout">
            <section class="soundtrack-player" data-soundtrack-player aria-live="polite"></section>
            <audio
              class="soundtrack-element"
              data-soundtrack-element
              controls
              preload="none"
            ></audio>
            <div class="soundtrack-grid" data-soundtrack-list></div>
          </div>
        </section>

        <section class="viewer-section">
          <div class="section-heading">
            <p class="eyebrow">Story Viewer</p>
            <h2>스토리와 설정 문서 전체 보기</h2>
            <p class="section-copy">
              왼쪽 전체 목록과 위 빠른 열기를 함께 써서 챕터 문서와 설정 문서를 오갈 수 있습니다.
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
  const audioState = createAudioState();

  const selectDocument = (documentId, { syncHash = true } = {}) => {
    activeDocumentId = getDocumentById(documentId)?.id ?? activeDocumentId;
    renderFeaturedDocuments(activeDocumentId, selectDocument);
    renderDocumentList(activeDocumentId, selectDocument);
    renderActiveDocument(activeDocumentId);

    if (syncHash) {
      syncLocationHash(activeDocumentId);
    }
  };

  createAppShell();
  const soundtrackElement = document.querySelector('[data-soundtrack-element]');
  selectDocument(activeDocumentId);
  renderSoundtrackPlayer(audioState);
  renderSoundtrackTrackList(audioState);

  const syncAudioUi = () => {
    renderSoundtrackPlayer(audioState);
    renderSoundtrackTrackList(audioState);

    document.querySelectorAll('[data-audio-toggle]').forEach((button) => {
      button.addEventListener('click', async () => {
        const trackId = button.getAttribute('data-audio-toggle');
        const track = getTrackById(trackId);

        if (!soundtrackElement || !track) {
          return;
        }

        if (audioState.activeTrackId !== track.id) {
          soundtrackElement.src = track.src;
          soundtrackElement.dataset.trackId = track.id;
          audioState.activeTrackId = track.id;
        }

        if (soundtrackElement.paused) {
          try {
            await soundtrackElement.play();
          } catch {
            audioState.isPlaying = false;
            syncAudioUi();
          }
        } else if (soundtrackElement.dataset.trackId === track.id) {
          soundtrackElement.pause();
        } else {
          soundtrackElement.pause();
          soundtrackElement.src = track.src;
          soundtrackElement.dataset.trackId = track.id;

          try {
            await soundtrackElement.play();
          } catch {
            audioState.isPlaying = false;
            syncAudioUi();
          }
        }
      });
    });
  };

  if (soundtrackElement) {
    const firstTrack = getTrackById(audioState.activeTrackId);

    if (firstTrack) {
      soundtrackElement.src = firstTrack.src;
      soundtrackElement.dataset.trackId = firstTrack.id;
    }

    soundtrackElement.addEventListener('play', () => {
      audioState.isPlaying = true;
      audioState.activeTrackId = soundtrackElement.dataset.trackId || audioState.activeTrackId;
      syncAudioUi();
    });

    soundtrackElement.addEventListener('pause', () => {
      audioState.isPlaying = false;
      syncAudioUi();
    });

    soundtrackElement.addEventListener('ended', () => {
      audioState.isPlaying = false;
      syncAudioUi();
    });
  }

  syncAudioUi();

  window.addEventListener('hashchange', () => {
    const hashDocumentId = getDocumentIdFromHash();

    if (hashDocumentId && hashDocumentId !== activeDocumentId) {
      selectDocument(hashDocumentId, { syncHash: false });
    }
  });
}

bootstrap();
