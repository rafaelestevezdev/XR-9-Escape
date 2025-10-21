/**
 * Clase GameScene - Responsable de la escena principal del juego
 * Principio de responsabilidad única: Gestiona la lógica general de la escena
 */
const INITIAL_SPEED = 350;
const DIFFICULTY_INTERVAL = 10000; // ms

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
    // Core references
    this.player = null;
    this.obstacleManager = null;
    this.cursors = null;
    this.spaceKey = null;

    // Gameplay state
    this.score = 0;
    this.batteries = 0;
    this.gameSpeed = INITIAL_SPEED;
    this.gameOver = false;
    this.lastDifficultyIncrease = 0;

    // Capas del fondo en estilo plano retro
    this.skyLayer = null;
    this.horizonLayer = null;
    this.groundLayer = null;
    this.groundDetailLayer = null;

    // Ground colliders / segments (for pits)
    this.groundGroup = null;
    this.groundCollider = null;
    this.groundSegments = [];

    // HUD elements
    this.scoreElement = null;
    this.batteryCountElement = null;
    this.speedIndicatorElement = null;
    this.stageIndicatorElement = null;
    this.hudMessageElement = null;
    this.hasPlayerInteracted = false;
  }

  preload() {}

  create() {
    this.cacheHudElements();
    this.resetState();
    this.createTextures();
    this.createBackground();
    this.createGroundCollider();

    this.player = new Player(this, 120, 500);
    this.obstacleManager = new ObstacleManager(this);
    this.updateSpeedHUD();

    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    // Eventos para saltar (más fiables)
    this.input.keyboard.on("keydown-SPACE", () => {
      this.player.attemptJump();
      this.handlePlayerInput();
    });
    this.input.keyboard.on("keydown-UP", () => {
      this.player.attemptJump();
      this.handlePlayerInput();
    });
    // Soporte táctil / click
    this.input.on("pointerdown", () => {
      this.player.attemptJump();
      this.handlePlayerInput();
    });

    // Altura de salto variable (si suelta pronto, corta el salto)
    this.input.keyboard.on("keyup-SPACE", () => this.player.cutJump());
    this.input.keyboard.on("keyup-UP", () => this.player.cutJump());

    this.physics.add.collider(this.player.getSprite(), this.groundCollider);
    this.physics.add.collider(
      this.obstacleManager.getGroup(),
      this.groundCollider
    );
    this.physics.add.overlap(
      this.player.getSprite(),
      this.obstacleManager.getGroup(),
      this.handleObstacleOverlap,
      null,
      this
    );
  }

  update(time, delta) {
    if (this.gameOver) {
      return;
    }

    const deltaSeconds = delta / 1000;

    this.player.update();
    this.animateBackground(deltaSeconds);
    this.obstacleManager.update(time, this.gameSpeed, deltaSeconds);

    this.incrementScore(deltaSeconds);
    this.handleDifficulty(time);
    this.updateSpeedHUD();
  }

  resetState() {
    this.gameOver = false;
    this.score = 0;
    this.batteries = 0;
    this.gameSpeed = INITIAL_SPEED;
    this.lastDifficultyIncrease = 0;
    this.updateScoreText(0);
    this.updateBatteryCount(0);
    this.hasPlayerInteracted = false;
    if (this.hudMessageElement) {
      this.hudMessageElement.classList.remove("hud-message--hidden");
    }
    this.updateSpeedHUD();
    const gameOverScreen = document.getElementById("game-over-screen");
    if (gameOverScreen) {
      gameOverScreen.classList.remove("show");
    }
    // Minimal reset: particle emitters and flicker removed in favor
    // of a clean, static backdrop for a minimalist arcade look.
  }

  createTextures() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });

    // Cielo degradado minimalista con tonos industriales
    const skyBands = [0x080910, 0x0e1626, 0x182338, 0x24324c];
    skyBands.forEach((color, index) => {
      g.fillStyle(color, 1);
      g.fillRect(0, index * 32, 128, 32);
    });
    g.fillStyle(0x3a5370, 0.35);
    g.fillRect(0, 92, 128, 6);
    g.fillStyle(0x516b88, 0.18);
    for (let x = 0; x < 128; x += 16) {
      g.fillRect(x, 94, 8, 2);
    }
    g.generateTexture("bg_industrial_sky", 128, 128);
    g.clear();

    // Suelo industrial plano con placas y remaches
    g.fillStyle(0x2b2f36, 1);
    g.fillRect(0, 0, 128, 128);
    g.fillStyle(0x3d434d, 1);
    g.fillRect(0, 0, 128, 18);
    g.fillStyle(0x545b68, 1);
    g.fillRect(0, 0, 128, 6);
    g.fillStyle(0x1d2027, 1);
    for (let x = 0; x < 128; x += 32) {
      g.fillRect(x, 18, 4, 110);
    }
    g.fillStyle(0x14161c, 0.9);
    for (let y = 30; y < 128; y += 22) {
      g.fillRect(0, y, 128, 4);
    }
    g.fillStyle(0x4e8495, 0.3);
    for (let y = 20; y < 128; y += 22) {
      for (let x = 6; x < 128; x += 24) {
        g.fillRect(x, y, 2, 2);
      }
    }
    g.fillStyle(0x1e222b, 0.65);
    g.fillRect(0, 18, 128, 4);
    g.generateTexture("ground_tile_factory", 128, 128);
    g.clear();

    // Textura del jugador (robot pixel 2D)
    const W = 32,
      H = 32;
    g.fillStyle(0xbdc3c7, 1); // cabeza
    g.fillRect(8, 2, 16, 10);
    g.fillStyle(0x2c3e50, 1); // visor
    g.fillRect(11, 5, 10, 4);
    g.fillStyle(0x7f8c8d, 1); // cuerpo
    g.fillRect(6, 12, 20, 12);
    g.fillStyle(0x95a5a6, 1); // brazos
    g.fillRect(4, 14, 4, 8);
    g.fillRect(24, 14, 4, 8);
    g.fillStyle(0x7f8c8d, 1); // piernas
    g.fillRect(10, 24, 4, 6);
    g.fillRect(18, 24, 4, 6);
    g.generateTexture("player_robot", W, H);
    g.clear();

    // Obstáculo: Caja de herramientas industrial (pequeña)
    const BOX_W = 36;
    const BOX_H = 40;
    g.fillStyle(0x3a2618, 1);
    g.fillRect(2, 8, BOX_W - 4, BOX_H - 10);
    g.fillStyle(0x2a1a10, 1);
    g.fillRect(0, 8, 3, BOX_H - 10);
    g.fillRect(BOX_W - 3, 8, 3, BOX_H - 10);
    g.fillRect(2, BOX_H - 3, BOX_W - 4, 3);
    g.fillStyle(0x5a4228, 1);
    g.fillRect(6, 12, BOX_W - 12, BOX_H - 18);
    g.fillStyle(0x8a6a48, 1);
    g.fillRect(8, 14, BOX_W - 16, 4);
    g.fillStyle(0x1a1008, 1);
    g.fillRect(BOX_W / 2 - 2, 4, 4, 8);
    g.fillStyle(0x4e5a62, 1);
    g.fillRect(BOX_W / 2 - 1, 2, 2, 6);
    g.generateTexture("obstacle_crate", BOX_W, BOX_H);
    g.clear();

    // Obstáculo: Martillo neumático (pequeño, vertical)
    const HAMMER_W = 28;
    const HAMMER_H = 44;
    g.fillStyle(0x52616e, 1);
    g.fillRect(10, 6, 8, 32);
    g.fillStyle(0x3d4a56, 1);
    g.fillRect(8, 6, 3, 32);
    g.fillStyle(0x6a7985, 1);
    g.fillRect(16, 6, 3, 32);
    g.fillStyle(0x2a3640, 1);
    g.fillRect(6, 38, 16, 6);
    g.fillStyle(0x1c252e, 1);
    g.fillRect(8, 40, 12, 4);
    g.fillStyle(0xff6b35, 1);
    g.fillRect(10, 0, 8, 8);
    g.fillStyle(0xcc5528, 1);
    g.fillRect(12, 2, 4, 6);
    g.generateTexture("obstacle_hammer", HAMMER_W, HAMMER_H);
    g.clear();

    // Obstáculo: Tanque de aceite (mediano)
    const TANK_W = 40;
    const TANK_H = 52;
    g.fillStyle(0x1e2e3a, 1);
    g.fillRect(8, 10, TANK_W - 16, TANK_H - 14);
    g.fillStyle(0x162229, 1);
    g.fillRect(6, 10, 3, TANK_H - 14);
    g.fillRect(TANK_W - 9, 10, 3, TANK_H - 14);
    g.fillStyle(0x2d4555, 1);
    g.fillRect(12, 14, TANK_W - 24, TANK_H - 22);
    g.fillStyle(0x0e1419, 1);
    g.fillRect(4, TANK_H - 6, TANK_W - 8, 6);
    g.fillStyle(0xffd700, 1);
    g.fillRect(TANK_W / 2 - 6, 6, 12, 6);
    g.fillStyle(0x1a1a1a, 1);
    g.fillRect(TANK_W / 2 - 4, 8, 8, 4);
    g.fillStyle(0xff8c1a, 0.6);
    g.fillRect(14, 18, TANK_W - 28, 8);
    g.generateTexture("obstacle_tank", TANK_W, TANK_H);
    g.clear();

    // Obstáculo: Engranaje giratorio (pequeño)
    const GEAR_W = 38;
    const GEAR_H = 38;
    g.fillStyle(0x4a5662, 1);
    g.fillCircle(GEAR_W / 2, GEAR_H / 2, 12);
    g.fillStyle(0x3a4652, 1);
    g.fillCircle(GEAR_W / 2, GEAR_H / 2, 8);
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const tx = Math.round(GEAR_W / 2 + Math.cos(angle) * 16);
      const ty = Math.round(GEAR_H / 2 + Math.sin(angle) * 16);
      g.fillStyle(0x5a6672, 1);
      g.fillRect(tx - 3, ty - 3, 6, 6);
    }
    g.fillStyle(0x6a7682, 1);
    g.fillCircle(GEAR_W / 2, GEAR_H / 2, 5);
    g.fillStyle(0x2a2a2a, 1);
    g.fillCircle(GEAR_W / 2, GEAR_H / 2, 3);
    g.generateTexture("obstacle_gear", GEAR_W, GEAR_H);
    g.clear();

    // Coleccionable: Batería (power-up)
    const BAT_W = 24;
    const BAT_H = 28;
    g.fillStyle(0xffd700, 1);
    g.fillRect(6, 8, BAT_W - 12, BAT_H - 10);
    g.fillStyle(0xffed4e, 1);
    g.fillRect(8, 10, BAT_W - 16, BAT_H - 14);
    g.fillStyle(0xcc9900, 1);
    g.fillRect(6, 8, 2, BAT_H - 10);
    g.fillRect(BAT_W - 8, 8, 2, BAT_H - 10);
    g.fillStyle(0x4a9eff, 1);
    g.fillRect(BAT_W / 2 - 3, 4, 6, 6);
    g.fillStyle(0x2e7ed4, 1);
    g.fillRect(BAT_W / 2 - 2, 5, 4, 4);
    g.fillStyle(0xffffff, 0.8);
    g.fillRect(9, 12, 3, 3);
    g.fillStyle(0x000000, 0.3);
    g.fillRect(6, BAT_H - 4, BAT_W - 12, 3);
    g.generateTexture("collectible_battery", BAT_W, BAT_H);
    g.clear();

    g.destroy();
  }

  createBackground() {
    // Fondo plano con cielo degradado y suelo tipo Mario
    this.skyLayer = this.add
      .image(0, 0, "bg_industrial_sky")
      .setOrigin(0, 0)
      .setDisplaySize(800, 600)
      .setDepth(-50)
      .setScrollFactor(0);

    this.horizonLayer = this.add.graphics({ x: 0, y: 0 });
    this.horizonLayer.fillStyle(0x1a2436, 1);
    this.horizonLayer.fillRect(0, 460, 800, 10);
    this.horizonLayer.fillStyle(0x314057, 0.65);
    this.horizonLayer.fillRect(0, 470, 800, 6);
    this.horizonLayer.fillStyle(0x5c708b, 0.28);
    this.horizonLayer.fillRect(0, 466, 800, 2);
    this.horizonLayer.setDepth(-40);
    this.horizonLayer.setScrollFactor(0);

    this.groundLayer = this.add
      .tileSprite(0, 520, 800, 160, "ground_tile_factory")
      .setOrigin(0, 0)
      .setDepth(-10)
      .setScrollFactor(0);

    this.groundDetailLayer = this.add.graphics({ x: 0, y: 0 });
    this.groundDetailLayer.fillStyle(0x5c708b, 0.22);
    this.groundDetailLayer.fillRect(0, 520, 800, 4);
    this.groundDetailLayer.fillStyle(0x12161f, 0.9);
    for (let x = 0; x < 800; x += 32) {
      this.groundDetailLayer.fillRect(x, 524, 4, 24);
    }
    this.groundDetailLayer.fillStyle(0x2d3949, 0.4);
    this.groundDetailLayer.fillRect(0, 548, 800, 4);
    this.groundDetailLayer.setDepth(-9);
    this.groundDetailLayer.setScrollFactor(0);
  }

  createGroundCollider() {
    // Segmentos invisibles de suelo para mantener soporte futuro a posibles huecos.
    this.groundGroup = this.physics.add.staticGroup();
    this.groundSegments = [];
    const totalWidth = 840;
    const segmentWidth = 60;
    const segments = Math.ceil(totalWidth / segmentWidth);
    const startX = 400 - totalWidth / 2;
    for (let i = 0; i < segments; i++) {
      const x = startX + i * segmentWidth + segmentWidth / 2;
      const rect = this.add.rectangle(x, 560, segmentWidth, 80, 0xffffff, 0);
      this.physics.add.existing(rect, true);
      this.groundGroup.add(rect);
      this.groundSegments.push(rect);
    }
    this.groundCollider = this.groundGroup;
  }

  animateBackground(deltaSeconds) {
    if (this.groundLayer) {
      this.groundLayer.tilePositionX += this.gameSpeed * deltaSeconds;
    }
  }

  incrementScore(deltaSeconds) {
    this.score += deltaSeconds * 100;
    this.updateScoreText(Math.floor(this.score));
  }

  handleDifficulty(currentTime) {
    if (currentTime - this.lastDifficultyIncrease >= DIFFICULTY_INTERVAL) {
      this.obstacleManager.increaseDifficulty();
      this.gameSpeed = this.obstacleManager.getSpeed();
      this.lastDifficultyIncrease = currentTime;
      this.updateSpeedHUD();
    }
  }

  handleGameOver() {
    if (this.gameOver) {
      return;
    }

    this.gameOver = true;
    this.physics.pause();
    this.player.stop();
    this.showGameOver();
  }

  /**
   * Maneja las colisiones/overlaps entre el jugador y los obstáculos.
   * Diferencia entre coleccionables, huecos y peligros sólidos.
   */
  handleObstacleOverlap(playerSprite, obstacleSprite) {
    if (!playerSprite || !obstacleSprite) return;
    const obstacleRef = obstacleSprite.getData && obstacleSprite.getData("ref");
    const type = obstacleSprite.getData && obstacleSprite.getData("type");
    const isCollectible =
      obstacleSprite.getData && obstacleSprite.getData("collectible");
    const isPit = obstacleSprite.getData && obstacleSprite.getData("pit");

    // Coleccionable
    if (isCollectible && obstacleRef) {
      const isBattery = obstacleRef.isBattery && obstacleRef.isBattery();
      this.obstacleManager.removeObstacle(obstacleRef);
      if (isBattery) {
        this.addBattery();
      } else {
        const pts = obstacleRef.collect();
        if (pts && pts > 0) {
          this.addScore(pts);
        }
      }
      return;
    }

    // Hueco (pit) -> solo si el jugador está en el suelo se considera que cayó
    if (isPit) {
      if (this.player.isOnGround()) {
        this.handleGameOver();
      }
      return;
    }

    // Peligro normal (crate, pipe, gear, etc.)
    this.handleGameOver();
  }

  addScore(amount) {
    this.score += amount;
    this.updateScoreText(Math.floor(this.score));
  }

  addBattery() {
    this.batteries += 1;
    this.updateBatteryCount(this.batteries);
  }

  updateScoreText(scoreValue) {
    if (this.scoreElement) {
      this.scoreElement.textContent = `${scoreValue
        .toString()
        .padStart(5, "0")}M`;
    }
  }

  updateBatteryCount(count) {
    if (this.batteryCountElement) {
      this.batteryCountElement.textContent = count;
    }
  }

  showGameOver() {
    const gameOverScreen = document.getElementById("game-over-screen");
    const finalScore = document.getElementById("final-score");
    const finalBatteries = document.getElementById("final-batteries");
    if (gameOverScreen && finalScore && finalBatteries) {
      finalScore.textContent = Math.floor(this.score);
      finalBatteries.textContent = this.batteries;
      gameOverScreen.classList.add("show");
    }
  }

  restartGame() {
    this.resetState();
    this.physics.resume();
    this.player.reset();
    this.obstacleManager.reset();
    this.gameSpeed = INITIAL_SPEED;
    this.updateSpeedHUD();
  }
  cacheHudElements() {
    this.scoreElement = document.getElementById("score");
    this.batteryCountElement = document.getElementById("battery-count");
    this.speedIndicatorElement = document.getElementById("speed-indicator");
    this.stageIndicatorElement = document.getElementById("stage-indicator");
    this.hudMessageElement = document.getElementById("hud-message");
  }

  updateSpeedHUD() {
    if (this.speedIndicatorElement) {
      this.speedIndicatorElement.textContent = `SPD ${Math.round(
        this.gameSpeed
      )}`;
    }
    if (this.stageIndicatorElement) {
      const level = this.obstacleManager
        ? this.obstacleManager.getDifficultyLevel()
        : 1;
      this.stageIndicatorElement.textContent = `STG ${level
        .toString()
        .padStart(2, "0")}`;
    }
  }

  handlePlayerInput() {
    if (this.hasPlayerInteracted) {
      return;
    }
    this.hasPlayerInteracted = true;
    if (this.hudMessageElement) {
      this.hudMessageElement.classList.add("hud-message--hidden");
    }
  }
}
