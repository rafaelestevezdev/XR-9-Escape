/**
 * EscenaIndustrial.js - Escena dedicada a un fondo industrial procedural
 * Usa Phaser.GameObjects.Graphics para construir capas con desplazamiento dinámico.
 * Refactorizado para optimización: Usa objetos Graphics individuales movibles en lugar de redibujar todo.
 */
class EscenaIndustrial extends Phaser.Scene {
  constructor() {
    super({ key: "EscenaIndustrial" });
  }

  init() {
    this.baseScrollSpeed = 60;
    this.layers = {};
    this.floorSegments = [];
    this.sceneWidth = this.scale?.width ?? CONSTANTS.GAME_CONFIG.WIDTH;
    this.sceneHeight = this.scale?.height ?? CONSTANTS.GAME_CONFIG.HEIGHT;
    const defaultFloorY = this.sceneHeight * 0.85;
    const groundConstant = CONSTANTS?.GAME_POSITIONS?.GROUND_Y;
    this.floorY = Math.min(
      groundConstant ?? defaultFloorY,
      this.sceneHeight - 20
    );
    this.floorThickness = Math.max(this.sceneHeight - this.floorY, 48);
    this.wrapPadding = this.sceneWidth * 0.6;
  }

  create() {
    this.sceneWidth = this.scale.width;
    this.sceneHeight = this.scale.height;
    const defaultFloorY = this.sceneHeight * 0.85;
    const groundConstant = CONSTANTS?.GAME_POSITIONS?.GROUND_Y;
    this.floorY = Math.min(
      groundConstant ?? defaultFloorY,
      this.sceneHeight - 20
    );
    this.floorThickness = Math.max(this.sceneHeight - this.floorY, 48);

    // Configurar cámara de fondo para mantener alineación con GameScene
    this.configureCamera();

    this.createSkyLayer();
    this.createFarLayer();
    this.createMidLayer();
    this.createGroundLayer();

    // Lanzar la escena principal del juego por encima y mantener esta como fondo
    if (!this.scene.isActive("GameScene")) {
      this.scene.launch("GameScene");
    }
    // Asegurar que esta escena quede detrás visualmente
    this.scene.sendToBack();
  }

  configureCamera() {
    const cam = this.cameras.main;
    cam.setZoom(CONSTANTS.CAMERA.ZOOM);
    if (CONSTANTS.CAMERA.ROUND_PIXELS) cam.setRoundPixels(true);
    const viewHeight = cam.height / cam.zoom;
    const targetY = this.floorY; // referencia del suelo de esta escena
    const desiredRatio = CONSTANTS.CAMERA.PLAYER_SCREEN_Y_RATIO;
    const scrollY = Math.max(0, targetY - viewHeight * desiredRatio);
    cam.setScroll(0, scrollY);
  }

  createSkyLayer() {
    // Dibujar bandas horizontales para un cielo industrial en tonos fríos
    const gradientColors = [0x06070b, 0x0b1119, 0x131c2a, 0x1c2938];
    const bandHeight = this.sceneHeight / gradientColors.length;

    const graphics = this.add.graphics();
    graphics.setDepth(-80).setScrollFactor(0);

    gradientColors.forEach((color, index) => {
      graphics.fillStyle(color, 1);
      graphics.fillRect(0, index * bandHeight, this.sceneWidth, bandHeight);
    });

    graphics.fillStyle(0x202b3a, 0.25);
    for (let i = 0; i < 3; i += 1) {
      const y = bandHeight * (i + 1);
      graphics.fillRect(0, y - 6, this.sceneWidth, 6);
    }
  }

  createFarLayer() {
    // Configuración de estructuras distantes con desplazamiento suave
    const config = {
      count: 7,
      speedMultiplier: 0.3,
      widthRange: { min: 60, max: 130 },
      heightRange: {
        min: this.sceneHeight * 0.25,
        max: this.sceneHeight * 0.42,
      },
      floorOffset: 24,
      palette: [0x0b111c, 0x0f1724, 0x121d2d],
      accentPalette: [0x152232, 0x192a3a, 0x1e3245],
      alphaRange: { min: 0.45, max: 0.65 },
      spawnPadding: {
        min: this.sceneWidth + 40,
        max: this.sceneWidth + this.wrapPadding,
      },
      recycleThreshold: -this.wrapPadding,
      jitter: 70,
      types: ["chimney", "tower", "column"],
    };

    this.createStructureLayer("far", -60, config);
  }

  createMidLayer() {
    // Configuración de estructuras intermedias con más detalle
    const config = {
      count: 9,
      speedMultiplier: 0.55,
      widthRange: { min: 45, max: 100 },
      heightRange: {
        min: this.sceneHeight * 0.22,
        max: this.sceneHeight * 0.34,
      },
      floorOffset: 12,
      palette: [0x121b2a, 0x172334, 0x1d2d3f],
      accentPalette: [0x21354a, 0x253e56, 0x294862],
      alphaRange: { min: 0.55, max: 0.8 },
      spawnPadding: {
        min: this.sceneWidth + 20,
        max: this.sceneWidth + this.wrapPadding,
      },
      recycleThreshold: -this.wrapPadding,
      jitter: 80,
      types: ["pipe", "light", "support", "column"],
    };

    this.createStructureLayer("mid", -50, config);
  }

  createStructureLayer(name, depth, config) {
    const items = [];
    const spacing = this.sceneWidth / config.count;

    for (let i = 0; i < config.count; i += 1) {
      // Crear un Graphics individual para cada estructura
      const graphics = this.add.graphics();
      graphics.setDepth(depth).setScrollFactor(0);

      const baseX = i * spacing;
      const element = this.spawnStructureData(config, baseX);

      // Posicionar el graphics y dibujar
      graphics.x = element.x;
      this.drawStructure(graphics, element, config);

      items.push({ graphics, element });
    }

    this.layers[name] = { items, config };
  }

  spawnStructureData(config, baseX = 0) {
    const width = Phaser.Math.Between(
      config.widthRange.min,
      config.widthRange.max
    );
    const height = Phaser.Math.Between(
      Math.floor(config.heightRange.min),
      Math.floor(config.heightRange.max)
    );

    const x = baseX + Phaser.Math.Between(-config.jitter, config.jitter);
    return {
      x, // Posición inicial absoluta
      width,
      height,
      type: this.pickRandom(config.types),
      color: this.pickRandom(config.palette),
      accent: this.pickRandom(config.accentPalette),
      alpha: Phaser.Math.FloatBetween(
        config.alphaRange.min,
        config.alphaRange.max
      ),
    };
  }

  drawStructure(graphics, element, config) {
    graphics.clear();

    const baseY = this.floorY - config.floorOffset;
    // Dibujamos relativo a (0,0) del objeto Graphics.
    // El objeto Graphics ya está posicionado en (element.x, 0) o similar.
    // Usamos x=0 localmente.
    const x = 0;
    const y = baseY - element.height;

    graphics.fillStyle(element.color, element.alpha);
    graphics.fillRect(x, y, element.width, element.height);

    switch (element.type) {
      case "chimney": {
        const capHeight = Math.max(10, element.height * 0.08);
        graphics.fillStyle(element.accent, element.alpha * 0.9);
        graphics.fillRect(
          x + element.width * 0.2,
          y - capHeight,
          element.width * 0.6,
          capHeight
        );
        graphics.fillStyle(element.accent, element.alpha * 0.4);
        graphics.fillRect(
          x + element.width * 0.25,
          y + element.height * 0.25,
          element.width * 0.5,
          element.height * 0.12
        );
        break;
      }
      case "tower": {
        const windowHeight = 6;
        const windowSpacing = 18;
        graphics.fillStyle(element.accent, element.alpha * 0.6);
        for (
          let wy = y + windowSpacing;
          wy < y + element.height - windowSpacing;
          wy += windowSpacing
        ) {
          graphics.fillRect(
            x + element.width * 0.2,
            wy,
            element.width * 0.6,
            windowHeight
          );
        }
        break;
      }
      case "pipe": {
        const bandHeight = Math.max(6, element.height * 0.08);
        graphics.fillStyle(element.accent, element.alpha * 0.85);
        graphics.fillRect(
          x,
          y + element.height * 0.35,
          element.width,
          bandHeight
        );
        graphics.fillRect(
          x,
          y + element.height * 0.65,
          element.width,
          bandHeight
        );
        graphics.fillStyle(element.accent, element.alpha * 0.5);
        graphics.fillRect(
          x - element.width * 0.4,
          baseY - bandHeight * 0.5,
          element.width * 0.4,
          bandHeight
        );
        break;
      }
      case "light": {
        const stemWidth = Math.max(4, element.width * 0.2);
        const stemX = x + (element.width - stemWidth) * 0.5;
        graphics.fillStyle(element.accent, element.alpha * 0.9);
        graphics.fillRect(
          stemX,
          y + element.height * 0.2,
          stemWidth,
          element.height * 0.8
        );
        const lampY = y + element.height * 0.2;
        const lampRadius = Math.max(6, stemWidth * 1.8);
        graphics.fillStyle(0x4fa2ff, element.alpha * 0.9);
        graphics.fillCircle(x + element.width * 0.5, lampY, lampRadius);
        graphics.fillStyle(0xffffff, element.alpha * 0.35);
        graphics.fillCircle(x + element.width * 0.5, lampY, lampRadius * 0.5);
        break;
      }
      case "support": {
        graphics.lineStyle(2, element.accent, element.alpha * 0.7);
        graphics.beginPath();
        graphics.moveTo(x, y + element.height * 0.3);
        graphics.lineTo(x + element.width, y + element.height * 0.6);
        graphics.moveTo(x, y + element.height * 0.6);
        graphics.lineTo(x + element.width, y + element.height * 0.3);
        graphics.strokePath();
        graphics.fillStyle(element.accent, element.alpha * 0.6);
        graphics.fillRect(
          x,
          y + element.height * 0.8,
          element.width,
          element.height * 0.1
        );
        break;
      }
      case "column":
      default: {
        const highlightWidth = element.width * 0.2;
        graphics.fillStyle(element.accent, element.alpha * 0.7);
        graphics.fillRect(
          x + element.width - highlightWidth,
          y,
          highlightWidth,
          element.height
        );
        break;
      }
    }
  }

  createGroundLayer() {
    // El suelo combina una base estática con paneles modulares animados
    this.groundBaseGraphics = this.add.graphics();
    // El suelo debe seguir la cámara para alinearse con el jugador y los colliders
    this.groundBaseGraphics.setDepth(-20).setScrollFactor(1);
    this.drawGroundBase();

    const config = {
      speedMultiplier: 1.1,
      widthRange: { min: 40, max: 110 },
      heightRange: { min: 10, max: 18 },
      palette: [0x161e2a, 0x1b2633, 0x202e3d],
      accentPalette: [0x2a3a4d, 0x33485f, 0x3d5872],
      alphaRange: { min: 0.6, max: 0.9 },
      spawnPadding: {
        min: this.sceneWidth + 10,
        max: this.sceneWidth + this.wrapPadding,
      },
      recycleThreshold: -this.wrapPadding * 0.5,
      jitter: 30,
    };

    const items = [];
    const count = Math.ceil(this.sceneWidth / 70) + 5;
    const spacing = this.sceneWidth / Math.max(count - 1, 1);

    for (let i = 0; i < count; i += 1) {
      const graphics = this.add.graphics();
      graphics.setDepth(-15).setScrollFactor(1);

      const baseX = i * spacing;
      const segment = this.spawnFloorSegmentData(config, baseX);

      graphics.x = segment.x;
      this.drawFloorSegment(graphics, segment);

      items.push({ graphics, element: segment });
    }

    this.layers.ground = { items, config };
  }

  drawGroundBase() {
    const skyTransitionHeight = 18;
    const upperStripHeight = 8;
    const baseHeight =
      this.sceneHeight - this.floorY + this.floorThickness * 0.2;

    this.groundBaseGraphics.clear();
    this.groundBaseGraphics.fillStyle(0x101721, 1);
    this.groundBaseGraphics.fillRect(
      0,
      this.floorY - skyTransitionHeight,
      this.sceneWidth,
      skyTransitionHeight
    );
    this.groundBaseGraphics.fillStyle(0x151f2c, 1);
    this.groundBaseGraphics.fillRect(
      0,
      this.floorY,
      this.sceneWidth,
      baseHeight
    );
    this.groundBaseGraphics.fillStyle(0x1d2938, 1);
    this.groundBaseGraphics.fillRect(
      0,
      this.floorY + baseHeight * 0.25,
      this.sceneWidth,
      baseHeight * 0.75
    );
    this.groundBaseGraphics.fillStyle(0x2a3a4f, 0.5);
    this.groundBaseGraphics.fillRect(
      0,
      this.floorY - upperStripHeight,
      this.sceneWidth,
      upperStripHeight
    );
  }

  spawnFloorSegmentData(config, baseX = 0) {
    const width = Phaser.Math.Between(
      config.widthRange.min,
      config.widthRange.max
    );
    const height = Phaser.Math.Between(
      config.heightRange.min,
      config.heightRange.max
    );
    const x = baseX + Phaser.Math.Between(-config.jitter, config.jitter);

    return {
      x,
      width,
      height,
      color: this.pickRandom(config.palette),
      accent: this.pickRandom(config.accentPalette),
      alpha: Phaser.Math.FloatBetween(
        config.alphaRange.min,
        config.alphaRange.max
      ),
    };
  }

  drawFloorSegment(graphics, segment) {
    graphics.clear();
    const y = this.floorY - segment.height;
    const x = 0; // Local x

    graphics.fillStyle(segment.color, segment.alpha);
    graphics.fillRect(x, y, segment.width, segment.height);
    graphics.fillStyle(segment.accent, segment.alpha * 0.7);
    graphics.fillRect(x, y, segment.width, 3);

    if (segment.width > 55) {
      const boltCount = Math.max(2, Math.floor(segment.width / 40));
      const boltSpacing = segment.width / boltCount;
      graphics.fillStyle(0x4f6a83, 0.8);
      for (let b = 0; b < boltCount; b += 1) {
        const boltX = x + boltSpacing * b + boltSpacing * 0.5;
        graphics.fillCircle(boltX, y + segment.height * 0.65, 2);
      }
    }

    // Detalle vertical ocasional
    if (Math.floor(segment.width) % 2 === 0) {
      graphics.fillStyle(0x0c1016, 0.45);
      graphics.fillRect(
        x + segment.width * 0.15,
        this.floorY,
        4,
        this.floorThickness * 0.5
      );
    }
  }

  update(time, delta) {
    // Aplicar efecto parallax actualizando cada capa a distinta velocidad
    const deltaSeconds = delta / 1000;
    this.updateStructureLayer("far", deltaSeconds);
    this.updateStructureLayer("mid", deltaSeconds);
    this.updateGroundDetails(deltaSeconds);
  }

  updateStructureLayer(name, deltaSeconds) {
    const layer = this.layers[name];
    if (!layer) return;

    const { items, config } = layer;
    const speed = this.baseScrollSpeed * config.speedMultiplier;

    items.forEach((item) => {
      // Mover el contenedor/graphics
      item.graphics.x -= speed * deltaSeconds;

      // Verificar reciclaje
      // Usamos graphics.x como la posición actual
      if (item.graphics.x + item.element.width < config.recycleThreshold) {
        this.recycleStructure(item, config);
      }
    });
  }

  recycleStructure(item, config) {
    // Generar nuevos datos
    item.element.width = Phaser.Math.Between(
      config.widthRange.min,
      config.widthRange.max
    );
    item.element.height = Phaser.Math.Between(
      Math.floor(config.heightRange.min),
      Math.floor(config.heightRange.max)
    );

    // Nueva posición X (al final de la pantalla + padding)
    const newX = Phaser.Math.Between(
      config.spawnPadding.min,
      config.spawnPadding.max
    );

    item.element.type = this.pickRandom(config.types);
    item.element.color = this.pickRandom(config.palette);
    item.element.accent = this.pickRandom(config.accentPalette);
    item.element.alpha = Phaser.Math.FloatBetween(
      config.alphaRange.min,
      config.alphaRange.max
    );

    // Actualizar graphics
    item.graphics.x = newX;

    // Redibujar UNA sola vez
    this.drawStructure(item.graphics, item.element, config);
  }

  updateGroundDetails(deltaSeconds) {
    const layer = this.layers.ground;
    if (!layer) return;

    const { items, config } = layer;
    const speed = this.baseScrollSpeed * config.speedMultiplier;

    items.forEach((item) => {
      item.graphics.x -= speed * deltaSeconds;

      if (item.graphics.x + item.element.width < config.recycleThreshold) {
        this.recycleFloorSegment(item, config);
      }
    });
  }

  recycleFloorSegment(item, config) {
    item.element.width = Phaser.Math.Between(
      config.widthRange.min,
      config.widthRange.max
    );
    item.element.height = Phaser.Math.Between(
      config.heightRange.min,
      config.heightRange.max
    );

    const newX = Phaser.Math.Between(
      config.spawnPadding.min,
      config.spawnPadding.max
    );

    item.element.color = this.pickRandom(config.palette);
    item.element.accent = this.pickRandom(config.accentPalette);
    item.element.alpha = Phaser.Math.FloatBetween(
      config.alphaRange.min,
      config.alphaRange.max
    );

    item.graphics.x = newX;
    this.drawFloorSegment(item.graphics, item.element);
  }

  pickRandom(list) {
    return list[Phaser.Math.Between(0, list.length - 1)];
  }
}
