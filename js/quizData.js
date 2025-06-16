// quizData.js

const quizQuestions = [
    {
        "date": "2025-06-16",
        "question": "Quel événement célèbre la vie et l'œuvre de James Joyce le 16 juin ?",
        "correctAnswer": "Bloomsday",
        "options": ["Joyce Day", "Dublin Festival", "Bloomsday"]
    },
    {
        "date": "2025-06-17",
        "question": "Quelle célèbre statue est arrivée à New York le 17 juin 1885 ?",
        "correctAnswer": "La Statue de la Liberté",
        "options": ["La Statue de la Liberté", "Le Christ Rédempteur", "La Vénus de Milo"]
    },
    {
        "date": "2025-06-18",
        "question": "Qui a été définitivement vaincu à la bataille de Waterloo le 18 juin 1815 ?",
        "correctAnswer": "Napoléon Bonaparte",
        "options": ["George Washington", "Napoléon Bonaparte", "Jules César"]
    },
    {
        "date": "2025-06-19",
        "question": "Quel événement de libération des esclaves est célébré le 19 juin aux États-Unis ?",
        "correctAnswer": "Juneteenth",
        "options": ["Emancipation Day", "Freedom Day", "Juneteenth"]
    },
    {
        "date": "2025-06-20",
        "question": "Quelle journée mondiale est célébrée le 20 juin ?",
        "correctAnswer": "Journée Mondiale des Réfugiés",
        "options": ["Journée de la Paix", "Journée Mondiale des Réfugiés", "Journée de l'Environnement"]
    },
    {
        "date": "2025-06-21",
        "question": "Outre le solstice d'été, quelle fête musicale est célébrée le 21 juin ?",
        "correctAnswer": "Fête de la Musique",
        "options": ["Fête du Solstice", "Fête de la Danse", "Fête de la Musique"]
    },
    {
        "date": "2025-06-22",
        "question": "Quelle opération militaire majeure a commencé le 22 juin 1941, avec l'invasion de l'URSS ?",
        "correctAnswer": "Opération Barbarossa",
        "options": ["Opération Overlord", "Opération Barbarossa", "Opération Desert Storm"]
    },
    {
        "date": "2025-06-23",
        "question": "Quelle organisation internationale a été fondée à Paris le 23 juin 1894 ?",
        "correctAnswer": "Comité International Olympique",
        "options": ["Nations Unies", "Comité International Olympique", "Croix-Rouge"]
    },
    {
        "date": "2025-06-24",
        "question": "Quelle fête nationale est célébrée au Québec le 24 juin ?",
        "correctAnswer": "Saint-Jean-Baptiste",
        "options": ["Canada Day", "Saint-Jean-Baptiste", "Journée des Patriotes"]
    },
    {
        "date": "2025-06-25",
        "question": "Quel conflit a débuté le 25 juin 1950, durant la Guerre Froide ?",
        "correctAnswer": "La Guerre de Corée",
        "options": ["La Guerre du Vietnam", "La Guerre de Corée", "La Guerre du Golfe"]
    },
    {
        "date": "2025-06-26",
        "question": "Quelle charte importante a été signée le 26 juin 1945, créant l'ONU ?",
        "correctAnswer": "Charte des Nations Unies",
        "options": ["Charte de l'Atlantique", "Charte des Nations Unies", "Déclaration universelle des droits de l'homme"]
    },
    {
        "date": "2025-06-27",
        "question": "Quel brevet a été accordé le 27 juin 1893 à Whitcomb L. Judson ?",
        "correctAnswer": "La fermeture éclair",
        "options": ["L'ampoule électrique", "La fermeture éclair", "Le téléphone"]
    },
    {
        "date": "2025-06-28",
        "question": "Quel événement tragique a déclenché la Première Guerre mondiale le 28 juin 1914 ?",
        "correctAnswer": "L'assassinat de l'Archiduc François-Ferdinand",
        "options": ["La déclaration de guerre de l'Allemagne", "L'assassinat de l'Archiduc François-Ferdinand", "Le bombardement de Pearl Harbor"]
    },
    {
        "date": "2025-06-29",
        "question": "Quel produit révolutionnaire a été commercialisé pour la première fois le 29 juin 2007 ?",
        "correctAnswer": "Le premier iPhone",
        "options": ["Le premier iPad", "Le premier iPhone", "Le premier iPod"]
    },
    {
        "date": "2025-06-30",
        "question": "Quelle explosion massive d'origine inconnue a dévasté une région de Sibérie le 30 juin 1908 ?",
        "correctAnswer": "L'événement de la Toungouska",
        "options": ["L'explosion de Tchernobyl", "L'événement de la Toungouska", "L'éruption du Mont Saint Helens"]
    },

    {
        "date": "2025-07-01",
        "question": "Quelle fête nationale est célébrée au Canada le 1er juillet ?",
        "correctAnswer": "Fête du Canada",
        "options": ["Thanksgiving", "Fête de la Reine", "Fête du Canada"]
    },
    {
        "date": "2025-07-02",
        "question": "Quel supermarché a ouvert ses portes pour la première fois le 2 juillet 1962 ?",
        "correctAnswer": "Walmart",
        "options": ["Target", "Kroger", "Walmart"]
    },
    {
        "date": "2025-07-03",
        "question": "Quel pays a proclamé son indépendance de la France le 3 juillet 1962 ?",
        "correctAnswer": "L'Algérie",
        "options": ["Le Maroc", "La Tunisie", "L'Algérie"]
    },
    {
        "date": "2025-07-04",
        "question": "Quel jour est l'Independence Day aux États-Unis ?",
        "correctAnswer": "Le 4 juillet",
        "options": ["Le 14 juillet", "Le 4 juillet", "Le 17 septembre"]
    },
    {
        "date": "2025-07-05",
        "question": "Quel maillot de bain jugé scandaleux a été présenté à Paris le 5 juillet 1946 ?",
        "correctAnswer": "Le bikini",
        "options": ["Le monokini", "Le bikini", "Le trikini"]
    },
    {
        "date": "2025-07-06",
        "question": "Quels célèbres musiciens se sont rencontrés pour la première fois le 6 juillet 1957 ?",
        "correctAnswer": "John Lennon et Paul McCartney",
        "options": ["Mick Jagger et Keith Richards", "Elvis Presley et Johnny Cash", "John Lennon et Paul McCartney"]
    },
    {
        "date": "2025-07-07",
        "question": "Quelles nouvelles merveilles ont été annoncées le 7 juillet 2007, suite à un vote mondial ?",
        "correctAnswer": "Les Nouvelles Sept Merveilles du Monde",
        "options": ["Les Sept Merveilles du Monde Antique", "Les Sept Merveilles de l'Ingénierie", "Les Nouvelles Sept Merveilles du Monde"]
    },
    {
        "date": "2025-07-08",
        "question": "Quel célèbre journal financier a été publié pour la première fois le 8 juillet 1889 ?",
        "correctAnswer": "Le Wall Street Journal",
        "options": ["Le New York Times", "Le Financial Times", "Le Wall Street Journal"]
    },
    {
        "date": "2025-07-09",
        "question": "Quel pays a déclaré son indépendance de l'Espagne le 9 juillet 1816 ?",
        "correctAnswer": "L'Argentine",
        "options": ["Le Chili", "Le Pérou", "L'Argentine"]
    },
    {
        "date": "2025-07-10",
        "question": "Quel navire de Greenpeace a été coulé par les services secrets français le 10 juillet 1985 ?",
        "correctAnswer": "Le Rainbow Warrior",
        "options": ["Le Sea Shepherd", "Le Greenpeace II", "Le Rainbow Warrior"]
    },
    {
        "date": "2025-07-11",
        "question": "Quel jour, en 1987, la population mondiale a-t-elle atteint 5 milliards d'habitants ?",
        "correctAnswer": "Jour des Cinq Milliards",
        "options": ["Jour de la Population", "Jour des Cinq Milliards", "Jour de la Croissance Démographique"]
    },
    {
        "date": "2025-07-12",
        "question": "Quelle équipe nationale de football a remporté la Coupe du Monde à domicile le 12 juillet 1998 ?",
        "correctAnswer": "L'équipe de France",
        "options": ["L'équipe du Brésil", "L'équipe d'Allemagne", "L'équipe de France"]
    },
    {
        "date": "2025-07-13",
        "question": "Quelle compétition sportive majeure a été lancée le 13 juillet 1930 en Uruguay ?",
        "correctAnswer": "La première Coupe du Monde de football",
        "options": ["Les Jeux Olympiques modernes", "La première Coupe du Monde de football", "Le Tour de France cycliste"]
    },
    {
        "date": "2025-07-14",
        "question": "Quel événement commémore la Fête Nationale française le 14 juillet ?",
        "correctAnswer": "La prise de la Bastille",
        "options": ["La Révolution Française", "La prise de la Bastille", "La proclamation de la République"]
    },
    {
        "date": "2025-07-15",
        "question": "Quelle ville a été prise par les croisés le 15 juillet 1099, lors de la Première Croisade ?",
        "correctAnswer": "Jérusalem",
        "options": ["Rome", "Constantinople", "Jérusalem"]
    },
    {
        "date": "2025-07-16",
        "question": "Quelle mission spatiale emblématique a décollé le 16 juillet 1969, en route vers la Lune ?",
        "correctAnswer": "Apollo 11",
        "options": ["Soyouz 1", "Gemini 8", "Apollo 11"]
    },
    {
        "date": "2025-07-17",
        "question": "Quelle conférence alliée a débuté le 17 juillet 1945 pour discuter de l'après-guerre ?",
        "correctAnswer": "La Conférence de Potsdam",
        "options": ["La Conférence de Yalta", "La Conférence de Téhéran", "La Conférence de Potsdam"]
    },
    {
        "date": "2025-07-18",
        "question": "Quel leader sud-africain, né le 18 juillet 1918, a donné son nom au Mandela Day ?",
        "correctAnswer": "Nelson Mandela",
        "options": ["Desmond Tutu", "Nelson Mandela", "Oliver Tambo"]
    },
    {
        "date": "2025-07-19",
        "question": "Où a eu lieu la première convention pour les droits des femmes aux États-Unis le 19 juillet 1848 ?",
        "correctAnswer": "Seneca Falls",
        "options": ["New York City", "Washington D.C.", "Seneca Falls"]
    },
    {
        "date": "2025-07-20",
        "question": "Qui est devenu le premier homme à marcher sur la Lune le 20 juillet 1969 ?",
        "correctAnswer": "Neil Armstrong",
        "options": ["Buzz Aldrin", "Neil Armstrong", "Michael Collins"]
    },
    {
        "date": "2025-07-21",
        "question": "Quel conte célèbre a été publié pour la première fois le 21 juillet 1845 par Hans Christian Andersen ?",
        "correctAnswer": "La Reine des Neiges",
        "options": ["La Petite Sirène", "Le Vilain Petit Canard", "La Reine des Neiges"]
    },
    {
        "date": "2025-07-22",
        "question": "Quel pilote a achevé le premier vol solo autour du monde le 22 juillet 1933 ?",
        "correctAnswer": "Wiley Post",
        "options": ["Charles Lindbergh", "Amelia Earhart", "Wiley Post"]
    },
    {
        "date": "2025-07-23",
        "question": "Quel brevet important a été publié le 23 juillet 1829 par William Burt ?",
        "correctAnswer": "La machine à écrire",
        "options": ["La locomotive à vapeur", "Le télégraphe", "La machine à écrire"]
    },
    {
        "date": "2025-07-24",
        "question": "Quelle mission spatiale a amerrit avec succès le 24 juillet 1969, ramenant les astronautes de la Lune ?",
        "correctAnswer": "Apollo 11",
        "options": ["Apollo 8", "Apollo 13", "Apollo 11"]
    },
    {
        "date": "2025-07-25",
        "question": "Quel événement marquant dans l'histoire de la médecine a eu lieu le 25 juillet 1978 ?",
        "correctAnswer": "Naissance du premier 'bébé-éprouvette'",
        "options": ["Première transplantation cardiaque", "Découverte de la pénicilline", "Naissance du premier 'bébé-éprouvette'"]
    },
    {
        "date": "2025-07-26",
        "question": "Quel leader a mené l'attaque sur la caserne de Moncada le 26 juillet 1953, début de la Révolution cubaine ?",
        "correctAnswer": "Fidel Castro",
        "options": ["Che Guevara", "Fidel Castro", "Raúl Castro"]
    },
    {
        "date": "2025-07-27",
        "question": "Quel armistice a été signé le 27 juillet 1953, mettant fin aux combats de la Guerre de Corée ?",
        "correctAnswer": "L'armistice de Panmunjeom",
        "options": ["L'armistice de Versailles", "L'armistice de Panmunjeom", "L'armistice de Compiègne"]
    },
    {
        "date": "2025-07-28",
        "question": "Quelle déclaration de guerre, le 28 juillet 1914, a marqué le début officiel de la Première Guerre mondiale ?",
        "correctAnswer": "Autriche-Hongrie à la Serbie",
        "options": ["Allemagne à la France", "Autriche-Hongrie à la Serbie", "Royaume-Uni à l'Allemagne"]
    },
    {
        "date": "2025-07-29",
        "question": "Quel mariage royal célèbre a eu lieu le 29 juillet 1981 à Londres ?",
        "correctAnswer": "Prince Charles et Lady Diana",
        "options": ["Prince William et Kate Middleton", "Prince Harry et Meghan Markle", "Prince Charles et Lady Diana"]
    },
    {
        "date": "2025-07-30",
        "question": "Quel pays a remporté la première Coupe du Monde de football le 30 juillet 1930 ?",
        "correctAnswer": "L'Uruguay",
        "options": ["Le Brésil", "L'Argentine", "L'Uruguay"]
    },
    {
        "date": "2025-07-31",
        "question": "Quelle mission spatiale est retournée sur Terre le 31 juillet 1969 après son voyage historique sur la Lune ?",
        "correctAnswer": "Apollo 11",
        "options": ["Apollo 10", "Apollo 11", "Apollo 12"]
    },

    {
        "date": "2025-08-01",
        "question": "Quel pays a déclaré la guerre à la Russie le 1er août 1914, marquant une escalade de la Première Guerre mondiale ?",
        "correctAnswer": "L'Allemagne",
        "options": ["La France", "L'Autriche-Hongrie", "L'Allemagne"]
    },
    {
        "date": "2025-08-02",
        "question": "Qui est devenu Führer et chancelier de l'Allemagne le 2 août 1934 ?",
        "correctAnswer": "Adolf Hitler",
        "options": ["Benito Mussolini", "Adolf Hitler", "Joseph Staline"]
    },
    {
        "date": "2025-08-03",
        "question": "Quel explorateur a quitté l'Espagne le 3 août 1492 pour son premier voyage vers les Amériques ?",
        "correctAnswer": "Christophe Colomb",
        "options": ["Vasco de Gama", "Fernand de Magellan", "Christophe Colomb"]
    },
    {
        "date": "2025-08-04",
        "question": "Quel pays a déclaré la guerre à l'Allemagne le 4 août 1914, s'engageant dans la Première Guerre mondiale ?",
        "correctAnswer": "Le Royaume-Uni",
        "options": ["Les États-Unis", "Le Royaume-Uni", "L'Italie"]
    },
    {
        "date": "2025-08-05",
        "question": "Quelle icône hollywoodienne est décédée le 5 août 1962 ?",
        "correctAnswer": "Marilyn Monroe",
        "options": ["Audrey Hepburn", "Grace Kelly", "Marilyn Monroe"]
    },
    {
        "date": "2025-08-06",
        "question": "Quelle ville japonaise a subi le largage de la première bombe atomique le 6 août 1945 ?",
        "correctAnswer": "Hiroshima",
        "options": ["Nagasaki", "Tokyo", "Hiroshima"]
    },
    {
        "date": "2025-08-07",
        "question": "Quels événements ont eu lieu le 7 août 1998, tuant plus de 200 personnes dans des ambassades américaines ?",
        "correctAnswer": "Attentats à la bombe en Tanzanie et au Kenya",
        "options": ["Attentats du 11 Septembre", "Attentats à la bombe en Tanzanie et au Kenya", "Attentats de Londres"]
    },
    {
        "date": "2025-08-08",
        "question": "Quel président américain a annoncé sa démission le 8 août 1974 suite au scandale du Watergate ?",
        "correctAnswer": "Richard Nixon",
        "options": ["John F. Kennedy", "Lyndon B. Johnson", "Richard Nixon"]
    },
    {
        "date": "2025-08-09",
        "question": "Quelle ville japonaise a subi le largage de la deuxième bombe atomique le 9 août 1945 ?",
        "correctAnswer": "Nagasaki",
        "options": ["Hiroshima", "Nagasaki", "Kyoto"]
    },
    {
        "date": "2025-08-10",
        "question": "Quelle insurrection, le 10 août 1792, a mené à la chute de la monarchie française ?",
        "correctAnswer": "L'insurrection de la Commune de Paris",
        "options": ["La prise de la Bastille", "L'insurrection de la Commune de Paris", "Le coup d'État du 18 Brumaire"]
    },
    {
        "date": "2025-08-11",
        "question": "Quelle légende du baseball a frappé son 500e home run le 11 août 1929 ?",
        "correctAnswer": "Babe Ruth",
        "options": ["Jackie Robinson", "Babe Ruth", "Lou Gehrig"]
    },
    {
        "date": "2025-08-12",
        "question": "Quel géant de l'informatique a lancé son premier ordinateur personnel (PC) le 12 août 1981 ?",
        "correctAnswer": "IBM",
        "options": ["Apple", "Microsoft", "IBM"]
    },
    {
        "date": "2025-08-13",
        "question": "Quelle construction a commencé le 13 août 1961, divisant Berlin en Est et Ouest ?",
        "correctAnswer": "Le mur de Berlin",
        "options": ["La Porte de Brandebourg", "Le Reichstag", "Le mur de Berlin"]
    },
    {
        "date": "2025-08-14",
        "question": "Quel pays a capitulé le 14 août 1945, mettant fin à la Seconde Guerre mondiale ?",
        "correctAnswer": "Le Japon",
        "options": ["L'Allemagne", "L'Italie", "Le Japon"]
    },
    {
        "date": "2025-08-15",
        "question": "Quelle fête religieuse importante est célébrée le 15 août en France ?",
        "correctAnswer": "L'Assomption",
        "options": ["La Toussaint", "Noël", "L'Assomption"]
    },
    {
        "date": "2025-08-16",
        "question": "Quel 'Roi du Rock and Roll' est décédé le 16 août 1977 ?",
        "correctAnswer": "Elvis Presley",
        "options": ["Johnny Cash", "Chuck Berry", "Elvis Presley"]
    },
    {
        "date": "2025-08-17",
        "question": "Quel support audio a été produit pour la première fois en Allemagne le 17 août 1982 ?",
        "correctAnswer": "Le premier CD audio",
        "options": ["Le premier vinyle", "Le premier CD audio", "La première cassette audio"]
    },
    {
        "date": "2025-08-18",
        "question": "Quel amendement de la Constitution américaine, ratifié le 18 août 1920, a donné le droit de vote aux femmes ?",
        "correctAnswer": "Le 19e amendement",
        "options": ["Le 13e amendement", "Le 19e amendement", "Le 26e amendement"]
    },
    {
        "date": "2025-08-19",
        "question": "Quel engin a réalisé son premier vol le 19 août 1909 en Allemagne ?",
        "correctAnswer": "Le dirigeable Zeppelin",
        "options": ["L'avion des frères Wright", "Le dirigeable Zeppelin", "La fusée V-2"]
    },
    {
        "date": "2025-08-20",
        "question": "Quel événement, le 20 août 1968, a vu l'Union Soviétique envahir la Tchécoslovaquie ?",
        "correctAnswer": "Le Printemps de Prague",
        "options": ["La Révolution de Velours", "Le Printemps de Prague", "La Dissolution du Pacte de Varsovie"]
    },
    {
        "date": "2025-08-21",
        "question": "Quelle célèbre œuvre d'art a été volée du Louvre le 21 août 1911 ?",
        "correctAnswer": "La Joconde",
        "options": ["La Vénus de Milo", "La Joconde", "Le Radeau de la Méduse"]
    },
    {
        "date": "2025-08-22",
        "question": "Quelle bataille, le 22 août 1485, a marqué la fin de la Guerre des Deux-Roses en Angleterre ?",
        "correctAnswer": "La Bataille de Bosworth Field",
        "options": ["La Bataille d'Azincourt", "La Bataille de Hastings", "La Bataille de Bosworth Field"]
    },
    {
        "date": "2025-08-23",
        "question": "Quelle journée internationale est célébrée le 23 août en lien avec la traite négrière ?",
        "correctAnswer": "Journée internationale du souvenir de la traite négrière et de son abolition",
        "options": ["Journée de la liberté", "Journée internationale des droits de l'homme", "Journée internationale du souvenir de la traite négrière et de son abolition"]
    },
    {
        "date": "2025-08-24",
        "question": "Quelle éruption volcanique, le 24 août 79 après J.-C., a enseveli Pompéi et Herculanum ?",
        "correctAnswer": "L'éruption du Vésuve",
        "options": ["L'éruption du Krakatoa", "L'éruption du Vésuve", "L'éruption du Mont Saint Helens"]
    },
    {
        "date": "2025-08-25",
        "question": "Quelle ville a été libérée de l'occupation allemande le 25 août 1944 pendant la Seconde Guerre mondiale ?",
        "correctAnswer": "Paris",
        "options": ["Londres", "Berlin", "Paris"]
    },
    {
        "date": "2025-08-26",
        "question": "Quelle déclaration fondamentale a été adoptée en France le 26 août 1789 ?",
        "correctAnswer": "La Déclaration des Droits de l'Homme et du Citoyen",
        "options": ["La Magna Carta", "La Déclaration d'Indépendance des États-Unis", "La Déclaration des Droits de l'Homme et du Citoyen"]
    },
    {
        "date": "2025-08-27",
        "question": "Quelle éruption volcanique majeure, le 27 août 1883, a provoqué un raz-de-marée dévastateur ?",
        "correctAnswer": "L'éruption du Krakatoa",
        "options": ["L'éruption du Mont Fuji", "L'éruption du Krakatoa", "L'éruption du Stromboli"]
    },
    {
        "date": "2025-08-28",
        "question": "Quel célèbre discours 'I Have a Dream' a été prononcé le 28 août 1963 par Martin Luther King Jr. ?",
        "correctAnswer": "À Washington D.C.",
        "options": ["À New York City", "À Washington D.C.", "À Atlanta"]
    },
    {
        "date": "2025-08-29",
        "question": "Quelle entreprise de streaming, fondée le 29 août 1997, a révolutionné le divertissement ?",
        "correctAnswer": "Netflix",
        "options": ["Blockbuster", "Hulu", "Netflix"]
    },
    {
        "date": "2025-08-30",
        "question": "Quel pays a déclaré son indépendance de l'Union Soviétique le 30 août 1991 ?",
        "correctAnswer": "L'Azerbaïdjan",
        "options": ["L'Ukraine", "La Lituanie", "L'Azerbaïdjan"]
    },
    {
        "date": "2025-08-31",
        "question": "Qui est décédée tragiquement le 31 août 1997 dans un accident de voiture à Paris ?",
        "correctAnswer": "Lady Diana",
        "options": ["Mère Teresa", "Jacqueline Kennedy Onassis", "Lady Diana"]
    },

    {
        "date": "2025-09-01",
        "question": "Quel événement, le 1er septembre 1939, a déclenché la Seconde Guerre mondiale ?",
        "correctAnswer": "L'invasion de la Pologne par l'Allemagne nazie",
        "options": ["L'invasion de la Pologne par l'Allemagne nazie", "L'attaque de Pearl Harbor", "L'annexion de l'Autriche"]
    },
    {
        "date": "2025-09-02",
        "question": "Quel pays a signé les actes de capitulation le 2 septembre 1945, mettant fin à la Seconde Guerre mondiale ?",
        "correctAnswer": "Le Japon",
        "options": ["L'Allemagne", "L'Italie", "Le Japon"]
    },
    {
        "date": "2025-09-03",
        "question": "Quel traité, signé le 3 septembre 1783, a reconnu l'indépendance des États-Unis ?",
        "correctAnswer": "Le traité de Paris",
        "options": ["Le traité de Versailles", "Le traité de Londres", "Le traité de Paris"]
    },
    {
        "date": "2025-09-04",
        "question": "Quel inventeur a reçu un brevet pour son appareil photo à pellicule le 4 septembre 1888 ?",
        "correctAnswer": "George Eastman (Kodak)",
        "options": ["Thomas Edison", "Louis Daguerre", "George Eastman (Kodak)"]
    },
    {
        "date": "2025-09-05",
        "question": "Quel événement tragique a marqué les Jeux Olympiques de Munich le 5 septembre 1972 ?",
        "correctAnswer": "Une prise d'otages et un massacre",
        "options": ["Un boycott majeur", "Une controverse de dopage", "Une prise d'otages et un massacre"]
    },
    {
        "date": "2025-09-06",
        "question": "Quel président américain a été assassiné le 6 septembre 1901, menant Theodore Roosevelt à la présidence ?",
        "correctAnswer": "William McKinley",
        "options": ["Abraham Lincoln", "James Garfield", "William McKinley"]
    },
    {
        "date": "2025-09-07",
        "question": "Quel pays d'Amérique du Sud a déclaré son indépendance du Portugal le 7 septembre 1822 ?",
        "correctAnswer": "Le Brésil",
        "options": ["Le Brésil", "Le Mexique", "La Colombie"]
    },
    {
        "date": "2025-09-08",
        "question": "Quelle série télévisée de science-fiction a été diffusée pour la première fois le 8 septembre 1966 ?",
        "correctAnswer": "Star Trek",
        "options": ["Doctor Who", "The Twilight Zone", "Star Trek"]
    },
    {
        "date": "2025-09-09",
        "question": "Quel leader de la République Populaire de Chine, dont la mort fut annoncée le 9 septembre 1976, a marqué son histoire ?",
        "correctAnswer": "Mao Zedong",
        "options": ["Deng Xiaoping", "Zhou Enlai", "Mao Zedong"]
    },
    {
        "date": "2025-09-10",
        "question": "Que célèbre-t-on le 10 septembre, la date cible de votre compte à rebours ?",
        "correctAnswer": "Votre événement spécial !",
        "options": ["Votre anniversaire", "La journée mondiale du chocolat", "Votre événement spécial !"]
    }
];
const funStats = [
    "Saviez-vous que le Canada a plus de lacs que tous les autres pays du monde réunis ?",
    "La tour Eiffel peut être 15 cm plus haute en été qu'en hiver en raison de la dilatation thermique du fer.",
    "Le cœur d'une crevette est situé dans sa tête.",
    "Un nuage de la taille d'une baleine bleue peut contenir assez d'eau pour remplir environ 100 000 piscines olympiques.",
    "Le mot 'robot' vient du mot tchèque 'robota' qui signifie 'travail forcé'.",
    "Les éléphants sont les seuls animaux qui ne peuvent pas sauter.",
    "Les flamants roses obtiennent leur couleur rose en mangeant des crevettes et des algues bleues-vertes.",
    "Le miel ne se gâte jamais. On a trouvé du miel vieux de milliers d'années encore comestible.",
    "Les manchots sont les seuls oiseaux qui peuvent nager mais pas voler.",
    "Il y a plus de combinaisons possibles pour un jeu d'échecs que d'atomes dans l'univers connu."
];