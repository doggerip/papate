// script.js

// --- Configuration du compte à rebours ---
// Cible: 10 Septembre 2025 à 23:59:59
const targetDate = new Date('2025-09-10T23:59:59').getTime();
// Date de début du suivi (aujourd'hui, le 16 juin 2025)
const startDate = new Date('2025-06-16T00:00:00').getTime(); // Utilise la date d'aujourd'hui pour le début du suivi

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

/**
 * Traduit le code de la source de position en texte lisible pour les vols OpenSky.
 * @param {number} sourceCode - Le code numérique de la source de position.
 * @returns {string} Le texte correspondant à la source de position.
 */
function getPositionSourceText(sourceCode) {
    switch (sourceCode) {
        case 0: return 'ADS-B';
        case 1: return 'MLAT';
        case 2: return 'FLARM';
        default: return 'Inconnu';
    }
}

// --- Fonctions de Mise à Jour du DOM ---

/** Met à jour l'affichage du compte à rebours. */
function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;
    const countdownElement = document.getElementById('countdown');

    if (countdownElement) {
        if (distance < 0) {
            clearInterval(countdownInterval); // Assurez-vous que countdownInterval est défini globalement ou accessible
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
            progressBarEl.style.width = "100%"; // S'assurer que la barre est à 100%
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
    // Vérifiez si 'quizQuestions' est disponible globalement (définie dans quizData.js)
    // console.log('Questions chargées :', typeof quizQuestions !== 'undefined' ? quizQuestions.length : 0);
    // Supprimez le console.log ci-dessus et ajoutez le suivant pour un message plus précis
    if (typeof quizQuestions === 'undefined') {
        console.error("Erreur: quizData.js n'est pas chargé ou quizQuestions n'est pas défini.");
    } else {
        console.log('Questions chargées :', quizQuestions.length);
    }
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
    // Vérifiez si 'funStats' est disponible globalement (définie dans funStats.js)
    if (typeof funStats === 'undefined' || funStats.length === 0) {
        funStatTextEl.textContent = "Aucune statistique amusante disponible pour le moment.";
        console.error("Erreur: funStats.js n'est pas chargé ou funStats n'est pas défini.");
    } else {
        const randomIndex = Math.floor(Math.random() * funStats.length);
        funStatTextEl.textContent = funStats[randomIndex];
    }
}

// --- Logique de l'Expression du Jour ---
const englishExpressionEl = document.getElementById('english-expression');
const frenchTranslationEl = document.getElementById('french-translation');
const revealTranslationBtn = document.getElementById('reveal-translation-btn');
const nextExpressionBtn = document.getElementById('next-expression-btn');

/** Affiche une expression anglaise aléatoire avec sa traduction. */
function displayDailyExpression() {
    // Vérifiez si 'englishExpressions' est disponible globalement (définie dans englishExpressions.js)
    if (!englishExpressionEl || !frenchTranslationEl || !revealTranslationBtn || !nextExpressionBtn || typeof englishExpressions === 'undefined' || englishExpressions.length === 0) {
        console.error("Éléments d'expression ou données introuvables. Vérifiez les IDs ou englishExpressions.js.");
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

// --- Logique de Suivi des Vols (OpenSky Network) ---
const flightCallsignInput = document.getElementById('flightCallsignInput');
const searchFlightBtn = document.getElementById('searchFlightBtn');
const airportButtons = document.querySelectorAll('.airport-buttons .btn');
const searchMessage = document.getElementById('searchMessage');
const airportMessage = document.getElementById('airportMessage'); // Nouveau message pour les aéroports
const flightResultsTableBody = document.getElementById('flightResultsTableBody');
const noFlightResults = document.getElementById('noFlightResults'); // Élément "Aucun vol trouvé"

/**
 * Ouvre une nouvelle page (map.html) avec les détails du vol pour l'afficher sur une carte.
 * @param {Object} flightData - Un objet contenant les données du vol (issues des data-attributes de la ligne).
 */
function openFlightOnMap(flightData) {
    const params = new URLSearchParams();
    // Les noms des paramètres doivent correspondre à ce que mapScript.js attend
    // mapScript.js attend 'icao24', 'callsign', 'type', 'lat', 'lon', 'depIcao', 'arrIcao'

    params.append('icao24', flightData.icao24 || '');
    params.append('callsign', encodeURIComponent(flightData.callsign || 'N/A')); // Encode l'indicatif d'appel

    // ********* CORRECTION ICI : Assurez-vous que le type est toujours ajouté *********
    params.append('type', flightData.flightType || 'unknown'); // Assurez-vous que flightType est toujours envoyé

    if (flightData.flightType === 'live') {
        // mapScript.js attend 'lat' et 'lon'
        if (flightData.latitude) { // Vérifie si la latitude existe avant d'ajouter
            params.append('lat', flightData.latitude);
        }
        if (flightData.longitude) { // Vérifie si la longitude existe avant d'ajouter
            params.append('lon', flightData.longitude);
        }
    } else if (flightData.flightType === 'historical') {
        // mapScript.js attend 'depIcao' et 'arrIcao'
        params.append('depIcao', flightData.departureAirportIcao || '');
        params.append('arrIcao', flightData.arrivalAirportIcao || '');
    }

    window.open(`map.html?${params.toString()}`, '_blank');
}


/**
 * Affiche un message dans un élément DOM.
 * @param {HTMLElement} element - L'élément DOM où afficher le message.
 * @param {string} msg - Le message à afficher.
 * @param {'info'|'success'|'error'} type - Le type de message pour le style.
 */
function showMessage(element, msg, type = 'info') {
    if (element) {
        element.textContent = msg;
        element.className = `message ${type}`;
        element.style.display = 'block';
    }
}

/**
 * Cache un message dans un élément DOM.
 * @param {HTMLElement} element - L'élément DOM à cacher.
 */
function hideMessage(element) {
    if (element) {
        element.textContent = '';
        element.className = 'message';
        element.style.display = 'none';
    }
}

/** Nettoie le tableau des résultats de vol et affiche le message "Aucun vol trouvé". */
function clearFlightTable() {
    if (flightResultsTableBody) {
        flightResultsTableBody.innerHTML = '';
    }
    if (noFlightResults) {
        noFlightResults.style.display = 'table-row'; // Affiche la ligne "Aucun vol trouvé"
    }
}

async function searchLiveFlight(callsign) {
    showMessage(searchMessage, `Recherche du vol ${callsign}...`, 'info');
    hideMessage(airportMessage); // Cache le message de l'autre section
    clearFlightTable();
    updateFlightTableHeaders('live'); // S'assurer que les bons en-têtes sont là

    try {
        // La limitation de l'API OpenSky pour /states/all est que le filtrage par callsign n'est pas direct.
        // Il faut récupérer tout et filtrer côté client.
        // Attention aux limites de requêtes de l'API gratuite !
        const response = await fetch('https://opensky-network.org/api/states/all');
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const data = await response.json();

        if (data && data.states) {
            const foundFlights = data.states.filter(flight =>
                flight[1] && flight[1].trim().toUpperCase() === callsign
            );

            if (foundFlights.length > 0) {
                displayLiveFlightResults(foundFlights);
                showMessage(searchMessage, `Vol(s) "${callsign}" trouvé(s).`, 'success');
            } else {
                showMessage(searchMessage, `Vol "${callsign}" non trouvé ou non actif actuellement.`, 'info');
                if (noFlightResults) noFlightResults.style.display = 'table-row';
            }
        } else {
            showMessage(searchMessage, 'Aucune donnée de vol en direct reçue de l\'API.', 'info');
            if (noFlightResults) noFlightResults.style.display = 'table-row';
        }
    } catch (error) {
        console.error('Erreur lors de la recherche du vol en direct:', error);
        showMessage(searchMessage, `Erreur: ${error.message}. Impossible de récupérer les données de vol en direct.`, 'error');
        if (noFlightResults) noFlightResults.style.display = 'table-row';
    }
}

async function searchAirportLogs(icao, type) {
    showMessage(airportMessage, `Recherche des ${type}s à ${icao}...`, 'info');
    hideMessage(searchMessage); // Cache le message de l'autre section
    clearFlightTable();
    updateFlightTableHeaders('logs'); // S'assurer que les bons en-têtes sont là

    // Calculer les timestamps pour les dernières 24 heures
    const now = Math.floor(Date.now() / 1000); // Temps actuel en secondes UNIX
    const begin = now - (24 * 60 * 60); // Il y a 24 heures

    const url = `https://opensky-network.org/api/flights/${type}?airport=${icao}&begin=${begin}&end=${now}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const data = await response.json();

        if (data && data.length > 0) {
            displayOpenSkyLogs(data, type);
            showMessage(airportMessage, `${data.length} ${type}s trouvé(s) pour ${icao} sur les dernières 24h.`, 'success');
        } else {
            showMessage(airportMessage, `Aucun ${type} trouvé pour ${icao} sur les dernières 24h.`, 'info');
            if (noFlightResults) noFlightResults.style.display = 'table-row';
        }
    } catch (error) {
        console.error(`Erreur lors de la recherche des ${type}s pour ${icao}:`, error);
        showMessage(airportMessage, `Erreur: ${error.message}. Impossible de récupérer les données de l'aéroport.`, 'error');
        if (noFlightResults) noFlightResults.style.display = 'table-row';
    }
}

/**
 * Affiche les résultats des vols en temps réel (depuis /states/all) dans le tableau.
 * @param {Array} flights - Le tableau des données d'état de vol.
 */
function displayLiveFlightResults(flights) {
    flightResultsTableBody.innerHTML = '';
    if (flights.length === 0) {
        if (noFlightResults) noFlightResults.style.display = 'table-row';
        return;
    }
    if (noFlightResults) noFlightResults.style.display = 'none';

    // Index des données dans le tableau OpenSky /states/all
    const ICAO24_INDEX = 0;
    const CALLSIGN_INDEX = 1;
    const ORIGIN_COUNTRY_INDEX = 2;
    const TIME_POSITION_INDEX = 3;
    const LAST_CONTACT_INDEX = 4;
    const LONGITUDE_INDEX = 5;
    const LATITUDE_INDEX = 6;
    const BARO_ALTITUDE_INDEX = 7;
    const ON_GROUND_INDEX = 8;
    const VELOCITY_INDEX = 9;
    const TRUE_TRACK_INDEX = 10;
    const VERTICAL_RATE_INDEX = 11;
    const GEO_ALTITUDE_INDEX = 13;
    const SQUAWK_INDEX = 14;
    const POSITION_SOURCE_INDEX = 16;
    // Note: flight[13] et flight[14] ne sont PAS les aéroports de départ/arrivée ici pour /states/all,
    // ce sont d'autres données (généralement cap et squawk).
    // Les aéroports de départ/arrivée sont dans les logs historiques (/flights/X).

    flights.forEach(flight => {
        const row = flightResultsTableBody.insertRow();
        row.style.cursor = 'pointer';

        const callsign = flight[CALLSIGN_INDEX] ? flight[CALLSIGN_INDEX].trim() : 'N/A';
        const icao24 = flight[ICAO24_INDEX] || 'N/A';
        const originCountry = flight[ORIGIN_COUNTRY_INDEX] || 'Inconnu';
        const velocityMps = flight[VELOCITY_INDEX];
        const velocityKmh = velocityMps !== null ? (velocityMps * 3.6).toFixed(0) : 'N/A';
        const baroAltitudeM = flight[BARO_ALTITUDE_INDEX];
        const baroAltitudeFeet = baroAltitudeM !== null ? (baroAltitudeM * 3.28084).toFixed(0) : 'N/A';
        const lastContactTimestamp = flight[LAST_CONTACT_INDEX];
        const lastContactDate = lastContactTimestamp ? new Date(lastContactTimestamp * 1000).toLocaleString('fr-FR') : 'N/A';
        const onGround = flight[ON_GROUND_INDEX];
        const status = onGround ? 'Au sol' : 'En vol';

        const trueTrack = flight[TRUE_TRACK_INDEX] !== null ? `${flight[TRUE_TRACK_INDEX].toFixed(0)}°` : 'N/A';
        const verticalRateMps = flight[VERTICAL_RATE_INDEX];
        const verticalRateText = verticalRateMps !== null
            ? (verticalRateMps > 0 ? `+${verticalRateMps.toFixed(1)} m/s (Montée)`
                : `${verticalRateMps.toFixed(1)} m/s (Descente)`)
            : 'N/A';
        const squawk = flight[SQUAWK_INDEX] || 'N/A';

        const timePositionTimestamp = flight[TIME_POSITION_INDEX];
        const timePositionDate = timePositionTimestamp ? new Date(timePositionTimestamp * 1000).toLocaleTimeString('fr-FR') : 'N/A';

        const geoAltitudeM = flight[GEO_ALTITUDE_INDEX];
        const geoAltitudeFeet = geoAltitudeM !== null ? (geoAltitudeM * 3.28084).toFixed(0) : 'N/A';

        const positionSource = flight[POSITION_SOURCE_INDEX] !== null ? getPositionSourceText(flight[POSITION_SOURCE_INDEX]) : 'N/A';


        row.insertCell().textContent = callsign;
        row.insertCell().textContent = originCountry;
        row.insertCell().textContent = `${velocityKmh} km/h`;
        row.insertCell().textContent = `${baroAltitudeFeet} ft`;
        row.insertCell().textContent = `${geoAltitudeFeet} ft`;
        row.insertCell().textContent = trueTrack;
        row.insertCell().textContent = verticalRateText;
        row.insertCell().textContent = squawk;
        row.insertCell().textContent = timePositionDate;
        row.insertCell().textContent = lastContactDate;
        row.insertCell().textContent = positionSource;
        row.insertCell().textContent = status;

        // --- C'EST ICI QUE LES CORRECTIONS SONT CRUCIALES POUR map.html ---
        row.dataset.flightType = 'live'; // Indique à map.html que c'est un vol live
        row.dataset.icao24 = icao24;
        row.dataset.callsign = callsign;

        // Passer la latitude et la longitude si elles sont disponibles
        if (flight[LATITUDE_INDEX] !== null && flight[LONGITUDE_INDEX] !== null) {
            row.dataset.latitude = flight[LATITUDE_INDEX];
            row.dataset.longitude = flight[LONGITUDE_INDEX];
        } else {
            // Si pas de coordonnées, on peut passer en mode "historique" ou indiquer que les coordonnées manquent
            // Pour map.html, il est préférable d'envoyer un type 'live' même sans lat/lon initiales
            // pour qu'il tente de récupérer les données en direct. Le message sera géré dans mapScript.js
            // On s'assure juste que ces data-attributs ne sont pas définis si les valeurs sont null.
            delete row.dataset.latitude;
            delete row.dataset.longitude;
        }

        row.addEventListener('click', () => openFlightOnMap(row.dataset));
    });
}

/**
 * Affiche les journaux de vol (départs/arrivées OpenSky) dans le tableau.
 * @param {Array} flights - Le tableau des journaux de vol OpenSky.
 * @param {'departure'|'arrival'} type - Le type de vol (pour affichage dans le tableau).
 */
function displayOpenSkyLogs(flights, type) {
    flightResultsTableBody.innerHTML = '';
    if (flights.length === 0) {
        if (noFlightResults) noFlightResults.style.display = 'table-row';
        return;
    }
    if (noFlightResults) noFlightResults.style.display = 'none';

    flights.forEach(flight => {
        const row = flightResultsTableBody.insertRow();
        row.style.cursor = 'pointer';

        const firstSeenDate = flight.firstSeen ? new Date(flight.firstSeen * 1000).toLocaleString('fr-FR') : 'N/A';
        const lastSeenDate = flight.lastSeen ? new Date(flight.lastSeen * 1000).toLocaleString('fr-FR') : 'N/A';

        row.insertCell().textContent = flight.callsign || 'N/A';
        row.insertCell().textContent = flight.icao24 || 'N/A';
        row.insertCell().textContent = flight.estDepartureAirport || 'N/A';
        row.insertCell().textContent = flight.estArrivalAirport || 'N/A';
        row.insertCell().textContent = firstSeenDate;
        row.insertCell().textContent = lastSeenDate;
        row.insertCell().textContent = type === 'departure' ? 'Départ' : 'Arrivée';

        // --- C'EST ICI QUE LES CORRECTIONS SONT CRUCIALES POUR map.html ---
        row.dataset.flightType = 'historical'; // Indique à map.html que c'est un vol historique
        row.dataset.icao24 = flight.icao24 || '';
        row.dataset.callsign = flight.callsign || 'N/A';
        // Passer les ICAO des aéroports de départ et d'arrivée
        row.dataset.departureAirportIcao = flight.estDepartureAirport || ''; // mapScript.js attend 'depIcao'
        row.dataset.arrivalAirportIcao = flight.estArrivalAirport || '';     // mapScript.js attend 'arrIcao'

        row.addEventListener('click', () => openFlightOnMap(row.dataset));
    });
}

/**
 * Met à jour les en-têtes du tableau de suivi des vols en fonction du mode d'affichage.
 * @param {'live'|'logs'} mode - Le mode d'affichage ('live' pour /states/all, 'logs' pour /flights/X).
 */
function updateFlightTableHeaders(mode) {
    const tableHead = document.querySelector('#flightResultsTable thead tr');
    if (!tableHead) return;

    tableHead.innerHTML = ''; // Vider les en-têtes existants

    if (mode === 'live') {
        tableHead.innerHTML = `
            <th>Indicatif d'appel</th>
            <th>Pays d'origine</th>
            <th>Vitesse (km/h)</th>
            <th>Altitude Baro (ft)</th>
            <th>Altitude Geo (ft)</th>
            <th>Cap (Deg)</th>
            <th>Taux Vertical</th>
            <th>Squawk</th>
            <th>Pos. Maj.</th>
            <th>Dernier contact</th>
            <th>Source Pos.</th>
            <th>Statut</th>
        `;
    } else if (mode === 'logs') {
        tableHead.innerHTML = `
            <th>Indicatif d'appel</th>
            <th>ICAO24</th>
            <th>Aéroport Départ Est.</th>
            <th>Aéroport Arrivée Est.</th>
            <th>Heure Début</th>
            <th>Heure Fin</th>
            <th>Type</th>
        `;
    }
}

// --- Initialisation et gestionnaires d'événements ---
// --- Initialisation et gestionnaires d'événements ---
document.addEventListener('DOMContentLoaded', () => {
    // --- Initialisation des éléments non-vol ---
    updateCountdown();
    updateTimes();
    updateProgressBar();
    updateMessages();
    updateTimeIcons();
    loadQuizQuestions();
    displayRandomFunStat();
    displayDailyExpression();

    // Démarrer les intervalles d'actualisation
    countdownInterval = setInterval(updateCountdown, 1000); // Variable globale `countdownInterval` est assignée ici
    setInterval(updateTimes, 1000);
    setInterval(updateProgressBar, 1000);
    setInterval(updateMessages, 1000);
    setInterval(updateTimeIcons, 1000);

    // --- Initialisation des éléments de suivi des vols ---
    updateFlightTableHeaders('live');

    if (searchFlightBtn) {
        searchFlightBtn.addEventListener('click', () => {
            const callsign = flightCallsignInput.value.trim().toUpperCase();
            if (callsign) {
                searchLiveFlight(callsign);
            } else {
                showMessage(searchMessage, 'Veuillez entrer un indicatif d\'appel.', 'error');
                clearFlightTable();
            }
        });
    }

    if (airportButtons) {
        airportButtons.forEach(button => {
            button.addEventListener('click', () => {
                const icao = button.dataset.icao;
                const type = button.dataset.type;
                if (icao && type) {
                    searchAirportLogs(icao, type);
                }
            });
        });
    }

    if (nextQuestionButton) {
        nextQuestionButton.addEventListener('click', () => {
            displayRandomQuizQuestion();
        });
    }

    if (nextExpressionBtn) {
        nextExpressionBtn.addEventListener('click', () => {
            displayDailyExpression();
        });
    }

    // Afficher un message initial pour les vols
    showMessage(searchMessage, "Entrez un indicatif d'appel ou choisissez un aéroport pour voir les vols.", 'info');

    // --- Logique de gestion des onglets intégrée ici ---
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Supprime la classe 'active' de tous les boutons et contenus
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Ajoute la classe 'active' au bouton cliqué et au contenu correspondant
            button.classList.add('active');
            const targetTab = button.dataset.tab;
            const targetContent = document.getElementById(targetTab);
            if (targetContent) { // Vérification pour s'assurer que l'élément existe
                targetContent.classList.add('active');
            } else {
                console.error(`Contenu de l'onglet avec l'ID "${targetTab}" introuvable.`);
            }
        });
    });

    // Initialisation au chargement de la page : Afficher l'onglet "Accueil" par défaut
    const defaultTabButton = document.querySelector('.tab-button.active');
    if (defaultTabButton) {
        const defaultTargetTab = defaultTabButton.dataset.tab;
        const defaultTargetContent = document.getElementById(defaultTargetTab);
        if (defaultTargetContent) {
            defaultTargetContent.classList.add('active');
        }
    } else {
        // Si aucun onglet n'a la classe active, active le premier par défaut
        if (tabButtons.length > 0) {
            tabButtons[0].classList.add('active');
            if (tabContents.length > 0) {
                tabContents[0].classList.add('active');
            }
        }
    }
});