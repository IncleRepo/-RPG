export const CHIZURU_NPC = Object.freeze({
  name: '미즈하라 치즈루',
  anchorPlatform: 'ground',
  xRatio: 0.76,
  interactionRadiusX: 118,
  interactionRadiusY: 96,
  encounterHint: '오른쪽 풀밭에서 기다리고 있습니다.',
  dialogues: Object.freeze([
    '운메이난테~ 라고 흥얼거리다가, 네가 여기까지 온 걸 봤어. 생각보다 빨랐네.',
    '이에나이~ 라고 해도 완전히 모른 척할 수는 없지. 같이 이 하늘을 보고 가.',
    '아토난세치. 잠깐 멈춰 서서 이야기할 시간 정도는, 오늘 맵에도 남아 있잖아.',
  ]),
});

export function getChizuruDialogue(index) {
  return CHIZURU_NPC.dialogues[index % CHIZURU_NPC.dialogues.length];
}
