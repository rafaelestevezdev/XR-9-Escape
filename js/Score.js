export class Score {
  constructor() {
    this.meters = 0;
  }

  update(scrollX) {
    this.meters = Math.floor(scrollX);
  }

  draw(ctx, canvas) {
    ctx.save();
    ctx.font = "bold 28px Arial";
    ctx.fillStyle = "#222";
    ctx.textAlign = "right";
    ctx.fillText(`${this.meters} m`, canvas.width - 30, 40);
    ctx.restore();
  }
}
