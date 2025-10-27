/**
 * main.js - Punto de entrada único de la aplicación
 * Responsabilidad: Inicializar y configurar el juego
 */

// Importar constantes primero
// (En un entorno de módulos ES6, aquí irían los imports)

// Configuración principal del juego
const config = {
  type: Phaser.AUTO,
  width: CONSTANTS.GAME_CONFIG.WIDTH,
  height: CONSTANTS.GAME_CONFIG.HEIGHT,
  parent: CONSTANTS.GAME_CONFIG.PARENT,
  pixelArt: CONSTANTS.GAME_CONFIG.PIXEL_ART,
  transparent: CONSTANTS.GAME_CONFIG.TRANSPARENT,
  scale: {
    mode: CONSTANTS.GAME_CONFIG.SCALE_MODE,
    autoCenter: CONSTANTS.GAME_CONFIG.AUTO_CENTER,
  },
  physics: {
    default: CONSTANTS.PHYSICS_CONFIG.DEFAULT,
    arcade: {
      gravity: CONSTANTS.PHYSICS_CONFIG.GRAVITY,
      debug: CONSTANTS.PHYSICS_CONFIG.DEBUG,
    },
  },
  scene: GameScene,
};

// Variable global para la instancia del juego
let gameInstance = null;

// Función para inicializar el juego
function initializeGame() {
  try {
    // Crear instancia del juego
    gameInstance = new Phaser.Game(config);
    console.log("🎮 XR-9 Game initialized successfully");

    return gameInstance;
  } catch (error) {
    console.error("❌ Error initializing game:", error);
    return null;
  }
}

// Función para obtener la instancia del juego
function getGameInstance() {
  return gameInstance;
}

// Función para destruir el juego
function destroyGame() {
  if (gameInstance) {
    gameInstance.destroy(true);
    gameInstance = null;
    console.log("🗑️ Game instance destroyed");
  }
}

// Funciones de interfaz para el DOM (mantenidas por compatibilidad)
function startGame() {
  console.log("▶️ startGame() called from main.js");
  const scene = gameInstance?.scene.getScene("GameScene");
  if (scene && !gameStarted) {
    gameStarted = true;
    scene.startGame();
  }
}

function restartGame() {
  console.log("🔄 restartGame() called from main.js");
  const scene = gameInstance?.scene.getScene("GameScene");
  if (scene) {
    gameStarted = true; // Mantener el estado de que el juego ha comenzado
    scene.restartGame();
  }
}

function returnToMenu() {
  console.log("🏠 returnToMenu() called from main.js");
  gameStarted = false;
  const scene = gameInstance?.scene.getScene("GameScene");
  if (scene) {
    scene.returnToMenu();
  }
}

// Variable para controlar si el juego ha iniciado (por compatibilidad)
let gameStarted = false;

// Funciones de modal (mantenidas por compatibilidad)
function showConfig() {
  document.getElementById("config-modal").classList.add("show");
}

function showControls() {
  document.getElementById("controls-modal").classList.add("show");
}

function closeModal() {
  document
    .querySelectorAll(".modal")
    .forEach((modal) => modal.classList.remove("show"));
}

// Inicializar el juego cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 Starting XR-9 Game...");
  initializeGame();
});

// Exportar funciones globales para acceso desde HTML
window.startGame = startGame;
window.restartGame = restartGame;
window.returnToMenu = returnToMenu;
window.showConfig = showConfig;
window.showControls = showControls;
window.closeModal = closeModal;
window.getGameInstance = getGameInstance;
window.destroyGame = destroyGame;
