import '../styles/main.css';
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

function renderActiveDocument(documentId) {
  const activeDocument = storyDocuments.find((item) => item.id === documentId) ?? storyDocuments[0];
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

function createAppShell() {
  app.innerHTML = `
    <div class="page-shell">
      <header class="hero">
        <div class="hero__content">
          <p class="eyebrow">Issue #55 · Scenario Docs</p>
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
            <p class="eyebrow">Lore Documents</p>
            <h2>스토리와 설정 문서</h2>
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
  let activeDocumentId = storyDocuments[0]?.id ?? '';

  const selectDocument = (documentId) => {
    activeDocumentId = documentId;
    renderDocumentList(activeDocumentId, selectDocument);
    renderActiveDocument(activeDocumentId);
  };

  createAppShell();
  selectDocument(activeDocumentId);
}

bootstrap();
