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
    if (hour >= 5 && hour < 10) return "Bon matin !"; // Matin
    if (hour >= 10 && hour < 17) return "Bonne journée !"; // Journée
    if (hour >= 17 && hour < 22) return "Bonne soirée !"; // Soirée
    return "Bonne nuit !"; // Nuit
}

function getTodayDateFormatted() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// --- Fonctions de Mise à Jour du DOM ---

function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;
    const countdownElement = document.getElementById('countdown');

    if (distance < 0) {
        // L'événement est passé
        clearInterval(countdownInterval); // Arrête le compte à rebours
        countdownElement.innerHTML = "L'événement est arrivé !";
        document.querySelector('.progress-container').style.display = 'none'; // Cacher la barre de progression
    } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        countdownElement.innerHTML = `${days}j ${hours}h ${minutes}m ${seconds}s`;
    }
}

function updateTimes() {
    document.getElementById('frenchTime').innerHTML = getFormattedTime('Europe/Paris');
    document.getElementById('canadianTime').innerHTML = getFormattedTime('America/Montreal');
}

function updateProgressBar() {
    const now = new Date().getTime();
    const totalDuration = targetDate - startDate; // Durée totale entre le début et la cible

    let elapsed = now - startDate; // Temps écoulé depuis le début

    let percent;

    if (elapsed < 0) { // Si la date actuelle est avant le début du suivi
        percent = 0;
    } else if (now >= targetDate) { // Si la date cible est passée ou atteinte
        percent = 100;
        document.getElementById('progressBar').style.display = 'none';
        document.querySelector('.progress-text').textContent = "L'événement est terminé !";
    } else {
        percent = (elapsed / totalDuration) * 100;
        percent = Math.min(100, Math.max(0, percent)); // Limiter entre 0 et 100
        document.querySelector('.progress-text').textContent = "Progression vers la date cible";
        document.getElementById('progressBar').style.display = 'block';
    }

    document.getElementById('progressBar').style.width = percent + "%";
}


function updateMessages() {
    const nantesDate = new Date(new Date().toLocaleString("en-US", {timeZone: 'Europe/Paris'}));
    const nantesHour = nantesDate.getHours();
    document.getElementById('messageNantes').textContent = getPersonalizedMessage(nantesHour);

    const montrealDate = new Date(new Date().toLocaleString("en-US", {timeZone: 'America/Montreal'}));
    const montrealHour = montrealDate.getHours();
    document.getElementById('messageMontreal').textContent = getPersonalizedMessage(montrealHour);
}

function updateTimeIcons() {
    document.querySelectorAll('.zone-card').forEach(card => {
        const timeZone = card.dataset.timezone;
        const localizedDate = new Date(new Date().toLocaleString("en-US", { timeZone: timeZone }));
        const hour = localizedDate.getHours();
        const timeIconElement = card.querySelector('.time-icon');

        let iconClass = '';
        let timePeriodClass = '';

        // Définir l'icône et la classe de période en fonction de l'heure locale de la carte
        if (hour >= 5 && hour < 10) { // 05h - 09h59: Matin
            iconClass = 'fas fa-cloud-sun'; // Soleil avec nuage (aube)
            timePeriodClass = 'morning';
        } else if (hour >= 10 && hour < 17) { // 10h - 16h59: Jour
            iconClass = 'fas fa-sun'; // Soleil
            timePeriodClass = 'day';
        } else if (hour >= 17 && hour < 22) { // 17h - 21h59: Soir
            iconClass = 'fas fa-cloud-moon'; // Lune avec nuage (crépuscule)
            timePeriodClass = 'evening';
        } else { // 22h - 04h59: Nuit
            iconClass = 'fas fa-moon'; // Lune
            timePeriodClass = 'night';
        }

        // Mettre à jour l'icône HTML
        timeIconElement.innerHTML = `<i class="${iconClass}"></i>`;

        // Appliquer la classe de période pour le style CSS
        timeIconElement.className = 'time-icon ' + timePeriodClass;
    });

    // Mettre à jour le fond global du body (jour/nuit) en fonction de l'heure locale du visiteur
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


// --- Fait du Jour (du 16 juin au 10 septembre 2025) ---
const dailyFacts = {
    "2025-06-16": "Le 16 juin est le 'Bloomsday', célébrant la vie et l'œuvre de l'écrivain irlandais James Joyce, notamment son roman 'Ulysse'.",
    "2025-06-17": "Le 17 juin 1885, la Statue de la Liberté arrive à New York, un cadeau de la France aux États-Unis.",
    "2025-06-18": "Le 18 juin 1815, Napoléon Bonaparte est définitivement vaincu à la bataille de Waterloo.",
    "2025-06-19": "Le 19 juin 1865, les derniers esclaves sont librérés au Texas, marquant la première célébration du 'Juneteenth'.",
    "2025-06-20": "Le 20 juin est le 'World Refugee Day' (Journée Mondiale des Réfugiés), mis en place par les Nations Unies.",
    "2025-06-21": "Le 21 juin marque le solstice d'été dans l'hémisphère nord, le jour le plus long de l'année. C'est aussi la Fête de la Musique !",
    "2025-06-22": "Le 22 juin 1941 marque le début de l'Opération Barbarossa, l'invasion de l'URSS par l'Allemagne nazie.",
    "2025-06-23": "Le 23 juin 1894, le Comité International Olympique est fondé à Paris par Pierre de Coubertin.",
    "2025-06-24": "Le 24 juin, la Fête Nationale du Québec (Saint-Jean-Baptiste) est célébrée avec ferveur au Québec, Canada.",
    "2025-06-25": "Le 25 juin 1950 marque le début de la Guerre de Corée, un conflit majeur de la Guerre Froide.",
    "2025-06-26": "Le 26 juin 1945, la Charte des Nations Unies est signée à San Francisco, créant l'ONU.",
    "2025-06-27": "Le 27 juin 1893, le brevet pour la fermeture éclair est accordé à Whitcomb L. Judson.",
    "2025-06-28": "Le 28 juin 1914, l'assassinat de l'Archiduc François-Ferdinand à Sarajevo déclenche la Première Guerre mondiale.",
    "2025-06-29": "Le 29 juin 2007, le premier iPhone est commercialisé aux États-Unis, révolutionnant le marché des smartphones.",
    "2025-06-30": "Le 30 juin 1908, l'événement de la Toungouska, une explosion massive d'origine inconnue, dévaste une région de Sibérie.",

    // --- Juillet 2025 ---
    "2025-07-01": "Le 1er juillet est la fête du Canada, célébrant l'anniversaire de la formation du Dominion du Canada en 1867.",
    "2025-07-02": "Le 2 juillet 1962, le premier supermarché Walmart ouvre ses portes à Rogers, Arkansas.",
    "2025-07-03": "Le 3 juillet 1962, l'Algérie proclame son indépendance après plus d'un siècle de colonisation française.",
    "2025-07-04": "Le 4 juillet est l'Independence Day aux États-Unis, commémorant la Déclaration d'Indépendance en 1776.",
    "2025-07-05": "Le 5 juillet 1946, le bikini, maillot de bain jugé scandaleux, est présenté à Paris par le créateur Louis Réard.",
    "2025-07-06": "Le 6 juillet 1957, John Lennon et Paul McCartney se rencontrent pour la première fois, marquant le début des Beatles.",
    "2025-07-07": "Le 7 juillet 2007, les 'Nouvelles Sept Merveilles du Monde' sont annoncées, choisies par un vote mondial.",
    "2025-07-08": "Le 8 juillet 1889, le 'Wall Street Journal' est publié pour la première fois à New York.",
    "2025-07-09": "Le 9 juillet 1816, l'Argentine déclare son indépendance de l'Espagne.",
    "2025-07-10": "Le 10 juillet 1985, le navire de Greenpeace 'Rainbow Warrior' est coulé par les services secrets français en Nouvelle-Zélande.",
    "2025-07-11": "Le 11 juillet 1987, la population mondiale atteint 5 milliards d'habitants, marquant le 'Jour des Cinq Milliards'.",
    "2025-07-12": "Le 12 juillet 1998, l'équipe de France de football remporte la Coupe du Monde à domicile face au Brésil.",
    "2025-07-13": "Le 13 juillet 1930, la première Coupe du Monde de football est lancée en Uruguay.",
    "2025-07-14": "Le 14 juillet est la Fête Nationale française, commémorant la prise de la Bastille en 1789.",
    "2025-07-15": "Le 15 juillet 1099, Jérusalem est prise par les croisés lors de la Première Croisade.",
    "2025-07-16": "Le 16 juillet 1969, la mission Apollo 11 décolle de Cap Canaveral en Floride, en route vers la Lune.",
    "2025-07-17": "Le 17 juillet 1945, la Conférence de Potsdam, entre les Alliés, débute pour discuter de l'avenir de l'Europe après la guerre.",
    "2025-07-18": "Le 18 juillet 1918, Nelson Mandela naît en Afrique du Sud. Sa date de naissance est maintenant le Mandela Day.",
    "2025-07-19": "Le 19 juillet 1848, la première convention pour les droits des femmes aux États-Unis a lieu à Seneca Falls.",
    "2025-07-20": "Le 20 juillet 1969, Neil Armstrong devient le premier homme à marcher sur la Lune.",
    "2025-07-21": "Le 21 juillet 1969, la 'Reine des Neiges' est publiée par Hans Christian Andersen pour la première fois.",
    "2025-07-22": "Le 22 juillet 1933, Wiley Post achève le premier vol solo autour du monde, en 7 jours, 18 heures et 49 minutes.",
    "2025-07-23": "Le 23 juillet 1829, William Burt publie le premier brevet pour la machine à écrire aux États-Unis.",
    "2025-07-24": "Le 24 juillet 1969, Apollo 11 amerrit avec succès dans l'océan Pacifique, ramenant les astronautes de la Lune.",
    "2025-07-25": "Le 25 juillet 1978, Louise Brown, le premier 'bébé-éprouvette', naît en Angleterre.",
    "2025-07-26": "Le 26 juillet 1953, Fidel Castro mène l'attaque sur la caserne de Moncada à Cuba, marquant le début de la Révolution cubaine.",
    "2025-07-27": "Le 27 juillet 1953, l'armistice de Panmunjeom est signé, mettant fin aux combats de la Guerre de Corée.",
    "2025-07-28": "Le 28 juillet 1914, le début officiel de la Première Guerre mondiale, suite à la déclaration de guerre de l'Autriche-Hongrie à la Serbie.",
    "2025-07-29": "Le 29 juillet 1981, le mariage du Prince Charles et de Lady Diana Spencer est célébré à Londres.",
    "2025-07-30": "Le 30 juillet 1930, l'Uruguay remporte la première Coupe du Monde de football, en battant l'Argentine en finale.",
    "2025-07-31": "Le 31 juillet 1969, la mission Apollo 11 retourne sur Terre après son voyage historique sur la Lune.",

    // --- Août 2025 ---
    "2025-08-01": "Le 1er août 1914, l'Allemagne déclare la guerre à la Russie, marquant une escalade majeure de la Première Guerre mondiale.",
    "2025-08-02": "Le 2 août 1934, Adolf Hitler devient Führer et chancelier de l'Allemagne, consolidant son pouvoir.",
    "2025-08-03": "Le 3 août 1492, Christophe Colomb quitte Palos de la Frontera, en Espagne, pour son premier voyage vers les Amériques.",
    "2025-08-04": "Le 4 août 1914, le Royaume-Uni déclare la guerre à l'Allemagne, s'engageant dans la Première Guerre mondiale.",
    "2025-08-05": "Le 5 août 1962, Marilyn Monroe, l'icône hollywoodienne, est retrouvée morte à son domicile de Los Angeles.",
    "2025-08-06": "Le 6 août 1945, la première bombe atomique, 'Little Boy', est larguée sur Hiroshima, au Japon, par les États-Unis.",
    "2025-08-07": "Le 7 août 1998, des attentats à la bombe contre les ambassades américaines en Tanzanie et au Kenya tuent plus de 200 personnes.",
    "2025-08-08": "Le 8 août 1974, Richard Nixon annonce sa démission de la présidence des États-Unis suite au scandale du Watergate.",
    "2025-08-09": "Le 9 août 1945, la deuxième bombe atomique, 'Fat Man', est larguée sur Nagasaki, au Japon.",
    "2025-08-10": "Le 10 août 1792, l'insurrection de la Commune de Paris mène à la chute de la monarchie française.",
    "2025-08-11": "Le 11 août 1929, Babe Ruth frappe son 500e home run en carrière, un jalon historique dans le baseball.",
    "2025-08-12": "Le 12 août 1981, IBM lance son premier ordinateur personnel (PC), marquant un tournant dans l'informatique domestique.",
    "2025-08-13": "Le 13 août 1961, la construction du mur de Berlin commence, divisant Berlin en Est et Ouest.",
    "2025-08-14": "Le 14 août 1945, le Japon capitule, signifiant la fin de la Seconde Guerre mondiale.",
    "2025-08-15": "Le 15 août est l'Assomption, une fête religieuse importante dans de nombreux pays, et un jour férié en France.",
    "2025-08-16": "Le 16 août 1977, Elvis Presley, le 'Roi du Rock and Roll', décède à Memphis, Tennessee.",
    "2025-08-17": "Le 17 août 1982, le premier CD audio est produit en Allemagne, annonçant une révolution musicale.",
    "2025-08-18": "Le 18 août 1920, le 19e amendement de la Constitution américaine est ratifié, donnant le droit de vote aux femmes.",
    "2025-08-19": "Le 19 août 1909, le premier vol du dirigeable Zeppelin est réalisé en Allemagne.",
    "2025-08-20": "Le 20 août 1968, l'Union Soviétique envahit la Tchécoslovaquie pour écraser le Printemps de Prague.",
    "2025-08-21": "Le 21 août 1911, la Joconde est volée du Louvre, un événement qui fit sensation dans le monde entier.",
    "2025-08-22": "Le 22 août 1485, la Bataille de Bosworth Field marque la fin de la Guerre des Deux-Roses en Angleterre.",
    "2025-08-23": "Le 23 août est la Journée internationale du souvenir de la traite négrière et de son abolition.",
    "2025-08-24": "Le 24 août 79 après J.-C., le Vésuve entre en éruption, ensevelissant Pompéi et Herculanum.",
    "2025-08-25": "Le 25 août 1944, Paris est libérée de l'occupation allemande pendant la Seconde Guerre mondiale.",
    "2025-08-26": "Le 26 août 1789, la Déclaration des Droits de l'Homme et du Citoyen est adoptée en France.",
    "2025-08-27": "Le 27 août 1883, l'éruption du Krakatoa, une des plus violentes de l'histoire, provoque un raz-de-marée dévastateur.",
    "2025-08-28": "Le 28 août 1963, Martin Luther King Jr. prononce son célèbre discours 'I Have a Dream' à Washington D.C.",
    "2025-08-29": "Le 29 août 1997, Netflix est fondé, transformant plus tard la façon dont nous consommons le divertissement.",
    "2025-08-30": "Le 30 août 1991, l'Azerbaïdjan déclare son indépendance de l'Union Soviétique.",
    "2025-08-31": "Le 31 août 1997, Lady Diana, Princesse de Galles, décède tragiquement à Paris dans un accident de voiture.",

    // --- Septembre 2025 ---
    "2025-09-01": "Le 1er septembre 1939, l'Allemagne nazie envahit la Pologne, déclenchant la Seconde Guerre mondiale.",
    "2025-09-02": "Le 2 septembre 1945, le Japon signe les actes de capitulation, mettant fin officiellement à la Seconde Guerre mondiale.",
    "2025-09-03": "Le 3 septembre 1783, le traité de Paris est signé, reconnaissant l'indépendance des États-Unis.",
    "2025-09-04": "Le 4 septembre 1888, George Eastman (Kodak) reçoit un brevet pour son appareil photo à pellicule, rendant la photographie accessible.",
    "2025-09-05": "Le 5 septembre 1972, les Jeux Olympiques de Munich sont marqués par une prise d'otages et un massacre.",
    "2025-09-06": "Le 6 septembre 1901, le président américain William McKinley est assassiné, Theodore Roosevelt devient président.",
    "2025-09-07": "Le 7 septembre 1822, le Brésil déclare son indépendance du Portugal.",
    "2025-09-08": "Le 8 septembre 1966, la série télévisée 'Star Trek' est diffusée pour la première fois aux États-Unis.",
    "2025-09-09": "Le 9 septembre 1976, la mort de Mao Zedong, leader de la République Populaire de Chine, est annoncée.",
    "2025-09-10": "Le 10 septembre, c'est la date cible de votre événement ! Profitez-en pleinement et célébrez ce jour spécial !"
};

const funStats = [
    "Saviez-vous que la vitesse de la lumière est d'environ 299 792 458 mètres par seconde ?",
    "La Terre tourne à environ 1 670 km/h à l'équateur, mais nous ne le sentons pas !",
    "Une journée sur Vénus est plus longue qu'une année sur Vénus !",
    "Le temps moyen qu'une personne passe à dormir dans sa vie est d'environ 25 ans.",
    "Il y a environ 31 536 000 secondes dans une année non bissextile.",
    "Les secondes intercalaires sont parfois ajoutées au temps universel pour rester synchronisé avec la rotation de la Terre.",
    "Le concept de fuseaux horaires a été largement adopté avec le développement des chemins de fer.",
    "Il y a 24 fuseaux horaires principaux dans le monde, mais de nombreuses zones utilisent des demi-heures ou des quarts d'heure de décalage !",
    "La durée d'une année sidérale (par rapport aux étoiles fixes) est légèrement plus longue qu'une année tropicale (saisons).",
    "Le 'Grand Saut' de l'horloge : en 1582, 10 jours ont été 'sautés' pour corriger le calendrier julien et créer le calendrier grégorien.",
    "Les horloges atomiques sont les instruments de mesure du temps les plus précis connus de l'humanité.",
    "Mercure est la planète la plus rapide de notre système solaire, faisant le tour du soleil en seulement 88 jours terrestres.",
    "Le cri d'un volcan en éruption peut être entendu à des milliers de kilomètres, comme celui du Krakatoa en 1883.",
    "Une fourmi peut soulever 50 fois son propre poids. Imaginez votre force si c'était le cas !",
    "Il faut environ 8 minutes et 20 secondes à la lumière du soleil pour atteindre la Terre.",
    "Le corps humain est composé d'environ 60% d'eau. Restez hydraté !",
    "La Grande Muraille de Chine n'est pas visible depuis l'espace à l'œil nu, contrairement à la croyance populaire.",
    "Il y a plus d'étoiles dans l'univers observable que de grains de sable sur toutes les plages de la Terre.",
    "Le plus ancien arbre vivant connu est un pin de Bristlecone de plus de 4 800 ans en Californie.",
    "Une journée martienne (sol) dure 24 heures et 39 minutes terrestres.",
    "Le cœur humain bat environ 100 000 fois par jour.",
    "Si le soleil était une balle de plage, la Terre serait de la taille d'un petit pois.",
    "Les nuages ne sont pas faits de vapeur d'eau mais de minuscules gouttelettes d'eau liquide ou de cristaux de glace.",
    "Le son voyage environ 4,3 fois plus vite dans l'eau que dans l'air.",
    "La plupart des diamants naturels ont des milliards d'années, formés au plus profond de la Terre.",
    "Le café est la boisson la plus consommée au monde après l'eau.",
    "Les astronautes ne peuvent pas roter dans l'espace en raison de l'absence de gravité.",
    "Il existe plus de 7 000 langues parlées dans le monde aujourd'hui.",
    "La Tour Eiffel peut grandir de 15 cm en été à cause de la dilatation thermique du métal.",
    "Un éclair est cinq fois plus chaud que la surface du soleil !",
    "Le bambou peut pousser jusqu'à 91 cm en une seule journée.",
    "Les rêves les plus intenses se produisent pendant le sommeil paradoxal (REM).",
    "Le miel est le seul aliment qui ne se gâte jamais.",
    "Un poulpe a trois cœurs.",
    "Les koalas dorment jusqu'à 20 heures par jour.",
    "Les flocons de neige ont tous une forme unique.",
    "La Joconde n'a pas de sourcils.",
    "Les papillons goûtent avec leurs pieds.",
    "Le rire est le meilleur des médicaments, il réduit le stress et renforce le système immunitaire.",
    "Une année-lumière est la distance que la lumière parcourt en un an.",
    "Le Sahara est le plus grand désert chaud du monde.",
    "Les baleines à bosse communiquent par des chants complexes.",
    "Le corps humain contient assez de fer pour fabriquer un petit clou.",
    "Les chats passent environ 70% de leur vie à dormir.",
    "Le vert est la couleur la plus reposante pour l'œil humain.",
    "Un crocodile ne peut pas tirer la langue.",
    "Les hiboux ne peuvent pas bouger leurs globes oculaires, ils doivent tourner toute leur tête.",
    "Les zèbres ont des rayures uniques, comme des empreintes digitales.",
    "Le chocolat était utilisé comme monnaie par les Aztèques.",
    "Un caméléon peut bouger ses yeux indépendamment l'un de l'autre.",
    "Il faut 17 muscles pour sourire et 43 pour froncer les sourcils.",
    "Le plus grand océan est l'océan Pacifique.",
    "Les serpents ont des paupières transparentes qui sont toujours fermées.",
    "Les pingouins sont les seuls oiseaux qui ne peuvent pas voler mais peuvent nager.",
    "La langue de la baleine bleue est si grande qu'environ 50 personnes pourraient se tenir dessus.",
    "La voix humaine peut produire environ 7 000 sons différents.",
    "Les doigts humains n'ont pas de muscles, ils sont actionnés par des tendons.",
    "Un cochon ne peut pas regarder le ciel.",
    "Le seul aliment qui ne se périme jamais est le miel.",
    "Le sang des homards est bleu.",
    "Un éclair moyen a assez d'énergie pour griller 100 000 morceaux de pain.",
    "Les méduses n'ont pas de cerveau, de cœur ou d'os.",
    "Les étoiles de mer peuvent régénérer des membres perdus.",
    "La lune s'éloigne de la Terre d'environ 3,8 cm par an.",
    "Le point le plus profond de l'océan est la Fosse des Mariannes.",
    "Un groupe de hiboux est appelé un parlement.",
    "Le nez humain peut reconnaître plus de mille milliards d'odeurs différentes.",
    "Les poissons rouges ont une mémoire de trois secondes, mais c'est un mythe ! Leur mémoire est bien meilleure.",
    "La Suisse a plus de hauts sommets que n'importe quel autre pays en Europe.",
    "Les flamants roses sont nés gris ; leur couleur rose vient de leur alimentation.",
    "Les chameaux peuvent boire 100 litres d'eau en 10 minutes.",
    "Le mot 'robot' vient du mot tchèque 'robota' qui signifie 'travail forcé'.",
    "Les humains partagent environ 50% de leur ADN avec les bananes.",
    "Le cri le plus fort d'un animal est celui de la baleine bleue, il peut atteindre 188 décibels.",
    "Les tornades sont plus courantes aux États-Unis que partout ailleurs dans le monde.",
    "Les glaciers et les calottes glaciaires contiennent environ 70% de l'eau douce du monde.",
    "La capitale du Canada est Ottawa, pas Toronto ni Montréal.",
    "Les fourmis sont les animaux qui vivent le plus longtemps sur Terre, certaines reines peuvent vivre 30 ans.",
    "La mer Morte est si salée qu'on peut flotter à sa surface.",
    "Les chats peuvent produire plus de 100 sons différents, tandis que les chiens n'en produisent qu'environ 10.",
    "Les arbres ne poussent pas en hauteur à cause de leurs feuilles, mais grâce à une couche de cellules appelée cambium.",
    "Il n'y a pas de jours fériés officiels à l'échelle mondiale.",
    "Le plus grand désert sur Terre est l'Antarctique.",
    "La lune n'a pas d'atmosphère, donc le ciel est toujours noir, même en plein jour.",
    "Un alligator peut vivre jusqu'à 80 ans.",
    "Le mot 'emoji' signifie 'image-lettre' en japonais.",
    "Les requins n'ont pas d'os, leurs squelettes sont faits de cartilage.",
    "La durée de vie d'une libellule est d'environ 24 heures.",
    "Le cerveau humain pèse environ 1,4 kg, mais il consomme 20% de l'oxygène du corps.",
    "Les canards ont une très bonne vision à 360 degrés.",
    "Un groupe de corbeaux s'appelle un 'meurtre'.",
    "La plupart des statues équestres où le cheval a les deux pattes avant en l'air indiquent que le cavalier est mort au combat.",
    "Les arcs-en-ciel sont en fait des cercles complets, mais nous n'en voyons que la moitié.",
    "L'oxygène a une couleur : sous forme liquide ou solide, il est bleu pâle.",
    "Le plus grand parc national du monde est au Groenland.",
    "Le son des cloches peut voyager plus loin la nuit que le jour.",
    "Les étoiles scintillent parce que leur lumière traverse différentes couches de l'atmosphère terrestre.",
    "La Terre a quatre saisons parce que son axe est incliné.",
    "Un coq ne peut pas chanter s'il ne peut pas étirer son cou.",
    "Les abeilles peuvent voler jusqu'à 24 km/h.",
    "Le plus grand poisson du monde est le requin-baleine.",
    "Il faut 6 minutes à la lumière du soleil pour atteindre Saturne.",
    "Les icebergs sont bleus car la glace est si compacte qu'elle absorbe toutes les couleurs sauf le bleu.",
    "Les pingouins ont un 'genou' caché sous leurs plumes.",
    "Le premier réveil ne pouvait sonner qu'à 4 heures du matin.",
    "Les arbres de la séquoia géant peuvent vivre plus de 3 000 ans.",
    "Les loutres de mer se tiennent la main pendant qu'elles dorment pour ne pas dériver.",
    "Les poules ont besoin de lumière pour pondre des œufs.",
    "Le mot 'gymnase' vient du mot grec 'gymnasion' qui signifiait 'lieu pour s'entraîner nu'.",
    "Il y a plus de vélos que d'habitants aux Pays-Bas.",
    "Le jour le plus court de l'année est le solstice d'hiver.",
    "Le nez et les oreilles humains continuent de grandir tout au long de la vie.",
    "Un seul grain de riz peut produire plus de 3 000 grains de riz par an.",
    "Les paresseux sont si lents que des algues peuvent pousser sur leur fourrure.",
    "Les kangourous ne peuvent pas sauter en arrière.",
    "Les étoiles de mer n'ont pas de cerveau.",
    "Un an sur Mars dure 687 jours terrestres.",
    "Le premier téléphone portable a été inventé en 1973 par Martin Cooper.",
    "Les arcs-en-ciel sont toujours opposés au soleil.",
    "Les caméléons changent de couleur en fonction de leur humeur, de leur température et de la lumière, pas seulement de leur environnement."
];

function updateDailyFact() {
    const todayFormatted = getTodayDateFormatted();
    const factElement = document.getElementById('dailyFactText');

    if (dailyFacts[todayFormatted]) {
        factElement.textContent = dailyFacts[todayFormatted];
    } else {
        const today = new Date();
        const targetDateObj = new Date(targetDate);
        targetDateObj.setHours(0, 0, 0, 0);

        if (today.getTime() > targetDateObj.getTime()) {
            factElement.textContent = "L'événement est passé ! Reviens pour le prochain compte à rebours !";
        } else {
            factElement.textContent = "Aucun fait du jour disponible pour cette date... encore ! Ajoutez un fait pour cette date !";
        }
    }
}

function updateFunStat() {
    const funStatElement = document.getElementById('funStatText');
    const randomIndex = Math.floor(Math.random() * funStats.length);
    funStatElement.textContent = funStats[randomIndex];
}

// --- Mini-jeu devinette ---
let secretNumber = Math.floor(Math.random() * 10) + 1;
function checkGuess() {
    const guessInput = document.getElementById('guessInput');
    const guess = parseInt(guessInput.value, 10);
    const result = document.getElementById('guessResult');

    if (isNaN(guess) || guess < 1 || guess > 10) {
        result.textContent = "Veuillez entrer un nombre valide entre 1 et 10.";
        result.style.color = 'orange';
    } else if (guess === secretNumber) {
        result.textContent = "🥳 Bravo ! Tu as trouvé ! Le nombre était " + secretNumber + ".";
        result.style.color = 'var(--primary-color)';
        secretNumber = Math.floor(Math.random() * 10) + 1; // Nouveau nombre
        guessInput.value = ''; // Réinitialiser l'input
    } else {
        result.textContent = `😕 Raté, ${guess < secretNumber ? 'trop petit' : 'trop grand'} ! Essaie encore.`;
        result.style.color = '#D32F2F'; // Rouge pour l'erreur
    }
    guessInput.focus(); // Garde le focus sur l'input
}

// --- Initialisation après chargement du DOM ---
let countdownInterval; // Déclaré ici pour que updateCountdown puisse le clearInterval

document.addEventListener('DOMContentLoaded', function() {
    // Appels initiaux
    updateCountdown();
    updateTimes();
    updateTimeIcons();
    updateProgressBar();
    updateMessages();
    updateDailyFact();
    updateFunStat();

    // Intervalles de mise à jour
    countdownInterval = setInterval(updateCountdown, 1000); // Assigner l'intervalle ici
    setInterval(updateTimes, 1000);
    setInterval(updateProgressBar, 1000);
    setInterval(updateMessages, 60 * 1000); // Messages mis à jour toutes les minutes
    setInterval(updateTimeIcons, 5 * 60 * 1000); // Toutes les 5 minutes

    // La statistique amusante peut être mise à jour plus fréquemment si vous voulez
    // setInterval(updateFunStat, 15 * 1000);
});

// Rend la fonction checkGuess accessible globalement pour le bouton HTML
window.checkGuess = checkGuess;