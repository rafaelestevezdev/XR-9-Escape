const GROUND_Y = 520;

const OBSTACLE_CONFIG = {
  crate: {
    texture: "obstacle_crate",
    originY: 1,
    display: { width: 36, height: 40 },
    hitbox: { width: 30, height: 34, offsetX: 0, offsetY: 4 },
    minGap: 200,
  },
  hammer: {
    texture: "obstacle_hammer",
    originY: 1,
    display: { width: 28, height: 44 },
    hitbox: { width: 22, height: 38, offsetX: 0, offsetY: 4 },
    minGap: 190,
  },
  tank: {
    texture: "obstacle_tank",
    originY: 1,
    display: { width: 40, height: 52 },
    hitbox: { width: 34, height: 46, offsetX: 0, offsetY: 4 },
    minGap: 220,
  },
  gear: {
    texture: "obstacle_gear",
    originY: 0.5,
    display: { width: 38, height: 38 },
    hitbox: { width: 32, height: 32, offsetX: 0, offsetY: 0 },
    minGap: 210,
    rotating: true,
    rotSpeed: 120,
  },
  battery: {
    texture: "collectible_battery",
    originY: 1,
    display: { width: 24, height: 28 },
    hitbox: { width: 20, height: 24, offsetX: 0, offsetY: 2 },
    minGap: 180,
    collectible: true,
    yOffset: -60,
    bobAmplitude: 6,
    bobSpeed: 3.5,
    isBattery: true,
  },
};

/**
 * Clase Obstacle - Responsable de la creación de obstáculos individuales
 * Principio de responsabilidad única: Solo gestiona un obstáculo
 */
class Obstacle {
  constructor(scene, group, spawnX, type, speed) {
    this.scene = scene;
    this.type = type;
    const config = this.resolveConfig(this.getConfig(type));
    const spawnY = GROUND_Y + (config.yOffset || 0);
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
    this.points = config.points || 0;

    // Expose data for collision handling
    this.sprite.setData("type", type);
    this.sprite.setData("collectible", this.collectible);
    this.sprite.setData("pit", !!config.pit);
    this.sprite.setData("ref", this);

    this.minGap = config.minGap;
    this._destroyed = false;
    this._elapsed = 0;
    this.setSpeed(speed);
  }

  getConfig(type) {
    return OBSTACLE_CONFIG[type] || OBSTACLE_CONFIG.crate;
  }

  resolveConfig(config) {
    if (!config) {
      return {};
    }
    // Ya no usamos variants, devolvemos la config directamente
    return {
      ...config,
      display: { ...(config.display || {}) },
      hitbox: { ...(config.hitbox || {}) },
    };
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

  collect() {
    if (!this.collectible) return 0;
    const pts = this.points || 0;
    this.destroy();
    return pts;
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
