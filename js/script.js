// script.js

// --- Configuration du compte à rebours ---
const targetDate = new Date('2025-09-10T23:59:59').getTime(); // Cible: 10 Septembre 2025
const startDate = new Date('2025-06-16T00:00:00').getTime(); // Date de début du suivi (aujourd'hui)

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
    if (hour >= 5 && hour < 10) return "Bon matin !"; // Matin (5h-9h59)
    if (hour >= 10 && hour < 17) return "Bonne journée !"; // Journée (10h-16h59)
    if (hour >= 17 && hour < 22) return "Bonne soirée !"; // Soirée (17h-21h59)
    return "Bonne nuit !"; // Nuit (22h-4h59)
}

function getTodayDateFormatted() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Fonction pour mélanger un tableau (utilisé pour les options de quiz)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// --- Fonctions de Mise à Jour du DOM ---

function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;
    const countdownElement = document.getElementById('countdown');

    if (countdownElement) { // Vérification pour s'assurer que l'élément existe
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

function updateProgressBar() {
    const now = new Date().getTime();
    const totalDuration = targetDate - startDate;
    let elapsed = now - startDate;
    const progressBarEl = document.getElementById('progressBar');
    const progressTextEl = document.querySelector('.progress-text');

    if (progressBarEl && progressTextEl) { // Vérification des éléments
        let percent;

        if (elapsed < 0) {
            percent = 0;
        } else if (now >= targetDate) {
            percent = 100;
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
    const messageNantesEl = document.getElementById('messageNantes');
    const messageMontrealEl = document.getElementById('messageMontreal');

    if (messageNantesEl) {
        const nantesDate = new Date(new Date().toLocaleString("en-US", {timeZone: 'Europe/Paris'}));
        const nantesHour = nantesDate.getHours();
        messageNantesEl.textContent = getPersonalizedMessage(nantesHour);
    }

    if (messageMontrealEl) {
        const montrealDate = new Date(new Date().toLocaleString("en-US", {timeZone: 'America/Montreal'}));
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

        if (timeIconElement) { // Vérification de l'existence de l'icône
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

    // Mettre à jour le fond global du body (matin/jour/soir/nuit)
    const now = new Date();
    const currentHour = now.getHours();

    // Supprime toutes les classes de fond précédentes
    document.body.classList.remove('morning-background', 'day-background', 'evening-background', 'night-background');
    document.body.classList.remove('day', 'night'); // Suppression des anciennes classes jour/nuit si elles existaient

    if (currentHour >= 5 && currentHour < 10) {
        document.body.classList.add('morning-background');
        document.body.classList.add('day'); // Ajout pour compatibilité thème jour
    } else if (currentHour >= 10 && currentHour < 17) {
        document.body.classList.add('day-background');
        document.body.classList.add('day');
    } else if (currentHour >= 17 && currentHour < 22) {
        document.body.classList.add('evening-background');
        document.body.classList.add('night'); // Ajout pour compatibilité thème nuit
    } else {
        document.body.classList.add('night-background');
        document.body.classList.add('night');
    }
}

// --- Logique du Quiz ---
let currentQuizQuestionIndex = 0;
let score = 0;

// Assurez-vous que ces sélecteurs correspondent aux IDs de votre HTML (en kebab-case)
const quizQuestionEl = document.getElementById('quiz-question');
const quizOptionsEl = document.getElementById('quiz-options');
const quizResultEl = document.getElementById('quiz-result');
const nextQuestionButton = document.getElementById('next-question-btn');

function displayRandomQuizQuestion() {
    if (!quizQuestionEl || !quizOptionsEl || !quizResultEl || !nextQuestionButton) {
        console.error("Un ou plusieurs éléments du quiz sont introuvables. Vérifiez les IDs dans index.html.");
        return; // Arrêter la fonction si les éléments ne sont pas là
    }

    if (!quizQuestions || quizQuestions.length === 0) {
        quizQuestionEl.textContent = "Aucune question de quiz disponible.";
        quizOptionsEl.innerHTML = '';
        nextQuestionButton.style.display = 'none';
        return;
    }

    const todayDate = getTodayDateFormatted();
    // Filtre les questions pour aujourd'hui. Si aucune, utilise toutes les questions.
    const questionsForToday = quizQuestions.filter(q => q.date === todayDate);

    let questionToDisplay;
    if (questionsForToday.length > 0) {
        const randomIndex = Math.floor(Math.random() * questionsForToday.length);
        questionToDisplay = questionsForToday[randomIndex];
    } else {
        const randomIndex = Math.floor(Math.random() * quizQuestions.length);
        questionToDisplay = quizQuestions[randomIndex];
    }

    currentQuizQuestionIndex = quizQuestions.indexOf(questionToDisplay); // Met à jour l'index pour la vérification

    quizQuestionEl.textContent = questionToDisplay.question;
    quizOptionsEl.innerHTML = '';
    quizResultEl.textContent = ''; // Réinitialiser le résultat

    const shuffledOptions = shuffleArray([...questionToDisplay.options]); // Mélanger les options

    shuffledOptions.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('quiz-option-btn');
        button.onclick = () => checkAnswer(option, questionToDisplay.correctAnswer);
        quizOptionsEl.appendChild(button);
    });

    nextQuestionButton.style.display = 'none'; // Cacher le bouton "Question suivante" au début
}

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
    nextQuestionButton.style.display = 'block'; // Afficher le bouton "Question suivante"
}

// Fonction pour charger les questions (maintenant, simplement afficher la première)
function loadQuizQuestions() {
    // Les questions sont déjà disponibles via quizData.js
    console.log('Questions chargées :', quizQuestions);
    displayRandomQuizQuestion();
}

// --- Logique des Statistiques Amusantes ---
const funStatTextEl = document.getElementById('funStatText'); // Référence à l'élément HTML de la statistique

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
const englishExpressionEl = document.getElementById('english-expression');
const frenchTranslationEl = document.getElementById('french-translation');
const revealTranslationBtn = document.getElementById('reveal-translation-btn');

function displayDailyExpression() {
    if (!englishExpressionEl || !frenchTranslationEl || !revealTranslationBtn || !englishExpressions || englishExpressions.length === 0) {
        console.error("Éléments d'expression ou données introuvables.");
        return;
    }

    const randomIndex = Math.floor(Math.random() * englishExpressions.length);
    const dailyExpression = englishExpressions[randomIndex];

    englishExpressionEl.textContent = dailyExpression.expression;
    frenchTranslationEl.textContent = "Cliquez pour voir la traduction...";
    frenchTranslationEl.style.color = 'transparent'; // Pour cacher le texte initialement
    frenchTranslationEl.style.textShadow = '0 0 8px #333'; // Effet de flou
    revealTranslationBtn.style.display = 'block';

    revealTranslationBtn.onclick = () => {
        frenchTranslationEl.textContent = dailyExpression.translation;
        frenchTranslationEl.style.color = ''; // Révéler la couleur
        frenchTranslationEl.style.textShadow = 'none'; // Enlever le flou
        revealTranslationBtn.style.display = 'none';
    };
}



// --- Initialisation et boucles ---

// Mettre à jour le compte à rebours, les heures, la barre de progression et les messages toutes les secondes
const countdownInterval = setInterval(updateCountdown, 1000);
setInterval(updateTimes, 1000);
setInterval(updateProgressBar, 1000);
setInterval(updateMessages, 1000);
setInterval(updateTimeIcons, 1000); // Mettre à jour les icônes des fuseaux horaires toutes les secondes

// Exécuter les mises à jour immédiatement au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    updateCountdown();
    updateTimes();
    updateProgressBar();
    updateMessages();
    updateTimeIcons();
    loadQuizQuestions(); // Charger la première question du quiz au démarrage
    displayRandomFunStat(); // Charger une statistique amusante au démarrage
    displayDailyExpression();
    // Initialiser le mini-jeu ici si vous en avez un (fonction 'initGame' par exemple)
});

// Gérer le bouton "Question suivante" du quiz
// Vérifier si le bouton existe avant d'ajouter l'écouteur
if (nextQuestionButton) {
    nextQuestionButton.addEventListener('click', () => {
        displayRandomQuizQuestion(); // Afficher une nouvelle question
    });
}

