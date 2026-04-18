const TAU = Math.PI * 2;

const HERO_APPEARANCE = Object.freeze({
  skin: '#f7c291',
  skinShadow: '#d98f62',
  hair: '#3d2619',
  hairHighlight: '#6e4632',
  outfit: '#5d6fcf',
  outfitShadow: '#32418f',
  trim: '#f7d575',
  cape: '#c84e4b',
  capeShadow: '#7f222b',
  legs: '#57331f',
  legsShadow: '#2d170d',
  weapon: '#e7f2ff',
  weaponShadow: '#7992b6',
  line: 'rgba(42, 27, 16, 0.28)',
  aura: 'rgba(255, 226, 124, 0.55)',
  hasAura: true,
  hasCape: true,
  hasWeapon: true,
  dress: false,
});

const GUEST_APPEARANCE = Object.freeze({
  skin: '#ffd5bf',
  skinShadow: '#e1a07f',
  hair: '#5a312c',
  hairHighlight: '#8a5750',
  outfit: '#f8dccd',
  outfitShadow: '#cf8575',
  trim: '#2c3467',
  cape: '#df7f6d',
  capeShadow: '#8a4342',
  legs: '#463134',
  legsShadow: '#7f4c4b',
  weapon: '#ffffff',
  weaponShadow: '#ffffff',
  line: 'rgba(81, 43, 35, 0.26)',
  aura: 'rgba(255, 194, 180, 0.18)',
  hasAura: false,
  hasCape: false,
  hasWeapon: false,
  dress: true,
});

export const PLAYER_APPEARANCE = HERO_APPEARANCE;
export const CHIZURU_APPEARANCE = GUEST_APPEARANCE;

export function drawHumanoid(context, options) {
  const {
    x,
    baseY,
    pose,
    appearance = HERO_APPEARANCE,
    facing = 'right',
    scale = 1,
    footHeights = { left: 0, right: 0 },
    shadowOpacity = 0.24,
  } = options;

  context.save();
  context.translate(x, baseY);
  context.scale(facing === 'left' ? -scale : scale, -scale);

  if (appearance.hasAura) {
    const aura = context.createRadialGradient(0, 60, 2, 0, 60, 44);
    aura.addColorStop(0, appearance.aura);
    aura.addColorStop(1, 'rgba(255, 226, 124, 0)');
    context.fillStyle = aura;
    context.beginPath();
    context.ellipse(0, 60, 34, 26, 0, 0, TAU);
    context.fill();
  }

  context.globalAlpha = shadowOpacity;
  context.fillStyle = 'rgba(26, 16, 12, 0.34)';
  context.beginPath();
  context.ellipse(0, 0, 30, 9, 0, 0, TAU);
  context.fill();
  context.globalAlpha = 1;

  const pelvis = {
    x: 0,
    y: 54 + pose.pelvisLift,
  };
  const torsoAngle = Math.PI / 2 + degToRad(pose.bodyLean);
  const up = vectorFromAngle(torsoAngle);
  const right = vectorFromAngle(torsoAngle - Math.PI / 2);
  const chest = addVector(pelvis, scaleVector(up, 24));
  const neck = addVector(chest, scaleVector(up, 18));
  const headCenter = addVector(
    neck,
    scaleVector(vectorFromAngle(Math.PI / 2 + degToRad(pose.headTilt + pose.bodyLean * 0.35)), 12)
  );

  const leftHip = addVector(pelvis, addVector(scaleVector(right, -7), scaleVector(up, -1)));
  const rightHip = addVector(pelvis, addVector(scaleVector(right, 7), scaleVector(up, -1)));
  const leftShoulder = addVector(chest, addVector(scaleVector(right, -11), scaleVector(up, 1)));
  const rightShoulder = addVector(chest, addVector(scaleVector(right, 11), scaleVector(up, 1)));

  const leftFoot = {
    x: pose.footLeftX,
    y: pose.footLeftY + footHeights.left,
  };
  const rightFoot = {
    x: pose.footRightX,
    y: pose.footRightY + footHeights.right,
  };

  const leftLeg = solveTwoBoneIk(leftHip, leftFoot, 26, 24);
  const rightLeg = solveTwoBoneIk(rightHip, rightFoot, 26, 24);

  const leftUpperArmAngle = torsoAngle + degToRad(-154 + pose.armLeft);
  const leftElbow = addVector(leftShoulder, polar(18, leftUpperArmAngle));
  const leftHand = addVector(
    leftElbow,
    polar(16, leftUpperArmAngle + degToRad(-18 + pose.forearmLeft))
  );

  const rightUpperArmAngle = torsoAngle + degToRad(-110 + pose.armRight);
  const rightElbow = addVector(rightShoulder, polar(18, rightUpperArmAngle));
  const rightHand = addVector(
    rightElbow,
    polar(16, rightUpperArmAngle + degToRad(-8 + pose.forearmRight))
  );

  drawLeg(context, leftHip, leftLeg.knee, leftFoot, appearance, 5.8, 5.2);

  if (appearance.hasCape) {
    drawCape(context, leftShoulder, rightShoulder, pelvis, pose, appearance);
  }

  drawArm(context, leftShoulder, leftElbow, leftHand, appearance, 4.8, 4.3);
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
  drawHead(context, headCenter, appearance, pose);
  drawLeg(context, rightHip, rightLeg.knee, rightFoot, appearance, 6.4, 5.6);
  drawArm(context, rightShoulder, rightElbow, rightHand, appearance, 5.2, 4.6);

  if (appearance.hasWeapon) {
    drawWeapon(context, rightHand, pose, appearance);
  }

  context.restore();
}

function drawArm(context, shoulder, elbow, hand, appearance, upperRadius, lowerRadius) {
  drawCapsule(context, shoulder, elbow, upperRadius, appearance.skin, appearance.line);
  drawCapsule(context, elbow, hand, lowerRadius, appearance.outfitShadow, appearance.line);
  drawHand(context, hand, appearance);
}

function drawCape(context, leftShoulder, rightShoulder, pelvis, pose, appearance) {
  const sway = pose.capeSwing * 0.45;
  const tailLeft = { x: -22 - sway, y: 14 };
  const tailRight = { x: 8 - sway * 0.4, y: 12 };

  context.fillStyle = appearance.cape;
  context.beginPath();
  context.moveTo(leftShoulder.x + 3, leftShoulder.y - 2);
  context.quadraticCurveTo(pelvis.x - 18, pelvis.y + 18, tailLeft.x, tailLeft.y);
  context.quadraticCurveTo(-2, 4, tailRight.x, tailRight.y);
  context.quadraticCurveTo(pelvis.x + 7, pelvis.y + 20, rightShoulder.x - 2, rightShoulder.y - 6);
  context.closePath();
  context.fill();

  context.strokeStyle = appearance.capeShadow;
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(leftShoulder.x + 2, leftShoulder.y - 4);
  context.quadraticCurveTo(-4, 26, tailLeft.x + 8, tailLeft.y + 6);
  context.stroke();
}

function drawHead(context, headCenter, appearance, pose) {
  context.fillStyle = appearance.skin;
  context.beginPath();
  context.arc(headCenter.x, headCenter.y, 11.6, 0, TAU);
  context.fill();

  context.fillStyle = appearance.hair;
  context.beginPath();
  context.arc(headCenter.x + 1, headCenter.y + 3.4, 12.4, degToRad(12), degToRad(188));
  context.lineTo(headCenter.x - 7, headCenter.y + 3);
  context.quadraticCurveTo(headCenter.x - 2, headCenter.y - 4, headCenter.x + 6, headCenter.y - 2);
  context.closePath();
  context.fill();

  context.strokeStyle = appearance.hairHighlight;
  context.lineWidth = 1.8;
  context.beginPath();
  context.arc(headCenter.x + 1.6, headCenter.y + 3.5, 8.6, degToRad(46), degToRad(126));
  context.stroke();

  context.strokeStyle = 'rgba(56, 34, 25, 0.72)';
  context.lineWidth = 1.4;
  context.beginPath();
  context.moveTo(headCenter.x + 3, headCenter.y - 1);
  context.lineTo(headCenter.x + 8, headCenter.y - 1.5 + pose.headTilt * 0.04);
  context.stroke();

  context.beginPath();
  context.moveTo(headCenter.x + 4.5, headCenter.y - 6);
  context.quadraticCurveTo(
    headCenter.x + 6.8,
    headCenter.y - 6.8,
    headCenter.x + 8,
    headCenter.y - 5.4
  );
  context.stroke();
}

function drawHand(context, hand, appearance) {
  context.fillStyle = appearance.skinShadow;
  context.beginPath();
  context.arc(hand.x, hand.y, 3.2, 0, TAU);
  context.fill();
}

function drawLeg(context, hip, knee, foot, appearance, upperRadius, lowerRadius) {
  drawCapsule(context, hip, knee, upperRadius, appearance.legs, appearance.line);
  drawCapsule(context, knee, foot, lowerRadius, appearance.legsShadow, appearance.line);

  context.strokeStyle = appearance.legsShadow;
  context.lineWidth = 5.2;
  context.lineCap = 'round';
  context.beginPath();
  context.moveTo(foot.x - 3, foot.y);
  context.lineTo(foot.x + 8, foot.y + 0.4);
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
  context.fillStyle = appearance.outfit;
  context.beginPath();
  context.moveTo(leftShoulder.x, leftShoulder.y);
  context.lineTo(rightShoulder.x, rightShoulder.y);
  context.lineTo(rightHip.x + 3, rightHip.y + 5);
  context.lineTo(leftHip.x - 2, leftHip.y + 5);
  context.closePath();
  context.fill();

  context.fillStyle = appearance.trim;
  context.beginPath();
  context.moveTo(leftShoulder.x + 2, leftShoulder.y - 2);
  context.lineTo(rightShoulder.x - 1, rightShoulder.y - 2);
  context.lineTo(chest.x + 2, chest.y - 8);
  context.lineTo(chest.x - 4, chest.y - 8);
  context.closePath();
  context.fill();

  context.strokeStyle = appearance.outfitShadow;
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(chest.x, chest.y - 2);
  context.lineTo(pelvis.x + pose.pelvisTilt * 0.14, pelvis.y + 2);
  context.stroke();

  context.fillStyle = appearance.outfitShadow;
  context.beginPath();
  context.ellipse(pelvis.x, pelvis.y + 3, 10, 5, 0, 0, TAU);
  context.fill();

  if (appearance.dress) {
    context.fillStyle = appearance.cape;
    context.beginPath();
    context.moveTo(leftHip.x - 3, leftHip.y + 4);
    context.lineTo(rightHip.x + 4, rightHip.y + 4);
    context.lineTo(rightHip.x + 10, rightHip.y - 14);
    context.lineTo(leftHip.x - 8, leftHip.y - 14);
    context.closePath();
    context.fill();
  }
}

function drawWeapon(context, hand, pose, appearance) {
  const bladeAngle = degToRad(18 + pose.weaponSwing);
  const bladeTip = addVector(hand, polar(28, bladeAngle));

  context.strokeStyle = appearance.weaponShadow;
  context.lineWidth = 4;
  context.lineCap = 'round';
  context.beginPath();
  context.moveTo(hand.x, hand.y);
  context.lineTo(bladeTip.x, bladeTip.y);
  context.stroke();

  context.strokeStyle = appearance.weapon;
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(hand.x + 2, hand.y + 1);
  context.lineTo(bladeTip.x + 2, bladeTip.y + 1);
  context.stroke();

  context.strokeStyle = '#a56a24';
  context.lineWidth = 4.5;
  context.beginPath();
  context.moveTo(hand.x - 4, hand.y + 1.5);
  context.lineTo(hand.x + 5, hand.y - 1.5);
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
    context.lineWidth = 1.35;
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
    context.stroke();
  }
}

function solveTwoBoneIk(root, target, upperLength, lowerLength) {
  const delta = subtractVector(target, root);
  const distance = clamp(Math.hypot(delta.x, delta.y), 4, upperLength + lowerLength - 0.001);
  const direction = Math.atan2(delta.y, delta.x);
  const elbowOffset = Math.acos(
    clamp(
      (upperLength ** 2 + distance ** 2 - lowerLength ** 2) / (2 * upperLength * distance),
      -1,
      1
    )
  );
  const upperAngle = direction + elbowOffset;
  const knee = addVector(root, polar(upperLength, upperAngle));

  return {
    knee,
    foot: target,
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

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function degToRad(value) {
  return (value * Math.PI) / 180;
}
