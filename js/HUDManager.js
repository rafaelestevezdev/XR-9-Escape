/**
 * HUDManager.js - Responsable de gestionar la interfaz de usuario (HUD)
 * Principio de responsabilidad única: Solo maneja elementos de UI y HUD
 */

class HUDManager {
  constructor(scene) {
    this.scene = scene;

    // Referencias a elementos DOM
    this.scoreElement = null;
    this.batteryCountElement = null;
    this.speedIndicatorElement = null;
    this.stageIndicatorElement = null;
    this.startScreenElement = null;
    this.gameOverScreenElement = null;
    this.finalScoreElement = null;
    this.finalBatteriesElement = null;

    // Estado del HUD
    this.isVisible = true;
  }

  /**
   * Inicializa el HUD y cachea referencias a elementos DOM
   */
  initialize() {
    this.cacheHudElements();
  }

  /**
   * Cachea todas las referencias a elementos del DOM
   */
  cacheHudElements() {
    this.scoreElement = document.getElementById(CONSTANTS.HUD_ELEMENTS.SCORE);
    this.batteryCountElement = document.getElementById(
      CONSTANTS.HUD_ELEMENTS.BATTERY_COUNT
    );
    this.speedIndicatorElement = document.getElementById(
      CONSTANTS.HUD_ELEMENTS.SPEED_INDICATOR
    );
    this.stageIndicatorElement = document.getElementById(
      CONSTANTS.HUD_ELEMENTS.STAGE_INDICATOR
    );
    this.startScreenElement = document.getElementById(
      CONSTANTS.HUD_ELEMENTS.START_SCREEN
    );
    this.gameOverScreenElement = document.getElementById(
      CONSTANTS.HUD_ELEMENTS.GAME_OVER_SCREEN
    );
    this.finalScoreElement = document.getElementById(
      CONSTANTS.HUD_ELEMENTS.FINAL_SCORE
    );
    this.finalBatteriesElement = document.getElementById(
      CONSTANTS.HUD_ELEMENTS.FINAL_BATTERIES
    );
  }

  /**
   * Actualiza el HUD con el estado del juego
   */
  update(gameState, delta) {
    if (!this.isVisible) return;

    this.updateScore(gameState.getScore());
    this.updateBatteryCount(gameState.getBatteryCount());
    this.updateSpeed(gameState.getGameSpeed());
    this.updateStage(gameState.getDifficultyLevel());
  }

  /**
   * Actualiza la puntuación en el HUD
   */
  updateScore(score) {
    if (this.scoreElement) {
      this.scoreElement.textContent =
        score.toString().padStart(CONSTANTS.SCORING.SCORE_PADDING, "0") +
        CONSTANTS.SCORING.SCORE_SUFFIX;
    }
  }

  /**
   * Actualiza el contador de baterías
   */
  updateBatteryCount(count) {
    if (this.batteryCountElement) {
      this.batteryCountElement.textContent = count;
    }
  }

  /**
   * Actualiza el indicador de velocidad
   */
  updateSpeed(speed) {
    if (this.speedIndicatorElement) {
      this.speedIndicatorElement.textContent = `VEL ${Math.round(speed)}`;
    }
  }

  /**
   * Actualiza el indicador de nivel/dificultad
   */
  updateStage(level) {
    if (this.stageIndicatorElement) {
      this.stageIndicatorElement.textContent = `NIV ${level
        .toString()
        .padStart(2, "0")}`;
    }
  }

  /**
   * Muestra la pantalla de inicio
   */
  showStartScreen() {
    if (this.startScreenElement) {
      this.startScreenElement.classList.remove("hidden");
    }
  }

  /**
   * Oculta la pantalla de inicio
   */
  hideStartScreen() {
    if (this.startScreenElement) {
      this.startScreenElement.classList.add("hidden");
    }
  }

  /**
   * Muestra la pantalla de game over
   */
  showGameOverScreen(finalScore, finalBatteries) {
    if (
      this.gameOverScreenElement &&
      this.finalScoreElement &&
      this.finalBatteriesElement
    ) {
      this.finalScoreElement.textContent = finalScore;
      this.finalBatteriesElement.textContent = finalBatteries;
      this.gameOverScreenElement.classList.add("show");
    }
  }

  /**
   * Oculta la pantalla de game over
   */
  hideGameOverScreen() {
    if (this.gameOverScreenElement) {
      this.gameOverScreenElement.classList.remove("show");
    }
  }

  /**
   * Muestra la pantalla de pausa
   */
  showPauseScreen() {
    // Por ahora, solo ocultamos el HUD. Podríamos agregar una pantalla de pausa específica
    this.hideHUD();
  }

  /**
   * Oculta la pantalla de pausa
   */
  hidePauseScreen() {
    // Por ahora, solo mostramos el HUD. Podríamos agregar una pantalla de pausa específica
    this.showHUD();
  }

  /**
   * Muestra el HUD
   */
  showHUD() {
    this.isVisible = true;
    // El HUD siempre está visible en el DOM, solo cambiamos la visibilidad lógica
  }

  /**
   * Oculta el HUD
   */
  hideHUD() {
    this.isVisible = false;
    // El HUD siempre está visible en el DOM, solo cambiamos la visibilidad lógica
  }

  /**
   * Alterna la visibilidad del HUD
   */
  toggleHUD() {
    if (this.isVisible) {
      this.hideHUD();
    } else {
      this.showHUD();
    }
  }

  /**
   * Verifica si el HUD está visible
   */
  isHUDVisible() {
    return this.isVisible;
  }

  /**
   * Maneja el redimensionamiento de la pantalla
   */
  handleResize(width, height) {
    // Aquí podríamos ajustar posiciones o tamaños si fuera necesario
    // Por ahora, los elementos están posicionados con CSS responsivo
  }

  /**
   * Resetea el HUD a su estado inicial
   */
  reset() {
    this.updateScore(0);
    this.updateBatteryCount(0);
    this.updateSpeed(CONSTANTS.GAME_INITIAL_STATE.SPEED);
    this.updateStage(CONSTANTS.OBSTACLE_MANAGER_CONFIG.INITIAL_DIFFICULTY);
    this.hideGameOverScreen();
    this.showStartScreen();
  }

  /**
   * Destruye el manager y limpia referencias
   */
  destroy() {
    // Limpiar referencias a elementos DOM
    this.scoreElement = null;
    this.batteryCountElement = null;
    this.speedIndicatorElement = null;
    this.stageIndicatorElement = null;
    this.startScreenElement = null;
    this.gameOverScreenElement = null;
    this.finalScoreElement = null;
    this.finalBatteriesElement = null;
  }
}
