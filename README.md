# RPG 프로젝트

브라우저에서 실행되는 2D RPG 프로젝트입니다.

현재 플레이 화면은 캔버스 기반으로 렌더링되며, 캐릭터는 본 리그와 키프레임 클립으로 애니메이션됩니다. 플레이어와 NPC 모두 같은 리그를 공유하고, 지형 샘플을 이용해 발 위치를 보정하는 간단한 IK가 적용됩니다.

## 게임 접속

- GitHub Pages: https://inclerepo.github.io/-RPG/

## 프로젝트 개요

- 장르: 2D RPG
- 플랫폼: 웹 브라우저
- 기술 스택: HTML, CSS, JavaScript, Vite

## 주요 페이지

- `index.html`: 캔버스 기반 게임 런타임
- `animator.html`: 프레임 기반 본 애니메이션 에디터
- `physics-lab.html`: 플레이어 충돌/점프와 가장자리 발 IK를 기능 단위로 확인하는 테스트 페이지

## 시작하기

```bash
npm install
npm run start
```

## 스크립트

```bash
npm run start
npm run build
npm run lint
npm run lint:fix
npm run format
npm run format:check
```

## 구현 범위

- 캔버스 기반 배경, 지형, 캐릭터 렌더링
- 키프레임 클립 기반 플레이어/NPC 애니메이션
- 지형 높이 샘플을 사용하는 발 IK 보정
- 런타임과 동일한 리그를 미리보는 애니메이터 페이지
- 런타임과 같은 물리 코어와 발판 지지 기준을 검증하는 Physics Lab 페이지

## 폴더 구조

```text
.
|- assets/
|- src/
|  |- scripts/
|  |  `- game/
|  `- styles/
|- animator.html
|- index.html
|- physics-lab.html
`- package.json
```

## 참고

- 게임 로직은 `src/scripts`
- 스타일은 `src/styles`
- 이미지, 사운드 같은 리소스는 `assets`
