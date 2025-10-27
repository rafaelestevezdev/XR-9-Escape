/**
 * Clase Player - Responsable de la creación y control del jugador.
 * Mantiene la lógica mínima necesaria para controlar saltos y estado.
 */
class Player {
  constructor(scene, x, y) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, "player_robot");
    this.sprite.setOrigin(0.5, 1);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setDisplaySize(32, 32);
    this.sprite.body.setSize(24, 30);
    this.sprite.body.setOffset(4, 2);

    this.spawnPoint = { x, y };
  }

  /**
   * Intentar un salto cuando el jugador está en el suelo.
   */
  attemptJump() {
    if (this.isOnGround()) {
      this.sprite.setVelocityY(-360);
    }
  }

  /**
   * Reducir la altura del salto si se suelta la tecla pronto.
   */
  cutJump() {
    if (!this.isOnGround() && this.sprite.body.velocity.y < -140) {
      this.sprite.setVelocityY(-140);
    }
  }

  /**
   * Actualizar estado del jugador en cada frame.
   */
  update() {
    this.sprite.setVelocityX(0);
  }

  /**
   * Comprobar si el jugador está tocando el suelo.
   */
  isOnGround() {
    const body = this.sprite.body;
    const onFloor = typeof body.onFloor === "function" ? body.onFloor() : false;
    return body.blocked.down || body.touching.down || onFloor;
  }

  /**
   * Obtener el sprite del jugador.
   */
  getSprite() {
    return this.sprite;
  }

  /**
   * Volver a la posición inicial y limpiar estado visual.
   */
  reset() {
    console.log("🔄 Player reset");
    this.sprite.setPosition(this.spawnPoint.x, this.spawnPoint.y);
    this.sprite.setVelocity(0, 0);
    this.sprite.setAcceleration(0, 0);
    this.sprite.setTint(0xffffff);
    this.sprite.setAlpha(1);
    // Asegurar que el cuerpo físico también se resetea
    if (this.sprite.body) {
      this.sprite.body.reset(this.spawnPoint.x, this.spawnPoint.y);
    }
    console.log("✅ Player reset complete");
  }

  /**
   * Detener movimiento (por ejemplo, al perder).
   */
  stop() {
    this.sprite.setVelocity(0, this.sprite.body.velocity.y);
    this.sprite.setTint(0x555555);
  }

  /**
   * Crear el sprite del jugador (método requerido por GameScene)
   */
  create() {
    // La creación ya se hace en el constructor, pero mantenemos este método por compatibilidad
    return this.sprite;
  }
}
