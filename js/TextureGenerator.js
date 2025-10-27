/**
 * TextureGenerator.js - Responsable de generar todas las texturas del juego
 * Principio de responsabilidad única: Solo genera texturas proceduralmente
 */

class TextureGenerator {
  constructor(scene) {
    this.scene = scene;
  }

  /**
   * Genera todas las texturas del juego
   */
  generateAllTextures() {
    this.generateSkyTexture();
    this.generateGroundTexture();
    this.generatePlayerTexture();
    this.generateObstacleTextures();
    this.generateCollectibleTextures();
  }

  /**
   * Genera la textura del cielo industrial
   */
  generateSkyTexture() {
    const g = this.scene.make.graphics({ x: 0, y: 0, add: false });

    // Cielo degradado minimalista con tonos industriales
    CONSTANTS.COLORS.SKY_BANDS.forEach((color, index) => {
      g.fillStyle(color, 1);
      g.fillRect(0, index * 32, 128, 32);
    });

    g.fillStyle(CONSTANTS.COLORS.HORIZON_DETAIL, 0.35);
    g.fillRect(0, 92, 128, 6);
    g.fillStyle(CONSTANTS.COLORS.HORIZON_LINE, 0.18);
    for (let x = 0; x < 128; x += 16) {
      g.fillRect(x, 94, 8, 2);
    }

    g.generateTexture(CONSTANTS.TEXTURE_KEYS.SKY, 128, 128);
    g.clear();
  }

  /**
   * Genera la textura del suelo industrial
   */
  generateGroundTexture() {
    const g = this.scene.make.graphics({ x: 0, y: 0, add: false });

    // Suelo industrial plano con placas y remaches
    g.fillStyle(CONSTANTS.COLORS.GROUND, 1);
    g.fillRect(0, 0, 128, 128);
    g.fillStyle(CONSTANTS.COLORS.GROUND_DETAIL, 1);
    g.fillRect(0, 0, 128, 18);
    g.fillStyle(CONSTANTS.COLORS.GROUND_LINE, 1);
    g.fillRect(0, 0, 128, 6);
    g.fillStyle(CONSTANTS.COLORS.GROUND_ACCENT, 1);
    for (let x = 0; x < 128; x += 32) {
      g.fillRect(x, 18, 4, 110);
    }
    g.fillStyle(CONSTANTS.COLORS.GROUND_SHADOW, 0.9);
    for (let y = 30; y < 128; y += 22) {
      g.fillRect(0, y, 128, 4);
    }
    g.fillStyle(CONSTANTS.COLORS.GROUND_LIGHT, 0.3);
    for (let y = 20; y < 128; y += 22) {
      for (let x = 6; x < 128; x += 24) {
        g.fillRect(x, y, 2, 2);
      }
    }
    g.fillStyle(CONSTANTS.COLORS.GROUND_EDGE, 0.65);
    g.fillRect(0, 18, 128, 4);

    g.generateTexture(CONSTANTS.TEXTURE_KEYS.GROUND, 128, 128);
    g.clear();
  }

  /**
   * Genera la textura del jugador (robot)
   */
  generatePlayerTexture() {
    const g = this.scene.make.graphics({ x: 0, y: 0, add: false });
    const W = 32,
      H = 32;

    // Robot pixel art
    g.fillStyle(CONSTANTS.COLORS.PLAYER_HEAD, 1); // cabeza
    g.fillRect(8, 2, 16, 10);
    g.fillStyle(CONSTANTS.COLORS.PLAYER_VISOR, 1); // visor
    g.fillRect(11, 5, 10, 4);
    g.fillStyle(CONSTANTS.COLORS.PLAYER_BODY, 1); // cuerpo
    g.fillRect(6, 12, 20, 12);
    g.fillStyle(CONSTANTS.COLORS.PLAYER_ARMS, 1); // brazos
    g.fillRect(4, 14, 4, 8);
    g.fillRect(24, 14, 4, 8);
    g.fillStyle(CONSTANTS.COLORS.PLAYER_LEGS, 1); // piernas
    g.fillRect(10, 24, 4, 6);
    g.fillRect(18, 24, 4, 6);

    g.generateTexture(CONSTANTS.TEXTURE_KEYS.PLAYER, W, H);
    g.clear();
  }

  /**
   * Genera todas las texturas de obstáculos
   */
  generateObstacleTextures() {
    this.generateCrateTexture();
    this.generateHammerTexture();
    this.generateTankTexture();
    this.generateGearTexture();
  }

  /**
   * Genera la textura de la caja de herramientas
   */
  generateCrateTexture() {
    const g = this.scene.make.graphics({ x: 0, y: 0, add: false });
    const BOX_W = 36,
      BOX_H = 40;

    g.fillStyle(CONSTANTS.COLORS.CRATE_WOOD, 1);
    g.fillRect(2, 8, BOX_W - 4, BOX_H - 10);
    g.fillStyle(CONSTANTS.COLORS.CRATE_DARK, 1);
    g.fillRect(0, 8, 3, BOX_H - 10);
    g.fillRect(BOX_W - 3, 8, 3, BOX_H - 10);
    g.fillRect(2, BOX_H - 3, BOX_W - 4, 3);
    g.fillStyle(CONSTANTS.COLORS.CRATE_LIGHT, 1);
    g.fillRect(6, 12, BOX_W - 12, BOX_H - 18);
    g.fillStyle(CONSTANTS.COLORS.CRATE_METAL, 1);
    g.fillRect(8, 14, BOX_W - 16, 4);
    g.fillStyle(CONSTANTS.COLORS.CRATE_HANDLE, 1);
    g.fillRect(BOX_W / 2 - 2, 4, 4, 8);
    g.fillStyle(CONSTANTS.COLORS.CRATE_RIVET, 1);
    g.fillRect(BOX_W / 2 - 1, 2, 2, 6);

    g.generateTexture(CONSTANTS.TEXTURE_KEYS.CRATE, BOX_W, BOX_H);
    g.clear();
  }

  /**
   * Genera la textura del martillo neumático
   */
  generateHammerTexture() {
    const g = this.scene.make.graphics({ x: 0, y: 0, add: false });
    const HAMMER_W = 28,
      HAMMER_H = 44;

    g.fillStyle(CONSTANTS.COLORS.HAMMER_METAL, 1);
    g.fillRect(10, 6, 8, 32);
    g.fillStyle(CONSTANTS.COLORS.HAMMER_DARK, 1);
    g.fillRect(8, 6, 3, 32);
    g.fillStyle(CONSTANTS.COLORS.HAMMER_LIGHT, 1);
    g.fillRect(16, 6, 3, 32);
    g.fillStyle(CONSTANTS.COLORS.HAMMER_BASE, 1);
    g.fillRect(6, 38, 16, 6);
    g.fillStyle(CONSTANTS.COLORS.HAMMER_SHADOW, 1);
    g.fillRect(8, 40, 12, 4);
    g.fillStyle(CONSTANTS.COLORS.HAMMER_HEAD, 1);
    g.fillRect(10, 0, 8, 8);
    g.fillStyle(CONSTANTS.COLORS.HAMMER_HEAD_DARK, 1);
    g.fillRect(12, 2, 4, 6);

    g.generateTexture(CONSTANTS.TEXTURE_KEYS.HAMMER, HAMMER_W, HAMMER_H);
    g.clear();
  }

  /**
   * Genera la textura del tanque de aceite
   */
  generateTankTexture() {
    const g = this.scene.make.graphics({ x: 0, y: 0, add: false });
    const TANK_W = 40,
      TANK_H = 52;

    g.fillStyle(CONSTANTS.COLORS.TANK_METAL, 1);
    g.fillRect(8, 10, TANK_W - 16, TANK_H - 14);
    g.fillStyle(CONSTANTS.COLORS.TANK_DARK, 1);
    g.fillRect(6, 10, 3, TANK_H - 14);
    g.fillRect(TANK_W - 9, 10, 3, TANK_H - 14);
    g.fillStyle(CONSTANTS.COLORS.TANK_LIGHT, 1);
    g.fillRect(12, 14, TANK_W - 24, TANK_H - 22);
    g.fillStyle(CONSTANTS.COLORS.TANK_BASE, 1);
    g.fillRect(4, TANK_H - 6, TANK_W - 8, 6);
    g.fillStyle(CONSTANTS.COLORS.TANK_LABEL, 1);
    g.fillRect(TANK_W / 2 - 6, 6, 12, 6);
    g.fillStyle(CONSTANTS.COLORS.TANK_WINDOW, 1);
    g.fillRect(TANK_W / 2 - 4, 8, 8, 4);
    g.fillStyle(CONSTANTS.COLORS.TANK_OIL, 0.6);
    g.fillRect(14, 18, TANK_W - 28, 8);

    g.generateTexture(CONSTANTS.TEXTURE_KEYS.TANK, TANK_W, TANK_H);
    g.clear();
  }

  /**
   * Genera la textura del engranaje giratorio
   */
  generateGearTexture() {
    const g = this.scene.make.graphics({ x: 0, y: 0, add: false });
    const GEAR_W = 38,
      GEAR_H = 38;

    g.fillStyle(CONSTANTS.COLORS.GEAR_METAL, 1);
    g.fillCircle(GEAR_W / 2, GEAR_H / 2, 12);
    g.fillStyle(CONSTANTS.COLORS.GEAR_DARK, 1);
    g.fillCircle(GEAR_W / 2, GEAR_H / 2, 8);

    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const tx = Math.round(GEAR_W / 2 + Math.cos(angle) * 16);
      const ty = Math.round(GEAR_H / 2 + Math.sin(angle) * 16);
      g.fillStyle(CONSTANTS.COLORS.GEAR_LIGHT, 1);
      g.fillRect(tx - 3, ty - 3, 6, 6);
    }

    g.fillStyle(CONSTANTS.COLORS.GEAR_CENTER, 1);
    g.fillCircle(GEAR_W / 2, GEAR_H / 2, 5);
    g.fillStyle(CONSTANTS.COLORS.GEAR_HOLE, 1);
    g.fillCircle(GEAR_W / 2, GEAR_H / 2, 3);

    g.generateTexture(CONSTANTS.TEXTURE_KEYS.GEAR, GEAR_W, GEAR_H);
    g.clear();
  }

  /**
   * Genera todas las texturas de coleccionables
   */
  generateCollectibleTextures() {
    this.generateBatteryTexture();
  }

  /**
   * Genera la textura de la batería
   */
  generateBatteryTexture() {
    const g = this.scene.make.graphics({ x: 0, y: 0, add: false });
    const BAT_W = 24,
      BAT_H = 28;

    g.fillStyle(CONSTANTS.COLORS.BATTERY_GOLD, 1);
    g.fillRect(6, 8, BAT_W - 12, BAT_H - 10);
    g.fillStyle(CONSTANTS.COLORS.BATTERY_LIGHT, 1);
    g.fillRect(8, 10, BAT_W - 16, BAT_H - 14);
    g.fillStyle(CONSTANTS.COLORS.BATTERY_DARK, 1);
    g.fillRect(6, 8, 2, BAT_H - 10);
    g.fillRect(BAT_W - 8, 8, 2, BAT_H - 10);
    g.fillStyle(CONSTANTS.COLORS.BATTERY_TERMINAL, 1);
    g.fillRect(BAT_W / 2 - 3, 4, 6, 6);
    g.fillStyle(CONSTANTS.COLORS.BATTERY_TERMINAL_DARK, 1);
    g.fillRect(BAT_W / 2 - 2, 5, 4, 4);
    g.fillStyle(CONSTANTS.COLORS.BATTERY_SPARK, 0.8);
    g.fillRect(9, 12, 3, 3);
    g.fillStyle(CONSTANTS.COLORS.BATTERY_SHADOW, 0.3);
    g.fillRect(6, BAT_H - 4, BAT_W - 12, 3);

    g.generateTexture(CONSTANTS.TEXTURE_KEYS.BATTERY, BAT_W, BAT_H);
    g.clear();
  }
}
