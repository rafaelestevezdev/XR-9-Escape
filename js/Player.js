export class Player {
  constructor(x, y, canvasHeight) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 60;
    this.velocityY = 0;
    this.gravity = 1.5;
    this.jumpStrength = -22;
    this.grounded = false;
    this.canvasHeight = canvasHeight;
    this.speed = 4;

    // SVG robot arcade
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='40' height='60' viewBox='0 0 40 60'>
      <rect x='8' y='18' width='24' height='28' rx='6' fill='#90caf9' stroke='#1976d2' stroke-width='2'/>
      <rect x='14' y='8' width='12' height='12' rx='4' fill='#1976d2' stroke='#222' stroke-width='2'/>
      <rect x='10' y='46' width='6' height='12' rx='2' fill='#1976d2'/>
      <rect x='24' y='46' width='6' height='12' rx='2' fill='#1976d2'/>
      <circle cx='20' cy='14' r='2.5' fill='#fff'/>
      <rect x='6' y='28' width='4' height='14' rx='2' fill='#1976d2'/>
      <rect x='30' y='28' width='4' height='14' rx='2' fill='#1976d2'/>
      <rect x='16' y='24' width='8' height='8' rx='2' fill='#fff'/>
      <rect x='18' y='34' width='4' height='8' rx='1' fill='#1976d2'/>
    </svg>`;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    this.image = new window.Image();
    this.image.src = URL.createObjectURL(blob);
  }

  draw(ctx) {
    if (this.image.complete) {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    } else {
      ctx.fillStyle = "#1976d2";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  update() {
    if (!this.grounded) {
      this.velocityY += this.gravity;
      this.y += this.velocityY;
    }
    if (this.y + this.height >= this.canvasHeight - 40) {
      this.y = this.canvasHeight - 40 - this.height;
      this.velocityY = 0;
      this.grounded = true;
    } else {
      this.grounded = false;
    }
  }

  jump() {
    if (this.grounded) {
      this.velocityY = this.jumpStrength;
      this.grounded = false;
    }
  }
}
