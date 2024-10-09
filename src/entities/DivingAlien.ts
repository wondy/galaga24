import { AlienFormation } from './AlienFormation';

export class DivingAlien {
  x: number;
  y: number;
  readonly gridX: number;
  readonly gridY: number;
  readonly width: number = 20;
  readonly height: number = 20;
  private speed: number;
  private time: number;
  private canvasWidth: number;
  private canvasHeight: number;
  private returning: boolean;

  constructor(x: number, y: number, gridX: number, gridY: number, canvasWidth: number, canvasHeight: number) {
    this.x = x;
    this.y = y;
    this.gridX = gridX;
    this.gridY = gridY;
    this.speed = 100; // pixels per second
    this.time = 0;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.returning = false;
  }

  update(deltaTime: number, formation: AlienFormation) {
    this.time += deltaTime;

    if (this.returning) {
      const targetPosition = formation.getAlienPosition(this.gridX, this.gridY);
      const dx = targetPosition.x - this.x;
      const dy = targetPosition.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > this.speed * deltaTime) {
        this.x += (dx / distance) * this.speed * deltaTime;
        this.y += (dy / distance) * this.speed * deltaTime;
      } else {
        // Alien has reached its updated position
        this.x = targetPosition.x;
        this.y = targetPosition.y;
        return true; // Signal that the alien has returned to the formation
      }
    } else {
      // Continue diving
      this.y += this.speed * deltaTime;
      this.x = formation.getAlienPosition(this.gridX, 0).x + Math.sin(this.time * 5) * 50; // Adjust the frequency and amplitude as needed

      // Check if the alien has exited the bottom of the screen
      if (this.y > this.canvasHeight) {
        this.y = -this.height; // Place the alien just above the top of the screen
        this.returning = true;
      }
    }

    return false; // Alien hasn't returned to the formation yet
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#FF00FF';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}