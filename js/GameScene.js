/**
 * GameScene.js - Escena principal refactorizada que coordina managers
 * Principio de responsabilidad única: Coordina todos los aspectos del juego
 */

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
    console.log("✅ GameScene constructor called");
  }

  init() {
    console.log("🎮 GameScene.init() called");
    // Inicializar todos los managers
    this.gameState = new GameState();
    this.inputManager = new InputManager(this);
    this.textureGenerator = new TextureGenerator(this);
    this.backgroundManager = new BackgroundManager(this);
    this.physicsManager = new PhysicsManager(this);
    this.hudManager = new HUDManager(this);

    // Inicializar objetos del juego
    this.player = null;
    this.obstacleManager = null;
    console.log("✅ All managers initialized");
  }

  preload() {
    // Cargar sprites del robot corriendo
    for (let i = 1; i <= 10; i++) {
      this.load.image(
        `robot-run-${i}`,
        `assets/sprites-robot/robot-run/player-run-${i}.png`
      );
    }

    // Cargar sprites del robot saltando
    for (let i = 1; i <= 6; i++) {
      this.load.image(
        `robot-jump-${i}`,
        `assets/sprites-robot/robot-jump/player-jump-${i}.png`
      );
    }

    // (Eliminado) No cargamos fondos por capas de imagen; usaremos fondo procedural con Phaser

    // Generar todas las texturas proceduralmente
    this.textureGenerator.generateAllTextures();
  }

  create() {
    console.log("🎮 GameScene.create() called");

    // Configurar cámara (zoom y encuadre)
    this.configureCamera();

    // Crear animación del robot corriendo
    this.anims.create({
      key: "robot-run",
      frames: [
        { key: "robot-run-1" },
        { key: "robot-run-2" },
        { key: "robot-run-3" },
        { key: "robot-run-4" },
        { key: "robot-run-5" },
        { key: "robot-run-6" },
        { key: "robot-run-7" },
        { key: "robot-run-8" },
        { key: "robot-run-9" },
        { key: "robot-run-10" },
      ],
      frameRate: 15,
      repeat: -1,
    });

    // Crear animación del robot saltando
    this.anims.create({
      key: "robot-jump",
      frames: [
        { key: "robot-jump-1" },
        { key: "robot-jump-2" },
        { key: "robot-jump-3" },
        { key: "robot-jump-4" },
        { key: "robot-jump-5" },
        { key: "robot-jump-6" },
      ],
      frameRate: 12,
      repeat: 0, // No se repite, solo se ejecuta una vez
    });

    // Configurar física
    this.physicsManager.setupWorldPhysics();
    this.physicsManager.createGround();

    // Crear elementos del juego
    this.backgroundManager.create();
    this.createPlayer();
    this.createObstacleManager();

    // Inicializar managers
    this.inputManager.initialize();
    this.hudManager.initialize();

    // Configurar colisiones
    this.setupCollisions();

    // Configurar eventos de input
    this.setupInputEvents();

    // Mostrar pantalla de inicio
    this.hudManager.showStartScreen();
    console.log("✅ GameScene created successfully");
  }

  /**
   * Configura el zoom y encuadre de la cámara para acercar la acción
   */
  configureCamera() {
    const cam = this.cameras.main;
    cam.setZoom(CONSTANTS.CAMERA.ZOOM);
    if (CONSTANTS.CAMERA.ROUND_PIXELS) cam.setRoundPixels(true);

    // Calcular encuadre vertical para que el jugador quede en la parte baja de la pantalla
    const viewHeight = cam.height / cam.zoom;
    const targetY = CONSTANTS.GAME_POSITIONS.GROUND_Y; // referencia del suelo
    const desiredRatio = CONSTANTS.CAMERA.PLAYER_SCREEN_Y_RATIO; // 0 (arriba) - 1 (abajo)
    const scrollY = Math.max(0, targetY - viewHeight * desiredRatio);
    cam.setScroll(0, scrollY);
  }

  createPlayer() {
    this.player = new Player(
      this,
      CONSTANTS.GAME_POSITIONS.PLAYER_SPAWN_X,
      CONSTANTS.GAME_POSITIONS.PLAYER_SPAWN_Y
    );
    this.player.create();
  }

  createObstacleManager() {
    this.obstacleManager = new ObstacleManager(this, this.gameState);
    this.obstacleManager.create();
  }

  setupCollisions() {
    // Colisión entre jugador y suelo
    this.physicsManager.addCollision(
      this.player.getSprite(),
      this.physicsManager.getGroundGroup()
    );

    // Colisión entre obstáculos y suelo
    this.physicsManager.addCollision(
      this.obstacleManager.getGroup(),
      this.physicsManager.getGroundGroup()
    );

    // Colisión entre jugador y obstáculos
    this.physicsManager.addCollision(
      this.player.getSprite(),
      this.obstacleManager.getGroup(),
      this.handleObstacleCollision,
      this
    );

    // Overlap entre jugador y baterías (coleccionables)
    this.physicsManager.addOverlap(
      this.player.getSprite(),
      this.obstacleManager.getBatteryGroup(),
      this.handleBatteryOverlap,
      this
    );
  }

  setupInputEvents() {
    // Evento para iniciar el juego
    this.inputManager.onStart(() => {
      if (!this.gameState.getHasPlayerInteracted()) {
        this.startGame();
      }
    });

    // Evento para saltar
    this.inputManager.onJump(() => {
      if (!this.gameState.isGamePaused() && !this.gameState.isGameOver()) {
        this.player.attemptJump();
        this.gameState.setPlayerInteracted();
      }
    });

    // Evento para cortar salto
    this.inputManager.onCutJump(() => {
      this.player.cutJump();
    });

    // Evento para pausar (podríamos agregar esto después)
    this.inputManager.onPause(() => {
      this.togglePause();
    });

    // Evento para reiniciar
    this.inputManager.onRestart(() => {
      this.restartGame();
    });
  }

  startGame() {
    console.log("▶️ Starting game...");
    this.gameState.setPlayerInteracted();
    this.gameState.startGameplay();
    this.gameState.updateLastDifficultyIncrease(this.time.now);
    this.hudManager.hideStartScreen();
    this.hudManager.showHUD();
    console.log("✅ Game started");
  }

  togglePause() {
    if (this.gameState.isGamePaused()) {
      this.resumeGame();
    } else {
      this.pauseGame();
    }
  }

  pauseGame() {
    this.gameState.pauseGame();
    this.physicsManager.pausePhysics();
    // Pausar animaciones y tweens de esta escena
    if (this.anims && this.anims.pauseAll) this.anims.pauseAll();
    if (this.tweens && this.tweens.pauseAll) this.tweens.pauseAll();
    // Pausar el fondo procedural para detener el parallax
    if (this.scene.isActive("EscenaIndustrial")) {
      this.scene.pause("EscenaIndustrial");
    }
    this.hudManager.showPauseScreen();
  }

  resumeGame() {
    this.gameState.resumeGame();
    this.physicsManager.resumePhysics();
    // Reanudar animaciones y tweens
    if (this.anims && this.anims.resumeAll) this.anims.resumeAll();
    if (this.tweens && this.tweens.resumeAll) this.tweens.resumeAll();
    // Reanudar fondo procedural
    if (this.scene.isPaused && this.scene.isPaused("EscenaIndustrial")) {
      this.scene.resume("EscenaIndustrial");
    }
    this.hudManager.hidePauseScreen();
  }

  restartGame() {
    console.log("🔄 Restarting game...");

    // Ocultar pantalla de game over
    this.hudManager.hideGameOverScreen();

    // Resetear estado
    this.gameState.reset();

    // Resetear objetos del juego
    this.player.reset();
    this.obstacleManager.reset();

    // Actualizar HUD sin mostrar pantalla de inicio
    this.hudManager.updateScore(0);
    this.hudManager.updateBatteryCount(0);
    this.hudManager.updateSpeed(CONSTANTS.GAME_INITIAL_STATE.SPEED);
    this.hudManager.updateStage(
      CONSTANTS.OBSTACLE_MANAGER_CONFIG.INITIAL_DIFFICULTY
    );

    // Iniciar el juego directamente
    this.gameState.setPlayerInteracted();
    this.gameState.startGameplay();
    this.gameState.updateLastDifficultyIncrease(this.time.now);
    this.hudManager.showHUD();

    // Resetear física al final para que todo esté listo
    this.physicsManager.resumePhysics();

    console.log("✅ Game restarted");
  }

  /**
   * Volver al menú principal
   */
  returnToMenu() {
    // Resetear estado del juego
    this.gameState.reset();
    this.hudManager.reset();

    // Resetear objetos
    this.player.reset();
    this.obstacleManager.reset();

    // Resetear física
    this.physicsManager.resumePhysics();

    // Mostrar pantalla de inicio
    this.hudManager.hideGameOverScreen();
    this.hudManager.showStartScreen();
  }

  handleObstacleCollision(player, obstacle) {
    if (this.gameState.isGameActive()) {
      this.endGame();
    }
  }

  handleBatteryOverlap(player, battery) {
    if (this.gameState.isGameActive()) {
      // Recolectar batería
      this.obstacleManager.removeObstacle(battery.getData("ref"));
      this.gameState.addBattery();

      // Actualizar UI
      this.hudManager.updateBatteryCount(this.gameState.getBatteryCount());
    }
  }

  endGame() {
    this.gameState.endGame();
    this.physicsManager.pausePhysics();
    this.player.stop();

    // Mostrar pantalla de game over
    this.hudManager.showGameOverScreen(
      this.gameState.getScore(),
      this.gameState.getBatteryCount()
    );
  }

  update(time, delta) {
    const deltaSeconds = delta / 1000;

    // Actualizar managers
    this.inputManager.update();
    this.hudManager.update(this.gameState, delta);

    if (this.gameState.isGameActive()) {
      // Actualizar elementos del juego
      this.player.update();
      this.backgroundManager.update(
        deltaSeconds,
        this.gameState.getGameSpeed()
      );
      this.obstacleManager.update(
        time,
        this.gameState.getGameSpeed(),
        deltaSeconds
      );

      // Actualizar estado del juego
      this.gameState.incrementScore(deltaSeconds);
      this.gameState.updateEnergy(deltaSeconds);

      // Verificar si el juego terminó por falta de energía
      if (this.gameState.isGameOver()) {
        // Finalizar correctamente el juego (pausa física, detener jugador y mostrar UI)
        this.endGame();
      }

      // Aumentar dificultad
      if (this.gameState.shouldIncreaseDifficulty(time)) {
        this.gameState.increaseDifficulty();
        this.obstacleManager.increaseDifficulty();
        this.gameState.updateLastDifficultyIncrease(time);
      }
    }
  }

  destroy() {
    // Destruir managers
    if (this.inputManager) this.inputManager.destroy();
    if (this.hudManager) this.hudManager.destroy();
    if (this.backgroundManager) this.backgroundManager.destroy();
    if (this.physicsManager) this.physicsManager.destroy();

    // Destruir objetos del juego
    if (this.player) this.player.destroy();
    if (this.obstacleManager) this.obstacleManager.destroy();

    // Limpiar referencias
    this.gameState = null;
    this.player = null;
    this.obstacleManager = null;
  }
}
