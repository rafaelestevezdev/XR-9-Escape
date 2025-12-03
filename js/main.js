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
    width: CONSTANTS.GAME_CONFIG.WIDTH,
    height: CONSTANTS.GAME_CONFIG.HEIGHT,
  },
  physics: {
    default: CONSTANTS.PHYSICS_CONFIG.DEFAULT,
    arcade: {
      gravity: CONSTANTS.PHYSICS_CONFIG.GRAVITY,
      debug: CONSTANTS.PHYSICS_CONFIG.DEBUG,
    },
  },
  input: {
    // Optimizaciones para entrada táctil
    activePointers: 3, // Soportar múltiples toques
    smoothFactor: 0, // Sin suavizado para respuesta inmediata
    windowEvents: true,
  },
  // Optimizaciones de rendimiento
  fps: {
    target: 60,
    forceSetTimeOut: false,
  },
  render: {
    pixelArt: true,
    antialias: false,
    roundPixels: true,
  },
  // Iniciar con la escena de fondo y lanzar la principal encima
  scene: [EscenaIndustrial, GameScene],
};

// Variable global para la instancia del juego
let gameInstance = null;

// Función para inicializar el juego
function initializeGame() {
  try {
    // Crear instancia del juego
    gameInstance = new Phaser.Game(config);
    if (CONSTANTS.DEBUG) console.log("🎮 XR-9 Game initialized successfully");

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
    if (CONSTANTS.DEBUG) console.log("🗑️ Game instance destroyed");
  }
}

// Funciones de interfaz para el DOM (mantenidas por compatibilidad)
function startGame() {
  if (CONSTANTS.DEBUG) console.log("▶️ startGame() called from main.js");

  // 1. Mostrar overlay de transición
  const transitionOverlay = document.getElementById("transition-overlay");
  if (transitionOverlay) {
    transitionOverlay.classList.add("active");
  }

  // 2. Fade out música del menú (si existe)
  if (window.menuMusic && window.isMenuMusicPlaying) {
    const fadeAudio = setInterval(() => {
      if (window.menuMusic.volume > 0.05) {
        window.menuMusic.volume -= 0.05;
      } else {
        window.menuMusic.pause();
        window.menuMusic.volume = localStorage.getItem("xr9_music_volume")
          ? parseInt(localStorage.getItem("xr9_music_volume")) / 100
          : 0.45; // Restaurar volumen original
        window.isMenuMusicPlaying = false;
        clearInterval(fadeAudio);
      }
    }, 100); // Fade out más lento (aprox 900ms) para coincidir con la transición
  }

  // 3. Esperar 1 segundo antes de iniciar realmente el juego
  setTimeout(() => {
    const scene = gameInstance?.scene.getScene("GameScene");
    if (scene && !gameStarted) {
      gameStarted = true;
      scene.startGame();

      // Ocultar overlay después de iniciar
      if (transitionOverlay) {
        setTimeout(() => {
          transitionOverlay.classList.remove("active");
        }, 500);
      }
    }
  }, 1000);
}

function restartGame() {
  if (CONSTANTS.DEBUG) console.log("🔄 restartGame() called from main.js");
  const scene = gameInstance?.scene.getScene("GameScene");
  if (scene) {
    gameStarted = true; // Mantener el estado de que el juego ha comenzado
    scene.restartGame();
  }
}

function returnToMenu() {
  if (CONSTANTS.DEBUG) console.log("🏠 returnToMenu() called from main.js");
  gameStarted = false;

  // Reiniciar música del menú si no está muteada
  if (window.menuMusic && !window.isMuted) {
    window.menuMusic.currentTime = 0;
    window.menuMusic
      .play()
      .catch((e) => console.log("Menu music play failed", e));
    window.isMenuMusicPlaying = true;
  }

  const scene = gameInstance?.scene.getScene("GameScene");
  if (scene) {
    scene.returnToMenu();
  }
}

// Alternar pausa desde el DOM
function togglePause() {
  const scene = gameInstance?.scene.getScene("GameScene");
  if (scene) {
    scene.togglePause();
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
  if (CONSTANTS.DEBUG) console.log("🚀 Starting XR-9 Game...");
  initializeGame();
});

// Exportar funciones globales para acceso desde HTML
window.startGame = startGame;
window.restartGame = restartGame;
window.returnToMenu = returnToMenu;
window.togglePause = togglePause;
window.showConfig = showConfig;
window.showControls = showControls;
window.closeModal = closeModal;
window.getGameInstance = getGameInstance;
window.destroyGame = destroyGame;

// Fullscreen logic
window.toggleFullscreen = function () {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch((err) => {
      console.log(`Error attempting to enable fullscreen: ${err.message}`);
    });
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
};

// Update fullscreen icon
document.addEventListener("fullscreenchange", () => {
  const enterIcon = document.getElementById("icon-fullscreen-enter");
  const exitIcon = document.getElementById("icon-fullscreen-exit");

  if (document.fullscreenElement) {
    enterIcon.classList.add("hidden");
    exitIcon.classList.remove("hidden");
  } else {
    enterIcon.classList.remove("hidden");
    exitIcon.classList.add("hidden");
  }
});

// Show fullscreen button on mobile
if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
  const fsBtn = document.getElementById("fullscreen-btn");
  if (fsBtn) fsBtn.classList.remove("hidden");
}
