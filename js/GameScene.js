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
    // Generar todas las texturas proceduralmente
    this.textureGenerator.generateAllTextures();
  }

  create() {
    console.log("🎮 GameScene.create() called");
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
    this.hudManager.showPauseScreen();
  }

  resumeGame() {
    this.gameState.resumeGame();
    this.physicsManager.resumePhysics();
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
