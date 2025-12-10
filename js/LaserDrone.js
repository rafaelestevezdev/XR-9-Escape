/**
 * LaserDrone - Dron que entra desde la derecha, se posiciona y dispara rayos a ras del suelo
 */
class LaserDrone {
  constructor(scene, player, laserGroup, sfxLaserShoot) {
    this.scene = scene;
    this.player = player;
    this.laserGroup = laserGroup;
    this.sfxLaserShoot = sfxLaserShoot;

    this.state = "entering"; // entering -> firing -> leaving
    this.enterX = CONSTANTS.GAME_CONFIG.WIDTH + 60;
    this.targetX = CONSTANTS.GAME_CONFIG.WIDTH - 260;
    // Posicionar a la altura del jugador para mejor visibilidad
    this.baseY = CONSTANTS.GAME_POSITIONS.GROUND_Y - 40; // casi a la altura del jugador
    this.bobAmp = 6;
    this.bobSpeed = 2.2;

    this.sprite = scene.physics.add.sprite(
      this.enterX,
      this.baseY,
      this._ensureDroneTexture()
    );
    this.sprite.setDepth(15);
    this.sprite.setImmovable(true);
    this.sprite.body.allowGravity = false;

    this.fireCount = 0;
    this.maxFires = 1;
    this.fireInterval = 420; // ms (no se usa cuando solo hay un disparo, pero se deja por si se ajusta en el futuro)
    this.nextFireTime = 0;
    this.laserSpeed = 240; // velocidad base del proyectil (más lenta para permitir reacción)

    // sonido opcional futuro
  }

  _ensureDroneTexture() {
    const key = "drone_turret_min";
    if (this.scene.textures.exists(key)) return key;
    const g = this.scene.make.graphics({ x: 0, y: 0, add: false });
    const W = 72,
      H = 42;

    // Cuerpo principal metálico
    g.fillStyle(CONSTANTS.COLORS.METAL_DARK, 1);
    g.fillRoundedRect(2, 4, W - 4, H - 8, 4);

    g.fillStyle(CONSTANTS.COLORS.METAL_BASE, 1);
    g.fillRoundedRect(4, 6, W - 8, H - 12, 3);

    // Panel central con luces
    g.fillStyle(CONSTANTS.COLORS.METAL_MID, 1);
    g.fillRect(12, 10, 22, 20);

    // "Ojo" o sensor del dron
    g.fillStyle(CONSTANTS.COLORS.METAL_DARK, 1);
    g.fillCircle(23, 20, 7);
    g.fillStyle(CONSTANTS.COLORS.LIGHT_CYAN, 1);
    g.fillCircle(23, 20, 5);
    g.fillStyle(CONSTANTS.COLORS.LIGHT_CYAN_SOFT, 1);
    g.fillCircle(24, 19, 3);

    // Cañón más robusto
    g.fillStyle(CONSTANTS.COLORS.METAL_HIGHLIGHT, 1);
    g.fillRect(50, 14, 20, 12);
    g.fillStyle(CONSTANTS.COLORS.METAL_LIGHT, 1);
    g.fillRect(52, 16, 16, 8);

    // Boca del cañón
    g.fillStyle(CONSTANTS.COLORS.METAL_DARK, 1);
    g.fillCircle(68, 20, 3);

    // Franja de advertencia
    g.fillStyle(CONSTANTS.COLORS.HAZARD_YELLOW, 1);
    g.fillRect(8, H - 8, 16, 4);
    g.fillStyle(CONSTANTS.COLORS.HAZARD_BLACK, 1);
    for (let x = 8; x < 24; x += 4) {
      g.fillRect(x, H - 8, 2, 4);
    }

    // Remaches decorativos
    g.fillStyle(CONSTANTS.COLORS.GROUND_LIGHT, 0.8);
    [10, 20, 30, 40].forEach((x) => {
      g.fillRect(x, 8, 2, 2);
      g.fillRect(x, H - 10, 2, 2);
    });

    g.generateTexture(key, W, H);
    g.destroy();
    return key;
  }

  _ensureLaserTexture() {
    const key = "laser_beam_min";
    if (this.scene.textures.exists(key)) return key;
    const g = this.scene.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(CONSTANTS.COLORS.LIGHT_CYAN, 1);
    g.fillRect(0, 0, 28, 6);
    g.fillStyle(CONSTANTS.COLORS.LIGHT_CYAN_SOFT, 1);
    g.fillRect(2, 1, 24, 4);
    g.generateTexture(key, 28, 6);
    g.destroy();
    return key;
  }

  _ensureMuzzleTexture() {
    const key = "muzzle_flash_min";
    if (this.scene.textures.exists(key)) return key;
    const g = this.scene.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0xfff1a1, 1);
    g.fillCircle(8, 8, 8);
    g.fillStyle(0xffc300, 1);
    g.fillCircle(8, 8, 5);
    g.fillStyle(0xffffff, 0.9);
    g.fillCircle(8, 8, 3);
    g.generateTexture(key, 16, 16);
    g.destroy();
    return key;
  }

  update(time, gameSpeed, dt) {
    if (!this.sprite) return false;

    if (this.state === "entering") {
      // moverse hasta targetX
      const dx = this.targetX - this.sprite.x;
      const step = Math.sign(dx) * 420 * dt;
      if (Math.abs(dx) <= Math.abs(step)) {
        this.sprite.x = this.targetX;
        this.state = "firing";
        this.nextFireTime = time + 900; // pausa más larga para permitir reacción
      } else {
        this.sprite.x += step;
      }
    } else if (this.state === "firing") {
      if (time >= this.nextFireTime) {
        this._fireLaser(gameSpeed);
        this.fireCount += 1;
        if (this.fireCount >= this.maxFires) {
          this.state = "leaving";
        } else {
          this.nextFireTime = time + this.fireInterval;
        }
      }
    } else if (this.state === "leaving") {
      // salir hacia la derecha
      this.sprite.x += 520 * dt;
      if (this.sprite.x > CONSTANTS.GAME_CONFIG.WIDTH + 100) {
        this.destroy();
        return true; // finished
      }
    }

    // arrastrar al dron por el scroll del mundo ligeramente para consistencia visual
    if (this.state !== "entering") {
      this.sprite.x -= gameSpeed * dt * 0.2;
    }

    // bob vertical suave para dar vida
    const t = this.scene.time.now / 1000;
    this.sprite.y = this.baseY + Math.sin(t * this.bobSpeed) * this.bobAmp;

    return false;
  }

  _fireLaser(gameSpeed) {
    if (!this.player || !this.player.getSprite) return;
    const playerSprite = this.player.getSprite();
    if (!playerSprite) return;

    const key = this._ensureLaserTexture();
    const projectileSpeed = gameSpeed + this.laserSpeed;
    const muzzleX = this.sprite.x - 58;
    const muzzleY = this.sprite.y;
    const targetX = playerSprite.x;
    const targetY = playerSprite.y - playerSprite.displayHeight * 0.3;

    // Direccion hacia el jugador
    const dirX = targetX - muzzleX;
    const dirY = targetY - muzzleY;
    const direction = new Phaser.Math.Vector2(dirX, dirY);
    if (direction.lengthSq() === 0) direction.set(-1, 0);
    if (direction.x >= -0.1) direction.x = -0.1; // asegurar componente hacia la izquierda
    direction.normalize();

    const velocityX = direction.x * this.laserSpeed;
    const velocityY = direction.y * this.laserSpeed;

    const laser = this.scene.physics.add.sprite(muzzleX, muzzleY, key);
    laser.setOrigin(0.5, 0.5);
    laser.setDepth(12);
    laser.body.allowGravity = false;
    laser.body.setVelocity(0, 0);
    laser.setRotation(Math.atan2(velocityY, velocityX));

    laser.setData("vx", velocityX);
    laser.setData("vy", velocityY);

    laser.setData("type", "laser");
    this.laserGroup.add(laser);

    // Reproducir sonido de disparo láser
    if (this.sfxLaserShoot) {
      this.sfxLaserShoot.play();
    }

    // animación de disparo: destello y vibración del proyectil
    laser.setScale(1.1, 0.8);
    this.scene.tweens.add({
      targets: laser,
      scaleY: { from: 0.8, to: 1.35 },
      scaleX: { from: 1.1, to: 0.95 },
      duration: 90,
      yoyo: true,
      repeat: 2,
      ease: "Sine.easeInOut",
    });
    this.scene.tweens.add({
      targets: laser,
      alpha: { from: 1, to: 0.55 },
      duration: 140,
      yoyo: true,
      repeat: 2,
      ease: "Sine.easeInOut",
    });

    // fogonazo de boca (muzzle flash)
    const flashKey = this._ensureMuzzleTexture();
    const flash = this.scene.add.image(muzzleX, muzzleY, flashKey).setDepth(16);
    flash.setScale(0.7);
    flash.setRotation(laser.rotation);
    this.scene.tweens.add({
      targets: flash,
      alpha: { from: 1, to: 0 },
      scale: { from: 0.8, to: 1.4 },
      duration: 120,
      onComplete: () => {
        try {
          flash.destroy();
        } catch (e) {}
      },
    });

    // pequeño retroceso del dron
    this.scene.tweens.add({
      targets: this.sprite,
      x: this.sprite.x - 6,
      duration: 60,
      yoyo: true,
      ease: "Quad.easeOut",
    });

    // autodestruir al salir de pantalla
    this.scene.time.delayedCall(4000, () => {
      if (laser && laser.destroy) laser.destroy();
    });
  }

  destroy() {
    if (this.sprite) {
      try {
        this.sprite.destroy();
      } catch (e) {}
    }
    this.sprite = null;
  }
}
