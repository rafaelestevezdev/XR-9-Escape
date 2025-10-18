export class Piece {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 32;
    this.height = 32;
    this.collected = false;
    // SVG batería tecnológica
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'>
      <rect x='6' y='8' width='20' height='16' rx='4' fill='#ffd600' stroke='#222' stroke-width='2'/>
      <rect x='12' y='4' width='8' height='6' rx='2' fill='#90caf9' stroke='#1976d2' stroke-width='2'/>
      <rect x='10' y='12' width='12' height='8' rx='2' fill='#fff' opacity='0.3'/>
      <rect x='6' y='24' width='20' height='2' rx='1' fill='#1976d2'/>
    </svg>`;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    this.image = new window.Image();
    this.image.src = URL.createObjectURL(blob);
  }

  draw(ctx, scrollX) {
    if (this.collected) return;
    const x = this.x - scrollX;
    if (this.image.complete) {
      // Agregar brillo
      ctx.shadowColor = "#ffd600";
      ctx.shadowBlur = 10;
      ctx.drawImage(this.image, x, this.y, this.width, this.height);
      ctx.shadowBlur = 0; // reset
    } else {
      ctx.fillStyle = "#ffd600";
      ctx.fillRect(x, this.y, this.width, this.height);
    }
  }
}
