// Clé pour le localStorage
const STORAGE_KEY = 'blackjack_helper_data';

// Structure de données pour le tracking
function getGameData() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        return JSON.parse(data);
    }
    
    // Données par défaut
    return {
        players: {},
        currentGame: {
            round: 1,
            maxRounds: 5,
            jokerAvailable: false,
            gameActive: false
        }
    };
}

// Sauvegarder les données
function saveGameData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Obtenir ou créer un joueur
function getPlayer(playerName) {
    const data = getGameData();
    
    if (!data.players[playerName]) {
        data.players[playerName] = {
            name: playerName,
            helpUsed: false,
            gamesPlayed: 0,
            wins: 0,
            losses: 0
        };
        saveGameData(data);
    }
    
    return data.players[playerName];
}

// Vérifier si le joueur peut utiliser l'aide
function canUseHelp(playerName) {
    const player = getPlayer(playerName);
    const data = getGameData();
    
    // Vérifier si une partie est active
    if (!data.currentGame.gameActive) {
        return {
            allowed: false,
            reason: "Aucune partie en cours. Le croupier doit démarrer une nouvelle partie."
        };
    }
    
    // Vérifier si le joueur a déjà utilisé l'aide
    if (player.helpUsed) {
        return {
            allowed: false,
            reason: `Vous avez déjà utilisé votre aide pour cette partie. Attendez la prochaine partie (Manche actuelle: ${data.currentGame.round}/${data.currentGame.maxRounds}).`
        };
    }
    
    return {
        allowed: true,
        reason: "Aide disponible ! 🎯"
    };
}

// Marquer l'aide comme utilisée
function markHelpAsUsed(playerName) {
    const data = getGameData();
    
    if (!data.players[playerName]) {
        getPlayer(playerName); // Créer le joueur s'il n'existe pas
    }
    
    data.players[playerName].helpUsed = true;
    saveGameData(data);
    
    console.log(`${playerName} a utilisé son aide pour cette partie.`);
}

// Réinitialiser l'aide pour tous les joueurs (nouvelle partie)
function resetAllHelp() {
    const data = getGameData();
    
    // Réinitialiser pour tous les joueurs
    Object.keys(data.players).forEach(playerName => {
        data.players[playerName].helpUsed = false;
    });
    
    // Réinitialiser la manche
    data.currentGame.round = 1;
    data.currentGame.gameActive = true;
    
    // Déterminer si le Joker est disponible (20% de chance)
    data.currentGame.jokerAvailable = Math.random() < 0.20;
    
    saveGameData(data);
    
    console.log('Nouvelle partie démarrée ! Aide réinitialisée pour tous les joueurs.');
    console.log('Joker disponible:', data.currentGame.jokerAvailable);
    
    return data.currentGame.jokerAvailable;
}

// Incrémenter la manche
function nextRound() {
    const data = getGameData();
    
    if (data.currentGame.round < data.currentGame.maxRounds) {
        data.currentGame.round++;
        saveGameData(data);
        console.log(`Manche ${data.currentGame.round}/${data.currentGame.maxRounds}`);
        return true;
    } else {
        console.log('Fin de la partie ! Le croupier doit démarrer une nouvelle partie.');
        data.currentGame.gameActive = false;
        saveGameData(data);
        return false;
    }
}

// Terminer la partie actuelle
function endGame() {
    const data = getGameData();
    data.currentGame.gameActive = false;
    saveGameData(data);
    console.log('Partie terminée par le croupier.');
}

// Obtenir les infos de la partie actuelle
function getCurrentGameInfo() {
    const data = getGameData();
    return {
        round: data.currentGame.round,
        maxRounds: data.currentGame.maxRounds,
        gameActive: data.currentGame.gameActive,
        jokerAvailable: data.currentGame.jokerAvailable
    };
}

// Obtenir le statut d'un joueur
function getPlayerStatus(playerName) {
    const player = getPlayer(playerName);
    const gameInfo = getCurrentGameInfo();
    
    return {
        playerName: player.name,
        helpUsed: player.helpUsed,
        gamesPlayed: player.gamesPlayed,
        currentRound: gameInfo.round,
        maxRounds: gameInfo.maxRounds,
        gameActive: gameInfo.gameActive,
        jokerAvailable: gameInfo.jokerAvailable
    };
}

// Obtenir tous les joueurs
function getAllPlayers() {
    const data = getGameData();
    return Object.values(data.players);
}

// Supprimer un joueur
function deletePlayer(playerName) {
    const data = getGameData();
    delete data.players[playerName];
    saveGameData(data);
    console.log(`Joueur ${playerName} supprimé.`);
}

// Réinitialiser toutes les données
function resetAllData() {
    localStorage.removeItem(STORAGE_KEY);
    console.log('Toutes les données ont été réinitialisées.');
}



