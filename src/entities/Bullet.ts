export class Bullet {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  active: boolean;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.width = 3;
    this.height = 10;
    this.speed = 300; // pixels per second
    this.active = true;
  }

  update(deltaTime: number) {
    this.y -= this.speed * deltaTime;
    if (this.y + this.height < 0) {
      this.active = false;
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#FFFF00';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  isActive(): boolean {
    return this.active;
  }

  deactivate() {
    this.active = false;
  }
}