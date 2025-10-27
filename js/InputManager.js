/**
 * InputManager.js - Responsable de gestionar todas las entradas del usuario
 * Principio de responsabilidad única: Solo maneja input de teclado y touch
 */

class InputManager {
  constructor(scene) {
    this.scene = scene;
    this.cursors = null;
    this.spaceKey = null;
    this.pauseKey = null;
    this.restartKey = null;

    // Callbacks para eventos
    this.onJumpCallback = null;
    this.onCutJumpCallback = null;
    this.onPauseCallback = null;
    this.onRestartCallback = null;
    this.onStartCallback = null;
  }

  /**
   * Inicializa el sistema de input
   */
  initialize() {
    // Crear cursores
    this.cursors = this.scene.input.keyboard.createCursorKeys();

    // Crear teclas específicas
    this.spaceKey = this.scene.input.keyboard.addKey(
      CONSTANTS.CONTROLS.JUMP_KEYS[0]
    );
    this.pauseKey = this.scene.input.keyboard.addKey(
      CONSTANTS.CONTROLS.PAUSE_KEY
    );
    this.restartKey = this.scene.input.keyboard.addKey(
      CONSTANTS.CONTROLS.RESTART_KEY
    );

    // Configurar eventos de teclado
    this.setupKeyboardEvents();

    // Configurar eventos de touch
    this.setupTouchEvents();

    // Configurar eventos táctiles nativos adicionales para mejor rendimiento
    this.setupNativeTouchEvents();
  }

  /**
   * Configura los eventos de teclado
   */
  setupKeyboardEvents() {
    // Evento para saltar
    this.scene.input.keyboard.on("keydown-SPACE", () => {
      if (this.onJumpCallback) {
        this.onJumpCallback();
      }
    });

    this.scene.input.keyboard.on("keydown-UP", () => {
      if (this.onJumpCallback) {
        this.onJumpCallback();
      }
    });

    // Evento para cortar el salto
    this.scene.input.keyboard.on("keyup-SPACE", () => {
      if (this.onCutJumpCallback) {
        this.onCutJumpCallback();
      }
    });

    this.scene.input.keyboard.on("keyup-UP", () => {
      if (this.onCutJumpCallback) {
        this.onCutJumpCallback();
      }
    });

    // Evento para pausar
    this.scene.input.keyboard.on("keydown-P", () => {
      if (this.onPauseCallback) {
        this.onPauseCallback();
      }
    });

    // Evento para reiniciar
    this.scene.input.keyboard.on("keydown-R", () => {
      if (this.onRestartCallback) {
        this.onRestartCallback();
      }
    });
  }

  /**
   * Configura los eventos de touch/puntero
   */
  setupTouchEvents() {
    // Configurar para capturar eventos táctiles sin delay
    this.scene.input.setPollAlways();

    // Un único listener optimizado para pointerdown
    this.scene.input.on("pointerdown", (pointer) => {
      // Prevenir comportamiento por defecto del navegador (puede ayudar con el delay)
      if (pointer.event) {
        pointer.event.preventDefault();
      }

      // Llamar ambos callbacks (start y jump) desde el mismo evento
      if (this.onStartCallback) {
        this.onStartCallback();
      }
      if (this.onJumpCallback) {
        this.onJumpCallback();
      }
    });

    // También escuchar el evento táctil nativo para respuesta más rápida
    this.scene.input.addPointer(1); // Asegurar que hay al menos 1 puntero activo
  }

  /**
   * Actualiza el estado del input
   */
  update() {
    // El input se maneja principalmente por eventos, pero aquí podríamos
    // agregar lógica adicional si fuera necesaria
  }

  /**
   * Verifica si una tecla de salto está presionada
   */
  isJumpKeyDown() {
    return this.spaceKey.isDown || (this.cursors && this.cursors.up.isDown);
  }

  /**
   * Verifica si una tecla de salto fue soltada
   */
  isJumpKeyUp() {
    return this.spaceKey.isUp || (this.cursors && this.cursors.up.isUp);
  }

  /**
   * Verifica si la tecla de pausa está presionada
   */
  isPauseKeyDown() {
    return this.pauseKey && this.pauseKey.isDown;
  }

  /**
   * Verifica si la tecla de reinicio está presionada
   */
  isRestartKeyDown() {
    return this.restartKey && this.restartKey.isDown;
  }

  /**
   * Registra callback para evento de salto
   */
  onJump(callback) {
    this.onJumpCallback = callback;
  }

  /**
   * Registra callback para evento de cortar salto
   */
  onCutJump(callback) {
    this.onCutJumpCallback = callback;
  }

  /**
   * Registra callback para evento de pausa
   */
  onPause(callback) {
    this.onPauseCallback = callback;
  }

  /**
   * Registra callback para evento de reinicio
   */
  onRestart(callback) {
    this.onRestartCallback = callback;
  }

  /**
   * Registra callback para evento de inicio
   */
  onStart(callback) {
    this.onStartCallback = callback;
  }

  /**
   * Habilita el input
   */
  enable() {
    this.scene.input.enabled = true;
  }

  /**
   * Deshabilita el input
   */
  disable() {
    this.scene.input.enabled = false;
  }

  /**
   * Verifica si el input está habilitado
   */
  isEnabled() {
    return this.scene.input.enabled;
  }

  /**
   * Obtiene la posición del puntero
   */
  getPointerPosition() {
    return {
      x: this.scene.input.activePointer.x,
      y: this.scene.input.activePointer.y,
    };
  }

  /**
   * Verifica si el puntero está presionado
   */
  isPointerDown() {
    return this.scene.input.activePointer.isDown;
  }

  /**
   * Configura eventos táctiles nativos del navegador para mejor rendimiento
   */
  setupNativeTouchEvents() {
    const canvas = this.scene.game.canvas;

    // Evento touchstart nativo (más rápido que pointerdown en móviles)
    this.nativeTouchHandler = (e) => {
      e.preventDefault(); // Prevenir delay de 300ms del navegador

      // Llamar ambos callbacks
      if (this.onStartCallback) {
        this.onStartCallback();
      }
      if (this.onJumpCallback) {
        this.onJumpCallback();
      }
    };

    canvas.addEventListener("touchstart", this.nativeTouchHandler, {
      passive: false,
    });

    // Guardar referencia para limpieza posterior
    this.canvas = canvas;
  }

  /**
   * Destruye el manager y limpia eventos
   */
  destroy() {
    // Limpiar evento táctil nativo
    if (this.canvas && this.nativeTouchHandler) {
      this.canvas.removeEventListener("touchstart", this.nativeTouchHandler);
      this.canvas = null;
      this.nativeTouchHandler = null;
    }

    if (this.spaceKey) {
      this.spaceKey.destroy();
    }
    if (this.pauseKey) {
      this.pauseKey.destroy();
    }
    if (this.restartKey) {
      this.restartKey.destroy();
    }

    // Limpiar referencias a callbacks
    this.onJumpCallback = null;
    this.onCutJumpCallback = null;
    this.onPauseCallback = null;
    this.onRestartCallback = null;
    this.onStartCallback = null;
  }
}
