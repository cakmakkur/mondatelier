class Particle {
  constructor(effect, x, y, color) {
    this.effect = effect;
    this.circleArea = this.effect.circleArea;

    // color interpolation
    this.b = 255;
    this.target_b = 195;
    this.change_speed = 0.001;

    const randomIndex = Math.floor(Math.random() * this.circleArea.length);

    this.x = this.circleArea[randomIndex].x;
    this.y = this.circleArea[randomIndex].y;

    this.originX = x;
    this.originY = y;
    this.color = color;
    this.pixelSize = this.effect.grid_size;

    this.ease = Math.random() * 0.001 + 0.005;
  }

  draw() {
    this.effect.ctx.fillStyle = this.color;
    this.effect.ctx.fillRect(
      Math.floor(this.x),
      Math.floor(this.y),
      this.pixelSize,
      this.pixelSize
    );
  }

  update() {
    const f = Math.abs(this.x - this.originX) / this.effect.width + 0.7;
    this.b += (this.target_b - this.b) * this.change_speed;
    this.color = `rgba(255, 255, ${this.b}, 225)`;
    this.x += (this.originX - this.x) * Math.pow(this.ease, f);
    this.y += (this.originY - this.y) * Math.pow(this.ease, f);
  }
}

class Effect {
  ctx;
  width;
  height;
  pixels = [];
  grid_size = 1;
  circleArea = [];
  particles = [];

  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.fillStyle = "white";
    this.defineCircleArea();
    this.writeText();
    this.convertToParticles();
  }

  defineCircleArea() {
    const centerX = this.width / 1.52;
    const centerY = this.height / 2;
    const radius = 180;
    const pointDensity = 1;

    for (let r = 0; r < radius; r += this.grid_size) {
      for (let angle = 0; angle < 360; angle += pointDensity) {
        const radian = (Math.PI / 180) * angle;
        const x = centerX + r * Math.cos(radian);
        const y = centerY + r * Math.sin(radian);
        this.circleArea.push({ x, y });
      }
    }
  }

  writeText() {
    const text = "Mondatelier";
    this.ctx.font = "bold 90px Papyrus";
    this.ctx.fillStyle = this.fillStyle;
    this.ctx.fillText(text, 120, 400);
  }

  convertToParticles() {
    const pixelData = this.ctx.getImageData(0, 0, this.width, this.height).data;
    this.ctx.clearRect(0, 0, this.width, this.height);
    for (let y = 0; y < this.height; y += this.grid_size) {
      for (let x = 0; x < this.width; x += this.grid_size) {
        const index = (y * this.width + x) * 4;
        const alpha = pixelData[index + 3];

        if (alpha !== 0) {
          const r = pixelData[index];
          const g = pixelData[index + 1];
          const b = pixelData[index + 2];
          const a = pixelData[index + 3];
          const color = `rgb(${r}, ${g}, ${b}, ${a})`;
          this.particles.push(new Particle(this, x, y, color));
        }
      }
    }
  }

  render() {
    this.particles.forEach((particle) => {
      particle.update();
      particle.draw();
    });
  }
}

export default Effect;
