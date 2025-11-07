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

    // Cielo por bandas (pixel art) con tonos industriales
    CONSTANTS.COLORS.SKY_BANDS.forEach((color, index) => {
      g.fillStyle(color, 1);
      g.fillRect(0, index * 32, 128, 32);
    });

    // Silueta de ciudad industrial en el horizonte (pixelada)
    g.fillStyle(CONSTANTS.COLORS.HORIZON, 0.9);
    const baseY = 96; // parte baja del cielo (cerca del suelo visual)
    // bloques básicos de edificios
    const buildings = [
      { x: 2, w: 10, h: 18 },
      { x: 16, w: 8, h: 12 },
      { x: 28, w: 14, h: 20 },
      { x: 48, w: 10, h: 14 },
      { x: 62, w: 8, h: 10 },
      { x: 74, w: 16, h: 22 },
      { x: 96, w: 12, h: 16 },
      { x: 112, w: 10, h: 12 },
    ];
    buildings.forEach((b) => {
      g.fillRect(b.x, baseY - b.h, b.w, b.h);
    });

    // Detalles ligeros de horizonte: líneas y "ventanas"
    g.fillStyle(CONSTANTS.COLORS.HORIZON_DETAIL, 0.35);
    g.fillRect(0, baseY - 2, 128, 2);
    g.fillStyle(CONSTANTS.COLORS.HORIZON_LINE, 0.25);
    for (let x = 4; x < 128; x += 12) {
      g.fillRect(x, baseY - 6, 2, 2);
    }

    g.generateTexture(CONSTANTS.TEXTURE_KEYS.SKY, 128, 128);
    g.clear();
  }

  /**
   * Genera la textura del suelo industrial
   */
  generateGroundTexture() {
    const g = this.scene.make.graphics({ x: 0, y: 0, add: false });

    // Suelo industrial pixel art con placas, remaches y franja de seguridad
    g.fillStyle(CONSTANTS.COLORS.GROUND, 1);
    g.fillRect(0, 0, 128, 128);

    // Franja de seguridad (amarillo/gris) en la parte superior del tile
    g.fillStyle(CONSTANTS.COLORS.GROUND_LINE, 1);
    g.fillRect(0, 0, 128, 10);
    g.fillStyle(CONSTANTS.COLORS.GROUND_EDGE, 0.9);
    for (let x = 0; x < 128; x += 12) {
      g.fillRect(x, 10, 8, 3);
    }

    // Placas metálicas con uniones verticales
    g.fillStyle(CONSTANTS.COLORS.GROUND_DETAIL, 1);
    for (let x = 0; x <= 128; x += 32) {
      g.fillRect(x, 12, 2, 116);
    }

    // Remaches distribuidos
    g.fillStyle(CONSTANTS.COLORS.GROUND_LIGHT, 0.35);
    for (let y = 18; y < 120; y += 20) {
      for (let x = 8; x < 128; x += 16) {
        g.fillRect(x, y, 2, 2);
      }
    }

    // Sombras horizontales para dar profundidad
    g.fillStyle(CONSTANTS.COLORS.GROUND_SHADOW, 0.85);
    for (let y = 24; y < 128; y += 22) {
      g.fillRect(0, y, 128, 3);
    }

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
    const BOX_W = 42,
      BOX_H = 38;

    // Caja metálica oscura con paneles y remaches
    g.fillStyle(CONSTANTS.COLORS.METAL_BASE, 1);
    g.fillRect(2, 4, BOX_W - 4, BOX_H - 6);
    g.fillStyle(CONSTANTS.COLORS.METAL_EDGE, 1);
    g.fillRect(0, 4, 3, BOX_H - 6);
    g.fillRect(BOX_W - 3, 4, 3, BOX_H - 6);
    g.fillRect(2, BOX_H - 3, BOX_W - 4, 3);
    g.fillStyle(CONSTANTS.COLORS.METAL_MID, 1);
    g.fillRect(6, 8, BOX_W - 12, BOX_H - 14);
    g.fillStyle(CONSTANTS.COLORS.METAL_LIGHT, 1);
    g.fillRect(8, 10, BOX_W - 16, 4);
    g.fillStyle(CONSTANTS.COLORS.METAL_HIGHLIGHT, 0.6);
    g.fillRect(6, 8, BOX_W - 12, 2);
    // Remaches en bordes
    g.fillStyle(CONSTANTS.COLORS.GROUND_LIGHT, 0.8);
    for (let x = 8; x < BOX_W - 8; x += 8) {
      g.fillRect(x, BOX_H - 6, 2, 2);
    }
    // Franja de advertencia
    g.fillStyle(CONSTANTS.COLORS.HAZARD_BLACK, 1);
    g.fillRect(10, BOX_H - 12, BOX_W - 20, 6);
    for (let x = 10; x < BOX_W - 12; x += 8) {
      g.fillStyle(CONSTANTS.COLORS.HAZARD_YELLOW, 1);
      g.fillRect(x, BOX_H - 12, 6, 6);
      x += 6;
    }

    g.generateTexture(CONSTANTS.TEXTURE_KEYS.CRATE, BOX_W, BOX_H);
    g.clear();
  }

  /**
   * Genera la textura del martillo neumático
   */
  generateHammerTexture() {
    const g = this.scene.make.graphics({ x: 0, y: 0, add: false });
    const HAMMER_W = 30,
      HAMMER_H = 46;

    // Cuerpo metálico con sombras
    g.fillStyle(CONSTANTS.COLORS.METAL_LIGHT, 1);
    g.fillRect(11, 6, 8, 32);
    g.fillStyle(CONSTANTS.COLORS.METAL_BASE, 1);
    g.fillRect(9, 6, 3, 32);
    g.fillStyle(CONSTANTS.COLORS.METAL_HIGHLIGHT, 1);
    g.fillRect(17, 6, 2, 32);
    // Base
    g.fillStyle(CONSTANTS.COLORS.METAL_DARK, 1);
    g.fillRect(7, 38, 16, 6);
    g.fillStyle(CONSTANTS.COLORS.METAL_EDGE, 1);
    g.fillRect(9, 40, 12, 3);
    // Cabeza vibrante
    g.fillStyle(CONSTANTS.COLORS.HAZARD_ORANGE, 1);
    g.fillRect(11, 0, 8, 8);
    g.fillStyle(CONSTANTS.COLORS.HAZARD_YELLOW, 1);
    g.fillRect(13, 2, 4, 4);

    g.generateTexture(CONSTANTS.TEXTURE_KEYS.HAMMER, HAMMER_W, HAMMER_H);
    g.clear();
  }

  /**
   * Genera la textura del tanque de aceite
   */
  generateTankTexture() {
    const g = this.scene.make.graphics({ x: 0, y: 0, add: false });
    const TANK_W = 42,
      TANK_H = 50;

    // Tanque metálico con ventana y etiqueta
    g.fillStyle(CONSTANTS.COLORS.METAL_MID, 1);
    g.fillRect(7, 10, TANK_W - 14, TANK_H - 14);
    g.fillStyle(CONSTANTS.COLORS.METAL_EDGE, 1);
    g.fillRect(5, 10, 3, TANK_H - 14);
    g.fillRect(TANK_W - 8, 10, 3, TANK_H - 14);
    g.fillStyle(CONSTANTS.COLORS.METAL_LIGHT, 1);
    g.fillRect(11, 14, TANK_W - 22, TANK_H - 22);
    g.fillStyle(CONSTANTS.COLORS.METAL_DARK, 1);
    g.fillRect(4, TANK_H - 6, TANK_W - 8, 6);
    // Placa de advertencia
    g.fillStyle(CONSTANTS.COLORS.HAZARD_YELLOW, 1);
    g.fillRect(TANK_W / 2 - 7, 6, 14, 6);
    g.fillStyle(CONSTANTS.COLORS.HAZARD_BLACK, 1);
    g.fillRect(TANK_W / 2 - 4, 7, 8, 4);
    // Ventana
    g.fillStyle(CONSTANTS.COLORS.LIGHT_CYAN, 1);
    g.fillRect(TANK_W / 2 - 5, 16, 10, 6);
    g.fillStyle(CONSTANTS.COLORS.LIGHT_CYAN_SOFT, 0.8);
    g.fillRect(TANK_W / 2 - 4, 17, 8, 3);

    g.generateTexture(CONSTANTS.TEXTURE_KEYS.TANK, TANK_W, TANK_H);
    g.clear();
  }

  /**
   * Genera la textura del engranaje giratorio
   */
  generateGearTexture() {
    const g = this.scene.make.graphics({ x: 0, y: 0, add: false });
    const GEAR_W = 40,
      GEAR_H = 40;

    // Dienteado con contraste metálico
    g.fillStyle(CONSTANTS.COLORS.METAL_MID, 1);
    g.fillCircle(GEAR_W / 2, GEAR_H / 2, 12);
    g.fillStyle(CONSTANTS.COLORS.METAL_DARK, 1);
    g.fillCircle(GEAR_W / 2, GEAR_H / 2, 9);

    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const tx = Math.round(GEAR_W / 2 + Math.cos(angle) * 16);
      const ty = Math.round(GEAR_H / 2 + Math.sin(angle) * 16);
      g.fillStyle(CONSTANTS.COLORS.METAL_LIGHT, 1);
      g.fillRect(tx - 3, ty - 3, 6, 6);
    }

    g.fillStyle(CONSTANTS.COLORS.METAL_HIGHLIGHT, 1);
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
    const BAT_W = 28,
      BAT_H = 36;

    // Pila cilíndrica con polos y brillo
    // Cuerpo
    g.fillStyle(CONSTANTS.COLORS.BATTERY_BODY_DARK, 1);
    g.fillRect(8, 6, BAT_W - 16, BAT_H - 10);
    g.fillStyle(CONSTANTS.COLORS.BATTERY_BODY, 1);
    g.fillRect(9, 7, BAT_W - 18, BAT_H - 12);
    g.fillStyle(CONSTANTS.COLORS.BATTERY_BODY_LIGHT, 0.9);
    g.fillRect(10, 8, BAT_W - 20, 3);
    // Anillos superior/inferior
    g.fillStyle(CONSTANTS.COLORS.METAL_LIGHT, 1);
    g.fillRect(7, 4, BAT_W - 14, 3);
    g.fillRect(7, BAT_H - 6, BAT_W - 14, 3);
    g.fillStyle(CONSTANTS.COLORS.METAL_EDGE, 1);
    g.fillRect(7, 3, BAT_W - 14, 1);
    g.fillRect(7, BAT_H - 3, BAT_W - 14, 1);
    // Polo positivo
    g.fillStyle(CONSTANTS.COLORS.METAL_MID, 1);
    g.fillRect(BAT_W / 2 - 3, 0, 6, 5);
    g.fillStyle(CONSTANTS.COLORS.METAL_HIGHLIGHT, 1);
    g.fillRect(BAT_W / 2 - 2, 1, 4, 2);
    // Indicador de energía
    g.fillStyle(CONSTANTS.COLORS.LIGHT_CYAN, 1);
    g.fillRect(12, 14, BAT_W - 24, 8);
    g.fillStyle(CONSTANTS.COLORS.LIGHT_GLOW_INNER, 0.9);
    g.fillRect(13, 15, BAT_W - 26, 3);
    g.fillStyle(CONSTANTS.COLORS.ENERGY_CORE, 1);
    g.fillRect(BAT_W / 2 - 2, 14, 4, 8);

    g.generateTexture(CONSTANTS.TEXTURE_KEYS.BATTERY, BAT_W, BAT_H);
    g.clear();
  }
}
