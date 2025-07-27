class Cell {
  constructor(effect, x, y) {
    this.effect = effect;
    this.x = x;
    this.y = y;
    this.angle = Math.random() * Math.PI * 2;
    this.speed = Math.random() * 3 + 1;
    this.width = this.effect.cellSize;
    this.height = this.effect.cellSize;
    this.lineWidth = Math.random() * 5;

    this.colors = [
      "rgb(113,35,41",
      "rgb(89,50,60",
      "rgb(152,66,45",
      "rgb(167,55,90",
      "rgb(91,147,183",
      "rgb(90,100,122",
    ];
    this.randomNum = Math.floor(Math.random() * this.colors.length);

    this.color = this.colors[this.randomNum];
  }
}

class Line {
  constructor(effect) {
    this.effect = effect;

    this.circleOutline = [];
    this.defineCircleArea();

    this.x = this.circleOutline[0].x;
    this.y = this.circleOutline[0].y;
    this.opacity = 1;
    this.lineWidth = Math.random() * 3;
    this.strokeStyle = `rgba(0,0,0, ${this.opacity})`;
    this.stack = [];
    this.position = 0;
    this.hasFinished = false;
  }

  defineCircleArea() {
    const centerX = Math.random() * this.effect.width;
    const centerY = Math.random() * this.effect.height;
    const radius = Math.floor(Math.random() * 20 + 15);
    const randomIncrement = Math.floor(Math.random() * 6) + 3;
    const randomFactor1 = Math.random() * 5;

    for (let angle = 0; angle < 360; angle += randomIncrement) {
      const radian = (Math.PI / 180) * angle + randomFactor1;
      let x;
      let y;
      y;

      if (angle < 90 || angle > 270) {
        x = centerX + radius * Math.cos(radian) + Math.random() * 50;
        y = centerY + radius * Math.sin(radian);
      } else {
        x = centerX + radius * Math.cos(radian);
        y = centerY + radius * Math.sin(radian) + Math.random() * 50;
      }
      this.circleOutline.push({ x, y });
    }
  }

  drawQuasiCircle() {
    this.effect.ctx.beginPath();
    this.effect.ctx.moveTo(this.x, this.y);

    this.effect.ctx.strokeStyle = this.strokeStyle;
    this.effect.ctx.lineWidth = this.lineWidth;

    this.stack.forEach((point) => {
      this.effect.ctx.lineTo(point.x, point.y);
    });
    this.effect.ctx.stroke();

    if (this.opacity <= 0) {
      this.hasFinished = true;
    }

    if (this.position === this.circleOutline.length) {
      this.opacity -= 0.01;
      this.strokeStyle = `rgba(0,0,0, ${this.opacity})`;
    } else {
      this.stack.push({
        x: this.circleOutline[this.position].x,
        y: this.circleOutline[this.position].y,
      });
      this.position++;
    }
  }
}

class Effect {
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.ctx.strokeStyle = "white";

    this.cellSize = 15;
    this.angle = 0;

    this.lasttTime = 0;
    this.fps = 40;
    this.interval = 1000 / this.fps;
    this.timer = 0;
    this.animationFrameId = null;

    this.grid = [];
    this.gridVisible = false;
    this.createGrid();
    window.addEventListener("keydown", (e) => {
      if (e.key === "g") {
        this.toggleGrid();
      }
    });

    this.lines = [];
    this.createInitialLines();
  }

  createInitialLines() {
    for (let i = 0; i < 10; i++) {
      window.setTimeout(() => {
        this.createNewLine();
      }, i * 500);
    }
  }

  createNewLine() {
    this.lines.push(new Line(this));
  }

  drawField() {
    this.grid.forEach((cell) => {
      if (cell.x % 2 === 0 || cell.y % 2 === 0) {
        return;
      }
      this.ctx.beginPath();
      this.ctx.moveTo(cell.x, cell.y);
      this.ctx.lineWidth = cell.lineWidth;

      if (cell.x % 100 < Math.sin(cell.angle * 0.4) * cell.y) {
        this.ctx.arc(
          cell.x,
          cell.y,
          3 + Math.sin(cell.angle) * 2,
          0,
          Math.PI * 2
        );
      } else {
        this.ctx.lineTo(
          cell.x + Math.sin(cell.angle) * this.cellSize,
          cell.y + Math.sin(cell.angle) * this.cellSize * 2
        );
      }

      this.ctx.strokeStyle = cell.color;
      this.ctx.stroke();
      cell.angle += 0.1;
    });
  }
  createGrid() {
    for (let y = 0; y < this.height; y += this.cellSize) {
      for (let x = 0; x < this.width; x += this.cellSize) {
        this.grid.push(new Cell(this, x, y));
      }
    }
  }
  drawGrid() {
    this.grid.forEach((cell) => {
      this.ctx.beginPath();
      this.ctx.rect(cell.x, cell.y, cell.width, cell.height);
      this.ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      this.ctx.stroke();
    });
  }
  toggleGrid() {
    if (this.gridVisible) {
      this.gridVisible = false;
    } else {
      this.gridVisible = true;
    }
  }

  animate(timeStamp = 0) {
    const deltaTime = timeStamp - this.lasttTime;
    this.lasttTime = timeStamp;
    if (this.timer > this.interval) {
      this.ctx.clearRect(0, 0, this.width, this.height);

      this.lines.forEach((line, i) => {
        if (line.hasFinished) {
          this.lines.splice(i, 1);
          this.createNewLine();
        }
        line.drawQuasiCircle();
      });

      this.drawField();

      if (this.gridVisible) {
        this.drawGrid();
      }

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

export default Effect;
