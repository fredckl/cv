// Space Invaders Game
export class SpaceInvaders {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.gameOver = false;
    this.gameStarted = false;
    this.startTimer = null;
    this.score = 0;
    
    // Player
    this.playerWidth = 60;
    this.playerHeight = 20;
    this.player = {
      x: this.width / 2 - this.playerWidth / 2,
      y: this.height - this.playerHeight - 10,
      width: this.playerWidth,
      height: this.playerHeight,
      speed: 8,
      dx: 0
    };
    
    // Bullets
    this.bullets = [];
    this.bulletWidth = 4;
    this.bulletHeight = 10;
    this.bulletSpeed = 7;
    
    // Enemies
    this.enemies = [];
    this.enemyWidth = 40;
    this.enemyHeight = 30;
    this.enemyGap = 15;
    this.enemySpeed = 0.5;
    this.enemyDirection = 1; // 1 = right, -1 = left
    this.enemyDropDistance = 20;
    this.enemyFireRate = 0.002;
    
    // Enemy bullets
    this.enemyBullets = [];
    
    // Controls
    this.keys = {};
    
    // Initialize
    this.init();
  }
  
  init() {
    // Create enemies
    this.createEnemies();
    
    // Event listeners
    document.addEventListener('keydown', (e) => this.keyDown(e));
    document.addEventListener('keyup', (e) => this.keyUp(e));
    
    // Start game loop
    this.gameLoop();
  }
  
  createEnemies() {
    const rows = 4;
    const cols = 8;
    const startX = (this.width - (cols * (this.enemyWidth + this.enemyGap))) / 2;
    const startY = 80;
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = startX + col * (this.enemyWidth + this.enemyGap);
        const y = startY + row * (this.enemyHeight + this.enemyGap);
        
        this.enemies.push({
          x,
          y,
          width: this.enemyWidth,
          height: this.enemyHeight,
          type: row // Different types for different rows
        });
      }
    }
  }
  
  keyDown(e) {
    if (this.gameOver) {
      // Redémarrer le jeu si espace est pressé et que le jeu est terminé
      if (e.key === ' ') {
        this.restart();
        e.preventDefault();
        return;
      }
    }
    
    this.keys[e.key] = true;
    
    // Fire bullet with space
    if ((e.key === ' ' || e.key === 'ArrowUp') && !this.gameOver) {
      this.fireBullet();
      e.preventDefault();
    }
  }
  
  keyUp(e) {
    this.keys[e.key] = false;
  }
  
  fireBullet() {
    // Limit the number of bullets
    if (this.bullets.length < 3) {
      this.bullets.push({
        x: this.player.x + this.player.width / 2 - this.bulletWidth / 2,
        y: this.player.y,
        width: this.bulletWidth,
        height: this.bulletHeight
      });
    }
  }
  
  movePlayer() {
    // Reset player velocity
    this.player.dx = 0;
    
    // Move player according to keys pressed
    if (this.keys['ArrowLeft'] || this.keys['a']) {
      this.player.dx = -this.player.speed;
    }
    
    if (this.keys['ArrowRight'] || this.keys['d']) {
      this.player.dx = this.player.speed;
    }
    
    // Update player position
    this.player.x += this.player.dx;
    
    // Prevent player from going out of bounds
    if (this.player.x < 0) {
      this.player.x = 0;
    } else if (this.player.x + this.player.width > this.width) {
      this.player.x = this.width - this.player.width;
    }
  }
  
  moveEnemies() {
    let reachedEdge = false;
    
    // Check if any enemy reached the edge
    for (const enemy of this.enemies) {
      if (
        (this.enemyDirection === 1 && enemy.x + this.enemyWidth >= this.width) ||
        (this.enemyDirection === -1 && enemy.x <= 0)
      ) {
        reachedEdge = true;
        break;
      }
    }
    
    // If reached edge, change direction and move down
    if (reachedEdge) {
      this.enemyDirection *= -1;
      
      for (const enemy of this.enemies) {
        enemy.y += this.enemyDropDistance;
      }
    } else {
      // Move enemies horizontally
      for (const enemy of this.enemies) {
        enemy.x += this.enemySpeed * this.enemyDirection;
      }
    }
    
    // Random enemy firing
    this.enemies.forEach(enemy => {
      if (Math.random() < this.enemyFireRate) {
        this.enemyBullets.push({
          x: enemy.x + enemy.width / 2 - this.bulletWidth / 2,
          y: enemy.y + enemy.height,
          width: this.bulletWidth,
          height: this.bulletHeight
        });
      }
    });
    
    // Check if any enemy reached the player's level
    for (const enemy of this.enemies) {
      if (enemy.y + enemy.height >= this.player.y) {
        this.gameOver = true;
        break;
      }
    }
  }
  
  moveBullets() {
    // Move player bullets
    for (let i = 0; i < this.bullets.length; i++) {
      this.bullets[i].y -= this.bulletSpeed;
      
      // Remove bullets that go off screen
      if (this.bullets[i].y < 0) {
        this.bullets.splice(i, 1);
        i--;
      }
    }
    
    // Move enemy bullets
    for (let i = 0; i < this.enemyBullets.length; i++) {
      this.enemyBullets[i].y += this.bulletSpeed * 0.7;
      
      // Remove bullets that go off screen
      if (this.enemyBullets[i].y > this.height) {
        this.enemyBullets.splice(i, 1);
        i--;
      }
    }
  }
  
  checkCollisions() {
    // Check player bullets vs enemies
    for (let i = 0; i < this.bullets.length; i++) {
      const bullet = this.bullets[i];
      
      for (let j = 0; j < this.enemies.length; j++) {
        const enemy = this.enemies[j];
        
        if (
          bullet.x < enemy.x + enemy.width &&
          bullet.x + bullet.width > enemy.x &&
          bullet.y < enemy.y + enemy.height &&
          bullet.y + bullet.height > enemy.y
        ) {
          // Remove the bullet and enemy
          this.bullets.splice(i, 1);
          this.enemies.splice(j, 1);
          
          // Increase score
          this.score += 10 * (enemy.type + 1);
          
          // Increase enemy speed slightly
          this.enemySpeed = Math.min(3, this.enemySpeed + 0.05);
          
          i--;
          break;
        }
      }
    }
    
    // Check enemy bullets vs player
    for (let i = 0; i < this.enemyBullets.length; i++) {
      const bullet = this.enemyBullets[i];
      
      if (
        bullet.x < this.player.x + this.player.width &&
        bullet.x + bullet.width > this.player.x &&
        bullet.y < this.player.y + this.player.height &&
        bullet.y + bullet.height > this.player.y
      ) {
        // Game over
        this.gameOver = true;
        break;
      }
    }
    
    // Check if all enemies are destroyed
    if (this.enemies.length === 0) {
      // Level complete, create new enemies with increased speed
      this.enemySpeed += 0.5;
      this.enemyFireRate += 0.001;
      this.createEnemies();
    }
  }
  
  draw() {
    // Clear canvas
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // Draw player
    this.ctx.fillStyle = '#0F0';
    this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
    
    // Draw player bullets
    this.ctx.fillStyle = '#FFF';
    for (const bullet of this.bullets) {
      this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    }
    
    // Draw enemies
    for (const enemy of this.enemies) {
      // Different colors for different enemy types
      switch(enemy.type) {
        case 0:
          this.ctx.fillStyle = '#FF0000';
          break;
        case 1:
          this.ctx.fillStyle = '#FF6600';
          break;
        case 2:
          this.ctx.fillStyle = '#FFCC00';
          break;
        case 3:
          this.ctx.fillStyle = '#FFFF00';
          break;
        default:
          this.ctx.fillStyle = '#FF0000';
      }
      this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    }
    
    // Draw enemy bullets
    this.ctx.fillStyle = '#F00';
    for (const bullet of this.enemyBullets) {
      this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    }
    
    // Draw score
    this.ctx.fillStyle = '#FFF';
    this.ctx.font = '16px "Press Start 2P", cursive';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`Score: ${this.score}`, 10, 25);
    
    // Draw game over
    if (this.gameOver) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      this.ctx.fillRect(0, 0, this.width, this.height);
      
      this.ctx.fillStyle = '#FFF';
      this.ctx.font = '24px "Press Start 2P", cursive';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('GAME OVER', this.width / 2, this.height / 2 - 24);
      this.ctx.fillText(`Score: ${this.score}`, this.width / 2, this.height / 2 + 24);
      this.ctx.font = '16px "Press Start 2P", cursive';
      this.ctx.fillText('Press SPACE to restart', this.width / 2, this.height / 2 + 60);
    }
  }
  
  restart() {
    this.gameOver = false;
    this.gameStarted = false;
    this.startTimer = null;
    this.score = 0;
    this.player.x = this.width / 2 - this.player.width / 2;
    this.bullets = [];
    this.enemyBullets = [];
    this.enemies = [];
    this.enemySpeed = 0.5;
    this.enemyDirection = 1;
    this.enemyFireRate = 0.002;
    this.createEnemies();
  }
  
  gameLoop() {
    // Ajout d'un délai de 2 secondes avant de commencer le jeu
    if (!this.gameStarted && !this.gameOver) {
      // Afficher un message "Prêt ?"
      this.ctx.fillStyle = '#000';
      this.ctx.fillRect(0, 0, this.width, this.height);
      
      this.ctx.fillStyle = '#FFF';
      this.ctx.font = '24px "Press Start 2P", cursive';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('READY?', this.width / 2, this.height / 2 - 20);
      
      this.ctx.font = '16px "Press Start 2P", cursive';
      this.ctx.fillText('Game starts in 2 seconds...', this.width / 2, this.height / 2 + 20);
      this.ctx.fillText('Use arrow keys to move', this.width / 2, this.height / 2 + 50);
      this.ctx.fillText('Space to shoot', this.width / 2, this.height / 2 + 80);
      
      // Démarrer le jeu après 2 secondes
      if (!this.startTimer) {
        this.startTimer = setTimeout(() => {
          this.gameStarted = true;
          this.startTimer = null;
        }, 2000);
      }
      
      requestAnimationFrame(() => this.gameLoop());
      return;
    }
    
    if (!this.gameOver && this.gameStarted) {
      this.movePlayer();
      this.moveEnemies();
      this.moveBullets();
      this.checkCollisions();
    }
    
    this.draw();
    
    requestAnimationFrame(() => this.gameLoop());
  }
  
  // Public method to stop the game
  stop() {
    // Remove event listeners
    document.removeEventListener('keydown', this.keyDown);
    document.removeEventListener('keyup', this.keyUp);
    
    // Clear the game state
    this.gameOver = true;
    this.gameStarted = false;
    if (this.startTimer) {
      clearTimeout(this.startTimer);
      this.startTimer = null;
    }
    this.enemies = [];
    this.bullets = [];
    this.enemyBullets = [];
  }
}
