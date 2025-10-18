export class InputHandler {
  constructor(player) {
    window.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        player.jump();
      }
    });
  }
}
