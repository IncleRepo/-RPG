# Scenario Soundtrack Assets

이 폴더는 이슈 `#59` 작업으로 제작한 시나리오 기반 BGM 결과물을 담는다.

## 포함 파일

- `01-lost-dawn-overture.ogg`
- `02-mirajin-everdusk.ogg`
- `03-clocktower-fracture.ogg`
- `04-glasssalt-expanse.ogg`
- `05-saltstorm-rescue-run.ogg`
- `06-kadel-inversion.ogg`
- `07-ceiling-heart-crisis.ogg`
- `08-whisperfruit-canopy.ogg`
- `09-spinal-archive-truth.ogg`
- `10-dawnsalvager-skirmish.ogg`
- `11-abyssal-choir-collapse.ogg`
- `12-restored-dawn.ogg`
- `13-unbound-tomorrow.ogg`
- `14-bellbound-vigil.ogg`
- `manifest.json`

## 재생성

```bash
python tools/audio/generate_soundtrack.py
```

## 관리 기준

- 포맷: `ogg`
- 샘플레이트: `16000Hz`
- 메타데이터: `manifest.json`
- 장면별 배치 문서: `src/content/audio/scenario-bgm-plan.md`

## 원본성 메모

트랙은 저장소 내부 생성 스크립트로 프로젝트용 모티프와 패턴을 조합해 제작했다.
기존 상용 곡의 멜로디를 직접 차용하지 않았고,
시나리오 문서의 정서 곡선에 맞춰 독립적으로 구성했다.
