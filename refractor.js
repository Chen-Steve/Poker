class Card {
    constructor(rank, suit) {
      this.rank = rank;
      this.suit = suit;
    }
  
    getSymbol() {
      const suits = { 'C': '♣', 'D': '♦', 'H': '♥', 'S': '♠' };
      return `${this.rank}${suits[this.suit]}`;
    }
  
    getValue() {
      if ('JQK'.includes(this.rank)) {
        return 10;
      } else if (this.rank === 'A') {
        return [1, 11]; // Ace can be 1 or 11
      }
      return parseInt(this.rank);
    }
  }
  
  class Deck {
    constructor() {
      this.cards = [];
      this.initialize();
    }
  
    initialize() {
      const suits = ['C', 'D', 'H', 'S'];
      const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  
      suits.forEach(suit => {
        ranks.forEach(rank => {
          this.cards.push(new Card(rank, suit));
        });
      });
  
      this.shuffle();
    }
  
    shuffle() {
      for (let i = this.cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]]; // ES6 destructuring assignment
      }
    }
  
    draw() {
      if (this.cards.length > 0) {
        return this.cards.pop();
      } else {
        // Handle the case where the deck is empty
        console.error("The deck is empty!");
        return null;
      }
    }
  }

// Player - Dealer
class Player {
    constructor(name) {
      this.name = name;
      this.hand = [];
      this.score = 0;
    }
  
    addCard(card) {
      this.hand.push(card);
      this.updateScore();
    }
  
    updateScore() {
      let values = this.hand.map(card => card.getValue());
      let score = 0;
      let aces = 0;
  
      values.forEach(value => {
        if (Array.isArray(value)) { // Handle Ace
          aces += 1;
          score += 11; // Assume Ace is 11 initially
        } else {
          score += value;
        }
      });
  
      while (score > 21 && aces > 0) { // Adjust for Aces
        score -= 10;
        aces -= 1;
      }
  
      this.score = score;
    }
  
    reset() {
      this.hand = [];
      this.score = 0;
    }
  }

// Game 
class BlackjackGame {
    constructor() {
      this.deck = new Deck();
      this.players = {
        you: new Player('You'),
        dealer: new Player('Dealer')
      };
      this.currentBet = 0;
      this.playerFunds = 1000;
      this.insurance = false;
      this.initializeUI();
    }
  
    initializeUI() {
      document.getElementById('placeBet').addEventListener('click', () => this.placeBet());
      document.getElementById('hit').addEventListener('click', () => this.hit('you'));
      document.getElementById('stand').addEventListener('click', () => this.stand());
      document.getElementById('deal').addEventListener('click', () => this.startGame());
      this.updateFundsDisplay();
    }
  
    placeBet() {
      const betAmount = parseInt(document.getElementById('betAmount').value);
      if (isNaN(betAmount) || betAmount <= 0 || betAmount > this.playerFunds) {
        alert("Invalid bet amount!");
        return;
      }
      this.currentBet = betAmount;
      this.playerFunds -= betAmount; // Deduct the bet from player's funds
      this.updateFundsDisplay();
      this.dealCards();
      document.getElementById('hit').disabled = false;
      document.getElementById('stand').disabled = false;
    }
  
    dealCards() {
      this.deck.initialize();
      this.deck.shuffle();
      this.players.you.reset();
      this.players.dealer.reset();
      this.hit('you');
      this.hit('dealer');
      this.hit('you');
      this.hit('dealer', true); // Dealer's second card is hidden initially
    }
  
    hit(playerName, hideCard = false) {
      const player = this.players[playerName];
      if (player && player.score < 21) {
        const card = this.deck.draw();
        player.addCard(card);
        this.updatePlayerUI(player, hideCard);
        if (player.score > 21) {
          this.endRound();
        }
      }
    }
  
    stand() {
      let dealer = this.players.dealer;
      // Reveal dealer's hidden card
      this.updatePlayerUI(dealer, false, true); // Second parameter indicates hiding, third parameter forces update
      
      while (dealer.score < 17) {
        this.hit('dealer');
      }
  
      this.endRound();
    }
  
    endRound() {
      const you = this.players.you;
      const dealer = this.players.dealer;
      let message, color;
  
      if ((you.score <= 21 && you.score > dealer.score) || dealer.score > 21) {
        this.playerFunds += this.currentBet * 2; // Player wins and gets 2x bet back
        message = "You Won!";
        color = "green";
      } else if (you.score < dealer.score && dealer.score <= 21) {
        this.playerFunds -= this.currentBet * 0.5; // Player loses and loses an additional 0.5x bet
        message = "You Lost!";
        color = "red";
      } else if (you.score === dealer.score) {
        this.playerFunds += this.currentBet; // Draw, player gets bet back
        message = "You Drew!";
        color = "blue";
      } else if (you.score > 21) {
        this.playerFunds -= this.currentBet * 0.5; // Player busts
        message = "You Busted!";
        color = "red";
      }
  
      this.updateResultDisplay(message, color);
      this.updateFundsDisplay();
      this.resetForNextRound();
    }
  
    updatePlayerUI = function(player, hideSecondCard = false, forceUpdate = false) {
        const playerBoxId = player.name === 'You' ? 'your-box' : 'dealer-box';
        const scoreSpanId = player.name === 'You' ? 'yourscore' : 'dealerscore';
        const playerBox = document.getElementById(playerBoxId);
        const scoreSpan = document.getElementById(scoreSpanId);
      
        // Clear the current hand display
        playerBox.innerHTML = `<h2>${player.name}'s Hand</h2>`;
      
        // Iterate through the player's hand to display cards
        player.hand.forEach((card, index) => {
          if (hideSecondCard && index === 1 && player.name !== 'You') { // Hide dealer's second card initially
            playerBox.innerHTML += `<div class="card back"></div>`; // Assuming 'back' class shows a card back
          } else {
            const cardDiv = document.createElement('div');
            cardDiv.classList.add('card');
            cardDiv.textContent = card.getSymbol(); // Assuming you want to show card symbols like "A♠"
            playerBox.appendChild(cardDiv);
          }
        });
      
        // Update the score display, check for forceUpdate to reveal dealer's second card
        if (!hideSecondCard || forceUpdate) {
          scoreSpan.textContent = player.score;
        }
      
        // If we're updating to show the dealer's second card, refresh the entire dealer's hand
        if (forceUpdate && player.name !== 'You') {
          this.updatePlayerUI(player, false);
        }
      };
      
  
    updateResultDisplay(message, color) {
      document.getElementById('command').textContent = message;
      document.getElementById('command').style.color = color;
    }
  
    updateFundsDisplay() {
      document.getElementById('funds').textContent = this.playerFunds;
    }
  
    resetForNextRound() {
      // Reset UI and game state for the next round
      document.getElementById('hit').disabled = true;
      document.getElementById('stand').disabled = true;
      // Further UI resets as needed
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const blackjackGame = new BlackjackGame();
  });
  