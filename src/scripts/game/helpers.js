export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function wrapText(context, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    if (context.measureText(candidate).width <= maxWidth) {
      currentLine = candidate;
      continue;
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    currentLine = word;
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

export function fillRoundedRect(context, x, y, width, height, radius, fillStyle) {
  context.fillStyle = fillStyle;
  context.beginPath();
  roundedRectPath(context, x, y, width, height, radius);
  context.fill();
}

export function strokeRoundedRect(context, x, y, width, height, radius) {
  context.beginPath();
  roundedRectPath(context, x, y, width, height, radius);
  context.stroke();
}

function roundedRectPath(context, x, y, width, height, radius) {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  context.moveTo(x + safeRadius, y);
  context.arcTo(x + width, y, x + width, y + height, safeRadius);
  context.arcTo(x + width, y + height, x, y + height, safeRadius);
  context.arcTo(x, y + height, x, y, safeRadius);
  context.arcTo(x, y, x + width, y, safeRadius);
  context.closePath();
}

export function createSpriteImage(source) {
  const image = new Image();
  image.decoding = 'async';
  image.src = source;
  return image;
}

export function populateAppearanceSelect(select, options) {
  select.replaceChildren();

  for (const optionDefinition of options) {
    const option = document.createElement('option');
    option.value = optionDefinition.value;
    option.textContent = optionDefinition.label;
    select.append(option);
  }
}
