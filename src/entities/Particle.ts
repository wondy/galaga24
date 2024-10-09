export class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;

  constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 5;
    this.vy = (Math.random() - 0.5) * 5;
    this.life = 1.0;
    this.color = color;
    this.size = Math.random() * 3 + 1;
  }

  update(deltaTime: number) {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= deltaTime * 2;
    this.size -= deltaTime;
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.life;
    ctx.fillRect(this.x, this.y, this.size, this.size);
    ctx.globalAlpha = 1;
  }

  isDead(): boolean {
    return this.life <= 0 || this.size <= 0;
  }
}

export class ParticleSystem {
  particles: Particle[];

  constructor() {
    this.particles = [];
  }

  createExplosion(x: number, y: number, color: string, count: number = 20) {
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(x, y, color));
    }
  }

  update(deltaTime: number) {
    this.particles.forEach(particle => particle.update(deltaTime));
    this.particles = this.particles.filter(particle => !particle.isDead());
  }

  render(ctx: CanvasRenderingContext2D) {
    this.particles.forEach(particle => particle.render(ctx));
  }
}