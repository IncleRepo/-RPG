const TAU = Math.PI * 2;

const HAIR_STYLE_LIBRARY = Object.freeze({
  adventurer: Object.freeze({ label: '어드벤처 레이어' }),
  ponytail: Object.freeze({ label: '하이 포니테일' }),
  wolfcut: Object.freeze({ label: '울프 컷' }),
  crest: Object.freeze({ label: '웨이브 크롭' }),
});

const HAIR_COLOR_LIBRARY = Object.freeze({
  chestnut: Object.freeze({
    label: '체스트넛',
    hair: '#4a2d20',
    hairShadow: '#24130c',
    hairHighlight: '#885b42',
  }),
  raven: Object.freeze({
    label: '레이븐 블랙',
    hair: '#242733',
    hairShadow: '#0f1219',
    hairHighlight: '#5a6075',
  }),
  silver: Object.freeze({
    label: '실버 애쉬',
    hair: '#d6d0dc',
    hairShadow: '#8a8291',
    hairHighlight: '#f6f2fb',
  }),
  rosewood: Object.freeze({
    label: '로즈우드',
    hair: '#6d3b45',
    hairShadow: '#31161c',
    hairHighlight: '#b97d88',
  }),
});

const PLAYER_BASE_PRESET = Object.freeze({
  skin: '#f4c7a0',
  skinShadow: '#cf8e65',
  skinFlush: 'rgba(214, 110, 88, 0.16)',
  outfit: '#556dcb',
  outfitShadow: '#2b3f8e',
  trim: '#f4d57d',
  trimShadow: '#b89635',
  cape: '#cf5d55',
  capeShadow: '#7e2728',
  legs: '#494a6c',
  legsShadow: '#2f3048',
  boots: '#6b3b26',
  bootsShadow: '#2f160d',
  glove: '#f1f6ff',
  gloveShadow: '#92a5c5',
  weapon: '#e9f3ff',
  weaponShadow: '#7b94bb',
  eye: '#322012',
  line: 'rgba(34, 20, 12, 0.28)',
  aura: 'rgba(255, 226, 124, 0.42)',
  hasAura: true,
  hasCape: true,
  hasWeapon: true,
  dress: false,
  defaultHairStyle: 'adventurer',
  defaultHairColor: 'chestnut',
});

const GUEST_BASE_PRESET = Object.freeze({
  skin: '#ffd8c6',
  skinShadow: '#d4967a',
  skinFlush: 'rgba(196, 104, 88, 0.14)',
  outfit: '#f4dfd7',
  outfitShadow: '#c67c72',
  trim: '#37427d',
  trimShadow: '#1e244a',
  cape: '#ef9d8f',
  capeShadow: '#985350',
  legs: '#7a5161',
  legsShadow: '#4e3140',
  boots: '#75433d',
  bootsShadow: '#361915',
  glove: '#fff7f1',
  gloveShadow: '#dbbfbb',
  weapon: '#ffffff',
  weaponShadow: '#ffffff',
  eye: '#40231a',
  line: 'rgba(71, 39, 31, 0.26)',
  aura: 'rgba(255, 194, 180, 0.18)',
  hasAura: false,
  hasCape: false,
  hasWeapon: false,
  dress: true,
  defaultHairStyle: 'ponytail',
  defaultHairColor: 'rosewood',
});

export const HAIR_STYLE_OPTIONS = Object.freeze(
  Object.entries(HAIR_STYLE_LIBRARY).map(([value, entry]) =>
    Object.freeze({ value, label: entry.label })
  )
);

export const HAIR_COLOR_OPTIONS = Object.freeze(
  Object.entries(HAIR_COLOR_LIBRARY).map(([value, entry]) =>
    Object.freeze({ value, label: entry.label })
  )
);

export const DEFAULT_PLAYER_APPEARANCE_CONFIG = Object.freeze({
  hairStyle: PLAYER_BASE_PRESET.defaultHairStyle,
  hairColor: PLAYER_BASE_PRESET.defaultHairColor,
});

export const PLAYER_APPEARANCE = resolvePlayerAppearance();
export const CHIZURU_APPEARANCE = createHumanoidAppearance(GUEST_BASE_PRESET);

export function resolvePlayerAppearance(config = {}) {
  return createHumanoidAppearance(PLAYER_BASE_PRESET, config);
}

export function drawHumanoid(context, options) {
  const {
    x,
    baseY,
    pose,
    appearance = PLAYER_APPEARANCE,
    facing = 'right',
    scale = 1,
    footHeights = { left: 0, right: 0 },
    shadowOpacity = 0.24,
    grounded = true,
  } = options;

  context.save();
  context.translate(x, baseY);
  context.scale(facing === 'left' ? -scale : scale, -scale);

  if (appearance.hasAura) {
    const aura = context.createRadialGradient(0, 58, 4, 0, 58, 44);
    aura.addColorStop(0, appearance.aura);
    aura.addColorStop(1, 'rgba(255, 226, 124, 0)');
    context.fillStyle = aura;
    context.beginPath();
    context.ellipse(0, 58, 34, 24, 0, 0, TAU);
    context.fill();
  }

  drawShadow(context, shadowOpacity);

  const pelvis = {
    x: pose.hipSwing * 0.32,
    y: 54 + pose.pelvisLift,
  };
  const torsoAngle = Math.PI / 2 + degToRad(pose.bodyLean);
  const up = vectorFromAngle(torsoAngle);
  const right = vectorFromAngle(torsoAngle - Math.PI / 2);
  const chest = addVector(pelvis, scaleVector(up, 25));
  const neckRoot = addVector(chest, scaleVector(up, 12));
  const headCenter = addVector(
    addVector(neckRoot, scaleVector(up, 10)),
    scaleVector(right, 2 + pose.headTilt * 0.04)
  );

  const leftHip = addVector(
    pelvis,
    addVector(scaleVector(right, -7), scaleVector(up, -1 - pose.pelvisTilt * 0.08))
  );
  const rightHip = addVector(
    pelvis,
    addVector(scaleVector(right, 7), scaleVector(up, -1 + pose.pelvisTilt * 0.08))
  );
  const leftShoulder = addVector(
    chest,
    addVector(scaleVector(right, -12), scaleVector(up, 1 + pose.shoulderTilt * 0.08))
  );
  const rightShoulder = addVector(
    chest,
    addVector(scaleVector(right, 12), scaleVector(up, 1 - pose.shoulderTilt * 0.08))
  );

  const leftAnkleTarget = {
    x: pose.footLeftX,
    y: pose.footLeftY + footHeights.left,
  };
  const rightAnkleTarget = {
    x: pose.footRightX,
    y: pose.footRightY + footHeights.right,
  };

  const leftLeg = solveTwoBoneIk(leftHip, leftAnkleTarget, 25, 23, {
    bendSign: 1,
    bendBias: pose.kneeLeft,
    stretchLimit: grounded ? 0.98 : 0.92,
  });
  const rightLeg = solveTwoBoneIk(rightHip, rightAnkleTarget, 25, 23, {
    bendSign: 1,
    bendBias: pose.kneeRight,
    stretchLimit: grounded ? 0.98 : 0.92,
  });

  const leftFoot = {
    ankle: leftLeg.end,
    toe: addVector(leftLeg.end, polar(11, degToRad(pose.footLeftAngle))),
  };
  const rightFoot = {
    ankle: rightLeg.end,
    toe: addVector(rightLeg.end, polar(11, degToRad(pose.footRightAngle))),
  };

  const leftUpperArmAngle = torsoAngle + degToRad(-150 + pose.armLeft);
  const leftElbow = addVector(leftShoulder, polar(18, leftUpperArmAngle));
  const leftHand = addVector(
    leftElbow,
    polar(15.5, leftUpperArmAngle + degToRad(-18 + pose.forearmLeft))
  );

  const rightUpperArmAngle = torsoAngle + degToRad(-104 + pose.armRight);
  const rightElbow = addVector(rightShoulder, polar(18, rightUpperArmAngle));
  const rightHand = addVector(
    rightElbow,
    polar(16, rightUpperArmAngle + degToRad(-8 + pose.forearmRight))
  );

  const legs = [
    {
      hip: leftHip,
      knee: leftLeg.knee,
      foot: leftFoot,
      depth: leftFoot.toe.x + leftFoot.ankle.y * 0.08,
      upperRadius: 5.8,
      lowerRadius: 5.2,
    },
    {
      hip: rightHip,
      knee: rightLeg.knee,
      foot: rightFoot,
      depth: rightFoot.toe.x + rightFoot.ankle.y * 0.08,
      upperRadius: 6.3,
      lowerRadius: 5.6,
    },
  ].sort((left, rightEntry) => left.depth - rightEntry.depth);

  const arms = [
    {
      shoulder: leftShoulder,
      elbow: leftElbow,
      hand: leftHand,
      depth: leftHand.x + leftHand.y * 0.06,
      upperRadius: 4.8,
      lowerRadius: 4.2,
      hasWeapon: false,
    },
    {
      shoulder: rightShoulder,
      elbow: rightElbow,
      hand: rightHand,
      depth: rightHand.x + rightHand.y * 0.06,
      upperRadius: 5.2,
      lowerRadius: 4.5,
      hasWeapon: appearance.hasWeapon,
    },
  ].sort((left, rightEntry) => left.depth - rightEntry.depth);

  drawLeg(context, legs[0], appearance, true);

  if (appearance.hasCape) {
    drawCape(context, leftShoulder, rightShoulder, pelvis, pose, appearance);
  }

  drawArm(context, arms[0], appearance, true, pose);
  drawTorso(
    context,
    pelvis,
    chest,
    leftShoulder,
    rightShoulder,
    leftHip,
    rightHip,
    pose,
    appearance
  );
  drawNeck(context, neckRoot, headCenter, appearance);
  drawHead(context, headCenter, appearance, pose);
  drawLeg(context, legs[1], appearance, false);
  drawArm(context, arms[1], appearance, false, pose);

  context.restore();
}

function createHumanoidAppearance(basePreset, config = {}) {
  const hairStyleKey = resolveChoice(
    config.hairStyle,
    basePreset.defaultHairStyle,
    HAIR_STYLE_LIBRARY
  );
  const hairColorKey = resolveChoice(
    config.hairColor,
    basePreset.defaultHairColor,
    HAIR_COLOR_LIBRARY
  );
  const hairPalette = HAIR_COLOR_LIBRARY[hairColorKey];
  const hairStyle = HAIR_STYLE_LIBRARY[hairStyleKey];

  return {
    ...basePreset,
    hairStyleKey,
    hairStyleLabel: hairStyle.label,
    hairColorKey,
    hairColorLabel: hairPalette.label,
    hair: hairPalette.hair,
    hairShadow: hairPalette.hairShadow,
    hairHighlight: hairPalette.hairHighlight,
  };
}

function resolveChoice(choice, fallbackKey, library) {
  if (choice && library[choice]) {
    return choice;
  }

  return fallbackKey;
}

function drawShadow(context, shadowOpacity) {
  context.globalAlpha = shadowOpacity;
  context.fillStyle = 'rgba(26, 16, 12, 0.34)';
  context.beginPath();
  context.ellipse(0, 0, 30, 9, 0, 0, TAU);
  context.fill();
  context.globalAlpha = 1;
}

function drawCape(context, leftShoulder, rightShoulder, pelvis, pose, appearance) {
  const sway = pose.capeSwing * 0.45;
  const tailLeft = { x: -24 - sway, y: 18 };
  const tailRight = { x: 7 - sway * 0.36, y: 10 };

  context.fillStyle = appearance.cape;
  context.beginPath();
  context.moveTo(leftShoulder.x + 1, leftShoulder.y - 1);
  context.quadraticCurveTo(pelvis.x - 18, pelvis.y + 18, tailLeft.x, tailLeft.y);
  context.quadraticCurveTo(-6, 3, tailRight.x, tailRight.y);
  context.quadraticCurveTo(pelvis.x + 10, pelvis.y + 22, rightShoulder.x - 2, rightShoulder.y - 4);
  context.closePath();
  context.fill();

  context.strokeStyle = appearance.capeShadow;
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(leftShoulder.x + 2, leftShoulder.y - 4);
  context.quadraticCurveTo(-5, 26, tailLeft.x + 9, tailLeft.y + 5);
  context.stroke();
}

function drawArm(context, arm, appearance, isBackLayer, pose) {
  if (isBackLayer) {
    context.globalAlpha = 0.88;
  }

  drawCapsule(
    context,
    arm.shoulder,
    arm.elbow,
    arm.upperRadius,
    appearance.outfit,
    appearance.line
  );
  drawCapsule(context, arm.elbow, arm.hand, arm.lowerRadius, appearance.glove, appearance.line);
  drawJoint(context, arm.elbow, arm.lowerRadius + 1, appearance.gloveShadow, appearance.line);
  drawHand(context, arm.hand, appearance);

  if (arm.hasWeapon) {
    drawWeapon(context, arm.hand, pose, appearance);
  }

  if (isBackLayer) {
    context.globalAlpha = 1;
  }
}

function drawNeck(context, neckRoot, headCenter, appearance) {
  const headBase = {
    x: headCenter.x - 1.8,
    y: headCenter.y - 8.6,
  };

  drawCapsule(context, neckRoot, headBase, 3.8, appearance.skinShadow, appearance.line);
}

function drawHead(context, headCenter, appearance, pose) {
  context.save();
  context.translate(headCenter.x, headCenter.y);
  context.rotate(degToRad(pose.headTilt * 0.08 + pose.bodyLean * 0.04));

  drawRearHair(context, appearance);

  context.fillStyle = appearance.skin;
  context.beginPath();
  context.moveTo(-9.8, 2.4);
  context.quadraticCurveTo(-11.8, 10.6, 0.8, 13.6);
  context.quadraticCurveTo(11.8, 10.8, 11.6, 1.8);
  context.quadraticCurveTo(11.1, -11.2, 0.6, -12.8);
  context.quadraticCurveTo(-8.8, -10.8, -9.8, 2.4);
  context.closePath();
  context.fill();

  context.fillStyle = appearance.skinFlush;
  context.beginPath();
  context.ellipse(4.8, -0.8, 4.2, 2.8, degToRad(8), 0, TAU);
  context.fill();

  context.fillStyle = appearance.skinShadow;
  context.beginPath();
  context.ellipse(-8.3, 1.2, 1.8, 3.1, 0, 0, TAU);
  context.fill();

  drawFrontHair(context, appearance);

  context.strokeStyle = appearance.line;
  context.lineWidth = 1.2;
  context.beginPath();
  context.moveTo(4.2, 4.4);
  context.lineTo(8.4, 4.1);
  context.stroke();

  context.strokeStyle = appearance.eye;
  context.lineWidth = 1.5;
  context.beginPath();
  context.moveTo(3.3, 1.8);
  context.quadraticCurveTo(5.8, 2.7, 7.6, 1.5);
  context.stroke();

  context.fillStyle = appearance.eye;
  context.beginPath();
  context.arc(5.9, 1.5, 1.1, 0, TAU);
  context.fill();

  context.strokeStyle = 'rgba(103, 64, 49, 0.62)';
  context.lineWidth = 1.1;
  context.beginPath();
  context.moveTo(6.1, 0.1);
  context.lineTo(8.1, -1.8);
  context.lineTo(6.8, -3.4);
  context.stroke();

  context.strokeStyle = 'rgba(120, 70, 64, 0.78)';
  context.beginPath();
  context.moveTo(4.2, -5.2);
  context.quadraticCurveTo(6.4, -6.8, 8.2, -5.2);
  context.stroke();

  context.restore();
}

function drawRearHair(context, appearance) {
  context.fillStyle = appearance.hairShadow;

  switch (appearance.hairStyleKey) {
    case 'ponytail':
      context.beginPath();
      context.moveTo(-8.4, 6.5);
      context.quadraticCurveTo(-20, 4, -18.4, -10.2);
      context.quadraticCurveTo(-14.8, -16.4, -8.6, -9.2);
      context.quadraticCurveTo(-11.4, -1.6, -8.4, 6.5);
      context.closePath();
      context.fill();
      break;
    case 'wolfcut':
      context.beginPath();
      context.moveTo(-9.6, 6.2);
      context.lineTo(-16.8, -1);
      context.lineTo(-11.8, -2.2);
      context.lineTo(-17.2, -9.2);
      context.lineTo(-9.4, -7.4);
      context.lineTo(-12.6, -14.4);
      context.lineTo(-3.8, -11.2);
      context.closePath();
      context.fill();
      break;
    case 'crest':
      context.beginPath();
      context.moveTo(-9.2, 6.6);
      context.quadraticCurveTo(-15.4, 3.6, -14.2, -6.2);
      context.quadraticCurveTo(-11.8, -13.4, -4.8, -10.4);
      context.quadraticCurveTo(-8.6, -2.8, -9.2, 6.6);
      context.closePath();
      context.fill();
      break;
    default:
      context.beginPath();
      context.moveTo(-9.8, 6.2);
      context.quadraticCurveTo(-15.8, 1.4, -13.2, -8.4);
      context.quadraticCurveTo(-10.4, -13.8, -4.1, -11.8);
      context.quadraticCurveTo(-8.8, -2.4, -9.8, 6.2);
      context.closePath();
      context.fill();
      break;
  }
}

function drawFrontHair(context, appearance) {
  context.fillStyle = appearance.hair;
  context.beginPath();

  switch (appearance.hairStyleKey) {
    case 'ponytail':
      context.moveTo(-7.8, 3.8);
      context.quadraticCurveTo(-10.2, 11.8, 0.2, 13.6);
      context.quadraticCurveTo(12.4, 12.6, 12.4, 3.2);
      context.quadraticCurveTo(11.6, 10.2, 8.1, 11.6);
      context.quadraticCurveTo(5.6, 12.2, 3.8, 8.6);
      context.quadraticCurveTo(3.1, 11.4, -0.6, 11.8);
      context.quadraticCurveTo(-4.8, 12.1, -5.6, 8.2);
      context.quadraticCurveTo(-5.7, 12.2, -7.8, 3.8);
      context.closePath();
      break;
    case 'wolfcut':
      context.moveTo(-8.2, 4.8);
      context.lineTo(-10.6, 11.2);
      context.lineTo(-2.2, 11.8);
      context.lineTo(-4.6, 6.2);
      context.lineTo(1.6, 11.6);
      context.lineTo(4.2, 7);
      context.lineTo(8.8, 11.2);
      context.lineTo(12.8, 5.6);
      context.quadraticCurveTo(10.8, 12.8, 0.8, 13.8);
      context.quadraticCurveTo(-9.4, 13.2, -8.2, 4.8);
      context.closePath();
      break;
    case 'crest':
      context.moveTo(-7.4, 4.2);
      context.quadraticCurveTo(-7.4, 12.2, 0.4, 13.4);
      context.quadraticCurveTo(11.6, 12.8, 12.8, 4.8);
      context.quadraticCurveTo(11.4, 14.8, 2.6, 10.8);
      context.quadraticCurveTo(5.8, 13.6, 10.8, 7.4);
      context.quadraticCurveTo(6.4, 11.2, -7.4, 4.2);
      context.closePath();
      break;
    default:
      context.moveTo(-8.2, 4.1);
      context.quadraticCurveTo(-8.6, 12.4, 0.2, 13.6);
      context.quadraticCurveTo(11.8, 13.1, 12.4, 4.1);
      context.quadraticCurveTo(9.6, 11.1, 6.4, 10.7);
      context.quadraticCurveTo(6.8, 13.4, 3.2, 12);
      context.quadraticCurveTo(0.8, 11.1, 0.6, 8.2);
      context.quadraticCurveTo(-1.6, 12.2, -4.4, 11.8);
      context.quadraticCurveTo(-7.2, 11.4, -8.2, 4.1);
      context.closePath();
      break;
  }

  context.fill();

  context.strokeStyle = appearance.hairHighlight;
  context.lineWidth = 1.6;
  context.beginPath();
  context.moveTo(-1.8, 10.4);
  context.quadraticCurveTo(3.8, 12.8, 8.4, 8.6);
  context.stroke();
}

function drawHand(context, hand, appearance) {
  context.fillStyle = appearance.skinShadow;
  context.beginPath();
  context.arc(hand.x, hand.y, 3, 0, TAU);
  context.fill();
}

function drawLeg(context, leg, appearance, isBackLayer) {
  if (isBackLayer) {
    context.globalAlpha = 0.9;
  }

  drawCapsule(context, leg.hip, leg.knee, leg.upperRadius, appearance.legs, appearance.line);
  drawCapsule(
    context,
    leg.knee,
    leg.foot.ankle,
    leg.lowerRadius,
    appearance.legsShadow,
    appearance.line
  );
  drawJoint(context, leg.knee, leg.lowerRadius + 1.2, appearance.legsShadow, appearance.line);
  drawJoint(
    context,
    leg.foot.ankle,
    leg.lowerRadius - 0.8,
    appearance.bootsShadow,
    appearance.line
  );
  drawFoot(context, leg.foot.ankle, leg.foot.toe, appearance);

  if (isBackLayer) {
    context.globalAlpha = 1;
  }
}

function drawFoot(context, ankle, toe, appearance) {
  const direction = normalize(subtractVector(toe, ankle), { x: 1, y: 0 });
  const normal = { x: -direction.y, y: direction.x };
  const heel = addVector(ankle, addVector(scaleVector(direction, -4.4), scaleVector(normal, -0.6)));
  const upperHeel = addVector(
    ankle,
    addVector(scaleVector(direction, -2), scaleVector(normal, 3.6))
  );
  const upperToe = addVector(toe, addVector(scaleVector(direction, 2.2), scaleVector(normal, 2.8)));
  const soleToe = addVector(toe, scaleVector(normal, -1.2));

  context.fillStyle = appearance.boots;
  context.beginPath();
  context.moveTo(heel.x, heel.y);
  context.lineTo(soleToe.x, soleToe.y);
  context.lineTo(upperToe.x, upperToe.y);
  context.lineTo(upperHeel.x, upperHeel.y);
  context.closePath();
  context.fill();

  context.strokeStyle = appearance.line;
  context.lineWidth = 1.1;
  context.beginPath();
  context.moveTo(heel.x, heel.y);
  context.lineTo(soleToe.x, soleToe.y);
  context.lineTo(upperToe.x, upperToe.y);
  context.lineTo(upperHeel.x, upperHeel.y);
  context.closePath();
  context.stroke();

  context.strokeStyle = appearance.bootsShadow;
  context.lineWidth = 1.8;
  context.beginPath();
  context.moveTo(heel.x + 0.6, heel.y + 0.3);
  context.lineTo(soleToe.x - 0.8, soleToe.y + 0.2);
  context.stroke();
}

function drawTorso(
  context,
  pelvis,
  chest,
  leftShoulder,
  rightShoulder,
  leftHip,
  rightHip,
  pose,
  appearance
) {
  const waistLeft = addVector(leftHip, { x: -2, y: 6 });
  const waistRight = addVector(rightHip, { x: 2, y: 6 });

  context.fillStyle = appearance.outfit;
  context.beginPath();
  context.moveTo(leftShoulder.x - 1.2, leftShoulder.y - 0.8);
  context.quadraticCurveTo(chest.x - 6, chest.y - 1.6, waistLeft.x, waistLeft.y);
  context.lineTo(leftHip.x - 5.2, leftHip.y + 4.8);
  context.quadraticCurveTo(pelvis.x, pelvis.y + 1.2, rightHip.x + 5.4, rightHip.y + 4.8);
  context.lineTo(waistRight.x, waistRight.y);
  context.quadraticCurveTo(chest.x + 6, chest.y - 0.6, rightShoulder.x + 1.4, rightShoulder.y - 1);
  context.quadraticCurveTo(chest.x, chest.y + 6, leftShoulder.x - 1.2, leftShoulder.y - 0.8);
  context.closePath();
  context.fill();

  context.fillStyle = appearance.trim;
  context.beginPath();
  context.moveTo(leftShoulder.x + 2, leftShoulder.y - 1.2);
  context.lineTo(rightShoulder.x - 1.2, rightShoulder.y - 1);
  context.lineTo(chest.x + 2.6, chest.y - 7.4);
  context.lineTo(chest.x - 4.6, chest.y - 7.4);
  context.closePath();
  context.fill();

  context.strokeStyle = appearance.trimShadow;
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(chest.x + 0.6, chest.y - 7.2);
  context.lineTo(pelvis.x + pose.pelvisTilt * 0.12, pelvis.y + 0.8);
  context.stroke();

  context.fillStyle = appearance.outfitShadow;
  context.beginPath();
  context.ellipse(pelvis.x, pelvis.y + 2.8, 10.4, 5.6, 0, 0, TAU);
  context.fill();

  context.fillStyle = appearance.trimShadow;
  context.beginPath();
  context.ellipse(pelvis.x, pelvis.y + 3.1, 12.8, 2.4, 0, 0, TAU);
  context.fill();

  if (appearance.dress) {
    context.fillStyle = appearance.cape;
    context.beginPath();
    context.moveTo(leftHip.x - 2, leftHip.y + 3.2);
    context.lineTo(rightHip.x + 3.2, rightHip.y + 3.2);
    context.lineTo(rightHip.x + 10.6, rightHip.y - 13.4);
    context.lineTo(leftHip.x - 8.6, leftHip.y - 13.4);
    context.closePath();
    context.fill();
  }
}

function drawWeapon(context, hand, pose, appearance) {
  const bladeAngle = degToRad(16 + pose.weaponSwing);
  const pommel = addVector(hand, polar(3.6, bladeAngle + Math.PI));
  const guardLeft = addVector(hand, polar(6.4, bladeAngle + Math.PI / 2));
  const guardRight = addVector(hand, polar(6.4, bladeAngle - Math.PI / 2));
  const bladeBase = addVector(hand, polar(6.8, bladeAngle));
  const bladeTip = addVector(hand, polar(31, bladeAngle));
  const bladeEdge = addVector(bladeTip, polar(2.4, bladeAngle + Math.PI / 2));

  context.fillStyle = '#8a5422';
  context.beginPath();
  context.moveTo(pommel.x, pommel.y);
  context.lineTo(hand.x, hand.y);
  context.lineTo(bladeBase.x - 1.2, bladeBase.y - 1.2);
  context.lineTo(guardLeft.x, guardLeft.y);
  context.lineTo(guardRight.x, guardRight.y);
  context.closePath();
  context.fill();

  context.fillStyle = appearance.weaponShadow;
  context.beginPath();
  context.moveTo(bladeBase.x, bladeBase.y);
  context.lineTo(bladeEdge.x, bladeEdge.y);
  context.lineTo(bladeTip.x, bladeTip.y);
  context.closePath();
  context.fill();

  context.strokeStyle = appearance.weapon;
  context.lineWidth = 1.5;
  context.beginPath();
  context.moveTo(bladeBase.x + 1.2, bladeBase.y + 0.8);
  context.lineTo(bladeTip.x, bladeTip.y);
  context.stroke();
}

function drawCapsule(context, start, end, radius, fillStyle, strokeStyle) {
  context.strokeStyle = fillStyle;
  context.lineWidth = radius * 2;
  context.lineCap = 'round';
  context.beginPath();
  context.moveTo(start.x, start.y);
  context.lineTo(end.x, end.y);
  context.stroke();

  if (strokeStyle) {
    context.strokeStyle = strokeStyle;
    context.lineWidth = 1.2;
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
    context.stroke();
  }
}

function drawJoint(context, point, radius, fillStyle, strokeStyle) {
  context.fillStyle = fillStyle;
  context.beginPath();
  context.arc(point.x, point.y, radius, 0, TAU);
  context.fill();

  if (strokeStyle) {
    context.strokeStyle = strokeStyle;
    context.lineWidth = 1;
    context.beginPath();
    context.arc(point.x, point.y, radius, 0, TAU);
    context.stroke();
  }
}

function solveTwoBoneIk(root, target, upperLength, lowerLength, options = {}) {
  const { bendSign = 1, bendBias = 0, stretchLimit = 0.98, minimumReach = 8 } = options;
  const delta = subtractVector(target, root);
  const distanceToTarget = Math.hypot(delta.x, delta.y);
  const safeDistance = clamp(
    distanceToTarget || minimumReach,
    minimumReach,
    (upperLength + lowerLength) * stretchLimit
  );
  const direction = distanceToTarget
    ? { x: delta.x / distanceToTarget, y: delta.y / distanceToTarget }
    : { x: 1, y: 0 };
  const clampedTarget = addVector(root, scaleVector(direction, safeDistance));
  const angleToTarget = Math.atan2(direction.y, direction.x);
  const elbowOffset = Math.acos(
    clamp(
      (upperLength ** 2 + safeDistance ** 2 - lowerLength ** 2) / (2 * upperLength * safeDistance),
      -1,
      1
    )
  );
  const biasAngle = degToRad(clamp(bendBias, -24, 32)) * 0.12;
  const kneeAngle = angleToTarget + elbowOffset * bendSign + biasAngle;

  return {
    knee: addVector(root, polar(upperLength, kneeAngle)),
    end: clampedTarget,
  };
}

function addVector(a, b) {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
  };
}

function subtractVector(a, b) {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
  };
}

function scaleVector(vector, scalar) {
  return {
    x: vector.x * scalar,
    y: vector.y * scalar,
  };
}

function polar(length, angle) {
  return {
    x: Math.cos(angle) * length,
    y: Math.sin(angle) * length,
  };
}

function vectorFromAngle(angle) {
  return {
    x: Math.cos(angle),
    y: Math.sin(angle),
  };
}

function normalize(vector, fallback) {
  const length = Math.hypot(vector.x, vector.y);

  if (!length) {
    return fallback;
  }

  return {
    x: vector.x / length,
    y: vector.y / length,
  };
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function degToRad(value) {
  return (value * Math.PI) / 180;
}
