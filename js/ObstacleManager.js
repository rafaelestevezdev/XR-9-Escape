/**
 * Clase ObstacleManager - Responsable de gestionar todos los obstáculos
 * Principio de responsabilidad única: Solo gestiona la creación, actualización y destrucción de obstáculos
 */
class ObstacleManager {
  constructor(scene, gameState) {
    this.scene = scene;
    this.gameState = gameState;
    this.group = scene.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

    this.batteryGroup = scene.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

    this.obstacles = [];
    this.spawnWindow = CONSTANTS.OBSTACLE_MANAGER_CONFIG.SPAWN_WINDOW;
    this.nextSpawnDelay = Phaser.Math.Between(
      this.spawnWindow.min,
      this.spawnWindow.max
    );
    this.lastSpawnTime = scene.time.now;
    this.speed = CONSTANTS.GAME_INITIAL_STATE.SPEED;
    this.obstacleTypes = CONSTANTS.OBSTACLE_MANAGER_CONFIG.TYPES;
    this.difficultyLevel = CONSTANTS.OBSTACLE_MANAGER_CONFIG.INITIAL_DIFFICULTY;
  }

  /**
   * Inicializar el manager
   */
  create() {
    // Configuración inicial ya está en el constructor
  }

  /**
   * Actualizar el gestor de obstáculos
   */
  update(currentTime, speed, deltaSeconds = 0) {
    this.speed = speed;

    // Eliminar obstáculos fuera de pantalla o ya destruidos
    this.obstacles = this.obstacles.filter((obstacle) => {
      if (obstacle.isOutOfBounds()) {
        obstacle.destroy();
        return false;
      }
      return true;
    });

    // Actualizar velocidad y comportamiento (rotación, bob)
    this.obstacles.forEach((obstacle) => {
      obstacle.setSpeed(this.speed);
      obstacle.update(deltaSeconds);
    });

    // Crear nuevos obstáculos
    if (currentTime - this.lastSpawnTime > this.nextSpawnDelay) {
      const obstacle = this.spawn();
      this.lastSpawnTime = currentTime;
      const baseDelay = Phaser.Math.Between(
        this.spawnWindow.min,
        this.spawnWindow.max
      );
      const minDelay = Math.ceil((obstacle.getMinGap() / this.speed) * 1000);
      this.nextSpawnDelay = Math.max(baseDelay, minDelay);
    }
  }

  /**
   * Crear un nuevo obstáculo
   */
  spawn() {
    const randomType = Phaser.Utils.Array.GetRandom(this.obstacleTypes);
    const obstacle = new Obstacle(
      this.scene,
      randomType === "battery" ? this.batteryGroup : this.group,
      CONSTANTS.GAME_POSITIONS.OBSTACLE_SPAWN_X,
      randomType,
      this.speed
    );
    this.obstacles.push(obstacle);
    return obstacle;
  }

  /**
   * Obtener todos los obstáculos
   */
  getGroup() {
    return this.group;
  }

  /**
   * Obtener el grupo de baterías
   */
  getBatteryGroup() {
    return this.batteryGroup;
  }

  /**
   * Incrementar dificultad
   */
  increaseDifficulty() {
    this.difficultyLevel += 1;
    this.spawnWindow.min = Math.max(
      CONSTANTS.OBSTACLE_MANAGER_CONFIG.MIN_SPAWN_WINDOW.min,
      this.spawnWindow.min -
        CONSTANTS.OBSTACLE_MANAGER_CONFIG.SPAWN_WINDOW_DECREMENT
    );
    this.spawnWindow.max = Math.max(
      CONSTANTS.OBSTACLE_MANAGER_CONFIG.MIN_SPAWN_WINDOW.max,
      this.spawnWindow.max -
        CONSTANTS.OBSTACLE_MANAGER_CONFIG.SPAWN_WINDOW_DECREMENT
    );

    this.speed = Math.min(
      this.speed + CONSTANTS.GAME_INITIAL_STATE.SPEED_INCREMENT,
      CONSTANTS.GAME_INITIAL_STATE.MAX_SPEED
    );
  }

  /**
   * Resetear el gestor
   */
  reset() {
    console.log("🔄 ObstacleManager reset");
    this.group.clear(true, true);
    this.batteryGroup.clear(true, true);
    this.obstacles = [];
    this.spawnWindow = { ...CONSTANTS.OBSTACLE_MANAGER_CONFIG.SPAWN_WINDOW };
    this.nextSpawnDelay = Phaser.Math.Between(
      this.spawnWindow.min,
      this.spawnWindow.max
    );
    // Importante: usar el tiempo actual de la escena para evitar spawns inmediatos
    this.lastSpawnTime = this.scene.time.now;
    this.speed = CONSTANTS.GAME_INITIAL_STATE.SPEED;
    this.difficultyLevel = CONSTANTS.OBSTACLE_MANAGER_CONFIG.INITIAL_DIFFICULTY;
    console.log("✅ ObstacleManager reset complete");
  }

  /**
   * Remove an obstacle immediately (used for collectibles)
   */
  removeObstacle(obstacle) {
    if (!obstacle) return;
    // remove sprite from physics group if still present
    const sprite = obstacle.getSprite && obstacle.getSprite();
    if (sprite && this.group && typeof this.group.getChildren === "function") {
      const children = this.group.getChildren();
      if (children && children.includes(sprite)) {
        try {
          this.group.remove(sprite, true, true);
        } catch (e) {
          // ignore
        }
      }
    }
    if (
      sprite &&
      this.batteryGroup &&
      typeof this.batteryGroup.getChildren === "function"
    ) {
      const children = this.batteryGroup.getChildren();
      if (children && children.includes(sprite)) {
        try {
          this.batteryGroup.remove(sprite, true, true);
        } catch (e) {
          // ignore
        }
      }
    }
    obstacle.destroy();
    this.obstacles = this.obstacles.filter((o) => o !== obstacle);
  }

  getSpeed() {
    return this.speed;
  }

  getDifficultyLevel() {
    return this.difficultyLevel;
  }

  /**
   * Destruir el manager
   */
  destroy() {
    this.group.clear(true, true);
    this.batteryGroup.clear(true, true);
    this.obstacles = [];
  }
}
