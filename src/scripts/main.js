const canvas = document.getElementById('game-canvas');
const statusBadge = document.getElementById('status-badge');

if (canvas instanceof HTMLCanvasElement && statusBadge) {
  const context = canvas.getContext('2d');

  if (context) {
    drawPlaceholderScene(context, canvas.width, canvas.height);
    statusBadge.textContent = 'Ready';
  } else {
    statusBadge.textContent = 'Canvas Error';
  }
}

function drawPlaceholderScene(context, width, height) {
  context.fillStyle = '#112226';
  context.fillRect(0, 0, width, height);

  context.fillStyle = '#18363d';
  for (let y = 0; y < height; y += 48) {
    for (let x = 0; x < width; x += 48) {
      if ((x + y) % 96 === 0) {
        context.fillRect(x, y, 48, 48);
      }
    }
  }

  context.fillStyle = '#d6f5d0';
  context.fillRect(144, 180, 48, 48);

  context.fillStyle = '#ffd166';
  context.fillRect(624, 276, 48, 48);

  context.strokeStyle = '#ffffff22';
  context.lineWidth = 2;
  context.strokeRect(144, 180, 48, 48);
  context.strokeRect(624, 276, 48, 48);

  context.fillStyle = '#f8f4e8';
  context.font = '700 42px Segoe UI';
  context.fillText('RPG Prototype Base', 48, 72);

  context.font = '400 22px Segoe UI';
  context.fillStyle = '#b8d0c7';
  context.fillText('Implement systems in src/scripts and assets/', 48, 114);

  context.font = '700 18px Segoe UI';
  context.fillStyle = '#f4e285';
  context.fillText('P', 160, 212);
  context.fillText('E', 640, 308);
}
