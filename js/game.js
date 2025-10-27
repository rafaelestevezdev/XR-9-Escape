/**
 * Archivo principal del juego - Configuración de Phaser
 * Responsabilidad: Solo configurar e inicializar el juego
 */

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "game-container",
  pixelArt: true,
  transparent: false,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 800 }, // Aumentada para saltos más cortos y realistas como Chrome Dino
      debug: false,
    },
  },
  scene: GameScene,
};

const game = new Phaser.Game(config);

// Variable para controlar si el juego ha iniciado
let gameStarted = false;

// Iniciar el juego desde el botón HTML
function startGame() {
  const startScreen = document.getElementById("start-screen");
  if (startScreen) {
    startScreen.classList.add("hidden");
  }

  const scene = game.scene.getScene("GameScene");
  if (scene && !gameStarted) {
    gameStarted = true;
    scene.startGameplay();
  }
}

// Manejar reinicio desde el botón HTML
function restartGame() {
  const scene = game.scene.getScene("GameScene");
  if (scene) {
    scene.restartGame();
  }
}

// Volver al menú principal
function returnToMenu() {
  const gameOverScreen = document.getElementById("game-over-screen");
  if (gameOverScreen) {
    gameOverScreen.classList.remove("show");
  }
  const startScreen = document.getElementById("start-screen");
  if (startScreen) {
    startScreen.classList.remove("hidden");
  }
  gameStarted = false;
  const scene = game.scene.getScene("GameScene");
  if (scene) {
    scene.returnToMenu();
  }
}
