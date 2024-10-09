import { DivingAlien } from './DivingAlien';
import { Player } from './Player';

class Alien {
  x: number;
  y: number;
  width: number;
  height: number;
  gridX: number;
  gridY: number;
  baseWidth: number;

  constructor(x: number, y: number, gridX: number, gridY: number) {
    this.x = x;
    this.y = y;
    this.baseWidth = 20;
    this.width = this.baseWidth;
    this.height = 20;
    this.gridX = gridX;
    this.gridY = gridY;
  }

  render(ctx: CanvasRenderingContext2D, animationProgress: number) {
    ctx.fillStyle = '#FF00FF';
    const animatedWidth =
      this.baseWidth * (0.8 + Math.sin(animationProgress * Math.PI * 2) * 0.2);
    const xOffset = (this.baseWidth - animatedWidth) / 2;
    ctx.fillRect(this.x + xOffset, this.y, animatedWidth, this.height);
  }
}

export class AlienFormation {
  private aliens: Alien[];
  private divingAliens: DivingAlien[];
  private readonly rows: number = 5;
  private readonly cols: number = 11;
  private readonly horizontalSpacing: number = 30;
  private readonly verticalSpacing: number = 30;
  private readonly horizontalPadding: number = 20;
  private readonly verticalPadding: number = 50;
  private direction: number = 1; // 1 for right, -1 for left
  private moveDownDistance: number = 10;
  private speed: number = 5; // pixels per second
  private canvasWidth: number;
  private canvasHeight: number;
  private animationProgress: number = 0;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.aliens = [];
    this.divingAliens = [];
    this.initializeAliens();
  }

  private initializeAliens() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const x = this.horizontalPadding + col * this.horizontalSpacing;
        const y = this.verticalPadding + row * this.verticalSpacing;
        this.aliens.push(new Alien(x, y, col, row));
      }
    }
  }

  update(deltaTime: number) {
    // Update animation progress
    this.animationProgress += deltaTime * 2; // Adjust the multiplier to change animation speed
    if (this.animationProgress >= 1) {
      this.animationProgress -= 1;
    }

    // Move the formation
    const moveDistance = this.speed * deltaTime * this.direction;
    let shouldMoveDown = false;

    // Check if the formation should change direction
    if (this.direction > 0) {
      const rightmostAlien = this.aliens.reduce((prev, current) =>
        current.x > prev.x ? current : prev
      );
      if (
        rightmostAlien.x + rightmostAlien.width + moveDistance >
        this.canvasWidth - this.horizontalPadding
      ) {
        this.direction = -1;
        shouldMoveDown = true;
      }
    } else {
      const leftmostAlien = this.aliens.reduce((prev, current) =>
        current.x < prev.x ? current : prev
      );
      if (leftmostAlien.x + moveDistance < this.horizontalPadding) {
        this.direction = 1;
        shouldMoveDown = true;
      }
    }

    // Move aliens
    this.aliens.forEach((alien) => {
      alien.x += moveDistance;
      if (shouldMoveDown) {
        alien.y += this.moveDownDistance;
      }
    });

    // Update diving aliens
    this.divingAliens = this.divingAliens.filter(
      (alien) => !alien.update(deltaTime, this)
    );

    // Randomly select an alien to dive
    if (this.divingAliens.length < 1 && Math.random() < 0.01) {
      const randomAlien =
        this.aliens[Math.floor(Math.random() * this.aliens.length)];
      if (randomAlien) {
        const divingAlien = new DivingAlien(
          randomAlien.x,
          randomAlien.y,
          randomAlien.gridX,
          randomAlien.gridY,
          this.canvasWidth,
          this.canvasHeight
        );
        this.divingAliens.push(divingAlien);
      }
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    this.aliens.forEach((alien) => alien.render(ctx, this.animationProgress));
    this.divingAliens.forEach((alien) => alien.render(ctx));
  }

  checkCollision(bullet: {
    x: number;
    y: number;
    width: number;
    height: number;
  }): Alien | null {
    // Check collision with formation aliens
    for (let i = this.aliens.length - 1; i >= 0; i--) {
      const alien = this.aliens[i];
      if (this.checkCollisionWithAlien(bullet, alien)) {
        const hitAlien = this.aliens.splice(i, 1)[0];
        return hitAlien;
      }
    }

    // Check collision with diving aliens
    for (let i = this.divingAliens.length - 1; i >= 0; i--) {
      const alien = this.divingAliens[i];
      if (this.checkCollisionWithAlien(bullet, alien)) {
        const hitAlien = this.divingAliens.splice(i, 1)[0];
        return hitAlien;
      }
    }

    return null;
  }

  private checkCollisionWithAlien(
    bullet: { x: number; y: number; width: number; height: number },
    alien: { x: number; y: number; width: number; height: number }
  ): boolean {
    return (
      bullet.x < alien.x + alien.width &&
      bullet.x + bullet.width > alien.x &&
      bullet.y < alien.y + alien.height &&
      bullet.y + bullet.height > alien.y
    );
  }

  checkPlayerCollision(player: Player): boolean {
    return (
      this.aliens.some((alien) =>
        this.checkCollisionWithAlien(player, alien)
      ) ||
      this.divingAliens.some((alien) =>
        this.checkCollisionWithAlien(player, alien)
      )
    );
  }

  isEmpty(): boolean {
    return this.aliens.length === 0 && this.divingAliens.length === 0;
  }

  getAlienPosition(gridX: number, gridY: number): { x: number; y: number } {
    const x = this.horizontalPadding + gridX * this.horizontalSpacing;
    const y = this.verticalPadding + gridY * this.verticalSpacing;
    return { x, y };
  }
}
