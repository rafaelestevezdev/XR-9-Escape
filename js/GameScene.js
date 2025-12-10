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
    this.perfText = null;
    this.perfEnabled = false;
    this.perfLastUpdate = 0;
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
    // Cargar efecto de sonido de Game Over
    this.load.audio(CONSTANTS.AUDIO.SFX_GAMEOVER, [
      "assets/sound/sonido_pierde.mp3",
    ]);
    // Cargar efecto de sonido de Salto
    this.load.audio(CONSTANTS.AUDIO.SFX_JUMP, ["assets/sound/Jump_sound.mp3"]);
    // Cargar efecto de sonido de Disparo Láser
    this.load.audio(CONSTANTS.AUDIO.SFX_LASER_SHOOT, [
      "assets/sound/Shoot.wav",
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

    // Preparar todos los sonidos ANTES de crear los objetos del juego
    // (no reproducir música hasta interacción del usuario por restricciones de autoplay)
    this.bgm = this.sound.add(CONSTANTS.AUDIO.BGM_MAIN, {
      loop: true,
      volume: this.getPreferredMusicVolume(),
    });
    // Preparar SFX de recogida (se reproduce bajo demanda)
    this.sfxPickup = this.sound.add(CONSTANTS.AUDIO.SFX_PICKUP, {
      volume: this.getPreferredSfxVolume(),
    });
    // Preparar SFX de Game Over
    this.sfxGameOver = this.sound.add(CONSTANTS.AUDIO.SFX_GAMEOVER, {
      volume: this.getPreferredSfxVolume(),
    });
    // Preparar SFX de Salto
    this.sfxJump = this.sound.add(CONSTANTS.AUDIO.SFX_JUMP, {
      volume: this.getPreferredSfxVolume(),
    });
    // Preparar SFX de Disparo Láser
    this.sfxLaserShoot = this.sound.add(CONSTANTS.AUDIO.SFX_LASER_SHOOT, {
      volume: this.getPreferredSfxVolume(),
    });

    // Crear elementos del juego (ahora los sonidos ya están disponibles)
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

    // Crear overlay de rendimiento (se activa con F3)
    this.createPerfOverlay();

    // Mostrar pantalla de inicio
    this.hudManager.showStartScreen();
    if (CONSTANTS.DEBUG) console.log("✅ GameScene created successfully");
  }

  createLaserDroneManager() {
    this.laserDroneManager = new LaserDroneManager(
      this,
      this.gameState,
      this.player,
      this.obstacleManager,
      this.sfxLaserShoot
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

    // Overlap entre jugador y obstáculos (solo detectar, sin bloqueo físico)
    // Esto permite saltar sobre ellos sin perder
    this.physicsManager.addOverlap(
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
        if (this.player.attemptJump()) {
          // Reproducir sonido de salto solo si el salto fue exitoso (el jugador estaba en el suelo)
          if (this.sfxJump) {
            this.sfxJump.setVolume(this.getPreferredSfxVolume());
            this.sfxJump.play();
          }
        }
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

    // Toggle overlay de rendimiento con F3
    const perfKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.F3
    );
    perfKey.on("down", () => {
      this.perfEnabled = !this.perfEnabled;
      if (this.perfText) this.perfText.setVisible(this.perfEnabled);
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
        duration: 100, // Entrada rápida para coincidir con el fin de la transición
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

    // Pausar música del juego
    if (this.bgm && this.bgm.isPlaying) {
      this.bgm.pause();
    }

    // No reproducir música del menú en pausa (silencio)
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

    // Reanudar música del juego
    if (this.bgm && this.bgm.isPaused) {
      this.bgm.resume();
    }
  }

  restartGame() {
    if (CONSTANTS.DEBUG) console.log("🔄 Restarting game...");

    // Detener música del menú si está sonando
    if (window.menuMusic) {
      window.menuMusic.pause();
      window.isMenuMusicPlaying = false;
    }

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

    // Iniciar el juego directamente
    this.gameState.setPlayerInteracted();
    this.gameState.startGameplay();
    this.gameState.updateLastDifficultyIncrease(this.time.now);
    this.hudManager.showHUD();

    // Resetear física al final para que todo esté listo
    this.physicsManager.resumePhysics();

    if (CONSTANTS.DEBUG) console.log("✅ Game restarted");

    // Asegurar música en reproducción
    if (this.bgm) {
      if (this.bgm.isPlaying) this.bgm.stop();
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

    // Detener música del juego
    if (this.bgm && this.bgm.isPlaying) {
      this.bgm.stop();
    }

    // La música del menú ya se maneja en main.js returnToMenu()
  }

  handleObstacleCollision(player, obstacle) {
    if (!this.gameState.isGameActive()) return;

    // Solo morir si el jugador está tocando el suelo (no en el aire)
    const playerBody = player.body;
    if (!playerBody.touching.down && !playerBody.blocked.down) {
      // Está en el aire (saltando), no hacer nada
      return;
    }

    // Pequeño punch visual al golpear
    const cam = this.cameras.main;
    if (cam) {
      cam.shake(140, 0.012);
      cam.flash(140, 255, 96, 96, false);
    }
    const spr = this.player?.getSprite?.();
    if (spr) {
      spr.setTint(0xff6666);
      this.time.delayedCall(160, () => {
        if (spr && spr.clearTint) spr.clearTint();
      });
    }
    this.endGame();
  }

  handleCollectibleOverlap(player, itemSprite) {
    if (!this.gameState.isGameActive()) return;
    const type = itemSprite.getData("type");

    // Congelar física y preparar animación de recogida
    const ref = itemSprite.getData("ref");
    if (itemSprite.body) {
      itemSprite.body.enable = false;
      itemSprite.body.setVelocity(0, 0);
    }

    // Feedback visual rápido
    this.tweens.add({
      targets: itemSprite,
      scaleX: 1.35,
      scaleY: 1.35,
      alpha: 0,
      duration: 180,
      ease: "quad.out",
      onComplete: () => {
        this.obstacleManager.removeObstacle(ref);
      },
    });

    // Popup flotante
    const popupText = type === "battery" ? "+1 ⚡" : "DASH";
    const popup = this.add
      .text(itemSprite.x, itemSprite.y - 10, popupText, {
        fontFamily: "Press Start 2P",
        fontSize: "12px",
        color: "#9bf0ff",
        stroke: "#111",
        strokeThickness: 3,
      })
      .setOrigin(0.5)
      .setDepth(5000);

    this.tweens.add({
      targets: popup,
      y: popup.y - 20,
      alpha: 0,
      duration: 450,
      ease: "sine.out",
      onComplete: () => popup.destroy(),
    });

    if (type === "battery") {
      this.gameState.addBattery();
      this.hudManager.updateBatteryCount(this.gameState.getBatteryCount());
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

    // Reproducir sonido de Game Over
    if (this.sfxGameOver) {
      this.sfxGameOver.setVolume(this.getPreferredSfxVolume());
      this.sfxGameOver.play();
    }

    // Fade-out y stop de música en fin del juego
    if (this.bgm && this.bgm.isPlaying) {
      const target = { vol: this.bgm.volume };
      this.tweens.add({
        targets: target,
        vol: 0,
        duration: CONSTANTS.AUDIO_CONFIG.FADE_DURATION_MS,
        onUpdate: () => this.bgm.setVolume(target.vol),
        onComplete: () => {
          this.bgm.stop();
          // No reproducir música del menú en Game Over, solo silencio o SFX de derrota si hubiera
        },
      });
    } else {
      // Si no había música sonando, asegurar silencio
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

    // Overlay de rendimiento: refrescar cada ~200ms para bajo costo
    if (this.perfEnabled && this.perfText) {
      if (time - this.perfLastUpdate > 200) {
        const fps = Math.round(this.game.loop.actualFps || 0);
        const obs = this.obstacleManager?.obstacles?.length || 0;
        const pool = this.obstacleManager?.pool?.length || 0;
        const lasers = this.laserDroneManager?.getLaserGroup?.()
          ? this.laserDroneManager.getLaserGroup().getChildren().length
          : 0;
        const tweens = this.tweens?.getAllTweens()?.length || 0;
        this.perfText.setText(
          `FPS: ${fps}\nObs: ${obs} (pool ${pool})\nLasers: ${lasers}\nTweens: ${tweens}`
        );
        this.perfLastUpdate = time;
      }
    }
  }

  createPerfOverlay() {
    const style = {
      fontFamily: "monospace",
      fontSize: "12px",
      color: "#7cf0ff",
      align: "left",
      backgroundColor: "rgba(0,0,0,0.35)",
      padding: { x: 6, y: 4 },
    };
    this.perfText = this.add.text(10, 10, "", style).setScrollFactor(0);
    this.perfText.setDepth(99);
    this.perfText.setVisible(false);
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
