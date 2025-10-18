export class Obstacle {
  constructor(x, y, type = null) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 60;
    this.type = type || this.randomType();
    this.image = new window.Image();
    let svg;
    if (this.type === "barrel") {
      svg = `<svg xmlns='http://www.w3.org/2000/svg' width='40' height='60' viewBox='0 0 40 60'>
        <ellipse cx='20' cy='30' rx='16' ry='26' fill='#bdbdbd' stroke='#607d8b' stroke-width='4'/>
        <rect x='8' y='10' width='24' height='40' rx='8' fill='#90a4ae' stroke='#455a64' stroke-width='2'/>
        <rect x='12' y='18' width='16' height='24' rx='4' fill='#fff' opacity='0.2'/>
        <rect x='8' y='48' width='24' height='6' rx='3' fill='#607d8b'/>
        <rect x='8' y='6' width='24' height='6' rx='3' fill='#607d8b'/>
      </svg>`;
    } else if (this.type === "box") {
      svg = `<svg xmlns='http://www.w3.org/2000/svg' width='40' height='60' viewBox='0 0 40 60'>
        <rect x='6' y='20' width='28' height='28' rx='6' fill='#ffe082' stroke='#ffb300' stroke-width='3'/>
        <rect x='12' y='26' width='16' height='16' rx='3' fill='#fff' opacity='0.2'/>
        <rect x='6' y='48' width='28' height='6' rx='3' fill='#ffb300'/>
      </svg>`;
    } else if (this.type === "pipe") {
      svg = `<svg xmlns='http://www.w3.org/2000/svg' width='40' height='60' viewBox='0 0 40 60'>
        <rect x='14' y='10' width='12' height='40' rx='6' fill='#90caf9' stroke='#1976d2' stroke-width='3'/>
        <rect x='10' y='48' width='20' height='8' rx='4' fill='#1976d2'/>
        <rect x='10' y='4' width='20' height='8' rx='4' fill='#1976d2'/>
      </svg>`;
    } else {
      svg = `<svg xmlns='http://www.w3.org/2000/svg' width='40' height='60'><rect x='0' y='0' width='40' height='60' fill='#c62828'/></svg>`;
    }
    const blob = new Blob([svg], { type: "image/svg+xml" });
    this.image.src = URL.createObjectURL(blob);
  }

  randomType() {
    const types = ["barrel", "box", "pipe"];
    return types[Math.floor(Math.random() * types.length)];
  }

  draw(ctx, scrollX) {
    const x = this.x - scrollX;
    if (this.image.complete) {
      ctx.drawImage(this.image, x, this.y, this.width, this.height);
    } else {
      ctx.fillStyle = "#607d8b";
      ctx.fillRect(x, this.y, this.width, this.height);
    }
  }
}
