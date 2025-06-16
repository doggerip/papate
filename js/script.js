// script.js

// --- Configuration du compte à rebours ---
// Cible: 10 Septembre 2025 à 23:59:59
const targetDate = new Date('2025-09-10T23:59:59').getTime();
// Date de début du suivi (aujourd'hui, le 16 juin 2025)
const startDate = new Date('2025-06-16T00:00:00').getTime();

// --- Fonctions d'Utilitaires ---

/**
 * Récupère l'heure formatée pour un fuseau horaire donné.
 * @param {string} timeZone - Le fuseau horaire (ex: 'Europe/Paris').
 * @returns {string} L'heure formatée (HH:MM:SS).
 */
function getFormattedTime(timeZone) {
    const options = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: timeZone
    };
    return new Date().toLocaleTimeString('fr-FR', options);
}

/**
 * Retourne un message personnalisé en fonction de l'heure.
 * @param {number} hour - L'heure actuelle (0-23).
 * @returns {string} Le message de salutation.
 */
function getPersonalizedMessage(hour) {
    if (hour >= 5 && hour < 10) return "Bon matin !";
    if (hour >= 10 && hour < 17) return "Bonne journée !";
    if (hour >= 17 && hour < 22) return "Bonne soirée !";
    return "Bonne nuit !";
}

/**
 * Récupère la date du jour formatée en `YYYY-MM-JJ`.
 * @returns {string} La date formatée.
 */
function getTodayDateFormatted() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Mélange un tableau de manière aléatoire (Algorithme de Fisher-Yates).
 * @param {Array} array - Le tableau à mélanger.
 * @returns {Array} Le tableau mélangé.
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// --- Fonctions de Mise à Jour du DOM ---

/** Met à jour l'affichage du compte à rebours. */
function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;
    const countdownElement = document.getElementById('countdown');

    if (countdownElement) {
        if (distance < 0) {
            clearInterval(countdownInterval);
            countdownElement.innerHTML = "L'événement est arrivé !";
            const progressContainer = document.querySelector('.progress-container');
            if (progressContainer) {
                progressContainer.style.display = 'none';
            }
        } else {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            countdownElement.innerHTML = `${days}j ${hours}h ${minutes}m ${seconds}s`;
        }
    }
}

/** Met à jour l'affichage des heures locales. */
function updateTimes() {
    const frenchTimeEl = document.getElementById('frenchTime');
    const canadianTimeEl = document.getElementById('canadianTime');

    if (frenchTimeEl) {
        frenchTimeEl.innerHTML = getFormattedTime('Europe/Paris');
    }
    if (canadianTimeEl) {
        canadianTimeEl.innerHTML = getFormattedTime('America/Montreal');
    }
}

/** Met à jour la barre de progression vers la date cible. */
function updateProgressBar() {
    const now = new Date().getTime();
    const totalDuration = targetDate - startDate;
    let elapsed = now - startDate;
    const progressBarEl = document.getElementById('progressBar');
    const progressTextEl = document.querySelector('.progress-text');

    if (progressBarEl && progressTextEl) {
        let percent;

        if (elapsed < 0) { // Si la date de début n'est pas encore atteinte
            percent = 0;
        } else if (now >= targetDate) { // Si la date cible est dépassée
            percent = 100;
            progressBarEl.style.display = 'none'; // Cacher la barre
            progressTextEl.textContent = "L'événement est terminé !";
        } else {
            percent = (elapsed / totalDuration) * 100;
            percent = Math.min(100, Math.max(0, percent)); // S'assurer que le pourcentage est entre 0 et 100
            progressTextEl.textContent = "Progression vers la date cible";
            progressBarEl.style.display = 'block'; // S'assurer que la barre est visible
        }
        progressBarEl.style.width = percent + "%";
    }
}

/** Met à jour les messages personnalisés des fuseaux horaires. */
function updateMessages() {
    const messageNantesEl = document.getElementById('messageNantes');
    const messageMontrealEl = document.getElementById('messageMontreal');

    if (messageNantesEl) {
        const nantesDate = new Date(new Date().toLocaleString("en-US", { timeZone: 'Europe/Paris' }));
        const nantesHour = nantesDate.getHours();
        messageNantesEl.textContent = getPersonalizedMessage(nantesHour);
    }

    if (messageMontrealEl) {
        const montrealDate = new Date(new Date().toLocaleString("en-US", { timeZone: 'America/Montreal' }));
        const montrealHour = montrealDate.getHours();
        messageMontrealEl.textContent = getPersonalizedMessage(montrealHour);
    }
}

/** Met à jour les icônes et le fond en fonction de l'heure locale. */
function updateTimeIcons() {
    document.querySelectorAll('.zone-card').forEach(card => {
        const timeZone = card.dataset.timezone;
        const localizedDate = new Date(new Date().toLocaleString("en-US", { timeZone: timeZone }));
        const hour = localizedDate.getHours();
        const timeIconElement = card.querySelector('.time-icon');

        if (timeIconElement) {
            let iconClass = '';
            let timePeriodClass = '';

            if (hour >= 5 && hour < 10) { // 05h - 09h59: Matin
                iconClass = 'fas fa-cloud-sun';
                timePeriodClass = 'morning';
            } else if (hour >= 10 && hour < 17) { // 10h - 16h59: Jour
                iconClass = 'fas fa-sun';
                timePeriodClass = 'day';
            } else if (hour >= 17 && hour < 22) { // 17h - 21h59: Soir
                iconClass = 'fas fa-cloud-moon';
                timePeriodClass = 'evening';
            } else { // 22h - 04h59: Nuit
                iconClass = 'fas fa-moon';
                timePeriodClass = 'night';
            }

            timeIconElement.innerHTML = `<i class="${iconClass}"></i>`;
            timeIconElement.className = 'time-icon ' + timePeriodClass;
        }
    });

    // Mettre à jour le fond global du body
    const now = new Date();
    const currentHour = now.getHours();

    document.body.classList.remove('morning-background', 'day-background', 'evening-background', 'night-background', 'day', 'night');

    if (currentHour >= 5 && currentHour < 10) {
        document.body.classList.add('morning-background', 'day');
    } else if (currentHour >= 10 && currentHour < 17) {
        document.body.classList.add('day-background', 'day');
    } else if (currentHour >= 17 && currentHour < 22) {
        document.body.classList.add('evening-background', 'night');
    } else {
        document.body.classList.add('night-background', 'night');
    }
}

// --- Logique du Quiz ---
let currentQuizQuestionIndex = 0;
let score = 0;

const quizQuestionEl = document.getElementById('quiz-question');
const quizOptionsEl = document.getElementById('quiz-options');
const quizResultEl = document.getElementById('quiz-result');
const nextQuestionButton = document.getElementById('next-question-btn');

/** Affiche une question de quiz aléatoire (priorise la question du jour si elle existe). */
function displayRandomQuizQuestion() {
    // Vérification de l'existence des éléments HTML
    if (!quizQuestionEl || !quizOptionsEl || !quizResultEl || !nextQuestionButton) {
        console.error("Un ou plusieurs éléments du quiz sont introuvables. Vérifiez les IDs dans index.html.");
        return;
    }

    // Vérification que quizQuestions est défini et contient des données (via quizData.js)
    if (typeof quizQuestions === 'undefined' || quizQuestions.length === 0) {
        quizQuestionEl.textContent = "Aucune question de quiz disponible.";
        quizOptionsEl.innerHTML = '';
        nextQuestionButton.style.display = 'none';
        return;
    }

    const todayDate = getTodayDateFormatted();
    const questionsForToday = quizQuestions.filter(q => q.date === todayDate);

    let questionToDisplay;
    if (questionsForToday.length > 0) {
        const randomIndex = Math.floor(Math.random() * questionsForToday.length);
        questionToDisplay = questionsForToday[randomIndex];
    } else {
        const randomIndex = Math.floor(Math.random() * quizQuestions.length);
        questionToDisplay = quizQuestions[randomIndex];
    }

    currentQuizQuestionIndex = quizQuestions.indexOf(questionToDisplay);

    quizQuestionEl.textContent = questionToDisplay.question;
    quizOptionsEl.innerHTML = '';
    quizResultEl.textContent = ''; // Réinitialiser le résultat

    const shuffledOptions = shuffleArray([...questionToDisplay.options]);

    shuffledOptions.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('quiz-option-btn');
        button.onclick = () => checkAnswer(option, questionToDisplay.correctAnswer);
        quizOptionsEl.appendChild(button);
    });

    nextQuestionButton.style.display = 'none';
}

/**
 * Vérifie la réponse sélectionnée par l'utilisateur pour le quiz.
 * @param {string} selectedOption - L'option choisie par l'utilisateur.
 * @param {string} correctAnswer - La bonne réponse à la question.
 */
function checkAnswer(selectedOption, correctAnswer) {
    const optionsButtons = document.querySelectorAll('.quiz-option-btn');
    optionsButtons.forEach(button => {
        button.disabled = true; // Désactiver tous les boutons après une sélection
        if (button.textContent === correctAnswer) {
            button.classList.add('correct');
        } else if (button.textContent === selectedOption) {
            button.classList.add('incorrect');
        }
    });

    if (selectedOption === correctAnswer) {
        quizResultEl.textContent = "Bonne réponse ! 🎉";
        quizResultEl.style.color = 'green';
        score++;
    } else {
        quizResultEl.textContent = `Mauvaise réponse. La bonne réponse était : "${correctAnswer}" 😢`;
        quizResultEl.style.color = 'red';
    }
    nextQuestionButton.style.display = 'block';
}

/** Charge les questions du quiz et affiche la première. */
function loadQuizQuestions() {
    console.log('Questions chargées :', quizQuestions);
    displayRandomQuizQuestion();
}

// --- Logique des Statistiques Amusantes ---
const funStatTextEl = document.getElementById('funStatText');

/** Affiche une statistique amusante aléatoire. */
function displayRandomFunStat() {
    if (!funStatTextEl) {
        console.error("L'élément de statistique amusante est introuvable. Vérifiez l'ID 'funStatText' dans index.html.");
        return;
    }
    if (typeof funStats === 'undefined' || funStats.length === 0) {
        funStatTextEl.textContent = "Aucune statistique amusante disponible pour le moment.";
    } else {
        const randomIndex = Math.floor(Math.random() * funStats.length);
        funStatTextEl.textContent = funStats[randomIndex];
    }
}

// --- Logique de l'Expression du Jour ---
const englishExpressionEl = document.getElementById('english-expression');
const frenchTranslationEl = document.getElementById('french-translation');
const revealTranslationBtn = document.getElementById('reveal-translation-btn');
const nextExpressionBtn = document.getElementById('next-expression-btn'); // Correctement déclarée ici

/** Affiche une expression anglaise aléatoire avec sa traduction. */
function displayDailyExpression() {
    if (!englishExpressionEl || !frenchTranslationEl || !revealTranslationBtn || !nextExpressionBtn || typeof englishExpressions === 'undefined' || englishExpressions.length === 0) {
        console.error("Éléments d'expression ou données introuvables.");
        return;
    }

    const randomIndex = Math.floor(Math.random() * englishExpressions.length);
    const dailyExpression = englishExpressions[randomIndex];

    englishExpressionEl.textContent = dailyExpression.expression;
    frenchTranslationEl.textContent = "Cliquez pour voir la traduction...";
    frenchTranslationEl.style.color = 'transparent';
    frenchTranslationEl.style.textShadow = '0 0 8px rgba(0,0,0,0.5)';
    revealTranslationBtn.style.display = 'block';
    nextExpressionBtn.style.display = 'none';

    revealTranslationBtn.onclick = () => {
        frenchTranslationEl.textContent = dailyExpression.translation;
        frenchTranslationEl.style.color = '';
        frenchTranslationEl.style.textShadow = 'none';
        revealTranslationBtn.style.display = 'none';
        nextExpressionBtn.style.display = 'block';
    };
}

// --- Logique de Suivi des Vols (OpenSky Network uniquement) ---
const flightNumberInput = document.getElementById('flightNumberInput');
const searchFlightBtn = document.getElementById('searchFlightBtn');

// Boutons des départs/arrivées
const showNantesDeparturesBtn = document.getElementById('showNantesDeparturesBtn');
const showNantesArrivalsBtn = document.getElementById('showNantesArrivalsBtn');
const showMontrealDeparturesBtn = document.getElementById('showMontrealDeparturesBtn');
const showMontrealArrivalsBtn = document.getElementById('showMontrealArrivalsBtn');

const flightStatusMessage = document.getElementById('flightStatusMessage');
const flightResultsTableBody = document.querySelector('#flightResultsTable tbody');
const noFlightResultsMessage = document.getElementById('noFlightResults');

/**
 * Récupère les données des avions en temps réel via l'API OpenSky States.
 * Permet de filtrer par indicatif d'appel ou pays d'origine.
 * @param {string|null} filterCallsign - L'indicatif d'appel à filtrer.
 * @param {string|null} originCountry - Le pays d'origine de l'avion à filtrer.
 */
async function fetchLiveFlightData(filterCallsign = null, originCountry = null) {
    flightStatusMessage.textContent = "Recherche des vols en temps réel en cours (OpenSky)...";
    flightStatusMessage.style.color = 'blue';
    flightResultsTableBody.innerHTML = '';
    noFlightResultsMessage.style.display = 'none';
    updateFlightTableHeaders('live'); // Met à jour les en-têtes pour les vols en direct

    try {
        const response = await fetch('https://opensky-network.org/api/states/all');
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const data = await response.json();

        if (!data || !data.states || data.states.length === 0) {
            flightStatusMessage.textContent = "Aucune donnée de vol en temps réel disponible actuellement (OpenSky).";
            flightStatusMessage.style.color = 'orange';
            noFlightResultsMessage.style.display = 'block';
            return;
        }

        let filteredFlights = data.states;

        if (filterCallsign) {
            const normalizedFilter = filterCallsign.trim().toUpperCase();
            filteredFlights = filteredFlights.filter(state =>
                state[1] && state[1].trim().toUpperCase().includes(normalizedFilter)
            );
        }

        if (filteredFlights.length === 0) {
            flightStatusMessage.textContent = "Aucun vol en temps réel trouvé pour votre recherche (OpenSky).";
            flightStatusMessage.style.color = 'orange';
            noFlightResultsMessage.style.display = 'block';
            return;
        }

        displayLiveFlightResults(filteredFlights);
        flightStatusMessage.textContent = `Affichage de ${filteredFlights.length} vol(s) en temps réel (OpenSky).`;
        flightStatusMessage.style.color = 'green';

    } catch (error) {
        console.error("Erreur lors de la récupération des données de vol en temps réel (OpenSky):", error);
        flightStatusMessage.textContent = "Erreur OpenSky: Impossible de charger les vols en temps réel. Veuillez réessayer plus tard.";
        flightStatusMessage.style.color = 'red';
    }
}

/**
 * Affiche les résultats des vols en temps réel (depuis /states/all) dans le tableau.
 * @param {Array} flights - Le tableau des données d'état de vol.
 */
function displayLiveFlightResults(flights) {
    flightResultsTableBody.innerHTML = '';

    const CALLSIGN_INDEX = 1;
    const ORIGIN_COUNTRY_INDEX = 2;
    const VELOCITY_INDEX = 9; // en m/s
    const ALTITUDE_INDEX = 7; // baro_altitude en mètres
    const LAST_CONTACT_INDEX = 4; // timestamp UNIX
    const ON_GROUND_INDEX = 8; // on_ground: boolean

    flights.forEach(flight => {
        const row = flightResultsTableBody.insertRow();

        const callsign = flight[CALLSIGN_INDEX] ? flight[CALLSIGN_INDEX].trim() : 'N/A';
        const originCountry = flight[ORIGIN_COUNTRY_INDEX] || 'Inconnu';
        const velocityMps = flight[VELOCITY_INDEX];
        const velocityKmh = velocityMps !== null ? (velocityMps * 3.6).toFixed(0) : 'N/A';
        const altitudeM = flight[ALTITUDE_INDEX];
        const altitudeFeet = altitudeM !== null ? (altitudeM * 3.28084).toFixed(0) : 'N/A';
        const lastContactTimestamp = flight[LAST_CONTACT_INDEX];
        const lastContactDate = lastContactTimestamp ? new Date(lastContactTimestamp * 1000).toLocaleString('fr-FR') : 'N/A';
        const onGround = flight[ON_GROUND_INDEX];
        const status = onGround ? 'Au sol' : 'En vol';

        row.insertCell().textContent = callsign;
        row.insertCell().textContent = originCountry;
        row.insertCell().textContent = `${velocityKmh} km/h`;
        row.insertCell().textContent = `${altitudeFeet} ft (${altitudeM ? altitudeM.toFixed(0) : 'N/A'} m)`;
        row.insertCell().textContent = lastContactDate;
        row.insertCell().textContent = status;
    });
}

/**
 * Récupère les journaux de vol (départs ou arrivées) pour un aéroport spécifique et une période donnée depuis OpenSky.
 * @param {string} airportIcaoCode - Le code ICAO de l'aéroport (ex: 'LFRS', 'CYUL').
 * @param {'departure'|'arrival'} type - Le type de vol à rechercher ('departure' ou 'arrival').
 * @param {number} hoursAgo - Le nombre d'heures avant l'instant actuel pour la recherche.
 */
async function fetchOpenSkyAirportFlights(airportIcaoCode, type, hoursAgo = 7) {
    flightStatusMessage.textContent = `Recherche des vols ${type === 'departure' ? 'au départ' : 'à l\'arrivée'} de ${airportIcaoCode} dans les ${hoursAgo} dernières heures (OpenSky)...`;
    flightStatusMessage.style.color = 'blue';
    flightResultsTableBody.innerHTML = '';
    noFlightResultsMessage.style.display = 'none';
    updateFlightTableHeaders('logs'); // Met à jour les en-têtes pour les journaux de vol

    const now = Math.floor(Date.now() / 1000); // Temps actuel en secondes UNIX
    const beginTime = now - (hoursAgo * 60 * 60); // Heure de début de la période de recherche

    try {
        const url = `https://opensky-network.org/api/flights/${type}?airport=${airportIcaoCode}&begin=${beginTime}&end=${now}`;
        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 404) {
                flightStatusMessage.textContent = `Aucun vol ${type === 'departure' ? 'au départ' : 'à l\'arrivée'} trouvé pour ${airportIcaoCode} dans cette période (OpenSky).`;
                flightStatusMessage.style.color = 'orange';
                noFlightResultsMessage.style.display = 'block';
                return;
            }
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const data = await response.json();

        if (!data || data.length === 0) {
            flightStatusMessage.textContent = `Aucun vol ${type === 'departure' ? 'au départ' : 'à l\'arrivée'} trouvé pour ${airportIcaoCode} dans cette période (OpenSky).`;
            flightStatusMessage.style.color = 'orange';
            noFlightResultsMessage.style.display = 'block';
            return;
        }

        displayOpenSkyLogs(data, type);
        flightStatusMessage.textContent = `Affichage de ${data.length} vol(s) ${type === 'departure' ? 'au départ' : 'à l\'arrivée'} pour ${airportIcaoCode} (OpenSky).`;
        flightStatusMessage.style.color = 'green';

    } catch (error) {
        console.error("Erreur lors de la récupération des vols (OpenSky):", error);
        flightStatusMessage.textContent = "Erreur OpenSky: Impossible de charger les vols. Veuillez réessayer.";
        flightStatusMessage.style.color = 'red';
    }
}

/**
 * Affiche les journaux de vol (départs/arrivées OpenSky) dans le tableau.
 * @param {Array} flights - Le tableau des journaux de vol OpenSky.
 * @param {'departure'|'arrival'} type - Le type de vol (pour affichage dans le tableau).
 */
function displayOpenSkyLogs(flights, type) {
    flightResultsTableBody.innerHTML = '';

    flights.forEach(flight => {
        const row = flightResultsTableBody.insertRow();
        const firstSeenDate = flight.firstSeen ? new Date(flight.firstSeen * 1000).toLocaleString('fr-FR') : 'N/A';
        const lastSeenDate = flight.lastSeen ? new Date(flight.lastSeen * 1000).toLocaleString('fr-FR') : 'N/A';

        row.insertCell().textContent = flight.callsign || 'N/A';
        row.insertCell().textContent = flight.icao24 || 'N/A';
        row.insertCell().textContent = flight.estDepartureAirport || 'N/A';
        row.insertCell().textContent = flight.estArrivalAirport || 'N/A';
        row.insertCell().textContent = firstSeenDate;
        row.insertCell().textContent = lastSeenDate;
        row.insertCell().textContent = type === 'departure' ? 'Départ' : 'Arrivée';
    });
}

/**
 * Met à jour les en-têtes du tableau de suivi des vols en fonction du mode d'affichage.
 * @param {'live'|'logs'} mode - Le mode d'affichage ('live' pour /states/all, 'logs' pour /flights/X).
 */
function updateFlightTableHeaders(mode) {
    const tableHead = document.querySelector('#flightResultsTable thead tr');
    if (!tableHead) return; // S'assurer que l'élément existe

    tableHead.innerHTML = ''; // Vider les en-têtes existants

    if (mode === 'live') {
        tableHead.innerHTML = `
            <th>Indicatif d'appel (Callsign)</th>
            <th>Pays d'origine</th>
            <th>Vitesse (km/h)</th>
            <th>Altitude (m)</th>
            <th>Dernier contact</th>
            <th>Statut</th>
        `;
    } else if (mode === 'logs') {
        tableHead.innerHTML = `
            <th>Indicatif d'appel (Callsign)</th>
            <th>ICAO24</th>
            <th>Aéroport de départ estimé</th>
            <th>Aéroport d'arrivée estimé</th>
            <th>Heure de début (1er contact)</th>
            <th>Heure de fin (Dernier contact)</th>
            <th>Type</th>
        `;
    }
}

// --- Gestionnaires d'événements pour les boutons de suivi des vols ---

if (searchFlightBtn) {
    searchFlightBtn.addEventListener('click', () => {
        const flightNumber = flightNumberInput.value;
        if (flightNumber) {
            fetchLiveFlightData(flightNumber); // Chercher en temps réel par numéro de vol
        } else {
            flightStatusMessage.textContent = "Veuillez entrer un numéro de vol.";
            flightStatusMessage.style.color = 'orange';
        }
    });
}

// Gestionnaire pour les DÉPARTS de Nantes (OpenSky)
if (showNantesDeparturesBtn) {
    showNantesDeparturesBtn.addEventListener('click', () => {
        fetchOpenSkyAirportFlights('LFRS', 'departure', 7); // Code ICAO de Nantes Atlantique, 7 dernières heures
        flightStatusMessage.textContent += " (Les vols futurs ne sont pas disponibles via OpenSky)";
        flightStatusMessage.style.color = 'orange';
    });
}

// Gestionnaire pour les ARRIVÉES à Nantes (OpenSky)
if (showNantesArrivalsBtn) {
    showNantesArrivalsBtn.addEventListener('click', () => {
        fetchOpenSkyAirportFlights('LFRS', 'arrival', 24); // Code ICAO de Nantes Atlantique, 24 dernières heures
        flightStatusMessage.textContent += " (Les vols futurs ne sont pas disponibles via OpenSky)";
        flightStatusMessage.style.color = 'orange';
    });
}

// Gestionnaire pour les DÉPARTS de Montréal (OpenSky)
if (showMontrealDeparturesBtn) {
    showMontrealDeparturesBtn.addEventListener('click', () => {
        fetchOpenSkyAirportFlights('CYUL', 'departure', 7); // Code ICAO de Montréal-Trudeau, 7 dernières heures
        flightStatusMessage.textContent += " (Les vols futurs ne sont pas disponibles via OpenSky)";
        flightStatusMessage.style.color = 'orange';
    });
}

// Gestionnaire pour les ARRIVÉES à Montréal (OpenSky)
if (showMontrealArrivalsBtn) {
    showMontrealArrivalsBtn.addEventListener('click', () => {
        fetchOpenSkyAirportFlights('CYUL', 'arrival', 24); // Code ICAO de Montréal-Trudeau, 24 dernières heures
        flightStatusMessage.textContent += " (Les vols futurs ne sont pas disponibles via OpenSky)";
        flightStatusMessage.style.color = 'orange';
    });
}

// --- Initialisation et boucles d'actualisation ---

// Mettre à jour le compte à rebours, les heures, la barre de progression et les messages toutes les secondes
const countdownInterval = setInterval(updateCountdown, 1000);
setInterval(updateTimes, 1000);
setInterval(updateProgressBar, 1000);
setInterval(updateMessages, 1000);
setInterval(updateTimeIcons, 1000);

// Exécuter les mises à jour immédiatement au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    updateCountdown();
    updateTimes();
    updateProgressBar();
    updateMessages();
    updateTimeIcons();
    loadQuizQuestions(); // Charger la première question du quiz au démarrage
    displayRandomFunStat(); // Charger une statistique amusante au démarrage
    displayDailyExpression(); // Charger l'expression du jour

    // Au chargement, vous pouvez choisir d'afficher des vols par défaut
    // Par exemple, pour montrer tous les vols en direct (OpenSky):
    // fetchLiveFlightData();
});

// Gérer le bouton "Question suivante" du quiz
if (nextQuestionButton) {
    nextQuestionButton.addEventListener('click', () => {
        displayRandomQuizQuestion(); // Afficher une nouvelle question
    });
}