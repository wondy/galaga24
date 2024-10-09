export class Player {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  dx: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 20;
    this.speed = 200; // pixels per second
    this.dx = 0;
  }

  moveLeft() {
    this.dx = -this.speed;
  }

  moveRight() {
    this.dx = this.speed;
  }

  stop() {
    this.dx = 0;
  }

  update(deltaTime: number, canvasWidth: number) {
    this.x += this.dx * deltaTime;
    if (this.x < 0) this.x = 0;
    if (this.x + this.width > canvasWidth) this.x = canvasWidth - this.width;
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#00FF00';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}