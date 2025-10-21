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

// Manejar reinicio desde el botón HTML
function restartGame() {
  const scene = game.scene.getScene("GameScene");
  if (scene) {
    scene.restartGame();
  }
}
