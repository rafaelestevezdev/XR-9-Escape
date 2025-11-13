/**
 * GameScene.js - Escena principal refactorizada que coordina managers
 * Principio de responsabilidad única: Coordina todos los aspectos del juego
 */

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
    if (CONSTANTS.DEBUG) console.log("✅ GameScene constructor called");
  }

  init() {
    if (CONSTANTS.DEBUG) console.log("🎮 GameScene.init() called");
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
    this.laserDroneManager = null;
    if (CONSTANTS.DEBUG) console.log("✅ All managers initialized");
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

    // Cargar música (formato OGG)
    this.load.audio(CONSTANTS.AUDIO.BGM_MAIN, ["assets/music/musica.ogg"]);
    // Cargar efecto de sonido para recogida de objetos
    this.load.audio(CONSTANTS.AUDIO.SFX_PICKUP, [
      "assets/sound/objetc-sound.wav",
    ]);
  }

  create() {
    if (CONSTANTS.DEBUG) console.log("🎮 GameScene.create() called");

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
    this.createLaserDroneManager();

    // Inicializar managers
    this.inputManager.initialize();
    this.hudManager.initialize();

    // Configurar colisiones
    this.setupCollisions();

    // Configurar eventos de input
    this.setupInputEvents();

    // Mostrar pantalla de inicio
    this.hudManager.showStartScreen();
    if (CONSTANTS.DEBUG) console.log("✅ GameScene created successfully");

    // Preparar BGM (no reproducir hasta interacción del usuario por restricciones de autoplay)
    this.bgm = this.sound.add(CONSTANTS.AUDIO.BGM_MAIN, {
      loop: true,
      volume: this.getPreferredMusicVolume(),
    });
    // Preparar SFX de recogida (se reproduce bajo demanda)
    this.sfxPickup = this.sound.add(CONSTANTS.AUDIO.SFX_PICKUP, {
      volume: this.getPreferredSfxVolume(),
    });
  }

  createLaserDroneManager() {
    this.laserDroneManager = new LaserDroneManager(
      this,
      this.gameState,
      this.player,
      this.obstacleManager
    );
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
      this.handleCollectibleOverlap,
      this
    );

    // Overlap entre jugador y rayos láser (dron)
    // Se configura aunque el dron no exista aún; el manager crea su grupo
    if (this.laserDroneManager) {
      this.physicsManager.addOverlap(
        this.player.getSprite(),
        this.laserDroneManager.getLaserGroup(),
        this.handleLaserHit,
        this
      );
    }
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
    if (CONSTANTS.DEBUG) console.log("▶️ Starting game...");
    this.gameState.setPlayerInteracted();
    this.gameState.startGameplay();
    this.gameState.updateLastDifficultyIncrease(this.time.now);
    this.hudManager.hideStartScreen();
    this.hudManager.showHUD();
    if (CONSTANTS.DEBUG) console.log("✅ Game started");

    // Iniciar música tras interacción del usuario
    if (this.bgm && !this.bgm.isPlaying) {
      // Pequeño fade-in
      const targetVol = this.getPreferredMusicVolume();
      this.bgm.play({ volume: 0 });
      this.tweens.add({
        targets: this.bgm,
        volume: targetVol,
        duration: CONSTANTS.AUDIO_CONFIG.FADE_DURATION_MS,
      });
    }
  }

  handleLaserHit(player, laserSprite) {
    if (this.gameState.isGameActive()) {
      this.endGame();
    }
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

    // Pausar música
    if (this.bgm && this.bgm.isPlaying) {
      this.bgm.pause();
    }
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

    // Reanudar música
    if (this.bgm && this.bgm.isPaused) {
      this.bgm.resume();
    }
  }

  restartGame() {
    if (CONSTANTS.DEBUG) console.log("🔄 Restarting game...");

    // Ocultar pantalla de game over
    this.hudManager.hideGameOverScreen();
    this.hudManager.hideStartScreen();

    // Resetear estado
    this.gameState.reset();

    // Resetear objetos del juego
    this.player.reset();
    this.obstacleManager.reset();
    if (this.laserDroneManager) {
      this.laserDroneManager.reset();
    }

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

    if (CONSTANTS.DEBUG) console.log("✅ Game restarted");

    // Asegurar música en reproducción
    if (this.bgm && !this.bgm.isPlaying) {
      this.bgm.play({ volume: this.getPreferredMusicVolume() });
    }
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

    // Detener música al volver al menú
    if (this.bgm && this.bgm.isPlaying) {
      this.bgm.stop();
    }
  }

  handleObstacleCollision(player, obstacle) {
    if (this.gameState.isGameActive()) {
      this.endGame();
    }
  }

  handleCollectibleOverlap(player, itemSprite) {
    if (!this.gameState.isGameActive()) return;
    const type = itemSprite.getData("type");
    // Eliminar el item del mundo
    this.obstacleManager.removeObstacle(itemSprite.getData("ref"));

    if (type === "battery") {
      this.gameState.addBattery();
      this.hudManager.updateBatteryCount(this.gameState.getBatteryCount());
      this.playPickupSfx();
    } else if (type === CONSTANTS.POWERUPS.DASH.KEY) {
      // Activar dash temporal
      this.gameState.activateDash(
        CONSTANTS.POWERUPS.DASH.DURATION_MS,
        CONSTANTS.POWERUPS.DASH.SPEED_BOOST
      );
      // Feedback ligero opcional: tintar al jugador
      const spr = this.player.getSprite();
      spr.setTint(0x8bc4ff);
      this.time.delayedCall(CONSTANTS.POWERUPS.DASH.DURATION_MS, () => {
        if (spr && spr.clearTint) spr.clearTint();
      });
      this.playPickupSfx();
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

    // Fade-out y stop de música en fin del juego
    if (this.bgm && this.bgm.isPlaying) {
      const target = { vol: this.bgm.volume };
      this.tweens.add({
        targets: target,
        vol: 0,
        duration: CONSTANTS.AUDIO_CONFIG.FADE_DURATION_MS,
        onUpdate: () => this.bgm.setVolume(target.vol),
        onComplete: () => this.bgm.stop(),
      });
    }
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

      // Actualizar dron láser
      if (this.laserDroneManager) {
        this.laserDroneManager.update(
          time,
          this.gameState.getGameSpeed(),
          deltaSeconds
        );
      }

      // Actualizar power-ups temporales
      this.gameState.tickDash(delta);

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
    if (this.laserDroneManager) this.laserDroneManager.destroy();

    // Limpiar referencias
    this.gameState = null;
    this.player = null;
    this.obstacleManager = null;
    this.laserDroneManager = null;

    // Destruir música
    if (this.bgm) {
      try {
        this.bgm.destroy();
      } catch (e) {}
      this.bgm = null;
    }
  }

  // Preferencias de audio
  getPreferredMusicVolume() {
    const saved = window.localStorage?.getItem("xr9_music_volume");
    if (saved !== null) {
      const v = parseFloat(saved);
      if (!isNaN(v)) return Math.max(0, Math.min(1, v / 100));
    }
    return CONSTANTS.AUDIO_CONFIG.MUSIC_VOLUME;
  }

  getPreferredSfxVolume() {
    const saved = window.localStorage?.getItem("xr9_sfx_volume");
    if (saved !== null) {
      const v = parseFloat(saved);
      if (!isNaN(v)) return Math.max(0, Math.min(1, v / 100));
    }
    return CONSTANTS.AUDIO_CONFIG.SFX_VOLUME;
  }

  playPickupSfx() {
    if (this.sfxPickup) {
      // Actualizar volumen al valor preferido antes de reproducir
      this.sfxPickup.setVolume(this.getPreferredSfxVolume());
      this.sfxPickup.play();
    } else {
      // Fallback rápido por si no se creó la instancia
      this.sound.play(CONSTANTS.AUDIO.SFX_PICKUP, {
        volume: this.getPreferredSfxVolume(),
      });
    }
  }
}
