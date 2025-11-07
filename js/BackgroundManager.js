/**
 * BackgroundManager.js - Responsable de gestionar el fondo del juego
 * Principio de responsabilidad única: Solo maneja el fondo y sus animaciones
 */

class BackgroundManager {
  constructor(scene) {
    this.scene = scene;
    this.skyLayer = null;
    this.horizonLayer = null;
    this.groundLayer = null;
    this.groundDetailLayer = null;
  }

  /**
   * Crea todos los elementos del fondo
   */
  create() {
    // Eliminar cualquier fondo existente y no crear nada (fondo desactivado)
    this.destroy();
  }

  /**
   * Crea la capa del cielo
   */
  createSky() {
    this.skyLayer = this.scene.add
      .image(0, 0, CONSTANTS.TEXTURE_KEYS.SKY)
      .setOrigin(0, 0)
      .setDisplaySize(CONSTANTS.GAME_CONFIG.WIDTH, CONSTANTS.GAME_CONFIG.HEIGHT)
      .setDepth(-50)
      .setScrollFactor(0);
  }

  /**
   * Crea la capa del horizonte
   */
  createHorizon() {
    this.horizonLayer = this.scene.add.graphics({ x: 0, y: 0 });

    this.horizonLayer.fillStyle(CONSTANTS.COLORS.HORIZON, 1);
    this.horizonLayer.fillRect(
      0,
      CONSTANTS.GAME_POSITIONS.GROUND_Y - 140,
      CONSTANTS.GAME_CONFIG.WIDTH,
      10
    );

    this.horizonLayer.fillStyle(CONSTANTS.COLORS.HORIZON_DETAIL, 0.65);
    this.horizonLayer.fillRect(
      0,
      CONSTANTS.GAME_POSITIONS.GROUND_Y - 130,
      CONSTANTS.GAME_CONFIG.WIDTH,
      6
    );

    this.horizonLayer.fillStyle(CONSTANTS.COLORS.HORIZON_LINE, 0.28);
    this.horizonLayer.fillRect(
      0,
      CONSTANTS.GAME_POSITIONS.GROUND_Y - 136,
      CONSTANTS.GAME_CONFIG.WIDTH,
      2
    );

    this.horizonLayer.setDepth(-40);
    this.horizonLayer.setScrollFactor(0);
  }

  /**
   * Crea la capa del suelo
   */
  createGround() {
    const groundHeight = 40; // banda plana como en el Dino
    this.groundLayer = this.scene.add
      .tileSprite(
        0,
        CONSTANTS.GAME_POSITIONS.GROUND_Y - groundHeight,
        CONSTANTS.GAME_CONFIG.WIDTH,
        groundHeight,
        CONSTANTS.TEXTURE_KEYS.GROUND
      )
      .setOrigin(0, 0)
      .setDepth(-10)
      .setScrollFactor(0);
  }

  /**
   * Crea los detalles del suelo
   */
  createGroundDetails() {
    this.groundDetailLayer = this.scene.add.graphics({ x: 0, y: 0 });

    // Línea base del suelo (recta, estilo Dino)
    this.groundDetailLayer.fillStyle(CONSTANTS.COLORS.HORIZON_LINE, 0.35);
    this.groundDetailLayer.fillRect(
      0,
      CONSTANTS.GAME_POSITIONS.GROUND_Y,
      CONSTANTS.GAME_CONFIG.WIDTH,
      2
    );

    this.groundDetailLayer.setDepth(-9);
    this.groundDetailLayer.setScrollFactor(0);
  }

  /**
   * Actualiza la animación del fondo
   */
  update(deltaSeconds, gameSpeed) {
    // No-op: sin animación de fondo
  }

  /**
   * Maneja el redimensionamiento de la pantalla
   */
  handleResize(width, height) {
    // No-op: sin elementos de fondo que redimensionar
  }

  /**
   * Destruye todos los elementos del fondo
   */
  destroy() {
    if (this.skyLayer) {
      this.skyLayer.destroy();
      this.skyLayer = null;
    }

    if (this.horizonLayer) {
      this.horizonLayer.destroy();
      this.horizonLayer = null;
    }

    if (this.groundLayer) {
      this.groundLayer.destroy();
      this.groundLayer = null;
    }

    if (this.groundDetailLayer) {
      this.groundDetailLayer.destroy();
      this.groundDetailLayer = null;
    }
  }
}
