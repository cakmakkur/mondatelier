class FlowFieldEffect {
  #ctx;
  #width;
  #height;
  animationFrameId = null;

  constructor(ctx, width, height) {
    this.#ctx = ctx;
    this.#width = width;
    this.#height = height;
    this.#ctx.strokeStyle = "white";
    this.angle = 0;
    this.lasttTime = 0;
    this.interval = 1000 / 20;
    this.factor = 0.0000005;
    this.timer = 0;
    this.cellSize = 15;
    this.gradient;
    this.#createGradient();
    this.#ctx.strokeStyle = this.gradient;
  }
  #createGradient() {
    this.gradient = this.#ctx.createLinearGradient(
      0,
      0,
      this.#width,
      this.#height
    );
    //the first 2 values are the starting points, the last 2 are the ending points
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
    this.#ctx.lineTo(x + Math.tan(angle), y + angle);
    this.#ctx.stroke();
  }
  animate(timeStamp) {
    const deltaTime = timeStamp - this.lasttTime;
    this.lasttTime = timeStamp;

    if (this.timer > this.interval) {
      this.#ctx.clearRect(0, 0, this.#width, this.#height);

      for (let y = 0; y < this.#height; y += this.cellSize) {
        for (let x = 0; x < this.#width; x += this.cellSize) {
          const angle = Math.cos(x * this.factor) + Math.sin(y * this.factor);
          this.#drawLine(angle, x, y);
        }
      }
      this.factor += 0.0001;
      this.timer = 0;
    } else {
      this.timer += deltaTime;
    }

    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
  }

  stop() {
    cancelAnimationFrame(this.animationFrameId);
  }
}

// OTHER EFFECT

// class FlowFieldEffect {
//   #ctx;
//   #width;
//   #height;
//   animationFrameId = null;

//   constructor(ctx, width, height) {
//     this.#ctx = ctx;
//     this.#width = width;
//     this.#height = height;
//     this.#ctx.strokeStyle = "white";
//     this.angle = 0;
//     this.lasttTime = 0;
//     this.interval = 1000 / 20;
//     this.factor = 0.0000005;
//     this.timer = 0;
//     this.cellSize = 10;
//     this.gradient;
//     this.#createGradient();
//     this.#ctx.strokeStyle = this.gradient;
//   }
//   #createGradient() {
//     this.gradient = this.#ctx.createLinearGradient(
//       0,
//       0,
//       this.#width,
//       this.#height
//     );
//     //the first 2 values are the starting points, the last 2 are the ending points
//     this.gradient.addColorStop("0.1", "#ff5c33");
//     this.gradient.addColorStop("0.2", "#ff66b3");
//     this.gradient.addColorStop("0.4", "#ccccff");
//     this.gradient.addColorStop("0.6", "#b3ffff");
//     this.gradient.addColorStop("0.8", "#80ff80");
//     this.gradient.addColorStop("0.9", "#ffff33");

//     //first value is offset 0-1 second is the color
//   }
//   #drawLine(angle, x, y) {
//     this.#ctx.beginPath();
//     this.#ctx.moveTo(x, y);
//     this.#ctx.lineTo(x + angle, y + angle);
//     this.#ctx.stroke();
//   }
//   animate(timeStamp) {
//     const deltaTime = timeStamp - this.lasttTime;
//     this.lasttTime = timeStamp;

//     if (this.timer > this.interval) {
//       this.#ctx.clearRect(0, 0, this.#width, this.#height);

//       for (let y = 0; y < this.#height; y += this.cellSize) {
//         for (let x = 0; x < this.#width; x += this.cellSize) {
//           const angle =
//             (Math.tan((x * this.factor) / 2) +
//               Math.tan((y * this.factor) / 2)) *
//             this.factor;
//           this.#drawLine(angle, x, y);
//         }
//       }
//       this.factor += 0.0001;
//       this.timer = 0;
//     } else {
//       this.timer += deltaTime;
//     }

//     this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
//   }
// }

export default FlowFieldEffect;
