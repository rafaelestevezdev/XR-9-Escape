/**
 * GameState.js - Responsable de gestionar el estado del juego
 * Principio de responsabilidad única: Solo maneja el estado y lógica de puntuación
 */

class GameState {
  constructor() {
    this.reset();
  }

  /**
   * Resetea todo el estado del juego a valores iniciales
   */
  reset() {
    this.score = CONSTANTS.GAME_INITIAL_STATE.SCORE;
    this.batteries = CONSTANTS.GAME_INITIAL_STATE.BATTERIES;
    this.gameSpeed = CONSTANTS.GAME_INITIAL_STATE.SPEED;
    this.gameOver = CONSTANTS.GAME_INITIAL_STATE.GAME_OVER;
    this.gamePaused = CONSTANTS.GAME_INITIAL_STATE.GAME_PAUSED;
    this.lastDifficultyIncrease = 0;
    this.hasPlayerInteracted = false;
    this.difficultyLevel = CONSTANTS.OBSTACLE_MANAGER_CONFIG.INITIAL_DIFFICULTY;
  }

  /**
   * Inicia el gameplay
   */
  startGameplay() {
    this.gamePaused = false;
  }

  /**
   * Pausa el juego
   */
  pauseGame() {
    this.gamePaused = true;
  }

  /**
   * Reanuda el juego
   */
  resumeGame() {
    this.gamePaused = false;
  }

  /**
   * Termina el juego
   */
  endGame() {
    this.gameOver = true;
    this.gamePaused = true;
  }

  /**
   * Incrementa la puntuación basada en el tiempo
   */
  incrementScore(deltaSeconds) {
    if (!this.gameOver && !this.gamePaused) {
      this.score += Math.floor(
        deltaSeconds * CONSTANTS.SCORING.TIME_MULTIPLIER
      );
    }
  }

  /**
   * Agrega puntos extra a la puntuación
   */
  addScore(points) {
    if (!this.gameOver && !this.gamePaused) {
      this.score += points;
    }
  }

  /**
   * Agrega una batería al contador
   */
  addBattery() {
    this.batteries += 1;
  }

  /**
   * Incrementa la velocidad del juego
   */
  increaseSpeed() {
    this.gameSpeed = Math.min(
      this.gameSpeed + CONSTANTS.GAME_INITIAL_STATE.SPEED_INCREMENT,
      CONSTANTS.GAME_INITIAL_STATE.MAX_SPEED
    );
  }

  /**
   * Incrementa el nivel de dificultad
   */
  increaseDifficulty() {
    this.difficultyLevel += 1;
    this.increaseSpeed();
  }

  /**
   * Verifica si debe aumentar la dificultad
   */
  shouldIncreaseDifficulty(currentTime) {
    return (
      currentTime - this.lastDifficultyIncrease >=
      CONSTANTS.GAME_INITIAL_STATE.DIFFICULTY_INTERVAL
    );
  }

  /**
   * Actualiza el timestamp del último aumento de dificultad
   */
  updateLastDifficultyIncrease(currentTime) {
    this.lastDifficultyIncrease = currentTime;
  }

  /**
   * Obtiene la puntuación actual formateada
   */
  getFormattedScore() {
    return (
      Math.floor(this.score)
        .toString()
        .padStart(CONSTANTS.SCORING.SCORE_PADDING, "0") +
      CONSTANTS.SCORING.SCORE_SUFFIX
    );
  }

  /**
   * Obtiene la puntuación como número
   */
  getScore() {
    return Math.floor(this.score);
  }

  /**
   * Obtiene el conteo de baterías
   */
  getBatteryCount() {
    return this.batteries;
  }

  /**
   * Obtiene la velocidad actual
   */
  getGameSpeed() {
    return this.gameSpeed;
  }

  /**
   * Obtiene el nivel de dificultad actual
   */
  getDifficultyLevel() {
    return this.difficultyLevel;
  }

  /**
   * Verifica si el juego está activo (no pausado y no terminado)
   */
  isGameActive() {
    return !this.gameOver && !this.gamePaused;
  }

  /**
   * Verifica si el juego está pausado
   */
  isGamePaused() {
    return this.gamePaused;
  }

  /**
   * Verifica si el juego terminó
   */
  isGameOver() {
    return this.gameOver;
  }

  /**
   * Marca que el jugador ha interactuado
   */
  setPlayerInteracted() {
    this.hasPlayerInteracted = true;
  }

  /**
   * Verifica si el jugador ha interactuado
   */
  getHasPlayerInteracted() {
    return this.hasPlayerInteracted;
  }
}
