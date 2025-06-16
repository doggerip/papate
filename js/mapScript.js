// mapScript.js

// Coordonnées des aéroports clés (manuel pour éviter une API supplémentaire)
const airportCoordinates = {
    'LFRS': { lat: 47.1593, lon: -1.6108, name: 'Aéroport Nantes Atlantique' }, // Nantes
    'CYUL': { lat: 45.4706, lon: -73.7408, name: 'Aéroport Montréal-Trudeau' }, // Montréal
    // Ajoutez d'autres aéroports ICAO et leurs coordonnées ici si nécessaire
};

document.addEventListener('DOMContentLoaded', () => {
    console.log("mapScript.js: DOMContentLoaded - Script démarré.");
    // Récupérer les paramètres de l'URL
    const params = new URLSearchParams(window.location.search);
    const flightType = params.get('type');
    const icao24 = params.get('icao24');
    const callsign = decodeURIComponent(params.get('callsign') || 'N/A'); // Décode l'indicatif d'appel

    console.log("mapScript.js: URL Params - flightType:", flightType, "icao24:", icao24, "callsign:", callsign);

    // Récupérer les éléments HTML pour afficher les informations
    const flightTitleEl = document.getElementById('flight-title');
    const infoCallsignEl = document.getElementById('info-callsign');
    const infoIcao24El = document.getElementById('info-icao24');
    const infoDetailsEl = document.getElementById('info-details');

    infoCallsignEl.textContent = callsign;
    infoIcao24El.textContent = icao24;

    // Initialiser la carte Leaflet
    let map = L.map('map'); // Initialise la carte sans vue par défaut

    // Ajouter la couche de tuiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    let marker; // Déclarer le marqueur de l'avion
    const aircraftIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/267/267597.png', // Icône générique d'avion
        iconSize: [38, 38], // Taille de l'icône
        iconAnchor: [19, 19], // Point de l'icône correspondant à l'emplacement du marqueur
        popupAnchor: [0, -20] // Point d'où le popup doit s'ouvrir par rapport à l'icône
    });

    let liveUpdateInterval; // Pour stocker l'ID de l'intervalle de mise à jour

    // Fonction pour récupérer et mettre à jour la position de l'avion en direct
    async function updateLiveAircraftPosition() {
        console.log("mapScript.js: Début de updateLiveAircraftPosition pour ICAO24:", icao24);
        if (!icao24 || icao24 === 'N/A') { // Ajoutez la vérification 'N/A'
            infoDetailsEl.innerHTML = "<strong>Erreur:</strong> ICAO24 non disponible pour la mise à jour en direct.";
            console.error("mapScript.js: ICAO24 est vide ou 'N/A' dans updateLiveAircraftPosition.");
            clearInterval(liveUpdateInterval);
            return;
        }

        try {
            const url = `https://opensky-network.org/api/states/all?icao24=${icao24}`;
            console.log("mapScript.js: Requête API lancée vers:", url);
            const response = await fetch(url);
            console.log("mapScript.js: Réponse API reçue, statut:", response.status);

            if (!response.ok) {
                if (response.status === 429) {
                    infoDetailsEl.innerHTML = `<strong>Attention: Limite d'API atteinte (OpenSky).</strong> La mise à jour en direct est temporairement suspendue. Veuillez patienter et réessayer plus tard.`;
                } else {
                    infoDetailsEl.innerHTML = `<strong>Erreur:</strong> Impossible de récupérer les données de vol. Statut HTTP: ${response.status}.`;
                }
                console.error(`mapScript.js: Erreur HTTP lors de la récupération des données pour ${icao24}: ${response.status}`);
                // Ne pas arrêter l'intervalle ici, il peut se rétablir
                return;
            }

            const data = await response.json();
            console.log("mapScript.js: Données API JSON reçues:", data);

            if (data && data.states && data.states.length > 0) {
                const flight = data.states[0]; // Prend le premier état pour cet ICAO24
                const newLat = flight[6]; // Latitude
                const newLon = flight[5]; // Longitude
                const altitudeM = flight[7]; // Altitude en mètres
                const velocityMps = flight[9]; // Vitesse en m/s
                const onGround = flight[8]; // Au sol ou en vol

                console.log("mapScript.js: Vol trouvé. Lat:", newLat, "Lon:", newLon, "On Ground:", onGround);

                if (newLat !== null && newLon !== null) {
                    const statusText = onGround ? 'Au sol' : 'En vol';
                    const altitudeFeet = altitudeM !== null ? (altitudeM * 3.28084).toFixed(0) : 'N/A';
                    const velocityKmh = velocityMps !== null ? (velocityMps * 3.6).toFixed(0) : 'N/A';

                    if (!marker) {
                        // Si le marqueur n'existe pas, créez-le
                        marker = L.marker([newLat, newLon], {icon: aircraftIcon}).addTo(map);
                        map.setView([newLat, newLon], 10); // Centrer la carte lors de la première apparition
                    } else {
                        // Sinon, mettez à jour sa position
                        marker.setLatLng([newLat, newLon]);
                        // Optionnel: ajuster le centre de la carte pour suivre l'avion si désiré
                        // map.panTo([newLat, newLon]);
                    }
                    marker.bindPopup(`<b>${callsign}</b><br>Lat: ${newLat.toFixed(2)}, Lon: ${newLon.toFixed(2)}<br>Alt: ${altitudeFeet} ft (${altitudeM ? altitudeM.toFixed(0) : 'N/A'} m)<br>Vitesse: ${velocityKmh} km/h<br>Statut: ${statusText}`).openPopup();
                    infoDetailsEl.innerHTML = `<strong>Statut:</strong> ${statusText}<br><strong>Dernière mise à jour:</strong> ${new Date().toLocaleTimeString('fr-FR')}<br><strong>Altitude:</strong> ${altitudeFeet} ft<br><strong>Vitesse:</strong> ${velocityKmh} km/h`;
                } else {
                    // Coordonnées non disponibles même si l'avion est trouvé
                    infoDetailsEl.innerHTML = `<strong>Information:</strong> Vol ${callsign} (ICAO24: ${icao24}) trouvé, mais les coordonnées ne sont pas disponibles (peut-être au sol ou hors de portée ADS-B).`;
                    if (marker) {
                        map.removeLayer(marker); // Supprimer le marqueur si les coords disparaissent
                        marker = null;
                    }
                    // Ne pas arrêter l'intervalle, les coordonnées peuvent réapparaître
                }
            } else {
                // Aucun état trouvé pour cet ICAO24
                infoDetailsEl.innerHTML = `<strong>Information:</strong> Vol ${callsign} (ICAO24: ${icao24}) non trouvé en direct ou plus en ligne. Mise à jour arrêtée.`;
                console.log("mapScript.js: Vol non trouvé par l'API pour ICAO24:", icao24);
                if (marker) {
                    map.removeLayer(marker); // Supprimer le marqueur s'il était là
                    marker = null;
                }
                clearInterval(liveUpdateInterval); // Arrête la mise à jour si l'avion n'est plus vu
            }
        } catch (error) {
            console.error("mapScript.js: Erreur inattendue lors de la récupération de la position de l'avion en direct:", error);
            infoDetailsEl.innerHTML = `<strong>Erreur critique:</strong> Problème de réseau ou de l'API: ${error.message}.`;
            clearInterval(liveUpdateInterval); // Arrête la mise à jour en cas d'erreur grave
        }
    }


    // --- Début de la logique principale de chargement de la carte ---
    let initialMapViewSet = false; // Drapeau pour s'assurer que la vue de la carte est définie une seule fois

    if (flightType === 'live') {
        const initialLat = parseFloat(params.get('lat'));
        const initialLon = parseFloat(params.get('lon'));

        // Initialisation de la carte avec une vue par défaut au cas où les coordonnées initiales manquent
        map.setView([40, 0], 2); // Vue globale par défaut
        initialMapViewSet = true;

        if (!isNaN(initialLat) && !isNaN(initialLon)) {
            // Crée le marqueur initial avec les coordonnées passées par l'URL
            marker = L.marker([initialLat, initialLon], {icon: aircraftIcon}).addTo(map);
            marker.bindPopup(`<b>${callsign}</b><br>Lat: ${initialLat.toFixed(2)}, Lon: ${initialLon.toFixed(2)}<br>Position initiale`).openPopup();
            map.setView([initialLat, initialLon], 10);
            infoDetailsEl.innerHTML = `<strong>Type de vol:</strong> En direct.<br><strong>Première position connue.</strong> Début de la mise à jour...`;

            // Démarrer la mise à jour en direct toutes les 10 secondes (ajustez si besoin, mais attention aux limites API)
            liveUpdateInterval = setInterval(updateLiveAircraftPosition, 10000); // 10 secondes
            updateLiveAircraftPosition(); // Exécuter une fois immédiatement pour afficher les données
        } else {
            infoDetailsEl.innerHTML = "<strong>Erreur:</strong> Coordonnées initiales non disponibles pour ce vol en direct. Tentative de recherche en cours...";
            console.warn("mapScript.js: Coordonnées initiales non valides. Démarrage de la mise à jour en direct sans position initiale.");
            // Si les coordonnées initiales sont manquantes, on tente quand même la première mise à jour
            liveUpdateInterval = setInterval(updateLiveAircraftPosition, 10000);
            updateLiveAircraftPosition();
        }
    } else if (flightType === 'historical') {
        console.log("mapScript.js: Traitement du vol historique.");
        const depIcao = params.get('depIcao');
        const arrIcao = params.get('arrIcao');
        let markers = [];
        let detailsHtml = `<strong>Type de vol:</strong> Historique (pas de mise à jour en direct).`;

        if (depIcao && airportCoordinates[depIcao]) {
            const depCoord = airportCoordinates[depIcao];
            L.marker([depCoord.lat, depCoord.lon]).addTo(map)
                .bindPopup(`<b>Départ: ${depCoord.name}</b> (${depIcao})`).openPopup();
            markers.push([depCoord.lat, depCoord.lon]);
            detailsHtml += `<br><strong>De:</strong> ${depCoord.name} (${depIcao})`;
        } else {
            detailsHtml += `<br><strong>Aéroport de départ ICAO:</strong> ${depIcao || 'N/A'}`;
        }

        if (arrIcao && airportCoordinates[arrIcao]) {
            const arrCoord = airportCoordinates[arrIcao];
            L.marker([arrCoord.lat, arrCoord.lon]).addTo(map)
                .bindPopup(`<b>Arrivée: ${arrCoord.name}</b> (${arrIcao})`).openPopup();
            markers.push([arrCoord.lat, arrCoord.lon]);
            detailsHtml += `<br>À: ${arrCoord.name} (${arrIcao})`;
        } else {
            detailsHtml += `<br><strong>Aéroport d'arrivée ICAO:</strong> ${arrIcao || 'N/A'}`;
        }

        infoDetailsEl.innerHTML = detailsHtml;

        if (markers.length > 0) {
            // Ajuster la carte pour afficher tous les marqueurs (départ et arrivée)
            const bounds = L.latLngBounds(markers);
            map.fitBounds(bounds, { padding: [50, 50] }); // Ajouter un peu de marge
            initialMapViewSet = true;

            // Dessiner une ligne si les deux points existent
            if (markers.length === 2) {
                L.polyline(markers, {color: 'blue'}).addTo(map);
            }
        } else {
            map.setView([40, 0], 2); // Vue globale par défaut si aucun aéroport n'est valide
            initialMapViewSet = true;
        }
    }

    // Ce bloc est désormais moins critique si les conditions live/historical définissent toujours la vue
    if (!initialMapViewSet) {
        map.setView([40, 0], 2); // Vue de secours finale
        infoDetailsEl.innerHTML = "Aucune donnée de localisation initiale ou historique disponible pour ce vol.";
    }

    // Gérer la fermeture de la page pour arrêter l'intervalle
    window.addEventListener('beforeunload', () => {
        if (liveUpdateInterval) {
            clearInterval(liveUpdateInterval);
            console.log("mapScript.js: Live update interval cleared.");
        }
    });
});