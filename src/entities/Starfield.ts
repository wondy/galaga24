class Star {
  x: number;
  y: number;
  speed: number;
  size: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.speed = 1 + Math.random() * 3;
    this.size = 1 + Math.random() * 2;
  }

  update(deltaTime: number, canvasHeight: number) {
    this.y += this.speed * deltaTime * 60; // Adjust speed based on 60 FPS
    if (this.y > canvasHeight) {
      this.y = 0;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}

export class Starfield {
  private stars: Star[];
  private canvasWidth: number;
  private canvasHeight: number;

  constructor(canvasWidth: number, canvasHeight: number, starCount: number = 100) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.stars = Array.from({ length: starCount }, () => new Star(canvasWidth, canvasHeight));
  }

  update(deltaTime: number) {
    this.stars.forEach(star => star.update(deltaTime, this.canvasHeight));
  }

  render(ctx: CanvasRenderingContext2D) {
    this.stars.forEach(star => star.draw(ctx));
  }
}