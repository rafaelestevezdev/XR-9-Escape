/**
 * Clase Obstacle - Responsable de la creación de obstáculos individuales
 * Principio de responsabilidad única: Solo gestiona un obstáculo
 */
class Obstacle {
  constructor(scene, group, spawnX, type, speed) {
    this.scene = scene;
    this.type = type;
    const config = this.getConfig(type);
    const spawnY = CONSTANTS.GAME_POSITIONS.GROUND_Y + (config.yOffset || 0);
    const originY = config.originY ?? 1;

    this.sprite = scene.physics.add.sprite(spawnX, spawnY, config.texture);
    this.sprite.setOrigin(0.5, originY);
    this.sprite.setDisplaySize(config.display.width, config.display.height);
    this.sprite.body.setSize(config.hitbox.width, config.hitbox.height);

    const offsetX =
      (this.sprite.displayWidth - config.hitbox.width) * 0.5 +
      config.hitbox.offsetX;
    let offsetY;
    if (originY === 1) {
      offsetY =
        this.sprite.displayHeight -
        config.hitbox.height +
        config.hitbox.offsetY;
    } else if (originY === 0.5) {
      offsetY =
        (this.sprite.displayHeight - config.hitbox.height) * 0.5 +
        config.hitbox.offsetY;
    } else {
      offsetY = config.hitbox.offsetY;
    }

    this.sprite.body.setOffset(offsetX, offsetY);
    this.sprite.body.allowGravity = false;
    this.sprite.setImmovable(true);
    group.add(this.sprite);

    // Behavior flags
    this.collectible = !!config.collectible;
    this._isBattery = !!config.isBattery;
    this.rotating = !!config.rotating;
    this.rotSpeed = config.rotSpeed || 0;
    this.bobAmplitude = config.bobAmplitude || 0;
    this.bobSpeed = config.bobSpeed || 0;
    this.baseY = this.sprite.y;

    // Expose data for collision handling
    this.sprite.setData("type", type);
    this.sprite.setData("collectible", this.collectible);
    this.sprite.setData("ref", this);

    this.minGap = config.minGap;
    this._destroyed = false;
    this._elapsed = 0;
    this.setSpeed(speed);
  }

  getConfig(type) {
    return CONSTANTS.OBSTACLE_CONFIG[type] || CONSTANTS.OBSTACLE_CONFIG.crate;
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
   * Destruir el obstáculo
   */
  destroy() {
    if (this._destroyed) return;
    this._destroyed = true;
    if (this.sprite) {
      try {
        this.sprite.destroy();
      } catch (e) {
        // ignore already-destroyed
      }
      this.sprite = null;
    }
  }

  isBattery() {
    return this._isBattery;
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
    this.setSpeed(Math.abs(this.sprite.body.velocity.x) + increase);
  }

  setSpeed(speed) {
    this.sprite.setVelocityX(-speed);
  }
}
