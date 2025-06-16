// script.js

// --- Configuration du compte à rebours ---
const targetDate = new Date('2025-09-10T23:59:59').getTime();
const startDate = new Date('2025-06-16T00:00:00').getTime();

// --- Variables DOM (globales pour accès facile) ---
const countdownElement = document.getElementById('countdown');
const frenchTimeEl = document.getElementById('frenchTime');
const canadianTimeEl = document.getElementById('canadianTime');
const progressBarEl = document.getElementById('progressBar');
const progressTextEl = document.querySelector('.progress-text');
const messageNantesEl = document.getElementById('messageNantes');
const messageMontrealEl = document.getElementById('messageMontreal');

const quizQuestionEl = document.getElementById('quiz-question');
const quizOptionsEl = document.getElementById('quiz-options');
const quizResultEl = document.getElementById('quiz-result');
const nextQuestionButton = document.getElementById('next-question-btn');

const funStatTextEl = document.getElementById('funStatText');

const englishExpressionEl = document.getElementById('english-expression');
const frenchTranslationEl = document.getElementById('french-translation');
const revealTranslationBtn = document.getElementById('reveal-translation-btn');
const nextExpressionBtn = document.getElementById('next-expression-btn');

const flightCallsignInput = document.getElementById('flightCallsignInput');
const searchFlightBtn = document.getElementById('searchFlightBtn');
const airportButtons = document.querySelectorAll('.airport-buttons .btn');
const searchMessage = document.getElementById('searchMessage');
const airportMessage = document.getElementById('airportMessage');
const flightResultsTableBody = document.getElementById('flightResultsTableBody');
const noFlightResults = document.getElementById('noFlightResults');

// Variables pour la carte des vols en direct
let liveFlightMap = null; // Pour stocker l'instance de la carte
let aircraftMarkers = {}; // Pour stocker les marqueurs des avions (clé: icao24)
let updateMapInterval = null; // Pour gérer l'intervalle de rafraîchissement des vols

const liveMapMessage = document.getElementById('liveMapMessage');
const zoomLevelInput = document.getElementById('zoomLevel');
const currentZoomSpan = document.getElementById('currentZoom');
const resetMapBtn = document.getElementById('resetMapBtn');


// --- Fonctions d'Utilitaires ---
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

function getPersonalizedMessage(hour) {
    if (hour >= 5 && hour < 10) return "Bon matin !";
    if (hour >= 10 && hour < 17) return "Bonne journée !";
    if (hour >= 17 && hour < 22) return "Bonne soirée !";
    return "Bonne nuit !";
}

function getTodayDateFormatted() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getPositionSourceText(sourceCode) {
    switch (sourceCode) {
        case 0: return 'ADS-B';
        case 1: return 'MLAT';
        case 2: return 'FLARM';
        default: return 'Inconnu';
    }
}

function showMessage(element, msg, type = 'info') {
    if (element) {
        element.textContent = msg;
        element.className = `message ${type}`;
        element.style.display = 'block';
    }
}

function hideMessage(element) {
    if (element) {
        element.textContent = '';
        element.className = 'message';
        element.style.display = 'none';
    }
}

// --- Fonctions de Mise à Jour du DOM (Accueil) ---
let countdownInterval;

function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (countdownElement) {
        if (distance < 0) {
            if (countdownInterval) clearInterval(countdownInterval);
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

function updateTimes() {
    if (frenchTimeEl) {
        frenchTimeEl.innerHTML = getFormattedTime('Europe/Paris');
    }
    if (canadianTimeEl) {
        canadianTimeEl.innerHTML = getFormattedTime('America/Montreal');
    }
}

function updateProgressBar() {
    const now = new Date().getTime();
    const totalDuration = targetDate - startDate;
    let elapsed = now - startDate;

    if (progressBarEl && progressTextEl) {
        let percent;

        if (elapsed < 0) {
            percent = 0;
        } else if (now >= targetDate) {
            percent = 100;
            progressBarEl.style.width = "100%";
            progressBarEl.style.display = 'none';
            progressTextEl.textContent = "L'événement est terminé !";
        } else {
            percent = (elapsed / totalDuration) * 100;
            percent = Math.min(100, Math.max(0, percent));
            progressTextEl.textContent = "Progression vers la date cible";
            progressBarEl.style.display = 'block';
        }
        progressBarEl.style.width = percent + "%";
    }
}

function updateMessages() {
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

function updateTimeIcons() {
    document.querySelectorAll('.zone-card').forEach(card => {
        const timeZone = card.dataset.timezone;
        const localizedDate = new Date(new Date().toLocaleString("en-US", { timeZone: timeZone }));
        const hour = localizedDate.getHours();
        const timeIconElement = card.querySelector('.time-icon');

        if (timeIconElement) {
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
        }
    });

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

function displayRandomQuizQuestion() {
    if (!quizQuestionEl || !quizOptionsEl || !quizResultEl || !nextQuestionButton) {
        console.error("Un ou plusieurs éléments du quiz sont introuvables. Vérifiez les IDs dans index.html.");
        return;
    }
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
    quizResultEl.textContent = '';

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

function checkAnswer(selectedOption, correctAnswer) {
    const optionsButtons = document.querySelectorAll('.quiz-option-btn');
    optionsButtons.forEach(button => {
        button.disabled = true;
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

function loadQuizQuestions() {
    if (typeof quizQuestions === 'undefined') {
        console.error("Erreur: quizData.js n'est pas chargé ou quizQuestions n'est pas défini.");
    } else {
        console.log('Questions chargées :', quizQuestions.length);
    }
    displayRandomQuizQuestion();
}

// --- Logique des Statistiques Amusantes ---
function displayRandomFunStat() {
    if (!funStatTextEl) {
        console.error("L'élément de statistique amusante est introuvable. Vérifiez l'ID 'funStatText' dans index.html.");
        return;
    }
    if (typeof funStats === 'undefined' || funStats.length === 0) {
        funStatTextEl.textContent = "Aucune statistique amusante disponible pour le moment.";
        console.error("Erreur: funStats.js n'est pas chargé ou funStats n'est pas défini.");
    } else {
        const randomIndex = Math.floor(Math.random() * funStats.length);
        funStatTextEl.textContent = funStats[randomIndex];
    }
}

// --- Logique de l'Expression du Jour ---
function displayDailyExpression() {
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
function openFlightOnMap(flightData) {
    const params = new URLSearchParams();
    params.append('icao24', flightData.icao24 || '');
    params.append('callsign', encodeURIComponent(flightData.callsign || 'N/A'));
    params.append('type', flightData.flightType || 'unknown');

    if (flightData.flightType === 'live') {
        if (flightData.latitude) {
            params.append('lat', flightData.latitude);
        }
        if (flightData.longitude) {
            params.append('lon', flightData.longitude);
        }
    } else if (flightData.flightType === 'historical') {
        params.append('depIcao', flightData.departureAirportIcao || '');
        params.append('arrIcao', flightData.arrivalAirportIcao || '');
    }

    window.open(`map.html?${params.toString()}`, '_blank');
}

function clearFlightTable() {
    if (flightResultsTableBody) {
        flightResultsTableBody.innerHTML = '';
    }
    if (noFlightResults) {
        noFlightResults.style.display = 'table-row';
    }
}

async function searchLiveFlight(callsign) {
    showMessage(searchMessage, `Recherche du vol ${callsign}...`, 'info');
    hideMessage(airportMessage);
    clearFlightTable();
    updateFlightTableHeaders('live');

    try {
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
    hideMessage(searchMessage);
    clearFlightTable();
    updateFlightTableHeaders('logs');

    const now = Math.floor(Date.now() / 1000);
    const begin = now - (24 * 60 * 60);

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

function displayLiveFlightResults(flights) {
    flightResultsTableBody.innerHTML = '';
    if (flights.length === 0) {
        if (noFlightResults) noFlightResults.style.display = 'table-row';
        return;
    }
    if (noFlightResults) noFlightResults.style.display = 'none';

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

        row.dataset.flightType = 'live';
        row.dataset.icao24 = icao24;
        row.dataset.callsign = callsign;

        if (flight[LATITUDE_INDEX] !== null && flight[LONGITUDE_INDEX] !== null) {
            row.dataset.latitude = flight[LATITUDE_INDEX];
            row.dataset.longitude = flight[LONGITUDE_INDEX];
        } else {
            delete row.dataset.latitude;
            delete row.dataset.longitude;
        }

        row.addEventListener('click', () => openFlightOnMap(row.dataset));
    });
}

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

        row.dataset.flightType = 'historical';
        row.dataset.icao24 = flight.icao24 || '';
        row.dataset.callsign = flight.callsign || 'N/A';
        row.dataset.departureAirportIcao = flight.estDepartureAirport || '';
        row.dataset.arrivalAirportIcao = flight.estArrivalAirport || '';

        row.addEventListener('click', () => openFlightOnMap(row.dataset));
    });
}

function updateFlightTableHeaders(mode) {
    const tableHead = document.querySelector('#flightResultsTable thead tr');
    if (!tableHead) return;

    tableHead.innerHTML = '';

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

// --- Fonctions pour la Carte des Vols en Direct ---

// Fonction pour récupérer et afficher les vols en direct
async function fetchAndDisplayLiveFlights() {
    if (!liveFlightMap) return; // S'assurer que la carte est initialisée

    showMessage(liveMapMessage, "Mise à jour des vols en direct...", 'info');

    try {
        // Obtenir la vue actuelle de la carte pour limiter la requête API
        const bounds = liveFlightMap.getBounds();
        const lats = [bounds.getSouth(), bounds.getNorth()];
        const lons = [bounds.getWest(), bounds.getEast()];

        // Limitez la zone de recherche pour ne pas surcharger l'API (ex: une zone européenne ou transatlantique)
        // Vous pouvez ajuster ces valeurs ou les rendre dynamiques
        const bbox = `lamin=${lats[0]}&lomin=${lons[0]}&lamax=${lats[1]}&lomax=${lons[1]}`;
        const apiUrl = `https://opensky-network.org/api/states/all?${bbox}`;

        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const data = await response.json();

        if (data && data.states) {
            const newAircraftMarkers = {}; // Pour les marqueurs mis à jour
            const displayedAircraftCount = data.states.length;

            data.states.forEach(flight => {
                const icao24 = flight[0];
                const callsign = flight[1] ? flight[1].trim() : 'N/A';
                const latitude = flight[6];
                const longitude = flight[5];
                const altitude = flight[7] !== null ? `${(flight[7] * 3.28084).toFixed(0)} ft` : 'N/A'; // Convertir en pieds
                const heading = flight[10]; // Cap réel (true track)

                // Afficher seulement les avions en vol
                if (latitude !== null && longitude !== null && flight[8] === false) {
                    if (aircraftMarkers[icao24]) {
                        // Mettre à jour la position du marqueur existant
                        aircraftMarkers[icao24].setLatLng([latitude, longitude]);
                        aircraftMarkers[icao24].setPopupContent(`<b>${callsign}</b><br>Altitude: ${altitude}<br>Cap: ${heading ? heading.toFixed(0) + '°' : 'N/A'}`);
                        newAircraftMarkers[icao24] = aircraftMarkers[icao24];
                        delete aircraftMarkers[icao24]; // Marquer comme traité
                    } else {
                        // Créer un nouveau marqueur
                        const marker = L.marker([latitude, longitude], {
                            // Optionnel: icône personnalisée pour un avion
                            // icon: L.icon({
                            //     iconUrl: './images/plane-icon.png', // Chemin vers une icône d'avion
                            //     iconSize: [32, 32],
                            //     iconAnchor: [16, 16]
                            // })
                        })
                            .addTo(liveFlightMap)
                            .bindPopup(`<b>${callsign}</b><br>Altitude: ${altitude}<br>Cap: ${heading ? heading.toFixed(0) + '°' : 'N/A'}`);
                        newAircraftMarkers[icao24] = marker;
                    }
                }
            });

            // Supprimer les marqueurs des avions qui ne sont plus dans les données (atterris ou hors de portée)
            for (const icao24 in aircraftMarkers) {
                liveFlightMap.removeLayer(aircraftMarkers[icao24]);
            }
            aircraftMarkers = newAircraftMarkers; // Mettre à jour la liste des marqueurs actifs

            showMessage(liveMapMessage, `${displayedAircraftCount} vol(s) affiché(s) sur la carte.`, 'success');

        } else {
            showMessage(liveMapMessage, "Aucune donnée de vol en direct reçue de l'API OpenSky.", 'info');
        }

    } catch (error) {
        console.error('Erreur lors de la récupération des vols en direct:', error);
        showMessage(liveMapMessage, `Erreur: ${error.message}. Impossible de récupérer les vols en direct.`, 'error');
    }
}

// Fonction pour initialiser la carte des vols en direct
function initializeLiveFlightMap() {
    const mapContainer = document.getElementById('liveFlightMap');
    if (!mapContainer) {
        console.error("Conteneur de carte 'liveFlightMap' introuvable.");
        showMessage(liveMapMessage, "Erreur: Impossible d'initialiser la carte (conteneur introuvable).", 'error');
        return;
    }

    // Supprimer l'ancienne carte si elle existe
    if (liveFlightMap !== null) {
        liveFlightMap.remove();
        liveFlightMap = null;
        // Supprimer tous les anciens marqueurs pour s'assurer d'un état propre
        for (const icao24 in aircraftMarkers) {
            delete aircraftMarkers[icao24];
        }
        aircraftMarkers = {};
        if (updateMapInterval) {
            clearInterval(updateMapInterval);
            updateMapInterval = null;
        }
    }

    // Initialiser la carte Leaflet (centrée sur l'Europe/Atlantique par défaut)
    liveFlightMap = L.map('liveFlightMap').setView([47.0, -5.0], 5); // Centré près de Nantes, zoom 5

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(liveFlightMap);

    // Mettre à jour le zoom affiché
    if (currentZoomSpan) {
        currentZoomSpan.textContent = liveFlightMap.getZoom();
    }
    if (zoomLevelInput) {
        zoomLevelInput.value = liveFlightMap.getZoom(); // Synchroniser le slider
    }


    // Écouteur pour le changement de zoom de la carte
    liveFlightMap.on('zoomend', () => {
        if (currentZoomSpan) {
            currentZoomSpan.textContent = liveFlightMap.getZoom();
            if (zoomLevelInput) {
                zoomLevelInput.value = liveFlightMap.getZoom();
            }
        }
    });

    // Mettre à jour les vols toutes les 10 secondes (ajustez si nécessaire)
    fetchAndDisplayLiveFlights(); // Premier chargement immédiat
    updateMapInterval = setInterval(fetchAndDisplayLiveFlights, 10000); // Rafraîchissement régulier

    showMessage(liveMapMessage, "Carte des vols en direct initialisée. Chargement des données...", 'info');
}

// Fonction pour désactiver la carte (lorsque l'onglet n'est plus actif)
function disableLiveFlightMap() {
    if (updateMapInterval) {
        clearInterval(updateMapInterval);
        updateMapInterval = null;
    }
    // Supprimer tous les marqueurs quand l'onglet n'est plus visible
    for (const icao24 in aircraftMarkers) {
        if (aircraftMarkers[icao24] && liveFlightMap) { // S'assurer que le marqueur et la carte existent
            liveFlightMap.removeLayer(aircraftMarkers[icao24]);
        }
    }
    aircraftMarkers = {}; // Vider l'objet des marqueurs
    // Ne pas détruire l'instance de la carte pour une réactivation plus rapide,
    // mais si des problèmes de rendu surviennent, liveFlightMap.remove() peut être réactivé.
    // Cependant, cela nécessiterait de recréer complètement la carte.
}


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
    countdownInterval = setInterval(updateCountdown, 1000);
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

    // --- Logique de gestion des onglets ---
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
            if (targetContent) {
                targetContent.classList.add('active');
            } else {
                console.error(`Contenu de l'onglet avec l'ID "${targetTab}" introuvable.`);
            }

            // Gérer l'activation/désactivation de la carte des vols en direct
            if (targetTab === 'live-map') {
                initializeLiveFlightMap();
            } else {
                disableLiveFlightMap(); // Arrêter les mises à jour lorsque l'onglet est désactivé
            }
        });
    });

    // Gestion du slider de zoom pour la carte des vols en direct
    if (zoomLevelInput) {
        zoomLevelInput.addEventListener('input', () => {
            if (liveFlightMap) { // S'assurer que la carte est initialisée
                liveFlightMap.setZoom(parseInt(zoomLevelInput.value));
            }
        });
    }

    // Bouton de réinitialisation de la vue de la carte
    if (resetMapBtn) {
        resetMapBtn.addEventListener('click', () => {
            if (liveFlightMap) {
                liveFlightMap.setView([47.0, -5.0], 5); // Vue par défaut (Europe/Atlantique)
                if (zoomLevelInput) {
                    zoomLevelInput.value = 5; // Réinitialiser le slider
                }
            }
        });
    }


    // Initialisation au chargement de la page : Afficher l'onglet "Accueil" par défaut
    const defaultTabButton = document.querySelector('.tab-button.active');
    if (defaultTabButton) {
        const defaultTargetTab = defaultTabButton.dataset.tab;
        const defaultTargetContent = document.getElementById(defaultTargetTab);
        if (defaultTargetContent) {
            defaultTargetContent.classList.add('active');
        }
        // Si l'onglet "live-map" est le premier à être actif au chargement
        if (defaultTargetTab === 'live-map') {
            initializeLiveFlightMap();
        }
    } else {
        // Si aucun onglet n'a la classe active, active le premier par défaut
        if (tabButtons.length > 0) {
            tabButtons[0].classList.add('active');
            if (tabContents.length > 0) {
                tabContents[0].classList.add('active');
            }
            if (tabButtons[0].dataset.tab === 'live-map') {
                initializeLiveFlightMap();
            }
        }
    }

    // Message initial pour l'onglet de la carte
    showMessage(liveMapMessage, "Cliquez sur l'onglet 'Carte des vols en direct' pour voir les avions.", 'info');

});