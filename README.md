# RPG 프로젝트

브라우저에서 실행되는 2D RPG 프로젝트입니다.

HTML, CSS, JavaScript를 사용해 이동, 맵, 전투, UI 같은 핵심 시스템을 차근차근 구현합니다.

## 프로젝트 개요

- 장르: 2D RPG
- 플랫폼: 웹 브라우저
- 기술 스택: HTML, CSS, JavaScript, Vite

## 구현 목표

- 플레이어 이동
- 맵과 오브젝트 배치
- 적 조우
- 턴제 전투 프로토타입
- HUD 및 메뉴 UI
- 게임 상태 데이터 관리

## 시작하기

```bash
npm install
npm run start
```

## 스크립트

```bash
npm run start
npm run lint
npm run lint:fix
npm run format
npm run format:check
```

## 폴더 구조

```text
.
|- assets/
|- src/
|  |- scripts/
|  `- styles/
|- index.html
`- package.json
```

## 개발 순서

1. 플레이어 이동과 카메라
2. 맵 렌더링과 충돌 처리
3. NPC와 상호작용
4. 전투 시스템
5. 인벤토리와 장비
6. 저장과 불러오기

## 참고

- 게임 로직은 `src/scripts`
- 스타일은 `src/styles`
- 이미지, 사운드 같은 리소스는 `assets`
