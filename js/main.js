import { Player } from "./Player.js";
import { InputHandler } from "./InputHandler.js";
import { Obstacle } from "./Obstacle.js";
import { Score } from "./Score.js";
import { Piece } from "./Piece.js";

window.onload = function () {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const playerX = 200; // posición fija del personaje en X
  const player = new Player(playerX, canvas.height - 40 - 60, canvas.height);
  player.jumpStrength = -22; // salto más fuerte para mejor jugabilidad
  const input = new InputHandler(player);
  let scrollX = 0;

  // Obstáculos
  const obstacles = [];
  let lastObstacleX = 600;

  // Piezas tecnológicas
  const pieces = [];
  let lastPieceX = 800;
  let piecesCollected = 0;

  // Score
  const score = new Score();

  // Velocidad base y aceleración
  let baseSpeed = 4;
  let maxSpeed = 10;

  // Estado del juego
  let gameOver = false;

  // Modal
  const modal = document.getElementById("gameModal");
  const restartBtn = document.getElementById("restartBtn");
  restartBtn.onclick = () => {
    modal.classList.remove("show");
    setTimeout(() => {
      modal.style.display = "none";
      window.location.reload();
    }, 300);
  };

  function drawBackground(scrollX) {
    // Gradiente para cielo industrial
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#b0bec5"); // gris claro arriba
    gradient.addColorStop(1, "#78909c"); // gris más oscuro abajo
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Suelo con textura simple
    ctx.fillStyle = "#607d8b";
    ctx.fillRect(-scrollX % canvas.width, canvas.height - 40, canvas.width, 40);
    ctx.fillRect(
      canvas.width - (scrollX % canvas.width),
      canvas.height - 40,
      canvas.width,
      40
    );

    // Agregar líneas para simular grietas o detalles
    ctx.strokeStyle = "#455a64";
    ctx.lineWidth = 2;
    for (let i = 0; i < canvas.width; i += 100) {
      ctx.beginPath();
      ctx.moveTo(i - (scrollX % 100), canvas.height - 40);
      ctx.lineTo(i - (scrollX % 100) + 50, canvas.height - 20);
      ctx.stroke();
    }
  }

  function spawnObstacle() {
    if (scrollX + canvas.width > lastObstacleX) {
      // Genera obstáculos industriales aleatorios
      obstacles.push(
        new Obstacle(lastObstacleX + 400, canvas.height - 40 - 40)
      );
      lastObstacleX += 400;
    }
  }

  function spawnPiece() {
    if (scrollX + canvas.width > lastPieceX) {
      // Genera la pieza en una posición vertical aleatoria sobre el suelo
      const pieceX = lastPieceX + 500;
      // Verifica que no haya obstáculos cerca
      const minDistance = 80;
      let tooClose = false;
      for (const obstacle of obstacles) {
        if (Math.abs(obstacle.x - pieceX) < minDistance) {
          tooClose = true;
          break;
        }
      }
      if (!tooClose) {
        // Altura aleatoria, pero asegurando que no se superponga con obstáculos
        const y = canvas.height - 40 - 32 - Math.floor(Math.random() * 80);
        pieces.push(new Piece(pieceX, y));
        lastPieceX += 500;
      } else {
        // Si está muy cerca de un obstáculo, pospone la generación
        lastPieceX += 100;
      }
    }
  }

  function drawObstacles() {
    obstacles.forEach((obstacle) => {
      obstacle.draw(ctx, scrollX);
    });
  }

  function drawPieces() {
    pieces.forEach((piece) => {
      piece.draw(ctx, scrollX);
    });
  }

  function updateSpeed() {
    const meters = Math.floor(scrollX / 10);
    player.speed = Math.min(baseSpeed + meters / 100, maxSpeed);
  }

  function checkCollision() {
    for (const obstacle of obstacles) {
      const obsX = obstacle.x - scrollX;
      if (
        player.x < obsX + obstacle.width &&
        player.x + player.width > obsX &&
        player.y < obstacle.y + obstacle.height &&
        player.y + player.height > obstacle.y
      ) {
        return true;
      }
    }
    return false;
  }

  function checkPieceCollection() {
    for (const piece of pieces) {
      if (piece.collected) continue;
      const px = piece.x - scrollX;
      if (
        player.x < px + piece.width &&
        player.x + player.width > px &&
        player.y < piece.y + piece.height &&
        player.y + player.height > piece.y
      ) {
        piece.collected = true;
        piecesCollected++;
      }
    }
  }

  function drawPieceCounter() {
    ctx.save();
    ctx.font = "bold 24px Arial";
    ctx.fillStyle = "#1976d2";
    ctx.textAlign = "left";
    ctx.fillText(`🔋 ${piecesCollected}`, 30, 40);
    ctx.restore();
  }

  function gameLoop() {
    if (gameOver) return;
    updateSpeed();
    scrollX += player.speed;
    drawBackground(scrollX);
    spawnObstacle();
    spawnPiece();
    drawObstacles();
    drawPieces();
    player.update();
    player.draw(ctx);
    score.update(scrollX / 10); // 10 píxeles = 1 metro
    score.draw(ctx, canvas);
    checkPieceCollection();
    drawPieceCounter();
    if (checkCollision()) {
      gameOver = true;
      modal.style.display = "flex";
      modal.classList.add("show");
      return;
    }
    requestAnimationFrame(gameLoop);
  }

  gameLoop();
};
