/**
 * PreloadScene.js - Escena de carga con barra de progreso
 * Responsabilidad: Cargar todos los assets y mostrar feedback visual
 */

class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: "PreloadScene" });
  }

  preload() {
    // 1. Configurar UI de carga
    this.createLoadingUI();

    // 2. Cargar assets
    this.loadAssets();
  }

  createLoadingUI() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Fondo oscuro
    this.add.rectangle(0, 0, width, height, 0x080910).setOrigin(0);

    // Texto de "INITIALIZING"
    const loadingText = this.add
      .text(centerX, centerY - 50, "INITIALIZING SYSTEM...", {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: "18px",
        fill: "#4fa2ff",
      })
      .setOrigin(0.5);

    // Contenedor de la barra
    const barWidth = 300;
    const barHeight = 20;
    const barX = centerX - barWidth / 2;
    const barY = centerY;

    // Borde de la barra
    const border = this.add.graphics();
    border.lineStyle(2, 0x2e76b3);
    border.strokeRect(barX, barY, barWidth, barHeight);

    // Barra de progreso
    const progressBar = this.add.graphics();

    // Texto de porcentaje
    const percentText = this.add
      .text(centerX, centerY + 40, "0%", {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: "14px",
        fill: "#8bc4ff",
      })
      .setOrigin(0.5);

    // Texto de assets
    const assetText = this.add
      .text(centerX, height - 20, "", {
        fontFamily: "monospace",
        fontSize: "10px",
        fill: "#5a7488",
      })
      .setOrigin(0.5);

    // Eventos de carga
    this.load.on("progress", (value) => {
      progressBar.clear();
      progressBar.fillStyle(0x41ffd9, 1);
      progressBar.fillRect(
        barX + 2,
        barY + 2,
        (barWidth - 4) * value,
        barHeight - 4
      );

      percentText.setText(parseInt(value * 100) + "%");
    });

    this.load.on("fileprogress", (file) => {
      assetText.setText("LOADING: " + file.key);
    });

    this.load.on("complete", () => {
      progressBar.destroy();
      border.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();

      // Animación de finalización
      const completeText = this.add
        .text(centerX, centerY, "SYSTEM READY", {
          fontFamily: '"Press Start 2P", monospace',
          fontSize: "24px",
          fill: "#41ffd9",
        })
        .setOrigin(0.5);

      this.tweens.add({
        targets: completeText,
        alpha: 0,
        duration: 500,
        delay: 500,
        onComplete: () => {
          this.scene.start("EscenaIndustrial");
          this.scene.launch("GameScene");
        },
      });
    });
  }

  loadAssets() {
    // --- Sprites del Robot ---
    // Corriendo
    for (let i = 1; i <= 10; i++) {
      this.load.image(
        `robot-run-${i}`,
        `assets/sprites-robot/robot-run/player-run-${i}.png`
      );
    }
    // Saltando
    for (let i = 1; i <= 6; i++) {
      this.load.image(
        `robot-jump-${i}`,
        `assets/sprites-robot/robot-jump/player-jump-${i}.png`
      );
    }

    // --- Audio ---
    this.load.audio(CONSTANTS.AUDIO.BGM_MAIN, ["assets/music/musica.ogg"]);
    this.load.audio(CONSTANTS.AUDIO.SFX_PICKUP, [
      "assets/sound/objetc-sound.wav",
    ]);
    this.load.audio(CONSTANTS.AUDIO.SFX_GAMEOVER, [
      "assets/sound/sonido_pierde.mp3",
    ]);
    this.load.audio(CONSTANTS.AUDIO.SFX_JUMP, ["assets/sound/Jump_sound.mp3"]);
    this.load.audio(CONSTANTS.AUDIO.SFX_LASER_SHOOT, [
      "assets/sound/Shoot.wav",
    ]);

    // Nota: Las texturas procedurales se generan en GameScene o TextureGenerator,
    // pero podríamos mover esa lógica aquí si fuera necesario.
    // Por ahora, TextureGenerator se encarga en el init de GameScene.
  }
}
