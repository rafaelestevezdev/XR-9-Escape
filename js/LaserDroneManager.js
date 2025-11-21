/**
 * LaserDroneManager - Controla aparición del dron y sus disparos
 * Pausa los obstáculos mientras el dron está activo
 */
class LaserDroneManager {
  constructor(scene, gameState, player, obstacleManager, sfxLaserShoot) {
    this.scene = scene;
    this.gameState = gameState;
    this.player = player;
    this.obstacleManager = obstacleManager;
    this.sfxLaserShoot = sfxLaserShoot;

    this.laserGroup = scene.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

    this.activeDrone = null;
    this.spawnWindow = { min: 6000, max: 11000 };
    this.nextSpawnTime =
      scene.time.now +
      Phaser.Math.Between(this.spawnWindow.min, this.spawnWindow.max);
    this.active = false;
  }

  getLaserGroup() {
    return this.laserGroup;
  }
  isActive() {
    return !!this.activeDrone;
  }

  spawnDrone() {
    if (this.activeDrone) return;
    this.activeDrone = new LaserDrone(
      this.scene,
      this.player,
      this.laserGroup,
      this.sfxLaserShoot
    );
    this.active = true;
    // Pausar spawns y limpiar obstáculos existentes
    if (this.obstacleManager) {
      this.obstacleManager.setSpawningEnabled(false);
      this.obstacleManager.clearAllObstacles();
    }
  }

  update(time, gameSpeed, dt) {
    // actualizar láseres: movimiento manual y limpieza
    this.laserGroup.getChildren().forEach((laser) => {
      const vx = laser.getData("vx");
      const vy = laser.getData("vy");
      if (typeof vx === "number" && typeof vy === "number") {
        laser.x += vx * dt;
        laser.y += vy * dt;
        if (laser.body) {
          laser.body.reset(laser.x, laser.y);
        }
      }

      if (
        laser.x < -60 ||
        laser.y < -80 ||
        laser.y > CONSTANTS.GAME_CONFIG.HEIGHT + 80
      ) {
        try {
          laser.destroy();
        } catch (e) {}
      }
    });

    if (this.activeDrone) {
      const finished = this.activeDrone.update(time, gameSpeed, dt);
      if (finished) {
        this.activeDrone = null;
        this.active = false;
        // reactivar spawns de obstáculos
        if (this.obstacleManager) {
          this.obstacleManager.setSpawningEnabled(true);
          this.obstacleManager.forceSpawn("battery");
        }
        // planificar próximo spawn
        this.nextSpawnTime =
          time +
          Phaser.Math.Between(this.spawnWindow.min, this.spawnWindow.max);
      }
    } else {
      // planificar spawn cuando toque y el juego esté activo
      if (this.gameState.isGameActive() && time >= this.nextSpawnTime) {
        this.spawnDrone();
      }
    }
  }

  reset() {
    // destruir dron y láseres
    if (this.activeDrone) {
      this.activeDrone.destroy();
      this.activeDrone = null;
    }
    if (this.laserGroup) {
      this.laserGroup.clear(true, true);
    }
    this.active = false;
    this.nextSpawnTime =
      this.scene.time.now +
      Phaser.Math.Between(this.spawnWindow.min, this.spawnWindow.max);
    if (this.obstacleManager) this.obstacleManager.setSpawningEnabled(true);
  }

  destroy() {
    this.reset();
    if (this.laserGroup)
      try {
        this.laserGroup.destroy();
      } catch (e) {}
    this.laserGroup = null;
  }
}
