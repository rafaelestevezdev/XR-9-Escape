/**
 * Clase ObstacleManager - Responsable de gestionar todos los obstáculos
 * Principio de responsabilidad única: Solo gestiona la creación, actualización y destrucción de obstáculos
 */
class ObstacleManager {
  constructor(scene) {
    this.scene = scene;
    this.group = scene.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

    this.obstacles = [];
    this.spawnWindow = { min: 900, max: 1600 };
    this.nextSpawnDelay = Phaser.Math.Between(
      this.spawnWindow.min,
      this.spawnWindow.max
    );
    this.lastSpawnTime = scene.time.now;
    this.speed = 350;
    this.obstacleTypes = ["crate", "hammer", "tank", "gear", "battery"];
    this.difficultyLevel = 1;
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
      this.group,
      880,
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
   * Incrementar dificultad
   */
  increaseDifficulty() {
    this.difficultyLevel += 1;
    this.spawnWindow.min = Math.max(500, this.spawnWindow.min - 60);
    this.spawnWindow.max = Math.max(900, this.spawnWindow.max - 60);

    this.speed = Math.min(this.speed + 40, 650);
  }

  /**
   * Resetear el gestor
   */
  reset() {
    this.group.clear(true, true);
    this.obstacles = [];
    this.spawnWindow = { min: 900, max: 1600 };
    this.nextSpawnDelay = Phaser.Math.Between(
      this.spawnWindow.min,
      this.spawnWindow.max
    );
    this.lastSpawnTime = this.scene.time.now;
    this.speed = 350;
    this.difficultyLevel = 1;
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
    obstacle.destroy();
    this.obstacles = this.obstacles.filter((o) => o !== obstacle);
  }

  getSpeed() {
    return this.speed;
  }

  getDifficultyLevel() {
    return this.difficultyLevel;
  }
}
