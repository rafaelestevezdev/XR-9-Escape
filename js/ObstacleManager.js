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
    this.pool = []; // Object Pool
    this.spawnWindow = CONSTANTS.OBSTACLE_MANAGER_CONFIG.SPAWN_WINDOW;
    this.nextSpawnDelay = Phaser.Math.Between(
      this.spawnWindow.min,
      this.spawnWindow.max
    );
    this.lastSpawnTime = scene.time.now;
    this.speed = CONSTANTS.GAME_INITIAL_STATE.SPEED;
    this.obstacleTypes = CONSTANTS.OBSTACLE_MANAGER_CONFIG.TYPES;
    this.difficultyLevel = CONSTANTS.OBSTACLE_MANAGER_CONFIG.INITIAL_DIFFICULTY;
    this.spawningEnabled = true; // permitir pausar spawns durante eventos (p.ej., dron)
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

    // Iterar hacia atrás para poder eliminar elementos sin problemas
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obstacle = this.obstacles[i];

      if (obstacle.isOutOfBounds()) {
        // En lugar de destruir, desactivar y enviar al pool
        obstacle.deactivate();
        this.pool.push(obstacle);
        this.obstacles.splice(i, 1);
        continue;
      }

      // Actualizar velocidad y comportamiento
      obstacle.setSpeed(this.speed);
      obstacle.update(deltaSeconds);
    }

    // Crear nuevos obstáculos
    if (
      this.spawningEnabled &&
      currentTime - this.lastSpawnTime > this.nextSpawnDelay
    ) {
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
    let obstacle;

    if (this.pool.length > 0) {
      // Reutilizar del pool
      obstacle = this.pool.pop();
      obstacle.activate(
        CONSTANTS.GAME_POSITIONS.OBSTACLE_SPAWN_X,
        randomType,
        this.speed
      );
    } else {
      // Crear nuevo si el pool está vacío
      const cfg = CONSTANTS.OBSTACLE_CONFIG[randomType] || {};
      const targetGroup = cfg.collectible ? this.batteryGroup : this.group;
      obstacle = new Obstacle(
        this.scene,
        targetGroup,
        CONSTANTS.GAME_POSITIONS.OBSTACLE_SPAWN_X,
        randomType,
        this.speed
      );
    }

    this.obstacles.push(obstacle);
    return obstacle;
  }

  forceSpawn(type = "battery") {
    let obstacle;

    if (this.pool.length > 0) {
      obstacle = this.pool.pop();
      obstacle.activate(
        CONSTANTS.GAME_POSITIONS.OBSTACLE_SPAWN_X,
        type,
        this.speed
      );
    } else {
      const cfg = CONSTANTS.OBSTACLE_CONFIG[type] || {};
      const targetGroup = cfg.collectible ? this.batteryGroup : this.group;
      obstacle = new Obstacle(
        this.scene,
        targetGroup,
        CONSTANTS.GAME_POSITIONS.OBSTACLE_SPAWN_X,
        type,
        this.speed
      );
    }

    this.obstacles.push(obstacle);
    this.lastSpawnTime = this.scene.time.now;
    this.nextSpawnDelay = Phaser.Math.Between(
      this.spawnWindow.min,
      this.spawnWindow.max
    );
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
    if (CONSTANTS.DEBUG) console.log("🔄 ObstacleManager reset");
    this.group.clear(true, true);
    this.batteryGroup.clear(true, true);
    this.obstacles = [];
    this.pool = []; // Limpiar pool porque los sprites han sido destruidos por group.clear()
    this.spawnWindow = { ...CONSTANTS.OBSTACLE_MANAGER_CONFIG.SPAWN_WINDOW };
    this.nextSpawnDelay = Phaser.Math.Between(
      this.spawnWindow.min,
      this.spawnWindow.max
    );
    // Importante: usar el tiempo actual de la escena para evitar spawns inmediatos
    this.lastSpawnTime = this.scene.time.now;
    this.speed = CONSTANTS.GAME_INITIAL_STATE.SPEED;
    this.difficultyLevel = CONSTANTS.OBSTACLE_MANAGER_CONFIG.INITIAL_DIFFICULTY;
    this.spawningEnabled = true;
    if (CONSTANTS.DEBUG) console.log("✅ ObstacleManager reset complete");
  }

  /**
   * Habilitar/Deshabilitar la creación de nuevos obstáculos
   */
  setSpawningEnabled(enabled) {
    this.spawningEnabled = !!enabled;
  }

  /**
   * Eliminar todos los obstáculos y coleccionables activos inmediatamente
   */
  clearAllObstacles() {
    this.group.clear(true, true);
    this.batteryGroup.clear(true, true);
    this.obstacles.forEach((o) => {
      try {
        o.destroy();
      } catch (e) {}
    });
    this.obstacles = [];
    this.pool = []; // Limpiar pool
    // Reiniciar la ventana de spawn para evitar aparición inmediata al reactivar
    this.lastSpawnTime = this.scene.time.now;
    this.nextSpawnDelay = Phaser.Math.Between(
      this.spawnWindow.min,
      this.spawnWindow.max
    );
  }

  /**
   * Remove an obstacle immediately (used for collectibles)
   */
  removeObstacle(obstacle) {
    if (!obstacle) return;

    // Desactivar y devolver al pool en lugar de destruir
    obstacle.deactivate();
    this.pool.push(obstacle);

    // Eliminar de la lista activa
    const index = this.obstacles.indexOf(obstacle);
    if (index > -1) {
      this.obstacles.splice(index, 1);
    }
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
