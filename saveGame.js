document.addEventListener('DOMContentLoaded', () => {
    const playerScore = loadScore();
    document.getElementById('score').textContent = playerScore;
});

function saveScore(score) {
    try {
        localStorage.setItem('playerScore', score.toString());
    } catch (e) {
        console.error('Failed to save score:', e);
    }
}

function loadScore() {
    try {
        const savedScore = localStorage.getItem('playerScore');
        return savedScore ? parseInt(savedScore, 10) : 0;
    } catch (e) {
        console.error('Failed to load score:', e);
        return 0;
    }
}

function resetScore() {
    try {
        localStorage.removeItem('playerScore');
    } catch (e) {
        console.error('Failed to reset score:', e);
    }
}