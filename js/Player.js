/**
 * Clase Player - Responsable de la creación y control del jugador.
 * Mantiene la lógica mínima necesaria para controlar saltos y estado.
 */
class Player {
  constructor(scene, x, y) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, "robot-run-1");

    // Usar configuración desde constantes
    const config = CONSTANTS.PLAYER_CONFIG;
    this.sprite.setOrigin(config.ORIGIN.x, config.ORIGIN.y);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setDisplaySize(
      config.DISPLAY_SIZE.width,
      config.DISPLAY_SIZE.height
    );

    // Configurar hitbox usando las constantes
    this.sprite.body.setSize(config.HITBOX.width, config.HITBOX.height);
    this.sprite.body.setOffset(config.HITBOX.offsetX, config.HITBOX.offsetY);

    this.spawnPoint = { x, y };

    // Iniciar animación de correr
    this.sprite.play("robot-run");
  }

  /**
   * Intentar un salto cuando el jugador está en el suelo.
   */
  attemptJump() {
    if (this.isOnGround()) {
      this.sprite.setVelocityY(CONSTANTS.PLAYER_CONFIG.JUMP_VELOCITY);
      // Reproducir animación de salto
      this.sprite.play("robot-jump");
    }
  }

  /**
   * Reducir la altura del salto si se suelta la tecla pronto.
   */
  cutJump() {
    if (
      !this.isOnGround() &&
      this.sprite.body.velocity.y < CONSTANTS.PLAYER_CONFIG.CUT_JUMP_VELOCITY
    ) {
      this.sprite.setVelocityY(CONSTANTS.PLAYER_CONFIG.CUT_JUMP_VELOCITY);
    }
  }

  /**
   * Actualizar estado del jugador en cada frame.
   */
  update() {
    // Mantener el jugador sin velocidad horizontal (es un corredor infinito sin movimiento lateral)
    this.sprite.setVelocityX(0);

    // Cambiar entre animación de correr y saltar de forma más estable
    const isOnGround = this.isOnGround();
    const currentAnimKey = this.sprite.anims.currentAnim
      ? this.sprite.anims.currentAnim.key
      : null;

    if (isOnGround) {
      // Si está en el suelo y no está corriendo, cambiar a la animación de correr
      if (currentAnimKey !== "robot-run") {
        this.sprite.play("robot-run", true);
      }
    } else {
      // Si está en el aire y no está saltando, reproducir animación de salto
      if (currentAnimKey !== "robot-jump") {
        this.sprite.play("robot-jump", false); // No reiniciar si ya está reproduciéndose
      }
    }
  }

  /**
   * Comprobar si el jugador está tocando el suelo.
   */
  isOnGround() {
    const body = this.sprite.body;
    if (!body) return false;

    // Verificar múltiples condiciones para detección más robusta
    const blocked = body.blocked && body.blocked.down;
    const touching = body.touching && body.touching.down;
    const onFloor = typeof body.onFloor === "function" ? body.onFloor() : false;

    // También verificar si está muy cerca del suelo (tolerancia para pequeños errores de float)
    const groundLevel = CONSTANTS.GAME_POSITIONS.GROUND_Y;
    const nearGround = Math.abs(this.sprite.y + body.height - groundLevel) < 5;

    return blocked || touching || onFloor || nearGround;
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
    if (CONSTANTS.DEBUG) console.log("🔄 Player reset");

    // Resetear posición y física
    this.sprite.setPosition(this.spawnPoint.x, this.spawnPoint.y);
    this.sprite.setVelocity(0, 0);
    this.sprite.setAcceleration(0, 0);

    // Restaurar apariencia
    this.sprite.setTint(0xffffff);
    this.sprite.setAlpha(1);

    // Asegurar que el cuerpo físico también se resetea correctamente
    if (this.sprite.body) {
      this.sprite.body.reset(this.spawnPoint.x, this.spawnPoint.y);
      // Forzar la actualización del body después del reset
      this.sprite.body.updateFromGameObject();
    }

    // Reiniciar animación de correr
    this.sprite.play("robot-run");
    if (CONSTANTS.DEBUG) console.log("✅ Player reset complete");
  }

  /**
   * Detener movimiento (por ejemplo, al perder).
   */
  stop() {
    this.sprite.setVelocity(0, this.sprite.body.velocity.y);
    this.sprite.setTint(0x555555);
    // Pausar animación al morir
    this.sprite.anims.pause();
  }

  /**
   * Crear el sprite del jugador (método requerido por GameScene)
   */
  create() {
    // La creación ya se hace en el constructor, pero mantenemos este método por compatibilidad
    return this.sprite;
  }
}
