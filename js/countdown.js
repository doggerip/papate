// js/countdown.js
import { targetDate, startDate } from './config.js'; // Importer les dates de config.js

let countdownInterval; // Déclarez la variable ici pour qu'elle puisse être arrêtée

export function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;
    const countdownElement = document.getElementById('countdown');

    if (distance < 0) {
        clearInterval(countdownInterval);
        countdownElement.innerHTML = "L'événement est arrivé !";
        document.querySelector('.progress-container').style.display = 'none';
    } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        countdownElement.innerHTML = `${days}j ${hours}h ${minutes}m ${seconds}s`;
    }
}

export function updateProgressBar() {
    const now = new Date().getTime();
    const totalDuration = targetDate - startDate;
    let elapsed = now - startDate;
    let percent;

    if (elapsed < 0) {
        percent = 0;
    } else if (now >= targetDate) {
        percent = 100;
        document.getElementById('progressBar').style.display = 'none';
        document.querySelector('.progress-text').textContent = "L'événement est terminé !";
    } else {
        percent = (elapsed / totalDuration) * 100;
        percent = Math.min(100, Math.max(0, percent));
        document.querySelector('.progress-text').textContent = "Progression vers la date cible";
        document.getElementById('progressBar').style.display = 'block';
    }
    document.getElementById('progressBar').style.width = percent + "%";
}

// Fonction pour démarrer le compte à rebours et la barre de progression (appelée depuis main.js)
export function startCountdownAndProgress() {
    updateCountdown(); // Appel initial
    updateProgressBar(); // Appel initial
    countdownInterval = setInterval(() => { // Assignez l'intervalle à la variable
        updateCountdown();
        updateProgressBar();
    }, 1000);
}