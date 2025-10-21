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
