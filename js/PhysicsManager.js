/**
 * PhysicsManager.js - Responsable de gestionar la física y colisiones
 * Principio de responsabilidad única: Solo maneja física y colisiones
 */

class PhysicsManager {
  constructor(scene) {
    this.scene = scene;
    this.colliders = [];
    this.overlaps = [];
    this.groundGroup = null;
    this.groundSegments = [];
  }

  /**
   * Configura la física del mundo
   */
  setupWorldPhysics() {
    // Configurar gravedad
    this.scene.physics.world.gravity.y = CONSTANTS.PHYSICS_CONFIG.GRAVITY.y;

    // Configurar límites del mundo
    this.scene.physics.world.setBounds(
      0,
      0,
      CONSTANTS.GAME_CONFIG.WIDTH,
      CONSTANTS.GAME_CONFIG.HEIGHT,
      true,
      true,
      false,
      true
    );
  }

  /**
   * Crea el suelo con colisiones
   */
  createGround() {
    this.groundGroup = this.scene.physics.add.staticGroup();
    this.groundSegments = [];

    const totalWidth = CONSTANTS.VISUAL_EFFECTS.TOTAL_GROUND_WIDTH;
    const segmentWidth = CONSTANTS.VISUAL_EFFECTS.GROUND_SEGMENT_WIDTH;
    const segments = Math.ceil(totalWidth / segmentWidth);
    const startX = CONSTANTS.GAME_CONFIG.WIDTH / 2 - totalWidth / 2;

    for (let i = 0; i < segments; i++) {
      const x = startX + i * segmentWidth + segmentWidth / 2;
      const rect = this.scene.add.rectangle(
        x,
        CONSTANTS.VISUAL_EFFECTS.GROUND_COLLIDER_Y,
        segmentWidth,
        CONSTANTS.VISUAL_EFFECTS.GROUND_SEGMENT_HEIGHT,
        0xffffff,
        0
      );
      this.scene.physics.add.existing(rect, true);
      this.groundGroup.add(rect);
      this.groundSegments.push(rect);
    }
  }

  /**
   * Agrega una colisión entre dos objetos
   */
  addCollision(object1, object2, callback = null, context = null) {
    const collider = this.scene.physics.add.collider(
      object1,
      object2,
      callback,
      null,
      context
    );
    this.colliders.push(collider);
    return collider;
  }

  /**
   * Agrega un overlap entre dos objetos
   */
  addOverlap(object1, object2, callback = null, context = null) {
    const overlap = this.scene.physics.add.overlap(
      object1,
      object2,
      callback,
      null,
      context
    );
    this.overlaps.push(overlap);
    return overlap;
  }

  /**
   * Remueve un collider específico
   */
  removeCollider(collider) {
    if (collider && collider.destroy) {
      collider.destroy();
    }
    const index = this.colliders.indexOf(collider);
    if (index > -1) {
      this.colliders.splice(index, 1);
    }
  }

  /**
   * Remueve un overlap específico
   */
  removeOverlap(overlap) {
    if (overlap && overlap.destroy) {
      overlap.destroy();
    }
    const index = this.overlaps.indexOf(overlap);
    if (index > -1) {
      this.overlaps.splice(index, 1);
    }
  }

  /**
   * Remueve todos los colliders y overlaps
   */
  clearAllInteractions() {
    // Limpiar colliders
    this.colliders.forEach((collider) => {
      if (collider && collider.destroy) {
        collider.destroy();
      }
    });
    this.colliders = [];

    // Limpiar overlaps
    this.overlaps.forEach((overlap) => {
      if (overlap && overlap.destroy) {
        overlap.destroy();
      }
    });
    this.overlaps = [];
  }

  /**
   * Pausa la física
   */
  pausePhysics() {
    this.scene.physics.pause();
  }

  /**
   * Reanuda la física
   */
  resumePhysics() {
    this.scene.physics.resume();
  }

  /**
   * Verifica si la física está pausada
   */
  isPhysicsPaused() {
    return this.scene.physics.isPaused;
  }

  /**
   * Obtiene la velocidad de un objeto
   */
  getVelocity(object) {
    return {
      x: object.body ? object.body.velocity.x : 0,
      y: object.body ? object.body.velocity.y : 0,
    };
  }

  /**
   * Establece la velocidad de un objeto
   */
  setVelocity(object, x, y) {
    if (object.body) {
      object.body.setVelocity(x, y);
    }
  }

  /**
   * Hace que un objeto sea inmóvil
   */
  setImmovable(object, immovable = true) {
    if (object.body) {
      object.body.setImmovable(immovable);
    }
  }

  /**
   * Verifica si dos objetos están colisionando
   */
  isColliding(object1, object2) {
    if (!object1.body || !object2.body) return false;

    return Phaser.Geom.Intersects.RectangleToRectangle(
      object1.getBounds(),
      object2.getBounds()
    );
  }

  /**
   * Obtiene la distancia entre dos objetos
   */
  getDistance(object1, object2) {
    return Phaser.Math.Distance.Between(
      object1.x,
      object1.y,
      object2.x,
      object2.y
    );
  }

  /**
   * Verifica si un objeto está en el suelo
   */
  isOnGround(object) {
    if (!object.body) return false;
    const body = object.body;
    return body.blocked.down || body.touching.down;
  }

  /**
   * Obtiene el grupo de suelo
   */
  getGroundGroup() {
    return this.groundGroup;
  }

  /**
   * Destruye el manager y limpia recursos
   */
  destroy() {
    this.clearAllInteractions();

    if (this.groundGroup) {
      this.groundGroup.clear(true, true);
      this.groundGroup = null;
    }

    this.groundSegments = [];
  }
}
