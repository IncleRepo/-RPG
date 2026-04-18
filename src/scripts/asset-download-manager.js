const DATABASE_NAME = 'rpg-asset-downloads';
const DATABASE_VERSION = 1;
const STORE_NAME = 'downloads';

const SUPPORTED_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'webp', 'avif', 'py', 'mp3']);
const MIME_TYPE_TO_EXTENSION = new Map([
  ['image/png', 'png'],
  ['image/jpeg', 'jpg'],
  ['image/webp', 'webp'],
  ['image/avif', 'avif'],
  ['audio/mpeg', 'mp3'],
  ['audio/mp3', 'mp3'],
  ['text/x-python', 'py'],
  ['text/plain', 'py'],
  ['application/x-python-code', 'py'],
  ['application/octet-stream', null],
]);

export function initAssetDownloadManager() {
  const urlInput = document.getElementById('asset-download-url');
  const downloadButton = document.getElementById('asset-download-button');
  const toggleButton = document.getElementById('asset-download-toggle');
  const statusElement = document.getElementById('asset-download-status');
  const listPanel = document.getElementById('asset-download-list-panel');
  const countElement = document.getElementById('asset-download-count');
  const emptyElement = document.getElementById('asset-download-empty');
  const listElement = document.getElementById('asset-download-list');

  if (
    !(urlInput instanceof HTMLInputElement) ||
    !(downloadButton instanceof HTMLButtonElement) ||
    !(toggleButton instanceof HTMLButtonElement) ||
    !(statusElement instanceof HTMLElement) ||
    !(listPanel instanceof HTMLElement) ||
    !(countElement instanceof HTMLElement) ||
    !(emptyElement instanceof HTMLElement) ||
    !(listElement instanceof HTMLUListElement)
  ) {
    return;
  }

  const store = createDownloadStore();

  let downloads = [];
  let listVisible = false;
  let storageEnabled = store.supported;

  const renderToggleButton = () => {
    const count = downloads.length;
    const label = listVisible ? '다운로드 목록 숨기기' : '다운로드 목록 보기';
    toggleButton.textContent = `${label} (${count})`;
    toggleButton.setAttribute('aria-expanded', `${listVisible}`);
  };

  const setStatus = (message, tone = 'neutral') => {
    statusElement.textContent = message;
    statusElement.dataset.tone = tone;
  };

  const setBusy = (busy) => {
    downloadButton.disabled = busy;
    urlInput.disabled = busy;
  };

  const renderList = () => {
    countElement.textContent = `저장된 파일 ${downloads.length}개`;
    emptyElement.hidden = downloads.length > 0;
    listElement.replaceChildren();

    if (downloads.length === 0) {
      renderToggleButton();
      return;
    }

    const fragment = document.createDocumentFragment();

    for (const download of downloads) {
      const item = document.createElement('li');
      item.className = 'asset-download-item';

      const content = document.createElement('div');
      const title = document.createElement('strong');
      title.textContent = download.fileName;

      const source = document.createElement('p');
      source.textContent = download.sourceUrl;

      const meta = document.createElement('div');
      meta.className = 'asset-download-meta';

      const typeChip = document.createElement('span');
      typeChip.textContent = getDisplayType(download.extension);

      const sizeChip = document.createElement('span');
      sizeChip.textContent = formatBytes(download.size);

      const timeChip = document.createElement('span');
      timeChip.textContent = formatTimestamp(download.createdAt);

      meta.append(typeChip, sizeChip, timeChip);
      content.append(title, source, meta);

      const actions = document.createElement('div');
      actions.className = 'asset-download-item-actions';

      const redownloadButton = document.createElement('button');
      redownloadButton.type = 'button';
      redownloadButton.className = 'button-secondary';
      redownloadButton.textContent = '다시 저장';
      redownloadButton.addEventListener('click', () => {
        triggerBrowserDownload(download.blob, download.fileName);
        setStatus(`${download.fileName} 파일을 다시 다운로드했습니다.`, 'success');
      });

      const sourceLink = document.createElement('a');
      sourceLink.className = 'asset-download-link';
      sourceLink.href = download.sourceUrl;
      sourceLink.target = '_blank';
      sourceLink.rel = 'noreferrer noopener';
      sourceLink.textContent = '원본 링크 열기';

      actions.append(redownloadButton, sourceLink);
      item.append(content, actions);
      fragment.append(item);
    }

    listElement.append(fragment);
    renderToggleButton();
  };

  const refreshDownloads = async () => {
    if (!storageEnabled) {
      downloads = [];
      renderList();
      return;
    }

    try {
      downloads = await store.listDownloads();
      renderList();
    } catch {
      storageEnabled = false;
      downloads = [];
      renderList();
      setStatus(
        '브라우저 저장소를 열 수 없어 다운로드 목록 저장 없이 직접 다운로드만 가능합니다.',
        'error'
      );
    }
  };

  const toggleList = async () => {
    listVisible = !listVisible;
    listPanel.hidden = !listVisible;
    renderToggleButton();

    if (listVisible) {
      setStatus('저장된 다운로드 목록을 불러오는 중입니다.', 'progress');
      await refreshDownloads();
      setStatus(
        downloads.length > 0
          ? `저장된 파일 ${downloads.length}개를 불러왔습니다.`
          : '아직 저장된 파일이 없습니다.',
        'neutral'
      );
    }
  };

  const handleDownload = async () => {
    const rawUrl = urlInput.value.trim();

    if (!rawUrl) {
      setStatus('다운로드할 링크를 먼저 입력하세요.', 'error');
      urlInput.focus();
      return;
    }

    let assetUrl;

    try {
      assetUrl = new URL(rawUrl, window.location.href);
    } catch {
      setStatus('올바른 URL 형식이 아닙니다.', 'error');
      urlInput.focus();
      return;
    }

    if (!['http:', 'https:'].includes(assetUrl.protocol)) {
      setStatus('http 또는 https 링크만 지원합니다.', 'error');
      return;
    }

    const hintedExtension = getFileExtension(assetUrl.pathname);
    if (hintedExtension && !SUPPORTED_EXTENSIONS.has(hintedExtension)) {
      setStatus(
        '지원되지 않는 파일 형식입니다. PNG, JPEG, WEBP, AVIF, PY, MP3만 가능합니다.',
        'error'
      );
      return;
    }

    setBusy(true);
    setStatus('파일을 다운로드하고 있습니다.', 'progress');

    try {
      const response = await fetch(assetUrl.toString());

      if (!response.ok) {
        throw new Error(`다운로드에 실패했습니다. (${response.status})`);
      }

      const blob = await response.blob();
      const fileDefinition = resolveFileDefinition(assetUrl, response, blob);

      if (storageEnabled) {
        await store.saveDownload({
          fileName: fileDefinition.fileName,
          extension: fileDefinition.extension,
          mimeType: fileDefinition.mimeType,
          size: blob.size,
          sourceUrl: assetUrl.toString(),
          createdAt: new Date().toISOString(),
          blob,
        });
        await refreshDownloads();
      }

      triggerBrowserDownload(blob, fileDefinition.fileName);
      setStatus(`${fileDefinition.fileName} 파일을 다운로드했습니다.`, 'success');
    } catch (error) {
      setStatus(getDownloadErrorMessage(error), 'error');
    } finally {
      setBusy(false);
    }
  };

  downloadButton.addEventListener('click', () => {
    void handleDownload();
  });

  toggleButton.addEventListener('click', () => {
    void toggleList();
  });

  urlInput.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();
    void handleDownload();
  });

  if (!storageEnabled) {
    setStatus(
      '이 브라우저는 저장된 다운로드 목록을 지원하지 않아 직접 다운로드만 가능합니다.',
      'error'
    );
  }

  void refreshDownloads();
}

function createDownloadStore() {
  if (typeof indexedDB === 'undefined') {
    return {
      supported: false,
      async listDownloads() {
        return [];
      },
      async saveDownload() {},
    };
  }

  let databasePromise;

  const getDatabase = () => {
    if (!databasePromise) {
      databasePromise = openDatabase();
    }

    return databasePromise;
  };

  return {
    supported: true,
    async listDownloads() {
      const database = await getDatabase();
      const transaction = database.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const downloads = await requestToPromise(store.getAll());
      await transactionToPromise(transaction);

      return downloads.sort(
        (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
      );
    },
    async saveDownload(record) {
      const database = await getDatabase();
      const transaction = database.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      await requestToPromise(store.add(record));
      await transactionToPromise(transaction);
    },
  };
}

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.addEventListener('upgradeneeded', () => {
      const database = request.result;

      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        });
      }
    });

    request.addEventListener('success', () => {
      resolve(request.result);
    });

    request.addEventListener('error', () => {
      reject(request.error ?? new Error('다운로드 저장소를 열 수 없습니다.'));
    });
  });
}

function requestToPromise(request) {
  return new Promise((resolve, reject) => {
    request.addEventListener('success', () => {
      resolve(request.result);
    });

    request.addEventListener('error', () => {
      reject(request.error ?? new Error('요청 처리 중 오류가 발생했습니다.'));
    });
  });
}

function transactionToPromise(transaction) {
  return new Promise((resolve, reject) => {
    transaction.addEventListener('complete', () => {
      resolve();
    });

    transaction.addEventListener('error', () => {
      reject(transaction.error ?? new Error('저장소 작업을 완료할 수 없습니다.'));
    });

    transaction.addEventListener('abort', () => {
      reject(transaction.error ?? new Error('저장소 작업이 중단되었습니다.'));
    });
  });
}

function resolveFileDefinition(assetUrl, response, blob) {
  const contentDispositionName = extractFilenameFromContentDisposition(
    response.headers.get('content-disposition')
  );
  const headerMimeType = extractMimeType(response.headers.get('content-type'));
  const blobMimeType = extractMimeType(blob.type);
  const rawFileName = contentDispositionName || decodeUrlPathName(assetUrl.pathname) || 'asset';
  const sanitizedFileName = sanitizeFileName(rawFileName);
  const fileExtension =
    getFileExtension(sanitizedFileName) ||
    extensionFromMimeType(blobMimeType) ||
    extensionFromMimeType(headerMimeType);

  if (!fileExtension || !SUPPORTED_EXTENSIONS.has(fileExtension)) {
    throw new Error('지원되지 않는 파일 형식입니다. PNG, JPEG, WEBP, AVIF, PY, MP3만 가능합니다.');
  }

  const fileName = ensureFileNameHasExtension(sanitizedFileName || 'asset', fileExtension);

  return {
    fileName,
    extension: fileExtension,
    mimeType: blobMimeType || headerMimeType || mimeTypeFromExtension(fileExtension),
  };
}

function extractFilenameFromContentDisposition(headerValue) {
  if (!headerValue) {
    return '';
  }

  const utf8Match = headerValue.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match) {
    try {
      return decodeURIComponent(utf8Match[1]);
    } catch {
      return utf8Match[1];
    }
  }

  const plainMatch = headerValue.match(/filename="?([^";]+)"?/i);
  return plainMatch ? plainMatch[1] : '';
}

function decodeUrlPathName(pathname) {
  const segments = pathname.split('/').filter(Boolean);
  const lastSegment = segments.at(-1);

  if (!lastSegment) {
    return '';
  }

  try {
    return decodeURIComponent(lastSegment);
  } catch {
    return lastSegment;
  }
}

function sanitizeFileName(fileName) {
  return fileName.replace(/[\\/:*?"<>|]+/g, '-').trim();
}

function getFileExtension(fileName) {
  const parts = fileName.toLowerCase().split('.');
  return parts.length > 1 ? (parts.at(-1) ?? '') : '';
}

function ensureFileNameHasExtension(fileName, extension) {
  const currentExtension = getFileExtension(fileName);
  const bareName = currentExtension ? fileName.slice(0, -(currentExtension.length + 1)) : fileName;
  const safeName = bareName.trim() || 'asset';

  return `${safeName}.${extension}`;
}

function extractMimeType(contentType) {
  return contentType?.split(';')[0].trim().toLowerCase() ?? '';
}

function extensionFromMimeType(contentType) {
  return MIME_TYPE_TO_EXTENSION.get(contentType) ?? '';
}

function mimeTypeFromExtension(extension) {
  switch (extension) {
    case 'png':
      return 'image/png';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'webp':
      return 'image/webp';
    case 'avif':
      return 'image/avif';
    case 'mp3':
      return 'audio/mpeg';
    case 'py':
      return 'text/x-python';
    default:
      return 'application/octet-stream';
  }
}

function triggerBrowserDownload(blob, fileName) {
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = fileName;
  anchor.rel = 'noopener';
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => {
    URL.revokeObjectURL(objectUrl);
  }, 1000);
}

function getDownloadErrorMessage(error) {
  if (error instanceof Error) {
    if (error.name === 'TypeError') {
      return '브라우저에서 해당 링크를 직접 가져오지 못했습니다. CORS 허용 여부와 링크 주소를 확인하세요.';
    }

    return error.message;
  }

  return '다운로드 중 알 수 없는 오류가 발생했습니다.';
}

function getDisplayType(extension) {
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'JPEG';
    default:
      return extension.toUpperCase();
  }
}

function formatBytes(size) {
  if (!Number.isFinite(size) || size <= 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  const exponent = Math.min(Math.floor(Math.log(size) / Math.log(1024)), units.length - 1);
  const value = size / 1024 ** exponent;
  const digits = exponent === 0 ? 0 : value >= 10 ? 1 : 2;

  return `${value.toFixed(digits)} ${units[exponent]}`;
}

function formatTimestamp(isoString) {
  const date = new Date(isoString);

  if (Number.isNaN(date.getTime())) {
    return '시간 정보 없음';
  }

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
