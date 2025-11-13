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
    this.energy = 100; // Energía inicial al 100%
    this.maxEnergy = 100;
    this.energyDrainRate = 5.5; // Unidades por segundo - drenaje gradual
    this.energyRechargeAmount = 30; // Energía que da cada batería
    this.gameSpeed = CONSTANTS.GAME_INITIAL_STATE.SPEED;
    this.gameOver = CONSTANTS.GAME_INITIAL_STATE.GAME_OVER;
    this.gamePaused = CONSTANTS.GAME_INITIAL_STATE.GAME_PAUSED;
    this.lastDifficultyIncrease = 0;
    this.hasPlayerInteracted = false;
    this.difficultyLevel = CONSTANTS.OBSTACLE_MANAGER_CONFIG.INITIAL_DIFFICULTY;

    // Power-ups
    this.dashActive = false;
    this.dashRemainingMs = 0;
    this.dashSpeedBonus = 0;
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
   * Agrega una batería al contador y recarga energía
   */
  addBattery() {
    this.batteries += 1;
    this.rechargeEnergy();
  }

  /**
   * Actualiza la energía (se drena con el tiempo)
   */
  updateEnergy(deltaSeconds) {
    if (!this.gameOver && !this.gamePaused && this.energy > 0) {
      this.energy = Math.max(
        0,
        this.energy - this.energyDrainRate * deltaSeconds
      );

      // Si la energía llega a 0, termina el juego
      if (this.energy <= 0) {
        this.endGame();
      }
    }
  }

  /**
   * Recarga energía al recoger una batería
   */
  rechargeEnergy() {
    this.energy = Math.min(
      this.maxEnergy,
      this.energy + this.energyRechargeAmount
    );
  }

  /**
   * Obtiene el nivel de energía actual (0-100)
   */
  getEnergyLevel() {
    return Math.floor(this.energy);
  }

  /**
   * Obtiene el porcentaje de energía (0-100)
   */
  getEnergyPercentage() {
    return Math.floor((this.energy / this.maxEnergy) * 100);
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
   * Activa el power-up de DASH por una duración dada
   */
  activateDash(
    durationMs = CONSTANTS.POWERUPS.DASH.DURATION_MS,
    speedBoost = CONSTANTS.POWERUPS.DASH.SPEED_BOOST
  ) {
    this.dashActive = true;
    this.dashRemainingMs = durationMs;
    this.dashSpeedBonus = speedBoost;
  }

  /**
   * Actualiza el temporizador del DASH
   */
  tickDash(deltaMs) {
    if (!this.dashActive) return;
    this.dashRemainingMs = Math.max(0, this.dashRemainingMs - deltaMs);
    if (this.dashRemainingMs <= 0) {
      this.dashActive = false;
      this.dashSpeedBonus = 0;
    }
  }

  isDashActive() {
    return this.dashActive;
  }

  getDashRemainingMs() {
    return this.dashRemainingMs;
  }

  getDashRemainingSeconds() {
    return Math.max(0, this.dashRemainingMs / 1000);
  }

  getActivePowerupLabel() {
    return this.dashActive ? CONSTANTS.POWERUPS.DASH.HUD_LABEL : null;
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
    // Aplicar bonificación temporal si hay dash activo
    if (this.dashActive) {
      const maxWithBoost =
        CONSTANTS.GAME_INITIAL_STATE.MAX_SPEED + this.dashSpeedBonus;
      return Math.min(this.gameSpeed + this.dashSpeedBonus, maxWithBoost);
    }
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
