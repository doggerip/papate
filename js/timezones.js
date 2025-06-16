// js/timezones.js
import { getFormattedTime, getPersonalizedMessage } from './utils.js'; // Importer les utilitaires

export function updateTimes() {
    document.getElementById('frenchTime').innerHTML = getFormattedTime('Europe/Paris');
    document.getElementById('canadianTime').innerHTML = getFormattedTime('America/Montreal');
}

export function updateMessages() {
    const nantesDate = new Date(new Date().toLocaleString("en-US", {timeZone: 'Europe/Paris'}));
    const nantesHour = nantesDate.getHours();
    document.getElementById('messageNantes').textContent = getPersonalizedMessage(nantesHour);

    const montrealDate = new Date(new Date().toLocaleString("en-US", {timeZone: 'America/Montreal'}));
    const montrealHour = montrealDate.getHours();
    document.getElementById('messageMontreal').textContent = getPersonalizedMessage(montrealHour);
}

export function updateTimeIcons() {
    document.querySelectorAll('.zone-card').forEach(card => {
        const timeZone = card.dataset.timezone;
        const localizedDate = new Date(new Date().toLocaleString("en-US", { timeZone: timeZone }));
        const hour = localizedDate.getHours();
        const timeIconElement = card.querySelector('.time-icon');

        let iconClass = '';
        let timePeriodClass = '';

        if (hour >= 5 && hour < 10) {
            iconClass = 'fas fa-cloud-sun';
            timePeriodClass = 'morning';
        } else if (hour >= 10 && hour < 17) {
            iconClass = 'fas fa-sun';
            timePeriodClass = 'day';
        } else if (hour >= 17 && hour < 22) {
            iconClass = 'fas fa-cloud-moon';
            timePeriodClass = 'evening';
        } else {
            iconClass = 'fas fa-moon';
            timePeriodClass = 'night';
        }

        timeIconElement.innerHTML = `<i class="${iconClass}"></i>`;
        timeIconElement.className = 'time-icon ' + timePeriodClass;
    });

    const now = new Date();
    const currentHour = now.getHours();
    if (currentHour >= 7 && currentHour < 20) {
        document.body.classList.remove('night');
        document.body.classList.add('day');
    } else {
        document.body.classList.remove('day');
        document.body.classList.add('night');
    }
}