#!/usr/bin/env python3

from __future__ import annotations

import json
import math
import random
import shutil
import struct
import subprocess
import wave
from array import array
from pathlib import Path

SAMPLE_RATE = 16000
MASTER_GAIN = 0.9
OUTPUT_DIR = Path(__file__).resolve().parents[2] / "assets" / "audio"
TEMP_DIR = OUTPUT_DIR / ".build"

MODE_INTERVALS = {
    "ionian": [0, 2, 4, 5, 7, 9, 11],
    "dorian": [0, 2, 3, 5, 7, 9, 10],
    "aeolian": [0, 2, 3, 5, 7, 8, 10],
    "lydian": [0, 2, 4, 6, 7, 9, 11],
    "mixolydian": [0, 2, 4, 5, 7, 9, 10],
    "phrygian": [0, 1, 3, 5, 7, 8, 10],
}

STYLE_LIBRARY = {
    "overture": {
        "pad": "glass_pad",
        "bass": "round_bass",
        "arp": "star_bell",
        "lead": "breath_lead",
        "drums": "soft_pulse",
        "arp_pattern": [0, 1, 2, 1, 0, 2, 1, 3],
        "bass_pattern": [(0.0, 1.0, 0), (1.5, 0.5, 4), (2.0, 1.0, 0), (3.0, 0.75, 2)],
        "lead_density": 0.55,
        "drum_level": 0.25,
        "delay": (0.27, 0.28),
    },
    "harbor": {
        "pad": "warm_pad",
        "bass": "round_bass",
        "arp": "soft_bell",
        "lead": "hollow_lead",
        "drums": None,
        "arp_pattern": [0, 2, 1, 2, 0, 1, 2, 3],
        "bass_pattern": [(0.0, 1.0, 0), (2.0, 1.0, 4)],
        "lead_density": 0.25,
        "drum_level": 0.0,
        "delay": (0.31, 0.18),
    },
    "mystery": {
        "pad": "shadow_pad",
        "bass": "sub_bass",
        "arp": "glass_tick",
        "lead": "hollow_lead",
        "drums": "heartbeat",
        "arp_pattern": [0, 4, 2, 1, 0, 2, 4, 1],
        "bass_pattern": [(0.0, 2.0, 0), (2.75, 0.5, 4)],
        "lead_density": 0.2,
        "drum_level": 0.2,
        "delay": (0.34, 0.22),
    },
    "desert": {
        "pad": "sun_pad",
        "bass": "round_bass",
        "arp": "sand_pluck",
        "lead": "reed_lead",
        "drums": "steps",
        "arp_pattern": [0, 1, 2, 4, 2, 1, 0, 1],
        "bass_pattern": [(0.0, 0.75, 0), (1.0, 0.5, 4), (2.0, 0.75, 0), (3.0, 0.5, 2)],
        "lead_density": 0.45,
        "drum_level": 0.18,
        "delay": (0.23, 0.2),
    },
    "rescue": {
        "pad": "warm_pad",
        "bass": "punch_bass",
        "arp": "sand_pluck",
        "lead": "reed_lead",
        "drums": "run",
        "arp_pattern": [0, 2, 1, 2, 3, 2, 1, 2],
        "bass_pattern": [(0.0, 0.75, 0), (1.0, 0.5, 0), (2.0, 0.75, 4), (3.0, 0.5, 2)],
        "lead_density": 0.5,
        "drum_level": 0.42,
        "delay": (0.2, 0.16),
    },
    "city": {
        "pad": "glass_pad",
        "bass": "round_bass",
        "arp": "gear_pluck",
        "lead": "hollow_lead",
        "drums": "clock",
        "arp_pattern": [0, 1, 2, 3, 1, 2, 4, 2],
        "bass_pattern": [(0.0, 0.75, 0), (1.0, 0.75, 2), (2.0, 0.75, 4), (3.0, 0.5, 2)],
        "lead_density": 0.32,
        "drum_level": 0.2,
        "delay": (0.18, 0.17),
    },
    "crisis": {
        "pad": "shadow_pad",
        "bass": "punch_bass",
        "arp": "gear_pluck",
        "lead": "steel_lead",
        "drums": "drive",
        "arp_pattern": [0, 2, 4, 2, 1, 2, 4, 3],
        "bass_pattern": [(0.0, 0.75, 0), (1.0, 0.5, 4), (2.0, 0.75, 0), (2.75, 0.75, 2)],
        "lead_density": 0.6,
        "drum_level": 0.52,
        "delay": (0.18, 0.14),
    },
    "orchard": {
        "pad": "warm_pad",
        "bass": "round_bass",
        "arp": "soft_bell",
        "lead": "breath_lead",
        "drums": None,
        "arp_pattern": [0, 1, 2, 1, 3, 2, 1, 0],
        "bass_pattern": [(0.0, 1.0, 0), (2.0, 1.0, 4)],
        "lead_density": 0.35,
        "drum_level": 0.0,
        "delay": (0.29, 0.2),
    },
    "revelation": {
        "pad": "glass_pad",
        "bass": "sub_bass",
        "arp": "glass_tick",
        "lead": "breath_lead",
        "drums": "heartbeat",
        "arp_pattern": [0, 4, 1, 2, 0, 3, 1, 2],
        "bass_pattern": [(0.0, 1.5, 0), (2.0, 1.0, 4)],
        "lead_density": 0.4,
        "drum_level": 0.18,
        "delay": (0.33, 0.26),
    },
    "battle": {
        "pad": "shadow_pad",
        "bass": "punch_bass",
        "arp": "gear_pluck",
        "lead": "steel_lead",
        "drums": "battle",
        "arp_pattern": [0, 2, 1, 2, 4, 2, 1, 2],
        "bass_pattern": [(0.0, 0.75, 0), (1.0, 0.5, 0), (1.5, 0.5, 4), (2.0, 0.75, 0), (3.0, 0.5, 2)],
        "lead_density": 0.62,
        "drum_level": 0.55,
        "delay": (0.16, 0.12),
    },
    "finale": {
        "pad": "glass_pad",
        "bass": "punch_bass",
        "arp": "star_bell",
        "lead": "steel_lead",
        "drums": "finale",
        "arp_pattern": [0, 1, 2, 4, 3, 2, 1, 2],
        "bass_pattern": [(0.0, 0.75, 0), (1.0, 0.5, 4), (2.0, 0.75, 0), (2.75, 0.75, 5)],
        "lead_density": 0.68,
        "drum_level": 0.56,
        "delay": (0.22, 0.18),
    },
    "ending_a": {
        "pad": "warm_pad",
        "bass": "round_bass",
        "arp": "soft_bell",
        "lead": "breath_lead",
        "drums": "soft_pulse",
        "arp_pattern": [0, 1, 2, 3, 2, 1, 0, 1],
        "bass_pattern": [(0.0, 1.0, 0), (2.0, 1.0, 4)],
        "lead_density": 0.5,
        "drum_level": 0.16,
        "delay": (0.26, 0.18),
    },
    "ending_b": {
        "pad": "sun_pad",
        "bass": "round_bass",
        "arp": "sand_pluck",
        "lead": "reed_lead",
        "drums": None,
        "arp_pattern": [0, 2, 1, 0, 4, 2, 1, 0],
        "bass_pattern": [(0.0, 1.0, 0), (2.0, 1.0, 4)],
        "lead_density": 0.48,
        "drum_level": 0.0,
        "delay": (0.24, 0.17),
    },
    "ending_c": {
        "pad": "shadow_pad",
        "bass": "sub_bass",
        "arp": "star_bell",
        "lead": "breath_lead",
        "drums": "heartbeat",
        "arp_pattern": [0, 1, 4, 2, 0, 2, 1, 4],
        "bass_pattern": [(0.0, 1.5, 0), (2.0, 1.0, 4)],
        "lead_density": 0.42,
        "drum_level": 0.14,
        "delay": (0.32, 0.24),
    },
}

TRACKS = [
    {
        "id": "01-lost-dawn-overture",
        "title": "잃어버린 새벽 서곡",
        "category": "타이틀 / 메인 테마",
        "chapterUse": ["타이틀", "메인 테마 회귀 장면", "엔딩 크레딧 전환"],
        "description": "반향해 세계의 몽환성과 불길한 희망을 함께 잡는 메인 테마.",
        "sceneUse": "게임 시작, 장 제목 노출, 주요 종편 회수 뒤 메인 모티프 회귀",
        "mood": "몽환적, 서정적, 조용한 불안",
        "style": "overture",
        "tempo": 76,
        "tonic": 62,
        "mode": "lydian",
        "measures": 16,
        "progression": [0, 5, 3, 4, 0, 2, 4, 5, 0, 5, 3, 4, 0, 2, 1, 0],
        "motif": [(0.0, 1.0, 0), (1.0, 0.5, 2), (1.5, 1.0, 4), (2.75, 0.75, 1)],
    },
    {
        "id": "02-mirajin-everdusk",
        "title": "미라진의 영원한 황혼",
        "category": "프롤로그 허브 / 조사",
        "chapterUse": ["프롤로그"],
        "description": "새벽이 끊긴 항구의 정지감과 주민들의 불안을 담는 허브형 곡.",
        "sceneUse": "오프닝 직후 항구 조사, NPC 대화, 출항 전 정적",
        "mood": "정지된 시간, 죄책감, 쓸쓸함",
        "style": "harbor",
        "tempo": 68,
        "tonic": 57,
        "mode": "aeolian",
        "measures": 12,
        "progression": [0, 5, 2, 4, 0, 5, 3, 4, 0, 2, 5, 4],
        "motif": [(0.0, 0.75, 0), (1.0, 0.5, 2), (1.75, 0.75, 3), (2.75, 0.75, 1)],
    },
    {
        "id": "03-clocktower-fracture",
        "title": "시계탑 파열음",
        "category": "프롤로그 던전 / 미스터리",
        "chapterUse": ["프롤로그"],
        "description": "시계탑 내부, 백야의 개입, 새벽종 파손 확인 장면용 미스터리 트랙.",
        "sceneUse": "시계탑 내부 진입, 파문 기록기 복원, 새벽종 파손 확인",
        "mood": "균열, 수수께끼, 불길한 공명",
        "style": "mystery",
        "tempo": 64,
        "tonic": 49,
        "mode": "phrygian",
        "measures": 12,
        "progression": [0, 1, 4, 0, 0, 5, 4, 1, 0, 1, 5, 4],
        "motif": [(0.0, 0.5, 0), (0.75, 0.5, 1), (1.5, 0.75, 4), (2.75, 0.75, 1)],
    },
    {
        "id": "04-glasssalt-expanse",
        "title": "유리염 평원",
        "category": "챕터 1 탐험",
        "chapterUse": ["챕터 1"],
        "description": "메마른 사구를 횡단하며 구조와 탐험을 병행하는 장면용 곡.",
        "sceneUse": "유리염 사구 필드 탐험, 폐채굴 첨탑 접근, 생존자 탐색",
        "mood": "황량함, 추진력, 살아남으려는 의지",
        "style": "desert",
        "tempo": 88,
        "tonic": 52,
        "mode": "dorian",
        "measures": 12,
        "progression": [0, 3, 4, 0, 0, 5, 3, 4, 0, 3, 5, 4],
        "motif": [(0.0, 0.5, 0), (0.5, 0.5, 2), (1.5, 0.75, 4), (2.5, 0.5, 5), (3.0, 0.5, 4)],
    },
    {
        "id": "05-saltstorm-rescue-run",
        "title": "염폭풍 구조행",
        "category": "챕터 1 긴장 / 추적",
        "chapterUse": ["챕터 1", "프롤로그 탈출"],
        "description": "방어전과 추격, 긴박한 구조 판단을 밀어 주는 리듬형 곡.",
        "sceneUse": "방파제 탈출, 구조선 방어전, 시간폭풍 속 생존 연출",
        "mood": "절박함, 질주감, 현장성",
        "style": "rescue",
        "tempo": 112,
        "tonic": 57,
        "mode": "dorian",
        "measures": 12,
        "progression": [0, 3, 4, 0, 0, 5, 3, 4, 0, 3, 1, 4],
        "motif": [(0.0, 0.5, 0), (0.5, 0.5, 2), (1.0, 0.5, 4), (1.75, 0.5, 5), (2.5, 0.5, 4), (3.0, 0.5, 2)],
    },
    {
        "id": "06-kadel-inversion",
        "title": "거꾸로 선 카델",
        "category": "챕터 2 도시 / 정치",
        "chapterUse": ["챕터 2"],
        "description": "역중력 도시의 질서와 위화감을 함께 묶는 기계적 도시 테마.",
        "sceneUse": "카델 진입, 재상청 협상, 상하층 조사",
        "mood": "정교함, 통제, 숨은 긴장",
        "style": "city",
        "tempo": 94,
        "tonic": 60,
        "mode": "lydian",
        "measures": 12,
        "progression": [0, 1, 4, 0, 0, 5, 1, 4, 0, 1, 5, 4],
        "motif": [(0.0, 0.5, 0), (1.0, 0.5, 1), (1.5, 0.5, 4), (2.5, 0.5, 2), (3.0, 0.5, 1)],
    },
    {
        "id": "07-ceiling-heart-crisis",
        "title": "천정 심실 위기",
        "category": "챕터 2 위기 / 보스",
        "chapterUse": ["챕터 2"],
        "description": "도시 코어 붕괴와 종편 회수 직전의 압박을 담당하는 보스 성격의 곡.",
        "sceneUse": "공백 법정 침투, 시민 구조와 코어 방어, 3번 종편 보스전",
        "mood": "정치적 압박, 붕괴 직전, 냉정한 결단",
        "style": "crisis",
        "tempo": 122,
        "tonic": 50,
        "mode": "aeolian",
        "measures": 12,
        "progression": [0, 5, 3, 4, 0, 5, 2, 4, 0, 3, 5, 4],
        "motif": [(0.0, 0.5, 0), (0.5, 0.5, 2), (1.0, 0.5, 3), (1.5, 0.5, 5), (2.5, 0.5, 4), (3.0, 0.5, 3)],
    },
    {
        "id": "08-whisperfruit-canopy",
        "title": "속삭임 과수원",
        "category": "챕터 3 감정 이벤트 / 탐험",
        "chapterUse": ["챕터 3"],
        "description": "후회와 친밀감이 동시에 드러나는 과수원 구간의 정서용 곡.",
        "sceneUse": "과수원 진입, 후회목 주변 탐색, 사야와의 고백 직전",
        "mood": "불편한 친밀감, 다정함, 후회",
        "style": "orchard",
        "tempo": 72,
        "tonic": 67,
        "mode": "ionian",
        "measures": 16,
        "progression": [0, 3, 5, 4, 0, 3, 4, 5, 0, 2, 5, 4, 0, 3, 1, 4],
        "motif": [(0.0, 0.75, 0), (1.0, 0.5, 2), (1.75, 0.75, 4), (2.75, 0.75, 5)],
    },
    {
        "id": "09-spinal-archive-truth",
        "title": "척추탑의 진실",
        "category": "챕터 3 진실 공개",
        "chapterUse": ["챕터 3"],
        "description": "플레이어 계보와 새벽종 원죄가 드러나는 장면용 서스펜디드 곡.",
        "sceneUse": "무도서고 척추탑, 선택되지 않은 역사 열람, 실루엣 대치 직전",
        "mood": "자기혐오, 계시, 감정 붕괴 직전의 정적",
        "style": "revelation",
        "tempo": 70,
        "tonic": 47,
        "mode": "aeolian",
        "measures": 16,
        "progression": [0, 5, 2, 4, 0, 5, 3, 4, 0, 1, 5, 4, 0, 2, 1, 0],
        "motif": [(0.0, 0.5, 0), (0.75, 0.5, 2), (1.5, 0.75, 4), (2.75, 0.75, 6)],
    },
    {
        "id": "10-dawnsalvager-skirmish",
        "title": "여명 인양 전투",
        "category": "일반 전투",
        "chapterUse": ["전 챕터 공용"],
        "description": "일반 필드 전투와 추적형 교전에 재사용 가능한 기본 전투곡.",
        "sceneUse": "균열 생물 교전, 일반 필드 전투, 반복 전투 구간",
        "mood": "긴박함, 결의, 즉응성",
        "style": "battle",
        "tempo": 128,
        "tonic": 52,
        "mode": "dorian",
        "measures": 12,
        "progression": [0, 3, 4, 0, 0, 5, 3, 4, 0, 3, 1, 4],
        "motif": [(0.0, 0.5, 0), (0.5, 0.5, 2), (1.0, 0.5, 4), (1.5, 0.5, 5), (2.5, 0.5, 4), (3.0, 0.5, 2)],
    },
    {
        "id": "11-abyssal-choir-collapse",
        "title": "심연의 합창 붕괴",
        "category": "최종 던전 / 최종 보스",
        "chapterUse": ["엔딩"],
        "description": "침묵 산호궁 진입부터 최종 결전 직전까지 이어지는 대형 클라이맥스 곡.",
        "sceneUse": "침묵 산호궁 내부, 동료 분리 직후, 최종 보스전 1~2페이즈",
        "mood": "장엄함, 몰락, 선택 직전의 압력",
        "style": "finale",
        "tempo": 132,
        "tonic": 50,
        "mode": "phrygian",
        "measures": 16,
        "progression": [0, 1, 4, 5, 0, 5, 4, 1, 0, 1, 5, 4, 0, 3, 1, 0],
        "motif": [(0.0, 0.5, 0), (0.5, 0.5, 1), (1.0, 0.5, 4), (1.5, 0.5, 5), (2.5, 0.5, 4), (3.0, 0.5, 1)],
    },
    {
        "id": "12-restored-dawn",
        "title": "복원된 새벽",
        "category": "엔딩 A",
        "chapterUse": ["엔딩 A", "크레딧"],
        "description": "새벽종을 복구했을 때의 안도와 불편한 통제를 동시에 남기는 후일담 곡.",
        "sceneUse": "엔딩 A 컷신, 엔딩 A 후일담, 크레딧 초반",
        "mood": "안도, 책임, 인공적인 평온",
        "style": "ending_a",
        "tempo": 74,
        "tonic": 62,
        "mode": "ionian",
        "measures": 16,
        "progression": [0, 3, 4, 0, 0, 5, 3, 4, 0, 2, 5, 4, 0, 3, 1, 0],
        "motif": [(0.0, 1.0, 0), (1.0, 0.5, 2), (1.5, 0.75, 4), (2.75, 0.75, 1)],
    },
    {
        "id": "13-unbound-tomorrow",
        "title": "풀려난 내일",
        "category": "엔딩 B",
        "chapterUse": ["엔딩 B", "크레딧"],
        "description": "새벽종 해체 이후의 혼란과 해방감을 함께 남기는 엔딩 곡.",
        "sceneUse": "엔딩 B 컷신, 자연스럽지만 불안정한 새벽의 복귀",
        "mood": "해방, 불확실성, 살아 있는 바람",
        "style": "ending_b",
        "tempo": 80,
        "tonic": 55,
        "mode": "mixolydian",
        "measures": 16,
        "progression": [0, 4, 5, 0, 0, 3, 4, 5, 0, 4, 1, 5, 0, 3, 4, 0],
        "motif": [(0.0, 0.75, 0), (1.0, 0.5, 2), (1.75, 0.75, 4), (2.75, 0.75, 5)],
    },
    {
        "id": "14-bellbound-vigil",
        "title": "종에 남은 사람",
        "category": "엔딩 C",
        "chapterUse": ["엔딩 C", "크레딧"],
        "description": "플레이어가 새 매개체가 된 뒤의 고요한 상실을 강조하는 엔딩 곡.",
        "sceneUse": "엔딩 C 컷신, 여운 구간, 마지막 크레딧 전환",
        "mood": "희생, 기억, 남겨진 연결",
        "style": "ending_c",
        "tempo": 66,
        "tonic": 52,
        "mode": "dorian",
        "measures": 16,
        "progression": [0, 5, 3, 4, 0, 5, 2, 4, 0, 3, 5, 4, 0, 2, 1, 0],
        "motif": [(0.0, 1.0, 0), (1.0, 0.5, 2), (1.75, 0.75, 3), (2.75, 0.75, 1)],
    },
]


def midi_to_frequency(midi_note: float) -> float:
    return 440.0 * (2.0 ** ((midi_note - 69.0) / 12.0))


def resolve_scale_midi(tonic: int, intervals: list[int], scale_index: int, octave_shift: int = 0) -> int:
    interval_index = scale_index % len(intervals)
    octave = math.floor(scale_index / len(intervals))
    return tonic + intervals[interval_index] + (12 * octave) + octave_shift


def build_chord(track: dict, degree: int) -> dict:
    intervals = MODE_INTERVALS[track["mode"]]
    chord_tones = [degree, degree + 2, degree + 4]
    pad_midis = [resolve_scale_midi(track["tonic"], intervals, tone, 12) for tone in chord_tones]
    return {
        "root_degree": degree,
        "pad_midis": pad_midis,
        "bass_root": resolve_scale_midi(track["tonic"], intervals, degree, -24),
        "bass_fifth": resolve_scale_midi(track["tonic"], intervals, degree + 4, -24),
        "lead_root": resolve_scale_midi(track["tonic"], intervals, degree, 12),
    }


def triangle(phase: float) -> float:
    return (2.0 / math.pi) * math.asin(math.sin(phase))


def saw(phase: float) -> float:
    value = (phase / (2.0 * math.pi)) % 1.0
    return (2.0 * value) - 1.0


def square(phase: float) -> float:
    return 1.0 if math.sin(phase) >= 0.0 else -1.0


def random_noise(state: list[int]) -> float:
    state[0] = (1103515245 * state[0] + 12345) & 0x7FFFFFFF
    return ((state[0] / 0x7FFFFFFF) * 2.0) - 1.0


def tone_sample(instrument: str, phase: float, progress: float) -> float:
    if instrument == "warm_pad":
        return (math.sin(phase) * 0.72) + (triangle(phase) * 0.18) + (math.sin(phase * 2.0) * 0.1)
    if instrument == "glass_pad":
        return (math.sin(phase) * 0.55) + (math.sin(phase * 2.0) * 0.2) + (math.sin(phase * 3.0) * 0.08)
    if instrument == "shadow_pad":
        return (math.sin(phase) * 0.58) + (saw(phase) * 0.12) + (math.sin(phase * 0.5) * 0.18)
    if instrument == "sun_pad":
        return (triangle(phase) * 0.45) + (math.sin(phase) * 0.42) + (math.sin(phase * 2.0) * 0.08)
    if instrument == "round_bass":
        return (math.sin(phase) * 0.8) + (math.sin(phase * 2.0) * 0.12)
    if instrument == "sub_bass":
        return (math.sin(phase) * 0.85) + (math.sin(phase * 0.5) * 0.12)
    if instrument == "punch_bass":
        return (math.sin(phase) * 0.65) + (square(phase) * 0.12) + (math.sin(phase * 2.0) * 0.18)
    if instrument == "soft_bell":
        decay = (1.0 - progress) ** 1.4
        return decay * (
            (math.sin(phase) * 0.78)
            + (math.sin(phase * 2.37) * 0.16)
            + (math.sin(phase * 4.11) * 0.09)
        )
    if instrument == "star_bell":
        decay = (1.0 - progress) ** 1.55
        return decay * (
            (math.sin(phase) * 0.62)
            + (math.sin(phase * 2.0) * 0.14)
            + (math.sin(phase * 3.71) * 0.13)
            + (math.sin(phase * 5.43) * 0.08)
        )
    if instrument == "gear_pluck":
        decay = (1.0 - progress) ** 1.8
        return decay * ((triangle(phase) * 0.58) + (math.sin(phase * 2.0) * 0.16) + (square(phase) * 0.08))
    if instrument == "sand_pluck":
        decay = (1.0 - progress) ** 1.9
        return decay * ((triangle(phase) * 0.54) + (math.sin(phase) * 0.26) + (math.sin(phase * 3.0) * 0.08))
    if instrument == "glass_tick":
        decay = (1.0 - progress) ** 2.0
        return decay * ((math.sin(phase) * 0.6) + (math.sin(phase * 3.0) * 0.18) + (math.sin(phase * 5.0) * 0.08))
    if instrument == "breath_lead":
        return (triangle(phase) * 0.42) + (math.sin(phase) * 0.45) + (math.sin(phase * 2.0) * 0.06)
    if instrument == "hollow_lead":
        return (square(phase) * 0.18) + (math.sin(phase) * 0.55) + (math.sin(phase * 2.0) * 0.08)
    if instrument == "reed_lead":
        return (triangle(phase) * 0.4) + (saw(phase) * 0.1) + (math.sin(phase) * 0.42)
    if instrument == "steel_lead":
        return (saw(phase) * 0.22) + (triangle(phase) * 0.4) + (math.sin(phase) * 0.25)
    return math.sin(phase)


def add_note(
    buffer: array,
    start_seconds: float,
    duration_seconds: float,
    frequency: float,
    amplitude: float,
    instrument: str,
    attack: float,
    release: float,
    vibrato_depth: float = 0.0,
    vibrato_rate: float = 5.0,
) -> None:
    start_index = max(0, int(start_seconds * SAMPLE_RATE))
    note_length = max(1, int(duration_seconds * SAMPLE_RATE))
    end_index = min(len(buffer), start_index + note_length)
    effective_length = end_index - start_index

    if effective_length <= 0:
        return

    attack_samples = max(1, int(attack * SAMPLE_RATE))
    release_samples = max(1, int(release * SAMPLE_RATE))
    phase = 0.0
    two_pi = 2.0 * math.pi

    for offset in range(effective_length):
        if offset < attack_samples:
            envelope = offset / attack_samples
        elif offset >= effective_length - release_samples:
            envelope = max(0.0, (effective_length - offset) / release_samples)
        else:
            envelope = 1.0

        progress = offset / effective_length
        freq = frequency

        if vibrato_depth:
            freq += math.sin(two_pi * vibrato_rate * (offset / SAMPLE_RATE)) * vibrato_depth

        phase += two_pi * freq / SAMPLE_RATE
        buffer[start_index + offset] += tone_sample(instrument, phase, progress) * amplitude * envelope


def add_pad(buffer: array, chord: dict, start_time: float, measure_duration: float, style: dict) -> None:
    for index, midi_note in enumerate(chord["pad_midis"]):
        add_note(
            buffer,
            start_time,
            measure_duration * (1.05 if index == 1 else 0.98),
            midi_to_frequency(midi_note + (12 if index == 1 else 0)),
            0.11 if index == 1 else 0.075,
            style["pad"],
            attack=0.45,
            release=0.65,
            vibrato_depth=0.15 if index == 1 else 0.0,
        )


def add_bass(buffer: array, chord: dict, start_time: float, beat_duration: float, style: dict) -> None:
    for beat_offset, note_length_beats, degree in style["bass_pattern"]:
        midi_note = chord["bass_root"] if degree in (0, 1) else chord["bass_fifth"]
        if degree not in (0, 1, 4):
            midi_note += 12

        add_note(
            buffer,
            start_time + (beat_offset * beat_duration),
            beat_duration * note_length_beats,
            midi_to_frequency(midi_note),
            0.12,
            style["bass"],
            attack=0.01,
            release=0.14,
        )


def add_arp(buffer: array, chord: dict, start_time: float, beat_duration: float, style: dict) -> None:
    arp_midis = chord["pad_midis"] + [chord["pad_midis"][0] + 12, chord["pad_midis"][1] + 12]
    for step_index, arp_index in enumerate(style["arp_pattern"]):
        midi_note = arp_midis[arp_index % len(arp_midis)]
        add_note(
            buffer,
            start_time + ((step_index * 0.5) * beat_duration),
            beat_duration * 0.48,
            midi_to_frequency(midi_note),
            0.06,
            style["arp"],
            attack=0.01,
            release=0.18,
        )


def add_lead(
    buffer: array,
    track: dict,
    chord: dict,
    measure_index: int,
    start_time: float,
    beat_duration: float,
    style: dict,
) -> None:
    lead_interval = 2 if track["style"] in {"crisis", "battle", "finale", "rescue"} else 4
    should_play = (measure_index % lead_interval == 0) or (random.random() < style["lead_density"] * 0.12)

    if not should_play:
        return

    intervals = MODE_INTERVALS[track["mode"]]

    for beat_offset, length_beats, degree in track["motif"]:
        midi_note = resolve_scale_midi(
            track["tonic"],
            intervals,
            chord["root_degree"] + degree,
            12,
        )
        add_note(
            buffer,
            start_time + (beat_offset * beat_duration),
            beat_duration * length_beats,
            midi_to_frequency(midi_note),
            0.065 if track["style"] not in {"battle", "crisis", "finale"} else 0.08,
            style["lead"],
            attack=0.02,
            release=0.16,
            vibrato_depth=0.25 if track["style"] in {"overture", "orchard", "ending_a", "ending_c"} else 0.0,
        )


def add_drums(buffer: array, start_time: float, beat_duration: float, pattern: str | None, level: float) -> None:
    if not pattern or level <= 0:
        return

    kick_positions = [0.0, 2.0]
    snare_positions = [1.0, 3.0]
    hat_positions = [index * 0.5 for index in range(8)]

    if pattern == "heartbeat":
        kick_positions = [0.0, 0.75]
        snare_positions = []
        hat_positions = []
    elif pattern == "steps":
        kick_positions = [0.0, 1.5, 2.0, 3.0]
        snare_positions = [2.5]
        hat_positions = [0.5, 1.0, 2.5, 3.5]
    elif pattern == "run":
        kick_positions = [0.0, 1.5, 2.0, 3.0]
        snare_positions = [1.0, 3.0]
        hat_positions = [index * 0.5 for index in range(8)]
    elif pattern == "clock":
        kick_positions = [0.0, 2.0]
        snare_positions = [1.5, 3.5]
        hat_positions = [index * 0.5 for index in range(8)]
    elif pattern == "drive":
        kick_positions = [0.0, 1.5, 2.0, 2.5]
        snare_positions = [1.0, 3.0]
        hat_positions = [index * 0.5 for index in range(8)]
    elif pattern == "battle":
        kick_positions = [0.0, 1.0, 2.0, 2.5]
        snare_positions = [1.5, 3.0]
        hat_positions = [index * 0.5 for index in range(8)]
    elif pattern == "finale":
        kick_positions = [0.0, 1.0, 2.0, 2.5, 3.0]
        snare_positions = [1.5, 3.5]
        hat_positions = [index * 0.5 for index in range(8)]
    elif pattern == "soft_pulse":
        kick_positions = [0.0, 2.0]
        snare_positions = [3.0]
        hat_positions = [0.5, 1.5, 2.5, 3.5]

    noise_state = [123456789]

    for beat in kick_positions:
        start_index = int((start_time + (beat * beat_duration)) * SAMPLE_RATE)
        length = int(0.24 * SAMPLE_RATE)
        for offset in range(length):
            sample_index = start_index + offset
            if sample_index >= len(buffer):
                break
            progress = offset / max(1, length)
            frequency = 120.0 - (70.0 * progress)
            sample = math.sin((2.0 * math.pi * frequency * offset) / SAMPLE_RATE) * ((1.0 - progress) ** 2.2)
            buffer[sample_index] += sample * 0.22 * level

    for beat in snare_positions:
        start_index = int((start_time + (beat * beat_duration)) * SAMPLE_RATE)
        length = int(0.18 * SAMPLE_RATE)
        for offset in range(length):
            sample_index = start_index + offset
            if sample_index >= len(buffer):
                break
            progress = offset / max(1, length)
            noise = random_noise(noise_state)
            tone = math.sin((2.0 * math.pi * 180.0 * offset) / SAMPLE_RATE) * 0.16
            buffer[sample_index] += (noise * 0.24 + tone) * ((1.0 - progress) ** 2.0) * level

    for beat in hat_positions:
        start_index = int((start_time + (beat * beat_duration)) * SAMPLE_RATE)
        length = int(0.06 * SAMPLE_RATE)
        for offset in range(length):
            sample_index = start_index + offset
            if sample_index >= len(buffer):
                break
            progress = offset / max(1, length)
            noise = random_noise(noise_state)
            buffer[sample_index] += noise * ((1.0 - progress) ** 3.0) * 0.06 * level


def add_drone(buffer: array, track: dict, total_duration: float) -> None:
    root_frequency = midi_to_frequency(track["tonic"] - 24)
    add_note(
        buffer,
        0.0,
        total_duration,
        root_frequency,
        0.04 if track["style"] not in {"battle", "crisis"} else 0.03,
        "shadow_pad" if track["style"] in {"mystery", "revelation", "finale", "ending_c"} else "warm_pad",
        attack=1.8,
        release=1.6,
    )


def add_delay(buffer: array, delay_seconds: float, feedback: float) -> None:
    delay_samples = max(1, int(delay_seconds * SAMPLE_RATE))
    for index in range(delay_samples, len(buffer)):
        buffer[index] += buffer[index - delay_samples] * feedback


def shape_master(buffer: array, fade_time: float = 0.03) -> list[int]:
    fade_samples = max(1, int(fade_time * SAMPLE_RATE))

    for index in range(min(fade_samples, len(buffer))):
        buffer[index] *= index / fade_samples
        buffer[-(index + 1)] *= index / fade_samples

    peak = max(abs(sample) for sample in buffer) or 1.0
    normalization = MASTER_GAIN / peak
    pcm_frames: list[int] = []

    for sample in buffer:
        shaped = math.tanh(sample * normalization * 1.25) * 0.92
        pcm_frames.append(int(max(-1.0, min(1.0, shaped)) * 32767))

    return pcm_frames


def write_wav(path: Path, frames: list[int]) -> None:
    with wave.open(str(path), "wb") as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(SAMPLE_RATE)
        wav_file.writeframes(struct.pack("<" + ("h" * len(frames)), *frames))


def render_track(track: dict) -> dict:
    beat_duration = 60.0 / track["tempo"]
    measure_duration = beat_duration * 4.0
    total_duration = measure_duration * track["measures"]
    total_samples = int(total_duration * SAMPLE_RATE)
    buffer = array("f", [0.0]) * total_samples
    style = STYLE_LIBRARY[track["style"]]
    add_drone(buffer, track, total_duration)

    for measure_index, degree in enumerate(track["progression"]):
        chord = build_chord(track, degree)
        measure_start = measure_index * measure_duration
        add_pad(buffer, chord, measure_start, measure_duration, style)
        add_bass(buffer, chord, measure_start, beat_duration, style)
        add_arp(buffer, chord, measure_start, beat_duration, style)
        add_lead(buffer, track, chord, measure_index, measure_start, beat_duration, style)
        add_drums(buffer, measure_start, beat_duration, style["drums"], style["drum_level"])

    delay_seconds, feedback = style["delay"]
    add_delay(buffer, delay_seconds, feedback)
    pcm_frames = shape_master(buffer)

    wav_path = TEMP_DIR / f"{track['id']}.wav"
    ogg_path = OUTPUT_DIR / f"{track['id']}.ogg"
    write_wav(wav_path, pcm_frames)

    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-loglevel",
            "error",
            "-i",
            str(wav_path),
            "-c:a",
            "libvorbis",
            "-qscale:a",
            "4",
            str(ogg_path),
        ],
        check=True,
    )

    wav_path.unlink(missing_ok=True)

    return {
        "id": track["id"],
        "title": track["title"],
        "category": track["category"],
        "mood": track["mood"],
        "file": f"assets/audio/{track['id']}.ogg",
        "durationSeconds": round(total_duration, 2),
        "tempo": track["tempo"],
        "mode": track["mode"],
        "sceneUse": track["sceneUse"],
        "chapterUse": track["chapterUse"],
        "description": track["description"],
    }


def main() -> None:
    if shutil.which("ffmpeg") is None:
        raise SystemExit("ffmpeg가 필요합니다.")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    TEMP_DIR.mkdir(parents=True, exist_ok=True)

    rendered_manifest = [render_track(track) for track in TRACKS]

    manifest_path = OUTPUT_DIR / "manifest.json"
    manifest_path.write_text(
        json.dumps(
            {
                "sampleRate": SAMPLE_RATE,
                "format": "ogg",
                "tracks": rendered_manifest,
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )

    TEMP_DIR.rmdir()

    total_duration = sum(item["durationSeconds"] for item in rendered_manifest)
    print(f"generated {len(rendered_manifest)} tracks / total {total_duration:.2f}s")


if __name__ == "__main__":
    random.seed(59)
    main()
