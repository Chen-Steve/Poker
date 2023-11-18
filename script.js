const cardSymbols = {
    'hearts': ['2♥', '3♥', '4♥', '5♥', '6♥', '7♥', '8♥', '9♥', '10♥', 'J♥', 'Q♥', 'K♥', 'A♥'],
    'diamonds': ['2♦', '3♦', '4♦', '5♦', '6♦', '7♦', '8♦', '9♦', '10♦', 'J♦', 'Q♦', 'K♦', 'A♦'],
    'clubs': ['2♣', '3♣', '4♣', '5♣', '6♣', '7♣', '8♣', '9♣', '10♣', 'J♣', 'Q♣', 'K♣', 'A♣'],
    'spades': ['2♠', '3♠', '4♠', '5♠', '6♠', '7♠', '8♠', '9♠', '10♠', 'J♠', 'Q♠', 'K♠', 'A♠'],
};

let playerHand = [];
let dealerHand = [];
let playerWins = 0;
let dealerWins = 0;
let dealButtonClicked = false;

document.getElementById('deal-button').addEventListener('click', deal);
document.getElementById('hit-button').addEventListener('click', playerHit);
document.getElementById('stand-button').addEventListener('click', dealerPlay);
document.getElementById('replay-button').addEventListener('click', resetGame);

function getCardSymbol(card) {
    const rank = card.rank;
    const suit = card.suit;
    return cardSymbols[suit][rank - 2]; // Adjust rank index (2-based)
}

function displayCard(containerId, cardSymbol) {
    const container = document.getElementById(containerId);
    const cardText = document.createElement('div');
    cardText.textContent = cardSymbol;
    container.appendChild(cardText);
}

function displayHands() {
    // Clear previous card displays
    document.getElementById('player-hand').innerHTML = '<strong>User:</strong>';
    document.getElementById('dealer-hand').innerHTML = '<strong>Dealer:</strong>';

    // Display player's cards
    for (const card of playerHand) {
        displayCard('player-hand', getCardSymbol(card));
    }

    // Display dealer's first card (hide the second card)
    displayCard('dealer-hand', getCardSymbol(dealerHand[0]));
}

// Define a deck of cards
let deck = [];

// Function to initialize the deck with all cards
function initializeDeck() {
    for (const suit of Object.keys(cardSymbols)) {
        for (let rank = 2; rank <= 14; rank++) {
            deck.push({ rank, suit });
        }
    }
}

function deal() {
    // Check if the deck is empty or if "Deal" button has already been clicked
    if (deck.length === 0 || dealButtonClicked) {
        // Reshuffle the deck if needed (you can implement shuffleDeck() function)
        initializeDeck();
        // Add additional logic here if you want to reshuffle in the middle of the game.
    }

    // Clear previous hands
    playerHand = [];
    dealerHand = [];
    
    // Deal two cards to the player and dealer
    playerHand.push(getRandomCard());
    playerHand.push(getRandomCard());
    dealerHand.push(getRandomCard());
    dealerHand.push(getRandomCard());

    // Update the UI to display the cards
    displayHands();

    // Disable the "Deal" button and enable "Hit" and "Stand"
    document.getElementById('deal-button').disabled = true;
    document.getElementById('hit-button').disabled = false;
    document.getElementById('stand-button').disabled = false;

    // Set dealButtonClicked to true
    dealButtonClicked = true;
}

function playerHit() {
    // Add a card to the player's hand
    playerHand.push(getRandomCard());

    // Update the UI to display the cards
    displayHands();

    // Check if the player has busted (sum of cards > 21)
    if (getHandValue(playerHand) > 21) {
        // Player has busted, increase dealer's wins by 1 and reset the game
        dealerWins++;
        resetGame();
    }
}

function getRandomCard() {
    // Check if the deck is empty
    if (deck.length === 0) {
        initializeDeck(); // Reshuffle the deck if it's empty
    }

    // Shuffle the deck using Fisher-Yates algorithm
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]]; // Swap elements
    }

    // Get and remove the last card from the shuffled deck
    const card = deck.pop();

    return card;
}

function dealerPlay() {
    while (getHandValue(dealerHand) < 17) {
        // Dealer hits
        dealerHand.push(getRandomCard());
    }

    // Update the UI to display the cards
    displayHands();

    // Determine the winner
    determineWinner();
}

function updateScores() {
    document.getElementById('player-score').textContent = `Wins: ${playerWins}`;
    document.getElementById('dealer-score').textContent = `Losses: ${dealerWins}`;
}

function checkWinner() {
    const playerValue = getHandValue(playerHand);
    const dealerValue = getHandValue(dealerHand);

    if (playerValue > 21) {
        // Player busts, dealer wins
        endGame(false);
    } else if (dealerValue > 21 || playerValue > dealerValue) {
        // Player wins
        endGame(true);
    } else if (playerValue < dealerValue) {
        // Dealer wins
        endGame(false);
    } else {
        // It's a tie
        endGame(null);
    }
}

function resetGame() {
    // Clear hands
    playerHand = [];
    dealerHand = [];
    
    // Update the UI to clear cards and messages
    displayHands();
    
    // Enable game controls
    document.getElementById('deal-button').disabled = false;
    document.getElementById('hit-button').disabled = true;
    document.getElementById('stand-button').disabled = true;

    // Reset dealButtonClicked to false
    dealButtonClicked = false;

    // Update the UI to display scores
    updateScores();
}