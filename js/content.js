// js/content.js
import { dailyFacts, funStats } from './config.js'; // Importer les données de config.js
import { getTodayDateFormatted } from './utils.js'; // Importer l'utilitaire de formatage de date
import { targetDate } from './config.js'; // Pour la vérification de la date cible

export function updateDailyFact() {
    const dailyFactElement = document.getElementById('dailyFactText');
    const todayFormatted = getTodayDateFormatted();
    const fact = dailyFacts[todayFormatted];

    if (fact) {
        dailyFactElement.textContent = fact;
    } else {
        const today = new Date();
        const targetDateObj = new Date(targetDate);
        targetDateObj.setHours(0, 0, 0, 0);

        if (today.getTime() > targetDateObj.getTime()) {
            dailyFactElement.textContent = "L'événement est passé ! Reviens pour le prochain compte à rebours !";
        } else {
            dailyFactElement.textContent = "Aucun fait du jour disponible pour cette date... encore !";
        }
    }
}

export function updateFunStat() {
    const funStatElement = document.getElementById('funStatText');
    const randomIndex = Math.floor(Math.random() * funStats.length);
    funStatElement.textContent = funStats[randomIndex];
}