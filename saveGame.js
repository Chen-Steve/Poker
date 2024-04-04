document.addEventListener('DOMContentLoaded', () => {
    // Load the score when the document is ready
    const playerScore = loadScore();
    document.getElementById('score').textContent = playerScore;

    // Add a single event listener for the Save button
    document.getElementById('save-score-btn').addEventListener('click', () => {
        // Grab the current score from the display
        const currentScore = parseInt(document.getElementById('score').textContent, 10);
        // Save the current score
        saveScore(currentScore);
        // Show the save confirmation message
        showSaveConfirmation();
    });
});

function showSaveConfirmation() {
    // Create the confirmation message element
    const confirmationMessage = document.createElement('div');
    confirmationMessage.textContent = 'Score saved!';
    confirmationMessage.classList.add('save-confirmation');
    document.body.appendChild(confirmationMessage);
    // Set a timer to remove the message after 3 seconds
    setTimeout(() => {
        confirmationMessage.remove();
    }, 3000);
}

function saveScore(score) {
    try {
        // Attempt to save the score to localStorage
        localStorage.setItem('playerScore', score.toString());
    } catch (e) {
        // Log any errors to the console
        console.error('Failed to save score:', e);
    }
}

function loadScore() {
    try {
        // Attempt to load the score from localStorage
        const savedScore = localStorage.getItem('playerScore');
        return savedScore ? parseInt(savedScore, 10) : 0;
    } catch (e) {
        // Log any errors to the console and return a default score of 0
        console.error('Failed to load score:', e);
        return 0;
    }
}

function resetScore() {
    try {
        // Attempt to remove the saved score from localStorage
        localStorage.removeItem('playerScore');
    } catch (e) {
        // Log any errors to the console
        console.error('Failed to reset score:', e);
    }
}