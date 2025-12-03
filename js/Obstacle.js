/**
 * Clase Obstacle - Responsable de la creación de obstáculos individuales
 * Principio de responsabilidad única: Solo gestiona un obstáculo
 */
class Obstacle {
  constructor(scene, group, spawnX, type, speed) {
    this.scene = scene;
    this.type = type;
    const config = this.getConfig(type);

    // Calcular posición Y: usar la misma línea base que el jugador
    let spawnY = CONSTANTS.GAME_POSITIONS.GROUND_Y;

    // Solo aplicar yOffset para coleccionables (como baterías que flotan)
    if (config.yOffset !== undefined) {
      spawnY += config.yOffset;
    }

    const originY = config.originY ?? 1;

    this.sprite = scene.physics.add.sprite(spawnX, spawnY, config.texture);
    this.sprite.setOrigin(0.5, originY);
    this.sprite.setDisplaySize(config.display.width, config.display.height);
    this.sprite.body.setSize(config.hitbox.width, config.hitbox.height);

    // Simplificar el cálculo de offset usando la configuración directamente
    this.sprite.body.setOffset(config.hitbox.offsetX, config.hitbox.offsetY);
    this.sprite.body.allowGravity = false;
    this.sprite.setImmovable(true);
    group.add(this.sprite);

    // Behavior flags
    this.collectible = !!config.collectible;
    this._isBattery = !!config.isBattery;
    this._isDash = !!config.isDash;
    this.rotating = !!config.rotating;
    this.rotSpeed = config.rotSpeed || 0;
    this.bobAmplitude = config.bobAmplitude || 0;
    this.bobSpeed = config.bobSpeed || 0;
    this.baseY = this.sprite.y;

    // Expose data for collision handling
    this.sprite.setData("type", type);
    this.sprite.setData("collectible", this.collectible);
    this.sprite.setData("ref", this);
    if (this._isDash) this.sprite.setData("dash", true);

    this.minGap = config.minGap;
    this._destroyed = false;
    this._elapsed = 0;
    this.setSpeed(speed);
  }

  getConfig(type) {
    return CONSTANTS.OBSTACLE_CONFIG[type] || CONSTANTS.OBSTACLE_CONFIG.crate;
  }

  /**
   * Reactivar el obstáculo desde el pool
   */
  activate(spawnX, type, speed) {
    this.type = type;
    const config = this.getConfig(type);

    // Recalcular posición Y
    let spawnY = CONSTANTS.GAME_POSITIONS.GROUND_Y;
    if (config.yOffset !== undefined) {
      spawnY += config.yOffset;
    }
    const originY = config.originY ?? 1;

    // Actualizar textura y propiedades físicas
    this.sprite.setTexture(config.texture);
    this.sprite.setOrigin(0.5, originY);
    this.sprite.setDisplaySize(config.display.width, config.display.height);
    this.sprite.body.setSize(config.hitbox.width, config.hitbox.height);
    this.sprite.body.setOffset(config.hitbox.offsetX, config.hitbox.offsetY);

    // Resetear posición y estado
    this.sprite.setPosition(spawnX, spawnY);
    this.sprite.setActive(true);
    this.sprite.setVisible(true);
    this.sprite.body.enable = true;

    // Resetear flags
    this.collectible = !!config.collectible;
    this._isBattery = !!config.isBattery;
    this._isDash = !!config.isDash;
    this.rotating = !!config.rotating;
    this.rotSpeed = config.rotSpeed || 0;
    this.bobAmplitude = config.bobAmplitude || 0;
    this.bobSpeed = config.bobSpeed || 0;
    this.baseY = spawnY;

    // Actualizar data
    this.sprite.setData("type", type);
    this.sprite.setData("collectible", this.collectible);
    this.sprite.setData("ref", this);
    if (this._isDash) this.sprite.setData("dash", true);
    else this.sprite.setData("dash", false); // Limpiar si no es dash

    this.minGap = config.minGap;
    this._destroyed = false;
    this._elapsed = 0;
    this.setSpeed(speed);
  }

  /**
   * Desactivar obstáculo (para pooling)
   */
  deactivate() {
    this.sprite.setActive(false);
    this.sprite.setVisible(false);
    this.sprite.body.enable = false;
    this.sprite.setPosition(-1000, -1000); // Mover lejos por seguridad
    this._destroyed = true; // Marcar como "destruido" para la lógica del juego, aunque sigue en memoria
  }

  /**
   * Obtener el sprite del obstáculo
   */
  getSprite() {
    return this.sprite;
  }

  /**
   * Verificar si el obstáculo está fuera de la pantalla
   */
  isOutOfBounds() {
    if (this._destroyed) return true;
    if (!this.sprite) return true;
    return this.sprite.x < -100;
  }

  getMinGap() {
    return this.minGap;
  }

  /**
   * Destruir el obstáculo (limpieza final)
   */
  destroy() {
    // ... (código existente)
    if (this.sprite) {
      try {
        this.sprite.destroy();
      } catch (e) {}
      this.sprite = null;
    }
  }

  isBattery() {
    return this._isBattery;
  }

  isDash() {
    return this._isDash;
  }

  update(deltaSeconds) {
    if (this._destroyed) return;
    this._elapsed += deltaSeconds || 0;
    if (this.rotating && this.sprite) {
      this.sprite.angle += this.rotSpeed * (deltaSeconds || 0);
    }
    if (this.bobAmplitude && this.sprite) {
      this.sprite.y =
        this.baseY +
        Math.sin(this._elapsed * this.bobSpeed) * this.bobAmplitude;
    }
  }

  /**
   * Incrementar velocidad (para aumentar dificultad)
   */
  increaseSpeed(increase) {
    if (this.sprite && this.sprite.body) {
      this.setSpeed(Math.abs(this.sprite.body.velocity.x) + increase);
    }
  }

  setSpeed(speed) {
    if (this.sprite && this.sprite.body) {
      this.sprite.setVelocityX(-speed);
    }
  }
}
