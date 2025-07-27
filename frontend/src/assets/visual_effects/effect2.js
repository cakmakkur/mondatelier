class FlowFieldEffect {
  #ctx;
  #width;
  #height;
  animationFrameId = null;
  shouldAnimate = true;

  constructor(ctx, width, height) {
    this.#ctx = ctx;
    this.#width = width;
    this.#height = height;
    this.#ctx.strokeStyle = "red";
    this.x = 200;
    this.y = 500;
    this.angle = 0;
    this.lasttTime = 0;
    this.interval = 1000 / 60;
    this.timer = 0;
    this.cellSize = 10;
    this.gradient;
    this.#createGradient();
    this.#ctx.strokeStyle = this.gradient;
    this.factor = 1;
    this.factor2 = 1;
    this.mainTimer = 0;
    this.increasing = false;
  }
  #createGradient() {
    this.gradient = this.#ctx.createLinearGradient(
      0,
      0,
      this.#width,
      this.#height
    );
    //the first 2 values are the starting points, thw last 2 are the ending points
    this.gradient.addColorStop("0.1", "#ff5c33");
    this.gradient.addColorStop("0.2", "#ff66b3");
    this.gradient.addColorStop("0.4", "#ccccff");
    this.gradient.addColorStop("0.6", "#b3ffff");
    this.gradient.addColorStop("0.8", "#80ff80");
    this.gradient.addColorStop("0.9", "#ffff33");

    //first value is offset 0-1 second is the color
  }
  #drawLine(angle, x, y) {
    this.#ctx.beginPath();
    this.#ctx.moveTo(x, y);
    this.#ctx.lineTo(x + Math.cos(angle) * 30, y + Math.sin(angle) * 30);
    this.#ctx.stroke();
  }
  animate(timeStamp) {
    const deltaTime = timeStamp - this.lasttTime;

    this.lasttTime = timeStamp;
    if (this.timer > this.interval) {
      this.#ctx.clearRect(0, 0, this.#width, this.#height);

      if (this.mainTimer < 6) {
        for (let y = 0; y < this.#height; y += this.cellSize) {
          for (let x = 0; x < this.#width; x += this.cellSize) {
            const angle =
              (Math.cos(x * 0.02) + Math.sin(y * 0.02)) * this.factor;
            this.#drawLine(angle, x, y);
          }
        }
        this.factor += 0.01;
        this.mainTimer += 0.01;
      } else if (this.mainTimer < 13) {
        for (let y = 0; y < this.#height; y += this.cellSize) {
          for (let x = 0; x < this.#width; x += this.cellSize) {
            const angle =
              (Math.cos(x * 0.02 * this.factor2) +
                Math.sin(y * 0.02 * this.factor2)) *
              this.factor;
            this.#drawLine(angle, x, y);
          }
        }
        this.factor -= 0.01;
        this.factor2 -= 0.0005;
        this.mainTimer += 0.01;
      } else {
        for (let y = 0; y < this.#height; y += this.cellSize) {
          for (let x = 0; x < this.#width; x += this.cellSize) {
            const angle =
              (Math.cos(x * 0.02) + Math.sin(y * 0.02)) * this.factor;
            this.#drawLine(angle, x, y);
          }
        }
        if (this.cellSize < 2) {
          this.increasing = true;
        } else if (this.cellSize > 15) {
          this.increasing = false;
        }
        if (!this.increasing) {
          this.cellSize -= 0.01;
        } else {
          this.cellSize += 0.01;
        }
        this.factor += 0.01;
        this.mainTimer += 0.01;
      }
      this.timer = 0;
    } else {
      this.timer += deltaTime;
    }
    this.shouldAnimate = true;
    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
  }

  stop() {
    this.shouldAnimate = false;
    cancelAnimationFrame(this.animationFrameId);
  }
}

export default FlowFieldEffect;
