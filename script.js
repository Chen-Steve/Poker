let BJgame = {
    'you': {'scoreSpan': '#yourscore' , 'div': '#your-box', 'score': 0},
    'dealer': {'scoreSpan': '#dealerscore' , 'div': '#dealer-box', 'score': 0},
    
    'cards': ['2C','3C','4C','5C','6C','7C','8C','9C','10C','KC','QC','JC','AC','2D','3D','4D','5D','6D','7D','8D','9D','10D','KD','QD','JD','AD','2H','3H','4H','5H','6H','7H','8H','9H','10H','KH','QH','JH','AH','2S','3S','4S','5S','6S','7S','8S','9S','10S','KS','QS','JS','AS'],
    
    'cardsmap': {'2C':2,'3C':3,'4C':4,'5C':5,'6C':6,'7C':7,'8C':8,'9C':9,'10C':10,'KC':10,'QC':10,'JC':10,'AC':[1, 11],'2D':2,'3D':3,'4D':4,'5D':5,'6D':6,'7D':7,'8D':8,'9D':9,'10D':10,'KD':10,'QD':10,'JD':10,'AD':[1, 11],'2H':2,'3H':3,'4H':4,'5H':5,'6H':6,'7H':7,'8H':8,'9H':9,'10H':10,'KH':10,'QH':10,'JH':10,'AH':[1, 11],'2S':2,'3S':3,'4S':4,'5S':5,'6S':6,'7S':7,'8S':8,'9S':9,'10S':10,'KS':10,'QS':10,'JS':10,'AS':[1, 11]},

    'wins':0,
    'losses':0,
    'draws':0
};

const cardSymbols = {
    'hearts': ['2♥', '3♥', '4♥', '5♥', '6♥', '7♥', '8♥', '9♥', '10♥', 'J♥', 'Q♥', 'K♥', 'A♥'],
    'diamonds': ['2♦', '3♦', '4♦', '5♦', '6♦', '7♦', '8♦', '9♦', '10♦', 'J♦', 'Q♦', 'K♦', 'A♦'],
    'clubs': ['2♣', '3♣', '4♣', '5♣', '6♣', '7♣', '8♣', '9♣', '10♣', 'J♣', 'Q♣', 'K♣', 'A♣'],
    'spades': ['2♠', '3♠', '4♠', '5♠', '6♠', '7♠', '8♠', '9♠', '10♠', 'J♠', 'Q♠', 'K♠', 'A♠'],
};

function displayCard(containerId, cardSymbol) {
    const container = document.getElementById(containerId);
    const cardText = document.createElement('div');
    cardText.textContent = cardSymbol;
    container.appendChild(cardText);
}

function displayHands() {
    // Clear previous card displays
    document.getElementById('your-box').innerHTML = '<h2>Your Hand</h2>';
    document.getElementById('dealer-box').innerHTML = '<h2>Dealer\'s Hand</h2>';

    // Display player's cards
    for (const card of You['cards']) {
        displayCard('your-box', card);
    }

    // Display dealer's first card (hide the second card)
    displayCard('dealer-box', You['cards'][0]);
}

let deck = [];

// Function to initialize the deck with all cards
function initializeDeck() {
    for (const suit of Object.keys(cardSymbols)) {
        for (let rank = 2; rank <= 14; rank++) {
            deck.push({ rank, suit });
        }
    }
}

const You = BJgame['you'];
const Dealer = BJgame['dealer'];

const tink = new Audio('./static/sounds/tink.wav');

function drawCard(activePlayer) {
    const randomNumber = Math.floor(Math.random() * BJgame['cards'].length);
    const currentCard = BJgame['cards'].splice(randomNumber, 1)[0]; // Extract the card symbol

    const cardSuit = currentCard.slice(-1); // Get the last character for suit
    const cardNumber = currentCard.slice(0, -1); // Get all except the last character for number

    let suitName;
    switch(cardSuit) {
        case 'C': suitName = 'clubs'; break;
        case 'D': suitName = 'diamonds'; break;
        case 'H': suitName = 'hearts'; break;
        case 'S': suitName = 'spades'; break;
        default: suitName = ''; break;
    }

    let imageName = `${suitName}_`;
    if (['J', 'Q', 'K', 'A'].includes(cardNumber)) {
        switch(cardNumber) {
            case 'J': imageName += 'jack'; break;
            case 'Q': imageName += 'queen'; break;
            case 'K': imageName += 'king'; break;
            case 'A': imageName += 'ace'; break;
        }
    } else {
        imageName += cardNumber;
    }
    imageName += '.png';

    const cardImage = document.createElement('img');
    cardImage.src = `svg_playing_cards/fronts/pngVersion/${imageName}`; // Set the source to the card image
    cardImage.classList.add('card-image'); // Add a class for styling
    document.querySelector(activePlayer['div']).appendChild(cardImage); // Append the card image to the player's div

    hitsound.play();

    // Update Score
    updateScore(currentCard, activePlayer);

    // Show Score
    showScore(activePlayer);
}


function getCardSymbol(card) {
    for (const suit of Object.keys(cardSymbols)) {
        for (const symbol of cardSymbols[suit]) {
            if (card === symbol) {
                return symbol;
            }
        }
    }
    return ''; // Return an empty string if the card is not found
}

function showScore(activeplayer) {
    if (activeplayer['score'] > 21) {
        document.querySelector(activeplayer['scoreSpan']).textContent = 'BUST!';
        document.querySelector(activeplayer['scoreSpan']).style.color = 'yellow';
    } else {
        document.querySelector(activeplayer['scoreSpan']).textContent = activeplayer['score'];
    }
}

document.querySelector('#hit').addEventListener('click', BJhit);

const hitsound = new Audio('./static/sounds/swish.m4a');

function BJhit() {
    if (Dealer['score'] === 0) {
        if (You['score'] <= 21) {
            drawCard(You);
        }
    }
}

function updateScore(currentCard, activeplayer) {
    // Extract the card rank from the card symbol
    const rank = currentCard.slice(0, -1);

    // Check if the rank is an Ace
    if (rank === 'A') {
        // Determine if using 11 points would bust the player
        if (activeplayer['score'] + 11 <= 21) {
            activeplayer['score'] += 11;
        } else {
            activeplayer['score'] += 1;
        }
    } else if (rank === 'K' || rank === 'Q' || rank === 'J') {
        // Face cards are worth 10 points
        activeplayer['score'] += 10;
    } else {
        // Other cards are worth their face value
        activeplayer['score'] += parseInt(rank);
    }
}

function showScore(activeplayer){
    if(activeplayer['score']>21){
        document.querySelector(activeplayer['scoreSpan']).textContent = 'BUST!';
        document.querySelector(activeplayer['scoreSpan']).style.color = 'yellow';
    }
    else{
        document.querySelector(activeplayer['scoreSpan']).textContent = activeplayer['score'];
    }
}

// Compute Winner Function
function findwinner(){
    let winner;

    if(You['score']<=21){
        if(Dealer['score']<You['score'] || Dealer['score']>21){
            BJgame['wins']++;
            winner = You;
        }
        else if(Dealer['score'] == You['score']){
            BJgame['draws']++;
        }
        else{
            BJgame['losses']++;
            winner = Dealer;
        }
    }
    else if(You['score']>21 && Dealer['score']<=21){
        BJgame['losses']++;
        winner = Dealer;
    }
    else if(You['score']>21 && Dealer['score']>21){
        BJgame['draws']++;
    }
    return winner;
}

// Results
const winSound = new Audio('./static/sounds/cash.mp3'); 
const cheers = new Audio('./static/sounds/cheer.wav');
const loseSound = new Audio('./static/sounds/aww.mp3');
const drawSound = new Audio('./static/sounds/ohh.mp3');

function showresults(winner){
    if(winner == You){
        document.querySelector('#command').textContent = 'You Won!';
        document.querySelector('#command').style.color = 'green';
        winSound.play();
        cheers.play();
        cheers.volume = 0.4;
    }
    else if(winner == Dealer){
        document.querySelector('#command').textContent = "You Lost!";
        document.querySelector('#command').style.color = 'red';
        loseSound.play();
    }
    else{
        document.querySelector('#command').textContent = 'You Drew!';
        document.querySelector('#command').style.color = 'orange';
        drawSound.play();
    }

}

// Scoreboard
function scoreboard(){
    document.querySelector('#wins').textContent = BJgame['wins'];
    document.querySelector('#losses').textContent = BJgame['losses'];
    document.querySelector('#draws').textContent = BJgame['draws'];
}

// Hit Button (starting)
document.querySelector('#hit').addEventListener('click', BJhit);

function BJhit() {
    if (Dealer['score'] === 0) {
        if (You['score'] <= 21) {
            drawCard(You);
        }
    }
}

document.querySelector('#deal').addEventListener('click', BJdeal);

function BJdeal() {
    if (You['score'] === 0) {
        alert('Please Hit Some Cards First!');
    } else if (Dealer['score'] === 0) {
        alert('Please Press Stand Key Before Deal...');
    } else {
        let yourimg = document.querySelector('#your-box').querySelectorAll('img');
        let dealerimg = document.querySelector('#dealer-box').querySelectorAll('img');

        for (let i = 0; i < yourimg.length; i++) {
            yourimg[i].remove();
        }
        for (let i = 0; i < dealerimg.length; i++) {
            dealerimg[i].remove();
        }

        You['cards'] = [];
        Dealer['cards'] = [];

        You['score'] = 0;
        document.querySelector(You['scoreSpan']).textContent = You['score'];
        document.querySelector(You['scoreSpan']).style.color = 'whitesmoke';
        Dealer['score'] = 0;
        document.querySelector(Dealer['scoreSpan']).textContent = Dealer['score'];
        document.querySelector(Dealer['scoreSpan']).style.color = 'whitesmoke';

        document.querySelector('#command').textContent = "Let's Play";
        document.querySelector('#command').style.color = 'black';
    }
}

// Dealer's Logic (2nd player) OR Stand button
document.querySelector('#stand').addEventListener('click', BJstand);

function BJstand() {
    if (You['score'] === 0) {
        alert('Please Hit Some Cards First!');
    } else {
        while (Dealer['score'] < 16) {
            drawCard(Dealer);
        }
        setTimeout(function () {
            showresults(findwinner());
            scoreboard();
        }, 800);
    }
}

// Initialize the deck and start the game
initializeDeck();
resetGame();