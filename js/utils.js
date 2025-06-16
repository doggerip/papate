// js/utils.js

export function getFormattedTime(timeZone) {
    const options = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: timeZone
    };
    return new Date().toLocaleTimeString('fr-FR', options);
}

export function getPersonalizedMessage(hour) {
    if (hour >= 5 && hour < 10) return "Bon matin !"; // Matin
    if (hour >= 10 && hour < 17) return "Bonne journée !"; // Journée
    if (hour >= 17 && hour < 22) return "Bonne soirée !"; // Soirée
    return "Bonne nuit !"; // Nuit
}

export function getTodayDateFormatted() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}