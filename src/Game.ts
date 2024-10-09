import { Player } from './entities/Player';
import { AlienFormation } from './entities/AlienFormation';
import { Bullet } from './entities/Bullet';
import { Starfield } from './entities/Starfield';
import { ParticleSystem } from './entities/Particle';

enum GameState {
  START,
  PLAYING,
  NEXT_LEVEL,
  GAME_OVER
}

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private player: Player;
  private alienFormation: AlienFormation;
  private bullets: Bullet[];
  private lastTime: number;
  private running: boolean;
  private starfield: Starfield;
  private lastShotTime: number;
  private shootCooldown: number;
  private score: number;
  private lives: number;
  private level: number;
  private gameState: GameState;
  private particleSystem: ParticleSystem;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.player = new Player(this.canvas.width / 2, this.canvas.height - 30);
    this.alienFormation = new AlienFormation(this.canvas.width, this.canvas.height);
    this.bullets = [];
    this.lastTime = 0;
    this.running = false;
    this.starfield = new Starfield(this.canvas.width, this.canvas.height);
    this.lastShotTime = 0;
    this.shootCooldown = 500; // 500ms cooldown between shots
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.gameState = GameState.START;
    this.particleSystem = new ParticleSystem();

    this.setupEventListeners();
  }

  private setupEventListeners() {
    document.addEventListener('keydown', (e) => {
      if (this.gameState === GameState.PLAYING) {
        switch (e.key) {
          case 'ArrowLeft':
            this.player.moveLeft();
            break;
          case 'ArrowRight':
            this.player.moveRight();
            break;
          case ' ':
            this.shoot();
            break;
        }
      } else if (this.gameState === GameState.START || this.gameState === GameState.GAME_OVER) {
        if (e.key === ' ') {
          this.startGame();
        }
      }
    });

    document.addEventListener('keyup', (e) => {
      if (this.gameState === GameState.PLAYING) {
        switch (e.key) {
          case 'ArrowLeft':
          case 'ArrowRight':
            this.player.stop();
            break;
        }
      }
    });
  }

  private shoot() {
    const currentTime = performance.now();
    if (currentTime - this.lastShotTime > this.shootCooldown) {
      const bullet = new Bullet(this.player.x + this.player.width / 2, this.player.y);
      this.bullets.push(bullet);
      this.lastShotTime = currentTime;
    }
  }

  private startGame() {
    this.gameState = GameState.PLAYING;
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.alienFormation = new AlienFormation(this.canvas.width, this.canvas.height);
    this.bullets = [];
    this.start();
  }

  start() {
    if (!this.running) {
      this.running = true;
      this.lastTime = performance.now();
      this.gameLoop();
    }
  }

  private gameLoop() {
    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    this.update(deltaTime);
    this.render();

    if (this.running) {
      requestAnimationFrame(() => this.gameLoop());
    }
  }

  private update(deltaTime: number) {
    if (this.gameState !== GameState.PLAYING) return;

    this.starfield.update(deltaTime);
    this.player.update(deltaTime, this.canvas.width);
    this.alienFormation.update(deltaTime);
    this.bullets = this.bullets.filter((bullet) => bullet.isActive());
    this.bullets.forEach((bullet) => bullet.update(deltaTime));
    this.particleSystem.update(deltaTime);

    // Check for collisions
    this.bullets.forEach((bullet) => {
      const hitAlien = this.alienFormation.checkCollision(bullet);
      if (hitAlien) {
        bullet.deactivate();
        this.score += 20;
        this.particleSystem.createExplosion(hitAlien.x + hitAlien.width / 2, hitAlien.y + hitAlien.height / 2, '#FF00FF');
      }
    });

    // Check if all aliens are destroyed
    if (this.alienFormation.isEmpty()) {
      this.gameState = GameState.NEXT_LEVEL;
      setTimeout(() => {
        this.level++;
        this.alienFormation = new AlienFormation(this.canvas.width, this.canvas.height);
        this.gameState = GameState.PLAYING;
      }, 2000);
    }

    // Check for player collision with aliens
    if (this.alienFormation.checkPlayerCollision(this.player)) {
      this.lives--;
      if (this.lives <= 0) {
        this.gameState = GameState.GAME_OVER;
      } else {
        // Reset player position
        this.player = new Player(this.canvas.width / 2, this.canvas.height - 30);
      }
    }
  }

  private render() {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.starfield.render(this.ctx);

    if (this.gameState === GameState.PLAYING) {
      this.player.render(this.ctx);
      this.alienFormation.render(this.ctx);
      this.bullets.forEach((bullet) => bullet.render(this.ctx));
      this.particleSystem.render(this.ctx);
    }

    this.renderUI();
  }

  private renderUI() {
    this.ctx.fillStyle = '#00FF00';
    this.ctx.font = '16px "Press Start 2P"';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`Score: ${this.score}`, 10, 25);
    this.ctx.fillText(`Lives: ${this.lives}`, 10, 50);
    this.ctx.fillText(`Level: ${this.level}`, 10, 75);

    if (this.gameState === GameState.START) {
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.font = '24px "Press Start 2P"';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('INVADERS', this.canvas.width / 2, this.canvas.height / 2 - 40);
      this.ctx.font = '16px "Press Start 2P"';
      this.ctx.fillText('Press SPACE to start', this.canvas.width / 2, this.canvas.height / 2 + 40);
    } else if (this.gameState === GameState.GAME_OVER) {
      this.ctx.fillStyle = '#FF0000';
      this.ctx.font = '24px "Press Start 2P"';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 40);
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.font = '16px "Press Start 2P"';
      this.ctx.fillText(`Final Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2);
      this.ctx.fillText('Press SPACE to restart', this.canvas.width / 2, this.canvas.height / 2 + 40);
    } else if (this.gameState === GameState.NEXT_LEVEL) {
      this.ctx.fillStyle = '#00FF00';
      this.ctx.font = '24px "Press Start 2P"';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(`LEVEL ${this.level} COMPLETE`, this.canvas.width / 2, this.canvas.height / 2);
    }
  }
}