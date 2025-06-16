// --- Configuration du compte à rebours ---
// Définissez la date et l'heure cibles
// Format: 'YYYY-MM-DDTHH:MM:SS' (Ex: '2025-12-31T23:59:59')
const targetDate = new Date('2025-12-31T23:59:59').getTime(); // Exemple: Fin de l'année 2025

// --- Fonction de mise à jour du compte à rebours ---
function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const countdownElement = document.getElementById('countdown');

    if (distance < 0) {
        clearInterval(countdownInterval);
        countdownElement.innerHTML = "L'événement est arrivé !";
    } else {
        countdownElement.innerHTML = `${days}j ${hours}h ${minutes}m ${seconds}s`;
    }
}

// --- Fonction pour obtenir l'heure formatée selon le fuseau horaire ---
function getFormattedTime(timeZone) {
    const options = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false, // Format 24 heures
        timeZone: timeZone
    };
    return new Date().toLocaleTimeString('fr-FR', options);
}

// --- Fonction de mise à jour des heures ---
function updateTimes() {
    document.getElementById('frenchTime').innerHTML = getFormattedTime('Europe/Paris');
    document.getElementById('canadianTime').innerHTML = getFormattedTime('America/Montreal');
}
// --- Lancement des mises à jour ---
updateCountdown(); // Appel initial pour éviter un délai d'une seconde au démarrage
updateTimes();     // Appel initial pour afficher les heures immédiatement

const countdownInterval = setInterval(updateCountdown, 1000); // Mise à jour toutes les secondes pour le compte à rebours
setInterval(updateTimes, 1000); // Mise à jour toutes les secondes pour les heures

function updateBackground() {
    const hour = new Date().getHours();
    if (hour >= 7 && hour < 20) {
        document.body.style.background = "#e0f7fa"; // Jour
    } else {
        document.body.style.background = "#263238"; // Nuit
    }
}
updateBackground();
setInterval(updateBackground, 60000);

function updateProgressBar() {
    const now = new Date().getTime();
    const total = targetDate - (new Date('2025-01-01T00:00:00').getTime());
    const elapsed = now - (new Date('2025-01-01T00:00:00').getTime());
    const percent = Math.min(100, Math.max(0, (elapsed / total) * 100));
    document.getElementById('progressBar').style.width = percent + "%";
}
updateProgressBar();
setInterval(updateProgressBar, 1000);

function getPersonalizedMessage(hour) {
    if (hour < 6) return "Bonne nuit !";
    if (hour < 12) return "Bonjour !";
    if (hour < 18) return "Bon après-midi !";
    return "Bonne soirée !";
}
function updateMessages() {
    const nantesHour = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', hour12: false, timeZone: 'Europe/Paris' });
    const montrealHour = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', hour12: false, timeZone: 'America/Montreal' });
    document.getElementById('messageNantes').textContent = "Nantes : " + getPersonalizedMessage(parseInt(nantesHour, 10));
    document.getElementById('messageMontreal').textContent = "Montréal : " + getPersonalizedMessage(parseInt(montrealHour, 10));
}
updateMessages();
setInterval(updateMessages, 60000);