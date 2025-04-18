// Wordle Game
export class Wordle {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    
    // Game state
    this.gameOver = false;
    this.win = false;
    this.currentRow = 0;
    this.currentCol = 0;
    this.maxRows = 6;
    this.wordLength = 5;
    this.targetWord = "";
    this.grid = [];
    this.colors = [];
    this.message = "";
    
    // Dictionary of valid words
    this.frenchWords = [
      "abime", "acide", "acier", "aider", "aimer", "album", "alger", "aller", "amour", "angle",
      "annee", "appel", "arbre", "arche", "astre", "atome", "avion", "avoir", "bague", "balle",
      "barbe", "barre", "baton", "biere", "bijou", "bille", "bison", "blanc", "blond", "boire",
      "boite", "bombe", "bonne", "borde", "bouee", "boule", "bourg", "bruit", "bulle", "butte",
      "cable", "cadre", "calme", "canal", "canne", "carte", "casse", "cause", "champ", "chant",
      "chaud", "chien", "chute", "cible", "clair", "clown", "coeur", "colis", "colle", "conte",
      "corde", "corps", "coude", "court", "crabe", "craie", "creme", "crepe", "croix", "cruel",
      "cuire", "cygne", "danse", "debut", "degre", "diner", "doigt", "droit", "duree", "echec",
      "ecole", "ecran", "eleve", "email", "envie", "epais", "epice", "epoux", "etang", "etoile",
      "etude", "evier", "faire", "faner", "farce", "faute", "femme", "ferme", "feste", "feter",
      "feuil", "fibre", "fiche", "fiere", "figue", "final", "fleur", "flute", "folie", "folle",
      "force", "forme", "forte", "foule", "frais", "frere", "frite", "froid", "front", "fruit",
      "fumee", "fumer", "fusee", "fusil", "garer", "geant", "geler", "genre", "glace", "globe",
      "gloire", "gluant", "gomme", "gorge", "grand", "grise", "gros", "groupe", "guide", "haute",
      "herbe", "heure", "hibou", "homme", "hotel", "huile", "image", "index", "jambe", "jaune",
      "jeter", "jeudi", "jeune", "jouer", "jouet", "jours", "lacer", "lacet", "laine", "lampe",
      "lance", "laque", "large", "larme", "laser", "latin", "laver", "leger", "lepre", "lever",
      "ligne", "linge", "lire", "livre", "loger", "loin", "loire", "louer", "loupe", "lourd",
      "lueur", "lundi", "lutin", "macher", "magie", "mains", "maman", "mardi", "marie", "marin",
      "masse", "matin", "melon", "mener", "merde", "metal", "metre", "micro", "mieux", "mille",
      "mince", "mixer", "mobile", "monde", "moule", "mousse", "mural", "muser", "nager", "nappe",
      "navet", "neige", "nette", "neuve", "neveu", "niche", "nuage", "obeir", "objet", "ocean",
      "odeur", "oeil", "oeuf", "offre", "ombre", "oncle", "ongle", "orage", "ordre", "outil",
      "paire", "paix", "panne", "parer", "partir", "passe", "pates", "patte", "payer", "peche",
      "peine", "pelle", "petit", "photo", "piano", "piece", "pied", "pierre", "pince", "pique",
      "piste", "pivot", "place", "plage", "plein", "plier", "pluie", "plume", "poche", "poeme",
      "poete", "poing", "point", "poire", "pomme", "pompe", "ponte", "porte", "poser", "poste",
      "pouce", "poule", "prune", "punir", "radio", "radis", "ramer", "rampe", "rance", "range",
      "raser", "rater", "rayon", "reine", "repas", "rever", "riche", "roche", "rouge", "route",
      "ruban", "rugby", "russe", "sable", "salir", "salle", "salut", "sante", "sauce", "saule",
      "saute", "sauver", "savon", "seche", "selle", "selon", "semer", "sens", "sepia", "serie",
      "serre", "siege", "signe", "silex", "singe", "soeur", "soif", "solde", "somme", "songe",
      "sorte", "soupe", "sourd", "sport", "stylo", "suave", "sucre", "suite", "super", "table",
      "tache", "taire", "talon", "tante", "taper", "tapis", "tarte", "tasse", "tater", "taupe",
      "temps", "tenir", "tente", "terre", "teter", "texte", "tiger", "tigre", "tirer", "tissu",
      "titre", "toast", "toile", "tombe", "tonne", "tordu", "total", "train", "trait", "trier",
      "trois", "troll", "trop", "trou", "truc", "truie", "tube", "tulipe", "usine", "utile",
      "vache", "vagin", "vague", "vain", "vase", "vaste", "venir", "vente", "verbe", "verre",
      "veuve", "viande", "vide", "vieux", "ville", "vingt", "vitre", "vivre", "voile", "voix",
      "voler", "voter", "votre", "wagon", "zebre", "zeste", "zinc", "zone"
    ];
    
    // Visual settings
    this.cellSize = 60;
    this.padding = 10;
    this.borderWidth = 2;
    this.fontSize = 36;
    this.smallFontSize = 20;
    this.colors = {
      correct: '#6aaa64',      // Green - correct letter, correct position
      present: '#c9b458',      // Yellow - correct letter, wrong position
      absent: '#787c7e',       // Gray - letter not in word
      border: '#d3d6da',       // Light gray - border
      text: '#ffffff',         // White - text
      background: '#121213'    // Dark - background
    };
    
    // Keyboard state
    this.keyboard = {};
    this.keyboardLayout = [
      ['A', 'Z', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      ['Q', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M'],
      ['ENTER', 'W', 'X', 'C', 'V', 'B', 'N', 'BACK']
    ];
    
    // Initialize the game
    this.init();
    
    // Event listeners
    this.setupEventListeners();
  }
  
  init() {
    // Choose a random word
    this.targetWord = this.getRandomWord().toUpperCase();
    console.log("Target word (for debugging):", this.targetWord);
    
    // Initialize grid
    this.grid = Array(this.maxRows).fill().map(() => Array(this.wordLength).fill(''));
    
    // Initialize colors grid
    this.colors = Array(this.maxRows).fill().map(() => Array(this.wordLength).fill(null));
    
    // Reset game state
    this.currentRow = 0;
    this.currentCol = 0;
    this.gameOver = false;
    this.win = false;
    this.message = "Guess the 5-letter word";
    
    // Reset keyboard colors
    this.keyboard = {};
    
    // Draw initial state
    this.draw();
  }
  
  getRandomWord() {
    return this.frenchWords[Math.floor(Math.random() * this.frenchWords.length)];
  }
  
  setupEventListeners() {
    document.addEventListener('keydown', (e) => {
      if (this.gameOver) {
        if (e.key === 'Enter') {
          this.init();
        }
        return;
      }
      
      if (e.key === 'Enter') {
        this.submitGuess();
      } else if (e.key === 'Backspace') {
        this.deleteLetter();
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        this.addLetter(e.key.toUpperCase());
      }
    });
  }
  
  addLetter(letter) {
    if (this.currentCol < this.wordLength) {
      this.grid[this.currentRow][this.currentCol] = letter;
      this.currentCol++;
      this.draw();
    }
  }
  
  deleteLetter() {
    if (this.currentCol > 0) {
      this.currentCol--;
      this.grid[this.currentRow][this.currentCol] = '';
      this.draw();
    }
  }
  
  submitGuess() {
    // Check if the row is complete
    if (this.currentCol < this.wordLength) {
      this.message = "Not enough letters";
      this.draw();
      return;
    }
    
    // Get the current guess
    const guess = this.grid[this.currentRow].join('');
    
    // Check if the guess is a valid word
    if (!this.isValidWord(guess)) {
      this.message = "Not in word list";
      this.draw();
      return;
    }
    
    // Check the guess against the target word
    this.checkGuess();
    
    // Move to the next row
    this.currentRow++;
    this.currentCol = 0;
    
    // Check if the game is over
    if (guess === this.targetWord) {
      this.gameOver = true;
      this.win = true;
      this.message = "Congratulations!";
    } else if (this.currentRow >= this.maxRows) {
      this.gameOver = true;
      this.message = `Game over! The word was ${this.targetWord}`;
    } else {
      this.message = "";
    }
    
    this.draw();
  }
  
  isValidWord(word) {
    // For simplicity, we'll consider any filled row as valid
    // In a real game, you'd check against a dictionary
    return word.length === this.wordLength;
  }
  
  checkGuess() {
    const guess = this.grid[this.currentRow].join('');
    const target = this.targetWord.split('');
    const result = Array(this.wordLength).fill('absent');
    const letterCounts = {};
    
    // Count letters in target word
    for (const letter of target) {
      letterCounts[letter] = (letterCounts[letter] || 0) + 1;
    }
    
    // First pass: mark correct letters
    for (let i = 0; i < this.wordLength; i++) {
      if (guess[i] === target[i]) {
        result[i] = 'correct';
        letterCounts[guess[i]]--;
      }
    }
    
    // Second pass: mark present letters
    for (let i = 0; i < this.wordLength; i++) {
      if (result[i] !== 'correct' && letterCounts[guess[i]] > 0) {
        result[i] = 'present';
        letterCounts[guess[i]]--;
      }
    }
    
    // Update colors
    for (let i = 0; i < this.wordLength; i++) {
      this.colors[this.currentRow][i] = this.colors[result[i]];
      
      // Update keyboard colors
      const letter = guess[i];
      if (!this.keyboard[letter] || this.keyboard[letter] === this.colors.absent) {
        this.keyboard[letter] = this.colors[result[i]];
      } else if (this.keyboard[letter] === this.colors.present && result[i] === 'correct') {
        this.keyboard[letter] = this.colors.correct;
      }
    }
  }
  
  drawGrid() {
    const startX = (this.width - (this.wordLength * this.cellSize + (this.wordLength - 1) * this.padding)) / 2;
    const startY = 80;
    
    for (let row = 0; row < this.maxRows; row++) {
      for (let col = 0; col < this.wordLength; col++) {
        const x = startX + col * (this.cellSize + this.padding);
        const y = startY + row * (this.cellSize + this.padding);
        
        // Draw cell background
        if (this.colors[row][col]) {
          this.ctx.fillStyle = this.colors[row][col];
        } else {
          this.ctx.fillStyle = this.colors.background;
        }
        
        this.ctx.fillRect(x, y, this.cellSize, this.cellSize);
        
        // Draw border
        this.ctx.strokeStyle = row === this.currentRow && col === this.currentCol && !this.gameOver ? '#ffffff' : this.colors.border;
        this.ctx.lineWidth = this.borderWidth;
        this.ctx.strokeRect(x, y, this.cellSize, this.cellSize);
        
        // Draw letter
        if (this.grid[row][col]) {
          this.ctx.fillStyle = this.colors[row][col] ? this.colors.text : '#000000';
          this.ctx.font = `bold ${this.fontSize}px "Press Start 2P", cursive`;
          this.ctx.textAlign = 'center';
          this.ctx.textBaseline = 'middle';
          this.ctx.fillText(this.grid[row][col], x + this.cellSize / 2, y + this.cellSize / 2);
        }
      }
    }
  }
  
  drawKeyboard() {
    const keyboardWidth = 500;
    const keyboardHeight = 200;
    const keyWidth = 45;
    const keyHeight = 50;
    const keyPadding = 6;
    const startX = (this.width - keyboardWidth) / 2;
    const startY = this.height - keyboardHeight - 50;
    
    // Draw each row of the keyboard
    for (let row = 0; row < this.keyboardLayout.length; row++) {
      const keys = this.keyboardLayout[row];
      const rowWidth = keys.reduce((width, key) => {
        return width + (key.length > 1 ? 1.5 * keyWidth : keyWidth) + keyPadding;
      }, 0) - keyPadding;
      
      let x = startX + (keyboardWidth - rowWidth) / 2;
      const y = startY + row * (keyHeight + keyPadding);
      
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const width = key.length > 1 ? 1.5 * keyWidth : keyWidth;
        
        // Draw key background
        this.ctx.fillStyle = this.keyboard[key] || '#818384';
        this.ctx.fillRect(x, y, width, keyHeight);
        
        // Draw key text
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = `bold ${key.length > 1 ? 14 : 20}px "Press Start 2P", cursive`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(key, x + width / 2, y + keyHeight / 2);
        
        x += width + keyPadding;
      }
    }
  }
  
  drawMessage() {
    if (this.message) {
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = `${this.smallFontSize}px "Press Start 2P", cursive`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(this.message, this.width / 2, 40);
    }
    
    if (this.gameOver) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      this.ctx.fillRect(0, 0, this.width, this.height);
      
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = '24px "Press Start 2P", cursive';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(this.win ? 'YOU WIN!' : 'GAME OVER', this.width / 2, this.height / 2 - 50);
      
      this.ctx.font = '16px "Press Start 2P", cursive';
      this.ctx.fillText(`The word was: ${this.targetWord}`, this.width / 2, this.height / 2);
      this.ctx.fillText('Press ENTER to play again', this.width / 2, this.height / 2 + 50);
    }
  }
  
  draw() {
    // Clear canvas
    this.ctx.fillStyle = this.colors.background;
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // Draw grid
    this.drawGrid();
    
    // Draw keyboard
    this.drawKeyboard();
    
    // Draw message
    this.drawMessage();
  }
  
  // Public method to stop the game
  stop() {
    document.removeEventListener('keydown', this.keyDown);
    this.gameOver = true;
  }
}
