# AGENTS.md

이 문서는 이 저장소에서 작업하는 AI 에이전트용 작업 가이드입니다.

## 프로젝트 요약

- 프로젝트명: RPG 프로젝트
- 형태: 브라우저 기반 2D RPG
- 기술 스택: HTML, CSS, JavaScript, Vite
- 주요 범위: 플레이어 이동, 맵, 전투, UI, 게임 상태 관리

## 기본 원칙

- `main` 브랜치에 직접 push 하지 않습니다.
- 가능한 경우 이슈 기준으로 작업합니다.
- 한 PR은 하나의 명확한 목적만 가지게 합니다.
- 작은 단위로 수정하고, 항상 실행 가능한 상태를 유지합니다.
- 사용자가 만든 기존 변경 사항을 임의로 되돌리지 않습니다.

## 수행 가능한 작업

- 기능 개발
- 버그 수정
- 리팩터링
- 문서 수정
- 실행 및 정적 검사 확인
- 브랜치 작업 후 PR 생성

## 작업 절차

1. 관련 이슈를 확인합니다.
2. 작업 브랜치를 생성합니다.
3. 필요한 파일만 수정합니다.
4. 로컬에서 실행과 검사를 확인합니다.
5. 변경 내용을 커밋합니다.
6. 원격 브랜치에 push 합니다.
7. PR을 올리기 전에 최신 `main` 기준으로 rebase 합니다.
8. rebase 이후 전반적인 구현을 한 번 더 살펴보고 필요한 확인을 마칩니다.
9. PR을 생성합니다.

## 브랜치 네이밍

```text
feat/12-player-move
fix/21-map-collision
docs/30-readme-update
chore/41-tooling-cleanup
```

## 커밋 메시지

```text
feat: 플레이어 이동 추가
fix: 충돌 판정 수정
docs: README 정리
chore: 설정 파일 정리
refactor: 전투 상태 구조 개선
style: 코드 포맷 정리
test: 테스트 추가
```

## 자주 쓰는 명령어

```bash
npm install
npm run start
npm run lint
npm run lint:fix
npm run format
npm run format:check
```

## 폴더 역할

- `src/scripts`: 게임 로직
- `src/styles`: 스타일
- `assets`: 이미지, 사운드, 기타 리소스
- `index.html`: 진입 페이지

## 코드 수정 원칙

- 기존 구조를 먼저 이해한 뒤 수정합니다.
- 불필요한 대규모 변경을 피합니다.
- 관련 없는 변경을 같은 PR에 섞지 않습니다.
- UI 변경 시 실제 화면 기준으로 확인합니다.
- 코드 스타일은 Prettier와 ESLint 기준을 따릅니다.

## PR 작성 규칙

- PR 제목은 변경 목적이 바로 드러나게 작성합니다.
- 본문에는 변경 내용과 이유를 짧게 적습니다.
- 관련 이슈는 `Closes #번호`로 연결합니다.
- UI 변경이 있다면 스크린샷을 첨부합니다.
- PR을 올리기 전에 최신 `main` 기준으로 rebase 한 뒤 전반적인 구현을 한 번 더 확인합니다.
- PR 전 아래 항목을 확인합니다.

```text
npm run lint
npm run format:check
```

## 금지 사항

- `main` 직접 push
- 관련 없는 파일까지 같이 수정
- 사용자 변경 사항 임의 삭제
- 확인 없는 대규모 구조 변경
- lint 또는 format 실패 상태로 PR 생성

## 완료 기준

아래 조건을 만족하면 작업 완료로 봅니다.

- 요구 사항이 반영됨
- 로컬 실행 또는 정적 검사가 통과함
- 변경 범위가 명확함
- PR 설명이 이해 가능함
