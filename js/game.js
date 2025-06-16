// js/game.js

let secretNumber = Math.floor(Math.random() * 10) + 1;

export function checkGuess() {
    const guessInput = document.getElementById('guessInput');
    const guess = parseInt(guessInput.value, 10);
    const result = document.getElementById('guessResult');

    if (isNaN(guess) || guess < 1 || guess > 10) {
        result.textContent = "Veuillez entrer un nombre valide entre 1 et 10.";
        result.style.color = 'orange';
    } else if (guess === secretNumber) {
        result.textContent = "🥳 Bravo ! Tu as trouvé ! Le nombre était " + secretNumber + ".";
        result.style.color = 'var(--primary-color)';
        secretNumber = Math.floor(Math.random() * 10) + 1;
        guessInput.value = '';
    } else {
        result.textContent = `😕 Raté, ${guess < secretNumber ? 'trop petit' : 'trop grand'} ! Essaie encore.`;
        result.style.color = '#D32F2F';
    }
    guessInput.focus();
}

// Puisque checkGuess est appelé directement via onclick dans HTML,
// nous devons le rendre accessible globalement via window.
// C'est une exception pour les modules, car onclick ne comprend pas les exports de modules.
window.checkGuess = checkGuess;