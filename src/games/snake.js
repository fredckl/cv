// Snake Game
export class Snake {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.gridSize = 20;
    this.gridWidth = Math.floor(this.canvas.width / this.gridSize);
    this.gridHeight = Math.floor(this.canvas.height / this.gridSize);
    this.snake = [];
    this.food = null;
    this.direction = 'right';
    this.gameSpeed = 100;
    this.score = 0;
    this.gameOver = false;
    this.gameLoop = null;
    
    // Initialize the game
    this.init();
    
    // Event listeners
    this.setupEventListeners();
  }
  
  init() {
    // Initialize snake
    this.snake = [
      { x: 5, y: 5 },
      { x: 4, y: 5 },
      { x: 3, y: 5 }
    ];
    
    // Initialize direction
    this.direction = 'right';
    
    // Initialize score
    this.score = 0;
    
    // Generate food
    this.food = this.generateFood();
    
    // Reset game speed
    this.gameSpeed = 100;
    
    // Reset game over flag
    this.gameOver = false;
    
    // Start the game loop
    this.startGameLoop();
  }
  
  setupEventListeners() {
    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowUp':
          if (this.direction !== 'down') this.direction = 'up';
          e.preventDefault();
          break;
        case 'ArrowDown':
          if (this.direction !== 'up') this.direction = 'down';
          e.preventDefault();
          break;
        case 'ArrowLeft':
          if (this.direction !== 'right') this.direction = 'left';
          e.preventDefault();
          break;
        case 'ArrowRight':
          if (this.direction !== 'left') this.direction = 'right';
          e.preventDefault();
          break;
        case ' ':
          if (this.gameOver) this.init();
          e.preventDefault();
          break;
      }
    });
  }
  
  generateFood() {
    let newFood;
    let foodOnSnake;
    
    do {
      foodOnSnake = false;
      newFood = {
        x: Math.floor(Math.random() * this.gridWidth),
        y: Math.floor(Math.random() * this.gridHeight)
      };
      
      // Check if food is on snake
      for (let segment of this.snake) {
        if (segment.x === newFood.x && segment.y === newFood.y) {
          foodOnSnake = true;
          break;
        }
      }
    } while (foodOnSnake);
    
    return newFood;
  }
  
  update() {
    if (this.gameOver) return;
    
    // Create new head based on current direction
    const head = { ...this.snake[0] };
    
    switch (this.direction) {
      case 'up':
        head.y -= 1;
        break;
      case 'down':
        head.y += 1;
        break;
      case 'left':
        head.x -= 1;
        break;
      case 'right':
        head.x += 1;
        break;
    }
    
    // Check for wall collisions with wrap-around
    if (head.x < 0) head.x = this.gridWidth - 1;
    if (head.x >= this.gridWidth) head.x = 0;
    if (head.y < 0) head.y = this.gridHeight - 1;
    if (head.y >= this.gridHeight) head.y = 0;
    
    // Check for collisions with self
    for (let i = 0; i < this.snake.length; i++) {
      if (this.snake[i].x === head.x && this.snake[i].y === head.y) {
        this.gameOver = true;
        return;
      }
    }
    
    // Add new head
    this.snake.unshift(head);
    
    // Check if snake ate food
    if (head.x === this.food.x && head.y === this.food.y) {
      // Increase score
      this.score += 10;
      
      // Increase game speed
      this.gameSpeed = Math.max(40, 100 - Math.floor(this.snake.length / 3) * 5);
      
      // Generate new food
      this.food = this.generateFood();
    } else {
      // Remove tail if snake didn't eat
      this.snake.pop();
    }
  }
  
  draw() {
    // Clear canvas
    this.ctx.fillStyle = '#111';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw snake
    this.ctx.fillStyle = '#4CAF50';
    for (let segment of this.snake) {
      this.ctx.fillRect(
        segment.x * this.gridSize,
        segment.y * this.gridSize,
        this.gridSize - 1,
        this.gridSize - 1
      );
    }
    
    // Draw snake head in different color
    this.ctx.fillStyle = '#8BC34A';
    this.ctx.fillRect(
      this.snake[0].x * this.gridSize,
      this.snake[0].y * this.gridSize,
      this.gridSize - 1,
      this.gridSize - 1
    );
    
    // Draw food
    this.ctx.fillStyle = '#FF5722';
    this.ctx.fillRect(
      this.food.x * this.gridSize,
      this.food.y * this.gridSize,
      this.gridSize - 1,
      this.gridSize - 1
    );
    
    // Draw score
    this.ctx.fillStyle = '#FFF';
    this.ctx.font = '16px "Press Start 2P", cursive';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`Score: ${this.score}`, 10, 25);
    
    // Draw game over screen
    if (this.gameOver) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.ctx.fillStyle = '#FFF';
      this.ctx.font = '24px "Press Start 2P", cursive';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 24);
      this.ctx.fillText(`Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 24);
      this.ctx.font = '16px "Press Start 2P", cursive';
      this.ctx.fillText('Press SPACE to restart', this.canvas.width / 2, this.canvas.height / 2 + 60);
    }
  }
  
  startGameLoop() {
    if (this.gameLoop) clearInterval(this.gameLoop);
    
    this.gameLoop = setInterval(() => {
      this.update();
      this.draw();
      
      if (this.gameOver) {
        clearInterval(this.gameLoop);
        this.gameLoop = null;
      }
    }, this.gameSpeed);
  }
  
  // Public method to stop the game
  stop() {
    if (this.gameLoop) {
      clearInterval(this.gameLoop);
      this.gameLoop = null;
    }
    
    this.gameOver = true;
  }
}
