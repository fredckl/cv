// Games Modal Manager
import { Snake } from './snake.js';
import { SpaceInvaders } from './space-invaders.js';
import { Wordle } from './wordle.js';

export class GamesModal {
  constructor() {
    this.modal = null;
    this.activeGame = null;
    this.keyPressTimer = null;
    this.keyPressDelay = 500; // 500ms pour un appui prolongé
    this.games = [
      { id: 'snake', name: 'Snake', class: Snake },
      { id: 'space-invaders', name: 'Space Invaders', class: SpaceInvaders },
      { id: 'wordle', name: 'Wordle', class: Wordle }
    ];
    
    this.init();
  }
  
  init() {
    // Créer la modale
    this.createModal();
    
    // Ajouter les gestionnaires d'événements
    this.setupEventListeners();
  }
  
  createModal() {
    // Créer l'élément de modale
    this.modal = document.createElement('div');
    this.modal.id = 'games-modal';
    this.modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 hidden';
    
    // Créer le contenu de la modale
    const modalContent = document.createElement('div');
    modalContent.className = 'bg-gray-900 border-4 border-gray-700 rounded-lg p-6 w-full max-w-4xl';
    
    // Créer l'en-tête de la modale
    const modalHeader = document.createElement('div');
    modalHeader.className = 'flex justify-between items-center mb-6';
    
    const modalTitle = document.createElement('h2');
    modalTitle.className = 'text-white text-2xl font-bold';
    modalTitle.textContent = 'Arcade Games';
    modalTitle.style.fontFamily = '"Press Start 2P", cursive';
    
    const closeButton = document.createElement('button');
    closeButton.className = 'text-white hover:text-gray-300 focus:outline-none';
    closeButton.innerHTML = '<i class="fas fa-times text-xl"></i>';
    closeButton.onclick = () => this.closeModal();
    
    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeButton);
    
    // Créer la liste des jeux
    const gamesList = document.createElement('div');
    gamesList.id = 'games-list';
    gamesList.className = 'grid grid-cols-2 gap-4 mb-6';
    
    // Ajouter chaque jeu à la liste
    this.games.forEach(game => {
      const gameCard = document.createElement('div');
      gameCard.className = 'bg-gray-800 hover:bg-gray-700 border-2 border-gray-600 rounded-lg p-4 cursor-pointer transition-colors';
      gameCard.dataset.game = game.id;
      
      const gameName = document.createElement('h3');
      gameName.className = 'text-white text-center text-lg mb-2';
      gameName.style.fontFamily = '"Press Start 2P", cursive';
      gameName.textContent = game.name;
      
      gameCard.appendChild(gameName);
      gameCard.onclick = () => this.startGame(game.id);
      
      gamesList.appendChild(gameCard);
    });
    
    // Créer le conteneur de jeu
    const gameContainer = document.createElement('div');
    gameContainer.id = 'game-container';
    gameContainer.className = 'hidden';
    
    const gameCanvas = document.createElement('canvas');
    gameCanvas.id = 'game-canvas';
    gameCanvas.width = 800;
    gameCanvas.height = 600;
    gameCanvas.className = 'bg-black border-2 border-gray-600 rounded-lg mx-auto block';
    
    const backButton = document.createElement('button');
    backButton.id = 'back-to-games';
    backButton.className = 'mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg';
    backButton.style.fontFamily = '"Press Start 2P", cursive';
    backButton.textContent = 'Back to Games';
    backButton.onclick = () => this.showGamesList();
    
    gameContainer.appendChild(gameCanvas);
    gameContainer.appendChild(backButton);
    
    // Assembler la modale
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(gamesList);
    modalContent.appendChild(gameContainer);
    this.modal.appendChild(modalContent);
    
    // Ajouter la modale au document
    document.body.appendChild(this.modal);
  }
  
  setupEventListeners() {
    // Gestionnaire pour l'appui prolongé sur la touche "g"
    document.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 'g' && !this.keyPressTimer) {
        this.keyPressTimer = setTimeout(() => {
          this.openModal();
        }, this.keyPressDelay);
      }
    });
    
    document.addEventListener('keyup', (e) => {
      if (e.key.toLowerCase() === 'g') {
        clearTimeout(this.keyPressTimer);
        this.keyPressTimer = null;
      }
    });
    
    // Fermer la modale avec Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.modal.classList.contains('hidden')) {
        this.closeModal();
      }
    });
    
    // Empêcher la propagation des événements clavier depuis la modale
    this.modal.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || 
          e.key === 'ArrowLeft' || e.key === 'ArrowRight' || 
          e.key === ' ') {
        e.stopPropagation();
      }
    });
  }
  
  openModal() {
    this.modal.classList.remove('hidden');
    this.showGamesList();
  }
  
  closeModal() {
    this.stopActiveGame();
    this.modal.classList.add('hidden');
  }
  
  showGamesList() {
    this.stopActiveGame();
    
    const gamesList = document.getElementById('games-list');
    const gameContainer = document.getElementById('game-container');
    
    gamesList.classList.remove('hidden');
    gameContainer.classList.add('hidden');
  }
  
  startGame(gameId) {
    const gamesList = document.getElementById('games-list');
    const gameContainer = document.getElementById('game-container');
    
    gamesList.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    
    // Arrêter le jeu actif s'il existe
    this.stopActiveGame();
    
    // Trouver le jeu correspondant
    const gameInfo = this.games.find(game => game.id === gameId);
    
    if (gameInfo) {
      // Instancier le jeu
      this.activeGame = new gameInfo.class('game-canvas');
    }
  }
  
  stopActiveGame() {
    if (this.activeGame && typeof this.activeGame.stop === 'function') {
      this.activeGame.stop();
      this.activeGame = null;
    }
  }
}
